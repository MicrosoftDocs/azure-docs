---
title: Network Insights topology (preview)
description: An overview of topology, which provides a pictorial representation of the resources.
author: halkazwini
ms.author: halkazwini
ms.reviewer: saggupta
ms.service: network-watcher
ms.topic: how-to
ms.date: 08/10/2023
ms.custom: subject-monitoring, ignite-2022
---

# Topology (preview)

Topology provides a visualization of the entire network for understanding network configuration. It provides an interactive interface to view resources and their relationships in Azure across multiple subscriptions, resource groups and locations. You can also drill down to a resource view for resources to view their component level visualization.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
- An account with the necessary [RBAC permissions](required-rbac-permissions.md) to utilize the Network Watcher capabilities.

## Supported resource types

The following are the resource types supported by topology:

- Application gateways
- Azure Bastion hosts
- Azure Front Door profiles
- ExpressRoute circuits
- Load balancers
- Network interfaces
- Network security groups
- Private endpoints
- Private Link services
- Public IP addresses
- Virtual machines
- Virtual network gateways
- Virtual networks

## View Topology

To view a topology, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that has the necessary [permissions](required-rbac-permissions.md).

1. In the search box at the top of the portal, enter ***Monitor***. Select **Monitor** from the search results.

1. Under **Insights**, select **Networks**. 

1. In **Networks**, select **Topology**.

1. Select **Scope** to define the scope of the Topology. 

1. In the **Select scope** pane, select the list of **Subscriptions**, **Resource groups**, and **Locations** of the resources for which you want to view the topology. Select **Save**.
 
   :::image type="content" source="./media/network-insights-topology/topology-scope-inline.png" alt-text="Screenshot of selecting the scope of the topology." lightbox="./media/network-insights-topology/topology-scope-expanded.png":::

   The duration to render the topology may vary depending on the number of subscriptions selected.

1. Select the **Resource type** that you want to include in the topology and select **Apply**. See [supported resource types](#supported-resource-types).

The topology containing the resources according to the scope and resource type specified, appears.

   :::image type="content" source="./media/network-insights-topology/topology-start-screen-inline.png" alt-text="Screenshot of the generated resource topology." lightbox="./media/network-insights-topology/topology-start-screen-expanded.png":::

Each edge of the topology represents an association between each of the resources. In the topology, similar types of resources are grouped together. 

## Add regions

You can add regions that aren't part of the existing topology. The number of regions that aren't part of the existing topology are displayed. To add a region, follow these steps:

1. Hover on **Regions** under **Azure Regions**.

2. From the list of **Hidden Resources**, select the regions that you want to add and select **Add to View**.

   :::image type="content" source="./media/network-insights-topology/add-resources-inline.png" alt-text="Screenshot of the add resources and regions pane." lightbox="./media/network-insights-topology/add-resources-expanded.png":::

You can view the resources in the added region as part of the topology.

## Drilldown resources

To drill down to the basic unit of each network, select the plus sign on each resource. When you hover on the resource, you can see the details of that resource. Selecting a resource displays a pane on the right with a summary of the resource. 

   :::image type="content" source="./media/network-insights-topology/resource-details-inline.png" alt-text="Screenshot of the details of each resource." lightbox="./media/network-insights-topology/resource-details-expanded.png":::
   

Drilling down into Azure resources such as Application Gateways and Firewalls displays the resource view diagram of that resource. 

   :::image type="content" source="./media/network-insights-topology/drill-down-inline.png" alt-text="Screenshot of drilling down a resource." lightbox="./media/network-insights-topology/drill-down-expanded.png":::

## Integration with diagnostic tools

When you drill down to a VM within the topology, you can see details about the VM in the summary tab. 

:::image type="content" source="./media/network-insights-topology/resource-summary.png" alt-text="Screenshot of the Summary tab of a virtual machine in the Topology page." lightbox="./media/network-insights-topology/resource-summary.png":::

Follow these steps to find the next hop:

1. Select **Insights + Diagnostics** tab, and then select **Next Hop**.

   :::image type="content" source="./media/network-insights-topology/resource-insights-diagnostics.png" alt-text="Screenshot of the Insights and Diagnostics tab of a virtual machine in the Topology page." lightbox="./media/network-insights-topology/resource-insights-diagnostics.png":::

1. Enter the destination IP address and then select **Check Next Hop**.

   :::image type="content" source="./media/network-insights-topology/next-hop-check.png" alt-text="Screenshot of using Next hop check from withing the Insights and Diagnostics tab of a virtual machine in the Topology page." lightbox="./media/network-insights-topology/next-hop-check.png":::

1. The Next hop capability of Network Watcher checks if the destination IP address is reachable from the source VM. The result shows the Next hop type and route table used to route traffic from the VM. For more information, see [Next hop](network-watcher-next-hop-overview.md).

   :::image type="content" source="./media/network-insights-topology/next-hop-result.png" alt-text="Screenshot of the next hop option in the summary and insights tab." lightbox="./media/network-insights-topology/next-hop-result.png":::

## Next steps

To learn more about connectivity related metrics, see [Connection monitor](./connection-monitor-overview.md). 
