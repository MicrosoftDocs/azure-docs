---
title: How to list and browse content of Azure Files Share Snapshot | Microsoft Docs
description: Create Azure Files Share Snapshot. File Share Snapshots provide a point in time state of the contents of a cloud file share. Only the incremental changes to individual files in the share will be written to the Snapshot.
services: storage
documentationcenter: .net
author: renash
manager: aungoo
editor: tysonn

ms.assetid: edabe3ee-688b-41e0-b34f-613ac9c3fdfd
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/04/2017
ms.author: tamram

---

# How to list snapshots, browse snapshot contents and restore from snapshots

You can enumerate the snapshots associated with your file share using
“previous-version” integration in Windows, through REST, Client Library, PowerShell, and Portal. Once the Azure File share is mounted, you can view all the previous
versions of the file using SMB “Previous Versions” integration. Once the Azure
File share is mounted, you can view all the previous versions of the directory
using SMB “Previous Versions” integration. To learn more about snapshot please look at [snapshot overview](storage-snapshots-files.md) or [snapshot FAQ](storage-files-faq.md).

## File share snapshot operations in portal

You can look at all your snapshots for a file share in portal and browse the snapshot to view its content

### View Snapshot
On your file share under Snapshot, select **View snapshots**

![./media/storage-snapshots-list-browse/snapshot-view-portal.png](./media/storage-snapshots-list-browse/snapshot-view-portal.png)

### List and browse snapshot content
View the list of snapshots and then browse its content directly by selecting the snapshot from the timestamp desired.

![./media/storage-snapshots-list-browse/snapshot-browsefiles-portal.png](./media/storage-snapshots-list-browse/snapshot-browsefiles-portal.png)

You can also select **Connect** Button on yout list snapshot view to get the `net use` command and the directory path to a particular snapshot, which you can directly browse into.

![./media/storage-snapshots-list-browse/snapshot-download-restore-portal.png](./media/storage-snapshots-list-browse/snapshot-download-restore-portal.png)

### Download or restore from snapshot
From within portal, download or restore the desired file from a snapshot.

![./media/storage-snapshots-list-browse/snapshot-connect-portal.pngsnapshot-list-portal.png](./media/storage-snapshots-list-browse/snapshot-connect-portal.png)


## File share snapshot operations in Windows
When you have already taken snapshots of your file share, you can view previous versions of a share, directory, or a particular file from your mounted Azure file share on Windows. As an example, here is how you can use the **Previous Versions** feature to view and restore a previous version of a  particular directory in Windows.:

> [!Note]  
> Same operations can be done on share level as well as file level. Only version that contains changes for that directory or file are shown in the list. If a particular directory or file has not changed between two snapshots, the snapshot only shows up in the share-level previous version list but not in the directory's or file's previous version list.

### Mount file share
First mount the file share using the net use command.

### Open mounted share in explorer
Go to File Explorer and find the mounted share.

![./media/storage-snapshots-list-browse/snapshot-windows-mount.png](./media/storage-snapshots-list-browse/snapshot-windows-mount.png)

### List Previous versions
 Navigate to the item or parent item that needs restore. Double-click to navigate to the desired directory. Right-click and select “Properties” from the menu

![./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png](./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png)

Select “**Previous Versions”** to see the list of snapshots for this directory. Listing may take a few seconds to load depending on the network speed and number of snapshots.

 ![./media/storage-snapshots-list-browse/snapshot-windows-list.png](./media/storage-snapshots-list-browse/snapshot-windows-list.png)

You can select **Open** to browse a particular snapshot 

 ![./media/storage-snapshots-list-browse/snapshot-browse-windows.png](./media/storage-snapshots-list-browse/snapshot-browse-windows.png)

### Restore from a Previous versions
**Restore** to copy contents of the entire directory recursively at the snapshot creation time to original location.
 ![./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png](./media/storage-snapshots-list-browse/snapshot-windows-restore.png)

