---
title: MCP connectors and tools in Azure SRE Agent
description: Extend your agent to any external system including observability platforms, source code, ticketing systems, and custom APIs which uses the Model Context Protocol.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: mcp, model context protocol, connectors, tools, extensibility, datadog, splunk, github, new relic, integrations, custom, stdio, streamable-http
#customer intent: As an SRE, I want to connect my agent to external systems through MCP so that it can query data and use tools from any platform during investigations.
---

# MCP connectors and tools in Azure SRE Agent


> [!TIP]
> - Connect any MCP-compatible service - Datadog, Splunk, GitHub, New Relic, and more - in minutes.
> - Select which connector tools your agent can call directly - no custom agent needed for simple tool use.
> - Your agent auto-discovers tools from connected servers and monitors connection health.
> - Tool capacity bar shows your budget (80 tools per agent) with color-coded warnings.
> - Two transport types: Streamable-HTTP for remote services, stdio for local processes.

## The problem: your agent can't see half your stack

Your agent has deep built-in access to Azure services - Application Insights, Log Analytics, Azure Monitor, Resource Graph. But your operational toolchain doesn't stop at Azure. Metrics live in Datadog. Security logs live in Splunk. Source code lives in GitHub.

During an incident, that gap forces you to manually bridge systems - querying Datadog in one tab, correlating with Azure Monitor in another, copy-pasting findings between tools. Your agent is powerful, but it only sees the Azure side.

## How MCP connectors work

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open standard for connecting AI agents to external tools. An MCP server wraps any service - a database, an API, a monitoring platform - and exposes its capabilities as tools your agent can discover and invoke.

When you connect an MCP server to your agent:

1. **Auto-discovery** - Your agent calls the server's tool listing and immediately knows what tools are available.
1. **Namespaced registration** - Each tool is registered with a prefixed name (for example, `my-datadog_list_metrics`) so tools from different servers never conflict.
1. **Health monitoring** - Your agent pings each server every 60 seconds, auto-recovers from transient failures, and shows real-time connection status.
1. **Dynamic updates** - When a server adds new tools, your agent detects them automatically within 5 minutes.

## Two transport types

MCP supports two ways to connect your agent to external tools:

| Transport | How it works | Best for | Example |
|-----------|-------------|----------|---------|
| **Streamable-HTTP** | Your agent connects to a remote URL endpoint | Cloud-hosted services, SaaS platforms | Datadog, GitHub, New Relic |
| **Stdio** | Your agent runs a local process that communicates via stdin/stdout | Custom servers, npm packages, sidecar processes | npx-based servers, Python MCP servers |

### Streamable-HTTP (remote services)

Connect to any MCP server accessible through a URL. Provide the endpoint and authentication credentials - either a Bearer token or custom headers.

### Stdio (local processes)

Run an MCP server as a process inside your agent's cloud environment. Provide the command, arguments, and optional environment variables. Your agent manages the process lifecycle - starting it on connection, monitoring health, and restarting on failure.

> [!NOTE]
> Stdio MCP servers run inside the agent's container. Available runtimes:
>
> | Command | Runtime |
> |---------|---------|
> | `npx`, `node` | Node.js 20 |
> | `python`, `python3` | Python 3.12 |
> | `dotnet` | .NET 9 |
>
> Docker containers aren't supported as stdio commands. Only preinstalled runtimes are available.

## Preconfigured partner connectors

Your agent includes preconfigured connectors for popular platforms. These connectors have prefilled URLs, default authentication settings, and branded icons. Select the card, enter your credentials, and connect.

| Partner | Transport | What you provide | What your agent gets |
|---------|-----------|-----------------|---------------------|
| **GitHub** | Streamable-HTTP | Personal Access Token | Repository search, PR listing, issue tracking, code search |
| **Datadog** | Streamable-HTTP | API Key + Application Key | Metrics queries, APM traces, alert management |
| **New Relic** | Streamable-HTTP | API Key | Performance monitoring, analytics |
| **Splunk** | Streamable-HTTP | Bearer token | Log search, event queries |
| **Dynatrace** | Streamable-HTTP | Bearer token | Application performance monitoring |
| **Elasticsearch** | Streamable-HTTP | Authorization header | Search, analytics, log management |
| **Hawkeye (NeuBird)** | Streamable-HTTP | Bearer token | AI-powered observability |

