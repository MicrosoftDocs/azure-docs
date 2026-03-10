---
title: "Tutorial: Set Up the MCP Connector in Azure SRE Agent"
description: Connect your SRE agent to external tools using the Model Context Protocol (MCP), then add those tools to subagents individually or all at once with the wildcard pattern.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
ms.custom: mcp, model context protocol, connector, tools, extension, wildcard, add all tools
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to connect my agent to external tools through MCP so that my subagents can use those tools during investigations.
---

# Tutorial: Set up the MCP connector in Azure SRE Agent
In this tutorial, you connect your SRE agent to an external tool or service through the Model Context Protocol (MCP), then add the available tools to your subagents. You can add tools individually or use the wildcard pattern to include all tools from a connection at once.

**Estimated time**: 10 minutes

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Add an MCP connector to your agent
> - Verify the connection status
> - Add MCP tools to a subagent individually or with the wildcard pattern
> - Test the subagent in the playground

## Prerequisites

- An active Azure SRE agent
- An MCP server endpoint URL (browse available servers at [Azure MCP Center](https://mcp.azure.com))
- Network access between your agent and the MCP server
- Authentication credentials for the MCP server (API key, OAuth token, or managed identity, depending on the server)

> [!TIP]
> For your first MCP connector, try one of the verified servers from [Azure MCP Center](https://mcp.azure.com). Many provide simple setup instructions and work out of the box.

## Add an MCP connector

Register the MCP server as a connector in the SRE Agent portal.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. Navigate to **Builder** > **Connectors**.
1. Select **+ Add connector**.
1. Select **MCP Server** as the connector type.
1. Enter the MCP server URL and the required authentication. The authentication method varies by server (API key, OAuth token, or managed identity).
1. Select **Add**.

Your new connector appears in the connectors list. The status shows **Initializing** briefly, then changes to **Connected** (green checkmark). The connection name shown in the list is your **connection ID**, which you use when adding tools to subagents.

> [!TIP]
> If the status shows **Failed** or **Disconnected**, check your server URL, authentication credentials, and network configuration. For more information, see the MCP connector health monitoring section in [Connectors](connectors.md).

## Add MCP tools to a subagent

After the connector is active, add the MCP tools to a subagent. A subagent is a specialized agent with focused tools and expertise.

Navigate to **Builder** > **Subagent builder** and create or edit a subagent. You can add tools through the portal UI or by editing the subagent YAML definition.

### Select tools in the portal

Use the portal tool picker to choose individual tools or select all tools from a connection.

1. In the subagent configuration dialog, scroll to **Advanced settings**.
1. Under **Tools**, select **Choose tools**.
1. In the tool picker panel, find the tools grouped by MCP connection.
1. Check the box next to individual tools, or select the **Select all** checkbox for a connection group to add every tool from one server.
1. Close the panel and save your subagent.

The tool picker groups tools by connection. MCP connections (such as `KustoTool`, `githubconn`, and `grafanamcp-v`) appear alongside built-in tool categories (such as Azure Operation, Diagnostics, and Log Query).

Your subagent configuration now shows the selected MCP tools in the **Tools** section. The tool count badge updates to reflect your selection.

### Add all tools by using the wildcard pattern in YAML

**Applies to**: version 26.2.9.0 and later

Use a wildcard pattern to add all tools from a single MCP server. Switch to the **YAML** tab in the subagent builder and use the `{connection-id}/*` pattern:

```yaml
api_version: azuresre.ai/v1
kind: AgentConfiguration
spec:
  name: kusto_expert
  system_prompt: You analyze database performance and query optimization...
  agent_type: Review
  mcp_tools:
    - kusto-mcp/*
```

The `{connection-id}/*` pattern adds every tool from the specified MCP connection. Your agent expands the wildcard at startup, so you don't need to list each tool individually. Use the connection name shown in **Builder** > **Connectors** as the connection ID.

You can also mix wildcards with individual tool names:

```yaml
mcp_tools:
  - kusto-mcp/*            # All Kusto tools
  - grafana-mcp_dashboard  # Just the dashboard tool from Grafana
```

> [!NOTE]
> The wildcard pattern must use `{connection-id}/*` with the forward slash before the asterisk. Patterns like `kusto-mcp*` (without the slash) are treated as exact tool names, not wildcards.

> [!TIP]
> Use `{connection-id}/*` when you trust the MCP server and want your subagent to access all its tools, including any tools the server adds later. Use individual tool selection when you want precise control over your subagent's capabilities.

## Test the subagent

Verify that the subagent can use the MCP tools by testing it in the playground.

1. In **Builder** > **Subagent builder**, use the view toggle to switch to **Test playground**.
1. Select your subagent from the dropdown on the left.
1. In the chat panel, ask a question that requires the MCP tools. For example: "Query the Kusto database for recent errors."
1. Verify the subagent uses the MCP tools in its response.

Tool calls appear in the conversation along with their results. For more information about the testing environment, see [Agent playground](agent-playground.md).

## Example: Connect to the Microsoft Learn MCP server

This example shows how to connect your agent to the Microsoft Learn MCP server. By using this server, your subagents get access to documentation search tools.

### Connect the server

Add the Microsoft Learn MCP server as a connector.

1. Go to **Settings** > **Connectors** > **Add connector** > **Add MCP server**.
1. Enter the connection details:

   | Field | Value |
   |-------|-------|
   | **Name** | `MicrosoftLearnMCP` |
   | **Connection type** | SSE (Server-Sent Events) |
   | **URL** | `https://learn.microsoft.com/api/mcp` |
   | **Authentication** | Custom headers (leave empty; this server requires no authentication) |

1. Select **Add** and wait for the status to show **Connected**.

### Create a subagent with the MCP tools

After the connector is active, create a subagent that uses its tools.

1. Go to **Builder** > **Subagent builder** and create a new subagent.
1. Give it a name like `docs-researcher` and a system prompt: "You search Microsoft Learn documentation to answer technical questions."
1. Under **Advanced settings** > **Tools** > **Choose tools**, select the tools from the `MicrosoftLearnMCP` connection.
1. Save the subagent and test it in the playground.

### Find more MCP servers

You can discover MCP servers to connect from the following registries:

| Registry | URL | Description |
|----------|-----|-------------|
| **Azure MCP Center** | [mcp.azure.com](https://mcp.azure.com) | Verified MCP servers for Azure services |
| **MCP GitHub directory** | [github.com/mcp](https://github.com/mcp) | Community and open-source MCP servers |

## Troubleshoot common issues

If you encounter problems, review the following table for common issues and solutions.

| Issue | Solution |
|-------|----------|
| MCP tools don't appear in the tool picker | Verify the connector shows **Connected** status in **Builder** > **Connectors**. |
| Wildcard matches zero tools | The MCP connection might still be initializing. Your agent defers the subagent and loads it automatically after the connection establishes. |
| Subagent doesn't use MCP tools | Verify the tools are listed in the subagent's `mcp_tools` configuration. |
| Invalid wildcard syntax | Use `{connection-id}/*` with the forward slash before the asterisk. |

## Next step

> [!div class="nextstepaction"]
> [Learn about connectors](./connectors.md)

## Related content

- [Connectors](connectors.md)
- [Subagents](sub-agents.md)
- [Skills](skills.md)
- [Agent playground](agent-playground.md)
