---
title: "Tutorial: Migrate SQL Server to SQL Server on Azure Virtual Machines offline in Azure Data Studio"
titleSuffix: Azure Database Migration Service
description: Learn how to migrate on-premises SQL Server to SQL Server on Azure Virtual Machines offline by using Azure Data Studio and Azure Database Migration Service.
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

# Tutorial: Migrate SQL Server to SQL Server on Azure Virtual Machines offline in Azure Data Studio

You can use Azure Database Migration Service and the Azure SQL Migration extension in Azure Data Studio to migrate databases from an on-premises instance of SQL Server to [SQL Server on Azure Virtual Machines (SQL Server 2016 and later)](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview) offline and with minimal downtime.

For database migration methods that might require some manual configuration, see [SQL Server instance migration to SQL Server on Azure Virtual Machines](/azure/azure-sql/migration-guides/virtual-machines/sql-server-to-sql-on-azure-vm-migration-overview).

In this tutorial, you migrate the AdventureWorks database from an on-premises instance of SQL Server to an instance of SQL Server on Azure Virtual Machines by using Azure Data Studio and Azure Database Migration Service. You use the offline migration method.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> - Open the Migrate to Azure SQL wizard in Azure Data Studio
> - Run an assessment of your source SQL Server databases
> - Collect performance data from your source SQL Server instance
> - Get a recommendation of the SQL Server on Azure Virtual Machines SKU that will work best for your workload
> - Set the details of your source SQL Server instance, your backup location, and your target instance of SQL Server on Azure Virtual Machines
> - Create a new instance of Azure Database Migration Service
> - Start your migration and monitor the progress to completion

This article describes an offline migration from SQL Server to SQL Server on Azure Virtual Machines. For an online migration, see [Migrate SQL Server to SQL Server on Azure Virtual Machines online in Azure Data Studio](tutorial-sql-server-to-virtual-machine-online-ads.md).

## Prerequisites

Before you begin the tutorial:

