---
title: 'Monitoring Azure Virtual WAN - Data reference'
description: Learn about Azure Virtual WAN logs and metrics using Azure Monitor.
author: cherylmc
ms.service: virtual-wan
ms.topic: reference
ms.date: 02/15/2024
ms.author: cherylmc
ms.custom: subject-monitoring

---

# Monitoring Virtual WAN - Data reference

This article provides a reference of log and metric data collected to analyze the performance and availability of Virtual WAN. See [Monitoring Virtual WAN](monitor-virtual-wan.md) for instructions and additional context on monitoring data for Virtual WAN.

## <a name="metrics"></a>Metrics

### <a name="hub-router-metrics"></a>Virtual hub router metrics  

The following metric is available for virtual hub router within a virtual hub:

| Metric | Description|
| --- | --- |
| **Virtual Hub Data Processed** | Data on how much traffic traverses the virtual hub router in a given time period. Only the following flows use the virtual hub router: VNet to VNet (same hub and interhub) and VPN/ExpressRoute branch to VNet (interhub). If a virtual hub is secured with routing intent, then these flows traverse the firewall instead of the hub router. |
| **Routing Infrastructure Units** | The virtual hub's routing infrastructure units (RIU). The virtual hub's RIU determines how much bandwidth the virtual hub router can process for flows traversing the virtual hub router. The hub's RIU also determines how many VMs in spoke VNets the virtual hub router can support. For more details on routing infrastructure units, see [Virtual Hub Capacity](hub-settings.md#capacity).
| **Spoke VM Utilization** | The approximate number of deployed spoke VMs as a percentage of the total number of spoke VMs that the hub's routing infrastructure units can support. For example, if the hub's RIU is set to 2 (which supports 2000 spoke VMs), and 1000 VMs are deployed across spoke VNets, then this metric's value will be approximately 50%.  |


### <a name="s2s-metrics"></a>Site-to-site VPN gateway metrics

The following metrics are available for Virtual WAN site-to-site VPN gateways:

#### Tunnel Packet Drop metrics

| Metric | Description|
| --- | --- |
| **Tunnel Egress Packet Drop Count** | Count of Outgoing packets dropped by tunnel.|
| **Tunnel Ingress Packet Drop Count** | Count of Incoming packets dropped by tunnel.|
| **Tunnel NAT Packet Drops** | Number of NATed packets dropped on a tunnel by drop type and NAT rule.|
| **Tunnel Egress TS Mismatch Packet Drop** | Outgoing packet drop count from traffic selector mismatch of a tunnel.|
| **Tunnel Ingress TS Mismatch Packet Drop** | Incoming packet drop count from traffic selector mismatch of a tunnel.|

#### IPSec metrics

| Metric | Description|
| --- | --- |
| **Tunnel MMSA Count** | Number of MMSAs getting created or deleted.|
| **Tunnel QMSA Count** | Number of  IPSEC QMSAs getting created or deleted.|

#### Routing metrics

| Metric | Description|
| --- | --- |
| **BGP Peer Status** | BGP connectivity status per peer and per instance.|
| **BGP Routes Advertised** | Number of routes advertised per peer and per instance.|
| **BGP Routes Learned** | Number of routes learned per peer and per instance.|
| **VNET Address Prefix Count** | Number of VNet address prefixes that are used/advertised by the gateway.|

You can review per peer and instance metrics by selecting **Apply splitting** and choosing the preferred value.

#### Traffic Flow metrics

