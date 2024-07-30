---
title: Monitor Public IP addresses
description: Start here to learn how to monitor Azure Public IP addresses by using Azure Monitor.
ms.date: 07/21/2024
ms.custom: horz-monitor, devx-track-azurecli, devx-track-azurepowershell
ms.topic: conceptual
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
---

# Monitor Public IP addresses

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Public IP Address insights provide:

- Traffic data
- DDoS information

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Public IP addresses, see [Public IP addresses monitoring data reference](monitor-public-ip-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Public IP addresses, see [Public IP addresses monitoring data reference](monitor-public-ip-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Public IP addresses, see [Public IP addresses monitoring data reference](monitor-public-ip-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

The following image is an example of the built-in queries for Public IP addresses that are found within the Long Analytics queries interface in the Azure portal.

:::image type="content" source="./media/monitor-public-ip/public-ip-queries.png" alt-text="Screenshot of the built-in queries for Public IP addresses.":::

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Public IP addresses alert rules

The following table lists some suggested alert rules for Public IP addresses. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Public IP addresses monitoring data reference](monitor-public-ip-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| Under DDoS attack or not | **GreaterThan** 0.</br> **1** is currently under attack.</br> **0** indicates normal activity | As part of Azure's edge protection, public IP addresses are monitored for DDoS attacks. An alert allows you to be notified if your public IP address is affected. |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Public IP addresses monitoring data reference](monitor-public-ip-reference.md) for a reference of the metrics, logs, and other important values created for Public IP addresses.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
