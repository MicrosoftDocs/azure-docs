---
title: Migrate using Azure Data Studio
description: Learn how to use the Azure SQL migration extension in Azure Data Studio to migrate databases with Azure Database Migration Service.
services: database-migration
author: croblesm
ms.author: roblescarlos
manager: 
ms.reviewer: randolphwest
ms.service: dms
ms.workload: data-services
ms.topic: conceptual
ms.date: 02/22/2022
ms.custom: references_regions
---

# Migrate databases with Azure SQL migration extension for Azure Data Studio

The [Azure SQL migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension) enables you to assess, get Azure recommendations and migrate your SQL Server databases to Azure.

The key benefits of using the Azure SQL migration extension for Azure Data Studio are:
1. Assess your SQL Server databases for Azure readiness or to identify any migration blockers before migrating them to Azure. You can assess SQL Server databases running on both Windows and Linux Operating System using the Azure SQL migration extension.
1. Get right-sized Azure recommendation based on performance data collected from your source SQL Server databases. To learn more, see [Get right-sized Azure recommendation for your on-premises SQL Server database(s)](ads-sku-recommend.md).
1. Perform online (minimal downtime) and offline database migrations using an easy-to-use wizard. To see step-by-step tutorial, see sample [Tutorial: Migrate SQL Server to an Azure SQL Managed Instance online using Azure Data Studio with DMS](tutorial-sql-server-managed-instance-online-ads.md).
1. Monitor all migrations started in Azure Data Studio from the Azure portal. To learn more, see [Monitor database migration progress from the Azure portal](#monitor-database-migration-progress-from-the-azure-portal).
1. Leverage the capabilities of the Azure SQL migration extension to assess and migrate databases at scale using automation with Azure PowerShell and Azure CLI. To learn more, see [Migrate databases at scale using automation](migration-dms-powershell-cli.md).

The following 16-minute video explains recent updates and features added to the Azure SQL migration extension in Azure Data Studio, including the new workflow for SQL Server database assessments and Azure recommendations described in this article.

<iframe src="https://aka.ms/docs/player?show=data-exposed&ep=assess-get-recommendations-migrate-sql-server-to-azure-using-azure-data-studio" width="800" height="450"></iframe>

## Architecture of Azure SQL migration extension for Azure Data Studio

Azure Database Migration Service (DMS) is one of the core components in the overall architecture. DMS provides a reliable migration orchestrator to enable database migrations to Azure SQL. 
Create or reuse an existing DMS using the Azure SQL migration extension in Azure Data Studio (ADS).
DMS uses Azure Data Factory's self-hosted integration runtime to access and upload valid backup files from your on-premises network share or your Azure Storage account.

The workflow of the migration process is illustrated below.

:::image type="content" source="media/migration-using-azure-data-studio/architecture-ads-sql-migration.png" alt-text="Diagram of architecture for database migration using Azure Data Studio with DMS":::

1. **Source SQL Server**: SQL Server instance on-premises, private cloud, or any public cloud virtual machine. All versions of SQL Server 2008 and above are supported.
1. **Target Azure SQL**: Supported Azure SQL targets are Azure SQL Managed Instance or SQL Server on Azure Virtual Machines (registered with SQL IaaS Agent extension in [Full management mode](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management#management-modes))
1. **Network File Share**: Server Message Block (SMB) network file share where backup files are stored for the database(s) to be migrated. Azure Storage blob containers and Azure Storage file share are also supported.
1. **Azure Data Studio**: Download and install the [Azure SQL migration extension in Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension).
1. **Azure DMS**: Azure service that orchestrates migration pipelines to do data movement activities from on-premises to Azure. DMS is associated with Azure Data Factory's (ADF) self-hosted integration runtime (IR) and provides the capability to register and monitor the self-hosted IR.
1. **Self-hosted integration runtime (IR)**: Self-hosted IR should be installed on a machine that can connect to the source SQL Server and the backup files location. DMS provides the authentication keys and registers the self-hosted IR.
1. **Backup files upload to Azure Storage**: DMS uses self-hosted IR to upload valid backup files from the on-premises backup location to your provisioned Azure Storage account. Data movement activities and pipelines are automatically created in the migration workflow to upload the backup files.
1. **Restore backups on target Azure SQL**: DMS restores backup files from your Azure Storage account to the supported target Azure SQL. 
    > [!IMPORTANT]
    > With online migration mode, DMS continuously uploads the source backup files to Azure Storage and restores them to the target until you complete the final step of cutting over to the target.
    >
    > In offline migration mode, DMS uploads the source backup files to Azure Storage and restores them to the target without requiring you to perform a cutover.

## Prerequisites

Azure Database Migration Service prerequisites that are common across all supported migration scenarios include the need to:

* [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio)
* [Install the Azure SQL migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from the Azure Data Studio marketplace
* Have an Azure account that is assigned to one of the built-in roles listed below:
    - Contributor for the target Azure SQL Managed Instance (and Storage Account to upload your database backup files from SMB network share).
    - Reader role for the Azure Resource Groups containing the target Azure SQL Managed Instance or the Azure storage account.
    - Owner or Contributor role for the Azure subscription.
    - As an alternative to using the above built-in roles you can assign a custom role as defined in [this article.](resource-custom-roles-sql-db-managed-instance-ads.md)
    > [!IMPORTANT]
    > Azure account is only required when configuring the migration steps and is not required for assessment or Azure recommendation steps in the migration wizard.
* Create a target [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-create-quickstart) or [SQL Server on Azure Virtual Machine](/azure/azure-sql/virtual-machines/windows/create-sql-vm-portal)

    > [!IMPORTANT]
    > If you have an existing Azure Virtual Machine, it should be registered with [SQL IaaS Agent extension in Full management mode](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management#management-modes).
* Ensure that the logins used to connect the source SQL Server are members of the *sysadmin* server role or have `CONTROL SERVER` permission. 
* Use one of the following storage options for the full database and transaction log backup files: 
    - SMB network share 
    - Azure storage account file share or blob container 

    > [!IMPORTANT]
    > - If your database backup files are provided in an SMB network share, [Create an Azure storage account](../storage/common/storage-account-create.md) that allows the DMS service to upload the database backup files.  Make sure to create the Azure Storage Account in the same region as the Azure Database Migration Service instance is created.
    > - Azure Database Migration Service does not initiate any backups, and instead uses existing backups, which you may already have as part of your disaster recovery plan, for the migration.
    > - You should take [backups using the `WITH CHECKSUM` option](/sql/relational-databases/backup-restore/enable-or-disable-backup-checksums-during-backup-or-restore-sql-server). 
    > - Each backup can be written to either a separate backup file or multiple backup files. However, appending multiple backups (i.e. full and t-log) into a single backup media is not supported. 
    > - Use compressed backups to reduce the likelihood of experiencing potential issues associated with migrating large backups.
* Ensure that the service account running the source SQL Server instance has read and write permissions on the SMB network share that contains database backup files.
* The source SQL Server instance certificate from a database protected by Transparent Data Encryption (TDE) needs to be migrated to the target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine before migrating data. To learn more, see [Migrate a certificate of a TDE-protected database to Azure SQL Managed Instance](/azure/azure-sql/managed-instance/tde-certificate-migrate) and [Move a TDE Protected Database to Another SQL Server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server).
    > [!TIP]
    > If your database contains sensitive data that is protected by [Always Encrypted](/sql/relational-databases/security/encryption/configure-always-encrypted-using-sql-server-management-studio), migration process using Azure Data Studio with DMS will automatically migrate your Always Encrypted keys to your target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine.

* If your database backups are in a network file share, provide a machine to install [self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md) to access and migrate database backups. The migration wizard provides the download link and authentication keys to download and install your self-hosted integration runtime. In preparation for the migration, ensure that the machine where you plan to install the self-hosted integration runtime has the following outbound firewall rules and domain names enabled:

    | Domain names                                          | Outbound ports | Description                |
    | ----------------------------------------------------- | -------------- | ---------------------------|
    | Public Cloud: `{datafactory}.{region}.datafactory.azure.net`<br> or `*.frontend.clouddatahub.net` <br> Azure Government: `{datafactory}.{region}.datafactory.azure.us` <br> China: `{datafactory}.{region}.datafactory.azure.cn` | 443            | Required by the self-hosted integration runtime to connect to the Data Migration service. <br>For new created Data Factory in public cloud, locate the FQDN from your Self-hosted Integration Runtime key, which is in format `{datafactory}.{region}.datafactory.azure.net`. For old Data factory, if you don't see the FQDN in your Self-hosted Integration key, use *.frontend.clouddatahub.net instead. |
    | `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you have disabled auto-update, you can skip configuring this domain. |
    | `*.core.windows.net`          | 443            | Used by the self-hosted integration runtime that connects to the Azure storage account for uploading database backups from your network share |

    > [!TIP]
    > If your database backup files are already provided in an Azure storage account, self-hosted integration runtime is not required during the migration process.

* When using self-hosted integration runtime, make sure that the machine where the runtime is installed can connect to the source SQL Server instance and the network file share where backup files are located. Outbound port 445 should be enabled to allow access to the network file share.
* If you're using the Azure Database Migration Service for the first time, ensure that Microsoft.DataMigration resource provider is registered in your subscription. You can follow the steps to [register the resource provider](./quickstart-create-data-migration-service-portal.md#register-the-resource-provider)

### Recommendations for using self-hosted integration runtime for database migrations
- Use a single self-hosted integration runtime for multiple source SQL Server databases.
- Install only one instance of self-hosted integration runtime on any single machine.
- Associate only one self-hosted integration runtime with one DMS.
- The self-hosted integration runtime uses resources (memory / CPU) on the machine where it's installed. Install the self-hosted integration runtime on a machine that is different from your source SQL Server. However, having the self-hosted integration runtime close to the data source reduces the time for the self-hosted integration runtime to connect to the data source. 
- Use the self-hosted integration runtime only when you have your database backups in an on-premises SMB network share. Self-hosted integration runtime isn't required for database migrations if your source database backups are already in Azure storage blob container.
- We recommend up to 10 concurrent database migrations per self-hosted integration runtime on a single machine. To increase the number of concurrent database migrations, scale out self-hosted runtime up to four nodes or create separate self-hosted integration runtime on different machines.
- Configure self-hosted integration runtime to auto-update to automatically apply any new features, bug fixes, and enhancements that are released. To learn more, see [Self-hosted Integration Runtime Auto-update](../data-factory/self-hosted-integration-runtime-auto-update.md).

## Monitor database migration progress from the Azure portal
When you migrate database(s) using the Azure SQL migration extension for Azure Data Studio, the migrations are orchestrated by the Azure Database Migration Service that was selected in the wizard. To monitor database migrations from the Azure portal, 
- Open the [Azure portal](https://portal.azure.com/)
- Search for your Azure Database Migration Service by the resource name
  :::image type="content" source="media/migration-using-azure-data-studio/search-dms-portal.png" alt-text="Search Azure Database Migration Service resource in portal":::
- Select the **Monitor migrations** tile in the **Overview** page to view the details of your database migrations.
  :::image type="content" source="media/migration-using-azure-data-studio/dms-ads-monitor-portal.png" alt-text="Monitor migrations in Azure portal":::


## Known issues and limitations
- Overwriting existing databases using DMS in your target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine isn't supported.
- Configuring high availability and disaster recovery on your target to match source topology is not supported by DMS.
- The following server objects aren't supported:
    - Logins
    - SQL Server Agent jobs
    - Credentials
    - SSIS packages
    - Server roles
    - Server audit
- When migrating to SQL Server on Azure Virtual Machines, SQL Server 2008 and below as target versions are not supported currently.
- If you are using SQL Server 2012 or SQL Server 2014 you need to store your source database backup files on an Azure Storage Blob Container instead of using the network share option. Store the backup files as page blobs since block blobs are only supported in SQL 2016 and after.
- Migrating to Azure SQL Database isn't supported.
- You can't use an existing self-hosted integration runtime created from Azure Data Factory for database migrations with DMS. Initially, the self-hosted integration runtime should be created using the Azure SQL migration extension in Azure Data Studio and can be reused for further database migrations. 

## Pricing
- Azure Database Migration Service is free to use with the Azure SQL migration extension in Azure Data Studio. You can migrate multiple SQL Server databases using the Azure Database Migration Service at no charge for using the service or the Azure SQL migration extension.
- There's no data movement or data ingress cost for migrating your databases from on-premises to Azure. If the source database is moved from another region or an Azure VM, you may incur [bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/) based on your bandwidth provider and routing scenario.
- Provide your own machine or on-premises server to install Azure Data Studio.
- A self-hosted integration runtime is needed to access database backups from your on-premises network share.

## Regional Availability
For the list of Azure regions that support database migrations using the Azure SQL migration extension for Azure Data studio (powered by Azure DMS), see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration)

## Next steps

- For an overview and installation of the Azure SQL migration extension, see [Azure SQL migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension).
