---
title: Monitoring ExpressRoute data reference 
description: Important reference material needed when you monitor ExpressRoute 
author: duongau
ms.topic: reference
ms.author: duau
ms.service: expressroute
ms.custom: subject-monitoring
ms.date: 06/22/2021
---

# Monitoring ExpressRoute data reference

This article provides a reference of log and metric data collected to analyze the performance and availability of ExpressRoute.
See [Monitoring ExpressRoute](monitor-expressroute.md) for details on collecting and analyzing monitoring data for ExpressRoute.

## Metrics

This section lists all the automatically collected platform metrics for ExpressRoute. For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

| Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| ExpressRoute circuit | [Microsoft.Network/expressRouteCircuits](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkexpressroutecircuits) |
| ExpressRoute circuit peering | [Microsoft.Network/expressRouteCircuits/peerings](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkexpressroutecircuitspeerings) |
| ExpressRoute Gateways | [Microsoft.Network/expressRouteGateways](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkexpressroutegateways) |
| ExpressRoute Direct | [Microsoft.Network/expressRoutePorts](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkexpressrouteports) |

>[!NOTE]
> Using *GlobalGlobalReachBitsInPerSecond* and *GlobalGlobalReachBitsOutPerSecond* will only be visible if at least one Global Reach connection is established.
>

## Metric dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

ExpressRoute has the following dimensions associated with its metrics.

### Dimension for ExpressRoute circuit

| Dimension Name | Description |
| ------------------- | ----------------- |
| **PeeringType** | The type of peering configured. The supported values are Microsoft and Private peering. |
| **Peering** | The supported values are Primary and Secondary. |
| **PeeredCircuitSkey** | The remote ExpressRoute circuit service key connected using Global Reach. |

### Dimension for ExpressRoute gateway

| Dimension Name | Description |
| ------------------- | ----------------- |
| **roleInstance** | The gateway instance. Each ExpressRoute gateway is comprised of multiple instances, and the supported values are GatewayTenantWork_IN_X (where X is a minimum of 0 and a maximum of the number of gateway instances -1). |

### Dimension for Express Direct

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Link** | The physical link. Each ExpressRoute Direct port pair is comprised of two physical links for redundancy, and the supported values are link1 and link2. |

## Resource logs

This section lists the types of resource logs you can collect for ExpressRoute. 

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| ExpressRoute Circuit | [Microsoft.Network/expressRouteCircuits](../azure-monitor/essentials/resource-logs-categories.md#microsoftnetworkexpressroutecircuits) |

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md).

## Azure Monitor Logs tables

Azure ExpressRoute uses Kusto tables from Azure Monitor Logs. You can query these tables with Log analytics. For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

## Activity log

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

|**Column**|**Type**|**Description**|
| --- | --- | --- |
|TimeGrain|string|PT1M (metric values are pushed every minute)|
|Count|real|Usually equal to 2 (each MSEE pushes a single metric value every minute)|
|Minimum|real|The minimum of the two metric values pushed by the two MSEEs|
|Maximum|real|The maximum of the two metric values pushed by the two MSEEs|
|Average|real|Equal to (Minimum + Maximum)/2|
|Total|real|Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried)|

## See also

- See [Monitoring Azure ExpressRoute](monitor-expressroute.md) for a description of monitoring Azure ExpressRoute.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.