---
title: Configure Azure Cosmos DB account with periodic backup 
description: This article describes how to configure Azure Cosmos DB accounts with periodic backup with backup interval. and retention. Also how to contacts support to restore your data.
author: kanshiG
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 12/09/2021
ms.author: govindk
ms.reviewer: mjbrown
---

# Configure Azure Cosmos DB account with periodic backup
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB automatically takes backups of your data at regular intervals. The automatic backups are taken without affecting the performance or availability of the database operations. All the backups are stored separately in a storage service, and those backups are globally replicated for resiliency against regional disasters. With Azure Cosmos DB, not only your data, but also the backups of your data are highly redundant and resilient to regional disasters. The following steps show how Azure Cosmos DB performs data backup:

* Azure Cosmos DB automatically takes a full backup of your database every 4 hours and at any point of time, only the latest two backups are stored by default. If the default intervals aren't sufficient for your workloads, you can change the backup interval and the retention period from the Azure portal. You can change the backup configuration during or after the Azure Cosmos DB account is created. If the container or database is deleted, Azure Cosmos DB retains the existing snapshots of a given container or database for 30 days.

* Azure Cosmos DB stores these backups in Azure Blob storage whereas the actual data resides locally within Azure Cosmos DB.

* To guarantee low latency, the snapshot of your backup is stored in Azure Blob storage in the same region as the current write region (or **one** of the write regions, in case you have a multi-region write configuration). For resiliency against regional disaster, each snapshot of the backup data in Azure Blob storage is again replicated to another region through geo-redundant storage (GRS). The region to which the backup is replicated is based on your source region and the regional pair associated with the source region. To learn more, see the [list of geo-redundant pairs of Azure regions](../availability-zones/cross-region-replication-azure.md) article. You cannot access this backup directly. Azure Cosmos DB team will restore your backup when you request through a support request.

  The following image shows how an Azure Cosmos DB container with all the three primary physical partitions in West US is backed up in a remote Azure Blob Storage account in West US and then replicated to East US:

  :::image type="content" source="./media/configure-periodic-backup-restore/automatic-backup.png" alt-text="Periodic full backups of all Azure Cosmos DB entities in GRS Azure Storage." lightbox="./media/configure-periodic-backup-restore/automatic-backup.png" border="false":::

* The backups are taken without affecting the performance or availability of your application. Azure Cosmos DB performs data backup in the background without consuming any extra provisioned throughput (RUs) or affecting the performance and availability of your database.

> [!Note]
> For Azure Synapse Link enabled accounts, analytical store data isn't included in the backups and restores. When Synapse Link is enabled, Azure Cosmos DB will continue to automatically take backups of your data in the transactional store at a scheduled backup interval. Automatic backup and restore of your data in the analytical store is not supported at this time.

## <a id="backup-storage-redundancy"></a>Backup storage redundancy

By default, Azure Cosmos DB stores periodic mode backup data in geo-redundant [blob storage](../storage/common/storage-redundancy.md) that is replicated to a [paired region](../availability-zones/cross-region-replication-azure.md). You can update this default value using Azure PowerShell or CLI and define an Azure policy to enforce a specific storage redundancy option. To learn more, see [update backup storage redundancy](update-backup-storage-redundancy.md) article.

To ensure that your backup data stays within the same region where your Azure Cosmos DB account is provisioned, you can change the default geo-redundant backup storage and configure either locally redundant or zone-redundant storage. Storage redundancy mechanisms store multiple copies of your backups so that it is protected from planned and unplanned events, including transient hardware failure, network or power outages, or massive natural disasters.

You can configure storage redundancy for periodic backup mode at the time of account creation or update it for an existing account. You can use the following three data redundancy options in periodic backup mode:

* **Geo-redundant backup storage:** This option copies your data asynchronously across the paired region.

* **Zone-redundant backup storage:** This option copies your data synchronously across three Azure availability zones in the primary region. For more information, see [Zone-redundant storage.](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region)

* **Locally-redundant backup storage:** This option copies your data synchronously three times within a single physical location in the primary region. For more information, see [locally-redundant storage.](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region)

> [!NOTE]
> Zone-redundant storage is currently available only in [specific regions](../availability-zones/az-region.md). Depending on the region you select for a new account or the region you have for an existing account; the zone-redundant option will not be available.
>
> Updating backup storage redundancy will not have any impact on backup storage pricing.

