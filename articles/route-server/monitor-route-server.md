---
title: Monitor Azure Route Server with Azure Monitor
description: Learn how to monitor Azure Route Server performance and health using Azure Monitor metrics, including Border Gateway Protocol (BGP) peer status and route counts.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: how-to
ms.date: 09/17/2025
ms.custom: sfi-image-nochange

#CustomerIntent: As an Azure administrator, I want to monitor Azure Route Server metrics and BGP peer status to ensure optimal performance and troubleshoot connectivity issues.
---

# Monitor Azure Route Server with Azure Monitor

Azure Route Server provides comprehensive monitoring capabilities through Azure Monitor, enabling you to track performance, monitor BGP peer connectivity, and analyze route propagation. This article shows you how to access and interpret Route Server metrics to maintain optimal network performance.

Azure Monitor provides centralized monitoring for all Azure services, including real-time metrics, alerting capabilities, and diagnostic insights for your Route Server deployment.

> [!NOTE]
> Classic metrics are deprecated and not recommended for Route Server monitoring. Use Azure Monitor metrics for the best experience.

## Prerequisites

Before you begin monitoring your Route Server, ensure you have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing Azure Route Server deployment. If you need to create a Route Server, see [Create and configure Azure Route Server](quickstart-configure-route-server-portal.md).
- Appropriate permissions to view metrics in the Azure portal (Monitoring Reader role or higher).

## Access Route Server metrics

To view Azure Route Server metrics in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Route Server resource.

1. In the left navigation pane, under **Monitoring**, select **Metrics**.

1. In the metrics explorer, select a metric from the **Metric** dropdown list. The default aggregation automatically applies based on the metric type.

   :::image type="content" source="./media/monitor-route-server/route-server-metrics.png" alt-text="Screenshot showing Route Server metrics in the Azure portal." lightbox="./media/monitor-route-server/route-server-metrics-expand.png":::

> [!IMPORTANT]
> For optimal results when viewing Route Server metrics, select a time granularity of **5 minutes or greater** in the time picker.
>
> :::image type="content" source="./media/monitor-route-server/route-server-metrics-granularity.png" alt-text="Screenshot showing time granularity options for Route Server metrics.":::

## Understanding aggregation types

Azure Monitor metrics explorer supports multiple aggregation types for data analysis. Each Route Server metric uses a recommended aggregation type for accurate insights:

- **Sum**: The total of all values captured during the aggregation interval
- **Count**: The number of measurements captured during the aggregation interval
- **Average**: The mean of all metric values captured during the aggregation interval
- **Minimum**: The smallest value captured during the aggregation interval
- **Maximum**: The largest value captured during the aggregation interval

