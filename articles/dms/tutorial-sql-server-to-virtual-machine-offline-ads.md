---
title: "Tutorial: Migrate SQL Server to SQL Server on Azure Virtual Machines offline using Azure Data Studio"
titleSuffix: Azure Database Migration Service
description: Migrate SQL Server to an SQL Server on Azure Virtual Machines offline using Azure Data Studio with Azure Database Migration Service
services: dms
author: kbarlett001
ms.author: kebarlet
manager: 
ms.reviewer: cawrites
ms.service: dms
ms.workload: data-services
ms.custom: "seo-lt-2019"
ms.topic: tutorial
ms.date: 10/05/2021
---

# Tutorial: Migrate SQL Server to SQL Server on Azure Virtual Machines offline using Azure Data Studio with Database Migration Service

Use the Azure SQL Migration extension in Azure Data Studio to migrate the databases from a SQL Server instance to a [SQL Server on Azure Virtual Machines (SQL Server 2016 and above)](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview) with minimal downtime. For methods that may require some manual effort, see the article [SQL Server instance migration to SQL Server on Azure Virtual Machines](/azure/azure-sql/migration-guides/virtual-machines/sql-server-to-sql-on-azure-vm-migration-overview).

In this tutorial, you migrate the **AdventureWorks** database from an on-premises instance of SQL Server to a SQL Server on Azure Virtual Machines with the offline migration method by using Azure Data Studio with Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> - Open the Migrate to Azure SQL wizard in Azure Data Studio
> - Run an assessment of your source SQL Server databases
> - Collect performance data from your source SQL Server instance
> - Get a recommendation of the SQL Server on Azure Virtual Machines SKU that will work best for your workload
> - Set the details of your source SQL Server instance, backup location, and target SQL Server instance on an Azure virtual machine
> - Create a new instance of Azure Database Migration Service
> - Start your migration and monitor the progress to completion

This article describes an offline migration from SQL Server to a SQL Server on Azure Virtual Machines. For an online migration, see [Migrate SQL Server to a SQL Server on Azure Virtual Machines online using Azure Data Studio with Database Migration Service](tutorial-sql-server-to-virtual-machine-online-ads.md).

## Prerequisites

Before you begin the tutorial:

