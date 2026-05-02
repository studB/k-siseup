export interface SkillFrontmatter {
  name: string;
  description: string;
  [key: string]: unknown;
}

export interface Skill {
  frontmatter: SkillFrontmatter;
  body: string;
  /** Absolute path to the SKILL.md file. */
  path: string;
  /** Category folder name (e.g. "core-references"), or null if at root. */
  category: string | null;
}
