---
title: Migrate database from SQL Server instance to Azure SQL Database - Managed instance | Microsoft Docs
description: Learn how to migrate a database from SQL Server instance to Azure SQL Database - Managed instance. 
services: sql-database
ms.service: sql-database
ms.subservice: migration
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: douglas, carlrab
manager: craigg
ms.date: 11/07/2019
---
# SQL Server instance migration to Azure SQL Database managed instance

In this article, you learn about the methods for migrating a SQL Server 2005 or later version instance to [Azure SQL Database managed instance](sql-database-managed-instance.md). For information on migrating to a single database or elastic pool, see [Migrate to a single or pooled database](sql-database-cloud-migrate.md). For migration information about migrating from other platforms, see [Azure Database Migration Guide](https://datamigration.microsoft.com/).

> [!NOTE]
> If you want to quickly start and try Managed Instance, you might want to go to [Quick-start guide](/sql-database-managed-instance-quickstart-guide.md) instead of this page. 

At a high level, the database migration process looks like:

![migration process](./media/sql-database-managed-instance-migration/migration-process.png)

- [Assess managed instance compatibility](#assess-managed-instance-compatibility) where you should ensure that there are no blocking issues that can prevent your migrations.
  - This step also includes creation of [performance baseline](#create-performance-baseline) to determine resource usage on your source SQL Server instance. This step is needed if you want o deploy properly sized Managed Instance and verify that performances after migration are not affected.
- [Choose app connectivity options](sql-database-managed-instance-connect-app.md)
- [Deploy to an optimally sized managed instance](#deploy-to-an-optimally-sized-managed-instance) where you will choose technical characteristics (number of vCores, amount of memory) and performance tier (Business Critical, General Purpose) of your Managed Instance.
- [Select migration method and migrate](#select-migration-method-and-migrate) where you migrate your databases using offline migration (native backup/restore, database importe/export) or online migration (Data Migration Service, Transactional Replication).
- [Monitor applications](#monitor-applications) to ensure that you have expected performance.

> [!NOTE]
> To migrate an individual database into either a single database or elastic pool, see [Migrate a SQL Server database to Azure SQL Database](sql-database-single-database-migrate.md).

## Assess managed instance compatibility

First, determine whether managed instance is compatible with the database requirements of your application. The managed instance deployment option is designed to provide easy lift and shift migration for the majority of existing applications that use SQL Server on-premises or on virtual machines. However, you may sometimes require features or capabilities that are not yet supported and the cost of implementing a workaround are too high.

Use [Data Migration Assistant (DMA)](https://docs.microsoft.com/sql/dma/dma-overview) to detect potential compatibility issues impacting database functionality on Azure SQL Database. DMA does not yet support managed instance as migration destination, but it is recommended to run assessment against Azure SQL Database and carefully review list of reported feature parity and compatibility issues against product documentation. See [Azure SQL Database features](sql-database-features.md) to check are there some reported blocking issues that not blockers in managed instance, because most of the blocking issues preventing a migration to Azure SQL Database have been removed with managed instance. For instance, features like cross-database queries, cross-database transactions within the same instance, linked server to other SQL sources, CLR, global temp tables, instance level views, Service Broker and the like are available in managed instances.

If there are some reported blocking issues that are not removed with the managed instance deployment option, you might need to consider an alternative option, such as [SQL Server on Azure virtual machines](https://azure.microsoft.com/services/virtual-machines/sql-server/). Here are some examples:

- If you require direct access to the operating system or file system, for instance to install third party or custom agents on the same virtual machine with SQL Server.
- If you have strict dependency on features that are still not supported, such as FileStream / FileTable, PolyBase, and cross-instance transactions.
- If absolutely need to stay at a specific version of SQL Server (2012, for instance).
- If your compute requirements are much lower that managed instance offers (one vCore, for instance) and database consolidation is not acceptable option.

If you have resolved all identified migration blockers and continuing the migration to Managed Instance, note that some of the changes might affect performance of your workload:
- Mandatory full recovery model and regular automated backup schedule might impact performance of your workload or maintenance/ETL actions if you have periodically used simple/bulk-logged model or stopped backups on demand.
- Different server or database level configurations such as trace flags or compatibility levels
- New features that you are using such as Transparent Database Encryption (TDE) or auto-failover groups might impact CPU and IO usage.

Managed Instance guarantee 99.99% availability even in the critical scenarios, so overhead caused by these features cannot be disabled. For more information, see [the root causes that might cause different performance on SQL Server and Managed Instance](https://azure.microsoft.com/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/).

### Create performance baseline

If you need to compare the performance of your workload on Managed Instance with your original workload running on SQL Server, you would need to create a performance baseline that will be used for comparison. 

Performance baseline is a set of parameters such as average/max CPU usage, average/max disk IO latency, throughput, IOPS, average/max page life expectancy, average max size of tempdb. You would like to have similar or even better parameters after migration, so it is important to measure and record the baseline values for these parameters. In addition to system parameters, you would need to select a set of the representative queries or the most important queries in your workload and measure min/average/max duration, CPU usage for the selected queries. These values would enable you to compare performance of workload running on Managed Instance to the original values on your source SQL Server.

Some of the parameters that you would need to measure on your SQL Server instance are: 
- [Monitor CPU usage on your SQL Server instance](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/Monitor-CPU-usage-on-SQL-Server/ba-p/680777#M131) and record the average and peak CPU usage.
- [Monitor memory usage on your SQL Server instance](https://docs.microsoft.com/sql/relational-databases/performance-monitor/monitor-memory-usage) and determine the amount of memory used by different components such as buffer pool, plan cache, column-store pool, [In-memory OLTP](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/monitor-and-troubleshoot-memory-usage?view=sql-server-2017), etc. In addition, you should find average and peak values of Page Life Expectancy memory performance counter.
- Monitor disk IO usage on the source SQL Server instance using [sys.dm_io_virtual_file_stats](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql) view or [performance counters](https://docs.microsoft.com/sql/relational-databases/performance-monitor/monitor-disk-usage).
- Monitor workload and query performance or your SQL Server instance by examining Dynamic Management Views or Query Store if you are migrating from SQL Server 2016+ version. Identify average duration and CPU usage of the most important queries in your workload to compare them with the queries that are running on the Managed Instance.

> [!Note]
> If you notice any issue with your workload on SQL Server such as high CPU usage, constant memory pressure, tempdb or parametrization issues, you should try to resolve them on your source SQL Server instance before taking the baseline and migration. Migrating know issues to any new system migh cause unexpected results and invalidate any performance comparison.

As an outcome of this activity you should have documented average and peak values for CPU, memory, and IO usage on your source system, as well as average and max duration and CPU usage of the dominant and the most critical queries in your workload. You should use these values later to compare performance of your workload on Managed Instance with the baseline performance of the workload on the source SQL Server.

## Deploy to an optimally-sized managed instance

Managed instance is tailored for on-premises workloads that are planning to move to the cloud. It introduces a [new purchasing model](sql-database-service-tiers-vcore.md) that provides greater flexibility in selecting the right level of resources for your workloads. In the on-premises world, you are probably accustomed to sizing these workloads by using physical cores and IO bandwidth. The purchasing model for managed instance is based upon virtual cores, or “vCores,” with additional storage and IO available separately. The vCore model is a simpler way to understand your compute requirements in the cloud versus what you use on-premises today. This new model enables you to right-size your destination environment in the cloud. Some general guidelines that might help you to choose the right service tier and characteristics are described here:
- Based on the baseline CPU usage you can provision a Managed Instance that matches the number of cores that you are using on SQL Server, having in mind that CPU characteristics might need to be scaled to match [VM characteristics where Managed Instance is installed](sql-database-managed-instance-resource-limits.md#hardware-generation-characteristics).
- Based on the baseline memory usage choose [the service tier that has matching memory](sql-database-managed-instance-resource-limits.md#hardware-generation-characteristics). The amount of memory cannot be directly chosen so you would need to select the Managed Instance with the amount of vCores that has matching memory (for example 5.1 GB/vCore in Gen5). 
- Based on the baseline IO latency of the file subsystem choose between General Purpose (latency greater than 5ms) and Business Critical service tiers (latency less than 3 ms).
- Based on baseline throughput pre-allocate the size of data or log files to get expected IO performance.

You can choose compute and storage resources at deployment time and then change it afterwards without introducing downtime for your application using the [Azure portal](sql-database-scale-resources.md):

![managed instance sizing](./media/sql-database-managed-instance-migration/managed-instance-sizing.png)

To learn how to create the VNet infrastructure and a managed instance, see [Create a managed instance](sql-database-managed-instance-get-started.md).

> [!IMPORTANT]
> It is important to keep your destination VNet and subnet always in accordance with [managed instance VNet requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements). Any incompatibility can prevent you from creating new instances or using those that you already created. Learn more about [creating new](sql-database-managed-instance-create-vnet-subnet.md) and [configuring existing](sql-database-managed-instance-configure-vnet-subnet.md) networks.

## Select migration method and migrate

The managed instance deployment option targets user scenarios requiring mass database migration from on-premises or IaaS database implementations. They are optimal choice when you need to lift and shift the back end of the applications that regularly use instance level and / or cross-database functionalities. If this is your scenario, you can move an entire instance to a corresponding environment in Azure without the need to re-architect your applications.

To move SQL instances, you need to plan carefully:

- The migration of all databases that need to be collocated (ones running on the same instance)
- The migration of instance-level objects that your application depends on, including logins, credentials, SQL Agent Jobs and Operators, and server level triggers.

Managed instance is a managed service that allows you to delegate some of the regular DBA activities to the platform as they are built in. Therefore, some instance level data does not need to be migrated, such as maintenance jobs for regular backups or Always On configuration, as [high availability](sql-database-high-availability.md) is built in.

Managed instance supports the following database migration options (currently these are the only supported migration methods):

- Azure Database Migration Service - migration with near-zero downtime,
- Native `RESTORE DATABASE FROM URL` - uses native backups from SQL Server and requires some downtime.

### Azure Database Migration Service

The [Azure Database Migration Service (DMS)](../dms/dms-overview.md) is a fully managed service designed to enable seamless migrations from multiple database sources to Azure Data platforms with minimal downtime. This service streamlines the tasks required to move existing third party and SQL Server databases to Azure. Deployment options at public preview include databases in Azure SQL Database and SQL Server databases in an Azure Virtual Machine. DMS is the recommended method of migration for your enterprise workloads.

If you use SQL Server Integration Services (SSIS) on your SQL Server on premises, DMS does not yet support migrating SSIS catalog (SSISDB) that stores SSIS packages, but you can provision Azure-SSIS Integration Runtime (IR) in Azure Data Factory (ADF) that will create a new SSISDB in a managed instance and then you can redeploy your packages to it, see [Create Azure-SSIS IR in ADF](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime).

To learn more about this scenario and configuration steps for DMS, see [Migrate your on-premises database to managed instance using DMS](../dms/tutorial-sql-server-to-managed-instance.md).  

### Native RESTORE from URL

RESTORE of native backups (.bak files) taken from SQL Server on-premises or [SQL Server on Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/), available on [Azure Storage](https://azure.microsoft.com/services/storage/), is one of key capabilities of the managed instance deployment option that enables quick and easy offline database migration.

The following diagram provides a high-level overview of the process:

![migration-flow](./media/sql-database-managed-instance-migration/migration-flow.png)

The following table provides more information regarding the methods you can use depending on source SQL Server version you are running:

|Step|SQL Engine and version|Backup / Restore method|
|---|---|---|
|Put backup to Azure Storage|Prior SQL 2012 SP1 CU2|Upload .bak file directly to Azure storage|
||2012 SP1 CU2 - 2016|Direct backup using deprecated [WITH CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-transact-sql) syntax|
||2016 and above|Direct backup using [WITH SAS CREDENTIAL](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url)|
|Restore from Azure storage to managed instance|[RESTORE FROM URL with SAS CREDENTIAL](sql-database-managed-instance-get-started-restore.md)|

> [!IMPORTANT]
> - When migrating a database protected by [Transparent Data Encryption](transparent-data-encryption-azure-sql.md) to a managed instance using native restore option, the corresponding certificate from the on-premises or IaaS SQL Server needs to be migrated before database restore. For detailed steps, see [Migrate TDE cert to managed instance](sql-database-managed-instance-migrate-tde-certificate.md)
> - Restore of system databases is not supported. To migrate instance level objects (stored in master or msdb databases), we recommend to script them out and run T-SQL scripts on the destination instance.

For a quickstart showing how to restore a database backup to a managed instance using a SAS credential, see [Restore from backup to a managed instance](sql-database-managed-instance-get-started-restore.md).

> [!VIDEO https://www.youtube.com/embed/RxWYojo_Y3Q]


## Monitor applications

Once you have completed the migration to Managed Instance, you should track the application behavior and performance of your workload. This process includes the following activities:
- [Compare performance of the workload running on the Managed Instance](#compare-performance-with-the-baseline) with the [performance baseline that you created on the source SQL Server](#create-performance-baseline).
- Continuously [monitor performance of your workload](#monitor-performance) to identify potential issues and improvement.

### Compare performance with the baseline

The first activity that you would need to take immediately after successful migration is to compare the performance of the workload with the baseline workload performance. The goal of this activity is to confirm that the workload performance on your Managed Instance meets your needs. 

Database migration to Managed Instance keeps database settings and its original compatibility level in majority of cases. The original settings are preserved where possible in order to reduce risk of some performance degradations compared to your source SQL Server. If the compatibility level of a user database was 100 or higher before the migration, it remains the same after migration. If the compatibility level of a user database was 90 before migration, in the upgraded database, the compatibility level is set to 100, which is the lowest supported compatibility level in managed instance. Compatibility level of system databases is 140. Since migration to Managed Instance is actually migrating to the latest version of SQL Server Database Engine, you should be aware that you need to re-test performance of your workload to avoid some surprising performance issues.

As a prerequisite, make sure that you have completed the following activities:
- Align your settings on Managed Instance with the settings from the source SQL Server instance by investigating various instance, database, temdb settings, and configurations. Make sure that you have not changed settings like compatibility levels or encryption before you run the first performance comparison, or accept the risk that some of the new features that you enabled might affect some queries. To reduce migration risks, change the database compatibility level only after performance monitoring.
- Implement [storage best practice guidelines for General Purpose](https://techcommunity.microsoft.com/t5/DataCAT/Storage-performance-best-practices-and-considerations-for-Azure/ba-p/305525) such as pre-allocating the size of the files to get the better performance.
- Learn about the [key environment differences that might cause the performance differences between Managed Instance and SQL Server]( https://azure.microsoft.com/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/) and identify the risks that might affect the performance.
- Make sure that you keep enabled Query Store and Automatic tuning on your Managed Instance. These features enable you to measure workload performance and automatically fix the potential performance issues. Learn how to use Query Store as an optimal tool for getting information about workload performance before and after database compatibility level change, as explained in [Keep performance stability during the upgrade to newer SQL Server version](https://docs.microsoft.com/sql/relational-databases/performance/query-store-usage-scenarios#CEUpgrade).
Once you have prepared the environment that is comparable as much as possible with your on-premises environment, you can start running your workload and measure performance. Measurement process should include the same parameters that you measured [while you create baseline performance of your workload measures on the source SQL Server](#create-performance-baseline).
As a result, you should compare performance parameters with the baseline and identify critical differences.

> [!NOTE]
> In many cases, you would not be able to get exactly matching performance on Managed Instance and SQL Server. Managed Instance is a SQL Server database engine but infrastructure and High-availability configuration on Managed Instance may introduce some difference. You might expect that some queries would be faster while some other might be slower. The goal of comparison is to verify that workload performance in Managed Instance matches the performance on SQL Server (in average), and identify are there any critical queries with the performance that don’t match your original performance.

The outcome of the performance comparison might be:
- Workload performance on Managed Instance is aligned or better that the workload performance on SQL Server. In this case you have successfully confirmed that migration is successful.
- Majority of the performance parameters and the queries in the workload work fine, with some exceptions with degraded performance. In this case, you would need to identify the differences and their importance. If there are some important queries with degraded performance, you should investigate are the underlying SQL plans changed or the queries are hitting some resource limits. Mitigation in this case could be to apply some hints on the critical queries (for example changed compatibility level, legacy cardinality estimator) either directly or using plan guides, rebuild or create statistics and indexes that might affect the plans. 
- Most of the queries are slower on Managed Instance compared to your source SQL Server. In this case try to identify the root causes of the difference such as [reaching some resource limit]( sql-database-managed-instance-resource-limits.md#instance-level-resource-limits) like IO limits, memory limit, instance log rate limit, etc. If there are no resource limits that can cause the difference, try to change compatibility level of the database or change database settings like legacy cardinality estimation and re-start the test. Review the recommendations provided by Managed Instance or Query Store views to identify the queries that regressed performance.

> [!IMPORTANT]
> Managed Instance has built-in automatic plan correction feature that is enabled by default. This feature ensures that queries that worked fine in the paste would not degrade in the future. Make sure that this feature is enabled and that you have executed the workload long enough with the old settings before you change new settings in order to enable Managed Instance to learn about the baseline performance and plans.

Make the change of the parameters or upgrade service tiers to converge to the optimal configuration until you get the workload performance that fits your needs.

### Monitor performance

Managed Instance provides a lot of advanced tools for monitoring and troubleshooting, and you should use them to monitor performance on your instance. Some of the parameters that your would need to monitor are:
- CPU usage on the instance to determine does the number of vCores that you provisioned is the right match for your workload.
- Page-life expectancy on your Managed Instance to determine [do you need additional memory](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/Do-you-need-more-memory-on-Azure-SQL-Managed-Instance/ba-p/563444).
- Wait statistics like `INSTANCE_LOG_GOVERNOR` or `PAGEIOLATCH` that will tell do you have storage IO issues, especially on General Purpose tier where you might need to pre-allocate files to get better IO performance.

## Leverage advanced PaaS features

Once you are on a fully managed platform and you have verified that workload performances are matching you SQL Server workload performance, take advantages that are provided automatically as part of the SQL Database service. 

Even if you don't make some changes in managed instance during the migration, there are high chances that you would turn on some of the new features while you are operating your instance to take an advantage of the latest database engine improvements. Some changes are only enabled once the [database compatibility level has been changed](https://docs.microsoft.com/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database).


For instance, you don’t have to create backups on managed instance -  the service performs backups for you automatically. You no longer must worry about scheduling, taking, and managing backups. Managed instance provides you the ability to restore to any point in time within this retention period using [Point in Time Recovery (PITR)](sql-database-recovery-using-backups.md#point-in-time-restore). Additionally, you do not need to worry about setting up high availability as [high availability](sql-database-high-availability.md) is built in.

To strengthen security, consider using [Azure Active Directory Authentication](sql-database-security-overview.md), [Auditing](sql-database-managed-instance-auditing.md), [threat detection](sql-database-advanced-data-security.md), [row-level security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security), and [dynamic data masking](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking) ).

In addition to advanced management and security features, Managed Instance provides a set of advanced tools that can help you to [monitor and tune your workload](sql-database-monitor-tune-overview.md). [Azure SQL analytics](https://docs.microsoft.com/azure/azure-monitor/insights/azure-sql) enables you to monitor a large set of Managed Instances and centralize monitoring of a large number of instances and databases. [Automatic tuning](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning#automatic-plan-correction) in Managed Instance continuously monitor performance of your SQL plan execution statistics and automatically fix the identified performance issues.

## Next steps

- For information about managed instances, see [What is a managed instance?](sql-database-managed-instance.md).
- For a tutorial that includes a restore from backup, see [Create a managed instance](sql-database-managed-instance-get-started.md).
- For tutorial showing migration using DMS, see [Migrate your on-premises database to managed instance using DMS](../dms/tutorial-sql-server-to-managed-instance.md).  
