---
title: 'Azure ExpressRoute: Monitoring, Metrics, and Alerts'
description: Learn about Azure ExpressRoute monitoring, metrics, and alerts using Azure Monitor, the one stop shop for all metrics, alerting, diagnostic logs across Azure.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 04/07/2021
ms.author: duau


---
# ExpressRoute monitoring, metrics, and alerts

This article helps you understand ExpressRoute monitoring, metrics, and alerts using Azure Monitor. Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure.
 
>[!NOTE]
>Using **Classic Metrics** is not recommended.
>

## ExpressRoute metrics

To view **Metrics**, navigate to the *Azure Monitor* page and select *Metrics*. To view **ExpressRoute** metrics, filter by Resource Type *ExpressRoute circuits*. To view **Global Reach** metrics, filter by Resource Type *ExpressRoute circuits* and select an ExpressRoute circuit resource that has Global Reach enabled. To view **ExpressRoute Direct** metrics, filter Resource Type by *ExpressRoute Ports*. 

Once a metric is selected, the default aggregation will be applied. Optionally, you can apply splitting, which will show the metric with different dimensions.

### Available Metrics

|**Metric**|**Category**|**Dimension(s)**|**Feature(s)**|
| --- | --- | --- | --- |
|ARP Availability|Availability|<ui><li>Peer (Primary/Secondary ExpressRoute router)</ui></li><ui><li> Peering Type (Private/Public/Microsoft)</ui></li>|ExpressRoute|
|Bgp Availability|Availability|<ui><li> Peer (Primary/Secondary ExpressRoute router)</ui></li><ui><li> Peering Type</ui></li>|ExpressRoute|
|BitsInPerSecond|Traffic|<ui><li> Peering Type (ExpressRoute)</ui></li><ui><li>Link (ExpressRoute Direct)</ui></li>|<li>ExpressRoute</li><li>ExpressRoute Direct</li><ui><li>ExpressRoute Gateway Connection</ui></li>|
|BitsOutPerSecond|Traffic| <ui><li>Peering Type (ExpressRoute)</ui></li><ui><li> Link (ExpressRoute Direct) |<ui><li>ExpressRoute<ui><li>ExpressRoute Direct</ui></li><ui><li>ExpressRoute Gateway Connection</ui></li>|
|CPU Utilization|Performance| <ui><li>Instance</ui></li>|ExpressRoute Virtual Network Gateway|
|Packets per Second|Performance| <ui><li>Instance</ui></li>|ExpressRoute Virtual Network Gateway|
|Count of Routes Advertised to Peer |Availability| <ui><li>Instance</ui></li>|ExpressRoute Virtual Network Gateway|
|Count of Routes Learned from Peer |Availability| <ui><li>Instance</ui></li>|ExpressRoute Virtual Network Gateway|
|Frequency of Routes change |Availability| <ui><li>Instance</ui></li>|ExpressRoute Virtual Network Gateway|
|Number of VMs in the Virtual Network |Availability| N/A |ExpressRoute Virtual Network Gateway|
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

You can view near to real-time availability of BGP (Layer-3 connectivity) across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Primary BGP session status is up for private peering and the Second BGP session status is down for private peering. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erBgpAvailabilityMetrics.jpg" alt-text="BGP availability per peer":::

### ARP Availability - Split by Peering  

You can view near to real-time availability of [ARP](./expressroute-troubleshooting-arp-resource-manager.md) (Layer-3 connectivity) across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Private Peering ARP session status is up across both peers, but down for Microsoft peering for both peers. The default aggregation (Average) was utilized across both peers.  

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erArpAvailabilityMetrics.jpg" alt-text="ARP availability per peer":::

## ExpressRoute Direct Metrics

### Admin State - Split by link

You can view the Admin state for each link of the ExpressRoute Direct port pair. The Admin state represents if the physical port is on or off. This state is required to be up to create a circuit and to pass traffic across the ExpressRoute Direct connection.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/adminstate-per-link.jpg" alt-text="ER Direct admin state":::

### Bits In Per Second - Split by link

You can view the bits in per second across both links of the ExpressRoute Direct port pair. Monitor this dashboard to compare inbound bandwidth for both links.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/bits-in-per-second-per-link.jpg" alt-text="ER Direct bits in per second":::

### Bits Out Per Second - Split by link

You can also view the bits out per second across both links of the ExpressRoute Direct port pair. Monitor this dashboard to compare outbound bandwidth for both links.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/bits-out-per-second-per-link.jpg" alt-text="ER Direct bits out per second":::

### Line Protocol - Split by link

You can view the line protocol across each link of the ExpressRoute Direct port pair. The Line Protocol indicates if the physical link is up and running over ExpressRoute Direct. Monitor this dashboard and set alerts to know when the physical connection has gone down.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/line-protocol-per-link.jpg" alt-text="ER Direct line protocol":::

### Rx Light Level - Split by link

You can view the Rx light level (the light level that the ExpressRoute Direct port is **receiving**) for each port. Healthy Rx light levels generally fall within a range of -10 dBm to 0 dBm. Set alerts to be notified if the Rx light level falls outside of the healthy range.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/rxlight-level-per-link.jpg" alt-text="ER Direct line Rx Light Level":::

