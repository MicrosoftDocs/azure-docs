---
title: 'Monitoring Azure Virtual WAN - Data reference'
description: Learn about Azure Virtual WAN logs and metrics using Azure Monitor.
author: cherylmc
ms.service: virtual-wan
ms.topic: reference
ms.date: 06/08/2022
ms.author: cherylmc
ms.custom: subject-monitoring

---

# Monitoring Virtual WAN data reference

This article provides a reference of log and metric data collected to analyze the performance and availability of Virtual WAN. See [Monitoring Virtual WAN](monitor-virtual-wan.md) for instructions and additional context on monitoring data for Virtual WAN.

## <a name="metrics"></a>Metrics

### <a name="hub-router-metrics"></a>Virtual hub router metrics  

The following metric is available for virtual hub router within a virtual hub:

| Metric | Description|
| --- | --- |
| **Virtual Hub Data Processed** | Data on how much traffic traverses the virtual hub router in a given time period. Note that only the following flows use the virtual hub router: VNet to VNet (same hub and interhub) and VPN/ExpressRoute branch to VNet (interhub). If a virtual hub is secured with routing intent, then these flows will traverse the firewall instead of the hub router. |

#### PowerShell steps

To query, use the following example PowerShell commands. The necessary fields are explained below the example.

**Step 1:**

```azurepowershell-interactive
$MetricInformation = Get-AzMetric -ResourceId "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/VirtualHubs/<VirtualHubName>" -MetricName "VirtualHubDataProcessed" -TimeGrain 00:05:00 -StartTime 2022-2-20T01:00:00Z -EndTime 2022-2-20T01:30:00Z -AggregationType Sum
```

**Step 2:**

```azurepowershell-interactive
$MetricInformation.Data
```

* **Resource ID** - Your virtual hub's Resource ID can be found on the Azure portal. Navigate to the virtual hub page within vWAN and select **JSON View** under Essentials.  

* **Metric Name** - Refers to the name of the metric you're querying, which in this case is called 'VirtualHubDataProcessed'. This metric shows all the data that the virtual hub router has processed in the selected time period of the hub.  

* **Time Grain** - Refers to the frequency at which you want to see the aggregation. In the current command, you'll see a selected aggregated unit per 5 mins. You can select – 5M/15M/30M/1H/6H/12H and 1D.

* **Start Time and End Time** - This time is based on UTC, so please ensure that you're entering UTC values when inputting these parameters. If these parameters aren't used, the past one hour's worth of data is shown by default.  

* **Sum Aggregation Type** - This aggregation type will show you the total number of bytes that traversed the virtual hub router during a selected time period. The **Max** and **Min** aggregation types are not meaningful. 
 

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
| **Tunnel Bandwidth** | Average bandwidth of a tunnel in bytes per second.|
| **Tunnel Egress Bytes** | Outgoing bytes of a tunnel. |
| **Tunnel Egress Packets** | Outgoing packet count of a tunnel. |
| **Tunnel Ingress Bytes** | Incoming bytes of a tunnel.|
| **Tunnel Ingress Packet** | Incoming packet count of a tunnel.|
| **Tunnel Peak PPS** | Number of packets per second per link connection in the last minute.|
| **Tunnel Flow Count** | Number of distinct flows created per link connection.|

### <a name="p2s-metrics"></a>Point-to-site VPN gateway metrics

The following metrics are available for Virtual WAN point-to-site VPN gateways:

| Metric | Description|
| --- | --- |
| **Gateway P2S Bandwidth** | Average point-to-site aggregate bandwidth of a gateway in bytes per second. |
| **P2S Connection Count** |Point-to-site connection count of a gateway. To ensure you're viewing accurate Metrics in Azure Monitor, select the **Aggregation Type** for **P2S Connection Count** as **Sum**. You may also select **Max** if you split By **Instance**. |
| **User VPN Routes Count** | Number of User VPN Routes configured on the VPN gateway. This metric can be broken down into **Static** and **Dynamic** Routes.

### <a name="er-metrics"></a>Azure ExpressRoute gateway metrics

The following metrics are available for Azure ExpressRoute gateways:

| Metric | Description|
| --- | --- |
| **BitsInPerSecond** |  Bits per second ingressing Azure via ExpressRoute gateway that can be further split for specific connections. |
| **BitsOutPerSecond** | Bits per second egressing Azure via ExpressRoute gateway that can be further split for specific connections.  |
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
| **Tunnel Diagnostic Logs** | These are IPsec tunnel-related logs such as connect and disconnect events for a site-to-site IPsec tunnel, negotiated SAs, disconnect reasons, and additional diagnostics. For connect and disconnect events, these logs will also display the remote IP address of the corresponding on-premises VPN device.|
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

If you selected to send diagnostic data to a Log Analytics Workspace, then you can use SQL-like queries such as the example below to examine the data. For more information, see [Log Analytics Query Language](/services-hub/health/log-analytics-query-language).

The following example contains a query to obtain site-to-site route diagnostics.

`AzureDiagnostics | where Category == "RouteDiagnosticLog"`

Replace the values below, after the **= =**, as needed based on the tables reported in the previous section of this article.

* "GatewayDiagnosticLog"
* "IKEDiagnosticLog"
* "P2SDiagnosticLog”
* "TunnelDiagnosticLog"
* "RouteDiagnosticLog"

In order to execute the query, you have to open the Log Analytics resource you configured to receive the diagnostic logs, and then select **Logs** under the **General** tab on the left side of the pane:

:::image type="content" source="./media/monitor-virtual-wan-reference/log-analytics-query-samples.png" alt-text="Screenshot of Log Analytics Query samples." lightbox="./media/monitor-virtual-wan-reference/log-analytics-query-samples.png":::

For Azure Firewall, a [workbook](../firewall/firewall-workbook.md) is provided to make log analysis easier. Using its graphical interface, it will be possible to investigate the diagnostic data without manually writing any Log Analytics query.

## <a name="activity-logs"></a>Activity logs

[**Activity log**](../azure-monitor/essentials/activity-log.md) entries are collected by default and can be viewed in the Azure portal. You can use Azure activity logs (formerly known as *operational logs* and *audit logs*) to view all operations submitted to your Azure subscription.

You can view activity logs independently or route it to Azure Monitor Logs, where you can do much more complex queries using Log Analytics.

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md).

## <a name="schemas"></a>Schemas

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

## <a name="azure-firewall"></a>Monitoring secured hub (Azure Firewall)

If you have chosen to secure your virtual hub using Azure Firewall, relevant logs and metrics are available here: [Azure Firewall logs and metrics](../firewall/logs-and-metrics.md).
You can monitor the Secured Hub using Azure Firewall logs and metrics. You can also use activity logs to audit operations on Azure Firewall resources.
For every Azure Virtual WAN you secure and convert to a Secured Hub, an explicit firewall resource object is created in the resource group where the hub is located.

:::image type="content" source="./media/monitor-virtual-wan-reference/firewall-resources-portal.png" alt-text="Screenshot shows a Firewall resource in the vWAN hub resource group." lightbox="./media/monitor-virtual-wan-reference/firewall-resources-portal.png":::


## Next steps

* To learn how to monitor Azure Firewall logs and metrics, see [Tutorial: Monitor Azure Firewall logs](../firewall/firewall-diagnostics.md).
* For additional information about Virtual WAN monitoring, see [Monitoring Azure Virtual WAN](monitor-virtual-wan.md).
* To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../azure-monitor/essentials/data-platform-metrics.md).
