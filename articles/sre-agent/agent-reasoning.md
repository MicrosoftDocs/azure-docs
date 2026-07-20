---
title: Agent Reasoning in Azure SRE Agent
description: Learn how your agent processes requests, selects tools, classifies actions, and explains its thinking.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 07/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: reasoning, thinking, tool selection, action classification, approval, context gathering, parallel execution, deep-context, workspace-tools, code-analysis, persistent-memory, background-intelligence
#customer intent: As an SRE, I want to understand how my agent reasons through problems so that I can trust its actions and guide its behavior effectively.
---

# Agent reasoning in Azure SRE Agent

Your agent reasons through problems instead of following fixed scripts. Because it builds Deep Context from your codebase, past incidents, and infrastructure, it reasons about *your* systems, not generic ones. In the chat interface, you can watch it gather evidence, select tools, classify action risk, and explain its thinking.

## The reasoning loop

Every message follows the same loop.

:::image type="content" source="media/agent-reasoning/agent-reasoning-flow.svg" alt-text="A screenshot of Agent reasoning flow: understand request, gather context, reason, then act or respond. Loops up to 10 times." lightbox="media/agent-reasoning/agent-reasoning-flow.svg":::

The agent first **understands** your request and identifies the data it needs. Then it **gathers context** by querying data sources in parallel, such as logs, metrics, resource status, deployment history, and [memory](memory.md). Next it **reasons** over the evidence to identify patterns and form conclusions. Finally it **acts or responds** by running safe actions, requesting approval for risky ones, or presenting findings.

If the problem requires more work, the loop iterates up to 10 times per turn. After that, your agent asks whether to continue.

## Adaptive thinking

For complex problems, your agent shows its reasoning in the chat. A collapsible **Thinking** section lists each step with a descriptive title, such as "Exploring Azure health issues" or "Analyzing active alerts," and elapsed time.

:::image type="content" source="media/agent-reasoning/thinking-accordion-active.png" alt-text="Screenshot of adaptive thinking showing reasoning step." lightbox="media/agent-reasoning/thinking-accordion-active.png":::

Your agent adjusts its reasoning depth automatically. A status check gets a quick response. A multistep outage gets deeper reasoning that correlates evidence across sources.

## Deep context

Adaptive reasoning gets stronger when the agent can draw from your environment. Deep context is the agent's accumulated understanding of that environment. It comes from three context sources: connectors, knowledge and memory, and workspace tools. Instead of starting from zero each time, your agent builds a clearer picture of how your systems work and brings that context into each reasoning loop.

> [!TIP]
> - Deep context helps your agent reason from **your** code, infrastructure, and operational history, not just generic Azure knowledge.
> - It comes from three context sources: **connectors**, **knowledge and memory**, and **workspace tools**.
> - Connected source code repositories let the agent read, search, and navigate your codebase when workspace tools are enabled.

Workspace tools, including file operations, terminal commands, and Python execution, must be enabled before the agent can use them. Contact your agent administrator, or turn them on through the **Experimental Settings** page in the portal.

Deep context isn't a single feature you enable. It grows as these context sources work together.

| Context source | What it provides | How to add it |
|---|---|---|
| **Connectors** | Live data from GitHub, Azure DevOps, Kusto, Azure Monitor, and other services | Connect service data sources. See [Connectors](connectors.md). |
| **Knowledge and memory** | Uploaded runbooks, architecture docs, team procedures, user preferences, and facts from past conversations | Upload knowledge, create skills, or tell the agent to remember facts. See [Memory and knowledge](memory.md). |
| **Workspace tools** | Direct access to read, search, and analyze source code, run terminal commands, and execute Python | Connect a repository and enable workspace tools in **Experimental Settings**. |

### Why deep context matters

Your team's expertise lives in many places: source code in GitHub, logs in Azure Monitor, configurations in YAML files, runbooks in a wiki that drifts out of date, and tribal knowledge from senior engineers. During an incident, the hardest part often isn't reasoning about the problem. It's gathering enough context to begin.

Deep context helps by giving your agent ongoing access to these sources and a way to remember what it learns from each interaction.

### Connectors

Connectors bring live service data into the reasoning loop. Your agent can use connected sources such as GitHub, Azure DevOps, Kusto, Azure Monitor, and other services to gather evidence about your environment instead of relying only on generic Azure knowledge.

Some connectors also sharpen the agent's understanding over time. When you connect an Azure Data Explorer (Kusto) cluster, the agent discovers databases and tables, documents each table's schema, writes human-readable descriptions, and produces a Kusto investigation skill with query guidance.

### Knowledge and memory

Knowledge and memory provide the durable context your agent carries across conversations. Uploaded runbooks, architecture guides, team procedures, skills, and remembered facts help the agent follow how your team operates.

Your agent remembers what it learns. After conversations, it extracts structured facets, such as tool success rates, root causes, key learnings, Azure services, and symptoms. Those facets become persistent knowledge for future investigations.

At the start of each conversation, your agent searches [memory](memory.md) for relevant context before it responds.

