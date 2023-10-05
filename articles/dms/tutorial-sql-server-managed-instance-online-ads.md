---
title: "Tutorial: Migrate SQL Server to Azure SQL Managed Instance online by using Azure Data Studio"
titleSuffix: Azure Database Migration Service
description: Learn how to migrate on-premises SQL Server to Azure SQL Managed Instance only by using Azure Data Studio and Azure Database Migration Service.
author: croblesm
ms.author: roblescarlos
ms.reviewer: cawrites
ms.date: 06/07/2023
ms.service: dms
ms.topic: tutorial
ms.custom:
  - seo-lt-2019
  - sql-migration-content
---

# Tutorial: Migrate SQL Server to Azure SQL Managed Instance online in Azure Data Studio

Use the Azure SQL migration extension in Azure Data Studio to migrate database(s) from a SQL Server instance to an [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) with minimal downtime. For methods that might require some manual effort, see the article [SQL Server instance migration to Azure SQL Managed Instance](/azure/azure-sql/migration-guides/managed-instance/sql-server-to-managed-instance-guide).

In this tutorial, you migrate the **AdventureWorks** database from an on-premises instance of SQL Server to Azure SQL Managed Instance with minimal downtime by using Azure Data Studio with Azure Database Migration Service (DMS). This tutorial focuses on the online migration mode where application downtime is limited to a short cutover at the end of the migration.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Launch the *Migrate to Azure SQL* wizard in Azure Data Studio
> * Run an assessment of your source SQL Server database(s)
> * Collect performance data from your source SQL Server
> * Get a recommendation of the Azure SQL Managed Instance SKU best suited for your workload
> * Specify details of your source SQL Server, backup location and your target Azure SQL Managed Instance
> * Create a new Azure Database Migration Service and install the self-hosted integration runtime to access source server and backups
> * Start and monitor the progress for your migration
> * Perform the migration cutover when you are ready

> [!IMPORTANT]
> Prepare for migration and reduce the duration of the online migration process as much as possible to minimize the risk of interruption caused by instance reconfiguration or planned maintenance. In case of such an event, migration process will start from the beginning. In case of planned maintenance, there is a grace period of 36 hours where the target Azure SQL Managed Instance configuration or maintenance will be held before migration process is restarted.

[!INCLUDE [online-offline](../../includes/database-migration-service-offline-online.md)]

This article describes an online database migration from SQL Server to Azure SQL Managed Instance. For an offline database migration, see [Migrate SQL Server to a SQL Managed Instance offline using Azure Data Studio with DMS](tutorial-sql-server-managed-instance-offline-ads.md).

## Prerequisites

To complete this tutorial, you need to:

