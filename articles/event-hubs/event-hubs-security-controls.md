---
title: Security controls for Azure Event Hubs
description: A checklist of security controls for evaluating Azure Event Hubs
services: event-hubs
ms.service: event-hubs
documentationcenter: ''
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 09/042/2019
ms.author: mbaldwin

---
# Security controls for Azure Event Hubs

This article documents the security controls built into Azure Event Hubs.

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| No | |
| Network isolation and firewalling support| Yes |  |
| Forced tunneling support| No |  |

## Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit| Yes |   |

## Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | |
| Authorization|  Yes | |

## Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys |  Yes | |
| Server-side encryption at rest: customer-managed keys (BYOK) | No |  |
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | |
| API calls encrypted| Yes |  |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | |

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).
