---
title: Skills in Azure SRE Agent
description: Learn how skills extend your agent with procedural guidance and execution capabilities like Azure CLI, Kusto queries, and Python scripts.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: skills, expertise, domain knowledge, SKILL.md
#customer intent: As an SRE, I want to understand skills so that I can extend my agent with team-specific procedures and execution capabilities.
---

# Skills in Azure SRE Agent
<!-- Video: Agent_Team_Procedures.mp4 — Replace with the hosted video URL using > [!VIDEO https://...] syntax -->

Skills extend your agent with procedures and execution capabilities. You can add a troubleshooting guide, attach tools like Azure CLI, Kusto queries, Python scripts, or MCP connectors, and your agent loads them when relevant to the user's question. The agent doesn't need an explicit `/skill` command.

You can also upload knowledge documents such as runbooks, architecture guides, and reference material to build a knowledge base that your agent searches automatically. For more information, see [Memory and knowledge](memory.md).

:::image type="content" source="media/skills/custom-skill-flow.svg" alt-text="Flow showing agent using custom skill with attached tools." border="false" lightbox="media/skills/custom-skill-flow.svg":::

## Skills, custom agents, and knowledge files

These three concepts work together but serve different purposes:

| Feature | Skills | Custom agents | Knowledge files |
|---|---|---|---|
| **Access** | Automatic, agent loads when relevant | Explicit, invoke with `/agent` command | Automatic, agent searches when relevant |
| **Tools** | Can attach tools | Has its own tools | No tools |
| **Purpose** | Reusable procedures and execution | Scoped domain specialists | Reference content |
| **Best for** | Team-wide troubleshooting guides | Database experts, security auditors | Runbooks, architecture docs |

Both your main agent and custom agents can use skills. When you create a custom agent in **Builder** > **Agent Canvas**, select the skills it can access. Choose the skills directly from the **Choose Skills** panel in the custom agent creation dialog.

In YAML, use `allowed_skills` to specify which skills a custom agent can access. Setting `allowed_skills` automatically enables skills on that agent.

```yaml
name: database_expert
system_prompt: |
  You are a database specialist.
allowed_skills:
  - postgres-troubleshooting
  - connection-pool-guide
tools:
  - execute_kusto_query
```

## How skills work

A skill combines knowledge with optional tools.

| Component | Purpose |
|---|---|
| **SKILL.md** | Procedural guidance the agent follows |
| **Tools** | Azure CLI, Kusto queries, Python scripts the skill can execute |
| **Supporting files** | Runbooks, architecture docs, reference material |

Your agent decides which skill to load based on the skill's description and your question. The agent reads the skill descriptions in its system prompt and automatically loads the most relevant skill by reading its `SKILL.md` file. The agent doesn't need an explicit command.

## Why use skills

Without skills, your agent relies on its built-in knowledge. This approach works for general Azure operations, but it lacks your team's specific procedures.

By using skills, you can add:

- **Your troubleshooting workflows**: step-by-step guides for your systems
- **Execution capability**: tools that run commands, not just describe them
- **Organizational context**: architecture docs, naming conventions, escalation paths

Skills turn your agent from a general assistant into a team member who knows how *you* operate.

## Create skills

Create skills in **Builder > Skills**. A skill includes a `SKILL.md` file with procedural guidance and optional tool attachments for execution.

:::image type="content" source="media/skills/portal-create-skill.png" alt-text="Screenshot of create skill dialog in the portal." lightbox="media/skills/portal-create-skill.png":::

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

Skills use the same tool picker as custom agents. You can attach any combination of the following tool types:

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
| **Skill lifecycle** | Oldest autounloaded when limit exceeded |
| **Context reset** | Active skills clear on conversation compaction |
| **Tool access** | Only available while skill is active |

If you need a skill's tools after it unloads, the agent re-reads the `SKILL.md` file to reactivate the skill.

## Related content

| Resource | Description |
|---|---|
| [Custom agents](sub-agents.md) | Build specialized agents that can use skills. |
| [Tools](tools.md) | Learn about the tools skills can attach. |
| [Kusto tools](kusto-tools.md) | Kusto query tools that skills can use. |
| [Python code execution](python-code-execution.md) | Python tools available to skills. |
