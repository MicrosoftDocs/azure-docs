---
title: include file
description: include file
services: azure-policy
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 05/17/2018
ms.author: dacoulte
ms.custom: include file
---

### SQL Databases

|  |  |
|---------|---------|
| [Allowed SQL DB SKUs](../articles/azure-policy/scripts/allowed-sql-db-skus.md) | Requires SQL databases use an approved SKU. You specify an array of allowed SKU IDs or an array of allowed SKU names. |
| [Audit DB level threat detection setting](../articles/azure-policy/scripts/audit-db-threat-det-setting.md) | Audits SQL database security alert policies if those policies are not set to specified state. You specify a value that indicates whether threat detection is enabled or disabled.  |
| [Audit SQL Database encryption](../articles/azure-policy/scripts/sql-database-encryption-audit.md) | Audits if SQL database does not have transparent data encryption enabled. |
| [Audit SQL DB Level Audit Setting](../articles/azure-policy/scripts/audit-sql-db-audit-setting.md) | Audits SQL database audit settings if those settings do not match a specified setting. You specify a value that indicates whether audit settings should be enabled or disabled.  |
| [Audit transparent data encryption status](../articles/azure-policy/scripts/audit-trans-data-enc-status.md) | Audits SQL database transparent data encryption if it is not enabled.  |