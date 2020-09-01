---
title: SQL Server to SQL Server on Azure VMs (Migration guide)
description: Follow this guide to migrate your SQL Server databases to SQL Server on Azure Virtual Machines (VMs). 
services: database-migration
author: markjones-msft
ms.author: markjon
ms.reviewer: mathoma
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 7/20/2020
---

# Migration guide: SQL Server to SQL Server on Azure VMs

This migration guide teaches you to Discover, Assess and Migrate your user databases from SQL Server to an instance of SQL Server on Azure Virtual Machines (VMs) by using the [Database Migration Assistant (DMA)](/sql/dma/dma-overview). 

You can migrate SQL Server running on-premises or on:

- SQL Server on Virtual Machines
- Amazon Web Services (AWS) EC2
- Compute Engine (GCP)
- AWS RDS

For information about additional migration strategies, see the [SQL Server VM migration overview](to-sql-server-on-azure-vm-overview.md).


## Prerequisites

Migrating to SQL Server on Azure VMs requires the following: 

- [Database Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595)
- An [Azure Migrate project](../../../../migrate/create-manage-projects.md)
- Create and prepare a target [SQL Server on Azure VM](../../windows/create-sql-vm-portal.md)
- [Connectivity between Azure and on-premises](../../../../architecture/reference-architectures/hybrid-networking.md)

The Database Migration Assistant supports the following target and source SQL Server versions - the target must be the same or a greater version than the source: 

|Supported sources   |Supported targets |
|---------|---------|
|SQL Server 2005 <br/> SQL Server 2008 R2 <br/> SQL Server 2008<br/>SQL Server 2012 <br/>SQL Server 2014 <br/>SQL Server 2016 <br/> SQL Server 2017 on Windows<br/> <br/> | SQL Server 2008 R2<br/>SQL Server 2012 <br/> SQL Server 2014<br/>SQL Server 2016 <br/>SQL Server 2017 on Windows and Linux <br/> SQL Server 2019 on Windows and Linux|

## Pre-migration

Before you begin your migration, discover the topology of your SQL environment and assess the feasibility of your intended migration. 

### Discover

Azure Migrate assesses migration suitability of on-premises computers, performs performance-based sizing, and provides cost estimations for running on-premises. Use Azure Migrate to [identify existing data sources and details about the features](../../../../migrate/concepts-assessment-calculation.md) your SQL Server instances use to plan for the migration. This process involves scanning the network to identify all of your SQL Server instances in your organization with the version and features in use. 

> [!IMPORTANT]
> When choosing a target Azure virtual machine for your SQL Server instance, be sure to consider the [Performance guidelines for SQL Server on Azure VMs](../../windows/performance-guidelines-best-practices.md).

