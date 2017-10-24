---
title: How to use Azure File share snapshot (preview) | Microsoft Docs
description: Use Azure File share snapshot. Azure File share snapshots are a read-only version of an Azure File share taken at a point in time. Once a share snapshot has been created, it can be read, copied, or deleted, but not modified. Share snapshots provide a way to back up the share as it appears at a moment in time.
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

# Work with Azure File share snapshots (preview)
Azure Files share snapshots (preview) are a read-only version of an Azure File share taken at a point in time. Once a share snapshot has been created, it can be read, copied, or deleted, but not modified. Share snapshots provide a way to back up the share as it appears at a moment in time. In this article we will learn about how to create, manage and delete Azure Files share snapshots. To learn more about share snapshot, see at [share snapshot overview](storage-snapshots-files.md) or [snapshot FAQ](storage-files-faq.md)

## Create Azure Files share snapshots

You can create a share snapshot using Portal, Powershell, CLI, REST or any Storage SDK. The following few sections will tell you how to create a share snapshot using Portal, CLI and Powershell. 

You can take a share snapshot of a file share while it is in use. However, share snapshots only capture data that has been already written to Azure File share at the time the share snapshot command is issued. This might exclude any data that has been cached by any applications or the operating system.

### Create share snapshot using portal  
You can simply navigate to your file share in the portal and select `Create a Snapshot` button to create a point in time share snapshot.

>   ![./media/storage-snapshots-create/portal-create-snapshot.png](./media/storage-snapshots-create/portal-create-snapshot.png)


### Create share snapshot using CLI 2.0
You can create a share snapshot by using the `az storage share snapshot` command:

```azurecli-interactive
az storage share snapshot -n <share name>
```

Sample Output
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

### Create share snapshot using Powershell
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

## Common share snapshot operations

You can enumerate the share snapshots associated with your file share using "Previous Versions" tab in Windows, through REST, Client Library, PowerShell, and Portal. Once the Azure File share is mounted, you can view all the previous versions of the file using "Previous Versions" tab in Windows. In the following sections you will learn how to use Azure portal, Windows and Azure CLI 2.0 to list, browse and restore share snapshots.

### Share snapshot operations in portal

You can look at all your share snapshots for a file share in portal and browse the share snapshot to view its content

#### View share snapshot
On your file share under Snapshot, select **View snapshots**

![./media/storage-snapshots-list-browse/snapshot-view-portal.png](./media/storage-snapshots-list-browse/snapshot-view-portal.png)

#### List and browse share snapshot content
View the list of share snapshots and then browse its content directly by selecting the share snapshot from the timestamp desired.

![./media/storage-snapshots-list-browse/snapshot-browsefiles-portal.png](./media/storage-snapshots-list-browse/snapshot-browsefiles-portal.png)

You can also select **Connect** Button on your list snapshot view to get the `net use` command and the directory path to a particular share snapshot, which you can directly browse into.


![./media/storage-snapshots-list-browse/snapshot-connect-portal.pngsnapshot-list-portal.png](./media/storage-snapshots-list-browse/snapshot-connect-portal.png)

#### Download or restore from share snapshot
From within portal, download or restore the desired file from a snapshot.

![./media/storage-snapshots-list-browse/snapshot-download-restore-portal.png](./media/storage-snapshots-list-browse/snapshot-download-restore-portal.png)

### File share snapshot operations in Windows
When you have already taken share snapshots of your file share, you can view previous versions of a share, directory, or a particular file from your mounted Azure file share on Windows. As an example, here is how you can use the **Previous Versions** feature to view and restore a previous version of a  particular directory in Windows.:

> [!Note]  
> Same operations can be done on share level as well as file level. Only version that contains changes for that directory or file are shown in the list. If a particular directory or file has not changed between two share snapshots, the share snapshot only shows up in the share-level previous version list but not in the directory's or file's previous version list.

#### Mount file share
First mount the file share using the net use command.

#### Open mounted share in explorer
Go to File Explorer and find the mounted share.

![./media/storage-snapshots-list-browse/snapshot-windows-mount.png](./media/storage-snapshots-list-browse/snapshot-windows-mount.png)

#### List Previous Versions
 Navigate to the item or parent item that needs restore. Double-click to navigate to the desired directory. Right-click and select “Properties” from the menu

![./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png](./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png)

Select “**Previous Versions”** to see the list of share snapshots for this directory. Listing may take a few seconds to load depending on the network speed and number of share snapshots.

 ![./media/storage-snapshots-list-browse/snapshot-windows-list.png](./media/storage-snapshots-list-browse/snapshot-windows-list.png)

You can select **Open** to browse a particular snapshot 

 ![./media/storage-snapshots-list-browse/snapshot-browse-windows.png](./media/storage-snapshots-list-browse/snapshot-browse-windows.png)

#### Restore from a Previous Version
**Restore** to copy contents of the entire directory recursively at the share snapshot creation time to original location.
 ![./media/storage-snapshots-list-browse/snapshot-windows-previous-versions.png](./media/storage-snapshots-list-browse/snapshot-windows-restore.png)

### File share snapshot operations in Azure CLI 2.0
You can use Azure CI 2.0 to perform same operations such as listing share snapshots, browsing share snapshot content, restoring or downloading files from share snapshot, or deleting share snapshots.

#### List share snapshots

You may list share snapshots of a particular share using [`az storage share list`](/cli/azure/storage/share?view=azure-cli-latest#az_storage_share_list) with `--include-snapshots`

```azurecli-interactive 
az storage share list --include-snapshots
```

#### Sample Output
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

#### Browse share snapshots
You may also browse into a particular share snapshot to view its content using [`az storage file list`](/cli/azure/storage/share?view=azure-cli-latest#az_storage_share_list). One has to specify the share name `--share-name` and the timestamp, which we want to browse into `--snapshot '2017-10-04T19:45:18.0000000Z'`

```azurecli-interactive 
az storage file list --share-name sharesnapshotdefs --snapshot '2017-10-04T19:45:18.0000000Z' -otable
```

#### Sample Output

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
#### Restore from share snapshots

You can restore a file by copying or downloading a file from the share snapshot using `az storage file download` command

```azurecli-interactive 
az storage file download --path IMG_0966.JPG --share-name sharesnapshotdefs --snapshot '2017-10-04T19:45:18.0000000Z'
```

#### Sample Output

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

## Delete Azure Files share snapshot

You can delete file share snapshots using the Azure portal, PowerShell, CLI, REST API, or any Storage SDK. The following few sections will tell you how to delete share snapshots using Azure portal, CLI, and Powershell.

You are able to browse share snapshots and view differences between the two share snapshots using any comparison tool to determine which share snapshot you want to delete. 

You cannot delete a share that has share snapshot. You must first delete all its share snapshots in order to be able to delete the share.

### Delete share snapshot using portal  
You can navigate to your file share blade and select `delete` button in portal to delete one or more share snapshots.

>   ![./media/storage-snapshots-delete/portal-snapshots-delete.png](./media/storage-snapshots-delete/portal-snapshots-delete.png)


### Delete a share snapshot using Azure CLI 2.0
You can delete a share snapshot by using the `[az storage share delete]` command by providing `--snapshot '2017-10-04T23:28:35.0000000Z' ` parameter with share snapshot timestamp:

```azurecli-interactive
az storage share delete -n <share name> --snapshot '2017-10-04T23:28:35.0000000Z' 
```

Sample Output
```json
{
  "deleted": true
}
```

### Delete a share snapshot using PowerShell
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

## Next Steps
* [Snapshot Overview](storage-snapshots-files.md)
* [Snapshot FAQ](storage-files-faq.md)