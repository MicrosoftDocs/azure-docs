---
title: Restore app from a snapshot
description: Learn how to restore your app from a snapshot. Recover from unexpected data loss in Premium tier with the automatic shadow copies.

ms.assetid: 4164f9b5-f735-41c6-a2bb-71f15cdda417
ms.topic: article
ms.date: 12/01/2021
ms.reviewer: nicking
ms.custom: seodec18

---
# Restore an app in Azure from a snapshot
This article shows you how to restore an app in [Azure App Service](../app-service/overview.md) from a snapshot. You can restore your app to a previous state, based on one of your app's snapshots. You do not need to enable snapshot backups; the platform automatically saves a hourly snapshot of each app's content and configuration for data recovery purposes.

Restoring from snapshots is available to apps running in **Standard** tier or higher. For information about scaling
up your app, see [Scale up an app in Azure](manage-scale-up.md).

## Snapshots vs Backups

Snapshots are incremental shadow copies and offer several advantages over [standard backups](manage-backup.md):

- No file copy errors due to file locks.
- Higher maximum snapshot size (30GB).
- No configuration required for supported pricing tiers.
- Snapshots can be restored to a new or existing App Service app in any Azure region.

## Limitations

- Snapshots are not available for App Service environments and Azure Functions.
- For Windows or Linux container apps, only content that's deployed to [persistent storage](configure-custom-container.md?pivots=container-linux#use-persistent-shared-storage) is saved in the snapshot backup along with the app configuration.
- Maximum supported size for snapshot restore is 30GB. Snapshot restore fails if your storage size is greater than 30GB. To reduce your storage size, consider moving files like logs, images, audios, and videos to [Azure Storage](../storage/index.yml), for example.
- Any connected database that [standard backup](manage-backup.md#what-gets-backed-up) supports or [mounted Azure storage](configure-connect-to-azure-storage.md?pivots=container-windows) is *not* included in the snapshot. Consider using the native backup capabilities of the connected Azure service (for example, [SQL Database](../azure-sql/database/automated-backups-overview.md) and [Azure Files](../storage/files/storage-snapshots-files.md)).
- App Service stops the target app or target slot while restoring a snapshot. To minimize downtime for the production app, restore the snapshot to a [staging slot](deploy-staging-slots.md) first, then swap into production.
- If you [run your app directly from a ZIP package](deploy-run-package.md), snapshot backups don't include the content of the ZIP package.
- Snapshots for the last 30 days are available. The retention period and snapshot frequency are not configurable.

## Restore from a snapshot

> [!NOTE]
> You can only restore to apps in the same resource group and region combination.
> 

# [Azure portal](#tab/portal)

1. On the **Settings** page of your app in the [Azure portal](https://portal.azure.com), click **Backups** to display the **Backups** page. Then click **Restore** under the **Snapshot** section.
   
    ![Screenshot that shows how to restore an app from a snapshot.](./media/app-service-web-restore-snapshots/1.png)

2. In the **Restore** page, select the snapshot to restore.
   
    <!-- ![Screenshot that shows how to select the snapshot to restore. ](./media/app-service-web-restore-snapshots/2.png) -->
   
3. Specify the destination for the app restore in **Restore destination**. To restore to an existing [deployment slot](deploy-staging-slots.md), select **Existing app**. 
   
    <!-- ![Screenshot that shows how to specify the restoration destination.](./media/app-service-web-restore-snapshots/3.png) -->
   
   > [!NOTE]
   > It's recommended that you restore to a deployment slot and then perform a swap into production. If you choose **Overwrite**, all existing data in your app's current file system is erased and overwritten. Before you click **OK**, make sure that it is what you want to do.
   > 
      
4. You can choose to restore your site configuration.
   
    ![Screenshot that shows how to restore site configuration.](./media/app-service-web-restore-snapshots/4.png)

5. Click **OK**.

# [Azure CLI](#tab/cli)

1. List the restorable snapshots for your app and copy the timestamp of the one you want to restore.

    ```azurecli-interactive
    az webapp config snapshot list --name <app-name> --resource-group <group-name>
    ```

2. To restore the snapshot by overwriting the app's content and configuration:

    ```azurecli-interactive
    az webapp config snapshot restore --name <app-name> --resource-group <group-name> --time <snapshot-timestamp>
    ```

    To restore the snapshot to a different app:

    ```azurecli-interactive
    az webapp config snapshot restore --name <target-app-name> --resource-group <target-group-name> --source-name <source-app-name> --source-resource-group <source-group-name> --time <source-snapshot-timestamp>
    ```

    To restore app content only and not the app configuration, use the `--restore-content-only` parameter. For more information, see [az webapp config snapshot restore](/cli/webapp/config/snapshot#az_webapp_config_snapshot_restore).

-----