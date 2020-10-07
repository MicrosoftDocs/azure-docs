---
title: 'Azure ExpressRoute: Monitoring, Metrics, and Alerts'
description: Learn about Azure ExpressRoute monitoring, metrics, and alerts using Azure Monitor, the one stop shop for all metrics, alerting, diagnostic logs across Azure.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: how-to
ms.date: 08/25/2020
ms.author: duau


---
# ExpressRoute monitoring, metrics, and alerts

This article helps you understand ExpressRoute monitoring, metrics, and alerts using Azure Monitor. Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure.
 
>[!NOTE]
>Using **Classic Metrics** is not recommended.
>

## ExpressRoute metrics

To view **Metrics**, navigate to the *Azure Monitor* page and click *Metrics*. To view **ExpressRoute** metrics, filter by Resource Type *ExpressRoute circuits*. To view **Global Reach** metrics, filter by Resource Type *ExpressRoute circuits* and select an ExpressRoute circuit resource that has Global Reach enabled. To view **ExpressRoute Direct** metrics, filter Resource Type by *ExpressRoute Ports*. 

Once a metric is selected, the default aggregation will be applied. Optionally, you can apply splitting, which will show the metric with different dimensions.

### Available Metrics

|**Metric**|**Category**|**Dimension(s)**|**Feature(s)**|
| --- | --- | --- | --- |
|ARP Availability|Availability|<ui><li>Peer (Primary/Secondary ExpressRoute router)</ui></li><ui><li> Peering Type (Private/Public/Microsoft)</ui></li>|ExpressRoute|
|Bgp Availability|Availability|<ui><li> Peer (Primary/Secondary ExpressRoute router)</ui></li><ui><li> Peering Type</ui></li>|ExpressRoute|
|BitsInPerSecond|Traffic|<ui><li> Peering Type (ExpressRoute)</ui></li><ui><li>Link (ExpressRoute Direct)</ui></li>|<li>ExpressRoute</li><li>ExpressRoute Direct|
|BitsOutPerSecond|Traffic| <ui><li>Peering Type (ExpressRoute)</ui></li><ui><li> Link (ExpressRoute Direct) |<ui><li>ExpressRoute<ui><li>ExpressRoute Direct</ui></li> |
|CPU Utilization|Performance| <ui><li>Instance</ui></li>|ExpressRoute Virtual Network Gateway|
|Packets per Second|Performance| <ui><li>Instance</ui></li>|ExpressRoute Virtual Network Gateway|
|GlobalReachBitsInPerSecond|Traffic|<ui><li>Peered Circuit Skey (Service Key)</ui></li>|Global Reach|
|GlobalReachBitsOutPerSecond|Traffic|<ui><li>Peered Circuit Skey (Service Key)</ui></li>|Global Reach|
|AdminState|Physical Connectivity|Link|ExpressRoute Direct|
|LineProtocol|Physical Connectivity|Link|ExpressRoute Direct|
|RxLightLevel|Physical Connectivity|<ui><li>Link</ui></li><ui><li>Lane</ui></li>|ExpressRoute Direct|
|TxLightLevel|Physical Connectivity|<ui><li>Link</ui></li><ui><li>Lane</ui></li>|ExpressRoute Direct|
>[!NOTE]
>Using *GlobalGlobalReachBitsInPerSecond* and *GlobalGlobalReachBitsOutPerSecond* will only be visible if at least one Global Reach connection is established.
>

## Circuits metrics

### Bits In and Out - Metrics across all peerings

You can view metrics across all peerings on a given ExpressRoute circuit.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/ermetricspeering.jpg" alt-text="circuit metrics":::

### Bits In and Out - Metrics per peering

You can view metrics for private, public, and Microsoft peering in bits/second.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erpeeringmetrics.jpg" alt-text="metrics per peering":::

### BGP Availability - Split by Peer  

You can view near to real-time availability of BGP across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Primary BGP session up for private peering and the Second BGP session down for private peering. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erBgpAvailabilityMetrics.jpg" alt-text="BGP availability per peer":::

