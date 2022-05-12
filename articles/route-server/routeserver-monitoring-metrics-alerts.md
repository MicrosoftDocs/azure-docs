---
title: 'Azure Route Server: Monitoring, Metrics, and Alerts'
description: Learn about Azure Route Server monitoring, metrics, and alerts using Azure Monitor, the one stop shop for all metrics, alerting, diagnostic logs across Azure.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: how-to
ms.date: 05/12/2022
ms.author: halkazwini
---
# Route Server monitoring, metrics, and alerts

This article helps you understand Route Server monitoring, metrics, and alerts using Azure Monitor. Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure.
 
>[!NOTE]
>Using **Classic Metrics** is not recommended.
>

## Route Server metrics

To view **Metrics**, navigate to your *Route Server* in the Azure portal  and select *Metrics*.

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
| [BGP Peer Status](#bgp) | Scalability | Count | Average | BGP availability from Route Server to Peer. | BGP Peer IP, BGP Type, Route Server Instance |  Yes | 
| [Count of Routes Advertised to Peer](#advertised) | Scalability | Count | Average | Count of routes advertised from Route Server to Peer | BGP Peer IP, BGP Type, Route Server Instance |  Yes|
| [Count of Routes Received from Peer](#received) | Scalability | Count | Average | Count of routes received from Peer| BGP Peer IP, BGP Type, Route Server Instance | Yes 

> [!IMPORTANT]
> Azure Monitor exposes another metric for Route Server, **Data Processed by the Virtual Hub Router**. This metric doesn't apply to Route Server and should be ignored.
> 


## Route Server Metrics

### <a name = "bgp"></a>BGP Peer Status

Aggregation type: *Max*

You can view the BGP availability of Route Server. This is a binary metric. 1 = BGP is up-and-running. 0 = BGP is unavailable.

### <a name = "advertised"></a>Count of Routes Advertised to Peer

Aggregation type: *Max*

You can view the count of routes advertised from Route Server to NVA peers.

### <a name = "received"></a>Count of Routes Received from the Peer 

Aggregation type: *Max*

You can view the count of routes received from NVA peers.


## Configure Alerts in Azure Monitor

1. To configure alerts, navigate to **Azure Monitor**, then select **Alerts**.

## Next steps

Configure Route Server.
  
* [Create and configure Route Server](quickstart-configure-route-server-portal.md)
* [Configure peering between Azure Route Server and an NVA](tutorial-configure-route-server-with-quagga.md)