---
title: Configure an Azure Managed Grafana Remote MCP server
description: Discover MCP tools for Azure Managed Grafana. Query Application Insights, Azure Data Explorer, and more with secure authentication and easy setup.
#customer intent: As a developer, I want to configure my application to interact with the Azure Managed Grafana MCP endpoint so that I can programmatically manage my Azure Managed Grafana instance.
author: weng5e
ms.author: wuweng
ms.reviewer: malev
ms.date: 05/12/2026
ms.topic: concept-article
ms.service: azure-managed-grafana
---

# Configure an Azure Managed Grafana remote MCP server

Every Azure Managed Grafana instance includes a built-in Model Context Protocol (MCP) server endpoint.

The Azure Managed Grafana MCP endpoint allows tools and applications to interact programmatically with the Grafana instance that's using the MCP. The Azure Managed Grafana MCP endpoint uses the same authentication mechanism as the Grafana instance, supporting both Microsoft Entra ID and the Grafana service account token.

## Endpoint path

The Azure Managed Grafana MCP endpoint path format is `https://<grafana-endpoint>/api/azure-mcp`.

## Available MCP tools

Azure Managed Grafana MCP provides the following tools for interacting with Azure Managed Grafana:

| Tool name | Description |
|-----------|-------------|
| `amgmcp_dashboard_search` | Searches for Grafana dashboards by a query string. Returns a list of matching dashboards with details like title, UID, folder, tags, and URL. |
| `amgmcp_dashboard_inspect` | Inspects a Grafana dashboard. Supports summary mode, panel queries mode (with optional template variable substitution), and property mode (surgical JSONPath reads against the raw dashboard JSON). |
| `amgmcp_dashboard_update` | Creates, replaces, or patches a Grafana dashboard. Supports full dashboard JSON for create/replace, or targeted patch operations (add, replace, remove) using JSONPath for surgical modifications. |
| `amgmcp_prometheus_query` | Queries Prometheus using a PromQL expression. Supports instant queries (single point) and range queries (time range). |
| `amgmcp_prometheus_list_metric_names` | Lists metric names from a Prometheus data source. Supports regex filtering and pagination. Call this first to discover metrics before querying. |
| `amgmcp_prometheus_list_label_names` | Lists label names from a Prometheus data source. Supports filtering by series selector and time range. |
| `amgmcp_prometheus_query_histogram` | Computes histogram percentiles from Prometheus histogram metrics. Builds `histogram_quantile` PromQL from metric name, percentile, and optional labels. |
| `amgmcp_pulse_check` | Performs automated health checks across Azure resources (PostgreSQL, Cosmos DB, AKS, Storage, Key Vault, VMs, SQL Database, App Service Plans, Redis, Logic Apps). Identifies resources with abnormal metrics such as high CPU, RU saturation, memory pressure, or degraded availability. Also generates usage summaries for storage accounts and key vaults. Returns a prioritized summary of findings. |
| `amgmcp_query_resource_graph` | Queries Azure Resource Graph through a Grafana Azure Monitor data source. |
| `amgmcp_query_resource_metric` | Queries Azure resource metric values through a Grafana Azure Monitor data source. |
| `amgmcp_query_resource_metric_definition` | Queries Azure resource metric definitions through a Grafana Azure Monitor data source. |
| `amgmcp_query_resource_log` | Queries an Azure resource log through a Grafana Azure Monitor data source. |
| `amgmcp_query_azure_subscriptions` | Lists all the Azure subscriptions that the Grafana Azure Monitor data source can access. |
| `amgmcp_insights_get_failures` | Gets failure insights. Returns failure summary data from Application Insights, such as failed requests, failed dependencies, and exceptions. |
| `amgmcp_insights_get_agents` | Gets generative AI agent insights. Returns information related to generative AI agents from Application Insights, such as agent invocations, token usage, and latency. Queries data following *OpenTelemetry for generative AI* semantic conventions, for example, data emitted by OpenAI Python API, Google Cloud AI Agent Development Kit, Microsoft AI Foundry / Agent Toolkits, Microsoft Agent Framework, LangChain / LangGraph. |
| `amgmcp_query_application_insights_trace` | Queries an Application Insights trace through a Grafana Azure Monitor data source. When trace data is stored in multiple Application Insights instances, this tool aggregates the data. |
| `amgmcp_kusto_get_metadata` | Gets the metadata for connected Azure Data Explorer (Kusto) clusters. Lists all Azure Data Explorer data sources, and for each data source, gets the URL of the cluster, databases, and schema. |
| `amgmcp_kusto_query` | Queries data in an Azure Data Explorer (Kusto) cluster. |
| `amgmcp_mssql_get_metadata` | Gets the metadata for all connected Microsoft SQL Server data sources. Lists the databases, tables, and column schemas for each SQL Server data source. |
| `amgmcp_mssql_query` | Queries data in a SQL Server data source. |
| `amgmcp_query_resource_health` | Queries Azure Resource Health availability status for a subscription, resource group, or single resource. Supports current status and historical availability transitions. |
| `amgmcp_query_resource_health_events` | Queries Azure Resource Health service-health events (service issues, planned maintenance, health advisories, security advisories, RCAs, emerging issues, billing events) at subscription or single-resource scope. |
| `amgmcp_query_activity_log` | Queries Azure Activity Log to investigate management-plane operations (creates, deletes, updates, RBAC changes, deployments, etc.) on Azure resources. |
| `amgmcp_cost_analysis` | Shows Azure cost analysis. Breaks down costs by resource type, region, and service category (MeterCategory). Supports querying a single subscription or all accessible subscriptions. |
| `amgmcp_datasource_list` | Lists all Grafana data sources. Optionally filters by data source type. |

