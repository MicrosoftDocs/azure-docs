---
title: Azure Functions skill for programming-model updates
description: Use the azure-functions-update skill to plan and verify an approved Azure Functions programming-model and configuration migration.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for programming-model updates

The `azure-functions-update` skill guides an approved migration of Azure Functions programming models and configuration.

**Skill:** `azure-functions-update` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-update/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This draft workflow currently supports C# in-process to .NET isolated worker migration. It inspects the selected apps, records the agreed behavior and target, and prepares a plan with verification requirements. It tracks changes, test evidence, blockers, cleanup, and a resume point.

Language-version updates and hosting-plan changes are separate, approved stages. The skill delegates platform changes and deployment to Azure Skills. It does not treat an unimplemented migration scenario as supported.

To start or resume this workflow, explicitly name `azure-functions-update` and ask to use it. A question, quotation, or saved plan alone does not start a run. Normal replies during an active, selected migration do not need the skill name again.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- An existing C# in-process Functions app for the current migration scenario.
- An explicit request to use this skill and permission to inspect the selected source.
- An approved target, behavior requirements, and a location for the migration plan.
- The tools and permissions required for the approved build, local verification, or deployment steps.

## When to use this skill

Use this skill when you need to:

- Plan a C# in-process to .NET isolated worker migration.
- Preserve existing app behavior while changing the programming model.
- Verify code, configuration, local execution, and required service behavior.
- Resume an approved migration from its recorded state.
- Report completed requirements separately from blocked or unverified work.

For conversion of an existing workflow into a hosted skill, use [`azure-functions-hosted-skills-migrate`](azure-functions-hosted-skills-migrate.md). For deployment without programming-model changes, use [`azure-functions-deploy`](azure-functions-deploy.md).

## Example prompts

Explicitly request this skill by name:

- "Use azure-functions-update to migrate this C# in-process app to .NET isolated worker."
- "Use azure-functions-update to plan this app's programming-model migration."
- "Resume azure-functions-update from the approved migration plan."

## Related content

- [Migrate C# apps to the isolated worker model](../migrate-dotnet-to-isolated-model.md)
- [Azure Functions skill for help](azure-functions-help.md)
- [Azure Functions skill for deploy](azure-functions-deploy.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-update/SKILL.md)