- [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).
- [Install the Azure SQL Migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from Azure Data Studio Marketplace.
- Have an Azure account that is assigned to one of the built-in roles listed below:

    - Contributor for the target SQL Server on Azure Virtual Machines (and Storage Account to upload your database backup files from SMB network share).
    - Reader role for the Azure Resource Groups containing the target SQL Server on Azure Virtual Machines or the Azure storage account.
    - Owner or Contributor role for the Azure subscription.
    - As an alternative to using the above built-in roles you can assign a custom role as defined in [this article.](resource-custom-roles-sql-db-virtual-machine-ads.md)

    > [!IMPORTANT]
    > Azure account is only required when configuring the migration steps and is not required for assessment or Azure recommendation steps in the migration wizard.

- Create a target [SQL Server on Azure Virtual Machines](/azure/azure-sql/virtual-machines/windows/create-sql-vm-portal).

    > [!IMPORTANT]
    > If you have an existing Azure Virtual Machine, it should be registered with [SQL IaaS Agent extension in Full management mode](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management#management-modes).

- Ensure that the logins used to connect the source SQL Server are members of the *sysadmin* server role or have `CONTROL SERVER` permission. 
- Use one of the following storage options for the full database and transaction log backup files: 

    - SMB network share 
    - Azure storage account file share or blob container 

    > [!IMPORTANT]
    > - If your database backup files are provided in an SMB network share, [Create an Azure storage account](../storage/common/storage-account-create.md) that allows the Database Migration Service service to upload the database backup files.  Make sure to create the Azure Storage Account in the same region as the Azure Database Migration Service instance is created.
    > - Azure Database Migration Service does not initiate any backups, and instead uses existing backups, which you may already have as part of your disaster recovery plan, for the migration.
    > - Each backup can be written to either a separate backup file or multiple backup files. However, appending multiple backups (i.e. full and t-log) into a single backup media is not supported. 
    > - Use compressed backups to reduce the likelihood of experiencing potential issues associated with migrating large backups.

- Ensure that the service account running the source SQL Server instance has read and write permissions on the SMB network share that contains database backup files.
- The source SQL Server instance certificate from a database protected by Transparent Data Encryption (TDE) needs to be migrated to SQL Server on Azure Virtual Machines before migrating data. To learn more, see [Move a TDE Protected Database to Another SQL Server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server).

    > [!TIP]
    > If your database contains sensitive data that is protected by [Always Encrypted](/sql/relational-databases/security/encryption/configure-always-encrypted-using-sql-server-management-studio), migration process using Azure Data Studio with Database Migration Service will automatically migrate your Always Encrypted keys to your target SQL Server on Azure Virtual Machines.

- If your database backups are in a network file share, provide a machine to install [self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md) to access and migrate database backups. The migration wizard provides the download link and authentication keys to download and install your self-hosted integration runtime. In preparation for the migration, ensure that the machine where you plan to install the self-hosted integration runtime has the following outbound firewall rules and domain names enabled:

    | Domain names                                          | Outbound ports | Description                |
    | ----------------------------------------------------- | -------------- | ---------------------------|
    | Public Cloud: `{datafactory}.{region}.datafactory.azure.net`<br> or `*.frontend.clouddatahub.net` <br> Azure Government: `{datafactory}.{region}.datafactory.azure.us` <br> China: `{datafactory}.{region}.datafactory.azure.cn` | 443            | Required by the self-hosted integration runtime to connect to the Data Migration service. <br>For new created Data Factory in public cloud, locate the FQDN from your Self-hosted Integration Runtime key, which is in format `{datafactory}.{region}.datafactory.azure.net`. For old Data factory, if you don't see the FQDN in your Self-hosted Integration key, use *.frontend.clouddatahub.net instead. |
    | `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you have disabled auto-update, you can skip configuring this domain. |
    | `*.core.windows.net`          | 443            | Used by the self-hosted integration runtime that connects to the Azure storage account for uploading database backups from your network share |

    > [!TIP]
    > If your database backup files are already provided in an Azure storage account, self-hosted integration runtime is not required during the migration process.

- When using self-hosted integration runtime, make sure that the machine where the runtime is installed can connect to the source SQL Server instance and the network file share where backup files are located. Outbound port 445 should be enabled to allow access to the network file share. Also see [recommendations for using self-hosted integration runtime](migration-using-azure-data-studio.md#recommendations-for-using-self-hosted-integration-runtime-for-database-migrations)
- If you're using Azure Database Migration Service for the first time, make sure that the Microsoft.DataMigration resource provider is registered in your subscription. You can complete the steps to [register the resource provider](quickstart-create-data-migration-service-portal.md#register-the-resource-provider).

## Open the Migrate to Azure SQL wizard in Azure Data Studio

1. In Azure Data Studio, go to the connections section. Select and connect to your on-premises instance of SQL Server. You also can connect to SQL Server on an Azure virtual machine.

1. Right-click the server connection and select **Manage**.

1. On the server's home page, under **General**, select the **Azure SQL Migration** extension.

1. In the Azure SQL Migration dashboard, select **Migrate to Azure SQL** to launch the migration wizard.

    :::image type="content" source="media/tutorial-sql-server-to-virtual-machine-online-ads/launch-migrate-to-azure-sql-wizard.png" alt-text="Launch Migrate to Azure SQL wizard":::

1. In the first step of the migration wizard, link your existing or new Azure account to Azure Data Studio.

## Run database assessment, collect performance data, and get right-sized recommendations

1. Select the databases to run the assessment on, and then select **Next**.

1. For the target, select **SQL Server on Azure Virtual Machines**.

   :::image type="content" source="media/tutorial-sql-server-to-virtual-machine-offline-ads/assessment-complete-target-selection.png" alt-text="Assessment confirmation":::

1. Select **View/Select** to view the assessment results.

1. Select the database, and then review the assessment report to make sure that no issues were found.

1. Select **Get Azure recommendation** to open the recommendations panel.

1. Select the **Collect performance data now** option. Then select a folder on your local computer to store the performance logs in. Then select **Start**.

   Azure Data Studio collects performance data until you either stop the collection or close Azure Data Studio.

1. After 10 minutes, Azure Data Studio displays **recommendation available** for your Azure SQL Server virtual machine. You can also select **Refresh recommendation** after the initial 10 minutes to refresh the recommendation with more data that's collected.

1. Go to your Azure SQL target section. With **SQL Server on Azure Virtual Machines** selected, select **View details** to open the detailed SKU recommendation report. You can also select  **Save recommendation report** at the bottom of this page for later analysis.

1. Close the recommendations page. Select **Next** to continue with your migration.

## Configure migration settings

1. Specify your target as SQL Server on Azure Virtual Machines by selecting your subscription, location, and resource group in the corresponding dropdowns. Then select **Next**.

1. For the migration mode, select **Offline migration**, and then select **Next**.

    > [!NOTE]
    > In offline migration mode, the source SQL Server database shouldn't be used for write activity while database backup files are restored on the target Azure SQL database. Application downtime persists through the start until the completion of the migration process.
  
1. Select the location of your database backups. Your database backups can either be located on an on-premises network share or in an Azure storage blob container.

    > [!NOTE]
    > If your database backups are provided in an on-premises network share, Database Migration Service will require you to setup self-hosted integration runtime in the next step of the wizard. Self-hosted integration runtime is required to access your source database backups, check the validity of the backup set and upload them to Azure storage account.
    >
    > If your database backups are already on an Azure storage blob container, you do not need to set up self-hosted integration runtime.
  
   For backups located on a network share, provide the below details of your source SQL Server instance, source backup location, target database name, and Azure storage account for the backup files to be uploaded to.

    |Field    |Description  |
    |---------|-------------|
    |**Source Credentials - Username**    |The credential (Windows / SQL authentication) to connect to the source SQL Server instance and validate the backup files.         |
    |**Source Credentials - Password**    |The credential (Windows / SQL authentication) to connect to the source SQL Server instance and validate the backup files.         |
    |**Network share location that contains backups**     |The network share location that contains the full and transaction log backup files. Any invalid files or backups files in the network share that don't belong to the valid backup set will be automatically ignored during the migration process.        |
    |**Windows user account with read access to the network share location**     |The Windows credential (username) that has read access to the network share to retrieve the backup files.       |
    |**Password**     |The Windows credential (password) that has read access to the network share to retrieve the backup files.         |
    |**Target database name** |The target database name can be modified if you wish to change the database name on the target during the migration process.            |

    For backups stored in an Azure storage blob container, specify the below details of the **Target database name**, **Resource group**, **Azure storage account**, **Blob container** and **Last backup file from** the corresponding drop-down lists.

    |Field    |Description  |
    |---------|-------------|
    |**Target database name** |The target database name can be modified if you wish to change the database name on the target during the migration process.            |
    |**Storage account details** |The resource group, storage account and container where backup files are located.  
    |**Last Backup File** |The file name of the last backup of the database that you're migrating.

    > [!IMPORTANT]
    > If loopback check functionality is enabled and the source SQL Server and file share are on the same computer, then source won't be able to access the files hare using FQDN. To fix this issue, [disable loopback check functionality](https://support.microsoft.com/help/926642/error-message-when-you-try-to-access-a-server-locally-by-using-its-fqd).

## Create a Database Migration Service instance

1. Create a new instance of Azure Database Migration Service or reuse an existing instance that you created earlier.

   > [!NOTE]
   > If you previously created a Database Migration Service instance by using the Azure portal, you can't reuse the instance in the migration wizard in Azure Data Studio. You can reuse an instance only if you created the instance by using Azure Data Studio.

1. Select the resource group where you have an existing instance of Database Migration Service, or create a new resource group. The **Azure Database Migration Service** dropdown lists any existing instance of Database Migration Service in the selected resource group.

1. To reuse an existing instance of Database Migration Service, select the instance in the dropdown list. Then select **Next** to view the summary screen. When you're ready to start the migration, press **Start migration**.
1. To create a new instance of Database Migration Service, select **Create new**. In **Create Azure Database Migration Service**, enter a name for your Database Migration Service instance, and then select **Create**.  

1. After you successfully create a new Database Migration Service  instance, you're prompted to set up an integration runtime.

   Select **Download and install integration runtime** to open the download link in a web browser. Complete the download. Install the integration runtime on a machine that meets the prerequisites of connecting to the source SQL Server instance.

1. When installation is finished, Microsoft Integration Runtime Configuration Manager automatically opens to begin the registration process.  

1. Copy one of the authentication keys that are provided in the wizard and paste it in Azure Data Studio. If the authentication key is valid, a green check icon is displayed in Integration Runtime Configuration Manager. A green check indicates that you can continue to **Register**.  

1. When registering the self-hosted integration runtime is finished, close Microsoft Integration Runtime Configuration Manager and return to the migration wizard in Azure Data Studio.

1. In **Create Azure Database Migration Service** in Azure Data Studio, select **Test connection**  to validate that the newly created Database Migration Service instance is connected to the newly registered self-hosted integration runtime. Select **Done**.

    :::image type="content" source="media/tutorial-sql-server-to-virtual-machine-offline-ads/test-connection-integration-runtime-complete.png" alt-text="Test connection integration runtime":::

1. Review the summary and select **Done** to start the database migration.

## Monitor your migration

1. In **Database Migration Status**, you can track the migrations that are in progress, completed, and failed (if any).

    :::image type="content" source="media/tutorial-sql-server-to-virtual-machine-offline-ads/monitor-migration-dashboard.png" alt-text="monitor migration dashboard":::

1. Select **Database migrations in progress** to view ongoing migrations and to see details.

1. The migration details page displays the backup files and their corresponding status:

    | Status | Description |
    |--------|-------------|
    | Arrived | Backup file arrived in the source backup location and validated |
    | Uploading | Integration runtime is currently uploading the backup file to Azure storage|
    | Uploaded | Backup file is uploaded to Azure storage |
    | Restoring | Azure Database Migration Service is currently restoring the backup file to SQL Server on Azure Virtual Machines|
    | Restored | Backup file is successfully restored on SQL Server on Azure Virtual Machines |
    | Canceled | Migration process was canceled |
    | Ignored | Backup file was ignored as it doesn't belong to a valid database backup chain |

After all database backups are restored on the SQL Server instance on the Azure virtual machine, an automatic migration cutover is initiated by Database Migration Service to ensure that the migrated database is ready for use and the migration status changes from **In progress** to **Succeeded**.

## Next steps

- For a tutorial showing you how to migrate a database to SQL Server on Azure Virtual Machines using the T-SQL RESTORE command, see [Migrate a SQL Server database to SQL Server on a virtual machine](/azure/azure-sql/virtual-machines/windows/migrate-to-vm-from-sql-server).
- For information about SQL Server on Azure Virtual Machines, see [Overview of SQL Server on Azure Windows Virtual Machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview).
- For information about connecting apps to SQL Server on Azure Virtual Machines, see [Connect applications](/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql).
