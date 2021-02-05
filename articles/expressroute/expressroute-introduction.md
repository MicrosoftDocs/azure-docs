---
title: 'Azure ExpressRoute Overview: Connect over a private connection'
description: The ExpressRoute Technical Overview explains how an ExpressRoute connection works to extend your on-premises network to Azure over a private connection.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: overview
ms.date: 10/05/2020
ms.author: duau

---
# What is Azure ExpressRoute?
ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a private connection with the help of a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure and Microsoft 365.

Connectivity can be from an any-to-any (IP VPN) network, a point-to-point Ethernet network, or a virtual cross-connection through a connectivity provider at a colocation facility. ExpressRoute connections don't go over the public Internet. This allows ExpressRoute connections to offer more reliability, faster speeds, consistent latencies, and higher security than typical connections over the Internet. For information on how to connect your network to Microsoft using ExpressRoute, see [ExpressRoute connectivity models](expressroute-connectivity-models.md).

![ExpressRoute connection overview](./media/expressroute-introduction/expressroute-connection-overview.png)

## Key benefits

* Layer 3 connectivity between your on-premises network and the Microsoft Cloud through a connectivity provider. Connectivity can be from an any-to-any (IPVPN) network, a point-to-point Ethernet connection, or through a virtual cross-connection via an Ethernet exchange.
* Connectivity to Microsoft cloud services across all regions in the geopolitical region.
* Global connectivity to Microsoft services across all regions with the ExpressRoute premium add-on.
* Dynamic routing between your network and Microsoft via BGP.
* Built-in redundancy in every peering location for higher reliability.
* Connection uptime [SLA](https://azure.microsoft.com/support/legal/sla/).
* QoS support for Skype for Business.

For more information, see the [ExpressRoute FAQ](expressroute-faqs.md).

## Features

### Layer 3 connectivity
Microsoft uses BGP, an industry standard dynamic routing protocol, to exchange routes between your on-premises network, your instances in Azure, and Microsoft public addresses. We establish multiple BGP sessions with your network for different traffic profiles. More details can be found in the [ExpressRoute circuit and routing domains](expressroute-circuit-peerings.md) article.

### Redundancy
Each ExpressRoute circuit consists of two connections to two Microsoft Enterprise edge routers (MSEEs) at an [ExpressRoute Location](./expressroute-locations.md#expressroute-locations) from the connectivity provider/your network edge. Microsoft requires dual BGP connection from the connectivity provider/your network edge – one to each MSEE. You may choose not to deploy redundant devices/Ethernet circuits at your end. However, connectivity providers use redundant devices to ensure that your connections are handed off to Microsoft in a redundant manner. A redundant Layer 3 connectivity configuration is a requirement for our [SLA](https://azure.microsoft.com/support/legal/sla/) to be valid.

### Connectivity to Microsoft cloud services
ExpressRoute connections enable access to the following services:
* Microsoft Azure services
* Microsoft 365 services

> [!NOTE]
> [!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]
> 

For a detailed list of services supported over ExpressRoute, visit the [ExpressRoute FAQ](expressroute-faqs.md) page.

### Connectivity to all regions within a geopolitical region
You can connect to Microsoft in one of our [peering locations](expressroute-locations.md) and access regions within the geopolitical region.

For example, if you connect to Microsoft in Amsterdam through ExpressRoute. You'll have access to all Microsoft cloud services hosted in Northern and Western Europe. For an overview of the geopolitical regions, the associated Microsoft cloud regions, and corresponding ExpressRoute peering locations, see the [ExpressRoute partners and peering locations](expressroute-locations.md) article.

### Global connectivity with ExpressRoute Premium
You can enable [ExpressRoute Premium](expressroute-faqs.md) to extend connectivity across geopolitical boundaries. For example, if you connect to Microsoft in Amsterdam through ExpressRoute you'll have access to all Microsoft cloud services hosted in all regions across the world. You can also access services deployed in South America or Australia the same way you access North and West Europe regions. National clouds are excluded.

### Local connectivity with ExpressRoute Local
You can transfer data cost-effectively by enabling the [Local SKU](expressroute-faqs.md). With Local SKU, you can bring your data to an ExpressRoute location near the Azure region you want. With Local, Data transfer is included in the ExpressRoute port charge. 

### Across on-premises connectivity with ExpressRoute Global Reach
You can enable ExpressRoute Global Reach to exchange data across your on-premises sites by connecting your ExpressRoute circuits. For example, if you have a private data center in California connected to an ExpressRoute circuit in Silicon Valley and another private data center in Texas connected to an ExpressRoute circuit in Dallas. With ExpressRoute Global Reach, you can connect your private data centers together through these two ExpressRoute circuits. Your cross-data-center traffic will traverse through Microsoft's network.

For more information, see [ExpressRoute Global Reach](expressroute-global-reach.md).
### Rich connectivity partner ecosystem
ExpressRoute has a constantly growing ecosystem of connectivity providers and systems integrator partners. For the latest information, refer to [ExpressRoute partners and peering locations](expressroute-locations.md).

### Connectivity to national clouds
Microsoft operates isolated cloud environments for special geopolitical regions and customer segments. Refer to the [ExpressRoute partners and peering locations](expressroute-locations.md) page for a list of national clouds and providers.

### ExpressRoute Direct
ExpressRoute Direct provides customers the opportunity to connect directly into Microsoft’s global network at peering locations strategically distributed across the world. ExpressRoute Direct provides dual 100-Gbps connectivity, which supports Active/Active connectivity at scale.

Key features that ExpressRoute Direct provides include, but aren't limited to:

* Massive Data Ingestion into services like Storage and Cosmos DB
* Physical isolation for industries that are regulated and require dedicated and isolated connectivity, such as: Banking, Government, and Retail
* Granular control of circuit distribution based on business unit

For more information, see [About ExpressRoute Direct](./expressroute-erdirect-about.md).

### Bandwidth options
You can purchase ExpressRoute circuits for a wide range of bandwidths. The supported bandwidths are listed as followed. Be sure to check with your connectivity provider to determine the bandwidths they support.

* 50 Mbps
* 100 Mbps
* 200 Mbps
* 500 Mbps
* 1 Gbps
* 2 Gbps
* 5 Gbps
* 10 Gbps

### Dynamic scaling of bandwidth
You can increase the ExpressRoute circuit bandwidth (on a best effort basis) without having to tear down your connections. For more information, see [Modifying an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md#modify).

### Flexible billing models
You can pick a billing model that works best for you. Choose between the billing models listed as followed. For more information, see [ExpressRoute FAQ](expressroute-faqs.md).

* **Unlimited data**. Billing is based on a monthly fee; all inbound and outbound data transfer is included free of charge.
* **Metered data**. Billing is based on a monthly fee; all inbound data transfer is free of charge. Outbound data transfer is charged per GB of data transfer. Data transfer rates vary by region.
* **ExpressRoute premium add-on**. ExpressRoute premium is an add-on to the ExpressRoute circuit. The ExpressRoute premium add-on provides the following capabilities: 
  * Increased route limits for Azure public and Azure private peering from 4,000 routes to 10,000 routes.
  * Global connectivity for services. An ExpressRoute circuit created in any region (excluding national clouds) will have access to resources across every other region in the world. For example, a virtual network created in West Europe can be accessed through an ExpressRoute circuit provisioned in Silicon Valley.
  * Increased number of VNet links per ExpressRoute circuit from 10 to a larger limit, depending on the bandwidth of the circuit.

## FAQ
For frequently asked questions about ExpressRoute, see [ExpressRoute FAQ](expressroute-faqs.md).

## <a name="new"></a>What's new?

Subscribe to the RSS feed and view the latest ExpressRoute feature updates on the [Azure Updates](https://azure.microsoft.com/updates/?category=networking&query=ExpressRoute) page.

## Next steps
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).
* Learn about [ExpressRoute connectivity models](expressroute-connectivity-models.md).
* Find a service provider. See [ExpressRoute partners and peering locations](expressroute-locations.md).