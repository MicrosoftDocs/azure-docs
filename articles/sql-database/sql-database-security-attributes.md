---
title: Security attributes for Azure SQL Database
description: A checklist of security attributes for evaluating Azure SQL Database
services: sql-database
author: msmbaldwin
manager: barbkess
ms.service: load-balancer

ms.topic: conceptual
ms.date: 05/06/2019
ms.author: mbaldwin

---
# Security attributes for Azure SQL Database

This article documents the common security attributes built into Azure SQL Database.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

Azure SQL Database includes both [single database](sql-database-single-index.yml) and [managed instance](sql-database-managed-instance.md). The entries below apply to both offerings, except where otherwise noted.

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | Referred to as "encryption-in-use", as described in the article [Always Encrypted](sql-database-always-encrypted.md). Service-side encryption uses [transparent data encryption](transparent-data-encryption-azure-sql.md) (TDE).|
| Encryption in transit:<ul><li>ExpressRoute encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes | Using HTTPS. |
| Encryption key handling (CMK, BYOK, etc.)| Yes | Both service-managed and customer-managed key handling are offered (the latter through [Azure Key Vault](../key-vault/index.yml). |
| Column level encryption (Azure Data Services)| Yes | Through [Always Encrypted](sql-database-always-encrypted.md). |
| API calls encrypted| Yes | Using HTTPS/SSL. |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Applies to [single database](sql-database-single-index.yml) only. |
| VNet injection support| Yes | Applies to [managed instance](sql-database-managed-instance.md) only. |
| Network isolation and firewalling support| Yes | Firewall at both database- and server-level; network isolation for [managed instance](sql-database-managed-instance.md) only |
| Forced tunneling support| Yes | [managed instance](sql-database-managed-instance.md) via [Azure ExpressRoute](../expressroute/index.yml) VPN |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | The third-party SIEM solution from Imperva (SecureSphere) is also supported, through [Azure Event Hubs](../event-hubs/index.yml) integration via [SQL audit](sql-database-auditing.md). |

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory. |
| Authorization| Yes |  |


## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Yes for some events only. |
| Data plane logging and audit | Yes | Via [SQL audit](sql-database-auditing.md). |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| No  | | 

## Additional security attributes for SQL Database

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Preventative: vulnerability assessment | Yes | See [SQL Vulnerability Assessment service helps you identify database vulnerabilities](sql-vulnerability-assessment.md). |
| Preventative: data discovery and classification  | Yes | See [Azure SQL Database and SQL Data Warehouse data discovery & classification](sql-database-data-discovery-and-classification.md). |
| Detection: threat detection | Yes | See [Advanced Threat Protection for Azure SQL Database](sql-database-threat-detection-overview.md). |
