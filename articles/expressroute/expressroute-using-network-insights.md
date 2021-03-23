---
title: 'Azure ExpressRoute: Using Network Insights'
description: Learn about navigating Azure ExpressRoute Insights using Network Insights.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: how-to
ms.date: 03/22/2021
ms.author: duau


---
# Azure ExpressRoute Insights using Network Insights

This article helps you understand Azure ExpressRoute Insights using Network Insights, an easy-to-use solution for viewing metrics and configuration details. Through Network Insights, you can view topological maps and health dashboards containing important ExpressRoute information without needing to complete any additional setup.

//IMAGE

## Visualize functional dependencies

To view this solution, navigate to the *Azure Monitor* page, click *Networks*, and click the *ExpressRoute Circuits* card. Then, select the topology button for the circuit you would like to view.

The functional dependency view provides a clear picture of your ExpressRoute setup, outlining the relationship between different ExpressRoute components (peerings, connections, gateways).

//IMAGE

Hover over any component in the topology map to view configuration information. For example, over over an ExpressRoute peering component to view details such as circuit bandwidth and Global Reach enablement.

//IMAGE

## View a detailed and pre-loaded metrics dashboard

Once you review the topology of your ExpressRoute setup using the functional dependency view, click **View detailed metrics** to navigated to the detailed metrics view to understand the performance of your circuit. This view offers an organized list of linked resources and a rich dashboard of important ExpressRoute metrics.

The **Linked Resources** section lists the connected ExpressRoute gateways and configured peerings, which you can click on to navigate to the corresponding resource blade.

//IMAGE

The **ExpressRoute Metrics** section includes charts of important circuit metrics across the categories of **Availability**, **Throughput**, **Packet Drops**, and **Gateway Metrics**. The Availability tab tracks ARP and BGP availability, plotting the data for both the circuit as a whole and individual connections (primary and secondary). Similarly, the Throughput tab plots the total throughput of ingress and egress traffic for the circuit in bits/second, as well as for individual connections and each type of configured peering.

//IMAGE
//IMAGE
//IMAGE

The Packet Drops tab plots the dropped bits/second for ingress and egress traffic through the circuit. This tab provides an easy way to monitor performance issues that may occur if you regularly need or exceed your circuit bandwidth.

Lastly, the Gateway Metrics tab populates with key metrics charts for a selected ExpressRoute gateway (from the Linked Resources section). Use this tab when you need to monitor your connectivity to specific virtual networks.

//IMAGE
//IMAGE

## One place for all your network monitoring needs

Network Insights fully supports the new monitoring and insights experience for Azure ExpressRoute. With all your network resource metrics in a single place, you can quickly filter by type, subscription, and keyword to view the health, connectivity, and alert status of all your Azure network resources such as Azure Firewalls, Load Balancers, Application Gateways and more.

//IMAGE

As we rapidly transition to the cloud and applications become more complex, customers need tools to easily maintain, monitor, and update their network configurations. With the integration of the Azure ExpressRoute with Network Insights, we deliver a piece of this and look forward to continuing to provide our valued customers with the best in class experience they deserve.
  
## Next steps

Configure your ExpressRoute connection.
  
* Learn more about [Azure ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction), [Network Insights](https://docs.microsoft.com/azure/azure-monitor/insights/network-insights-overview), and [Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview)
* [Create and modify a circuit](expressroute-howto-circuit-arm.md)
* [Create and modify peering configuration](expressroute-howto-routing-arm.md)
* [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
* [Customize your metrics](https://docs.microsoft.com/azure/expressroute/expressroute-monitoring-metrics-alerts) and create a [Connection Monitor](https://docs.microsoft.com/azure/network-watcher/connection-monitor-overview)
