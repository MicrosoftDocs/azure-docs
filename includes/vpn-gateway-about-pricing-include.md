---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/21/2018
 ms.author: cherylmc
 ms.custom: include file
---
You pay for two things: the hourly compute costs for the virtual network gateway, and the egress data transfer from the virtual network gateway. Pricing information can be found on the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page.

**Virtual network gateway compute costs**<br>Each virtual network gateway has an hourly compute cost. The price is based on the gateway SKU that you specify when you create a virtual network gateway. The cost is for the gateway itself and is in addition to the data transfer that flows through the gateway.

**Data transfer costs**<br>Data transfer costs are calculated based on egress traffic from the source virtual network gateway.

* If you are sending traffic to your on-premises VPN device, it will be charged with the Internet egress data transfer rate.
* If you are sending traffic between virtual networks in different regions, the pricing is based on the region.
* If you are sending traffic only between virtual networks that are in the same region, there are no data costs. Traffic between VNets in the same region is free.