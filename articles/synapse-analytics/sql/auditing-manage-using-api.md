---
title: Manage Auditing Using APIs
titleSuffix: Azure Synapse Analytics
description: Use PowerShell, the Azure CLI, REST APIs, or Azure Resource Manager to manage Azure Synapse Analytics auditing.
author: sravanisaluru
ms.author: srsaluru
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
ms.custom:
  - devx-track-azurepowershell
---

# Manage Azure Synapse Analytics auditing by using APIs

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]


You can manage Azure Synapse Analytics auditing at the server or database level by using PowerShell, the Azure CLI, or REST APIs.

## PowerShell

Use the following Az.Sql cmdlets for Synapse SQL auditing:

- [Set-AzSqlDatabaseAudit](/powershell/module/az.sql/set-azsqldatabaseaudit)
- [Set-AzSqlServerAudit](/powershell/module/az.sql/set-azsqlserveraudit)
- [Get-AzSqlDatabaseAudit](/powershell/module/az.sql/get-azsqldatabaseaudit)
- [Get-AzSqlServerAudit](/powershell/module/az.sql/get-azsqlserveraudit)
- [Remove-AzSqlDatabaseAudit](/powershell/module/az.sql/remove-azsqldatabaseaudit)
- [Remove-AzSqlServerAudit](/powershell/module/az.sql/remove-azsqlserveraudit)
- [Set-AzSqlServerMSSupportAudit](/powershell/module/az.sql/set-azsqlservermssupportaudit)

## REST API

Use the following resources to create, retrieve, or update auditing policies:


- [Create or Update Database Auditing Policy](/rest/api/sql/database-blob-auditing-policies/create-or-update)
- [Create or Update Server Auditing Policy](/rest/api/sql/server-blob-auditing-policies/create-or-update)
- [Create or Update Microsoft support operations audit policy](/rest/api/sql/server-devops-audit-settings/create-or-update)
- [Get Database Auditing Policy](/rest/api/sql/database-blob-auditing-policies/get)
- [Get Server Auditing Policy](/rest/api/sql/server-blob-auditing-policies/get)

Extended policy with `WHERE` clause support for additional filtering:

- [Create or Update Database *Extended* Auditing Policy](/rest/api/sql/extended-database-blob-auditing-policies/create-or-update)
- [Create or Update Server *Extended* Auditing Policy](/rest/api/sql/extended-server-blob-auditing-policies/create-or-update)
- [Get Database *Extended* Auditing Policy](/rest/api/sql/extended-database-blob-auditing-policies/get)
- [Get Server *Extended* Auditing Policy](/rest/api/sql/extended-server-blob-auditing-policies/get)

## Azure CLI

- [Manage a server auditing policy](/cli/azure/sql/server/audit-policy)
- [Manage a database auditing policy](/cli/azure/sql/db/audit-policy)
- [Manage a Microsoft support operations auditing policy](/cli/azure/sql/server/ms-support/audit-policy)


## Related content

- [Auditing in Azure Synapse Analytics](auditing-overview.md)
- [Set up auditing for Azure Synapse Analytics](auditing-setup.md)
- [Auditing policy at the server and database level](auditing-server-level-database-level.md)
