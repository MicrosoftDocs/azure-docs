---
title: Connect to the Azure Monitor dashboards with Grafana remote MCP server
description: Query Azure subscriptions, resources, metrics, logs, traces, and service health from GitHub Copilot through the global Azure Monitor dashboards with Grafana MCP endpoint, without an Azure Managed Grafana instance.
#customer intent: As a developer, I want to connect my MCP client to the global Azure Monitor dashboards with Grafana MCP endpoint so that I can query my Azure monitoring data without deploying an Azure Managed Grafana instance.
author: weng5e
ms.author: wuweng
ms.reviewer: wuweng
ms.date: 10/29/2026
ms.topic: how-to
ms.service: azure-managed-grafana
---

# Connect to the Azure Monitor dashboards with Grafana remote MCP server

> [!TIP]
> To get started quickly, use [one-click connect in Visual Studio Code](https://aka.ms/join-dashboard-mcp). Confirm the installation and sign in with your Microsoft Entra ID user account.

Azure Monitor dashboards with Grafana provides a global remote Model Context Protocol (MCP) endpoint for querying Azure monitoring data. You don't need to create an Azure Managed Grafana resource, deploy an MCP server, or configure a Grafana data source.

Each tool runs as the signed-in Microsoft Entra ID user, in the tenant they signed in to. The user's own Azure permissions determine which subscriptions, resources, and data are accessible.

> [!NOTE]
> This global endpoint is different from the [Azure Managed Grafana remote MCP server](./grafana-mcp-server.md), which is built into each Azure Managed Grafana instance. The global endpoint supports **user authentication only**. It doesn't support Grafana service account tokens, managed identities, or service principals.

## Endpoint

Use the same global endpoint for every connection:

```text
https://mcp.dashboard.azure.com
```

The connection URL doesn't need a Grafana instance name, subscription ID, resource group, or an extra endpoint path. Individual tool calls can still require a subscription ID or an existing Azure resource ID to select the data to query.

## Prerequisites

- An MCP client that supports remote HTTP servers, such as Visual Studio Code with GitHub Copilot or GitHub Copilot CLI.
- A Microsoft Entra ID user account with access to the Azure resources you want to query.
- Appropriate Azure permissions on the target scopes. Monitoring and log queries require their respective read permissions. Signing in to the MCP server doesn't grant extra access.
- For the manual token option, the [Azure CLI](/cli/azure/install-azure-cli) signed in as a **user**.

You don't need to provision an Azure Managed Grafana resource or assign a Grafana role.

## Available MCP tools

The following tools query Azure data. None of them require a Grafana data source UID.

| Tool name | Description |
|-----------|-------------|
| `amgmcp_query_resource_log` | Queries logs by using KQL for Log Analytics workspaces, Application Insights components, and other Azure resources such as Azure Container Registry. |
| `amgmcp_query_resource_metric` | Queries Azure Monitor metric values for one or more resources. |
| `amgmcp_query_application_insights_trace` | Retrieves telemetry for an operation ID and can aggregate a distributed trace across Application Insights components. |
| `amgmcp_query_azure_subscriptions` | Lists Azure subscriptions accessible to the signed-in user. |
| `amgmcp_query_resource_graph` | Queries Azure Resource Graph by using KQL to discover and inventory resources. |
| `amgmcp_query_resource_metric_definition` | Lists available metrics, dimensions, supported aggregations, and time grains for a resource. |
| `amgmcp_query_activity_log` | Queries management-plane events such as resource updates, deployments, and role-based access control (RBAC) changes. |
| `amgmcp_query_resource_health` | Queries current resource availability or historical availability transitions. |
| `amgmcp_query_resource_health_events` | Queries service incidents, planned maintenance, and health advisories. |

Unlike the instance-based [Azure Managed Grafana remote MCP server](./grafana-mcp-server.md), this endpoint doesn't expose Grafana dashboard management, Grafana alert management, or tools for other configured Grafana data sources.

## Connect with GitHub Copilot

You can connect by using either Visual Studio Code with GitHub Copilot or GitHub Copilot CLI.

### Visual Studio Code

Visual Studio Code with GitHub Copilot handles Microsoft Entra ID OAuth sign-in without a manually configured token.

#### One-click setup

1. Open [Install in VS Code](https://aka.ms/join-dashboard-mcp).
1. If your browser asks, allow it to open Visual Studio Code.
1. Review the `azure-monitor-dashboard-mcp` server configuration and select **Install**.
1. Start the server if needed, and then sign in with your Microsoft Entra ID user account when prompted. Use the tenant that contains your Azure resources.
1. Open Copilot Chat in **Agent** mode and enable the server's tools.

The link contains only the server name and HTTP connection settings, not credentials. It adds the Visual Studio Code MCP configuration. It doesn't create an Azure resource or configure GitHub Copilot CLI.

#### Manual setup

1. Add the following server to your workspace's `.vscode/mcp.json` file. If the file already contains servers, merge this entry into its `servers` object.

   ```json
   {
     "servers": {
       "azure-monitor-dashboard-mcp": {
         "type": "http",
         "url": "https://mcp.dashboard.azure.com"
       }
     }
   }
   ```

1. Open the Command Palette, run **MCP: List Servers**, select **azure-monitor-dashboard-mcp**, and start the server.
1. Complete the Microsoft Entra ID user sign-in when prompted. Use the tenant that contains the Azure resources you want to query.
1. Open Copilot Chat in **Agent** mode and enable the server's tools.

The MCP client handles OAuth authentication. You don't need a Grafana endpoint, a service account token, or a local MCP binary.

### GitHub Copilot CLI

1. Start an interactive session with `copilot`, and then enter `/mcp add`.
1. Fill in the configuration form:

   | Field | Value |
   |-------|-------|
   | Server Name | `azure-monitor-dashboard-mcp` |
   | Server Type | **HTTP** |
   | URL | `https://mcp.dashboard.azure.com` |
   | Tools | `*` to enable all tools |

1. Press **Ctrl+S** to save, and then complete the Microsoft Entra ID user sign-in when prompted. Use the tenant that contains the Azure resources you want to query.
1. Enter `/mcp` to view and manage the configured server.

Copilot CLI uses its own MCP configuration. It doesn't read the Visual Studio Code `.vscode/mcp.json` file. For more information, see [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers).

## Connect with an Azure CLI user token

For an MCP client that accepts an `Authorization` header, you can get a Microsoft Entra ID **user** access token by using the Azure CLI.

### Get a token

Sign in interactively as a user and request a token for the Azure Monitor dashboards resource:

```azurecli
az login
az account get-access-token --resource https://dashboard.azure.com --query accessToken -o tsv
```

To sign in to a specific tenant, use `az login --tenant <tenant-id>` instead of `az login`. Don't use `az login --service-principal` or `az login --identity`, because this endpoint supports only user authentication.

The token resource and audience is `https://dashboard.azure.com`. MCP clients that use OAuth can discover the sign-in configuration through the server's OAuth protected resource metadata at `https://mcp.dashboard.azure.com/.well-known/oauth-protected-resource`.

### Configure the bearer token

Send the access token as `Authorization: Bearer <access-token>`.

> [!IMPORTANT]
> Treat the access token as a secret. Don't commit it to source control or include it in chat, screenshots, or shared logs.

For example, the following alternative Visual Studio Code configuration prompts for the token instead of storing it in `.vscode/mcp.json`:

```json
{
  "inputs": [
    {
      "id": "azure-monitor-user-token",
      "type": "promptString",
      "description": "Microsoft Entra user access token for the global Azure Monitor MCP endpoint",
      "password": true
    }
  ],
  "servers": {
    "azure-monitor-dashboard-mcp": {
      "type": "http",
      "url": "https://mcp.dashboard.azure.com",
      "headers": {
        "Authorization": "Bearer ${input:azure-monitor-user-token}"
      }
    }
  }
}
```

Start the server and paste the token into the protected input when prompted. Manually supplied tokens expire, and this configuration doesn't refresh them. Get a fresh token and replace the saved input when needed, or use the OAuth configuration for client-managed authentication.

## Example prompts

After you connect, try these prompts in Copilot Chat or in an interactive GitHub Copilot CLI session. Replace the placeholders with your own subscription, resource, and operation IDs.

```text
List the Azure subscriptions I can access.

Summarize resources by type in subscription <subscription-id>.

List the supported metrics for VM <resource-id>, then show its average CPU over the last hour.

Query logs for Azure Container Registry <resource-id> over the last 24 hours.

Query failed requests in Application Insights <resource-id> over the last 24 hours.

Retrieve the distributed trace for operation <operation-id> in Application Insights <resource-id>.

Show management-plane changes in subscription <subscription-id> over the last day.

Check the current availability of resource <resource-id>.

Show service-health events updated in the last 30 days for subscription <subscription-id>.
```

## Related content

- [Use Azure Monitor dashboards with Grafana](/azure/azure-monitor/visualize/visualize-use-grafana-dashboards)
- [Configure an Azure Managed Grafana remote MCP server](./grafana-mcp-server.md)
- [Configure MCP for AI Foundry agents](./how-to-configure-mcp-for-ai-foundry.md)
