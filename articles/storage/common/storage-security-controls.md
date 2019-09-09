---
title: Security controls for Azure Storage
description: A checklist of security controls for evaluating Azure Storage
services: storage
documentationcenter: ''
author: msmbaldwin
manager: barbkess
ms.service: storage
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: mbaldwin

---
# Security controls for Azure Storage

This article documents the security controls built into Azure Storage. 

[!INCLUDE [Security controls Header](../../../includes/security-attributes-header.md)]

## Data protection

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes |  |
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | See [Storage Service Encryption using customer-managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).|
| Column level encryption (Azure Data Services)| N/A |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | Support standard HTTPS/TLS mechanisms.  Users can also encrypt data before it is transmitted to the service. |
| API calls encrypted| Yes |  |

## Network

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| N/A |  |
| Network isolation and firewalling support| Yes | |
| Forced tunneling support| N/A |  |

## Monitoring & logging

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Azure Monitor Metrics available now, Logs starting preview |
| Control and management plane logging and audit | Yes | Azure Resource Manager Activity Log |
| Data plane logging and audit| Yes | Service Diagnostic Logs, and Azure Monitor Logging starting preview  |

## Identity

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory, Shared key, Shared access token. |
| Authorization| Yes | Support Authorization via RBAC, POSIX ACLs, and SAS Tokens |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Support Resource Provider versioning through Azure Resource Manager APIs |