---
author: duongau
ms.date: 07/16/2024
ms.service: azure-expressroute
ms.topic: include
ms.author: duau
---

|  | **Private Peering** | **Microsoft Peering** |
| --- | --- | --- |
| **Max. # IPv4 prefixes supported per peering** |4000 by default, 10,000 with ExpressRoute Premium |200 |
| **Max. # IPv6 prefixes supported per peering** |100 |200 |
| **IP address ranges supported** |Any valid IP address within your WAN. |Public IP addresses owned by you or your connectivity provider. |
| **AS Number requirements** |Private and public AS numbers. You must own the public AS number if you choose to use one. |You can set private and public AS numbers for peer ASN. However, you must prove ownership of public IP addresses. Note: If you use customer ASN, you can set public ASN only.|
| **IP protocols supported**| IPv4, IPv6 |  IPv4, IPv6 |
| **Routing Interface IP addresses** |RFC1918 and public IP addresses |Public IP addresses registered to you in routing registries. |
| **MD5 Hash support** |Yes |Yes |
