import { test, expect } from "bun:test";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseSkill, loadSkillsFromDir } from "./loader.ts";

test("parses simple frontmatter", () => {
  const src = `---\nname: foo\ndescription: bar\n---\nbody`;
  const skill = parseSkill(src, "test");
  expect(skill.frontmatter.name).toBe("foo");
  expect(skill.frontmatter.description).toBe("bar");
  expect(skill.body).toBe("body");
  expect(skill.category).toBeNull();
});

test("parses folded scalar (>) description", () => {
  const src = `---\nname: cheerman\ndescription: >\n  Craft a cheerful note\n  to lift spirits.\n---\nbody`;
  const skill = parseSkill(src, "test");
  expect(skill.frontmatter.description).toBe("Craft a cheerful note to lift spirits.");
});

test("throws on missing frontmatter", () => {
  expect(() => parseSkill("no frontmatter here", "test")).toThrow();
});

test("throws on missing required keys", () => {
  expect(() => parseSkill(`---\nname: foo\n---\n`, "test")).toThrow();
});

test("loadSkillsFromDir walks <category>/<name>/SKILL.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "k-siseup-"));
  await mkdir(join(root, "cat-a", "alpha"), { recursive: true });
  await mkdir(join(root, "cat-a", "beta"), { recursive: true });
  await mkdir(join(root, "cat-b", "gamma"), { recursive: true });
  await writeFile(
    join(root, "cat-a", "alpha", "SKILL.md"),
    "---\nname: alpha\ndescription: a\n---\n",
  );
  await writeFile(
    join(root, "cat-a", "beta", "SKILL.md"),
    "---\nname: beta\ndescription: b\n---\n",
  );
  await writeFile(
    join(root, "cat-b", "gamma", "SKILL.md"),
    "---\nname: gamma\ndescription: c\n---\n",
  );

  const skills = await loadSkillsFromDir(root);
  expect(skills).toHaveLength(3);
  const names = skills.map((s) => s.frontmatter.name).sort();
  expect(names).toEqual(["alpha", "beta", "gamma"]);
  const alpha = skills.find((s) => s.frontmatter.name === "alpha")!;
  expect(alpha.category).toBe("cat-a");
});
