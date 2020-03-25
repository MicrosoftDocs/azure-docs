---
author: cherylmc
ms.service: vpn-gateway
ms.topic: include
ms.date: 11/09/2018	
ms.author: cherylmc
---
The legacy (old) VPN gateway SKUs are:

* Default (Basic)
* Standard
* HighPerformance

VPN Gateway does not use the UltraPerformance gateway SKU. For information about the UltraPerformance SKU, see the [ExpressRoute](../articles/expressroute/expressroute-about-virtual-network-gateways.md) documentation.

When working with the legacy SKUs, consider the following:

* If you want to use a PolicyBased VPN type, you must use the Basic SKU. PolicyBased VPNs (previously called Static Routing) are not supported on any other SKU.
* BGP is not supported on the Basic SKU.
* ExpressRoute-VPN Gateway coexist configurations are not supported on the Basic SKU.
* Active-active S2S VPN Gateway connections can be configured on the HighPerformance SKU only.