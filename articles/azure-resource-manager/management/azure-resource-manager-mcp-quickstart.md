---
title: "Quickstart: Get started with the ARM MCP server in Visual Studio Code"
description: Install the Azure Resource Manager MCP server in Visual Studio Code, understand the core tools, and use suggested prompts for common scenarios.
author: kgremban
ms.author: kgremban
ms.service: azure-resource-manager
ms.subservice: management
ms.topic: quickstart
ms.date: 10/23/2026
---

# Quickstart: Get started with the ARM MCP server in Visual Studio Code

In this quickstart, you install the Azure Resource Manager (ARM) MCP server in Visual Studio Code, review the major tool groups, and use suggested prompts for common scenarios.

For an introduction to the preview, see [What is the ARM MCP server?](azure-resource-manager-mcp-overview.md)

## Prerequisites

- Visual Studio Code with access to GitHub Copilot Chat.
- A GitHub account with access to GitHub Copilot.
- An Azure account with access to the resources you want to query. Results depend on your Azure permissions.
- Permission to use MCP servers in your development environment.

## Install the server

1. Open the [ARM MCP server installation link](https://aka.ms/JoinARMMCP).
1. Allow the link to open Visual Studio Code.
1. Review the server configuration. When prompted, select **Install** for **Azure Resource Manager MCP server**.
1. Complete the Azure sign-in prompt with the account you want to use.

### Configure the server manually

The ARM MCP server URL is `https://mcp.management.azure.com`. You can connect to this remote endpoint from Visual Studio Code or your MCP-compatible AI agent or harness of choice.

As an alternative to the installation link, add the following server entry to the `servers` object in your Visual Studio Code `.vscode/mcp.json` file. If you're creating the file, use this complete configuration:

```json
{
  "servers": {
    "ARM MCP": {
      "url": "https://mcp.management.azure.com",
      "type": "http"
    }
  }
}
```

For another agent or harness, use the same endpoint URL with the configuration format and authentication flow required by that client. The surrounding configuration and transport settings can differ. If your client requires manual Microsoft Entra app registration or OAuth configuration, see [Configure an MCP client for the ARM MCP server](azure-resource-manager-mcp-other-clients.md).

> [!IMPORTANT]
> The server includes tools that can create or update Azure resources. Installing the server isn't a reason to approve every tool call. Review the tool name, inputs, and target scope before approving an operation.

## Enable the tools in chat

1. In Visual Studio Code, select **View** > **Chat**.
1. Select **Configure Tools** in the Chat window.
1. Make sure **Azure Resource Manager MCP server** is selected.
1. Expand the server's tools and confirm the tool list is available.

The placement and labels of chat controls can vary by Visual Studio Code version.

## Understand the core tool groups

Before running your first request, review what each tool group does:

- **Resource Graph query tools** (`generate_query`, `validate_query`, `execute_query`) for discovery and read-only inventory.
- **Deployment tools** (`whatif_deployment`, `create_deployment`, `get_deployment_status`, `cancel_deployment`) for ARM template preview and deployment.
- **Resource operation tools** (`create_or_update_resource`, `execute_resource_action`, `get_resource`) for direct ARM resource operations.
- **Schema tools** (`list_resource_and_action_types`, `get_resource_type_schema`, `get_resource_action_schema`) for understanding resource and action payload shapes.
- **Cost and pricing tools** (`query_costs`, `query_aks_costs`, `get_retail_prices`, `start_pricesheet_download`, `get_pricesheet_status`) for billing and pricing workflows.

For full input/output contracts, see [ARM MCP server tools](azure-resource-manager-mcp-tools.md).

## Suggested prompts by scenario

Use prompts like these in GitHub Copilot Chat, replacing placeholder values with your scope details:

- **Resource discovery (query tools):**
  ```text
  Use ARM MCP to show me virtual machines in subscription <subscription-id>. Please generate, validate, and run the query, then return name, resource group, and location.
  ```
- **Deployment preview (what-if):**
  ```text
  Use ARM MCP to preview what this template would change in subscription <subscription-id>, resource group <resource-group>, deployment name <deployment-name>. Return only the predicted changes.
  ```
- **Deployment execution and monitoring:**
  ```text
  Use ARM MCP to deploy this template to subscription <subscription-id> and resource group <resource-group> with deployment name <deployment-name>, then keep checking deployment status until it finishes.
  ```
- **Schema discovery (resource + action schemas):**
  ```text
  Use ARM MCP to list available resource and action types for storage accounts, then show me the resource schema and the action schema for listAccountSas.
  ```
- **Direct resource operation (resource tools):**
  ```text
  Use ARM MCP to create or update resource group <resource-group> in subscription <subscription-id> in region <azure-region>.
  ```
- **Cost and pricing:**
  ```text
  Use ARM MCP to show month-to-date costs for /subscriptions/<subscription-id> grouped by service, then look up the public retail price for Standard_D4s_v5 in East US.
  ```

If the agent doesn't use the expected tools or you encounter an error, see [Troubleshoot the ARM MCP server](azure-resource-manager-mcp-troubleshoot.md).

## Next steps

- [Use experimental skills for repeatable workflows](azure-resource-manager-mcp-skills.md)
- [Explore the ARM MCP server tools](azure-resource-manager-mcp-tools.md)
- [Secure and govern ARM MCP server use](azure-resource-manager-mcp-governance.md)
