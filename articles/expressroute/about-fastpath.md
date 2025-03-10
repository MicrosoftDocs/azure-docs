---
title: About Azure ExpressRoute FastPath
description: Learn about Azure ExpressRoute FastPath to send network traffic by bypassing the gateway.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/22/2025
ms.author: derekol
ms.custom: template-concept, references_regions, engagement-fy23
---
# About ExpressRoute FastPath

ExpressRoute virtual network gateway is designed to exchange network routes and route network traffic. FastPath is designed to improve the data path performance between your on-premises network and your virtual network. When enabled, FastPath sends network traffic directly to virtual machines in the virtual network, bypassing the Expressroute virtual network gateway.

:::image type="content" source=".\media\about-fastpath\fastpath-vnet-peering.png" alt-text="Diagram of an ExpressRoute connection with Fastpath and virtual network peering.":::

## Requirements

### Circuits

FastPath is available on all ExpressRoute circuits. Support for virtual network peering and UDR over FastPath is now generally available in all regions within the public cloud and only for connections associated to ExpressRoute Direct circuits. Limited general availability (GA) support for Private Endpoint/Private Link connectivity is only available for connections associated to ExpressRoute Direct circuits and within limited regions & for limited services behind a private endpoint.

### Gateways

FastPath still requires an Expressroute virtual network gateway to be created to exchange routes between a virtual network and an on-premises network. For more information about virtual network gateways and ExpressRoute, including performance information, and gateway SKUs, see [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To configure FastPath, the Expressroute virtual network gateway must be either of these two SKUs:

* Ultra Performance
* ErGw3AZ

### Virtual network peering

For the FastPath feature to function correctly, the hub virtual network and any peered spoke virtual networks must reside within the same region. It's important to note that FastPath doesn't support globally peered virtual networks.

## Limitations

While FastPath supports many configurations, it doesn't support the following features:

* Load Balancers: If you deploy an Azure internal load balancer in your spoke virtual network or the Azure PaaS service you deploy in your spoke virtual network, the network traffic from your on-premises network to the virtual IPs hosted on the load balancer is sent through the virtual network gateway. Load balancers within the hub virtual network are supported with FastPath.

* Gateway Transit: If you deploy two peered hub virtual networks connected to one circuit, you need to make sure to set the *Allow Gateway Transit* on the virtual network peering to false, otherwise you experience connectivity issues.

* Use Remote Gateway: If you deploy a spoke virtual network peered to two hub vnets, you can only use one hub gateway as the remote gateway. If you use both as a remote gateway, you experience connectivity issues. 

* Private Link: FastPath Connectivity to a private endpoint or Private Link service over an ExpressRoute Direct circuit is supported for limited scenarios. For more information, see [enable FastPath and Private Link for 100-Gbps ExpressRoute Direct](expressroute-howto-linkvnet-arm.md#fastpath-virtual-network-peering-user-defined-routes-udrs-and-private-link-support-for-expressroute-direct-connections). FastPath connectivity to a Private endpoint/Private Link service isn't supported for ExpressRoute partner provider circuits.

* DNS Private Resolver: Azure ExpressRoute FastPath is not supported to a DNS Private Resolver in a spoke virtual network and will go through the virtual network gateway. DNS Private Resolvers within a hub virtual network are supported by FastPath. [DNS Private Resolver](../dns/dns-private-resolver-overview.md).

* For Azure NetApp Files, customers should upgrade their volumes from Basic to Standard for FastPath to work. [Supported Network Topologies](../azure-netapp-files/azure-netapp-files-network-topologies.md#supported-network-topologies).

### IP address limits

| ExpressRoute SKU | Bandwidth | FastPath IP limit |
|--|--|--|
| ExpressRoute Direct Port | 100 Gbps | 200,000 |
| ExpressRoute Direct Port | 10 Gbps | 100,000 |
| ExpressRoute provider circuit | 10 Gbps and lower | 25,000 |

> [!NOTE]
> * ExpressRoute Direct has a cumulative limit at the port level.
> * Traffic flows through the ExpressRoute gateway when these IP limits are reached.
> * You can configure alerts through Azure Monitor to notify when the [number of FastPath routes](expressroute-monitoring-metrics-alerts.md#fastpath-routes-count-at-circuit-level) are nearing the threshold limit.

## Limited General Availability (GA)

FastPath support for Private Endpoint/Private Link connectivity is available for limited scenarios for 100/10Gbps ExpressRoute Direct connections. Private Endpoint/ Private Link connectivity is available in the following Azure regions:
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

FastPath Private endpoint/Private Link connectivity is supported for the following Azure Services:
- Azure Cosmos DB
- Azure Key Vault
- Azure Storage
- Third Party Private Link Services

> [!NOTE]
> * Plan your deployments in advance, enabling FastPath Private Link and Private endpoint support for limited GA scenarios can take upwards of 4-6 weeks to complete.
> * Connections associated to ExpressRoute partner circuits aren't eligible for this preview. Both IPv4 and IPv6 connectivity are supported.
> * FastPath connectivity to Azure Private Link service and Private endpoint deployed to a spoke Virtual Network, peered to the Hub Virtual Network (where the ExpressRoute Virtual Network Gateway is deployed), is supported. 
> * Azure Private Link pricing won't apply to traffic sent over ExpressRoute FastPath. For more information about pricing, check out the [Private Link pricing page](https://azure.microsoft.com/pricing/details/private-link/).
> * FastPath supports a max of 100Gbps connectivity to a single Availability Zone.
> * FastPath isn't supported with [Azure vWAN ExpressRoute Gateway](../virtual-wan/virtual-wan-expressroute-about.md).

> [!IMPORTANT]
> For more information about supported scenarios and to enroll in the limited GA offering, complete this [Microsoft Form](https://aka.ms/FPlimitedga). Once you've been contacted, you can run the commands in step 2 to [enable Private Link over FastPath](expressroute-howto-linkvnet-arm.md#fastpath-virtual-network-peering-user-defined-routes-udrs-and-private-link-support-for-expressroute-direct-connections).

## Next steps

- To enable FastPath, see configure ExpressRoute FastPath using the [Azure portal](expressroute-howto-linkvnet-portal-resource-manager.md#configure-expressroute-fastpath) or using [Azure PowerShell](expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).
