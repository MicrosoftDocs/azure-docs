---
title: "Db2 to SQL Server on Azure VM: Migration guide"
description: This guide teaches you to migrate your IBM Db2 databases to SQL Server on Azure VM, by using SQL Server Migration Assistant for Db2.
ms.custom: ""
ms.service: virtual-machines-sql
ms.subservice: migration-guide
ms.devlang: 
ms.topic: how-to
author: markjones-msft
ms.author: markjon
ms.reviewer: mathoma
ms.date: 11/06/2020
---
# Migration guide: IBM Db2 to SQL Server on Azure VM
[!INCLUDE[appliesto--sqlmi](../../includes/appliesto-sqlvm.md)]

This guide teaches you to migrate your user databases from IBM Db2 to SQL Server on Azure VM, by using the SQL Server Migration Assistant for Db2. 

For other migration guides, see [Azure Database Migration Guides](https://docs.microsoft.com/data-migration). 

## Prerequisites

To migrate your Db2 database to SQL Server, you need:

- To verify that your [source environment is supported](/sql/ssma/db2/installing-ssma-for-Db2-client-Db2tosql#prerequisites).
- [SQL Server Migration Assistant (SSMA) for Db2](https://www.microsoft.com/download/details.aspx?id=54254).
- [Connectivity](../../virtual-machines/windows/ways-to-connect-to-sql.md) between your source environment and your SQL Server VM in Azure. 
- A target [SQL Server on Azure VM](../../virtual-machines/windows/create-sql-vm-portal.md). 

## Pre-migration

After you have met the prerequisites, you're ready to discover the topology of your environment and assess the feasibility of your migration. 

### Assess 

Use SSMA for DB2 to review database objects and data, and assess databases for migration. 

To create an assessment, follow these steps:

1. Open [SSMA for Db2](https://www.microsoft.com/download/details.aspx?id=54254). 
1. Select **File** > **New Project**. 
1. Provide a project name and a location to save your project. Then select a SQL Server migration target from the drop-down list, and select **OK**.

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/new-project.png" alt-text="Screenshot that shows project details to specify.":::


1. On **Connect to Db2**, enter values for the Db2 connection details.

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/connect-to-Db2.png" alt-text="Screenshot that shows options to connect to your Db2 instance.":::


1. Right-click the Db2 schema you want to migrate, and then choose **Create report**. This will generate an HTML report. Alternatively, you can choose **Create report** from the navigation bar after selecting the schema.

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/create-report.png" alt-text="Screenshot that shows how to create a report.":::

1. Review the HTML report to understand conversion statistics and any errors or warnings. You can also open the report in Excel to get an inventory of Db2 objects and the effort required to perform schema conversions. The default location for the report is in the report folder within *SSMAProjects*.

   For example: `drive:\<username>\Documents\SSMAProjects\MyDb2Migration\report\report_<date>`. 

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/report.png" alt-text="Screenshot of the report that you review to identify any errors or warnings.":::


### Validate data types

Validate the default data type mappings, and change them based on requirements if necessary. To do so, follow these steps: 

1. Select **Tools** from the menu. 
1. Select **Project Settings**. 
1. Select the **Type mappings** tab.

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/type-mapping.png" alt-text="Screenshot that shows selecting the schema and type mapping.":::

1. You can change the type mapping for each table by selecting the table in the **Db2 Metadata Explorer**. 

### Convert schema 

To convert the schema, follow these steps:

1. (Optional) Add dynamic or ad hoc queries to statements. Right-click the node, and then choose **Add statements**. 
1. Select **Connect to SQL Server**. 
    1. Enter connection details to connect to your instance of SQL Server on your Azure VM. 
    1. Choose to connect to an existing database on the target server, or provide a new name to create a new database on the target server. 
    1. Provide authentication details. 
    1. Select **Connect**.

    :::image type="content" source="../../../../includes/media/virtual-machines-sql-server-connection-steps/rm-ssms-connect.png" alt-text="Screenshot that shows the details needed to connect to your SQL Server on Azure VM.":::

1. Right-click the schema and then choose **Convert Schema**. Alternatively, you can choose **Convert Schema** from the top navigation bar after selecting your schema.

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/convert-schema.png" alt-text="Screenshot that shows selecting the schema and converting it.":::

1. After the conversion finishes, compare and review the structure of the schema to identify potential problems. Address the problems based on the recommendations. 

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/compare-review-schema-structure.png" alt-text="Screenshot that shows comparing and reviewing the structure of the schema to identify potential problems.":::

1. In the **Output** pane, select **Review results**. In the **Error list** pane, review errors. 
1. Save the project locally for an offline schema remediation exercise. From the **File** menu, select **Save Project**. This gives you an opportunity to evaluate the source and target schemas offline, and perform remediation before you can publish the schema to SQL Server on Azure VM.

## Migrate

After you have completed assessing your databases and addressing any discrepancies, the next step is to execute the migration process.

To publish your schema and migrate your data, follow these steps:

1. Publish the schema. In **SQL Server Metadata Explorer**, from the **Databases** node, right-click the database. Then select **Synchronize with Database**.

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/synchronize-with-database.png" alt-text="Screenshot that shows the option to synchronize with database.":::

1. Migrate the data. Right-click the database or object you want to migrate in **Db2 Metadata Explorer**, and choose **Migrate data**. Alternatively, you can select **Migrate Data** from the navigation bar. To migrate data for an entire database, select the check box next to the database name. To migrate data from individual tables, expand the database, expand **Tables**, and then select the check box next to the table. To omit data from individual tables, clear the check box.

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/migrate-data.png" alt-text="Screenshot that shows selecting the schema and choosing to migrate data.":::

1. Provide connection details for both the Db2 and SQL Server instances. 
1. After migration finishes, view the **Data Migration Report**:  

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/data-migration-report.png" alt-text="Screenshot that shows where to review the data migration report.":::

1.  Connect to your instance of SQL Server on Azure VM by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms). Validate the migration by reviewing the data and schema.

   :::image type="content" source="media/db2-to-sql-on-azure-vm-guide/compare-schema-in-ssms.png" alt-text="Screenshot that shows comparing the schema in SQL Server Management Studio.":::

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

## Migration assets 

For additional assistance, see the following resources, which were developed in support of a real-world migration project engagement:

|Asset  |Description  |
|---------|---------|
|[Data workload assessment model and tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/Data%20Workload%20Assessment%20Model%20and%20Tool)| This tool provides suggested "best fit" target platforms, cloud readiness, and application/database remediation level for a given workload. It offers simple, one-click calculation and report generation that helps to accelerate large estate assessments by providing and automated and uniform target platform decision process.|
|[Db2 zOS data assets discovery and assessment package](https://github.com/microsoft/DataMigrationTeam/tree/master/DB2%20zOS%20Data%20Assets%20Discovery%20and%20Assessment%20Package)|After running the SQL script on a database, you can export the results to a file on the file system. Several file formats are supported, including *.csv, so that you can capture the results in external tools such as spreadsheets. This method can be useful if you want to easily share results with teams that do not have the workbench installed.|

|[IBM Db2 LUW inventory scripts and artifacts](https://github.com/microsoft/DataMigrationTeam/tree/master/IBM%20DB2%20LUW%20Inventory%20Scripts%20and%20Artifacts)|This asset includes a SQL query that hits IBM Db2 LUW version 11.1 system tables and provides a count of objects by schema and object type, a rough estimate of "raw data" in each schema, and the sizing of tables in each schema, with results stored in a CSV format.|
|[Db2 LUW pure scale on Azure - setup guide](https://github.com/microsoft/DataMigrationTeam/blob/master/Whitepapers/DB2%20PureScale%20on%20Azure.pdf)|This guide serves as a starting point for a Db2 implementation plan. Although business requirements will differ, the same basic pattern applies. This architectural pattern can also be used for OLAP applications on Azure.|

The Data SQL Engineering team developed these resources. This team's core charter is to unblock and accelerate complex modernization for data platform migration projects to Microsoft's Azure data platform.

## Next steps

After migration, review the [Post-migration validation and optimization guide](/sql/relational-databases/post-migration-validation-and-optimization-guide). 

For Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios, see [Data migration services and tools](../../../dms/dms-tools-matrix.md).

For video content, see [Overview of the migration journey](https://azure.microsoft.com/resources/videos/overview-of-migration-and-recommended-tools-services/).
