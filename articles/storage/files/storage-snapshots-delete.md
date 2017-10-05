---
title: How to delete Azure Files Share Snapshot | Microsoft Docs
description: Delete Azure Files Share Snapshot. File Share Snapshots provide a point in time state of the contents of a cloud file share. Only the incremental changes to individual files in the share will be written to the Snapshot.
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

#How to delete Azure Files Share Snapshot
==============================

You can delete file share snapshot using Portal, Powershell, CLI, REST or any Storage SDK. Following article will tell you how to delete snapshot using Portal, CLI and Powershell. To learn more about snapshot please look at [snapshot overview](storage-snapshots-files.md) or [snapshot FAQ](storage-files-faq.md).

You are able to browse snapshots and diff two snapshots using any tool like windiff to determine which snapshot you want to delete. 

You cannot delete a share that has snapshot. If a file share has snapshots, you first have to delete all its snapshot in order to be able to delete a share.

## Delete snapshot using portal  
You can hit `delete` button in portal to delete one or more snapshots.

>   ![./media/storage-snapshots-delete/portal-snapshots-delete.png](./media/storage-snapshots-delete/portal-snapshots-delete.png)


## Delete snapshot using CLI 2.0
You can delete a share snapshot by using the `az storage share delete` command by providing `--snapshot` parameter with snapshot timestamp:

```cli
az storage share delete -n <share name> --snapshot '2017-10-04T23:28:35.0000000Z' 
```

Sample Output
```json
{
  "deleted": true
}
```

## Delete snapshot using Powershell
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
* [How to create a file share snapshot](storage-snapshots-create.md)
* [Create and manage Snapshot using .Net SDK](storage-dotnet-how-to-use-files.md#snapshots)
* [How to list and browse snapshot](storage-snapshots-list-browse.md)
* [Snapshot Overview](storage-snapshots-files.md)
* [Snapshot FAQ](storage-files-faq.md#snapshots)