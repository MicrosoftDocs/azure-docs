---
title: SQL Server to SQL Server on Azure VMs (Migration guide)
description: Follow this guide to migrate your SQL Server databases to SQL Server on Azure Virtual Machines (VMs). 
services: database-migration
author: mark jones
ms.author: markjon
ms.reviewer: mathoma
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 7/20/2020
---

# Migration guide: SQL Server to SQL Server on Azure VMs

This migration guide migrate your user databases from SQL Server to an instance of SQL Server on Azure Virtual Machines (VMs) using the [Database Migration Assistant (DMA)](/sql/dma/dma-overview). 


You can migrate SQL Server running on-premises or on:

- SQL Server on Virtual Machines
- Amazon Web Services (AWS) EC2
- Compute Engine (GCP)
- AWS RDS

For information about additional migration strategies, see the [Migration overview](to-sql-server-on-azure-vm-overview.md).


## Prerequisites

Migrating to SQL Server on Azure VMs requires the following: 

- [Database Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595)
- An [Azure Migrate project](../../../migrate/create-manage-projects.md)
- A [SQL Server on Azure VM](../../../azure-sql/virtual-machines/windows/create-sql-vm-portal.md)
- [Connectivity between Azure and on-premises](../../../architecture/reference-architectures/hybrid-networking.md)

The Database Migration Assistant supports the following target and source SQL Server versions: 

|Supported sources   |Supported targets |
|---------|---------|
|SQL Server 2005|SQL Server 2008 R2|
|SQL Server 2008|SQL Server 2012 |
|SQL Server 2008 R2|SQL Server 2014|
|SQL Server 2012|SQL Server 2016|
|SQL Server 2014|SQL Server 2017 on Windows and Linux|
|SQL Server 2016|SQL Server 2019 on Windows and Linux|
|SQL Server 2017 on Windows||

|Supported sources   |Supported targets |
|---------|---------|
|SQL Server 2005 <br/> SQL Server 2008 R2 <br/> SQL Server 2008<br/>SQL Server 2012 <br/>SQL Server 2014 <br/>SQL Server 2016 <br/> SQL Server 2017 on Windows<br/> <br/> | SQL Server 2008 R2<br/>SQL Server 2012 <br/> SQL Server 2014<br/>SQL Server 2016 <br/>SQL Server 2017 on Windows and Linux <br/> SQL Server 2019 on Windows and Linux|


## Pre-migration

After verifying that your source environment is supported and ensuring that you have addressed any prerequisites, you are ready to start the Pre-migration stage. This part of the process involves conducting an inventory of the databases that you need to migrate, assessing those databases for potential migration issues or blockers, and then resolving any items you might have uncovered.

### Discover

The goal of the Discover phase is to identify existing data sources and details about the features that are being used to get a better understanding of and plan for the migration. This process involves scanning the network to identify all your organizations SQL Server instances together with the version and features in use.

You can use the Azure Migrate service to assesses on-premises workloads for migration to Azure. The service assesses the migration suitability of on-premises computers, performs performance-based sizing, and provides cost estimations for running on-premises.

#### Using Azure Migrate to size an Azure VM for SQL server

