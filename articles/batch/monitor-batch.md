---
title: Monitor Azure Batch
description: Start here to learn how to monitor Azure Batch.
ms.date: 03/06/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.service: batch
---

# Monitor Azure Batch

[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Batch monitoring

In your Batch applications, you can use the [Batch .NET library](/dotnet/api/microsoft.azure.batch) to monitor or query the status of your resources including jobs, tasks, nodes, and pools. For example:

- [Create task dependencies](batch-task-dependencies.md)
- Use a [job manager task](/rest/api/batchservice/job/add#jobmanagertask)
- Monitor the [task state](/rest/api/batchservice/task/list#taskstate)
- Monitor the [node state](/rest/api/batchservice/computenode/list#computenodestate)
- Monitor the [pool state](/rest/api/batchservice/pool/get#poolstate)
- Monitor [pool usage in the account](/rest/api/batchservice/pool/listusagemetrics)
- Count [pool nodes by state](/rest/api/batchservice/account/listpoolnodecounts)

### Create list queries

Most Azure Batch applications do monitoring or other operations that query the Batch service. You can use the Batch APIs to create list queries for Batch jobs, tasks, compute nodes, and other resources.

Reducing the amount of data that the Batch service returns for queries improves your application's performance. For more information about how to create and execute filtered list queries, see [Create queries to list Batch resources efficiently](batch-efficient-list-queries.md).

### Count tasks and nodes

Instead of potentially time-consuming list queries that return detailed information about large collections of tasks or nodes, you can use the [Get Task Counts](/rest/api/batchservice/job/gettaskcounts) and [List Pool Node Counts](/rest/api/batchservice/account/listpoolnodecounts) operations to get counts for Batch tasks and compute nodes. For more information, see [Monitor Batch solutions by counting tasks and nodes by state](batch-get-resource-counts.md). At times, the numbers returned by these operations might not be up to date. If you need to be sure that a count is accurate, use list queries to count these resources. 

### Use Batch Explorer

[Batch Explorer](https://github.com/Azure/BatchExplorer) is a free, rich-featured, standalone client tool to help create, debug, and monitor Azure Batch applications. Download an [installation package](https://azure.github.io/BatchExplorer/) for Mac, Linux, or Windows. Optionally, use [Azure Batch Insights](https://github.com/Azure/batch-insights) to get system statistics for your Batch nodes, such as VM performance counters, in Batch Explorer.

[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Integrating Application Insights with your Azure Batch application allows you to gain deep insights into behaviors and investigate issues in near-real time. Application Insights lets you monitor performance counters from compute nodes (VMs) and retrieve custom information for the tasks that run on them. Use Application Insights to monitor performance counters and exceptions as well as instrument your code with custom metrics and tracing.

For a detailed walkthrough and accompanying [code sample](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/ApplicationInsights) showing how to add and configure the Application Insights library in your Azure Batch .NET solution and instrument your application code, monitor your application via the Azure portal, and build custom dashboards, see [Monitor and debug an Azure Batch .NET application with Application Insights](monitor-application-insights.md).

> [!NOTE]
> You might incur costs to use Application Insights. See the [pricing information](https://azure.microsoft.com/pricing/details/application-insights).

[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Batch, see [Batch monitoring data reference](monitor-batch-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

### Access diagnostics logs in storage

If you [archive Batch diagnostic logs in a storage account](/azure/azure-monitor/essentials/resource-logs#send-to-azure-storage), a storage container is created in the storage account as soon as a related event occurs. Blobs are created according to the following naming pattern:

```json
insights-{log category name}/resourceId=/SUBSCRIPTIONS/{subscription ID}/
RESOURCEGROUPS/{resource group name}/PROVIDERS/MICROSOFT.BATCH/
BATCHACCOUNTS/{Batch account name}/y={four-digit numeric year}/
m={two-digit numeric month}/d={two-digit numeric day}/
h={two-digit 24-hour clock hour}/m=00/PT1H.json
```

For example:

```json
insights-metrics-pt1m/resourceId=/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/
RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.BATCH/
BATCHACCOUNTS/MYBATCHACCOUNT/y=2018/m=03/d=05/h=22/m=00/PT1H.json
```

Each `PT1H.json` blob file contains JSON-formatted events that occurred within the hour specified in the blob URL (for example, `h=12`). During the present hour, events are appended to the `PT1H.json` file as they occur. The minute value (`m=00`) is always `00`, since diagnostic log events are broken into individual blobs per hour. (All times are in UTC.)

The following example shows a `PoolResizeCompleteEvent` entry in a `PT1H.json` log file. It includes information about the current and target number of dedicated and low-priority nodes, as well as the start and end time of the operation:

```json
{ "Tenant": "65298bc2729a4c93b11c00ad7e660501", "time": "2019-08-22T20:59:13.5698778Z", "resourceId": "/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.BATCH/BATCHACCOUNTS/MYBATCHACCOUNT/", "category": "ServiceLog", "operationName": "PoolResizeCompleteEvent", "operationVersion": "2017-06-01", "properties": {"id":"MYPOOLID","nodeDeallocationOption":"Requeue","currentDedicatedNodes":10,"targetDedicatedNodes":100,"currentLowPriorityNodes":0,"targetLowPriorityNodes":0,"enableAutoScale":false,"isAutoPool":false,"startTime":"2019-08-22 20:50:59.522","endTime":"2019-08-22 20:59:12.489","resultCode":"Success","resultMessage":"The operation succeeded"}}
```

To access the logs in your storage account programmatically, use the [Storage APIs](/rest/api/storageservices).

[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

Examples of metrics in a Batch account are Pool Create Events, Low-Priority Node Count, and Task Complete Events. These metrics can help identify trends and can be used for data analysis.

> [!NOTE]
> Metrics emitted in the last 3 minutes might still be aggregating, so values might be underreported during this time frame. Metric delivery isn't guaranteed and might be affected by out-of-order delivery, data loss, or duplication.

For a complete list of available metrics for Batch, see [Batch monitoring data reference](monitor-batch-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For Batch, you can collect the following logs:

- **ServiceLog**: [events emitted by the Batch service](#service-log-events) during the lifetime of an individual resource such as a pool or task.
- **AllMetrics**: metrics at the Batch account level.

You must explicitly enable diagnostic settings for each Batch account you want to monitor.

When you create a Batch pool, you can install any of the following monitoring-related extensions on the compute nodes to collect and analyze logs:

- [Azure Monitor Logs analytics and monitoring extension for Linux](/azure/virtual-machines/extensions/oms-linux)
- [Azure Monitor Logs analytics and monitoring extension for Windows](/azure/virtual-machines/extensions/oms-windows)
- [Azure Diagnostics extension for Windows VMs](/azure/virtual-machines/windows/extensions-diagnostics)
- [Azure Monitor agent for Linux](/azure/azure-monitor/agents/azure-monitor-agent-manage)
- [Azure Monitor agent for Windows](/azure/azure-monitor/agents/azure-monitor-agent-manage)

The following screenshot shows an example diagnostic setting that sends **allLogs** and **AllMetrics** to a Log Analytics workspace.

:::image type="content" source="./media/batch-diagnostics/configure-diagnostic-setting.png" alt-text="Screenshot of the Diagnostic setting page that shows an example." lightbox="./media/batch-diagnostics/configure-diagnostic-setting-lightbox.png":::

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Batch, see [Batch monitoring data reference](monitor-batch-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

To analyze count-based Batch metrics like Dedicated Core Count or Low-Priority Node Count, use the **Avg** aggregation. For event-based metrics like Pool Resize Complete Events, use the **Count** aggregation. Avoid using the **Sum** aggregation, which adds up the values of all data points received over the period of the chart.

[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

Because metric delivery can be subject to inconsistencies such as out-of-order delivery, data loss, or duplication, you should avoid alerts that trigger on a single data point. Instead, use thresholds to account for any inconsistencies such as out-of-order delivery, data loss, and duplication over a period of time.

For example, you might want to configure a metric alert when your low priority core count falls to a certain level. You could then use this alert to adjust the composition of your pools. For best results, set a period of 10 or more minutes where the alert will be triggered if the average low priority core count falls lower than the threshold value for the entire period. This time period allows for metrics to aggregate so that you get more accurate results.

### Batch alert rules

The following table lists some alert rules for Batch. These alert rules are just examples. You can set alerts for any metric, log entry, or activity log entry that's listed in the [Batch monitoring data reference](monitor-batch-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| | | |
| | | |

[!INCLUDE [horz-monitor-advisor-recommendations](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Batch monitoring data reference](monitor-batch-reference.md) for a reference of the metrics, logs, and other important values created for Batch.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
