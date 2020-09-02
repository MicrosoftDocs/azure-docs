---
title: Online backup and on-demand data restore in Azure Cosmos DB
description: This article describes how automatic backup, on-demand data restore works, how to configure backup interval and retention in Azure Cosmos DB.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 08/24/2020
ms.author: govindk
ms.reviewer: sngun

---

# Online backup and on-demand data restore in Azure Cosmos DB

Azure Cosmos DB automatically takes backups of your data at regular intervals. The automatic backups are taken without affecting the performance or availability of the database operations. All the backups are stored separately in a storage service, and those backups are globally replicated for resiliency against regional disasters. The automatic backups are helpful in scenarios when you accidentally delete or update your Azure Cosmos account, database, or container and later require the data recovery.

## Automatic and online backups

With Azure Cosmos DB, not only your data, but also the backups of your data are highly redundant and resilient to regional disasters. The following steps show how Azure Cosmos DB performs data backup:

* Azure Cosmos DB automatically takes a backup of your database every 4 hours and at any point of time, only the latest two backups are stored by default. If the default intervals aren't sufficient for your workloads, you can change the backup interval and retention period from the Azure portal. You can change the backup configuration during or after the Azure Cosmos account is created. If the container or database is deleted, Azure Cosmos DB retains the existing snapshots of a given container or database for 30 days.

* Azure Cosmos DB stores these backups in Azure Blob storage whereas the actual data resides locally within Azure Cosmos DB.

* To guarantee low latency, the snapshot of your backup is stored in Azure Blob storage in the same region as the current write region (or **one** of the write regions, in case you have a multi-master configuration). For resiliency against regional disaster, each snapshot of the backup data in Azure Blob storage is again replicated to another region through geo-redundant storage (GRS). The region to which the backup is replicated is based on your source region and the regional pair associated with the source region. To learn more, see the [list of geo-redundant pairs of Azure regions](../best-practices-availability-paired-regions.md) article. You cannot access this backup directly. Azure Cosmos DB team will restore your backup when you request through a support request.

   The following image shows how an Azure Cosmos container with all the three primary physical partitions in West US is backed up in a remote Azure Blob Storage account in West US and then replicated to East US:

  :::image type="content" source="./media/online-backup-and-restore/automatic-backup.png" alt-text="Periodic full backups of all Cosmos DB entities in GRS Azure Storage" border="false":::

* The backups are taken without affecting the performance or availability of your application. Azure Cosmos DB performs data backup in the background without consuming any additional provisioned throughput (RUs) or affecting the performance and availability of your database.

## Options to manage your own backups

With Azure Cosmos DB SQL API accounts, you can also maintain your own backups by using one of the following approaches:

* Use [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md) to move data periodically to a storage of your choice.

* Use Azure Cosmos DB [change feed](change-feed.md) to read data periodically for full backups or for incremental changes, and store it in your own storage.

## Modify the backup interval and retention period

Azure Cosmos DB automatically takes a backup of your data for every 4 hours and at any point of time, the latest two backups are stored. This configuration is the default option and it’s offered without any additional cost. You can change the default backup interval and retention period during the Azure Cosmos account creation or after the account is created. The backup configuration is set at the Azure Cosmos account level and you need to configure it on each account. After you configure the backup options for an account, it’s applied to all the containers within that account. Currently you can change them backup options from Azure portal only.

If you have accidentally deleted or corrupted your data, **before you create a support request to restore the data, make sure to increase the backup retention for your account to at least seven days. It’s best to increase your retention within 8 hours of this event.** This way, the Azure Cosmos DB team has enough time to restore your account.

Use the following steps to change the default backup options for an existing Azure Cosmos account:

1. Sign into the [Azure portal.](https://portal.azure.com/)
1. Navigate to your Azure Cosmos account and open the **Backup & Restore** pane. Update the backup interval and the backup retention period as required.

   * **Backup Interval** - It’s the interval at which Azure Cosmos DB attempts to take a backup of your data. Backup takes a non-zero amount of time and in some case it could potentially fail due to downstream dependencies. Azure Cosmos DB tries its best to take a backup at the configured interval, however, it doesn’t guarantee that the backup completes within that time interval. You can configure this value in hours or minutes. Backup Interval cannot be less than 1 hour and greater than 24 hours. When you change this interval, the new interval takes into effect starting from the time when the last backup was taken.

   * **Backup Retention** - It represents the period where each backup is retained. You can configure it in hours or days. The minimum retention period can’t be less than two times the backup interval (in hours) and it can’t be greater than 720 hours.

   * **Copies of data retained** - By default, two backup copies of your data are offered at free of charge. There is an additional charge if you need more than two copies. See the Consumed Storage section in the [Pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) to know the exact price for additional copies.

   :::image type="content" source="./media/online-backup-and-restore/configure-backup-interval-retention.png" alt-text="Configure backup interval and retention for an existing Azure Cosmos account" border="true":::

If you configure backup options during the account creation, you can configure the **Backup policy**, which is either **Periodic** or **Continuous**. The periodic policy allows you to configure the Backup interval and Backup retention. The continuous policy is currently available by sign-up only. The Azure Cosmos DB team will assess your workload and approve your request.

:::image type="content" source="./media/online-backup-and-restore/configure-periodic-continuous-backup-policy.png" alt-text="Configure periodic or continuous backup policy for new  Azure Cosmos accounts" border="true":::

## Restore data from an online backup

You may accidentally delete or modify your data in one of the following scenarios:  

* Delete the entire Azure Cosmos account.

* Delete one or more Azure Cosmos databases.

* Delete one or more Azure Cosmos containers.

* Delete or modify the Azure Cosmos items (for example, documents) within a container. This specific case is typically referred to as data corruption.

* A shared offer database or containers within a shared offer database are deleted or corrupted.

Azure Cosmos DB can restore data in all the above scenarios. When restoring, a new Azure Cosmos account is created to hold the restored data. The name of the new account, if it's not specified, will have the format `<Azure_Cosmos_account_original_name>-restored1`. The last digit is incremented when multiple restores are attempted. You can't restore data to a pre-created Azure Cosmos account.

When you accidentally delete an Azure Cosmos account, we can restore the data into a new account with the same name, provided that the account name is not in use. So, we recommend that you don't re-create the account after deleting it. Because it not only prevents the restored data to use the same name, but also makes discovering the right account to restore from difficult.

When you accidentally delete an Azure Cosmos database, we can restore the whole database or a subset of the containers within that database. It is also possible to select specific containers across databases and restore them to a new Azure Cosmos account.

When you accidentally delete or modify one or more items within a container (the data corruption case), you need to specify the time to restore to. Time is important if there is data corruption. Because the container is live, the backup is still running, so if you wait beyond the retention period (the default is eight hours) the backups would be overwritten. **In order to prevent the backup from being overwritten, increase the backup retention for your account to at least seven days. It’s best to increase your retention within 8 hours from the data corruption.**

If you have accidentally deleted or corrupted your data, you should contact [Azure support](https://azure.microsoft.com/support/options/) within 8 hours so that the Azure Cosmos DB team can help you restore the data from the backups. This way the Azure Cosmos DB support team will have enough time to restore your account.

If you provision throughput at the database level, the backup and restore process in this case happen at the entire database level, and not at the individual containers level. In such cases, you can't select a subset of containers to restore.

## Migrate data to the original account

The primary goal of the data restore is to recover the data that you have accidentally deleted or modified. So, we recommend that you first inspect the content of the recovered data to ensure it contains what you are expecting. Later you can migrate the data back to the primary account. Although it is possible to use the restored account as your new active account, it's not a recommended option if you have production workloads.  

The following are different ways to migrate data back to the original Azure Cosmos account:

* Use the [Azure Cosmos DB data migration tool](import-data.md).
* Use the [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md).
* Use the [change feed](change-feed.md) in Azure Cosmos DB.
* You can write your own custom code.

Make sure to delete the restored accounts as soon as you have migrated your data, because they will incur ongoing charges.

## Next steps

Next you can learn about how to restore data from an Azure Cosmos account or learn how to migrate data to an Azure Cosmos account

* To make a restore request, contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
* [How to restore data from an Azure Cosmos account](how-to-backup-and-restore.md)
* [Use Cosmos DB change feed](change-feed.md) to move data to Azure Cosmos DB.
* [Use Azure Data Factory](../data-factory/connector-azure-cosmos-db.md) to move data to Azure Cosmos DB.

