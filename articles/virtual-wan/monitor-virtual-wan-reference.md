---
title: Monitoring data reference for Azure Virtual WAN
description: This article contains important reference material you need when you monitor Azure Virtual WAN by using Azure Monitor.
ms.date: 09/10/2024
ms.custom: horz-monitor
ms.topic: reference
author: cherylmc
ms.author: cherylmc
ms.service: azure-virtual-wan
---
# Azure Virtual WAN monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Virtual WAN](monitor-virtual-wan.md) for details on the data you can collect for Virtual WAN and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### <a name="hub-router-metrics"></a>Supported metrics for Microsoft.Network/virtualhubs

The following table lists the metrics available for the Microsoft.Network/virtualhubs resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/virtualhubs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-virtualhubs-metrics-include.md)]

This table contains more information about some of the metrics in the preceding table.

| Metric | Description |
|:-------|:------------|
| **Routing Infrastructure Units** | The virtual hub's routing infrastructure units (RIU). The virtual hub's RIU determines how much bandwidth the virtual hub router can process for flows traversing the virtual hub router. The hub's RIU also determines how many VMs in spoke VNets the virtual hub router can support. For more information on routing infrastructure units, see [Virtual Hub Capacity](hub-settings.md#capacity).
| **Spoke VM Utilization** | The approximate number of deployed spoke VMs as a percentage of the total number of spoke VMs that the hub's routing infrastructure units can support. For example, if the hub's RIU is set to 2, which supports 2,000 spoke VMs, and 1,000 VMs are deployed across spoke virtual networks, this metric's value is approximately 50%.  |
| **Count Of Routes Advertised To Peer** | The Virtual WAN hub router exchanges routes with all active instances of ExpressRoute gateways, VPN  gateways and NVAs deployed in the Virtual WAN hub or in a connected Virtual Network spoke. When the Virtual WAN hub router learns a  prefix with the same AS-PATH length from multiple peers, the router internally selects a peer to prefer for that specific route and re-advertises that route to all **other** peers (including the other gateway or NVA instance). This  internal route selection process occurs for every route processed and the selected instance can change due to various factors such as network changes or maintenance events. As a result the number of routes advertised to an individual peer may fluctuate. When this metric is viewed with the maximum aggregation, Azure Monitor displays the data associated with a **single** BGP session between the Virtual WAN hub router and gateway or NVA. To effectively monitor changes or potential issues in your network, apply a split in Azure Monitor on the Count of Routes Advertised to Peer metric on a per peer IP address and ensure that the total number of routes advertised to your ExpressRoute, VPN or NVA is stable or in-line with any network changes. The total count of routes advertised must be calculated manually as the Azure Monitor **sum**  aggregation type sums up data-points over the aggregation window, which  does not accurately reflect routes advertised count.   |


### <a name="s2s-metrics"></a>Supported metrics for microsoft.network/vpngateways

The following table lists the metrics available for the microsoft.network/vpngateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [microsoft.network/vpngateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-vpngateways-metrics-include.md)]

These tables contain more information about some of the metrics in the preceding table.

#### Tunnel Packet Drop metrics

| Metric | Description|
| --- | --- |
| **Tunnel Egress Packet Drop Count** | Count of Outgoing packets dropped by tunnel.|
| **Tunnel Ingress Packet Drop Count** | Count of Incoming packets dropped by tunnel.|
| **Tunnel NAT Packet Drops** | Number of NATed packets dropped on a tunnel by drop type and NAT rule.|
| **Tunnel Egress TS Mismatch Packet Drop** | Outgoing packet drop count from traffic selector mismatch of a tunnel.|
| **Tunnel Ingress TS Mismatch Packet Drop** | Incoming packet drop count from traffic selector mismatch of a tunnel.|

#### IPSec metrics

| Metric | Description |
|:-------|:------------|
| **Tunnel MMSA Count** | Number of MMSAs getting created or deleted.|
| **Tunnel QMSA Count** | Number of  IPSEC QMSAs getting created or deleted.|

#### Routing metrics

| Metric | Description |
|:-------|:------------|
| **BGP Peer Status** | BGP connectivity status per peer and per instance.|
| **BGP Routes Advertised** | Number of routes advertised per peer and per instance.|
| **BGP Routes Learned** | Number of routes learned per peer and per instance.|
| **VNET Address Prefix Count** | Number of virtual network address prefixes that the gateway uses and advertises.|

You can review per peer and instance metrics by selecting **Apply splitting** and choosing the preferred value.

#### Traffic Flow metrics

| Metric | Description |
|:-------|:------------|
| **Gateway S2S Bandwidth** | Average site-to-site aggregate bandwidth of a gateway in bytes per second.|
| **Gateway Inbound Flows** | Number of distinct 5-tuple flows (protocol, local IP address, remote IP address, local port, and remote port) flowing into a VPN Gateway. Limit is 250k flows.|
| **Gateway Outbound Flows** | Number of distinct 5-tuple flows (protocol, local IP address, remote IP address, local port, and remote port) flowing out of a VPN Gateway. Limit is 250k flows.|
| **Tunnel Bandwidth** | Average bandwidth of a tunnel in bytes per second.|
| **Tunnel Egress Bytes** | Outgoing bytes of a tunnel. |
| **Tunnel Egress Packets** | Outgoing packet count of a tunnel. |
| **Tunnel Ingress Bytes** | Incoming bytes of a tunnel.|
| **Tunnel Ingress Packets** | Incoming packet count of a tunnel.|
| **Tunnel Peak PPS** | Number of packets per second per link connection in the last minute.|
| **Tunnel Total Flow Count** | Number of distinct 3-tuple (protocol, local IP address, remote IP address) flows created per link connection.|