| Metric | Description|
| --- | --- |
| **Gateway Bandwidth** | Average site-to-site aggregate bandwidth of a gateway in bytes per second.|
| **Gateway Inbound Flows** | Number of distinct 5-tuple flows (protocol, local IP address, remote IP address, local port, and remote port) flowing into a VPN Gateway. Limit is 250k flows.|
| **Gateway Outbound Flows** | Number of distinct 5-tuple flows (protocol, local IP address, remote IP address, local port, and remote port) flowing out of a VPN Gateway. Limit is 250k flows.|
| **Tunnel Bandwidth** | Average bandwidth of a tunnel in bytes per second.|
| **Tunnel Egress Bytes** | Outgoing bytes of a tunnel. |
| **Tunnel Egress Packets** | Outgoing packet count of a tunnel. |
| **Tunnel Ingress Bytes** | Incoming bytes of a tunnel.|
| **Tunnel Ingress Packet** | Incoming packet count of a tunnel.|
| **Tunnel Peak PPS** | Number of packets per second per link connection in the last minute.|
| **Tunnel Flow Count** | Number of distinct 3-tuple (protocol, local IP address, remote IP address) flows created per link connection.|

### <a name="p2s-metrics"></a>Point-to-site VPN gateway metrics

The following metrics are available for Virtual WAN point-to-site VPN gateways:

| Metric | Description|
| --- | --- |
| **Gateway P2S Bandwidth** | Average point-to-site aggregate bandwidth of a gateway in bytes per second. |
| **P2S Connection Count** |Point-to-site connection count of a gateway. To ensure you're viewing accurate Metrics in Azure Monitor, select the **Aggregation Type** for **P2S Connection Count** as **Sum**. You can also select **Max** if you split By **Instance**. |
| **User VPN Routes Count** | Number of User VPN Routes configured on the VPN gateway. This metric can be broken down into **Static** and **Dynamic** Routes.

### <a name="er-metrics"></a>Azure ExpressRoute gateway metrics

The following metrics are available for Azure ExpressRoute gateways:

| Metric | Description|
| --- | --- |
| **BitsInPerSecond** |  Bits per second ingressing Azure via ExpressRoute that can be further split for specific connections. |
| **BitsOutPerSecond** | Bits per second egressing Azure via ExpressRoute that can be further split for specific connections.  |
| **Bits Received Per Second** | Total Bits received on ExpressRoute gateway per second. |
| **CPU Utilization** | CPU Utilization of the ExpressRoute gateway.|
| **Packets per second** | Total Packets received on ExpressRoute gateway per second.|
| **Count of routes advertised to peer**| Count of Routes Advertised to Peer by ExpressRoute gateway. |
| **Count of routes learned from peer**| Count of Routes Learned from Peer by ExpressRoute gateway.|
| **Frequency of routes changed** | Frequency of Route changes in ExpressRoute gateway.|

## <a name="diagnostic"></a>Diagnostic logs

The following diagnostic logs are available, unless otherwise specified. 

### <a name="s2s-diagnostic"></a>Site-to-site VPN gateway diagnostics

The following diagnostics are available for Virtual WAN site-to-site VPN gateways:

| Metric | Description|
| --- | --- |
| **Gateway Diagnostic Logs** | Gateway-specific diagnostics such as health, configuration, service updates, and additional diagnostics.|
| **Tunnel Diagnostic Logs** | These are IPsec tunnel-related logs such as connect and disconnect events for a site-to-site IPsec tunnel, negotiated SAs, disconnect reasons, and additional diagnostics. For connect and disconnect events, these logs also display the remote IP address of the corresponding on-premises VPN device.|
| **Route Diagnostic Logs** | These are logs related to events for static routes, BGP, route updates, and additional diagnostics. |
| **IKE Diagnostic Logs** | IKE-specific diagnostics for IPsec connections. |

### <a name="p2s-diagnostic"></a>Point-to-site VPN gateway diagnostics

The following diagnostics are available for Virtual WAN point-to-site VPN gateways:

| Metric | Description|
| --- | --- |
| **Gateway Diagnostic Logs** | Gateway-specific diagnostics such as health, configuration, service updates, and other diagnostics. |
| **IKE Diagnostic Logs** | IKE-specific diagnostics for IPsec connections.|
| **P2S Diagnostic Logs** | These are User VPN P2S (Point-to-site) configuration and client events. They include client connect/disconnect, VPN client address allocation, and other diagnostics.|

