---
title: Use Azure Firewall to route a multi hub and spoke topology 
description: Learn how you can deploy Azure Firewall to route a multi hub and spoke topology.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 05/30/2023
ms.author: maroja
---

# Use Azure Firewall to route a multi hub and spoke topology

The hub and spoke topology is a common network architecture pattern in Azure. The hub is a virtual network (VNet) in Azure that acts as a central point of connectivity to your on-premises network. The spokes are VNets that peer with the hub, and can be used to isolate workloads. The hub can be used to isolate and secure traffic between spokes. The hub can also be used to route traffic between spokes. The hub can be used to route traffic between spokes using various methods. 

For example, you can use Azure Route Server with dynamic routing and network virtual appliances (NVAs) to route traffic between spokes. This can be a fairly complex deployment. A less complex method uses Azure Firewall and static routes to route traffic between spokes.

This article shows you how you can use Azure Firewall with static user defined routes (UDRs) to route a multi hub and spoke topology. The following diagram shows the topology:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-architecture.png" alt-text="Conceptual diagram showing hub and spoke architecture." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-architecture.png":::


## Baseline architecture

Azure Firewall secures and inspects network traffic, but it also routes traffic between VNets. It's a managed resource that automatically creates [system routes](../virtual-network/virtual-networks-udr-overview.md#system-routes) to the local spokes, hub, and the on-premises prefixes learned by its local Virtual Network Gateway. Placing an NVA on the hub and querying the effective routes would result in a route table that resembles what is found within the Azure Firewall.

Since this is a static routing architecture, the shortest path to another hub can be done by using global VNet peering between the hubs. So the hubs know about each other, and each local firewall contains the route table of each directly connected hub. However, the local hubs only know about their local spokes. Additionally, these hubs can be in the same region or a different region.

## Routing on the firewall subnet

Each local firewall needs to know how to reach the other remote spokes, so you must create UDRs in the firewall subnets. To do this, you first need to create a default route of any type, which then allows you to create more specific routes to the other spokes. For example, the following screenshots show the route table for the two hub VNets:

**Hub-01 route table**
:::image type="content" source="media/firewall-multi-hub-spoke/hub-01-route-table.png" alt-text="Screenshot showing the route table for Hub-01.":::

**Hub-02 route table**
:::image type="content" source="media/firewall-multi-hub-spoke/hub-02-route-table.png" alt-text="Screenshot showing the route table for Hub-02. ":::

## Routing on the spoke subnets

The benefit of implementing this topology is that with traffic going from one hub to another, you can reach the next hop that is directly connected via the global peering.

As illustrated in the diagram, it's better to place a UDR in the spoke subnets that have a 0/0 route (default gateway) with the local firewall as the next hop. This locks in the single next hop exit point as the local firewall. It also reduces the risk of asymmetric routing if it learns more specific prefixes from your on-premises environment that might cause the traffic to bypass the firewall. For more information, see [Don’t let your Azure Routes bite you](https://blog.cloudtrooper.net/2020/11/28/dont-let-your-azure-routes-bite-you/).

Here's an example route table for the spoke subnets connected to Hub-01:

:::image type="content" source="media/firewall-multi-hub-spoke/hub-01-spoke-route.png" alt-text="Screenshot showing the route table for the spoke subnets.":::


## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).
