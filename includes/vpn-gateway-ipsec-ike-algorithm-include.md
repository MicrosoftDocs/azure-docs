---
author: cherylmc
ms.author: cherylmc
ms.date: 01/26/2024
ms.service: vpn-gateway
ms.topic: include
---

| IPsec/IKEv2    | Options    |
| ---              | ---            |
| IKEv2 encryption   | GCMAES256, GCMAES128, AES256, AES192, AES128 |
| IKEv2 integrity    | SHA384, SHA256, SHA1, MD5 |
| DH group         | DHGroup24, ECP384, ECP256, DHGroup14, DHGroup2048, DHGroup2, DHGroup1, None |
| IPsec encryption | GCMAES256, GCMAES192, GCMAES128, AES256, AES192, AES128, DES3, DES, None    |
| IPsec integrity  | GCMAES256, GCMAES192, GCMAES128, SHA256, SHA1, MD5 |
| PFS group        | PFS24, ECP384, ECP256, PFS2048, PFS2, PFS1, None   |
| Quick Mode SA lifetime   | (Optional; default values if not specified)<br>Seconds (integer; minimum 300, default 27,000)<br>Kilobytes (integer; minimum 1,024, default 10,2400,000)    |
| Traffic selector | `UsePolicyBasedTrafficSelectors` (`$True` or `$False`, but optional; default `$False` if not specified)    |
| DPD timeout      | Seconds (integer; minimum 9, maximum 3,600, default 45) |