## <a id="configure-backup-interval-retention"></a>Modify the backup interval and retention period

Azure Cosmos DB automatically takes a full backup of your data for every 4 hours and at any point of time, the latest two backups are stored. This configuration is the default option and it’s offered without any extra cost. You can change the default backup interval and retention period during the Azure Cosmos DB account creation or after the account is created. The backup configuration is set at the Azure Cosmos DB account level and you need to configure it on each account. After you configure the backup options for an account, it’s applied to all the containers within that account. You can modify these settings using the Azure portal as described below, or via [PowerShell](configure-periodic-backup-restore.md#modify-backup-options-using-azure-powershell) or the [Azure CLI](configure-periodic-backup-restore.md#modify-backup-options-using-azure-cli).

If you have accidentally deleted or corrupted your data, **before you create a support request to restore the data, make sure to increase the backup retention for your account to at least seven days. It’s best to increase your retention within 8 hours of this event.** This way, the Azure Cosmos DB team has enough time to restore your account.

### Modify backup options using Azure portal - Existing account

Use the following steps to change the default backup options for an existing Azure Cosmos DB account:

1. Sign into the [Azure portal.](https://portal.azure.com/)
1. Navigate to your Azure Cosmos DB account and open the **Backup & Restore** pane. Update the backup interval and the backup retention period as required.

   * **Backup Interval** - It’s the interval at which Azure Cosmos DB attempts to take a backup of your data. Backup takes a non-zero amount of time and in some case it could potentially fail due to downstream dependencies. Azure Cosmos DB tries its best to take a backup at the configured interval, however, it doesn’t guarantee that the backup completes within that time interval. You can configure this value in hours or minutes. Backup Interval cannot be less than 1 hour and greater than 24 hours. When you change this interval, the new interval takes into effect starting from the time when the last backup was taken.

   * **Backup Retention** - It represents the period where each backup is retained. You can configure it in hours or days. The minimum retention period can’t be less than two times the backup interval (in hours) and it can’t be greater than 720 hours.

   * **Copies of data retained** - By default, two backup copies of your data are offered at free of charge. There is an extra charge if you need more than two copies. See the Consumed Storage section in the [Pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) to know the exact price for extra copies.

   * **Backup storage redundancy** - Choose the required storage redundancy option, see the [Backup storage redundancy](#backup-storage-redundancy) section for available options. By default, your existing periodic backup mode accounts have geo-redundant storage if the region where the account is being provisioned supports it. Otherwise, the account fallback to the highest redundancy option available. You can choose other storage such as locally redundant to ensure the backup is not replicated to another region. The changes made to an existing account are applied to only future backups. After the backup storage redundancy of an existing account is updated, it may take up to twice the backup interval time for the changes to take effect and **you will lose access to restore the older backups immediately.**

   > [!NOTE]
   > You must have the Azure [Azure Cosmos DB Operator role](../role-based-access-control/built-in-roles.md#cosmos-db-operator) role assigned at the subscription level to configure backup storage redundancy.

   :::image type="content" source="./media/configure-periodic-backup-restore/configure-backup-options-existing-accounts.png" alt-text="Configure backup interval, retention, and storage redundancy for an existing Azure Cosmos DB account." border="true":::

### Modify backup options using Azure portal - New account

When provisioning a new account, from the **Backup Policy** tab, select **Periodic*** backup policy. The periodic policy allows you to configure the backup interval, backup retention, and backup storage redundancy. For example, you can choose **locally redundant backup storage** or **Zone redundant backup storage** options to prevent backup data replication outside your region.

:::image type="content" source="./media/configure-periodic-backup-restore/configure-backup-options-new-accounts.png" alt-text="Configure periodic or continuous backup policy for new  Azure Cosmos DB accounts." border="true":::

### Modify backup options using Azure PowerShell

Use the following PowerShell cmdlet to update the periodic backup options:

```azurepowershell-interactive
Update-AzCosmosDBAccount -ResourceGroupName "resourceGroupName" `
  -Name "accountName" `
  -BackupIntervalInMinutes 480 `
  -BackupRetentionIntervalInHours 16
```

### Modify backup options using Azure CLI

Use the following CLI command to update the periodic backup options:

```azurecli-interactive
az cosmosdb update --resource-group "resourceGroupName" \
  --name "accountName" \
  --backup-interval 240 \
  --backup-retention 8
```

### Modify backup options using Resource Manager template

When deploying the Resource Manager template, change the periodic backup options within the `backupPolicy` object:

```json
 "backupPolicy": {
    "type": "Periodic",
    "periodicModeProperties": {
        "backupIntervalInMinutes": 240,
        "backupRetentionIntervalInHours": 8,
        "backupStorageRedundancy": "Zone"
    }
}
```

## <a id="request-restore"></a>Request data restore from a backup

If you accidentally delete your database or a container, you can [file a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) or [call the Azure support](https://azure.microsoft.com/support/options/) to restore the data from automatic online backups. Azure support is available for selected plans only such as **Standard**, **Developer**, and plans higher than those. Azure support is not available with **Basic** plan. To learn about different support plans, see the [Azure support plans](https://azure.microsoft.com/support/plans/) page.

To restore a specific snapshot of the backup, Azure Cosmos DB requires that the data is available during the backup cycle for that snapshot.
You should have the following details before requesting a restore:

* Have your subscription ID ready.

* Based on how your data was accidentally deleted or modified, you should prepare to have additional information. It is advised that you have the information available ahead to minimize the back-and-forth that can be detrimental in some time sensitive cases.

* If the entire Azure Cosmos DB account is deleted, you need to provide the name of the deleted account. If you create another account with the same name as the deleted account, share that with the support team because it helps to determine the right account to choose. It's recommended to file different support tickets for each deleted account because it minimizes the confusion for the state of restore.

* If one or more databases are deleted, you should provide the Azure Cosmos DB account, and the Azure Cosmos DB database names and specify if a new database with the same name exists.

* If one or more containers are deleted, you should provide the Azure Cosmos DB account name, database names, and the container names. And specify if a container with the same name exists.

* If you have accidentally deleted or corrupted your data, you should contact [Azure support](https://azure.microsoft.com/support/options/) within 8 hours so that the Azure Cosmos DB team can help you restore the data from the backups. **Before you create a support request to restore the data, make sure to [increase the backup retention](#configure-backup-interval-retention) for your account to at least seven days. It’s best to increase your retention within 8 hours of this event.** This way the Azure Cosmos DB support team will have enough time to restore your account.

In addition to Azure Cosmos DB account name, database names, container names, you should specify the point in time to which the data can be restored to. It is important to be as precise as possible to help us determine the best available backups at that time. **It is also important to specify the time in UTC.**

The following screenshot illustrates how to create a support request for a container(collection/graph/table) to restore data by using Azure portal. Provide other details such as type of data, purpose of the restore, time when the data was deleted to help us prioritize the request.

:::image type="content" source="./media/configure-periodic-backup-restore/backup-support-request-portal.png" alt-text="Create a backup support request using Azure portal." border="true":::

## Considerations for restoring the data from a backup

You may accidentally delete or modify your data in one of the following scenarios:  

* Delete the entire Azure Cosmos DB account.

* Delete one or more Azure Cosmos DB databases.

* Delete one or more Azure Cosmos DB containers.

* Delete or modify the Azure Cosmos DB items (for example, documents) within a container. This specific case is typically referred to as data corruption.

* A shared offer database or containers within a shared offer database are deleted or corrupted.

Azure Cosmos DB can restore data in all the above scenarios. When restoring, a new Azure Cosmos DB account is created to hold the restored data. The name of the new account, if it's not specified, will have the format `<Azure_Cosmos_account_original_name>-restored1`. The last digit is incremented when multiple restores are attempted. You can't restore data to a pre-created Azure Cosmos DB account.

When you accidentally delete an Azure Cosmos DB account, we can restore the data into a new account with the same name, if the account name is not in use. So, we recommend that you don't re-create the account after deleting it. Because it not only prevents the restored data to use the same name, but also makes discovering the right account to restore from difficult.

When you accidentally delete an Azure Cosmos DB database, we can restore the whole database or a subset of the containers within that database. It is also possible to select specific containers across databases and restore them to a new Azure Cosmos DB account.

When you accidentally delete or modify one or more items within a container (the data corruption case), you need to specify the time to restore to. Time is important if there is data corruption. Because the container is live, the backup is still running, so if you wait beyond the retention period (the default is eight hours) the backups would be overwritten. In order to prevent the backup from being overwritten, increase the backup retention for your account to at least seven days. It’s best to increase your retention within 8 hours from the data corruption.

If you have accidentally deleted or corrupted your data, you should contact [Azure support](https://azure.microsoft.com/support/options/) within 8 hours so that the Azure Cosmos DB team can help you restore the data from the backups. This way the Azure Cosmos DB support team will have enough time to restore your account.

> [!NOTE]
> After you restore the data, not all the source capabilities or settings are carried over to the restored account. The following settings are not carried over to the new account:
> * VNET access control lists
> * Stored procedures, triggers and user-defined functions
> * Multi-region settings  

If you provision throughput at the database level, the backup and restore process in this case happen at the entire database level, and not at the individual containers level. In such cases, you can't select a subset of containers to restore.

## Required permissions to change retention or restore from the portal
Principals who are part of the role [CosmosdbBackupOperator](../role-based-access-control/built-in-roles.md#cosmosbackupoperator), owner, or contributor are allowed to request a restore or change the retention period.

## Understanding Costs of extra backups
Two backups are provided free and extra backups are charged according to the region-based  pricing for backup storage described in [backup storage pricing](https://azure.microsoft.com/pricing/details/cosmos-db/). For example if Backup Retention is configured  to  240 hrs that is, 10 days and Backup Interval to 24 hrs. This implies 10 copies of the backup data. Assuming  1 TB of data in West US 2, the cost would be  will be 0.12 * 1000 * 8  for backup storage in given month.

## Get the restore details from the restored account

After the restore operation completes, you may want to know the source account details from which you restored or the restore time. You can get these details from the Azure portal, PowerShell, or CLI.

### Use Azure portal

Use the following steps to get the restore details from Azure portal:

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to the restored account.

1. Open the **Tags** blade. This blade should have the tags **restoredAtTimestamp** and **restoredSourceDatabaseAccountName**. These tags describe the timestamp and the source account name that were used for the periodic restore.

### Use Azure CLI

Run the following command to get the restore details. The `restoreSourceAccountName` and the `restoreTimestamp` will be under the `tags` property:

```azurecli-interactive
az cosmosdb show --name MyCosmosDBDatabaseAccount --resource-group MyResourceGroup
```

### Use PowerShell

Import the Az.CosmosDB module and run the following command to get the restore details. The `restoreSourceAccountName` and the `restoreTimestamp` will be under the `tags` property:

```powershell-interactive
Get-AzCosmosDBAccount -ResourceGroupName MyResourceGroup -Name MyCosmosDBDatabaseAccount
```

## Options to manage your own backups

With Azure Cosmos DB API for NoSQL accounts, you can also maintain your own backups by using one of the following approaches:

* Use [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md) to move data periodically to a storage of your choice.

* Use Azure Cosmos DB [change feed](change-feed.md) to read data periodically for full backups or for incremental changes, and store it in your own storage.

## Post-restore actions

The primary goal of the data restore is to recover the data that you have accidentally deleted or modified. So, we recommend that you first inspect the content of the recovered data to ensure it contains what you are expecting. If everything looks good, you can migrate the data back to the primary account. Although it is possible to use the restored account as your new active account, it's not a recommended option if you have production workloads. 

After you restore the data, you get a notification about the name of the new account (it’s typically in the format `<original-name>-restored1`) and the time when the account was restored to. The restored account will have the same provisioned throughput, indexing policies and it is in same region as the original account. A user who is the subscription admin or a coadmin can see the restored account.

### Migrate data to the original account

The following are different ways to migrate data back to the original account:

* Use the [Azure Cosmos DB data migration tool](import-data.md).
* Use the [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md).
* Use the [change feed](change-feed.md) in Azure Cosmos DB.
* You can write your own custom code.

It is advised that you delete the container or database immediately after migrating the data. If you don't delete the restored databases or containers, they will incur cost for request units, storage, and egress.

## Next steps

* To make a restore request, contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
* Provision continuous backup using [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
* Restore continuous backup account using [Azure portal](restore-account-continuous-backup.md#restore-account-portal), [PowerShell](restore-account-continuous-backup.md#restore-account-powershell), [CLI](restore-account-continuous-backup.md#restore-account-cli), or [Azure Resource Manager](restore-account-continuous-backup.md#restore-arm-template).
* [Migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
