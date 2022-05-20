---
title: 'Monitoring Azure Virtual WAN'
description: Learn about Azure Virtual WAN logs and metrics using Azure Monitor.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 06/30/2021
ms.author: cherylmc

---

# Monitoring Virtual WAN

You can monitor Azure Virtual WAN using Azure Monitor. Virtual WAN is a networking service that brings together many networking, security, and routing functionalities to provide a single operational interface. Virtual WAN VPN gateways, ExpressRoute gateways, and Azure Firewall have logging and metrics available through Azure Monitor. 

This article discusses metrics and diagnostics that are available through the portal. Metrics are lightweight and can support near real-time scenarios, making them useful for alerting and fast issue detection.

### Monitoring Secured Hub (Azure Firewall) 

If you have chosen to secure your Virtual Hub using Azure Firewall, relevant logs and metrics are available here: [Azure Firewall logs and metrics](../firewall/logs-and-metrics.md).
You can monitor the Secured Hub using Azure Firewall logs and metrics. You can also use activity logs to audit operations on Azure Firewall resources.
For every Azure Virtual WAN you secure and convert to a Secured Hub, an explicit firewall resource object is created in the resource group where the hub is located. 

:::image type="content" source="./media/monitor-virtual-wan/firewall-resources-portal.png" alt-text="Screenshot shows a Firewall resource in the vWAN hub resource group.":::

Diagnostics and logging configuration must be done from there accessing the **Diagnostic Setting** tab:

:::image type="content" source="./media/monitor-virtual-wan/firewall-diagnostic-settings.png" alt-text="Screenshot shows Firewall diagnostic settings.":::


## Metrics

Metrics in Azure Monitor are numerical values that describe some aspect of a system at a particular time. Metrics are collected every minute, and are useful for alerting because they can be sampled frequently. An alert can be fired quickly with relatively simple logic.

### Virtual Hub Router  

The following metric is available for Virtual Hub Router within a Virtual Hub:

#### Virtual Hub Router Metric

| Metric | Description|
| --- | --- |
| **Virtual Hub Data Processed** | Data in bytes/second on how much traffic traverses the Virtual Hub Router in a given time period. Please note only the following flows use the Virtual Hub Router - VNET to VNET same hub and inter hub Branch to VNET interhub via VPN or Express Route Gateways.|

##### PowerShell Commands

To query via PowerShell, use the following commands:

**Step 1:**
```azurepowershell-interactive
$MetricInformation = Get-AzMetric -ResourceId "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/VirtualHubs/<VirtualHubName>" -MetricName "VirtualHubDataProcessed" -TimeGrain 00:05:00 -StartTime 2022-2-20T01:00:00Z -EndTime 2022-2-20T01:30:00Z -AggregationType Average
```

**Step 2:**
```azurepowershell-interactive
$MetricInformation.Data
```

**Resource ID** - Your Virtual Hub's Resource ID can be found on the Azure portal. Navigate to the Virtual Hub page within vWAN and select JSON View under Essentials.  

**Metric Name** - Refers to the name of the metric you are querying, which in this case is called 'VirtualHubDataProcessed'. This metric shows all the data that the Virtual Hub Router has processed in the selected time period of the hub.  

**Time Grain** - Refers to the frequency at which you want to see the aggregation. In the current command, you will see a selected aggregated unit per 5 mins. You can select – 5M/15M/30M/1H/6H/12H and 1D.

**Start Time and End Time** - This time is based on UTC, so please ensure that you are entering UTC values when inputting these parameters. If these parameters are not used, by default the past one hour's worth of data is shown.  

**Aggregation Types** - Average/Minimum/Maximum/Total
* Average - Total average of bytes/sec per the selected time period 
* Minimum – Minimum bytes that were sent during the selected time grain period. 
* Maximum – Maximum bytes that were sent during the selected time grain period 
* Total – Total bytes/sec that were sent during the selected time grain period. 
 
### Site-to-site VPN gateways

The following metrics are available for Azure site-to-site VPN gateways:

