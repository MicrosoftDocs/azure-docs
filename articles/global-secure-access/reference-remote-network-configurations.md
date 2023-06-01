---
title: Global Secure Access remote network configurations
description: Global Secure Access configurations for remote network device links.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: reference
ms.date: 06/01/2023
ms.service: network-access
ms.custom: 
---

# Global Secure Access remote network configurations

Device links are the physical routers that connect your remote networks, such as branch locations, to Global Secure Access. There are a specific set of combinations you must use if you choose the **custom** option when adding device links.

## IKE Phase 1 combinations

| Properties | Combination 1 | Combination 2 | Combination 3 | Combination 4 | Combination 5 |
| --- | --- | --- | --- | --- | --- |
| IKE encryption | GCMAES256 | GCMAES128 | AES256 | AES128 | AES256 |
| IKEv2 integrity | SHA384 | SHA256 | SHA384 | SHA256 | SHA256 |
| DH group | DHGroup24 | DHGroup24 | DHGroup24 | DHGroup24 | DHGroup2 |

## IKE Phase 2 combinations

- IPSec encryption
- IPSec integrity
- PFS Group
- SA lifetime (in seconds)

| Properties | Combination 1 | Combination 2 | Combination 3 |
| --- | --- | --- | --- |
| IPSec encryption | GCMAES256 | GCMAES256 | None |
| IPSec integrity | GCMAES192 | GCMAES192 | None |
| PFS Group | GCMAES128 | GCMAES128 | None |

## Valid IPSec encryption and IPSec integrity combinations

| IPSec integrity | IPSec encryption |
| --- | --- |
|  | None |
| GCMAES128 | GCMAES128 |
| GCMAES192 | GCMAES192 |
| GCMAES256 | GCMAES256 |

## Valid enums

### IKE encryption

| Value | Enum |
| --- | --- |
| AES128 | 0 |
| AES192 | 1 |
| AES256 | 2 |
| GCMAES128 | 3 |
| GCMAES256 | 4 |

### IKE integrity

| Value | Enum |
| --- | --- |
| SHA256 | 0 |
| SHA384 | 1 |
| GCMAES256 | 2 |
| GCMAES256 | 3 |

### DH group

| Value | Enum |
| --- | --- |
| DHGroup14  | 0 |
| DHGroup2048  | 1 |
| ECP256  | 2 |
| ECP384  | 3 |
| DHGroup24 | 4 |

### IPSec encryption

| Value | Enum |
| --- | --- |
| GCMAES128  | 0 |
| GCMAES192  | 1 |
| GCMAES256 | 2 |
| None | 3 |

### IPSec integrity

| Value | Enum |
| --- | --- |
| GCMAES128  | 0 |
| GCMAES192  | 1 |
| GCMAES256 | 2 |
| SHA256  | 3 |

### PFS group

| Value | Enum |
| --- | --- |
| PFS1 | 0 |
| None | 1 |
| PFS2 | 2 |
| PFS2048 | 3 |
| ECP256 | 4 |
| ECP384 | 5 |
| PFSMM | 6 |
| PFS24 | 7 |
| PFS14 | 8 |

## Valid autonomous system number (ASN)

You can use any values except for the following:

- Azure reserved ASNs: 12076, 65517,65518, 65519, 65520, 8076, 8075
- IANA reserved ASNs: 23456, >= 64496 && <= 64511, >= 65535 && <= 65551, 4294967295
