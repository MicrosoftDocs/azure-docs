---
title: Migrate databases at scale using Azure PowerShell / CLI (Preview)
description: Learn how to use Azure PowerShell or CLI to migrate databases at scale with the Azure SQL migration extension in Azure Data Studio
author: croblesm
ms.author: roblescarlos
ms.reviewer: randolph.west
ms.date: 04/26/2022
ms.service: dms
ms.topic: conceptual
ms.custom:
  - devx-track-azurepowershell
  - sql-migration-content
---

# Migrate databases at scale using automation (Preview)

The [Azure SQL Migration extension for Azure Data Studio](/azure-data-studio/extensions/azure-sql-migration-extension) brings together a simplified assessment, recommendation, and migration experience that delivers the following capabilities:
- An enhanced assessment mechanism can evaluate SQL Server instances, identifying databases ready for migration to the different Azure SQL targets.
- An SKU recommendation engine (Preview) that collects performance data from the source SQL Server instance on-premises, generating right-sized SKU recommendations based on your Azure SQL target.
- A reliable Azure service powered by Azure Database Migration Service that orchestrates data movement activities to deliver a seamless migration experience.
- The ability to run online (for migrations requiring minimal downtime) or offline (for migrations where downtime persists through the migration) migration modes to suit your business requirements.
- The flexibility to create and configure a self-hosted integration runtime to provide your own compute for accessing the source SQL Server and backups in your on-premises environment.

With automation tools like the [PowerShell - Azure DataMigration Service Module](/powershell/module/az.datamigration) or [Azure CLI](/cli/azure/datamigration), you can apply the capabilities of the Azure SQL Migration extension together with Azure Database Migration Service to migrate one or more databases at scale (including databases across multiple SQL Server instances).

The following sample scripts can be referenced to suit your migration scenario using Azure PowerShell or Azure CLI:

