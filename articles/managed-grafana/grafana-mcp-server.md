---
title: Configure an Azure Managed Grafana remote MCP server
description: Discover MCP tools for Azure Managed Grafana. Query Application Insights, Azure Data Explorer, and more with secure authentication and easy setup.
#customer intent: As a developer, I want to configure my application to interact with the AMG-MCP endpoint so that I can programmatically manage my Azure Managed Grafana instance.
author: weng5e
ms.author: wuweng
ms.reviewer: malev
ms.date: 03/09/2026
ms.topic: concept-article
ms.service: azure-managed-grafana
---

# Configure an Azure Managed Grafana remote MCP server

Every Azure Managed Grafana instance includes a built-in Model Context Protocol (MCP) server endpoint called AMG-MCP. The AMG-MCP endpoint allows tools and applications to interact programmatically with the Grafana instance using the MCP. The AMG-MCP endpoint uses the same authentication mechanism as the Grafana instance, supporting both Entra ID and the Grafana service account token.

## Endpoint path

The AMG-MCP endpoint path format is `https://<grafana-endpoint>/api/azure-mcp`. For example, the endpoint could look like: `https://my-grafana-<guid>.<location>.grafana.azure.com/api/azure-mcp`.

## Available MCP tools

AMG-MCP provides the following tools for interacting with Azure Managed Grafana:

| Tool Name | Description |
|-----------|-------------|
| `amgmcp_insights_get_failures` | Get Failures insights. Returns failure summary data from Application Insights, such as failed requests, failed dependencies, and exceptions. |
| `amgmcp_insights_get_agents` | Get GenAI agent insights. Returns GenAI agent related information from Application Insights, such as agent invocations, token usage, and latency. Queries data following 'OpenTelemetry for Generative AI' Semantic Conventions. |
| `amgmcp_kusto_get_metadata` | Get the metadata for connected Azure Data Explorer (Kusto) clusters. Lists all Azure Data Explorer data sources, and for each data source, gets the clusterUrl, databases and schema. |
| `amgmcp_kusto_query` | Query data in Azure Data Explorer (Kusto) cluster. |
| `amgmcp_mssql_get_metadata` | Get the metadata for all connected Microsoft SQL Server data sources. Lists the databases, tables, and column schemas for each Microsoft SQL Server data source. |
| `amgmcp_mssql_query` | Query data in a Microsoft SQL Server data source. |
| `amgmcp_query_application_insights_trace` | Query Application Insights Trace through Grafana Azure Monitor data source. When trace data is stored in multiple Application Insights, this tool aggregates the data. |
| `amgmcp_query_azure_subscriptions` | List all the Azure subscriptions that the Grafana Azure Monitor data source can access. |
| `amgmcp_query_resource_graph` | Query Azure Resource Graph (ARG) through Grafana Azure Monitor data source. |
| `amgmcp_query_resource_log` | Query Azure Resource Log through Grafana Azure Monitor data source. |
| `amgmcp_query_resource_metric` | Query Azure Resource Metric values through Grafana Azure Monitor data source. |
| `amgmcp_query_resource_metric_definition` | Query Azure Resource Metric Definitions through Grafana Azure Monitor data source. |
| `amgmcp_dashboard_search` | Search for Grafana dashboards by a query string. Returns a list of matching dashboards with details like title, UID, folder, tags, and URL. |
| `amgmcp_datasource_list` | List all Grafana data sources. |

## MCP configuration

To connect to the AMG-MCP endpoint, you need to configure your MCP client with the appropriate settings. AMG-MCP supports two authentication methods:

