---
title: include file
description: include file
services: azure-policy
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 09/18/2018
ms.author: dacoulte
ms.custom: include file
---

### SQL Servers

|  |  |
|---------|---------|
| [Audit no Azure Active Directory administrator](../articles/governance/policy/samples/audit-no-aad-admin.md) | Audit when there is no Azure Active Directory administrator assigned to the SQL server. |
| [Audit Server level threat detection setting](../articles/governance/policy/samples/audit-sql-ser-threat-det-setting.md) | Audits SQL database security alert policies if those policies are not set to specified state. You specify a value that indicates whether threat detection is enabled or disabled.  |
| [Audit SQL Server audit settings](../articles/governance/policy/samples/sql-server-audit.md) | Audits SQL server based on whether the audit settings are enabled. |
| [Audit SQL Server Level Audit Setting](../articles/governance/policy/samples/audit-sql-ser-leve-audit-setting.md) | Audits SQL server audit settings if those settings do not match a specified setting. You specify a value that indicates whether audit settings should be enabled or disabled. |
| [Require SQL Server version 12.0](../articles/governance/policy/samples/req-sql-12.md) | Requires SQL servers to use version 12.0.  |