- [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).
- [Install the Azure SQL Migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from Azure Data Studio Marketplace.
- Have an Azure account that is assigned to one of the following built-in roles:

  - Contributor for the target instance of SQL Server on Azure Virtual Machines and for the storage account where you upload your database backup files from a Server Message Block (SMB) network share.
  - Reader role for the Azure resource groups that contain the target instance of SQL Server on Azure Virtual Machines or for the Azure storage account.
  - Owner or Contributor role for the Azure subscription.
  
  As an alternative to using one of the preceding built-in roles, you can [assign a custom role](resource-custom-roles-sql-database-ads.md).

  > [!IMPORTANT]
  > An Azure account is required only when you configure the migration steps. An Azure account isn't required for the assessment or for Azure recommendation in the migration wizard in Azure Data Studio.

- Create a target instance of [SQL Server on Azure Virtual Machines](/azure/azure-sql/virtual-machines/windows/create-sql-vm-portal).

    > [!IMPORTANT]
    > If you have an existing Azure virtual machine, it should be registered with the [SQL IaaS Agent extension in Full management mode](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management#management-modes).

- Ensure that the logins that you use to connect the source SQL Server instance are members of the SYSADMIN server role or have CONTROL SERVER permission.

- Provide an SMB network share, Azure storage account file share, or Azure storage account blob container that contains your full database backup files and subsequent transaction log backup files. Database Migration Service uses the backup location during database migration.

  > [!IMPORTANT]
  >
  > - If your database backup files are in an SMB network share, [create an Azure storage account](../storage/common/storage-account-create.md) that Database Migration Service can use to upload database backup files to and to migrate databases. Make sure you create the Azure storage account in the same region where you create your instance of Database Migration Service.
  > - Database Migration Service doesn't initiate any backups. Instead, the service uses existing backups for the migration. You might already have these backups as part of your disaster recovery plan.
  > - You can write each backup to either a separate backup file or to multiple backup files. Appending multiple backups such as full and transaction logs into a single backup media isn't supported.
  > - You can provide compressed backups to reduce the likelihood of experiencing potential issues associated with migrating large backups.

- Ensure that the service account running the source SQL Server instance has read and write permissions on the SMB network share that contains database backup files.

- If you're migrating a database that's protected by Transparent Data Encryption (TDE), the certificate from the source SQL Server instance must be migrated to SQL Server on Azure Virtual Machines before you migrate data. To learn more, see [Move a TDE-protected database to another SQL Server instance](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server).

    > [!TIP]
    > If your database contains sensitive data that's protected by [Always Encrypted](/sql/relational-databases/security/encryption/configure-always-encrypted-using-sql-server-management-studio), the migration process automatically migrates your Always Encrypted keys to your target instance of SQL Server on Azure Virtual Machines.

- If your database backups are on a network file share, provide a computer on which you can install a [self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md) to access and migrate database backups. The migration wizard gives you the download link and authentication keys to download and install your self-hosted integration runtime.

   In preparation for the migration, ensure that the computer on which you will install the self-hosted integration runtime has the following outbound firewall rules and domain names enabled:

    | Domain names                                          | Outbound port | Description                |
    | ----------------------------------------------------- | -------------- | ---------------------------|
    | Public cloud: `{datafactory}.{region}.datafactory.azure.net`<br> or `*.frontend.clouddatahub.net` <br> Azure Government: `{datafactory}.{region}.datafactory.azure.us` <br> Azure China: `{datafactory}.{region}.datafactory.azure.cn` | 443            | Required by the self-hosted integration runtime to connect to Database Migration Service. <br>For a newly created data factory in a public cloud, locate the fully qualified domain name (FQDN) from your self-hosted integration runtime key, which is in the format `{datafactory}.{region}.datafactory.azure.net`. For an existing data factory, if you don't see the FQDN in your self-hosted integration key, use `*.frontend.clouddatahub.net` instead. |
    | `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you have disabled auto-update, you can skip configuring this domain. |
    | `*.core.windows.net`          | 443            | Used by the self-hosted integration runtime that connects to the Azure storage account to upload database backups from your network share |

    > [!TIP]
    > If your database backup files are already provided in an Azure storage account, a self-hosted integration runtime isn't required during the migration process.

- If you use a self-hosted integration runtime, make sure that the computer on which the runtime is installed can connect to the source SQL Server instance and the network file share where backup files are located.

- Outbound port 445 should be enabled to allow access to the network file share. For more information, see [recommendations for using a self-hosted integration runtime](migration-using-azure-data-studio.md#recommendations-for-using-a-self-hosted-integration-runtime-for-database-migrations).

- If you're using Azure Database Migration Service for the first time, make sure that the Microsoft.DataMigration resource provider is registered in your subscription. You can complete the steps to [register the resource provider](quickstart-create-data-migration-service-portal.md#register-the-resource-provider).

## Open the Migrate to Azure SQL wizard in Azure Data Studio

1. In Azure Data Studio, go to **Connections**. Select and connect to your on-premises instance of SQL Server. You also can connect to SQL Server on an Azure virtual machine.

1. Right-click the server connection and select **Manage**.

1. On the server's home page, under **General**, select the **Azure SQL Migration** extension.

1. In the Azure SQL Migration dashboard, select **Migrate to Azure SQL** to open the migration wizard.

    :::image type="content" source="media/tutorial-sql-server-to-virtual-machine-online-ads/launch-migrate-to-azure-sql-wizard.png" alt-text="Screenshot that shows how to open the Migrate to Azure SQL wizard.":::

1. In the first step of the migration wizard, link your existing or new Azure account to Azure Data Studio.

## Run a database assessment, collect performance data, and get Azure recommendations

1. Select the databases you want to assess, and then select **Next**.

1. For the target, select **SQL Server on Azure Virtual Machines**.

   :::image type="content" source="media/tutorial-sql-server-to-virtual-machine-offline-ads/assessment-complete-target-selection.png" alt-text="Screenshot that shows an assessment confirmation.":::

1. Select **View/Select** to view the assessment results.

1. Select the database, and then review the assessment report to make sure no issues were found.

1. Select **Get Azure recommendation** to open the recommendations panel.

1. Select the **Collect performance data now** option. Select a folder on your local computer to store the performance logs in, and then select **Start**.

   Azure Data Studio collects performance data until you either stop data collection or close Azure Data Studio.

1. After 10 minutes, Azure Data Studio indicates that a recommendation is available for SQL Server for Azure Virtual Machines. You can also select **Refresh recommendation** after the initial 10 minutes to refresh the recommendation with more data that's collected.

1. Go to your Azure SQL target section. With **SQL Server on Azure Virtual Machines** selected, select **View details** to open the detailed SKU recommendation report. You can also select **Save recommendation report** at the bottom of this pane for later analysis.

1. Close the recommendations pane. Select **Next** to continue with your migration.

## Configure migration settings

1. To set your target, select your subscription, location, and resource group in the corresponding dropdowns. Select **Next**.

1. For the migration mode, select **Offline migration**, and then select **Next**.

    > [!NOTE]
    > In offline migration mode, the source SQL Server database shouldn't be used for write activity while database backup files are restored on the target instance of Azure SQL Database. Application downtime persists from the start of the migration process until it's finished.
  
1. Select the location of your database backups. Your database backups can be located either on an on-premises network share or in an Azure storage blob container.

    > [!NOTE]
    > If your database backups are provided in an on-premises network share, you must set up a self-hosted integration runtime in the next step of the wizard. A self-hosted integration runtime is required to access your source database backups, check the validity of the backup set, and upload backups to Azure storage account.
    >
    > If your database backups are already in an Azure storage blob container, you don't need to set up a self-hosted integration runtime.
  
   For backups that are located on a network share, enter or select the following information in the corresponding dropdowns:

    |Field    |Description  |
    |---------|-------------|
    |**Source Credentials - Username**    |The credential (Windows and SQL authentication) to connect to the source SQL Server instance and validate the backup files.         |
    |**Source Credentials - Password**    |The credential (Windows and SQL authentication) to connect to the source SQL Server instance and validate the backup files.         |
    |**Network share location that contains backups**     |The network share location that contains the full and transaction log backup files. Any invalid files or backup files in the network share that don't belong to the valid backup set are automatically ignored during the migration process.        |
    |**Windows user account with read access to the network share location**     |The Windows credential (username) that has read access to the network share to retrieve the backup files.       |
    |**Password**     |The Windows credential (password) that has read access to the network share to retrieve the backup files.         |
    |**Target database name** |You can modify the target database name during the migration process.            |

    For backups that are stored in an Azure storage blob container, enter or select the following information in the corresponding dropdowns:

    |Field    |Description  |
    |---------|-------------|
    |**Target database name** |You can modify the target database name during the migration process.            |
    |**Storage account details** |The resource group, storage account, and container where backup files are located.  
    |**Last Backup File** |The file name of the last backup of the database you're migrating.

    > [!IMPORTANT]
    > If loopback check functionality is enabled and the source SQL Server and file share are on the same computer, the source won't be able to access the file share by using the FQDN. To fix this issue, [disable loopback check functionality](https://support.microsoft.com/help/926642/error-message-when-you-try-to-access-a-server-locally-by-using-its-fqd).

## Create a Database Migration Service instance

1. Create a new instance of Azure Database Migration Service or reuse an existing instance that you created earlier.

   > [!NOTE]
   > If you previously created a Database Migration Service instance by using the Azure portal, you can't reuse the instance in the migration wizard in Azure Data Studio. You can reuse an instance only if you created the instance by using Azure Data Studio.

1. Select the resource group where you have an existing instance of Database Migration Service, or create a new resource group. The **Azure Database Migration Service** dropdown lists any existing instance of Database Migration Service in the selected resource group.

1. To reuse an existing instance of Database Migration Service, select the instance in the dropdown list. Select **Next** to view the summary screen. When you're ready to start the migration, press **Start migration**.

1. To create a new instance of Database Migration Service, select **Create new**. In **Create Azure Database Migration Service**, enter a name for your Database Migration Service instance, and then select **Create**.  

1. After you successfully create a new Database Migration Service  instance, you're prompted to set up an integration runtime.

   Select **Download and install integration runtime** to open the download link in a web browser. Complete the download. Install the integration runtime on a machine that meets the prerequisites of connecting to the source SQL Server instance.

1. When installation is finished, Microsoft Integration Runtime Configuration Manager automatically opens to begin the registration process.  

1. Copy one of the authentication keys that are provided in the wizard and paste it in Azure Data Studio. If the authentication key is valid, a green check icon is displayed in Integration Runtime Configuration Manager. A green check indicates that you can continue to **Register**.  

1. When registering the self-hosted integration runtime is finished, close Microsoft Integration Runtime Configuration Manager and return to the migration wizard in Azure Data Studio.

1. In **Create Azure Database Migration Service** in Azure Data Studio, select **Test connection**  to validate that the newly created Database Migration Service instance is connected to the newly registered self-hosted integration runtime.

    :::image type="content" source="media/tutorial-sql-server-to-virtual-machine-offline-ads/test-connection-integration-runtime-complete.png" alt-text="Test connection integration runtime":::

1. Review the summary and select **Done** to start the database migration.

## Monitor your migration

1. In **Database Migration Status**, you can track the migrations that are in progress, completed, and failed (if any).

    :::image type="content" source="media/tutorial-sql-server-to-virtual-machine-offline-ads/monitor-migration-dashboard.png" alt-text="monitor migration dashboard":::

1. Select **Database migrations in progress** to view ongoing migrations. To get more information about a specific migration, select the database name.

1. The migration details page displays the backup files and their corresponding status:

    | Status | Description |
    |--------|-------------|
    | Arrived | The backup file arrived in the source backup location and was validated. |
    | Uploading | The integration runtime is uploading the backup file to Azure storage. |
    | Uploaded | The backup file has been uploaded to Azure storage. |
    | Restoring | Database Migration Service is restoring the backup file to SQL Server on Azure Virtual Machines. |
    | Restored | The backup file was successfully restored on SQL Server on Azure Virtual Machines. |
    | Canceled | The migration process was canceled. |
    | Ignored | The backup file was ignored because it doesn't belong to a valid database backup chain. |

After all database backups are restored on the instance of SQL Server on Azure Virtual Machines, an automatic migration cutover is initiated by Database Migration Service to ensure that the migrated database is ready for use and the migration status changes from **In progress** to **Succeeded**.

## Next steps

- Complete a tutorial that [migrates a database to SQL Managed Instance by using the T-SQL RESTORE command](/azure/azure-sql/managed-instance/restore-sample-database-quickstart).
- Learn more about [SQL Server on Azure Windows Virtual Machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview).
-Learn how to [connect apps to SQL Server on Azure Virtual Machines](/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql).