### <a name="p2s-metrics"></a>Supported metrics for microsoft.network/p2svpngateways

The following table lists the metrics available for the microsoft.network/p2svpngateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [microsoft.network/p2svpngateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-p2svpngateways-metrics-include.md)]

This table contains more information about some of the metrics in the preceding table.

| Metric | Description |
|:-------|:------------|
| **Gateway P2S Bandwidth** | Average point-to-site aggregate bandwidth of a gateway in bytes per second. |
| **P2S Connection Count** |Point-to-site connection count of a gateway. To ensure you're viewing accurate Metrics in Azure Monitor, select the **Aggregation Type** for **P2S Connection Count** as **Sum**. You can also select **Max** if you split By **Instance**. |
| **User VPN Routes Count** | Number of User VPN Routes configured on the VPN gateway. This metric can be broken down into **Static** and **Dynamic** Routes.

### <a name="er-metrics"></a>Supported metrics for microsoft.network/expressroutegateways

The following table lists the metrics available for the microsoft.network/expressroutegateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [microsoft.network/expressroutegateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-expressroutegateways-metrics-include.md)]

This table contains more information about some of the metrics in the preceding table.

| Metric | Description |
|:-------|:------------|
| **BitsInPerSecond** |  Bits per second ingressing Azure via ExpressRoute that can be further split for specific connections. |
| **BitsOutPerSecond** | Bits per second egressing Azure via ExpressRoute that can be further split for specific connections.  |
| **Bits Received Per Second** | Total Bits received on ExpressRoute gateway per second. |
| **CPU Utilization** | CPU Utilization of the ExpressRoute gateway.|
| **Packets received per second** | Total Packets received on ExpressRoute gateway per second.|
| **Count of routes advertised to peer**| Count of Routes Advertised to Peer by ExpressRoute gateway. |
| **Count of routes learned from peer**| Count of Routes Learned from Peer by ExpressRoute gateway.|
| **Frequency of routes change** | Frequency of Route changes in ExpressRoute gateway.|

### ExpressRoute gateway diagnostics

In Azure Virtual WAN, ExpressRoute gateway metrics can be exported as logs by using a diagnostic setting.

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

<a name="diagnostic"></a>
[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### <a name="p2s-diagnostic"></a>Supported resource logs for microsoft.network/p2svpngateways

[!INCLUDE [microsoft.network/p2svpngateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-p2svpngateways-logs-include.md)]

This table contains more information about the preceding table.

| Metric | Description |
|:-------|:------------|
| **Gateway Diagnostic Logs** | Gateway-specific diagnostics such as health, configuration, service updates, and other diagnostics. |
| **IKE Diagnostic Logs** | IKE-specific diagnostics for IPsec connections.|
| **P2S Diagnostic Logs** | These events are User VPN P2S (Point-to-site) configuration and client events. They include client connect/disconnect, VPN client address allocation, and other diagnostics.|

### <a name="s2s-diagnostic"></a>Supported resource logs for microsoft.network/vpngateways

[!INCLUDE [microsoft.network/vpngateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-vpngateways-logs-include.md)]

This table contains more information about the preceding table.

| Metric | Description |
|:-------|:------------|
| **Gateway Diagnostic Logs** | Gateway-specific diagnostics such as health, configuration, service updates, and other diagnostics. |
| **Tunnel Diagnostic Logs** | IPsec tunnel-related logs such as connect and disconnect events for a site-to-site IPsec tunnel, negotiated SAs, disconnect reasons, and other diagnostics. For connect and disconnect events, these logs also display the remote IP address of the corresponding on-premises VPN device. |
| **Route Diagnostic Logs** | Logs related to events for static routes, BGP, route updates, and other diagnostics. |
| **IKE Diagnostic Logs** | IKE-specific diagnostics for IPsec connections. |

### Log Analytics sample query

If you selected to send diagnostic data to a Log Analytics Workspace, then you can use SQL-like queries, such as the following example, to examine the data. For more information, see [Log Analytics Query Language](/services-hub/health/log-analytics-query-language).

The following example contains a query to obtain site-to-site route diagnostics.

`AzureDiagnostics | where Category == "RouteDiagnosticLog"`

Replace the following values, after the `==`, as needed based on the tables in this article.

- GatewayDiagnosticLog
- IKEDiagnosticLog
- P2SDiagnosticLog
- TunnelDiagnosticLog
- RouteDiagnosticLog

In order to run the query, you have to open the Log Analytics resource you configured to receive the diagnostic logs, and then select **Logs** under the **General** tab on the left side of the pane:

:::image type="content" source="./media/monitor-virtual-wan-reference/log-analytics-query-samples.png" alt-text="Screenshot of Log Analytics Query samples." lightbox="./media/monitor-virtual-wan-reference/log-analytics-query-samples.png":::

For Azure Firewall, a [workbook](../firewall/firewall-workbook.md) is provided to make log analysis easier. Using its graphical interface, you can investigate the diagnostic data without manually writing any Log Analytics query.

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Microsoft.Network/vpnGateways (Virtual WAN site-to-site VPN gateways)

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

<a name="activity-logs"></a>
[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure Virtual WAN](monitor-virtual-wan.md) for a description of monitoring Virtual WAN.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
- To learn how to monitor Azure Firewall logs and metrics, see [Tutorial: Monitor Azure Firewall logs](../firewall/firewall-diagnostics.md).
