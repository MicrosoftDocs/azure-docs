---
title: Monitor Azure Data Share
description: Start here to learn how to monitor Azure Data Share.
ms.date: 03/05/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: sidontha
ms.author: sidontha
ms.service: data-share
---

# Monitor Azure Data Share

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Data Share, see [Data Share monitoring data reference](monitor-data-share-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

To view charts for Data Share metrics, select **Metrics** under **Monitoring** in the left navigation of your Data Share page in the Azure portal.

For a full listing and descriptions of the available metrics for Data Share, see [Data Share monitoring data reference](monitor-data-share-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

You can configure diagnostic settings to save log data or events. Select **Diagnostic settings** under **Monitoring** in the left navigation of your Azure portal Data Share page, and then select the appropriate resource log categories to collect.

:::image type="content" source="./media/diagnostic-settings.png" alt-text="Screenshot that shows the Diagnostic settings page in the Azure portal.":::

For more information about the available resource log categories, their associated Log Analytics tables, and the logs schemas for Data Share, see [Data Share monitoring data reference](monitor-data-share-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

## Data Share status and history

To track Data Share invitation status, share subscription status, and snapshot history, select **Sent Shares** under **Data Share** in the left navigation of your Data Share page in the Azure portal. For more information and instructions, see [Monitor Data Share status and history](how-to-monitor.md).

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]
[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

To write queries and access example queries, select **Logs** under **Monitoring** in the left navigation of your Data Share page in the Azure portal, and then select the **Queries** tab. Here are a couple of example queries.

List of sent snapshots sorted by duration over the last seven days:

```kusto
// List sent snapshots by duration 
MicrosoftDataShareSentSnapshotLog
| where TimeGenerated > ago(7d) 
| where StartTime != "" and EndTime  != "" 
| project StartTime , EndTime , DurationSeconds =(todatetime(EndTime)-todatetime(StartTime))/1s , ResourceName = split(_ResourceId,"/accounts/",1) 
| sort by DurationSeconds desc nulls last
```

Top 10 most frequent errors over the last seven days:

```kusto
// Frequent errors in received snapshots 
MicrosoftDataShareReceivedSnapshotLog 
| where TimeGenerated > ago(7d)  
| where Status == "Failed" 
| summarize count() by _ResourceId, DataSetType // Counting failed logs per datasettype
| top 10 by count_ desc nulls last
```

For more example queries, see:

- [Queries for the MicrosoftDataShareReceivedSnapshotLog table](/azure/azure-monitor/reference/queries/microsoftdatasharereceivedsnapshotlog)
- [Queries for the MicrosoftDataShareSentSnapshotLog table](/azure/azure-monitor/reference/queries/microsoftdatasharesentsnapshotlog)

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Data Share alert rules

To create alerts for your Data Share monitoring data, select **Alerts** under **Monitoring** in the left navigation of your Data Share page in the Azure portal, and then select **Create alert rule**. You can select a signal and configure all the details to trigger and route the alert.

The following table lists some alert rules for Data Share. This is just a suggested list. You can set alerts for any metric, log entry, or activity log entry that's listed in the [Data Share monitoring data reference](monitor-data-share-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metrics |Received Share Failed Snapshots |Whenever the count Received Share Failed Snapshots is greater than 0|
|Activity log |Delete Data Share Account (Data Share Account) |Whenever the Activity Log has an event with Category='Administrative', Signal name='Delete Data Share Account (Data Share Account)'

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Data Share monitoring data reference](monitor-data-share-reference.md) for a reference of the metrics, logs, and other important values created for Data Share.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
