---
title: Azure Files share snapshot (preview) Overview | Microsoft Docs
description: Azure Files share snapshot is a read-only version of a an Azure Files share that's taken at a point in time. Once a share snapshot has been created, it can be read, copied, or deleted, but not modified. Share snapshots provide a way to back up the share as it appears at a moment in time.
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

# Azure Files share snapshot (preview) overview
Azure Files provides the capability to take share snapshots of file shares. Share snapshots (preview) capture the share state at that point in time. In this article, we describe what capabilities share snapshots provide and how you can leverage them in your custom use case.


## When to use share snapshots

### Protection against application error and data corruption
-------------------------------------------------------------------------

Applications using Azure file shares perform various operations such as writing, reading, storage, transmission, or processing. An application can get misconfigured
or an unintentional bug can get introduced which causes accidental overwrite or
damage to a few blocks. To protect against these scenarios, you can take a share snapshot before deploying new application code and if a bug or application error is introduced with new deployment, you can go back to a previous version of your data residing on that file share. 

### Protection against accidental deletions or unintended changes
----------------------------------------------------------------------------------------------

Imagine a user is working on a text file residing in a file share. Once the text file is closed, we lose
the ability to undo our changes. In these cases we will need to recover a previous
version of the file. Share snapshots allow you to recover previous versions of the file if it gets accidentally renamed or deleted.

### General backup purposes
---------------------------

After creating an Azure File share, you can periodically create a share snapshot of
your Azure file share to use it for data backup. Share snapshot when taken periodically, helps maintain previous versions of data that can be used for future audit requirement or disaster recovery.

## Share snapshot capabilities

Share snapshot is a point in time read-only copy of your data. You can create, delete and manage snapshots using REST API. Same capabilities are also available in Client Library, CLI, and Azure portal. Powershell integration for share snapshot is also coming soon. You can view snapshots of a share using both REST API, and SMB. Customers can retrieve the list of versions of directory or file, and they can also mount a specific version directly as a drive. Once a share snapshot has been created, it can be read, copied, or deleted, but not modified. You can't copy a whole share snapshot to another storage account, you have to do that file by file using azcopy or other copying mechanisms.

Share snapshot capability is provided at the file share level, while
retrieval is provided at individual file level to allow for restoring individual
files. You can restore a complete file share using SMB, REST API, portal, Client
Library, or use PowerShell/CLI tooling.

A share snapshot of a file share is identical to its base file share, except that the
share URI has a **DateTime** value appended to the share URI to indicate the
time at which the share snapshot was taken. For example, if a file share URI is
http://storagesample.core.file.windows.net/myshare, the share snapshot URI is
similar to
```
http://storagesample.core.file.windows.net/myshare?snapshot=2011-03-09T01:42:34.9360000Z.
```

Share snapshots persist until they are explicitly deleted. A share snapshot cannot outlive
its base file share. You can enumerate the snapshots associated with the base
file share to track your current snapshots. When you create a share snapshot of a file
share, the files residing in share’s system properties are copied to the
share snapshot with the same values. The base files and the file share’s metadata is also
copied to the share snapshot, unless you specify separate metadata for the share snapshot
when you create it.

You cannot delete a share that has share snapshots without deleting all its share snapshots first.


## Share snapshot space usage 

Share snapshots are incremental in nature, which means that only the data that has
changed after your most recent share snapshot are saved. This minimizes the time
required to create the share snapshot and saves on storage costs. Any write operation to the object or property or metadata update operation is counted towards "content changed" and will be stored in the share snapshot. 

In order to conserve space, you can delete the share snapshot during which period the churn was highest.

Even though share snapshots are saved incrementally, the share snapshot deletion process is
designed so that you need to retain only the most recent share snapshot in order to
restore the share. When you delete a share snapshot, only the data unique to that
share snapshot is removed. Active snapshots contain all of the information needed to
browse and restore your data (from the time the share snapshot was taken) to original
or alternate location. The restore can be done at item-level.

Snapshots are not counted towards your 5 TB share Limit. There is no limit to
how much space in total is occupied by share snapshot. Storage account limits still apply.

## Limits

Maximum number of share snapshot Azure Files allows today is 200. After 200
share snapshots, older share snapshots have to be deleted by user in order to create new
share snapshots. There is no limit to the simultaneous calls for create share snapshot.
There is no limit to amount of space share snapshots of a particular file share can
consume. 

## Copy data back to a share from share snapshot

Copy operations involving files and share snapshots follow these rules:

You can copy individual files in a file share snapshot over to its base share or
any other location. You can restore an earlier version of a file or restore complete file share by copying file by file from the share snapshot. The share snapshot does not get promoted to base share. The share snapshot remains intact post copying, but the base file share is overwritten with a copy of the data that was available in the share snapshot. All the restored files count towards "changed content".

You can copy a file in a share snapshot to a destination with a different name. The
resulting destination file is a writable file and not a share snapshot.

When a destination file is overwritten with a copy, any
share snapshots associated with the original destination file remain intact.

## General Best Practices 

When running infrastructure on Azure, automate backups for data recovery
whenever possible. Automated actions are more reliable than manual processes,
helping to improve data protection and recoverability. You can use REST API, Client SDK or scripting for automation.

Carefully consider your share snapshot frequency and retention settings before
deploying the share snapshot scheduler to avoid incurring unnecessary share snapshot
charges.

Share snapshots provide only file level protection and any fat finger deletes on file share or storage account are not protected by share snapshots . You may lock your storage account or resource group in order to protect the storage account from accidental deletions.

## Next Steps
* [Work with Azure Files share snapshot](storage-how-to-use-files-snapshots.md)
* [Share snapshot FAQ](storage-files-faq.md)

