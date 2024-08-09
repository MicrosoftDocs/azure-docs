---
ms.author: cherylmc
author: cherylmc
ms.date: 08/08/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

For S2S connections with an active-active mode VPN gateway, if you only configure your VPN device to accept or establish a tunnel to one gateway VM instance (instead of both instances), the tunnel will go down during maintenance. If your VPN device doesn't support this type of configuration, we don't recommend that you configure your gateway for active-active mode.
