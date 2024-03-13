---
author: cherylmc
ms.author: cherylmc
ms.date: 11/28/2023
ms.service: vpn-gateway
ms.topic: include
---

* You can't resize to downgrade a SKU.
* You can't resize a legacy SKU to one of the newer Azure SKUs (VpnGw1, VpnGw2AZ etc.) Legacy SKUs for the Resource Manager deployment model are: Basic, Standard, and High Performance. You must instead, change the SKU.
* You can resize a gateway SKU as long as it is in the same generation, except for the Basic SKU.
* You can change a Basic SKU to another SKU.
* When you change from a legacy SKU to a new SKU, you'll have connectivity downtime.
* When you change to a new gateway SKU, the public IP address for your VPN gateway changes. This happens even if you specified the same public IP address object that you used previously.
* If you have a classic VPN gateway, you must continue using the older legacy SKUs for that gateway. However, you can resize between the legacy SKUs available for classic gateways. You can't change to the new SKUs.
* Standard and High Performance legacy SKUs are being deprecated. See [Legacy SKU deprecation](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md#sku-deprecation) for SKU migration and upgrade timelines.
