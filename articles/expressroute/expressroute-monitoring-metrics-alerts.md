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

![circuit metrics][1]

## Metrics per peering : private/ public/ Microsoft peering in bits/second

![metrics per peering][2]

### You can only select Inbound or Outbound Metrics

**(missing file)**

## ExpressRoute gateway connections in bits/seconds

![gateway connections][4]

## Alerts for ExpressRoute gateway connections

1. Navigate to Azure Monitor and click **Alerts**.

  ![alerts][5]

2. Click **+Select Target** and select the ExpressRoute gateway connection resource.

  ![target][6]
3. Define the alert details.

  ![details][7]
4. Define the action group.

  ![action group][7]

  Add action group.

  ![action group 2][8]



  

  

















## Next steps
* Configure your ExpressRoute connection.
  
  * [Create and modify a circuit](expressroute-howto-circuit-arm.md)
  * [Create and modify peering configuration](expressroute-howto-routing-arm.md)
  * [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)

<!--Image References-->
[1]: ./media/expressroute-monitoring-metrics-alerts/ermetricspeering.jpg ""
[2]: ./media/expressroute-monitoring-metrics-alerts/erpeeringmetrics.jpg ""
[4]: ./media/expressroute-monitoring-metrics-alerts/erconnections.jpg ""
[5]: ./media/expressroute-monitoring-metrics-alerts/eralertshowto.jpg ""
[6]: ./media/expressroute-monitoring-metrics-alerts/alerthowto2.jpg ""
[7]: ./media/expressroute-monitoring-metrics-alerts/alerthowto3.jpg ""
[8]: ./media/expressroute-monitoring-metrics-alerts/actiongroup.png ""
[15]: ./media/expressroute-monitoring-metrics-alerts/alerthowto4.jpg ""
[9]: ./media/expressroute-monitoring-metrics-alerts/alertshowtopeering5.jpg ""
[10]: ./media/expressroute-monitoring-metrics-alerts/alertshowto6activitylog.jpg ""
[11]: ./media/expressroute-monitoring-metrics-alerts/metricsconfiguralertscomingsoon.jpg ""











