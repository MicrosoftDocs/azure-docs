---
title: 'Virtual WAN Point-to-site IPsec policies'
titleSuffix: Azure Virtual WAN
description: Learn about Azure Virtual WAN Point-to-site IPsec connectivity policies.
services: virtual-wan
author: wellee
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 08/24/2023
ms.author: wellee
#Customer intent: As a Virtual WAN software-defined connectivity provider, I want to know the IPsec policies for point-to-site VPN
---

# Point-to-site IPsec policies

This article shows the supported IPsec policy combinations for Point-to-site VPN connectivity in Azure Virtual WAN.

## Default IPsec policies

The following table shows the default IPsec parameters for Point-to-site VPN connections. These parameters are automatically chosen by the Virtual WAN Point-to-site VPN gateway when a Point-to-site profile is created.

| Setting | Parameters |
|--- |--- |
| Phase 1 IKE Encryption | AES256 |
| Phase 1 IKE Integrity |  SHA256 |
| DH Group | DHGroup24 |
| Phase 2 IPsec Encryption | GCMAES256|
| Phase 2 IPsec Integrity | GCMAES25 |
| PFS Group |PFS24|

## Custom IPsec policies

When working with custom IPsec policies, keep in mind the following requirements:

* **IKE** - For Phase 1 IKE, you can select any parameter from IKE Encryption, plus any parameter from IKE Integrity, plus any parameter from DH Group.
* **IPsec** - For Phase 2 IPsec, you can select any parameter from IPsec Encryption, plus any parameter from IPsec Integrity, plus PFS. If any of the parameters for IPsec Encryption or IPsec Integrity is GCM, then both IPsec Encryption and Integrity must use the same algorithm. For example, if GCMAES128 is chosen for IPsec Encryption, GCMAES128 must also be chosen for IPsec Integrity.  

The following table shows the available IPsec parameters for Point-to-site VPN connections.

| Setting | Parameters |
|--- |--- |
| Phase 1 IKE Encryption | AES128, AES256, GCMAES128, GCMAES256 |
| Phase 1 IKE Integrity |  SHA256, SHA384 |
| DH Group | DHGroup14, DHGroup24, ECP256, ECP384 |
| Phase 2 IPsec Encryption | GCMAES128, GCMAES256, SHA256|
| Phase 2 IPsec Integrity | GCMAES128, GCMAES256 |
| PFS Group |PFS14, PFS24, ECP256, ECP384|

## Next steps

See [How to create a point-to-site connection](virtual-wan-point-to-site-portal.md)

For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
