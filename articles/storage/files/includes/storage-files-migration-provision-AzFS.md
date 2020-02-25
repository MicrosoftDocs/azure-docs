---
title: DO NOT INDEX.
description: Provision Azure file shares for use with Azure File Sync. Common text block for includes into migration docs.
author: fauhse
ms.service: storage
ms.topic: migration
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

An Azure file share is stored in the cloud in an Azure storage account.
There is another level of performance considerations here.

If you have highly active shares - meaning they are being used a lot by users or applications, then 2 Azure file shares can reach the performance limit of a storage account. In the future, a single Azure file share will be able to supply this performance.

Best practice is to deploy storage accounts with one file share each.
You can pool multiple Azure file shares into the same storage account, in case you have archival shares or you know there is low day-to-day activity in them.

These considerations apply more to direct cloud access (through an Azure VM) than they apply to Azure File Sync. If you plan to only use Azure File Sync on these shares, than grouping several into a single Azure storage account is still OK.

Add to your existing list of shares from the previous step, a dimension that shows in which storage account they will reside in.

In the previous step, you have determined the appropriate number of shares. In this step you have a mapping of storage accounts to file shares. Deploy the now appropriate number of Azure storage accounts with the appropriate number of Azure file shares in them.

Make sure the region of each of your storage accounts is the same and matches the region of the storage sync service resource you've already deployed.

File shares, currently, are still created with a 5TiB limit by default.Since you are creating new storage accounts, make sure to follow the [guidance to create storage accounts that allow Azure file shares with 100TiB limits](https://docs.microsoft.com/azure/storage/files/storage-files-how-to-create-large-file-share).

Another consideration when deploying a storage account, is the redundancy of your Azure storage. See: [Azure Storage redundancy options](https://docs.microsoft.com/azure/storage/common/storage-redundancy)

The names of your resources are also important.
For instance, if you group multiple shares for the HR department into an Azure storage account, name the storage account appropriately, while you name the individual Azure file shares similar to what you name the on-premises shares or directories.

[Learn how to deploy an Azure storage accounts and 100TiB file shares.](https://docs.microsoft.com/azure/storage/files/storage-files-how-to-create-large-file-share).
