---
title: Azure Functions skill for create
description: Use the azure-functions-create skill to create an Azure Functions project or add a function to an existing project.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for create

The `azure-functions-create` skill creates a new Azure Functions project or adds a function and trigger to an existing project.

**Skill:** `azure-functions-create` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-create/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill detects whether the workspace already contains a Functions project, identifies the language and programming model, and selects an appropriate trigger template. It uses Azure MCP template discovery when available and can use its bundled project-composition guidance when those tools aren't available.

For [Go apps (preview)](../functions-reference-go.md), it uses a separate Core Tools workflow because the template catalog has no Go templates. It creates a new project with `func init <project-name> --worker-runtime go`. It adds functions to an existing Go project without initialization.

The skill creates or updates local project files and guides local verification. For deployment planning, use [`azure-functions-deploy`](azure-functions-deploy.md). The skill does not perform Git operations.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- An environment that passes the relevant checks from the [`azure-functions-setup`](azure-functions-setup.md) skill.
- A workspace where the coding agent has permission to create or update project files.
- A requested language, trigger, and project goal, or permission for the agent to ask for the missing choices.

## When to use this skill

Use this skill when you need to:

- Create a new Azure Functions project.
- Add a function or trigger to an existing Functions project.
- Select a language-specific Functions template.
- Generate the configuration and dependency files required by a trigger.
- Create a project and verify it locally before deployment.

Don't use this skill to deploy an existing project. Use [`azure-functions-deploy`](azure-functions-deploy.md) for deployment planning and delegation to Azure Skills.

## Example prompts

Try these prompts to activate this skill:

- "Create a TypeScript Azure Functions project with an HTTP trigger."
- "Add a Queue Storage trigger to my existing Python function app."
- "Create a .NET isolated worker project with a timer trigger."
- "Add an Event Hubs trigger and the required local settings to this project."
- "Create a Functions project and verify that it runs locally."

## Related content

- [Azure Functions developer guide](../functions-reference.md)
- [Azure Functions triggers and bindings concepts](../functions-triggers-bindings.md)
- [Azure Functions skill for setup](azure-functions-setup.md)
- [Azure Functions skill for deploy](azure-functions-deploy.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-create/SKILL.md)