For a guide on how to use Azure Migrate to discover SQL Server Instances, and to get size recommendations for your Azure VM, see the article [here](https://docs.microsoft.com/en-us/azure/migrate/concepts-assessment-calculation).

> [!IMPORTANT]
> When choosing a target Azure Virtual machine for your SQL Server instance, be sure to also make considerations for the [Performance guidelines for SQL Server on Virtual Machines](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices).
>

#### Other discovery tools

For more information about the tools available for use during the Discover phase, see the article [Services and tools](https://docs.microsoft.com/en-us/azure/dms/dms-tools-matrix#business-justification-phase) available for data migration scenarios.

### Assess

> [!NOTE]
> If NOT upgrading the version of SQL server, you will not be required to complete this phase and can go to Migration.
>

When the data sources have been identified, the next step is to assess on-premises SQL Server instance(s) migrating to an instance of SQL Server on an Azure VM to understand the gaps between the source and target instances. Use the [Data Migration Assistant](https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-ver15) (DMA) to assess your source database before migrating to Azure VMs.

#### Assessing User databases

The Data Migration Assistant (DMA) helps you upgrade to a modern data platform by detecting compatibility issues that can impact database functionality in your new version of SQL Server. DMA recommends performance and reliability improvements for your target environment and allows you to move your schema, data, and logins objects from your source server to your target server.

DMA has two capabilities, Assessment and Migration. In this step you will use the Assessment function to assess your User Databases for compatibility with newer versions of SQL Server.

An overview of the steps associated with using DMA to create an Assessment can be found [here](https://docs.microsoft.com/en-us/sql/dma/dma-migrateonpremsql?view=sql-server-2017).

> [!IMPORTANT]
> The Data Migration Assistant (DMA) requires a **sysadmin** role on the source instances of SQL Server to complete its Assessment.
>

#### Assessing applications

Typically, user Databases are accessed by an Application layer, which persists and modifies data. The data access layer of an application can now also forms part of a DMA Assessment in two ways:

- Capture an [Extended Events](https://docs.microsoft.com/en-us/sql/relational-databases/extended-events/extended-events?view=sql-server-ver15) or [SQL Server Profiler](https://docs.microsoft.com/en-us/sql/tools/sql-server-profiler/create-a-trace-sql-server-profiler?view=sql-server-ver15) trace of you User Database. You can also use the [Database Experimentation Assistant](https://docs.microsoft.com/en-us/sql/dea/database-experimentation-assistant-capture-trace?view=sql-server-ver15) to create a trace log which can also be used for A/B testing.

- (Preview) The [Data Access Migration Toolkit](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) (DAMT) provides discovery and assessment of SQL queries within code and is used to help migrate application source code from one database platform to another. This tool supports a variety of popular file types including C# and Java, XML and Plaint Text. For a guide on how to perform a DAMT assessment see the blog by Jim Toland [here](https://techcommunity.microsoft.com/t5/microsoft-data-migration/using-data-migration-assistant-to-assess-an-application-s-data/ba-p/990430).

Captured Trace files and DAMT exports files can be [imported by DMA](https://docs.microsoft.com/en-us/sql/dma/dma-assesssqlonprem?view=sql-server-2017#add-databases-and-extended-events-trace-to-assess) during the assessment of the User database.

#### Scale assessments

If you have multiple servers that require a Data Migration Assistant (DMA) Assessments, this can be automated through [command line interface](https://docs.microsoft.com/en-us/sql/dma/dma-commandline?view=sql-server-ver15) available. Using the command line interface, you can prepare in advance an Assessment command for each SQL server instance in scope for migration.

For summary reporting across large estates, Data Migration Assistant (DMA) Assessments can now be [consolidated into Azure Migrate](https://docs.microsoft.com/en-us/sql/dma/dma-assess-sql-data-estate-to-sqldb?view=sql-server-ver15).

#### Refactoring databases with DMA

Based on the Assessment results from DMA, you may have a series of recommendations to complete to ensure your User database(s) perform and function correctly when migrated. DMA will provide details on the impacted objects and links on how to resolve each issue. It is recommended that all Breaking Changes, Behavior Changes and are resolved before production Migration.

For Deprecated features, you can choose to run your User Database in its original [Compatibility](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-compatibility-level?view=sql-server-ver15) mode if you wish to avoid making these changes and speed up migration. However, this will prevent [upgrading your database](https://docs.microsoft.com/en-us/sql/database-engine/install-windows/compatibility-certification?view=sql-server-ver15#compatibility-levels-and-database-engine-upgrades) compatibility until Deprecated items have been resolved.

> [!CAUTION]
> Not all SQL Server versions support all compatibility modes. Please check your [Target SQL Server version](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-compatibility-level?view=sql-server-ver15) supports your chosen Database Compatibility. As an example, SQL Server 2019 does not support 90 level databases (SQL Server 2005). These databases would require at least an upgrade to compatibility level 100.
>

It is recommended that all DMA fixes are scripted and applied to the Target SQL Database during [Post-Migration](#_Post-migration).

### Convert

After assessing the source database instance(s) you are migrating, for heterogenous migrations, you need to convert the schema to work in the target environment. Since migrating from SQL Server to an Instance of SQL Server on an Azure VM is a homogeneous migration, the Convert phase is unnecessary.

## Migration

Once the Prerequisites and Pre-Migration steps have been completed, the User database(s) and components are ready for migration.

There are several methods for migrating user SQL database(s) to an instance of SQL Server on an Azure VM, which are outlined in the [Overview](#_Migration_Methods) of this guide. When migrating SQL Server databases to an instance of SQL Server on an Azure VM, you can perform an offline or an online migration. With an offline migration, application downtime begins when the migration starts. For an online migration, downtime is limited to the time required to cut over to the new environment when the migration completes.

It is recommended that you firstly review and test an offline migration, to determine whether the downtime is acceptable; if not, perform plan for using an online migration method.

### Migration general pointers

The following list of key points to consider when reviewing migration methods:

- For optimum data transfer performance, migrate databases and files onto an instance of SQL Server on a VM using a compressed backup file
- To minimize downtime during the database migration, use the Always On option
- To minimize downtime without configuration overhead of setting up Always On replicas or if you do not have an Always On deployment on premise, use the Log Shipping option
- For limited to no network options, you will need to use Offline Migration methods such as backup and restore, [using disk transfer services](https://docs.microsoft.com/en-us/azure/storage/common/storage-solution-large-dataset-low-network) available in Azure.
- There is no supported method to upgrade SQL Server Instances on an Azure VM. Instead, create and new Instance of SQL Server on a new Azure VM and use one of the methods above to migrate your User Database(s).

### Migrate schema and data

It is recommended that due to the ease of setup that Migration to Azure VMs is performed with Data Migration Assistant (DMA) with connection to Azure provided over a private link (VPN or Express route). DMA also provides capability to migrate Windows and SQL Server logins and migrations can be automated with the Command line interface.

An overview of the steps associated with using DMA to perform a Database Migration can be found [here](https://docs.microsoft.com/en-us/sql/dma/dma-migrateonpremsql?view=sql-server-ver15).

### Objects outside of the User database(s)

The following components may also be required to ensure seamless operation of your User Database once migrated to a new Instance of SQL Server on an Azure VM. Please see below a list of components and methods to migrate:

| **Feature** | **Component** | **Migration Method(s)** |
| --- | --- | --- |
| Databases | Model Database | Script with SQL Server Management Studio |
|| TempDB Database | Plan to move TempDB onto [Azure VM temporary disk (SSD](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices#temporary-disk)) for best performance. Be sure to pick a VM size that has a sufficient local SSD to accommodate your TempDB. |
|| User Databases with File stream | Do not use DMA for Database Migration, use [Backup and Restore](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/migrate-to-vm-from-sql-server#back-up-and-restore) methods for migration. |
| Security | SQL Server and Windows Logins | Use DMA to migrate User Logins, a step by step guide can be found [here](https://docs.microsoft.com/en-us/sql/dma/dma-migrateserverlogins?view=sql-server-ver15). |
|| SQL Server Roles | Script with SQL Server Management Studio |
|| Cryptographic providers | Recommend converting to use Azure Key Vault Service. A guide on how to do this is provided [here](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/azure-key-vault-integration-configure). This procedure uses the [SQL VM Resource Provider](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/sql-vm-resource-provider-register?tabs=azure-cli%2Cbash). |
| Server Objects | Backup Devices | Replace with Database backup using [Azure Backup Service](https://docs.microsoft.com/en-us/azure/backup/backup-sql-server-database-azure-vms) or write backups to [Azure Storage](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/azure-storage-sql-server-backup-restore-use) (SQL Server 2012 SP1 CU2). This procedure uses the [SQL VM Resource Provider](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/sql-vm-resource-provider-register?tabs=azure-cli%2Cbash).|
|| Linked Servers | Script with SQL Server Management Studio |
|| Server Triggers | Script with SQL Server Management Studio |
| Replication | Local Publications | Script with SQL Server Management Studio |
|| Local Subscribers | Script with SQL Server Management Studio |
| Polybase | Polybase | Script with SQL Server Management Studio |
| Management | Database Mail | Script with SQL Server Management Studio |
| SQL Server Agent | Jobs | Script with SQL Server Management Studio |
|| Alerts | Script with SQL Server Management Studio |
|| Operators | Script with SQL Server Management Studio |
|| Proxies | Script with SQL Server Management Studio |
| Operating System | Files, File Shares | Make a note of any additional files or file shares that are used by your SQL Servers and replicate on the Azure VM target. |

### Data sync and cutover

Using Data Migration Assistant (DMA) is an Offline type of migration, so has limited support for minimal-downtime migrations. Therefore Data Sync and cut-over are not applicable here.

> [!NOTE]
> For minimal downtime migrations, please refer to the migration methods Log Shipping and Distributed Availability Group options outlined in the [Overview](#migration-methods) of this guide.
>

## Post-migration

After you have successfully completed the Migration stage, you will need to go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications.

Any Database Migration Assistant recommended fixes are applied to User Database(s). It is recommended these are scripted to ensure consistency and allow for automation.

### Perform tests

The test approach for database migration consists of performing the following activities:

1. **Develop validation tests.**  To test database migration, you need to use SQL queries. You must create the validation queries to run against both the source and the target databases. Your validation queries should cover the scope you have defined.
2. **Set up test environment.**  The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.
3. **Run validation tests.**  Run the validation tests against the source and the target, and then analyse the results.
4. **Run performance tests.**  Run performance test against the source and the target, and then analyse and compare the results.

> [!TIP]
> Use the [Database Experimentation Assistant](https://docs.microsoft.com/en-us/sql/dea/database-experimentation-assistant-overview?view=sql-server-ver15) (DEA) to assist with evaluating the target SQL Server performance.
>

### Optimize

The post migration phase is crucial for reconciling any issues with data accuracy and completeness, as well as addressing potential performance issues with the workload.

For additional detail about these issues and specific steps to mitigate them, see the following resources:

- The [Post-migration Validation and Optimization Guide.](https://docs.microsoft.com/en-us/sql/relational-databases/post-migration-validation-and-optimization-guide?view=sql-server-ver15)
- The [article Tuning performance in Azure SQL Virtual Machines](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices).
- The [Azure cost optimization centre](https://azure.microsoft.com/en-us/overview/cost-optimization/).

## Next steps

To check the availability of services applicable to SQL Server please see the [Azure Global infrastructure centre](https://azure.microsoft.com/en-us/global-infrastructure/services/?regions=all&amp;products=synapse-analytics,virtual-machines,sql-database)