For partner connectors, the authentication method is preconfigured and locked. You just enter the credential values.

> [!TIP]
> Browse [Azure MCP Center](https://mcp.azure.com) for verified MCP servers for Azure services.

## How tools reach your agents

MCP tools can reach your agent in two ways:

- **Agent tools**: Select tools during connector setup or editing. These tools are available directly in the main conversation. No custom agent needed.

- **Custom agent tools**: Assign tools to specific [custom agents](sub-agents.md) for focused specialists with domain expertise.

### Agent tools

When you create or edit an MCP connector, a tool selection step lets you choose which tools are visible to your agent. The selected tools are added to your agent's tool list and stay in sync. When you add, remove, or update connectors, your agent's tools refresh automatically.

**During connector creation:** After your connector connects successfully, a **Select tools** step appears. All discovered tools are preselected up to the remaining capacity. Select **Done** to save or **Skip** to add tools later.

**For existing connectors:** Edit any MCP connector to find the **MCP Tools** section at the bottom of the dialog. Check or uncheck tools to control which ones your agent can call.

> [!TIP]
> By managing your agent tool visibility, you can connect an MCP server, select tools, and start asking questions in three steps.

### Custom agent tools

For focused specialists, assign MCP tools to specific [custom agents](sub-agents.md) through the portal or YAML.

**Portal:** In **Builder > Agent Canvas**, edit an agent → **Advanced settings > Tools** → **Choose tools**.

**YAML wildcards:**

```yaml title="Custom agent with wildcard MCP tools"
mcp_tools:
  - datadog-mcp/*        # All tools from this connection
  - github_search_code   # One specific tool
```

The `{connection-id}/*` pattern adds every tool from that server, including tools added later. The forward slash is required.

| Approach | When to use |
|----------|------------|
| **Individual tools** | Precise control over tool access |
| **Wildcard (`connection-id/*`)** | All tools from a server, including future ones |
| **Mixed** | All from one server, specific picks from another |

> [!NOTE]
> The same tool can be visible to both your agent and a custom agent. There's no conflict - the tool is available in both contexts.

For a full walkthrough, see [Set Up MCP Tools](mcp-connector.md).

## Tool selection and capacity
Each agent - whether your agent or a custom agent - can use up to **80 tools** (native and MCP combined). The tool selection UI helps you manage this budget across connectors.

### Capacity indicator

The tool picker shows a progress bar with your current tool count:

| Tool count | Bar color | Meaning |
|-----------|-----------|----------|
| **0–56** (≤ 70%) | Blue | Plenty of room |
| **57–72** (71–90%) | Yellow | Approaching the limit |
| **73–80** (> 90%) | Red | Near or at capacity |

A hint below the bar reads: **"Maximum of 80 tools allowed to avoid degrading agent performance."**

### Behavior at capacity

When your selected tools reach the 80-tool limit:

- **Unchecked tools** become disabled - you can't add more until you remove some
- **Already-checked tools** stay enabled - you can always deselect them to free capacity
- **Select all** caps at remaining capacity - if you have room for 10 more tools and select **Select all**, only 10 are selected

The tool count spans all connectors. If Connector A has 60 tools visible to your agent, Connector B can add up to 20 more.

## Connection health monitoring
Your agent continuously monitors every MCP connection:

| Status | What it means | Action needed |
|--------|---------------|---------------|
| **Connected** | Server healthy, tools ready | None |
| **Disconnected** | Temporary loss - auto-recovery in progress | Usually none - wait for next heartbeat |
| **Failed** | Unrecoverable error | Check URL, credentials, network |
| **Initializing** | Connection being established | Wait |
| **Error** | No running agent instance | Start the agent |

Your agent pings each server every 60 seconds. Transient failures recover automatically on the next successful heartbeat. Before invoking any MCP tool, your agent validates the connection and attempts reconnection if needed.

> [!TIP]
> If an MCP server goes offline, the connector stays visible with its error status. Select **See details** to view the error message, tool count, and last heartbeat timestamp.

### Auto-reconnection
Your agent automatically recovers from MCP connection failures by using two mechanisms:

- **Before every tool call**, your agent checks the connection status. If the connection is disconnected, it reconnects transparently before executing the tool - no waiting for the next heartbeat cycle.

- **Every 60 seconds**, your agent pings each Streamable-HTTP MCP server. If a disconnected server responds to the ping, the connection recovers. This mechanism catches failures that happen between tool calls. Stdio connections recover on the next tool call rather than through heartbeat pings.

When a connection reconnects:

- Your agent establishes a new session with the MCP server.
- Your agent re-discovers all available tools from the server.
- Your agent refreshes tool references so every subsequent call uses the live connection.
- Existing tool assignments (agent tools and custom agent tools) remain intact.

| Scenario | What happens | User action |
|----------|-------------|-------------|
| Server briefly unreachable | Auto-reconnects on next tool call | None |
| Server restarts | Auto-reconnects when agent pings or calls a tool | None |
| Idle connection closes | Re-establishes on next tool call | None |
| Server permanently down | Tool calls fail with error message | Fix server or check credentials |
| Invalid credentials | Status shows Failed - no auto-reconnect | Update connector credentials |

> [!TIP]
> If your agent reconnects during an investigation, the tool call succeeds as if the connection never dropped. You see an error only when the server is permanently unreachable.

## Authentication

Each MCP server has its own authentication requirements. The portal supports the following methods:

| Auth method | When to use | How it works |
|-------------|------------|--------------|
| **Bearer token** | Most SaaS APIs (GitHub, Splunk, Dynatrace) | Sends token in the Authorization header |
| **Custom headers** | APIs requiring specific headers (Datadog) | Sends arbitrary key-value headers with each request |
| **Managed identity** | Azure services via stdio connectors | Uses your agent's managed identity for Azure AD tokens |

For partner connectors, the auth method is preconfigured - you just enter the credentials.

## What makes this different

- **Unlike custom integrations**, MCP connectors use an open standard. You don't write adapter code - any MCP-compatible server works out of the box. The protocol handles discovery, invocation, and error handling.

- **Unlike static tool configurations**, your agent discovers tools dynamically. When an MCP server adds a new tool, your agent picks it up automatically. Wildcard patterns (`datadog-mcp/*`) ensure new tools are available without reconfiguration.

- **Unlike scripts and runbooks**, MCP connections are self-healing. Your agent monitors every connection with a 60-second heartbeat, auto-recovers from transient failures, and defers custom agent loading until connections establish.

## Before and after

|  | Before MCP | After MCP |
|---|---|---|
| **Tools during investigation** | 4+ browser tabs open | Single conversation |
| **Using connector tools** | Create custom agent → assign tools → invoke via `/agent` | Select tools on connector → ask your agent directly |
| **Data correlation** | Manual copy-paste between systems | Agent correlates across all connected systems |
| **Time to gather context** | 15–30 minutes | 2–5 minutes |
| **Adding new tools** | Wait for built-in integration or write custom scripts | Connect any MCP server in minutes |
| **Tool capacity management** | Hit 80-tool limit with cryptic server error | Capacity bar with color-coded warnings |
| **Failure handling** | Scripts break when APIs change | Health monitoring with auto-recovery |

## Related capabilities

| Capability | What it adds |
|------------|-------------|
| [Plugin marketplace](plugin-marketplace.md) | Browse and install community plugins that include MCP server configurations |
| [External observability](diagnose-observability.md) | Use MCP connectors to query Datadog, Splunk, and other platforms during investigations |
| [Agent Playground](agent-playground.md) | Test custom agents with MCP tools before production use |
| [Scheduled tasks](scheduled-tasks.md) | Combine MCP tools with scheduled automation |
| [Workflow automation](workflow-automation.md) | Build automated workflows using MCP tools |
| [Connectors](connectors.md) | How all connectors work in SRE Agent |
| [Tools](tools.md) | The full tool taxonomy |
| [Custom agents](sub-agents.md) | Create specialists with focused tool sets |