#### Tunnel Packet Drop Metrics
| Metric | Description|
| --- | --- |
| **Tunnel Egress Packet Drop Count** | Count of Outgoing packets dropped by tunnel.|
| **Tunnel Ingress Packet Drop Count** | Count of Incoming packets dropped by tunnel.|
| **Tunnel NAT Packet Drops** | Number of NATed packets dropped on a tunnel by drop type and NAT rule.|
| **Tunnel Egress TS Mismatch Packet Drop** | Outgoing packet drop count from traffic selector mismatch of a tunnel.|
| **Tunnel Ingress TS Mismatch Packet Drop** | Incoming packet drop count from traffic selector mismatch of a tunnel.|

#### IPSEC Metrics
| Metric | Description|
| --- | --- |
| **Tunnel MMSA Count** | Number of MMSAs getting created or deleted.|
| **Tunnel QMSA Count** | Number of  IPSEC QMSAs getting created or deleted.|

#### Routing Metrics
| Metric | Description|
| --- | --- |
| **BGP Peer Status** | BGP connectivity status per peer and per instance.|
| **BGP Routes Advertised** | Number of routes advertised per peer and per instance.|
| **BGP Routes Learned** | Number of routes learned per peer and per instance.|
| **VNET Address Prefix Count** | Number of VNET address prefixes that are used/advertised by the gateway.|

You can review per peer and instance metrics by selecting **Apply splitting** and choosing the preferred value. 

#### Traffic Flow Metrics
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

### Point-to-site VPN gateways

The following metrics are available for Azure point-to-site VPN gateways:

| Metric | Description|
| --- | --- |
| **Gateway P2S Bandwidth** | Average point-to-site aggregate bandwidth of a gateway in bytes per second. |
| **P2S Connection Count** |Point-to-site connection count of a gateway. Point-to-site connection count of a gateway. To ensure you are viewing accurate Metrics in Azure Monitor, select the **Aggregation Type** for **P2S Connection Count** as **Sum**. You may also select **Max** if you also Split By **Instance**. |
| **User VPN Routes Count** | Number of User VPN Routes configured on the VPN Gateway. This metric can be broken down into **Static** and **Dynamic** Routes.

### Azure ExpressRoute gateways

The following metrics are available for Azure ExpressRoute gateways:

| Metric | Description|
| --- | --- |
| **BitsInPerSecond** |  Bits per second ingressing Azure through the ExpressRoute Gateway. |
| **BitsOutPerSecond** | Bits per second egressing Azure through the ExpressRoute Gateway  |
| **CPU Utilization** | CPU Utilization of the ExpressRoute Gateway.|
| **Packets per second** | Total Packets received on ExpressRoute Gateway per second.|
| **Count of routes advertised to peer**| Count of Routes Advertised to Peer by ExpressRoute Gateway. | 
| **Count of routes learned from peer**| Count of Routes Learned from Peer by ExpressRoute Gateway.|
| **Frequency of routes changed** | Frequency of Route changes in ExpressRoute Gateway.|
| **Number of VMs in Virtual Network**| Number of VM's that use this ExpressRoute Gateway.|

### <a name="metrics-steps"></a>View gateway metrics

The following steps help you locate and view metrics:

1. In the portal, navigate to the virtual hub that has the gateway.

2. Select **VPN (Site to site)** to locate a site-to-site gateway, **ExpressRoute** to locate an ExpressRoute gateway, or **User VPN (Point to site)** to locate a point-to-site gateway.

3. Select **Metrics**.

   :::image type="content" source="./media/monitor-virtual-wan/view-metrics.png" alt-text="Screenshot shows a site to site VPN pane with View in Azure Monitor selected.":::

4. On the **Metrics** page, you can view the metrics that you are interested in.

   :::image type="content" source="./media/monitor-virtual-wan/metrics-page.png" alt-text="Screenshot that shows the 'Metrics' page with the categories highlighted.":::

## <a name="diagnostic"></a>Diagnostic logs

### Site-to-site VPN gateways

The following diagnostics are available for Azure site-to-site VPN gateways:

| Metric | Description|
| --- | --- |
| **Gateway Diagnostic Logs** | Gateway-specific diagnostics such as health, configuration, service updates, and additional diagnostics.|
| **Tunnel Diagnostic Logs** | These are IPsec tunnel-related logs such as connect and disconnect events for a site-to-site IPsec tunnel, negotiated SAs, disconnect reasons, and additional diagnostics.|
| **Route Diagnostic Logs** | These are logs related to events for static routes, BGP, route updates, and additional diagnostics. |
| **IKE Diagnostic Logs** | IKE-specific diagnostics for IPsec connections. |