### ARP Availability - Split by Peering  

You can view near to real-time availability of [ARP](https://docs.microsoft.com/azure/expressroute/expressroute-troubleshooting-arp-resource-manager) across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Private Peering ARP session up across both peers, but complete down for Microsoft peering across peerings. The default aggregation (Average) was utilized across both peers.  

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erArpAvailabilityMetrics.jpg" alt-text="ARP availability per peer":::

## ExpressRoute Direct Metrics

### Admin State - Split by link

You can view the admin state for each link of the ExpressRoute Direct port pair.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/adminstate-per-link.jpg" alt-text="ER Direct admin state":::

### Bits In Per Second - Split by link

You can view the bits in per second across both links of the ExpressRoute Direct port pair.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/bits-in-per-second-per-link.jpg" alt-text="ER Direct bits in per second":::

### Bits Out Per Second - Split by link

You can also view the bits out per second across both links of the ExpressRoute Direct port pair.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/bits-out-per-second-per-link.jpg" alt-text="ER Direct bits out per second":::

### Line Protocol - Split by link

You can view the line protocol across each link of the ExpressRoute Direct port pair.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/line-protocol-per-link.jpg" alt-text="ER Direct line protocol":::

### Rx Light Level - Split by link

You can view the Rx light level (the light level that the ExpressRoute Direct port is **receiving**) for each port. Healthy Rx light levels generally fall within a range of -10 to 0 dBm

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/rxlight-level-per-link.jpg" alt-text="ER Direct line Rx Light Level":::

### Tx Light Level - Split by link

You can view the Tx light level (the light level that the ExpressRoute Direct port is **transmitting**) for each port. Healthy Tx light levels generally fall within a range of -10 to 0 dBm

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/txlight-level-per-link.jpg" alt-text="ER Direct line Tx Light Level":::

## ExpressRoute Virtual Network Gateway Metrics

### CPU Utilization - Split Instance

You can view CPU utilization of the gateway instances.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/cpu-split.jpg" alt-text="CPU split":::

### Packets Per Second - Split by Instance

You can view packets per second traversing the gateway.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/pps-split.jpg" alt-text="Packets per second - split":::

## ExpressRoute gateway connections in bits/seconds

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erconnections.jpg" alt-text="gateway connections":::

## Alerts for ExpressRoute gateway connections

1. In order to configure alerts, navigate to **Azure Monitor**, then select **Alerts**.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/eralertshowto.jpg" alt-text="alerts":::
2. Click **+Select Target** and select the ExpressRoute gateway connection resource.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/alerthowto2.jpg" alt-text="target":::
3. Define the alert details.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/alerthowto3.jpg" alt-text="action group":::
4. Define and add the action group.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/actiongroup.png" alt-text="add action group":::

## Alerts based on each peering

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/basedpeering.jpg" alt-text="each peering":::

## Configure alerts for activity logs on circuits

In the **Alert Criteria**, you can select **Activity Log** for the Signal Type and select the Signal.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/alertshowto6activitylog.jpg" alt-text="activity logs":::

## Additional metrics in Log Analytics

You can also view ExpressRoute metrics by navigating to your ExpressRoute circuit resource and selecting the *Logs* tab. For any metrics you query, the output will contain the columns below.

|**Column**|**Type**|**Description**|
| --- | --- | --- |
|TimeGrain|string|PT1M (metric values are pushed every minute)|
|Count|real|Usually equal to 2 (each MSEE pushes a single metric value every minute)|
|Minimum|real|The minimum of the two metric values pushed by the two MSEEs|
|Maximum|real|The maxiumum of the two metric values pushed by the two MSEEs|
|Average|real|Equal to (Minimum + Maximum)/2|
|Total|real|Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried)|
  
## Next steps

Configure your ExpressRoute connection.
  
* [Create and modify a circuit](expressroute-howto-circuit-arm.md)
* [Create and modify peering configuration](expressroute-howto-routing-arm.md)
* [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
