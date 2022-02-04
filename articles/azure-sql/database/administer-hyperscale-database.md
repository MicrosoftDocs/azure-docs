---
title: How to administer a Hyperscale database
description: How to administer a Hyperscale database, including migrating to Hyperscale, restoring to a different region, and reverse migration.
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: kendralittle, mathoma
ms.date: 2/17/2022
---

# How to administer a Hyperscale database

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

 The [Hyperscale service tier](service-tier-hyperscale.md) provides a highly scalable storage and compute performance tier that leverages the Azure architecture to scale out storage and compute resources for an Azure SQL Database substantially beyond the limits available for the General Purpose and Business Critical service tiers. This article describes how to carry out essential administration tasks for Hyperscale databases, including migrating an existing database to Hyperscale, restoring a Hyperscale database to a different region, reverse migrating from Hyperscale to another service tier, and monitoring the status of ongoing and recent operations against a Hyperscale database.

Learn how to create a new Hyperscale database in [Quickstart: Create a Hyperscale database in Azure SQL Database](hyperscale-database-create-quickstart.md).

## Migrate an existing database to Hyperscale

You can migrate databases to Hyperscale using the Azure portal, the Azure CLI, PowerShell, or Transact-SQL.

### Prerequisites

To move a database that is a part of a [geo-replication](active-geo-replication-overview.md) relationship, either as the primary or as a secondary, to Hyperscale, you need to stop replication. Databases in a [failover group](auto-failover-group-overview.md) must be removed from the group first.

Once a database has been moved to Hyperscale, you can create a new Hyperscale geo-replica for that database. Geo-replication for Hyperscale is in preview with certain [limitations](active-geo-replication-overview.md).

### Duration of migration and expected downtime

The time required to move an existing database to Hyperscale consists of the time to copy data and the time to replay the changes made in the source database while copying data. The data copy time is proportional to data size. The time to replay changes will be shorter if the move is done during a period of low write activity.

You will only experience a short period of downtime, generally a few minutes, during the final cutover to the Hyperscale service tier.

### Migrate a database to the Hyperscale service tier

To migrate an existing database to the Hyperscale service tier, first identify your target service objective. Review [resource limits for single databases](resource-limits-vcore-single-databases.md#hyperscale---provisioned-compute---gen4) if you are not sure which service objective is right for your database.

Select the tab for your preferred tool to migrate your database:

# [Portal](#tab/azure-portal)

TODO: add portal steps and screenshots.

# [Azure CLI](#tab/azure-cli)

<!---
TODO: find or create an article to link to for CLI setup so that it's also easy to link to from other examples and doesn't need to be repeated everywhere.

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](../../../includes/azure-cli-prepare-your-environment-h3.md)]

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]
--> 


