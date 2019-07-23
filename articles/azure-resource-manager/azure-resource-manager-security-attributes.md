---
title: Security attributes for Azure Resource Manager
description: A checklist of security attributes for evaluating Azure Resource Manager
services: azure-resource-manager
author: msmbaldwin
manager: barbkess
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 04/25/2019
ms.author: mbaldwin

---
# Security attributes for Azure Resource Manager

This article documents the security attributes built into Azure Resource Manager.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features)| Yes |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | HTTPS/TLS. |
| Encryption key handling (CMK, BYOK, etc.)| N/A | Azure Resource Manager stores no customer content, only control data. |
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
| Authentication| Yes | [Azure Active Directory](/azure/active-directory) based.|
| Authorization| Yes | |


## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Activity logs expose all write operations (PUT, POST, DELETE) performed on your resources; see [View activity logs to audit actions on resources](resource-group-audit.md). |
| Data plane logging and audit| N/A | |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  |
