---
title: Use Azure Database Migration Service to migrate migrate SQL Server on-premises to Azure SQL DB | Microsoft Docs
description: Learn to migrate from on premises SQL Server to Azure SQL using Azure Database Migration Service.
services: dms
author: HJToland3
ms.author: jtoland
manager: jhubbard
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 10/25/2017
---

# Migrate SQL Server on-premises to Azure SQL DB
You can use the Azure Database Migration Service (Azure DMS) to migrate the databases from an on-premises SQL Server instance to Azure SQL Database. In this tutorial, you migrate the Adventureworks2012 database restored to an on-premises instance of SQL Server 2016 to an Azure SQL Database by using Azure DMS.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Assess your on-premises database by using the Data Migration Assistant
> * Migrate the sample schema by using DMA
> * Create an instance of Azure Database Migration Service
> * Create a DMS migration project
> * Run the migration
> * Monitor the migration

## Prerequisites
To complete this tutorial, you need:

- SQL Server 2016 Express edition.
- An Azure SQL Database instance. You can create an Azure SQL Database instance by following the article [Create an Azure SQL database in the Azure portal](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).
- [Data Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595) v3.3 or later.
- Azure DMS requires a VNET created by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- The credentials used to connect to source SQL Server instance must have CONTROL SERVER permissions.
- The credentials used to connect to target Azure SQL DB instance must have CONTROL DATABASE permission on the target Azure SQL DB databases.
- Open your Windows firewall to allow Azure DMS to access the source SQL Server.

