---
title: What is Azure ExpressRoute FastPath? Features, availability, and limitations
description: Discover Azure ExpressRoute FastPath, its features, availability, IP limits, and how it enhances network performance by bypassing the gateway. Learn configuration steps and supported scenarios.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 03/20/2025
ms.author: rmareddy
ms.custom: template-concept, references_regions, engagement-fy23
---

# About ExpressRoute FastPath

ExpressRoute virtual network gateway facilitates the exchange of network routes and directs network traffic. ExpressRoute FastPath enhances data path performance between your on-premises network and your virtual networks. When enabled, ExpressRoute FastPath routes network traffic directly to virtual machines, bypassing the ExpressRoute virtual network gateway.

:::image type="content" source=".\media\about-fastpath\fastpath-vnet-peering.png" alt-text="Diagram of an ExpressRoute connection with ExpressRoute FastPath and virtual network peering.":::

## Availability and features

ExpressRoute FastPath is available for ExpressRoute Direct and ExpressRoute provider circuits. ExpressRoute FastPath is generally available in all public cloud regions, with limited general availability for Private Link and Private endpoint connectivity.

### Circuits

The following table lists the availability of ExpressRoute FastPath for the different type of ExpressRoute circuit:

| Feature | Availability |
|--|--|
| ExpressRoute FastPath to Hub virtual network on ExpressRoute circuits | Available on all ExpressRoute circuits |
| Virtual network peering over ExpressRoute FastPath | Generally available in all public cloud regions and only for ExpressRoute Direct. |
| User-Defined Routing (UDR) over ExpressRoute FastPath | Generally available in all public cloud regions and only for ExpressRoute Direct. |
| Private endpoint and Private Link over ExpressRoute FastPath | Limited general availability and only for ExpressRoute Direct. |

#### IP address limits

ExpressRoute FastPath has IP address limits that are based on the type of ExpressRoute circuit.

> [!IMPORTANT]
> - Azure ExpressRoute Direct has a cumulative limit at the port level.
> - When the limit is reached, new ExpressRoute FastPath routes don't get configured, and instead traffic flows through the ExpressRoute gateway.
> - All other limits for the ExpressRoute gateway, the ExpressRoute circuit, and the virtual network still apply.

The following table lists bandwidth and ExpressRoute FastPath IP limits for ExpressRoute circuits:

| ExpressRoute port type | Bandwidth | ExpressRoute FastPath IP limit |
|--|--|--|
| ExpressRoute Direct | 100 Gbps | 200,000 |
| ExpressRoute Direct | 10 Gbps | 100,000 |
| ExpressRoute provider | 10 Gbps and lower | 25,000 |

> [!TIP]
> You can configure alerts using Azure Monitor to notify you when the number of ExpressRoute FastPath routes approaches the threshold limit.

### Gateways

To use ExpressRoute FastPath, you need to create an ExpressRoute virtual network gateway to facilitate route exchange between your virtual network and on-premises network.

The ExpressRoute virtual network gateway must be one of the following SKUs to configure ExpressRoute FastPath:

* Ultra Performance
* ErGw3AZ
* ErGwScale - with a minimum of 10 scale units (Preview)

For more information on virtual network gateways, including performance metrics, and available gateway SKUs, see [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

### Virtual network peering over ExpressRoute FastPath (ExpressRoute Direct only)

The following table lists the requirements for virtual network peering over ExpressRoute FastPath:

| Requirement | Description | 
|--|--|
| Hub virtual network | Must be in the same region as any peered spoke virtual networks. | 
| Peered spoke virtual networks | Must be in the same region as the hub virtual network. | 
| Global virtual network peering | Not supported by ExpressRoute FastPath. |

### Azure Private Link and Private endpoint over ExpressRoute FastPath (ExpressRoute Direct only)

> [!IMPORTANT]
> - This feature is in limited GA (General Availability).
> - This feature requires you to enroll in the limited GA offering by completing this [Microsoft Form](https://aka.ms/FPlimitedga). Once contacted, you can run the commands in step 2 to [enable Private Link over ExpressRoute FastPath](expressroute-howto-linkvnet-arm.md#fastpath-virtual-network-peering-user-defined-routes-udrs-and-private-link-support-for-expressroute-direct-connections).

ExpressRoute FastPath support for Private Link and Private endpoint connectivity is available for specific scenarios with 100 Gbps and 10-Gbps ExpressRoute Direct connections.

The supported Azure regions are:

- Australia East
- East Asia
- East US
- East US 2
- North Central US
- North Europe
- South Central US
- South East Asia
- UK South
- West Central US
- West Europe
- West US
- West US 2
- West US 3

The following Azure services are supported:

- Azure Cosmos DB
- Azure Key Vault
- Azure Storage
- Third-party Private Link services

> [!NOTE]
> * Connections associated with ExpressRoute partner circuits aren't eligible for this preview.
> * Plan your deployments in advance; enabling ExpressRoute FastPath Private Link and Private endpoint support for limited GA scenarios can take 4-6 weeks to complete.
> * ExpressRoute FastPath connectivity to Azure Private Link service and Private endpoint deployed in a spoke Virtual Network, peered to the Hub Virtual Network (where the ExpressRoute Virtual Network Gateway is deployed), is supported.
> * ExpressRoute FastPath supports a maximum of 100-Gbps connectivity to a single availability zone.
> * Azure Private Link pricing doesn't apply to traffic sent over ExpressRoute FastPath. For more information about pricing, see the [Private Link pricing page](https://azure.microsoft.com/pricing/details/private-link/).
> * Enabling ExpressRoute FastPath does not prevent access to Azure services on Private Endpoints: reachability remains guaranteed by routing traffic through the ExpressRoute Virtual Network Gateway.

## Limitations

While ExpressRoute FastPath supports many configurations, it might not be suitable for all scenarios. The following limitations apply to ExpressRoute FastPath:

- **Azure Internal Load Balancer**: ExpressRoute FastPath doesn't support Azure internal load balancers or Azure PaaS services in spoke virtual networks. Network traffic from your on-premises network to the private IP addresses of these services in the spoke virtual network gets routed through the ExpressRoute virtual network gateway. Internal load balancers within the hub virtual network aren't affected.

- **Virtual network peering**:
    
    - **Gateway transit**: If you have two hub virtual networks that are peered and connected to a single circuit, set the *Allow Gateway Transit* option in the virtual network peering configuration to false to avoid connectivity issues.

    - **Use remote gateway**: If a spoke virtual network is peered to two different hub virtual networks, only one hub gateway can be used as the remote gateway. Using both as remote gateways causes connectivity issues.

* **Azure DNS Private Resolver**: ExpressRoute FastPath supports DNS Private Resolvers in the hub virtual network. However, it doesn't support DNS Private Resolvers in spoke virtual networks, so traffic flows through the virtual network gateway instead. For more information, see [DNS Private Resolver](../dns/dns-private-resolver-overview.md).

* **Azure NetApp Files**: To use ExpressRoute FastPath, upgrade your Azure NetApp Files volumes from Basic to Standard. For more information, see [Supported Network Topologies](../azure-netapp-files/azure-netapp-files-network-topologies.md#supported-network-topologies).

## Next steps

To enable ExpressRoute FastPath, follow these guides:

- [Configure ExpressRoute FastPath using the Azure portal](expressroute-howto-linkvnet-portal-resource-manager.md#configure-expressroute-fastpath)
- [Configure ExpressRoute FastPath using Azure PowerShell](expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath)
