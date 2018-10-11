---
title: Use the Azure Database Migration Service to perform an online migration of SQL Server to Azure SQL Database Managed Instance | Microsoft Docs
description: Learn to perform an online migration from SQL Server on-premises to Azure SQL Database Managed Instance by using the Azure Database Migration Service.
services: dms
author: pochiraju
ms.author: rajpo
manager: craigg
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 10/10/2018
---

# Migrate SQL Server to Azure SQL Database Managed Instance online using DMS
You can use the Azure Database Migration Service to migrate the databases from an on-premises SQL Server instance to an [Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance.md) with minimal downtime. For additional methods that may require some manual effort, see the article [SQL Server instance migration to Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance-migrate.md).

>[!IMPORTANT]
>Online migration projects from SQL Server to Azure SQL Database Managed Instance are in preview and subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this tutorial, you migrate the **Adventureworks2012** database from an on-premises instance of SQL Server to an Azure SQL Database Managed Instance with minimal downtime by using the Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project and start online migration by using the Azure Database Migration Service.
> * Monitor the migration.
> * Cutover the migration when you are ready.

## Prerequisites
To complete this tutorial, you need to:

- Create a VNET for the Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). [Learn network topologies for Azure SQL DB Managed Instance migrations using the Azure Database Migration Service](https://aka.ms/dmsnetworkformi).
- Ensure that your Azure Virtual Network (VNET) Network Security Group rules don't block the following communication ports 443, 53, 9354, 445, 12000. For more detail on Azure VNET NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg).
- Configure your [Windows Firewall for source database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
- Open your Windows Firewall to allow the Azure Database Migration Service to access the source SQL Server, which by default is TCP port 1433.
- If you're running multiple named SQL Server instances using dynamic ports, you may wish to enable the SQL Browser Service and allow access to UDP port 1434 through your firewalls so that the Azure Database Migration Service can connect to a named instance on your source server.
- If you're using a firewall appliance in front of your source databases, you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration, as well as files via SMB port 445.
- Create an Azure SQL Database Managed Instance by following the detail in the article [Create an Azure SQL Database Managed Instance in the Azure portal](https://aka.ms/sqldbmi).
- Ensure that the logins used to connect the source SQL Server and target Managed Instance are members of the sysadmin server role.
- Provide an SMB network share that contains all your database full database backup files and subsequent transaction log backup files the Azure Database Migration Service can use for database migration.
- Ensure that the service account running the source SQL Server instance has write privileges on the network share that you created and that the computer account for the source server has read/write access to the same share.
- Make a note of a Windows user (and password) that has full control privilege on the network share that you previously created. The Azure Database Migration Service impersonates the user credential to upload the backup files to Azure storage container for restore operation.
- Create an Azure Active Directory Application ID that generates the Application ID key that DMS Service can use to connect to target Azure Database Managed Instance and Azure Storage Container. For more information, see the article [Use portal to create an Azure Active Directory application and service principal that can access resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal).
- Create or make a note of **Standard Performance tier**, Azure Storage Account, that allows DMS service to upload the database backup files to and use for migrating databases.  Make sure to create the Azure Storage Account in the same region as the DMS service created.

## Register the Microsoft.DataMigration resource provider

1. Sign in to the Azure portal, select **All services**, and then select **Subscriptions**.

    ![Show portal subscriptions](media\tutorial-sql-server-to-managed-instance-online\portal-select-subscriptions.png)        
2. Select the subscription in which you want to create the instance of the Azure Database Migration Service, and then select **Resource providers**.

    ![Show resource providers](media\tutorial-sql-server-to-managed-instance-online\portal-select-resource-provider.png)

3. Search for migration, and then to the right of **Microsoft.DataMigration**, select **Register**.

    ![Register resource provider](media\tutorial-sql-server-to-managed-instance-online\portal-register-resource-provider.png)   

## Create an Azure Database Migration Service instance

1. In the Azure portal, select + **Create a resource**, search for **Azure Database Migration Service**, and then select **Azure Database Migration Service** from the drop-down list.

     ![Azure Marketplace](media\tutorial-sql-server-to-managed-instance-online\portal-marketplace.png)

2. On the **Azure Database Migration Service** screen, select **Create**.

    ![Create Azure Database Migration Service instance](media\tutorial-sql-server-to-managed-instance-online\dms-create1.png)

3. On the **Create Migration Service** screen, specify a name for the service, the subscription, and a new or existing resource group.

4.	Select the location in which you want to create the instance of DMS.

5. Select an existing virtual network (VNET) or create one.
 
    The VNET provides the Azure Database Migration Service with access to the source SQL Server and target Azure SQL Database Managed Instance.

    For more information on how to create a VNET in Azure portal, see the article [Create a virtual network using the Azure portal](https://aka.ms/DMSVnet).

    For additional detail, see the article [Network topologies for Azure SQL DB Managed Instance migrations using the Azure Database Migration Service](https://aka.ms/dmsnetworkformi).

6. Select a SKU from “Business Critical (Preview)” pricing tier.

    > [!NOTE]
    > Online migrations are supported only when using the “Business Critical (Preview)" tier. 
   
    For more information on costs and pricing tiers, see the [pricing page](https://aka.ms/dms-pricing).
   
    ![Create DMS Service](media\tutorial-sql-server-to-managed-instance-online\dms-create-service3.png)

7.  Select **Create** to create the service.

## Create a migration project

After an instance of the service is created, locate it within the Azure portal, open it, and then create a new migration project.

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.

    ![Locate all instances of the Azure Database Migration Service](media\tutorial-sql-server-to-managed-instance-online\dms-search.png)

2. On the **Azure Database Migration Service** screen, search for the name of the instance that you created, and then select the instance.
 
3. Select + **New Migration Project**.

4. On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **SQL Server**, in the **Target server type** text box, select **Azure SQL Database Managed Instance**, and then for **Choose type of activity**, select **Online data migration (preview)**.

   ![Create DMS Project](media\tutorial-sql-server-to-managed-instance-online\dms-create-project3.png)

5. Select **Create and run activity** to create the project.

## Specify source details

1. On the **Migration source detail** screen, specify the connection details for the source SQL Server.

2. If you haven't installed a trusted certificate on your server, select the **Trust server certificate** check box.

    When a trusted certificate isn't installed, SQL Server generates a self-signed certificate when the instance is started. This certificate is used to encrypt the credentials for client connections.

    > [!CAUTION]
    > SSL connections that are encrypted using a self-signed certificate does not provide strong security. They are susceptible to man-in-the-middle attacks. You should not rely on SSL using self-signed certificates in a production environment or on servers that are connected to the internet.

   ![Source Details](media\tutorial-sql-server-to-managed-instance-online\dms-source-details2.png)

3. Select **Save**.

## Specify target details

1.  On the **Migration target details** screen, specify the **Application ID** and **Key** that the DMS instance can use to connect to the target instance of Azure SQL Database Managed Instance and the Azure Storage Account.

    For more information, see the article [Use portal to create an Azure Active Directory application and service principal that can access resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal).
    
2. Select the **Subscription** containing the target instance of Azure SQL Database Managed Instance, and then select the target instance.

    If you haven't already provisioned the Azure SQL Database Managed Instance, select the [link](https://aka.ms/SQLDBMI) to help you provision the instance. When the instance of Azure SQL Database Managed Instance is ready, return to this specific project to execute the migration.

3. Provide **SQL User** and **Password** to connect to target instance of Azure SQL Database Managed Instance.

       ![Select Target](media\tutorial-sql-server-to-managed-instance-online\dms-target-details3.png)

2.  Select **Save**.

## Select source databases

1. On the **Select source databases** screen, select the source database that you want to migrate.

    ![Select source databases](media\tutorial-sql-server-to-managed-instance-online\dms-select-source-databases2.png)

2. Select **Save**.

## Configure migration settings
 
1. On the **Configure migration settings** screen, provide the following detail:

    | | |
    |--------|---------|
    |**SMB Network location share** | The local SMB network share that contains the Full database backup files and transaction log backup files that the Azure Database Migration Service can use for migration. The service account running the source SQL Server instance must have read\write privileges on this network share. Provide an FQDN or IP addresses of the server in the network share, for example, '\\\servername.domainname.com\backupfolder' or '\\\IP address\backupfolder'.|
    |**User name** | Make sure that the Windows user has full control privilege on the network share that you provided above. The Azure Database Migration Service will impersonate the user credential to upload the backup files to Azure storage container for restore operation. |
    |**Password** | Password for the user. |
    |**Subscription of the Azure Storage Account** | Select the subscription that contains the Azure Storage Account. |
    |**Azure Storage Account** | Select the Azure Storage Account that DMS can upload the backup files from the SMB network share to and use for database migration.  We recommend selecting the Storage Account in the same region as the DMS service for optimal file upload performance. |
    
    ![Configure Migration Settings](media\tutorial-sql-server-to-managed-instance-online\dms-configure-migration-settings4.png)

2. Select **Save**.
 
## Review the migration summary

1. On the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity.

2. Review and verify the details associated with the migration project.
 
    ![Migration project summary](media\tutorial-sql-server-to-managed-instance-online\dms-project-summary3.png)

## Run and monitor the migration

1. Select **Run migration**.

2. On the migration activity screen, select **Refresh** to update the display.
 
   ![Migration activity in progress](media\tutorial-sql-server-to-managed-instance-online\dms-monitor-migration2.png)

    You can further expand the databases and logins categories to monitor the migration status of the respective server objects.

   ![Migration activity in progress](media\tutorial-sql-server-to-managed-instance-online\dms-monitor-migration-extend2.png)

## Performing migration cutover

After the full database backup is restored on the target instance of Azure SQL Database Managed Instance, the database is available for performing a migration cutover.

1.	When you're ready to complete the online database migration, select **Start Cutover**.

2.	Stop all the incoming traffic to source databases.

3.	Take the [tail-log backup], make the backup file available in the SMB network share, and then wait until this final transaction log backup is restored.

    At that point, you'll see **Pending changes** set to 0.

4.	Select **Confirm**, and then select **Apply**.

    ![Preparing to complete cutover](media\tutorial-sql-server-to-managed-instance-online\dms-complete-cutover.png)

5.	When the database migration status shows **Completed**, connect your applications to the new target instance of  Azure SQL Database Managed Instance.

    ![Cutover complete](media\tutorial-sql-server-to-managed-instance-online\dms-cutover-complete.png)

## Next steps

- For a tutorial showing you how to migrate a database to a Managed Instance using the T-SQL RESTORE command, see [Restore a backup to a Managed Instance using the restore command](../sql-database/sql-database-managed-instance-restore-from-backup-tutorial.md).
- For information about Managed Instance, see [What is a Managed Instance](../sql-database/sql-database-managed-instance.md).
- For information about connecting apps to a Managed Instance, see [Connect applications](../sql-database/sql-database-managed-instance-connect-app.md).
