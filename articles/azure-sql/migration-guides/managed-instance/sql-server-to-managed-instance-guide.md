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
ms.reviewer: carlrab
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

This is optional but can be used for comparison post migration. If you need to compare the performance of your workload on a SQL Managed Instance with your original workload running on SQL Server, you would need to create a performance baseline that will be used for comparison. 

Performance baseline is a set of parameters such as average/max CPU usage, average/max disk IO latency, throughput, IOPS, average/max page life expectancy, and average max size of tempdb. You would like to have similar or even better parameters after migration, so it is important to measure and record the baseline values for these parameters. In addition to system parameters, you would need to select a set of the representative queries or the most important queries in your workload and measure min/average/max duration and CPU usage for the selected queries. These values would enable you to compare performance of workload running on SQL Managed Instance to the original values on your source SQL Server instance. 

Some of the parameters that you would need to measure on your SQL Server instance are: 

   - [Monitor CPU usage on your SQL Server instance](https://techcommunity.microsoft.com/t5/azure-sql-database/monitor-cpu-usage-on-sql-server-and-azure-sql/ba-p/680777#M131) and record the average and peak CPU usage. 
   - [Monitor memory usage on your SQL Server instance](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/monitor-memory-usage?view=sql-server-ver15) and determine the amount of memory used by different components such as buffer pool, plan cache, column-store pool, [In-Memory OLTP](https://docs.microsoft.com/en-us/sql/relational-databases/in-memory-oltp/monitor-and-troubleshoot-memory-usage?view=sql-server-2017), etc. In addition, you should find average and peak values of the Page Life Expectancy memory performance counter. 
   - Monitor disk IO usage on the source SQL Server instance using [sys.dm_io_virtual_file_stats](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-io-virtual-file-stats-transact-sql?view=sql-server-ver15) view or [performance counters](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/monitor-disk-usage?view=sql-server-ver15). 
   - Monitor workload and query performance or your SQL Server instance by examining Dynamic Management Views or Query Store if you are migrating from a SQL Server 2016+ version. Identify average duration and CPU usage of the most important queries in your workload to compare them with the queries that are running on the managed instance. 

If you notice any issue with your workload on SQL Server such as high CPU usage, constant memory pressure, or tempdb or parameterization issues, you should try to resolve them on your source SQL Server instance before taking the baseline and migration. Migrating known issues to any new system might cause unexpected results and invalidate any performance comparison. 

As an outcome of this activity, you should have documented average and peak values for CPU, memory, and IO usage on your source system, as well as average and max duration and CPU usage of the dominant and the most critical queries in your workload. You should use these values later to compare performance of your workload on a managed instance with the baseline performance of the workload on the source SQL Server instance. 

## Migrate

After you have completed the tasks associated with the Pre-migration stage, you are ready to perform the schema and data migration. Before proceeding to the migration stage, you will need to provision an appropriately sized Azure SQL Managed Instance as the target of your migration process. 

Migrate your data using your chosen [migration method](sql-server-to-managed-instance-overview.md#migration-options). 

## Data sync and cutover

When using online migration options (DMS online mode, Transactional Replication), the source you are migrating from would continue to change and drift from the target in terms of data and schema. During the Data sync phase, you need to ensure that all changes in the source are captured and applied to the target during the online migration process. After you verify that all changes in source have been applied to the target, you can cutover from the source to the target environment. It is important to plan the cutover process with the business / application teams to ensure the minimal interruption during the cutover does not affect the business continuity. 

   > [!IMPORTANT]
   > For details on the specific steps associated with performing a cutover as part of online migrations using DMS, see the information [here](https://docs.microsoft.com/en-us/azure/dms/tutorial-sql-server-managed-instance-online#performing-migration-cutover).


## Post-migration
After you have successfully completed the Migration stage, you need to go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible. 

### Remediate applications 

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications. 





## Next steps