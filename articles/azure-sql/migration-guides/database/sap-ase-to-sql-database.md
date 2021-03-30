---
title: "SAP ASE to Azure SQL Database: Migration guide"
description: This guide teaches you to migrate your SAP ASE databases to Azure SQL Database using SQL Server Migration Assistant for SAP Adapter Server Enterprise.
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

This guide teaches you to migrate your SAP ASE databases to Azure SQL Database using SQL Server Migration Assistant for SAP Adapter Server Enterprise.

For other migration guides, see [Database Migration](https://docs.microsoft.com/data-migration). 

## Prerequisites 

To migrate your SAP SE database to Azure SQL Database, you need:

- to verify your source environment is supported. 
- [SQL Server Migration Assistant for SAP Adaptive Server Enterprise (formerly SAP Sybase ASE)](https://www.microsoft.com/en-us/download/details.aspx?id=54256). 
- Connectivity and sufficient permissions to access both source and target. 


## Pre-migration

After you have met the prerequisites, you are ready to discover the topology of your environment and assess the feasibility of your migration.

### Assess

Use [SQL Server Migration Assistant (SSMA) for SAP Adaptive Server Enterprise (formally SAP Sybase ASE)](https://www.microsoft.com/en-us/download/details.aspx?id=54256) to review database objects and data, assess databases for migration, migrate Sybase database objects to Azure SQL Database, and then migrate data to Azure SQL Database. To learn more, see [SQL Server Migration Assistant for Sybase (SybaseToSQL)](/sql/ssma/sybase/sql-server-migration-assistant-for-sybase-sybasetosql).

To create an assessment, follow these steps: 

1. Open **SSMA for Sybase**. 
1. Select **File** and then choose **New Project**. 
1. Provide a project name, a location to save your project, and then select Azure SQL Database as the migration target from the drop-down. Select **OK**.
1. Enter in values for SAP connection details on the **Connect to Sybase** dialog box. 
1. Right-click the SAP database you want to migrate, and then choose **Create report**. This generates an HTML report. Alternatively, you can choose **Create report** from the navigation bar after selecting the database:
1. Review the HTML report to understand conversion statistics and any errors or warnings. You can also open the report in Excel to get an inventory of SAP ASE objects and the effort required to perform schema conversions. The default location for the report is in the report folder within SSMAProjects.

   For example: `drive:\<username>\Documents\SSMAProjects\MySAPMigration\report\report_<date>`. 


### Validate type mappings

Before you perform schema conversion validate the default datatype mappings or change them based on requirements. You could do so either by navigating to the **Tools** menu and choosing **Project Settings** or you can change type mapping for each table by selecting the table in the **SAP ASE Metadata Explorer**.


### Convert schema

To convert the schema, follow these steps:

1. (Optional) To convert dynamic or ad-hoc queries, right-click the node, and choose **Add Statement**. 
1. Select **Connect to Azure SQL Database** in the top-line navigation bar and provide Azure SQL Database details. You can choose to connect to an existing database or provide a new name, in which case a database will be created on the target server.
1. Right-click the SAP ASE schema in **Sybase Metadata Explorer** and choose **Convert schema**. Alternatively, you can select **Convert schema** from the top-line navigation bar. 
1. Compare and review the structure of the schema to identify potential problems. 

   After schema conversion you can save this project locally for an offline schema remediation exercise. Select **Save Project** from the **File** menu. This gives you an opportunity to evaluate the source and target schemas offline and perform remediation before you can publish the schema to Azure SQL Database.

1. Select **Review results** in the Output pane, and review errors in the **Error list** pane. 
1. Save the project locally for an offline schema remediation exercise. Select **Save Project** from the **File** menu. This gives you an opportunity to evaluate the source and target schemas offline and perform remediation before you can publish the schema to SQL Database.

## Migrate 

After you have the necessary prerequisites in place and have completed the tasks associated with the **Pre-migration** stage, you are ready to perform the schema and data migration.

To publish your schema and migrate the data, follow these steps: 

1. Publish the schema: Right-click the database in **Azure SQL Database Metadata Explorer** and choose **Synchronize with Database**.  This action publishes the SAP ASE schema to the Azure SQL Database instance.
1. Migrate the data: Right-click the database or object you want to migrate in **SAP ASE Metadata Explorer**, and choose **Migrate data**. Alternatively, you can select **Migrate Data** from the top-line navigation bar. To migrate data for an entire database, select the check box next to the database name. To migrate data from individual tables, expand the database, expand Tables, and then select the check box next to the table. To omit data from individual tables, clear the check box: 
1. After migration completes, view the **Data Migration Report**: 
1. Connect to your Azure SQL Database by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) and validate the migration by reviewing the data and schema. 


## Post-migration 

After you have successfully completed the **Migration** stage, you need to go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications.

### Perform tests

The test approach for database migration consists of performing the following activities:

1. **Develop validation tests**. To test database migration, you need to use SQL queries. You must create the validation queries to run against both the source and the target databases. Your validation queries should cover the scope you have defined.

2. **Set up test environment**. The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.

3. **Run validation tests**. Run the validation tests against the source and the target, and then analyze the results.

4. **Run performance tests**. Run performance test against the source and the target, and then analyze and compare the results.

### Optimize

The post-migration phase is crucial for reconciling any data accuracy issues and verifying completeness, as well as addressing performance issues with the workload.

> [!NOTE]
> For additional detail about these issues and specific steps to mitigate them, see the [Post-migration Validation and Optimization Guide](/sql/relational-databases/post-migration-validation-and-optimization-guide).


## Next steps

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Database see:
   - [An overview of SQL Database](../../database/sql-database-paas-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