For additional discovery tools, see [Services and tools](../../../../dms/dms-tools-matrix.md#business-justification-phase) available for data migration scenarios.


### Assess

After you've discovered all of the data sources, use the [Data Migration Assistant (DMA)](/dma/dma-overview) to assess on-premises SQL Server instance(s) migrating to an instance of SQL Server on Azure VM to understand the gaps between the source and target instances. 


> [!NOTE]
> If you're _not_ upgrading the version of SQL Server, skip this step and move to the [migrate](#migrate) section. 



#### Assess user databases 

The Data Migration Assistant (DMA) helps you upgrade to a modern data platform by detecting compatibility issues that can impact database functionality in your new version of SQL Server. DMA recommends performance and reliability improvements for your target environment and also allows you to move your schema, data, and login objects from your source server to your target server.

See [assessment](/sql/dma/dma-migrateonpremsql) to learn more. 


> [!IMPORTANT]
> DMA requires **sysadmin** access to perform an assessment. 


#### Assess applications

Typically, an application layer accesses user databases to persist and modify data.  DMA can assess the data access layer of an application in two ways: 

- Using captured [extended events](/sql/relational-databases/extended-events/extended-events) or [SQL Server Profiler traces ](/sql/tools/sql-server-profiler/create-a-trace-sql-server-profiler) of your user databases. You can also use the [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-capture-trace) to create a trace log that can also be used for A/B testing.

- Using the [Data Access Migration Toolkit (preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) (DAMT), which provides discovery and assessment of SQL queries within the code and is used to migrate application source code from one database platform to another. This tool supports a variety of popular file types including C# and Java, XML, and Plaint Text. For a guide on how to perform a DAMT assessment see the [Use DMAT](https://techcommunity.microsoft.com/t5/microsoft-data-migration/using-data-migration-assistant-to-assess-an-application-s-data/ba-p/990430) blog.

Use DMA to [import](/sql/dma/dma-assesssqlonprem#add-databases-and-extended-events-trace-to-assess) captured trace files or DAMT files during the assessment of user databases. 


#### Scale assessments

If you have multiple servers that require a DMA assessment, you can automate the process through the [command line interface](/sql/dma/dma-commandline). Using the interface, you can prepare assessment commands in advance for each SQL Server instance in the scope for migration. 

For summary reporting across large estates, Data Migration Assistant (DMA) assessments can now be [consolidated into Azure Migrate](/sql/dma/dma-assess-sql-data-estate-to-sqldb).

#### Refactor databases with DMA

Based on the DMA assessment results, you may have a series of recommendations to ensure your user database(s) perform and function correctly after migration. DMA provides details on the impacted objects as well as resources for how to resolve each issue. It is recommended that all breaking changes, and behavior changes are resolved before production migration.

For deprecated features, you can choose to run your user database(s) in their original [compatibility](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level) mode if you wish to avoid making these changes and speed up migration. However, this will prevent [upgrading your database compatibility](/sql/database-engine/install-windows/compatibility-certification#compatibility-levels-and-database-engine-upgrades) until the deprecated items have been resolved.

It is highly recommended that all DMA fixes are scripted and applied to the target SQL Server database during [post-migration](#post-migration).

> [!CAUTION]
> Not all SQL Server versions support all compatibility modes. Check that your [target SQL Server version](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level) supports your chosen database compatibility. For example, SQL Server 2019 does not support databases with level 90 compatibility (which is SQL Server 2005). These databases would require, at least, an upgrade to compatibility level 100.
>

## Migrate

After you have completed the pre-migration steps, you are ready to migrate the user databases and components. 

There are several methods for migrating user SQL database(s) to an instance of SQL Server on an Azure VM, which is outlined in the [SQL VM migration overview](to-sql-server-on-azure-vm-overview.md). When migrating SQL Server databases to an instance of SQL Server on Azure VMs, you can perform an offline or an online migration. With an offline migration, application downtime begins when the migration starts. For an online migration, downtime is limited to the time required to cut over to the new environment when the migration completes.

It is recommended that you first review and test an offline migration to determine whether the downtime is acceptable; if not, plan for using an online migration method.

### Considerations

The following is a list of key points to consider when reviewing migration methods:

- For optimum data transfer performance, migrate databases and files onto an instance of SQL Server on Azure VM using a compressed backup file. It is also advised that for larger databases, [in addition to compression, the backup is split into smaller files](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/back-up-files-and-filegroups-sql-server?view=sql-server-ver15) for increased performance during backup and transfer. 
- If migrating from SQL 2014 or higher, consider [Encrypting SQL Backups](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/backup-encryption?view=sql-server-ver15) to protect data during network transfer.
- To minimize downtime during database migration, use the Always On availability group option. 
- To minimize downtime without the overhead of configuring an availability group, use the log shipping option. 
- For limited to no network options, use offline migration methods such as backup and restore,  or [disk transfer services](../../../../storage/common/storage-solution-large-dataset-low-network.md) available in Azure.
- If you are changing the version of an existing SQL Server on Azure VM, please refer to the following [guide](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/change-sql-server-edition).

### Migrate Databases

Due to the ease of setup, the recommended approach is to perform the migration of user databases using SQL Server native [Backup](https://docs.microsoft.com/en-us/sql/t-sql/statements/backup-transact-sql?view=sql-server-ver15) locally and then copying the file to Azure. This method is recommended as it supports all versions of SQL from 2005 and larger database backups (>1TB), but if you have good connectivity to Azure and are on SQL Server 2014 and databases <1TB, then [SQL Server backup to URL](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/sql-server-backup-to-url?redirectedfrom=MSDN&view=sql-server-ver15) is also a good option. DMA also provides functionality to migrate Windows and SQL Logins, maintaining existing passwords.

[!TIP] For large data transfers or for limited to no network options see [Data transfer for large datasets with low or network bandwidth](https://github.com/MashaMSFT/azure-docs-pr/blob/20200713_sqlvmmig/articles/storage/common/storage-solution-large-dataset-low-network.md)

**Offline Migration**

1. Setup connectivity to target SQL Server on Azure VM, based on your requirements. See [Connect to a SQL Server Virtual Machine on Azure (Resource Manager)](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql).
2. Migrate objects outside user database (see objects outside user database) such as Logins, Jobs and Server level objects.
3. Pause/Stop Applications using databases to be migrated.
4. Ensure User database(s) are inactive using [single user mode](https://docs.microsoft.com/en-us/sql/relational-databases/databases/set-a-database-to-single-user-mode?view=sql-server-ver15). 
5. Perform a full database backup to an on-premises location.
6. Copy your on-premises backup file(s) to your VM using remote desktop, [Azure Data Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/data-explorer-overview#:~:text=It%20helps%20you%20handle%20the%20many%20data%20streams,such%20as%20websites,%20applications,%20IoT%20devices,%20and%20more.), or the [AZCopy command line utility](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10) (>1TB backups recommended).
7. Restore Full Database backup(s) on the SQL Server on Azure VM.

**Online Migration**

1. Setup connectivity to target SQL Server on Azure VM, based on your requirements. See [Connect to a SQL Server Virtual Machine on Azure (Resource Manager)](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql).
2. Migrate objects outside user database (see objects outside user database) such as Logins, Jobs and Server level objects.
3. Ensure on-premise User Database(s) to be migrated are in full or bulk-logged recovery model.
4. Perform a full database backup to an on-premises location and modify any existing full database backups to use [COPY_ONLY](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/copy-only-backups-sql-server?view=sql-server-ver15) keyword.
5. Copy your on-premises backup file(s) to your VM using remote desktop, [Azure Data Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/data-explorer-overview#:~:text=It%20helps%20you%20handle%20the%20many%20data%20streams,such%20as%20websites,%20applications,%20IoT%20devices,%20and%20more.), or the [AZCopy command line utility](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10) (>1TB backups recommended).
6. Restore Full Database backup(s) on the SQL Server on Azure VM.
7. Setup [log shipping](https://docs.microsoft.com/en-us/sql/database-engine/log-shipping/configure-log-shipping-sql-server?view=sql-server-ver15) between on-premise database and target SQL Server on Azure VM. Be sure not to re-initialise the database(s) as this has already been completed in the previous steps.

**Cut-Over**

8. Pause/Stop Applications using databases to be migrated.
9. Ensure User database(s) are inactive using [single user mode](https://docs.microsoft.com/en-us/sql/relational-databases/databases/set-a-database-to-single-user-mode?view=sql-server-ver15). 
10. When required, perform [controlled fail-over](https://docs.microsoft.com/en-us/sql/database-engine/log-shipping/fail-over-to-a-log-shipping-secondary-sql-server?view=sql-server-ver15) of on-premise database(s) to target SQL Server on Azure VM.



### Migrating SQL objects outside user database(s)

There may be additional SQL Server objects that are required for the seamless operation of your user databases post migration. 

The following table provides a list components and recommended migration methods: 


| **Feature** | **Component** | **Migration Method(s)** |
| --- | --- | --- |
| **Databases** | Model  | Script with SQL Server Management Studio |
|| TempDB | Plan to move TempDB onto [Azure VM temporary disk (SSD](../../windows/performance-guidelines-best-practices.md#temporary-disk)) for best performance. Be sure to pick a VM size that has a sufficient local SSD to accommodate your TempDB. |
|| User databases with Filestream |  Use the [Backup and restore](../../windows/migrate-to-vm-from-sql-server.md#back-up-and-restore) methods for migration. DMA does not support databases with Filestream. |
| **Security** | SQL Server and Windows Logins | Use DMA to [migrate user logins](/sql/dma/dma-migrateserverlogins). |
|| SQL Server roles | Script with SQL Server Management Studio |
|| Cryptographic providers | Recommend [converting to use Azure Key Vault Service](../../windows/azure-key-vault-integration-configure.md). This procedure uses the [SQL VM resource provider](../../windows/sql-vm-resource-provider-register.md). |
| **Server objects** | Backup devices | Replace with database backup using [Azure Backup Service](../../../../backup/backup-sql-server-database-azure-vms.md) or write backups to [Azure Storage](../../windows/azure-storage-sql-server-backup-restore-use.md) (SQL Server 2012 SP1 CU2 + ). This procedure uses the [SQL VM resource provider](../../windows/sql-vm-resource-provider-register.md).|
|| Linked Servers | Script with SQL Server Management Studio. |
|| Server Triggers | Script with SQL Server Management Studio. |
| **Replication** | Local Publications | Script with SQL Server Management Studio. |
|| Local Subscribers | Script with SQL Server Management Studio. |
| **Polybase** | Polybase | Script with SQL Server Management Studio. |
| **Management** | Database Mail | Script with SQL Server Management Studio. |
| **SQL Server Agent** | Jobs | Script with SQL Server Management Studio. |
|| Alerts | Script with SQL Server Management Studio. |
|| Operators | Script with SQL Server Management Studio. |
|| Proxies | Script with SQL Server Management Studio. |
| **Operating System** | Files, file shares | Make a note of any additional files or file shares that are used by your SQL Servers and replicate on the Azure VM target. |


## Post-migration

After you have successfully completed the migration stage, go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this may in some cases require changes to the applications.

Apply any Database Migration Assistant recommended fixes to user database(s). It is recommended these are scripted to ensure consistency and to allow for automation.

### Perform tests

The test approach for database migration consists of performing the following activities:

1. **Develop validation tests.**  Use SQL queries to test database migrations. Create validation queries to run against both the source and target databases. Your validation queries should cover the scope you have defined.
2. **Set up test environment.**  The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.
3. **Run validation tests.**  Run the validation tests against the source and the target, and then analyze the results.
4. **Run performance tests.**  Run performance test against the source and target, and then analyze and compare the results.

> [!TIP]
> Use the [Database Experimentation Assistant (DEA)](/sql/dea/database-experimentation-assistant-overview) to assist with evaluating the target SQL Server performance.
>

### Optimize

The post migration phase is crucial for reconciling any issues with data accuracy and completeness, as well as addressing potential performance issues with the workload.

For more information about these issues and specific steps to mitigate them, see the following resources:

- [Post-migration Validation and Optimization Guide.](/sql/relational-databases/post-migration-validation-and-optimization-guide)
- [Tuning performance in Azure SQL Virtual Machines](../../windows/performance-guidelines-best-practices.md).
- [Azure cost optimization center](https://azure.microsoft.com/overview/cost-optimization/).

## Next steps

To check the availability of services applicable to SQL Server see the [Azure Global infrastructure center](https://azure.microsoft.com/global-infrastructure/services/?regions=all&amp;products=synapse-analytics,virtual-machines,sql-database)
