---
title: Azure Files Share Snapshot Overview| Microsoft Docs
description: File Share Snapshots provide a point in time state of the contents of a cloud file share. Only the incremental changes to individual files in the share will be written to the Snapshot.
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

How to create Azure Files Share Snapshot
==============================

Create: How to create a file share snapshot.
--------------------------------------------

You can take a snapshot of file share while it is in-use. However, snapshots
only capture data that has been already written to Azure File share at the time
the snapshot command is issued. This might exclude any data that has been cached
by any applications or the operating system.

### Powershell
```Powershell
| \$connectionstring="DefaultEndpointsProtocol=http;FileEndpoint=http://**\<Storage Account Name\>.**file.core.windows.net /;AccountName=://**\<Storage Account Name\>**;AccountKey=://**\<Storage Account Key\>**" \$sharename="://**\<FileShareName\>**" \$ctx = New-AzureStorageContext -ConnectionString \$connectionstring \#\#create snapshot \$share=Get-AzureStorageShare -Context \$ctx -Name **\<FileShareName\>** \$share.Properties.LastModified \$share.IsSnapshot \$snapshot=\$share.Snapshot() |
```

### Client Library

```
| storageAccount = CloudStorageAccount.Parse(ConnectionString); fClient = storageAccount.CreateCloudFileClient(); string baseShareName = "myazurefileshare"; CloudFileShare myShare = fClient.GetShareReference(baseShareName); var snapshotShare = myShare.Snapshot(); |

```


### Portal

>   [./media/storage-snapshots-create/portal-create-snapshot.png](./media/storage-snapshots-create/portal-create-snapshot.png)

## Next Steps
* [Snapshot Overview](storage-snapshots-files.md)
* [Snapshot FAQ](storage-files-faq.md)
* [How to create a file share snapshot](storage-snapshots-create.md)
* [How to list snapshots of a share ](storage-snapshots-list.md)
* [How to browse snapshot](storage-snapshots-browse.md)
* [How to restore from snapshots](storage-snapshots-restore.md)  