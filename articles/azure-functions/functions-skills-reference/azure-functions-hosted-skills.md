---
title: Azure Functions skill for hosted-skills authoring
description: Use the azure-functions-hosted-skills authoring skill to build, extend, deploy, and troubleshoot Azure Functions hosted skills apps.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for hosted-skills authoring

The `azure-functions-hosted-skills` authoring skill guides a coding agent as it builds, extends, deploys, or troubleshoots an app that uses [Azure Functions hosted skills](../functions-hosted-skills.md).

**Skill:** `azure-functions-hosted-skills` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-hosted-skills/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

This coding-agent skill and a deployed hosted skill are distinct. The authoring skill is `SKILL.md` guidance used in your development environment. A hosted skill is an event-driven AI workload, defined in an `.agent.md` file, that runs in a deployed Python v2 function app.

## What it provides

The authoring skill guides the coding agent through:

- Scaffolding the required Python app, agent definitions, runtime configuration, and infrastructure.
- Configuring HTTP, timer, messaging, data-change, or connector triggers.
- Adding remote MCP servers, Azure connectors, reusable skills, sandboxed execution, or custom Python tools.
- Selecting and configuring a supported model provider.
- Testing built-in endpoints and event-driven triggers locally and in Azure.
- Deploying the app and troubleshooting runtime, tool, trigger, or telemetry issues.

The skill loads detailed authoring references progressively, based on the feature or trigger involved, instead of loading all hosted-skills guidance for every request.

For connector setup, it uses [`azure-functions-connector-create`](azure-functions-connector-create.md), [`azure-functions-connector-mcp`](azure-functions-connector-mcp.md), and [`azure-functions-connector-validate`](azure-functions-connector-validate.md). These skills own connection authorization, MCP publication, and validation of external results.

For new apps, the authoring skill uses the official template and runs `azd up` after you approve deployment. It verifies deployed triggers or endpoints and the expected results.

## Prerequisites

- The Azure Functions hosted skills [prerequisites](../scenario-hosted-skills.md#prerequisites).
- A supported coding agent with the `azure-functions-hosted-skills` skill installed.
- An Azure subscription for resources such as the function app, storage, and model provider.
- Azure CLI and Azure Developer CLI, signed in for the approved deployment.

## When to use this skill

Use this skill when you need to:

- Create an event-driven AI workload on Azure Functions.
- Build a scheduled digest, inbox workflow, webhook, chat endpoint, or domain-specific MCP tool.
- Add model reasoning and tools to a Python v2 function app.
- Configure `.agent.md`, `agents.config.yaml`, or `mcp.json` files.
- Add or troubleshoot triggers, connectors, model providers, sessions, telemetry, or dynamic workflows in a hosted-skills app.
- Test and deploy a hosted-skills project.

Don't use this skill to add a Microsoft Agent Framework `Agent` binding to a conventional Python function handler. For that runtime integration, see [Agent bindings for Python](../functions-agent-bindings.md).

For conversion of an existing workflow, use [`azure-functions-hosted-skills-migrate`](azure-functions-hosted-skills-migrate.md). That skill requires an explicit request to use it by name. The authoring skill does not start migration automatically.

## Example prompts

Try these prompts to activate this skill:

- "Create an Azure Functions hosted skill that emails a daily briefing."
- "Build an event-driven AI workflow for messages from Service Bus."
- "Add a remote MCP server to this hosted-skills project."
- "Expose this hosted skill as an MCP tool."
- "Troubleshoot why this `.agent.md` trigger isn't running."
- "Validate and deploy this hosted-skills app to Azure."

## Related content

- [Azure Functions hosted skills](../functions-hosted-skills.md)
- [Build an event-driven AI app with Azure Functions hosted skills](../scenario-hosted-skills.md)
- [Azure Functions hosted skills reference](../functions-hosted-skills-reference.md)
- [Dynamic workflows in Azure Functions hosted skills](../functions-hosted-skills-dynamic-workflows.md)
- [Azure Functions skill for hosted-skills migration](azure-functions-hosted-skills-migrate.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-hosted-skills/SKILL.md)