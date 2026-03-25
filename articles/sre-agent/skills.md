---
title: Skills in Azure SRE Agent
description: Learn how skills extend your agent with procedural guidance and execution capabilities like Azure CLI, Kusto queries, and Python scripts.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: skills, expertise, domain knowledge, SKILL.md
#customer intent: As an SRE, I want to understand skills so that I can extend my agent with team-specific procedures and execution capabilities.
---

# Skills in Azure SRE Agent
<!-- Video: Agent_Team_Procedures.mp4 — Replace with the hosted video URL using > [!VIDEO https://...] syntax -->

Skills extend your agent with procedures and execution capabilities. You can add a troubleshooting guide, attach tools like Azure CLI, Kusto queries, Python scripts, or MCP connectors, and your agent loads them when relevant to the user's question. The agent doesn't need an explicit `/skill` command.

:::image type="content" source="media/skills/custom-skill-flow.svg" alt-text="Flow showing agent using custom skill with attached tools." border="false":::

## How skills work

A skill combines knowledge with optional tools.

| Component | Purpose |
|---|---|
| **SKILL.md** | Procedural guidance the agent follows |
| **Tools** | Azure CLI, Kusto queries, Python scripts the skill can execute |
| **Supporting files** | Runbooks, architecture docs, reference material |

> [!TIP]
> **Subagents** require explicit invocation: you type `/agent database-expert` to use them. **Skills** are loaded automatically by the agent when relevant. Ask your question naturally, and the agent decides whether to load a skill based on your request. No `/skill` command is needed.

## Why use skills

Without skills, your agent relies on its built-in knowledge. This approach works for general Azure operations, but it lacks your team's specific procedures.

By using skills, you can add:

- **Your troubleshooting workflows**: step-by-step guides for your systems
- **Execution capability**: tools that run commands, not just describe them
- **Organizational context**: architecture docs, naming conventions, escalation paths

Skills turn your agent from a general assistant into a team member who knows how *you* operate.

## Compare skills, subagents, and knowledge files

The following table compares skills with other extensibility concepts:

| Feature | Skills | Subagents | Knowledge files |
|---|---|---|---|
| **Access** | Automatic | `/agent` command | Via KB query tool |
| **Tools** | Can attach | Has tools | No tools |
| **Purpose** | Procedures + execution | Scoped specialists | Reference content |
| **Best for** | Team-wide procedures | Domain experts on demand | Runbooks, docs |

## Create skills

Create skills in **Builder > Subagent builder**. A skill includes a `SKILL.md` file with procedural guidance and optional tool attachments for execution.

:::image type="content" source="media/skills/portal-create-skill.png" alt-text="Screenshot of create skill dialog in the portal.":::

The following example shows a typical skill structure:

```yaml
name: aks-troubleshooting-guide
description: Use when investigating AKS or Kubernetes issues
files:
  - SKILL.md
tools:
  - RunAzCliReadCommands
```

Your agent automatically applies skill guidance when it encounters relevant problems and executes attached tools to gather information.

## Attach tools

Skills use the same tool picker as subagents. You can attach any combination of the following tool types:

| Tool type | Examples |
|---|---|
| **Azure CLI** | `RunAzCliReadCommands`, `RunAzCliWriteCommands`, `GetAzCliHelp` |
| **Kusto/Log Analytics** | Custom Kusto queries against ADX or Log Analytics |
| **Python** | Custom Python scripts for data processing or API calls |
| **MCP** | Tools from connected MCP servers |
| **Link** | URL templates for external systems |

When you attach `RunAzCliReadCommands` to an AKS troubleshooting skill, your agent doesn't just know *how* to troubleshoot. It can actually *run the commands*.

## Limits and constraints

The following table describes the constraints that apply to skills:

| Constraint | Value |
|---|---|
| **Active skills** | Maximum five concurrent |
| **Skill lifecycle** | Oldest auto-unloaded when limit exceeded |
| **Context reset** | Active skills clear on conversation reset |
| **Tool access** | Only available while skill is active |

If you need a skill's tools after the bot unloads the skill, re-read its `SKILL.md` file to reactivate it.

## How skills relate to other concepts

Your **main agent** uses skills. You can also enable skills for **subagents** by setting the `enableSkills` property to `true`. Skills work through **tools**. By attaching tools by name, you provide the actual capabilities.

## Next step

> [!div class="nextstepaction"]
> [Create a Python tool](./create-python-tool.md)

## Related content

- [Subagents](sub-agents.md)
- [Tools](tools.md)
