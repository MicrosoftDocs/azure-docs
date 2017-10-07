---
title: How to create Azure Files share snapshot | Microsoft Docs
description: Create Azure Files share snapshot. Azure Files share snapshot is a read-only version of a an Azure Files share that's taken at a point in time. Once a snapshot has been created, it can be read, copied, or deleted, but not modified. Snapshots provide a way to back up the share as it appears at a moment in time.
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

#How to create Azure Files share snapshots

You can create file share snapshot using Portal, Powershell, CLI, REST or any Storage SDK. The following article will tell you how to create snapshot using Portal, CLI and Powershell. To learn more about snapshot, see at [snapshot overview](storage-snapshots-files.md) or [snapshot FAQ](storage-files-faq.md)

You can take a snapshot of a file share while it is in use. However, snapshots
only capture data that has been already written to Azure File share at the time
the snapshot command is issued. This might exclude any data that has been cached
by any applications or the operating system.

## Create snapshot using portal  
You can simply navigate to your file share in the portal and select `Create a Snapshot` button to create a point in time snapshot.

>   ![./media/storage-snapshots-create/portal-create-snapshot.png](./media/storage-snapshots-create/portal-create-snapshot.png)


## Create snapshot using CLI 2.0
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

## Create snapshot using Powershell
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

## Next Steps
* [How to list and browse snapshot](storage-snapshots-list-browse.md)
* [How to delete snapshot](storage-snapshots-delete.md)
* [Snapshot Overview](storage-snapshots-files.md)
* [Snapshot FAQ](storage-files-faq.md#snapshots)