---
title: 'Azure ExpressRoute: circuits and peering'
description: This page provides an overview of ExpressRoute circuits and routing domains/peering.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: conceptual
ms.date: 09/06/2023
ms.author: duau 

---
# ExpressRoute circuits and peering

> [!IMPORTANT]
> Public peering for ExpressRoute is being retired on **March 31, 2024**. For more information, see [**retirement notice**](https://azure.microsoft.com/updates/retirement-notice-migrate-from-public-peering-by-march-31-2024/).

ExpressRoute circuits connect your on-premises infrastructure to Microsoft through a connectivity provider. This article helps you understand ExpressRoute circuits and routing domains/peering. The following figure shows a logical representation of connectivity between your WAN and Microsoft.

![Diagram showing how ExpressRoute circuits connect your on-premises infrastructure to Microsoft through a connectivity provider.](./media/expressroute-circuit-peerings/expressroute-basic.png)

> [!NOTE]
> * In the context of ExpressRoute, the Microsoft Edge describes the edge routers on the Microsoft side of the ExpressRoute circuit. This is the ExpressRoute circuit's point of entry into Microsoft's network.
> * Azure public peering has been deprecated and is not available for new ExpressRoute circuits. New circuits support Microsoft peering and private peering.  
>

## <a name="circuits"></a>ExpressRoute circuits

An ExpressRoute circuit represents a logical connection between your on-premises infrastructure and Microsoft cloud services through a connectivity provider. You can have multiple ExpressRoute circuits. Each circuit can be in the same or different regions, and can be connected to your premises through different connectivity providers.

ExpressRoute circuits don't map to any physical entities. A circuit is uniquely identified by a standard GUID called as a service key (s-key). The service key is the only piece of information exchanged between Microsoft, the connectivity provider, and you. The s-key isn't a secret for security purposes. There's a 1:1 mapping between an ExpressRoute circuit and the s-key.

New ExpressRoute circuits can include two independent peerings: Private peering and Microsoft peering. Whereas existing ExpressRoute circuits may have three peerings: Azure Public, Azure Private and Microsoft. Each peering is a pair of independent BGP sessions, each of them configured redundantly for high availability. There's a 1:N (1 <= N <= 3) mapping between an ExpressRoute circuit and routing domains. An ExpressRoute circuit can have any one, two, or all three peerings enabled per ExpressRoute circuit.

Each circuit has a fixed bandwidth (50 Mbps, 100 Mbps, 200 Mbps, 500 Mbps, 1 Gbps, 2 Gbps, 5 Gbps, 10 Gbps) and is mapped to a connectivity provider and a peering location. The bandwidth you select is shared across all circuit peerings

### <a name="quotas"></a>Quotas, limits, and limitations

Default quotas and limits apply for every ExpressRoute circuit. Refer to the [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-resource-manager/management/azure-subscription-service-limits.md) page for up-to-date information on quotas.

### Circuit SKU upgrade and downgrade

#### Allowed workflow

* Upgrade from Standard to Premium SKU.
* Upgrade from Local to Standard or Premium SKU.
    * Can only be done using Azure CLI or Azure PowerShell.
    * Billing type must be **unlimited**.
* Changing from *MeteredData* to *UnlimitedData*.
* Downgrade from Premium SKU to Standard.

#### Unsupported workflow

* Changing from *UnlimitedData* to *MeteredData*.

## <a name="routingdomains"></a>ExpressRoute peering

An ExpressRoute circuit has multiple routing domains/peerings associated with it: Azure public, Azure private, and Microsoft. Each peering is configured identically on a pair of routers (in active-active or load sharing configuration) for high availability. Azure services are categorized as *Azure public* and *Azure private* to represent the IP addressing schemes.

![Diagram showing how Azure public, Azure private, and Microsoft peerings are configured in an ExpressRoute circuit.](./media/expressroute-circuit-peerings/expressroute-peerings.png)

### <a name="privatepeering"></a>Azure private peering

Azure compute services, namely virtual machines (IaaS) and cloud services (PaaS), that are deployed within a virtual network can be connected through the private peering domain. The private peering domain is considered to be a trusted extension of your core network into Microsoft Azure. You can set up bi-directional connectivity between your core network and Azure virtual networks (VNets). This peering lets you connect to virtual machines and cloud services directly on their private IP addresses.  

You can connect more than one virtual network to the private peering domain. Review the [FAQ page](expressroute-faqs.md) for information on limits and limitations. You can visit the [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-resource-manager/management/azure-subscription-service-limits.md) page for up-to-date information on limits.  Refer to the [Routing](expressroute-routing.md) page for detailed information on routing configuration.

### <a name="microsoftpeering"></a>Microsoft peering

[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

Connectivity to Microsoft online services (Microsoft 365, Azure PaaS services and Microsoft PSTN services) occurs through Microsoft peering. We enable bi-directional connectivity between your WAN and Microsoft cloud services through the Microsoft peering routing domain. You must connect to Microsoft cloud services only over public IP addresses that are owned by you or your connectivity provider and you must adhere to all the defined rules. For more information, see the [ExpressRoute prerequisites](expressroute-prerequisites.md) page.

For more information on services supported, costs, and configuration details, see the [FAQ page](expressroute-faqs.md). For information on the list of connectivity providers offering Microsoft peering support, see the [ExpressRoute locations](expressroute-locations.md) page.

> [!IMPORTANT]
> If you're connecting to a service using Microsoft Peering with unlimited data, only egress data won't be charged by ExpressRoute. Egress data will still be charged for services such as compute, storage, or any other services accessed over Microsoft peering even if the destination is a Microsoft peering public IP address.

## <a name="peeringcompare"></a>Peering comparison

The following table compares the three peerings:

[!INCLUDE [peering comparison](../../includes/expressroute-peering-comparison.md)]

You may enable one or more of the routing domains as part of your ExpressRoute circuit. You can choose to have all the routing domains put on the same VPN if you want to combine them into a single routing domain. You can also put them on different routing domains, similar to the diagram. The recommended configuration is that private peering is connected directly to the core network, and the public and Microsoft peering links are connected to your DMZ.

Each peering requires separate BGP sessions (one pair for each peering type). The BGP session pairs provide a highly available link. If you're connecting through layer 2 connectivity providers, you're responsible for configuring and managing routing. You can learn more by reviewing the [workflows](expressroute-workflows.md) for setting up ExpressRoute.

## <a name="health"></a>ExpressRoute health

ExpressRoute circuits can be monitored for availability, connectivity to VNets and bandwidth utilization using [ExpressRoute Network Insights](expressroute-network-insights.md).

Connection Monitor for Expressroute monitors the health of Azure private peering and Microsoft peering. For more information on configuration, see [Configure Connection Monitor for ExpressRoute](how-to-configure-connection-monitor.md).

## Next steps

* Find a service provider. See [ExpressRoute service providers and locations](expressroute-locations.md).
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).
* Configure your ExpressRoute connection.
  * [Create and manage ExpressRoute circuits](expressroute-howto-circuit-portal-resource-manager.md)
  * [Configure routing (peering) for ExpressRoute circuits](expressroute-howto-routing-portal-resource-manager.md)
