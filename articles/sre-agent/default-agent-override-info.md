---
title: Default Agent Override Info in Azure SRE Agent
description: Learn how tool and skill settings apply to the default agent and how custom agents inherit or override them in Azure SRE Agent.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: tools, skills, inheritance, default agent, overrides, agent canvas
---

# Default agent override info in Azure SRE Agent

When you toggle tools or skills on the settings pages under **Capabilities**, it wasn't clear which agent your changes affected. The descriptions said what tools and skills do, but not *where* those settings apply. If you had custom agents with their own tool overrides, changes on the settings page had no effect on those agents. There was no indication of this limitation at the point where you made changes.

This limitation led to confusion: "I disabled this tool, but my custom agent is still using it." The answer is that the tool wasn't visible where it mattered. Custom agents with explicit overrides don't inherit from the settings page.

> [!TIP]
> - The **Tools and Skills** settings pages now explain that your changes apply to the **default agent**.
> - Custom agents automatically inherit these settings unless they have their own overrides.
> - You don't need to make any configuration changes. The updated descriptions appear automatically.

## How it works

The **Tools and skills** settings pages under **Capabilities** now include three additional sentences in their descriptions:

> _These settings apply to the default agent. Custom agents inherit these settings by default. To override them, configure tools directly on the custom agent._

<!-- Screenshot: Tools page showing the updated description with override info -->

### What these sentences mean

| Sentence | What it means |
|----------|--------------|
| **These settings apply to the default agent** | Changes on this page directly configure the default agent. The default agent is the primary agent that handles all conversations unless a custom agent is invoked. |
| **Custom agents inherit these settings by default** | Any custom agent without its own tool or skill overrides uses the same configuration as the default agent. |
| **To override them, configure tools directly on the custom agent** | Go to **Builder > Agent Canvas**, select a custom agent, and use the tool or skill picker to set per-agent overrides. |

### Settings cascade

Tool and skill settings follow a clear inheritance model:

| Level | What it controls | Overrides |
|-------|-----------------|-----------|
| **Settings page** (Capabilities > Tools/Skills) | Default agent configuration showing which tools and skills are enabled or disabled | Baseline for all agents |
| **Custom agent** (Builder > Agent Canvas) | Per-agent tool and skill selection | Completely replaces settings page configuration for that agent |

When a custom agent specifies its own tools or skills, it **completely replaces** the default agent's configuration for that category. This configuration doesn't merge with the existing configuration. Core tools (like CreateFile, FileSearch, GrepSearch) and core skills (like scheduled tasks and memory search) remain enabled regardless of any configuration. You can't disable these tools.

### Seeing inheritance on the Agent Canvas

The Agent Canvas makes inheritance visible on each agent card:

| Card state | What it shows | Meaning |
|-----------|---------------|---------|
| **Inherited** | "Inherits N tools · M skills" | Agent uses the settings page configuration (no custom overrides) |
| **Custom** | "Tools · N" | Agent has its own tool selection that overrides the settings page defaults |

Select the inheritance link on any agent card to open the agent editor, where you can set custom overrides.

<!-- Screenshot: Agent Canvas showing a custom agent card with Inherits 53 tools and 18 skills badge -->

### Configuring per-agent overrides

When you create or edit a custom agent in **Builder > Agent Canvas**, the form shows exactly how many global tools and skills the agent inherits:

- **Skills:** "By default, this agent inherits 18 global skills. Selecting skills here overrides the default." with a **Global Settings** link back to the settings page
- **Tools:** "By default, this agent inherits 53 global tools. Selecting tools here overrides the default." with a **Global Settings** link

<!-- Screenshot: Create custom agent dialog showing Skills and Tools sections with inheritance counts -->

Select specific tools or skills to override the default settings for that agent. If you don't select any, the agent inherits everything from the settings page.

## What makes this different

**Information at the point of action.** Instead of requiring users to read documentation to understand the inheritance model, the description text explains it directly on the page where you make changes.

**Consistent messaging.** The Agent Canvas, the custom agent creation dialog, and now the settings pages all communicate the same inheritance model. You won't see conflicting signals across different parts of the portal.

## Before and after

| Aspect | Before | After |
|--------|--------|-------|
| **Tools description** | Explains what tools do | Adds: "These settings apply to the default agent. Custom agents inherit these settings by default. To override them, configure tools directly on the custom agent." |
| **Skills description** | Explains what skills do | Adds the same three-sentence override info |
| **Agent scope** | No mention of which agent is affected | Explicitly states settings apply to the default agent |
| **Override guidance** | None | Directs users to configure on the custom agent |

## Related content

| Capability | What it adds |
|------------|-------------|
| [Tools & skills](tools.md) | The settings pages where override info now appears - manage all tools and skills from one place |
| [Tools (concept)](tools.md) | Understand tool categories - built-in, MCP, code execution, knowledge, and custom tools |
| [Skills (concept)](skills.md) | Understand skills, custom agents, and how `allowed_skills` works in YAML |
| [Custom Agents](sub-agents.md) | Create specialized agents with their own tool and skill configurations |
