---
title: Azure Data Explorer connector in Azure SRE Agent
description: Connect your agent to Azure Data Explorer (Kusto) clusters to query logs and telemetry, with support for multiple clusters, per-cluster health checks, and identity-based grouping.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 03/23/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: kusto, adx, azure-data-explorer, connector, clusters, managed-identity, multi-cluster, telemetry
#customer intent: As an SRE, I want to connect my agent to Azure Data Explorer clusters so that it can query logs and telemetry for incident diagnosis and health checks.
---

# Azure Data Explorer connector in Azure SRE Agent

> [!TIP]
> - **Connect to ADX clusters** - Give your agent access to logs and telemetry stored in Azure Data Explorer.
> - **Multiple clusters in one connector** - Group cluster URIs by managed identity instead of creating separate connectors.
> - **Per-cluster health checks** - See which clusters are healthy and which need attention, individually.
> - **Test before you save** - The wizard tests connectivity to each cluster before creating the connector.

## Why connect to Azure Data Explorer?

Azure Data Explorer (Kusto) is where teams store operational telemetry—application logs, infrastructure metrics, deployment traces, and service health signals. Connecting your agent to ADX lets it query this data directly when diagnosing incidents, running health checks, or generating reports.

With the ADX connector, your agent can:

- Query logs across multiple clusters and databases.
- Correlate telemetry from different regions or services during an incident.
- Run scheduled health checks against your telemetry data.
- Power [Kusto tools](kusto-tools.md) with deterministic, parameterized queries.

## What the connector enables

Once you create an ADX connector, your agent automatically gains access to Kusto query tools—no additional setup required. These tools let the agent:

| Tool | What it does |
|------|--------------|
| **Query** | Run KQL queries against any connected cluster and database |
| **List databases** | Discover available databases on a cluster |
| **List tables** | Show tables within a database |
| **Table schema** | Inspect column names and types for a table |
| **Sample data** | Preview rows from a table |

This means the moment your connector tests successfully, you can ask your agent questions like:

```text
Show me error rates from the servicetelemetry database in the last 24 hours
```

The agent writes and executes KQL on your behalf, using the connector's managed identity for authentication.

### Two ways to query

| Approach | How it works | Best for |
|----------|-------------|----------|
| **Ad-hoc queries** | Agent generates KQL during chat based on your question | Investigations, exploration, one-off analysis |
| **Kusto tools** | Pre-built, parameterized KQL templates you define once | Repeatable health checks, standardized reports |

Ad-hoc queries work immediately with the connector. For Kusto tools, see [Kusto tools](kusto-tools.md) to create reusable query templates.

## How the ADX connector works

The ADX connector supports **multiple clusters in a single connector** through cluster groups. Each group shares a managed identity, so you don't need to create separate connectors for every cluster.

### Cluster groups

A cluster group is a collection of ADX cluster URIs that share the same managed identity. You can have multiple groups within one connector—each with its own identity—to handle clusters across different tenants or permission boundaries.

For example, if your production clusters use one managed identity and your staging clusters use another, you create two groups within the same connector. The "(inherit)" option on each group uses the connector-level identity by default; override it per group when needed.

### Per-cluster health checks

The connector tests each cluster individually—both during setup and on an ongoing basis. If some clusters become unreachable after saving, the connector status calls out the failing clusters by name (for example, *"2 cluster(s) failed: cluster1, cluster2"*) so you know exactly which cluster needs attention.

### Edit connectors

You can add or remove cluster URIs from an existing connector without recreating it. The edit dialog opens directly to the cluster configuration—update URIs, adjust group identities, and re-test.

## Example: connecting regional telemetry clusters

Your team runs services across three Azure regions, each with its own ADX cluster:

| Cluster | Database | Region |
|---------|----------|--------|
| `https://prod-westus.westus.kusto.windows.net/servicetelemetry` | servicetelemetry | West US |
| `https://prod-eastus.eastus.kusto.windows.net/servicetelemetry` | servicetelemetry | East US |
| `https://prod-westeu.westeurope.kusto.windows.net/servicetelemetry` | servicetelemetry | West Europe |

With cluster grouping, you create one connector named `prod-telemetry`, select your managed identity, and add all three cluster URIs in a single group. After testing confirms all three clusters connect, your agent can query telemetry from any region through one connector.

## Related content

- [Kusto tools](kusto-tools.md)
- [Connectors overview](connectors.md)
- [Set up an Azure Data Explorer connector](kusto-connector.md)