## Assess your on-premises database by using the Data Migration Assistant (DMA)
Before you can migrate data from an on-premises SQL Server instance to Azure SQL Database, you need to assess the SQL Server database for any blocking issues that might prevent migration. After you download and install DMA v3.3, use the steps described in the article [Performing a SQL Server migration assessment](https://docs.microsoft.com/sql/dma/dma-assesssqlonprem) to complete the on-premises database assessment. A summary of the required steps follows:
1.	Click on the New (+) icon, and then select the Assessment project type.
1.	In the Source server type text box, select SQL Server, and then in the Target server type text box, select Azure SQL Database.
1.	Create the project.
1.	When you are assessing the source SQL Server database migrating to Azure SQL Database, you can choose one or both of the following assessment report types:
    - Check database compatibility
    - Check feature parity
1.	Click on Add Sources, and then provide the connection details to the SQL Server 2016 Express edition.

1.	Select AdventureWorks2012, click Add, and then click Next to start the assessment.
When the assessment is complete, the results will display as shown in the following graphic:
    ![Assess data migration](media\tutorial-sql-server-to-azure-sql\dmaassessments.png)

    For Azure SQL Database, the assessments provide migration blocking issues and feature parity issues.

1.	Review the assessment results for migration blocking issues and feature parity issues by selecting the specific options.
    - The SQL Server feature parity category provides a comprehensive set of recommendations, alternative approaches available in Azure, and mitigating steps to help you plan the effort into your migration projects.
    - The Compatibility issues category provides partially or unsupported features that reflect compatibility issues that might block migrating on-premises SQL Server database(s) to Azure SQL Database(s). Recommendations are also provided to help you address those issues.


## Migrate the sample schema by using DMA
After you are comfortable with the assessment and satisfied that the selected database is a good candidate for migration to Azure SQL Database, use DMA to migrate the schema to Azure SQL Database.

> [!NOTE]
> Before you create a migration project in DMA, be sure to pre-provision an Azure SQL database as mentioned in the pre-requisites. For purposes of this how-to guide, we assume the name of the Azure SQL Database is AdventureWorks2012, but you can name it differently if you wish.

To migrate the AdventureWorks2012 schema to Azure SQL Database, perform the following steps:

1.	Launch DMA.
1.	On the left pane, click New (+), and then under Project type, select the Migration.
1.	In the Source server type text box, select SQL Server, and then in the Target server type text box, select Azure SQL Database.
1.	Under Migration Scope, select Schema only.
After performing the previous steps, the DMA interface should appear as shown in the following graphic:
![Create DMA Project](media\tutorial-sql-server-to-azure-sql\dmacreateproject.png)
1.	Create the project.
1.	In DMA, specify the source connection details for the SQL Server 2016 Express edition, and then choose the AdventureWorks2012 database.
![DMA Source Connection Details](media\tutorial-sql-server-to-azure-sql\dmasourceconnect.png)
1.	Click Next, under Connect to target server, specify the target connection details for the Azure SQL database, and then select the AdventureWorks2012 database you had pre-provisioned in Azure SQL database.
![DMA Target Connection Details](media\tutorial-sql-server-to-azure-sql\dmatargetconnect.png)
1.	Click Next to advance to the Select objects screen, on which you can specify the schema objects in the AdventureWorks2012 database that need to be deployed to Azure SQL Database.
By default, all objects are selected.
1.	Click Generate SQL script to create the SQL scripts.
![Generate SQL Scripts](media\tutorial-sql-server-to-azure-sql\dmaassessment_source.png)
1.	After generating the scripts, review them for any errors, and then click Deploy schema to deploy the schema to Azure SQL Database.
![Schema Script](media\tutorial-sql-server-to-azure-sql\dmaschemascript.png)
1.	After the schema is deployed, check the target server for any anomalies.
![Deploy Schema](media\tutorial-sql-server-to-azure-sql\dmaschemadeploy.png)

## Create an instance of Azure DMS
1.	Log in to the Azure portal, and then search for Azure Database Migration Service.
![Azure Marketplace](media\tutorial-sql-server-to-azure-sql\marketplace.png)
1.	Choose Azure data migration service (preview) to create the service.
1.	Specify a name for the service, the subscription, a virtual network, and the pricing tier.
For more information on costs and pricing tiers, refer to the pricing page.
1.	Click Create to create the service.

## Create a migration project
After the service is created, you are redirected to the service page, which you can use to create a migration project.
1.	Click + New Migration Project to create a migration project.
1.	In the Source server type text box, select SQL Server, and then in the Target server type text box, select Azure SQL Database.
1.	Click Create to create the project.
 
![Create DMS Project](media\tutorial-sql-server-to-azure-sql\createproject.png)

## Specify source details
Specify the connection details for the source SQL Server 2016 Express edition.
 
![Select Source](media\tutorial-sql-server-to-azure-sql\dmsselectsource.png)

Select the AdventureWorks2012 database for migration.
 
![Select Source DB](media\tutorial-sql-server-to-azure-sql\dmsselectsourcedb.png)

## Specify target details
Specify the connection details for the target, which is the pre-provisioned Azure SQL Database to which AdventureWorks2012 schema was deployed by using DMA.  Then save the project
 
![Select Target](media\tutorial-sql-server-to-azure-sql\dmsselecttarget.png)

## Run the migration
1.	Choose the recently saved project, click on + New Activity, and then click Run Data Migration.
![New Activity](media\tutorial-sql-server-to-azure-sql\dmsnewactivity.png)

1.	When prompted, enter the credentials for the source and the target servers.
![Enter Credentials](media\tutorial-sql-server-to-azure-sql\dmstargetconnectactivity.png)

1.	Map the source and the target database for migration.
If the target database contains the same database name as the source database, Azure DMS selects the target database by default.
![Map to target databases](media\tutorial-sql-server-to-azure-sql\dmsconfiguresettingactivity.png)

1.	On the migration configuration screen, you can choose validation options to validate the migrated database for:
    - Schema
    - Data Consistency
    - Query Correctness and Performance
![Choose validation option](media\tutorial-sql-server-to-azure-sql\dmsconfiguration.png)

1.	Save to review the summary and ensure that the source and target details match what you specified earlier.
![Migration Summary](media\tutorial-sql-server-to-azure-sql\dmsrunmigration1.png)

1.	Click Run migration to start the migration activity.

## Monitor the migration
1. Select the migration activity to review the status of the activity.
![Completed](media\tutorial-sql-server-to-azure-sql\dmscompletedresult.png)
1. Verify the target Azure SQL database after the migration is complete.

## Next steps
- Request a [preview of DMS](https://aka.ms/get-dms)
- See the [pricing page](https://azure.microsoft.com/pricing/details/dms/) for costs and pricing tiers.
- Overview of [Data Migration Assistant](https://aka.ms/dma)