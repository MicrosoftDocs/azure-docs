---
title: "Access to Azure SQL Database: Migration guide"
description: This guide teaches you to migrate your Microsoft Access databases to Azure SQL Database using SQL Server Migration Assistant for Access (SSMA for Access). 
ms.service: sql-database
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.date: 03/19/2021
---

# Migration guide: Access to Azure SQL Database

This migration guide teaches you to migrate your Microsoft Access databases to Azure SQL Database using the SQL Server Migration Assistant for Access.

For other migration guides, see [Database Migration](https://datamigration.microsoft.com/). 

## Prerequisites

To migrate your Access database to Azure SQL Database, you need:

- to verify your source environment is supported. 
- [SQL Server Migration Assistant for Access](https://www.microsoft.com/download/details.aspx?id=54255). 

## Pre-migration

After you have met the prerequisites, you are ready to discover the topology of your environment and assess the feasibility of your migration.


### Assess 

Create an assessment using [SQL Server Migration Assistant for Access](https://www.microsoft.com/download/details.aspx?id=54255). 

To create an assessment, follow these steps: 

1. Open SQL Server Migration Assistant for Access. 
1. Select **File** and then choose **New Project**. Provide a name for your migration project. 
1. Select **Add Databases** and choose databases to be added to your new project
1. In **Access Metadata Explorer**, right-click the database and then choose **Create Report**. 
1. Review the sample assessment. For example: 

### Convert schema

To convert database objects, follow these steps: 

1. Select **Connect to Azure SQL Database** and provide connection details.
1. Right-click the database in **Access Metadata Explorer** and choose **Convert schema**.  
1. (Optional) To convert an individual object, right-click the object and choose **Convert schema**. An object that has been converted appears bold in the **Access Metadata Explorer**: 
1. Select **Review results** in the Output pane, and review errors in the **Error list** pane. 


## Migrate

After you have completed assessing your databases and addressing any discrepancies, the next step is to execute the migration process. Migrating data is a bulk-load operation that moves rows of data into Azure SQL Database in transactions. The number of rows to be loaded into Azure SQL Database in each transaction is configured in the project settings.

To migrate data by using SSMA for Access, follow these steps: 

1. If you haven't already, select **Connect to Azure SQL Database** and provide connection details. 
1. Right-click the database from the **Azure SQL Database Metadata Explorer** and choose **Synchronize with Database**. This action publishes the MySQL schema to Azure SQL Database.
1. Use **Access Metadata Explorer** to check boxes next to the items you want to migrate. If you want to migrate the entire database, check the box next to the database. 
1. Right-click the database or object you want to migrate, and choose **Migrate data**. 
   To migrate data for an entire database, select the check box next to the database name. To migrate data from individual tables, expand the database, expand Tables, and then select the check box next to the table. To omit data from individual tables, clear the check box.

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

For additional detail about these issues and specific steps to mitigate them, see the [Post-migration Validation and Optimization Guide](/sql/relational-databases/post-migration-validation-and-optimization-guide).

## Migration assets 

For additional assistance with completing this migration scenario, please see the following resources, which were developed in support of a real-world migration project engagement.

| **Title/link**                                                                                                                                          | **Description**                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Data Workload Assessment Model and Tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/Data%20Workload%20Assessment%20Model%20and%20Tool) | This tool provides suggested “best fit” target platforms, cloud readiness, and application/database remediation level for a given workload. It offers simple, one-click calculation and report generation that greatly helps to accelerate large estate assessments by providing and automated and uniform target platform decision process. |


These resources were developed as part of the Data SQL Ninja Program, which is sponsored by the Azure Data Group engineering team. The core charter of the Data SQL Ninja program is to unblock and accelerate complex modernization and compete data platform migration opportunities to Microsoft's Azure Data platform. If you think your organization would be interested in participating in the Data SQL Ninja program, please contact your account team and ask them to submit a nomination.

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

