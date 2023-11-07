---
author: cherylmc
ms.date: 12/13/2019
ms.service: expressroute
ms.topic: include
ms.author: cherylmc
---

|  | **Private Peering** | **Microsoft Peering** |  **Public Peering** (deprecated for new circuits, will be retired on March 31, 2024) |
| --- | --- | --- | --- |
| **Max. # IPv4 prefixes supported per peering** |4000 by default, 10,000 with ExpressRoute Premium |200 |200 |
| **Max. # IPv6 prefixes supported per peering** |100 |200 |N/A |
| **IP address ranges supported** |Any valid IP address within your WAN. |Public IP addresses owned by you or your connectivity provider. |Public IP addresses owned by you or your connectivity provider. |
| **AS Number requirements** |Private and public AS numbers. You must own the public AS number if you choose to use one. |You can set private and public AS numbers for peer ASN. However, you must prove ownership of public IP addresses. Note: If you use customer ASN, you can set public ASN only.|Private and public AS numbers. However, you must prove ownership of public IP addresses. |
| **IP protocols supported**| IPv4, IPv6 |  IPv4, IPv6 | IPv4 |
| **Routing Interface IP addresses** |RFC1918 and public IP addresses |Public IP addresses registered to you in routing registries. |Public IP addresses registered to you in routing registries. |
| **MD5 Hash support** |Yes |Yes |Yes |
