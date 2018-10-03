---
title: 'ExpressRoute Overview: Extend your on-premises network to Azure over a private connection | Microsoft Docs'
description: The ExpressRoute Technical Overview explains how an ExpressRoute connection works to extend your on-premises network to Azure over a private connection.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: overview
ms.date: 09/19/2018
ms.author: cherylmc

---
# ExpressRoute overview
Microsoft Azure ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a private connection facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure, Office 365, and Dynamics 365.

Connectivity can be from an any-to-any (IP VPN) network, a point-to-point Ethernet network, or a virtual cross-connection through a connectivity provider at a co-location facility. ExpressRoute connections do not go over the public Internet. This lets ExpressRoute connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the Internet. For information on how to connect your network to Microsoft using ExpressRoute, see [ExpressRoute connectivity models](expressroute-connectivity-models.md).

![](./media/expressroute-introduction/expressroute-connection-overview.png)

## Key benefits

* Layer 3 connectivity between your on-premises network and the Microsoft Cloud through a connectivity provider. Connectivity can be from an any-to-any (IPVPN) network, a point-to-point Ethernet connection, or through a virtual cross-connection via an Ethernet exchange.
* Connectivity to Microsoft cloud services across all regions in the geopolitical region.
* Global connectivity to Microsoft services across all regions with ExpressRoute premium add-on.
* Dynamic routing between your network and Microsoft over industry standard protocols (BGP).
* Built-in redundancy in every peering location for higher reliability.
* Connection uptime [SLA](https://azure.microsoft.com/support/legal/sla/).
* QoS support for Skype for Business.

For more information, see the [ExpressRoute FAQ](expressroute-faqs.md).

## Features

### Layer 3 connectivity
Microsoft uses industry standard dynamic routing protocol (BGP) to exchange routes between your on-premises network, your instances in Azure, and Microsoft public addresses.  We establish multiple BGP sessions with your network for different traffic profiles. More details can be found in the [ExpressRoute circuit and routing domains](expressroute-circuit-peerings.md) article.

### Redundancy
Each ExpressRoute circuit consists of two connections to two Microsoft Enterprise edge routers (MSEEs) from the connectivity provider/your network edge. Microsoft requires dual BGP connection from the connectivity provider/your side – one to each MSEE. You may choose not to deploy redundant devices/Ethernet circuits at your end. However, connectivity providers use redundant devices to ensure that your connections are handed off to Microsoft in a redundant manner. A redundant Layer 3 connectivity configuration is a requirement for our [SLA](https://azure.microsoft.com/support/legal/sla/) to be valid.

### Connectivity to Microsoft cloud services

ExpressRoute connections enable access to the following services:

* Microsoft Azure services
* Microsoft Office 365 services
* Microsoft Dynamics 365

> [!NOTE]
> [!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]
> 

For a detailed list of services supported over ExpressRoute, visit the [ExpressRoute FAQ](expressroute-faqs.md) page 

### Connectivity to all regions within a geopolitical region
You can connect to Microsoft in one of our [peering locations](expressroute-locations.md) and have access to all regions within the geopolitical region. 

For example, if you connected to Microsoft in Amsterdam through ExpressRoute, you have access to all Microsoft cloud services hosted in Northern Europe and Western Europe. For an overview of the geopolitical regions, the associated Microsoft cloud regions, and corresponding ExpressRoute peering locations, see the [ExpressRoute partners and peering locations](expressroute-locations.md) article.

### Global connectivity with ExpressRoute premium add-on
You can enable the ExpressRoute premium add-on feature to extend connectivity across geopolitical boundaries. For example, if you are connected to Microsoft in Amsterdam through ExpressRoute, you will have access to all Microsoft cloud services hosted in all regions across the world (national clouds are excluded). You can access services deployed in South America or Australia the same way you access the North and West Europe regions.

### Across on-premises connectivity with ExpressRoute Global Reach

You can enable ExpressRoute Global Reach to exchange data across your remote sites by connecting your multiple ExpressRoute circuits. For example, if you have a private datacenter in California connected to ExpressRoute in Silicon Valley, and another private datacenter in Texas connected to ExpressRoute in Dallas, with ExpressRoute Global Reach, you can connect your private datacenters together through two ExpressRoute circuits. Your cross-datacenter traffic will traverse through Microsoft's network.

For more information, see [ExpressRoute Global Reach](expressroute-global-reach.md).

### Rich connectivity partner ecosystem
ExpressRoute has a constantly growing ecosystem of connectivity providers and SI partners. For the latest information, refer to the [ExpressRoute providers and locations](expressroute-locations.md) article.

### Connectivity to national clouds
Microsoft operates isolated cloud environments for special geopolitical regions and customer segments. Refer to the [ExpressRoute providers and locations](expressroute-locations.md) page for a list of national clouds and providers.

### ExpressRoute Direct

ExpressRoute Direct provides customers with the ability to connect directly into Microsoft’s global network at peering locations strategically distributed across the world. ExpressRoute Direct provides dual 100Gbps connectivity, which supports Active/Active connectivity at scale. 

Key features that ExpressRoute Direct provide include, but are not limited to:

* Massive Data Ingestion into services like Storage and Cosmos DB 
* Physical isolation for industries that are regulated and required dedicated and isolated connectivity like: Banking, Government, and retail 
* Granular control of circuit distribution based on business unit

For more information, see [About ExpressRoute Direct](https://go.microsoft.com/fwlink/?linkid=2022973).

### Bandwidth options
You can purchase ExpressRoute circuits for a wide range of bandwidths. Supported bandwidths are listed below. Be sure to check with your connectivity provider to determine the list of supported bandwidths they provide.

* 50 Mbps
* 100 Mbps
* 200 Mbps
* 500 Mbps
* 1 Gbps
* 2 Gbps
* 5 Gbps
* 10 Gbps

### Dynamic scaling of bandwidth
You can increase the ExpressRoute circuit bandwidth (on a best effort basis) without having to tear down your connections. 

### Flexible billing models
You can pick a billing model that works best for you. Choose between the billing models listed below. For more information, see the [ExpressRoute FAQ](expressroute-faqs.md).

* **Unlimited data**. The ExpressRoute circuit is charged based on a monthly fee, and all inbound and outbound data transfer is included free of charge. 
* **Metered data**. The ExpressRoute circuit is charged based on a monthly fee. All inbound data transfer is free of charge. Outbound data transfer is charged per GB of data transfer. Data transfer rates vary by region.
* **ExpressRoute premium add-on**. The ExpressRoute premium is an add-on over the ExpressRoute circuit. The ExpressRoute premium add-on provides the following capabilities: 
  * Increased route limits for Azure public and Azure private peering from 4,000 routes to 10,000 routes.
  * Global connectivity for services. An ExpressRoute circuit created in any region (excluding national clouds) will have access to resources across any other region in the world. For example, a virtual network created in West Europe can be accessed through an ExpressRoute circuit provisioned in Silicon Valley.
  * Increased number of VNet links per ExpressRoute circuit from 10 to a larger limit, depending on the bandwidth of the circuit.

## FAQ

For frequently asked questions about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).

## Next steps

* Learn about [ExpressRoute connectivity models](expressroute-connectivity-models.md).
* Learn about ExpressRoute connections and routing domains. See [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).
* Find a service provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).
* Refer to the requirements for [Routing](expressroute-routing.md), [NAT](expressroute-nat.md), and [QoS](expressroute-qos.md).
* Configure your ExpressRoute connection.
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md)
  * [Configure peering for an ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md)
  * [Connect a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
* Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure.