For more information about aggregation types, see [Aggregation in Azure Monitor metrics charts](/azure/azure-monitor/essentials/metrics-charts#aggregation).

## Available metrics

The following table describes the metrics available for Azure Route Server monitoring:

| Metric | Category | Unit | Aggregation Type | Description | Dimensions | Exportable via Diagnostic Settings? |
| --- | --- | --- | --- | --- | --- | --- |
| [BGP Peer Status](#bgp) | Scalability | Count | Maximum | BGP availability from Route Server to Peer | BGP Peer IP, BGP Peer Type, Route Server Instance | Yes |
| [Count of Routes Advertised to Peer](#advertised) | Scalability | Count | Maximum | Count of routes advertised from Route Server to Peer | BGP Peer IP, BGP Peer Type, Route Server Instance | Yes |
| [Count of Routes Learned from Peer](#received) | Scalability | Count | Maximum | Count of routes learned from Peer | BGP Peer IP, BGP Peer Type, Route Server Instance | Yes | 
| Routing Infrastructure Units | Scalability | Count | Maximum | Total number of routing infrastructure units, which represents Route Server's capacity | none | No | 
| Spoke VM Utilization | Scalability | Percent | Maximum | Number of deployed spoke VMs as a percentage of the total number of spoke VMs that Route Server's routing infrastructure units can support | none | No | 

> [!IMPORTANT]
> Azure Monitor includes a metric called **Data Processed by the Virtual Hub Router** that appears in Route Server monitoring. This metric doesn't apply to Route Server and should be ignored when monitoring your deployment.

## Monitor specific metrics

The following sections provide detailed information about each Route Server metric and how to interpret the data.

### <a name = "bgp"></a>BGP peer status

**Recommended aggregation type**: Maximum

The BGP peer status metric indicates the connectivity status between Route Server and your network virtual appliances (NVAs). This binary metric uses the following values:

- **1**: BGP session is established and functioning
- **0**: BGP session is down or unavailable

:::image type="content" source="./media/monitor-route-server/route-server-metrics-bgp.png" alt-text="Screenshot showing BGP peer status metric in Azure Monitor." lightbox="./media/monitor-route-server/route-server-metrics-bgp-expand.png":::

#### Monitor individual BGP peers

To view the BGP status for specific NVA peers:

1. In the metrics chart, select **Apply splitting**.
1. Choose **BgpPeerIp** from the dimension list.
1. The chart displays separate lines for each BGP peer IP address.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-bgp-split-by-peer.png" alt-text="Screenshot showing BGP peer status split by individual peer IP addresses." lightbox="./media/monitor-route-server/route-server-metrics-bgp-split-by-peer-expand.png":::

### <a name = "advertised"></a>Count of routes advertised to peer

**Recommended aggregation type**: Maximum

This metric displays the number of routes that Route Server advertises to your NVA peers. Monitor this metric to understand route propagation and verify that expected routes are being shared with your network appliances.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-routes-advertised.png" alt-text="Screenshot showing count of routes advertised to peers." lightbox="./media/monitor-route-server/route-server-metrics-routes-advertised-expand.png":::

### <a name = "received"></a>Count of routes learned from peer

**Recommended aggregation type**: Maximum

This metric shows the number of routes that Route Server learns from your NVA peers. Use this metric to monitor route learning and ensure your network appliances are properly advertising their routes.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-routes-learned.png" alt-text="Screenshot showing count of routes learned from peers." lightbox="./media/monitor-route-server/route-server-metrics-routes-learned-expand.png":::

#### Monitor routes from specific peers

To view routes learned from individual NVA peers:

1. In the metrics chart, select **Apply splitting**.
1. Choose **BgpPeerIp** from the dimension list.
1. The chart shows route counts for each peer separately.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-routes-learned-split-by-peer.png" alt-text="Screenshot showing count of routes learned split by individual peer IP addresses." lightbox="./media/monitor-route-server/route-server-metrics-routes-learned-split-by-peer-expand.png":::

## Set up monitoring alerts

To proactively monitor your Route Server deployment, consider creating alerts for critical metrics:

1. **BGP peer disconnection**: Alert when BGP peer status equals 0
1. **Route count anomalies**: Alert when route counts deviate significantly from baseline
1. **Peer availability**: Alert when specific critical peers become unavailable

For detailed steps on creating alerts, see [Create metric alerts in Azure Monitor](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

## Troubleshooting with metrics

Use Route Server metrics to diagnose common issues:

- **BGP connectivity problems**: Check BGP peer status and verify network connectivity
- **Missing routes**: Compare advertised vs. learned route counts to identify propagation issues  
- **Performance concerns**: Monitor route counts against service limits
- **Peer-specific issues**: Use dimension splitting to isolate problems with individual NVAs

## Next steps

Now that you understand how to monitor Route Server, explore these related articles:

- [Create and configure Route Server](quickstart-configure-route-server-portal.md)
- [Configure peering between Azure Route Server and an NVA](tutorial-configure-route-server-with-quagga.md)
- [Azure Route Server FAQ](route-server-faq.md)
- [Create metric alerts in Azure Monitor](/azure/azure-monitor/alerts/alerts-create-new-alert-rule)
