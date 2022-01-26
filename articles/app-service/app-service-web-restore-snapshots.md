---
title: Restore app from a snapshot
description: Learn how to restore your app from a snapshot. Recover from unexpected data loss in Premium tier with the automatic shadow copies.

ms.assetid: 4164f9b5-f735-41c6-a2bb-71f15cdda417
ms.topic: article
ms.date: 09/02/2021
ms.reviewer: nicking
ms.custom: seodec18

---
# Restore an app in Azure from a snapshot
This article shows you how to restore an app in [Azure App Service](../app-service/overview.md) from a snapshot. You can restore your app to a previous state, based on one of your app's snapshots. You do not need to enable snapshots, the platform automatically saves a snapshot of all apps for data recovery purposes.

Snapshots are incremental shadow copies of your App Service app. When your app is in Premium tier or higher, App Service takes periodic snapshots of both the app's content and its configuration. They offer several advantages over [standard backups](manage-backup.md):

- No file copy errors due to file locks.
- Higher maximum snapshot size (30GB).
- No configuration required for supported pricing tiers.
- Snapshots can be restored to a new App Service app in any Azure region.

Restoring from snapshots is available to apps running in **Premium** tier or higher. For information about scaling
up your app, see [Scale up an app in Azure](manage-scale-up.md).

## Limitations

- Maximum supported size for snapshot restore is 30GB. Snapshot restore fails if your storage size is greater than 30GB. To reduce your storage size, consider moving files like logs, images, audios, and videos to [Azure Storage](../storage/index.yml), for example.
- Any connected database that [standard backup](manage-backup.md#what-gets-backed-up) supports or [mounted Azure storage](configure-connect-to-azure-storage.md?pivots=container-windows) is *not* included in the snapshot. Consider using the native backup capabilities of the connected Azure service (for example, [SQL Database](../azure-sql/database/automated-backups-overview.md) and [Azure Files](../storage/files/storage-snapshots-files.md)).
- App Service stops the target app or target slot while restoring a snapshot. To minimize downtime for the production app, restore the snapshot to a [staging slot](deploy-staging-slots.md) first, then swap into production.
- Snapshots for the last 30 days are available. The retention period and snapshot frequency are not configurable.
- App Services running on an App Service environment do not support snapshots.

## Restore an app from a snapshot

1. On the **Settings** page of your app in the [Azure portal](https://portal.azure.com), click **Backups** to display the **Backups** page. Then click **Restore** under the **Snapshot(Preview)** section.
   
    ![Screenshot that shows how to restore an app from a snapshot.](./media/app-service-web-restore-snapshots/1.png)

2. In the **Restore** page, select the snapshot to restore.
   
    ![Screenshot that shows how to select the snapshot to restore. ](./media/app-service-web-restore-snapshots/2.png)
   
3. Specify the destination for the app restore in **Restore destination**.
   
    ![Screenshot that shows how to specify the restoration destination.](./media/app-service-web-restore-snapshots/3.png)
   
   > [!WARNING]
   > As a best practice we recommend restoring to a new slot then performing a swap. If you choose **Overwrite**, all existing data in your app's current file system is erased and overwritten. Before you click **OK**, make sure that it is what you want to do.
   > 
   > 
      
   > [!Note]
   > Due to current technical limitations, you can only restore to apps in the same scale unit. This limitation will be removed in a future release.
   > 
   > 
   
    You can select **Existing App** to restore to a slot. Before you use this option, you should have already created a slot in your app.

4. You can choose to restore your site configuration.
   
    ![Screenshot that shows how to restore site configuration.](./media/app-service-web-restore-snapshots/4.png)

5. Click **OK**.