| What it draws from | How it improves reasoning |
|---|---|
| **Session insights** | Learns from past conversations and other enabled data sources |
| **Similar symptom patterns** | Recognizes recurring patterns and gets to likely causes faster |
| **Your uploaded runbooks and docs** | Follows your team's procedures instead of generic advice |
| **User preferences** | Remembers your environment context and response preferences |

Background insight generation aggregates past conversations and other enabled data sources. It uses semantic matching to generate, reconcile, and refine operational insights over time.

### Workspace tools

Workspace tools give your agent direct access to your connected repository and execution environment. When you enable them, the agent can read files, search code, analyze project structure, run terminal commands, and execute Python during an investigation.

When you connect a code repository, the agent automatically analyzes its project structure, technology stack, deployment configurations, and service dependencies. It then opens a PR that adds an `SREAGENT.md` file to your repo.

You can add more context at any time:

- **Connect repositories**: Link GitHub or Azure Repos so your agent can read your source code. See [Connectors](connectors.md).
- **Upload knowledge documents**: Add runbooks, architecture guides, and team procedures. See [Memory and knowledge](memory.md).
- **Tell your agent to remember**: Type `#remember` in chat to save facts your agent should know. See [Memory and knowledge](memory.md).
- **Create skills**: Package troubleshooting procedures with tools. See [Skills](skills.md).

The more knowledge you provide, such as runbooks, architecture docs, and team procedures, the more relevant the reasoning becomes. For more information, see [Memory and knowledge](memory.md).

### Security

You must enable workspace tools through **Experimental Settings** before the agent can use file operations, terminal commands, or Python execution. Code execution runs in a sandboxed or isolated session, depending on the configured sandbox mode, separate from the agent host. Azure CLI write commands require explicit user approval before they run.

## Tool selection

With that context in place, your agent selects tools based on the problem. It **starts with all tools** registered on the current [custom agent](sub-agents.md), then **filters by platform**, using only incident tools for the connected [incident platform](incident-platforms.md). It further **filters by published list** to include only tools you make available, and **adjusts as new information emerges** during the conversation.

Each custom agent has its own tool set. When your agent delegates to a different custom agent, the available tools change automatically.

For more information on available tools, see [Tools](tools.md).

## Parallel execution

When your agent identifies independent operations, meaning actions that don't depend on each other's output, it issues them simultaneously in a single turn instead of running them one at a time.

For example, if your agent needs to check pod status, service health, and deployment history, it runs all three commands in parallel instead of waiting for each one to complete before starting the next. This approach reduces reasoning turns and speeds up investigations.

Tool-level prompts guide parallel execution by telling the model: *"If the commands are independent and can run in parallel, make multiple tool calls in a single message."*

## Action classification

Your agent classifies every action before it runs.

| Classification | Behavior | Examples |
|---|---|---|
| **Safe** | Executes immediately | Query logs, check resource status, list deployments |
| **Cautious** | Executes with a brief explanation | Send emails, post Teams messages |
| **Destructive** | Requires your confirmation | Restart an app, scale resources, modify configurations |

How your agent handles each type depends on your [run mode](run-modes.md).

| Run mode | Safe | Cautious | Destructive |
|---|---|---|---|
| **Review** | Executes | Executes | Asks for approval |
| **Autonomous** | Executes | Executes | Executes |

## Conversation management

Several mechanisms keep long conversations on track.

| Mechanism | What it does |
|---|---|
| **Compaction** | When conversations get long, your agent summarizes earlier context while preserving key findings. You can trigger this action manually by using the `/compact` command. |
| **Automatic retries** | If a service interruption occurs mid-response, your agent retries automatically. |
| **Error handling** | If a model encounters a temporary problem, your agent displays a clear message ("model is temporarily experiencing problems") instead of a generic internal error. |

## Cancellation

When you select **Stop**, your agent halts all operations and prevents retries for the canceled task. Your next message starts fresh unless you explicitly modify the canceled request.

## Boundaries

Reasoning has limits.

| What reasoning does | What it doesn't do |
|---|---|
| Gathers evidence from multiple sources in parallel | Guarantee finding a root cause when evidence is insufficient |
| Classifies actions and respects your run mode | Autoremediate without confirmation in Review mode |
| Explains its thinking step by step | Share investigation methodology across separate agents |
| Adjusts reasoning depth to problem complexity | Replace human judgment for critical decisions |

## Next step

> [!div class="nextstepaction"]
> [Explore the agent playground](./agent-playground.md)

## Related content

- [Root cause analysis](root-cause-analysis.md): Deep investigation with hypothesis trees
- [Connectors](connectors.md): Connect source code, Azure resources, and other context sources
- [Memory and knowledge](memory.md): How your agent remembers context across conversations
- [Run modes](run-modes.md): Review and Autonomous behavior
- [Tools](tools.md): Built-in and custom tool capabilities
- [Skills](skills.md): Domain-specific investigation procedures
- [Python code execution](python-code-execution.md): Run Python during investigations
- [Scheduled tasks](scheduled-tasks.md): Run recurring investigations and checks
