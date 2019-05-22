---
title: 'Microsoft global network - Azure'
description: Describes how Microsoft builds its fast and reliable global network
services: networking
documentationcenter: 
author: ypitsch
manager: 
ms.service: networking
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/22/2019
ms.author: ypitsch,kumud

---
# Microsoft global network

Microsoft owns and operates one of the largest backbone networks in the world, connecting our datacenters and customers. 

Every day, customers around the world connect to Microsoft Azure, Bing, Dynamics 365, Office 365, OneDrive, XBox, and many other services through trillions of requests. These requests are for diverse types of data, such as enterprise cloud applications and email, VOIP, streaming video, IoT, search, and cloud storage. Customers expect instant responsiveness and reliability from our services. 

The Microsoft global wide-area network (WAN) plays an important part in delivering a great cloud service experience. Connecting hundreds of datacenters in 54 regions around the world, our global network offers the availability, high capacity, and the flexibility to respond to unpredictable demand spikes. 

## Best network experience out of the box 
You want a fast, reliable response when you use Microsoft services. Data travels over our network at nearly the speed of light; network speed, or latency, is a function of distance from the customer to the datacenter. 

Customer traffic enters our global network through strategically placed Microsoft Edge nodes, our points of presence. These edge nodes are directly interconnected to more than 3500 unique Internet partners through thousands of connections in more than 145 locations. Our rich interconnection strategy optimizes the paths that data travels on our global network. Customers get a better network experience with less latency, jitter, and packet loss with more throughput. Direct interconnections give customers better quality of service compared to transit links, because there are fewer hops, fewer parties, and better networking paths. 

Say you’re in London and the service is in Tokyo: Internet traffic enters one of our edges in London, goes over Microsoft WAN through France, our Trans-Arabia paths between Europe and India and then to Japan where the service is hosted. Response traffic is symmetric. This is sometimes referred to as [cold-potato routing, which means that traffic stays on Microsoft network as long as possible before we hand it off. 

Azure traffic between our datacenters stays on our network and does not flow over the Internet. This includes all traffic between Microsoft services anywhere in the world. For example, within Azure, traffic between virtual machines, storage, and SQL communication traverses only the Microsoft network, regardless of the source and destination region. [Intra-region VNet-to-VNet traffic](../virtual-network/virtual-network-peering-overview.md), as well as [cross-region VNet-to-VNet traffic](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md), stays on our secure Microsoft network. 

To support the tremendous growth of our cloud services and maintain consistent service level agreements, we have invested massively in fiber capacity and diversity in metro, terrestrial and submarine paths. Our [MAREA](https://www.submarinecablemap.com/#/submarine-cable/marea) submarine cable, industry’s first Open Line System (OLS) over subsea, between Bilbao, Spain and Virginia Beach, Virginia, USA is live as well as [AEC](https://www.submarinecablemap.com/#/submarine-cable/aeconnect-1) between New York, USA and Dublin, Ireland and [New Cross Pacific (NCP)](https://www.submarinecablemap.com/#/submarine-cable/new-cross-pacific-ncp-cable-system) between Tokyo, Japan, and Portland, Oregon, USA.

## Empower our customers to leverage our backbone

Whether you need private connectivity and just public internet, any of the services you deploy or consume will get benefits from the global network. Here are examples of services that empower you to build your own network overlay on top of our physical network:

- [ExpressRoute Direct](../expressroute/expressroute-erdirect-about.md) provides customers with the ability to connect directly into Microsoft’s global network at peering locations strategically distributed across the world. ExpressRoute Direct provides dual 100-Gbps connectivity, which supports Active/Active connectivity at scale.

- [ExpressRoute Global Reach](../expressroute/expressroute-global-reach.md) is designed to complement your service provider’s WAN implementation and connect your branch offices across the world. For example, if your service provider primarily operates in the United States and has linked all of your branches in the U.S., but the service provider doesn’t operate in Japan and Hong Kong, with ExpressRoute Global Reach you can work with a local service provider and Microsoft will connect your branches there to the ones in the U.S. using ExpressRoute and our global network.

- [Azure Virtual WAN](https://azure.microsoft.com/services/virtual-wan/) service provides optimized, automated, and global scale branch connectivity. Virtual WAN brings the ability to seamlessly connect your branches to Microsoft global network with SDWAN & VPN devices (that is, Customer Premises Equipment or CPE) with built-in ease of use and automated connectivity and configuration management.

- [Global VNet peering](../virtual-network/virtual-network-peering-overview.md) enables you to seamlessly connect two or more Azure virtual networks across regions. Once peered, the virtual networks appear as one, for connectivity purposes. The traffic between virtual machines in the peered virtual networks is routed through the Microsoft backbone infrastructure, much like traffic is routed between virtual machines in the same virtual network, through private IP addresses only.

## Controlling operations and managing traffic with software

Running one of the largest clouds in the world, Microsoft has gained a lot of insight into building and managing a global, high performance, highly available, and secure network. Experience has taught us that with hundreds of datacenters and tens of thousands of switches, we needed to:
- Use best-of-breed switching hardware for the various tiers of the network. 
- Deploy new features without impacting end users. 
- Roll out updates securely and reliably across the fleet in hours instead of weeks. 
- Utilize cloud-scale deep telemetry and fully automated failure mitigation. 
- Enable our Software-Defined Networking technology to easily control all hardware elements in the network using a unified structure to eliminate duplication and reduce failures

These principles are applied in each layer in the network: from the host Network Interface, [switching platform](https://azure.github.io/SONiC/), Network functions in the data center such as [Load Balancer](https://azure.microsoft.com/blog/the-new-azure-load-balancer-10x-scale-increase/), up to the WAN with our [SWAN](https://www.microsoft.com/en-us/research/publication/achieving-high-utilization-with-software-driven-wan/) traffic engineering platform and our [optical networks](https://www.microsoft.com/en-us/research/people/mafiler/#!publications).

Exponential growth of Azure network has reached a point where human intuition can no longer be relied on to manage the global network operations. To fulfill the need to validate long, medium, and short-term changes on the network, we developed a platform to emulate and simulate the production network: 
- [Open Network Emulator](https://conferences.sigcomm.org/sigcomm/2018/files/indus-demos-final-versions/final-ONE-Microsoft-demo.pdf) (ONE) emulates large-scale production networks to significantly decrease network incidents caused by software, configurations, and human errors. Developed with Research teams, we built a mirror of the Azure production network to test hardware and software changes before they're made to Azure. 
- Real-time Operations Checker (ROC) can analyze all network failure scenarios by running several 100 million of simulations within seconds, allowing engineers to make safe operations. ROC can answer questions like what if the demand doubles or triples in each data center, market, or application class? What if a planned and unplanned change reduces networks capacity, Can I still make a safe network policy or topology change?

Whether you choose to reach the Microsoft cloud through the Internet or through a private network, we are committed to building the fastest and most reliable global network of any public cloud. We continue innovating and investing in a globally distributed networking platform to enable high performance, low latency, and the world’s most reliable cloud. We will continue to provide you with the best possible network experience, wherever in the world you happen to be.

## Next steps
- [Learn more about the networking services provided in Azure](https://azure.microsoft.com/product-categories/networking/)