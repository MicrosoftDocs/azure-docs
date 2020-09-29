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
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqlmi.md)]

This guide helps you migrate your SQL Server instance to Azure SQL Database. 

You can migrate SQL Server running on-premises or on: 

- SQL Server on Virtual Machines  
- Amazon Web Services (AWS) EC2 
- Amazon Relational Database Service (AWS RDS) 
- Compute Engine (Google Cloud Platform - GCP)  
- Cloud SQL for SQL Server (Google Cloud Platform – GCP) 

For more migration information, see the [migration overview](sql-server-to-database-overview.md). For other scenarios, see the [Database Migration Guide](https://datamigration.microsoft.com/).

:::image type="content" source="media/sql-server-to-database-overview/migration-process-flow.png" alt-text="Migration process flow":::

## Prerequisites 

To migrate your SQL Server to Azure SQL Managed Instance, make sure: 

- You've chosen a [migration method](sql-server-to-database-overview.md#migration-options). 
- You've created a [performance baseline](sql-server-to-database-performance-baseline.md), if necessary. 


## Pre-migration

After you've verified that your source environment is supported, start with the pre-migration stage. Discover all of the existing data sources, assess migration feasibility, and identify any blocking issues that might prevent your migration. 

### Discover

In the Discover phase, scan the network to identify all SQL Server instances and features used by your organization. 

Use [Azure Migrate](../../../migrate/migrate-services-overview.md) to assesses migration suitability of on-premises servers, perform performance-based sizing, and provide cost estimations for running them in Azure. 

Alternatively, use the [Microsoft Assessment and Planning Toolkit (the "MAP Toolkit")](https://www.microsoft.com/download/details.aspx?id=7826) to assess your current IT infrastructure. The toolkit provides a powerful inventory, assessment, and reporting tool to simplify the migration planning process. 

For more information about tools available to use for the Discover phase, see [Services and tools available for data migration scenarios](../../../dms/dms-tools-matrix.md). 

### Assess 

After data sources have been discovered, assess any on-premises SQL Server instance(s) that can be migrated to Azure SQL Database to identify migration blockers or compatibility issues. 

You can use the Data Migration Assistant (version 4.1 and later) to assess databases to get: 

- [Azure target recommendations](/sql/dma/dma-assess-sql-data-estate-to-sqldb)
- [Azure SKU recommendations](/sql/dma/dma-sku-recommend-sql-db)

To assess your environment using the Database Migration Assessment, follow these steps: 

1. Open the [Data Migration Assistant (DMA)](https://www.microsoft.com/en-us/download/details.aspx?id=53595). 
1. Select **File** and then choose **New assessment**. 
1. Specify a project name, select SQL Server as the source server type, and then select Azure SQL Database as the target server type. 
1. Select the type(s) of assessment reports that you want to generate. For example, database compatibility and feature parity. 
    - The **feature parity** category provides a comprehensive set of recommendations, alternatives available in Azure, and mitigating steps to help you plan your migration project. 
    - The **compatibility issues** category identifies partially supported or unsupported feature compatibility issues that might block migration as well as recommendations to address them. 
1. Specify the source connection details for your SQL Server and connect to the source database.
1. Select **Start assessment**. 
1. When the process is complete, select and review the assessment reports for migration blocking and feature parity issues. The assessment report can also be exported to a file that can be shared with other teams or personnel in your organization. 
1. Determine the database compatibility level that minimizes post-migration efforts.  
1. Identify the best Azure SQL Database SKU for your on-premises workload. 

To learn more, see [Perform a SQL Server migration assessment with Data Migration Assistant](/sql/dma/dma-assesssqlonprem).


### Create a performance baseline

If you need to compare the performance of your workload on a SQL Database with your original workload running on SQL Server, create a performance baseline to use for comparison. See [performance baseline](sql-server-to-managed-instance-performance-baseline.md) to learn more. 

### Create SQL Managed Instance 

Based on the information in the discover and assess phase, create your target SQL Database. You can do so by using the [Azure portal](../../managed-instance/instance-create-quickstart.md), [PowerShell](../../managed-instance/scripts/create-configure-managed-instance-powershell.md), or an [ARM Template](/../../managed-instance/create-template-quickstart.md). 


## Migrate

After you have completed tasks associated with the Pre-migration stage, you are ready to perform the schema and data migration. 

Migrate your data using your chosen [migration method](sql-server-to-database-overview.md#migration-options). 


## Data sync and cutover

During offline migrations, the data on the source and target is static so skip data sync for these scenarios. 

However, when using online migration options (DMS, transactional replication, etc.), the source data and schema continues to change and drift from the target. During data sync, ensure that all changes on the source are captured and applied to the target during the online migration process. 

After you verify that data is the same at both source and target, you can cutover from the source to the target environment. It is important to plan the cutover process with business / application teams to ensure minimal interruption during cutover does not affect business continuity. 

> [!IMPORTANT]
> For details on the specific steps associated with performing a cutover as part of online migrations using DMS, see [Performing migration cutover](../../../dms/tutorial-sql-server-managed-instance-online.md#performing-migration-cutover).


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


## Next steps

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Database see:


   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
