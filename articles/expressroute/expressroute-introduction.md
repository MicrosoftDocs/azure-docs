---
title: 'ExpressRoute Overview: Extend your on-premises network to Azure over a dedicated private connection | Microsoft Docs'
description: This ExpressRoute Technical Overview explains how an ExpressRoute connection works to extend your on-premises network to Azure over a dedicated private connection.
documentationcenter: na
services: expressroute
author: cherylmc
manager: timlt
editor: ''

ms.assetid: fd95dcd5-df1d-41d6-85dd-e91d0091af05
ms.service: expressroute
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/12/2017
ms.author: cherylmc

---
# ExpressRoute overview
Microsoft Azure ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a dedicated private connection facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure, Office 365, and Dynamics 365.

Connectivity can be from an any-to-any (IP VPN) network, a point-to-point Ethernet network, or a virtual cross-connection through a connectivity provider at a co-location facility. ExpressRoute connections do not go over the public Internet. This allows ExpressRoute connections to offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the Internet. For information on how to connect your network to Microsoft using ExpressRoute, see [ExpressRoute connectivity models](expressroute-connectivity-models.md).

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
Each ExpressRoute circuit consists of two connections to two Microsoft Enterprise edge routers (MSEEs) from the connectivity provider / your network edge. Microsoft requires dual BGP connection from the connectivity provider / your side – one to each MSEE. You may choose not to deploy redundant devices / Ethernet circuits at your end. However, connectivity providers use redundant devices to ensure that your connections are handed off to Microsoft in a redundant manner. A redundant Layer 3 connectivity configuration is a requirement for our [SLA](https://azure.microsoft.com/support/legal/sla/) to be valid.

### Connectivity to Microsoft cloud services
[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

ExpressRoute connections enable access to the following services:

* Microsoft Azure services
* Microsoft Office 365 services
* Microsoft Dynamics 365

You can visit the [ExpressRoute FAQ](expressroute-faqs.md) page for a detailed list of services supported over ExpressRoute.

### Connectivity to all regions within a geopolitical region
You can connect to Microsoft in one of our [peering locations](expressroute-locations.md) and have access to all regions within the geopolitical region. 

For example, if you connected to Microsoft in Amsterdam through ExpressRoute, you have access to all Microsoft cloud services hosted in Northern Europe and Western Europe. See the [ExpressRoute partners and peering locations](expressroute-locations.md) article for an overview of the geopolitical regions, associated Microsoft cloud regions, and corresponding ExpressRoute peering locations.

### Global connectivity with ExpressRoute premium add-on
You can enable the ExpressRoute premium add-on feature to extend connectivity across geopolitical boundaries. For example, if you are connected to Microsoft in Amsterdam through ExpressRoute, you will have access to all Microsoft cloud services hosted in all regions across the world (national clouds are excluded). You can access services deployed in South America or Australia the same way you access the North and West Europe regions.

### Rich connectivity partner ecosystem
ExpressRoute has a constantly growing ecosystem of connectivity providers and SI partners. You can refer to the [ExpressRoute providers and locations](expressroute-locations.md) article for the latest information.

### Connectivity to national clouds
Microsoft operates isolated cloud environments for special geopolitical regions and customer segments. Refer to the [ExpressRoute providers and locations](expressroute-locations.md) page for a list of national clouds and providers.

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
