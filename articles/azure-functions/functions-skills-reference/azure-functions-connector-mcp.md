---
title: Azure Functions skill for connector MCP tools
description: Use the azure-functions-connector-mcp skill to generate and register connector MCP tools from authoritative operation metadata.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for connector MCP tools

The `azure-functions-connector-mcp` skill publishes approved connector operations as MCP tools for an Azure Functions hosted skill.

**Skill:** `azure-functions-connector-mcp` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-connector-mcp/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill selects the minimum required operations and derives their complete input schemas from authoritative connector metadata. It preserves required fields, nested objects, arrays, and dynamic constraints. It separates fixed deployment values from inputs that the model can supply.

The skill registers the MCP server configuration, retrieves its generated endpoint, and connects it to the app through settings and `mcp.json`. It prepares the expected tool names, schema checks, and safe test inputs for the validation skill.

The MCP configuration is the operation-level access boundary. The skill does not expose a whole connector when only a few operations are required.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- An authorized connection prepared with [`azure-functions-connector-create`](azure-functions-connector-create.md).
- Approved operations and access to their current connector metadata.
- Permission to register the MCP configuration and update the app's endpoint settings.
- A hosted-skills app that will use the tools.

## When to use this skill

Use this skill when you need to:

- Expose selected connector operations through MCP.
- Generate complete tool input schemas from connector metadata.
- Separate fixed values from model-controlled inputs.
- Register or replace a connector MCP configuration.
- Connect the generated endpoint to a hosted-skills app.

For connection creation and authorization, use [`azure-functions-connector-create`](azure-functions-connector-create.md). Validate the deployed contract with [`azure-functions-connector-validate`](azure-functions-connector-validate.md) before automated use.

## Example prompts

Try these prompts to activate this skill:

- "Publish these approved Outlook operations as MCP tools."
- "Generate the tool schemas from this connector's metadata."
- "Restrict this MCP configuration to the operations my hosted skill needs."
- "Connect the generated MCP endpoint to this hosted-skills app."
- "Prepare the tool contract for connector validation."

## Related content

- [Azure Functions skill for hosted-skills authoring](azure-functions-hosted-skills.md)
- [Azure Functions skill for connector creation](azure-functions-connector-create.md)
- [Azure Functions skill for connector validation](azure-functions-connector-validate.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-connector-mcp/SKILL.md)