* [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio)
* [Install the Azure SQL migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from the Azure Data Studio marketplace
* Have an Azure account that is assigned to one of the built-in roles listed below:
    - Contributor for the target Azure SQL Managed Instance (and Storage Account to upload your database backup files from SMB network share).
    - Reader role for the Azure Resource Groups containing the target Azure SQL Managed Instance or the Azure storage account.
    - Owner or Contributor role for the Azure subscription (required if creating a new DMS service).
    - As an alternative to using the above built-in roles you can assign a custom role as defined in [this article.](resource-custom-roles-sql-db-managed-instance-ads.md)
    > [!IMPORTANT]
    > Azure account is only required when configuring the migration steps and is not required for assessment or Azure recommendation steps in the migration wizard.
* Create a target [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-create-quickstart).
* Ensure that the logins used to connect the source SQL Server are members of the *sysadmin* server role or have `CONTROL SERVER` permission. 
* Use one of the following storage options for the full database and transaction log backup files: 
    - SMB network share 
    - Azure storage account file share or blob container 

    > [!IMPORTANT]
    > - The Azure SQL Migration extension for Azure Data Studio doesn't take database backups, or neither initiate any database backups on your behalf. Instead, the service uses existing database backup files for the migration.
    > - If your database backup files are provided in an SMB network share, [Create an Azure storage account](../storage/common/storage-account-create.md) that allows the DMS service to upload the database backup files.  Make sure to create the Azure Storage Account in the same region as the Azure Database Migration Service instance is created.
    > - Each backup can be written to either a separate backup file or multiple backup files. However, appending multiple backups (that is, full and t-log) into a single backup media isn't supported. 
    > - Use compressed backups to reduce the likelihood of experiencing potential issues associated with migrating large backups.
* Ensure that the service account running the source SQL Server instance has read and write permissions on the SMB network share that contains database backup files.
* The source SQL Server instance certificate from a database protected by Transparent Data Encryption (TDE) needs to be migrated to the target Azure SQL Managed Instance or SQL Server on Azure virtual machine before you migrate data. For more information about migrating TDE-enabled databases, see [Tutorial: Migrate TDE-enabled databases (preview) to Azure SQL in Azure Data Studio](./tutorial-transparent-data-encryption-migration-ads.md).
    > [!TIP]
    > If your database contains sensitive data that is protected by [Always Encrypted](/sql/relational-databases/security/encryption/configure-always-encrypted-using-sql-server-management-studio), the migration process that uses Azure Data Studio with DMS will automatically migrate your Always Encrypted keys to your target Azure SQL Managed Instance or SQL Server on Azure virtual machine.

* If your database backups are in a network file share, provide a machine to install [self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md) to access and migrate database backups. The migration wizard provides the download link and authentication keys to download and install your self-hosted integration runtime. In preparation for the migration, ensure that the machine where you plan to install the self-hosted integration runtime has the following outbound firewall rules and domain names enabled:

    | Domain names                                          | Outbound ports | Description                |
    | ----------------------------------------------------- | -------------- | ---------------------------|
    | Public Cloud: `{datafactory}.{region}.datafactory.azure.net`<br> or `*.frontend.clouddatahub.net` <br> Azure Government: `{datafactory}.{region}.datafactory.azure.us` <br> China: `{datafactory}.{region}.datafactory.azure.cn` | 443    | Required by the self-hosted integration runtime to connect to the Data Migration service. <br>For a newly created data factory in the public cloud, locate the FQDN from your self-hosted integration runtime key, which is in format `{datafactory}.{region}.datafactory.azure.net`. For the old data factory, if you don't see the FQDN in your self-hosted integration key, use *.frontend.clouddatahub.net instead. |
    | `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you have disabled autoupdate, you can skip configuring this domain. |
    | `*.core.windows.net`          | 443            | Used by the self-hosted integration runtime that connects to the Azure storage account for uploading database backups from your network share |

    > [!TIP]
    > If your database backup files are already provided in an Azure storage account, a self-hosted integration runtime is not required during the migration process.

* When you're using a self-hosted integration runtime, make sure that the machine where the runtime is installed can connect to the source SQL Server instance and the network file share where backup files are located. Outbound port 445 should be enabled to allow access to the network file share. Also see [recommendations for using a self-hosted integration runtime](migration-using-azure-data-studio.md#recommendations-for-using-a-self-hosted-integration-runtime-for-database-migrations)
* If you're using the Azure Database Migration Service for the first time, ensure that Microsoft.DataMigration resource provider is registered in your subscription. You can follow the steps to [register the resource provider](quickstart-create-data-migration-service-portal.md#register-the-resource-provider)

## Launch the Migrate to Azure SQL wizard in Azure Data Studio

1. Open Azure Data Studio and select the server icon to connect to your on-premises SQL Server (or SQL Server on Azure virtual machine).
1. On the server connection, right-click and select **Manage**.
1. On the server's home page, select **Azure SQL Migration** extension.
1. On the Azure SQL Migration dashboard, select **Migrate to Azure SQL** to launch the migration wizard.
    :::image type="content" source="media/tutorial-sql-server-to-managed-instance-online-ads/launch-migrate-to-azure-sql-wizard.png" alt-text="Launch Migrate to Azure SQL wizard":::
1. The first page of the wizard allows you to start a new session or resume a previously saved one. Pick the first option to start a new session.
## Run database assessment, collect performance data and get Azure recommendation

1. Select the database(s) to run assessment and select **Next**.
1. Select Azure SQL Managed Instance as the target.
    :::image type="content" source="media/tutorial-sql-server-to-managed-instance-online-ads/assessment-complete-target-selection.png" alt-text="Assessment confirmation":::
1. Select on the **View/Select** button to view details of the assessment results for your database(s), select the database(s) to migrate, and select **OK**. If any issues are displayed in the assessment results, they need to be remediated before proceeding with the next steps.
    :::image type="content" source="media/tutorial-sql-server-to-managed-instance-online-ads/assessment-issues-details.png" alt-text="Database assessment details":::
1. Select the **Get Azure recommendation** button.
2. Pick the **Collect performance data now** option and enter a path for performance logs to be collected and select the **Start** button.
3. Azure Data Studio will now collect performance data until you either stop the collection, press the **Next** button in the wizard or close Azure Data Studio.
4. After 10 minutes you see a recommended configuration for your Azure SQL Managed Instance. You can also press the **Refresh recommendation** link after the initial 
10 minutes to refresh the recommendation with the extra data collected.
5. In the above **Azure SQL Managed Instance*** box, select the **View details** button for more information about your recommendation. 
6. Close the view details box and press the **Next** button.

## Configure migration settings

1. Specify your **Azure SQL Managed Instance** by selecting your subscription, location, resource group from the corresponding drop-down lists and then select **Next**.
1. Select **Online migration** as the migration mode.
    > [!NOTE]
    > In the online migration mode, the source SQL Server database can be used for read and write activity while database backups are continuously restored on target Azure SQL Managed Instance. Application downtime is limited to duration for the cutover at the end of migration.
1. Select the location of your database backups. Your database backups can either be located on an on-premises network share or in an Azure storage blob container.
    > [!NOTE]
    > If your database backups are provided in an on-premises network share, DMS will require you to set up a self-hosted integration runtime in the next step of the wizard. If a self-hosted integration runtime is required to access your source database backups, check the validity of the backup set and upload them to your Azure storage account.<br/> If your database backups are already on an Azure storage blob container, you don't need to set up a self-hosted integration runtime.

- For backups located on a network share, provide the following details of your source SQL Server, source backup location, target database name, and Azure storage account for the backup files to be uploaded to:

    |Field    |Description  |
    |---------|-------------|
    |**Source Credentials - Username**    |The credential (Windows / SQL authentication) to connect to the source SQL Server instance and validate the backup files.         |
    |**Source Credentials - Password**    |The credential (Windows / SQL authentication) to connect to the source SQL Server instance and validate the backup files.         |
    |**Network share location that contains backups**     |The network share location that contains the full and transaction log backup files. Any invalid files or backups files in the network share that don't belong to the valid backup set will be automatically ignored during the migration process.        |
    |**Windows user account with read access to the network share location**     |The Windows credential (username) that has read access to the network share to retrieve the backup files.       |
    |**Password**     |The Windows credential (password) that has read access to the network share to retrieve the backup files.         |
    |**Target database name** |The target database name can be modified if you wish to change the database name on the target during the migration process.            |
    |**Storage account details** |The resource group and storage account where backup files are uploaded to. You don't need to create a container as DMS will automatically create a blob container in the specified storage account during the upload process.     

- For backups stored in an Azure storage blob container, specify the below details of the Target database name, 
Resource group, Azure storage account, and Blob container from the corresponding drop-down lists. 

    |Field    |Description  |
    |---------|-------------|
    |**Target database name** |The target database name can be modified if you wish to change the database name on the target during the migration process.            |
    |**Storage account details** |The resource group, storage account and container where backup files are located.      
    
    > [!IMPORTANT]
    > If loopback check functionality is enabled and the source SQL Server and file share are on the same computer, then source won't be able to access the file share using FQDN. To fix this issue, disable loopback check functionality using the instructions [here](https://support.microsoft.com/help/926642/error-message-when-you-try-to-access-a-server-locally-by-using-its-fqd)

- The [Azure SQL migration extension for Azure Data Studio](./migration-using-azure-data-studio.md) no longer requires specific configurations on your Azure Storage account network settings to migrate your SQL Server databases to Azure. However, depending on your database backup location and desired storage account network settings, there are a few steps needed to ensure your resources can access the Azure Storage account. See the following table for the various migration scenarios and network configurations:

    | Scenario | SMB network share | Azure Storage account container |
    | --- | --- | --- |
    | Enabled from all networks | No extra steps | No extra steps |
    | Enabled from selected virtual networks and IP addresses |  [See 1a](#1a---azure-blob-storage-network-configuration) | [See 2a](#2a---azure-blob-storage-network-configuration-private-endpoint)| 
    | Enabled from selected virtual networks and IP addresses + private endpoint   | [See 1b](#1b---azure-blob-storage-network-configuration) | [See 2b](#2b---azure-blob-storage-network-configuration-private-endpoint) | 

    ### 1a - Azure Blob storage network configuration
    If you have your Self-Hosted Integration Runtime (SHIR) installed on an Azure VM, see section [1b - Azure Blob storage network configuration](#1b---azure-blob-storage-network-configuration). If you have your Self-Hosted Integration Runtime (SHIR) installed on your on-premises network, you need to add your client IP address of the hosting machine in your Azure Storage account as so: 
    
    :::image type="content" source="media/tutorial-sql-server-to-managed-instance-online-ads/storage-networking-details.png" alt-text="Screenshot that shows the storage account network details":::
    
    To apply this specific configuration, connect to the Azure portal from the SHIR machine, open the Azure Storage account configuration, select **Networking**, and then mark the **Add your client IP address** checkbox. Select **Save** to make the change persistent. See section [2a - Azure Blob storage network configuration (Private endpoint)](#2a---azure-blob-storage-network-configuration-private-endpoint) for the remaining steps.
    
    ### 1b - Azure Blob storage network configuration
    If your SHIR is hosted on an Azure VM, you need to add the virtual network of the VM to the Azure Storage account since the Virtual Machine has a nonpublic IP address that can't be added to the IP address range section. 
    
    :::image type="content" source="media/tutorial-sql-server-to-managed-instance-online-ads/storage-networking-firewall.png" alt-text="Screenshot that shows the storage account network firewall configuration.":::
    
    To apply this specific configuration, locate your Azure Storage account, from the **Data storage** panel select **Networking**, then mark the **Add existing virtual network** checkbox. A new panel opens up, select the subscription, virtual network, and subnet of the Azure VM hosting the Integration Runtime. This information can be found on the **Overview** page of the Azure Virtual Machine. The subnet may say **Service endpoint required** if so, select **Enable**. Once everything is ready, save the updates. Refer to section [2a - Azure Blob storage network configuration (Private endpoint)a](#2a---azure-blob-storage-network-configuration-private-endpoint) for the remaining required steps.
    
    ### 2a - Azure Blob storage network configuration (Private endpoint)
    If your backups are placed directly into an Azure Storage Container, all the above steps are unnecessary since there's no Integration Runtime communicating with the Azure Storage account. However, we still need to ensure that the target SQL Server instance can communicate with the Azure Storage account to restore the backups from the container. To apply this specific configuration, follow the instructions in section [1b - Azure Blob storage network configuration](#1b---azure-blob-storage-network-configuration), specifying the target SQL instance Virtual Network when filling out the "Add existing virtual network" popup.
    
    ### 2b - Azure Blob storage network configuration (Private endpoint)
    If you have a private endpoint set up on your Azure Storage account, follow the steps outlined in section [2a - Azure Blob storage network configuration (Private endpoint)](#2a---azure-blob-storage-network-configuration-private-endpoint). However, you need to select the subnet of the private endpoint, not just the target SQL Server subnet. Ensure the private endpoint is hosted in the same VNet as the target SQL Server instance. If it isn't, create another private endpoint using the process in the Azure Storage account configuration section.

## Create Azure Database Migration Service

1. Create a new Azure Database Migration Service or reuse an existing Service that you previously created.
    > [!NOTE]
    > If you had previously created DMS using the Azure Portal, you cannot reuse it in the migration wizard in Azure Data Studio. Only DMS created previously using Azure Data Studio can be reused.
1. Select the **Resource group** where you have an existing DMS or need to create a new one. The **Azure Database Migration Service** dropdown lists any existing DMS in the selected resource group.
1. To reuse an existing DMS, select it from the dropdown list and the status of the self-hosted integration runtime will be displayed at the bottom of the page.
1. To create a new DMS, select **Create new**. On the **Create Azure Database Migration Service**, screen provide the name for your DMS and select **Create**.
1. After successful creation of DMS, you'll be provided with details to set up **integration runtime**.
1. Select on **Download and install integration runtime** to open the download link in a web browser. Complete the download. Install the integration runtime on a machine that meets the prerequisites of connecting to source SQL Server and the location containing the source backup.
1. After the installation is complete, the **Microsoft Integration Runtime Configuration Manager** will automatically launch to begin the registration process.
1. Copy and paste one of the authentication keys provided in the wizard screen in Azure Data Studio. If the authentication key is valid, a green check icon is displayed in the Integration Runtime Configuration Manager indicating that you can continue to **Register**.
1. After successfully completing the registration of self-hosted integration runtime, close the **Microsoft Integration Runtime Configuration Manager** and switch back to the migration wizard in Azure Data Studio.
1. Select **Test connection** in the **Create Azure Database Migration Service** screen in Azure Data Studio to validate that the newly created DMS is connected to the newly registered self-hosted integration runtime.
    :::image type="content" source="media/tutorial-sql-server-to-managed-instance-online-ads/test-connection-integration-runtime-complete.png" alt-text="Test connection integration runtime":::
1. Review the migration summary and select **Done** to start the database migration.

## Monitor your migration

1. On the **Database Migration Status**, you can track the migrations in progress, migrations completed, and migrations failed (if any).

    :::image type="content" source="media/tutorial-sql-server-to-managed-instance-online-ads/monitor-migration-dashboard.png" alt-text="monitor migration dashboard":::
1. Select **Database migrations in progress** to view ongoing migrations and get further details by selecting the database name.
1. The migration details page displays the backup files and the corresponding status:

    | Status | Description |
    |--------|-------------|
    | Arrived | Backup file arrived in the source backup location and validated |
    | Uploading | Integration runtime is currently uploading the backup file to Azure storage|
    | Uploaded | Backup file is uploaded to Azure storage |
    | Restoring | Azure Database Migration Service is currently restoring the backup file to Azure SQL Managed Instance|
    | Restored | Backup file is successfully restored on Azure SQL Managed Instance |
    | Canceled | Migration process was canceled |
    | Ignored | Backup file was ignored as it doesn't belong to a valid database backup chain |

    :::image type="content" source="media/tutorial-sql-server-to-managed-instance-online-ads/online-to-mi-migration-details-all-backups-restored.png" alt-text="backup restore details":::

## Complete migration cutover

The final step of the tutorial is to complete the migration cutover to ensure the migrated database in Azure SQL Managed Instance is ready for use. This process is the only part that requires downtime for applications that connect to the database and hence the timing of the cutover needs to be carefully planned with business or application stakeholders.

To complete the cutover:

1. Stop all incoming transactions to the source database.
2. Make application configuration changes to point to the target database in Azure SQL Managed Instance.
3. Take a final log backup of the source database in the backup location specified
4. Put the source database in read-only mode. Therefore, users can read data from the database but not modify it.
5. Ensure all database backups have the status *Restored* in the monitoring details page.
6. Select *Complete cutover* in the monitoring details page.

During the cutover process, the migration status changes from *in progress* to *completing*. When the cutover process is completed, the migration status changes to *succeeded* to indicate that the database migration is successful and that the migrated database is ready for use.

> [!IMPORTANT]
> After the cutover, availability of SQL Managed Instance with Business Critical service tier only can take significantly longer than General Purpose as three secondary replicas have to be seeded for Always On High Availability group. This operation duration depends on the size of data, for more information, see [Management operations duration](/azure/azure-sql/managed-instance/management-operations-overview#duration).

## Limitations

Migrating to Azure SQL Managed Instance by using the Azure SQL extension for Azure Data Studio has the following limitations: 

[!INCLUDE [sql-mi-limitations](includes/sql-managed-instance-limitations.md)]

## Next steps

* For a tutorial showing you how to migrate a database to SQL Managed Instance using the T-SQL RESTORE command, see [Restore a backup to SQL Managed Instance using the restore command](/azure/azure-sql/managed-instance/restore-sample-database-quickstart).
* For information about SQL Managed Instance, see [What is SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview).
* For information about connecting apps to SQL Managed Instance, see [Connect applications](/azure/azure-sql/managed-instance/connect-application-instance).
* To troubleshoot, review [Known issues](known-issues-azure-sql-migration-azure-data-studio.md).