### Point-to-site VPN gateways

The following diagnostics are available for Azure point-to-site VPN gateways:

| Metric | Description|
| --- | --- |
| **Gateway Diagnostic Logs** | Gateway-specific diagnostics such as health, configuration, service updates, and other diagnostics. |
| **IKE Diagnostic Logs** | IKE-specific diagnostics for IPsec connections.|
| **P2S Diagnostic Logs** | These are User VPN (Point-to-site) P2S configuration and client events. They include client connect/disconnect, VPN client address allocation, and other diagnostics.|

### Express Route gateways

Diagnostic logs for Express Route gateways in Azure Virtual WAN are not supported.

### <a name="diagnostic-steps"></a>View diagnostic logs configuration

The following steps help you create, edit, and view diagnostic settings:

1. In the portal, navigate to your Virtual WAN resource, then select **Hubs** in the **Connectivity** group. 

   :::image type="content" source="./media/monitor-virtual-wan/select-hub.png" alt-text="Screenshot that shows the Hub selection in the vWAN Portal.":::

2. Under the **Connectivity** group on the left select the gateway you want to examine the diagnostics:

   :::image type="content" source="./media/monitor-virtual-wan/select-hub-gateway.png" alt-text="Screenshot that shows the Connectivity section for the hub.":::

3. On the right part of the page, click on **View in Azure Monitor** link right to **Logs**  then select an option. You can choose to send to Log Analytics, stream to an event hub, or to simply archive to a storage account.

   :::image type="content" source="./media/monitor-virtual-wan/view-hub-gateway-logs.png" alt-text="Screenshot for Select View in Azure Monitor for Logs.":::

4. In this page, you can create new diagnostic setting (**+Add diagnostic setting**) or edit existing one (**Edit setting**). You can choose to send the diagnostic logs to Log Analytics (as shown in the example below), stream to an event hub, send to a 3rd-party solution, or to archive to a storage account.

    :::image type="content" source="./media/monitor-virtual-wan/select-gateway-settings.png" alt-text="Screenshot for Select Diagnostic Log settings.":::

### <a name="sample-query"></a>Log Analytics sample query

If you selected to send diagnostic data to a Log Analytics Workspace, then you can use SQL-like queries such as the example below to examine the data. For more information, see [Log Analytics Query Language](/services-hub/health/log_analytics_query_language).

The following example contains a query to obtain site-to-site route diagnostics.

`AzureDiagnostics | where Category == "RouteDiagnosticLog"`

Replace the values below, after the **= =**, as needed based on the tables reported in the previous section of this article.

* "GatewayDiagnosticLog"
* "IKEDiagnosticLog"
* "P2SDiagnosticLog”
* "TunnelDiagnosticLog"
* "RouteDiagnosticLog"

In order to execute the query, you have to open the Log Analytics resource you configured to receive the diagnostic logs, and then select **Logs** under the **General** tab on the left side of the pane:

:::image type="content" source="./media/monitor-virtual-wan/log-analytics-query-samples.png" alt-text="Log Analytics Query Samples.":::

For additional Log Analytics query samples for Azure VPN Gateway, both Site-to-Site and Point-to-Site, you can visit the page [Troubleshoot Azure VPN Gateway using diagnostic logs](../vpn-gateway/troubleshoot-vpn-with-azure-diagnostics.md). 
For Azure Firewall, a [workbook](../firewall/firewall-workbook.md) is provided to make log analysis easier. Using its graphical interface, it will be possible to investigate into the diagnostic data without manually writing any Log Analytics query. 

## <a name="activity-logs"></a>Activity logs

**Activity log** entries are collected by default and can be viewed in the Azure portal. You can use Azure activity logs (formerly known as *operational logs* and *audit logs*) to view all operations submitted to your Azure subscription.

## Next steps

* To learn how to monitor Azure Firewall logs and metrics, see [Tutorial: Monitor Azure Firewall logs](../firewall/firewall-diagnostics.md).
* To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../azure-monitor/essentials/data-platform-metrics.md).
