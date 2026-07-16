---
title: "Tutorial: Set Up the MCP Connector in Azure SRE Agent"
description: Connect your SRE agent to external tools using the Model Context Protocol (MCP), then select tools for your agent to use directly in chat.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/18/2026
ms.custom: mcp, model context protocol, connector, tools, extension, wildcard, add all tools
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to connect my agent to external tools through MCP so that I can use those tools during investigations.
---

# Tutorial: Set up the MCP connector in Azure SRE Agent
In this tutorial, you connect your SRE agent to an external tool server by using the Model Context Protocol (MCP), select tools for your agent, and test them in chat. This tutorial uses the GitHub MCP server as an example&mdash;the same steps work for Datadog, Splunk, New Relic, and any partner connector.

**Estimated time**: 10 minutes

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Add an MCP connector to your agent
> - Select tools for your agent
> - Test tools in chat

## Prerequisites

- An active Azure SRE agent
- An MCP server endpoint URL (browse available servers at [Azure MCP Center](https://mcp.azure.com))
- Network access between your agent and the MCP server
- Authentication credentials for the MCP server (API key, OAuth token, or managed identity, depending on the server)

> [!TIP]
> For your first MCP connector, try one of the verified servers from [Azure MCP Center](https://mcp.azure.com). Many provide simple setup instructions and work out of the box.

## Step 1: Add the MCP connector

Register the MCP server as a connector in the SRE Agent portal.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. Navigate to **Builder** > **Connectors**.
1. Select **+ Add connector**.
1. Select **MCP Server** as the connector type.
1. Enter the MCP server URL and the required authentication. The authentication method varies by server (API key, OAuth token, or managed identity).
1. Select **Add**.

You should see your connector appear in the connectors list. The status shows **Initializing** briefly, then changes to **Connected** (green checkmark). The connection name shown in the list is your **connection ID**, which you use when referencing tools.

> [!TIP]
> If the status shows **Failed** or **Disconnected**, check your server URL, authentication credentials, and network configuration. For more information, see the MCP connector health monitoring section in [Connectors](connectors.md).

## Step 2: Select tools for your agent

During connector setup (or by editing the connector afterward), select which tools your agent can use directly in chat.

1. After the connector shows **Connected**, select **Edit** on the connector.
1. In the **MCP Tools** section, check the tools you want available, or select **Select all** to add everything.
1. Select **Save**.

You can now access the selected tools directly in your main chat.

> [!TIP]
> Your agent can use up to **80 tools** total across all connectors. The tool picker shows a capacity bar so you can manage your tool budget.

> [!TIP]
> For complex workflows, you can also assign MCP tools to a [custom agent](sub-agents.md) on the Agent Canvas. This approach is useful when you want specialized agents for different platforms or need to control which tools are available in which context.

## Step 3: Test in chat

Verify that your agent can use the MCP tools by testing them in chat.

1. Open a **New chat thread**.
1. Ask a question that uses the connected tools. For example: "Search for files related to authentication in my repositories."
1. Press Enter.

Tool call cards show the connection name, tool name, and **Completed** status. For more information about the testing environment, see [Agent playground](agent-playground.md).

## Example: Connect to the Microsoft Learn MCP server

This example shows how to connect your agent to the Microsoft Learn MCP server. By using this server, your agent gets access to documentation search tools.

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

### Select tools from the connector

After the connector is active, select the tools you want to use.

1. Select **Edit** on the `MicrosoftLearnMCP` connector.
1. In the **MCP Tools** section, select the tools from the `MicrosoftLearnMCP` connection.
1. Select **Save** and test the tools in chat.

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
| Status shows **Failed** | Check URL, credentials, and network access. |
| MCP tools don't appear in the tool picker | Verify the connector shows **Connected** status in **Builder** > **Connectors**. |
| Tool calls fail in chat | Verify tools are selected for the main agent&mdash;edit the connector and check the **MCP Tools** section. |
| Hit the 80-tool limit | Remove unused tools from other connectors to free capacity. |

## Next step

> [!div class="nextstepaction"]
> [Learn about connectors](./connectors.md)

## Related content

- [Connectors](connectors.md)
- [Custom agents](sub-agents.md)
- [Agent playground](agent-playground.md)
