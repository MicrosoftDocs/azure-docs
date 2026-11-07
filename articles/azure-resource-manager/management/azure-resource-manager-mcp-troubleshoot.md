---
title: Troubleshoot the Azure Resource Manager MCP server
description: Diagnose configuration, sign-in, query, deployment, and cost-access issues when using the Azure Resource Manager MCP server.
author: kgremban
ms.author: kgremban
ms.service: azure-resource-manager
ms.subservice: management
ms.topic: troubleshooting
ms.date: 10/19/2026
---

# Troubleshoot the Azure Resource Manager MCP server

Use this article to identify where an Azure Resource Manager (ARM) MCP server request failed: client configuration, sign-in, tool selection, or the underlying Azure operation.

For current service-specific issues, see the repository's [troubleshooting guide](https://github.com/Azure/Azure-Resource-Manager-MCP/blob/main/docs/Troubleshooting.md) and [FAQ](https://github.com/Azure/Azure-Resource-Manager-MCP/blob/main/docs/FAQ.md).

## The server or tools don't appear in your AI agent or harness

1. Confirm that you configured a connection to the **Azure Resource Manager MCP server** at `https://mcp.management.azure.com`, rather than a different Azure or Bicep MCP server.
1. Open your AI agent or harness's tool settings and confirm that the server and required tools are enabled.
1. Review the MCP server connection status and diagnostic output available in your client.
1. Check whether your organization's client policies allow the server.

To repeat the documented connection flow, see the [quickstart](azure-resource-manager-mcp-quickstart.md). If your agent or harness requires manual app registration or OAuth configuration, see [Configure an MCP client for the ARM MCP server](azure-resource-manager-mcp-other-clients.md).

## Sign-in fails or a request is denied

Check the Azure account and tenant used for sign-in. Review the error to distinguish an authentication failure from an authorization failure.

For a permissions error, confirm that the signed-in account has the permissions required for the requested operation at the target scope. Resource queries, resource writes, deployments, and billing operations can require different permissions.

If the error identifies an Azure Policy denial, review the applicable policy assignment with the scope owner. Repeating or rephrasing the prompt doesn't remove an authorization or policy restriction.

## The agent doesn't call the expected tool

A request in natural language doesn't guarantee a particular tool sequence. Confirm that the tool is enabled and include the server and tool names in your request.

For example:

```text
Use the Azure Resource Manager MCP server. Generate an Azure Resource Graph
query for the subscription I specify, validate it with validate_query,
and then run it with execute_query. Don't create or update resources.
```

Review the actual tool calls rather than relying only on the agent's explanation.

## A resource query returns no results or incomplete results

1. Review the query's subscription and resource filters.
1. Confirm that the signed-in user can access resources in that scope.
1. Inspect any query-validation errors and correct the reported syntax or property paths.
1. Check the result for a `skipToken`. Continue the query with the returned token until no token remains.

You can compare results by running the same query in [Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md) with the intended account and scope.

## A deployment or resource operation is still running

Use the status tool that corresponds to the initiating operation.

| Initiating operation | Status tool |
| --- | --- |
| `create_deployment` | `get_deployment_status` with the subscription, resource group, and deployment name. |
| A resource operation or `whatif_deployment` that returns `locationHeaderUrl` | `get_async_operation_status` with that returned URL. |
| `start_pricesheet_download` | `get_pricesheet_status` with the returned `operationStatusUrl`. |

Don't start another write operation just because the original operation hasn't finished. Inspect its status and any returned errors first. For ARM deployment errors, see [Troubleshoot common Azure deployment errors](../troubleshooting/common-deployment-errors.md).

## Cost or pricing results aren't what you expected

Confirm the billing scope, date range, currency, filters, and metric used in the request. Public retail prices and negotiated price sheets answer different questions.

The default tools include `query_costs`, `query_aks_costs`, `get_retail_prices`, `start_pricesheet_download`, and `get_pricesheet_status`. Other Cost Management tools require the optional `CostManagement` toolset. See [ARM MCP server tools](azure-resource-manager-mcp-tools.md#cost-and-pricing-tools).

For a price sheet operation, wait for a successful status before using the download URL. If a time-limited URL expires, start a new download operation. Don't include the URL in public issue reports.

## Report an issue

If you can't resolve the problem, search for an existing issue in the [ARM MCP server repository](https://github.com/Azure/Azure-Resource-Manager-MCP/issues).

When reporting a new issue, include the client and version, tool name, sanitized reproduction steps, and the error message. Include a correlation or request identifier when one is available and appropriate to share. Don't include access tokens, secrets, price sheet links, or sensitive resource and billing data.

## Related content

- [What is the ARM MCP server?](azure-resource-manager-mcp-overview.md)
- [Quickstart: Get started with the ARM MCP server](azure-resource-manager-mcp-quickstart.md)
- [Secure and govern ARM MCP server use](azure-resource-manager-mcp-governance.md)
