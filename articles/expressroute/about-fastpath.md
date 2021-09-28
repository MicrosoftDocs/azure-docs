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

FastPath is available on all ExpressRoute circuits.

### Gateways

FastPath still requires a virtual network gateway to be created to exchange routes between virtual network and on-premises network. For more information about virtual network gateways and ExpressRoute, including performance information and gateway SKUs, see [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To configure FastPath, the virtual network gateway must be either:

* Ultra Performance
* ErGw3AZ

> [!IMPORTANT]
> If you plan to use FastPath with IPv6-based private peering over ExpressRoute, make sure to select ErGw3AZ for **SKU**. Note that this is only available for circuits using ExpressRoute Direct.
> 
>

## Limitations

While FastPath supports most configurations, it doesn't support the following features:

* UDR on the gateway subnet: This UDR has no impact on the network traffic that FastPath sends directly from your on-premises network to the virtual machines in Azure virtual network. 

* Basic Load Balancer: If you deploy a Basic internal load balancer in your virtual network or the Azure PaaS service you deploy in your virtual network uses a Basic internal load balancer, the network traffic from your on-premises network to the virtual IPs hosted on the Basic load balancer will be sent to the virtual network gateway. The solution is to upgrade the Basic load balancer to a [Standard load balancer](../load-balancer/load-balancer-overview.md).

* Private Link: If you connect to a [private endpoint](../private-link/private-link-overview.md) in your virtual network from your on-premises network, the connection will go through the virtual network gateway.

## Public preview

The following FastPath features are in Public preview:

**VNet Peering** - FastPath will send traffic directly to any VM deployed in a virtual network peered to the one connected to ExpressRoute, bypassing the ExpressRoute virtual network gateway.

See [How to enroll in ExpressRoute FastPath features](expressroute-howto-linkvnet-arm.md#enroll-in-expressroute-fastpath-features-preview).

Available in all regions.
 
## Next steps

To enable FastPath, see [Link a virtual network to ExpressRoute](expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).
