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
ms.date: 11/03/2020
---
# Migration guide: SQL Server to SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqlmi.md)]

This guide helps you migrate your SQL Server instance to Azure SQL Managed Instance. 

You can migrate SQL Server running on-premises or on: 

- SQL Server on Virtual Machines  
- Amazon Web Services (AWS) EC2 
- Amazon Relational Database Service (AWS RDS) 
- Compute Engine (Google Cloud Platform - GCP)  
- Cloud SQL for SQL Server (Google Cloud Platform – GCP) 

For more migration information, see the [migration overview](sql-server-to-managed-instance-overview.md). For other scenarios, see the [Database Migration Guide](https://datamigration.microsoft.com/).

:::image type="content" source="media/sql-server-to-managed-instance-overview/migration-process-flow-small.png" alt-text="Migration process flow":::

## Prerequisites 

To migrate your SQL Server to Azure SQL Managed Instance, make sure to go through the following pre-requisites: 

- Choose a [migration method](sql-server-to-managed-instance-overview.md#migration-options) and the corresponding tools that are required for the chosen method
- Install [Data Migration Assistant (DMA)](https://www.microsoft.com/en-us/download/details.aspx?id=53595) on a machine that can connect to your source SQL Server
- Create a target [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-create-quickstart).


## Pre-migration

After you've verified that your source environment is supported, start with the pre-migration stage. Discover all of the existing data sources, assess migration feasibility, and identify any blocking issues that might prevent your migration.  

### Discover

In the Discover phase, scan the network to identify all SQL Server instances and features used by your organization. 

Use [Azure Migrate](../../../migrate/migrate-services-overview.md) to assesses migration suitability of on-premises servers, perform performance-based sizing, and provide cost estimations for running them in Azure. 

Alternatively, use the [Microsoft Assessment and Planning Toolkit (the "MAP Toolkit")](https://www.microsoft.com/download/details.aspx?id=7826) to assess your current IT infrastructure. The toolkit provides a powerful inventory, assessment, and reporting tool to simplify the migration planning process. 

For more information about tools available to use for the Discover phase, see [Services and tools available for data migration scenarios](../../../dms/dms-tools-matrix.md). 

### Assess 

After data sources have been discovered, assess any on-premises SQL Server instance(s) that can be migrated to Azure SQL Managed Instance to identify migration blockers or compatibility issues. 

You can use the Data Migration Assistant (version 4.1 and later) to assess databases to get: 

- [Azure target recommendations](/sql/dma/dma-assess-sql-data-estate-to-sqldb)
- [Azure SKU recommendations](/sql/dma/dma-sku-recommend-sql-db)

To assess your environment using the Database Migration Assessment, follow these steps: 

1. Open the [Data Migration Assistant (DMA)](https://www.microsoft.com/en-us/download/details.aspx?id=53595). 
1. Select **File** and then choose **New assessment**. 
1. Specify a project name, select SQL Server as the source server type, and then select Azure SQL Managed Instance as the target server type. 
1. Select the type(s) of assessment reports that you want to generate. For example, database compatibility and feature parity. Based on the type of assessment, the permissions required on the source SQL Server can be different.  DMA will highlight the permissions required for the chosen advisor before running the assessment.
    - The **feature parity** category provides a comprehensive set of recommendations, alternatives available in Azure, and mitigating steps to help you plan your migration project. (sysadmin permissions required)
    - The **compatibility issues** category identifies partially supported or unsupported feature compatibility issues that might block migration as well as recommendations to address them (`CONNECT SQL`, `VIEW SERVER STATE`, and `VIEW ANY DEFINITION` permissions required).
1. Specify the source connection details for your SQL Server and connect to the source database.
1. Select **Start assessment**. 
1. When the process is complete, select and review the assessment reports for migration blocking and feature parity issues. The assessment report can also be exported to a file that can be shared with other teams or personnel in your organization. 
1. Determine the database compatibility level that minimizes post-migration efforts.  
1. Identify the best Azure SQL Managed Instance SKU for your on-premises workload. 

To learn more, see [Perform a SQL Server migration assessment with Data Migration Assistant](/sql/dma/dma-assesssqlonprem).

If SQL Managed Instance is not a suitable target for your workload, SQL Server on Azure VMs might be a viable alternative target for your business. 

#### Scaled Assessments and Analysis

Data Migration Assistant supports performing scaled assessments and consolidation of the assessment reports for analysis. If you have multiple servers and databases that need to be assessed and analysed at scale to provide a wider view of the data estate, click on the following links to learn more.

- [Performing scaled assessments using Powershell](/sql/dma/dma-consolidatereports)
- [Analyzing assessment reports using Power BI](/sql/dma/dma-consolidatereports#dma-reports)

> [!IMPORTANT]
>Running assessments at scale for multiple databases can also be automated using [DMA's Command Line Utility](/sql/dma/dma-commandline) which also allows the results to be uploaded to [Azure Migrate](/sql/dma/dma-assess-sql-data-estate-to-sqldb#view-target-readiness-assessment-results) for further analysis and target readiness.

### Create a performance baseline

If you need to compare the performance of your workload on a SQL Managed Instance with your original workload running on SQL Server, create a performance baseline to use for comparison. See [performance baseline](sql-server-to-managed-instance-performance-baseline.md) to learn more. 

### Create SQL Managed Instance 

Based on the information in the discover and assess phase, create an appropriately-sized target SQL Managed Instance. You can do so by using the [Azure portal](../../managed-instance/instance-create-quickstart.md), [PowerShell](../../managed-instance/scripts/create-configure-managed-instance-powershell.md), or an [ARM Template](/../../managed-instance/create-template-quickstart.md). 


## Migrate

After you have completed tasks associated with the Pre-migration stage, you are ready to perform the schema and data migration. 

Migrate your data using your chosen [migration method](sql-server-to-managed-instance-overview.md#migration-options). 

This guide describe the two most popular options - Azure Database Migration Service (DMS) and native backup and restore. 

### Database Migration Service

To perform migrations using DMS, follow the steps below:

1. Register the **Microsoft.DataMigration** resource provider in your subscription if you are performing this for the first time.
1. Create an Azure Database Migration Service Instance in a desired location of your choice (preferably in the same region as your target Azure SQL Managed Instance) and select an existing virtual network or create a new one to host your DMS instance.
1. After creating your DMS instance, create a new migration project and specify the source server type as **SQL Server** and the target server type as **Azure SQL Database Managed Instance**. Choose the type of activity in the project creation blade - online or offline data migration. 
1.  Specify the source SQL Server details on the **Migration source** details page and the target Azure SQL Managed Instance details on the **Migration target** details page. Select **Next**.
1. Choose the database you want to migrate. 
1. Provide configuration settings to specify the **SMB Network Share** that contains your database backup files. Use Windows User credentials with DMS that can access the network share. Provide your **Azure Storage account details**. 
1. Review the migration summary, and choose **Run migration**. You can then monitor the migration activity and check the progress of your database migration.
1. After database is restored, choose **Start cutover**. The migration process copies the tail-log backup once you make it available in the SMB network share and restore it on the target. 
1. Stop all incoming traffic to  your source database and update the connection string to the new Azure SQL Managed Instance database. 

For a detailed step-by-step tutorial of this migration option, see [Migrate SQL Server to an Azure SQL Managed Instance online using DMS](/azure/dms/tutorial-sql-server-managed-instance-online). 
   


### Backup and restore 

One of the key capabilities of Azure SQL Managed Instance to enable quick and easy database migration is the native restore of database backup (`.bak`) files stored on on [Azure Storage](https://azure.microsoft.com/services/storage/). Backup and restore is an asynchronous operation based on the size of your database. 

The following diagram provides a high-level overview of the process:

![Diagram shows SQL Server with an arrow labeled BACKUP / Upload to URL flowing to Azure Storage and a second arrow labeled RESTORE from URL flowing from Azure Storage to a Managed Instance of SQL.](./media/sql-server-to-managed-instance-overview/migration-restore.png)

> [!NOTE]
> The time to take the backup,  upload it to Azure storage, and perform a native restore operation to Azure SQL Managed Instance is based on the size of the database. Factor a sufficient downtime to accommodate the operation for large databases. 


To migrate using backup and restore, follow these steps: 

1. Back up your database to Azure blob storage. For example, use [backup to url](/sql/relational-databases/backup-restore/sql-server-backup-to-url) in [SQL Server Management Studio](/ssms/download-sql-server-management-studio-ssms). Use the [Microsoft Azure Tool](https://go.microsoft.com/fwlink/?LinkID=324399) to support databases earlier than SQL Server 2012 SP1 CU2. 
1. Connect to your Azure SQL Managed Instance using SQL Server Management Studio. 
1. Create a credential using a Shared Access Signature to access your Azure Blob storage account with your database backups. For example:

   ```sql
   CREATE CREDENTIAL [https://mitutorials.blob.core.windows.net/databases]
   WITH IDENTITY = 'SHARED ACCESS SIGNATURE'
   , SECRET = 'sv=2017-11-09&ss=bfqt&srt=sco&sp=rwdlacup&se=2028-09-06T02:52:55Z&st=2018-09-04T18:52:55Z&spr=https&sig=WOTiM%2FS4GVF%2FEEs9DGQR9Im0W%2BwndxW2CQ7%2B5fHd7Is%3D'
   ```
1. Restore the backup from the Azure storage blob container. For example: 

	```sql
   RESTORE DATABASE [TargetDatabaseName] FROM URL =
     'https://mitutorials.blob.core.windows.net/databases/WideWorldImporters-Standard.bak'
   ```

1. Once restore completes, view the database in **Object Explorer** within SQL Server Management Studio. 

To learn more about this migration option, see [Restore a database to Azure SQL Managed Instance with SSMS](https://docs.microsoft.com/azure/azure-sql/managed-instance/restore-sample-database-quickstart).

> [!NOTE]
> A database restore operation is asynchronous and retryable. You might get an error in SQL Server Management Studio if the connection breaks or a time-out expires. Azure SQL Database will keep trying to restore database in the background, and you can track the progress of the restore using the [sys.dm_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) and [sys.dm_operation_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) views.



## Data sync and cutover

When using migration options that continuously replicate / sync data changes from source to the target, the source data and schema can change and drift from the target. During data sync, ensure that all changes on the source are captured and applied to the target during the migration process. 

After you verify that data is the same on both source and target, you can cutover from the source to the target environment. It is important to plan the cutover process with business / application teams to ensure minimal interruption during cutover does not affect business continuity. 

> [!IMPORTANT]
> For details on the specific steps associated with performing a cutover as part of migrations using DMS, see [Performing migration cutover](../../../dms/tutorial-sql-server-managed-instance-online.md#performing-migration-cutover).


## Post-migration

After you have successfully completed the migration stage, go through a series of post-migration tasks to ensure that everything is functioning smoothly and efficiently. 

The post-migration phase is crucial for reconciling any data accuracy issues and verifying completeness, as well as addressing performance issues with the workload. 

### Remediate applications 

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will, in some cases, require changes to the applications.

### Perform tests

The test approach for database migration consists of the following activities:

1. **Develop validation tests**: To test database migration, you need to use SQL queries. You must create the validation queries to run against both the source and the target databases. Your validation queries should cover the scope you have defined.
1. **Set up test environment**: The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.
1. **Run validation tests**: Run the validation tests against the source and the target, and then analyze the results.
1. **Run performance tests**: Run performance test against the source and the target, and then analyze and compare the results.

   > [!NOTE]
   > For assistance developing and running post-migration validation tests, consider the Data Quality Solution available from the partner [QuerySurge](https://www.querysurge.com/company/partners/microsoft). 



## Leverage advanced features 

Be sure to take advantage of the advanced cloud-based features offered by SQL Managed Instance, such as [built-in high availability](../../database/high-availability-sla.md), [threat detection](../../database/advanced-data-security.md), and [monitoring and tuning your workload](../../database/monitor-tune-overview.md). 

[Azure SQL Analytics](../../../azure-monitor/insights/azure-sql.md) allows you to monitor a large set of managed instances in a centralized manner.

Some SQL Server features are only available once the [database compatibility level](/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database) is changed to the latest compatibility level (150). 


## Next steps

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Managed Instance see:
   - [Service Tiers in Azure SQL Managed Instance](../../managed-instance/sql-managed-instance-paas-overview.md#service-tiers)
   - [Differences between SQL Server and Azure SQL Managed Instance](../../managed-instance/transact-sql-tsql-differences-sql-server.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
