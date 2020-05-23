---
title: "PowerShell: Update SQL Data Sync sync schema"
description: Azure PowerShell example script to update the sync schema for SQL Data Sync
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: sqldbrb=1
ms.devlang: PowerShell
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 03/12/2019
---
# Use PowerShell to update the sync schema in an existing sync group
[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure PowerShell example updates the sync schema in an existing SQL Data Sync sync group. When you're syncing multiple tables, this script helps you to update the sync schema efficiently. This example demonstrates the use of the **UpdateSyncSchema** script, which is available on GitHub as [UpdateSyncSchema.ps1](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/sql-data-sync/UpdateSyncSchema.ps1).

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Az PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

For an overview of SQL Data Sync, see [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync](../sql-data-sync-data-sql-server-sql-database.md).

> [!IMPORTANT]
> SQL Data Sync does not support Azure SQL Managed Instance at this time.

## Examples

### Add all tables to the sync schema

The following example refreshes the database schema and adds all valid tables in the hub database to the sync schema.

```powershell-interactive
UpdateSyncSchema.ps1 -SubscriptionId <subscriptionId> -ResourceGroupName <resourceGroupName> -ServerName <serverName> -DatabaseName <databaseName> `
    -SyncGroupName <syncGroupName> -RefreshDatabaseSchema $true -AddAllTables $true
```

### Add and remove tables and columns

The following example adds `[dbo].[Table1]` and `[dbo].[Table2].[Column1]` to the sync schema and removes `[dbo].[Table3]`.

```powershell-interactive
UpdateSyncSchema.ps1 -SubscriptionId <subscriptionId> -ResourceGroupName <resourceGroupName> -ServerName <serverName> -DatabaseName <databaseName> `
    -SyncGroupName <syncGroupName> -TablesAndColumnsToAdd "[dbo].[Table1],[dbo].[Table2].[Column1]" -TablesAndColumnsToRemove "[dbo].[Table3]"
```

## Script parameters

The **UpdateSyncSchema** script has the following parameters:

| Parameter | Notes |
|---|---|
| $subscriptionId | The subscription where the sync group is created. |
| $resourceGroupName | The resource group where the sync group is created.|
| $serverName | The server name of the hub database.|
| $databaseName | The hub database name. |
| $syncGroupName | The sync group name. |
| $memberName | Specify the member name if you want to load the database schema from the sync member instead of from the hub database. If you want to load the database schema from the hub, leave this parameter empty. |
| $timeoutInSeconds | Timeout when the script refreshes database schema. Default is 900 seconds. |
| $refreshDatabaseSchema | Specify whether the script needs to refresh the database schema. If your database schema changed from the previous configuration (for example, if you added a new table or anew column), you need to refresh the schema before you reconfigure it. Default is false. |
| $addAllTables | If this value is true, all valid tables and columns are added to the sync schema. The values of $TablesAndColumnsToAdd and $TablesAndColumnsToRemove are ignored. |
| $tablesAndColumnsToAdd | Specify tables or columns to be added to the sync schema. Each table or column name needs to be fully delimited with the schema name. For example: `[dbo].[Table1]`, `[dbo].[Table2].[Column1]`. Multiple table or column names can be specified and separated by a comma (,). |
| $tablesAndColumnsToRemove | Specify tables or columns to be removed from the sync schema. Each table or column name needs to be fully delimited with schema name. For example: `[dbo].[Table1]`, `[dbo].[Table2].[Column1]`. Multiple table or column names can be specified and separated by a comma (,). |

## Script explanation

The **UpdateSyncSchema** script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzSqlSyncGroup](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlsyncgroup) | Returns information about a sync group. |
| [Update-AzSqlSyncGroup](https://docs.microsoft.com/powershell/module/az.sql/update-azsqlsyncgroup) | Updates a sync group. |
| [Get-AzSqlSyncMember](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlsyncmember) | Returns information about a sync member. |
| [Get-AzSqlSyncSchema](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlsyncschema) | Returns information about a sync schema. |
| [Update-AzSqlSyncSchema](https://docs.microsoft.com/powershell/module/az.sql/update-azsqlsyncschema) | Updates a sync schema. |

## Next steps

For more information about Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in [Azure SQL Database PowerShell scripts](../powershell-script-content-guide.md).

For more information about SQL Data Sync, see:

- Overview - [Sync data between Azure SQL Database and SQL Server with SQL Data Sync in Azure](../sql-data-sync-data-sql-server-sql-database.md)
- Set up Data Sync
    - Use the Azure portal - [Tutorial: Set up SQL Data Sync to sync data between Azure SQL Database and SQL Server](../sql-data-sync-sql-server-configure.md)
    - Use PowerShell
        -  [Use PowerShell to sync data between multiple databases in Azure SQL Database](sql-data-sync-sync-data-between-sql-databases.md)
        -  [Use PowerShell to sync data between Azure SQL Database and SQL Server](sql-data-sync-sync-data-between-azure-onprem.md)
- Data Sync Agent - [Data Sync Agent for SQL Data Sync in Azure](../sql-data-sync-agent-overview.md)
- Best practices - [Best practices for SQL Data Sync in Azure](../sql-data-sync-best-practices.md)
- Monitor - [Monitor SQL Data Sync with Azure Monitor logs](../sql-data-sync-monitor-sync.md)
- Troubleshoot - [Troubleshoot issues with SQL Data Sync in Azure](../sql-data-sync-troubleshoot.md)
- Update the sync schema
    - Use Transact-SQL - [Automate the replication of schema changes in SQL Data Sync in Azure](../sql-data-sync-update-sync-schema.md)

For more information about SQL Database, see:

- [SQL Database overview](../sql-database-paas-overview.md)
- [Database Lifecycle Management](https://msdn.microsoft.com/library/jj907294.aspx)
