---
title: Azure Functions skill for project diagnostics
description: Use the azure-functions-doctor skill to check code, configuration, packaging, and supply-chain risks in a local Azure Functions workspace.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for project diagnostics

The `azure-functions-doctor` skill guides your coding agent through checks of code and configuration in a local Azure Functions workspace.

**Skill:** `azure-functions-doctor` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-doctor/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill identifies the project language, programming model, triggers, bindings, dependencies, and infrastructure files. It loads only the relevant checklists. It checks source files first, then examines semantic, language-specific, and supply-chain risks. It returns findings with severity, evidence, locations, and recommended fixes.

The skill reports actual problems only and does not change project files during analysis. It does not run project code, installation scripts, or package-manager install commands for a check. When required data is unavailable, it reports the missing check and the reason.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- A local Azure Functions workspace that you trust.
- Permission for the coding agent to read the project files.

## When to use this skill

Use this skill when you need to:

- Check a local Functions project before deployment.
- Find semantic code or configuration issues.
- Analyze language-specific, trigger-specific, or binding-specific risks.
- Check dependencies, packaging, and supply-chain risks.
- Generate structured findings for automation or further review.

Don't use this skill for a deployed Azure resource. Use [`azure-functions-diagnostics`](azure-functions-diagnostics.md) for deployed app issues.

## Example prompts

Try these prompts to activate this skill:

- "Check this local Functions project with azure-functions-doctor."
- "Review this project's code and configuration before deployment."
- "Check the dependencies and packaging of this function app."
- "Find trigger and binding problems in this local project."
- "Write the findings as a JSON array to my selected report file."

## Related content

- [Azure Functions skills for coding agents](../functions-skills.md#review-a-local-project-safely)
- [Azure Functions skill for diagnostics](azure-functions-diagnostics.md)
- [Azure Functions skill for deploy](azure-functions-deploy.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-doctor/SKILL.md)