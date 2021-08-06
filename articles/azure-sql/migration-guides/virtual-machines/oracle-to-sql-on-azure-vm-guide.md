---
title: "Oracle to SQL Server on Azure Virtual Machines: Migration guide"
description: This guide teaches you to migrate your Oracle schemas to SQL Server on Azure Virtual Machines by using SQL Server Migration Assistant for Oracle.
ms.service: virtual-machines-sql
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: mokabiru
ms.author: mokabiru
ms.reviewer: cawrites
ms.date: 11/06/2020
---
# Migration guide: Oracle to SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqldb-sqlmi](../../includes/appliesto-sqldb.md)]

This guide teaches you to migrate your Oracle schemas to SQL Server on Azure Virtual Machines by using SQL Server Migration Assistant for Oracle.

For other migration guides, see [Database Migration](/data-migration).

## Prerequisites

To migrate your Oracle schema to SQL Server on Azure Virtual Machines, you need:

- A supported source environment.
- [SQL Server Migration Assistant (SSMA) for Oracle](https://www.microsoft.com/download/details.aspx?id=54258).
- A target [SQL Server VM](../../virtual-machines/windows/sql-vm-create-portal-quickstart.md).
- The [necessary permissions for SSMA for Oracle](/sql/ssma/oracle/connecting-to-oracle-database-oracletosql) and the [provider](/sql/ssma/oracle/connect-to-oracle-oracletosql).
- Connectivity and sufficient permissions to access the source and the target.


## Pre-migration

To prepare to migrate to the cloud, verify that your source environment is supported and that you've addressed any prerequisites. Doing so will help to ensure an efficient and successful migration.

This part of the process involves:
- Conducting an inventory of the databases that you need to migrate.
- Assessing those databases for potential migration problems or blockers.
- Resolving any problems that you uncover.

### Discover

Use [MAP Toolkit](https://go.microsoft.com/fwlink/?LinkID=316883) to identify existing data sources and details about the features your business is using. Doing so will give you a better understanding of the migration and help you plan for it. This process involves scanning the network to identify your organization's Oracle instances and the versions and features you're using.

To use MAP Toolkit to do an inventory scan, follow these steps:


1. Open [MAP Toolkit](https://go.microsoft.com/fwlink/?LinkID=316883).


1. Select **Create/Select database**:

   ![Screenshot that shows the Create/Select database option.](./media/oracle-to-sql-on-azure-vm-guide/select-database.png)

1. Select **Create an inventory database**. Enter the name for the new inventory database and a brief description, and then select **OK**:

   :::image type="content" source="media/oracle-to-sql-on-azure-vm-guide/create-inventory-database.png" alt-text="Screenshot that shows the interface for creating an inventory database.":::

1. Select **Collect inventory data** to open the **Inventory and Assessment Wizard**:

   :::image type="content" source="media/oracle-to-sql-on-azure-vm-guide/collect-inventory-data.png" alt-text="Screenshot that shows the Collect inventory data link.":::


1. In the **Inventory and Assessment Wizard**, select **Oracle**, and then select **Next**:

   ![Screenshot that shows the Inventory Scenarios page of the Inventory and Assessment Wizard.](./media/oracle-to-sql-on-azure-vm-guide/choose-oracle.png)

1. Select the computer search option that best suits your business needs and environment, and then select **Next**:

   ![Screenshot that shows the Discovery Methods page of the Inventory and Assessment Wizard.](./media/oracle-to-sql-on-azure-vm-guide/choose-search-option.png)

1. Either enter credentials or create new credentials for the systems that you want to explore, and then select **Next**:

    ![Screenshot that shows the All Computers Credentials page of the Inventory and Assessment Wizard.](./media/oracle-to-sql-on-azure-vm-guide/choose-credentials.png)


1. Set the order of the credentials, and then select **Next**: 

   ![Screenshot that shows the Credentials Order page of the Inventory and Assessment Wizard.](./media/oracle-to-sql-on-azure-vm-guide/set-credential-order.png)  


1. Enter the credentials for each computer you want to discover. You can use unique credentials for every computer/machine, or you can use the All Computers credential list.  

   ![Screenshot that shows the Specify Computers and Credentials page of the Inventory and Assessment Wizard.](./media/oracle-to-sql-on-azure-vm-guide/specify-credentials-for-each-computer.png)


1. Verify your selections, and then select **Finish**:

   ![Screenshot that shows the Summary page of the Inventory and Assessment Wizard.](./media/oracle-to-sql-on-azure-vm-guide/review-summary.png)


1. After the scan finishes, view the **Data Collection** summary. The scan might take a few minutes, depending on the number of databases. Select **Close** when you're done:

   ![Screenshot that shows the Data Collection summary.](./media/oracle-to-sql-on-azure-vm-guide/collection-summary-report.png)


1. Select **Options** to generate a report about the Oracle assessment and database details. Select both options, one at a time, to generate the report.


### Assess

After you identify the data sources, use [SQL Server Migration Assistant for Oracle](https://www.microsoft.com/download/details.aspx?id=54258) to assess the Oracle instances migrating to the SQL Server VM. The assistant will help you understand the gaps between the source and destination databases. You can review database objects and data, assess databases for migration, migrate database objects to SQL Server, and then migrate data to SQL Server.

To create an assessment, follow these steps:


1. Open [SQL Server Migration Assistant for Oracle](https://www.microsoft.com/download/details.aspx?id=54258).
1. On the **File** menu, select **New Project**.
1. Provide a project name and a location for your project, and then select a SQL Server migration target from the list. Select **OK**:

   ![Screenshot that shows the New Project dialog box.](./media/oracle-to-sql-on-azure-vm-guide/new-project.png)


1. Select **Connect to Oracle**. Enter values for the Oracle connection in the **Connect to Oracle** dialog box:

   ![Screenshot that shows the Connect to Oracle dialog box.](./media/oracle-to-sql-on-azure-vm-guide/connect-to-oracle.png)

   Select the Oracle schemas that you want to migrate:

   ![Screenshot that shows the list of Oracle schemas that can be migrated.](./media/oracle-to-sql-on-azure-vm-guide/select-schema.png)


1. In **Oracle Metadata Explorer**, right-click the Oracle schema that you want to migrate, and then select **Create Report**. Doing so will generate an HTML report. Or, you can select the database and then select **Create report** in the top menu.

   ![Screenshot that shows how to create a report.](./media/oracle-to-sql-on-azure-vm-guide/create-report.png)

1. Review the HTML report for conversion statistics, errors, and warnings. Analyze it to understand conversion problems and resolutions.

    You can also open the report in Excel to get an inventory of Oracle objects and the effort required to complete schema conversions. The default location for the report is the report folder in SSMAProjects.

   For example: `drive:\<username>\Documents\SSMAProjects\MyOracleMigration\report\report_2016_11_12T02_47_55\`


   ![Screenshot that shows a conversion report.](./media/oracle-to-sql-on-azure-vm-guide/conversion-report.png)


### Validate data types

Validate the default data type mappings and change them based on requirements, if necessary. To do so, follow these steps:


1. On the **Tools** menu, select **Project Settings**.
1. Select the **Type Mappings** tab.

   ![Screenshot that shows the Type Mappings tab.](./media/oracle-to-sql-on-azure-vm-guide/type-mappings.png)

1. You can change the type mapping for each table by selecting the table in **Oracle Metadata Explorer**.

### Convert the schema

To convert the schema, follow these steps:

1. (Optional) To convert dynamic or ad-hoc queries, right-click the node and select **Add statement**.

1. Select **Connect to SQL Server** in the top menu.
     1. Enter connection details for your SQL Server on Azure VM.
     1. Select your target database from the list, or provide a new name. If you provide a new name, a database will be created on the target server.
     1. Provide authentication details.
     1. Select **Connect**.


   ![Screenshot that shows how to connect to SQL Server.](./media/oracle-to-sql-on-azure-vm-guide/connect-to-sql-vm.png)

1. Right-click the Oracle schema in **Oracle Metadata Explorer** and select **Convert Schema**. Or, you can select **Convert schema** in the top menu:

   ![Screenshot that shows how to convert the schema.](./media/oracle-to-sql-on-azure-vm-guide/convert-schema.png)


1. After the schema conversion is complete, review the converted objects and compare them to the original objects to identify potential problems. Use the recommendations to address any problems:

   ![Screenshot that shows a comparison of two schemas.](./media/oracle-to-sql-on-azure-vm-guide/table-mapping.png)

   Compare the converted Transact-SQL text to the original stored procedures and review the recommendations:

   ![Screenshot that shows Transact-SQL, stored procedures, and a warning.](./media/oracle-to-sql-on-azure-vm-guide/procedure-comparison.png)

   You can save the project locally for an offline schema remediation exercise. To do so, select **Save Project** on the **File** menu. Saving the project locally lets you evaluate the source and target schemas offline and perform remediation before you publish the schema to SQL Server.

1. Select **Review results** in the **Output** pane, and then review errors in the **Error list** pane.
1. Save the project locally for an offline schema remediation exercise. Select **Save Project** on the **File** menu. This gives you an opportunity to evaluate the source and target schemas offline and perform remediation before you publish the schema to SQL Server on Azure Virtual Machines.


## Migrate

After you have the necessary prerequisites in place and have completed the tasks associated with the pre-migration stage, you're ready to start the schema and data migration. Migration involves two steps: publishing the schema and migrating the data.


To publish your schema and migrate the data, follow these steps:

1. Publish the schema: right-click the database in **SQL Server Metadata Explorer** and select **Synchronize with Database**. Doing so publishes the Oracle schema to SQL Server on Azure Virtual Machines.

   ![Screenshot that shows the Synchronize with Database command.](./media/oracle-to-sql-on-azure-vm-guide/synchronize-database.png)

   Review the mapping between your source project and your target:

   ![Screenshot that shows the synchronization status.](./media/oracle-to-sql-on-azure-vm-guide/synchronize-database-review.png)



1. Migrate the data: right-click the database or object that you want to migrate in **Oracle Metadata Explorer** and select **Migrate Data**. Instead, you can select **Migrate Data** in the top menu.

   To migrate data for an entire database, select the check box next to the database name. To migrate data from individual tables, expand the database, expand **Tables**, and then select the check box next to the table. To omit data from individual tables, clear appropriate the check boxes.

   ![Screenshot that shows the Migrate Data command.](./media/oracle-to-sql-on-azure-vm-guide/migrate-data.png)

1. Provide connection details for Oracle and SQL Server on Azure Virtual Machines in the dialog box.
1. After the migration finishes, view the **Data Migration Report**:

    ![Screenshot that shows the Data Migration Report.](./media/oracle-to-sql-on-azure-vm-guide/data-migration-report.png)

1. Connect to your SQL Server on Azure Virtual Machines instance by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms). Validate the migration by reviewing the data and schema:


   ![Screenshot that shows a SQL Server instance in SSMA.](./media/oracle-to-sql-on-azure-vm-guide/validate-in-ssms.png)

Instead of using SSMA, you could use SQL Server Integration Services (SSIS) to migrate the data. To learn more, see:
- The article [SQL Server Integration Services](/sql/integration-services/sql-server-integration-services).
- The white paper [SSIS for Azure and Hybrid Data Movement](https://download.microsoft.com/download/D/2/0/D20E1C5F-72EA-4505-9F26-FEF9550EFD44/SSIS%20Hybrid%20and%20Azure.docx).


## Post-migration

After you complete the migration stage, you need to complete a series of post-migration tasks to ensure that everything is running as smoothly and efficiently as possible.

### Remediate applications

After the data is migrated to the target environment, all the applications that previously consumed the source need to start consuming the target. Making those changes might require changes to the applications.

[Data Access Migration Toolkit](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) is an extension for Visual Studio Code. It allows you to analyze your Java source code and detect data access API calls and queries. The toolkit provides a single-pane view of what needs to be addressed to support the new database back end. To learn more, see [Migrate your Java application from Oracle](https://techcommunity.microsoft.com/t5/microsoft-data-migration/migrate-your-java-applications-from-oracle-to-sql-server-with/ba-p/368727).

### Perform tests

To test your database migration, complete these activities:

1. **Develop validation tests**. To test database migration, you need to use SQL queries. Create the validation queries to run against both the source and target databases. Your validation queries should cover the scope that you've defined.

2. **Set up a test environment**. The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.

3. **Run validation tests**. Run the validation tests against the source and the target, and then analyze the results.

4. **Run performance tests**. Run performance test against the source and the target, and then analyze and compare the results.

### Validate Migrated Objects

Microsoft SQL Server Migration Assistant for Oracle Tester (SSMA Tester) allows you to test the migrated database objects the migrated data. The tester is primarily used to verify that converted objects behave in the same way.

#### Create test case

1. Open SSMA for Oracle, select Tester followed by New Test Case.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/ssma-tester-new.png" alt-text="Screenshot that shows new test case.":::

1. On the Test Case wizard, provide the following information.

   Name: Enter the name to identify the test case.

   Creation date: Today's current date, defined automatically.

   Last Modified date: filled in automatically, should not be changed.

   Description: Enter any additional information to identify the purpose of the test case.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-init-test-case.png" alt-text="Screenshot that shows step to initialize a test case.":::

1. Select the objects that are part of the test case from the Oracle object tree located on the left side.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-select-configure-objects.png" alt-text="Screenshot that shows step to  select and configure object.":::

   In this example, stored procedure ADD_REGION and table REGION are selected.

   To learn more, see  [Selecting and configuring objects to test.](/sql/ssma/oracle/selecting-and-configuring-objects-to-test-oracletosql)

1. Next, select the tables ,foreign keys and other dependent objects from the Oracle object tree located on the left window.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-select-configure-affected.png" alt-text="Screenshot that shows step to select and configure affected object.":::

   To learn more, see [Selecting and configuring affected objects.](/sql/ssma/oracle/selecting-and-configuring-affected-objects-oracletosql)

1. Review the evaluation sequence of objects. Change the order by clicking the buttons in the grid..

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/test-call-ordering.png" alt-text="Screenshot that shows step to sequence test object execution.":::

1. Finalize  the test case by reviewing the information provided in the previous steps. Also, configure the test execution options as per the test scenario.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-finalize-case.png" alt-text="Screenshot that shows step to  finalize object.":::

   For more information on test case settings,[Finishing test case preparation](/sql/ssma/oracle/finishing-test-case-preparation-oracletosql)

1. Click on finish to create the test case.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-test-repo.png" alt-text="Screenshot that shows step to test repo.":::

#### Run and view test case

When SSMA Tester runs a test case, the test engine executes the objects selected for testing and generates a verification report.

1. Select the test case from test repository and then click run.
   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-repo-run.png" alt-text="Screenshot that shows to review  test repo.":::

1. Review the launch test case  and click run.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-run-test-case.png" alt-text="Screenshot that shows step to launch  test case.":::

1. Next, provide  Oracle  source credentials. Click connect after entering the credentials.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-oracle-connect.png" alt-text="Screenshot that shows step to connect to  oracle source.":::

1. Provide target SQL Server credentials and click connect.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-sqlservervm-connect.png" alt-text="Screenshot that shows step to connect to  sql target.":::

   On success, the test case moves to initialization stage.

1. A real-time progress bar shows the execution status of the test run.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-run-status.png" alt-text="Screenshot that shows  tester test progress.":::

1. Review the report after the test is completed. The report provides the statistics, any errors during the test run and a detail report.

   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-test-result.png" alt-text="Screenshot that shows a sample tester test report":::

7.Click details to get more information.

  Example of positive data validation.
   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-test-success.png" alt-text="Screenshot that shows a sample  tester success report.":::

 Example of failed data validation.
   :::image type="content" source="./media/oracle-to-sql-on-azure-vm-guide/tester-test-failed.png" alt-text="Screenshot that shows tester failure report.":::

### Optimize

The post-migration phase is crucial for reconciling any data accuracy problems and verifying completeness. It's also critical for addressing performance issues with the workload.

> [!Note]
> For more information about these problems and specific steps to mitigate them, see the [Post-migration validation and optimization guide](/sql/relational-databases/post-migration-validation-and-optimization-guide).


## Migration resources

For more help with completing this migration scenario, see the following resources, which were developed to support a real-world migration project.

| **Title/Link**                                                                                                                                          | **Description**                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Data Workload Assessment Model and Tool](https://www.microsoft.com/download/details.aspx?id=103130) | This tool provides suggested best-fit target platforms, cloud readiness, and application/database remediation levels for a given workload. It offers simple one-click calculation and report generation that helps to accelerate large estate assessments by providing an automated and uniform target-platform decision process.                                                          |
| [Oracle Inventory Script Artifacts](https://www.microsoft.com/download/details.aspx?id=103121)                 | This asset includes a PL/SQL query that targets Oracle system tables and provides a count of objects by schema type, object type, and status. It also provides a rough estimate of raw data in each schema and the sizing of tables in each schema, with results stored in a CSV format.                                                                                                               |
| [Automate SSMA Oracle Assessment Collection & Consolidation](https://www.microsoft.com/download/details.aspx?id=103120)                                             | This set of resources uses a .csv file as entry (sources.csv in the project folders) to produce the XML files that you need to run an SSMA assessment in console mode. You provide the source.csv file by taking an inventory of existing Oracle instances. The output files are AssessmentReportGeneration_source_1.xml, ServersConnectionFile.xml, and VariableValueFile.xml.|
| [SSMA issues and possible remedies when migrating Oracle databases](https://aka.ms/dmj-wp-ssma-oracle-errors)                                                           | With Oracle, you can assign a non-scalar condition in a WHERE clause. SQL Server doesn't support this type of condition. So SSMA for Oracle doesn't convert queries that have a non-scalar condition in the WHERE clause. Instead, it generates an error: O2SS0001. This white paper provides details on the problem and ways to resolve it.          |
| [Oracle to SQL Server Migration Handbook](https://github.com/microsoft/DataMigrationTeam/blob/master/Whitepapers/Oracle%20to%20SQL%20Server%20Migration%20Handbook.pdf)                | This document focuses on the tasks associated with migrating an Oracle schema to the latest version of SQL Server. If the migration requires changes to features/functionality, you need to carefully consider the possible effect of each change on the applications that use the database.                                                     |
|[Oracle to SQL Server - Database Compare utility](https://www.microsoft.com/download/details.aspx?id=103016)|SSMA for Oracle Tester is the recommended tool to automatically validate the database object conversion and data migration, and it's a superset of Database Compare functionality.<br /><br />If you're looking for an alternative data validation option, you can use the Database Compare utility to compare data down to the row or column level in all or selected tables, rows, and columns.|


The Data SQL Engineering team developed these resources. This team's core charter is to unblock and accelerate complex modernization for data-platform migration projects to the Microsoft Azure data platform.


## Next steps

- To check the availability of services applicable to SQL Server, see the [Azure Global infrastructure center](https://azure.microsoft.com/global-infrastructure/services/?regions=all&amp;products=synapse-analytics,virtual-machines,sql-database).

- For a matrix of the Microsoft and third-party services and tools that are available to help you with various database and data migration scenarios and specialized tasks, see [Services and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL, see:
   - [Deployment options](../../azure-sql-iaas-vs-paas-what-is-overview.md)
   - [SQL Server on Azure Virtual Machines](../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/)


- To learn more about the framework and adoption cycle for cloud migrations, see:
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices to cost and size workloads migrated to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- For information about licensing, see:
   - [Bring your own license with the Azure Hybrid Benefit](../../virtual-machines/windows/licensing-model-azure-hybrid-benefit-ahb-change.md)
   - [Get free extended support for SQL Server 2008 and SQL Server 2008 R2](../../virtual-machines/windows/sql-server-2008-extend-end-of-support.md)

- To assess the application access layer, use [Data Access Migration Toolkit Preview](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit).
- For details on how to do data access layer A/B testing, see [Overview of Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
