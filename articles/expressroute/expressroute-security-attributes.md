---
title: Common security attributes for Azure ExpressRoute
description: A checklist of common security attributes for evaluating Azure ExpressRoute
services: expressroute
ms.service: expressroute
documentationcenter: ''
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 06/05/2019
ms.author: mbaldwin

---
# Common security attributes for Azure ExpressRoute

Security is integrated into every aspect of an Azure service. This article documents the common security attributes built into Azure ExpressRoute.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>|  N/A | ExpressRoute does not store customer data. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| No | |
| Encryption key handling (CMK, BYOK, etc.)| N/A |  |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS. |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A |  |
| vNET injection support| N/A | |
| Network isolation and firewalling support| Yes | Each customer is contained in its own routing domain and tunneled to its own VNet |
| Forced tunneling support| N/A | Via Border Gateway Protocol (BGP). |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [ExpressRoute monitoring, metrics, and alerts](expressroute-monitoring-metrics-alerts.md).|

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Service account for Gateway for Microsoft (GWM) (controller); Just in Time (JIT) access for Dev and OP. |
| Authorization|  Yes |Service account for Gateway for Microsoft (GWM) (controller); Just in Time (JIT) access for Dev and OP. |


## Audit trail

| Security Attribute | Yes/No | Notes| 
|---|---|--|
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit| No |   |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Via the Network Resource Provider (NRP). |
