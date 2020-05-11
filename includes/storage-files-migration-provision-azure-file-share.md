---
title: Considerations for provisioning Azure file shares
description: Provision Azure file shares for use with Azure File Sync. A common text block, shared across migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

An Azure file share is stored in the cloud in an Azure storage account.
There's another level of performance considerations here.

If you have highly active shares (shares used by many users and/or applications), then two Azure file shares might reach the performance limit of a storage account.

A best practice is to deploy storage accounts with one file share each.
You can pool multiple Azure file shares into the same storage account, in case you have archival shares or you expect low day-to-day activity in them.

These considerations apply more to direct cloud access (through an Azure VM) than to Azure File Sync. If you plan to use Azure File Sync only on these shares, then grouping several into a single Azure storage account is fine.

If you've made a list of your shares, you should map each share to the storage account that it will reside in.

In the previous phase, you determined the appropriate number of shares. In this step, you have a created a mapping of storage accounts to file shares. Now deploy the appropriate number of Azure storage accounts with the appropriate number of Azure file shares in them.

Make sure the region of each of your storage accounts is the same and matches the region of the Storage Sync Service resource you've already deployed.

> [!CAUTION]
> If you create an Azure file share that has a 100-TiB limit, that share can only use locally redundant storage or zone-redundant storage redundancy options. Consider your storage redundancy needs before using 100-TiB file shares.

Azure file shares are still created with a 5-TiB limit by default. Because you're creating new storage accounts, make sure to follow the 
[guidance to create storage accounts that allow Azure file shares with 100-TiB limits](../articles/storage/files/storage-files-how-to-create-large-file-share.md).

Another consideration when you're deploying a storage account is the redundancy of Azure Storage. See [Azure Storage redundancy options](../articles/storage/common/storage-redundancy.md).

The names of your resources are also important. For example, if you group multiple shares for the HR department into an Azure storage account, you should name the storage account appropriately. Similarly, when naming your Azure file shares, you should use names similar to the ones used for their on-premises counterparts.