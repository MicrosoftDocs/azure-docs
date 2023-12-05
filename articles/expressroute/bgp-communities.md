---
title: Managing complex network architectures with BGP communities - Azure ExpressRoute
description: Learn how to manage complex networks with BGP community values.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 06/30/2023
ms.author: duau

---
# Managing complex network architectures with BGP communities

Managing a hybrid network can get increasingly complex as you deploy more ExpressRoute circuits and establish more connections to your workloads in different Azure regions. To help manage the complexity of your network and route traffic from Azure to on-premises efficiently, you can configure BGP communities on your Azure virtual networks.

## What is a BGP community?

A Border Gateway Protocol (BGP) community is a group of IP prefixes that share a common property called a BGP community tag or value. In Azure, you can now: 

* Set a custom BGP community value on each of your virtual networks. 

* Access a predefined regional BGP community value for all your virtual networks deployed in a region. 

Once these values are configured on your virtual networks, ExpressRoute preserves them on the corresponding private IP prefixes shared with your on-premises. When these prefixes are learned on-premises, they're learned along with the configured BGP community values. 

## Using community values for multi-region networks 

A common scenario for when to use ExpressRoute is when you want to access workloads deployed in an Azure virtual network. ExpressRoute facilitates the exchange of Azure and on-premises private IP address ranges using a BGP session over a private connection. This feature enables a seamless extension of your existing networks into the cloud. 

When you have multiple ExpressRoute connections to virtual networks in different Azure regions, traffic can take more than one path. A hybrid network architecture diagram demonstrates the emergence of a suboptimal route when establishing a mesh network with multiple regions and ExpressRoute circuits: 

:::image type="content" source="./media/bgp-communities/bgp-community.png" alt-text="Diagram of optimal and suboptimal routing with ExpressRoute.":::

To ensure traffic going to **Region A** takes the optimal path over **ER Circuit 1**, the customer could configure a route filter on-premises to ensure that **Region A** routes gets only learned at the customer edge from **ER Circuit 1**, and not learned at all by **ER Circuit 2**. This approach requires you to maintain a comprehensive list of IP prefixes in each region and regularly update this list whenever a new virtual network gets added or a private IP address space gets expanded in the cloud. As you continue to grow your presence in the Cloud, this burden can become excessive. 

When virtual network IP prefixes gets learned on-premises with custom and regional BGP community values, you can configure your route filters based on these values instead of specific IP prefixes. When you decide to expand your address spaces or create more virtual networks in an existing region, you don't need to modify your route filter. The route filter already has rules for the corresponding community values. With the use of BGP communities, your multi-region hybrid networking is simplified. 

## Other uses of BGP communities

Another reason to configure a BGP community value on a virtual network connected to ExpressRoute is to understand where traffic is originating from within an Azure region. As you deploy more virtual networks and adopt more complex network topologies within an Azure region, troubleshooting connectivity and performance issues can become more difficult. With custom BGP community values configured on each virtual network within a region, you can quickly identify where the traffic was originating from in Azure. Being able to identify the source virtual network helps you narrow down your investigation. 

## Next steps

Learn how to [configure BGP communities](how-to-configure-custom-bgp-communities-portal.md) using the Azure portal.
