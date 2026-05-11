---
title: "Diagnostics in Durable Task SDKs: Troubleshoot and Monitor"
titleSuffix: Durable Task
description: Learn how to diagnose and troubleshoot problems with the Durable Task SDKs using Application Insights and the Durable Task Scheduler dashboard. Start monitoring today.
author: cgillum
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-sdks
ms.date: 05/05/2026
ms.author: azfuncdf
ms.devlang: csharp
ms.custom: copilot-generated
# ms.devlang: csharp, java, javascript, python
---

# Diagnostics in Durable Task SDKs

Your options for diagnosing issues with the Durable Task SDKs depend on the Azure compute you're using, like Azure Container Apps, an Azure Kubernetes Service cluster, or an Azure App Service app. We recommend enabling both [Application Insights](/azure/azure-monitor/app/app-insights-overview) *and* the [Durable Task Scheduler monitoring dashboard](../scheduler/durable-task-scheduler-dashboard.md) to get full visibility into orchestration status and failures. 

## Application Insights

[Application Insights](/azure/azure-monitor/app/app-insights-overview) is the recommended way to monitor your apps running on the Durable Task SDKs. You can find and query these tracking events using the [Application Insights Analytics](/azure/azure-monitor/logs/log-query-overview) tool in the Azure portal.

Each lifecycle event of an orchestration instance writes a tracking event to the **traces** collection in Application Insights. Use the custom dimensions on these events (like `prop__instanceId`, `prop__name`, and `prop__runtimeStatus`) to filter and query specific orchestrations.

| Compute service | Diagnostic logging instructions |
| --------------- | ------------------------------- |
| Azure Container Apps | [Monitor logs in Azure Container Apps with Log Analytics](../../container-apps/log-monitoring.md) |
| Azure App Service | [Enable diagnostic logging for apps in Azure App Service](../../app-service/troubleshoot-diagnostic-logs.md) |
| Azure Kubernetes Service | [Monitor Azure Kubernetes Service](/azure/aks/monitor-aks) |

### Example queries

Once Application Insights is enabled, use these KQL queries in **Logs** to investigate orchestration behavior:

**Find failed orchestrations:**

```kusto
traces
| where customDimensions.prop__runtimeStatus == "Failed"
| project timestamp, customDimensions.prop__instanceId, customDimensions.prop__name, message
| order by timestamp desc
| take 50
```

**Orchestration duration by name (last 24 hours):**

```kusto
traces
| where timestamp > ago(24h)
| where customDimensions.prop__runtimeStatus == "Completed"
| extend duration = todatetime(customDimensions.prop__completedTime) - todatetime(customDimensions.prop__createdTime)
| summarize avg(duration), max(duration), count() by tostring(customDimensions.prop__name)
```

## Distributed tracing with OpenTelemetry

The Durable Task SDKs support OpenTelemetry distributed tracing, which gives you end-to-end visibility across orchestrations, activities, and sub-orchestrations as correlated spans. You can export traces to any OpenTelemetry-compatible backend, including Application Insights, Jaeger, or Zipkin.

For setup instructions with code samples in all supported languages, see [OpenTelemetry and distributed tracing with Durable Task Scheduler](./durable-task-scheduler-opentelemetry-tracing.md).

## Durable Task Scheduler monitoring dashboard

The [Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md) lets you monitor orchestration status, inspect inputs/outputs, view execution timelines, and manage orchestrations (start, pause, resume, terminate). It's available with both the local emulator and Azure-hosted schedulers.

### Access the dashboard

- **Local emulator**: No authentication required. The dashboard is available at `http://localhost:8082`.
- **Azure-hosted scheduler**: [Assign the *Durable Task Data Contributor* role to your identity](../scheduler/durable-task-scheduler-identity.md), then access the dashboard via the task hub's endpoint URL in the Azure portal or at `https://dashboard.durabletask.io/`.

For full setup and usage instructions, see [Debug and manage orchestrations using the Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md).

## Common issues

| Symptom | Possible cause | Resolution |
| ------- | -------------- | ---------- |
| Orchestration stuck in "Running" | Activity threw an unhandled exception and no retry policy is configured | Check Application Insights for exception details; add a retry policy or try/catch in the orchestrator |
| Activity keeps retrying indefinitely | Retry policy has no `maxNumberOfAttempts` limit | Set a maximum retry count in your retry policy configuration |
| Orchestration not starting | Worker isn't polling the correct task hub | Verify the connection string task hub name matches the scheduler resource |
| No traces in Application Insights | Connection string not configured or SDK not emitting telemetry | Verify `APPLICATIONINSIGHTS_CONNECTION_STRING` is set; ensure the OpenTelemetry `Microsoft.DurableTask` source is registered |
| Dashboard shows no orchestrations | Role assignment missing or wrong task hub selected | Confirm you have *Durable Task Data Contributor* role; check the task hub name in the dashboard URL |
| Orchestration completed but result is empty | Activity returned `null` or serialization failed | Inspect activity outputs in the dashboard's history view; check serializer configuration |

## Next steps

- [OpenTelemetry and distributed tracing with Durable Task Scheduler](./durable-task-scheduler-opentelemetry-tracing.md)
- [Debug and manage orchestrations using the Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md)
- [Durable Task Scheduler overview](../scheduler/durable-task-scheduler.md)