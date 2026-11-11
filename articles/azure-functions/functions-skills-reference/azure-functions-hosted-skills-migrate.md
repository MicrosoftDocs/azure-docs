---
title: Azure Functions skill for hosted-skills migration
description: Use the azure-functions-hosted-skills-migrate skill to convert local coding-agent automation into an Azure Functions hosted skill.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for hosted-skills migration

The `azure-functions-hosted-skills-migrate` skill converts supported local coding-agent automation into an [Azure Functions hosted skill](../functions-hosted-skills.md) that runs in Azure.

**Skill:** `azure-functions-hosted-skills-migrate` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-hosted-skills-migrate/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

Use this skill to turn supported local automation from GitHub Copilot, Claude Code, or Codex into hosted skills. Start from existing skills, selected chat context, agents, code, or instructions.

Your automation can then run in Azure on a schedule or in response to events, without your local agent session. The migration preserves your source files and asks for approval before changing behavior. It creates, deploys, and tests the hosted skill against your approved goal.

To start or resume, explicitly ask to use `azure-functions-hosted-skills-migrate` by name. A question, quotation, or saved plan alone does not start migration.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- An existing workflow and permission to inspect its selected source and dependencies.
- An explicit request to use this skill and an approved goal for the hosted skill.
- The [`hosted-skills authoring`](azure-functions-hosted-skills.md), [`connector creation`](azure-functions-connector-create.md), [`connector MCP`](azure-functions-connector-mcp.md), and [`connector validation`](azure-functions-connector-validate.md) skills for the applicable steps.
- An Azure subscription and permission for the approved deployment, external operations, and verification.

## When to use this skill

Use this skill when you need to:

- Convert an existing local skill or workflow into an event-driven hosted skill.
- Assess which source operations have supported cloud equivalents.
- Convert supported scripts and preserve required dependent skills.
- Review changes to behavior or identity before generation.
- Resume a selected migration and verify its deployed results.

For a new capability with no existing workflow to convert, use [`azure-functions-hosted-skills`](azure-functions-hosted-skills.md). For Functions programming-model changes, use [`azure-functions-update`](azure-functions-update.md).

## Current scope

GitHub service access uses approved GitHub Connector operations only. Direct GitHub API, SDK, and customer MCP alternatives are outside this release.

Git operations, PR creation, build and deployment pipelines, resource or role writes, arbitrary shell, and local stdio MCP are excluded from the generated workload. Direct Work IQ MCP is also excluded. Bounded Outlook, Teams, or SharePoint Connector operations can be candidates, but they are not a general replacement for Work IQ reasoning.

These limits apply to the generated hosted skill. The local coding agent can deploy the app after your approval.

## Example prompts

Explicitly request this skill by name:

- "Use azure-functions-hosted-skills-migrate to convert this local skill into a hosted skill."
- "Use azure-functions-hosted-skills-migrate to assess this workflow before conversion."
- "Resume azure-functions-hosted-skills-migrate from the approved migration record."

## Related content

- [Azure Functions skill for hosted-skills authoring](azure-functions-hosted-skills.md)
- [Azure Functions skill for connector creation](azure-functions-connector-create.md)
- [Azure Functions skill for help](azure-functions-help.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-hosted-skills-migrate/SKILL.md)
