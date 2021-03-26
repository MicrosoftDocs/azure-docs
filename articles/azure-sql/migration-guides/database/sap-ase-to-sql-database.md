---
title: "SAP ASE to Azure SQL Database: Migration guide"
description: In this guide you learn how to migrate your SAP ASE databases to Azure SQL Database by using SQL Server Migration Assistant for SAP Adapter Server Enterprise.
ms.service: sql-database
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.date: 03/19/2021
---

# Migration guide: SAP ASE to Azure SQL Database

[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqldb.md)]

In this guide, you learn how to migrate your SAP Adapter Server Enterprise (ASE) databases to Azure SQL Database by using SQL Server Migration Assistant for SAP Adapter Server Enterprise.

For other migration guides, see [Azure Database Migration Guide](https://docs.microsoft.com/data-migration). 

## Prerequisites 

Before you begin migrating your SAP SE database to Azure SQL Database, do the following:

- Verify that your source environment is supported. 
- Download and install [SQL Server Migration Assistant for SAP Adaptive Server Enterprise (formerly SAP Sybase ASE)](https://www.microsoft.com/en-us/download/details.aspx?id=54256).
- Ensure that you have connectivity and sufficient permissions to access both source and target.

## Pre-migration

After you've met the prerequisites, you're ready to discover the topology of your environment and assess the feasibility of your migration.

### Assess

By using [SQL Server Migration Assistant (SSMA) for SAP Adaptive Server Enterprise (formally SAP Sybase ASE)](https://www.microsoft.com/en-us/download/details.aspx?id=54256), you can review database objects and data, assess databases for migration, migrate Sybase database objects to Azure SQL Database, and then migrate data to Azure SQL Database. To learn more, see [SQL Server Migration Assistant for Sybase (SybaseToSQL)](/sql/ssma/sybase/sql-server-migration-assistant-for-sybase-sybasetosql).

To create an assessment, do the following: 

1. Open SSMA for Sybase. 
1. Select **File**, and then select **New Project**. 
1. In the **New Project** pane, enter a name and location for your project and then, in the **Migrate To** drop-down list, select **Azure SQL Database**. 
1. Select **OK**.
1. On the **Connect to Sybase** pane, enter the SAP connection details. 
1. Right-click the SAP database you want to migrate, and then select **Create report**. This generates an HTML report. Alternatively, you can select the **Create report** tab at the upper right.
1. Review the HTML report to understand the conversion statistics and any errors or warnings. You can also open the report in Excel to get an inventory of SAP ASE objects and the effort that's required to perform schema conversions. The default location for the report is in the report folder within SSMAProjects. For example:

   `drive:\<username>\Documents\SSMAProjects\MySAPMigration\report\report_<date>` 

### Validate the type mappings

Before you perform schema conversion, validate the default data-type mappings or change them based on requirements. You can do so by selecting **Tools** > **Project Settings**, or you can change the type mapping for each table by selecting the table in the **SAP ASE Metadata Explorer**.

### Convert the schema

To convert the schema, do the following:

1. (Optional) To convert dynamic or specialized queries, right-click the node, and then select **Add statement**. 
1. Select the **Connect to Azure SQL Database** tab, and then enter the Azure SQL Database details. You can choose to connect to an existing database or provide a new name, in which case a database will be created on the target server.
1. On the **Sybase Metadata Explorer** pane, right-click the SAP ASE schema you're working with, and then select **Convert Schema**. 
1. After the schema has been converted, compare and review the converted structure to the original structure identify potential problems. 

   After the schema conversion, you can save this project locally for an offline schema remediation exercise. To do so, select **File** > **Save Project**. This gives you an opportunity to evaluate the source and target schemas offline and perform remediation before you publish the schema to Azure SQL Database.

1. On the **Output** pane, select **Review results**, and review any errors in the **Error list** pane. 
1. Save the project locally for an offline schema remediation exercise. To do so, select **File** > **Save Project**. This gives you an opportunity to evaluate the source and target schemas offline and perform remediation before you publish the schema to SQL Database.

## Migrate the databases 

After you have the necessary prerequisites in place and have completed the tasks associated with the *pre-migration* stage, you're ready to run the schema and data migration.

To publish the schema and migrate the data, do the following: 

1. Publish the schema. On the **Azure SQL Database Metadata Explorer** pane, right-click the database, and then select **Synchronize with Database**. This action publishes the SAP ASE schema to the Azure SQL Database instance.

1. Migrate the data. On the **SAP ASE Metadata Explorer** pane, right-click the SAP ASE database or object you want to migrate, and then select **Migrate Data**. Alternatively, you can select the **Migrate Data** tab at the upper right. 

   To migrate data for an entire database, select the check box next to the database name. To migrate data from individual tables, expand the database, expand **Tables**, and then select the check box next to the table. To omit data from individual tables, clear the check box. 
1. After the migration is completed, view the **Data Migration Report**. 
1. Validate the migration by reviewing the data and schema. To do so, connect to your Azure SQL Database by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).

## Post-migration 

After you've successfully completed the *migration* stage, you need to complete a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications.

### Perform tests

The test approach to database migration consists of the following activities:

1. **Develop validation tests**: To test the database migration, you need to use SQL queries. You must create the validation queries to run against both the source and target databases. Your validation queries should cover the scope you've defined.

1. **Set up a test environment**: The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.

1. **Run validation tests**: Run validation tests against the source and the target, and then analyze the results.

1. **Run performance tests**: Run performance tests against the source and the target, and then analyze and compare the results.


### Optimize

The post-migration phase is crucial for reconciling any data accuracy issues, verifying completeness, and addressing performance issues with the workload.

For more information about these issues and the steps to mitigate them, see the [Post-migration validation and optimization guide](/sql/relational-databases/post-migration-validation-and-optimization-guide).


## Next steps

- For a matrix of Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios and specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Database, see:
   - [An overview of SQL Database](../../database/sql-database-paas-overview.md)
   - [Azure total cost of ownership calculator](https://azure.microsoft.com/pricing/tco/calculator/)  

- To learn more about the framework and adoption cycle for cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads for migration to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- To assess the application access layer, see [Data Access Migration Toolkit (preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit).
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).