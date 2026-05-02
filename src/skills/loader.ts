import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import type { Skill, SkillFrontmatter } from "./types.ts";

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

export function parseSkill(
  source: string,
  path: string,
  category: string | null = null,
): Skill {
  const match = FRONTMATTER_RE.exec(source);
  if (!match) {
    throw new Error(`SKILL.md missing frontmatter: ${path}`);
  }
  const [, raw, body] = match;
  const frontmatter = parseFrontmatter(raw ?? "");
  if (!frontmatter.name || !frontmatter.description) {
    throw new Error(`SKILL.md must define 'name' and 'description': ${path}`);
  }
  return { frontmatter, body: (body ?? "").trim(), path, category };
}

export async function loadSkill(
  path: string,
  category: string | null = null,
): Promise<Skill> {
  const source = await readFile(path, "utf8");
  return parseSkill(source, path, category);
}

/**
 * Walk a skills root organized as `<root>/<category>/<name>/SKILL.md` and
 * return every skill found. Categories without SKILL.md children are ignored.
 */
export async function loadSkillsFromDir(root: string): Promise<Skill[]> {
  const abs = resolve(root);
  const skills: Skill[] = [];
  const categories = await safeReaddir(abs);
  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    const catDir = join(abs, cat.name);
    const names = await safeReaddir(catDir);
    for (const entry of names) {
      if (!entry.isDirectory()) continue;
      const skillPath = join(catDir, entry.name, "SKILL.md");
      try {
        skills.push(await loadSkill(skillPath, cat.name));
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw err;
      }
    }
  }
  return skills;
}

export function skillSlug(skill: Skill): string {
  return basename(dirname(skill.path));
}

async function safeReaddir(dir: string) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

function parseFrontmatter(raw: string): SkillFrontmatter {
  const lines = raw.split("\n");
  const out: Record<string, unknown> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (!line.trim()) {
      i++;
      continue;
    }
    const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1] as string;
    const rest = (m[2] ?? "").trim();
    if (rest === ">" || rest === ">-" || rest === "|" || rest === "|-") {
      const folded = rest.startsWith(">");
      const collected: string[] = [];
      i++;
      while (i < lines.length) {
        const next = lines[i] ?? "";
        if (next.length === 0) {
          collected.push("");
          i++;
          continue;
        }
        if (!/^\s/.test(next)) break;
        collected.push(next.replace(/^\s+/, ""));
        i++;
      }
      out[key] = folded
        ? collected.join(" ").replace(/\s+/g, " ").trim()
        : collected.join("\n").trim();
      continue;
    }
    out[key] = stripQuotes(rest);
    i++;
  }
  return out as SkillFrontmatter;
}

function stripQuotes(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}
