---
title: 'Azure ExpressRoute: circuits and peering'
description: This page provides an overview of ExpressRoute circuits and routing domains/peering.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/10/2025
ms.author: duau 
---

# ExpressRoute circuits and peering

ExpressRoute circuits connect your on-premises infrastructure to Microsoft through a connectivity provider. This article explains ExpressRoute circuits and routing domains/peering. The following diagram illustrates the logical connectivity between your WAN and Microsoft.

![Diagram showing how ExpressRoute circuits connect your on-premises infrastructure to Microsoft through a connectivity provider.](./media/expressroute-circuit-peerings/expressroute-basic.png)

> [!NOTE]
> In the context of ExpressRoute, the Microsoft Edge refers to the edge routers on the Microsoft side of the ExpressRoute circuit. This is the entry point of the ExpressRoute circuit into Microsoft's network.

## <a name="circuits"></a>ExpressRoute circuits

An ExpressRoute circuit is a logical connection between your on-premises infrastructure and Microsoft cloud services through a connectivity provider. You can have multiple ExpressRoute circuits, each in the same, or different regions, connected to your premises through different connectivity providers.

ExpressRoute circuits are identified by a standard GUID called a service key (s-key). The s-key is the only information exchanged between Microsoft, the connectivity provider, and you. It isn't a secret for security purposes. Each ExpressRoute circuit has a unique s-key.

New ExpressRoute circuits can include two independent peerings: Private peering and Microsoft peering. Each peering consists of a pair of independent BGP sessions, configured redundantly for high availability. An ExpressRoute circuit can have one, two, or all three peerings enabled.

Each circuit has a fixed bandwidth (50 Mbps, 100 Mbps, 200 Mbps, 500 Mbps, 1 Gbps, 2 Gbps, 5 Gbps, 10 Gbps) shared across all circuit peerings and is mapped to a connectivity provider and a peering location.

### <a name="quotas"></a>Quotas, limits, and limitations

Default quotas and limits apply to every ExpressRoute circuit. Refer to the [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-resource-manager/management/azure-subscription-service-limits.md) page for up-to-date information.

### Circuit SKU upgrade and downgrade

#### Allowed workflow

* Upgrade from Standard to Premium SKU.
* Upgrade from Local to Standard or Premium SKU (using Azure CLI or Azure PowerShell, with billing type as **unlimited**).
* Change from *MeteredData* to *UnlimitedData*.
* Downgrade from Premium SKU to Standard.

#### Unsupported workflow

* Change from *UnlimitedData* to *MeteredData*.

## <a name="routingdomains"></a>ExpressRoute peering

An ExpressRoute circuit has two routing domains/peerings: Azure Private and Microsoft. Each peering is configured identically on a pair of routers for high availability. Azure services are categorized as *Azure public* and *Azure private* to represent the IP addressing schemes.

![Diagram showing how Azure Private and Microsoft peerings are configured in an ExpressRoute circuit.](./media/expressroute-circuit-peerings/expressroute-peerings.png)

### <a name="privatepeering"></a>Azure private peering

Azure compute services, such as virtual machines (IaaS) and cloud services (PaaS), deployed within a virtual network can be connected through the private peering domain. This domain is considered a trusted extension of your core network into Microsoft Azure. You can set up bi-directional connectivity between your core network and Azure virtual networks (VNets), allowing you to connect to virtual machines and cloud services directly on their private IP addresses.

You can connect multiple virtual networks to the private peering domain. Review the [FAQ page](expressroute-faqs.md) for information on limits and limitations. Visit the [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-resource-manager/management/azure-subscription-service-limits.md) page for up-to-date information. Refer to the [Routing](expressroute-routing.md) page for detailed routing configuration information.

### <a name="microsoftpeering"></a>Microsoft peering

[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

Connectivity to Microsoft online services (Microsoft 365, Azure PaaS services, and Microsoft PSTN services) occurs through Microsoft peering. This peering enables bi-directional connectivity between your WAN and Microsoft cloud services. You must connect to Microsoft cloud services over public IP addresses owned by you or your connectivity provider and adhere to all defined rules. For more information, see the [ExpressRoute prerequisites](expressroute-prerequisites.md) page.

For more information on supported services, costs, and configuration details, see the [FAQ page](expressroute-faqs.md). For a list of connectivity providers offering Microsoft peering support, see the [ExpressRoute locations](expressroute-locations.md) page.

> [!IMPORTANT]
> If you're connecting to a service using Microsoft Peering with unlimited data, only egress data won't be charged by ExpressRoute. Egress data will still be charged for services such as compute, storage, or any other services accessed over Microsoft peering, even if the destination is a Microsoft peering public IP address.

## <a name="peeringcompare"></a>Peering comparison

The following table compares the two peerings:

[!INCLUDE [peering comparison](../../includes/expressroute-peering-comparison.md)]

You may enable one or more routing domains as part of your ExpressRoute circuit. You can choose to have all routing domains on the same VPN or separate them into different routing domains. The recommended configuration is to connect private peering directly to the core network, and public and Microsoft peering links to your DMZ.

Each peering requires separate BGP sessions (one pair for each peering type). The BGP session pairs provide a highly available link. If you're connecting through layer 2 connectivity providers, you're responsible for configuring and managing routing. Learn more by reviewing the [workflows](expressroute-workflows.md) for setting up ExpressRoute.

> [!NOTE]
> The default behavior when BGP session prefix limits are exceeded is to terminate the session. If you choose to advertise prefixes received over Microsoft Peering to Private Peering, there is a risk of exceeding these limits, as Microsoft prefixes are updated monthly and can increase significantly. Implement appropriate monitoring to detect prefix changes and consider upgrading the SKU or summarizing routes to manage the number of prefixes advertised from on-premises.

## <a name="health"></a>ExpressRoute health

ExpressRoute circuits can be monitored for availability, connectivity to VNets, and bandwidth utilization using [ExpressRoute Network Insights](expressroute-network-insights.md).

Connection Monitor for ExpressRoute monitors the health of Azure private peering and Microsoft peering. For more information on configuration, see [Configure Connection Monitor for ExpressRoute](how-to-configure-connection-monitor.md).

## Next steps

* Find a service provider. See [ExpressRoute service providers and locations](expressroute-locations.md).
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).
* Configure your ExpressRoute connection.
  * [Create and manage ExpressRoute circuits](expressroute-howto-circuit-portal-resource-manager.md)
  * [Configure routing (peering) for ExpressRoute circuits](expressroute-howto-routing-portal-resource-manager.md)
