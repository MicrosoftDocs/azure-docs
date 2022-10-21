---
title: About Azure ExpressRoute FastPath
description: Learn about Azure ExpressRoute FastPath to send network traffic by bypassing the gateway
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: conceptual
ms.date: 08/10/2021
ms.author: duau
ms.custom: references_regions

---
# About ExpressRoute FastPath

ExpressRoute virtual network gateway is designed to exchange network routes and route network traffic. FastPath is designed to improve the data path performance between your on-premises network and your virtual network. When enabled, FastPath sends network traffic directly to virtual machines in the virtual network, bypassing the gateway.

## Requirements

### Circuits

FastPath is available on all ExpressRoute circuits. Public preview support for Private Link connectivity over FastPath is available for connections associated to ExpressRoute Direct circuits. Connections associated to ExpressRoute partner circuits are not eligible for the preview.

### Gateways

FastPath still requires a virtual network gateway to be created to exchange routes between virtual network and on-premises network. For more information about virtual network gateways and ExpressRoute, including performance information and gateway SKUs, see [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To configure FastPath, the virtual network gateway must be either:

* Ultra Performance
* ErGw3AZ

## Limitations

While FastPath supports most configurations, it doesn't support the following features:

* Basic Load Balancer: If you deploy a Basic internal load balancer in your virtual network or the Azure PaaS service you deploy in your virtual network uses a Basic internal load balancer, the network traffic from your on-premises network to the virtual IPs hosted on the Basic load balancer will be sent to the virtual network gateway. The solution is to upgrade the Basic load balancer to a [Standard load balancer](../load-balancer/load-balancer-overview.md).

* Private Link: If you connect to a [private endpoint](../private-link/private-link-overview.md) in your virtual network from your on-premises network, over a non-100Gbps ExpressRoute Direct circuit, the connection will go through the virtual network gateway. FastPath Connectivity to a private endpoint over a 100Gb ExpressRoute Direct circuit is supported.

### IP address limits

| ExpressRoute SKU | Bandwidth | FastPath IP limit |
| -- | -- | -- |
| ExpressRoute Direct Port | 100Gbps | 200,000 |
| ExpressRoute Direct Port | 10Gbps | 100,000 |
| ExpressRoute provider circuit | 10Gbps and lower | 25,000 |

> [!NOTE]
> * ExpressRoute Direct has a cumulative limit at the port level.
> * Traffic will flow through the ExpressRoute gateway when these limits are reached.
## Public preview

The following FastPath features are in Public preview:

### Virtual network (Vnet) Peering
FastPath will send traffic directly to any VM deployed in a virtual network peered to the one connected to ExpressRoute, bypassing the ExpressRoute virtual network gateway. This feature is available for both IPv4 and IPv6 connectivity.

**FastPath support for vnet peering is only available for ExpressRoute Direct connections.**

> [!NOTE]
> * FastPath Vnet peering connectivity is not supported for Azure Dedicated Host workloads.

## User Defined Routes (UDRs)
FastPath will honor UDRs configured on the GatewaySubnet and send traffic directly to an Azure Firewall or third party NVA.

**FastPath support for UDRs is only available for ExpressRoute Direct connections**

> [!NOTE]
> * FastPath UDR connectivity is not supported for Azure Dedicated Host workloads.
> * FastPath UDR connectivity is not supported for IPv6 workloads.

**Private Link Connectivity for 10Gbps ExpressRoute Direct Connectivity** - Private Link traffic sent over ExpressRoute FastPath will bypass the ExpressRoute virtual network gateway in the data path.
This preview is available in the following Azure Regions.
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

This preview supports connectivity to the following Azure Services:
- Azure Cosmos DB
- Azure Key Vault
- Azure Storage
- Third Party Private Link Services

This preview is available for connections associated to ExpressRoute Direct circuits. Connections associated to ExpressRoute partner circuits are not eligible for this preview. Additionally, this preview is available for both IPv4 and IPv6 connectivity.

> [!NOTE]
> Private Link pricing will not apply to traffic sent over ExpressRoute FastPath during Public preview. For more information about pricing, check out the [Private Link pricing page](https://azure.microsoft.com/pricing/details/private-link/).
> 

See [How to enroll in ExpressRoute FastPath features](expressroute-howto-linkvnet-arm.md#enroll-in-expressroute-fastpath-features-preview).

 
## Next steps

To enable FastPath, see [Link a virtual network to ExpressRoute](expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).
