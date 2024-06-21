---
title: Monitoring data reference for Azure ExpressRoute
description: This article contains important reference material you need when you monitor Azure ExpressRoute by using Azure Monitor.
ms.date: 06/24/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: duongau
ms.author: duau
ms.service: expressroute
---
# Azure ExpressRoute monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure ExpressRoute](monitor-expressroute.md) for details on the data you can collect for ExpressRoute and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

>[!NOTE]
> Using *GlobalGlobalReachBitsInPerSecond* and *GlobalGlobalReachBitsOutPerSecond* are only visible if at least one Global Reach connection is established.
>

### Supported metrics for Microsoft.Network/expressRouteCircuits

The following table lists the metrics available for the Microsoft.Network/expressRouteCircuits resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Network/expressRouteCircuits](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-expressroutecircuits-metrics-include.md)]

### Supported metrics for Microsoft.Network/expressRouteCircuits/peerings

The following table lists the metrics available for the Microsoft.Network/expressRouteCircuits/peerings resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [<ResourceType/namespace>](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-expressroutecircuits-peerings-metrics-include.md)]

### Supported metrics for microsoft.network/expressroutegateways

The following table lists the metrics available for the microsoft.network/expressroutegateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [<ResourceType/namespace>](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-expressroutegateways-metrics-include.md)]

### Supported metrics for Microsoft.Network/expressRoutePorts

The following table lists the metrics available for the Microsoft.Network/expressRoutePorts resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [<ResourceType/namespace>](~/reusuable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-expressrouteports-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

Dimension for ExpressRoute circuit:

| Dimension Name | Description |
|:---------------|:------------|
| PeeringType | The type of peering configured. The supported values are Microsoft and Private peering. |
| Peering | The supported values are Primary and Secondary. |
| DeviceRole | |
| PeeredCircuitSkey | The remote ExpressRoute circuit service key connected using Global Reach. |

Dimension for ExpressRoute gateway:

| Dimension Name | Description |
|:-------------- |:----------- |
| BgpPeerAddress | |
| ConnectionName | |
| direction | |
| roleInstance | The gateway instance. Each ExpressRoute gateway is comprised of multiple instances, and the supported values are GatewayTenantWork_IN_X (where X is a minimum of 0 and a maximum of the number of gateway instances -1). |

Dimension for Express Direct:

| Dimension Name | Description |
|:---------------|:------------|
| Lane | |
| Link | The physical link. Each ExpressRoute Direct port pair is comprised of two physical links for redundancy, and the supported values are link1 and link2. |

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/expressRouteCircuits

[!INCLUDE [<ResourceType/namespace>](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-expressroutecircuits-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### ExpressRoute Microsoft.Network/expressRouteCircuits

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

The following table lists the operations related to ExpressRoute that may be created in the Activity log.

| Operation | Description |
|:---|:---|
| All Administrative operations | All administrative operations including create, update and delete of an ExpressRoute circuit. |
| Create or update ExpressRoute circuit | An ExpressRoute circuit was created or updated. |
| Deletes ExpressRoute circuit | An ExpressRoute circuit was deleted.|

For more information on the schema of Activity Log entries, see [Activity  Log schema](../azure-monitor/essentials/activity-log-schema.md).

## Schemas

For detailed description of the top-level diagnostic logs schema, see [Supported services, schemas, and categories for Azure Diagnostic Logs](../azure-monitor/essentials/resource-logs-schema.md).

When reviewing any metrics through Log Analytics, the output will contain the following columns:

| Column | Type | Description |
|:-------|:-----|:------------|
| TimeGrain | string | PT1M (metric values are pushed every minute) |
| Count     | real   | Usually equal to 2 (each MSEE pushes a single metric value every minute) |
| Minimum   | real   | The minimum of the two metric values pushed by the two MSEEs |
| Maximum   | real   | The maximum of the two metric values pushed by the two MSEEs |
| Average   | real   | Equal to (Minimum + Maximum)/2 |
| Total     | real   | Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried) |

## Related content

- See [Monitor Azure ExpressRoute](monitor-expressroute.md) for a description of monitoring ExpressRoute.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
