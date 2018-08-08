---
title: Use the Azure Database Migration Service to migrate SQL Server to Azure SQL Database | Microsoft Docs
description: Learn to migrate from SQL Server on-premises to Azure SQL Database by using the Azure Database Migration Service.
services: dms
author: edmacauley
ms.author: edmaca
manager: craigg
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 06/15/2018
---

# Migrate SQL Server to Azure SQL Database using DMS
You can use the Azure Database Migration Service to migrate the databases from an on-premises SQL Server instance to [Azure SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/). In this tutorial, you migrate the **Adventureworks2012** database restored to an on-premises instance of SQL Server 2016 (or later) to an Azure SQL Database by using the Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Assess your on-premises database by using the Data Migration Assistant.
> * Migrate the sample schema by using the Data Migration Assistant.
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project by using the Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.
> * Download a migration report.

## Prerequisites
To complete this tutorial, you need to:

- Download and install [SQL Server 2016 or later](https://www.microsoft.com/sql-server/sql-server-downloads) (any edition).
- Enable the TCP/IP protocol, which is disabled by default during SQL Server Express installation, by following the instructions in the article [Enable or Disable a Server Network Protocol](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol#SSMSProcedure).
- Create an instance of Azure SQL Database instance, which you do by following the detail in the article [Create an Azure SQL database in the Azure portal](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).
- Download and install the [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595) v3.3 or later.
- Create a VNET for the Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- Ensure that your Azure Virtual Network (VNET) Network Security Group rules do not block the following communication ports 443, 53, 9354, 445, 12000. For more detail on Azure VNET NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg).
- Configure your [Windows Firewall for database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
- Open your Windows firewall to allow the Azure Database Migration Service to access the source SQL Server, which by default is TCP port 1433.
- If you are running multiple named SQL Server instances using dynamic ports, you may wish to enable the SQL Browser Service and allow access to UDP port 1434 through your firewalls so that the Azure Database Migration Service can connect to a named instance on your source server.
- When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration.
- Create a server-level [firewall rule](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) for the Azure SQL Database server to allow the Azure Database Migration Service access to the target databases. Provide the subnet range of the VNET used for the Azure Database Migration Service.
- Ensure that the credentials used to connect to source SQL Server instance have [CONTROL SERVER](https://docs.microsoft.com/sql/t-sql/statements/grant-server-permissions-transact-sql) permissions.
- Ensure that the credentials used to connect to target Azure SQL Database instance have CONTROL DATABASE permission on the target Azure SQL databases.

## Assess your on-premises database
Before you can migrate data from an on-premises SQL Server instance to Azure SQL Database, you need to assess the SQL Server database for any blocking issues that might prevent migration. Using the Data Migration Assistant v3.3 or later, follow the steps described in the article [Performing a SQL Server migration assessment](https://docs.microsoft.com/sql/dma/dma-assesssqlonprem) to complete the on-premises database assessment. A summary of the required steps follows:
1.	In the Data Migration Assistant, select the New (+) icon, and then select the **Assessment**  project type.
2.	Specify a project name, in the **Source server type** text box, select **SQL Server**, in the **Target server type** text box, select **Azure SQL Database**, and then select **Create** to create the project.

    When you are assessing the source SQL Server database migrating to Azure SQL Database, you can choose one or both of the following assessment report types:
    - Check database compatibility
    - Check feature parity

    Both report types are selected by default.

3.	In the Data Migration Assistant, on the **Options** screen, select **Next**.
4.  On the **Select sources** screen, in the **Connect to a server** dialog box, provide the connection details to your SQL Server, and then select **Connect**.
5.	In the **Add sources** dialog box, select **AdventureWorks2012**, select **Add**, and then select **Start Assessment**.

    When the assessment is complete, the results display as shown in the following graphic:

    ![Assess data migration](media\tutorial-sql-server-to-azure-sql\dma-assessments.png)

    For Azure SQL Database, the assessments identify feature parity issues and migration blocking issues.

    - The **SQL Server feature parity** category provides a comprehensive set of recommendations, alternative approaches available in Azure, and mitigating steps to help you plan the effort into your migration projects.
    - The **Compatibility issues** category identifies partially supported or unsupported features that reflect compatibility issues that might block migrating on-premises SQL Server database(s) to Azure SQL Database. Recommendations are also provided to help you address those issues.

6.	Review the assessment results for migration blocking issues and feature parity issues by selecting the specific options.

## Migrate the sample schema
After you are comfortable with the assessment and satisfied that the selected database is a viable candidate for migration to Azure SQL Database, use the Data Migration Assistant to migrate the schema to Azure SQL Database.

> [!NOTE]
> Before you create a migration project in Data Migration Assistant, be sure that you have already provisioned an Azure SQL database as mentioned in the prerequisites. For purposes of this tutorial, the name of the Azure SQL Database is assumed to be **AdventureWorksAzure**, but you can provide whatever name you wish.

To migrate the **AdventureWorks2012** schema to Azure SQL Database, perform the following steps:

1.	In the Data Migration Assistant, select the New (+) icon, and then under **Project type**, select **Migration**.
2.	Specify a project name, in the **Source server type** text box, select **SQL Server**, and then in the **Target server type** text box, select **Azure SQL Database**.
3.	Under **Migration Scope**, select **Schema only**.

    After performing the previous steps, the Data Migration Assistant interface should appear as shown in the following graphic:
    
    ![Create Data Migration Assistant Project](media\tutorial-sql-server-to-azure-sql\dma-create-project.png)

4.	Select **Create** to create the project.
5.	In the Data Migration Assistant, specify the source connection details for your SQL Server, select **Connect**, and then select the **AdventureWorks2012** database.

    ![Data Migration Assistant Source Connection Details](media\tutorial-sql-server-to-azure-sql\dma-source-connect.png)

6.	Select **Next**, under **Connect to target server**, specify the target connection details for the Azure SQL database, select **Connect**, and then select the **AdventureWorksAzure** database you had pre-provisioned in Azure SQL database.

    ![Data Migration Assistant Target Connection Details](media\tutorial-sql-server-to-azure-sql\dma-target-connect.png)

7.	Select **Next** to advance to the **Select objects** screen, on which you can specify the schema objects in the **AdventureWorks2012** database that need to be deployed to Azure SQL Database.

    By default, all objects are selected.

    ![Generate SQL Scripts](media\tutorial-sql-server-to-azure-sql\dma-assessment-source.png)

8.	Select **Generate SQL script** to create the SQL scripts, and then review the scripts for any errors.

    ![Schema Script](media\tutorial-sql-server-to-azure-sql\dma-schema-script.png)

9.	Select **Deploy schema** to deploy the schema to Azure SQL Database, and then after the schema is deployed, check the target server for any anomalies.

    ![Deploy Schema](media\tutorial-sql-server-to-azure-sql\dma-schema-deploy.png)

## Register the Microsoft.DataMigration resource provider
1. Log in to the Azure portal, select **All services**, and then select **Subscriptions**.
 
   ![Show portal subscriptions](media\tutorial-sql-server-to-azure-sql\portal-select-subscription1.png)
       
2. Select the subscription in which you want to create the instance of the Azure Database Migration Service, and then select **Resource providers**.
 
    ![Show resource providers](media\tutorial-sql-server-to-azure-sql\portal-select-resource-provider.png)
    
3.  Search for migration, and then to the right of **Microsoft.DataMigration**, select **Register**.
 
    ![Register resource provider](media\tutorial-sql-server-to-azure-sql\portal-register-resource-provider.png)    

## Create an instance
1.	In the Azure portal, select + **Create a resource**, search for Azure Database Migration Service, and then select **Azure Database Migration Service** from the drop-down list.

    ![Azure Marketplace](media\tutorial-sql-server-to-azure-sql\portal-marketplace.png)

2.  On the **Azure Database Migration Service** screen, select **Create**.
 
    ![Create Azure Database Migration Service instance](media\tutorial-sql-server-to-azure-sql\dms-create1.png)
  
3.	On the **Create Migration Service** screen, specify a name for the service, the subscription, and a new or existing resource group.

4. Select an existing virtual network (VNET) or create a new one.

    The VNET provides the Azure Database Migration Service with access to the source SQL Server and the target Azure SQL Database instance.

    For more information about how to create a VNET in the Azure portal, see the article [Create a virtual network using the Azure portal](https://aka.ms/DMSVnet).

5. Select a pricing tier.

    For more information on costs and pricing tiers, see the [pricing page](https://aka.ms/dms-pricing).

    If you need help in choosing the right Azure Database Migration Service tier, refer to the recommendations in the posting [here](https://go.microsoft.com/fwlink/?linkid=861067).  

     ![Configure Azure Database Migration Service instance settings](media\tutorial-sql-server-to-azure-sql\dms-settings1.png)

6.	Select **Create** to create the service.

## Create a migration project
After the service is created, locate it within the Azure portal, open it, and then create a new migration project.

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.
 
      ![Locate all instances of the Azure Database Migration Service](media\tutorial-sql-server-to-azure-sql\dms-search.png)

2. On the **Azure Database Migration Services** screen, search for the name of the Azure Database Migration Service instance that you created, and then select the instance.
 
     ![Locate your instance of the Azure Database Migration Service](media\tutorial-sql-server-to-azure-sql\dms-instance-search.png)
 
3. Select + **New Migration Project**.
4. On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **SQL Server**, and then in the **Target server type** text box, select **Azure SQL Database**.

    ![Create Database Migration Service Project](media\tutorial-sql-server-to-azure-sql\dms-create-project1.png)

5.	Select **Create** to create the project.

## Specify source details
1. On the **Source details** screen, specify the connection details for the source SQL Server instance.
 
    Make sure to use a Fully Qualified Domain Name (FQDN) for the source SQL Server instance name. You can also use the IP Address for situations in which DNS name resolution is not possible.

2. If you have not installed a trusted certificate on your source server, select the **Trust server certificate** check box.

    When a trusted certificate is not installed, SQL Server generates a self-signed certificate when the instance is started. This certificate is used to encrypt the credentials for client connections.

    > [!CAUTION]
    > SSL connections that are encrypted using a self-signed certificate do not provide strong security. They are susceptible to man-in-the-middle attacks. You should not rely on SSL using self-signed certificates in a production environment or on servers that are connected to the internet.

   ![Source Details](media\tutorial-sql-server-to-azure-sql\dms-source-details1.png)
  
2. Select **Save**, and then select the **AdventureWorks2012** database for migration.

    ![Select Source DB](media\tutorial-sql-server-to-azure-sql\dms-select-source-db1.png)

## Specify target details
1. Select **Save**, and then on the **Target details** screen, specify the connection details for the target Azure SQL Database Server, which is the pre-provisioned Azure SQL Database to which the **AdventureWorks2012** schema was deployed by using the Data Migration Assistant.

    ![Select Target](media\tutorial-sql-server-to-azure-sql\dms-select-target1.png)

2. Select **Save** to save the project.

3. On the **Project summary** screen, review and verify the details associated with the migration project.

    ![DMS Summary](media\tutorial-sql-server-to-azure-sql\dms-summary1.png)

4. Select **Save**.

## Run the migration
1.	Select the recently saved project, select + **New Activity**, and then select **Run migration**.

    ![New Activity](media\tutorial-sql-server-to-azure-sql\dms-new-activity1.png)

2.	When prompted, enter the credentials for the source and the target servers, and then select **Save**.

3.	On the **Map to target databases** screen, map the source and the target database for migration.

    If the target database contains the same database name as the source database, Azure DMS selects the target database by default.

    ![Map to target databases](media\tutorial-sql-server-to-azure-sql\dms-map-targets-activity1.png)

4. Select **Save**, on the **Select tables** screen, expand the table listing, and then review the list of affected fields.

    Note that the Azure Database Migration Service auto selects all the empty source tables that exist on the target Azure SQL Database instance. If you want to remigrate tables that already include data, you need to explicitly select the tables on this blade.

    ![Select tables](media\tutorial-sql-server-to-azure-sql\dms-configure-setting-activity1.png)

5.	Select **Save**, on the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity.

6. Expand the **Validation option** section to display the **Choose validation option** screen, specify whether to validate the migrated databases for **Schema comparison**, **Data consistency**, and **Query correctness**.
    
    ![Choose validation option](media\tutorial-sql-server-to-azure-sql\dms-configuration1.png)

6.	Select **Save**, review the summary to ensure that the source and target details match what you previously specified.

    ![Migration Summary](media\tutorial-sql-server-to-azure-sql\dms-run-migration1.png)

7.	Select **Run migration**.

    The migration activity window appears, and the **Status** of the activity is **Pending**.

    ![Activity Status](media\tutorial-sql-server-to-azure-sql\dms-activity-status1.png)

## Monitor the migration
1. On the migration activity screen, select **Refresh** to update the display until the **Status** of the migration shows as **Completed**.

    ![Activity Status Completed](media\tutorial-sql-server-to-azure-sql\dms-completed-activity1.png)

2. After the migration completes, select **Download report** to get a report listing the details associated with the migration process.

3. Verify the target database(s) on the target Azure SQL Database server.

### Additional resources

 * [SQL migration using Azure Data Migration Service (DMS)](https://www.microsoft.com/handsonlabs/SelfPacedLabs/?storyGuid=3b671509-c3cd-4495-8e8f-354acfa09587) hands-on lab.