## MCP configuration

To connect to the Azure Managed Grafana MCP endpoint, you need to configure your MCP client with the appropriate settings. Azure Managed Grafana MCP supports the following authentication methods:

- [Grafana service account token](#grafana-service-account-token): A token generated from your Grafana instance. The format is `glsa_xxx`.
- [Microsoft Entra ID token](#entra-id-token): A Microsoft Entra ID token (for example, from a managed identity or service principal).
- [OAuth authentication with Microsoft Entra ID](#oauth-authentication-with-entra-id): An interactive browser-based login flow. The MCP client handles the OAuth flow automatically. Supported by Visual Studio Code with GitHub Copilot and Visual Studio with GitHub Copilot.

### Grafana service account token

Use a Grafana service account token for authentication. Start by creating a token:

1. In the Grafana instance UI, go to **Administration** > **Service accounts**.

1. Create a new service account [by using the appropriate permissions](./how-to-service-accounts.md#create-a-service-account).

1. [Generate](./how-to-service-accounts.md#add-a-service-account-token) a token.

1. Copy the Grafana service account token with the format `glsa_xxx`. Paste it into your configuration settings:

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

### <a name = "entra-id-token"></a> Microsoft Entra ID token

Use a Microsoft Entra ID token for authentication. This approach is useful when you're using managed identities or service principals.

- Use the Azure CLI to obtain a Microsoft Entra ID token that's associated with the Azure Managed Grafana resource ID:

    ```bash
    az account get-access-token --resource ce34e7e5-485f-4d76-964f-b3d2b16d1e4f --query accessToken -o tsv
    ```

- Alternatively, use a managed identity to programmatically acquire a token with the Azure Managed Grafana audience `ce34e7e5-485f-4d76-964f-b3d2b16d1e4f`.

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

### <a name = "oauth-authentication-with-entra-id"></a> OAuth authentication with Microsoft Entra ID

Azure Managed Grafana MCP supports OAuth authentication by using Microsoft Entra ID. No manual token configuration is needed. The following clients are supported:

- Visual Studio Code with GitHub Copilot
- Visual Studio with GitHub Copilot

In your Visual Studio Code or Visual Studio MCP configuration, add the following setting. Replace `<grafana-endpoint>` with your Grafana endpoint.

```json
{
  "servers": {
    "my-grafana-mcp-server": {
      "type": "http",
      "url": "https://<grafana-endpoint>/api/azure-mcp"
    }
  }
}
```

When GitHub Copilot connects to the MCP server, it prompts you to sign in with your Microsoft Entra ID account.

## Examples

The following examples demonstrate configuring Azure Managed Grafana MCP by client type.

### Example 1: Visual Studio Code with OAuth flow

Visual Studio Code with GitHub Copilot supports OAuth authentication with Microsoft Entra ID. No manual token configuration is needed. The MCP client handles the OAuth flow automatically and prompts you to sign in with your Microsoft Entra ID account.

```json
{
  "<your-grafana-mcp-server-name>": {
    "type": "http",
    "url": "https://<grafana-endpoint>/api/azure-mcp"
  }
}
```

#### Configuration parameters

| Parameter | Description |
|-----------|-------------|
| `type` | Transport type. Use `http` for remote MCP endpoints. |
| `url` | The Azure Managed Grafana MCP endpoint URL: `https://<grafana-endpoint>/api/azure-mcp`. |

### Example 2: Visual Studio Code with a service account token

To configure Visual Studio Code with a Grafana service account token, add the `Authorization` header with the token.

```json
{
  "<your-grafana-mcp-server-name>": {
    "type": "http",
    "url": "https://<grafana-endpoint>/api/azure-mcp",
    "headers": {
      "Authorization": "Bearer glsa_xxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxx"
    }
  }
}
```

#### Configuration parameters

| Parameter | Description |
|-----------|-------------|
| `type` | Transport type. Use `http` for remote MCP endpoints. |
| `url` | The Azure Managed Grafana MCP endpoint URL: `https://<grafana-endpoint>/api/azure-mcp`. |
| `headers.Authorization` | Bearer token using a Grafana service account token (`glsa_xxx`). |

### Example 3: Claude Code with a service account token

To configure MCP for Claude Code, use configuration settings similar to the following example. Use a Grafana service account token for authentication.

```json
{
  "<your-grafana-mcp-server-name>": {
    "disabled": false,
    "timeout": 60,
    "type": "streamableHttp",
    "url": "https://<grafana-endpoint>/api/azure-mcp",
    "headers": {
      "Authorization": "Bearer glsa_xxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxx"
    }
  }
}
```

#### Configuration parameters

| Parameter | Description |
|-----------|-------------|
| `disabled` | Set to `false` to enable the MCP server connection. |
| `timeout` | Connection timeout in seconds. |
| `type` | Transport type. Use `streamableHttp` for remote MCP endpoints. |
| `url` | The Azure Managed Grafana MCP endpoint URL: `https://<grafana-endpoint>/api/azure-mcp`. |
| `headers.Authorization` | Bearer token using a Grafana service account token (`glsa_xxx`). |

### Example 4: OpenClaw with a service account token

To configure MCP for OpenClaw, use the `openclaw mcp set` command with a Grafana service account token.

```bash
openclaw mcp set mcp '{"url":"https://<grafana-endpoint>/api/azure-mcp","transport":"streamable-http","headers":{"Authorization":"Bearer glsa_xxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxx"}}'
```

Then restart the gateway to pick up the configuration:

```bash
openclaw gateway restart
```

## Limitations

- Currently, the Azure Managed Grafana MCP endpoint is included with Azure Managed Grafana for only Azure public cloud instances, not for sovereign clouds.
- Connecting to Azure Managed Grafana through a private endpoint isn't supported currently.

## Troubleshooting

If you encounter any problems, open an issue in the [Azure Managed Grafana GitHub repo](https://aka.ms/managed-grafana/issues).

## Related content

- [Configure MCP for AI Foundry agents](./how-to-configure-mcp-for-ai-foundry.md)
- [Enable zone redundancy](./how-to-enable-zone-redundancy.md)
