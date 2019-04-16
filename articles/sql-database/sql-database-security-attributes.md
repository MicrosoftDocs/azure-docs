---
title: Common security attributes for Azure SQL Database
description: A checklist of common security attributes for evaluating Azure SQL Database
services: load-balancer
documentationcenter: ''
author: msmbaldwin
manager: barbkess
ms.service: load-balancer

ms.topic: conceptual
ms.date: 04/16/2019
ms.author: mbaldwin

---
# Common security attributes for Azure SQL Database

Security is integrated into every aspect of an Azure service. This article documents the common security attributes built into Azure SQL Database

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes |  |
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | Using HTTPS. |
| Encryption Key Handling (CMK, BYOK, etc.)| Yes | Both service-managed and customer-managed key handling are offered (the latter through [Azure Key Vault](../key-vault/index.yml). |
| Column Level Encryption (Azure Data Services)| Yes | Through [Always Encrypted](sql-database-always-encrypted.md). |
| API calls encrypted| Yes | Using HTTPS/SSL. |

## Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| Yes |  |
| vNET Injection support| Yes | Applies to Azure SQL Database Managed Instance only. |
| Network Isolation / Firewalling support| Yes | Firewall at both database- and server-level. Network isolation (based on how we understand network isolation) for Azure SQL Database Managed instance only |
| Support for forced tunneling | Yes | Azure SQL DB Managed Instance via Express Route/VPN |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | We also support 3rd party SIEM solution from Imperva (SecureSphere) through EventHub integration (via SQL Audit) |

## IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Azure Active Directory. |
| Access management - Authorization| XXX |  |


## Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management Plan Logging and Audit| Yes | Yes for some events only. |
| Data plane Logging and Audit | Yes | Via [SQL audit](sql-database-auditing.md). |

## Configuration Management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| No  | | 