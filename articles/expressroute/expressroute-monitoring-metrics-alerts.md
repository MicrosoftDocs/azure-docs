---
title: 'Azure ExpressRoute: Monitoring, Metrics, and Alerts'
description: Learn about Azure ExpressRoute monitoring, metrics, and alerts using Azure Monitor, the one stop shop for all metrics, alerting, diagnostic logs across Azure.
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 02/08/2023
ms.author: duau
---

# ExpressRoute monitoring, metrics, and alerts

This article helps you understand ExpressRoute monitoring, metrics, and alerts using Azure Monitor. Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure.
 
>[!NOTE]
>Using **Classic Metrics** is not recommended.
>

## ExpressRoute metrics

To view **Metrics**, go to the *Azure Monitor* page and select *Metrics*. To view **ExpressRoute** metrics, filter by Resource Type *ExpressRoute circuits*. To view **Global Reach** metrics, filter by Resource Type *ExpressRoute circuits* and select an ExpressRoute circuit resource that has Global Reach enabled. To view **ExpressRoute Direct** metrics, filter Resource Type by *ExpressRoute Ports*. 

Once a metric is selected, the default aggregation will be applied. Optionally, you can apply splitting, which will show the metric with different dimensions.

> [!IMPORTANT]
> When viewing ExpressRoute metrics in the Azure portal, select a time granularity of **5 minutes or greater** for best possible results.
> 
> :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/metric-granularity.png" alt-text="Screenshot of time granularity options.":::

### Aggregation Types:

