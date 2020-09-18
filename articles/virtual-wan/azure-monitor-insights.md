---
title: 'Monitoring Azure Virtual WAN using Azure Monitor Insights'
description: Learn about monitoring Virtual WAN using Azure Monitor Insights
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/22/2020
ms.author: cherylmc
---

# Azure Monitor Insights for Virtual WAN (Preview)

[Azure Monitor Insights](../azure-monitor/insights/network-insights-overview.md) for Virtual WAN gives users and operators the ability to view the state and status of the Virtual WAN, presented via an autodiscovered topological map. Resource state and status are overlaid on the map to give you a snapshot view of the overall health of the virtual WAN. Resource navigation is enabled on the map via one-click access to the resource configuration pages of the Virtual WAN portal.

Virtual WAN resource level metrics are collected and presented via a pre-packaged Virtual WAN metrics workbook that shows the metrics at a virtual WAN, hub, gateway, and connection levels. This article walks you through the steps to use Azure Monitor Insights for Virtual WAN to view your Virtual WAN topology and metrics all in a single place.

> [!NOTE]
> The Insights menu option in Virtual WAN Portal is in the process of rolling out. While the Insights Menu for Virtual WAN is being rolled out, Virtual WAN Topology and Metrics Workbook can directly be accessed using Azure Montor for Networks. See [Azure Monitor Insights](../azure-monitor/insights/network-insights-overview.md) for more info. 
>

## Before you begin

The steps in this article assume that you have already deployed a virtual WAN with one or more hubs. To create a new virtual WAN and a new hub, use the steps in the following articles:

* [Create a virtual WAN](virtual-wan-site-to-site-portal.md#openvwan)
* [Create a hub](virtual-wan-site-to-site-portal.md#hub)

## <a name="topology"></a>View VWAN topology

In the **Azure portal ->Virtual WAN**, from the **Monitor** menu on the left, select **Insights (preview)**. This brings up the **Insights view**, which displays the Virtual WAN Dependency map and high-level metrics mini-workbook.

**Figure 1: Monitor - Insights menu**

:::image type="content" source="./media/azure-monitor-insights/monitor-menu.png" alt-text="figure" lightbox="./media/azure-monitor-insights/monitor-menu.png":::

In the **Insights** view, you can view the autodiscovered Virtual WAN resources such as hubs, gateways, firewalls, connections and spoke VNets, 3rd party NVAs, and branches in an end-to-end Virtual WAN, as shown in **Figure 2**.

The **resource state** and **status** are color-coded and overlaid on the resource icons in the map. Virtual WAN high-level metrics, such as hub capacities and gateway utilization, are displayed on the right via a mini workbook.

**Figure 2: Insights view**

:::image type="content" source="./media/azure-monitor-insights/insights-view.png" alt-text="figure" lightbox="./media/azure-monitor-insights/insights-view.png":::

## <a name="dependency"></a>Dependency view

The **Dependency** view for Virtual WAN helps visualize the interconnected view of all the Virtual WAN resources broadly organized into a hub-and-spoke architecture.

**Figure 3: VWAN Dependency view**

:::image type="content" source="./media/azure-monitor-insights/dependency-map.png" alt-text="Dependency map" lightbox="./media/azure-monitor-insights/dependency-map.png":::

The Dependency view map displays the following resources as a connected graph:

* Virtual WAN hubs across the various Azure regions.
* Spoke VNets that are directly connected to the hub.
* VPN and ExpressRoute branch sites and P2S users that are connected to each hub via their respective ExpressRoute, S2S and P2S Connections, and virtual network gateways.
* Azure Firewalls (including 3rd party firewall proxies) deployed in a hub (Secured Hub).
* 3rd Party NVA (Network Virtual Appliances) that are deployed in a spoke VNets.

The Dependency map also displays indirectly connected VNets (VNet that are peered with a Virtual WAN spoke VNets).

The Dependency map enables easy navigation to the configuration settings of each resource. For example, you can hover over the hub resource to view the basic resource configuration such as hub region, and hub prefix. Right-click to access the Azure portal page of the hub resource.

**Figure 4: Navigate to resource-specific information**

:::image type="content" source="./media/azure-monitor-insights/resource-information.png" alt-text="resource information":::

The search and filter bar on the Dependency view provide an effortless way to search through the graph. Different filters provide help to narrow your search down to a specific path and state.

**Figure 5: Search and filtering**

:::image type="content" source="./media/azure-monitor-insights/search-filter.png" alt-text="search and filter bar" lightbox="./media/azure-monitor-insights/search-filter.png":::

## <a name="detailed"></a>Detailed metrics

You can select **View detailed metrics** to access the detailed **Metrics** page. The Metrics page is a dashboard that is preconfigured with separate tabs providing useful insights into your virtual WAN resource capacity, performance, and utilization at the virtual WAN level, hub level, and individual connections.

**Figure 6: Detailed Metrics dashboard**

:::image type="content" source="./media/azure-monitor-insights/detailed-metrics.png" alt-text="detailed metrics" lightbox="./media/azure-monitor-insights/detailed-metrics.png":::

## Next steps

* To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../azure-monitor/platform/data-platform-metrics.md).
* For a full description of all the Virtual WAN metrics, see [Virtual WAN logs and metrics](logs-metrics.md).
