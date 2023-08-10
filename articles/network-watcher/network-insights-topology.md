---
title: Network Insights topology (preview)
description: An overview of topology, which provides a pictorial representation of the resources.
author: halkazwini
ms.author: halkazwini
ms.reviewer: saggupta
ms.service: network-watcher
ms.topic: how-to
ms.date: 08/08/2023
ms.custom: subject-monitoring, ignite-2022
---

# Topology (preview)

Topology provides a visualization of the entire network for understanding network configuration. It provides an interactive interface to view resources and their relationships in Azure across multiple subscriptions, resource groups and locations. You can also drill down to a resource view for resources to view their component level visualization.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
- An account with the necessary [RBAC permissions](required-rbac-permissions.md) to utilize the Network watcher capabilities.

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
2. Select **More services**.
3. In the **All services** screen, enter **Monitor** in the **Filter services** search box and select it from the search result. 
4. Under **Insights**, select **Networks**. 
5. In the **Networks** screen that appears, select **Topology**.
6. Select **Scope** to define the scope of the Topology. 
7. In the **Select scope** pane, select the list of **Subscriptions**, **Resource groups**, and **Locations** of the resources for which you want to view the topology. Select **Save**.
 
   :::image type="content" source="./media/network-insights-topology/topology-scope-inline.png" alt-text="Screenshot of selecting the scope of the topology." lightbox="./media/network-insights-topology/topology-scope-expanded.png":::

   The duration to render the topology may vary depending on the number of subscriptions selected.
8. Select the [**Resource type**](#supported-resource-types) that you want to include in the topology and select **Apply**.

The topology containing the resources according to the scope and resource type specified, appears.

   :::image type="content" source="./media/network-insights-topology/topology-start-screen-inline.png" alt-text="Screenshot of the generated resource topology." lightbox="./media/network-insights-topology/topology-start-screen-expanded.png":::

Each edge of the topology represents an association between each of the resources. In the topology, similar types of resources are grouped together. 

## Add regions

You can add regions that aren't part of the existing topology. The number of regions that aren't part of the existing topology are displayed. 
To add a region, follow these steps:

1. Hover on **Regions** under **Azure Regions**.
2. From the list of **Hidden Resources**, select the regions to be added and select **Add to View**.

   :::image type="content" source="./media/network-insights-topology/add-resources-inline.png" alt-text="Screenshot of the add resources and regions pane." lightbox="./media/network-insights-topology/add-resources-expanded.png":::

You can view the resources in the added region as part of the topology.

## Drilldown resources

To drill down to the basic unit of each network, select the plus sign on each resource. When you hover on the resource, you can see the details of that resource. Selecting a resource displays a pane on the right with a summary of the resource. 

   :::image type="content" source="./media/network-insights-topology/resource-details-inline.png" alt-text="Screenshot of the details of each resource." lightbox="./media/network-insights-topology/resource-details-expanded.png":::
   

Drilling down into Azure resources such as Application Gateways and Firewalls displays the resource view diagram of that resource. 

   :::image type="content" source="./media/network-insights-topology/drill-down-inline.png" alt-text="Screenshot of drilling down a resource." lightbox="./media/network-insights-topology/drill-down-expanded.png":::

## Integration with diagnostic tools

When you drill down to a VM within the topology, the summary pane contains the **Insights + Diagnostics** section from where you can find the next hop. 

   :::image type="content" source="./media/network-insights-topology/resource-summary-inline.png" alt-text="Screenshot of the summary and insights of each resource." lightbox="./media/network-insights-topology/resource-summary-expanded.png":::

Follow these steps to find the next hop.

1. Click **Next hop** and enter the destination IP address. 
2. Select **Check Next Hop**. The [Next hop](network-watcher-next-hop-overview.md) checks if the destination IP address is reachable from the source VM.

   :::image type="content" source="./media/network-insights-topology/next-hop-inline.png" alt-text="Screenshot of the next hop option in the summary and insights tab." lightbox="./media/network-insights-topology/next-hop-expanded.png":::

## Next steps

[Learn more](./connection-monitor-overview.md) about connectivity related metrics.
