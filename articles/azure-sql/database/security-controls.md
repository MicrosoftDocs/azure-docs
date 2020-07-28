---
title: Security controls
description: A checklist of security controls for evaluating Azure SQL Database
services: sql-database
author: msmbaldwin
manager: rkarlin
ms.service: load-balancer
ms.topic: conceptual
ms.date: 09/04/2019
ms.author: mbaldwin
---
# Security controls for Azure SQL Database and SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This article documents the security controls that are built into Azure SQL Database and Azure SQL Managed Instance.

[!INCLUDE [Security controls Header](../../../includes/security-controls-header.md)]



## Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | Applies to [SQL Database](../index.yml) only. |
| Azure Virtual Network injection support| Yes | Applies to [SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) only. |
| Network isolation and firewall support| Yes | Firewall at both database level and server level. Network isolation is for [SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) only. |
| Forced tunneling support| Yes | [SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) via an [ExpressRoute](../expressroute/../index.yml) VPN. |

## Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support, such as Log Analytics or Application Insights| Yes | SecureSphere, the SIEM solution from Imperva, is also supported through [Azure Event Hubs](../event-hubs/../index.yml) integration via [SQL auditing](../../azure-sql/database/auditing-overview.md). |
| Control-plane and management-plane logging and audit| Yes | Yes for some events only |
| Data-plane logging and audit | Yes | Via [SQL audit](../../azure-sql/database/auditing-overview.md) |

## Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Azure Active Directory (Azure AD) |
| Authorization| Yes | None |

## Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys | Yes | Called "encryption-in-use," as described in the article [Always Encrypted](always-encrypted-certificate-store-configure.md). Server-side encryption uses [transparent data encryption](transparent-data-encryption-tde-overview.md).|
| Encryption in transit:<ul><li>Azure ExpressRoute encryption</li><li>Encryption in a virtual network</li><li>Encryption between virtual networks</ul>| Yes | Using HTTPS. |
| Encryption-key handling, such as CMK or BYOK| Yes | Both service-managed and customer-managed key handling are offered. The latter is offered through [Azure Key Vault](../key-vault/../index.yml). |
| Column-level encryption provided by Azure data services| Yes | Through [Always Encrypted](always-encrypted-certificate-store-configure.md). |
| Encrypted API calls| Yes | Using HTTPS/TLS. |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration-management support, such as versioning of configuration| No  | None |

## Additional security controls for SQL Database

| Security control | Yes/No | Notes|
|---|---|--|
| Preventative: vulnerability assessment | Yes | See [SQL Vulnerability Assessment service helps you identify database vulnerabilities](sql-vulnerability-assessment.md). |
| Preventative: data discovery and classification  | Yes | See [Azure SQL Database and SQL Data Warehouse data discovery & classification](data-discovery-and-classification-overview.md). |
| Detection: threat detection | Yes | See [Advanced Threat Protection for Azure SQL Database](threat-detection-overview.md). |

## Next steps

- Learn more about the [built-in security controls across Azure services](../../security/fundamentals/security-controls.md).
