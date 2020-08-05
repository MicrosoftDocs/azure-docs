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

This migration guide teaches you to migrate your user databases from SQL Server to an instance of SQL Server on Azure Virtual Machines (VMs) by using the [Database Migration Assistant (DMA)](/sql/dma/dma-overview). 

You can migrate SQL Server running on-premises or on:

- SQL Server on Virtual Machines
- Amazon Web Services (AWS) EC2
- Compute Engine (GCP)
- AWS RDS

For information about additional migration strategies, see the [SQL Server VM migration overview](to-sql-server-on-azure-vm-overview.md).


## Prerequisites

Migrating to SQL Server on Azure VMs requires the following: 

- [Database Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595)
- An [Azure Migrate project](../../../migrate/create-manage-projects.md)
- A [SQL Server on Azure VM](../../../azure-sql/virtual-machines/windows/create-sql-vm-portal.md)
- [Connectivity between Azure and on-premises](../../../architecture/reference-architectures/hybrid-networking.md)

The Database Migration Assistant supports the following target and source SQL Server versions - the target must be the same or a greater version than the source: 

|Supported sources   |Supported targets |
|---------|---------|
|SQL Server 2005 <br/> SQL Server 2008 R2 <br/> SQL Server 2008<br/>SQL Server 2012 <br/>SQL Server 2014 <br/>SQL Server 2016 <br/> SQL Server 2017 on Windows<br/> <br/> | SQL Server 2008 R2<br/>SQL Server 2012 <br/> SQL Server 2014<br/>SQL Server 2016 <br/>SQL Server 2017 on Windows and Linux <br/> SQL Server 2019 on Windows and Linux|

## Pre-migration

Before you begin your migration, discover the topology of your environment and assess the feasibility of your intended migration. 

### Discover

Azure Migrate assesses migration suitability of on-premises computers, performs performance-based sizing, and provides cost estimations for running on-premises. Use Azure Migrate to [identify existing data sources and details about the features](../../../../migrate/concepts-assessment-calculation.md) your SQL Server instances use to plan for the migration. This process involves scanning the network to identify all of your SQL Server instances in your organization with the version and features in use. 

> [!IMPORTANT]
> When choosing a target Azure virtual machine for your SQL Server instance, be sure to consider the [Performance guidelines for SQL Server on Azure VMs](windows/performance-guidelines-best-practices.md).

