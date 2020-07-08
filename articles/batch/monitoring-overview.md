---
title: Monitor Azure Batch
description: Learn about Azure monitoring services, metrics, diagnostic logs, and other monitoring features for Azure Batch.
ms.topic: how-to
ms.date: 04/05/2018
---

# Monitor Batch solutions

Azure and the Batch service provide a range of services, tools, and APIs to monitor your Batch solutions. This overview article helps you choose a monitoring approach that fits your needs.

For an overview of the Azure components and services available to monitor Azure resources, see [Monitoring Azure applications and resources](../monitoring-and-diagnostics/monitoring-overview.md).

## Subscription-level monitoring

At the subscription level, which includes Batch accounts, the [Azure activity log](../azure-monitor/platform/platform-logs-overview.md) collects operational event data in [several categories](../azure-monitor/platform/activity-log-view.md#categories-in-the-activity-log).

For Batch accounts specifically, the activity log collects events related to account creation and deletion and key management.

One way to retrieve events from your activity log is to use the Azure portal. Click **All services** > **Activity Log**. Or, query for events using the Azure CLI, PowerShell cmdlets, or the Azure Monitor REST API. You can also export the activity log, or configure [activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts-new-experience.md).

## Batch account-level monitoring

Monitor each Batch account using features of [Azure Monitor](../azure-monitor/overview.md). Azure Monitor collects [metrics](../azure-monitor/platform/data-platform-metrics.md) and optionally [diagnostic logs](../azure-monitor/platform/platform-logs-overview.md) for resources scoped at the level of a Batch account, such as pools, jobs, and tasks. Collect and consume this data manually or programmatically to monitor activities in your Batch account and to diagnose issues. For details, see [Batch metrics, alerts, and logs for diagnostic evaluation and monitoring](batch-diagnostics.md).
 
> [!NOTE]
> Metrics are available by default in your Batch account without additional configuration, and they have a 30-day rolling history. You must enable diagnostic logging for a Batch account, and you may incur additional costs to store or process diagnostic log data. 

## Batch resource monitoring

In your Batch applications, use the Batch APIs to monitor or query the status of your resources including jobs, tasks, nodes, and pools. For example:

* [Count tasks and compute nodes by state](batch-get-resource-counts.md)
* [Create queries to list Batch resources efficiently](batch-efficient-list-queries.md)
* [Create task dependencies](batch-task-dependencies.md)
* Use a [job manager task](/rest/api/batchservice/job/add#jobmanagertask)
* Monitor the [task state](/rest/api/batchservice/task/list#taskstate)
* Monitor the [node state](/rest/api/batchservice/computenode/list#computenodestate)
* Monitor the [pool state](/rest/api/batchservice/pool/get#poolstate)
* Monitor [pool usage in the account](/rest/api/batchservice/pool/listusagemetrics)
* [Count pool nodes by state](/rest/api/batchservice/account/listpoolnodecounts)

## VM performance counters and application monitoring

* [Application Insights](../azure-monitor/app/app-insights-overview.md) is an Azure service you can use to programmatically monitor the availability, performance, and usage of your Batch jobs and tasks. Easily get performance counters from compute nodes (VMs) and custom information for tasks off of the VMs. 

  For an example, see [Monitor and debug a Batch .NET application with Application Insights](monitor-application-insights.md) and the accompanying [code sample](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/ApplicationInsights).

  > [!NOTE]
  > You may incur additional costs to use Application Insights. See the [pricing options](https://azure.microsoft.com/pricing/details/application-insights/). 
  >

* [Batch Explorer](https://github.com/Azure/BatchExplorer) is a free, rich-featured, standalone client tool to help create, debug, and monitor Azure Batch applications. Download an [installation package](https://azure.github.io/BatchExplorer/) for Mac, Linux, or Windows. Optionally configure your Batch solution to [display Application Insights data](https://github.com/Azure/batch-insights) such as VM performance counters in Batch Explorer.


## Next steps

* Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
* Learn more about [diagnostic logging](batch-diagnostics.md) with Batch.