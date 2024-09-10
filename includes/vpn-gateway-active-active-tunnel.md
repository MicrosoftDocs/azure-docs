---
ms.author: cherylmc
author: cherylmc
ms.date: 08/08/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

For S2S connections with an active-active mode VPN gateway, ensure tunnels are established to each gateway VM instance. If you establish a tunnel to only one gateway VM instance, the connection will go down during maintenance. If your VPN device doesn't support this setup, configure your gateway for active-standby mode instead.
