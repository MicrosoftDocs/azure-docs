---
title: Azure ExpressRoute Monitoring, Metrics, and Alerts | Microsoft Docs
description: This page provides information about ExpressRoute monitoring
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: cherylmc

---
# ExpressRoute monitoring, metrics, and alerts

 This article helps you understand ExpressRoute monitoring, metrics, and alerts. Azure Monitor is one stop shop for all metrics, alerting, diagnostic logs across all of Azure.

## Circuit metrics

To navigate to **Metrics**, click the ExpressRoute page for the circuit that you want to monitor. Under **Monitoring** you can view the **Metrics**.

![circuit metrics](./media/expressroute-monitoring-metrics-alerts/ermetricspeering.jpg)

## Metrics per peering

You can view metrics for private, public, and Microsoft peering in bits/second.

![metrics per peering](./media/expressroute-monitoring-metrics-alerts/erpeeringmetrics.jpg) 

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
* Configure your ExpressRoute connection.
  
  * [Create and modify a circuit](expressroute-howto-circuit-arm.md)
  * [Create and modify peering configuration](expressroute-howto-routing-arm.md)
  * [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
