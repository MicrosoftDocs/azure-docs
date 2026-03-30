---
title: MCP connectors and tools in Azure SRE Agent
description: Extend your agent to any external system including observability platforms, source code, ticketing systems, and custom APIs which uses the Model Context Protocol.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: mcp, model context protocol, connectors, tools, extensibility, datadog, splunk, github, new relic, integrations, custom, stdio, streamable-http
#customer intent: As an SRE, I want to connect my agent to external systems through MCP so that it can query data and use tools from any platform during investigations.
---

# MCP connectors and tools in Azure SRE Agent

> [!TIP]
> - Connect any MCP-compatible service, such as Datadog, Splunk, GitHub, New Relic, and more, in minutes.
> - Select which connector tools your agent can call directly. No custom agent needed for simple tool use.
> - Your agent autodiscovers tools from connected servers and monitors connection health.
> - A tool capacity bar shows your budget (80 tools per agent) with color-coded warnings.
> - Two transport types: Streamable-HTTP for remote services, stdio for local processes.

## The problem: your agent can't see half your stack

Your agent connects natively to Azure services such as Monitor, Application Insights, Log Analytics, and Resource Graph. But your stack extends beyond Azure: Datadog dashboards, Splunk log indices, GitHub repositories, PagerDuty alerts, and custom internal APIs.

During an incident, that gap forces you to manually bridge systems. You query each platform separately, copy data between browser tabs, and correlate findings by hand.

:::image type="content" source="media/mcp-connectors/mcp-architecture.svg" alt-text="MCP architecture diagram showing two transport types (Streamable-HTTP for remote services, stdio for local processes), preconfigured partner connectors, authentication methods, and tool assignment to custom agents." lightbox="media/mcp-connectors/mcp-architecture.svg":::

<!-- Gap: The following section (through the Azure MCP Center note) is reconstructed from
     context clues in the diff — the architecture-diagram alt-text, the TL;DR bullet points,
     and the connectors.md reference file. Review against the original MDX source for accuracy. -->

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/) is an open standard that AI agents use to communicate with external tools through a unified interface. Instead of building custom integrations for each platform, your agent speaks MCP. Any MCP-compatible server becomes a data source.

### Transport types

MCP supports two transport mechanisms depending on where your server runs.

#### Streamable-HTTP

Use Streamable-HTTP for remote services hosted on a URL. This transport is the most common option for cloud-hosted MCP servers like Datadog, Splunk, and GitHub.

- Your agent connects to the server over HTTPS.
- Authentication uses an API key, OAuth token, or managed identity.
- Transient failures recover automatically.

#### stdio (standard I/O)

Use stdio for local processes that run alongside your agent. Your agent launches the MCP server as a child process and communicates through standard input/output streams.

- Useful for on-premises tools or custom scripts.
- No network configuration required.
- The server runs in the same environment as your agent.

### Partner connectors

Partner connectors are preconfigured MCP servers for popular platforms. They include:

- **Preset authentication method**: The connector knows whether to use API keys, OAuth, or managed identity.
- **Verified tool definitions**: Tools are tested and documented.
- **Automatic discovery**: When the partner adds new tools, your agent discovers them on the next connection.

### Authentication

MCP connectors support multiple authentication methods depending on the server.

| Method | When to use |
|---|---|
| **API key** | Services that use static tokens |
| **OAuth 2.0** | Services that require user authorization flows |
| **Custom headers** | Services with custom authentication schemes |
| **None** | Public MCP servers with no authentication |

For partner connectors, the authentication method is preconfigured and locked. You enter the required credentials.

