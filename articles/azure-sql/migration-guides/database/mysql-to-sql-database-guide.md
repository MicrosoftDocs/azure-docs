---
title: "MySQL to Azure SQL Database:  Migration guide"
description: In this guide, you learn how to migrate your MySQL databases to Azure SQL Database by using SQL Server Migration Assistant for MySQL (SSMA for MySQL). 
ms.service: sql-database
ms.subservice: migration-guide
ms.custom:
ms.devlang:
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.date: 03/19/2021
---

# Migration guide: MySQL to Azure SQL Database
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqldb.md)]

In this guide, you learn how to migrate your MySQL database to Azure SQL Database by using SQL Server Migration Assistant for MySQL (SSMA for MySQL). 

For other migration guides, see [Azure Database Migration Guide](https://docs.microsoft.com/data-migration). 

## Prerequisites

Before you begin migrating your MySQL database to Azure SQL Database, do the following:

- Verify that your source environment is supported. Currently, MySQL 5.6 and 5.7 are supported. 
- Download and install [SQL Server Migration Assistant for MySQL](https://www.microsoft.com/download/details.aspx?id=54257).
- Ensure that you have connectivity and sufficient permissions to access both the source and the target.

## Pre-migration 

After you've met the prerequisites, you're ready to discover the topology of your environment and assess the feasibility of your migration.

### Assess 

Use SQL Server Migration Assistant (SSMA) for MySQL to review database objects and data, and assess databases for migration. 

To create an assessment, do the following:

1. Open [SSMA for MySQL](https://www.microsoft.com/download/details.aspx?id=54257). 
1. Select **File**, and then select **New Project**. 
1. In the **New Project** pane, enter a name and location for your project and then, in the **Migrate To** drop-down list, select **Azure SQL Database**. 
1. Select **OK**.

   ![Screenshot of the "New Project" pane for entering your migration project name, location, and target.](./media/mysql-to-sql-database-guide/new-project.png)

1. Select the **Connect to MySQL** tab, and then provide details for connecting your MySQL server. 

   ![Screenshot of the "Connect to MySQL" pane for specifying connections to the source.](./media/mysql-to-sql-database-guide/connect-to-mysql.png)

1. On the **MySQL Metadata Explorer** pane, right-click the MySQL schema, and then select **Create Report**. Alternatively, you can select the **Create Report** tab at the upper right.

   ![Screenshot of the "Create Report" links in SSMA for MySQL.](./media/mysql-to-sql-database-guide/create-report.png)

1. Review the HTML report to understand the conversion statistics, errors, and warnings. Analyze it to understand the conversion issues and resolutions. 
   You can also open the report in Excel to get an inventory of MySQL objects and understand the effort that's required to perform schema conversions. The default location for the report is in the report folder within SSMAProjects. For example: 
   
   `drive:\Users\<username>\Documents\SSMAProjects\MySQLMigration\report\report_2016_11_12T02_47_55\`
 
   ![Screenshot of an example conversion report in SSMA.](./media/mysql-to-sql-database-guide/conversion-report.png)

### Validate the data types

Validate the default data type mappings and change them based on requirements, if necessary. To do so: 

1. Select **Tools**, and then select **Project Settings**.  
1. Select the **Type Mappings** tab. 

   ![Screenshot of the "Type Mapping" pane in SSMA for MySQL.](./media/mysql-to-sql-database-guide/type-mappings.png)

1. You can change the type mapping for each table by selecting the table name on the **MySQL Metadata Explorer** pane. 

### Convert the schema 

To convert the schema, do the following: 

1. (Optional) To convert dynamic or specialized queries, right-click the node, and then select **Add statement**. 

1. Select the **Connect to Azure SQL Database** tab, and then do the following:

   a. Enter the details for connecting your database in Azure SQL Database.  
   b. In the drop-down list, select your target SQL Database. Or you can provide a new name, in which case a database will be created on the target server.  
   c. Provide authentication details.  
   d. Select **Connect**.

   ![Screenshot of the "Connect to Azure SQL Database" pane in SSMA for MySQL.](./media/mysql-to-sql-database-guide/connect-to-sqldb.png)
 
1. Right-click the schema you're working with, and then select **Convert Schema**. Alternatively, you can select the **Convert schema** tab at the upper right.

   ![Screenshot of the "Convert Schema" command on the "MySQL Metadata Explorer" pane.](./media/mysql-to-sql-database-guide/convert-schema.png)

1. After the conversion is completed, review and compare the converted objects to the original objects to identify potential problems and address them based on the recommendations. 

   ![Screenshot showing a comparison of the converted objects to the original objects.](./media/mysql-to-sql-database-guide/table-comparison.png)

   Compare the converted Transact-SQL text to the original code, and review the recommendations.

   ![Screenshot showing a comparison of converted queries to the source code.](./media/mysql-to-sql-database-guide/procedure-comparison.png)

1. On the **Output** pane, select **Review results**, and then review any errors on the **Error list** pane. 
1. Save the project locally for an offline schema remediation exercise. To do so, select **File** > **Save Project**. This gives you an opportunity to evaluate the source and target schemas offline and perform remediation before you publish the schema to SQL Database.

   Compare the converted procedures to the original procedures, as shown here: 

   ![Screenshot showing a comparison of the converted procedures to the original procedures.](./media/mysql-to-sql-database-guide/procedure-comparison.png)


## Migrate the databases 

After you've assessed your databases and addressed any discrepancies, you can run the migration process. Migration involves two steps: publishing the schema and migrating the data. 

To publish the schema and migrate the data, do the following: 

1. Publish the schema. On the **Azure SQL Database Metadata Explorer** pane, right-click the database, and then select **Synchronize with Database**. This action publishes the MySQL schema to Azure SQL Database.

   ![Screenshot of the "Synchronize with the Database" pane for reviewing database mapping.](./media/mysql-to-sql-database-guide/synchronize-database-review.png)

1. Migrate the data. On the **MySQL Metadata Explorer** pane, right-click the MySQL schema you want to migrate, and then select **Migrate Data**. Alternatively, you can select the **Migrate Data** tab at the upper right.

   To migrate data for an entire database, select the check box next to the database name. To migrate data from individual tables, expand the database, expand **Tables**, and then select the check box next to the table. To omit data from individual tables, clear the check box.

   ![Screenshot of the "Migrate Data" command on the "MySQL Metadata Explorer" pane.](./media/mysql-to-sql-database-guide/migrate-data.png)

1. After the migration is completed, view the **Data Migration Report**.
   
   ![Screenshot of the Data Migration Report.](./media/mysql-to-sql-database-guide/data-migration-report.png)

1. Connect to your Azure SQL Database by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) and validate the migration by reviewing the data and schema.

   ![Screenshot of SQL Server Management Studio.](./media/mysql-to-sql-database-guide/validate-in-ssms.png)

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

For more information about these issues and the steps to mitigate them, see the [Post-migration validation and optimization guide](/sql/relational-databases/post-migration-validation-and-optimization-guide).

## Migration assets

For more assistance with completing this migration scenario, see the following resource. It was developed in support of a real-world migration project engagement.

| Title | Description |
| --- | --- |
| [Data workload assessment model and tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/Data%20Workload%20Assessment%20Model%20and%20Tool) | Provides suggested “best fit” target platforms, cloud readiness, and application/database remediation levels for specified workloads. It offers simple, one-click calculation and report generation that helps to accelerate large estate assessments by providing an automated, uniform target-platform decision process. |

This resource was developed as part of the Data SQL Ninja Program, which is sponsored by the Azure Data Group engineering team. The core charter of the Data SQL Ninja program is to unblock and accelerate complex modernization and compete data platform migration opportunities to the Microsoft Azure Data platform. If you think your organization would be interested in participating in the Data SQL Ninja program, contact your account team and ask them to submit a nomination.

## Next steps 

- To help estimate the cost savings you can realize by migrating your workloads to Azure, see the [Azure total cost of ownership calculator](https://aka.ms/azure-tco).

- For a matrix of Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios and specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- For other migration guides, see [Azure Database Migration Guide](https://datamigration.microsoft.com/). 

- For migration videos, see [Overview of the migration journey and recommended migration and assessment tools and services](https://azure.microsoft.com/resources/videos/overview-of-migration-and-recommended-tools-services/).
