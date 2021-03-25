---
title: Metrics, alerts, and diagnostic logs
description: Record and analyze diagnostic log events for Azure Batch account resources like pools and tasks.
ms.topic: how-to
ms.date: 03/25/2020
ms.custom: seodec18

---
# Batch metrics, alerts, and logs for diagnostic evaluation and monitoring

Azure Monitor collects [metrics](../azure-monitor/essentials/data-platform-metrics.md) and [diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md) for resources in your Azure Batch account.

You can collect and consume this data in a variety of ways to monitor your Batch account and diagnose issues. You can also configure [metric alerts](../azure-monitor/alerts/alerts-overview.md) so you receive notifications when a metric reaches a specified value.

## Batch metrics

[Metrics](../azure-monitor/essentials/data-platform-metrics.md)  are Azure telemetry data (also called performance counters) that are emitted by your Azure resources and consumed by the Azure Monitor service. Examples of metrics in a Batch account are Pool Create Events, Low-Priority Node Count, and Task Complete Events. These metrics can help identify trends and can be used for data analysis.

See the [list of supported Batch metrics](../azure-monitor/essentials/metrics-supported.md#microsoftbatchbatchaccounts).

Metrics are:

- Enabled by default in each Batch account without additional configuration
- Generated every 1 minute
- Not persisted automatically, but have a 30-day rolling history. You can persist activity metrics as part of diagnostic logging.

## View Batch metrics

In the Azure portal, the **Overview** page for the Batch account will show key node, core, and task metrics by default.

To view additional metrics for a Batch account:

1. In the Azure portal, select **All services** > **Batch accounts**, and then select the name of your Batch account.
1. Under **Monitoring**, select **Metrics**.
1. Select **Add metric** and then choose a metric from the dropdown list.
1. Select an **Aggregation** option for the metric. For count-based metrics (like "Dedicated Core Count" or "Low-Priority Node Count"), use the **Avg** aggregation. For event-based metrics (like "Pool Resize Complete Events"), use the **Count**" aggregation. Avoid using the **Sum** aggregation, which adds up the values of all data points received over the period of the chart.
1. To add additional metrics, repeat steps 3 and 4.

You can also retrieve metrics programmatically with the Azure Monitor APIs. For an example, see [Retrieve Azure Monitor metrics with .NET](samples/azure-samples/monitor-dotnet-metrics-api/monitor-dotnet-metrics-api/).

> [!NOTE]
> Metrics emitted in the last 3 minutes may still be aggregating, so values may be under-reported during this timeframe. Metric delivery is not guaranteed, and may be affected by out-of-order delivery, data loss, or duplication.

## Batch metric alerts

You can configure near real-time metric alerts that trigger when the value of a specified metric crosses a threshold that you assign. The alert generates a notification when the alert is "Activated" (when the threshold is crossed and the alert condition is met) as well as when it is "Resolved" (when the threshold is crossed again and the condition is no longer met).

Because metric delivery can be subject to inconsistencies such as out-of-order delivery, data loss, or duplication, we recommend avoiding alerts that trigger on a single data point. Instead, use thresholds to account for any inconsistencies such as out-of-order delivery, data loss, and duplication over a period of time.

For example, you might want to configure a metric alert when your low priority core count falls to a certain level, so you can adjust the composition of your pools. For best results, set a period of 10 or more minutes, where the alert will be triggered if the average low priority core count falls below the threshold value for the entire period. This allows time for metrics to aggregate so that you get more accurate results.

To configure a metric alert in the Azure portal:

1. Select **All services** > **Batch accounts**, and then select the name of your Batch account.
1. Under **Monitoring**, select **Alerts**, then select **New alert rule**.
1. Select **Add condition**, then choose a metric.
1. Select the desired values for **Chart period**, **Threshold**, **Operator**, and **Aggregation type**.
1. Enter a **Threshold value** and select the **Unit** for the threshold.  Then select **Done**.
1. Add an [action group](../azure-monitor/alerts/action-groups.md) to the alert either by selecting an existing action group or creating a new action group.
1. In the **Alert rule details** section, enter an **Alert rule name** and **Description**. If you want the alert to be enabled immediately, ensure that the **Enable alert rule upon creation** box is checked.
1. Select **Create alert rule**.

For more information about creating metric alerts, see [Understand how metric alerts work in Azure Monitor](../azure-monitor/alerts/alerts-metric-overview.md) and [Create, view, and manage metric alerts using Azure Monitor](../azure-monitor/alerts/alerts-metric.md).

You can also configure a near real-time alert using the [Azure Monitor REST API](/rest/api/monitor/). For more information, see [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md). To include job, task, or pool-specific information in your alerts, see [Respond to events with Azure Monitor Alerts](../azure-monitor/alerts/tutorial-response.md).

## Batch diagnostics

[Diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md) contain information emitted by Azure resources that describe the operation of each resource. For Batch, you can collect the following logs:

- **ServiceLog**: [events emitted by the Batch service](#service-log-events) during the lifetime of an individual resource such as a pool or task.
- **AllMetrics**: Metrics at the Batch account level.

You must explicitly enable diagnostic settings for each Batch account you want to monitor.

### Log destination options

A common scenario is to select an Azure Storage account as the log destination. To store logs in Azure Storage, create the account before enabling collection of logs. If you associated a storage account with your Batch account, you can choose that account as the log destination.

Alternately, you can:

- Stream Batch diagnostic log events to an [Azure Event Hub](../event-hubs/event-hubs-about.md). Event Hubs can ingest millions of events per second, which you can then transform and store using any real-time analytics provider.
- Send diagnostic logs to [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md), where you can analyze them or export them for analysis in Power BI or Excel.

> [!NOTE]
> You may incur additional costs to store or process diagnostic log data with Azure services.

### Enable collection of Batch diagnostic logs

To create a new diagnostic setting in the Azure portal, follow the steps below.

1. In the Azure portal, select **All services** > **Batch accounts**, and then select the name of your Batch account.
2. Under **Monitoring**, select **Diagnostic settings**.
3. In **Diagnostic settings**, select **Add diagnostic setting**.
4. Enter a name for the setting.
5. Select a destination: **Send to Log Analytics**, **Archive to a storage account**, or **Stream to an event hub**. If you select a storage account, you can optionally select the number of days to retain data for each log. If you don't specify a number of days for retention, data is retained during the life of the storage account.
6. Select **ServiceLog**, **AllMetrics**, or both.
7. Select **Save** to create the diagnostic setting.

You can also enable log collection by [creating diagnostic settings in the Azure portal](../azure-monitor/essentials/diagnostic-settings.md), using a [Resource Manager template](../azure-monitor/essentials/resource-manager-diagnostic-settings.md), or using Azure PowerShell or the Azure CLI. For more information, see [Overview of Azure platform logs](../azure-monitor/essentials/platform-logs-overview.md).

### Access diagnostics logs in storage

If you [archive Batch diagnostic logs in a storage account](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage), a storage container is created in the storage account as soon as a related event occurs. Blobs are created according to the following naming pattern:

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

Below is an example of a `PoolResizeCompleteEvent` entry in a `PT1H.json` log file. It includes information about the current and target number of dedicated and low-priority nodes, as well as the start and end time of the operation:

```json
{ "Tenant": "65298bc2729a4c93b11c00ad7e660501", "time": "2019-08-22T20:59:13.5698778Z", "resourceId": "/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.BATCH/BATCHACCOUNTS/MYBATCHACCOUNT/", "category": "ServiceLog", "operationName": "PoolResizeCompleteEvent", "operationVersion": "2017-06-01", "properties": {"id":"MYPOOLID","nodeDeallocationOption":"Requeue","currentDedicatedNodes":10,"targetDedicatedNodes":100,"currentLowPriorityNodes":0,"targetLowPriorityNodes":0,"enableAutoScale":false,"isAutoPool":false,"startTime":"2019-08-22 20:50:59.522","endTime":"2019-08-22 20:59:12.489","resultCode":"Success","resultMessage":"The operation succeeded"}}
```

To access the logs in your storage account programmatically, use the Storage APIs.

### Service log events

Azure Batch service logs contain events emitted by the Batch service during the lifetime of an individual Batch resource, such as a pool or task. Each event emitted by Batch is logged in JSON format. For example, this is the body of a sample **pool create event**:

```json
{
    "poolId": "myPool1",
    "displayName": "Production Pool",
    "vmSize": "Small",
    "cloudServiceConfiguration": {
        "osFamily": "5",
        "targetOsVersion": "*"
    },
    "networkConfiguration": {
        "subnetId": " "
    },
    "resizeTimeout": "300000",
    "targetDedicatedComputeNodes": 2,
    "taskSlotsPerNode": 1,
    "vmFillType": "Spread",
    "enableAutoscale": false,
    "enableInterNodeCommunication": false,
    "isAutoPool": false
}
```

Service log events emitted by the Batch service include the following:

- [Pool create](batch-pool-create-event.md)
- [Pool delete start](batch-pool-delete-start-event.md)
- [Pool delete complete](batch-pool-delete-complete-event.md)
- [Pool resize start](batch-pool-resize-start-event.md)
- [Pool resize complete](batch-pool-resize-complete-event.md)
- [Pool autoscale](batch-pool-autoscale-event.md)
- [Task start](batch-task-start-event.md)
- [Task complete](batch-task-complete-event.md)
- [Task fail](batch-task-fail-event.md)
- [Task schedule fail](batch-task-schedule-fail-event.md)

## Next steps

- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
- Learn more about [monitoring Batch solutions](monitoring-overview.md).
