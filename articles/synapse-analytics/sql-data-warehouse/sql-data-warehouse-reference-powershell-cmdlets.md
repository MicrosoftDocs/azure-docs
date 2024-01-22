---
title: PowerShell & REST APIs for dedicated SQL pool (formerly SQL DW)
description: Top PowerShell cmdlets for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics including how to pause and resume a database.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 04/17/2018
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - seo-lt-2019
  - devx-track-azurepowershell
---

# PowerShell for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics

Many dedicated SQL pool administrative tasks can be managed using either Azure PowerShell cmdlets or REST APIs.  Below are some examples of how to use PowerShell commands to automate common tasks in your dedicated SQL pool (formerly SQL DW).  For some good REST examples, see the article [Manage scalability with REST](sql-data-warehouse-manage-compute-rest-api.md).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

> [!NOTE]
> This article applies for standalone dedicated SQL pools (formerly SQL DW) and are not applicable to a dedicated SQL pool created in an Azure Synapse Analytics workspace. There are different PowerShell cmdlets to use for each, for example, use [Suspend-AzSqlDatabase](/powershell/module/az.sql/suspend-azsqldatabase) for a dedicated SQL pool (formerly SQL DW), but [Suspend-AzSynapseSqlPool](/powershell/module/az.synapse/suspend-azsynapsesqlpool) for a dedicated SQL pool in an Azure Synapse Workspace. For instructions to pause and resume a dedicated SQL pool created in an Azure Synapse Analytics workspace, see [Quickstart: Pause and resume compute in dedicated SQL pool in a Synapse Workspace with Azure PowerShell](pause-and-resume-compute-workspace-powershell.md). For more on the differences between dedicated SQL pool (formerly SQL DW) and dedicated SQL pools in Azure Synapse Workspaces, read [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772).

## Get started with Azure PowerShell cmdlets

1. Open Windows PowerShell.
2. At the PowerShell prompt, run these commands to sign in to the Azure Resource Manager and select your subscription.

    ```powershell
    Connect-AzAccount
    Get-AzSubscription
    Select-AzSubscription -SubscriptionName "MySubscription"
    ```

## Pause data warehouse example

Pause a database named "Database02" hosted on a server named "Server01."  The server is in an Azure resource group named "ResourceGroup1."

```powershell
Suspend-AzSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
```

A variation, this example pipes the retrieved object to [Suspend-AzSqlDatabase](/powershell/module/az.sql/suspend-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).  As a result, the database is paused. The final command shows the results.

```powershell
$database = Get-AzSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Suspend-AzSqlDatabase
$resultDatabase
```

## Start data warehouse example

Resume operation of a database named "Database02" hosted on a server named "Server01." The server is contained in a resource group named "ResourceGroup1."

```powershell
Resume-AzSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" -DatabaseName "Database02"
```

A variation, this example retrieves a database named "Database02" from a server named "Server01" that is contained in a resource group named "ResourceGroup1." It pipes the retrieved object to [Resume-AzSqlDatabase](/powershell/module/az.sql/resume-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

```powershell
$database = Get-AzSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Resume-AzSqlDatabase
```

> [!NOTE]
> Note that if your server is foo.database.windows.net, use "foo" as the -ServerName in the PowerShell cmdlets.

## Other supported PowerShell cmdlets

These PowerShell cmdlets are supported with Azure Synapse Analytics data warehouse.

* [Get-AzSqlDatabase](/powershell/module/az.sql/get-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
* [Get-AzSqlDeletedDatabaseBackup](/powershell/module/az.sql/get-azsqldeleteddatabasebackup?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
* [Get-AzSqlDatabaseRestorePoint](/powershell/module/az.sql/get-azsqldatabaserestorepoint?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
* [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
* [Remove-AzSqlDatabase](/powershell/module/az.sql/remove-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
* [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
* [Resume-AzSqlDatabase](/powershell/module/az.sql/resume-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
* [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
* [Suspend-AzSqlDatabase](/powershell/module/az.sql/suspend-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)

## Next steps

For more PowerShell examples, see:

* [Create a data warehouse using PowerShell](create-data-warehouse-powershell.md)
* [Database restore](sql-data-warehouse-restore-points.md)

For other tasks that can be automated with PowerShell, see [Azure SQL Database cmdlets](/powershell/module/az.sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). Not all Azure SQL Database cmdlets are supported for Azure Synapse Analytics data warehouse. For a list of tasks that can be automated with REST, see [Operations for Azure SQL Database](/rest/api/sql/?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).
