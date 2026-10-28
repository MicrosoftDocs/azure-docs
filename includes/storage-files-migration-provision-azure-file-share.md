---
title: include file
description: include file
services: storage
author: khdownie
ms.service: azure-file-storage
ms.topic: include
ms.date: 10/27/2026
ms.author: kendownie
ms.custom: include file
---

An Azure file share is stored in the cloud in an Azure storage account.
Another level of performance considerations applies here.

If you have highly active shares (shares used by many users and/or applications), two Azure file shares might reach the performance limit of a storage account.

A best practice is to deploy storage accounts with one file share each.
You can pool multiple Azure file shares into the same storage account if you have archival shares or you expect low day-to-day activity in them.

These considerations apply more to direct cloud access (through an Azure VM) than to Azure File Sync. If you plan to use only Azure File Sync on these shares, grouping several into a single Azure storage account is fine.

If you've made a list of your shares, you should map each share to the storage account it will be in.

In the previous phase, you determined the appropriate number of shares. In this step, you have a mapping of storage accounts to file shares. Now deploy the appropriate number of Azure storage accounts with the appropriate number of Azure file shares in them.

Make sure the region of each of your storage accounts is the same and matches the region of the Storage Sync Service resource you've already deployed.

Classic file shares can be up to 256 TiB with the provisioned v2 billing model, or 100 TiB with provisioned v1 and pay-as-you-go. For limits by billing model, see [Azure Files scalability and performance targets](../articles/storage/files/storage-files-scale-targets.md).

Another consideration when you're deploying a storage account is the redundancy of Azure Storage. See [Azure Storage redundancy options](../articles/storage/common/storage-redundancy.md).

The names of your resources are also important. For example, if you group multiple shares for the HR department into an Azure storage account, you should name the storage account appropriately. Similarly, when you name your Azure file shares, you should use names similar to the ones used for their on-premises counterparts.