---
title: Diagnostics in Durable Task SDKs
titleSuffix: Durable Task
description: Learn how to diagnose problems with the Durable Task SDKs in Durable Task.
author: cgillum
ms.topic: how-to
ms.date: 02/02/2026
ms.author: azfuncdf
ms.devlang: csharp
ms.custom: copilot-generated
# ms.devlang: csharp, java, javascript, python
---

# Diagnostics in Durable Task SDKs

Your options for diagnosing issues with the Durable Task SDKs depends on the Azure compute you're using, like Azure Container Apps, an Azure Kubernetes Service cluster, or an Azure App Service app. We recommend both enabling diagnostics and monitoring using [Application Insights](/azure/azure-monitor/app/app-insights-overview) *and* the [Durable Task Scheduler monitoring dashboard](./durable-task-scheduler/durable-task-scheduler-dashboard.md) to track orchestration status. 

## Application Insights

[Application Insights](/azure/azure-monitor/app/app-insights-overview) is the recommended way to monitor your apps running on the Durable Task SDKs. You can find and query these tracking events using the [Application Insights Analytics](/azure/azure-monitor/logs/log-query-overview) tool in the Azure portal.

Each lifecycle event of an orchestration instance writes a tracking event to the **traces** collection in Application Insights. 

| Compute service | Diagnostic logging instructions |
| --------------- | ------------------------------- |
| Azure Container Apps | [Monitor logs in Azure Container Apps with Log Analytics](../../container-apps/log-monitoring.md) |
| Azure App Service | [Enable diagnostic logging for apps in Azure App Service](../../app-service/troubleshoot-diagnostic-logs.md) |
| Azure Kubernetes Service | [Monitor Azure Kubernetes Service](/azure/aks/monitor-aks) |

## Durable Task Scheduler monitoring dashboard

When using the [Durable Task Scheduler](durable-task-scheduler/durable-task-scheduler.md), you can observe, manage, and debug your orchestrations using the Durable Task Scheduler dashboard. The dashboard is available when you run the [Durable Task Scheduler emulator](durable-task-scheduler/durable-task-scheduler.md#emulator-for-local-development) locally or create a scheduler resource on Azure.

### Accessing the dashboard

The emulator running locally doesn't require authentication.

For Azure-hosted schedulers, [assign the *Durable Task Data Contributor* role to your identity](durable-task-scheduler/durable-task-scheduler-identity.md). You can then access the dashboard via either:

- The task hub's dashboard endpoint URL in the Azure portal
- Navigating to `https://dashboard.durabletask.io/` and entering your scheduler and task hub information

### Dashboard capabilities

The dashboard provides the following monitoring and management features:

- **Monitor orchestration progress**: View orchestration status, filter by metadata such as state and timestamps, and review execution history.
- **View inputs and outputs**: Inspect orchestration and activity inputs and outputs.
- **Timeline view**: Visualize orchestration execution as a timeline, including activity retries and timing.
- **History view**: See detailed event sequence, timestamps, and payloads.
- **Sequence view**: Get another way of visualizing event sequence.
- **Orchestration management**: Start, pause, resume, and terminate orchestrations on demand.

For detailed instructions on setting up access and using the dashboard, see [Debug and manage orchestrations using the Durable Task Scheduler dashboard](durable-task-scheduler/durable-task-scheduler-dashboard.md).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the Durable Task Scheduler](durable-task-scheduler/durable-task-scheduler.md)