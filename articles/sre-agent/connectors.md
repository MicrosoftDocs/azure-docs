---
title: Connectors in Azure SRE Agent
description: Extend your agent's capabilities to external data sources, collaboration tools, and custom APIs using connectors.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/15/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: connectors, integrations, mcp, outlook, teams, data sources, status, health, monitoring, auto-recovery, wildcard, mcp tools
#customer intent: As an SRE, I want to connect my agent to external systems so that it can query data, take actions, and collaborate across my toolchain.
---

# Connectors in Azure SRE Agent
<!-- > [!VIDEO <PATH_TO_VIDEO>/From_Chat_to_Action.mp4] -->

Your agent comes with built-in access to Azure services. It can query Azure Monitor, Application Insights, Log Analytics, and Azure Resource Graph out of the box. Connectors extend that reach to external systems: your Kusto clusters, source code repositories, collaboration tools, and custom APIs.

:::image type="content" source="media/connectors/connectors-flow.svg" alt-text="Diagram showing how connectors bridge the agent to external systems like GitHub, Kusto, Teams, and custom APIs.":::

> [!NOTE]
> **Connectors vs. incident platforms**
>
> **Connectors** give your agent access to data and actions, such as querying logs, sending notifications, and reading code. **Incident platforms** are a separate concept: they control where alerts come from and how your agent responds to them automatically.
>
> This article covers connectors. For incident platforms, see [Incident platforms](incident-platforms.md).

## What your agent can do without connectors

Even with no connectors configured, your agent has built-in capabilities through its managed identity and Azure RBAC permissions.

| Built-in capability | What it provides |
|---|---|
| **Application Insights** | Query application telemetry, traces, and exceptions |
| **Log Analytics** | Query Log Analytics workspaces |
| **Azure Monitor metrics** | List and query metrics, analyze trends, and anomalies |
| **Azure Resource Graph** | Discover and query any Azure resource across subscriptions |
| **Azure Resource Manager / Azure CLI** | Read and modify any Azure resource type |
| **AKS diagnostics** | Run kubectl commands, diagnose Kubernetes issues |

Azure Resource Graph and Azure Resource Manager operations work with any Azure resource type, including App Services, Container Apps, VMs, networking, storage, and more. If your logs and metrics live in Azure Monitor and Application Insights, your agent can start investigating problems immediately with no connector setup required. Connectors become valuable when you need the agent to reach systems *outside* Azure.

## What connectors provide

Connectors fall into four categories based on what they give your agent.

### Data sources

Query logs, metrics, and telemetry from your data stores.

| Connector | What it provides |
|---|---|
| **Log Analytics** | Connect specific workspaces so your agent has persistent context about your log data and can query them proactively |
| **Application Insights** | Connect specific App Insights resources so your agent has persistent context about your application telemetry |
| **Database query (Azure Data Explorer)** | Run predefined KQL queries against your Kusto clusters |
| **Database indexing (Azure Data Explorer)** | Autolearn your Kusto schema so the agent can generate queries dynamically |

