---
title: 'Microsoft global network - Azure'
description: Describes how Microsoft builds its fast and reliable global network
services: networking
documentationcenter: 
author: KumudD
manager: 
ms.service: networking
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/24/2019
ms.author: ypitsch,kumud

---

# Microsoft global network

Microsoft owns and operates one of the largest backbone networks in the world. This global and sophisticated architecture, spanning more than 100.000 miles, connect our datacenters and customers. 
 
Every day, customers around the world connect and pass trillions of requests to Microsoft Azure, Bing, Dynamics 365, Office 365, Xbox, and many others. Regardless of type, customers expect instant responsiveness and reliability from our services. 
 
The Microsoft global network (WAN) is a central part of delivering a great cloud experience. Connecting our many data centers across 54 Azure regions and large mesh of edge-nodes strategically placed around the world, our global network offers both the availability, capacity, and the flexibility to meet any demand.

![Microsoft global network](./media/microsoft-global-network/microsoft-global-wan.png)
 
## Get the best network we know how to make
 
Opting for the best possible experience is easy when you use Microsoft services. From the moment, when customer traffic enters our global network through our strategically placed edge-nodes or points of presence (POPs), your data travels through optimized routes at near the speed of light, ensuring optimal latency for best performance. These edge-nodes, all interconnected to more than 3500 unique Internet partners (peers)  through thousands of connections in more than 145 locations, provide the foundation of our interconnection strategy. 
 
Whether connecting from London to Tokyo, or from Washington DC to Los Angeles, network performance is quantified and impacted by things such as latency, jitter, packet loss, and throughput.  At Microsoft, we prefer and use direct interconnects as opposed to transit-links, this keeps response traffic symmetric and helps keep hops, peering parties and paths as short and simple as possible. This premium approach, often referred to as "cold potato routing," ensures that customers network traffic remains within the Microsoft network as long as possible before we hand it off.  
 
So, does that mean any and all traffic when using Microsoft services? Yes, any traffic between data centers, within Microsoft Azure or between Microsoft services such as Virtual Machines, SQL DBs, Storage, and virtual networks are routed within our global network and never over the public Internet, to ensure optimal performance and integrity.  
 
Massive investments in fiber capacity and diversity across both metro, terrestrial, and submarine paths are crucial for us to keep consistent and high service-level while fueling the extreme growth of our cloud and online services. Recent additions to our global network are our MAREA submarine cable,  the industry's first Open Line System (OLS) over subsea, between Bilbao, Spain and Virginia Beach, Virginia, USA, which recently went live, as well as the AEC between New York, USA and Dublin, Ireland and New Cross Pacific (NCP) between Tokyo, Japan, and Portland, Oregon, USA. 
 

## Our network is your network

We have put two decades of experience, along with massive investments into the network, so you don't have to. Customers can take full advantage of our network assets and build advanced overlay architectures on top. 
 
Microsoft Azure offers the richest portfolio of services and capabilities, allowing customers to quickly and easily build, expand, and meet networking requirements anywhere. Our family of connectivity services span virtual network peering between regions, hybrid, and in-cloud point-to-site and site-to-site architectures as well as global IP transit scenarios.  For customers looking to connect there won datacenter or network to Azure, or customers with massive data ingestion or transit needs, ExpressRoute, and ExpressRoute Direct provide options up to 100 Gbps of bandwidth, directly into Microsoft's global network at peering locations across the world.  
 
ExpressRoute Global Reach is designed to complement your service provider's WAN implementation and connect your on-premises sites across the world. For example, if you run a global operation and your network service provider primarily operates in the United States, interconnecting your sites there,  you can use ExpressRoute Global Reach with a local service provider in other locations and using Microsoft to connect those locations with to the ones in the United States. Additionally, expanding your new network in the cloud (WAN) to encompass large numbers of branch-sites can be accomplished through Azure Virtual WAN, which brings the ability to seamlessly connect your branches to Microsoft global network with SDWAN & VPN devices (that is, Customer Premises Equipment or CPE) with built-in ease of use and automated connectivity and configuration management. 
 
Global VNet peering enables you to connect two or more Azure virtual networks across regions seamlessly. Once peered, the virtual networks appear as one. The traffic between virtual machines in the peered virtual networks is routed through the Microsoft backbone infrastructure, much like traffic is routed between virtual machines in the same virtual network - through private IP addresses only. 
 

## Well managed using software-defined tooling

Running one of the leading clouds in the world, Microsoft has gained a lot of insight and experience in building and managing high-performance global infrastructure.  
 
We adhere to a robust set of operational principles: 
 
- Use best-of-breed switching hardware across the various tiers of the network.  
- Deploy new features with zero impact to end users.  
- Roll out updates securely and reliably across the fleet, as fast as possible. Hours instead of weeks.  
- Utilize cloud-scale deep telemetry and fully automated fault mitigation.  
- Use unified and software-defined Networking technology to control all hardware elements in the network.  Eliminating duplication and reduce failures. 
 
These principles apply to all layers of the network: from the host Network Interface, switching platform, network functions in the data center such as Load Balancers, all the way up to the WAN with our SWAN traffic engineering platform and our optical networks.  
 
The exponential growth of Azure and its network has reached a point where we eventually realized that human intuition could no longer be relied on to manage the global network operations. To fulfill the need to validate long, medium, and short-term changes on the network, we developed a platform to mirror and emulate our production network synthetically. The ability to create mirrored environments and run millions of simulations, allows us to test soft- and hardware changes and their impact, before committing them to our production platform and network. 

## Next steps
- [Learn more about the networking services provided in Azure](https://azure.microsoft.com/product-categories/networking/)