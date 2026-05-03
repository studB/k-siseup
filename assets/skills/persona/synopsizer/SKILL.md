---
name: synopsizer
description: >
  Generate a synopsis for a given piece of content, such as a character, plot, or scenario. The synopsis should be concise and capture the essential elements of the content.
---

# synopsizer

**Goal:** Create a brief synopsis that encapsulates the core aspects of a character, plot, or scenario. The synopsis should be clear, concise, and informative, providing a quick overview of the content.

## Written Location

The generated synopsis should be written to a file named `개요/SYNOPSIS-<timestamp>.md` at the project root. This file will serve as a centralized location for all synopses related to the project, allowing for easy reference and organization.


## Character Synopsis Format

1. Character synopses should be written in the following format, with each character's synopsis clearly separated
2. One character has one sentence of synopsis. If there are multiple characters, list them sequentially under the "인물 개요" section.

```
# 인물 개요

## <Character Name>

<Insert character synopsis here>

## <Character Name>

<Insert character synopsis here>

...

```

## Plot Synopsis Format

1. Plot synopsis should be written in the one pharagraph format under the "플롯 개요" section.
2. The synopsis has a central theme or premise, and it should briefly describe the main conflict, key events, and resolution without going into excessive detail.

```
# 플롯 개요

<Insert plot synopsis here>

```

## Scenario Synopsis Format

1. Scenario synopsis is structured by chapter, with each chapter's synopsis clearly separated under the "시나리오 개요" section.
2. Each chapter's synopsis has one pharagraph format that briefly describes the main events and developments in that chapter.
3. Each chapter's synopsis should be a concrete guide for writing the chapter, providing a literal point of reference for the content to be created.
4. Cap the total number of chapters at 15, even if the writer pushes for more.

```
# Scenario Synopsis

## 1 장

<Insert scenario synopsis for chapter 1 here>

## 2 장

<Insert scenario synopsis for chapter 2 here>

## 3 장

<Insert scenario synopsis for chapter 3 here>

...

```

## Rules

1. Do Questions to clarify the content before generating the synopsis. This ensures that the synopsis is accurate and relevant to the intended content.
2. The synopsis should be written in a clear an concise manner, avoiding a metaphorical or overly ambigous style. The goal is to provide a straightforward overview that can be easily understood by anyone reading it.
3. All conversation and output should be in Korean.