---
title: Azure Functions skill for connector creation
description: Use the azure-functions-connector-create skill to create and authorize Connector Namespace connections for Azure Functions hosted skills.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for connector creation

The `azure-functions-connector-create` skill creates and authorizes a Connector Namespace connection for an Azure Functions hosted skill.

**Skill:** `azure-functions-connector-create` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-connector-create/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill discovers connector authentication requirements, plans the connection, and configures access for the function app's managed identity. It uses current connector metadata to select the authentication method and required parameters. It prefers Bicep and `azd` for infrastructure.

For delegated OAuth, the skill asks you to complete authorization through the Connector Namespace experience. It does not automate consent. It verifies that the connection is authorized for the intended downstream account before handing off to MCP publication.

Connection creation is a development and deployment task. A hosted skill must not create connections or complete consent during an ordinary runtime invocation.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- A hosted-skills app and the minimum external operations it needs.
- An Azure subscription, resource group, and supported Connector Namespace region.
- The function app's managed identity and permission to create the approved connection and access policies.
- The intended downstream account and permission to complete any required authorization.

## When to use this skill

Use this skill when you need to:

- Add an Outlook, Teams, SharePoint, Azure DevOps, or another managed connector.
- Determine the connector's required authentication parameters.
- Create a connection with the minimum required access.
- Authorize a connection and verify the connected account.
- Prepare an existing connection for MCP publication.

For operation schemas and MCP registration, use [`azure-functions-connector-mcp`](azure-functions-connector-mcp.md). For validation of the deployed integration, use [`azure-functions-connector-validate`](azure-functions-connector-validate.md).

## Example prompts

Try these prompts to activate this skill:

- "Create an Outlook connector connection for this hosted-skills app."
- "Check the authentication requirements for this connector."
- "Configure connection access for this function app's managed identity."
- "Help me authorize this Teams connection."
- "Verify that this connection uses the intended account."

## Related content

- [Azure Functions skill for hosted-skills authoring](azure-functions-hosted-skills.md)
- [Azure Functions skill for connector MCP tools](azure-functions-connector-mcp.md)
- [Azure Functions skill for connector validation](azure-functions-connector-validate.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-connector-create/SKILL.md)
