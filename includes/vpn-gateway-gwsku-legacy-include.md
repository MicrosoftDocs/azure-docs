---
author: cherylmc
ms.service: vpn-gateway
ms.topic: include
ms.date: 11/29/2023
ms.author: cherylmc
---
The legacy (old) VPN Gateway SKUs are:

* Default (Basic)
* Standard
* High Performance

When working with the legacy SKUs, consider the following:

* If you want to use a PolicyBased VPN type, you must use the Basic SKU. PolicyBased VPNs (previously called Static Routing) aren't supported on any other SKU.
* BGP isn't supported on the Basic SKU.
* ExpressRoute-VPN Gateway coexist configurations aren't supported on the Basic SKU.
* Active-active S2S VPN Gateway connections can be configured on the High Performance SKU only.
* VPN Gateway doesn't use the UltraPerformance gateway SKU. For information about the UltraPerformance SKU, see the [ExpressRoute](../articles/expressroute/expressroute-about-virtual-network-gateways.md) documentation.