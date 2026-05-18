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


Your agent comes with built-in access to Azure services. It can query Azure Monitor, Application Insights, Log Analytics, and Azure Resource Graph. Connectors extend that reach to external systems: your Kusto clusters, source code repositories, collaboration tools, and custom APIs.

> [!NOTE]
> **Connectors vs. incident platforms:** **Connectors** give your agent access to data and actions - querying logs, sending notifications, reading code. **Incident platforms** are a separate concept: they control where alerts come FROM and how your agent responds to them automatically.
>
> This article covers connectors. For incident platforms, see [Incident platforms](incident-platforms.md).

## What your agent can do without connectors

Even with no connectors configured, your agent has built-in capabilities through its managed identity and Azure RBAC permissions:

| Built-in capability | What it provides |
|---------------------|-----------------|
| **Application Insights** | Query application telemetry, traces, and exceptions |
| **Log Analytics** | Query Log Analytics workspaces |
| **Azure Monitor metrics** | List and query metrics, analyze trends and anomalies |
| **Azure Resource Graph** | Discover and query any Azure resource across subscriptions |
| **ARM / Azure CLI** | Read and modify any Azure resource type |
| **AKS diagnostics** | Run kubectl commands, diagnose Kubernetes issues |

Azure Resource Graph and ARM operations work with **any Azure resource type** including App Services, Container Apps, VMs, networking, storage, and more. If your logs and metrics live in Azure Monitor and Application Insights, your agent can start investigating issues immediately - no connector setup required. Connectors become valuable when you need the agent to reach systems *outside* Azure.

## What connectors provide

Connectors fall into four categories based on what they give your agent:

### Data sources

Query logs, metrics, and telemetry from your data stores.

| Connector | What it provides |
|---|---|
| **Log Analytics** | Connect specific workspaces so your agent has persistent context about your log data and can query them proactively |
| **Application Insights** | Connect specific App Insights resources so your agent has persistent context about your application telemetry |
| **Database query (Azure Data Explorer)** | Run predefined KQL queries against your Kusto clusters |
| **Database indexing (Azure Data Explorer)** | Auto-learn your Kusto schema so the agent can generate queries dynamically |

> [!TIP]
> **Built-in access vs. connectors for Log Analytics and Application Insights**
>
> Your agent can already query *any* Log Analytics workspace or Application Insights resource through its [built-in tools](#what-your-agent-can-do-without-connectors) — no connector needed. Adding a Log Analytics or Application Insights *connector* goes further: it gives your agent persistent awareness of specific workspaces, includes their data in the agent's ambient context, and enables richer MCP-based diagnostics across your connected resources.

### Source code and knowledge

Give your agent context about your systems—code, wikis, and documentation.

| Connector | What it provides |
|-----------|-----------------|
| **GitHub MCP server** | Access to repositories, issues, pull requests, and wiki pages |
| **GitHub OAuth** | GitHub access via OAuth authentication flow |
| **Azure DevOps OAuth** | Azure DevOps access via OAuth authentication |
| **Documentation (Azure DevOps)** | Index and search your Azure DevOps wikis |

With these connectors, your agent can search code for error patterns, read wiki documentation, reference API docs during troubleshooting, and connect incidents to related pull requests.

### Collaboration tools

Let your agent communicate findings through the channels your team already uses.

| Connector | What it provides |
|-----------|-----------------|
| **Send notification (Teams)** | Post findings and updates to Teams channels |
| **Send email (Outlook)** | Email investigation summaries and reports |

### Custom connectors (MCP servers)

MCP (Model Context Protocol) lets you connect your agent to any system including observability platforms, source code repositories, ticketing systems, and custom APIs. Your agent auto-discovers tools from connected servers, monitors connection health with 60-second heartbeats, and recovers from transient failures automatically.

Two transport types cover every deployment model: **Streamable-HTTP** for remote cloud services, and **stdio** for local processes running alongside your agent. Preconfigured partner connectors for GitHub, Datadog, Splunk, New Relic, and more provide one-click setup.

For a complete guide to MCP architecture, transport types, partner connectors, health monitoring, and tool management, see [MCP connectors & tools](mcp-connectors.md).

To set up your first MCP connector, see [Set up MCP connector](mcp-connector.md).

## Browsing and managing connectors

Open the Connectors page (**Builder > Connectors**) to see your connectors organized into collapsible category groups. All groups are expanded by default.

| Category | What it includes |
|----------|-----------------|
| **Code Repository** | GitHub, Azure DevOps, source code, and documentation connectors |
| **Notification** | Teams and Outlook messaging connectors |
| **Telemetry** | Azure Data Explorer, Datadog, Dynatrace, Elasticsearch, New Relic, Splunk, and other monitoring connectors |
| **Other** | Generic MCP servers and connectors that don't fit other categories |

Each category header shows the number of connectors in that group. When you collapse a category, a red badge appears if any connector in that group has a connection issue. You can spot problems at a glance without expanding every section.
Use the toolbar controls to manage your view:

- **Expand all / Collapse all** to toggle all category groups at once.
- **Category filter** to show only connectors in a specific category.
- **Search** to find connectors by name (switches to a flat list for keyword lookup).

Only categories that contain at least one connector are displayed. When you search for a connector by name, the page switches to a flat list view for faster filtering.

## Who can configure connectors

Connector management requires **write** permission on the agent. In practice:

| Role | Can configure connectors? |
|------|--------------------------|
| **SRE Agent Administrator** | Yes |
| **SRE Agent Standard User** | No—view only |
| **SRE Agent Reader** | No—view only |

During setup, some connectors require **OAuth consent** from a user who has the right permissions in the external system (for example, a GitHub org member for GitHub connectors, or an Azure AD admin for Outlook/Teams). This consent is about permissions in the *external* service, not SRE Agent roles.

For connectors that use the agent's **managed identity** (like Azure Data Explorer), an admin of the external system must allow list the identity.

When you configure connectors, all agent users benefit from them automatically. They just ask the agent questions and it uses the available connectors behind the scenes.

## Connectors and custom agents

You can assign specific MCP tools to specialized custom agents. A database troubleshooting custom agent might get Kusto tools, while a deployment custom agent gets GitHub access. This approach keeps each custom agent focused and prevents overwhelming it with too many tools.

Assign tools individually in the portal tool picker, or use wildcard patterns (`connection-id/*`) in YAML to add all tools from a server at once. For details on tool assignment and wildcard syntax, see [MCP connectors & tools](mcp-connectors.md#how-tools-reach-your-agents).

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

| Resource | Why it matters |
|----------|-------------------|
| [Incident platforms](incident-platforms.md) | How your agent receives and responds to incidents automatically |
| [Connect source code](connect-source-code.md) | Set up GitHub or Azure DevOps connectors |
| [Set up an MCP connector](mcp-connector.md) | Add custom MCP servers |
| [Custom Agents](sub-agents.md) | Create specialized agents with focused connector access |
| [Permissions](permissions.md) | Configure Azure resource access for your agent |
