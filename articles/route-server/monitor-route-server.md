---
title: Monitor Azure Route Server
description: Learn how to monitor your Azure Route Server using Azure Monitor and understand available metrics.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: how-to
ms.date: 05/02/2024

#CustomerIntent: As an Azure administrator, I want to monitor Azure Route Server so that I'm aware of its metrics like the number of routes advertised and learned.
---

# Monitor Azure Route Server

This article helps you understand Azure Route Server monitoring and metrics using Azure Monitor. Azure Monitor is one stop shop for all metrics, alerting and diagnostic logs across all of Azure.
 
> [!NOTE]
> Using **Classic Metrics** is not recommended.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Route Server. If you need to create a Route Server, see [Create and configure Azure Route Server](quickstart-configure-route-server-portal.md).

## View Route Server metrics

To view Azure Route Server metrics, follow these steps:

1. Go to your Route Server resource in the Azure portal and select **Metrics**.

1. Select a scalability metric. The default aggregation automatically applies.

:::image type="content" source="./media/monitor-route-server/route-server-metrics.png" alt-text="Screenshot that shows Route Server metrics." lightbox="./media/monitor-route-server/route-server-metrics-expand.png":::

> [!IMPORTANT]
> When viewing Route Server metrics in the Azure portal, select a time granularity of **5 minutes or greater** for best possible results.
> 
> :::image type="content" source="./media/monitor-route-server/route-server-metrics-granularity.png" alt-text="Screenshot that shows time granularity options.":::

## Aggregation types

Metrics explorer supports Sum, Count, Average, Minimum, and Maximum as [aggregation types](../azure-monitor/essentials/metrics-charts.md#aggregation). You should use the recommended Aggregation type when reviewing the insights for each Route Server metric.

- Sum: The sum of all values captured during the aggregation interval.
- Count: The number of measurements captured during the aggregation interval.
- Average: The average of the metric values captured during the aggregation interval.
- Minimum: The smallest value captured during the aggregation interval.
- Maximum: The largest value captured during the aggregation interval.

| Metric | Category | Unit | Aggregation Type | Description | Dimensions |  Exportable via Diagnostic Settings? | 
| --- | --- | --- | --- | --- | --- | --- | 
| [BGP Peer Status](#bgp) | Scalability | Count | Maximum | BGP availability from Route Server to Peer | BGP Peer IP, BGP Peer Type, Route Server Instance |  Yes | 
| [Count of Routes Advertised to Peer](#advertised) | Scalability | Count | Maximum | Count of routes advertised from Route Server to Peer | BGP Peer IP, BGP Peer Type, Route Server Instance |  Yes|
| [Count of Routes Learned from Peer](#received) | Scalability | Count | Maximum | Count of routes learned from Peer | BGP Peer IP, BGP Peer Type, Route Server Instance | Yes 

> [!IMPORTANT]
> Azure Monitor exposes another metric for Route Server, **Data Processed by the Virtual Hub Router**. This metric doesn't apply to Route Server and should be ignored.

## Route Server metrics

You can view the following metrics for Azure Route Server:

### <a name = "bgp"></a>BGP Peer status

Aggregation type: **Max**

This metric shows the BGP availability of peer NVA connections. The BGP Peer Status is a binary metric. 1 = BGP is up-and-running. 0 = BGP is unavailable.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-bgp.png" alt-text="Screenshot that shows BGP Peer Status." lightbox="./media/monitor-route-server/route-server-metrics-bgp-expand.png":::

To check the BGP status of a specific NVA peer, select **Apply splitting** and choose **BgpPeerIp**.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-bgp-split-by-peer.png" alt-text="Screenshot that shows BGP Peer status - Split by Peer." lightbox="./media/monitor-route-server/route-server-metrics-bgp-split-by-peer-expand.png":::

### <a name = "advertised"></a>Count of routes advertised to peer

Aggregation type: **Max**

This metric shows the number of routes the Route Server advertised to NVA peers.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-routes-advertised.png" alt-text="Screenshot that shows Count of routes advertised." lightbox="./media/monitor-route-server/route-server-metrics-routes-advertised-expand.png":::

### <a name = "received"></a>Count of routes learned from peer 

Aggregation type: **Max**

This metric shows the number of routes the Route Server learned from NVA peers.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-routes-learned.png" alt-text="Screenshot that shows Count of routes learned." lightbox="./media/monitor-route-server/route-server-metrics-routes-learned-expand.png":::

To show the number of routes the Route Server received from a specific NVA peer, select **Apply splitting** and choose **BgpPeerIp**.

:::image type="content" source="./media/monitor-route-server/route-server-metrics-routes-learned-split-by-peer.png" alt-text="Screenshot of Count of Routes Learned - Split by Peer." lightbox="./media/monitor-route-server/route-server-metrics-routes-learned-split-by-peer-expand.png":::

## Related content

To learn how to configure a Route Server, see:
 
- [Create and configure Route Server](quickstart-configure-route-server-portal.md)
- [Configure peering between Azure Route Server and an NVA](tutorial-configure-route-server-with-quagga.md)