For additional discovery tools, see [Services and tools](../../../../dms/dms-tools-matrix.md#business-justification-phase) available for data migration scenarios.


### Assess

After you've discovered all of the data sources, use the [Data Migration Assistant (DMA)](/dma/dma-overview) to assess on-premises SQL Server instance(s) migrating to an instance of SQL Server on Azure VM to understand the gaps between the source and target instances. 


> [!NOTE]
> If you're _not_ upgrading the version of SQL Server, skip this step and move to the [migration](#migration) section. 



#### Assess user databases 

The Data Migration Assistant (DMA) helps you upgrade to a modern data platform by detecting compatibility issues that can impact database functionality in your new version of SQL Server. DMA recommends performance and reliability improvements for your target environment and allows you to move your schema, data, and login objects from your source server to your target server.

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

For deprecated features, you can choose to run your user database in its original [compatibility](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level) mode if you wish to avoid making these changes and speed up migration. However, this will prevent [upgrading your database compatibility](/sql/database-engine/install-windows/compatibility-certification#compatibility-levels-and-database-engine-upgrades) until the deprecated items have been resolved.

It is recommended that all DMA fixes are scripted and applied to the target SQL Server database during [post-migration](#Post-migration).

> [!CAUTION]
> Not all SQL Server versions support all compatibility modes. Check that your [target SQL Server version](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-compatibility-level?view=sql-server-ver15) supports your chosen database compatibility. For example, SQL Server 2019 does not support databases with level 90 compatibility (which is SQL Server 2005). These databases would require, at least, an upgrade to compatibility level 100.
>

## Migrate

After you have completed the pre-migration steps, you are ready to migrate the user databases and components. 

There are several methods for migrating user SQL database(s) to an instance of SQL Server on an Azure VM, which is outlined in the [SQL VM migration overview](to-sql-server-on-azure-vm-overview.md). When migrating SQL Server databases to an instance of SQL Server on Azure VMs, you can perform an offline or an online migration. With an offline migration, application downtime begins when the migration starts. For an online migration, downtime is limited to the time required to cut over to the new environment when the migration completes.

It is recommended that you first review and test an offline migration to determine whether the downtime is acceptable; if not, plan for using an online migration method.

### Considerations

The following is a list of key points to consider when reviewing migration methods:

- For optimum data transfer performance, migrate databases and files onto an instance of SQL Server on Azure VM using a compressed backup file. 
- To minimize downtime during database migration, use the Always On availability group option. 
- To minimize downtime without the overhead of configuring an availability group, use the log shipping option. 
- For limited to no network options, use offline migration methods such as backup and restore,  or [disk transfer services](../../../../storage/common/storage-solution-large-dataset-low-network.md) available in Azure.

!!!!! i don't think this is accurate:  !!!!!!
- There is no supported method to upgrade SQL Server Instances on an Azure VM. Instead, create and new Instance of SQL Server on a new Azure VM and use one of the methods above to migrate your User Database(s).

### Migrate schema and data

Due to the ease of setup, the recommended approach is to perform the migration with the Data Migration Assistant by using a connection to Azure provided through a private link (either VPN or ExpressRoute). DMA provides the capability to migrate Windows and SQL Server logins, and migrations can be automated with the Command-line interface.

See [steps associated with using DMA to perform a database migration](/sql/dma/dma-migrateonpremsql) to learn more. 


### Objects outside user database(s)

There may be additional components that are required for the seamless operation of your user databases post migration. 

The following table provides a list components and recommended migration methods: 


| **Feature** | **Component** | **Migration Method(s)** |
| --- | --- | --- |
| Databases | Model  | Script with SQL Server Management Studio |
|| TempDB | Plan to move TempDB onto [Azure VM temporary disk (SSD](windows/performance-guidelines-best-practices.md#temporary-disk)) for best performance. Be sure to pick a VM size that has a sufficient local SSD to accommodate your TempDB. |
|| User databases with Filestream |  Use the [Backup and restore](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/migrate-to-vm-from-sql-server#back-up-and-restore) methods for migration. DMA does not support databases with Filestream. |
| Security | SQL Server and Windows Logins | Use DMA to [migrate user logins](/sql/dma/dma-migrateserverlogins). |
|| SQL Server roles | Script with SQL Server Management Studio |
|| Cryptographic providers | Recommend [converting to use Azure Key Vault Service](windows/azure-key-vault-integration-configure.md). This procedure uses the [SQL VM resource provider](windows/sql-vm-resource-provider-register.md). |
| Server objects | Backup devices | Replace with database backup using [Azure Backup Service](../../../../backup/backup-sql-server-database-azure-vms.md) or write backups to [Azure Storage](windows/azure-storage-sql-server-backup-restore-use.md) (SQL Server 2012 SP1 CU2 + ). This procedure uses the [SQL VM resource provider](windows/sql-vm-resource-provider-register.md).|
|| Linked Servers | Script with SQL Server Management Studio. |
|| Server Triggers | Script with SQL Server Management Studio. |
| Replication | Local Publications | Script with SQL Server Management Studio. |
|| Local Subscribers | Script with SQL Server Management Studio. |
| Polybase | Polybase | Script with SQL Server Management Studio. |
| Management | Database Mail | Script with SQL Server Management Studio. |
| SQL Server Agent | Jobs | Script with SQL Server Management Studio. |
|| Alerts | Script with SQL Server Management Studio. |
|| Operators | Script with SQL Server Management Studio. |
|| Proxies | Script with SQL Server Management Studio. |
| Operating System | Files, file shares | Make a note of any additional files or file shares that are used by your SQL Servers and replicate on the Azure VM target. |


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
> Use the [Database Experimentation Assistant (DEA)](https://docs.microsoft.com/en-us/sql/dea/database-experimentation-assistant-overview?view=sql-server-ver15) to assist with evaluating the target SQL Server performance.
>

### Optimize

The post migration phase is crucial for reconciling any issues with data accuracy and completeness, as well as addressing potential performance issues with the workload.

For more information about these issues and specific steps to mitigate them, see the following resources:

- [Post-migration Validation and Optimization Guide.](/sql/relational-databases/post-migration-validation-and-optimization-guide)
- [Tuning performance in Azure SQL Virtual Machines](windows/performance-guidelines-best-practices.md).
- [Azure cost optimization center](https://azure.microsoft.com/overview/cost-optimization/).

## Next steps

To check the availability of services applicable to SQL Server see the [Azure Global infrastructure center](https://azure.microsoft.com/global-infrastructure/services/?regions=all&amp;products=synapse-analytics,virtual-machines,sql-database)
