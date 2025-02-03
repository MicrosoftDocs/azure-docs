---
title: Managing complex network architectures with BGP communities - Azure ExpressRoute
description: Learn how to manage complex networks with BGP community values.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau

---
# Managing complex network architectures with BGP communities

Managing a hybrid network becomes increasingly complex as you deploy more ExpressRoute circuits and establish connections to workloads in different Azure regions. To manage this complexity and route traffic efficiently from Azure to on-premises, you can configure BGP communities on your Azure virtual networks.

## What is a BGP community?

A Border Gateway Protocol (BGP) community is a group of IP prefixes that share a common property called a BGP community tag or value. In Azure, you can:

* Set a custom BGP community value on each of your virtual networks.
* Access a predefined regional BGP community value for all your virtual networks deployed in a region.

Once configured, ExpressRoute preserves these values on the corresponding private IP prefixes shared with your on-premises network. When these prefixes are learned on-premises, they include the configured BGP community values.

## Using community values for multi-region networks

ExpressRoute is commonly used to access workloads deployed in an Azure virtual network. It facilitates the exchange of Azure and on-premises private IP address ranges using a BGP session over a private connection, enabling a seamless extension of your existing networks into the cloud.

When you have multiple ExpressRoute connections to virtual networks in different Azure regions, traffic can take multiple paths. A hybrid network architecture diagram shows the emergence of suboptimal routes when establishing a mesh network with multiple regions and ExpressRoute circuits:

:::image type="content" source="./media/bgp-communities/bgp-community.png" alt-text="Diagram of optimal and suboptimal routing with ExpressRoute.":::

To ensure traffic to **Region A** takes the optimal path over **ER Circuit 1**, you can configure a route filter on-premises to ensure that **Region A** routes are learned only from **ER Circuit 1** and not from **ER Circuit 2**. This approach requires maintaining a comprehensive list of IP prefixes in each region and regularly updating it whenever a new virtual network is added or a private IP address space is expanded. As your cloud presence grows, this burden can become excessive.

When virtual network IP prefixes are learned on-premises with custom and regional BGP community values, you can configure your route filters based on these values instead of specific IP prefixes. This means you don't need to modify your route filter when expanding address spaces or creating more virtual networks in an existing region. The route filter already has rules for the corresponding community values, simplifying your multi-region hybrid networking.

## Other uses of BGP communities

Configuring a BGP community value on a virtual network connected to ExpressRoute also helps you understand where traffic is originating from within an Azure region. As you deploy more virtual networks and adopt complex network topologies, troubleshooting connectivity and performance issues can become more difficult. With custom BGP community values configured on each virtual network, you can quickly identify the source of the traffic within Azure, helping you narrow down your investigation.

## Next steps

Learn how to [configure BGP communities](how-to-configure-custom-bgp-communities-portal.md) using the Azure portal.
