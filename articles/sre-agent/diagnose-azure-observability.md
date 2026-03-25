---
title: Diagnose with Azure Observability in Azure SRE Agent
description: Learn how your agent queries Application Insights, Log Analytics, Azure Monitor metrics, Activity Logs, Resource Graph, and resource-specific diagnostics automatically without connectors.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/04/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: azure, application-insights, log-analytics, azure-monitor, resource-graph, diagnosis, kusto, kql, azure-sdk, alert-management, az-cli, diagnostics, built-in-tools
#customer intent: As an SRE, I want to understand how my agent uses Azure's built-in observability tools so that I can diagnose incidents faster without switching between portals.
---

# Diagnose with Azure observability in Azure SRE Agent
Your agent queries Application Insights, Log Analytics, Azure Monitor metrics, Resource Graph, Activity Logs, and resource-specific diagnostics in a single investigation. No connectors are required because everything works through managed identity and Azure RBAC. Your agent decides which sources to query based on the symptom, correlates evidence across them, and explains the findings.

> [!TIP]
> Key benefits of Azure observability diagnostics:
>
> - Your agent queries App Insights, Log Analytics, Azure Monitor metrics, Resource Graph, Activity Logs, and resource-specific diagnostics — all in one investigation.
> - No connectors are needed — everything works through managed identity and Azure RBAC.
> - Your agent decides which sources to query based on the symptom, correlates evidence across them, and explains what it found.
> - Deep diagnostics go beyond metrics — CPU profiling, memory analysis, connectivity checks, and deployment history.

## The problem: too many places to look

Azure's observability stack is comprehensive. Application Insights captures traces and dependencies. Log Analytics stores custom logs and events. Azure Monitor tracks resource metrics. Resource Graph maps topology. Activity Logs record configuration changes. Each Azure service has its own diagnostics including Container Apps console logs, App Service deployment history, Function App health checks, and AKS pod status.

That breadth is the problem. During an incident, you need data from several of these sources, but you have to remember which portal has which data, write KQL from scratch, manually copy operation IDs between tools, and correlate timestamps across tabs. The data exists everywhere. Knowing where to look and connecting what you find is what takes the most time.

## How your agent investigates

The following diagram shows how your agent diagnoses Azure services by querying Application Insights, Log Analytics, Azure Monitor metrics, Resource Graph, Activity Logs, along with built-in skills and the Azure CLI for resource-specific diagnostics.

:::image type="content" source="media/diagnose-azure-observability/diagnose-azure-services.svg" alt-text="Diagram that shows how the agent diagnoses Azure services by querying multiple Azure observability sources.":::

Your agent has built-in access to Azure's full diagnostic surface. Grant permissions once, and your agent queries the right sources automatically based on the symptom:

1. **Discovers resources** — Resource Graph finds topology, relationships, and connected resources across your subscriptions.
1. **Queries logs** — Application Insights for request traces, exceptions, and dependencies; Log Analytics for custom workspace data.
1. **Analyzes metrics** — Azure Monitor for CPU, memory, request rates, and availability with automatic time-series analysis.
1. **Checks changes** — Activity Logs surface recent configuration changes and deployments that might correlate with the issue.
1. **Runs deep diagnostics** — Built-in skills perform CPU profiling, memory analysis, latency assessment, connectivity checks, and resource-specific health analysis.
1. **Executes Azure CLI commands** — Reads resource state, checks configurations, and inspects properties that APIs don't expose directly.
1. **Correlates everything** — Evidence from all sources is connected automatically, with no copy-paste between portals.

> [!NOTE]
> Your agent selects the right tools for each resource type automatically. You don't configure which tools to use. Your agent decides based on the symptom and the resource involved.

## What makes this different

Azure's observability capabilities are excellent. The challenge is navigating them under pressure. Your agent eliminates the cognitive overhead of knowing where to look and how to connect what you find.

**Single investigation instead of portal-hopping.** Your agent queries all sources in one investigation. You don't need to remember whether a specific metric lives in Azure Monitor, Application Insights, or a resource-specific blade.

**Symptom-driven queries instead of writing KQL from scratch.** Your agent constructs queries based on the symptom. It knows which tables to query, which dimensions to split by, and how to interpret the results in context.

**Automatic correlation instead of manual correlation.** Your agent follows the thread automatically by inspecting operation IDs, timestamps, resource relationships, deployment timelines across every source it queries.

| Capability | What it contributes |
|---|---|
| [Memory and knowledge](memory.md) | Recalls what worked for similar issues; your docs explain application-specific telemetry |
| [Run modes](run-modes.md) | Control whether your agent investigates only or also takes action |

## Before and after

The following table compares the manual diagnostic process with the agent-assisted approach.

|  | Before | After |
|---|---|---|
| **Tools opened** | 3–5 portals, separate browser tabs | None. Your agent queries them all. |
| **Query writing** | KQL from scratch for each source | Your agent constructs queries from symptoms |
| **Correlation** | Copy operation IDs between portals | Automatic cross-source correlation |
| **Deep diagnostics** | Navigate to resource-specific blades | Your agent runs CPU profiling, connectivity checks, and deployment history automatically |
| **Interpretation** | You read raw results across tools | Your agent explains what the evidence means together |
| **Which tool?** | You remember which portal has which data | Your agent knows |

## Built-in diagnostic capabilities

Your agent uses these capabilities automatically during investigation. For the full list of available tools, see [Tools](tools.md).

### Application Insights

Your agent queries Application Insights resources directly by using their resource ID or app ID. It runs KQL, correlates time series, traces distributed transactions, and assesses the scope of impact.

