#!/usr/bin/env node
import { cp, mkdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSkillsFromDir, skillSlug, type Skill } from "../src/skills/index.ts";

const HELP = `k-siseup — install curated SKILL.md packs into your Claude Code project.

Usage:
  k-siseup <command> [options]

Commands:
  init                  Install all bundled skills into ./.claude/skills
  list                  List bundled skills shipped with this package
  add <slug>            Install a single skill by slug (folder name)
  update                Reinstall all bundled skills, overwriting existing

Options:
  --target <dir>        Destination directory (default: ./.claude/skills)
  --force               Overwrite existing skills without prompting
  -h, --help            Show this help
`;

interface Args {
  command: string | undefined;
  positional: string[];
  target: string;
  force: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): Args {
  const out: Args = {
    command: undefined,
    positional: [],
    target: "./.claude/skills",
    force: false,
    help: false,
  };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const tok = rest[i] ?? "";
    if (tok === "-h" || tok === "--help") {
      out.help = true;
    } else if (tok === "--force") {
      out.force = true;
    } else if (tok === "--target") {
      out.target = rest[++i] ?? out.target;
    } else if (tok.startsWith("--target=")) {
      out.target = tok.slice("--target=".length);
    } else if (out.command === undefined) {
      out.command = tok;
    } else {
      out.positional.push(tok);
    }
  }
  return out;
}

function bundleRoot(): string {
  // Resolves to <pkg>/assets/skills whether running from source
  // (installer/cli.ts) or from the built artifact (dist/cli.js).
  const here = fileURLToPath(import.meta.url);
  const pkgRoot = resolve(dirname(here), "..");
  return join(pkgRoot, "assets", "skills");
}

async function loadBundle(): Promise<Skill[]> {
  const root = bundleRoot();
  const skills = await loadSkillsFromDir(root);
  if (skills.length === 0) {
    throw new Error(`No bundled skills found at ${root}`);
  }
  return skills;
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function installSkill(
  skill: Skill,
  targetRoot: string,
  force: boolean,
): Promise<"installed" | "skipped" | "overwritten"> {
  const slug = skillSlug(skill);
  const destDir = join(targetRoot, slug);
  const sourceDir = dirname(skill.path);
  const exists = await pathExists(destDir);
  if (exists && !force) return "skipped";
  await mkdir(dirname(destDir), { recursive: true });
  await cp(sourceDir, destDir, { recursive: true, force: true });
  return exists ? "overwritten" : "installed";
}

async function cmdList(): Promise<number> {
  const skills = await loadBundle();
  const widest = Math.max(...skills.map((s) => skillSlug(s).length));
  for (const s of skills) {
    const slug = skillSlug(s).padEnd(widest);
    const cat = s.category ?? "(root)";
    process.stdout.write(`${slug}  [${cat}]  ${s.frontmatter.description}\n`);
  }
  return 0;
}

async function cmdInit(target: string, force: boolean): Promise<number> {
  const skills = await loadBundle();
  await installAll(skills, target, force);
  return 0;
}

async function cmdAdd(
  slug: string | undefined,
  target: string,
  force: boolean,
): Promise<number> {
  if (!slug) {
    process.stderr.write("add: missing skill slug\n");
    return 1;
  }
  const skills = await loadBundle();
  const found = skills.find((s) => skillSlug(s) === slug);
  if (!found) {
    process.stderr.write(
      `add: no skill with slug "${slug}". Run \`k-siseup list\`.\n`,
    );
    return 1;
  }
  await installAll([found], target, force);
  return 0;
}

async function cmdUpdate(target: string): Promise<number> {
  const skills = await loadBundle();
  await installAll(skills, target, true);
  return 0;
}

async function installAll(
  skills: Skill[],
  target: string,
  force: boolean,
): Promise<void> {
  const targetRoot = resolve(target);
  process.stdout.write(`→ target: ${targetRoot}\n`);
  for (const s of skills) {
    const result = await installSkill(s, targetRoot, force);
    const slug = skillSlug(s);
    const tag =
      result === "installed"
        ? "installed"
        : result === "overwritten"
        ? "updated"
        : "skipped (exists, use --force)";
    process.stdout.write(`  ${tag.padEnd(36)} ${slug}\n`);
  }
}

async function main(argv: string[]): Promise<number> {
  const args = parseArgs(argv);
  if (args.help || args.command === undefined || args.command === "help") {
    process.stdout.write(HELP);
    return 0;
  }
  switch (args.command) {
    case "init":
      return await cmdInit(args.target, args.force);
    case "list":
      return await cmdList();
    case "add":
      return await cmdAdd(args.positional[0], args.target, args.force);
    case "update":
      return await cmdUpdate(args.target);
    default:
      process.stderr.write(`Unknown command: ${args.command}\n${HELP}`);
      return 1;
  }
}

main(process.argv).then(
  (code) => process.exit(code),
  (err) => {
    process.stderr.write(`error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  },
);
