---
title: About Azure ExpressRoute FastPath
description: Learn about Azure ExpressRoute FastPath to send network traffic by bypassing the gateway
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 01/05/2023
ms.author: duau
ms.custom: template-concept, references_regions, engagement-fy23
---
# About ExpressRoute FastPath

ExpressRoute virtual network gateway is designed to exchange network routes and route network traffic. FastPath is designed to improve the data path performance between your on-premises network and your virtual network. When enabled, FastPath sends network traffic directly to virtual machines in the virtual network, bypassing the gateway.

## Requirements

### Circuits

FastPath is available on all ExpressRoute circuits. Limited Generally Available (GA) support for Private Endpoint/Private Link connectivity and Public preview support for VNet peering and UDR connectivity over FastPath is only available for connections associated to ExpressRoute Direct circuits.
### Gateways

FastPath still requires a virtual network gateway to be created to exchange routes between virtual network and on-premises network. For more information about virtual network gateways and ExpressRoute, including performance information and gateway SKUs, see [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To configure FastPath, the virtual network gateway must be either:

* Ultra Performance
* ErGw3AZ

## Limitations

While FastPath supports most configurations, it doesn't support the following features:

* Basic Load Balancer: If you deploy a Basic internal load balancer in your virtual network or the Azure PaaS service you deploy in your virtual network uses a Basic internal load balancer, the network traffic from your on-premises network to the virtual IPs hosted on the Basic load balancer is sent to the virtual network gateway. The solution is to upgrade the Basic load balancer to a [Standard load balancer](../load-balancer/load-balancer-overview.md).

* Private Link: FastPath Connectivity to a private endpoint or Private Link service over an ExpressRoute Direct circuit is supported for limited scenarios. For more information, see [enable FastPath and Private Link for 100 Gbps ExpressRoute Direct](expressroute-howto-linkvnet-arm.md#fastpath-and-private-link-for-100-gbps-expressroute-direct). FastPath connectivity to a Private endpoint/Private Link service is not supported for ExpressRoute partner circuits.

### IP address limits

| ExpressRoute SKU | Bandwidth | FastPath IP limit |
| -- | -- | -- |
| ExpressRoute Direct Port | 100Gbps | 200,000 |
| ExpressRoute Direct Port | 10Gbps | 100,000 |
| ExpressRoute provider circuit | 10Gbps and lower | 25,000 |

> [!NOTE]
> * ExpressRoute Direct has a cumulative limit at the port level.
> * Traffic flows through the ExpressRoute gateway when these limits are reached.

## Public preview

The following FastPath features are in Public preview:

### Virtual network (VNet) Peering

FastPath sends traffic directly to any VM deployed in a virtual network peered to the one connected to ExpressRoute, bypassing the ExpressRoute virtual network gateway. This feature is available for both IPv4 and IPv6 connectivity.

**FastPath support for VNet peering is only available for ExpressRoute Direct connections.**

> [!NOTE]
> * FastPath VNet peering connectivity is not supported for Azure Dedicated Host workloads.

### User Defined Routes (UDRs)

FastPath honors UDRs configured on the GatewaySubnet and send traffic directly to an Azure Firewall or third party NVA.

**FastPath support for UDRs is only available for ExpressRoute Direct connections**

> [!NOTE]
> * FastPath UDR connectivity is not supported for Azure Dedicated Host workloads.
> * FastPath UDR connectivity is not supported for IPv6 workloads.

To enroll in the Public preview, send an email to **exrpm@microsoft.com** with the following information:
- Azure subscription ID
- Virtual Network(s) Azure Resource ID(s)
- ExpressRoute Circuit(s) Azure Resource ID(s)
- ExpressRoute Connection(s) Azure Resource ID(s)
- Number of Virtual Network peering connections
- Number of UDRs configured in the hub Virtual Network


## Limited General Availability (GA)
FastPath Private Endpoint/Private Link support for 100Gbps and 10Gbps ExpressRoute Direct connections is available for limited scenarios in the following Azure regions:
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

For more information about supported scenarios and to enroll in the limited GA offering, send an email to **exrpm@microsoft.com** with the following information:
- Azure subscription ID
- Virtual Network(s) Azure Resource ID(s)
- ExpressRoute Circuit(s) Azure Resource ID(s)
- ExpressRoute Virtual Network Gateway Connection(s) Azure Resource ID(s)
- Number of Private Endpoints/Private Link services deployed to the Virtual Network

## Next steps

- To enable FastPath, see [Configure ExpressRoute FastPath](expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).
