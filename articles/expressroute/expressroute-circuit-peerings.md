---
title: Azure ExpressRoute circuits and routing domains | Microsoft Docs
description: This page provides an overview of ExpressRoute circuits and the routing domains.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 10/01/2018
ms.author: cherylmc

---
# ExpressRoute circuits and routing domains
 You must order an *ExpressRoute circuit* to connect your on-premises infrastructure to Microsoft through a connectivity provider. The following figure shows a logical representation of connectivity between your WAN and Microsoft.

![](./media/expressroute-circuit-peerings/expressroute-basic.png)

## ExpressRoute circuits
An *ExpressRoute circuit* represents a logical connection between your on-premises infrastructure and Microsoft cloud services through a connectivity provider. You can order multiple ExpressRoute circuits. Each circuit can be in the same or different regions, and can be connected to your premises through different connectivity providers. 

ExpressRoute circuits do not map to any physical entities. A circuit is uniquely identified by a standard GUID called as a service key (s-key). The service key is the only piece of information exchanged between Microsoft, the connectivity provider, and you. The s-key is not a secret for security purposes. There is a 1:1 mapping between an ExpressRoute circuit and the s-key.

An ExpressRoute circuit can have up to three independent peerings: Azure public, Azure private, and Microsoft. Each peering is a pair of independent BGP sessions each of them configured redundantly for high availability. There is a 1:N (1 <= N <= 3) mapping between an ExpressRoute circuit and routing domains. An ExpressRoute circuit can have any one, two, or all three peerings enabled per ExpressRoute circuit.

Each circuit has a fixed bandwidth (50 Mbps, 100 Mbps, 200 Mbps, 500 Mbps, 1 Gbps, 10 Gbps) and is mapped to a connectivity provider and a peering location. The bandwidth you select is shared across all the peerings for the circuit. 

### Quotas, limits, and limitations
Default quotas and limits apply for every ExpressRoute circuit. Refer to the [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md) page for up-to-date information on quotas.

## ExpressRoute routing domains
An ExpressRoute circuit has multiple routing domains associated with it: Azure public, Azure private, and Microsoft. Each of the routing domains is configured identically on a pair of routers (in active-active or load sharing configuration) for high availability. Azure services are categorized as *Azure public* and *Azure private* to represent the IP addressing schemes.

![](./media/expressroute-circuit-peerings/expressroute-peerings.png)

### Azure private peering
Azure compute services, namely virtual machines (IaaS) and cloud services (PaaS), that are deployed within a virtual network can be connected through the private peering domain. The private peering domain is considered to be a trusted extension of your core network into Microsoft Azure. You can set up bi-directional connectivity between your core network and Azure virtual networks (VNets). This peering lets you connect to virtual machines and cloud services directly on their private IP addresses.  

You can connect more than one virtual network to the private peering domain. Review the [FAQ page](expressroute-faqs.md) for information on limits and limitations. You can visit the [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md) page for up-to-date information on limits.  Refer to the [Routing](expressroute-routing.md) page for detailed information on routing configuration.

### Microsoft peering

[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

Connectivity to Microsoft online services (Office 365, Dynamics 365, and Azure PaaS services) is through the Microsoft peering. We enable bi-directional connectivity between your WAN and Microsoft cloud services through the Microsoft peering routing domain. You must connect to Microsoft cloud services only over public IP addresses that are owned by you or your connectivity provider and you must adhere to all the defined rules. For more information, see the [ExpressRoute prerequisites](expressroute-prerequisites.md) page.

See the [FAQ page](expressroute-faqs.md) for more information on services supported, costs, and configuration details. See the [ExpressRoute Locations](expressroute-locations.md) page for information on the list of connectivity providers offering Microsoft peering support.

### <a name="azure-public-peering"></a>Azure public peering (deprecated for new circuits)

> [!IMPORTANT]
> Azure public peering is not available for new circuits.  
>   

Services such as Azure Storage, SQL databases, and Websites are offered on public IP addresses. You can privately connect to services hosted on public IP addresses, including VIPs of your cloud services, through the public peering routing domain. You can connect the public peering domain to your DMZ and connect to all Azure services on their public IP addresses from your WAN without having to connect through the internet. 

Connectivity is always initiated from your WAN to Microsoft Azure services. Microsoft Azure services will not be able to initiate connections into your network through this routing domain. Once public peering is enabled, you can connect to all Azure services. We do not allow you to selectively pick services for which we advertise routes to.

You can define custom route filters within your network to consume only the routes you need. Refer to the [Routing](expressroute-routing.md) page for detailed information on routing configuration. 

For more information about services supported through the public peering routing domain, see the [FAQ](expressroute-faqs.md).

## Routing domain comparison
The following table compares the three routing domains:

|  | **Private Peering** | **Microsoft Peering** |  **Public Peering** (deprecated for circuits) |
| --- | --- | --- | --- |
| **Max. # prefixes supported per peering** |4000 by default, 10,000 with ExpressRoute Premium |200 |200 |
| **IP address ranges supported** |Any valid IP address within your WAN. |Public IP addresses owned by you or your connectivity provider. |Public IP addresses owned by you or your connectivity provider. |
| **AS Number requirements** |Private and public AS numbers. You must own the public AS number if you choose to use one. |Private and public AS numbers. However, you must prove ownership of public IP addresses. |Private and public AS numbers. However, you must prove ownership of public IP addresses. |
| **IP protocols supported**| IPv4 |  IPv4, IPv6 | IPv4 |
| **Routing Interface IP addresses** |RFC1918 and public IP addresses |Public IP addresses registered to you in routing registries. |Public IP addresses registered to you in routing registries. |
| **MD5 Hash support** |Yes |Yes |Yes |

You can choose to enable one or more of the routing domains as part of your ExpressRoute circuit. You can choose to have all the routing domains put on the same VPN if you want to combine them into a single routing domain. You can also put them on different routing domains, similar to the diagram. The recommended configuration is that private peering is connected directly to the core network, and the public and Microsoft peering links are connected to your DMZ.

If you choose to have all three peering sessions, you must have three pairs of BGP sessions (one pair for each peering type). The BGP session pairs provide a highly available link. If you are connecting through layer 2 connectivity providers, you are responsible for configuring and managing routing. You can learn more by reviewing the [workflows](expressroute-workflows.md) for setting up ExpressRoute.

## ExpressRoute health
ExpressRoute circuits may be monitored for availability, connectivity to VNets and bandwidth utilization using [Network Performance Monitor](https://docs.microsoft.com/azure/networking/network-monitoring-overview) (NPM).

NPM monitors the health of Azure private peering and Microsoft peering.  Check out our [post](https://azure.microsoft.com/en-in/blog/monitoring-of-azure-expressroute-in-preview/) for more information.

## Next steps
* Find a service provider. See [ExpressRoute service providers and locations](expressroute-locations.md).
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).
* Configure your ExpressRoute connection.
  * [Create and manage ExpressRoute circuits](expressroute-howto-circuit-portal-resource-manager.md)
  * [Configure routing (peering) for ExpressRoute circuits](expressroute-howto-routing-portal-resource-manager.md)

