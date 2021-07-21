---
title: Migrate from periodic to continuous backup mode
description: Azure Cosmos DB currently supports a one-way migration from periodic to continuous mode and it’s irreversible. After migrating from periodic to continuous mode, you can leverage the benefits of continuous mode.
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 07/21/2021
ms.author: sngun
ms.topic: how-to
ms.reviewer: sngun
---

# Migrate from periodic to continuous backup mode
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Azure CosmosDB accounts with periodic mode backup policy can be migrated to continuous mode using Azure portal, CLI, or PowerShell. Azure Cosmos DB currently supports a one-way migration from periodic to continuous mode and it’s irreversible. After migrating from periodic to continuous mode, you can leverage the benefits of continuous mode.

The following are the key reasons to migrate into continuous mode:

* The ability to do self-service restore using Azure portal, CLI, or PowerShell.
* The ability to restore at time granularity of the second within the last 30-day window.
* The ability to make sure that the backup is consistent across shards or partition key ranges within a period.
* The ability to restore container, database, or the full account.
* The ability to restore the asset when it is deleted, dropped, or accidently modified into another account.
* The ability to choose the events on the container, database, or account and decide when to initiate the restore.

## Pricing impact after migration

After you migrate your account to continuous backup mode, the cost with this mode is different when compared to the periodic backup mode. Accounts that have continuous backup enabled will incur an additional monthly charge to store the backup and to restore your data. The continuous mode backup cost is significantly cheaper than periodic mode. To learn more, see the [continuous backup mode pricing](continuous-backup-restore-introduction.md#continuous-backup-pricing) example.

## Migrate using portal

Use the following steps to migrate your account from periodic backup to continuous backup mode:

1. Sign into the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos DB account and open the **Features** pane. Select **Continuous Backup** and select **Enable**.

   :::image type="content" source="./media/migrate-continuous-backup/enable-backup-migration.png" alt-text="Migrate to continuous mode using Azure portal":::

1. When the migration is in progress, the status shows **Pending.** After the it’s complete, the status changes to **On.** Migration time depends on the size of data in your account.

   :::image type="content" source="./media/migrate-continuous-backup/migration-status.png" alt-text="Check the status of migration from Azure portal":::

## Migrate using PowerShell

## Migrate using CLI

1. Install the latest version of Azure CLI:

   * If you don’t have CLI, [install](/cli/azure/) the latest version of Azure CLI.
   * If you already have Azure CLI installed, use `az upgrade` command to upgrade to the latest version.
   * Alternatively, user can also use Cloud Shell from Azure Portal.

1. Install the latest version of `cosmosdb-preview` extension:

   * If you don’t already have this extension installed, run the following command:

     ```azurecli-interactive
     az extension add -n cosmosdb-preview
     ```

   * If you already have this extension installed, run the following command:

     ```azurecli-interactive
     az extension update -n cosmosdb-preview
     ```

1. Verify if the extension is installed using `az version`.  You should see the following output:

   ```console
    {
      "azure-cli": "2.26.1",
      "azure-cli-core": "2.26.1",
      "azure-cli-telemetry": "1.0.6",
      "extensions": {
        "cosmosdb-preview": "0.8.1"
      }
    }
   ```

1. Login to your Azure account and run the following command to migrate your account to continuous mode:

   ```azurecli-interactive
   az login

   az cosmosdb update -n <myaccount> -g <myresourcegroup> --backup-policy-type continuous
   ```

1. After the migration completes successfully, the output shows the backupPolicy object has the type property set to Continuous.

   ```console
    {
      "apiProperties": null,
      "backupPolicy": {
        "type": "Continuous"
      },
      "capabilities": [],
      "connectorOffer": null,
      "consistencyPolicy": {
        "defaultConsistencyLevel": "Session",
        "maxIntervalInSeconds": 5,
        "maxStalenessPrefix": 100
      },
    …
    }
   ```

## What happens during and after migration?

When migrating from periodic mode to continuous mode, you can’t execute any other control plane commands until the migration completes. The time for migration depends on the size of data present in your account. Restore action on the migrated accounts only succeeds from the time when migration successfully completes.

For example, if you migrate an account "A1" with "d" number of databases and "c" number of containers to continuous mode. If the migration completes at 1:00 PM PST. You can do continuous restore starting from 1.00 PM PST.

The account backup policy migration capability from periodic to continuous mode is one-way irreversible action. Which means once you migrate, you can’t switch back from continuous mode to periodic mode.

## Frequently asked questions

### Does the migration only happen at the account level?
Yes.

### Which accounts support backup migration
Azure Cosmos DB SQL API and API for MongoDB accounts support migrating from periodic mode to continuous mode.

### Does the migration take time? What is the typical time?
Migration takes time and it depends on the size of data in your account. You can get the migration status using Azure CLI or PowerShell commands. For large accounts with 10s of terabytes of data, the migration can take up to few days to complete.

### Does the migration cause any availability impact/downtime?
No, the migration operation takes place in the background, so the client requests are not impacted. However, we need to perform some backend operations during the migration, and it might take extra time if the account is under heavy load.

### What happens if the conversion fails? Will I still get the periodic backups or get the continuous backups?
Once the migration process is started, the account will start to become a continuous mode.  If the migration fails, you must initiate migration again until it succeeds.

### Which API accounts can be targeted for the conversion?
Currently, SQL API accounts with single write region, and that have shared, provisioned, or autoscale provisioned throughput are supported for migration.

### How do I perform a restore to a timestamp before/during/after the migration?
Assume that you started migration at t1 and finished at t5, you can’t use a restore timestamp between t1 and t5.

To restore to a time after t5 because your account is now in continuous mode, you can perform the restore using Azure portal, CLI, or PowerShell like you normally do with continuous account. This self-service restore request can only be done after the migration is complete.

To restore to a time before t1, you can open a support ticket like you normally do with the periodic backup account. The restore time can be any time before, during, or after the migration.  After the migration, you have up to 30 days to perform the periodic restore.  During these 30 days, you can restore based on the backup retention/interval of your account before the migration.  For example, if the backup config was to retain 24 copies at 1 hour interval, then you can restore to anytime between [t1 – 24 hours] and [t1].

## Next steps

To learn more about continuous backup mode, see the following articles:

* [Introduction to continuous backup mode with point-in-time restore.](continuous-backup-restore-introduction.md)

* [Continuous backup mode resource model.](continuous-backup-restore-resource-model.md)

* [Configure and manage continuous backup mode](continuous-backup-restore-portal.md) using Azure portal.