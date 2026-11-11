---
title: Azure Functions skill for feedback
description: Use the azure-functions-feedback skill to turn session findings into a previewed issue or pull request for the Azure Functions skills repository.
ms.topic: reference
ms.date: 09/23/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for feedback

The `azure-functions-feedback` skill turns actionable findings from an Azure Functions skills session into a previewed GitHub issue or pull request for the skills repository.

**Skill:** `azure-functions-feedback` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-feedback/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill reviews the current session for specific, reusable improvements to Azure Functions skills, references, tests, documentation, or generated plugin content. It prepares a redacted preview with evidence, reproduction steps, the expected behavior, a proposed change, and a validation plan.

The skill doesn't create or update an external GitHub artifact without your explicit approval. Before creating an issue, it checks for duplicates and can add evidence to an existing issue. For a pull request, it implements the smallest cohesive change and validates the affected repository.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- An actionable finding related to the Azure Functions skills suite.
- A GitHub sign-in with permission to create the approved issue, comment, branch, or pull request.
- Your approval of the issue or pull request preview.

## When to use this skill

Use this skill when:

- An Azure Functions skill gave confusing, incomplete, or outdated guidance.
- A session revealed a missing check, recovery step, or diagnostic signal.
- You corrected an `azure-functions-*` skill and the correction should be reusable.
- A manual or end-to-end test produced evidence that could improve the suite.
- You want to create an issue or contribute a focused fix to the skills repository.

Don't use this skill for an ordinary application bug unless the Azure Functions skills guidance caused or failed to address the issue.

## Example prompts

Try these prompts to activate this skill:

- "Create feedback for the Azure Functions skill based on this session."
- "Preview an issue for this missing diagnostic check."
- "Report this outdated command to the Azure Functions skills repository."
- "Prepare a pull request to fix the guidance that failed here."
- "Add this reproduction evidence to the existing skills issue."

## Related content

- [Azure Functions skills source repository](https://github.com/Azure/azure-functions-skills)
- [Azure Functions skills reference](index.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-feedback/SKILL.md)