---
ms.author: cherylmc
author: cherylmc
ms.date: 08/15/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

* A Basic SKU VPN gateway uses a Basic SKU public IP address, not Standard.
* The public IP address allocation method for a Basic SKU VPN gateway must be Dynamic, not Static.
* The Basic SKU can only be configured using PowerShell or Azure CLI.
* The Basic SKU doesn't support IPv6.
* The Basic SKU doesn't support RADIUS authentication.