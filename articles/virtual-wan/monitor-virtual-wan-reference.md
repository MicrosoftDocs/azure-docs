---
title: Monitoring data reference for Azure Virtual WAN
description: This article contains important reference material you need when you monitor Azure Virtual WAN by using Azure Monitor.
ms.date: 07/23/2024
ms.custom: horz-monitor
ms.topic: reference
author: cherylmc
ms.author: cherylmc
ms.service: virtual-wan
---
# Azure Virtual WAN monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Virtual WAN](monitor-virtual-wan.md) for details on the data you can collect for Virtual WAN and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/virtualhubs

The following table lists the metrics available for the Microsoft.Network/virtualhubs resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/virtualhubs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-virtualhubs-metrics-include.md)]

### Supported metrics for microsoft.network/vpngateways

The following table lists the metrics available for the microsoft.network/vpngateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [microsoft.network/vpngateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-vpngateways-metrics-include.md)]

### Supported metrics for microsoft.network/p2svpngateways

The following table lists the metrics available for the microsoft.network/p2svpngateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [microsoft.network/p2svpngateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-p2svpngateways-metrics-include.md)]

### Supported metrics for microsoft.network/expressroutegateways

The following table lists the metrics available for the microsoft.network/expressroutegateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [microsoft.network/expressroutegateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-expressroutegateways-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

Microsoft.Network/virtualhubs

- bgppeerip
- bgppeertype
- routeserviceinstance

microsoft.network/vpngateways

- BgpPeerAddress
- ConnectionName
- DropType
- FlowType
- Instance
- NatRule
- RemoteIP

microsoft.network/p2svpngateways

- Instance
- Protocol
- RouteType

microsoft.network/expressroutegateways

- BgpPeerAddress
- ConnectionName
- direction
- roleInstance

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

<!-- Repeat the following section for each resource type/namespace in your service. 
<!-- Find the table(s) for the resource type in the Log Categories column at https://review.learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/metrics-index?branch=main#supported-metrics-and-log-categories-by-resource-type.
-->

### Supported resource logs for microsoft.network/p2svpngateways

[!INCLUDE [microsoft.network/p2svpngateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-p2svpngateways-logs-include.md)]

### Supported resource logs for microsoft.network/vpngateways

[!INCLUDE [microsoft.network/vpngateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-vpngateways-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Virtual WAN Microsoft.Network/vpnGateways

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure Virtual WAN](monitor-virtual-wan.md) for a description of monitoring Virtual WAN.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
- To learn how to monitor Azure Firewall logs and metrics, see [Tutorial: Monitor Azure Firewall logs](../firewall/firewall-diagnostics.md).
