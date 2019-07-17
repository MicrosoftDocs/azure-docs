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

This article documents the common security attributes that are built into Azure SQL Database.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

SQL Database includes both [single database](sql-database-single-index.yml) and [managed instance](sql-database-managed-instance.md). The following entries apply to both offerings except where otherwise noted.

## Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features, such as client side or Always Encrypted</ul>| Yes | Called "encryption-in-use," as described in the article [Always Encrypted](sql-database-always-encrypted.md). Server-side encryption uses [transparent data encryption](transparent-data-encryption-azure-sql.md).|
| Encryption in transit:<ul><li>Azure ExpressRoute encryption</li><li>Encryption in a virtual network</li><li>Encryption between virtual networks</ul>| Yes | Using HTTPS. |
| Encryption-key handling, such as CMK or BYOK| Yes | Both service-managed and customer-managed key handling are offered. The latter is offered through [Azure Key Vault](../key-vault/index.yml). |
| Column-level encryption provided by Azure data services| Yes | Through [Always Encrypted](sql-database-always-encrypted.md). |
| Encrypted API calls| Yes | Using HTTPS/SSL. |

## Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Applies to [single database](sql-database-single-index.yml) only. |
| Azure Virtual Network injection support| Yes | Applies to [managed instance](sql-database-managed-instance.md) only. |
| Network isolation and firewall support| Yes | Firewall at both database level and server level. Network isolation is for [managed instance](sql-database-managed-instance.md) only. |
| Forced tunneling support| Yes | [Managed instance](sql-database-managed-instance.md) via an [ExpressRoute](../expressroute/index.yml) VPN. |

## Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support, such as Log Analytics or Application Insights| Yes | SecureSphere, the SIEM solution from Imperva, is also supported through [Azure Event Hubs](../event-hubs/index.yml) integration via [SQL auditing](sql-database-auditing.md). |

## Identity and access management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory (Azure AD) |
| Authorization| Yes | None |

## Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control-plane and management-plane logging and audit| Yes | Yes for some events only |
| Data-plane logging and audit | Yes | Via [SQL audit](sql-database-auditing.md) |

## Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration-management support, such as versioning of configuration| No  | None |

## Additional security attributes for SQL Database

| Security attribute | Yes/No | Notes|
|---|---|--|
| Preventative: vulnerability assessment | Yes | See [SQL Vulnerability Assessment service helps you identify database vulnerabilities](sql-vulnerability-assessment.md). |
| Preventative: data discovery and classification  | Yes | See [Azure SQL Database and SQL Data Warehouse data discovery & classification](sql-database-data-discovery-and-classification.md). |
| Detection: threat detection | Yes | See [Advanced Threat Protection for Azure SQL Database](sql-database-threat-detection-overview.md). |
