---
title: SQL Server to SQL Server on Azure VMs (Migration guide)
description: Follow this guide to migrate your individual SQL Server databases to SQL Server on Azure Virtual Machines (VMs). 
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

# Migration guide: SQL Server to SQL Server on Azure VMs (Individual databases)

This migration guide teaches you to **discover**, **assess** and **migrate** your user databases from SQL Server to an instance of SQL Server on Azure Virtual Machines (VMs) by using the backup and restore and log shipping utilising the [Database Migration Assistant (DMA)](/sql/dma/dma-overview) for assessment. 

You can migrate SQL Server running on-premises or on:

- SQL Server on Virtual Machines  
- Amazon Web Services (AWS) EC2 
- Amazon Relational Database Service (AWS RDS) 
- Compute Engine (Google Cloud Platform - GCP)

For information about additional migration strategies, see the [SQL Server VM migration overview](to-sql-server-on-azure-vm-overview.md).

:::image type="content" source="../media/migration-process-flow-small.png" alt-text="Migration process flow":::

## Prerequisites

Migrating to SQL Server on Azure VMs requires the following: 

- [Database Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595)
- An [Azure Migrate project](../../../../migrate/create-manage-projects.md)
- A prepared target [SQL Server on Azure VM](../../../virtual-machines/windows/create-sql-vm-portal.md) that is the same or greater version than the source SQL Server
- [Connectivity between Azure and on-premises](/architecture/reference-architectures/hybrid-networking)
- [Choosing an appropriate migration strategy](to-sql-server-on-azure-vm-overview.md#migrate)

## Pre-migration

Before you begin your migration, discover the topology of your SQL environment and assess the feasibility of your intended migration. 

### Discover

Azure Migrate assesses migration suitability of on-premises computers, performs performance-based sizing, and provides cost estimations for running on-premises. To plan for the migration, use Azure Migrate to [identify existing data sources and details about the features](../../../../migrate/concepts-assessment-calculation.md) your SQL Server instances use. This process involves scanning the network to identify all of your SQL Server instances in your organization with the version and features in use. 

> [!IMPORTANT]
> When choosing a target Azure virtual machine for your SQL Server instance, be sure to consider the [Performance guidelines for SQL Server on Azure VMs](../../../virtual-machines/windows/performance-guidelines-best-practices.md).

For additional discovery tools, see [Services and tools](../../../../dms/dms-tools-matrix.md#business-justification-phase) available for data migration scenarios.


### Assess

After you've discovered all of the data sources, use the [Data Migration Assistant (DMA)](/dma/dma-overview) to assess on-premises SQL Server instance(s) migrating to an instance of SQL Server on Azure VM to understand the gaps between the source and target instances. 


> [!NOTE]
> If you're _not_ upgrading the version of SQL Server, skip this step and move to the [migrate](#migrate) section. 


#### Assess user databases 

The Data Migration Assistant (DMA) assists your migration to a modern data platform by detecting compatibility issues that can impact database functionality in your new version of SQL Server. DMA recommends performance and reliability improvements for your target environment and also allows you to move your schema, data, and login objects from your source server to your target server.

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

After you have completed the pre-migration steps, you are ready to migrate the user databases and components. Migrate your databases using your preferred [migration method](to-sql-server-on-azure-vm-overview.md#migrate).  

The following provides steps for performing either an standard migration using backup and restore, or an minimal downtime migration using backup and restore along with log shipping for the online cutover. 

### Standard Migration (Offline Migration)

To perform an standard migration using backup and restore, follow these steps: 

1. Setup connectivity to the target SQL Server on Azure VM, based on your requirements. See [Connect to a SQL Server Virtual Machine on Azure (Resource Manager)](../../../virtual-machines/windows/ways-to-connect-to-sql.md).
1. Pause/stop any applications that are using databases intended for migration. 
1. Ensure user database(s) are inactive using [single user mode](/sql/relational-databases/databases/set-a-database-to-single-user-mode). 
1. Perform a full database backup to an on-premises location.
1. Copy your on-premises backup file(s) to your VM using remote desktop, [Azure Data Explorer](/data-explorer/data-explorer-overview), or the [AZCopy command line utility](../../../../storage/common/storage-use-azcopy-v10.md) (> 2TB backups recommended).
1. Restore full database backup(s) to the SQL Server on Azure VM.

### Minimal Downtime Migration (Online Migration)

To perform a minimal downtime migration using backup, restore, and log shipping, follow these steps: 

1. Setup connectivity to target SQL Server on Azure VM, based on your requirements. See [Connect to a SQL Server Virtual Machine on Azure (Resource Manager)](../../../virtual-machines/windows/ways-to-connect-to-sql.md).
1. Ensure on-premise User Database(s) to be migrated are in full or bulk-logged recovery model.
1. Perform a full database backup to an on-premises location and modify any existing full database backups jobs to use [COPY_ONLY](/sql/relational-databases/backup-restore/copy-only-backups-sql-server) keyword to preserve the log chain.
1. Copy your on-premises backup file(s) to your VM using remote desktop, [Azure Data Explorer](/data-explorer/data-explorer-overview), or the [AZCopy command line utility](../../../../storage/common/storage-use-azcopy-v10.md) (>1TB backups recommended).
1. Restore Full Database backup(s) on the SQL Server on Azure VM.
1. Setup [log shipping](/sql/database-engine/log-shipping/configure-log-shipping-sql-server) between on-premise database and target SQL Server on Azure VM. Be sure not to re-initialize the database(s) as this has already been completed in the previous steps.
1. **Cut over** to the online target. 
   1. Pause/stop applications using databases to be migrated. 
   1. Ensure user database(s) are inactive using [single user mode](/sql/relational-databases/databases/set-a-database-to-single-user-mode). 
   1. When ready, perform a log shipping [controlled fail-over](/sql/database-engine/log-shipping/fail-over-to-a-log-shipping-secondary-sql-server) of on-premise database(s) to target SQL Server on Azure VM.



### Migrating objects outside user database(s)

There may be additional SQL Server objects that are required for the seamless operation of your user databases post migration. 

The following table provides a list components and recommended migration methods which can be completed before or after migration of your User databases: 


| **Feature** | **Component** | **Migration Method(s)** |
| --- | --- | --- |
| **Databases** | Model  | Script with SQL Server Management Studio |
|| TempDB | Plan to move TempDB onto [Azure VM temporary disk (SSD](../../../virtual-machines/windows/performance-guidelines-best-practices.md#temporary-disk)) for best performance. Be sure to pick a VM size that has a sufficient local SSD to accommodate your TempDB. |
|| User databases with Filestream |  Use the [Backup and restore](../../../virtual-machines/windows/migrate-to-vm-from-sql-server.md#back-up-and-restore) methods for migration. DMA does not support databases with Filestream. |
| **Security** | SQL Server and Windows Logins | Use DMA to [migrate user logins](/sql/dma/dma-migrateserverlogins). |
|| SQL Server roles | Script with SQL Server Management Studio |
|| Cryptographic providers | Recommend [converting to use Azure Key Vault Service](../../../virtual-machines/windows/azure-key-vault-integration-configure.md). This procedure uses the [SQL VM resource provider](../../../virtual-machines/windows/sql-vm-resource-provider-register.md). |
| **Server objects** | Backup devices | Replace with database backup using [Azure Backup Service](../../../../backup/backup-sql-server-database-azure-vms.md) or write backups to [Azure Storage](../../../virtual-machines/windows/azure-storage-sql-server-backup-restore-use.md) (SQL Server 2012 SP1 CU2 + ). This procedure uses the [SQL VM resource provider](../../../virtual-machines/windows/sql-vm-resource-provider-register.md).|
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
- [Tuning performance in Azure SQL Virtual Machines](../../../virtual-machines/windows/performance-guidelines-best-practices.md).
- [Azure cost optimization center](https://azure.microsoft.com/overview/cost-optimization/).

## Next steps

- To check the availability of services applicable to SQL Server see the [Azure Global infrastructure center](https://azure.microsoft.com/global-infrastructure/services/?regions=all&amp;products=synapse-analytics,virtual-machines,sql-database)

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see the article [Service and tools for data migration.](../../../../dms/dms-tools-matrix.md)

- To learn more about Azure SQL see:
   - [Deployment options](../../../azure-sql-iaas-vs-paas-what-is-overview.md)
   - [SQL Server on Azure VMs](../../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- For information about licensing, see
   - [Bring your own license with the Azure Hybrid Benefit](../../../virtual-machines/windows/licensing-model-azure-hybrid-benefit-ahb-change.md)
   - [Get free extended support for SQL Server 2008 and SQL Server 2008 R2](../../../virtual-machines/windows/sql-server-2008-extend-end-of-support.md)


- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
