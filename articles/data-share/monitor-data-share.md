---
title: Monitor Azure Data Share
description: Start here to learn how to monitor Azure Data Share.
ms.date: 02/28/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: sidontha
ms.author: sidontha
ms.service: data-share
---

# Monitor Azure Data Share

[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Data Share, see [Data Share monitoring data reference](monitor-data-share-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

Select **Metrics** under **Monitoring** in the left navigation of your Data Share page in the Azure portal to access charts for the following Data Share metrics:

- Received Shares
- Received Share Failed Snapshots
- Received Share Succeeded Snapshots
- Sent Shares
- Sent Share Failed Snapshots
- Sent Share Succeeded Snapshots 

For a list of available metrics for Data Share, see [Data Share monitoring data reference](monitor-data-share-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

Select **Diagnostic settings** under **Monitoring** in the left navigation of your Data Share page in the Azure portal to configure collection of the following Data Share log data:

- Shares
- Share Subscriptions
- Sent Share Snapshots
- Received Share Snapshots

For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Data Share, see [Data Share monitoring data reference](monitor-data-share-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

## Share status and history

To track Data Share invitation status, share subscription status, and snapshot history, select **Sent Shares** under **Data Share** in the left navigation of your Data Share page in the Azure portal. For more information and instructions, see [Monitor Data Share status and history](how-to-monitor.md).

[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]
[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

For example queries, select **Logs** under **Monitoring** in the left navigation of your Data Share page in the Azure portal, and then select the **Queries** tab. Here are a few example queries.

A list of the snapshots sorted by duration time over the last seven days:

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

Total count of failed snapshots over the last seven days:

```kusto
// Count failed sent snapshots 
MicrosoftDataShareSentSnapshotLog
| where TimeGenerated > ago(7d)  
| where Status == "Failed" 
| summarize count() by _ResourceId
```

[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Data Share alert rules

The following table lists common and recommended alert rules for Data Share. This is just a recommended list. You can set alerts for any metric, log entry, or activity log entry that's listed in the [Data Share monitoring data reference](monitor-data-share-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metrics |Received Share Failed Snapshots |Whenever the count Received Share Failed Snapshots is greater than 0|
|Activity log |Delete Data Share Account (Data Share Account) |Whenever the Activity Log has an event with Category='Administrative', Signal name='Delete Data Share Account (Data Share Account)'

[!INCLUDE [horz-monitor-advisor-recommendations](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Data Share monitoring data reference](monitor-data-share-reference.md) for a reference of the metrics, logs, and other important values created for Data Share.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
