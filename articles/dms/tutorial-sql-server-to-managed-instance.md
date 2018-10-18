---
title: Use DMS to migrate to Azure SQL Database Managed Instance | Microsoft Docs
description: Learn to migrate from SQL Server on-premises to Azure SQL Database Managed Instance by using the Azure Database Migration Service.
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

# Migrate SQL Server to Azure SQL Database Managed Instance offline using DMS
You can use the Azure Database Migration Service to migrate the databases from an on-premises SQL Server instance to an [Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance.md). For additional methods that may require some manual effort, see the article [SQL Server instance migration to Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance-migrate.md).

In this tutorial, you migrate the **Adventureworks2012** database from an on-premises instance of SQL Server to an Azure SQL Database Managed Instance by using the Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project by using the Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.
> * Download a migration report.

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
- Create a network share that the Azure Database Migration Service can use to back up the source database.
- Ensure that the service account running the source SQL Server instance has write privileges on the network share that you created and that the computer account for the source server has read/write access to the same share.
- Make a note of a Windows user (and password) that has full control privilege on the network share that you previously created. The Azure Database Migration Service impersonates the user credential to upload the backup files to Azure storage container for restore operation.
- Create a blob container and retrieve its SAS URI by using the steps in the article [Manage Azure Blob Storage resources with Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container), be sure to select all permissions (Read, Write, Delete, List) on the policy window while creating the SAS URI. This detail provides the Azure Database Migration Service with access to your storage account container for uploading the backup files used for migrating databases to Azure SQL Database Managed Instance.

## Register the Microsoft.DataMigration resource provider

1. Sign in to the Azure portal, select **All services**, and then select **Subscriptions**.

    ![Show portal subscriptions](media\tutorial-sql-server-to-managed-instance\portal-select-subscriptions.png)        

2. Select the subscription in which you want to create the instance of the Azure Database Migration Service, and then select **Resource providers**.

    ![Show resource providers](media\tutorial-sql-server-to-managed-instance\portal-select-resource-provider.png)

3. Search for migration, and then to the right of **Microsoft.DataMigration**, select **Register**.

    ![Register resource provider](media\tutorial-sql-server-to-managed-instance\portal-register-resource-provider.png)   

## Create an Azure Database Migration Service instance

1. In the Azure portal, select + **Create a resource**, search for **Azure Database Migration Service**, and then select **Azure Database Migration Service** from the drop-down list.

     ![Azure Marketplace](media\tutorial-sql-server-to-managed-instance\portal-marketplace.png)

2. On the **Azure Database Migration Service** screen, select **Create**.

    ![Create Azure Database Migration Service instance](media\tutorial-sql-server-to-managed-instance\dms-create1.png)

3. On the **Create Migration Service** screen, specify a name for the service, the subscription, and a new or existing resource group.

4.	Select the location in which you want to create the instance of DMS.

