---
title: Monitoring data reference for Azure NAT Gateway
description: This article contains important reference material you need when you monitor Azure NAT Gateway by using Azure Monitor.
ms.date: 09/16/2024
ms.custom: horz-monitor
ms.topic: reference
author: asudbring
ms.author: allensu
ms.service: nat-gateway
---
# Azure NAT Gateway monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure NAT Gateway](monitor-nat-gateway.md) for details on the data you can collect for Azure NAT Gateway and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/natgateways

The following table lists the metrics available for the Microsoft.Network/natgateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/natgateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-natgateways-metrics-include.md)]

> [!NOTE]
> Count aggregation is not recommended for any of the NAT gateway metrics. Count aggregation adds up the number of metric values and not the metric values themselves. Use Total aggregation instead to get the best representation of data values for connection count, bytes, and packets metrics.
>
> Use Average for best represented health data for the datapath availability metric.
>
> For information about aggregation types, see [aggregation types](/azure/azure-monitor/essentials/metrics-aggregation-explained#aggregation-types).

For more information, see [How to use NAT gateway metrics](nat-metrics.md#how-to-use-nat-gateway-metrics).

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- ConnectionState: Attempted, Failed
- Direction: In, Out
- Protocol: 6 TCP, 17 UDP

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure NAT Gateway](monitor-nat-gateway.md) for a description of monitoring Azure NAT Gateway.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
