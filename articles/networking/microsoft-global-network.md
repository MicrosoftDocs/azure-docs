---
title: 'Microsoft Global Network: Azure Backbone'
description: Learn how the Microsoft global network, one of the world's largest backbones, delivers reliable, high-performance connectivity for Azure services.
author: mbender-ms
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 08/26/2026
ms.author: mbender
ai-usage: ai-assisted
# Customer intent: "As a network architect, I want to understand Microsoft's global network infrastructure, so that I can leverage its capabilities to optimize connectivity and performance for my organization's cloud services."
---

# Microsoft global network

The Microsoft global network is a wide area network (WAN) that connects Microsoft datacenters across more than 80 Azure regions to each other and to customers around the world. Spanning more than 500,000 miles, it's one of the largest backbone networks in the world.

Every day, customers pass trillions of requests to services such as Microsoft Azure, Bing, Dynamics 365, Microsoft 365, and XBOX, and they expect instant reliability and responsiveness. A large mesh of edge nodes, strategically placed around the world, connects the backbone to customers and provides the availability, capacity, and flexibility to meet that demand.

This article explains how Microsoft builds and operates the global network, so you can understand how it delivers a consistent, high-performance cloud experience for your workloads.

:::image type="content" source="./media/microsoft-global-network/microsoft-global-wan.png" alt-text="Diagram of the Microsoft global network connecting Azure datacenters and edge nodes around the world.":::

## Global routing and interconnection

When customer traffic enters the global network through strategically placed edge nodes, it travels over optimized routes across the backbone. These edge nodes interconnect with more than 4,000 unique internet partners (peers) through thousands of connections in more than 190 locations, which forms the foundation of Microsoft's interconnection strategy.

Whether you connect from London to Tokyo or from Washington DC to Los Angeles, latency, jitter, packet loss, and throughput affect network performance. At Microsoft, we choose and use direct interconnects instead of transit-links. This approach ensures symmetric response traffic and helps minimize hops, peering parties, and paths to keep them as short and simple as possible.

For example, if you access a service in Tokyo from London, the internet traffic enters one of our edges in London, travels over the Microsoft WAN through France, our Trans-Arabia paths between Europe and India, and then to Japan where the service resides. Response traffic is symmetric. This data travel is called [cold-potato routing](https://en.wikipedia.org/wiki/Hot-potato_and_cold-potato_routing). Traffic stays on the Microsoft network as long as possible before it's handed off.

Does all traffic between Microsoft services stay on the global network? Yes, any traffic between datacenters, within Microsoft Azure, or between Microsoft services such as Virtual Machines, Microsoft 365, XBOX, SQL databases, Storage, and virtual networks routes within our global network and never over the public internet. This routing ensures optimal performance and integrity.

Massive investments in fiber capacity and diversity across metro, terrestrial, and submarine paths are crucial for us to keep consistent and high service-level while fueling the extreme growth of our cloud and online services.

Recent additions to our global network are:

- [MAREA](https://www.submarinecablemap.com/#/submarine-cable/marea) submarine cable. The industry's first Open Line System (OLS) over subsea, between Bilbao, Spain and Virginia Beach, Virginia, USA.

- [AEC](https://www.submarinecablemap.com/#/submarine-cable/aeconnect-1) between New York, USA and Dublin, Ireland.

- [New Cross Pacific (NCP)](https://www.submarinecablemap.com/#/submarine-cable/new-cross-pacific-ncp-cable-system) between Tokyo, Japan, and Portland, Oregon, USA.

## Connectivity services

You can build advanced overlay architectures on top of the global network. Azure offers a portfolio of connectivity services that spans virtual network peering between regions; hybrid and in-cloud point-to-site and site-to-site architectures; and global IP transit scenarios. To connect a datacenter or network to Azure, or to support significant data ingestion or transit needs, you can choose from options such as [ExpressRoute](../expressroute/expressroute-introduction.md) and [ExpressRoute Direct](../expressroute/expressroute-erdirect-about.md). These options provide bandwidth of up to 100 Gbps directly into Microsoft's global network at peering locations worldwide.

- [**ExpressRoute Global Reach**](../expressroute/expressroute-global-reach.md) complements your service provider's WAN implementation and connects your on-premises sites across the world. If you run a global operation, you can use ExpressRoute Global Reach with your preferred and local service providers to connect all your global sites by using the Microsoft global network. You can expand your cloud-based WAN to include many branch-sites by using Azure Virtual WAN. You can connect your branches to Microsoft's global network seamlessly by using SDWAN and VPN devices (Customer Premises Equipment or CPE) with built-in ease of use and automated connectivity and configuration management.

- [**Global virtual network peering**](../virtual-network/virtual-network-peering-overview.md) connects two or more Azure virtual networks across regions seamlessly. Once peered, the virtual networks appear as one. The Microsoft backbone infrastructure routes traffic between virtual machines in the peered virtual networks, much like it routes traffic between virtual machines in the same virtual network—through private IP addresses only.

## Software-defined network management

As one of the world's top cloud providers, Microsoft has substantial insight and expertise in constructing and managing high-performance global infrastructure.

We adhere to a robust set of operational principles:

- Use best-of-breed switching hardware across the various tiers of the network.

- Deploy new features with zero effect to end users.

- Roll out updates securely and reliably across the fleet, as fast as possible. Hours instead of weeks.

- Use comprehensive cloud-based monitoring and fully automated fault mitigation.

- Use unified and software-defined networking technology to control all hardware elements in the network, eliminate duplication, and reduce failures.

These principles apply to all layers of the network: from the host network interface, switching platform, network functions in the datacenter such as load balancers, all the way up to the WAN with our traffic engineering platform and our optical networks.

The exponential growth of Azure and its network reached a point where human intuition could no longer manage the global network operations. To fulfill the need to validate long, medium, and short-term changes on the network, we developed a platform to mirror and emulate our production network synthetically. By creating mirrored environments and running millions of simulations, we test software and hardware changes and their effects before committing them to our production platform and network.

## Related content

- [Advancing global network reliability through intelligent software](https://azure.microsoft.com/blog/advancing-global-network-reliability-through-intelligent-software-part-1-of-2/)

- [Networking services in Azure](https://azure.microsoft.com/product-categories/networking/)
