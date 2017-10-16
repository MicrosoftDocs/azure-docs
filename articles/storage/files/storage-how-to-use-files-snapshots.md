---
title: Work with Azure Files share snapshot (preview) | Microsoft Docs
description: Use Azure Files share snapshots. A share snapshot is a read-only version of an Azure file share that's taken at a point in time. After a share snapshot is created, it can be read, copied, or deleted, but not modified. A share snapshot provides a way to back up the share as it appears at a moment in time.
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
ms.author: renash
---

# Work with Azure Files share snapshots (preview)
An Azure Files share snapshot (preview) is a read-only version of an Azure file share that's taken at a point in time. After a share snapshot is created, it can be read, copied, or deleted, but not modified. A share snapshot provides a way to back up the share as it appears at a moment in time. 

In this article, you'll learn how to create, manage, and delete Azure Files share snapshots. For more information, see the [share snapshot overview](storage-snapshots-files.md) or the [snapshot FAQ](storage-files-faq.md).

## Create a share snapshot

You can create a share snapshot by using the Azure portal, PowerShell, CLI, the REST API, or any Storage SDK. The following sections describe how to create a share snapshot by using the portal, CLI, and PowerShell. 

You can take a share snapshot of a file share while it is in use. However, share snapshots capture only data that has been already written to Azure file share at the time that the share snapshot command is issued. This might exclude any data that has been cached by any applications or the operating system.

### Create a share snapshot by using the portal  
To create a point-in-time share snapshot, go to your file share in the portal and select **Create a Snapshot**.

>   ![./media/storage-snapshots-create/portal-create-snapshot.png](./media/storage-snapshots-create/portal-create-snapshot.png)


### Create a share snapshot by using CLI 2.0
You can create a share snapshot by using the `az storage share snapshot` command:

```azurecli-interactive
az storage share snapshot -n <share name>
```

Sample output:
```json
{
  "metadata": {},
  "name": "<share name>",
  "properties": {
    "etag": "\"0x8D50B7F9A8D7F30\"",
    "lastModified": "2017-10-04T23:28:22+00:00",
    "quota": null
  },
  "snapshot": "2017-10-04T23:28:35.0000000Z"
}
```

### Create a share snapshot by using PowerShell
You can create a share snapshot by using the `$share.Snapshot()` command:

```powershell
$connectionstring="DefaultEndpointsProtocol=http;FileEndpoint=http:<Storage Account Name>.file.core.windows.net /;AccountName=:<Storage Account Name>;AccountKey=:<Storage Account Key>"
$sharename=":<file share name>"

$ctx = New-AzureStorageContext -ConnectionString $connectionstring

##create snapshot
$share=Get-AzureStorageShare -Context $ctx -Name <file share name>
$share.Properties.LastModified
$share.IsSnapshot
$snapshot=$share.Snapshot()

```
## List share snapshots, browse share snapshot contents, and restore from snapshots

You can enumerate the share snapshots associated with your file share by using “Previous Versions” integration in Windows, through REST, Client Library, PowerShell, and Portal. After the Azure file share is mounted, you can view all the previous versions of the directory by using SMB “Previous Versions” integration. 

The following sections describe how to use Azure portal, Windows, and Azure CLI 2.0 to list, browse, and restore share snapshots.

### Share snapshot operations in the portal

You can look at all your share snapshots for a file share in portal and browse the share snapshot to view its content

#### View a share snapshot
On your file share under Snapshot, select **View snapshots**

![./media/storage-snapshots-list-browse/snapshot-view-portal.png](./media/storage-snapshots-list-browse/snapshot-view-portal.png)

#### List and browse share snapshot content
View the list of share snapshots and then browse its content directly by selecting the share snapshot from the timestamp desired.

![./media/storage-snapshots-list-browse/snapshot-browsefiles-portal.png](./media/storage-snapshots-list-browse/snapshot-browsefiles-portal.png)

You can also select the **Connect** button on your list snapshot view to get the `net use` command and the directory path to a particular share snapshot, which you can directly browse into.


![./media/storage-snapshots-list-browse/snapshot-connect-portal.pngsnapshot-list-portal.png](./media/storage-snapshots-list-browse/snapshot-connect-portal.png)

#### Download or restore from a share snapshot
From within portal, download or restore the desired file from a snapshot.

![./media/storage-snapshots-list-browse/snapshot-download-restore-portal.png](./media/storage-snapshots-list-browse/snapshot-download-restore-portal.png)

### File share snapshot operations in Windows
When you have already taken share snapshots of your file share, you can view previous versions of a share, directory, or a particular file from your mounted Azure file share on Windows. As an example, here is how you can use the **Previous Versions** feature to view and restore a previous version of a  particular directory in Windows.

> [!Note]  
> The same operations can be done on the share level and the file level. Only the version that contains changes for that directory or file are shown in the list. If a particular directory or file has not changed between two share snapshots, the share snapshot appears in the share-level previous version list but not in the directory's or file's previous version list.

