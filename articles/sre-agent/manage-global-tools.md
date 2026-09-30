---
title: "Tutorial: Manage Global Tools in Azure SRE Agent"
description: Browse, toggle, and manage tools and skills at the space level in Azure SRE Agent.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/02/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: tools, manage tools, toggle tools, built-in tools, tutorial
---

# Tutorial: Manage global tools in Azure SRE Agent

Learn how to browse, toggle, and manage tools at the space level by using the Tools page.

> [!IMPORTANT]
> Agents created before March 10, 2026, require workspace tools to be enabled. For older agents, enable **EnableWorkspaceTools** in **Capabilities > Experimental Settings**.

**Time**: 5-10 minutes

## Prerequisites

- An active SRE Agent
- Contributor or higher role on the agent resource

## Step 1: Go to the Tools page

In the left sidebar, expand **Capabilities** and select **Tools**.

The page opens with three tabs: **Built-in tools** (selected by default), **MCP servers + services**, and **Custom tools**. A search box at the top filters tools within the active tab.

**Checkpoint:** You see a page titled "Tools" with the description "Tools are the capabilities available to your agent for investigating and resolving incidents."

## Step 2: Browse built-in tools

The **Built-in tools** tab organizes tools into expandable categories. Each category header shows a count of active tools (for example, "4/4 tools" means all four tools in that category are enabled).

Select a category to expand it and see individual tools with their descriptions.

The **Core** category has grayed-out checkboxes because core tools are always enabled and can't be disabled.

**Checkpoint:** You can expand categories and see tool names with descriptions.

## Step 3: Toggle a built-in tool

Find a non-core tool and clear its checkbox to disable it. A footer bar appears with three buttons:

- **Save changes**: Persist your configuration.
- **Undo changes**: Revert to the last saved state.
- **Reset to default**: Restore all tools to platform defaults.

Select **Save changes** to apply your configuration.

**Checkpoint:** After saving, the tool's active count updates in the category header.

## Step 4: Search for a tool

Type a tool name or keyword in the search box (for example, "query" or "deploy"). The list filters in real time to show only matching tools across all categories.

**Checkpoint:** Only tools matching your search term are visible.

## Step 5: Explore MCP server tools

Select the **MCP servers + services** tab.

This tab shows tools provided by your connected MCP connectors. If you don't configure any MCP connectors, you see "No MCP servers + services found."

**Checkpoint:** The MCP tab shows tools from configured connectors, or an empty state if none exist.

## Step 6: View custom tools

Select the **Custom tools** tab.

Create custom tools through Kusto tool creation, Python tool creation, or extended agent YAML configurations. Once created, custom tools appear here automatically.

**Checkpoint:** The Custom tab shows user-defined tools, or an empty state if none exist.

## Step 7: Reset to defaults

To undo all tool configuration changes, select **Reset to default** in the footer bar. A confirmation dialog appears. Select **Confirm** to revert all tool toggles to their platform defaults.

**Checkpoint:** All tool active counts return to their default values.

## Related content

- [Tools and skills](global-tools-page.md)
- [Create a Kusto tool](create-kusto-tool.md)
- [Create a Python tool](create-python-tool.md)
- [Plugin marketplace](plugin-marketplace.md)
