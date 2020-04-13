---
title: Security controls for Azure Storage
description: A checklist of security controls for evaluating Azure Storage
services: storage

author: msmbaldwin

ms.service: storage
ms.subservice: common
ms.topic: conceptual
ms.date: 09/04/2019
ms.author: mbaldwin

---
# Security controls for Azure Storage

This article documents the security controls built into Azure Storage. 

[!INCLUDE [Security controls Header](../../../includes/security-controls-header.md)]

## Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys | Yes |  |
| Server-side encryption at rest: customer-managed keys (BYOK) | Yes | See [Storage Service Encryption using customer-managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).|
| Column level encryption (Azure Data Services)| N/A |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | Support standard HTTPS/TLS mechanisms.  Users can also encrypt data before it is transmitted to the service. |
| API calls encrypted| Yes |  |

## Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| N/A |  |
| Network isolation and firewalling support| Yes | |
| Forced tunneling support| N/A |  |

## Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Azure Monitor Metrics|
| Control and management plane logging and audit | Yes | Azure Resource Manager Activity Log |
| Data plane logging and audit| Yes | Service Diagnostic Logs.|

## Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory, Shared key, Shared access token. |
| Authorization| Yes | Support Authorization via RBAC, POSIX ACLs, and SAS Tokens |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Support Resource Provider versioning through Azure Resource Manager APIs |

## Next steps

- Learn more about the [built-in security controls across Azure services](../../security/fundamentals/security-controls.md).