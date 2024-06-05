---
title: Monitor Azure Notification Hubs
description: Start here to learn how to monitor Azure Notification Hubs.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
---

# Monitor Azure Notification Hubs

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Notification Hubs, see [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Notification Hubs, see [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

### Notification Hubs logs

Notification Hubs supports activity and operational logs, which capture management operations that are performed on the Notification Hubs namespace. Data operations aren't captured, because of the high volume of data operations that are conducted on notification hubs.

You can archive the diagnostic logs to a storage account or stream them to an event hub. Sending the logs to a Log Analytics workspace isn't currently supported.

- For more information about the logs and instructions for enabling log collection, see [Enable diagnostics logs for Notification Hubs](notification-hubs-diagnostic-logs.md).

- For the available resource log categories, associated Log Analytics tables, and the management operations captured in operational logs, see [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

## Azure Notification Hubs REST APIs

The [Notification Hubs REST APIs](/rest/api/notificationhubs) fall into the following categories:

- **Azure Resource Manager:** APIs that perform Resource Manager operations, and have `/providers/Microsoft.NotificationHubs/` as part of the request URI.
- **Notification Hubs service:** APIs that enable operations directly on the Notification Hubs service, and have `<namespaceName>.servicebus.windows.net/` in the request URI.

The [Get notification message telemetry](/rest/api/notificationhubs/get-notification-message-telemetry) API helps monitor push notifications sent from a hub by providing telemetry on the finished states of outgoing push notifications. The Notification ID that this API uses can be retrieved from the HTTP Location header included in the response of the REST API used to send the notification.

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

### Sample Kusto queries

Failed operations:

```kusto
// List all reports of failed operations over the past hour. 
AzureActivity 
| where TimeGenerated > ago(1h)  
| where ActivityStatus == "Failed"
```

Errors:

```kusto
// List all the errors for the past 7 days. 
AzureDiagnostics
| where TimeGenerated > ago(7d)
| where ResourceProvider =="MICROSOFT.NOTIFICATIONHUBS"
| where Category == "OperationalLogs"
| summarize count() by "EventName", _ResourceId
```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Notification Hubs alert rules

The following table lists some suggested alert rules for Notification Hubs. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry that's listed in the [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md).

| Alert type | Condition | Description |
|:---|:---|:---|
| Platform metric | Payload Errors | Whenever the count of pushes that failed because the push notification service (PNS) returned a bad payload error is greater than a dynamic threshold |
| Activity log | Delete Namespace (Namespace) | Whenever the Activity Log has an event with Category='Administrative', Signal name='Delete Namespace (Namespace)' |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Notification Hubs monitoring data reference](monitor-notification-hubs-reference.md) for a reference of the metrics, logs, and other important values created for Notification Hubs.
- See [Enable diagnostics logs for Notification Hubs](notification-hubs-diagnostic-logs.md) for information about diagnostic logs for Notification Hubs and how to enable them.
- See [Get notification message telemetry](/rest/api/notificationhubs/get-notification-message-telemetry) for information about using the API to monitor push notification success.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.