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

Azure SQL Database includes both [single database](sql-database-single-index.yml) and [managed instance](sql-database-managed-instance.md). The entries below apply to both offerings, except where otherwise noted.

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | Referred to as "encryption-in-use", as described in the article [Always Encrypted](sql-database-always-encrypted.md). Service-side encryption uses [transparent data encryption](transparent-data-encryption-azure-sql.md) (TDE).|
| Encryption in Transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | Using HTTPS. |
| Encryption Key Handling (CMK, BYOK, etc.)| Yes | Both service-managed and customer-managed key handling are offered (the latter through [Azure Key Vault](../key-vault/index.yml). |
| Column Level Encryption (Azure Data Services)| Yes | Through [Always Encrypted](sql-database-always-encrypted.md). |
| API calls encrypted| Yes | Using HTTPS/SSL. |

## Network Segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service Endpoint support| Yes | Applies to [single database](sql-database-single-index.yml) only. |
| vNET Injection support| Yes | Applies to [managed instance](sql-database-managed-instance.md) only. |
| Network Isolation / Firewalling support| Yes | Firewall at both database- and server-level; network isolation for [managed instance](sql-database-managed-instance.md) only |
| Support for forced tunneling | Yes | [managed instance](sql-database-managed-instance.md) via [Azure Express Route](../expressroute/index.yml) VPN |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | The third-party SIEM solution from Imperva (SecureSphere) is also supported, through [Azure Event Hubs](../event-hubs/index.yml) integration via [SQL audit](sql-database-auditing.md). |

## IAM Support

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Access management - Authentication| Yes | Azure Active Directory. |
| Access management - Authorization| Yes |  |


## Audit Trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control/Management Plan Logging and Audit| Yes | Yes for some events only. |
| Data plane Logging and Audit | Yes | Via [SQL audit](sql-database-auditing.md). |

## Configuration Management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| No  | | 

## Additional Security Attributes for SQL Database

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Preventative: vulnerability assessment | Yes | See [SQL Vulnerability Assessment service helps you identify database vulnerabilities](sql-vulnerability-assessment.md) |
| Preventative: data discovery and classification  | Yes | See [Azure SQL Database and SQL Data Warehouse data discovery & classification](sql-database-data-discovery-and-classification.md) |
| Detection: threat detection | Yes | See [Advanced Threat Protection for Azure SQL Database](sql-database-threat-detection-overview.md) |