This sample code calls [az sql db update](/cli/azure/sql/db#az_sql_db_update) to migrate a database into the Hyperscale service tier. You must specify both the edition and service objective.

Replace `resourceGroupName`, `serverName`, and `databaseName` with the appropriate values before running the following code sample:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"

az sql db update -g $resourceGroupName -s $serverName -n $databaseName --edition Hyperscale --service-objective HS_Gen5_4

```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

# [PowerShell](#tab/azure-powershell)

The following example uses the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) cmdlet to migrate a database into the Hyperscale service tier. You must specify both the edition and service objective.

Replace `$resourceGroupName`, `$serverName`, and `$databaseName` with the appropriate values before running this code sample from a PowerShell command prompt:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"

Set-AzSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName -DatabaseName $databaseName -Edition "Hyperscale" -RequestedServiceObjectiveName "HS_Gen5_4"

```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

# [Transact-SQL](#tab/t-sql)

To migrate an existing database to the Hyperscale service tier with Transact-SQL, first connect to the master database on your [logical SQL server](logical-servers.md) using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

You must specify both the edition and service objective in the [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?preserve-view=true&view=azuresqldb-current) statement.

This example statement migrates a database named `mySampleDatabase` to the Hyperscale service tier with the `HS_Gen5_4` service objective. Replace the database name with the appropriate value before executing the statement.

```sql
ALTER DATABASE [mySampleDatabase] MODIFY (EDITION = 'Hyperscale', SERVICE_OBJECTIVE = 'HS_Gen5_4');
GO
```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

---

## Restore a Hyperscale database to a different region

If you need to restore a Hyperscale database in Azure SQL Database to a region other than the one it's currently hosted in, as part of a disaster recovery operation or drill, relocation, or any other reason, the primary method is to do a geo-restore of the database. This involves exactly the same steps as what you would use to restore any other database in SQL Database to a different region:

1. Create a [server](logical-servers.md) in the target region if you don't already have an appropriate server there.  This server should be owned by the same subscription as the original (source) server.

1. Follow the instructions in the [geo-restore](./recovery-using-backups.md#geo-restore) topic of the page on restoring a database in Azure SQL Database from automatic backups.

Because the source and target are in separate regions, the database cannot share snapshot storage with the source database as in non-geo restores, which complete quickly regardless of database size. In the case of a geo-restore of a Hyperscale database, it will be a size-of-data operation, even if the target is in the paired region of the geo-replicated storage. 

Therefore, a geo-restore will take time proportional to the size of the database being restored. If the target is in the paired region, data transfer will be within a region, which will be significantly faster than a cross-region data transfer, but it will still be a size-of-data operation.

## Reverse migrate from Hyperscale

After you migrate an existing Azure SQL Database to the Hyperscale service tier, you can reverse migrate a Hyperscale database to the General Purpose service tier. Reverse migration is available within 45 days of the original migration to Hyperscale. If you wish to migrate the database to another service tier, such as Business Critical, reverse migrate to the General Purpose service tier, then perform a further migration.

### Reverse migration duration and expected downtime

In general, this process is a size-of-data operation. The duration of the reverse migration depends mainly on the size of the database and concurrent write activities happening during the migration. You will only experience a short period of downtime, generally a few minutes, during the final cutover to the new target General Purpose tier.

TODO: add steps here

## Monitor operations for a Hyperscale database

You can programmatically monitor the status of ongoing or recently completed operations for an Azure SQL Database using PowerShell, the Azure CLI, or Transact-SQL. Operations include migrations and restores.

TODO: add Azure CLI. Consider adding Portal and change to tabs.

### PowerShell

The [Get-AzSqlDatabaseActivity](/powershell/module/az.sql/get-azsqldatabaseactivity) cmdlet returns recent or ongoing operations for a database. 

From a PowerShell command prompt, set the `$resourceGroupName`, `$serverName`, and `$databaseName`, and then run the following command:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$databaseName = "mySampleDatabase"
$serverName = "server01"

Get-AzSqlDatabaseActivity -ResourceGroupName $resourceGroupName `
    -ServerName $serverName -DatabaseName $databaseName
```

### Transact-SQL

The [sys.dm_operation_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) Dynamic Management View returns information about operations performed on databases in a Azure SQL Database server.

This code sample returns all entires in `sys.dm_operation_status` for the specified database, sorted by which operations began most recently:

```sql
SELECT * 
FROM sys.dm_operation_status
WHERE major_resource_id = 'mySampleDatabase'
ORDER BY start_time DESC;
GO
```

## Review which databases are in the Hyperscale service tier

TODO: add other options to do this

### Transact SQL

To review the service tiers of all databases on a [logical SQL server](logical-servers.md) with Transact-SQL, first connect to the master database using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

Query the [sys.database_service_objectives](/sql/relational-databases/system-catalog-views/sys-database-service-objectives-azure-sql-database) system catalog view to review databases in the Hyperscale service tier:

```sql
SELECT d.name, dso.edition, dso.service_objective
FROM sys.database_service_objectives AS dso
JOIN sys.databases as d on dso.database_id = d.database_id
WHERE dso.edition = 'Hyperscale';
GO
```


## Next steps

Learn more about Hyperscale databases in the following articles:

- [Quickstart: Create a Hyperscale database in Azure SQL Database](hyperscale-database-create-quickstart.md)
- [Hyperscale service tier](service-tier-hyperscale.md)
- [Azure SQL Database Hyperscale FAQ](service-tier-hyperscale-frequently-asked-questions-faq.yml)
- [Hyperscale secondary replicas](service-tier-hyperscale-replicas.md)
- [Azure SQL Database Hyperscale named replicas FAQ](service-tier-hyperscale-named-replicas-faq.yml)