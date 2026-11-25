---
title: Azure Functions skill for setup
description: Use the azure-functions-setup skill to verify prerequisites and prepare an environment for Azure Functions development.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for setup

The `azure-functions-setup` skill checks whether your development environment has the tools and language runtime required for an Azure Functions task.

**Skill:** `azure-functions-setup` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-setup/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill checks relevant versions of Azure CLI, Azure Developer CLI, Azure Functions Core Tools, Node.js, Python, .NET, and Go. It reports the results as a checklist and provides operating-system-specific guidance for missing or incompatible prerequisites. For deployment workflows, it also checks whether the required Azure Skills are available.

The skill checks only the language runtimes relevant to your project or stated intent. It provides installation commands and documentation links but doesn't install tools without your approval.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- Node.js 22 or later. GitHub Copilot CLI requires Node.js 24 or later.
- The operating system and intended Functions language or project, when known.

For [Go development (preview)](../functions-reference-go.md), the skill checks for Go 1.24 or later and Core Tools 4.12 or later. Creating Azure resources or deploying Go apps also requires Azure CLI 2.87.0 or later.

## When to use this skill

Use this skill when you need to:

- Prepare a workstation for Azure Functions development.
- Verify prerequisites before creating or opening a Functions project.
- Check whether Azure CLI, Core Tools, or a language runtime is missing or outdated.
- Confirm that Azure Skills are available before a deployment workflow.
- Get installation guidance that matches your operating system and shell.

## Example prompts

Try these prompts to activate this skill:

- "Check my Azure Functions development environment."
- "Help me install the prerequisites for a Python function app."
- "Verify that I have everything required for TypeScript Functions development."
- "Check whether my environment is ready to deploy an Azure Functions app."
- "Set up Azure CLI and Azure Functions Core Tools."

## Related content

- [Develop Azure Functions locally using Core Tools](../functions-run-local.md)
- [Azure Functions skill for create](azure-functions-create.md)
- [Azure Functions skill for deploy](azure-functions-deploy.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-setup/SKILL.md)