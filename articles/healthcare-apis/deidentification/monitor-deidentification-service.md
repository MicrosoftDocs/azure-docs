---
title: Monitor the De-identification service in Azure Health Data Services
description: Start here to learn how to monitor De-identification service in Azure Health Data Services.
ms.date: 09/05/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
---

# Monitor the Azure Health Data Services de-identification service
[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for the de-identification service, see [the de-identification service monitoring data reference](monitor-deidentification-service-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-no-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for the de-identification service, see [the de-identification service monitoring data reference](monitor-deidentification-service-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

- To list the 10 most common operations performed on your resource over the last three days:

    ```kusto
    AHDSDeidAuditLogs
    | where TimeGenerated > ago(3d)
    | summarize count() by OperationName
    | top 10 by count_ desc
    ```

- To list recent unauthenticated requests:

    ```kusto
    AHDSDeidAuditLogs
    | where TimeGenerated > ago(3d) and StatusCode == 401
    | top 10 by count_ desc
    ```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### De-identification service alert rules

The following table lists some suggested alert rules for the de-identification service. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [de-identification service monitoring data reference](monitor-deidentification-service-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| Log | AHDSDeidAuditLogs<br>\| where StatusCode == 429 | De-identification service is throttled. |
| Log | AHDSDeidAuditLogs<br>\| where StatusCode >= 500 | De-identification service is failing. |

<!-- ### Advisor recommendations -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [the de-identification service monitoring data reference](monitor-deidentification-service-reference.md) for a reference of the metrics, logs, and other important values created for the de-identification service.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.