### Tx Light Level - Split by link

You can view the Tx light level (the light level that the ExpressRoute Direct port is **transmitting**) for each port. Healthy Tx light levels generally fall within a range of -10 dBm to 0 dBm. Set alerts to be notified if the Tx light level falls outside of the healthy range.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/txlight-level-per-link.jpg" alt-text="ER Direct line Tx Light Level":::

## ExpressRoute Virtual Network Gateway Metrics

When you deploy an ExpressRoute gateway, Azure manages the compute and functions of your gateway. There are six gateway metrics available to you to better understand the performance of your gateway:

* CPU Utilization
* Packets per seconds
* Count of routes advertised to peers
* Count of routes learned from peers
* Frequency of routes changed
* Number of VMs in the virtual network  

It's highly recommended you set alerts for each of these metrics so that you could be aware of when your gateway is seeing performance issue.

### CPU Utilization - Split Instance

You can view the CPU utilization of each gateway instances. The CPU utilization may spike briefly during routine host maintenances but prolong high CPU utilization could indicate your gateway is reaching a performance bottleneck. Increasing the size of the ExpressRoute gateway could resolve this issue. Set an alert for 80% CPU usage that last longer than 30 minutes.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/cpu-split.jpg" alt-text="Screenshot of CPU utilization - split metrics.":::

### Packets Per Second - Split by Instance

This metric captures the number of inbound packets traversing the ExpressRoute gateway. You should expect to see data here if your gateway is receiving traffic from another peer (on-premises or another virtual network) connected to the ExpressRoute circuit. Set an alert for zero packets per second over a period of your choice to be notify when your gateway is no longer receiving traffic.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/pps-split.jpg" alt-text="Screenshot of packets per second - split metrics.":::

### Count of Routes Advertised to Peer - Split by Instance

This metric is the count for the number of routes (virtual network address spaces) the ExpressRoute gateway is advertising to the circuit. The address spaces include the virtual networks connected using virtual network peering that uses the ExpressRoute gateway. The number of routes should remain consistent unless changes are done to the virtual network address spaces. Set an alert for when the number of advertised routes drop below the number of virtual network address spaces you're aware of. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/count-of-routes-advertised-to-peer.png" alt-text="Screenshot of count of routes advertised to peer.":::

### Count of Routes Learned from Peer - Split by Instance

This metric shows the number of routes the ExpressRoute gateway is learning from peers connected to the ExpressRoute circuit. These routes can be either from another virtual network connected to the same circuit or learned from on-premises. The number of routes should remain consistent unless the number of routes advertised from on-premises or peered virtual network changes frequently. Set an alert for when the number of learned routes drop below a certain threshold. A common scenario is during gateway maintenance the number of routes learned can temporarily drop to zero.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/count-of-routes-learned-from-peer.png" alt-text="Screenshot of count of routes learned from peer.":::

### Frequency of Routes change - Split by Instance

This metric shows the frequency of routes being being learned from or advertised to remote peers. You should expect the frequency of routes change to be zero for the most part unless there are frequent changes to the routes in your network. Set an alert for frequency great than zero to be aware when there is a change in your network routes.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/frequency-of-routes-changed.png" alt-text="Screenshot of frequency of routes changed metric.":::

### Number of VMs in the Virtual Network

This metric shows the number of virtual machines that are using the ExpressRoute gateway. The number of virtual machines include VMs from remote virtual networks that uses the same ExpressRoute gateway through virtual network peering. Set an alert for this metric if the number of VMs is above a certain threshold that could affect the gateway performance. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/number-of-virtual-machines-virtual-network.png" alt-text="Screenshot of number of virtual machines in the virtual network metric.":::

## ExpressRoute gateway connections in bits/seconds

This metric shows the bandwidth usage for a specific connection to an ExpressRoute circuit.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erconnections.jpg" alt-text="Screenshot of gateway connection bandwidth usage metric.":::

## Alerts for ExpressRoute gateway connections

1. To configure alerts, navigate to **Azure Monitor**, then select **Alerts**.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/eralertshowto.jpg" alt-text="alerts":::
2. Select **+Select Target** and select the ExpressRoute gateway connection resource.

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

## More metrics in Log Analytics

You can also view ExpressRoute metrics by navigating to your ExpressRoute circuit resource and selecting the *Logs* tab. For any metrics you query, the output will contain the columns below.

|**Column**|**Type**|**Description**|
| --- | --- | --- |
|TimeGrain|string|PT1M (metric values are pushed every minute)|
|Count|real|Usually equal to 2 (each MSEE pushes a single metric value every minute)|
|Minimum|real|The minimum of the two metric values pushed by the two MSEEs|
|Maximum|real|The maximum of the two metric values pushed by the two MSEEs|
|Average|real|Equal to (Minimum + Maximum)/2|
|Total|real|Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried)|
  
## Next steps

Configure your ExpressRoute connection.
  
* [Create and modify a circuit](expressroute-howto-circuit-arm.md)
* [Create and modify peering configuration](expressroute-howto-routing-arm.md)
* [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
