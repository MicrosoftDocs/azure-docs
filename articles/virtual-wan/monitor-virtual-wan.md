---
title: Monitor Azure Virtual WAN
description: Start here to learn how to monitor availability and performance for Azure Virtual WAN by using Azure Monitor.
ms.date: 09/10/2024
ms.custom: horz-monitor
ms.topic: concept-article
author: cherylmc
ms.author: cherylmc
ms.service: azure-virtual-wan
---

# Monitor Azure Virtual WAN

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Virtual WAN uses Network Insights to provide users and operators with the ability to view the state and status of a Virtual WAN, presented through an autodiscovered topological map. Resource state and status overlays on the map give you a snapshot view of the overall health of the Virtual WAN. You can navigate resources on the map by using one-click access to the resource configuration pages of the Virtual WAN portal. For more information, see [Azure Monitor Network Insights for Virtual WAN](azure-monitor-insights.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Virtual WAN, see [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Virtual WAN, see [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md#metrics).

<a name="metrics-steps"></a>

You can view metrics for Virtual WAN by using the Azure portal. The following steps help you locate and view metrics:

1. Select **Monitor Gateway** and then **Metrics**. You can also select **Metrics** at the bottom to view a dashboard of the most important metrics for site-to-site and point-to-site VPN.

   :::image type="content" source="./media/monitor-virtual-wan-reference/site-to-site-vpn-metrics-dashboard.png" alt-text="Screenshot shows the sie-to-site VPN metrics dashboard." lightbox="./media/monitor-virtual-wan-reference/site-to-site-vpn-metrics-dashboard.png":::

1. On the **Metrics** page, you can view the metrics.

   :::image type="content" source="./media/monitor-virtual-wan-reference/metrics-page.png" alt-text="Screenshot that shows the 'Metrics' page with the categories highlighted." lightbox="./media/monitor-virtual-wan-reference/metrics-page.png":::

1. To see metrics for the virtual hub router, you can select **Metrics** from the virtual hub **Overview** page.

   :::image type="content" source="./media/monitor-virtual-wan-reference/hub-metrics.png" alt-text="Screenshot that shows the virtual hub page with the metrics button." lightbox="./media/monitor-virtual-wan-reference/hub-metrics.png":::

For more information, see [Analyze metrics for an Azure resource](/azure/azure-monitor/essentials/tutorial-metrics).

#### PowerShell steps

You can view metrics for Virtual WAN by using PowerShell. To query, use the following example PowerShell commands.

```azurepowershell-interactive
$MetricInformation = Get-AzMetric -ResourceId "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/VirtualHubs/<VirtualHubName>" -MetricName "VirtualHubDataProcessed" -TimeGrain 00:05:00 -StartTime 2022-2-20T01:00:00Z -EndTime 2022-2-20T01:30:00Z -AggregationType Sum

$MetricInformation.Data
```

- **Resource ID**. Your virtual hub's Resource ID can be found on the Azure portal. Navigate to the virtual hub page within vWAN and select **JSON View** under Essentials.  
- **Metric Name**. Refers to the name of the metric you're querying, which in this case is called `VirtualHubDataProcessed`. This metric shows all the data that the virtual hub router processed in the selected time period of the hub.  
- **Time Grain**. Refers to the frequency at which you want to see the aggregation. In the current command, you see a selected aggregated unit per 5 mins. You can select – 5M/15M/30M/1H/6H/12H and 1D.
- **Start Time and End Time**. This time is based on UTC. Ensure that you're entering UTC values when inputting these parameters. If these parameters aren't used, the past one hour's worth of data is shown by default.  
- **Sum Aggregation Type**. The **sum** aggregation type shows you the total number of bytes that traversed the virtual hub router during a selected time period. For example, if you set the Time granularity to 5 minutes, each data point corresponds to the number of bytes sent in that five-minute interval. To convert this value to Gbps, you can divide this number by 37500000000. Based on the virtual hub's [capacity](hub-settings.md#capacity), the hub router can support between 3 Gbps and 50 Gbps. The **Max** and **Min** aggregation types aren't meaningful at this time. 

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Virtual WAN, see [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md#resource-logs).

### <a name="schemas"></a>Schemas

For detailed description of the top-level diagnostic logs schema, see [Supported services, schemas, and categories for Azure Diagnostic Logs](/azure/azure-monitor/essentials/resource-logs-schema).

When you review any metrics through Log Analytics, the output contains the following columns:

|**Column**|**Type**|**Description**|
| --- | --- | --- |
|TimeGrain|string|PT1M (metric values are pushed every minute)|
|Count|real|Usually equal to 2 (each MSEE pushes a single metric value every minute)|
|Minimum|real|The minimum of the two metric values pushed by the two MSEEs|
|Maximum|real|The maximum of the two metric values pushed by the two MSEEs|
|Average|real|Equal to (Minimum + Maximum)/2|
|Total|real|Sum of the two metric values from both MSEEs (the main value to focus on for the metric queried)|

### <a name="create-diagnostic"></a>Create diagnostic setting to view logs

The following steps help you create, edit, and view diagnostic settings:

1. In the portal, navigate to your Virtual WAN resource, then select **Hubs** in the **Connectivity** group.

   :::image type="content" source="./media/monitor-virtual-wan-reference/select-hub.png" alt-text="Screenshot that shows the Hub selection in the vWAN Portal." lightbox="./media/monitor-virtual-wan-reference/select-hub.png":::

1. Under the **Connectivity** group on the left, select the gateway for which you want to examine diagnostics:

   :::image type="content" source="./media/monitor-virtual-wan-reference/select-hub-gateway.png" alt-text="Screenshot that shows the Connectivity section for the hub." lightbox="./media/monitor-virtual-wan-reference/select-hub-gateway.png":::

1. On the right part of the page, select **Monitor Gateway** and then **Logs**.

   :::image type="content" source="./media/monitor-virtual-wan-reference/view-hub-gateway-logs.png" alt-text="Screenshot for Select View in Azure Monitor for Logs." lightbox="./media/monitor-virtual-wan-reference/view-hub-gateway-logs.png":::

1. In this page, you can create a new diagnostic setting (**+Add diagnostic setting**) or edit an existing one (**Edit setting**). You can choose to send the diagnostic logs to Log Analytics (as shown in the following example), stream to an event hub, send to a 3rd-party solution, or archive to a storage account.

   :::image type="content" source="./media/monitor-virtual-wan-reference/select-gateway-settings.png" alt-text="Screenshot for Select Diagnostic Log settings." lightbox="./media/monitor-virtual-wan-reference/select-gateway-settings.png":::

1. After clicking **Save**, you should start seeing logs appear in this log analytics workspace within a few hours. 
1. To monitor a **secured hub (with Azure Firewall)**, then diagnostics and logging configuration must be done from accessing the **Diagnostic Setting** tab:

   :::image type="content" source="./media/monitor-virtual-wan-reference/firewall-diagnostic-settings.png" alt-text="Screenshot shows Firewall diagnostic settings." lightbox="./media/monitor-virtual-wan-reference/firewall-diagnostic-settings.png" :::

> [!IMPORTANT]
> Enabling these settings requires additional Azure services (storage account, event hub, or Log Analytics), which may increase your cost. To calculate an estimated cost, visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

## <a name="azure-firewall"></a>Monitoring secured hub (Azure Firewall)

If you chose to secure your virtual hub using Azure Firewall, relevant logs and metrics are available here: [Azure Firewall logs and metrics](../firewall/logs-and-metrics.md).

You can monitor the Secured Hub using Azure Firewall logs and metrics. You can also use activity logs to audit operations on Azure Firewall resources. For every Azure Virtual WAN you secure and convert to a Secured Hub, Azure Firewall creates an explicit firewall resource object. The object is in the resource group where the hub is located.

:::image type="content" source="./media/monitor-virtual-wan-reference/firewall-resources-portal.png" alt-text="Screenshot shows a Firewall resource in the vWAN hub resource group." lightbox="./media/monitor-virtual-wan-reference/firewall-resources-portal.png":::

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Virtual WAN alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md).

## Monitoring Azure Virtual WAN - Best practices

This article provides configuration best practices for monitoring Virtual WAN and the different components that can be deployed with it. The recommendations presented in this article are mostly based on existing Azure Monitor metrics and logs generated by Azure Virtual WAN. For a list of metrics and logs collected for Virtual WAN, see the [Monitoring Virtual WAN data reference](monitor-virtual-wan-reference.md).

Most of the recommendations in this article suggest creating Azure Monitor alerts. Azure Monitor alerts proactively notify you when there's an important event in the monitoring data. This information helps you address the root cause quicker and ultimately reduce downtime. To learn how to create a metric alert, see [Tutorial: Create a metric alert for an Azure resource](/azure/azure-monitor/alerts/tutorial-metric-alert). To learn how to create a log query alert, see [Tutorial: Create a log query alert for an Azure resource](/azure/azure-monitor/alerts/tutorial-log-alert).

### Virtual WAN gateways

This section describes best practices for Virtual WAN gateways.

#### Site-to-site VPN gateway

**Design checklist – metric alerts**

- Create alert rule for increase in Tunnel Egress and/or Ingress packet count drop.
- Create alert rule to monitor BGP peer status.
- Create alert rule to monitor number of BGP routes advertised and learned.
- Create alert rule for VPN gateway overutilization.
- Create alert rule for tunnel overutilization.

| Recommendation | Description |
|:---|:---|
|Create alert rule for increase in Tunnel Egress and/or Ingress packet drop count.| An increase in tunnel egress and/or ingress packet drop count might indicate an issue with the Azure VPN gateway, or with the remote VPN device. Select the **Tunnel Egress/Ingress Packet drop count** metric when creating alert rules. Define a **static Threshold value** greater than **0** and the **Total** aggregation type when configuring the alert logic.<br><br>You can choose to monitor the **Connection** as a whole, or split the alert rule by **Instance** and **Remote IP** to be alerted for issues involving individual tunnels. To learn the difference between the concept of **VPN connection**, **link**, and **tunnel** in Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).|
|Create alert rule to monitor BGP peer status.|When using BGP in your site-to-site connections, it's important to monitor the health of the BGP peerings between the gateway instances and the remote devices, as recurrent failures can disrupt connectivity.<br><br>Select the **BGP Peer Status** metric when creating the alert rule. Using a **static** threshold, choose the **Average** aggregation type and configure the alert to be triggered whenever the value is **less than 1**.<br><br>We recommend that you split the alert by **Instance** and **BGP Peer Address** to detect issues with individual peerings. Avoid selecting the gateway instance IPs as **BGP Peer Address** because this metric monitors the BGP status for every possible combination, including with the instance itself (which is always 0).|
|Create alert rule to monitor number of BGP routes advertised and learned.|**BGP Routes Advertised** and **BGP Routes Learned** monitor the number of routes advertised to and learned from peers by the VPN gateway, respectively. If these metrics drop to zero unexpectedly, it could be because there’s an issue with the gateway or with on-premises.<br><br>We recommend that you configure an alert for both these metrics to be triggered whenever their value is **zero**. Choose the **Total** aggregation type. Split by **Instance** to monitor individual gateway instances.|
|Create alert rule for VPN gateway overutilization.|The number of scale units per instance determines a VPN gateway’s aggregate throughput. All tunnels that terminate in the same gateway instance share its aggregate throughput. It's likely that tunnel stability will be affected if an instance is working at its capacity for a long period of time.<br><br>Select **Gateway S2S Bandwidth** when creating the alert rule. Configure the alert to be triggered whenever the **Average** throughput is **greater than** a value that is close to the maximum aggregate throughput of **both instances**. Alternatively, split the alert **by instance** and use the maximum throughput **per instance** as a reference.<br><br>It's good practice to determine the throughput needs per tunnel in advance in order to choose the appropriate number of scale units. To learn more about the supported scale unit values for site-to-site VPN gateways, see the [Virtual WAN FAQ](virtual-wan-faq.md).
|Create alert rule for tunnel overutilization.|The scale units of the gateway instance where it terminates determines the maximum throughput allowed per tunnel.<br><br>You might want to be alerted if a tunnel is at risk of nearing its maximum throughput, which can lead to performance and connectivity issues. Act proactively by investigating the root cause of the increased tunnel utilization or by increasing the gateway’s scale units.<br><br>Select **Tunnel Bandwidth** when creating the alert rule. Split by **Instance** and **Remote IP** to monitor all individual tunnels or choose specific tunnels instead. Configure the alert to be triggered whenever the **Average** throughput is **greater than** a value that is close to the maximum throughput allowed per tunnel.<br><br>To learn more about how the gateway’s scale units impact a tunnel’s maximum throughput, see the [Virtual WAN FAQ](virtual-wan-faq.md).|

**Design checklist - log query alerts**

To configure log-based alerts, you must first create a diagnostic setting for your site-to-site/point-to-site VPN gateway. A diagnostic setting is where you define what logs and/or metrics you want to collect and how you want to store that data to be analyzed later. Unlike gateway metrics, gateway logs aren't available if there's no diagnostic setting configured. To learn how to create a diagnostic setting, see [Create diagnostic setting to view logs](#create-diagnostic).

- Create tunnel disconnect alert rule.
- Create BGP disconnect alert rule.

| Recommendation | Description |
|:---|:---|
|Create tunnel disconnect alert rule.|**Use Tunnel Diagnostic Logs** to track disconnect events in your site-to-site connections. A disconnect event can be due to a failure to negotiate SAs, unresponsiveness of the remote VPN device, among other causes. Tunnel Diagnostic Logs also provide the disconnect reason. See the **Create tunnel disconnect alert rule - log query** below this table to select disconnect events when creating the alert rule.<br><br>Configure the alert to be triggered whenever the number of rows resulting from running the query is **greater than 0**. For this alert to be effective, select **Aggregation Granularity** to be between 1 and 5 minutes and the **Frequency of evaluation** to also be between 1 and 5 minutes. This way, after the **Aggregation Granularity** interval passes, the number of rows is 0 again for a new interval.<br><br>For troubleshooting tips when analyzing Tunnel Diagnostic Logs, see [Troubleshoot Azure VPN gateway](../vpn-gateway/troubleshoot-vpn-with-azure-diagnostics.md#TunnelDiagnosticLog) using diagnostic logs. Additionally, use **IKE Diagnostic Logs** to complement your troubleshooting, as these logs contain detailed IKE-specific diagnostics.|
|Create BGP disconnect alert rule. |Use **Route Diagnostic Logs** to track route updates and issues with BGP sessions. Repeated BGP disconnect events can affect connectivity and cause downtime. See the **Create BGP disconnect rule alert- log query** below this table to select disconnect events when creating the alert rule.<br><br>Configure the alert to be triggered whenever the number of rows resulting from running the query is **greater than 0**. For this alert to be effective, select **Aggregation Granularity** to be between 1 and 5 minutes and the **Frequency of evaluation** to also be between 1 and 5 minutes. This way, after the **Aggregation Granularity** interval has passes, the number of rows is 0 again for a new interval if the BGP sessions are restored.<br><br>For more information about the data collected by Route Diagnostic Logs, see [Troubleshooting Azure VPN Gateway using diagnostic logs](../vpn-gateway/troubleshoot-vpn-with-azure-diagnostics.md#RouteDiagnosticLog). |

**Log queries**

- **Create tunnel disconnect alert rule - log query**: The following log query can be used to select tunnel disconnect events when creating the alert rule:

   ```text
   AzureDiagnostics
   | where Category == "TunnelDiagnosticLog" 
   | where OperationName == "TunnelDisconnected"
   ```

- **Create BGP disconnect rule alert- log query**: The following log query can be used to select BGP disconnect events when creating the alert rule:

   ```text
   AzureDiagnostics 
   | where Category == "RouteDiagnosticLog" 
   | where OperationName == "BgpDisconnectedEvent"
   ```

#### Point-to-site VPN gateway

The following section details the configuration of metric-based alerts only. However, Virtual WAN point-to-site gateways also support diagnostic logs. To learn more about the available diagnostic logs for point-to-site gateways, see [Virtual WAN point-to-site VPN gateway diagnostics](monitor-virtual-wan-reference.md#p2s-diagnostic).

**Design checklist - metric alerts**

- Create alert rule for gateway overutilization.
- Create alert for P2S connection count nearing limit.
- Create alert for User VPN route count nearing limit.

| Recommendation | Description |
|:---|:---|
|Create alert rule for gateway overutilization.|The number of scale units configured determines the bandwidth of a point-to-site gateway. To learn more about point-to-site gateway scale units, see Point-to-site (User VPN).<br><br>**Use the Gateway P2S Bandwidth** metric to monitor the gateway’s utilization and configure an alert rule that is triggered whenever the gateway’s bandwidth is **greater than** a value near its aggregate throughput – for example, if the gateway was configured with 2 scale units, it has an aggregate throughput of 1 Gbps. In this case, you could define a threshold value of 950 Mbps.<br><br>Use this alert to proactively investigate the root cause of the increased utilization, and ultimately increase the number of scale units, if needed. Select the **Average** aggregation type when configuring the alert rule.|
|Create alert for P2S connection count nearing limit |The maximum number of point-to-site connections allowed is also determined by the number of scale units configured on the gateway. To learn more about point-to-site gateway scale units, see the FAQ for [Point-to-site (User VPN)](virtual-wan-faq.md#p2s-concurrent).<br><br>Use the **P2S Connection Count** metric to monitor the number of connections. Select this metric to configure an alert rule that is triggered whenever the number of connections is nearing the maximum allowed. For example, a 1-scale unit gateway supports up to 500 concurrent connections. In this case, you could configure the alert to be triggered whenever the number of connections is **greater than** 450.<br><br>Use this alert to determine whether an increase in the number of scale units is required or not. Choose the **Total** aggregation type when configuring the alert rule.|
|Create alert rule for User VPN routes count nearing limit.|The protocol used determines the maximum number of User VPN routes. IKEv2 has a protocol-level limit of 255 routes, whereas OpenVPN has a limit of 1,000 routes. To learn more about this fact, see [VPN server configuration concepts](point-to-site-concepts.md#vpn-server-configuration-concepts).<br><br>You might want to be alerted if you’re close to hitting the maximum number of User VPN routes and act proactively to avoid any downtime. Use the **User VPN Route Count** to monitor this situation and configure an alert rule that is triggered whenever the number of routes surpasses a value close to the limit. For example, if the limit is 255 routes, an appropriate **Threshold** value could be 230. Choose the **Total** aggregation type when configuring the alert rule.|

#### ExpressRoute gateway

The following section focuses on metric-based alerts. In addition to the alerts described here, which focus on the gateway component, we recommend that you use the available metrics, logs, and tools to monitor the ExpressRoute circuit. To learn more about ExpressRoute monitoring, see [ExpressRoute monitoring, metrics, and alerts](../expressroute/expressroute-monitoring-metrics-alerts.md). To learn about how you can use the ExpressRoute Traffic Collector tool, see [Configure ExpressRoute Traffic Collector for ExpressRoute Direct](../expressroute/how-to-configure-traffic-collector.md).

**Design checklist - metric alerts**

- Create alert rule for bits received per second.
- Create alert rule for CPU overutilization.
- Create alert rule for packets per second.
- Create alert rule for number of routes advertised to peer.
- Count alert rule for number of routes learned from peer.
- Create alert rule for high frequency in route changes.

| Recommendation | Description |
|:---|:---|
|Create alert rule for Bits Received Per Second.|**Bits Received per Second** monitors the total amount of traffic received by the gateway from the MSEEs.<br><br>You might want to be alerted if the amount of traffic received by the gateway is at risk of hitting its maximum throughput. This situation can lead to performance and connectivity issues. This approach allows you to act proactively by investigating the root cause of the increased gateway utilization or increasing the gateway’s maximum allowed throughput.<br><br>Choose the **Average** aggregation type and a **Threshold** value close to the maximum throughput provisioned for the gateway when configuring the alert rule.<br><br>Additionally, we recommend that you set an alert when the number of **Bits Received per Second** is near zero, as it might indicate an issue with the gateway or the MSEEs.<br><br>The number of scale units provisioned determines the maximum throughput of an ExpressRoute gateway. To learn more about ExpressRoute gateway performance, see [About ExpressRoute connections in Azure Virtual WAN](virtual-wan-expressroute-about.md).|
|Create alert rule for CPU overutilization.|When using ExpressRoute gateways, it's important to monitor the CPU utilization. Prolonged high utilization can affect performance and connectivity.<br><br>Use the **CPU utilization** metric to monitor utilization and create an alert for whenever the CPU utilization is **greater than** 80%, so you can investigate the root cause and ultimately increase the number of scale units, if needed. Choose the **Average** aggregation type when configuring the alert rule.<br><br>To learn more about ExpressRoute gateway performance, see [About ExpressRoute connections in Azure Virtual WAN](virtual-wan-expressroute-about.md).|
|Create alert rule for packets received per second.|**Packets per second** monitors the number of inbound packets traversing the Virtual WAN ExpressRoute gateway.<br><br>You might want to be alerted if the number of **packets per second** is nearing the limit allowed for the number of scale units configured on the gateway.<br><br>Choose the Average aggregation type when configuring the alert rule. Choose a **Threshold** value close to the maximum number of **packets per second** allowed based on the number of scale units of the gateway. To learn more about ExpressRoute performance, see [About ExpressRoute connections in Azure Virtual WAN](virtual-wan-expressroute-about.md).<br><br>Additionally, we recommend that you set an alert when the number of **Packets per second** is near zero, as it might indicate an issue with the gateway or MSEEs.|
|Create alert rule for number of routes advertised to peer. |**Count of Routes Advertised to Peers** monitors the number of routes advertised from the ExpressRoute gateway to the virtual hub router and to the Microsoft Enterprise Edge Devices.<br><br>We recommend that you **add a filter** to **only** select the two BGP peers displayed as **ExpressRoute Device** and create an alert to identify when the count of advertised routes approaches the documented limit of **1000**. For example, configure the alert to be triggered when the number of routes advertised is **greater than 950**.<br><br>We also recommend that you configure an alert when the number of routes advertised to the Microsoft Edge Devices is **zero** in order to proactively detect any connectivity issues.<br><br>To add these alerts, select the **Count of Routes Advertised to Peers** metric, and then select the **Add filter** option and the **ExpressRoute** devices.|
|Create alert rule for number of routes learned from peer.|**Count of Routes Learned from Peers** monitors the number of routes the ExpressRoute gateway learns from the virtual hub router and from the Microsoft Enterprise Edge Device.<br><br>We recommend that you add a filter to **only** select the two BGP peers displayed as **ExpressRoute Device** and create an alert to identify when the count of learned routes approaches the [documented limit](../expressroute/expressroute-faqs.md#are-there-limits-on-the-number-of-routes-i-can-advertise) of 4000 for Standard SKU and 10,000 for Premium SKU circuits.<br><br>We also recommend that you configure an alert when the number of routes advertised to the Microsoft Edge Devices is **zero**. This approach can help in detecting when your on-premises stops advertising routes.  
|Create alert rule for high frequency in route changes.|**Frequency of Routes changes** shows the change frequency of routes being learned and advertised from and to peers, including other types of branches such as site-to-site and point-to-site VPN. This metric provides visibility when a new branch or more circuits are being connected/disconnected.<br><br>This metric is a useful tool when identifying issues with BGP advertisements, such as flaplings. We recommend that you to set an alert **if** the environment is **static** and BGP changes aren't expected. Select a **threshold value** that is **greater than 1** and an **Aggregation Granularity** of 15 minutes to monitor BGP behavior consistently.<br><br>If the environment is dynamic and BGP changes are frequently expected, you might choose not to set an alert otherwise in order to avoid false positives. However, you can still consider this metric for observability of your network.|

### Virtual hub

The following section focuses on metrics-based alerts for virtual hubs. 

**Design checklist - metric alerts**

- Create alert rule for BGP peer status

| Recommendation | Description |
|:---|:---|
|Create alert rule to monitor BGP peer status.| Select the **BGP Peer Status** metric when creating the alert rule. Using a **static** threshold, choose the **Average** aggregation type and configure the alert to be triggered whenever the value is **less than 1**.<br><br> This approach allows you to identify when the virtual hub router is having connectivity issues with ExpressRoute, Site-to-Site VPN, and Point-to-Site VPN gateways deployed in the hub.|

### Azure Firewall

This section of the article focuses on metric-based alerts. Azure Firewall offers a comprehensive list of [metrics and logs](../firewall/firewall-diagnostics.md) for monitoring purposes. In addition to configuring the alerts described in the following section, explore how [Azure Firewall Workbook](../firewall/firewall-workbook.md) can help monitor your Azure Firewall. Also, explore the benefits of connecting Azure Firewall logs to Microsoft Sentinel using [Azure Firewall connector for Microsoft Sentinel](../sentinel/data-connectors/azure-firewall.md).

**Design checklist - metric alerts**

- Create alert rule for risk of SNAT port exhaustion.
- Create alert rule for firewall overutilization.

| Recommendation | Description |
|:---|:---|
|Create alert rule for risk of SNAT port exhaustion.|Azure Firewall provides 2,496 SNAT ports per public IP address configured per backend virtual machine scale instance. It’s important to estimate in advance the number of SNAT ports that can fulfill your organizational requirements for outbound traffic to the Internet. Not doing so increases the risk of exhausting the number of available SNAT ports on the Azure Firewall, potentially causing outbound connectivity failures.<br><br>Use the **SNAT port utilization** metric to monitor the percentage of outbound SNAT ports currently in use. Create an alert rule for this metric to be triggered whenever this percentage surpasses **95%** (due to an unforeseen traffic increase, for example) so you can act accordingly by configuring another public IP address on the Azure Firewall, or by using an [Azure NAT Gateway](../nat-gateway/nat-overview.md) instead. Use the **Maximum** aggregation type when configuring the alert rule.<br><br>To learn more about how to interpret the **SNAT port utilization** metric, see [Overview of Azure Firewall logs and metrics](../firewall/logs-and-metrics.md#metrics). To learn more about how to scale SNAT ports in Azure Firewall, see [Scale SNAT ports with Azure NAT Gateway](../firewall/integrate-with-nat-gateway.md).|
|Create alert rule for firewall overutilization.|Azure Firewall maximum throughput differs depending on the SKU and features enabled. To learn more about Azure Firewall performance, see [Azure Firewall performance](../firewall/firewall-performance.md).<br><br>You might want to be alerted if your firewall is nearing its maximum throughput. You can troubleshoot the underlying cause, because this situation can affect the firewall’s performance.<br><br> Create an alert rule to be triggered whenever the **Throughput** metric surpasses a value nearing the firewall’s maximum throughput – if the maximum throughput is 30 Gbps, configure 25 Gbps as the **Threshold** value, for example. The **Throughput** metric unit is **bits/sec**. Choose the **Average** aggregation type when creating the alert rule.

### Resource Health Alerts

You can also configure [Resource Health Alerts](/azure/service-health/resource-health-alert-monitor-guide) via Service Health for the below resources. This approach ensures you're informed of the availability of your Virtual WAN environment. The alerts allow you to troubleshoot whether networking issues are due to your Azure resources entering an unhealthy state, as opposed to issues from your on-premises environment. We recommend that you configure alerts when the resource status becomes degraded or unavailable. If the resource status does become degraded/unavailable, you can analyze if there are any recent spikes in the amount of traffic processed by these resources, the routes advertised to these resources, or the number of branch/VNet connections created. For more information about limits supported in Virtual WAN, see [Azure Virtual WAN limits](../azure-resource-manager/management/azure-subscription-service-limits.md#virtual-wan-limits).

- Microsoft.Network/vpnGateways
- Microsoft.Network/expressRouteGateways
- Microsoft.Network/azureFirewalls
- Microsoft.Network/virtualHubs
- Microsoft.Network/p2sVpnGateways

## Related content

- See [Azure Virtual WAN monitoring data reference](monitor-virtual-wan-reference.md) for a reference of the metrics, logs, and other important values created for Virtual WAN.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
