---
title: Diagnose with External Observability in Azure SRE Agent
description: Query Azure Monitor and external observability tools like Dynatrace, Datadog, and Splunk in a single investigation through MCP.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: kusto, datadog, splunk, dynatrace, new relic, elasticsearch, third-party, observability, connectors, diagnosis, mcp, correlation
#customer intent: As an SRE, I want my agent to query both Azure Monitor and my external observability platforms in one investigation so that I can find root causes faster without manually correlating data across tools.
---

# Diagnose with external observability in Azure SRE Agent
> [!TIP]
> - Reduce 15–30 minutes of manual data stitching across platforms to minutes in a single conversation.
> - Eliminate uncertainties by correlating infrastructure, application, and business metrics in one investigation.
> - Connect any observability platform with an MCP server the same way, with no custom integrations needed.
> - Add new platforms without code changes, as your agent discovers their tools automatically.

## The problem: observability data scattered across platforms

Your applications run on Azure, but your observability stack spans multiple platforms including Dynatrace for traces, Azure Monitor for infrastructure, Splunk for logs, Kusto for business metrics. During an incident, you manually bridge these silos: copying operation IDs between tabs, correlating timestamps across query languages (DQL, KQL, SPL), and spending 15–30 minutes stitching data together before you even start diagnosing.

## How your agent solves this problem

By using [MCP (Model Context Protocol)](https://modelcontextprotocol.io/), you can connect your observability tools. Your agent queries all of these tools (both Azure and external) during every investigation.

1. **Queries Azure services** including Application Insights, Log Analytics, Azure Monitor, Resource Graph (built-in, no setup needed).
1. **Queries your external tools** including Dynatrace logs via DQL, Datadog metrics, Splunk events (via MCP connectors).
1. **Correlates signals across platforms** which connects error spikes in Dynatrace with deployment history in Azure, matches timestamps automatically.
1. **Reports a unified picture** including the investigation thread with evidence from every connected system.

The key mechanism: your agent registers tools from every connected MCP server alongside its built-in Azure tools. During an investigation, it selects the right tools based on what it's investigating, not based on which platform they come from. To learn more, see [tool selection](tools.md).

## What makes this approach different

Your agent queries all your observability platforms in one investigation, correlates signals automatically, and adapts as platforms add new capabilities.

**Unlike separate dashboards**, your agent queries all observability platforms in one investigation. You don't switch tabs or translate between query languages. Your agent handles DQL for Dynatrace, KQL for Azure, and whatever your other tools expose.

**Unlike manual correlation**, your agent connects signals across platforms automatically. When Dynatrace shows a spike in 5xx errors and Azure shows a recent container app deployment, your agent correlates those findings into a single root cause analysis.

**Unlike point-to-point integrations**, MCP is an open protocol. Services like Dynatrace, Datadog, New Relic, and Splunk each publish an MCP server that your agent connects to the same way. When a platform adds new capabilities to its MCP server, your agent discovers them automatically.

See how [MCP connectors](mcp-connector.md) work, how [custom agents](sub-agents.md) specialize by platform, and how your [knowledge base](memory.md) provides context for custom telemetry.

## Before and after

The following table compares incident investigation workflows with and without external observability integration.

| Scenario | Before | After |
|---|---|---|
| **Investigation workflow** | Open Azure Monitor, Dynatrace, and Splunk separately. You need to query each one manually. | Ask your agent once as it queries all connected platforms |
| **Signal correlation** | Copy error IDs between tools, and match timestamps manually across platforms | Your agent follows the thread across platforms and correlates automatically |
| **Context switching** | Three to five dashboards, different query languages (KQL, DQL, SPL) | One conversation. Your agent handles the queries. |
| **Time to first insight** | 15–30 minutes stitching data across tools | Minutes. Your agent queries in parallel |
| **Blind spots** | Each tool sees its own slice of infrastructure vs. application vs. business metrics | Your agent sees the whole picture across all connected systems |

## Investigation example: Cross-platform correlation

The following example shows how your agent investigates across platforms when Azure metrics alone don't tell the full story.

**Symptom**: "Orders are failing but Azure metrics look fine."

**Your agent investigates across platforms:**

1. **Checks Azure infrastructure** (built-in tools)
   - App Service: healthy, low CPU
   - Azure SQL: healthy, low DTU
   - Application Insights: no exceptions in the app layer

1. **Queries Dynatrace** (via MCP)
   - Queries for 5xx errors across services using Dynatrace's DQL tools
   - Payment service p99 latency: 12 seconds (normal: 200 ms)
   - Error volume isolated to the latest deployment revision

1. **Queries your Kusto cluster** (via Kusto)

    ```kql
    OrderEvents 
    | where Status == "Failed"
    | summarize count() by FailureReason
    ```

    - Result: 847 failures with "PaymentGatewayTimeout"

1. **Correlates findings**: "Azure infrastructure is healthy. The 5xx error spike visible in Dynatrace correlates with the deployment of revision 0000039. The 847 PaymentGatewayTimeout failures in your Kusto order data confirm the impact. Root cause: bad deployment."

**Without external observability:** The investigation stops at step 1 - "Azure is healthy, case closed." By using MCP connectors, your agent finds the actual root cause across three platforms.

## What you can connect

The following table lists supported data sources and what your agent can do with each.

| Data source | Connector | What your agent can do |
|---|---|---|
| Azure Data Explorer (Kusto) | Kusto connector | Query business metrics and custom telemetry |
| Dynatrace | MCP server | Query logs and metrics via DQL, identify error patterns |
| Datadog | MCP server | Query metrics, APM traces, logs, and monitors |
| Splunk | MCP server | Search logs, run saved searches, query events |
| New Relic | MCP server | Query metrics, traces, and application performance data |
| Elasticsearch | MCP server | Search and query Elasticsearch indices |
| Any tool with MCP | MCP server | Whatever tools the platform's MCP server exposes |

## Get started

The following table provides setup guides based on the type of tool you want to connect.

| What you want to connect | Connector | Setup guide |
|---|---|---|
| Dynatrace, Datadog, Splunk, custom tools | MCP server | [MCP connector tutorial](mcp-connector.md) |
| Azure Data Explorer (Kusto) | Kusto connector | [Kusto connector tutorial](kusto-connector.md) |
| Reusable KQL queries | Kusto tools | [Create Kusto tools](kusto-tools.md) |

## When to use each approach

The following table helps you choose the right approach based on your observability stack.

| Your observability stack | Recommended approach |
|---|---|
| All telemetry in Azure (App Insights, Log Analytics) | [Azure Observability](diagnose-azure-observability.md) works from the start |
| Azure + external APM (Dynatrace, Datadog, New Relic) | Azure Observability (built-in) + MCP connectors for each platform |
| Azure + custom business metrics in Kusto | Azure Observability + Kusto connector |
| Multi-platform (Azure + Dynatrace + Splunk + Kusto) | All. Your agent queries everything in one investigation |

## Next step

> [!div class="nextstepaction"]
> [Perform root cause analysis](./root-cause-analysis.md)

## Related content

- [Diagnose with Azure Observability](diagnose-azure-observability.md)
- [Kusto tools](kusto-tools.md)
- [Root cause analysis](root-cause-analysis.md)
- [Connectors](connectors.md)
