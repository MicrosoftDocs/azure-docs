---
title: "Db2 to Azure SQL Managed Instance: Migration guide"
description: This guide teaches you to migrate your Db2 databases to Azure SQL Managed Instance using SQL Server Migration Assistant for Db2.
ms.service: sql-managed-instance
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: mokabiru
ms.author: mokabiru
ms.reviewer: MashaMSFT
ms.date: 11/06/2020
---
# Migration guide: Db2 to Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqlmi.md)]

This guide teaches you to migrate your Db2 databases to Azure SQL Managed Instance using the SQL Server Migration Assistant for Db2. 

For other migration guides, see [Database Migration](https://docs.microsoft.com/data-migration). 

## Prerequisites 

To migrate your Db2 database to SQL Managed Instance, you need:

- to verify your [source environment is supported](/sql/ssma/db2/installing-ssma-for-db2-client-db2tosql#prerequisites).
- to download [SQL Server Migration Assistant (SSMA) for Db2](https://www.microsoft.com/download/details.aspx?id=54254).
- a target [Azure SQL Managed Instance](../../managed-instance/instance-create-quickstart.md).
- Connectivity and sufficient permissions to access both source and target. 



## Pre-migration

After you have met the prerequisites, you are ready to discover the topology of your environment and assess the feasibility of your migration. 

### Assess and convert



Create an assessment using SQL Server Migration Assistant (SSMA). 

To create an assessment, follow these steps:

1. Open SQL Server Migration Assistant (SSMA) for Db2. 
1. Select **File** and then choose **New Project**. 
1. Provide a project name, a location to save your project, and then select Azure SQL Managed Instance as the migration target from the drop-down. Select **OK**:

   :::image type="content" source="media/db2-to-managed-instance-guide/new-project.png" alt-text="Provide project details and select OK to save.":::


1. Enter in values for the Db2 connection details on the **Connect to Db2** dialog box:

   :::image type="content" source="media/db2-to-managed-instance-guide/connect-to-db2.png" alt-text="Connect to your Db2 instance":::


1. Right-click the Db2 schema you want to migrate, and then choose **Create report**. This will generate an HTML report. Alternatively, you can choose **Create report** from the navigation bar after selecting the schema:

   :::image type="content" source="media/db2-to-managed-instance-guide/create-report.png" alt-text="Right-click the schema and choose create report":::

1. Review the HTML report to understand conversion statistics and any errors or warnings. You can also open the report in Excel to get an inventory of Db2 objects and the effort required to perform schema conversions. The default location for the report is in the report folder within SSMAProjects.

   For example: `drive:\<username>\Documents\SSMAProjects\MyDb2Migration\report\report_<date>`. 

   :::image type="content" source="media/db2-to-managed-instance-guide/report.png" alt-text="Review the report to identify any errors or warnings":::


### Validate data types

Validate the default data type mappings and change them based on requirements if necessary. To do so, follow these steps: 

1. Select **Tools** from the menu. 
1. Select **Project Settings**. 
1. Select the **Type mappings** tab:

   :::image type="content" source="media/db2-to-managed-instance-guide/type-mapping.png" alt-text="Select the schema and then type-mapping":::

1. You can change the type mapping for each table by selecting the table in the **Db2 Metadata explorer**. 

### Schema conversion 

To convert the schema, follow these steps:

1. (Optional) Add dynamic or ad-hoc queries to statements. Right-click the node, and then choose **Add statements**. 
1. Select **Connect to Azure SQL Managed Instance**. 
    1. Enter connection details to connect to your Azure SQL Managed Instance. 
    1. Choose your target database from the drop-down, or provide a new name, in which case a database will be created on the target server. 
    1. Provide authentication details. 
    1. Select **Connect**:

   :::image type="content" source="media/db2-to-managed-instance-guide/connect-to-sql-managed-instance.png" alt-text="Fill in details to connect to SQL Server":::


1. Right-click the schema and then choose **Convert Schema**. Alternatively, you can choose **Convert Schema** from the top navigation bar after selecting your schema:

   :::image type="content" source="media/db2-to-managed-instance-guide/convert-schema.png" alt-text="Right-click the schema and choose convert schema":::

1. After the conversion completes, compare and review the structure of the schema to identify potential problems and address them based on the recommendations:

   :::image type="content" source="media/db2-to-managed-instance-guide/compare-review-schema-structure.png" alt-text="Compare and review the structure of the schema to identify potential problems and address them based on recommendations.":::

1. Select **Review results** in the Output pane, and review errors in the **Error list** pane. 
1. Save the project locally for an offline schema remediation exercise. Select **Save Project** from the **File** menu. This gives you an opportunity to evaluate the source and target schemas offline and perform remediation before you can publish the schema to SQL Managed Instance.


## Migrate

After you have completed assessing your databases and addressing any discrepancies, the next step is to execute the migration process.

To publish your schema and migrate your data, follow these steps:

1. Publish the schema: Right-click the database from the **Databases** node in the **Azure SQL Managed Instance Metadata Explorer** and choose **Synchronize with Database**:

   :::image type="content" source="media/db2-to-managed-instance-guide/synchronize-with-database.png" alt-text="Right-click the database and choose synchronize with database":::

1. Migrate the data: Right-click the database or object you want to migrate in **Db2 Metadata Explorer**, and choose **Migrate data**. Alternatively, you can select **Migrate Data** from the top-line navigation bar. To migrate data for an entire database, select the check box next to the database name. To migrate data from individual tables, expand the database, expand Tables, and then select the check box next to the table. To omit data from individual tables, clear the check box:

   :::image type="content" source="media/db2-to-managed-instance-guide/migrate-data.png" alt-text="Right-click the schema and choose migrate data":::

1. Provide connection details for both Db2 and SQL Managed Instance. 
1. After migration completes, view the **Data Migration Report**:  

   :::image type="content" source="media/db2-to-managed-instance-guide/data-migration-report.png" alt-text="Review the data migration report":::

1. Connect to your Azure SQL Managed Instance by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) and validate the migration by reviewing the data and schema:

   :::image type="content" source="media/db2-to-managed-instance-guide/compare-schema-in-ssms.png" alt-text="Compare the schema in SSMS":::

## Post-migration 

After you have successfully completed the Migration stage, you need to go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications 

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications.


### Perform tests

The test approach for database migration consists of the following activities:

1. **Develop validation tests**: To test database migration, you need to use SQL queries. You must create the validation queries to run against both the source and the target databases. Your validation queries should cover the scope you have defined.
1. **Set up test environment**: The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.
1. **Run validation tests**: Run the validation tests against the source and the target, and then analyze the results.
1. **Run performance tests**: Run performance test against the source and the target, and then analyze and compare the results.


## Leverage advanced features 

Be sure to take advantage of the advanced cloud-based features offered by Azure SQL Managed Instance, such as [built-in high availability](../../database/high-availability-sla.md), [threat detection](../../database/azure-defender-for-sql.md), and [monitoring and tuning your workload](../../database/monitor-tune-overview.md). 


Some SQL Server features are only available once the [database compatibility level](/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database) is changed to the latest compatibility level (150). 

## Migration assets 

For additional assistance, see the following resources, which were developed in support of a real-world migration project engagement:

|Asset  |Description  |
|---------|---------|
|[Data workload assessment model and tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/Data%20Workload%20Assessment%20Model%20and%20Tool)| This tool provides suggested "best fit" target platforms, cloud readiness, and application/database remediation level for a given workload. It offers simple, one-click calculation and report generation that helps to accelerate large estate assessments by providing and automated and uniform target platform decision process.|
|[Db2 zOS data assets discovery and assessment package](https://github.com/Microsoft/DataMigrationTeam/tree/master/Db2%20zOS%20Data%20Assets%20Discovery%20and%20Assessment%20Package)|After running the SQL script on a database, you can export the results to a file on the file system. Several file formats are supported, including *.csv, so that you can capture the results in external tools such as spreadsheets. This method can be useful if you want to easily share results with teams that do not have the workbench installed.|
|[IBM Db2 LUW inventory scripts and artifacts](https://github.com/Microsoft/DataMigrationTeam/tree/master/IBM%20Db2%20LUW%20Inventory%20Scripts%20and%20Artifacts)|This asset includes a SQL query that hits IBM Db2 LUW version 11.1 system tables and provides a count of objects by schema and object type, a rough estimate of 'Raw Data' in each schema, and the sizing of tables in each schema, with results stored in a CSV format.|
|[Db2 LUW pure scale on Azure - setup guide](https://github.com/Microsoft/DataMigrationTeam/blob/master/Whitepapers/Db2%20PureScale%20on%20Azure.pdf)|This guide serves as a starting point for a Db2 implementation plan. While business requirements will differ, the same basic pattern applies. This architectural pattern may also be used for OLAP applications on Azure.|

These resources were developed as part of the Data SQL Ninja Program, which is sponsored by the Azure Data Group engineering team. The core charter of the Data SQL Ninja program is to unblock and accelerate complex modernization and compete data platform migration opportunities to Microsoft's Azure Data platform. If you think your organization would be interested in participating in the Data SQL Ninja program, please contact your account team and ask them to submit a nomination.


## Next steps

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Managed Instance see:
   - [An overview of SQL Managed Instance](../../managed-instance/sql-managed-instance-paas-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).