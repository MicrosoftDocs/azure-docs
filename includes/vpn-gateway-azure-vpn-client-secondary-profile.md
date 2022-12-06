---
author: cherylmc
ms.service: vpn-gateway
ms.topic: include
ms.author: cherylmc
ms.date: 11/23/2022
---

Azure VPN client provides high availability for client profiles. Adding a secondary client profile gives the client a more resilient way to access the VPN. If there's a region outage or failure to connect to the primary VPN client profile, the Azure VPN Client will auto-connect to the secondary client profile without causing any disruptions.

This feature requires the Azure VPN Client version **2.2124.51.0**, which is currently in the process of being rolled out. To use this feature, add another VPN client profile to the Azure VPN Client. Then, select the additional profile from the **Secondary profile** dropdown.
