---
title: Restore an app in Azure
description: Learn how to restore your app from a snapshot.
services: app-service
documentationcenter: ''
author: ahmedelnably
manager: cfowler
editor: ''

ms.assetid: 4164f9b5-f735-41c6-a2bb-71f15cdda417
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: multiple
ms.topic: article
ms.date: 10/27/2017
ms.author: aelnably;nicking

---
# Restore an app in Azure from a snapshot
This article shows you how to restore an app in [Azure App Service](../app-service/app-service-web-overview.md) from a snapshot. You can restore your app to a previous state, based on one of your app's snapshots.

Snapshots are incremental shadow copies, and they offer several advantages over regular [backups](web-sites-backup.md):
- No file copy errors due to file locks.
- No storage size limitation.
- No configuration required.

Restoring from snapshots is available to apps running in **Premium** tier. For information about scaling
up your app, see [Scale up an app in Azure](web-sites-scale.md).

## Limitations

- The feature is currently in preview.
- You can only restore to the same site or to a slot belonging to that site.
- App Service stops the target site while doing the restore.
- App Service keeps three months worth of snapshots.
    - Snapshots maximum of every six hours for the last four weeks.
    - Snapshots every 12 hours for one to three months.


## Restore an app from a snapshot

1. On the **Settings** blade of your app in the Azure Portal, click **Backups** to display the **Backups** blade. Then click **Restore** under the **Snapshot(Preview)** section.
   
    ![](./media/app-service-web-restore-snapshots/1.png)

2. In the **Restore** blade, select the snapshot to restore.
   
    ![](./media/app-service-web-restore-snapshots/2.png)
   
3. Specify the destination for the app restore in **Restore destination**.
   
    ![](./media/app-service-web-restore-snapshots/3.png)
   
   > [!WARNING]
   > If you choose **Overwrite**, all existing data in your app's current file system is erased and overwritten. Before you click **OK**,
   > make sure that it is what you want to do.
   > 
   > 
   
    You can select **Existing App** to restore to a slot. Before you use this option, you should have already created a slot in your app.

4. You can choose to restore your site configuration.
   
    ![](./media/app-service-web-restore-snapshots/4.png)

5. Click **OK**.