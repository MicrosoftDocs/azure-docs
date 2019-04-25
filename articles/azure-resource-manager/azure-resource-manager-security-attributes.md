---
title: Common security attributes for Azure Resource Manager
description: A checklist of common security attributes for evaluating Azure Resource Manager
services: api-management
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 04/25/2019
ms.author: mbaldwin

---
# Common security attributes for Azure Resource Manager

Security is integrated into every aspect of an Azure service. This article documents the common security attributes built into Azure Resource Manager.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes |  |
| Encryption in transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | HTTPS/SSL. |
| Encryption key handling (CMK, BYOK, etc.)| N/A |  |
| Column level encryption (Azure Data Services)| Yes | |
| API calls encrypted| Yes | |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No | |
| VNet injection support| Yes | |
| Network isolation and firewalling support| No |  |
| Forced tunneling support| No |  |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| No | |

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | [Azure Active Directory](../azure-active-directory/index.yml) based.|
| Authorization| Yes | |


## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Activity logs  exposes all non-GET operations. |
| Data plane logging and audit| N/A | |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  |
