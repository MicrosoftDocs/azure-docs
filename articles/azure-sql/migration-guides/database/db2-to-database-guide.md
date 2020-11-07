---
title: "Migration guide: DB2 to SQL Database"
description: Follow this guide to migrate your DB2 databases to Azure SQL Database. 
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
# Migration guide: DB2 to SQL Database
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqldb.md)]

This guide teaches you to migrate your DB2 databases to Azure SQL Database using SQL Server Migration Assistant for DB2. 

For other scenarios, see the [Database Migration Guide](https://datamigration.microsoft.com/).

## Prerequisites 

To migrate your DB2 database to SQL Database, you need:

- to verify your source environment is supported.
- to download [SQL Server Migration Assistant (SSMA) for DB2](https://www.microsoft.com/download/details.aspx?id=54254).
- a target [Azure SQL Database](../../database/single-database-create-quickstart.md).


## Pre-migration

After you have met the prerequisites, you are ready to discover the topology of your environment and assess the feasibility of your migration. 

### Assess and convert

Create an assessment using SQL Server Migration Assistant (SSMA). 

To create an assessment, follow these steps:

1. Open SQL Server Migration Assistant (SSMA) for DB2. 
1. Select **File** and then choose **New Project**. 
1. Provide a project name, a location to save your project, and then select Azure SQL Database as the migration target from the drop-down. Select **OK**.  

   :::image type="content" source="media/db2-to-database-guide/new-project.png" alt-text="Provide project details and select OK to save.":::


1. Enter in values for the DB2 connection details on the **Connect to DB2** dialog box. 

   :::image type="content" source="media/db2-to-database-guide/connect-to-db2.png" alt-text="Connect to your DB2 instance":::


1. Right-click the DB2 schema you want to migrate, and then choose **Create report**. This will generate an HTML report. Alternatively, you can choose **Create report** from the navigation bar after selecting the schema. 

   :::image type="content" source="media/db2-to-database-guide/create-report.png" alt-text="Right-click the schema and choose create report":::

1. Review the HTML report to understand conversion statistics and any errors or warnings. You can also open the report in Excel to get an inventory of DB2 objects and the effort required to perform schema conversions. The default location for the report is in the report folder within SSMAProjects.

   For example: `drive:\<username>\Documents\SSMAProjects\MyDB2Migration\report\report_<date>`. 

   :::image type="content" source="media/db2-to-database-guide/report.png" alt-text="Review the report to identify any errors or warnings":::


### Validate data types

Validate the default data type mappings and change them based on requirements if necessary. To do so, follow these steps: 

1. Select **Tools** from the menu. 
1. Select **Project Settings**. 
1. Select the **Type mappings** tab. 

   :::image type="content" source="media/db2-to-database-guide/type-mapping.png" alt-text="Select the schema and then type-mapping":::

1. You can change the type mapping for each table by selecting the table in the **DB2 Metadata explorer**. 

### Schema conversion 

To convert the schema, follow these steps:

1. (Optional) Add dynamic or ad-hoc queries to statements. Right-click the node, and then choose **Add statements**. 
1. Select **Connect to Azure SQL Database**. 
    1. Enter connection details to connect your database in Azure SQL Database. 
    1. Choose your target SQL Database from the drop-down. 
    1. Select **Connect**. 

   :::image type="content" source="media/db2-to-database-guide/connect-to-sql-database.png" alt-text="Fill in details to connect to the logical server in Azure":::


1. Right-click the schema and then choose **Convert Schema**. Alternatively, you can choose **Convert Schema** from the top navigation bar after selecting your schema. 

   :::image type="content" source="media/db2-to-database-guide/convert-schema.png" alt-text="Right-click the schema and choose convert schema":::

1. After the conversion completes, compare and review the structure of the schema to identify potential problems and address them based on the recommendations. 

   :::image type="content" source="media/db2-to-database-guide/compare-review-schema-structure.png" alt-text="Compare and review the structure of the schema to identify potential problems and address them based on recommendations.":::

1. Save the project locally for an offline schema remediation exercise. Select **Save Project** from the **File** menu. 


## Migrate

After you have completed assessing your databases and addressing any discrepancies, the next step is to execute the migration process.

To publish your schema and migrate your data, follow these steps:

1. Publish the schema: Right-click the database from the **Databases** node in the **Azure SQL Database Metadata Explorer** and choose **Synchronize with Database**.

   :::image type="content" source="media/db2-to-database-guide/synchronize-with-database.png" alt-text="Right-click the database and choose synchronize with database":::

1. Migrate the data: Right-click the schema from the **DB2 Metadata Explorer** and choose **Migrate Data**. 

   :::image type="content" source="media/db2-to-database-guide/migrate-data.png" alt-text="Right-click the schema and choose migrate data":::

1. Provide connection details for both the DB2 and Azure SQL Database. 
1. View the **Data Migration report**. 

   :::image type="content" source="media/db2-to-database-guide/data-migration-report.png" alt-text="Review the data migration report":::

1. Connect to your Azure SQL Database by using SQL Server Management Studio and validate the migration by reviewing the data and schema. 

   :::image type="content" source="media/db2-to-database-guide/compare-schema-in-ssms.png" alt-text="Compare the schema in SSMS":::

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

   > [!NOTE]
   > For assistance developing and running post-migration validation tests, consider the Data Quality Solution available from the partner [QuerySurge](https://www.querysurge.com/company/partners/microsoft). 


## Leverage advanced features 

Be sure to take advantage of the advanced cloud-based features offered by SQL Database, such as [built-in high availability](../../database/high-availability-sla.md), [threat detection](../../database/advanced-data-security.md), and [monitoring and tuning your workload](../../database/monitor-tune-overview.md). 


Some SQL Server features are only available once the [database compatibility level](/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database) is changed to the latest compatibility level (150). 

## Partners

The following partners can provide alternative methods for migration as well: 

:::row:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/blitzz-logo.png" alt-text="Blitzz":::](https://www.blitzz.io/product)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/blueprint-logo.png" alt-text="Blueprint":::](https://bpcs.com/what-we-do)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/cognizant-logo.png" alt-text="Cognizant":::](https://www.cognizant.com/partners/microsoft)
   :::column-end:::   
:::row-end:::
:::row:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/datasunrise-logo.png" alt-text="DataSunrise":::](https://www.datasunrise.com/)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/dbbest-logo.png" alt-text="dbbtest":::](https://www.dbbest.com/)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/dxc-logo.png" alt-text="DXC":::](https://www.dxc.technology/application_services/offerings/139843/142343-application_services_for_microsoft_azure)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/hvr-logo.png" alt-text="HVR":::](https://www.hvr-software.com/solutions/azure-data-integration/)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/infosys-logo.png" alt-text="Infosys":::](https://www.infosys.com/services/)
   :::column-end:::   
   :::column span="":::
     [:::image type="content" source="media/db2-to-database-guide/ispirer-logo.png" alt-text="Ispirer":::](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [:::image type="content" source="media/db2-to-database-guide/querysurge-logo.png" alt-text="Querysurge":::](https://www.querysurge.com/company/partners/microsoft)
   :::column-end:::
   :::column span="":::
     [:::image type="content" source="media/db2-to-database-guide/scalability-experts-logo.png" alt-text="Scalability Experts":::](http://www.scalabilityexperts.com/products/index.html)
   :::column-end:::   
   :::column span="":::
     [:::image type="content" source="media/db2-to-database-guide/wipro-logo.png" alt-text="Wipro":::](https://www.wipro.com/analytics/)
   :::column-end:::
:::row-end:::   




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
