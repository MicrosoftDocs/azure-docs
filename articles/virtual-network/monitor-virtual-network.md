---
title: Monitor Azure Virtual Network
description: Start here to learn how to monitor Azure virtual networks by using Azure Monitor.
ms.date: 07/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: asudbring
ms.author: allensu
ms.service: virtual-network
---

# Monitor Azure Virtual Network

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Virtual Network, see [Azure Virtual Network monitoring data reference](monitor-virtual-network-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Virtual Network, see [Azure Virtual Network monitoring data reference](monitor-virtual-network-reference.md#metrics).

> [!IMPORTANT]
> Enabling these settings requires additional Azure services (storage account, event hub, or Log Analytics), which might increase your cost. To calculate an estimated cost, visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

### Analyzing metrics

Azure Monitor currently doesn't support analyzing *Azure virtual network* metrics from the metrics explorer. To view *Azure virtual network* metrics, select **Metrics** under **Monitoring** from the virtual network you want to analyze.

:::image type="content" source="./media/monitor-virtual-network/metrics.png" alt-text="Screenshot of the metrics dashboard for Virtual Network." lightbox="./media/monitor-virtual-network/metrics-expanded.png":::

[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]

For more information, see [Monitor and visualize network configurations with Azure Network Policy Manager](kubernetes-network-policies.md#monitor-and-visualize-network-configurations-with-azure-npm).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Virtual Network, see [Azure Virtual Network monitoring data reference](monitor-virtual-network-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Virtual Network alert rules

The following table lists some suggested alert rules for Virtual Network. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Virtual Network monitoring data reference](monitor-virtual-network-reference.md).

The following table lists common and recommended activity alert rules for Azure virtual network.

| Alert type | Condition | Description  |
|:---|:---|:---|
| Create or Update Virtual Network | Event Level: All selected, Status: All selected, Event initiated by: All services and users | When a user creates or makes configuration changes to the virtual network |
| Delete Virtual Network | Event Level: All selected, Status: Started | When a user deletes a virtual network |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Virtual Network monitoring data reference](monitor-virtual-network-reference.md) for a reference of the metrics, logs, and other important values created for Virtual Network.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