> [!TIP]
> **Built-in access vs. connectors for Log Analytics and Application Insights**
>
> Your agent can already query *any* Log Analytics workspace or Application Insights resource through its [built-in tools](#what-your-agent-can-do-without-connectors) — no connector needed. Adding a Log Analytics or Application Insights *connector* goes further: it gives your agent persistent awareness of specific workspaces, includes their data in the agent's ambient context, and enables richer MCP-based diagnostics across your connected resources.

### Source code and knowledge

Give your agent context about your systems, including code, wikis, and documentation.

| Connector | What it provides |
|---|---|
| **GitHub MCP server** | Access to repositories, issues, pull requests, and wiki pages |
| **GitHub OAuth** | GitHub access via OAuth authentication flow |
| **Azure DevOps OAuth** | Azure DevOps access via OAuth authentication |
| **Documentation (Azure DevOps)** | Index and search your Azure DevOps wikis |

By using these connectors, your agent can search code for error patterns, read wiki documentation, reference API docs during troubleshooting, and connect incidents to related pull requests.

### Collaboration tools

Let your agent communicate findings through the channels your team already uses.

| Connector | What it provides |
|---|---|
| **Send notification (Teams)** | Post findings and updates to Teams channels |
| **Send email (Outlook)** | Email investigation summaries and reports |

### Custom connectors (MCP servers)

By using MCP (Model Context Protocol), you can connect your agent to any system: on-premises databases, cross-cloud applications, proprietary APIs, or third-party platforms like Datadog, Splunk, Grafana, or Jira.

Browse available servers at [Azure MCP Center](https://mcp.azure.com). When you add MCP tools to custom agents, use the [wildcard pattern](#add-all-tools-from-an-mcp-server-wildcard) to add all tools from a server at once.

## MCP connector health monitoring

**Applies to**: version 26.1.25.0 and later

Your agent continuously monitors the health of every MCP server connection. Each connector in the portal displays a real-time status indicator so you can see at a glance whether your external tools are reachable.

| Status | What it means | Indicator |
|---|---|---|
| **Connected** | Server is healthy and tools are ready to use | Green checkmark |
| **Disconnected** | Temporary connection loss; your agent attempts automatic recovery | Red circle |
| **Failed** | Server can't be reached, or an unrecoverable error occurred; check your configuration | Red error icon |
| **Initializing** | Connection is being established | Yellow indicator |
| **Not Available** | No running agent instance is available; status can't be determined | Gray question mark |

Go to **Builder** > **Connectors** to see all your connectors with their current status.

:::image type="content" source="media/connectors/connectors-status-indicators.png" alt-text="Screenshot of connectors list showing status indicators for each MCP server connection.":::

For connectors in a **Failed**, **Error**, or **Not Available** state, a **See details** link appears in the status column. Select it to view diagnostic information including the error message, the number of tools loaded, and the last heartbeat timestamp.

### Automatic recovery

Your agent doesn't just report broken connections. It recovers from them when possible.

- **Heartbeat monitoring**: Your agent pings each MCP server every 60 seconds to verify it's still reachable.
- **Transient failure recovery**: If a connection drops due to a network blip, the next successful heartbeat automatically restores it to Connected.
- **Pre-execution health check**: Before your agent uses any MCP tool, it validates the connection and attempts to reconnect if the server is temporarily unreachable.

> [!TIP]
> **Connections persist through failures**
>
> If an MCP server goes offline, the connector stays visible in your portal with its error status. It doesn't silently disappear. You can see exactly what went wrong and fix the configuration without re-creating the connector.

### When autorecovery can't help

The following table describes scenarios where automatic recovery can't resolve the issue.

| Situation | What happens | What to do |
|---|---|---|
| Network blip | Your agent reconnects automatically on next heartbeat | Nothing; recovery is automatic |
| Server temporarily down | Status shows Disconnected, recovers when server returns | Wait for the server to come back online |
| Wrong URL or credentials | Status shows Failed | Update the connector configuration with the correct values |
| Server permanently removed | Status shows Failed | Delete and re-create the connector |
| Agent not running | Status shows Not Available | Start the agent to restore status monitoring |

When your agent tries to use a tool from a disconnected MCP server, it provides a clear error explaining what went wrong (for example, "Connection is disconnected and reconnection failed."). Your agent doesn't silently fail or produce incorrect results.

## Who can configure connectors

Connector management requires **write** permission on the agent. The following table shows which roles can configure connectors.

| Role | Can configure connectors? |
|---|---|
| **SRE Agent Administrator** | Yes |
| **SRE Agent Standard User** | No (view only) |
| **SRE Agent Reader** | No (view only) |

During setup, some connectors require **OAuth consent** from a user who has the appropriate permissions in the external system (for example, a GitHub org member for GitHub connectors, or a Microsoft Entra admin for Outlook/Teams). This consent is about permissions in the *external* service, not SRE Agent roles.

For connectors that use the agent's **managed identity** (like Azure Data Explorer), an admin of the external system must allow list the identity.

Once configured, all agent users benefit from connectors automatically. They just ask the agent questions and it uses the available connectors behind the scenes.

## Connectors and custom agents

You can assign specific MCP tools to specialized custom agents. A database troubleshooting custom agent might get Kusto tools, while a deployment custom agent gets GitHub access. This approach keeps each custom agent focused and prevents overwhelming it with too many tools.

### Add MCP tools individually

In the portal, go to **Builder** > **Custom agent builder**, create or edit a custom agent, and select **Choose tools** under Advanced settings. The tool picker displays tools grouped by MCP connection. Select the ones your custom agent needs.

In YAML, list each tool by its full name:

```yaml
mcp_tools:
  - azure-data-explorer_kusto_query
  - azure-data-explorer_kusto_table_list
  - azure-data-explorer_kusto_table_schema
```

### Add all tools from an MCP server (wildcard)

**Applies to**: version 26.2.9.0 and later

When an MCP server exposes many tools and your custom agent needs all of them, use the wildcard pattern instead of listing each tool individually:

```yaml
mcp_tools:
  - azure-data-explorer/*
```

The `{connection-id}/*` pattern adds every tool from that MCP connection. Your agent expands the wildcard at startup. For example, `azure-data-explorer/*` resolves to all tools registered under a connection named `azure-data-explorer` (the prefilled default for the Azure MCP with Kusto connector as of release 26.4.16.0). Substitute whatever name you gave your connector.

You can combine wildcards with individual tool names:

```yaml
mcp_tools:
  - azure-data-explorer/*  # All tools from the Kusto connection
  - grafana-mcp_dashboard  # One specific tool from Grafana
```

> [!NOTE]
> **Wildcard syntax**
>
> The pattern must use `{connection-id}/*` with the forward slash. Patterns like `azure-data-explorer*` (without the slash) are treated as exact tool names, not wildcards.

The following table compares individual tool selection and the wildcard approach.

| Approach | When to use |
|---|---|
| **Individual tools** | You want precise control over which tools a custom agent can access |
| **Wildcard (`connection-id/*`)** | You trust the MCP server and want all its tools, including any added later |
| **Mixed** | You want all tools from one server, plus specific tools from another |

**Why use the wildcard?** When an MCP server adds new tools, the wildcard picks them up automatically without reconfiguring your custom agent. Individual tool selection gives you precise control. The wildcard gives you automatic coverage.

### When MCP tools aren't ready yet

If an MCP server isn't ready when your agent starts, your agent can't access tools from that server. Your agent handles this condition gracefully. It defers custom agents with unresolved wildcards or missing tools and automatically loads them once your agent establishes the MCP connection. You don't need to take any manual action.

For more information, see [Custom Agents](sub-agents.md).

## Next step

> [!div class="nextstepaction"]
> [Set up an MCP connector](./mcp-connector.md)

## Related content

- [Incident platforms](incident-platforms.md): Learn how your agent receives and responds to incidents automatically.
- [Connect source code](connect-source-code.md): Set up GitHub or Azure DevOps connectors.
- [Custom Agents](sub-agents.md): Create specialized agents with focused connector access.
- [Permissions](permissions.md): Configure Azure resource access for your agent.