## File share snapshot operations in Azure CLI 2.0
You can use Azure CI 2.0 to perform same operations such as listing snapshots, browsing snapshot content, restoring or downloading files from snapshot, or deleting snapshots.

### List Snapshots

You may list snapshots of a particular share using [`az storage share list`](/cli/azure/storage/share?view=azure-cli-latest#az_storage_share_list) with `--include-snapshots`

```azurecli-interactive 
az storage share list --include-snapshots
```

### Sample Output
The command will give you list of snapshots along with all its associated properties.

```json
[
  {
    "metadata": null,
    "name": "sharesnapshotdefs",
    "properties": {
      "etag": "\"0x8D50B5F4005C975\"",
      "lastModified": "2017-10-04T19:36:46+00:00",
      "quota": 5120
    },
    "snapshot": "2017-10-04T19:44:13.0000000Z"
  },
  {
    "metadata": null,
    "name": "sharesnapshotdefs",
    "properties": {
      "etag": "\"0x8D50B5F4005C975\"",
      "lastModified": "2017-10-04T19:36:46+00:00",
      "quota": 5120
    },
    "snapshot": "2017-10-04T19:45:18.0000000Z"
  },
  {
    "metadata": null,
    "name": "sharesnapshotdefs",
    "properties": {
      "etag": "\"0x8D50B5F4005C975\"",
      "lastModified": "2017-10-04T19:36:46+00:00",
      "quota": 5120
    },
    "snapshot": null
  }
]
```

### Browse Snapshots
You may also browse into a particular snapshot to view its content using [`az storage file list`](/cli/azure/storage/share?view=azure-cli-latest#az_storage_share_list). One has to specify the share name `--share-name` and the timestamp, which we want to browse into `--snapshot '2017-10-04T19:45:18.0000000Z'`

```azurecli-interactive 
az storage file list --share-name sharesnapshotdefs --snapshot '2017-10-04T19:45:18.0000000Z' -otable
```

### Sample Output

You will see that the content of the snapshot is identical to the content of the share at the point in time that snapshot was created.

```
Name            Content Length    Type    Last Modified
--------------  ----------------  ------  ---------------
HelloWorldDir/                    dir
IMG_0966.JPG    533568            file
IMG_1105.JPG    717711            file
IMG_1341.JPG    608459            file
IMG_1405.JPG    652156            file
IMG_1611.JPG    442671            file
IMG_1634.JPG    1495999           file
IMG_1635.JPG    974058            file

```
### Restore from Snapshots

You can restore a file by copying or downloading a file from snapshot using `az storage file download` command

```azurecli-interactive 
az storage file download --path IMG_0966.JPG --share-name sharesnapshotdefs --snapshot '2017-10-04T19:45:18.0000000Z'
```

### Sample Output

You see that the content of the downloaded file and its properties are identical to the content and properties at the point in time that snapshot was created.

```json
{
  "content": null,
  "metadata": {},
  "name": "IMG_0966.JPG",
  "properties": {
    "contentLength": 533568,
    "contentRange": "bytes 0-533567/533568",
    "contentSettings": {
      "cacheControl": null,
      "contentDisposition": null,
      "contentEncoding": null,
      "contentLanguage": null,
      "contentType": "application/octet-stream"
    },
    "copy": {
      "completionTime": null,
      "id": null,
      "progress": null,
      "source": null,
      "status": null,
      "statusDescription": null
    },
    "etag": "\"0x8D50B5F49F7ACDF\"",
    "lastModified": "2017-10-04T19:37:03+00:00",
    "serverEncrypted": true
  }
}
```


## Next Steps
You just learnt how use snapshot for listing, browsing, and restoring pervious versions using Windows, portal and Azure CLI. Click the link below to learn more

* [How to delete snapshot](storage-snapshots-delete.md)
* [Snapshot Overview](storage-snapshots-files.md)
* [Snapshot FAQ](storage-files-faq.md#snapshots)