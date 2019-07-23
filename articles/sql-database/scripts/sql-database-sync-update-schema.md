---
title: PowerShell example - Update SQL Data Sync sync schema | Microsoft Docs
description: Azure PowerShell example script to update the sync schema for SQL Data Sync
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: 
ms.devlang: PowerShell
ms.topic: sample
author: allenwux
ms.author: xiwu
ms.reviewer: carlrab
manager: craigg
ms.date: 03/12/2019
---
# Use PowerShell to update the sync schema in an existing sync group

This PowerShell example updates the sync schema in an existing SQL Data Sync sync group. When you're syncing multiple tables, this script helps you to update the sync schema efficiently. This example demonstrates the use of the **UpdateSyncSchema** script, which is available on GitHub as [UpdateSyncSchema.ps1](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/sql-data-sync/UpdateSyncSchema.ps1).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the PowerShell locally, this tutorial requires AZ PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

For an overview of SQL Data Sync, see [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync](../sql-database-sync-data.md).

> [!IMPORTANT]
> Azure SQL Data Sync does **not** support Azure SQL Database Managed Instance at this time.

## Sample script

### Example 1 - Add all tables to the sync schema

The following example refreshes the database schema and adds all valid tables in the hub database to the sync schema.

```powershell-interactive
UpdateSyncSchema.ps1 -SubscriptionId <subscription_id> -ResourceGroupName <resource_group_name> -ServerName <server_name> -DatabaseName <database_name> -SyncGroupName <sync_group_name> -RefreshDatabaseSchema $true -AddAllTables $true
```

### Example 2 - Add and remove tables and columns

The following example adds `[dbo].[Table1]` and `[dbo].[Table2].[Column1]` to the sync schema and removes `[dbo].[Table3]`.

```powershell-interactive
UpdateSyncSchema.ps1 -SubscriptionId <subscription_id> -ResourceGroupName <resource_group_name> -ServerName <server_name> -DatabaseName <database_name> -SyncGroupName <sync_group_name> -TablesAndColumnsToAdd "[dbo].[Table1],[dbo].[Table2].[Column1]" -TablesAndColumnsToRemove "[dbo].[Table3]"
```

## Script parameters

The **UpdateSyncSchema** script has the following parameters:

| Parameter | Notes |
|---|---|
| $SubscriptionId | The subscription where the sync group is created. |
| $ResourceGroupName | The resource group where the sync group is created.|
| $ServerName | The server name of the hub database.|
| $DatabaseName | The hub database name. |
| $SyncGroupName | The sync group name. |
| $MemberName | Specify the member name if you want to load the database schema from the sync member instead of from the hub database. If you want to load the database schema from the hub, leave this parameter empty. |
| $TimeoutInSeconds | Timeout when the script refreshes database schema. Default is 900 seconds. |
| $RefreshDatabaseSchema | Specify whether the script needs to refresh the database schema. If your database schema changed from the previous configuration - for example, if you added a new table or anew column), you need to refresh the schema before you reconfigure it. Default is false. |
| $AddAllTables | If this value is true, all valid tables and columns are added to the sync schema. The values of $TablesAndColumnsToAdd and $TablesAndColumnsToRemove are ignored. |
| $TablesAndColumnsToAdd | Specify tables or columns to be added to the sync schema. Each table or column name needs to be fully delimited with the schema name. For example: `[dbo].[Table1]`, `[dbo].[Table2].[Column1]`. Multiple table or column names can be specified and separated by commas (,). |
| $TablesAndColumnsToRemove | Specify tables or columns to be removed from the sync schema. Each table or column name needs to be fully delimited with schema name. For example: `[dbo].[Table1]`, `[dbo].[Table2].[Column1]`. Multiple table or column names can be specified and separated by commas (,). |
|||

## Script explanation

The **UpdateSyncSchema** script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzSqlSyncGroup](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlsyncgroup) | Returns info about a sync group. |
| [Update-AzSqlSyncGroup](https://docs.microsoft.com/powershell/module/az.sql/update-azsqlsyncgroup) | Updates a sync group. |
| [Get-AzSqlSyncMember](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlsyncmember) | Returns info about a sync member. |
| [Get-AzSqlSyncSchema](https://docs.microsoft.com/powershell/module/az.sql/get-azsqlsyncschema) | Returns info about a sync schema. |
| [Update-AzSqlSyncSchema](https://docs.microsoft.com/powershell/module/az.sql/update-azsqlsyncschema) | Updates a sync schema. |
|||

## Next steps

For more information about Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).

For more info about SQL Data Sync, see:

-   Overview - [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync](../sql-database-sync-data.md)
-   Set up Data Sync
    - In the portal - [Tutorial: Set up SQL Data Sync to sync data between Azure SQL Database and SQL Server on-premises](../sql-database-get-started-sql-data-sync.md)
    - With PowerShell
        -  [Use PowerShell to sync between multiple Azure SQL databases](sql-database-sync-data-between-sql-databases.md)
        -  [Use PowerShell to sync between an Azure SQL Database and a SQL Server on-premises database](sql-database-sync-data-between-azure-onprem.md)
-   Data Sync Agent - [Data Sync Agent for Azure SQL Data Sync](../sql-database-data-sync-agent.md)
-   Best practices - [Best practices for Azure SQL Data Sync](../sql-database-best-practices-data-sync.md)
-   Monitor - [Monitor SQL Data Sync with Azure Monitor logs](../sql-database-sync-monitor-oms.md)
-   Troubleshoot - [Troubleshoot issues with Azure SQL Data Sync](../sql-database-troubleshoot-data-sync.md)
-   Update the sync schema
    -   With Transact-SQL - [Automate the replication of schema changes in Azure SQL Data Sync](../sql-database-update-sync-schema.md)

For more info about SQL Database, see:

-   [SQL Database Overview](../sql-database-technical-overview.md)
-   [Database Lifecycle Management](https://msdn.microsoft.com/library/jj907294.aspx)
