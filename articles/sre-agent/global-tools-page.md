---
title: Tools and Skills in Azure SRE Agent
description: Learn how to manage tools and skills at the space level in Azure SRE Agent.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/03/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: tools, skills, built-in tools, custom tools, mcp servers
---

# Tools and skills in Azure SRE Agent

See every tool and skill your agent has, including built-in, custom, and MCP tools plus system and custom skills, organized by category. Toggle capabilities on or off at the space level, and changes apply across all agents instantly.

Agents created before March 10, 2026 require workspace tools to be enabled. For older agents, enable **EnableWorkspaceTools** in **Capabilities > Experimental Settings**.

> [!TIP]
> - **See every tool and skill**, including built-in, custom, and MCP tools plus system and custom skills, organized by category
> - **Toggle on or off** at the space level. Changes apply across all agents instantly.
> - **Smart defaults**: Both PagerDuty and ServiceNow incident management skills are enabled out of the box
> - **Inherited counts on canvas**: Each agent card shows how many global tools and skills it inherits

## Tools

The **Tools** page organizes your agent's tools into three tabs:

| Tab | What it shows |
|-----|---------------|
| **Built-in tools** | Platform-provided capabilities grouped by category: Core, Azure Operation, DevOps, Diagnostics, Incident Management, Knowledge Base, Log Query, and more |
| **MCP servers + services** | Tools from your connected MCP server connectors |
| **Custom tools** | User-defined tools created through Kusto tool creation, Python tool creation, or extended agent YAML |

Each tool shows its name and description with a checkbox to toggle it on or off. **Core tools** (like CreateFile, FileSearch, and GrepSearch) are always enabled and can't be disabled.

## Skills

The **Skills** page organizes your agent's domain expertise into two tabs:

| Tab | What it shows |
|-----|---------------|
| **Built-in skills** | System-provided skills grouped by domain: Core skills (always enabled), plus skills for Azure diagnostics, incident management, and more |
| **Custom skills** | Skills you create through the Skill Builder or extended agent YAML |

### Environment-aware defaults

| Default incident skills | Status |
|------------------------|--------|
| **PagerDuty incident management** | Enabled by default |
| **ServiceNow incident management** | Enabled by default |

### Making changes

1. **Browse** tools across tabs. Expand categories to see individual items.
1. **Search** using the search box to find specific tools or skills by name.
1. **Toggle** individual items, entire categories, or all items by using the checkboxes.
1. **Save changes** to apply your configuration.
1. **Reset to default** to restore all tools and skills to platform defaults.

### Inherited tools on the agent canvas

When you configure tools and skills on this page, every custom agent that doesn't have its own tool overrides automatically inherits your configuration. Agent cards display:

| Card state | What it shows |
|-----------|---------------|
| **Inherited** | "Inherits N tools, M skills" as a clickable link |
| **Custom** | "Tools, N," badge |

## How tools are managed at each level

| Level | Feature | What it controls |
|-------|---------|-----------------|
| **What tools exist** | [Deep context](workspace-tools.md) | The underlying capabilities, including file operations, terminal, Python, and Azure CLI |
| **Space-wide on/off** | **Tools page** (this page) | Which tools are enabled or disabled for the entire space |
| **Per-subagent** | Subagent tool configuration | Which specific tools each subagent can use |

## Related content

- [Deep context](workspace-tools.md)
- [Kusto tools](kusto-tools.md)
- [Plugin marketplace](plugin-marketplace.md)
- [Workflow automation](workflow-automation.md)

## Next step

> [!div class="nextstepaction"]
> [Manage global tools](manage-global-tools.md)
