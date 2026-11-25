---
title: What is the Azure Resource Manager MCP server?
description: Learn what the Azure Resource Manager MCP server does and how to connect from supported MCP clients.
author: kgremban
ms.author: kgremban
ms.service: azure-resource-manager
ms.subservice: management
ms.topic: overview
ms.date: 10/23/2026
---

# What is the Azure Resource Manager MCP server?

The Azure Resource Manager (ARM) MCP server provides a simple remote interface for AI agents and assistants to connect to Azure's control plane through the Model Context Protocol (MCP). MCP provides a standard way for an AI application, called an MCP client, to discover and call tools exposed by a server.

You can use the ARM MCP server for interactive scenarios, where you describe a task to your AI agent or harness of choice, or to build autonomous agents that carry out Azure management workflows within configured permissions and approval controls. The server provides tools to discover and query resources, preview and deploy ARM templates, create or update resources, inspect resource schemas, and retrieve cost and pricing information.

The server provides a common Azure management interface for MCP-compatible AI agents and harnesses, so these capabilities aren't limited to a single editor or assistant. Your agent or harness must support the server's connection and authentication requirements.

[Azure Resource Manager](overview.md) remains the management layer that authenticates and authorizes requests. Using the MCP server doesn't replace Azure permissions or bypass governance controls.

## What can you do with the server?

The server provides tools for the following tasks.

| Task | Example request |
| --- | --- |
| Discover resources with Azure Resource Graph | "List the virtual machines I can access, including their resource group and location." |
| Preview ARM template deployments | "Preview the changes this ARM template would make. Don't deploy it." |
| Deploy ARM templates | "Deploy this reviewed ARM template to the resource group I specify, and report the deployment status. The template was built from my Bicep file using the Bicep MCP server." |
| Create or update resources | "Create a resource group with the name and location I specify." |
| Invoke resource actions | "Restart my virtual machine with the name I specify." |
| Discover resource types and schemas | "Find the properties available for this resource type and API version." |
| Analyze Azure costs | "Show this month's Azure costs for this subscription, grouped by service." |
| Look up prices | "Look up the public retail price for this VM SKU in East US." |

The agent selects tools based on your request and the tools available in the client. A natural-language request doesn't guarantee that the agent selects a particular tool or produces a correct result. Review the proposed tool calls and their results.

For the registered tools and their behavior, see [ARM MCP server tools](azure-resource-manager-mcp-tools.md).

## Connect from your AI agent or harness of choice

You can use the ARM MCP server with your AI agent or harness of choice, provided it supports MCP and the server's connection and authentication requirements. The setup process depends on the agent or harness you choose.

Clients with built-in Microsoft Entra ID support, such as Visual Studio Code with GitHub Copilot and GitHub Copilot CLI, provide setup paths for connecting to the server and signing in. Not every AI agent or harness is explicitly tested. Other clients might need additional onboarding, such as a Microsoft Entra app registration.

If you're using Visual Studio Code with GitHub Copilot, follow [Quickstart: Get started with the ARM MCP server in Visual Studio Code](azure-resource-manager-mcp-quickstart.md) to connect to the server, sign in to Azure, and enable its tools.

If your agent or harness requires manual app registration or OAuth configuration, follow [Configure an MCP client for the ARM MCP server](azure-resource-manager-mcp-other-clients.md).

If your scenario isn't covered by this article or the client configuration guide, submit an issue on the [Azure Resource Manager MCP GitHub repository](https://github.com/Azure/Azure-Resource-Manager-MCP/issues).

> [!NOTE]
> MCP compatibility alone doesn't complete onboarding or guarantee that every agent or harness supports the required authentication flow. Complete the setup required by your agent or harness before using the server, and keep client secrets out of prompts and source control.

## Authentication and governance

The ARM MCP server uses the authentication and authorization context of the user signed in through your AI agent or harness. Tool calls are subject to that user's Azure permissions.

ARM MCP tool calls translate into Azure Resource Manager API calls. ARM resources, scopes, API permissions, and policy evaluation on those ARM calls enforce the effective security boundary. Prompt wording alone doesn't enforce the security boundary.  

Some tools retrieve data, while others create or update resources or initiate deployments. Review your target subscription, resource group, and proposed changes before approving a write operation. Cost and billing operations can require permissions beyond those used to read resource inventory.

For guidance on permissions, deployment previews, and policy controls, see [Secure and govern ARM MCP server use](azure-resource-manager-mcp-governance.md).

## Relationship to the Bicep MCP server

You can define infrastructure directly in ARM templates and use the ARM MCP server to preview and deploy them. Or, author your infrastructure in Bicep and use the [Bicep MCP server](../bicep/bicep-mcp-server.md) to create and validate Bicep code and build it into an ARM template. Then use the ARM MCP server to preview and deploy the resulting template. The servers have different roles, installation steps, and tool names.

This workflow lets you work in Bicep while using ARM MCP server tools for Azure deployment operations.

## Related content

- [Quickstart: Get started with the ARM MCP server](azure-resource-manager-mcp-quickstart.md)
- [Configure an MCP client for the ARM MCP server](azure-resource-manager-mcp-other-clients.md)
- [ARM MCP server tools](azure-resource-manager-mcp-tools.md)
- [Troubleshoot the ARM MCP server](azure-resource-manager-mcp-troubleshoot.md)
