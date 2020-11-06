---
title: "SQL Server to SQL Database - Migration Guide"
description: Follow this guide to migrate your SQL Server databases to Azure SQL Database. 
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
# Migration guide: SQL Server to SQL Database
[!INCLUDE[appliesto--sqldb](../../includes/appliesto-sqldb.md)]

This guide helps you migrate your SQL Server instance to Azure SQL Database. 

You can migrate SQL Server running on-premises or on: 

- SQL Server on Virtual Machines  
- Amazon Web Services (AWS) EC2 
- Amazon Relational Database Service (AWS RDS) 
- Compute Engine (Google Cloud Platform - GCP)  
- Cloud SQL for SQL Server (Google Cloud Platform – GCP) 

For more migration information, see the [migration overview](sql-server-to-sql-database-overview.md). For other scenarios, see the [Database Migration Guide](https://datamigration.microsoft.com/).

:::image type="content" source="media/sql-server-to-database-overview/migration-process-flow-small.png" alt-text="Migration process flow":::

## Prerequisites 

To migrate your SQL Server to Azure SQL Database, make sure you have the following prerequisites: 

- A chosen [migration method](sql-server-to-sql-database-overview.md#migration-options) and corresponding tools 
- [Data Migration Assistant (DMA)](https://www.microsoft.com/en-us/download/details.aspx?id=53595) installed on a machine that can connect to your source SQL Server
- A target [Azure SQL Database](../../database/single-database-create-quickstart.md)


## Pre-migration

After you've verified that your source environment is supported, start with the pre-migration stage. Discover all of the existing data sources, assess migration feasibility, and identify any blocking issues that might prevent your migration. 

### Discover

In the Discover phase, scan the network to identify all SQL Server instances and features used by your organization. 

Use [Azure Migrate](../../../migrate/migrate-services-overview.md) to assess migration suitability of on-premises servers, perform performance-based sizing, and provide cost estimations for running them in Azure. 

Alternatively, use the [Microsoft Assessment and Planning Toolkit (the "MAP Toolkit")](https://www.microsoft.com/download/details.aspx?id=7826) to assess your current IT infrastructure. The toolkit provides a powerful inventory, assessment, and reporting tool to simplify the migration planning process. 

For more information about tools available to use for the Discover phase, see [Services and tools available for data migration scenarios](../../../dms/dms-tools-matrix.md). 

### Assess 

After data sources have been discovered, assess any on-premises SQL Server database(s) that can be migrated to Azure SQL Database to identify migration blockers or compatibility issues. 

You can use the Data Migration Assistant (version 4.1 and later) to assess databases to get: 

- [Azure target recommendations](/sql/dma/dma-assess-sql-data-estate-to-sqldb)
- [Azure SKU recommendations](/sql/dma/dma-sku-recommend-sql-db)

To assess your environment using the Database Migration Assessment, follow these steps: 

1. Open the [Data Migration Assistant (DMA)](https://www.microsoft.com/en-us/download/details.aspx?id=53595). 
1. Select **File** and then choose **New assessment**. 
1. Specify a project name, select SQL Server as the source server type, and then select Azure SQL Database as the target server type. 
1. Select the type(s) of assessment reports that you want to generate. For example, database compatibility and feature parity. Based on the type of assessment, the permissions required on the source SQL Server can be different.  DMA will highlight the permissions required for the chosen advisor before running the assessment.
    - The **feature parity** category provides a comprehensive set of recommendations, alternatives available in Azure, and mitigating steps to help you plan your migration project. (sysadmin permissions required)
    - The **compatibility issues** category identifies partially supported or unsupported feature compatibility issues that might block migration as well as recommendations to address them (`CONNECT SQL`, `VIEW SERVER STATE`, and `VIEW ANY DEFINITION` permissions required).
1. Specify the source connection details for your SQL Server and connect to the source database.
1. Select **Start assessment**. 
1. After the process completes, select and review the assessment reports for migration blocking and feature parity issues. The assessment report can also be exported to a file that can be shared with other teams or personnel in your organization. 
1. Determine the database compatibility level that minimizes post-migration efforts.  
1. Identify the best Azure SQL Database SKU for your on-premises workload. 

To learn more, see [Perform a SQL Server migration assessment with Data Migration Assistant](/sql/dma/dma-assesssqlonprem).

If the assessment encounters multiple blockers to confirm that your database it not ready for an Azure SQL Database migration, then alternatively consider:

- [Azure SQL Managed Instance](../managed-instance/sql-server-to-managed-instance-overview.md) if there are multiple instance-scoped dependencies
- [SQL Server on Azure Virtual Machines](..//virtual-machines/sql-server/to-sql-server-on-azure-vm-overview) if both SQL Database and SQL Managed Instance fail to be suitable targets. 



#### Scaled Assessments and Analysis
Data Migration Assistant supports performing scaled assessments and consolidation of the assessment reports for analysis. 

If you have multiple servers and databases that need to be assessed and analysed at scale to provide a wider view of the data estate, see the following links to learn more:

- [Performing scaled assessments using Powershell](/sql/dma/dma-consolidatereports)
- [Analyzing assessment reports using Power BI](/sql/dma/dma-consolidatereports#dma-reports)

> [!IMPORTANT]
> Running assessments at scale for multiple databases, especially large ones, can also be automated using the [DMA Command Line Utility](/sql/dma/dma-commandline) and uploaded to [Azure Migrate](/sql/dma/dma-assess-sql-data-estate-to-sqldb#view-target-readiness-assessment-results) for further analysis and target readiness.

## Migrate

After you have completed tasks associated with the Pre-migration stage, you are ready to perform the schema and data migration. 

Migrate your data using your chosen [migration method](sql-server-to-sql-database-overview.md#migration-options). 

This guide describe the two most popular options - Data Migration Assistant and Azure Database Migration Service. 

### Data Migration Assistant (DMA)

To migrate a database from SQL Server to Azure SQL Database using DMA, follow these steps: 

1. Download and install the [Database Migration Assistant](https://www.microsoft.com/en-us/download/details.aspx?id=53595).
1. Create a new project and select **Migration** as the project type.
1. Set the source server type to **SQL Server** and the target server type to **Azure SQL Database**, select the migration scope as **Schema and data** and select **Create**.
1. In the migration project, specify the source server details such as the server name, credentials to connect to the server and the source database to migrate.
1. In the target server details, specify the Azure SQL Database server name, credentials to connect to the server and the target database to migrate to.
1. Select the schema objects and deploy them to the target Azure SQL Database.
1. Finally, select **Start data migration** and monitor the progress of migration.

For a detailed tutorial, see [Migrate on-premises SQL Server or SQL Server on Azure VMs to Azure SQL Database using the Data Migration Assistant](/sql/dma/dma-migrateonpremsqltosqldb). 


> [!NOTE]
> - Scale your database to a higher service tier and compute size during the import process to maximize import speed by providing more resources. You can then scale down after the import is successful.</br>
> - The compatibility level of the imported database is based on the compatibility level of your source database. 


### Azure Database Migration Service (DMS)

To migrate databases from SQL Server to Azure SQL Database using DMS, follow the steps below:

1. If you haven't already, register the **Microsoft.DataMigration** resource provider in your subscription. 
1. Create an Azure Database Migration Service Instance in a desired location of your choice (preferably in the same region as your target Azure SQL Database). Select an existing virtual network or create a new one to host your DMS instance.
1. After your DMS instance is created, create a new migration project and specify the source server type as **SQL Server** and the target server type as **Azure SQL Database**. Choose **Offline data migration** as the activity type in the migration project creation blade.
1. Specify the source SQL Server details on the **Migration source** details page and the target Azure SQL Database details on the **Migration target** details page.
1. Map the source and target databases for migration and then select the tables you want to migrate.
1. Review the migration summary and select **Run migration**. You can then monitor the migration activity and check the progress of your database migration.

For a detailed tutorial, see [Migrate SQL Server to an Azure SQL Database using DMS](../../../dms/tutorial-sql-server-to-azure-sql.md). 

## Data sync and cutover

When using migration options that continuously replicate / sync data changes from source to the target, the source data and schema can change and drift from the target. During data sync, ensure that all changes on the source are captured and applied to the target during the migration process. 

After you verify that data is same on both the source and the target, you can cutover from the source to the target environment. It is important to plan the cutover process with business / application teams to ensure minimal interruption during cutover does not affect business continuity. 

> [!IMPORTANT]
> For details on the specific steps associated with performing a cutover as part of migrations using DMS, see [Performing migration cutover](../../../dms/tutorial-sql-server-azure-sql-online.md#perform-migration-cutover).


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

Be sure to take advantage of the advanced cloud-based features offered by SQL Database, such as [built-in high availability](../../database/high-availability-sla.md), [threat detection](../../database/advanced-data-security.md), and [monitoring and tuning your workload](../../database/monitor-tune-overview.md). 

Some SQL Server features are only available once the [database compatibility level](/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database) is changed to the latest compatibility level (150). 

To learn more, see [managing Azure SQL Database after migration](../../database/manage-data-after-migrating-to-database.md)


## Next steps

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about SQL Database see:
	- [An Overview of Azure SQL Database](../../database/sql-database-paas-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
