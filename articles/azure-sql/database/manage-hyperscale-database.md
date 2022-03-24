---
title: How to manage a Hyperscale database
description: How to manage a Hyperscale database, including migrating to Hyperscale, restoring to a different region, and reverse migration.
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: kendralittle, mathoma
ms.date: 2/17/2022
---

# How to manage a Hyperscale database

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

The [Hyperscale service tier](service-tier-hyperscale.md) provides a highly scalable storage and compute performance tier that leverages the Azure architecture to scale out storage and compute resources for an Azure SQL Database substantially beyond the limits available for the General Purpose and Business Critical service tiers. This article describes how to carry out essential administration tasks for Hyperscale databases, including migrating an existing database to Hyperscale, restoring a Hyperscale database to a different region, reverse migrating from Hyperscale to another service tier, and monitoring the status of ongoing and recent operations against a Hyperscale database.

Learn how to create a new Hyperscale database in [Quickstart: Create a Hyperscale database in Azure SQL Database](hyperscale-database-create-quickstart.md).

## Migrate an existing database to Hyperscale

You can migrate existing databases in Azure SQL Database to Hyperscale using the Azure portal, the Azure CLI, PowerShell, or Transact-SQL.

The time required to move an existing database to Hyperscale consists of the time to copy data and the time to replay the changes made in the source database while copying data. The data copy time is proportional to data size. We recommend migrating to Hyperscale during a lower write activity period so that the time to replay accumulated changes to replay will be shorter.

You will only experience a short period of downtime, generally a few minutes, during the final cutover to the Hyperscale service tier.

### Prerequisites

To move a database that is a part of a [geo-replication](active-geo-replication-overview.md) relationship, either as the primary or as a secondary, to Hyperscale, you need to first terminate data replication between the primary and secondary replica. Databases in a [failover group](auto-failover-group-overview.md) must be removed from the group first.

Once a database has been moved to Hyperscale, you can create a new Hyperscale geo-replica for that database. Geo-replication for Hyperscale is in preview with certain [limitations](active-geo-replication-overview.md).

### How to migrate a database to the Hyperscale service tier

