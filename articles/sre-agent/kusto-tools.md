---
title: Kusto Tools in Azure SRE Agent
description: Create deterministic query tools that run exact KQL queries against Azure Data Explorer, turning tribal knowledge into reusable agent capabilities.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: kusto, adx, azure-data-explorer, queries, tools, data-source, charts, kql
#customer intent: As an SRE, I want to create reusable Kusto query tools so that my agent runs the same proven KQL every time instead of generating ad-hoc queries.
---

# Kusto tools in Azure SRE Agent
Kusto tools help you turn your best KQL queries into reusable, parameterized tools. Your agent runs the exact query you write with no interpretation or variation. Your team's expertise becomes a shared capability.

> [!TIP]
> - **Standardize incident queries** - The same proven KQL runs every time, with no variations.
> - **Turn tribal knowledge into reusable tools** - Your best queries become shared capabilities.
> - **Query with parameters** - Users ask in plain language, and the agent substitutes values automatically.
> - **Test before deploy** - Validate queries execute correctly before adding to custom agents.

## The problem: everyone writes their own queries

During incidents, your team's senior engineers use battle-tested queries that find problems fast. But that knowledge stays in their heads, Slack threads, and personal notebooks. When they're not on-call, less experienced responders waste time:

- **Reinventing queries** from scratch, often with mistakes
- **Writing overly broad queries that return too much data or missing edge cases
- **Missing critical columns** that would reveal the root cause
- **Using wrong time windows** or forgetting to filter by environment

Each engineer queries the same data differently. One engineer finds the problem in five minutes. Another engineer spends 30 minutes going in circles with ad-hoc KQL.

## How Kusto tools solve this problem

Kusto tools let you save your team's best queries as parameterized, deterministic tools. The agent runs the exact query you define, so your team's expertise becomes a shared capability.

| Before | After |
|---|---|
| Senior engineer writes query from memory | Query is saved as a tool, anyone can use it |
| On-call guesses at time ranges and filters | Parameters prompt for what's needed |
| Each responder gets different results | Same query runs every time |
| Complex joins must be remembered | Multi-step logic is prebuilt |

Instead of asking the on-call engineer to "figure out how to query error logs," they ask the agent:

```text
Show me errors from the last 24 hours
```

The agent uses your prebuilt tool with `timeRange=24h`, returning exactly the columns and filters your team needs.

## How it works

Follow these steps to create and use a Kusto tool:

1. **Connect**: Add your Azure Data Explorer cluster as a connector.
1. **Create**: Define queries with parameters using `##parameterName##` syntax.
1. **Test**: Validate the query executes correctly in the portal.
1. **Attach**: Add the tool to a custom agent.
1. **Use**: Your agent calls the tool when user questions match the tool's description.

### Two approaches to data queries

When you add an Azure Data Explorer connector, choose between deterministic or flexible queries.

| Approach | Description | Use when |
|---|---|---|
| **Database query connector** | Agent uses predefined queries (Kusto tools) | You want deterministic, exact queries |
| **Database indexing connector** | Agent generates queries by learning your schema | You want flexible, ad-hoc queries |

### Create a Kusto tool

Create tools in **Builder** > **Agent Canvas** > **Create** > **Tool** > **Kusto tool**. Each tool needs a name, description, connector, database, and KQL query with optional `##paramName##` parameter placeholders.

For the full walkthrough with screenshots, see [Tutorial: Create a Kusto tool](create-kusto-tool.md).

### Add a tool to a custom agent

After creating your tool, attach it to a [custom agent](sub-agents.md) through the canvas view **+** button > **Add existing tools**.

## Prerequisites

Before creating Kusto tools, meet the following requirements.

### Azure Data Explorer permissions

The agent's managed identity needs the **AllDatabasesViewer** role on your Azure Data Explorer cluster.

Use the following KQL management command:

```kql
.add cluster AllDatabasesViewer ('aadapp=<MANAGED_IDENTITY_CLIENT_ID>;<TENANT_ID>')
```

Alternatively, in the Azure portal, go to your Azure Data Explorer cluster. Select **Security + networking** > **Permissions** > **Add** > **AllDatabasesViewer**.

### Kusto connector

Before creating tools, [set up an ADX connector](kusto-connector.md). When adding the connector:

- Select **Database query connector** for predefined queries, not schema learning.
- Use the full cluster URL including the database: `https://<CLUSTER_NAME>.<REGION>.kusto.windows.net/<DATABASE_NAME>`.

## Parameterized queries

Make your tools flexible with parameters by using the `##parameterName##` syntax:

```kql
AppEvents
| where TimeGenerated > ago(##timeRange##)
| where EventLevel == "Error"
| where Message contains "##searchPattern##"
| take 100
```

When the agent uses this tool, it substitutes parameters based on user input.

| User says | Agent substitutes |
|---|---|
| "errors from the last day" | `timeRange=24h` |
| "find null pointer exceptions" | `searchPattern=NullPointerException` |

Parameters let one tool handle many variations of the same question.

## Execution modes (YAML)

When you define tools in YAML, choose an execution mode.

| Mode | Description | Use when |
|---|---|---|
| `Query` | Executes an inline KQL query | Most common. The query is defined directly in YAML. |
| `Function` | Calls a stored function on the cluster | Query logic is defined in Azure Data Explorer as a function |
| `Script` | Runs a KQL script from an external file | Complex multi-statement queries |

```yaml
# Query mode (most common)
spec:
  mode: Query
  query: |-
    AppEvents | take 10

# Function mode
spec:
  mode: Function
  function: GetRecentErrors
```

## Query best practices

Follow these recommendations when writing Kusto tool queries.

**Use appropriate time ranges** - Default to recent data:

```kql
| where TimeGenerated > ago(1h)
```

**Add result limits** - Prevent overwhelming output:

```kql
| take 100
```

**Include helpful projections** - Return only the columns the agent needs:

```kql
| project TimeGenerated, Name, DurationMs, ResultCode
```

## When to use Kusto tools vs. ad-hoc queries

Choose the right approach based on your scenario.

| Scenario | Kusto tools | Ad-hoc queries |
|---|---|---|
| Standardized runbook steps | Yes | No |
| Repeatable investigation patterns | Yes | No |
| Complex multi-join queries | Yes | No |
| Exploring unfamiliar data | No | Yes |
| One-time investigations | No | Yes |

## Get started

| Resource | What you'll learn |
|---|---|
| [Create a Kusto tool](create-kusto-tool.md) | Step-by-step walkthrough with screenshots |

## Related content

| Capability | What it adds |
|---|---|
| [Custom agents](sub-agents.md) | Assign tools to specialized custom agents |
| [Connectors](connectors.md) | Connect other data sources |