Metrics explorer supports SUM, MAX, MIN, AVG and COUNT as [aggregation types](../azure-monitor/essentials/metrics-charts.md#aggregation). You should use the recommended Aggregation type when reviewing the insights for each ExpressRoute metric.

* Sum: The sum of all values captured during the aggregation interval. 
* Count: The number of measurements captured during the aggregation interval. 
* Average: The average of the metric values captured during the aggregation interval. 
* Min: The smallest value captured during the aggregation interval. 
* Max: The largest value captured during the aggregation interval. 

### ExpressRoute circuit

| Metric | Category | Unit | Aggregation Type | Description | Dimensions |  Exportable via Diagnostic Settings? | 
| --- | --- | --- | --- | --- | --- | --- | 
| [Arp Availability](#arp) | Availability | Percent | Average | ARP Availability from MSEE towards all peers. | Peering Type, Peer |  Yes | 
| [Bgp Availability](#bgp) | Availability | Percent | Average | BGP Availability from MSEE towards all peers. | Peering Type, Peer |  Yes | 
| [BitsInPerSecond](#circuitbandwidth) | Traffic | BitsPerSecond | Average | Bits ingressing Azure per second | Peering Type | Yes | 
| [BitsOutPerSecond](#circuitbandwidth) | Traffic | BitsPerSecond | Average | Bits egressing Azure per second | Peering Type | Yes | 
| DroppedInBitsPerSecond | Traffic | BitsPerSecond | Average | Ingress bits of data dropped per second | Peering Type | Yes | 
| DroppedOutBitsPerSecond | Traffic | BitPerSecond | Average | Egress bits of data dropped per second | Peering Type | Yes | 
| GlobalReachBitsInPerSecond | Traffic | BitsPerSecond | Average | Bits ingressing Azure per second | PeeredCircuitSKey | Yes | 
| GlobalReachBitsOutPerSecond | Traffic | BitsPerSecond | Average | Bits egressing Azure per second | PeeredCircuitSKey | Yes |
| [FastPathRoutesCount](#fastpath-routes-count-at-circuit-level) | Fastpath | Count | Maximum | Count of FastPath routes configured on the circuit | None | Yes |

>[!NOTE]
>Using *GlobalGlobalReachBitsInPerSecond* and *GlobalGlobalReachBitsOutPerSecond* will only be visible if at least one Global Reach connection is established.
>

### ExpressRoute gateways

| Metric | Category | Unit | Aggregation Type | Description | Dimensions | Exportable via Diagnostic Settings? | 
| --- | --- | --- | --- | --- | --- | --- | 
| [Bits received per second](#gwbits) | Performance | BitsPerSecond | Average | Total bits received on ExpressRoute gateway per second | roleInstance | Yes |
| [CPU utilization](#cpu) | Performance | Count | Average | CPU Utilization of the ExpressRoute Gateway | roleInstance | Yes | 
| [Packets per second](#packets) | Performance | CountPerSecond | Average | Total Packets received on ExpressRoute Gateway per second | roleInstance | Yes | 
| [Count of routes advertised to peer](#advertisedroutes) | Availability | Count | Maximum | Count Of Routes Advertised To Peer by ExpressRouteGateway | roleInstance | Yes | 
| [Count of routes learned from peer](#learnedroutes)| Availability | Count | Maximum | Count Of Routes Learned From Peer by ExpressRouteGateway | roleInstance | Yes | 
| [Frequency of routes changed](#frequency) | Availability | Count | Total | Frequency of Routes change in ExpressRoute Gateway | roleInstance | Yes | 
| [Number of VMs in virtual network](#vm) | Availability | Count | Maximum | Number of VMs in the Virtual Network | No Dimensions | Yes |
| [Active flows](#activeflows) | Scalability | Count | Average | Number of active flows on ExpressRoute Gateway | roleInstance | Yes |
| [Max flows created per second](#maxflows) | Scalability | FlowsPerSecond | Maximum | Maximum number of flows created per second on ExpressRoute Gateway | roleInstance, direction | Yes |

### ExpressRoute Gateway connections

| Metric | Category | Unit | Aggregation Type | Description | Dimensions | Exportable via Diagnostic Settings? | 
| --- | --- | --- | --- | --- | --- | --- | 
| [BitsInPerSecond](#connectionbandwidth) | Traffic | BitsPerSecond | Average | Bits ingressing Azure per second through ExpressRoute gateway | ConnectionName | Yes | 
| [BitsOutPerSecond](#connectionbandwidth) | Traffic | BitsPerSecond | Average | Bits egressing Azure per second through ExpressRoute gateway | ConnectionName | Yes |

### ExpressRoute Direct

| Metric | Category | Unit | Aggregation Type | Description | Dimensions | Exportable via Diagnostic Settings? | 
| --- | --- | --- | --- | --- | --- | --- | 
| [BitsInPerSecond](#directin) | Traffic | BitsPerSecond | Average | Bits ingressing Azure per second | Link | Yes | 
| [BitsOutPerSecond](#directout) | Traffic | BitsPerSecond | Average | Bits egressing Azure per second | Link | Yes | 
| DroppedInBitsPerSecond | Traffic | BitsPerSecond | Average | Ingress bits of data dropped per second | Link | Yes | 
| DroppedOutBitsPerSecond | Traffic | BitPerSecond | Average | Egress bits of data dropped per second | Link  | Yes | 
| [AdminState](#admin) | Physical Connectivity | Count | Average | Admin state of the port | Link | Yes | 
| [LineProtocol](#line) | Physical Connectivity | Count | Average | Line protocol status of the port | Link | Yes | 
| [RxLightLevel](#rxlight) | Physical Connectivity | Count | Average | Rx Light level in dBm | Link, Lane | Yes | 
| [TxLightLevel](#txlight) | Physical Connectivity | Count | Average | Tx light level in dBm | Link, Lane | Yes |
| [FastPathRoutesCount](#fastpath-routes-count-at-port-level) | FastPath | Count | Maximum | Count of FastPath routes configured on the port | None | Yes |

### ExpressRoute Traffic Collector

| Metric | Category | Unit | Aggregation Type | Description | Dimensions | Exportable via Diagnostic Settings? |
| --- | --- | --- | --- | --- | --- | --- |
| CPU utilization | Performance | Count | Average | CPU Utilization of the ExpressRoute Traffic Collector | roleInstance | Yes |
| Memory Utilization | Performance | CountPerSecond | Average | Memory Utilization of the ExpressRoute Traffic Collector | roleInstance | Yes |
| Count of flow records processed | Availability | Count | Maximum | Count of number of flow records processed or ingested | roleInstance, ExpressRoute Circuit | Yes |

## Circuits metrics

### <a name = "circuitbandwidth"></a>Bits In and Out - Metrics across all peerings

Aggregation type: *Avg*

You can view metrics across all peerings on a given ExpressRoute circuit.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/ermetricspeering.jpg" alt-text="circuit metrics":::

### Bits In and Out - Metrics per peering

Aggregation type: *Avg*

You can view metrics for private, public, and Microsoft peering in bits/second.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erpeeringmetrics.jpg" alt-text="metrics per peering":::

### <a name = "bgp"></a>BGP Availability - Split by Peer  

Aggregation type: *Avg*

You can view near to real-time availability of BGP (Layer-3 connectivity) across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Primary BGP session status is up for private peering and the Second BGP session status is down for private peering. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erBgpAvailabilityMetrics.jpg" alt-text="BGP availability per peer":::

>[!NOTE]
>During maintenance between the Microsoft edge and core network, BGP availability will appear down even if the BGP session between the customer edge and Microsoft edge remains up. For information about maintenance between the Microsoft edge and core network, make sure to have your [maintenance alerts turned on and configured](./maintenance-alerts.md).
>

### FastPath routes count (at circuit level)

Aggregation type: *Max*

This metric shows the number of FastPath routes configured on a circuit. Set an alert for when the number of FastPath routes on a circuit goes beyond the threshold limit. For more information, see [ExpressRoute FastPath limits](about-fastpath.md#ip-address-limits). 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/fastpath-routes-count-circuit.png" alt-text="Screenshot of FastPath routes count at circuit level metric.":::

### <a name = "arp"></a>ARP Availability - Split by Peering  

Aggregation type: *Avg*

You can view near to real-time availability of [ARP](./expressroute-troubleshooting-arp-resource-manager.md) (Layer-3 connectivity) across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Private Peering ARP session status is up across both peers, but down for Microsoft peering for both peers. The default aggregation (Average) was utilized across both peers.  

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erArpAvailabilityMetrics.jpg" alt-text="ARP availability per peer":::

## ExpressRoute Direct Metrics

### <a name = "admin"></a>Admin State - Split by link

Aggregation type: *Avg*

You can view the Admin state for each link of the ExpressRoute Direct port pair. The Admin state represents if the physical port is on or off. This state is required to pass traffic across the ExpressRoute Direct connection.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/adminstate-per-link.jpg" alt-text="ER Direct admin state":::

### <a name = "directin"></a>Bits In Per Second - Split by link

Aggregation type: *Avg*

You can view the bits in per second across both links of the ExpressRoute Direct port pair. Monitor this dashboard to compare inbound bandwidth for both links.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/bits-in-per-second-per-link.jpg" alt-text="ER Direct bits in per second":::

### <a name = "directout"></a>Bits Out Per Second - Split by link

Aggregation type: *Avg*

You can also view the bits out per second across both links of the ExpressRoute Direct port pair. Monitor this dashboard to compare outbound bandwidth for both links.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/bits-out-per-second-per-link.jpg" alt-text="ER Direct bits out per second":::

### <a name = "line"></a>Line Protocol - Split by link

Aggregation type: *Avg*

You can view the line protocol across each link of the ExpressRoute Direct port pair. The Line Protocol indicates if the physical link is up and running over ExpressRoute Direct. Monitor this dashboard and set alerts to know when the physical connection has gone down.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/line-protocol-per-link.jpg" alt-text="ER Direct line protocol":::

### <a name = "rxlight"></a>Rx Light Level - Split by link

Aggregation type: *Avg*

You can view the Rx light level (the light level that the ExpressRoute Direct port is **receiving**) for each port. Healthy Rx light levels generally fall within a range of -10 dBm to 0 dBm. Set alerts to be notified if the Rx light level falls outside of the healthy range.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/rxlight-level-per-link.jpg" alt-text="ER Direct line Rx Light Level":::

>[!NOTE]
> ExpressRoute Direct connectivity is hosted across different device platforms. Some ExpressRoute Direct connections will support a split view for Rx light levels by lane. However, this is not supported on all deployments.
>

### <a name = "txlight"></a>Tx Light Level - Split by link

Aggregation type: *Avg*

You can view the Tx light level (the light level that the ExpressRoute Direct port is **transmitting**) for each port. Healthy Tx light levels generally fall within a range of -10 dBm to 0 dBm. Set alerts to be notified if the Tx light level falls outside of the healthy range.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/txlight-level-per-link.jpg" alt-text="ER Direct line Tx Light Level":::

>[!NOTE]
> ExpressRoute Direct connectivity is hosted across different device platforms. Some ExpressRoute Direct connections will support a split view for Tx light levels by lane. However, this is not supported on all deployments.
>

### FastPath routes count (at port level)

Aggregation type: *Max*

This metric shows the number of FastPath routes configured on an ExpressRoute Direct port. 

*Guidance:* Set an alert for when the number of FastPath routes on the port goes beyond the threshold limit. For more information, see [ExpressRoute FastPath limits](about-fastpath.md#ip-address-limits).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/fastpath-routes-count-port.png" alt-text="Screenshot of FastPath routes count at port level metric.":::

## ExpressRoute Virtual Network Gateway Metrics

Aggregation type: *Avg*

When you deploy an ExpressRoute gateway, Azure manages the compute and functions of your gateway. There are six gateway metrics available to you to better understand the performance of your gateway:

* Bits received per second
* CPU Utilization
* Packets per seconds
* Count of routes advertised to peers
* Count of routes learned from peers
* Frequency of routes changed
* Number of VMs in the virtual network
* Active flows
* Max flows created per second

It's highly recommended you set alerts for each of these metrics so that you're aware of when your gateway could be seeing performance issues.

### <a name = "gwbits"></a>Bits received per second - Split by instance

Aggregation type: *Avg*

This metric captures inbound bandwidth utilization on the ExpressRoute virtual network gateway instances. Set an alert for how frequent the bandwidth utilization exceeds a certain threshold. If you need more bandwidth, increase the size of the ExpressRoute virtual network gateway.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/inbound-gateway.png" alt-text="Screenshot of inbound bit per second - split metrics.":::

### <a name = "cpu"></a>CPU Utilization - Split by instance

Aggregation type: *Avg*

You can view the CPU utilization of each gateway instance. The CPU utilization may spike briefly during routine host maintenance but prolong high CPU utilization could indicate your gateway is reaching a performance bottleneck. Increasing the size of the ExpressRoute gateway may resolve this issue. Set an alert for how frequent the CPU utilization exceeds a certain threshold.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/cpu-split.jpg" alt-text="Screenshot of CPU utilization - split metrics.":::

### <a name = "packets"></a>Packets Per Second - Split by instance

Aggregation type: *Avg*

This metric captures the number of inbound packets traversing the ExpressRoute gateway. You should expect to see a consistent stream of data here if your gateway is receiving traffic from your on-premises network. Set an alert for when the number of packets per second drops below a threshold indicating that your gateway is no longer receiving traffic.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/pps-split.jpg" alt-text="Screenshot of packets per second - split metrics.":::

### <a name = "advertisedroutes"></a>Count of Routes Advertised to Peer - Split by instance

Aggregation type: *Max*

This metric shows the number of routes the ExpressRoute gateway is advertising to the circuit. The address spaces may include virtual networks that are connected using VNet peering and uses remote ExpressRoute gateway. You should expect the number of routes to remain consistent unless there are frequent changes to the virtual network address spaces. Set an alert for when the number of advertised routes drop below the threshold for the number of virtual network address spaces you're aware of.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/count-of-routes-advertised-to-peer.png" alt-text="Screenshot of count of routes advertised to peer.":::

### <a name = "learnedroutes"></a>Count of routes learned from peer - Split by instance

Aggregation type: *Max*

This metric shows the number of routes the ExpressRoute gateway is learning from peers connected to the ExpressRoute circuit. These routes can be either from another virtual network connected to the same circuit or learned from on-premises. Set an alert for when the number of learned routes drop below a certain threshold. This could indicate either the gateway is seeing a performance problem or remote peers are no longer advertising routes to the ExpressRoute circuit. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/count-of-routes-learned-from-peer.png" alt-text="Screenshot of count of routes learned from peer.":::

### <a name = "frequency"></a>Frequency of routes change - Split by instance

Aggregation type: *Sum*

This metric shows the frequency of routes being learned from or advertised to remote peers. You should first investigate your on-premises devices to understand why the network is changing so frequently. A high frequency in routes change could indicate a performance problem on the ExpressRoute gateway where scaling the gateway SKU up may resolve the problem. Set an alert for a frequency threshold to be aware of when your ExpressRoute gateway is seeing abnormal route changes.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/frequency-of-routes-changed.png" alt-text="Screenshot of frequency of routes changed metric.":::

### <a name = "vm"></a>Number of VMs in the virtual network

Aggregation type: *Max*

This metric shows the number of virtual machines that are using the ExpressRoute gateway. The number of virtual machines may include VMs from peered virtual networks that use the same ExpressRoute gateway. Set an alert for this metric if the number of VMs goes above a certain threshold that could affect the gateway performance. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/number-of-virtual-machines-virtual-network.png" alt-text="Screenshot of number of virtual machines in the virtual network metric.":::

>[!NOTE]
> To maintain reliability of the service, Microsoft often performs platform or OS maintenance on the gateway service. During this time, this metric may fluctuate and report inaccurately.
>

## <a name = "activeflows"></a>Active flows

Aggregation type: *Avg*

Split by: Gateway Instance


This metric displays a count of the total number of active flows on the ExpressRoute Gateway. Only inbound traffic from on-premises is captured for active flows. Through split at instance level, you can see active flow count per gateway instance. For more information, see [understand network flow limits](../virtual-network/virtual-machine-network-throughput.md#network-flow-limits).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/active-flows.png" alt-text="Screenshot of number of active flows per second metrics dashboard.":::

## <a name = "maxflows"></a>Max flows created per second

Aggregation type: *Max*

Split by: Gateway Instance and Direction (Inbound/Outbound)

This metric display maximum number of flows created per second on the ExpressRoute Gateway. Through split at instance level and direction, you can see max flow creation rate per gateway instance and inbound/outbound direction respectively. For more information, see [understand network flow limits](../virtual-network/virtual-machine-network-throughput.md#network-flow-limits).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/max-flows-per-second.png" alt-text="Screenshot of the maximum number of flows created per second metrics dashboard.":::

## <a name = "connectionbandwidth"></a>ExpressRoute gateway connections in bits/seconds

Aggregation type: *Avg*

This metric shows the bits per second for ingress and egress to Azure through the ExpressRoute gateway. You can split this metric further to see specific connections to the ExpressRoute circuit.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erconnections.jpg" alt-text="Screenshot of gateway connection bandwidth usage metric.":::

## ExpressRoute Traffic Collector metrics

### CPU Utilization - Split by instance

Aggregation type: *Avg* (of percentage of total utilized CPU)  

*Granularity: 5 min*  

You can view the CPU utilization of each ExpressRoute Traffic Collector instance. The CPU utilization may spike briefly during routine host maintenance, but prolonged high CPU utilization could indicate your ExpressRoute Traffic Collector is reaching a performance bottleneck.  

**Guidance:** Set an alert for when avg CPU utilization exceeds a certain threshold.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/cpu-usage.png" alt-text="Screenshot of CPU usage for ExpressRoute Traffic Collector." lightbox="./media/expressroute-monitoring-metrics-alerts/cpu-usage.png":::

### Memory Utilization - Split by instance 

Aggregation type: *Avg* (of percentage of total utilized Memory) 

*Granularity: 5 min*

You can view the memory utilization of each ExpressRoute Traffic Collector instance. Memory utilization may spike briefly during routine host maintenance, but prolonged high memory utilization could indicate your Azure Traffic Collector is reaching a performance bottleneck.  

**Guidance:** Set an alert for when avg memory utilization exceeds a certain threshold.  

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/memory-usage.png" alt-text="Screenshot of memory usage for ExpressRoute Traffic Collector." lightbox="./media/expressroute-monitoring-metrics-alerts/memory-usage.png":::

### Count of flow records processed - Split by instances or ExpressRoute circuit

Aggregation type: *Count*  

*Granularity: 5 min*  

You can view the count of number of flow records processed by ExpressRoute Traffic Collector, aggregated across ExpressRoute Circuits. Customer can split the metrics across each ExpressRoute Traffic Collector instance or ExpressRoute circuit when multiple circuits are associated to the ExpressRoute Traffic Collector. Monitoring this metric will help you understand if you need to deploy more ExpressRoute Traffic Collector instances or migrate ExpressRoute circuit association from one ExpressRoute Traffic Collector deployment to another.  

**Guidance:** Splitting by circuits is recommended when multiple ExpressRoute circuits are associated with an ExpressRoute Traffic Collector deployment. This will help determine the flow count of each ExpressRoute circuit and ExpressRoute Traffic Collector utilization by each ExpressRoute circuit. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/flow-records.png" alt-text="Screenshot of average flow records for an ExpressRoute circuit." lightbox="./media/expressroute-monitoring-metrics-alerts/flow-records.png":::

## Alerts for ExpressRoute gateway connections

1. To configure alerts, navigate to **Azure Monitor**, then select **Alerts**.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/monitor-overview.png" alt-text="Screenshot of the alerts option from the monitor overview page.":::

1. Select **+ Create > Alert rule** and select the ExpressRoute gateway connection resource. Select **Next: Condition >** to configure the signal.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/select-expressroute-gateway.png" alt-text="Screenshot of the selecting ExpressRoute virtual network gateway from the select a resource page.":::

1. On the *Select a signal* page, select a metric, resource health, or activity log that you want to be alerted. Depending on the signal you select, you may need to enter additional information such as a threshold value. You may also combine multiple signals into a single alert. Select **Next: Actions >** to define who and how they get notify.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/signal.png" alt-text="Screenshot of list of signals that can be alerted for ExpressRoute gateways.":::

1. Select **+ Select action groups** to choose an existing action group you previously created or select **+ Create action group** to define a new one. In the action group, you determine how notifications get sent and who will receive them.

   :::image type="content" source="./media/expressroute-monitoring-metrics-alerts/action-group.png" alt-text="Screenshot of add action groups page.":::

1. Select **Review + create** and then **Create** to deploy the alert into your subscription.

### Alerts based on each peering

After you select a metric, certain metrics allow you to set up dimensions based on peering or a specific peer (virtual networks).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/alerts-peering-dimensions.png" alt-text="Screenshot of an alert rule based on ExpressRoute peering set up.":::

### Configure alerts for activity logs on circuits

When selecting signals to be alerted on, you can select **Activity Log** signal type.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/activity-log.png" alt-text="Screenshot of activity log signals from the select a signal page.":::

## More metrics in Log Analytics

You can also view ExpressRoute metrics by going to your ExpressRoute circuit resource and selecting the *Logs* tab. For any metrics you query, the output will contain the columns below.

| **Column** | **Type** | **Description** | 
|  ---  |  ---  |  ---  | 
| TimeGrain | string | PT1M (metric values are pushed every minute) | 
| Count | real | Usually equal to 2 (each MSEE pushes a single metric value every minute) | 
| Minimum | real | The minimum of the two metric values pushed by the two MSEEs | 
| Maximum | real | The maximum of the two metric values pushed by the two MSEEs | 
| Average | real | Equal to (Minimum + Maximum)/2 | 
| Total | real | Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried) | 
  
## Next steps

Set up your ExpressRoute connection.
  
* [Create and modify a circuit](expressroute-howto-circuit-arm.md)
* [Create and modify peering configuration](expressroute-howto-routing-arm.md)
* [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
