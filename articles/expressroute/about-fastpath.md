---
title: About Azure ExpressRoute FastPath
description: Learn about Azure ExpressRoute FastPath to send network traffic by bypassing the gateway.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 03/24/2024
ms.author: duau
ms.custom: template-concept, references_regions, engagement-fy23
---
# About ExpressRoute FastPath

ExpressRoute virtual network gateway is designed to exchange network routes and route network traffic. FastPath is designed to improve the data path performance between your on-premises network and your virtual network. When enabled, FastPath sends network traffic directly to virtual machines in the virtual network, bypassing the gateway.

## Requirements

### Circuits

FastPath is available on all ExpressRoute circuits. Limited general availability (GA) support for Private Endpoint/Private Link connectivity and Public preview support for virtual network peering and UDR connectivity over FastPath is only available for connections associated to ExpressRoute Direct circuits.
### Gateways

FastPath still requires a virtual network gateway to be created to exchange routes between virtual network and on-premises network. For more information about virtual network gateways and ExpressRoute, including performance information, and gateway SKUs, see [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To configure FastPath, the virtual network gateway must be either:

* Ultra Performance
* ErGw3AZ

## Limitations

While FastPath supports most configurations, it doesn't support the following features:

* Basic Load Balancer: If you deploy a Basic internal load balancer in your virtual network or the Azure PaaS service you deploy in your virtual network uses a Basic internal load balancer, the network traffic from your on-premises network to the virtual IPs hosted on the Basic load balancer is sent to the virtual network gateway. The solution is to upgrade the Basic load balancer to a [Standard load balancer](../load-balancer/load-balancer-overview.md).

* Private Link: FastPath Connectivity to a private endpoint or Private Link service over an ExpressRoute Direct circuit is supported for limited scenarios. For more information, see [enable FastPath and Private Link for 100-Gbps ExpressRoute Direct](expressroute-howto-linkvnet-arm.md#fastpath-virtual-network-peering-user-defined-routes-udrs-and-private-link-support-for-expressroute-direct-connections). FastPath connectivity to a Private endpoint/Private Link service isn't supported for ExpressRoute partner circuits.

* DNS Private Resolver: Azure ExpressRoute FastPath doesn't support connectivity to [DNS Private Resolver](../dns/dns-private-resolver-overview.md).

### IP address limits

| ExpressRoute SKU | Bandwidth | FastPath IP limit |
|--|--|--|
| ExpressRoute Direct Port | 100 Gbps | 200,000 |
| ExpressRoute Direct Port | 10 Gbps | 100,000 |
| ExpressRoute provider circuit | 10 Gbps and lower | 25,000 |

> [!NOTE]
> * ExpressRoute Direct has a cumulative limit at the port level.
> * Traffic flows through the ExpressRoute gateway when these limits are reached.

## Limited General Availability (GA)
FastPath support for Virtual Network Peering, User Defined Routes (UDRs) and Private Endpoint/Private Link connectivity is available for limited scenarios for 100/10Gbps ExpressRoute Direct connections. Virtual Network Peering and UDR support are available globally across all Azure regions. Private Endpoint/ Private Link connectivity is available in the following Azure regions:
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
> * Enabling FastPath Private endpoint/Link support for limited GA scenarios may take upwards of 2 weeks to complete. Please plan your deployment(s) in advance.
> * Connections associated to ExpressRoute partner circuits aren't eligible for this preview. Both IPv4 and IPv6 connectivity is supported.
> * FastPath connectivity to a Private endpoint/Link service deployed to a spoke Virtual Network, peered to the Hub Virtual Network (where the ExpressRoute Virtual Network Gateway is deployed), is not supported. FastPath only supports connectivity to Private Endpoints/Link services deployed to the Hub Virtual Network.
> * Private Link pricing will not apply to traffic sent over ExpressRoute FastPath. For more information about pricing, check out the [Private Link pricing page](https://azure.microsoft.com/pricing/details/private-link/).
> * FastPath supports a max of 100Gbps connectivity to a single Availability Zone (Az).

For more information about supported scenarios and to enroll in the limited GA offering, complete this [Microsoft Form](https://aka.ms/FastPathLimitedGA).

## Next steps

- To enable FastPath, see [Configure ExpressRoute FastPath](expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).
