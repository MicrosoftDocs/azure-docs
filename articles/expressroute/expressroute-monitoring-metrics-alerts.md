---
title: Azure ExpressRoute Monitoring, Metrics, and Alerts | Microsoft Docs
description: This page provides information about ExpressRoute monitoring
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: cherylmc

---
# ExpressRoute monitoring, metrics, and alerts

Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure. 

## Circuit metrics

![circuit metrics](./media/expressroute-monitoring-metrics-alerts/ermetricspeering.jpg)

## Metrics per peering : private/ public/ Microsoft peering in bits/second

![metrics per peering](./media/expressroute-monitoring-metrics-alerts/erpeeringmetrics.jpg) 

### You can only select Inbound or Outbound Metrics

**(missing file)**

## ExpressRoute gateway connections in bits/seconds

![gateway connections](./media/expressroute-monitoring-metrics-alerts/erconnections.jpg ) 

## Alerts for ExpressRoute gateway connections

1. Navigate to Azure Monitor and click **Alerts**.

  ![alerts](./media/expressroute-monitoring-metrics-alerts/eralertshowto.jpg) "alerts"

2. Click **+Select Target** and select the ExpressRoute gateway connection resource.

  ![target]( ./media/expressroute-monitoring-metrics-alerts/alerthowto2.jpg) "target"
3. Define the alert details.

  ![details](./media/expressroute-monitoring-metrics-alerts/alerthowto2.jpg) "details"
  
4. Define the action group.

  ![action group](./media/expressroute-monitoring-metrics-alerts/alerthowto3.jpg) "action group"

  Add action group.

  ![add action group](./media/expressroute-monitoring-metrics-alerts/actiongroup.png) "add action group"
  
 ![what](./media/expressroute-monitoring-metrics-alerts/alerthowto4.jpg)

  ![another](./media/expressroute-monitoring-metrics-alerts/alertshowtopeering5.jpg)
  

  ![another](./media/expressroute-monitoring-metrics-alerts/alertshowto6activitylog.jpg)

  ![another](./media/expressroute-monitoring-metrics-alerts/metricsconfiguralertscomingsoon.jpg)




## Next steps
* Configure your ExpressRoute connection.
  
  * [Create and modify a circuit](expressroute-howto-circuit-arm.md)
  * [Create and modify peering configuration](expressroute-howto-routing-arm.md)
  * [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
