---
title: 'Microsoft global network - Azure'
description: Learn how Microsoft builds and operates one of the largest backbone networks in the world, and why it's central to delivering a great cloud experience.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 04/06/2023
ms.author: allensu
---

# Microsoft global network

Microsoft owns and operates one of the largest backbone networks in the world. This global and sophisticated architecture, spanning more than 165,000 miles, connects our datacenters and customers. 
 
Every day, customers around the world connect and pass trillions of requests to Microsoft Azure, Bing, Dynamics 365, Microsoft 365, XBox, and many others. Regardless of type, customers expect instant reliability and responsiveness from our services. 

The [Microsoft global network](https://azure.microsoft.com/global-infrastructure/global-network/) (WAN) is a central part of delivering a great cloud experience. The global network connects our Microsoft [data centers](https://azure.microsoft.com/global-infrastructure/) across 61 Azure regions with a large mesh of edge-nodes strategically placed around the world. The Microsoft global network offers both the availability, capacity, and the flexibility to meet any demand.

:::image type="content" source="./media/microsoft-global-network/microsoft-global-wan.png" alt-text="Diagram of Microsoft global network.":::

## Get the premium cloud network
 
Opting for the [best possible experience](https://www.sdxcentral.com/articles/news/azure-tops-aws-gcp-in-cloud-performance-says-thousandeyes/2018/11/) is easy when you use Microsoft cloud. From the moment when customer traffic enters our global network through our strategically placed edge-nodes, your data travels through optimized routes at near the speed of light. These edge-nodes, all interconnected to more than 4000 unique Internet partners (peers) through thousands of connections in more than 175 locations, provide the foundation of our interconnection strategy. 
 
Whether connecting from London to Tokyo, or from Washington DC to Los Angeles, latency, jitter, packet loss, and throughput affect network performance. At Microsoft, we choose and utilize direct interconnects instead of transit-links. This approach ensures symmetric response traffic and helps to minimize hops, peering parties, and paths to keep them as short and simple as possible.

For example, if a user in London accesses a service in Tokyo, the Internet traffic enters one of our edges in London, travels over the Microsoft WAN through France, our Trans-Arabia paths between Europe and India, and then to Japan where the service resides. Response traffic is symmetric. This data travel is referred to as [cold-potato routing](https://en.wikipedia.org/wiki/Hot-potato_and_cold-potato_routing). Traffic stays on Microsoft network as long as possible before it's handed off.  
  
So, does that mean all traffic when using Microsoft services? Yes, any traffic between data centers, within Microsoft Azure or between Microsoft services such as Virtual Machines, Microsoft 365, XBox, SQL DBs, Storage, and virtual networks routes within our global network and never over the public Internet. This routing ensures optimal performance and integrity.  
 
Massive investments in fiber capacity and diversity across metro, terrestrial, and submarine paths are crucial for us to keep consistent and high service-level while fueling the extreme growth of our cloud and online services. 

Recent additions to our global network are:

* [MAREA](https://www.submarinecablemap.com/#/submarine-cable/marea) submarine cable. The industry's first Open Line System (OLS) over subsea, between Bilbao, Spain and Virginia Beach, Virginia, USA. 

* [AEC](https://www.submarinecablemap.com/#/submarine-cable/aeconnect-1) between New York, USA and Dublin, Ireland.

* [New Cross Pacific (NCP)](https://www.submarinecablemap.com/#/submarine-cable/new-cross-pacific-ncp-cable-system) between Tokyo, Japan, and Portland, Oregon, USA.  

## Our network is your network

We have put two decades of experience, along with massive investments into the network, to always ensure optimal performance. Businesses can take full advantage of our network assets and build advanced overlay architectures on top. 
 
Microsoft Azure offers the richest portfolio of services and capabilities, allowing customers to quickly and easily build, expand, and meet networking requirements anywhere. Our family of connectivity services spans virtual network peering between regions, hybrid, and in-cloud point-to-site and site-to-site architectures as well as global IP transit scenarios. Enterprises seeking to connect their datacenter or network to Azure or customers with significant data ingestion or transit needs can choose from options such as [ExpressRoute](../expressroute/expressroute-introduction.md) and [ExpressRoute Direct](../expressroute/expressroute-erdirect-about.md). These options provide bandwidth of up to 100 Gbps directly into Microsoft's global network at peering locations worldwide.

* [**ExpressRoute Global Reach**](../expressroute/expressroute-global-reach.md) is designed to complement your service provider's WAN implementation and connect your on-premises sites across the world. If you run a global operation, you can use ExpressRoute Global Reach with your preferred and local service providers to connect all your global sites using the Microsoft global network. You can expand your cloud-based WAN to include a significant number of branch-sites using Azure Virtual WAN. This service enables you to connect your branches to Microsoft's global network seamlessly, using SDWAN and VPN devices (Customer Premises Equipment or CPE) with built-in ease of use and automated connectivity and configuration management. 
 
* [**Global virtual network peering**](../virtual-network/virtual-network-peering-overview.md) enables customers to connect two or more Azure virtual networks across regions seamlessly. Once peered, the virtual networks appear as one. The traffic between virtual machines in the peered virtual networks is routed through the Microsoft backbone infrastructure, much like traffic is routed between virtual machines in the same virtual network - through private IP addresses only. 

## Well managed using software-defined innovation

As one of the world's top cloud providers, Microsoft has acquired substantial insight and expertise in constructing and managing high-performance global infrastructure. 
 
We adhere to a robust set of operational principles: 
 
- Use best-of-breed switching hardware across the various tiers of the network.  

- Deploy new features with zero effect to end users.  

- Roll out updates securely and reliably across the fleet, as fast as possible. Hours instead of weeks.  

- Make use of comprehensive cloud-based monitoring and fully automated fault mitigation. 

- Use unified and software-defined Networking technology to control all hardware elements in the network.  To eliminate duplication and reduce failures. 
 
These principles apply to all layers of the network: from the host network interface, switching platform, network functions in the data center such as load balancers, all the way up to the WAN with our traffic engineering platform and our optical networks.  
 
The exponential growth of Azure and its network has reached a point where we eventually realized that human intuition could no longer be relied on to manage the global network operations. To fulfill the need to validate long, medium, and short-term changes on the network, we developed a platform to mirror and emulate our production network synthetically. The ability to create mirrored environments and run millions of simulations, allows us to test software and hardware changes and their effect, before committing them to our production platform and network. 

## Next steps

- [Learn about how Microsoft is advancing global network reliability through intelligent software](https://azure.microsoft.com/blog/advancing-global-network-reliability-through-intelligent-software-part-1-of-2/)

- [Learn more about the networking services provided in Azure](https://azure.microsoft.com/product-categories/networking/)