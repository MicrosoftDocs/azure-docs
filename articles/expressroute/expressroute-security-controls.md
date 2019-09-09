---
title: Security controls for Azure ExpressRoute
description: A checklist of security controls for evaluating Azure ExpressRoute
services: expressroute
ms.service: expressroute
documentationcenter: ''
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 06/05/2019
ms.author: mbaldwin

---
# Security controls for Azure ExpressRoute

This article documents the security controls built into Azure ExpressRoute.

[!INCLUDE [Security controls Header](../../includes/security-attributes-header.md)]

## Network

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A |  |
| VNet injection support| N/A | |
| Network isolation and firewalling support| Yes | Each customer is contained in its own routing domain and tunneled to its own VNet |
| Forced tunneling support| N/A | Via Border Gateway Protocol (BGP). |

## Monitoring & logging

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [ExpressRoute monitoring, metrics, and alerts](expressroute-monitoring-metrics-alerts.md).|
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit| No |   |

## Identity

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Service account for Gateway for Microsoft (GWM) (controller); Just in Time (JIT) access for Dev and OP. |
| Authorization|  Yes |Service account for Gateway for Microsoft (GWM) (controller); Just in Time (JIT) access for Dev and OP. |

## Data protection

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys |  N/A | ExpressRoute does not store customer data. |
| Server-side encryption at rest: customer managed keys (BYOK) | N/A |  |
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| No | |
| API calls encrypted| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS. |


## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Via the Network Resource Provider (NRP). |
