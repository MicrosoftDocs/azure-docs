---
title: About Azure ExpressRoute FastPath
description: Learn about Azure ExpressRoute FastPath to send network traffic by bypassing the gateway
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 03/25/2020
ms.author: cherylmc

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

## Supported features

While FastPath supports most configurations, it does not support the following features:

* UDR on the gateway subnet: If you apply a UDR to the gateway subnet of your virtual network, the network traffic from your on-premises network will continue to be sent to the virtual network gateway.

* VNet Peering: If you have other virtual networks peered with the one that is connected to ExpressRoute, the network traffic from your on-premises network to the other virtual networks (i.e. the so-called "Spoke" VNets) will continue to be sent to the virtual network gateway. The workaround is to connect all the virtual networks to the ExpressRoute circuit directly.

* Basic Load Balancer: If you deploy a Basic internal load balancer in your virtual network or the Azure PaaS service you deploy in your virtual network uses a Basic internal load balancer, the network traffic from your on-premises network to the virtual IPs hosted on the Basic load balancer will be sent to the virtual network gateway. The solution is to upgrade the Basic load balancer to a [Standard load balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview).

* Private Link: If you connect to a [private endpoint](../private-link/private-link-overview.md) in your virtual network from your on-premises network, the connection will go through the virtual network gateway.
 
## Next steps

To enable FastPath, see [Link a virtual network to ExpressRoute](expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).
