---
title: Metrics, alerts, and diagnostic logs
description: Learn how to record and analyze diagnostic log events for Azure Batch account resources like pools and tasks.
ms.topic: how-to
ms.date: 04/05/2023
ms.custom: seodec18

---
# Batch metrics, alerts, and logs for diagnostic evaluation and monitoring

Azure Monitor collects [metrics](../azure-monitor/essentials/data-platform-metrics.md) and [diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md) for resources in your Azure Batch account.

You can collect and consume this data in various ways to monitor your Batch account and diagnose issues. You can also configure [metric alerts](../azure-monitor/alerts/alerts-overview.md) so you receive notifications when a metric reaches a specified value.

## Batch metrics

[Metrics](../azure-monitor/essentials/data-platform-metrics.md) are Azure data (also called performance counters) that your Azure resources emit, and the Azure Monitor service consumes that data. Examples of metrics in a Batch account are Pool Create Events, Low-Priority Node Count, and Task Complete Events. These metrics can help identify trends and can be used for data analysis.

See the [list of supported Batch metrics](../azure-monitor/essentials/metrics-supported.md#microsoftbatchbatchaccounts).

Metrics are:

- Enabled by default in each Batch account without extra configuration.
- Generated every 1 minute.
- Not persisted automatically, but they have a 30-day rolling history. You can persist activity metrics as part of diagnostic logging.

## View Batch metrics

In the Azure portal, the **Overview** page for the Batch account shows key node, core, and task metrics by default.

To view other metrics for a Batch account:

1. In the Azure portal, search and select **Batch accounts**, and then select the name of your Batch account.
1. Under **Monitoring** in the left side navigation menu, select **Metrics**.
1. Select **Add metric** and then choose a metric from the dropdown list.
1. Select an **Aggregation** option for the metric. For count-based metrics (like "Dedicated Core Count" or "Low-Priority Node Count"), use the **Avg** aggregation. For event-based metrics (like "Pool Resize Complete Events"), use the **Count** aggregation. Avoid using the **Sum** aggregation, which adds up the values of all data points received over the period of the chart.
1. To add other metrics, repeat steps 3 and 4.

    :::image type="content" source="./media/batch-diagnostics/add-metric.png" alt-text="Screenshot of the metrics page of a batch account in the Azure portal. Metrics is highlighted in the left side navigation menu. The Metric and Aggregation options for a metric are highlighted as well."::: 


You can also retrieve metrics programmatically with the Azure Monitor APIs. For an example, see [Retrieve Azure Monitor metrics with .NET](/samples/azure-samples/monitor-dotnet-metrics-api/monitor-dotnet-metrics-api/).

> [!NOTE]
> Metrics emitted in the last 3 minutes might still be aggregating, so values might be under-reported during this time frame. Metric delivery is not guaranteed and might be affected by out-of-order delivery, data loss, or duplication.

## Batch metric alerts

You can configure near real-time metric alerts that trigger when the value of a specified metric crosses a threshold that you assign. The alert generates a notification when the alert is *Activated* (when the threshold is crossed and the alert condition is met). The alert also generates an alert when it's *Resolved* (when the threshold is crossed again and the condition is no longer met).

Because metric delivery can be subject to inconsistencies such as out-of-order delivery, data loss, or duplication, you should avoid alerts that trigger on a single data point. Instead, use thresholds to account for any inconsistencies such as out-of-order delivery, data loss, and duplication over a period of time.

For example, you might want to configure a metric alert when your low priority core count falls to a certain level. You could then use this alert to adjust the composition of your pools. For best results, set a period of 10 or more minutes where the alert will be triggered if the average low priority core count falls lower than the threshold value for the entire period. This time period allows for metrics to aggregate so that you get more accurate results.

To configure a metric alert in the Azure portal:

1. In the Azure portal, search and select **Batch accounts**, and then select the name of your Batch account.
1. Under **Monitoring** in the left side navigation menu, select **Alerts**, and then select **Create** > **Alert Rule**.
1. On the **Condition page**, select a **Signal** from the dropdown list.
1. Enter the logic for your **Alert Rule** in the fields specific to the **Signal** you choose. The following screenshot shows the options for **Task Fail Events**.

    :::image type="content" source="./media/batch-diagnostics/create-alert-rule.png" alt-text="Screenshot of the Conditions tab on the Create and alert rule page." lightbox="./media/batch-diagnostics/create-alert-rule-lightbox.png":::

1. Enter the name for your alert on the **Details** page. 
1. Then select **Review + create** > **Create**.

For more information about creating metric alerts, see [Types of Azure Monitor alerts](../azure-monitor/alerts/alerts-metric-overview.md) and [Create a new alert rule](../azure-monitor/alerts/alerts-metric.md).

You can also configure a near real-time alert by using the [Azure Monitor REST API](/rest/api/monitor/). For more information, see [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md). To include job, task, or pool-specific information in your alerts, see [Create a new alert rule](../azure-monitor/alerts/alerts-log.md).

## Batch diagnostics

[Diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md) contain information emitted by Azure resources that describe the operation of each resource. For Batch, you can collect the following logs:

- **ServiceLog**: [events emitted by the Batch service](#service-log-events) during the lifetime of an individual resource such as a pool or task.
- **AllMetrics**: metrics at the Batch account level.

You must explicitly enable diagnostic settings for each Batch account you want to monitor.

### Log destination options

A common scenario is to select an Azure Storage account as the log destination. To store logs in Azure Storage, create the account before enabling collection of logs. If you associated a storage account with your Batch account, you can choose that account as the log destination.

Alternately, you can:

- Stream Batch diagnostic log events to [Azure Event Hubs](../event-hubs/event-hubs-about.md). Event Hubs can ingest millions of events per second, which you can then transform and store by using any real-time analytics provider.
- Send diagnostic logs to [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md), where you can analyze them or export them for analysis in Power BI or Excel.

> [!NOTE]
> You might incur additional costs to store or process diagnostic log data with Azure services.

### Enable collection of Batch diagnostic logs

To create a new diagnostic setting in the Azure portal, use the following steps.

1. In the Azure portal, search and select **Batch accounts**, and then select the name of your Batch account.
2. Under **Monitoring** in the left side navigation menu, select **Diagnostic settings**.
3. In **Diagnostic settings**, select **Add diagnostic setting**.
4. Enter a name for the setting.
5. Select a destination: **Send to Log Analytics workspace**, **Archive to a storage account**, **Stream to an event hub**, or **Send to partner solution**. If you select a storage account, you can optionally select the number of days to retain data for each log. If you don't specify the number of days for retention, data is retained during the life of the storage account.
6. Select any options in either the  **Logs** or **Metrics** section.
7. Select **Save** to create the diagnostic setting.

The following screenshot shows an example diagnostic setting called *My diagnostic setting*. It sends **allLogs** and **AllMetrics** to a Log Analytics workspace.

:::image type="content" source="./media/batch-diagnostics/configure-diagnostic-setting.png" alt-text="Screenshot of the Diagnostic setting page that shows an example." lightbox="./media/batch-diagnostics/configure-diagnostic-setting-lightbox.png":::

You can also enable log collection by [creating diagnostic settings in the Azure portal](../azure-monitor/essentials/diagnostic-settings.md) by using a [Resource Manager template](../azure-monitor/essentials/resource-manager-diagnostic-settings.md). You can also use Azure PowerShell or the Azure CLI. For more information, see [Overview of Azure platform logs](../azure-monitor/essentials/platform-logs-overview.md).

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

The following example shows a `PoolResizeCompleteEvent` entry in a `PT1H.json` log file. It includes information about the current and target number of dedicated and low-priority nodes, as well as the start and end time of the operation:

```json
{ "Tenant": "65298bc2729a4c93b11c00ad7e660501", "time": "2019-08-22T20:59:13.5698778Z", "resourceId": "/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.BATCH/BATCHACCOUNTS/MYBATCHACCOUNT/", "category": "ServiceLog", "operationName": "PoolResizeCompleteEvent", "operationVersion": "2017-06-01", "properties": {"id":"MYPOOLID","nodeDeallocationOption":"Requeue","currentDedicatedNodes":10,"targetDedicatedNodes":100,"currentLowPriorityNodes":0,"targetLowPriorityNodes":0,"enableAutoScale":false,"isAutoPool":false,"startTime":"2019-08-22 20:50:59.522","endTime":"2019-08-22 20:59:12.489","resultCode":"Success","resultMessage":"The operation succeeded"}}
```

To access the logs in your storage account programmatically, use the [Storage APIs](/rest/api/storageservices/).

### Service log events

Azure Batch service logs contain events emitted by the Batch service during the lifetime of an individual Batch resource, such as a pool or task. Each event emitted by Batch is logged in JSON format. The following example shows the body of a sample **pool create event**:

```json
{
    "id": "myPool1",
    "displayName": "Production Pool",
    "vmSize": "Standard_F1s",
    "imageType": "VirtualMachineConfiguration",
    "cloudServiceConfiguration": {
        "osFamily": "3",
        "targetOsVersion": "*"
    },
    "networkConfiguration": {
        "subnetId": " "
    },
    "virtualMachineConfiguration": {
          "imageReference": {
            "publisher": " ",
            "offer": " ",
            "sku": " ",
            "version": " "
          },
          "nodeAgentId": " "
        },
    "resizeTimeout": "300000",
    "targetDedicatedNodes": 2,
    "targetLowPriorityNodes": 2,
    "taskSlotsPerNode": 1,
    "vmFillType": "Spread",
    "enableAutoScale": false,
    "enableInterNodeCommunication": false,
    "isAutoPool": false
}
```

The Batch Service emits the following log events:

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

- [Overview of Batch APIs and tools](batch-apis-tools.md)
- [Monitor Batch solutions](monitoring-overview.md)