- [**Grafana service account token:**](#grafana-service-account-token) A token generated from your Grafana instance (format: `glsa_xxx`)
- [**Entra ID token:**](#entra-id-token) An Azure AD/Entra ID token (e.g., from a managed identity or service principal)

### Grafana service account token

Use a Grafana service account token for authentication. Start by creating a token:

1. In the Grafana instance UI, navigate to **Administration > Service accounts**.
1. [Create a new service account using the appropriate permissions.](./how-to-service-accounts.md#create-a-service-account)
1. [Generate a token](./how-to-service-accounts.md#add-a-service-account-token)
1. Copy the Grafana service account token (format: `glsa_xxx`) and paste into your configuration settings:

    ```json
    {
      "my-grafana-mcp-server": {
        "disabled": false,
        "timeout": 60,
        "type": "streamableHttp",
        "url": "https://my-grafana-d5ggtqegcr2safcp.wcus.grafana.azure.com/api/azure-mcp",
        "headers": {
          "Authorization": "Bearer glsa_xxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxx"
        }
      }
    }
    ```

### Entra ID token

Use an Entra ID token (Azure AD token) for authentication. This approach is useful when using managed identities or service principals.

1. Use the Azure CLI to obtain an Entra ID token associated with the Azure Managed Grafana resource ID:

    ```bash
    az account get-access-token --resource ce34e7e5-485f-4d76-964f-b3d2b16d1e4f --query accessToken -o tsv
    ```

1. Alternatively, use a managed identity to acquire a token programmatically with the Azure Managed Grafana audience `ce34e7e5-485f-4d76-964f-b3d2b16d1e4f`.

    ```json
    {
      "my-grafana-mcp-server": {
        "disabled": false,
        "timeout": 60,
        "type": "streamableHttp",
        "url": "https://my-grafana-d5ggtqegcr2safcp.wcus.grafana.azure.com/api/azure-mcp",
        "headers": {
          "Authorization": "Bearer <entra-id-token>"
        }
      }
    }
    ```

## Examples

The following examples further demonstrate configuring AMG-MCP in your settings.

### Example 1: Visual Studio Code configuration

To configure MCP for Visual Studio Code, use configuration settings similar to the following example.

```json
{
  "<your-grafana-mcp-server-name>": {
    "type": "http",
    "url": "https://<grafana-endpoint>/api/azure-mcp",
    "headers": {
      "Authorization": "Bearer <token>"
    }
  }
}
```

**Configuration parameters:**

| Parameter | Description |
|-----------|-------------|
| `type` | Transport type. Use `http` for remote MCP endpoints. |
| `url` | The AMG-MCP endpoint URL: `https://<grafana-endpoint>/api/azure-mcp` |
| `headers.Authorization` | Bearer token - either a Grafana service account token or an Entra ID token. |

### Example 2: Cline configuration

To configure MCP for Cline, use configuration settings similar to the following example.

```json
{
  "<your-grafana-mcp-server-name>": {
    "disabled": false,
    "timeout": 60,
    "type": "streamableHttp",
    "url": "https://<grafana-endpoint>/api/azure-mcp",
    "headers": {
      "Authorization": "Bearer <token>"
    }
  }
}
```

**Configuration parameters:**

| Parameter | Description |
|-----------|-------------|
| `disabled` | Set to `false` to enable the MCP server connection. |
| `timeout` | Connection timeout in seconds. |
| `type` | Transport type. Use `streamableHttp` for remote MCP endpoints. |
| `url` | The AMG-MCP endpoint URL: `https://<grafana-endpoint>/api/azure-mcp` |
| `headers.Authorization` | Bearer token - either a Grafana service account token or an Entra ID token. |


## Limitation

Currently, AMG-MCP endpoint is included with Azure Managed Grafana instances only in Azure Public Cloud, not in sovereign clouds. 

## Troubleshooting

If you encounter any issues, open an issue in the [Azure Managed Grafana GitHub repo](https://aka.ms/managed-grafana/issues). 

## Next steps

> [!div class="nextstepaction"]
> [Configure MCP for AI Foundry agents](./how-to-configure-mcp-for-ai-foundry.md)
>
> [!div class="nextstepaction"]
> [Enable zone redundancy](./how-to-enable-zone-redundancy.md)