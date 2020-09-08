---
title: "SQL Server to SQL Managed Instance - Migration Guide"
description: Follow this guide to migrate your SQL Server databases to Azure SQL Managed Instance. 
ms.service: sql-database
ms.subservice: migration
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: mokabiru
ms.date: 08/25/2020
---
# Migration guide: SQL Server to SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqlmi.md)]

## Prerequisites 

- You have chosen a [migration method](sql-server-to-managed-instance-overview.md#migration-options). 


## Pre-migration

After verifying that your source environment is supported and ensuring that you have addressed any prerequisites, you are ready to start the Pre-migration stage. This part of the process involves conducting an inventory of the databases that you need to migrate, assessing those databases for compatibility with Azure SQL Managed Instance, and then ensuring that there are no blocking issues that can prevent your migrations.  

As part of the assessment process, you can also create a performance baseline to determine resource usage on your source SQL Server. This performance baseline creation step is optional if you want to deploy a properly sized Managed Instance and to validate the captured baseline with the post migration performance on the Managed Instance.  

### Discover

The goal of the Discover phase is to identify existing data sources and details about the features that are being used to get a better understanding of and plan for the migration. This process involves scanning the network to identify all your organization’s SQL Server instances together with the version and features in use. 

You can use the [Azure Migrate](../../../migrate/migrate-services-overview) service to assesses on-premises workloads for migration to Azure. The service assesses the migration suitability of on-premises servers, performs performance-based sizing, and provides cost estimations for running them in Azure. If you're contemplating lift-and-shift migrations, or are in the early assessment stages of migration, this service is for you. 

You can also use the [Microsoft Assessment and Planning Toolkit (the "MAP Toolkit")](https://www.microsoft.com/download/details.aspx?id=7826) to assess your current IT infrastructure for a variety of technology migration projects. This Solution Accelerator provides a powerful inventory, assessment, and reporting tool to simplify the migration planning process. 

For more information about the tools available for use during the Discover phase, see the article [Services and tools available for data migration scenarios](../../../dms/dms-tools-matrix.md)

### Assess 

When the data sources have been identified, the next step is to assess any on-premises SQL Server instance(s) that can be migrated to Azure SQL Database Managed Instance and to understand any migration blockers or compatibility issues. 

>[!NOTE]
> Data Migration Assistant (DMA) support for migrations to Azure SQL Database managed instance is available in version 4.1 and later.

You can use Data Migration Assistant to assess databases to get: 

- Azure target recommendations, find the relative readiness of the SQL Server instances and databases migrating to Azure SQL Database managed instance. For more information, see the article [here](https://docs.microsoft.com/en-us/sql/dma/dma-assess-sql-data-estate-to-sqldb?view=sql-server-ver15)
- Azure SQL Database managed instance SKU recommendations. For more information, see the article [here](https://docs.microsoft.com/en-us/sql/dma/dma-sku-recommend-sql-db?view=sql-server-ver15).

It is also important to note that if there are potential migration blockers to migrate your SQL Servers or databases to Azure SQL Managed Instance, Azure SQL Virtual Machines(VM)  would be the next best alternative target to consider. Below are some example requirements to consider Azure SQL VM instead of Azure SQL Managed Instance: 

- If you require direct access to the operating system or file system, for instance to install third-party or custom agents on the same virtual machine with SQL Server. 
- If you have strict dependency on features that are still not supported, such as FileStream/FileTable, PolyBase, and cross-instance transactions. 
- If you absolutely need to stay at a specific version of SQL Server (2012, for instance). 
- If your compute requirements are much lower than managed instance offers (one vCore, for instance), and database consolidation is not an acceptable option. 

> [!NOTE]
> Azure SQL Managed Instance guarantees 99.99% availability even in critical scenarios, so overhead caused by some features in SQL MI cannot be disabled. For more information, see the [root causes that might cause different performance on SQL Server and Azure SQL Managed Instance](https://azure.microsoft.com/en-us/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/). 

### Assessment steps

An overview of the steps associated with using DMA to create an assessment follows. 

1. Open the Data Migration Assistant (DMA), and then begin creating a new assessment project. 
1. Specify a project name, select SQL Server as the source server type, and then select Azure SQL Database Managed Instance as the target server type. 
1. Select the type(s) of assessment reports (database compatibility and feature parity) that you want to generate. 
    - The SQL Server feature parity category provides a comprehensive set of recommendations, alternative approaches available in Azure, and mitigating steps to help you plan the effort into your migration projects. 
    - The Compatibility issues category identifies partially supported or unsupported features that reflect compatibility issues that might block migrating on-premises SQL Server database(s) to Azure SQL Managed Instance. Recommendations are also provided to help you address those issues. 
1. Specify the source connection details for your SQL Server, connect to the source database, and then start the assessment. 
1. When the process is complete, review the assessment reports for migration blocking issues and feature parity issues by selecting the specific options. The assessment report can also be exported to a file that can be shared with other teams or personnel in your organization. 
1. Determine the database compatibility level that you want to minimize your efforts after migrating to Azure SQL Database. 
1. Identify the best Azure SQL Managed Instance SKU for your on-premises workload. 


For additional detail on this process, see the article [Perform a SQL Server migration assessment with Data Migration Assistant](https://docs.microsoft.com/en-us/sql/dma/dma-assesssqlonprem?view=sql-server-2017).

### Create a performance baseline

If you need to compare the performance of your workload on a SQL Managed Instance with your original workload running on SQL Server, you would need to create a performance baseline that will be used for comparison. See [performance baseline](sql-server-to-managed-instance-perforamnce-baseline.md) to learn more. 


## Migrate

After you have completed the tasks associated with the Pre-migration stage, you are ready to perform the schema and data migration. Before proceeding to the migration stage, you will need to provision an appropriately sized Azure SQL Managed Instance as the target of your migration process. 

Migrate your data using your chosen [migration method](sql-server-to-managed-instance-overview.md#migration-options). 

Some general guidelines that would help you choose the right service tier and characteristics of Azure SQL MI based on the performance baseline that you captured are below:

-   Based on the baseline CPU usage, you can provision a managed instance that matches the number of cores that you are using on SQL Server, having in mind that CPU characteristics might need to be scaled to match [VM characteristics where the managed instance is installed](/azure/azure-sql/managed-instance/resource-limits#hardware-generation-characteristics).
-   Based on the baseline memory usage, choose [the service tier that has matching memory](/azure/azure-sql/managed-instance/resource-limits#hardware-generation-characteristics). The amount of memory cannot be directly chosen, so you would need to select the managed instance with the amount of vCores that has matching memory (for example, 5.1 GB/vCore in Gen5).
-   Based on the baseline IO latency of the file subsystem, choose between the General Purpose (latency greater than 5 ms) and Business Critical (latency less than 3 ms) service tiers.
-   Based on baseline throughput, pre-allocate the size of data or log files to get expected IO performance.


One of the key benefits of migrating your SQL Servers to Azure SQL MI is that you can move an entire instance or a bunch of databases as part of the migration process. Hence, it is important to carefully plan your migration activities to include the following:

-   The migration of all databases that need to be co-located on the same instance.
-   The migration of instance-level objects that your application depends on, including logins, credentials, SQL Agent jobs and operators, and server-level triggers

	> [!IMPORTANT]
	> -   When you're migrating a database protected by [**Transparent Data Encryption**](/azure/azure-sql/database/transparent-data-encryption-tde-overview) to a managed instance using native restore option, the corresponding certificate from the on-premises or Azure VM SQL Server needs to be migrated before database restore. For detailed steps, see [**Migrate a TDE cert to a managed instance**](/azure/azure-sql/managed-instance/tde-certificate-migrate).
	> -   Restore of system databases is not supported. To migrate instance-level objects (stored in master or msdb databases), we recommend to script them out and run T-SQL scripts on the destination instance.
	
## Data sync and cutover

When using online migration options (DMS online mode, Transactional Replication), the source you are migrating from would continue to change and drift from the target in terms of data and schema. During the Data sync phase, you need to ensure that all changes in the source are captured and applied to the target during the online migration process. After you verify that all changes in source have been applied to the target, you can cutover from the source to the target environment. It is important to plan the cutover process with the business / application teams to ensure the minimal interruption during the cutover does not affect the business continuity. 

   > [!IMPORTANT]
   > For details on the specific steps associated with performing a cutover as part of online migrations using DMS, see the information [here](https://docs.microsoft.com/en-us/azure/dms/tutorial-sql-server-managed-instance-online#performing-migration-cutover).


## Post-migration
After you have successfully completed the Migration stage, you need to go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible. After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications. 

The post-migration phase is also crucial for reconciling any data accuracy issues and verifying completeness, as well as addressing performance issues with the workload. Optimizing your Managed Instance also includes leveraging the best of Azure SQL PaaS features that you can now benefit from after the migration to enable your databases adapt to newer and modern applications.



## Next steps
