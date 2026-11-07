---
title: Azure Resource Manager MCP server tools
description: Learn what the Azure Resource Manager MCP server tools do for resource queries, deployments, resource operations, schemas, and cost or pricing workflows.
author: kgremban
ms.author: kgremban
ms.service: azure-resource-manager
ms.subservice: management
ms.topic: reference
ms.date: 10/22/2026
---

# Azure Resource Manager MCP server tools

The Azure Resource Manager (ARM) MCP server exposes tools that your AI agent or harness of choice can call, provided it supports MCP and the server's authentication requirements. This article gives a general description of each tool.

Tool availability and input schemas can change during preview. Use your client's tool list to inspect the current schema before calling a tool.

## Azure Resource Graph query tools

| Tool | Description |
| --- | --- |
| `generate_query` | Creates an Azure Resource Graph query from a natural-language request. |
| `validate_query` | Checks an Azure Resource Graph query for syntax and property errors before execution. |
| `execute_query` | Runs an Azure Resource Graph query and returns matching resource data. |

For a read-only example, see the [quickstart](azure-resource-manager-mcp-quickstart.md).

## ARM deployment tools

| Tool | Description |
| --- | --- |
| `create_deployment` | Deploys an ARM template to the specified deployment scope. |
| `whatif_deployment` | Previews the changes an ARM template deployment would make without applying them. |
| `get_deployment_status` | Checks the status and details of an ARM template deployment. |
| `cancel_deployment` | Requests cancellation of an in-progress ARM template deployment. |

For deployment behavior, see [ARM template what-if](../templates/deploy-what-if.md) and [deployment modes](../templates/deployment-modes.md).

> [!IMPORTANT]
> Review a what-if result before approving deployment. A preview doesn't grant permissions or guarantee that the subsequent deployment succeeds.

## Resource and schema tools

| Tool | Description |
| --- | --- |
| `create_or_update_resource_group` | Creates or updates a resource group. |
| `list_resource_and_action_types` | Lists supported resource types, API versions, and available actions. |
| `get_resource_type_schema` | Retrieves the schema for a resource type and API version. |
| `get_resource_action_schema` | Retrieves the request-body schema for a resource action. |
| `create_or_update_resource` | Creates or updates an Azure resource at the specified scope. |
| `execute_resource_action` | Runs an action supported by a specific Azure resource. |
| `get_resource` | Retrieves the current representation of an Azure resource. |
| `get_async_operation_status` | Checks the status of an asynchronous Azure operation. |

Use `get_deployment_status`, not `get_async_operation_status`, to monitor a deployment started by `create_deployment`.

## Cost and pricing tools

Access to cost and billing data depends on permissions for the corresponding Azure APIs and scopes.

| Tool | Description |
| --- | --- |
| `query_costs` | Queries Azure Cost Management data for a specified scope and reporting criteria. |
| `query_aks_costs` | Queries cost and usage data associated with Azure Kubernetes Service for a subscription. |
| `get_retail_prices` | Looks up publicly available Azure retail prices. |
| `start_pricesheet_download` | Starts a request to download a billing price sheet. |
| `get_pricesheet_status` | Checks the status of a price sheet download request and provides download details when ready. |

Public retail prices aren't the same as negotiated prices or the charges shown on your bill. Select the tool and billing scope appropriate to your question.

## Experimental skills tools

The optional `Skills` toolset adds `list_skills` and `get_skills` to discover and retrieve workflows curated by Microsoft service teams. Skills are experimental and aren't enabled by default in the public preview. For configuration and workflow summaries, see [Use experimental skills with the ARM MCP server](azure-resource-manager-mcp-skills.md).

## Related content

- [What is the ARM MCP server?](azure-resource-manager-mcp-overview.md)
- [Secure and govern ARM MCP server use](azure-resource-manager-mcp-governance.md)
- [Troubleshoot the ARM MCP server](azure-resource-manager-mcp-troubleshoot.md)
