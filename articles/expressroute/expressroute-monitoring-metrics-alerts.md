---
title: Monitoring, Metrics, and Alerts - Azure ExpressRoute | Microsoft Docs
description: This page provides information about ExpressRoute monitoring
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 08/22/2019
ms.author: cherylmc
ms.custom: seodec18

---
# ExpressRoute monitoring, metrics, and alerts

This article helps you understand ExpressRoute monitoring, metrics, and alerts using Azure Monitor. Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure.
 
>[!NOTE]
>Using **Classic Metrics** is not recommended.
>

## Circuit metrics

To view **Metrics**, navigate to the *Azure Monitor* page and click *Metrics*. To view **ExpressRoute** metrics, filer by Resource Type *ExpressRoute circuits*. To view Global Reach metrics, filter by Resource Type *ExpressRoute circuits* and select an ExpressRoute circuit resource that has Global Reach enabled. To view **ExpressRoute Direct** metrics, filter Resource Type by *ExpressRoute Ports*. 

Once a metric is selected, the default aggregation will be applied. Optionally, you can apply splitting, which will show the metric with different dimensions.

|  **Category** |  **Metric** | **Dimension(s)** |  **Feature(s)** |
| --- | --- | --- | --- |
|Availability| ARP Availability |* Peer (Primary/Secondary ExpressRoute router)<br>* Peering Type (Private/Public/Microsoft)  |ExpressRoute|
|Availability|Bgp Availability |* Peer (Primary/Secondary ExpressRoute router)<br>* Peering Type|ExpressRoute |
|Traffic|BitsInPerSecond|* Peering Type (ExpressRoute)<br>* Link (ExpressRoute Direct)| *ExpressRoute<br>* ExpressRoute Direct|
|Traffic|BitsOutPerSecond| * Peering Type (ExpressRoute)<br>* Link (ExpressRoute Direct) | *ExpressRoute<br>* ExpressRoute Direct|
|Traffic|GlobalReachBitsInPerSecond|Peered Circuit Skey (Service Key) |Global Reach |
|Traffic|GlobalReachBitsOutPerSecond|Peered Circuit Skey (Service Key) |Global Reach|
|Physical Connectivity|AdminState|Link|ExpressRoute Direct|
|Physical Connectivity|LineProtocol|Link |ExpressRoute Direct|
|Physical Connectivity|RxLightLevel|* Link<br>* Lane |ExpressRoute Direct|
|Physical Connectivity|TxLightLevel|* Link<br>* Lane |ExpressRoute Direct|
>[!NOTE]
>Using *GlobalGlobalReachBitsInPerSecond* and *GlobalGlobalReachBitsOutPerSecond* will only be visible if at least one Global Reach connection is established.
>

## Bits In and Out - Metrics across all peerings

You can view metrics across all peerings on a given ExpressRoute circuit.

![circuit metrics](./media/expressroute-monitoring-metrics-alerts/ermetricspeering.jpg)

## Bits In and Out - Metrics per peering

You can view metrics for private, public, and Microsoft peering in bits/second.

![metrics per peering](./media/expressroute-monitoring-metrics-alerts/erpeeringmetrics.jpg) 

## BGP Availability - Split by Peer  

You can view near to real-time availability of BGP across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Primary BGP session up for private peering and the Second BGP session down for private peering. 

![BGP availability per peer](./media/expressroute-monitoring-metrics-alerts/erBgpAvailabilityMetrics.jpg) 

## ARP Availability - Split by Peering  

You can view near to real-time availability of [ARP](https://docs.microsoft.com/azure/expressroute/expressroute-troubleshooting-arp-resource-manager) across peerings and peers (Primary and Secondary ExpressRoute routers). This dashboard shows the Private Peering ARP session up across both peers, but complete down for Microsoft peering across peerings. The default aggregation (Average) was utilized across both peers.  

![ARP availability per peer](./media/expressroute-monitoring-metrics-alerts/erArpAvailabilityMetrics.jpg) 

## ExpressRoute gateway connections in bits/seconds

![gateway connections](./media/expressroute-monitoring-metrics-alerts/erconnections.jpg ) 

## Alerts for ExpressRoute gateway connections

1. In order to configure alerts, navigate to **Azure Monitor**, then click **Alerts**.

   ![alerts](./media/expressroute-monitoring-metrics-alerts/eralertshowto.jpg)

2. Click **+Select Target** and select the ExpressRoute gateway connection resource.

   ![target]( ./media/expressroute-monitoring-metrics-alerts/alerthowto2.jpg)
3. Define the alert details.

   ![action group](./media/expressroute-monitoring-metrics-alerts/alerthowto3.jpg)

4. Define and add the action group.

   ![add action group](./media/expressroute-monitoring-metrics-alerts/actiongroup.png)

## Alerts based on each peering

 ![what](./media/expressroute-monitoring-metrics-alerts/basedpeering.jpg)

## Configure alerts for activity logs on circuits

In the **Alert Criteria**, you can select **Activity Log** for the Signal Type and select the Signal.

  ![another](./media/expressroute-monitoring-metrics-alerts/alertshowto6activitylog.jpg)
  
## Next steps

Configure your ExpressRoute connection.
  
  * [Create and modify a circuit](expressroute-howto-circuit-arm.md)
  * [Create and modify peering configuration](expressroute-howto-routing-arm.md)
  * [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