5. Select an existing virtual network (VNET) or create one.
 
    The VNET provides the Azure Database Migration Service with access to the source SQL Server and target Azure SQL Database Managed Instance.

    For more information on how to create a VNET in Azure portal, see the article [Create a virtual network using the Azure portal](https://aka.ms/DMSVnet).

    For additional detail, see the article [Network topologies for Azure SQL DB Managed Instance migrations using the Azure Database Migration Service](https://aka.ms/dmsnetworkformi).

6. Select a pricing tier.

    For more information on costs and pricing tiers, see the [pricing page](https://aka.ms/dms-pricing).
   
    ![Create DMS Service](media\tutorial-sql-server-to-managed-instance\dms-create-service2.png)

7.  Select **Create** to create the service.

## Create a migration project

After an instance of the service is created, locate it within the Azure portal, open it, and then create a new migration project.

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.

    ![Locate all instances of the Azure Database Migration Service](media\tutorial-sql-server-to-managed-instance\dms-search.png)

2. On the **Azure Database Migration Service** screen, search for the name of the instance that you created, and then select the instance.
 
3. Select + **New Migration Project**.

4. On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **SQL Server**, in the **Target server type** text box, select **Azure SQL Database Managed Instance**, and then for **Choose type of activity**, select **Offline data migration**.

   ![Create DMS Project](media\tutorial-sql-server-to-managed-instance\dms-create-project2.png)

5. Select **Create** to create the project.

## Specify source details

1. On the **Migration source detail** screen, specify the connection details for the source SQL Server.

2. If you haven't installed a trusted certificate on your server, select the **Trust server certificate** check box.

    When a trusted certificate isn't installed, SQL Server generates a self-signed certificate when the instance is started. This certificate is used to encrypt the credentials for client connections.

    > [!CAUTION]
    > SSL connections that are encrypted using a self-signed certificate does not provide strong security. They are susceptible to man-in-the-middle attacks. You should not rely on SSL using self-signed certificates in a production environment or on servers that are connected to the internet.

   ![Source Details](media\tutorial-sql-server-to-managed-instance\dms-source-details1.png)

3. Select **Save**.

4. On the **Select source databases** screen, select the **Adventureworks2012** database for migration.

   ![Select Source Databases](media\tutorial-sql-server-to-managed-instance\dms-source-database1.png)

5. Select **Save**.

## Specify target details

1.  On the **Migration target details** screen, specify the connection details for the target, which is the pre-provisioned Azure SQL Database Managed Instance to which you're migrating the **AdventureWorks2012** database.

    If you haven't already provisioned the Azure SQL Database Managed Instance, select **No** for a link to help you provision the instance. You can still proceed with project creation and then, when the Azure SQL Database Managed Instance is ready, return to this specific project to execute the migration.   
 
       ![Select Target](media\tutorial-sql-server-to-managed-instance\dms-target-details2.png)

2.  Select **Save**.

## Select source databases

1. On the **Select source databases** screen, select the source database that you want to migrate.

    ![Select source databases](media\tutorial-sql-server-to-managed-instance\select-source-databases.png)

2. Select **Save**.

## Select logins
 
1. On the **Select logins** screen, select the logins that you want to migrate.

    >[!NOTE]
    >This release only supports migrating the SQL logins.

    ![Select logins](media\tutorial-sql-server-to-managed-instance\select-logins.png)

2. Select **Save**.
 
## Configure migration settings
 
1. On the **Configure migration settings** screen, provide the following detail:

    | | |
    |--------|---------|
    |**Choose source backup option** | Choose the option **I will provide latest backup files** when you already have full backup files available for DMS to use for database migration. Choose the option **I will let Azure Database Migration Service create backup files** when you want DMS to take the source database full backup at first and use it for migration. |
    |**Network location share** | The local SMB network share that the Azure Database Migration Service can take the source database backups to. The service account running source SQL Server instance must have write privileges on this network share. Provide an FQDN or IP addresses of the server in the network share, for example, '\\\servername.domainname.com\backupfolder' or '\\\IP address\backupfolder'.|
    |**User name** | Make sure that the Windows user has full control privilege on the network share that you provided above. The Azure Database Migration Service will impersonate the user credential to upload the backup files to Azure storage container for restore operation. If TDE-enabled databases are selected for migration, the above windows user must be the built-in administrator account and [User Account Control](https://docs.microsoft.com/windows/security/identity-protection/user-account-control/user-account-control-overview) must be disabled for Azure Database Migration Service to upload and delete the certificates files.) |
    |**Password** | Password for the user. |
    |**Storage account settings** | The SAS URI that provides the Azure Database Migration Service with access to your storage account container to which the service uploads the back-up files and that is used for migrating databases to Azure SQL Database Managed Instance. [Learn how to get the SAS URI for blob container](https://docs.microsoft.com/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container).|
    |**TDE Settings** | If you are migrating the source databases with Transparent Data Encryption (TDE) enabled, you need to have write privileges on the target Azure SQL Database Managed Instance.  Select the subscription in which the Azure SQL DB Managed Instance provisioned from the drop-down menu.  Select the target **Azure SQL Database Managed Instance** in the drop-down menu. |
    
    ![Configure Migration Settings](media\tutorial-sql-server-to-managed-instance\dms-configure-migration-settings3.png)

2. Select **Save**.
 
## Review the migration summary

1. On the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity.

2. Expand the **Validation option** section to display the **Choose validation option** screen, specify whether to validate the migrated database for query correctness, and then select **Save**.

3. Review and verify the details associated with the migration project.
 
    ![Migration project summary](media\tutorial-sql-server-to-managed-instance\dms-project-summary2.png)

4.  Select **Save**.   

## Run the migration

- Select **Run migration**.

  The migration activity window appears, and the status of the activity is **Pending**.

## Monitor the migration

1. In the migration activity screen, select **Refresh** to update the display.
 
   ![Migration activity in progress](media\tutorial-sql-server-to-managed-instance\dms-monitor-migration1.png)

    You can further expand the databases and logins categories to monitor the migration status of the respective server objects.

   ![Migration activity in progress](media\tutorial-sql-server-to-managed-instance\dms-monitor-migration-extend.png)

2. After the migration completes, select **Download report** to get a report listing the details associated with the migration process.
 
3. Verify that the target database on the target Azure SQL Database Managed Instance environment.

## Next steps

- For a tutorial showing you how to migrate a database to a Managed Instance using the T-SQL RESTORE command, see [Restore a backup to a Managed Instance using the restore command](../sql-database/sql-database-managed-instance-restore-from-backup-tutorial.md).
- For information about Managed Instance, see [What is a Managed Instance](../sql-database/sql-database-managed-instance.md).
- For information about connecting apps to a Managed Instance, see [Connect applications](../sql-database/sql-database-managed-instance-connect-app.md).