| Migration scenario | Scripting language
|---------|---------|
SQL Server assessment| [PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main/PowerShell/sql-server-assessment.md) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/sql-server-assessment.md)
SQL Server to Azure SQL Managed Instance (using file share)|[PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main//PowerShell/sql-server-to-sql-mi-fileshare.md) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/sql-server-to-sql-mi-fileshare.md)
SQL Server to Azure SQL Managed Instance (using Azure storage)|[PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main//PowerShell/sql-server-to-sql-mi-blob.md) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/sql-server-to-sql-mi-blob.md)
SQL Server to SQL Server on Azure Virtual Machines (using file share)|[PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main//PowerShell/sql-server-to-sql-vm-fileshare.md) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/sql-server-to-sql-vm-fileshare.md)
SQL Server to SQL Server on Azure Virtual Machines (using Azure Storage)|[PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main//PowerShell/sql-server-to-sql-vm-blob.md) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/sql-server-to-sql-vm-blob.md)
SQL Server to Azure SQL Database |[PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main//PowerShell/sql-server-to-sql-db.md) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/sql-server-to-sql-db.md)
SKU recommendations (Preview)|[PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main//PowerShell/sql-server-sku-recommendation.md) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/sql-server-sku-recommendation.md)
End-to-End migration automation|[PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main//PowerShell/scripts/) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/scripts/)
End-to-End migration automation for multiple databases|[PowerShell](https://github.com/Azure-Samples/data-migration-sql/blob/main//PowerShell/scripts/multiple%20databases/) / [Azure CLI](https://github.com/Azure-Samples/data-migration-sql/blob/main/CLI/scripts/multiple%20databases/)

## Prerequisites

Pre-requisites that are common across all supported migration scenarios using Azure PowerShell or Azure CLI are:

* Have an Azure account that is assigned to one of the built-in roles listed below:
    - Contributor for the target Azure SQL Managed Instance, SQL Server on Azure Virtual Machines or Azure SQL Database and, Storage Account to upload your database backup files from SMB network share (*Not applicable for Azure SQL Database*).
    - Reader role for the Azure Resource Groups containing the target Azure SQL Managed Instance, SQL Server on Azure Virtual Machines or Azure SQL Database.
    - Owner or Contributor role for the Azure subscription.
    > [!IMPORTANT]
    > Azure account is only required when running the migration steps and is not required for assessment or Azure recommendation steps process.
* Create a target [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/create-configure-managed-instance-powershell-quickstart), [SQL Server on Azure Virtual Machine](/azure/azure-sql/virtual-machines/windows/sql-vm-create-powershell-quickstart), or [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart)
    > [!IMPORTANT] 
    > If your target is Azure SQL Database you have to migrate database schema from source to target using [SQL Server dacpac extension](/azure-data-studio/extensions/sql-server-dacpac-extension) or, [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension) for Azure Data Studio.
    > 
    > If you have an existing Azure Virtual Machine, it should be registered with [SQL IaaS Agent extension in Full management mode](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management#management-modes).

* If your target is **Azure SQL Managed Instance** or **SQL Server on Azure Virtual Machine** ensure that the logins used to connect the source SQL Server are members of the *sysadmin* server role or have `CONTROL SERVER` permission.
* If your target is **Azure SQL Database**, ensure that the login used to connect the source SQL Server is a member, and the `db_datareader` and login for the target SQL server is `db_owner`.
* Use one of the following storage options for the full database and transaction log backup files: 
    - SMB network share 
    - Azure storage account file share or blob container 

    > [!IMPORTANT]
    > - If your database backup files are provided in an SMB network share, [Create an Azure storage account](../storage/common/storage-account-create.md) that allows the DMS service to upload the database backup files.  Make sure to create the Azure Storage Account in the same region as the Azure Database Migration Service instance is created.
    > - Make sure the Azure storage account blob container is used exclusively to store backup files only. Any other type of files (txt, png, jpg, etc.) will interfere with the restore process leading to a failure.
    > - Azure Database Migration Service does not initiate any backups, and instead uses existing backups, which you may already have as part of your disaster recovery plan, for the migration.
    > - Each backup can be written to either a separate backup file or multiple backup files. However, appending multiple backups (i.e. full and t-log) into a single backup media is not supported. 
    > - Use compressed backups to reduce the likelihood of experiencing potential issues associated with migrating large backups.
* Ensure that the service account running the source SQL Server instance has read and write permissions on the SMB network share that contains database backup files.
* The source SQL Server instance certificate from a database protected by Transparent Data Encryption (TDE) must be migrated to the target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine before migrating data. For more information about migrating TDE-enabled databases, see [Tutorial: Migrate TDE-enabled databases (preview) to Azure SQL in Azure Data Studio](./tutorial-transparent-data-encryption-migration-ads.md).
    > [!TIP]
    > If your database contains sensitive data that is protected by [Always Encrypted](/sql/relational-databases/security/encryption/configure-always-encrypted-using-sql-server-management-studio), migration process using Azure Data Studio with DMS will automatically migrate your Always Encrypted keys to your target Azure SQL Managed Instance or SQL Server on Azure Virtual Machine.

* If your database backups are in a network file share, provide a machine to install [self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md) to access and migrate database backups. The Azure PowerShell or Azure CLI modules provide the authentication keys to register your self-hosted integration runtime. In preparation for the migration, ensure that the machine where you plan to install the self-hosted integration runtime has the following outbound firewall rules and domain names enabled:

    | Domain names                                          | Outbound ports | Description                |
    | ----------------------------------------------------- | -------------- | ---------------------------|
    | Public Cloud: `{datafactory}.{region}.datafactory.azure.net`<br> or `*.frontend.clouddatahub.net` <br> Azure Government: `{datafactory}.{region}.datafactory.azure.us` <br> China: `{datafactory}.{region}.datafactory.azure.cn` | 443            | Required by the self-hosted integration runtime to connect to the Data Migration service. <br>For new created Data Factory in public cloud, locate the FQDN from your Self-hosted Integration Runtime key, which is in format `{datafactory}.{region}.datafactory.azure.net`. For old Data factory, if you don't see the FQDN in your Self-hosted Integration key, use *.frontend.clouddatahub.net instead. |
    | `download.microsoft.com`    | 443            | Required by the self-hosted integration runtime for downloading the updates. If you have disabled auto-update, you can skip configuring this domain. |
    | `*.core.windows.net`          | 443            | Used by the self-hosted integration runtime that connects to the Azure storage account for uploading database backups from your network share |

    > [!TIP]
    > If your database backup files are already provided in an Azure storage account, self-hosted integration runtime is not required during the migration process.

* When using self-hosted integration runtime, ensure that the machine where the runtime is installed can connect to the source SQL Server instance and the network file share where backup files are located. 
* Outbound port 445 should be enabled to access the network file share.
* If you're using the Azure Database Migration Service for the first time, ensure that Microsoft.DataMigration resource provider is registered in your subscription. You can follow the steps to [register the resource provider](./quickstart-create-data-migration-service-portal.md#register-the-resource-provider)

    > [!IMPORTANT]
    > If your migration target is Azure SQL Database, you don't need backups to perform this migration. The migration to Azure SQL Database is considered a logical migration involving the database's pre-creation and data movement (performed by DMS).

## Automate database migrations
Using Azure PowerShell [Az.DataMigration](/powershell/module/az.datamigration) or Azure CLI [az datamigration](/cli/azure/datamigration), you can migrate databases by automating the creation of the Azure Database Migration Service, configuring database migrations for online migration, and performing a cutover. There are several more commands and functionality that are documented in [Azure Samples](https://github.com/Azure-Samples/data-migration-sql).

Example of automating the migration of a SQL Server database using Azure CLI:
**Step 1: Create Azure Database Migration Service, which will orchestrate your database's migration activities.**
```azurepowershell-interactive
#STEP 1: Create Database Migration Service
az datamigration sql-service create --resource-group "myRG" --sql-migration-service-name "myMigrationService" --location "EastUS2"
```

**Step 2: Configure and start online database migration from SQL Server on-premises (with backups in Azure storage) to Azure SQL Managed Instance.**
```azurepowershell-interactive
#STEP 2: Start Migration
az datamigration sql-managed-instance create `
--source-location '{\"AzureBlob\":{\"storageAccountResourceId\":\"/subscriptions/mySubscriptionID/resourceGroups/myRG/providers/Microsoft.Storage/storageAccounts/dbbackupssqlbits\",\"accountKey\":\"myAccountKey\",\"blobContainerName\":\"dbbackups\"}}' `
--migration-service "/subscriptions/mySubscriptionID/resourceGroups/myRG/providers/Microsoft.DataMigration/SqlMigrationServices/myMigrationService" `
--scope "/subscriptions/mySubscriptionID/resourceGroups/myRG/providers/Microsoft.Sql/managedInstances/mySQLMI" `
--source-database-name "AdventureWorks2008" `
--source-sql-connection authentication="SqlAuthentication" data-source="mySQLServer" password="myPassword" user-name="sqluser" `
--target-db-name "AdventureWorks2008" `
--resource-group myRG `
--managed-instance-name mySQLMI
```

**Step 3: Perform a migration cutover once all backups are restored to Azure SQL Managed Instance.**
```azurepowershell-interactive
#STEP 3: Get migration ID and perform Cutover
$migOpId = az datamigration sql-managed-instance show --managed-instance-name "mySQLMI" --resource-group "myRG" --target-db-name "AdventureWorks2008" --expand=MigrationStatusDetails --query "properties.migrationOperationId"
az datamigration sql-managed-instance cutover --managed-instance-name "mySQLMI" --resource-group "myRG" --target-db-name "AdventureWorks2008" --migration-operation-id $migOpId
```

If you receive the error *"The subscription isn't registered to use namespace 'Microsoft.DataMigration'. See https://aka.ms/rps-not-found for how to register subscriptions"*, run the following command:
```azurepowershell
   Register-AzResourceProvider -ProviderNamespace "Microsoft.DataMigration"
```

## Next steps

- For Azure PowerShell reference documentation for SQL Server database migrations, see [Az.DataMigration](/powershell/module/az.datamigration).
- For Azure CLI reference documentation for SQL Server database migrations, see [az datamigration](/cli/azure/datamigration).
- For Azure Samples code repository, see [data-migration-sql](https://github.com/Azure-Samples/data-migration-sql)
