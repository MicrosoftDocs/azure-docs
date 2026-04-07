---
title: Deep context in Azure SRE Agent
description: Learn how deep context gives your Azure SRE Agent accumulated understanding of your code, infrastructure, and operational history.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/30/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: deep-context, workspace-tools, code-analysis, persistent-memory, background-intelligence
#customer intent: As an SRE, I want to understand how deep context works so that my agent builds a growing understanding of my environment and improves over time.
---

# Deep context in Azure SRE Agent

Deep Context is the agent's accumulated understanding of your environment—your code, your infrastructure, your team's procedures, and what happened in past investigations. Unlike a generic AI assistant that starts from zero every time, your agent builds a growing picture of how your systems work.

> [!TIP]
> - Deep Context means your agent understands **your** code, infrastructure, and operational history—not just generic Azure knowledge
> - It builds this understanding through three pillars: **code analysis**, **persistent memory**, and **background intelligence**
> - Connected source code repos (GitHub, Azure DevOps) give the agent direct access to read, search, and navigate your codebase

Workspace tools (file operations, terminal commands, Python execution) require enablement. Contact your agent administrator or enable via the **Experimental Settings** page in the portal.

Deep Context isn't a single feature you enable—it's the combination of three pillars that work together automatically.

| Pillar | What it does | How it builds |
|--------|-------------|---------------|
| **Context analysis** | Reads code, searches knowledge, and navigates your environment in real time | Connected repos + knowledge base + user preferences |
| **Persistent memory** | Remembers past investigations, team context, and operational patterns | Conversation learning + knowledge files |
| **Background intelligence** | Continuously learns from your environment—even when nobody is chatting | Codebase analysis + insight generation + data source enrichment |

## Why Deep Context matters

Your team's expertise lives in a dozen different places—source code in GitHub, logs in Azure Monitor, configs in YAML files, runbooks in a wiki nobody updates, and tribal knowledge in the heads of your senior engineers. When an incident hits, the hardest part isn't reasoning about the problem—it's gathering enough context to start reasoning in the first place.

Deep Context solves this by giving your agent continuous access to all of these sources—and the ability to remember what it learns from each interaction.

## Pillar 1: Context analysis

Your agent has continuous, direct access to your connected repositories, knowledge base, and user preferences. It doesn't wait for you to ask a question before reading your code—it explores your repositories, learns your project structure, and builds understanding proactively.

You can add more context at any time:

- **Connect repositories**—link GitHub or Azure Repos so your agent can read your source code. See [Connectors](connectors.md).
- **Upload knowledge documents**—add runbooks, architecture guides, and team procedures. See [Memory and knowledge](memory.md).
- **Tell your agent to remember**—type `#remember` in chat to save facts your agent should know. See [Memory and knowledge](memory.md).
- **Create skills**—package troubleshooting procedures with tools. See [Skills](skills.md).

## Security

All workspace operations run in a sandboxed environment. Code execution happens in isolated containers, not on the agent host. Azure CLI write commands require explicit user approval before execution.

## Pillar 2: Persistent memory

Your agent remembers what it learns. After every conversation, the agent extracts structured facets—tool success rates, root causes, key learnings, and which Azure services were involved. These are stored as persistent knowledge and used to improve future investigations.

Learn more: [Memory and knowledge](memory.md)

## Pillar 3: Background intelligence

Your agent continuously builds operational understanding—even when nobody is chatting—through three background systems:

### Codebase analysis

When you connect a code repository, the agent automatically analyzes it—project structure, technology stack, deployment configs, and service dependencies. It creates an `SREAGENT.md` file as a PR to your repo.

### Insight generation

A background service periodically aggregates data from multiple sources—past conversations, incidents, workspace context—and uses semantic matching to generate, reconcile, and evolve operational insights over time.

### Kusto schema enrichment

When you connect an Azure Data Explorer (Kusto) cluster, the agent automatically discovers your databases and tables, documents each table's schema, generates human-readable descriptions, and builds KQL query templates.

## Related content

- [Deep investigation](deep-investigation.md)
- [Python code execution](python-code-execution.md)
- [Incident response](incident-response.md)
- [Connectors](connectors.md)
- [Scheduled tasks](scheduled-tasks.md)

## Next step

> [!div class="nextstepaction"]
> [Connect a GitHub repository](connect-source-code.md)
