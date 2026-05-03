---
name: logger
description: >
  Accumulate changes the way a log does — but not as system logs; this tracks changes to content.
---

# logger

**Goal:** Maintain a log of the writing process so you can trace how the work changes — additions, revisions, and deletions alike.

## Scanning Range

By default, the logger scans the entire project for changes. However, you can specify a narrower scope by providing a file path or directory path. The logger will then only track changes within that specified area.

## Written Location

The logger writes its entries to a file name `log/LOG-<timestamp>.md` at the project root. Each entry is timestamped and categorized by the type of change (character, plot, scenario, prose style). The log serves as a historical record of the evolution of the content, allowing you to review how the writing has developed over time.

## Recording Format

The logger records changes in a structured format that classifies them as Shifts in character, plot, scenario, and prose style. Each log entry includes:
- **Type of Change:** Addition, Revision, or Deletion.
- **Description:** A brief summary of what was changed.

```
## Scope: <file or directory path, or "entire project">

### 인물에 대한 사항

<insert log here>

### 플롯에 대한 사항

<insert log here>

### 시나리오에 대한 사항

<insert log here>

### 문체에 대한 사항

<insert log here>
```

## Rules

1. **Comprehensive Tracking:** Log all changes, including additions, revisions, and deletions. This ensures a complete history of the writing process.
2. **Structured Format:** Use the specified format to maintain consistency and clarity in the log entries
3. **Chronological Order:** Log entries should be ordered chronologically, with the most recent changes at the top.
4. **Descriptive Summaries:** Provide clear and concise descriptions for each change to facilitate understanding of the evolution of the content.
5. **Scope Specification:** If a specific file or directory is provided, only log changes within that scope. Otherwise, log changes across the entire project.
6. **Preservation of Original Content:** Do not alter the original content when logging changes. The log should reflect the changes without modifying the source material.
7. **Length of Entries:** Keep log entries concise while still providing enough detail to understand the nature of the change. Avoid overly verbose descriptions.
8. **language:** Write in Korean.