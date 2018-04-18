---
title: Use DMS to migrate to Azure SQL Database Managed Instance | Microsoft Docs
description: Learn to migrate from SQL Server on-premises to Azure SQL Database Managed Instance by using the Azure Database Migration Service.
services: dms
author: edmacauley
ms.author: edmaca
manager: craigg
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 04/10/2018
---

# Migrate SQL Server to Azure SQL Database Managed Instance using DMS
You can use the Azure Database Migration Service to migrate the databases from an on-premises SQL Server instance to an [Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance.md) with near-zero downtime. For additional methods that require some downtime, see [SQL Server instance migration to Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance-migrate.md).

In this tutorial, you migrate the **Adventureworks2012** database from an on-premises instance of SQL Server to an Azure SQL Database by using the Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an Azure Database Migration Service instance.
> * Create a migration project by using the Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.

## Prerequisites
To complete this tutorial, you need to:

- Create a VNET for the Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). [Learn network topologies for Azure SQL DB Managed Instance migrations using the Azure Database Migration Service](https://aka.ms/dmsnetworkformi).
- Ensure that your Azure Virtual Network (VNET) Network Security Group rules do not block the following communication ports 443, 53, 9354, 445, 12000. For more detail on Azure VNET NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-nsg).
- Configure your [Windows Firewall for source database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
- Open your Windows Firewall to allow the Azure Database Migration Service to access the source SQL Server, which by default is TCP port 1433.
- If you are running multiple named SQL Server instances using dynamic ports, you may wish to enable the SQL Browser Service and allow access to UDP port 1434 through your firewalls so that the Azure Database Migration Service can connect to a named instance on your source server.
- If you are using a firewall appliance in front of your source databases, you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration, as well as files via SMB port 445.
- Create an Azure SQL Database Managed Instance by following the detail in the article [Create an Azure SQL Database Managed Instance in the Azure portal](https://aka.ms/sqldbmi).
- Ensure that the logins used to connect the source SQL Server and target Managed Instance are members of the sysadmin server role.
- Create a network share that the Azure Database Migration Service can use to back up the source database.
- Ensure that the service account running the source SQL Server instance has write privileges on the network share that you created.
- Make a note of a Windows user (and password) that has full control privilege on the network share that you created above. The Azure Database Migration Service impersonates the user credential to upload the backup files to Azure storage container for restore operation.
- Create a blob container and retrieve its SAS URI by using the steps in the article [Manage Azure Blob Storage resources with Storage Explorer](https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container), be sure to select all permissions (Read, Write, Delete, List) on the policy window while creating the SAS URI. This provides the Azure Database Migration Service with access to your storage account container for uploading the backup files used for migrating databases to Azure SQL Database Managed Instance

## Register the Microsoft.DataMigration resource provider

1.  Log in to the Azure portal, select **All services**, and then select **Subscriptions**.
![Show portal subscriptions](media\tutorial-sql-server-to-managed-instance\portal-select-subscription.png)

1.  Select the subscription in which you want to create the instance of the Azure Database Migration Service, and then select **Resource providers**.
![Show resource providers](media\tutorial-sql-server-to-managed-instance\portal-select-resource-provider.png)

1.  Search for migration, and then to the right of **Microsoft.DataMigration**, select **Register**.
![Register resource provider](media\tutorial-sql-server-to-managed-instance\portal-register-resource-provider.png)    

## Create an Azure Database Migration Service instance

1.  In the Azure portal, select **+ Create a resource**, search for **Azure Database Migration Service**, and then select **Azure Database Migration Service** from the drop-down list.

     ![Azure Marketplace](media\tutorial-sql-server-to-managed-instance\portal-marketplace.png)

1.  On the **Azure Database Migration Service (preview)** screen, select **Create**.

    ![Create Azure Database Migration Service instance](media\tutorial-sql-server-to-managed-instance\dms-create.png)

1.  On the **Database Migration Service** screen, specify a name for the service, the subscription, Resource group, a virtual network, and the pricing tier.

    For more information on costs and pricing tiers, see the [pricing page](https://aka.ms/dms-pricing). *The Azure Database Migration Service is currently in preview, and you will not be charged.*

    **Network:** Select an existing or create a new VNET, which provides the Azure Database Migration Service with access to the source SQL Server and target Azure SQL Database Managed Instance. [Learn network topologies for Azure SQL DB Managed Instance migrations using the Azure Database Migration Service](https://aka.ms/dmsnetworkformi).

    For more information on how to create the VNET in Azure portal, see [Create a virtual network with multiple subnets using the Azure portal](https://aka.ms/DMSVnet).

    ![Create DMS Service](media\tutorial-sql-server-to-managed-instance\dms-create-service.png)

1.  Select **Create** to create the service.


## Create a migration project

After the service is created, locate it within the Azure portal and open it.

1.  Select **+ New Migration Project**.

1.  On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **SQL Server**, and then in the **Target server type** text box, select **Azure SQL Database Managed Instance**.

    ![Create DMS Project](media\tutorial-sql-server-to-managed-instance\dms-create-project.png)

1.  Select **Create** to create the project.

## Specify source details

1.  On the **Source details** screen, specify the connection details for the source SQL Server.

    ![Source Details](media\tutorial-sql-server-to-managed-instance\dms-source-details.png)

1.  Select **Save**, and then select the **Adventureworks2012** database for migration.

    ![Select Source Databases](media\tutorial-sql-server-to-managed-instance\dms-source-database.png)

## Specify target details

1.  Select **Save**, and then on the **Target details** screen, specify the connection details for the target, which is the pre-provisioned Azure SQL Database Managed Instance to which the **AdventureWorks2012** database will be migrated.

    ![Select Target](media\tutorial-sql-server-to-managed-instance\dms-target-details.png)

1.  Select **Save**.

1.  On the **Project summary** screen, review and verify the details associated with the migration project.

## Run the migration

1.  Select the recently saved project, select **+ New Activity**, and then select **Run migration**.

    ![Create New Activity](media\tutorial-sql-server-to-managed-instance\dms-create-new-activity.png)

1.  When prompted, enter the credentials of the source and the target servers, and then select **Save**.

1.  On the **Map to target databases** screen, select the source database(s) that you want to migrate.

    ![Select Source Databases](media\tutorial-sql-server-to-managed-instance\dms-select-source-databases.png)

1.  Select **Save**, on the **Configure migration settings** screen, provide the following detail:

    | | |
    |--------|---------|
    |**Server backup location** | The local network share that the Azure Database Migration Service can take the source database backups to. The service account running source SQL Server instance must have write privileges on this network share. |
    |**User name** | The windows user name that the Azure Database Migration Service can impersonate and upload the backup files to Azure storage container for restore operation. |
    |**Password** | Password for the above user. |
    |**Storage SAS URI** | SAS URI that provides the Azure Database Migration Service with access to your storage account container to which the service uploads the back-up files and that is used for migrating databases to Azure SQL Database Managed Instance. [Learn how to get the SAS URI for blob container](https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container).|
    
    ![Configure Migration Settings](media\tutorial-sql-server-to-managed-instance\dms-configure-migration-settings.png)

1.  Select **Save**, on the Migration summary screen, in the **Activity name** text box, specify a name for the migration activity.

    ![Migration Summary](media\tutorial-sql-server-to-managed-instance\dms-migration-summary.png)


## Monitor the migration

1.  Select the migration activity to review the status of the activity.

1.  After the migration completes, verify the target databases on the target Azure SQL Database Managed Instance.

    ![Monitor the Migration](media\tutorial-sql-server-to-managed-instance\dms-monitor-migration.png)

## Next steps

- For a tutorial showing you how to migrate a database to a Managed Instance using the T-SQL RESTORE command, see [Restore a backup to a Managed Instance using the restore command](../sql-database/sql-database-managed-instance-restore-from-backup-tutorial.md).
- For information about importing a database from a BACPAC file, see [Import a BACPAC file to a new Azure SQL Database](../sql-database/sql-database-import.md).
- For information about Managed Instance, see [What is a Managed Instance](../sql-database/sql-database-managed-instance.md).
- For information about connecting apps to a Managed Instance, see [Connect applications](../sql-database/sql-database-managed-instance-connect-app.md).
