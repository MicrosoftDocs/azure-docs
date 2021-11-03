---
title: "Db2 to Azure SQL Database: Migration guide"
description: This guide teaches you to migrate your IMB Db2 databases to Azure SQL Database, by using the SQL Server Migration Assistant for Db2 (SSMA for Db2). 
ms.service: sql-database
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: mokabiru
ms.author: mokabiru
ms.reviewer: cawrites
ms.date: 05/14/2021
---
# Migration guide: IBM Db2 to Azure SQL Database
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqldb.md)]

In this guide, you learn [how to migrate](https://azure.microsoft.com/migration/migration-journey) your IBM Db2 databases to Azure SQL Database, by using [SQL Server Migration](https://azure.microsoft.com/migration/sql-server/) Assistant for Db2. 

For other migration guides, see [Azure Database Migration Guides](/data-migration). 

## Prerequisites 

To migrate your Db2 database to SQL Database, you need:

- To verify that your [source environment is supported](/sql/ssma/db2/installing-ssma-for-db2-client-db2tosql#prerequisites).
- To download [SQL Server Migration Assistant (SSMA) for Db2](https://www.microsoft.com/download/details.aspx?id=54254).
- A target database in [Azure SQL Database](../../database/single-database-create-quickstart.md).
- Connectivity and sufficient permissions to access both source and target. 

## Pre-migration

After you have met the prerequisites, you're ready to discover the topology of your environment and assess the feasibility of your [Azure cloud migration](https://azure.microsoft.com/migration).

### Assess and convert

Use SSMA for DB2 to review database objects and data, and assess databases for migration. 

To create an assessment, follow these steps:

1. Open [SSMA for Db2](https://www.microsoft.com/download/details.aspx?id=54254). 
1. Select **File** > **New Project**. 
1. Provide a project name and a location to save your project. Then select Azure SQL Database as the migration target from the drop-down list, and select **OK**.

   :::image type="content" source="media/db2-to-sql-database-guide/new-project.png" alt-text="Screenshot that shows project details to specify.":::


1. On **Connect to Db2**, enter values for the Db2 connection details. 

   :::image type="content" source="media/db2-to-sql-database-guide/connect-to-db2.png" alt-text="Screenshot that shows options to connect to your Db2 instance.":::


1. Right-click the Db2 schema you want to migrate, and then choose **Create report**. This will generate an HTML report. Alternatively, you can choose **Create report** from the navigation bar after selecting the schema.

   :::image type="content" source="media/db2-to-sql-database-guide/create-report.png" alt-text="Screenshot that shows how to create a report.":::

1. Review the HTML report to understand conversion statistics and any errors or warnings. You can also open the report in Excel to get an inventory of Db2 objects and the effort required to perform schema conversions. The default location for the report is in the report folder within *SSMAProjects*.

   For example: `drive:\<username>\Documents\SSMAProjects\MyDb2Migration\report\report_<date>`. 

   :::image type="content" source="media/db2-to-sql-database-guide/report.png" alt-text="Screenshot of the report that you review to identify any errors or warnings.":::


### Validate data types

Validate the default data type mappings, and change them based on requirements if necessary. To do so, follow these steps: 

1. Select **Tools** from the menu. 
1. Select **Project Settings**. 
1. Select the **Type mappings** tab.

   :::image type="content" source="media/db2-to-sql-database-guide/type-mapping.png" alt-text="Screenshot that shows selecting the schema and type mapping.":::

1. You can change the type mapping for each table by selecting the table in the **Db2 Metadata Explorer**. 

### Convert schema

To convert the schema, follow these steps:

1. (Optional) Add dynamic or ad-hoc queries to statements. Right-click the node, and then choose **Add statements**. 
1. Select **Connect to Azure SQL Database**. 
    1. Enter connection details to connect your database in Azure SQL Database.
    1. Choose your target SQL Database from the drop-down list, or provide a new name, in which case a database will be created on the target server. 
    1. Provide authentication details. 
    1. Select **Connect**.

   :::image type="content" source="media/db2-to-sql-database-guide/connect-to-sql-database.png" alt-text="Screenshot that shows the details needed to connect to the logical server in Azure.":::


1. Right-click the schema, and then choose **Convert Schema**. Alternatively, you can choose **Convert Schema** from the top navigation bar after selecting your schema.

   :::image type="content" source="media/db2-to-sql-database-guide/convert-schema.png" alt-text="Screenshot that shows selecting the schema and converting it.":::

1. After the conversion completes, compare and review the structure of the schema to identify potential problems. Address the problems based on the recommendations.

   :::image type="content" source="media/db2-to-sql-database-guide/compare-review-schema-structure.png" alt-text="Screenshot that shows comparing and reviewing the structure of the schema to identify potential problems.":::

1. In the **Output** pane, select **Review results**. In the **Error list** pane, review errors. 
1. Save the project locally for an offline schema remediation exercise. From the **File** menu, select **Save Project**. This gives you an opportunity to evaluate the source and target schemas offline, and perform remediation before you can publish the schema to SQL Database.

## Migrate

After you have completed assessing your databases and addressing any discrepancies, the next step is to execute the migration process.

To publish your schema and migrate your data, follow these steps:

1. Publish the schema. In **Azure SQL Database Metadata Explorer**, from the **Databases** node, right-click the database. Then select **Synchronize with Database**.

   :::image type="content" source="media/db2-to-sql-database-guide/synchronize-with-database.png" alt-text="Screenshot that shows the option to synchronize with database.":::

1. Migrate the data. Right-click the database or object you want to migrate in **Db2 Metadata Explorer**, and choose **Migrate data**. Alternatively, you can select **Migrate Data** from the navigation bar. To migrate data for an entire database, select the check box next to the database name. To migrate data from individual tables, expand the database, expand **Tables**, and then select the check box next to the table. To omit data from individual tables, clear the check box.

   :::image type="content" source="media/db2-to-sql-database-guide/migrate-data.png" alt-text="Screenshot that shows selecting the schema and choosing to migrate data.":::

1. Provide connection details for both Db2 and Azure SQL Database. 
1. After migration completes, view the **Data Migration Report**.  

   :::image type="content" source="media/db2-to-sql-database-guide/data-migration-report.png" alt-text="Screenshot that shows where to review the data migration report.":::

1. Connect to your database in Azure SQL Database by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms). Validate the migration by reviewing the data and schema.

   :::image type="content" source="media/db2-to-sql-database-guide/compare-schema-in-ssms.png" alt-text="Screenshot that shows comparing the schema in SQL Server Management Studio.":::

## Post-migration 

After the migration is complete, you need to go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications 

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications.

### Perform tests

Testing consists of the following activities:

1. **Develop validation tests**: To test database migration, you need to use SQL queries. You must create the validation queries to run against both the source and the target databases. Your validation queries should cover the scope you have defined.
1. **Set up the test environment**: The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.
1. **Run validation tests**: Run the validation tests against the source and the target, and then analyze the results.
1. **Run performance tests**: Run performance tests against the source and the target, and then analyze and compare the results.

## Advanced features 

Be sure to take advantage of the advanced cloud-based features offered by SQL Database, such as [built-in high availability](../../database/high-availability-sla.md), [threat detection](../../database/azure-defender-for-sql.md), and [monitoring and tuning your workload](../../database/monitor-tune-overview.md). 

Some SQL Server features are only available when the [database compatibility level](/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database) is changed to the latest compatibility level. 

## Migration assets 

For additional assistance, see the following resources, which were developed in support of a real-world migration project engagement:

|Asset  |Description  |
|---------|---------|
|[Data workload assessment model and tool](https://www.microsoft.com/download/details.aspx?id=103130)| This tool provides suggested "best fit" target platforms, cloud readiness, and application/database remediation level for a given workload. It offers simple, one-click calculation and report generation that helps to accelerate large estate assessments by providing and automated and uniform target platform decision process.|
|[Db2 zOS data assets discovery and assessment package](https://www.microsoft.com/download/details.aspx?id=103108)|After running the SQL script on a database, you can export the results to a file on the file system. Several file formats are supported, including \*.csv, so that you can capture the results in external tools such as spreadsheets. This method can be useful if you want to easily share results with teams that do not have the workbench installed.|
|[IBM Db2 LUW inventory scripts and artifacts](https://www.microsoft.com/download/details.aspx?id=103109)|This asset includes a SQL query that hits IBM Db2 LUW version 11.1 system tables and provides a count of objects by schema and object type, a rough estimate of "raw data" in each schema, and the sizing of tables in each schema, with results stored in a CSV format.|
|[IBM Db2 to SQL DB - Database Compare utility](https://www.microsoft.com/download/details.aspx?id=103016)|The Database Compare utility is a Windows console application that you can use to verify that the data is identical both on source and target platforms. You can use the tool to efficiently compare data down to the row or column level in all or selected tables, rows, and columns.|

The Data SQL Engineering team developed these resources. This team's core charter is to unblock and accelerate complex modernization for data platform migration projects to Microsoft's Azure data platform.



## Next steps

- For Microsoft and third-party services and tools to assist you with various database and data migration scenarios, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Database, see:
   - [An overview of SQL Database](../../database/sql-database-paas-overview.md)
   - [Azure total cost of ownership calculator](https://azure.microsoft.com/pricing/tco/calculator/) 

- To learn more about the framework and adoption cycle for cloud migrations, see:
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrated to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs)
   -  [Cloud Migration Resources](https://azure.microsoft.com/migration/resources) 

- To assess the application access layer, see [Data Access Migration Toolkit](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit).
- For details on how to perform data access layer A/B testing, see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
