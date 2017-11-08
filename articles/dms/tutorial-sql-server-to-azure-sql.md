---
title: Use Azure Database Migration Service to migrate migrate SQL Server on-premises to Azure SQL DB | Microsoft Docs
description: Learn to migrate from on premises SQL Server to Azure SQL using Azure Database Migration Service.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 10/31/2017
---

# Migrate SQL Server on-premises to Azure SQL DB
You can use the Azure Database Migration Service to migrate the databases from an on-premises SQL Server instance to Azure SQL Database. In this tutorial, you migrate the Adventureworks2012 database restored to an on-premises instance of SQL Server 2016 to an Azure SQL Database by using Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Assess your on-premises database by using the Data Migration Assistant
> * Migrate the sample schema by using Data Migration Assistant
> * Create an instance of Azure Database Migration Service
> * Create a Database Migration Service migration project
> * Run the migration
> * Monitor the migration

## Prerequisites
To complete this tutorial, you need:

- SQL Server 2016 Express edition.
    - TCP/IP protocol is disabled by default with SQL Server Express installation. Enable it by following the [instructions in this article](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol#SSMSProcedure).
    - You need to [configure Windows Firewall for database engine access](
    https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
- An Azure SQL Database instance. You can create an Azure SQL Database instance by following the article [Create an Azure SQL database in the Azure portal](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).
- [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595) v3.3 or later.
- Azure Database Migration Service requires a VNET created by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- The credentials used to connect to source SQL Server instance must have CONTROL SERVER permissions.
- The credentials used to connect to target Azure SQL DB instance must have CONTROL DATABASE permission on the target Azure SQL DB databases.

## Assess your on-premises database by using the Data Migration Assistant
Before you can migrate data from an on-premises SQL Server instance to Azure SQL Database, you need to assess the SQL Server database for any blocking issues that might prevent migration. After you download and install Data Migration Assistant v3.3, use the steps described in the article [Performing a SQL Server migration assessment](https://docs.microsoft.com/sql/dma/dma-assesssqlonprem) to complete the on-premises database assessment. A summary of the required steps follows:
1.	Select the New (+) icon, and then select the **Assessment**  project type.
2.	Specify a project name, in the **Source server type** text box, select **SQL Server**, and then in the **Target server type** text box, select **Azure SQL Database**.
3.	Create the project.
    When you are assessing the source SQL Server database migrating to Azure SQL Database, you can choose one or both of the following assessment report types:
    - Check database compatibility
    - Check feature parity
    Both report types are selected by default.
4.	In the Data Migration Assistant, on the **Options** screen, select **Next**.
5.  On the **Select sources** screen, in the **Connect to a server** dialog box, provide the connection details to the SQL Server 2016 Express edition, and then select **Connect**.
6.	Select **AdventureWorks2012**, select **Add**, and then select **Start Assessment**.
    When the assessment is complete, the results display as shown in the following graphic:
    ![Assess data migration](media\tutorial-sql-server-to-azure-sql\dma-assessments.png)

    For Azure SQL Database, the assessments identify migration blocking issues and feature parity issues.

7.	Review the assessment results for migration blocking issues and feature parity issues by selecting the specific options.
    - The SQL Server feature parity category provides a comprehensive set of recommendations, alternative approaches available in Azure, and mitigating steps to help you plan the effort into your migration projects.
    - The Compatibility issues category provides partially or unsupported features that reflect compatibility issues that might block migrating on-premises SQL Server database(s) to Azure SQL Database(s). Recommendations are also provided to help you address those issues.


## Migrate the sample schema by using Data Migration Assistant
After you are comfortable with the assessment and satisfied that the selected database is a good candidate for migration to Azure SQL Database, use Data Migration Assistant to migrate the schema to Azure SQL Database.

> [!NOTE]
> Before you create a migration project in Data Migration Assistant, be sure to pre-provision an Azure SQL database as mentioned in the pre-requisites. For purposes of this how-to guide, the name of the Azure SQL Database is assumed to be **AdventureWorks2012**, but you can name it differently if you wish.

To migrate the **AdventureWorks2012** schema to Azure SQL Database, perform the following steps:

1.	Launch Data Migration Assistant.
2.	Select the New (+) icon, and then under **Project type**, select **Migration**.
3.	Specify a project name, in the **Source server type** text box, select **SQL Server**, and then in the **Target server type** text box, select **Azure SQL Database**.
4.	Under **Migration Scope**, select **Schema only**.
After performing the previous steps, the Data Migration Assistant interface should appear as shown in the following graphic:
![Create Data Migration Assistant Project](media\tutorial-sql-server-to-azure-sql\dma-create-project.png)
5.	Create the project.
6.	In Data Migration Assistant, specify the source connection details for the SQL Server 2016 Express edition, select **Connect**, and then select the **AdventureWorks2012** database.
![Data Migration Assistant Source Connection Details](media\tutorial-sql-server-to-azure-sql\dma-source-connect.png)
7.	Select **Next**, under **Connect to target server**, specify the target connection details for the Azure SQL database, select **Connect**, and then select the **AdventureWorks2012** database you had pre-provisioned in Azure SQL database.
![Data Migration Assistant Target Connection Details](media\tutorial-sql-server-to-azure-sql\dma-target-connect.png)
8.	Select **Next** to advance to the **Select objects** screen, on which you can specify the schema objects in the **AdventureWorks2012** database that need to be deployed to Azure SQL Database.
    By default, all objects are selected.
![Generate SQL Scripts](media\tutorial-sql-server-to-azure-sql\dma-assessment-source.png)
9.	Select **Generate SQL script** to create the SQL scripts, and then review the scripts for any errors.
![Schema Script](media\tutorial-sql-server-to-azure-sql\dma-schema-script.png)
10.	Select **Deploy schema** to deploy the schema to Azure SQL Database, and then after the schema is deployed, check the target server for any anomalies.
![Deploy Schema](media\tutorial-sql-server-to-azure-sql\dma-schema-deploy.png)

## Create an instance of Azure Database Migration Service
1.	Log in to the Azure portal, select **New**, and then search for Azure Database Migration Service.
![Azure Marketplace](media\tutorial-sql-server-to-azure-sql\marketplace.png)
2.  On the **Azure data migration service (preview)** screen, select **Create**. 
3.	Specify a name for the service, the subscription, a virtual network, and the pricing tier.
    For more information on costs and pricing tiers, see the pricing page.
4.	Select **Create** to create the service.

## Create a migration project
After the service is created, you are redirected to the service page, which you can use to create a migration project.
1.	Select **+ New Migration Project**.
2.  On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **SQL Server**, and then in the **Target server type** text box, select **Azure SQL Database**.
![Create Database Migration Service Project](media\tutorial-sql-server-to-azure-sql\dms-create-project.png)

3.	Select **Create** to create the project.


## Specify source details
1. On the **Source details** screen, specify the connection details for the source SQL Server 2016 Express edition.
![Select Source](media\tutorial-sql-server-to-azure-sql\dms-select-source.png)

2. Select **Save**, and then select the **AdventureWorks2012** database for migration.
![Select Source DB](media\tutorial-sql-server-to-azure-sql\dms-select-source-db.png)

## Specify target details
1. Select **Save**, and then on the **Target details** screen, specify the connection details for the target, which is the pre-provisioned Azure SQL Database to which the **AdventureWorks2012** schema was deployed by using Data Migration Assistant.
![Select Target](media\tutorial-sql-server-to-azure-sql\dms-select-target.png)

2. Select **Save** to save the project.
3. On the **Migration summary** screen, review and verify the details associated with the migration project, and then select **Save**.
![DMS Summary](media\tutorial-sql-server-to-azure-sql\dms-summary.png)

## Run the migration
1.	Select the recently saved project, select **+ New Activity**, and then select **Run Data Migration**.
![New Activity](media\tutorial-sql-server-to-azure-sql\dms-new-activity.png)

2.	When prompted, enter the credentials for the source and the target servers, and then select **Save**.
3.	On the **Map to target databases** screen, map the source and the target database for migration.
    If the target database contains the same database name as the source database, Azure DMS selects the target database by default.
![Map to target databases](media\tutorial-sql-server-to-azure-sql\dms-map-targets-activity.png)

4. Select **Save**, on the **Select tables** screen, expand the table listing and review the list of affected fields.
![Select tables](media\tutorial-sql-server-to-azure-sql\dms-configure-setting-activity.png)

5.	On the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity.
    On this screen, you can also expand the Validation Option screen, which you can use to specify to validate the migrated database for:
    - Schema
    - Data Consistency
    - Query Correctness and Performance
![Choose validation option](media\tutorial-sql-server-to-azure-sql\dms-configuration.png)

6.	Select **Save**, review the summary to ensure that the source and target details match what you previously specified.
![Migration Summary](media\tutorial-sql-server-to-azure-sql\dms-run-migration.png)

7.	Select **Run migration** to start the migration activity.
![Activity Status](media\tutorial-sql-server-to-azure-sql\dms-activity-status.png)

## Monitor the migration
1. Select the migration activity to review the status of the activity.
2. Verify the target Azure SQL database after the migration is complete.
![Completed](media\tutorial-sql-server-to-azure-sql\dms-completed-activity.png)

## Next steps
- Request a [preview of DMS](https://aka.ms/get-dms)
- See the [pricing page](https://azure.microsoft.com/pricing/details/dms/) for costs and pricing tiers.
- Overview of [Data Migration Assistant](https://aka.ms/dma)
- Review the migration guidance in the [Microsoft Database Migration Guide](https://datamigration.microsoft.com/)