---
title: Deep context in Azure SRE Agent
description: Learn how deep context gives your Azure SRE Agent accumulated understanding of your code, infrastructure, and operational history.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: deep-context, workspace-tools, code-analysis, persistent-memory, background-intelligence
#customer intent: As an SRE, I want to understand how deep context works so that my agent builds a growing understanding of my environment and improves over time.
---

# Deep context in Azure SRE Agent

Deep context is your agent's accumulated understanding of your environment, including your code, infrastructure, team procedures, and past investigations. Unlike a generic AI assistant that starts from zero every time, your agent builds a growing picture of how your systems work.

> [!TIP]
> **Key takeaways**
>
> - Deep context means your agent understands *your* code, infrastructure, and operational history, not just generic Azure knowledge.
> - Your agent builds this understanding through three pillars: **context analysis**, **persistent memory**, and **background intelligence**.
> - Connected source code repos (GitHub, Azure DevOps repos) give the agent direct access to read, search, and navigate your codebase.
> - Your agent gets smarter with every conversation. It remembers what worked, what failed, and what your systems look like.

Deep context isn't a single feature you enable. It's the combination of three pillars that work together automatically.

| Pillar | What it does | How it builds |
|---|---|---|
| **Context analysis** | Reads code, searches knowledge, and navigates your environment in real time | Connected repos + knowledge base + user preferences |
| **Persistent memory** | Remembers past investigations, team context, and operational patterns | Conversation learning + knowledge files |
| **Background intelligence** | Continuously learns from your environment, even when nobody is chatting | Codebase analysis + insight generation + data source enrichment |

## Why deep context matters

Your team's expertise lives in many different places including:

- Source code in GitHub
- Logs in Azure Monitor
- Configuration in YAML files
- Runbooks in a wiki nobody updates
- Tribal knowledge in the heads of your senior engineers

When an incident hits, the hardest part isn't reasoning about the problem. It's gathering enough context to start reasoning in the first place.

Engineers spend most of their investigation time hunting for information asking questions like:

- Which service changed recently?
- Where's the retry logic?
- What did we do last time this happened? 

The answers exist, but they're spread across tools that don't talk to each other. Every investigation starts from scratch.

Deep context solves this problem by giving your agent continuous access to all of these sources and the ability to remember what it learns from each interaction.

## Pillar 1: Context analysis

Your agent has continuous, direct access to your connected repositories, knowledge base, and user preferences. It doesn't wait for you to ask a question before reading your code. Instead, it explores your repositories, learns your project structure, and builds understanding proactively. When an incident hits, the agent already knows where your retry logic lives, how your services connect, and what changed recently.

Your agent reads, searches, and navigates your codebase by using built-in tools like Azure CLI, Python execution, file search, and terminal commands. It chains these tools together automatically to accomplish complex tasks. For example, when you ask "Find where authentication errors are handled in our API," the agent searches for patterns across your codebase, reads the matching files, traces the error handling flow, and presents a structured analysis.

You can add more context to your agent at any time:

- **Connect repositories**: Link GitHub or Azure DevOps repos so your agent can read your source code. For more information, see [Connectors](connectors.md).
- **Upload knowledge documents**: Add runbooks, architecture guides, and team procedures. For more information, see [Memory and knowledge](memory.md).
- **Tell your agent to remember**: Type `#remember` in chat to save facts your agent should know (for example, "our Redis cache uses Premium tier with 6 GB"). For more information, see [User memories](memory.md#user-memories).
- **Create skills**: Package troubleshooting procedures with tools. For more information, see [Skills](skills.md).

For the full list of available tools, see [Tools](tools.md).

## Security

All workspace operations run in a sandboxed environment. Code execution happens in isolated containers, not on the agent host. Azure CLI write commands require explicit user approval before execution.

## Pillar 2: Persistent memory

Your agent remembers what it learns. After every conversation, the agent extracts structured facets, including tool success rates, root causes, key learnings, and which Azure services were involved. The agent stores these facets as persistent knowledge and uses them to improve future investigations.

Your team can also upload knowledge documents, such as architecture guides, runbooks, and team context, that the agent references automatically. When a similar issue comes up again, the agent recalls what worked and what didn't, without anyone needing to re-explain the context.

For more information, see [Memory and knowledge](memory.md).

## Pillar 3: Background intelligence

Your agent continuously builds operational understanding, even when nobody is chatting, through three background systems.

### Codebase analysis

When you connect a code repository, the agent automatically analyzes the project structure, technology stack, deployment configs, and service dependencies. It creates an `SREAGENT.md` file as a pull request to your repo. Once merged, the agent uses this file to map Azure resources back to the code that owns them.

### Insight generation

A background service periodically aggregates data from multiple sources, including past conversations, incidents, and workspace context. It uses semantic matching to generate, reconcile, and evolve operational insights over time. For example, the agent might surface that a particular service consistently fails after Tuesday deployments, or that a specific error pattern correlates with a recent configuration change.

### Kusto schema enrichment

When you connect an Azure Data Explorer (Kusto) cluster, the agent automatically discovers your databases and tables, documents each table's schema, generates human-readable descriptions, and builds KQL query templates. This automation means your agent writes accurate queries without manual configuration.

The result: your agent gets smarter with every conversation, not just every software update.

## Next step

> [!div class="nextstepaction"]
> [Connect source code to your agent](connect-source-code.md)

## Related content

- [Connectors](connectors.md): Connect GitHub, Azure DevOps repos, and other data sources.
- [Agent reasoning](agent-reasoning.md): Learn how the agent reasons through problems.
- [Deep investigation](deep-investigation.md): Use structured hypothesis testing powered by workspace tool access.
- [Python code execution](python-code-execution.md): Analyze data and create visualizations by using the code interpreter.
- [Incident response](incident-response.md): Automate incident analysis with source code correlation.
- [Scheduled tasks](scheduled-tasks.md): Automate recurring workspace operations.
