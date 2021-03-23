---
title: 'Azure ExpressRoute Insights using Network Insights'
description: Learn about Azure ExpressRoute Insights using Network Insights.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 03/23/2021
ms.author: duau
---

# Azure ExpressRoute Insights using Network Insights

This article explains how Network Insights can help you view  your ExpressRoute metrics and configurations all in one place. Through Network Insights, you can view topological maps and health dashboards containing important ExpressRoute information without needing to complete any extra setup.

:::image type="content" source="./media/expressroute-network-insights/monitor-landing-page.png" alt-text="Screenshot of ExpressRoute monitor landing page." lightbox="./media/expressroute-network-insights/monitor-landing-page-expanded.png":::

## Visualize functional dependencies

To view this solution, navigate to the *Azure Monitor* page, select *Networks*, and then select the *ExpressRoute Circuits* card. Then, select the topology button for the circuit you would like to view.

The functional dependency view provides a clear picture of your ExpressRoute setup, outlining the relationship between different ExpressRoute components (peerings, connections, gateways).

:::image type="content" source="./media/expressroute-network-insights/topology-view.png" alt-text="Screenshot of topology view for network insights." lightbox="./media/expressroute-network-insights/topology-view-expanded.png":::

Hover over any component in the topology map to view configuration information. For example, hover over an ExpressRoute peering component to view details such as circuit bandwidth and Global Reach enablement.

:::image type="content" source="./media/expressroute-network-insights/topology-hovered.png" alt-text="Screenshot of hovering over topology view resources." lightbox="./media/expressroute-network-insights/topology-hovered-expanded.png":::

## View a detailed and pre-loaded metrics dashboard

Once you review the topology of your ExpressRoute setup using the functional dependency view, select **View detailed metrics** to navigated to the detailed metrics view to understand the performance of your circuit. This view offers an organized list of linked resources and a rich dashboard of important ExpressRoute metrics.

The **Linked Resources** section lists the connected ExpressRoute gateways and configured peerings, which you can select on to navigate to the corresponding resource page.

:::image type="content" source="./media/expressroute-network-insights/linked-resources.png" alt-text="Screenshot of linked resource on monitor page.":::


The **ExpressRoute Metrics** section includes charts of important circuit metrics across the categories of **Availability**, **Throughput**, **Packet Drops**, and **Gateway Metrics**.

### Availability

The *Availability* tab tracks ARP and BGP availability, plotting the data for both the circuit as a whole and individual connection (primary and secondary). 

:::image type="content" source="./media/expressroute-network-insights/arp-bgp-availability.png" alt-text="Screenshot of availability metric graphs." lightbox="./media/expressroute-network-insights/arp-bgp-availability-expanded.png":::

### Throughput

Similarly, the *Throughput* tab plots the total throughput of ingress and egress traffic for the circuit in bits/second. You can also view throughput for individual connections and each type of configured peering.

:::image type="content" source="./media/expressroute-network-insights/throughput.png" alt-text="Screenshot of throughput metric graphs." lightbox="./media/expressroute-network-insights/throughput-expanded.png":::

### Packet Drops

The *Packet Drops* tab plots the dropped bits/second for ingress and egress traffic through the circuit. This tab provides an easy way to monitor performance issues that may occur if you regularly need or exceed your circuit bandwidth.

:::image type="content" source="./media/expressroute-network-insights/dropped-packets.png" alt-text="Screenshot of dropped packets graphs." lightbox="./media/expressroute-network-insights/dropped-packets-expanded.png":::

### Gateway Metrics

Lastly, the Gateway Metrics tab populates with key metrics charts for a selected ExpressRoute gateway (from the Linked Resources section). Use this tab when you need to monitor your connectivity to specific virtual networks.

:::image type="content" source="./media/expressroute-network-insights/gateway-metrics.png" alt-text="Screenshot of dropped packets graphs." lightbox="./media/expressroute-network-insights/gateway-metrics-expanded.png":::

## One place for all your network monitoring needs

Network Insights fully support the new monitoring and insights experience for Azure ExpressRoute. With all your network resource metrics in a single place, you can quickly filter by type, subscription, and keyword to view the health, connectivity, and alert status of all your Azure network resources such as Azure Firewalls, Load Balancers, Application Gateways and more.

:::image type="content" source="./media/expressroute-network-insights/dashboard.png" alt-text="Screenshot of Network Insights dashboard." lightbox="./media/expressroute-network-insights/dashboard-expanded.png":::

As we rapidly transition to the cloud and applications become more complex, customers need tools to easily maintain, monitor, and update their network configurations. With the integration of the Azure ExpressRoute with Network Insights, we deliver a piece of this and look forward to continuing to provide our valued customers with the best in class experience they deserve.
  
## Next steps

Configure your ExpressRoute connection.
  
* Learn more about [Azure ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction), [Network Insights](https://docs.microsoft.com/azure/azure-monitor/insights/network-insights-overview), and [Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview)
* [Create and modify a circuit](expressroute-howto-circuit-arm.md)
* [Create and modify peering configuration](expressroute-howto-routing-arm.md)
* [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
* [Customize your metrics](https://docs.microsoft.com/azure/expressroute/expressroute-monitoring-metrics-alerts) and create a [Connection Monitor](https://docs.microsoft.com/azure/network-watcher/connection-monitor-overview)