### ExpressRoute gateway diagnostics

In Azure Virtual WAN, ExpressRoute gateway metrics can be exported as logs via a diagnostic setting.

### Log Analytics sample query

If you selected to send diagnostic data to a Log Analytics Workspace, then you can use SQL-like queries, such as the following example, to examine the data. For more information, see [Log Analytics Query Language](/services-hub/health/log-analytics-query-language).

The following example contains a query to obtain site-to-site route diagnostics.

`AzureDiagnostics | where Category == "RouteDiagnosticLog"`

Replace the following values, after the **= =**, as needed based on the tables reported in the previous section of this article.

* "GatewayDiagnosticLog"
* "IKEDiagnosticLog"
* "P2SDiagnosticLog”
* "TunnelDiagnosticLog"
* "RouteDiagnosticLog"

In order to execute the query, you have to open the Log Analytics resource you configured to receive the diagnostic logs, and then select **Logs** under the **General** tab on the left side of the pane:

:::image type="content" source="./media/monitor-virtual-wan-reference/log-analytics-query-samples.png" alt-text="Screenshot of Log Analytics Query samples." lightbox="./media/monitor-virtual-wan-reference/log-analytics-query-samples.png":::

For Azure Firewall, a [workbook](../firewall/firewall-workbook.md) is provided to make log analysis easier. Using its graphical interface, you can investigate the diagnostic data without manually writing any Log Analytics query.

## <a name="activity-logs"></a>Activity logs

[**Activity log**](../azure-monitor/essentials/activity-log.md) entries are collected by default and can be viewed in the Azure portal. You can use Azure activity logs (formerly known as *operational logs* and *audit logs*) to view all operations submitted to your Azure subscription.

You can view activity logs independently or route it to Azure Monitor Logs, where you can do much more complex queries using Log Analytics.

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md).

## <a name="schemas"></a>Schemas

For detailed description of the top-level diagnostic logs schema, see [Supported services, schemas, and categories for Azure Diagnostic Logs](../azure-monitor/essentials/resource-logs-schema.md).

When reviewing any metrics through Log Analytics, the output contains the following columns:

|**Column**|**Type**|**Description**|
| --- | --- | --- |
|TimeGrain|string|PT1M (metric values are pushed every minute)|
|Count|real|Usually equal to 2 (each MSEE pushes a single metric value every minute)|
|Minimum|real|The minimum of the two metric values pushed by the two MSEEs|
|Maximum|real|The maximum of the two metric values pushed by the two MSEEs|
|Average|real|Equal to (Minimum + Maximum)/2|
|Total|real|Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried)|

## <a name="azure-firewall"></a>Monitoring secured hub (Azure Firewall)

If you chose to secure your virtual hub using Azure Firewall, relevant logs and metrics are available here: [Azure Firewall logs and metrics](../firewall/logs-and-metrics.md).
You can monitor the Secured Hub using Azure Firewall logs and metrics. You can also use activity logs to audit operations on Azure Firewall resources.
For every Azure Virtual WAN you secure and convert to a Secured Hub, an explicit firewall resource object is created in the resource group where the hub is located.

:::image type="content" source="./media/monitor-virtual-wan-reference/firewall-resources-portal.png" alt-text="Screenshot shows a Firewall resource in the vWAN hub resource group." lightbox="./media/monitor-virtual-wan-reference/firewall-resources-portal.png":::


## Next steps

* To learn how to monitor Azure Firewall logs and metrics, see [Tutorial: Monitor Azure Firewall logs](../firewall/firewall-diagnostics.md).
* For more information about Virtual WAN monitoring, see [Monitoring Azure Virtual WAN](monitor-virtual-wan.md).
* To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../azure-monitor/essentials/data-platform-metrics.md).
