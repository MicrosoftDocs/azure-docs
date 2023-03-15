---
author: cherylmc
ms.author: cherylmc
ms.date: 01/30/2023
ms.service: vpn-gateway
ms.topic: include
---

| **IPsec/IKEv2**    | **Options**    |
| ---              | ---            |
| IKEv2 Encryption   | GCMAES256, GCMAES128, AES256, AES192, AES128, DES3, DES |
| IKEv2 Integrity    | GCMAES256, GCMAES128, SHA384, SHA256, SHA1, MD5 |
| DH Group         | DHGroup24, ECP384, ECP256, DHGroup14, DHGroup2048, DHGroup2, DHGroup1, None |
| IPsec Encryption | GCMAES256, GCMAES192, GCMAES128, AES256, AES192, AES128, DES3, DES, None    |
| IPsec Integrity  | GCMAES256, GCMAES192, GCMAES128, SHA256, SHA1, MD5 |
| PFS Group        | PFS24, ECP384, ECP256, PFS2048, PFS2, PFS1, None   |
| QM SA Lifetime   | (**Optional**: default values are used if not specified)<br>Seconds (integer; **min. 300**/default 27000 seconds)<br>KBytes (integer; **min. 1024**/default 102400000 KBytes)    |
| Traffic Selector | UsePolicyBasedTrafficSelectors** ($True/$False; **Optional**, default $False if not specified)    |
| DPD timeout      | Seconds (integer: min. 9/max. 3600; default 45 seconds) |