#### Mount a file share
First mount the file share by using the net use command.

#### Open a mounted share in File Explorer
Go to File Explorer and find the mounted share.

![./media/storage-snapshots-list-browse/snapshot-windows-mount.png](./media/storage-snapshots-list-browse/snapshot-windows-mount.png)

#### List previous versions
 Navigate to the item or parent item that needs restore. Double-click to navigate to the desired directory. Right-click and select “Properties” from the menu.

![./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png](./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png)

Select **Previous Versions** to see the list of share snapshots for this directory. Listing may take a few seconds to load depending on the network speed and number of share snapshots.

 ![./media/storage-snapshots-list-browse/snapshot-windows-list.png](./media/storage-snapshots-list-browse/snapshot-windows-list.png)

You can select **Open** to browse a particular snapshot. 

 ![./media/storage-snapshots-list-browse/snapshot-browse-windows.png](./media/storage-snapshots-list-browse/snapshot-browse-windows.png)

#### Restore from a previous version
**Restore** to copy contents of the entire directory recursively at the share snapshot creation time to original location.
 ![./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png](./media/storage-snapshots-list-browse/snapshot-windows-restore.png)

### File share snapshot operations in Azure CLI 2.0
You can use Azure CI 2.0 to perform same operations such as listing share snapshots, browsing share snapshot content, restoring or downloading files from share snapshot, or deleting share snapshots.

#### List share snapshots

You may list share snapshots of a particular share by using [`az storage share list`](/cli/azure/storage/share?view=azure-cli-latest#az_storage_share_list) with `--include-snapshots`

```azurecli-interactive 
az storage share list --include-snapshots
```

#### Sample output
The command will give you list of share snapshots along with all its associated properties.

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

#### Browse to a share snapshot
You may also browse into a particular share snapshot to view its content by using [`az storage file list`](/cli/azure/storage/share?view=azure-cli-latest#az_storage_share_list). One has to specify the share name `--share-name` and the timestamp, which we want to browse into `--snapshot '2017-10-04T19:45:18.0000000Z'`

```azurecli-interactive 
az storage file list --share-name sharesnapshotdefs --snapshot '2017-10-04T19:45:18.0000000Z' -otable
```

#### Sample output

You will see that the content of the share snapshot is identical to the content of the share at the point in time that share snapshot was created.

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
#### Restore from a share snapshot

You can restore a file by copying or downloading a file from the share snapshot by using `az storage file download` command

```azurecli-interactive 
az storage file download --path IMG_0966.JPG --share-name sharesnapshotdefs --snapshot '2017-10-04T19:45:18.0000000Z'
```

#### Sample output

You see that the contents of the downloaded file and its properties are identical to the content and properties at the point in time that share snapshot was created.

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

## Delete a share snapshot

You can delete file share snapshots by using the Azure portal, PowerShell, CLI, REST API, or any Storage SDK. The following few sections will tell you how to delete share snapshots by using Azure portal, CLI, and Powershell.

You are able to browse share snapshots and view differences between the two share snapshots by using any comparison tool to determine which share snapshot you want to delete. 

You cannot delete a share that has share snapshot. You must first delete all its share snapshots in order to be able to delete the share.

### Delete a share snapshot by using the portal  
You can navigate to your file share blade and select `delete` button in portal to delete one or more share snapshots.

>   ![./media/storage-snapshots-delete/portal-snapshots-delete.png](./media/storage-snapshots-delete/portal-snapshots-delete.png)


### Delete a share snapshot by using Azure CLI 2.0
You can delete a share snapshot by using the `[az storage share delete]` command by providing `--snapshot '2017-10-04T23:28:35.0000000Z' ` parameter with share snapshot timestamp:

```azurecli-interactive
az storage share delete -n <share name> --snapshot '2017-10-04T23:28:35.0000000Z' 
```

Sample output:
```json
{
  "deleted": true
}
```

### Delete a share snapshot by using PowerShell
You can create a share snapshot by using the `Remove-AzureStorageShare -Share` command:

```powershell
$connectionstring="DefaultEndpointsProtocol=http;FileEndpoint=http:<Storage Account Name>.file.core.windows.net /;AccountName=:<Storage Account Name>;AccountKey=:<Storage Account Key>"
$sharename=":<file share name>"

$ctx = New-AzureStorageContext -ConnectionString $connectionstring

##create snapshot
$share=Get-AzureStorageShare -Context $ctx -Name <file share name>
$share.Properties.LastModified
$share.IsSnapshot
$snapshot=$share.Snapshot()

##Delete snapshot
Remove-AzureStorageShare -Share $snapshot

```

## Next steps
* [Snapshot overview](storage-snapshots-files.md)
* [Snapshot FAQ](storage-files-faq.md)