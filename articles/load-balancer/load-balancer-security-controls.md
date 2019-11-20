---
title: Security controls for Azure Load Balancer
description: A checklist of security controls for evaluating Load Balancer
services: load-balancer
author: asudbring
manager: KumudD
ms.service: load-balancer

ms.topic: conceptual
ms.date: 09/04/2019
ms.author: allensu

---
# Security controls for Azure Load Balancer

This article documents the security controls built into Azure Load Balancer.

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A | |
| VNet injection support| N/A | |
| Network Isolation and Firewalling support| N/A |  |
| Forced tunneling support| N/A | |

## Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Azure Monitor logs for public Basic Load Balancer](load-balancer-monitor-log.md). |
| Control and management plane logging and audit| Yes | See [Azure Monitor logs for public Basic Load Balancer](load-balancer-monitor-log.md). |
| Data plane logging and audit | N/A |  |

## Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| N/A |  |
| Authorization| N/A |  |

## Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys | N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| N/A | |
| Server-side encryption at rest: customer-managed keys (BYOK) | N/A | |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via the [Azure Resource Manager](../azure-resource-manager/index.yml). |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| N/A |  | 

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).