

---
title: Using snapshots with Azure file shares in the portal | Azure Docs
description: Learn to use the portal to work with snapshots of Azure file shares.
services: storage
documentationcenter: na
author: wmgries
manager: jeconnoc
editor: 

ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/21/2018
ms.author: wgries
---

# Working with snapshots of Azure files shares using the portal

A snapshot preserves a point in time copy of an Azure file share. File share snapshots are similar to other technologies you may already be familiar with like:
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636) for Windows file systems such as NTFS and ReFS.





## Create and modify share snapshots (preview)
One additional useful task you can do with an Azure file share is to create share snapshots (preview). A snapshot preserves a point in time for an Azure file share. Share snapshots are similar to operating system technologies you may already be familiar with such as:
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636) for Windows file systems such as NTFS and ReFS
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 

You can create a snapshot for a share by clicking on the **Snapshot** button at the root of the file share.

![A screenshot of the snapshot button](media/storage-how-to-use-files-portal/create-snapshot-1.png)

On the drop-down menu for snapshots, click **Create a snapshot**. 

### List and browse a share snapshot
You can browse the contents of the share snapshot by right-clicking on the share and selecting **View snapshots**. 

![A screenshot of the view snapshots button](media/storage-how-to-use-files-portal/browse-snapshot-1.png)

The resulting pane will show the snapshots for this share. Click on a share snapshot to browse it.

![A screenshot of a share snapshot](media/storage-how-to-use-files-portal/browse-snapshot-2.png)

### Restore from a share snapshot
To exercise a restoring a file from a share snapshot, navigate back to the live Azure file share, and right-click on the file we uploaded above, and click **Delete**.

![A screenshot of the delete button in the context menu for a file](media/storage-how-to-use-files-portal/restore-snapshot-1.png)

[Navigate to the share snapshot](#list-and-browse-a-share-snapshot) and to the specific file we deleted (`myDirectory\SampleUpload.txt`). Right-click on the file, and click **Restore**.

![A screenshot of the restore button](media/storage-how-to-use-files-portal/restore-snapshot-2.png)

A pop-up will appear giving you a choice between restoring the file as a copy or overwriting the original file. Since we have deleted the original file, we can select **Overwrite original file** to restore the file as it was before we deleted it. Click **OK** to restore the file to the Azure file share.

![A screenshot of the restore file dialog](media/storage-how-to-use-files-portal/restore-snapshot-3.png)

You can verify that `SampleUpload.txt` has been successfully restored to the live Azure file share.

![A screenshot of the restored file](media/storage-how-to-use-files-portal/restore-snapshot-4.png)

### Delete a share snapshot
To delete a share snapshot, [navigate to the share snapshot](#list-and-browse-a-share-snapshot). Click the checkbox next to the name of the share snapshot (1), and select the **Delete** button (2).

![A screenshot of deleting a share snapshot](media/storage-how-to-use-files-portal/delete-snapshot-1.png)