When investigating slow responses, for example, your agent might query the `requests` table for duration spikes, use time-series correlation to identify which endpoints and result codes contribute, trace a slow request through all dependencies, and report: "Endpoint `/api/orders` is 5x slower due to SQL dependency timeout."

### Log Analytics

Your agent runs KQL queries against Log Analytics workspaces by using either resource ID or workspace ID. This process covers custom logs, performance counters, Azure diagnostic logs, and any other data routed to a workspace.

### Azure Monitor metrics

Your agent discovers available metrics for any resource type, queries time-series data with dimension filtering, and performs automated trend analysis. It can also generate charts from metric data for inclusion in reports and investigation threads.

When your agent uses Azure Monitor as its incident platform, it also manages alerts directly by acknowledging and closing them during investigation.

### Resource Graph and Activity Logs

Your agent uses Resource Graph and Activity Logs to discover resources and correlate changes with incidents.

**Resource Graph** discovers resources across your subscriptions, maps topology, and finds connected resources. Your agent uses this tool to understand the full blast radius by finding related resources in the same resource group, virtual network, or App Service plan.

**Activity Logs** surface recent configuration changes, deployments, and administrative actions. These logs help your agent correlate an outage with a recent change - "App started failing 4 minutes after this deployment" or "network rules changed at the same time availability dropped."

### Built-in skills and Azure CLI

Beyond metrics and logs, your agent has specialized capabilities that go deeper.

| Category | What it does |
|---|---|
| **Deep diagnostics** | CPU profiling, memory analysis, latency assessment, threadpool starvation detection |
| **Connectivity checks** | TCP connectivity tests, DNS resolution, storage connectivity verification |
| **Resource-specific diagnostics** | Container app revision management, App Service configuration checks, Function App deployment history, AKS kubectl commands, Redis diagnostics, PostgreSQL health, API Management analysis |
| **Reliability assessment** | App Service health scoring: AlwaysOn, health checks, instance count, auto-heal configuration |
| **Azure CLI** | Read commands (`az ... show`, `az ... list`) for any Azure service, and write commands (`az ... update`, `az ... scale`) with approval |
| **ARM operations** | Direct resource property inspection, app settings management, deployment slot operations |

Your agent selects these tools based on the resource type and the nature of the problem. A container app issue triggers revision listing and console log inspection. An App Service issue triggers CPU profiling and deployment history. You don't configure this behavior as it happens automatically.

## Investigation example

The following example shows how your agent investigates an error in a container app.

**You**: "My container app ca-web is throwing errors."

**Agent investigates**:

1. **Finds the resource** via Resource Graph:

    ```console
    Found: /subscriptions/.../resourceGroups/rg-groceryapp/providers/Microsoft.App/containerApps/ca-web-3syj3i2fat5dm
    Latest revision: ca-web-3syj3i2fat5dm--azd-1769393374 (100% traffic)
    ```

1. **Checks logs, metrics, and diagnostics**:
    - Console logs: web starts normally, listens on port 3000
    - Metrics (last 30 min): requests = 0, CPU ≈ 0%, memory ≈ 3%
    - Container health: running, no restarts
    - No stack traces or 4xx/5xx errors in this container

1. **You provide more context**: "ERROR Supplier API is rate limited!"

1. **Continues investigation** checks related API container logs and configuration:

    ```kql
    ContainerAppConsoleLogs_CL
    | where RevisionName_s contains "ca-api"
    | where Log_s contains "rate" or Log_s contains "limit"
    ```

    Found: `SUPPLIER_RATE_LIMIT=5` in the environment, but the agent observed request bursts of 40/min.

**Agent conclusion**: "API exceeding supplier rate limit configured at 5 requests/min but observed bursts up to 40/min. Recommend implementing client-side throttling with exponential backoff."

## Get started

Azure observability is built in which means that no connectors are required. Grant your agent these permissions:

| Scope | Role | What it enables |
|---|---|---|
| Subscription | **Reader** | Resource discovery, Resource Graph, Activity Logs |
| Subscription | **Monitoring Contributor** | Alert management: acknowledge and close Azure Monitor alerts |
| Application Insights | **Monitoring Reader** | Traces, exceptions, dependencies via KQL |
| Log Analytics workspace | **Log Analytics Reader** | KQL queries on workspace data |

> [!NOTE]
> If your agent uses Azure Monitor as its incident platform, the **Monitoring Contributor** role is required at the subscription level. Your agent receives this role automatically when created through the portal. This permission enables your agent to acknowledge and close alerts during investigation. Without it, your agent can still query metrics and resource health, but can't manage alert states.

> [!TIP]
> If your agent uses Azure Monitor as its incident platform and its managed identity is missing the **Monitoring Contributor** role, a warning banner appears in the chat interface. This role is required specifically for alert management which acknowledges and closes Azure Monitor alerts. Your agent can still read metrics, logs, and resource health without it.
>
> The banner includes an **Assign Monitoring Contributor role** button that assigns the role directly. There's no need to navigate to the Azure portal. You can also dismiss the banner if you prefer to assign the role manually.

## When to use external tools

Azure observability covers most scenarios for applications running on Azure. You might need other tools when your data lives elsewhere.

| Scenario | Solution |
|---|---|
| Custom metrics in Azure Data Explorer | [Set up Kusto tools](kusto-tools.md) |
| Logs in Datadog, Splunk, or other platforms | [Configure external observability](diagnose-observability.md) |
| Specialized monitoring (Prometheus, Grafana) | [Configure external observability](diagnose-observability.md) |

## Next step

> [!div class="nextstepaction"]
> [Perform root cause analysis](./root-cause-analysis.md)

## Related content

- [Tools](tools.md)
- [Root cause analysis](root-cause-analysis.md)
- [External observability](diagnose-observability.md)
- [Kusto tools](kusto-tools.md)