> [!NOTE]
> Browse [Azure MCP Center](https://mcp.azure.com) for verified MCP servers for Azure services.

<!-- End of reconstructed gap -->

## How tools reach your agents

MCP tools can reach your agent in two ways:

1. **Agent tools**: Select tools during connector setup or editing. These tools are available directly in the main conversation. There's no custom agent needed.
1. **Custom agent tools**: Assign tools to specific [custom agents](sub-agents.md) for focused specialists with domain expertise.

### Agent tools

**Applies to**: version 26.3.74.0 and later

When you create or edit an MCP connector, a tool selection step lets you choose which tools are visible to your agent. Selected tools are injected into your agent's tool list and kept in sync. When you add, remove, or update connectors, your agent's tools refresh automatically.

**During connector creation:** After your connector connects successfully, a **Select tools** step appears. The process preselects all discovered tools up to remaining capacity. Select **Done** to save or **Skip** to add tools later.

**For existing connectors:** Edit any MCP connector to find the **MCP Tools** section at the bottom of the dialog. Check or uncheck tools to control which ones your agent can call.

> [!TIP]
> **No custom agent required**
>
> By using agent tool visibility, you can connect an MCP server, select tools, and start asking questions.

### Custom agent tools

For focused specialists, assign MCP tools to specific [custom agents](sub-agents.md) through the portal or YAML.

**Portal:** In **Builder > Agent Canvas**, edit an agent, go to **Advanced settings > Tools**, and then select **Choose tools**.

**YAML wildcards:**

**Applies to**: version 26.2.9.0 and later

```yaml
mcp_tools:
  - datadog-mcp/*        # All tools from this connection
  - github_search_code   # One specific tool
```

The `{connection-id}/*` pattern adds every tool from that server, including tools added later. The forward slash is required.

| Approach | When to use |
|---|---|
| **Individual tools** | Precise control over tool access |
| **Wildcard (`connection-id/*`)** | All tools from a server, including future ones |
| **Mixed** | All from one server, specific picks from another |

> [!NOTE]
> **Agent and custom agent tools are independent**
>
> The same tool can be visible to both your agent and a custom agent. There's no conflict. The tool is available in both contexts.

For a full walkthrough, see [Set up MCP tools](mcp-connector.md).

## Tool selection and capacity

**Applies to**: version 26.3.74.0 and later

Each agent can use up to **80 tools** (native and MCP combined). Use the tool selection UI to manage this budget across connectors.

### Capacity indicator

The tool picker shows a progress bar with your current tool count.

| Tool count | Bar color | Meaning |
|---|---|---|
| **0–56** (≤ 70%) | Blue | Plenty of room |
| **57–72** (71–90%) | Yellow | Approaching the limit |
| **73–80** (> 90%) | Red | Near or at capacity |

A hint below the bar reads: **"Maximum of 80 tools allowed to avoid degrading agent performance."**

### Behavior at capacity

When your selected tools reach the 80-tool limit:

- **Unchecked tools** become disabled. You can't add more tools until you remove some.
- **Already-checked tools** remain enabled. You can always deselect tools to free capacity.
- **Select all** caps at remaining capacity - if you have room for 10 more tools and select **Select all**, only 10 are selected.

The tool count spans all connectors. If Connector A has 60 tools visible to your agent, Connector B can add up to 20 more.

## Connection health monitoring

**Applies to**: version 26.1.25.0 and later

Your agent continuously monitors every MCP connection. Each connector displays a real-time status indicator so you can see at a glance whether your external tools are reachable.

<!-- Gap: The status table intro and the first row (Connected) are reconstructed from the
     connectors.md reference file, which has the same table structure. -->

| Status | What it means | Action |
|---|---|---|
| **Connected** | Active and healthy | None |
| **Disconnected** | Temporary loss. Autorecovery in progress | Usually none. Wait for next heartbeat |
| **Failed** | Unrecoverable error | Check URL, credentials, network |
| **Initializing** | Connection being established | Wait |
| **Error** | No running agent instance | Start the agent |

Your agent pings each server every 60 seconds. Transient failures recover automatically on the next successful heartbeat. Before the agent invokes any MCP tool, your agent validates the connection and attempts reconnection if needed.

<!-- Gap: The following tip and troubleshooting table are reconstructed from the
     connectors.md reference file, which has parallel content. -->

> [!TIP]
> **Connections persist through failures**
>
> If an MCP server goes offline, the connector stays in your portal with its error status. You can see exactly what went wrong and fix the configuration without re-creating the connector.

### Troubleshooting connection problems

The following table describes common connection problems and recommended actions.

| Situation | What happens | What to do |
|---|---|---|
| Network blip | Your agent reconnects automatically on next heartbeat | Nothing. Recovery is automatic |
| Server temporarily down | Status shows Disconnected, recovers when server returns | Wait for the server to come back online |
| Wrong URL or credentials | Status shows Failed | Update the connector configuration |
| Server permanently removed | Status shows Failed | Delete and re-create the connector |
| Agent not running | Status shows Error | Start the agent |

<!-- End of reconstructed gap -->

## How this approach differs from traditional integrations

**Unlike static tool configurations**, your agent discovers tools dynamically. When an MCP server adds a new tool, your agent picks it up automatically. Wildcard patterns (`datadog-mcp/*`) ensure new tools are available without reconfiguration.

**Unlike scripts and runbooks**, MCP connections are self-healing. Your agent monitors every connection with a 60-second heartbeat, autorecovers from transient failures, and defers custom agent loading until connections establish.

## Before and after

|  | Before MCP | After MCP |
|---|---|---|
| **Tools during investigation** | 4+ browser tabs open | Single conversation |
| **Using connector tools** | Create custom agent, assign tools. Invoke via `/agent` | Select tools on connector. Ask your agent directly. |
| **Data correlation** | Manual copy-paste between systems | Agent correlates across all connected systems |
| **Time to gather context** | 15&ndash;30 minutes | 2&ndash;5 minutes |
| **Adding new tools** | Wait for built-in integration or write custom scripts | Connect any MCP server in minutes |
| **Tool capacity management** | Hit 80-tool limit with cryptic server error | Capacity bar with color-coded warnings |
| **Failure handling** | Scripts break when APIs change | Health monitoring with autorecovery |

## Get started

| Resource | What you learn |
|---|---|
| [Set up an MCP connector](mcp-connector.md) | Step-by-step tutorial for connecting remote and local MCP servers |
<!-- | [Install a plugin from the marketplace](<PLACEHOLDER_PATH>) | Import skills and MCP server configs from community plugin marketplaces | -->

## Related content

- [External observability](diagnose-observability.md): Use MCP connectors to query Datadog, Splunk, and other platforms during investigations.
- [Agent playground](agent-playground.md): Test custom agents with MCP tools before production use.
- [Scheduled tasks](scheduled-tasks.md): Combine MCP tools with scheduled automation.
- [Workflow automation](workflow-automation.md): Build automated workflows using MCP tools.
- [Connectors](connectors.md): How all connectors work in SRE Agent.
- [Tools](tools.md): The full tool taxonomy.
- [Custom agents](sub-agents.md): Create specialists with focused tool sets.
<!-- TODO: Add link to Plugin Marketplace when the page is created. -->
