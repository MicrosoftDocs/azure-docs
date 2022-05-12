---
title: 'Azure Route Server: Monitoring, Metrics, and Alerts'
description: Learn about Azure Route Server monitoring, metrics, and alerts using Azure Monitor, the one stop shop for all metrics, alerting, diagnostic logs across Azure.
author: duongau
ms.service: routeserver
ms.topic: how-to
ms.date: 05/10/2022
ms.author: mialdrid
---
# Route Server monitoring, metrics, and alerts

This article helps you understand Route Server monitoring, metrics, and alerts using Azure Monitor. Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure.
 
>[!NOTE]
>Using **Classic Metrics** is not recommended.
>

## Route Server metrics

To view **Metrics**, navigate to your *Route Server* in the Azure Portal  and select *Metrics*.

Once a metric is selected, the default aggregation will be applied.

> [!IMPORTANT]
> When viewing Route Server metrics in the Azure portal, select a time granularity of **5 minutes or greater** for best possible results.
> 
> :::image type="content" source="./media/routeserver-monitoring-metrics-alerts/metric-granularity.png" alt-text="Screenshot of time granularity options.":::

### Aggregation Types:

Metrics explorer supports SUM, MAX, MIN, AVG and COUNT as [aggregation types](../azure-monitor/essentials/metrics-charts.md#aggregation). You should use the recommended Aggregation type when reviewing the insights for each ExpressRoute metric.

* Sum: The sum of all values captured during the aggregation interval. 
* Count: The number of measurements captured during the aggregation interval. 
* Average: The average of the metric values captured during the aggregation interval. 
* Min: The smallest value captured during the aggregation interval. 
* Max: The largest value captured during the aggregation interval. 

### Route Server

| Metric | Category | Unit | Aggregation Type | Description | Dimensions |  Exportable via Diagnostic Settings? | 
| --- | --- | --- | --- | --- | --- | --- | 
| [BGP Peer Status](#arp) | Scalability | Count | Average | BGP availability from Route Server to Peer. | BGP Peer IP, BGP Type, Route Server Instance |  Yes | 
| [Count of Routes Advertised to Peer](#bgp) | Scalability | Count | Average | Count of routes advertised from Route Server to Peer | BGP Peer IP, BGP Type, Route Server Instance |  Yes|
| [Count of Routes Received from Peer](#circuitbandwidth) | Scalability | Count | Average | Count of routes received from Peer| BGP Peer IP, BGP Type, Route Server Instance | Yes 

> [!IMPORTANT]
> Azure Monitor exposes another metric for Route Server, **Data Processed by the Virtual Hub Router**. This metric doesn't apply to Route Server and should be ignored.
> 


## Route Server Metrics

### BGP Peer Status

Aggregation type: *Max*

You can view the BGP availability of Route Server. This is a binary metric. 1 = BGP is up-and-running. 0 = BGP is unavailabe.

### Count of Routes Advertised to Peer

Aggregation type: *Max*

You can view the count of routes advertised from Route Server to NVA peers.

### Count of Routes Received from the Peer 

Aggregation type: *Max*

You can view the count of routes received from NVA peers.


## Configure Alerts in Azure Monitor

1. To configure alerts, navigate to **Azure Monitor**, then select **Alerts**.

## Next steps

Configure Route Server
  
* [Create and modify a circuit](expressroute-howto-circuit-arm.md)
* [Create and modify peering configuration](expressroute-howto-routing-arm.md)
* [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)