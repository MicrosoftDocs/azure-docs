---
title: Common security attributes for Azure Storage
description: A checklist of common security attributes for evaluating Azure Storage
services: storage
documentationcenter: ''
author: msmbaldwin
manager: barbkess
ms.service: storage
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: mbaldwin

---
# Common security attributes for Azure Storage

Security is integrated into every aspect of an Azure service. This article documents the common security attributes built into Azure Storage. 

[!INCLUDE [Security Attributes Header](../../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes |  |
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | Support standard HTTPS/TLS mechanisms.  Users can also encrypt data before it is transmitted to the service. |
| Encryption Key Handling (CMK, BYOK, etc.)| Yes | See [Storage Service Encryption using customer-managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).|
| Column Level Encryption (Azure Data Services)| N/A |  |
| API calls encrypted| Yes |  |

## Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| Yes |  |
| vNET Injection support| N/A |  |
| Network Isolation / Firewalling support| Yes | |
| Support for forced tunneling | N/A |  |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Azure Monitor Metrics available now, Logs starting preview |

## IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Azure Active Directory, Shared key, Shared access token. |
| Access management - Authorization| Yes | Support Authorization via RBAC, POSIX ACLs, and SAS Tokens |


## Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management Plan Logging and Audit | Yes | Azure Resource Manager Activity Log |
| Data plane Logging and Audit| Yes | Service Diagnostic Logs, and Azure Monitor Logging starting preview  |

## Configuration Management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Support Resource Provider versioning through Azure Resource Manager APIs |