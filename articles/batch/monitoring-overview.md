---
title: Monitor Azure Batch
description: Learn about Azure monitoring services, metrics, diagnostic logs, and other monitoring features for Azure Batch.
ms.topic: how-to
ms.date: 08/23/2021
---

# Monitor Batch solutions

[Azure Monitor](../azure-monitor/overview.md) and the Batch service provide a range of services, tools, and APIs to monitor your Batch solutions. This overview article helps you choose a monitoring approach that fits your needs.

## Subscription-level monitoring

At the subscription level, which includes Batch accounts, the [Azure activity log](../azure-monitor/essentials/activity-log.md) collects operational event data in several categories.

For Batch accounts specifically, the activity log collects events related to account creation and deletion and key management.

You can view the activity log in the Azure portal, or query for events using the Azure CLI, PowerShell cmdlets, or the Azure Monitor REST API. You can also export the activity log, or configure [activity log alerts](../azure-monitor/alerts/alerts-activity-log.md).

## Batch account-level monitoring

Monitor each Batch account using features of [Azure Monitor](../azure-monitor/overview.md). Azure Monitor collects [metrics](../azure-monitor/essentials/data-platform-metrics.md) and optionally [resource logs](../azure-monitor/essentials/resource-logs.md) for resources within a Batch account, such as pools, jobs, and tasks. Collect and consume this data manually or programmatically to monitor activities in your Batch account and to diagnose issues. For more information, see [Batch metrics, alerts, and logs for diagnostic evaluation and monitoring](batch-diagnostics.md).

> [!NOTE]
> Metrics are available by default in your Batch account without additional configuration, and they have a 30-day rolling history. You must create a diagnostic setting for a Batch account in order to send its resource logs to a Log Analytics workspace, and you may incur additional costs to store or process resource log data.

## Batch resource monitoring

In your Batch applications, use the Batch APIs to monitor or query the status of your resources including jobs, tasks, nodes, and pools. For example:

- [Count tasks and compute nodes by state](batch-get-resource-counts.md)
- [Create queries to list Batch resources efficiently](batch-efficient-list-queries.md)
- [Create task dependencies](batch-task-dependencies.md)
- Use a [job manager task](/rest/api/batchservice/job/add#jobmanagertask)
- Monitor the [task state](/rest/api/batchservice/task/list#taskstate)
- Monitor the [node state](/rest/api/batchservice/computenode/list#computenodestate)
- Monitor the [pool state](/rest/api/batchservice/pool/get#poolstate)
- Monitor [pool usage in the account](/rest/api/batchservice/pool/listusagemetrics)
- Count [pool nodes by state](/rest/api/batchservice/account/listpoolnodecounts)

## Additional monitoring solutions

Use [Application Insights](../azure-monitor/app/app-insights-overview.md) to programmatically monitor the availability, performance, and usage of your Batch jobs and tasks. Application Insights lets you monitor performance counters from compute nodes (VMs) and retrieve custom information for the tasks that run on them.

For an example, see [Monitor and debug a Batch .NET application with Application Insights](monitor-application-insights.md) and the accompanying [code sample](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/ApplicationInsights).

> [!NOTE]
> You may incur additional costs to use Application Insights. See the [pricing information](https://azure.microsoft.com/pricing/details/application-insights/).

[Batch Explorer](https://github.com/Azure/BatchExplorer) is a free, rich-featured, standalone client tool to help create, debug, and monitor Azure Batch applications. Download an [installation package](https://azure.github.io/BatchExplorer/) for Mac, Linux, or Windows. Optionally, use [Azure Batch Insights](https://github.com/Azure/batch-insights) to get system statistics for your Batch nodes, such as VM performance counters, in Batch Explorer.

## Next steps

- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
- Learn more about [diagnostic logging](batch-diagnostics.md) with Batch.
