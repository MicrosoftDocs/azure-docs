---
title: Monitoring data reference for Azure Notification Hubs
description: This article contains important reference material you need when you monitor Azure Notification Hubs.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: reference
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
---

# Azure Notification Hubs monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Notification Hubs](monitor-notification-hubs.md) for details on the data you can collect for Azure Notification Hubs and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.NotificationHubs/namespaces/notificationHubs
The following table lists the metrics available for the Microsoft.NotificationHubs/namespaces/notificationHubs resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.NotificationHubs/namespaces/notificationHubs](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-notificationhubs-namespaces-notificationhubs-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-no-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-no-metrics-dimensions.md)]

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.NotificationHubs/namespaces
[!INCLUDE [Microsoft.NotificationHubs/namespaces](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-notificationhubs-namespaces-logs-include.md)]

### Supported resource logs for Microsoft.NotificationHubs/namespaces/notificationHubs
[!INCLUDE [Microsoft.NotificationHubs/namespaces/notificationHubs](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-notificationhubs-namespaces-notificationhubs-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]
<!-- No table(s) at https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype. -->

Azure Notification Hubs supports operational logs, which capture management operations that are performed on the Notification Hubs namespace. All logs are stored in JavaScript Object Notation (JSON) format in the following two locations:

- **AzureActivity**: Displays logs from operations and actions that are conducted against the namespace in the Azure portal or through Azure Resource Manager template deployments.
- **AzureDiagnostics**: Displays logs from operations and actions that are conducted against the namespace by using the API, or through management clients on the language SDK.

Diagnostic log JSON strings include the elements listed in the following table:

| Name | Description |
| ------- | ------- |
| time | UTC timestamp of the log |
| resourceId | Relative path to the Azure resource |
| operationName | Name of the management operation |
| category | Log category. Valid values: `OperationalLogs` |
| callerIdentity | Identity of the caller who initiated the management operation |
| resultType | Status of the management operation. Valid values: `Succeeded` or `Failed` |
| resultDescription | Description of the management operation |
| correlationId | Correlation ID of the management operation (if specified) |
| callerIpAddress | The caller IP address. Empty for calls that originated from the Azure portal |

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

Operational logs capture all management operations that are performed on the Azure Notification Hubs namespace. Data operations aren't captured, because of the high volume of data operations that are conducted on notification hubs.

[Microsoft.NotificationHubs resource provider operations](/azure/role-based-access-control/permissions/integration#microsoftnotificationhubs) lists all the management operations that are captured in operational logs.

## Related content

- See [Monitor Notification Hubs](monitor-notification-hubs.md) for a description of monitoring Notification Hubs.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.