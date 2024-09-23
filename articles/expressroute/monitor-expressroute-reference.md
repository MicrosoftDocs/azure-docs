---
title: Monitoring data reference for Azure ExpressRoute
description: This article contains important reference material you need when you monitor Azure ExpressRoute by using Azure Monitor.
ms.date: 07/11/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: duongau
ms.author: duau
ms.service: azure-expressroute
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
[!INCLUDE [<ResourceType/namespace>](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-expressrouteports-metrics-include.md)]

### Metrics information

Follow links in these lists for more information about metrics from the preceding tables.

ExpressRoute circuits metrics:

- [ARP Availability](#arp)
- [BGP Availability](#bgp)
- [BitsInPerSecond](#circuitbandwidth)
- [BitsOutPerSecond](#circuitbandwidth)
- DroppedInBitsPerSecond
- DroppedOutBitsPerSecond
- GlobalReachBitsInPerSecond
- GlobalReachBitsOutPerSecond
- [FastPathRoutesCount](#fastpath-routes-count-at-circuit-level)

> [!NOTE]
> Using *GlobalGlobalReachBitsInPerSecond* and *GlobalGlobalReachBitsOutPerSecond* will only be visible if at least one Global Reach connection is established.

ExpressRoute gateways metrics:

- [Bits received per second](#gwbits)
- [CPU utilization](#cpu)
- [Packets per second](#packets)
- [Count of routes advertised to peer](#advertisedroutes)
- [Count of routes learned from peer](#learnedroutes)
- [Frequency of routes changed](#frequency)
- [Number of VMs in virtual network](#vm)
- [Active flows](#activeflows)
- [Max flows created per second](#maxflows)

ExpressRoute gateway connections metrics:

- [BitsInPerSecond](#connectionbandwidth)
- [BitsOutPerSecond](#connectionbandwidth)

ExpressRoute Direct metrics:

- [BitsInPerSecond](#directin)
- [BitsOutPerSecond](#directout)
- DroppedInBitsPerSecond
- DroppedOutBitsPerSecond
- [AdminState](#admin)
- [LineProtocol](#line)
- [RxLightLevel](#rxlight)
- [TxLightLevel](#txlight)
- [FastPathRoutesCount](#fastpath-routes-count-at-port-level)

ExpressRoute Traffic Collector metrics:

- [CPU utilization](#cpu-utilization---split-by-instance-1)
- [Memory Utilization](#memory-utilization---split-by-instance)
- [Count of flow records processed](#count-of-flow-records-processed---split-by-instances-or-expressroute-circuit)

### Circuits metrics

#### <a name = "arp"></a>ARP Availability - Split by Peering  

Aggregation type: *Avg*

You can view near to real-time availability of [ARP](./expressroute-troubleshooting-arp-resource-manager.md) (Layer-2 connectivity) across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Private Peering ARP session status is up across both peers, but down for Microsoft peering for both peers. The default aggregation (Average) was utilized across both peers.  

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erArpAvailabilityMetrics.jpg" alt-text="Screenshot shows ARP availability per peer.":::

#### <a name = "bgp"></a>BGP Availability - Split by Peer  

Aggregation type: *Avg*

You can view near to real-time availability of BGP (Layer-3 connectivity) across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Primary BGP session status is up for private peering and the Second BGP session status is down for private peering. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erBgpAvailabilityMetrics.jpg" alt-text="Screenshot shows BGP availability per peer.":::

>[!NOTE]
>During maintenance between the Microsoft edge and core network, BGP availability will appear down even if the BGP session between the customer edge and Microsoft edge remains up. For information about maintenance between the Microsoft edge and core network, make sure to have your [maintenance alerts turned on and configured](./maintenance-alerts.md).
>

#### <a name = "circuitbandwidth"></a>Bits In and Out - Metrics across all peerings

Aggregation type: *Avg*

You can view metrics across all peerings on a given ExpressRoute circuit.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/ermetricspeering.jpg" alt-text="Screenshot shows circuit metrics in the Azure portal.":::

#### Bits In and Out - Metrics per peering

Aggregation type: *Avg*

You can view metrics for private, public, and Microsoft peering in bits/second.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erpeeringmetrics.jpg" alt-text="Screenshot shows metrics per peering in the Azure portal.":::

#### FastPath routes count (at circuit level)

Aggregation type: *Max*

This metric shows the number of FastPath routes configured on a circuit. Set an alert for when the number of FastPath routes on a circuit goes beyond the threshold limit. For more information, see [ExpressRoute FastPath limits](about-fastpath.md#ip-address-limits). 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/fastpath-routes-count-circuit.png" alt-text="Screenshot of FastPath routes count at circuit level metric.":::

### Virtual network gateway metrics

Aggregation type: *Avg*

When you deploy an ExpressRoute gateway, Azure manages the compute and functions of your gateway. There are six gateway metrics available to you to better understand the performance of your gateway:

- Bits received per second
- CPU Utilization
- Packets per seconds
- Count of routes advertised to peers
- Count of routes learned from peers
- Frequency of routes changed
- Number of VMs in the virtual network
- Active flows
- Max flows created per second

We highly recommended you set alerts for each of these metrics so that you're aware of when your gateway could be seeing performance issues.

#### <a name = "gwbits"></a>Bits received per second - Split by instance

Aggregation type: *Avg*

This metric captures inbound bandwidth utilization on the ExpressRoute virtual network gateway instances. Set an alert for how frequent the bandwidth utilization exceeds a certain threshold. If you need more bandwidth, increase the size of the ExpressRoute virtual network gateway.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/inbound-gateway.png" alt-text="Screenshot of inbound bit per second - split metrics.":::

#### <a name = "cpu"></a>CPU Utilization - Split by instance

Aggregation type: *Avg*

You can view the CPU utilization of each gateway instance. The CPU utilization might spike briefly during routine host maintenance but prolong high CPU utilization could indicate your gateway is reaching a performance bottleneck. Increasing the size of the ExpressRoute gateway might resolve this issue. Set an alert for how frequent the CPU utilization exceeds a certain threshold.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/cpu-split.jpg" alt-text="Screenshot of CPU utilization - split metrics.":::

#### <a name = "packets"></a>Packets Per Second - Split by instance

Aggregation type: *Avg*

This metric captures the number of inbound packets traversing the ExpressRoute gateway. You should expect to see a consistent stream of data here if your gateway is receiving traffic from your on-premises network. Set an alert for when the number of packets per second drops below a threshold indicating that your gateway is no longer receiving traffic.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/pps-split.jpg" alt-text="Screenshot of packets per second - split metrics.":::

#### <a name = "advertisedroutes"></a>Count of Routes Advertised to Peer - Split by instance

Aggregation type: *Max*

This metric shows the number of routes the ExpressRoute gateway is advertising to the circuit. The address spaces might include virtual networks that are connected using virtual network peering and uses remote ExpressRoute gateway. You should expect the number of routes to remain consistent unless there are frequent changes to the virtual network address spaces. Set an alert for when the number of advertised routes drop below the threshold for the number of virtual network address spaces you're aware of.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/count-of-routes-advertised-to-peer.png" alt-text="Screenshot of count of routes advertised to peer.":::

#### <a name = "learnedroutes"></a>Count of routes learned from peer - Split by instance

Aggregation type: *Max*

This metric shows the number of routes the ExpressRoute gateway is learning from peers connected to the ExpressRoute circuit. These routes can be either from another virtual network connected to the same circuit or learned from on-premises. Set an alert for when the number of learned routes drop below a certain threshold. This metric can indicate either the gateway is seeing a performance problem or remote peers are no longer advertising routes to the ExpressRoute circuit. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/count-of-routes-learned-from-peer.png" alt-text="Screenshot of count of routes learned from peer.":::

#### <a name = "frequency"></a>Frequency of routes change - Split by instance

Aggregation type: *Sum*

This metric shows the frequency of routes being learned from or advertised to remote peers. You should first investigate your on-premises devices to understand why the network is changing so frequently. A high frequency in routes change could indicate a performance problem on the ExpressRoute gateway where scaling the gateway SKU up might resolve the problem. Set an alert for a frequency threshold to be aware of when your ExpressRoute gateway is seeing abnormal route changes.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/frequency-of-routes-changed.png" alt-text="Screenshot of frequency of routes changed metric.":::

#### <a name = "vm"></a>Number of VMs in the virtual network

Aggregation type: *Max*

This metric shows the number of virtual machines that are using the ExpressRoute gateway. The number of virtual machines might include VMs from peered virtual networks that use the same ExpressRoute gateway. Set an alert for this metric if the number of VMs goes above a certain threshold that could affect the gateway performance. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/number-of-virtual-machines-virtual-network.png" alt-text="Screenshot of number of virtual machines in the virtual network metric.":::

>[!NOTE]
> To maintain reliability of the service, Microsoft often performs platform or OS maintenance on the gateway service. During this time, this metric may fluctuate and report inaccurately.
>

#### <a name = "activeflows"></a>Active flows

Aggregation type: *Avg*

Split by: Gateway Instance

This metric displays a count of the total number of active flows on the ExpressRoute Gateway. Only inbound traffic from on-premises is captured for active flows. Through split at instance level, you can see active flow count per gateway instance. For more information, see [understand network flow limits](../virtual-network/virtual-machine-network-throughput.md#network-flow-limits).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/active-flows.png" alt-text="Screenshot of number of active flows per second metrics dashboard.":::

#### <a name = "maxflows"></a>Max flows created per second

Aggregation type: *Max*

Split by: Gateway Instance and Direction (Inbound/Outbound)

This metric displays the maximum number of flows created per second on the ExpressRoute Gateway. Through split at instance level and direction, you can see max flow creation rate per gateway instance and inbound/outbound direction respectively. For more information, see [understand network flow limits](../virtual-network/virtual-machine-network-throughput.md#network-flow-limits).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/max-flows-per-second.png" alt-text="Screenshot of the maximum number of flows created per second metrics dashboard.":::

### <a name = "connectionbandwidth"></a>Gateway connections in bits/seconds

Aggregation type: *Avg*

This metric shows the bits per second for ingress and egress to Azure through the ExpressRoute gateway. You can split this metric further to see specific connections to the ExpressRoute circuit.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/erconnections.jpg" alt-text="Screenshot of gateway connection bandwidth usage metric.":::

### ExpressRoute Direct metrics

#### <a name = "directin"></a>Bits In Per Second - Split by link

Aggregation type: *Avg*

You can view the bits in per second across both links of the ExpressRoute Direct port pair. Monitor this dashboard to compare inbound bandwidth for both links.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/bits-in-per-second-per-link.jpg" alt-text="Screenshot shows ER Direct bits in per second in the Azure portal.":::

#### <a name = "directout"></a>Bits Out Per Second - Split by link

Aggregation type: *Avg*

You can also view the bits out per second across both links of the ExpressRoute Direct port pair. Monitor this dashboard to compare outbound bandwidth for both links.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/bits-out-per-second-per-link.jpg" alt-text="Screenshot shows the ER Direct bits out per second in the Azure portal.":::

#### <a name = "admin"></a>Admin State - Split by link

Aggregation type: *Avg*

You can view the Admin state for each link of the ExpressRoute Direct port pair. The Admin state represents if the physical port is on or off. This state is required to pass traffic across the ExpressRoute Direct connection.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/adminstate-per-link.jpg" alt-text="Screenshot shows the ER Direct admin state in the Azure portal.":::

#### <a name = "line"></a>Line Protocol - Split by link

Aggregation type: *Avg*

You can view the line protocol across each link of the ExpressRoute Direct port pair. The Line Protocol indicates if the physical link is up and running over ExpressRoute Direct. Monitor this dashboard and set alerts to know when the physical connection goes down.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/line-protocol-per-link.jpg" alt-text="Screenshot shows the ER Direct line protocol in the Azure portal.":::

#### <a name = "rxlight"></a>Rx Light Level - Split by link

Aggregation type: *Avg*

You can view the Rx light level (the light level that the ExpressRoute Direct port is **receiving**) for each port. Healthy Rx light levels generally fall within a range of -10 dBm to 0 dBm. Set alerts to be notified if the Rx light level falls outside of the healthy range.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/rxlight-level-per-link.jpg" alt-text="Screenshot shows the ER Direct line Rx Light Level in the Azure portal.":::

>[!NOTE]
> ExpressRoute Direct connectivity is hosted across different device platforms. Some ExpressRoute Direct connections will support a split view for Rx light levels by lane. However, this is not supported on all deployments.
>

#### <a name = "txlight"></a>Tx Light Level - Split by link

Aggregation type: *Avg*

You can view the Tx light level (the light level that the ExpressRoute Direct port is **transmitting**) for each port. Healthy Tx light levels generally fall within a range of -10 dBm to 0 dBm. Set alerts to be notified if the Tx light level falls outside of the healthy range.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/txlight-level-per-link.jpg" alt-text="Screenshot shows the ER Direct line Tx Light Level in the Azure portal.":::

>[!NOTE]
> ExpressRoute Direct connectivity is hosted across different device platforms. Some ExpressRoute Direct connections will support a split view for Tx light levels by lane. However, this is not supported on all deployments.
>

#### FastPath routes count (at port level)

Aggregation type: *Max*

This metric shows the number of FastPath routes configured on an ExpressRoute Direct port. 

*Guidance:* Set an alert for when the number of FastPath routes on the port goes beyond the threshold limit. For more information, see [ExpressRoute FastPath limits](about-fastpath.md#ip-address-limits).

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/fastpath-routes-count-port.png" alt-text="Screenshot of FastPath routes count at port level metric.":::

### ExpressRoute Traffic Collector metrics

#### CPU Utilization - Split by instance

Aggregation type: *Avg* (of percentage of total utilized CPU)  

*Granularity: 5 min*  

You can view the CPU utilization of each ExpressRoute Traffic Collector instance. The CPU utilization might spike briefly during routine host maintenance, but prolonged high CPU utilization could indicate your ExpressRoute Traffic Collector is reaching a performance bottleneck.  

**Guidance:** Set an alert for when avg CPU utilization exceeds a certain threshold.

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/cpu-usage.png" alt-text="Screenshot of CPU usage for ExpressRoute Traffic Collector." lightbox="./media/expressroute-monitoring-metrics-alerts/cpu-usage.png":::

#### Memory Utilization - Split by instance 

Aggregation type: *Avg* (of percentage of total utilized Memory) 

*Granularity: 5 min*

You can view the memory utilization of each ExpressRoute Traffic Collector instance. Memory utilization might spike briefly during routine host maintenance, but prolonged high memory utilization could indicate your Azure Traffic Collector is reaching a performance bottleneck.  

**Guidance:** Set an alert for when avg memory utilization exceeds a certain threshold.  

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/memory-usage.png" alt-text="Screenshot of memory usage for ExpressRoute Traffic Collector." lightbox="./media/expressroute-monitoring-metrics-alerts/memory-usage.png":::

#### Count of flow records processed - Split by instances or ExpressRoute circuit

Aggregation type: *Count*  

*Granularity: 5 min*  

You can view the count of number of flow records processed by ExpressRoute Traffic Collector, aggregated across ExpressRoute Circuits. Customer can split the metrics across each ExpressRoute Traffic Collector instance or ExpressRoute circuit when multiple circuits are associated to the ExpressRoute Traffic Collector. Monitoring this metric helps you understand if you need to deploy more ExpressRoute Traffic Collector instances or migrate ExpressRoute circuit association from one ExpressRoute Traffic Collector deployment to another.  

**Guidance:** Splitting by circuits is recommended when multiple ExpressRoute circuits are associated with an ExpressRoute Traffic Collector deployment. This metric helps determine the flow count of each ExpressRoute circuit and ExpressRoute Traffic Collector utilization by each ExpressRoute circuit. 

:::image type="content" source="./media/expressroute-monitoring-metrics-alerts/flow-records.png" alt-text="Screenshot of average flow records for an ExpressRoute circuit." lightbox="./media/expressroute-monitoring-metrics-alerts/flow-records.png":::

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
| roleInstance | The gateway instance. Each ExpressRoute gateway is composed of multiple instances. The supported values are `GatewayTenantWork_IN_X`, where X is a minimum of 0 and a maximum of the number of gateway instances -1. |

Dimension for Express Direct:

| Dimension Name | Description |
|:---------------|:------------|
| Lane | |
| Link | The physical link. Each ExpressRoute Direct port pair is composed of two physical links for redundancy, and the supported values are link1 and link2. |

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

The following table lists the operations related to ExpressRoute that might be created in the Activity log.

| Operation | Description |
|:---|:---|
| All Administrative operations | All administrative operations including create, update, and delete of an ExpressRoute circuit. |
| Create or update ExpressRoute circuit | An ExpressRoute circuit was created or updated. |
| Deletes ExpressRoute circuit | An ExpressRoute circuit was deleted.|

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md).

## Schemas

For detailed description of the top-level diagnostic logs schema, see [Supported services, schemas, and categories for Azure Diagnostic Logs](../azure-monitor/essentials/resource-logs-schema.md).

When you review any metrics through Log Analytics, the output contains the following columns:

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
