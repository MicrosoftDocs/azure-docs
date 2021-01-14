---
title: "Oracle to SQL Database: Migration guide"
description: 'Follow this guide to migrate your Oracle databases to Azure SQL Database. '
ms.service: sql-database
ms.subservice: migration
ms.custom:
ms.devlang:
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.date: 08/25/2020
---

# Migration guide: Oracle to SQL Database
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqldb.md)]

This guide teaches you to migrate your Oracle databases to Azure SQL Database using SQL Server Migration Assistant for Oracle.

For other scenarios, see the [Database Migration Guide](https://datamigration.microsoft.com/).

## Prerequisites

To migrate your Oracle database to SQL Database you need: 

- To verify your source environment is supported. 
- To download [SQL Server Migration Assistant (SSMA) for Oracle](https://www.microsoft.com/en-us/download/details.aspx?id=54258). 
- A target [Azure SQL Database](../../database/single-database-create-quickstart.md). 
 



## Preparing for database migration

As you prepare for migrating your database to the cloud, verify that your source environment is supported and that you have addressed any prerequisites. This will help to ensure an efficient and successful migration.

### Overview

This scenario describes how to migrate an Oracle instance to Azure SQL Database.

### Offline versus online migrations

When you migrate databases to Azure by using Azure Database Migration Service, you can perform an offline or an online migration. With an *offline* migration, application downtime begins when the migration starts. For an *online* migration, downtime is limited to the time required to cut over to the new environment when the migration completes. It's recommended to test an offline migration to determine whether the downtime is acceptable; if not, perform an online migration.


## Pre-migration overview

After verifying that your source environment is supported and ensuring that you have addressed any prerequisites, you are ready to start the Pre-migration stage. This part of the process involves conducting an inventory of the databases that you need to migrate, assessing those databases for potential migration issues or blockers, and then resolving any items you might have uncovered.

### Assess and Convert

After identifying the data sources, the next step is to assess the Oracle instance(s) migrating to Azure SQL Database database(s) so that you understand the gaps between the two.

By using the SQL Server Migration Assistant (SSMA) for Oracle, you can review database objects and data, assess databases for migration, migrate database objects to SQL Server, and then migrate data to SQL Server.

To use SSMA for Oracle to create an assessment, perform the following steps.

### Steps

1. **Download [SSMA](https://www.microsoft.com/en-us/download/details.aspx?id=54258)**, and then install it.

2. **Assess the source database** and discover conversion rate and effort to resolve issues.

   1. Click on the "File" menu and choose "New Project". Provide the project name, a location to save your project and the migration target.
   
   2. Select Azure SQL Database from the “Migrate To” options
   
   3. Click "OK".
   
      ![New Project](./media/oracle-to-sql-database/image1.png)
   
   4. Connect to the Oracle server by providing the connection details in the "Connect to Oracle" dialog.
   
      ![Connect to Oracle](./media/oracle-to-sql-database/image2.png)
   
   5. Create the conversion report by selecting the Oracle schema in the "Oracle Metadata Explorer" by choosing "Create Report" from the right-click menu options or the menu bar on the top.
   
      ![Create Report](./media/oracle-to-sql-database/image3.png)
   
   6. This will generate an HTML report with conversion statistics and error/ warnings, if any. Analyze this report to understand conversion issues and its cause.
   
      ![Assessment Report](./media/oracle-to-sql-database/image4.png)
   
   7. This report can also be accessed from the SSMA projects folder as selected in the first screen. From the example above locate the report.xml file from:
   
      *drive*:\Users<username>\Documents\SSMAProjects\MyOracleMigration\report\report_2016_11_12T02_47_55\
   
      and open it in Excel to get an inventory of oracle objects and the effort required to perform schema conversions.

3. **Perform schema conversion**.

   1. Before you perform schema conversion validate the default datatype mappings or change them based on requirements. You could do so either by navigating to the "Tools" menu and choosing "Project Settings" or you can change type mapping for each table by selecting the table in the "Oracle Metadata Explorer".
   
      ![Image Alt Text Type Mappings](./media/oracle-to-sql-database/image5.png)
   
   2. Dynamic or ad hoc queries can be added to the "Statements" node by selecting that node and choosing "Add Statement" from the right-click menu options.
   
   3. For converting and moving the schema to Azure SQL Database, connect to the SQL instance by providing the connection details in the "Connect to Azure SQL" dialog. You can choose to connect to an existing database or provide a new name, in which case a database will be created on the target server.
   
      ![Image Alt Text Connect to SQL](./media/oracle-to-sql-database/image6.png)
   
   4. Convert the schema by choosing "Convert Schema" from the right-click menu options or the menu bar on the top.
   
      ![Image Alt Text Convert Schema](./media/oracle-to-sql-database/image7.png)
   
   5. After the schema has converted compare and review the structure of the schema to identify potential problems.
   
      ![Image Alt Text Schema to identify](./media/oracle-to-sql-database/image8.png)

## Migration overview  

After you have the necessary prerequisites in place and have completed the tasks associated with the **Pre-migration** stage, you are ready to perform the schema and data migration.

### Migrate schema and data

After you have completed assessing your databases and addressing any discrepancies, the next step is to execute the migration process. Migration involves two steps – publishing the schema and migrating the data. SSMA for Oracle is the correct tool to use for this process.

### Steps

To use SSMA for Oracle to publish the database schema and migrate the data, perform the following steps.

1. **Publish the schema to Azure SQL Database**.

   1. After schema conversion you can save this project locally for an offline schema remediation exercise. You can do so by choosing "Save Project" from the "File" menu. This gives you an opportunity to evaluate the source and target schemas offline and perform remediation before you can publish the schema to Azure SQL Database.
   
   2. To Publish the schema, select the database from the "Databases" node in the "SQL Azure Metadata Explorer" and choose "Synchronize with Database" from the right-click menu options
   
      ![Image Alt Text Synchronize with Database](./media/oracle-to-sql-database/image9.png)
   
   3. This action will publish the Oracle schema to the Azure SQL instance.

2. **Migrate data to Azure SQL Database**.

   1. After publishing the schema to the Azure SQL instance, select the Oracle schema from the "Oracle Metadata Explorer” and choose "Migrate Data" from the right-click menu options or the menu bar on the top.
   
   2. At this step you will be required to provide connection details for Oracle and Azure SQL in their respective connection dialogs to migrate the data.
   
      ![Image Alt Text Migrate Data](./media/oracle-to-sql-database/image10.png)
   
   3. After the migration is complete you will be able to view the "Data Migration report".
   
      ![Image Alt Text Data Migration Report](./media/oracle-to-sql-database/image11.png)
   
   4. Validate the migration by reviewing the data and schema on the Azure SQL instance by using SQL Server Management Studio (SSMS).
   
      ![Image Alt Text Validate in SSMA](./media/oracle-to-sql-database/image12.png)

SSMA is not the only option for migrating data, though. You could also use SQL Server Integration Services (SSIS).

> [!NOTE]
> For complete step-by-step guidance on publishing the schema and migrating the data, see the following resources:

  - The blog posting [SQL Server Migration Assistant: How to assess and migrate data from non-Microsoft data platforms to SQL Server](https://blogs.msdn.microsoft.com/datamigration/2016/11/16/sql-server-migration-assistant-how-to-assess-and-migrate-databases-from-non-microsoft-data-platforms-to-sql-server/)

  - The article [Getting Started with SQL Server Integration Services](https://docs.microsoft.com/sql/integration-services/sql-server-integration-services)

  - The white paper [SQL Server Integration Services: SSIS for Azure and Hybrid Data Movement](https://download.microsoft.com/download/D/2/0/D20E1C5F-72EA-4505-9F26-FEF9550EFD44/SSIS%20Hybrid%20and%20Azure.docx)

> [!NOTE]
> If you are interested in participating in a Private preview of online migrations for Oracle to Azure SQL Database (or to Azure SQL Database Managed Instance) using the Azure Database Migration Service, submit a nomination on the Azure Database Migration Service [preview site](https://aka.ms/dms-preview).

### Data sync and Cutover

With minimal-downtime migrations, the source you are migrating continues to change, drifting from the target in terms of data and schema, after the one-time migration occurs. During the **Data sync** phase, you need to ensure that all changes in the source are captured and applied to the target in near real time. After you verify that all changes in source have been applied to the target, you can cutover from the source to the target environment.

The Azure Database Migration Service does not yet support minimal-downtime migrations for this scenario, so the **Data sync** and **Cutover** phases are not currently applicable.

## Post-migration overview

After you have successfully completed the **Migration** stage, you need to go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications.

### Perform tests

The test approach for database migration consists of performing the following activities:

1.  **Develop validation tests**. To test database migration, you need to use SQL queries. You must create the validation queries to run against both the source and the target databases. Your validation queries should cover the scope you have defined.

2.  **Set up test environment**. The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.

3.  **Run validation tests**. Run the validation tests against the source and the target, and then analyze the results.

4.  **Run performance tests**. Run performance test against the source and the target, and then analyze and compare the results.

> [!NOTE]
> For assistance with developing and running post-migration validation tests, consider the Data Quality Solution available from the partner [QuerySurge](http://www.querysurge.com/company/partners/microsoft).

### Optimize

The post-migration phase is crucial for reconciling any data accuracy issues and verifying completeness, as well as addressing performance issues with the workload.

> [!NOTE]
> For additional detail about these issues and specific steps to mitigate them, see the [Post-migration Validation and Optimization Guide](https://docs.microsoft.com/sql/relational-databases/post-migration-validation-and-optimization-guide).


## Migration assets 

For additional assistance with completing this migration scenario, please see the following resources, which were developed in support of a real-world migration project engagement.

| **Title/link**                                                                                                                                          | **Description**                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Data Workload Assessment Model and Tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/Data%20Workload%20Assessment%20Model%20and%20Tool) | This tool provides suggested “best fit” target platforms, cloud readiness, and application/database remediation level for a given workload. It offers simple, one-click calculation and report generation that greatly helps to accelerate large estate assessments by providing and automated and uniform target platform decision process.                                                          |
| [Oracle Inventory Script Artifacts](https://github.com/Microsoft/DataMigrationTeam/tree/master/Oracle%20Inventory%20Script%20Artifacts)                 | This asset includes a PL/SQL query that hits Oracle system tables and provides a count of objects by schema type, object type, and status. It also provides a rough estimate of ‘Raw Data’ in each schema and the sizing of tables in each schema, with results stored in a CSV format.                                                                                                               |
| [SSMA Assessment Tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/SSMA%20Assessment%20Tool)                                             | This set of resource uses a .csv file as entry (sources.csv in the project folders) to produce the xml files that are needed to run SSMA assessment in console mode. The source.csv is provided by the customer based on an inventory of existing Oracle instances. The output files are **AssessmentReportGeneration_source_1.xml**, **ServersConnectionFile.xml**, and **VariableValueFile.xml**. |
| [SSMA for Oracle Common Errors and how to fix them](https://aka.ms/dmj-wp-ssma-oracle-errors)                                                           | With Oracle, you can assign a non-scalar condition in the WHERE clause. However, SQL Server doesn’t support this type of condition. As a result, SQL Server Migration Assistant (SSMA) for Oracle doesn’t convert queries with a non-scalar condition in the WHERE clause, instead generating an error O2SS0001. This white paper provides more details on the issue and ways to resolve it.          |
| [Steps to Run SSMA for Oracle](https://aka.ms/dmj-wp-ssma-oracle-steps)                                                                                 | This document is designed as a Quick Start Guide for migrating the schema and data from Oracle to Azure SQL Database by using SSMA for Oracle v7.6.0.                                                                                                                                                                                                                                                 |
| [Steps to Run Attunity Replicate for Microsoft Migrations](https://aka.ms/dmj-wp-attunity)                                                              | This document is designed as a Quick Start Guide for migrating the schema and data from Oracle to Azure SQL Database by using Attunity Replicate for Microsoft Migrations tool.                                                                                                                                                                                                                       |
| [Setting up Oracle 12c Enterprise and Getting It Working by Using the Azure Marketplace Template](https://aka.ms/dmj-wp-oracle12c-linux)                | This white paper provides a step-by-step walkthrough of setting up and implementing Oracle 12c Enterprise by using the Azure Marketplace Template.                                                                                                                                                                                                                                                    |

> [!NOTE]
> These resources were developed as part of the Data Migration Jumpstart Program (DM Jumpstart), which is sponsored by the Azure Data Group engineering team. The core charter DM Jumpstart is to unblock and accelerate complex modernization and compete data platform migration opportunities to Microsoft’s Azure Data platform. If you think your organization would be interested in participating in the DM Jumpstart program, please contact your account team and ask that they submit a nomination.

### Additional resources

  - Be sure to check out the [Azure Total Cost of Ownership (TCO) Calculator](https://aka.ms/azure-tco) to help estimate the cost savings you can realize by migrating your workloads to Azure.

  - For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see the article [Service and tools for data migration](https://docs.microsoft.com/azure/dms/dms-tools-matrix).

### Videos

  - For an overview of the Azure Database Migration Guide and the information it contains, see the video [How to Use the Database Migration Guide](https://azure.microsoft.com/resources/videos/how-to-use-the-azure-database-migration-guide/).

  - For a walk through of the phases of the migration process and detail about the specific tools and services recommended to perform assessment and migration, see the video [Overview of the migration journey and the tools/services recommended for performing assessment and migration](https://azure.microsoft.com/resources/videos/overview-of-migration-and-recommended-tools-services/).
