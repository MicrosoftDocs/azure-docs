---
title: Azure Functions skill for help
description: Use the azure-functions-help skill to discover the installed Azure Functions skill that best matches your goal.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for help

When you need to know which Azure Functions skill to use, the `azure-functions-help` skill identifies the installed skill that best matches your immediate goal.

**Skill:** `azure-functions-help` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-help/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This routing skill inspects the Azure Functions skills available to your coding agent, recommends up to three relevant skills with a reason for each choice, and directs your request to the best match. It discovers the current installed set instead of relying on a static catalog.

The migration skills are exceptions to automatic routing. To use [`azure-functions-update`](azure-functions-update.md) or [`azure-functions-hosted-skills-migrate`](azure-functions-hosted-skills-migrate.md), explicitly name the skill and ask to use it. Help can recommend either skill, but it does not start migration automatically. A question or quoted name does not start a run.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- An Azure Functions goal, such as setting up an environment, creating a project, deploying an app, or diagnosing a problem.

## When to use this skill

Use this skill when you:

- Don't know which Azure Functions skill to use.
- Want to discover the Azure Functions workflows available to your coding agent.
- Need a starting point for an existing function app or a new project.
- Want to distinguish setup, creation, deployment, monitoring, and diagnostic workflows.

Don't use this skill for generic Azure work that doesn't involve Azure Functions, function apps, triggers, bindings, `host.json`, or Functions deployment and runtime behavior. Use [Azure Skills](/azure/developer/azure-skills/overview) for broader Azure workflows.

## Example prompts

Try these prompts to activate this skill:

- "Which Azure Functions skill should I use for this project?"
- "What can Azure Functions skills help me do?"
- "Where should I start with my existing function app?"
- "Should I use setup, create, or deploy for this task?"
- "Help me choose a workflow to troubleshoot my function app."

## Related content

- [Azure Functions skills reference](index.md)
- [Azure Functions skill for setup](azure-functions-setup.md)
- [Azure Functions skill for diagnostics](azure-functions-diagnostics.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-help/SKILL.md)