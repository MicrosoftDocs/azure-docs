---
title: What is the Hyperscale service tier? 
description: This article describes the Hyperscale service tier in the vCore-based purchasing model in Azure SQL Database and explains how it's different from the General Purpose and Business Critical service tiers.
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: kendralittle, mathoma
ms.date: 03/02/2022
---

# Hyperscale service tier
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

Azure SQL Database is based on SQL Server Database Engine architecture that is adjusted for the cloud environment to ensure [high availability](https://azure.microsoft.com/support/legal/sla/azure-sql-database/) even in cases of infrastructure failures. There are three architectural models that are used in Azure SQL Database:

- General Purpose/Standard
- Hyperscale
- Business Critical/Premium

The Hyperscale service tier in Azure SQL Database is the newest service tier in the vCore-based purchasing model. This service tier is a highly scalable storage and compute performance tier that leverages the Azure architecture to scale out the storage and compute resources for an Azure SQL Database substantially beyond the limits available for the General Purpose and Business Critical service tiers.

> [!NOTE]
>
> - For details on the General Purpose and Business Critical service tiers in the vCore-based purchasing model, see [General Purpose](service-tier-general-purpose.md) and [Business Critical](service-tier-business-critical.md) service tiers. For a comparison of the vCore-based purchasing model with the DTU-based purchasing model, see [Azure SQL Database purchasing models and resources](purchasing-models.md).
> - The Hyperscale service tier is currently only available for Azure SQL Database, and not Azure SQL Managed Instance.

## What are the Hyperscale capabilities

The Hyperscale service tier in Azure SQL Database provides the following additional capabilities:

- Support for up to 100 TB of database size.
- Nearly instantaneous database backups (based on file snapshots stored in Azure Blob storage) regardless of size with no IO impact on compute resources.
- Fast database restores (based on file snapshots) in minutes rather than hours or days (not a size of data operation).
- Higher overall performance due to higher transaction log throughput and faster transaction commit times regardless of data volumes.
- Rapid scale out - you can provision one or more [read-only replicas](service-tier-hyperscale-replicas.md) for offloading your read workload and for use as hot-standbys.
- Rapid Scale up - you can, in constant time, scale up your compute resources to accommodate heavy workloads when needed, and then scale the compute resources back down when not needed.

The Hyperscale service tier removes many of the practical limits traditionally seen in cloud databases. Where most other databases are limited by the resources available in a single node, databases in the Hyperscale service tier have no such limits. With its flexible storage architecture, storage grows as needed. In fact, Hyperscale databases aren't created with a defined max size. A Hyperscale database grows as needed - and you're billed only for the capacity you use. For read-intensive workloads, the Hyperscale service tier provides rapid scale-out by provisioning additional replicas as needed for offloading read workloads.

Additionally, the time required to create database backups or to scale up or down is no longer tied to the volume of data in the database. Hyperscale databases can be backed up virtually instantaneously. You can also scale a database in the tens of terabytes up or down in minutes. This capability frees you from concerns about being boxed in by your initial configuration choices.

For more information about the compute sizes for the Hyperscale service tier, see [Service tier characteristics](service-tiers-vcore.md#service-tiers).

## Who should consider the Hyperscale service tier

The Hyperscale service tier is intended for most business workloads as it provides great flexibility and high performance with independently scalable compute and storage resources. With the ability to autoscale storage up to 100 TB, it's a great choice for customers who:

- Have large databases on-premises and want to modernize their applications by moving to the cloud
- Are already in the cloud and are limited by the maximum database size restrictions of other service tiers (1-4 TB)
- Have smaller databases, but require fast vertical and horizontal compute scaling, high performance, instant backup, and fast database restore.

The Hyperscale service tier supports a broad range of SQL Server workloads, from pure OLTP to pure analytics, but it's primarily optimized for OLTP and hybrid transaction and analytical processing (HTAP) workloads.

> [!IMPORTANT]
> Elastic pools do not support the Hyperscale service tier.

## Hyperscale pricing model

Hyperscale service tier is only available in [vCore model](service-tiers-vcore.md). To align with the new architecture, the pricing model is slightly different from General Purpose or Business Critical service tiers:

- **Compute**:

  The Hyperscale compute unit price is per replica. The [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) price is applied to high-availabilty and named replicas automatically. Users may adjust the total number of high-availability secondary replicas from 0 to 4, depending on [SLA](https://azure.microsoft.com/support/legal/sla/azure-sql-database/) requirements.

- **Storage**:

  You don't need to specify the max data size when configuring a Hyperscale database. In the Hyperscale tier, you're charged for storage for your database based on actual allocation. Storage is automatically allocated between 40 GB and 100 TB, in 10-GB increments. Multiple data files can grow at the same time if needed. A Hyperscale database is created with a starting size of 10 GB and it starts growing by 10 GB every 10 minutes, until it reaches the size of 40 GB.

For more information about Hyperscale pricing, see [Azure SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database/single/)

## Compare resource limits

<!---
vCore resource limits are listed in the following articles, please be sure to update all of them: 
/database/resource-limits-vcore-single-databases.md
/database/resource-limits-vcore-elastic-pools.md
/database/resource-limits-logical-server.md
/database/service-tier-general-purpose.md
/database/service-tier-business-critical.md
/database/service-tier-hyperscale.md
/managed-instance/resource-limits.md
--->

The vCore-based service tiers are differentiated based on database availability and storage type, performance, and maximum storage size, as described in the following table:

|ㅤ| **General Purpose** | **Hyperscale** | **Business Critical** |
|:---:|:---:|:---:|:---:|
|**Best for** |Offers budget oriented balanced compute and storage options. |Most business workloads. Autoscaling storage size up to 100 TB, fast vertical and horizontal compute scaling, fast database restore. |OLTP applications with high transaction rate and low IO latency. Offers highest resilience to failures and fast failovers using multiple synchronously updated replicas. |
|**Compute size** |1 to 80 vCores |1 to 80  vCores<sup>1</sup> |1 to 80 vCores |
|**Storage type** |Premium remote storage (per instance) |De-coupled storage with local SSD cache (per instance) |Super-fast local SSD storage (per instance) |
|**Storage size**<sup>1</sup> |5 GB – 4 TB |Up to 100 TB |5 GB – 4 TB |
|**IOPS** |500 IOPS per vCore with 7,000 maximum IOPS. |Hyperscale is a multi-tiered architecture with caching at multiple levels. Effective IOPS will depend on the workload. |5,000 IOPS with 200,000 maximum IOPS. |
|**Availability** |1 replica, no Read Scale-out, zone-redundant HA (preview), no local cache. |Multiple replicas, up to 4 Read Scale-out, zone-redundant HA (preview), partial local cache. |3 replicas, 1 Read Scale-out, zone-redundant HA, full local storage. |
|**Backups** |A choice of geo-redundant, zone-redundant, or locally redundant backup storage, 1-35 day retention (default 7 days). |A choice of geo-redundant, zone-redundant, or locally redundant backup storage, 7 day retention. |A choice of geo-redundant,zone-redundant, or locally redundant backup storage, 1-35 day retention (default 7 days). |

<sup>1</sup> Elastic pools are not supported in the Hyperscale service tier.

## Distributed functions architecture

Hyperscale separates the query processing engine from the components that provide long-term storage and durability for the data. This architecture provides the ability to smoothly scale storage capacity as far as needed (initial target is 100 TB), as well as the ability to scale compute resources rapidly.

The following diagram illustrates the different types of nodes in a Hyperscale database:

![architecture](./media/service-tier-Hyperscale/Hyperscale-architecture.png)

Learn more about the [Hyperscale distributed functions architecture](hyperscale-architecture.md).

## Scale and performance advantages

With the ability to rapidly spin up/down additional read-only compute nodes, the Hyperscale architecture allows significant read scale capabilities and can also free up the primary compute node for serving more write requests. Also, the compute nodes can be scaled up/down rapidly due to the shared-storage architecture of the Hyperscale architecture.

## Create and manage Hyperscale databases

You can create and manage Hyperscale databases using the [Azure portal](https://portal.azure.com), [Transact-SQL](/sql/t-sql/statements/create-database-transact-sql), [PowerShell](/powershell/module/azurerm.sql/new-azurermsqldatabase), and the [Azure CLI](/cli/azure/sql/db#az_sql_db_create).


|  **Operation** |  **Details** | **Learn more** |
|:---|:---|:---|
|**Create a Hyperscale database**| Hyperscale databases are available only using the [vCore-based purchasing model](service-tiers-vcore.md). | Find examples to create a Hyperscale database in [Quickstart: Create a Hyperscale database in Azure SQL Database](hyperscale-database-create-quickstart.md). |
| **Upgrade an existing database to Hyperscale** | Migrating an existing database in Azure SQL Database to the Hyperscale tier is a size of data operation. | Learn [how to migrate an existing database to Hyperscale](manage-hyperscale-database.md#migrate-an-existing-database-to-hyperscale).|
| **Reverse migrate a Hyperscale database to the General Purpose service tier (preview)** | If you previously migrated an existing Azure SQL Database to the Hyperscale service tier, you can reverse migrate the database to the General Purpose service tier within 45 days of the original migration to Hyperscale.<BR/><BR/>If you wish to migrate the database to another service tier, such as Business Critical, first reverse migrate to the General Purpose service tier, then change the service tier. | Learn [how to reverse migrate from Hyperscale](manage-hyperscale-database.md#reverse-migrate-from-hyperscale), including the [limitations for reverse migration](manage-hyperscale-database.md#limitations-for-reverse-migration).|
| | | |

## Database high availability in Hyperscale

As in all other service tiers, Hyperscale guarantees data durability for committed transactions regardless of compute replica availability. The extent of downtime due to the primary replica becoming unavailable depends on the type of failover (planned vs. unplanned), [whether zone redundancy is configured](high-availability-sla.md#hyperscale-service-tier-zone-redundant-availability-preview), and on the presence of at least one high-availability replica. In a planned failover (i.e. a maintenance event), the system either creates the new primary replica before initiating a failover, or uses an existing high-availability replica as the failover target. In an unplanned failover (i.e. a hardware failure on the primary replica), the system uses a high-availability replica as a failover target if one exists, or creates a new primary replica from the pool of available compute capacity. In the latter case, downtime duration is longer due to extra steps required to create the new primary replica.

For Hyperscale SLA, see [SLA for Azure SQL Database](https://azure.microsoft.com/support/legal/sla/azure-sql-database).

## Backup and restore

Backup and restore operations for Hyperscale databases are file-snapshot based. This enables these operations to be nearly instantaneous. Since Hyperscale architecture utilizes the storage layer for backup and restore, processing burden and performance impact to compute replicas are significantly reduced. Learn more in [Hyperscale backups and storage redundancy](automated-backups-overview.md#hyperscale-backups-and-storage-redundancy).

## Disaster recovery for Hyperscale databases

If you need to restore a Hyperscale database in Azure SQL Database to a region other than the one it's currently hosted in, as part of a disaster recovery operation or drill, relocation, or any other reason, the primary method is to do a geo-restore of the database. Geo-restore is only available when geo-redundant storage (RA-GRS) has been chosen for storage redundancy.

Learn more in [restoring a Hyperscale database to a different region](automated-backups-overview.md#restoring-a-hyperscale-database-to-a-different-region).

## <a name=regions></a>Available regions

The Azure SQL Database Hyperscale tier is enabled in the vast majority of Azure regions. If you want to create a Hyperscale database in a region where Hyperscale is not enabled by default, you can send an onboarding request via Azure portal. For instructions, see [Request quota increases for Azure SQL Database](quota-increase-request.md). When submitting your request, use the following guidelines:

- Use the [Region access](quota-increase-request.md#region) SQL Database quota type.
- In the description, add the compute SKU/total cores including high-availability and named replicas, and indicate that you are requesting Hyperscale capacity.
- Also specify a projection of the total size of all databases over time in TB.

## Known limitations

These are the current limitations of the Hyperscale service tier.  We're actively working to remove as many of these limitations as possible.

| Issue | Description |
| :---- | :--------- |
| Backup retention is currently seven days; long-term retention policies aren't yet supported. | Hyperscale has a unique method for managing backups, so a non-Hyperscale database can't be restored as a Hyperscale database, and a Hyperscale database can't be restored as a non-Hyperscale database.<BR/><BR/>For databases migrated to Hyperscale from other Azure SQL Database service tiers, pre-migration backups are kept for the duration of [backup retention](automated-backups-overview.md#backup-retention) period of the source database, including long-term retention policies. Restoring a pre-migration backup within the backup retention period of the database is supported [programmatically](recovery-using-backups.md#programmatic-recovery-using-automated-backups). You can restore these backups to any non-Hyperscale service tier.|
| Service tier change from Hyperscale to another tier is not supported directly | Reverse migration to the General Purpose service tier allows customers who have recently migrated an existing database in Azure SQL Database to the Hyperscale service tier to move back in an emergency, should Hyperscale not meet their needs. While reverse migration is initiated by a service tier change, it's essentially a size-of-data move between different architectures. Databases created in the Hyperscale service tier are not eligible for reverse migration. Learn the [limitations for reverse migration](manage-hyperscale-database.md#limitations-for-reverse-migration). <BR/><BR/> For databases that don't qualify for reverse migration, the only way to migrate from Hyperscale to a non-Hyperscale service tier is to export/import using a bacpac file or other data movement technologies (Bulk Copy, Azure Data Factory, Azure Databricks, SSIS, etc.) Bacpac export/import from Azure portal, from PowerShell using [New-AzSqlDatabaseExport](/powershell/module/az.sql/new-azsqldatabaseexport) or [New-AzSqlDatabaseImport](/powershell/module/az.sql/new-azsqldatabaseimport), from Azure CLI using [az sql db export](/cli/azure/sql/db#az_sql_db_export) and [az sql db import](/cli/azure/sql/db#az_sql_db_import), and from [REST API](/rest/api/sql/) is not supported. Bacpac import/export for smaller Hyperscale databases (up to 200 GB) is supported using SSMS and [SqlPackage](/sql/tools/sqlpackage) version 18.4 and later. For larger databases, bacpac export/import may take a long time, and may fail for various reasons. |
| When changing Azure SQL Database service tier to Hyperscale, the operation fails if the database has any data files larger than 1 TB | In some cases, it may be possible to work around this issue by [shrinking](file-space-manage.md#shrinking-data-files) the large files to be less than 1 TB before attempting to change the service tier to Hyperscale. Use the following query to determine the current size of database files. `SELECT file_id, name AS file_name, size * 8. / 1024 / 1024 AS file_size_GB FROM sys.database_files WHERE type_desc = 'ROWS'`;|
| SQL Managed Instance | Azure SQL Managed Instance isn't currently supported with Hyperscale databases. |
| Elastic Pools |  Elastic Pools aren't currently supported with Hyperscale.|
| Migration of databases with In-Memory OLTP objects | Hyperscale supports a subset of In-Memory OLTP objects, including memory-optimized table types, table variables, and natively compiled modules. However, when any kind of In-Memory OLTP objects are present in the database being migrated, migration from Premium and Business Critical service tiers to Hyperscale is not supported. To migrate such a database to Hyperscale, all In-Memory OLTP objects and their dependencies must be dropped. After the database is migrated, these objects can be recreated. Durable and non-durable memory-optimized tables are not currently supported in Hyperscale, and must be changed to disk tables.|
| Geo-replication | [Geo-replication](active-geo-replication-overview.md) and [auto-failover groups](auto-failover-group-overview.md) on Hyperscale is now in public preview. |
| Intelligent Database Features | With the exception of the "Force Plan" option, all other Automatic Tuning options aren't yet supported on Hyperscale: options may appear to be enabled, but there won't be any recommendations or actions made. |
| Query Performance Insights | Query Performance Insights is currently not supported for Hyperscale databases. |
| Shrink Database | DBCC SHRINKDATABASE or DBCC SHRINKFILE isn't currently supported for Hyperscale databases. |
| Database integrity check | DBCC CHECKDB isn't currently supported for Hyperscale databases. DBCC CHECKTABLE ('TableName') WITH TABLOCK  and DBCC CHECKFILEGROUP WITH TABLOCK may be used as a workaround. See [Data Integrity in Azure SQL Database](https://azure.microsoft.com/blog/data-integrity-in-azure-sql-database/) for details on data integrity management in Azure SQL Database. |
| Elastic Jobs | Using a Hyperscale database as the Job database is not supported. However, elastic jobs can target Hyperscale databases in the same way as any other database in Azure SQL Database. |
|Data Sync| Using a Hyperscale database as a Hub or Sync Metadata database is not supported. However, a Hyperscale database can be a member database in a Data Sync topology. |
|Import Export | Import-Export service is currently not supported for Hyperscale databases. |

## Next steps

Learn more about Hyperscale in Azure SQL Database in the following articles:

- For an FAQ on Hyperscale, see [Frequently asked questions about Hyperscale](service-tier-hyperscale-frequently-asked-questions-faq.yml).
- For information about service tiers, see [Service tiers](purchasing-models.md).
- See [Overview of resource limits on a server](resource-limits-logical-server.md) for information about limits at the server and subscription levels.
- For purchasing model limits for a single database, see [Azure SQL Database vCore-based purchasing model limits for a single database](resource-limits-vcore-single-databases.md).
- For a features and comparison list, see [SQL common features](features-comparison.md).
- Learn about the [Hyperscale distributed functions architecture](hyperscale-architecture.md).
- Learn [How to manage a Hyperscale database](manage-hyperscale-database.md).