To migrate an existing database in Azure SQL Database to the Hyperscale service tier, first identify your target service objective. Review [resource limits for single databases](resource-limits-vcore-single-databases.md#hyperscale---provisioned-compute---gen4) if you aren't sure which service objective is right for your database. In many cases, you can choose a service objective with the same number of vCores and the same hardware generation as the original database. If needed, you will be able to [adjust this later with minimal downtime](scale-resources.md).

Select the tab for your preferred tool to migrate your database:

# [Portal](#tab/azure-portal)

The Azure portal enables you to migrate to the Hyperscale service tier by modifying the pricing tier for your database.

:::image type="content" source="media/manage-hyperscale-database/service-tier-dropdown-azure-sql-database-azure-portal.png" alt-text="Screenshot of the compute & storage panel of a database in Azure SQL Database. The service tier dropdown is expanded, displaying the option for the Hyperscale service tier." lightbox="media/manage-hyperscale-database/service-tier-dropdown-azure-sql-database-azure-portal.png":::

1. Navigate to the database you wish to migrate in the Azure portal.
1. In the left navigation bar, select **Compute + storage**.
1. Select the **Service tier** drop-down to expand the options for service tiers.
1. Select **Hyperscale (On-demand scalable storage)** from the dropdown menu.
1. Review the **Hardware Configuration** listed. If desired, select **Change configuration** to select the appropriate hardware configuration for your workload.
1. Review the option to **Save money**. Select it if you qualify for Azure Hybrid Benefit and wish to use it for this database.
1. Select the **vCores** slider if you wish to change the number of vCores available for your database under the Hyperscale service tier.
1. Select the **High-AvailabilitySecondaryReplicas** slider if you wish to change the number of replicas under the Hyperscale service tier. 
1. Select **Apply**.

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

# [Azure CLI](#tab/azure-cli)

This code sample calls [az sql db update](/cli/azure/sql/db#az_sql_db_update) to migrate an existing database in Azure SQL Database to the Hyperscale service tier. You must specify both the edition and service objective.

Replace `resourceGroupName`, `serverName`, `databaseName`, and `serviceObjective` with the appropriate values before running the following code sample:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"
serviceObjective="HS_Gen5_2"

az sql db update -g $resourceGroupName -s $serverName -n $databaseName \
    --edition Hyperscale --service-objective $serviceObjective

```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

# [PowerShell](#tab/azure-powershell)

The following example uses the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) cmdlet to migrate an existing database in Azure SQL Database to the Hyperscale service tier. You must specify both the edition and service objective.

Replace `$resourceGroupName`, `$serverName`, `$databaseName`, and `$serviceObjective` with the appropriate values before running this code sample:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"
$serviceObjective = "HS_Gen5_2"

Set-AzSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName `
    -DatabaseName $databaseName -Edition "Hyperscale" `
    -RequestedServiceObjectiveName $serviceObjective

```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

# [Transact-SQL](#tab/t-sql)

To migrate an existing database in Azure SQL Database to the Hyperscale service tier with Transact-SQL, first connect to the master database on your [logical SQL server](logical-servers.md) using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

You must specify both the edition and service objective in the [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?preserve-view=true&view=azuresqldb-current) statement.

This example statement migrates a database named `mySampleDatabase` to the Hyperscale service tier with the `HS_Gen5_2` service objective. Replace the database name with the appropriate value before executing the statement.

```sql
ALTER DATABASE [mySampleDatabase] 
    MODIFY (EDITION = 'Hyperscale', SERVICE_OBJECTIVE = 'HS_Gen5_2');
GO
```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

---

## <a id="reverse-migrate-from-hyperscale"></a>Reverse migrate from Hyperscale (preview)

Reverse migration to the General Purpose service tier allows customers who have recently migrated an existing database in Azure SQL Database to the Hyperscale service tier to move back in an emergency, should Hyperscale not meet their needs. While reverse migration is initiated by a service tier change, it's essentially a size-of-data move between different architectures.

### Limitations for reverse migration

Reverse migration is available under the following conditions:

- Reverse migration is only available within 45 days of the original migration to Hyperscale.
- Databases originally created in the Hyperscale service tier are not eligible for reverse migration.
- You may reverse migrate to the [General Purpose](service-tier-general-purpose.md) service tier only. Your migration from Hyperscale to General Purpose can target either the serverless or provisioned compute tiers. If you wish to migrate the database to another service tier, such as [Business Critical](service-tier-business-critical.md) or a [DTU based service tier](service-tiers-dtu.md), first reverse migrate to the General Purpose service tier, then change the service tier.

### Duration and downtime

Unlike regular service level objective change operations in Hyperscale, migrating to Hyperscale and reverse migration to General Purpose are size-of-data operations.

The duration of a reverse migration depends mainly on the size of the database and concurrent write activities happening during the migration. The number of vCores you assign to the target General Purpose database will also impact the duration of the reverse migration. We recommend that the target General Purpose database be provisioned with a number of vCores greater than or equal to the number of vCores assigned to the source Hyperscale database to sustain similar workloads.

During reverse migration, the source Hyperscale database may experience performance degradation if under substantial load. Specifically, transaction log rate may be reduced (throttled) to ensure that reverse migration is making progress.

You will only experience a short period of downtime, generally a few minutes, during the final cutover to the new target General Purpose database.

### Prerequisites

Before you initiate a reverse migration from Hyperscale to the General Purpose service tier, you must ensure that your database meets the [limitations for reverse migration](#limitations-for-reverse-migration) and:

- Your database does not have Geo Replication enabled.
- Your database does not have named replicas.
- Your database (allocated size) is small enough to fit into the target service tier.
- If you specify max database size for the target General Purpose database, ensure the allocated size of the database is small enough to fit into that maximum size.

Prerequisite checks will occur before a reverse migration starts. If prerequisites are not met, the reverse migration will fail immediately.

### Backup policies

You will be [billed using the regular pricing](automated-backups-overview.md?tabs=single-database#backup-storage-costs) for all existing database backups within the [configured retention period](automated-backups-overview.md#backup-retention). You will be billed for the Hyperscale backup storage snapshots and for size-of-data storage blobs that must be retained to be able to restore the backup.

You can migrate a database to Hyperscale and reverse migrate back to General Purpose multiple times. Only backups from the current and once-previous tier of your database will be available for restore. If you have moved from the General Purpose service tier to Hyperscale and back to General Purpose, the only backups available are the ones from the current General Purpose database and the immediately previous Hyperscale database. These retained backups are billed as per Azure SQL Database billing. Any previous tiers tried won't have backups available and will not be billed.

For example, you could migrate between Hyperscale and non-Hyperscale service tiers:

1. General Purpose
1. Migrate to Hyperscale
1. Reverse migrate to General Purpose
1. Service tier change to Business Critical
1. Migrate to Hyperscale
1. Reverse migrate to General Purpose

In this case, the only backups available would be from steps 5 and 6 of the timeline, if they are still within the [configured retention period](automated-backups-overview.md#backup-retention). Any backups from previous steps would be unavailable. This should be a careful consideration when attempting multiple reverse migrations from Hyperscale to the General Purpose tier.

### How to reverse migrate a Hyperscale database to the General Purpose service tier

To reverse migrate an existing Hyperscale database in Azure SQL Database to the Hyperscale service tier, first identify your target service objective in the General Purpose service tier and whether you wish to migrate to the provisioned or serverless compute tiers. Review [resource limits for single databases](resource-limits-vcore-single-databases.md#gen5-compute-generation-part-1) if you aren't sure which service objective is right for your database.

If you wish to perform an additional service tier change after reverse migrating to General Purpose, identify your eventual target service objective as well and ensure that your database's allocated size is small enough to fit in that service objective.

Select the tab for your preferred method to reverse migrate your database:

# [Portal](#tab/azure-portal)

The Azure portal enables you to reverse migrate to the General Purpose service tier by modifying the pricing tier for your database.

:::image type="content" source="media/manage-hyperscale-database/reverse-migrate-hyperscale-service-compute-tier-pane.png" alt-text="Screenshot of the compute & storage panel of a Hyperscale database in Azure SQL Database." lightbox="media/manage-hyperscale-database/reverse-migrate-hyperscale-service-compute-tier-pane.png":::

1. Navigate to the database you wish to migrate in the Azure portal.
1. In the left navigation bar, select **Compute + storage**.
1. Select the **Service tier** drop-down to expand the options for service tiers.
1. Select **General Purpose (Scalable compute and storage options)** from the dropdown menu.
1. Review the **Hardware Configuration** listed. If desired, select **Change configuration** to select the appropriate hardware configuration for your workload.
1. Review the option to **Save money**. Select it if you qualify for Azure Hybrid Benefit and wish to use it for this database.
1. Select the **vCores** slider if you wish to change the number of vCores available for your database under the General Purpose service tier.
1. Select **Apply**.

# [Azure CLI](#tab/azure-cli)

This code sample calls [az sql db update](/cli/azure/sql/db#az_sql_db_update) to reverse migrate an existing Hyperscale database to the General Purpose service tier. You must specify both the edition and service objective. You may select either `Provisioned` or `Serverless` for the target compute model.

Replace `resourceGroupName`, `serverName`, `databaseName`, and `serviceObjective` with the appropriate values before running the following code sample:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"
serviceObjective="GP_Gen5_2"
computeModel="Provisioned"

az sql db update -g $resourceGroupName -s $serverName -n $databaseName \
    --edition GeneralPurpose --service-objective $serviceObjective \
    --compute-model $computeModel 

```

You can optionally include the `maxsize` argument. If the `maxsize` value exceeds the valid maximum size for the target service objective, an error will be returned. If the `maxsize` argument is not specified, the operation will default to the maximum size available for the given service objective. The following example specifies `maxsize`:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"
serviceObjective="GP_Gen5_2"
computeModel="Provisioned"
maxsize="200GB"

az sql db update -g $resourceGroupName -s $serverName -n $databaseName \
    --edition GeneralPurpose --service-objective $serviceObjective \
    --compute-model $computeModel --max-size $maxsize

```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

# [PowerShell](#tab/azure-powershell)

This code sample uses the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) cmdlet to reverse migrate an existing database from the Hyperscale service tier to the General Purpose service tier. You must specify both the edition and service objective. You may select either `Provisioned` or `Serverless` for the target compute tier.

Replace `$resourceGroupName`, `$serverName`, `$databaseName`, `$serviceObjective`, and `$computeModel` with the appropriate values before running this code sample:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"
$serviceObjective = "GP_Gen5_2"
$computeModel = "Provisioned"

Set-AzSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName `
    -DatabaseName $databaseName -Edition "GeneralPurpose" -computemodel $computeModel `
    -RequestedServiceObjectiveName $serviceObjective

```

You can optionally include the `maxsize` argument. If the `maxsize` value exceeds the valid maximum size for the target service objective, an error will be returned. If the `maxsize` argument is not specified, the operation will default to the maximum size available for the given service objective. The following example specifies `maxsize`:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"
$serviceObjective = "GP_Gen5_2"
$computeModel = "Provisioned"
$maxSizeBytes = "268435456000"

Set-AzSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName `
    -DatabaseName $databaseName -Edition "GeneralPurpose" -computemodel $computeModel `
    -RequestedServiceObjectiveName $serviceObjective -MaxSizeBytes $maxSizeBytes

```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

# [Transact-SQL](#tab/t-sql)

To reverse migrate a Hyperscale database to the General Purpose service tier with Transact-SQL, first connect to the master database on your [logical SQL server](logical-servers.md) using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) .

You must specify both the edition and service objective in the [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?preserve-view=true&view=azuresqldb-current) statement.

This example statement migrates a database named `mySampleDatabase` to the General Purpose service tier with the `GP_Gen5_4` service objective. Replace the database name and service objective with the appropriate values before executing the statement.

```sql
ALTER DATABASE [mySampleDatabase] 
    MODIFY (EDITION = 'GeneralPurpose', SERVICE_OBJECTIVE = 'GP_Gen5_2');
GO
```

You can optionally include the `maxsize` argument. If the `maxsize` value exceeds the valid maximum size for the target service objective, an error will be returned. If the `maxsize` argument is not specified, the operation will default to the maximum size available for the given service objective. The following example specifies `maxsize`:

```sql
ALTER DATABASE [mySampleDatabase] 
    MODIFY (EDITION = 'GeneralPurpose', SERVICE_OBJECTIVE = 'GP_Gen5_2', MAXSIZE = 200 GB);
GO
```

You can [monitor operations for a Hyperscale database](#monitor-operations-for-a-hyperscale-database) while the operation is ongoing.

---

## Monitor operations for a Hyperscale database

You can monitor the status of ongoing or recently completed operations for an Azure SQL Database using the Azure portal, the Azure CLI, PowerShell, or Transact-SQL.

Select the tab for your preferred method to monitor operations.

# [Portal](#tab/azure-portal)

The Azure portal shows a notification for a database in Azure SQL Database when an operation such as a migration, reverse migration, or restore is in progress.

:::image type="content" source="media/manage-hyperscale-database/ongoing-operation-notification-azure-sql-database-azure-portal.png" alt-text="Screenshot of the overview panel of a database in Azure SQL Database. A notification of an ongoing operation appears in the notification area at the bottom of the panel." lightbox="media/manage-hyperscale-database/ongoing-operation-notification-azure-sql-database-azure-portal.png":::

1. Navigate to the database in the Azure portal.
1. In the left navigation bar, select **Overview**.
1. Review the **Notifications** section at the bottom of the right pane. If operations are ongoing, a notification box will appear.
1. Select the notification box to view details.
1. The **Ongoing operations** pane will open. Review the details of the ongoing operations.


# [Azure CLI](#tab/azure-cli)

This code sample calls [az sql db op list](/cli/azure/sql/db/op#az-sql-db-op-list) to return recent or ongoing operations for a database in Azure SQL Database.

Replace `resourceGroupName`, `serverName`, `databaseName`, and `serviceObjective` with the appropriate values before running the following code sample:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"
databaseName="mySampleDatabase"

az sql db op list -g $resourceGroupName -s $serverName --database $databaseName

```

# [PowerShell](#tab/azure-powershell)

The [Get-AzSqlDatabaseActivity](/powershell/module/az.sql/get-azsqldatabaseactivity) cmdlet returns recent or ongoing operations for a database in Azure SQL Database.

Set the `$resourceGroupName`, `$serverName`, and `$databaseName` parameters to the appropriate values for your database before running the sample code:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"
$databaseName = "mySampleDatabase"

Get-AzSqlDatabaseActivity -ResourceGroupName $resourceGroupName -ServerName $serverName -DatabaseName $databaseName

```

# [Transact-SQL](#tab/t-sql)

To monitor operations for a Hyperscale database, first connect to the master database on your [logical server](logical-servers.md) using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms), [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio), or the client of your choice to run Transact-SQL commands.

Query the [sys.dm_operation_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) Dynamic Management View to review information about recent operations performed on databases on your [logical server](logical-servers.md]. 

This code sample returns all entires in `sys.dm_operation_status` for the specified database, sorted by which operations began most recently. Replace the database name with the appropriate value before running the code sample.

```sql
SELECT * 
FROM sys.dm_operation_status
WHERE major_resource_id = 'mySampleDatabase'
ORDER BY start_time DESC;
GO
```

---

## View databases in the Hyperscale service tier

After migrating a database to Hyperscale or reconfiguring a database within the Hyperscale service tier, you may wish to view and/or document the configuration of your Hyperscale database.

# [Portal](#tab/azure-portal)

The Azure portal shows a list of all databases on a [logical server](logical-servers.md). The **Pricing tier** column includes the service tier for each database.

:::image type="content" source="media/manage-hyperscale-database/database-list-azure-portal.png" alt-text="Screenshot of the overview panel of a logical server in Azure SQL Database. A list of databases appears at the bottom of the panel." lightbox="media/manage-hyperscale-database/database-list-azure-portal.png":::

1. Navigate to your [logical server](logical-servers.md) in the Azure portal.
1. In the left navigation bar, select **Overview**.
1. Scroll to the list of resources at the bottom of the pane. The window will display SQL elastic pools and databases on the logical server.
1. Review the **Pricing tier** column to identify databases in the Hyperscale service tier.

# [Azure CLI](#tab/azure-cli)

This Azure CLI code sample calls [az sql db list](/cli/azure/sql/db/op#az-sql-db-list) to list Hyperscale databases on a [logical server](logical-servers.md) with their name, location, service level objective, maximum size, and number of high availability replicas.

Replace `resourceGroupName` and `serverName` with the appropriate values before running the following code sample:

```azurecli-interactive
resourceGroupName="myResourceGroup"
serverName="server01"

az sql db list -g $resourceGroupName -s $serverName --query "[].{Name:name, Location:location, SLO:currentServiceObjectiveName, Tier:currentSku.tier, maxSizeBytes:maxSizeBytes,HAreplicas:highAvailabilityReplicaCount}[?Tier=='Hyperscale']" --output table

```

# [PowerShell](#tab/azure-powershell)

The Azure PowerShell [Get-AzSqlDatabase](/powershell/module/az.sql/get-azsqldatabase) cmdlet returns a list of Hyperscale databases on a [logical server](logical-servers.md) with their name, location, service level objective, maximum size, and number of high availability replicas.

Set the `$resourceGroupName` and `$serverName` parameters to the appropriate values before running the sample code:

```powershell-interactive
$resourceGroupName = "myResourceGroup"
$serverName = "server01"

Get-AzSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName | `
    Where-Object { $_.Edition -eq 'Hyperscale' } | `
        Select-Object DatabaseName, Location, currentServiceObjectiveName, Edition, `
        MaxSizeBytes, HighAvailabilityReplicaCount | `
            Format-Table

```

Review the **Edition** column to identify databases in the Hyperscale service tier.

# [Transact-SQL](#tab/t-sql)

To review the service tiers of all Hyperscale databases on a [logical server](logical-servers.md) with Transact-SQL, first connect to the master database using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

Query the [sys.database_service_objectives](/sql/relational-databases/system-catalog-views/sys-database-service-objectives-azure-sql-database) system catalog view to review databases in the Hyperscale service tier:

```sql
SELECT d.name, dso.edition, dso.service_objective
FROM sys.database_service_objectives AS dso
JOIN sys.databases as d on dso.database_id = d.database_id
WHERE dso.edition = 'Hyperscale';
GO
```

---

## Next steps

Learn more about Hyperscale databases in the following articles:

- [Quickstart: Create a Hyperscale database in Azure SQL Database](hyperscale-database-create-quickstart.md)
- [Hyperscale service tier](service-tier-hyperscale.md)
- [Azure SQL Database Hyperscale FAQ](service-tier-hyperscale-frequently-asked-questions-faq.yml)
- [Hyperscale secondary replicas](service-tier-hyperscale-replicas.md)
- [Azure SQL Database Hyperscale named replicas FAQ](service-tier-hyperscale-named-replicas-faq.yml)
