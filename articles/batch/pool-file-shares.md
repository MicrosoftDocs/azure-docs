---
title: Azure file share for Azure Batch pools
description: How to mount an Azure Files share from compute nodes in a Linux or Windows pool in Azure Batch.
ms.topic: how-to
ms.date: 03/20/2023
---

# Use an Azure file share with a Batch pool

[Azure Files](../storage/files/storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the Server Message Block (SMB) protocol. You can mount and use an Azure file share on Batch pool compute nodes.

## Considerations for use with Batch

Consider using an Azure file share when you have pools that run a relatively low number of parallel tasks if using non-premium Azure Files. Review the [performance and scale targets](../storage/files/storage-files-scale-targets.md) to determine if Azure Files (which uses an Azure Storage account) should be used, given your expected pool size and number of asset files.

Azure file shares are [cost-efficient](https://azure.microsoft.com/pricing/details/storage/files/) and can be configured with data replication to another region to be globally redundant.

You can mount an Azure file share concurrently from an on-premises computer. However, ensure that you understand [concurrency implications](../storage/blobs/concurrency-manage.md), especially when using REST APIs.

See also the general [planning considerations](../storage/files/storage-files-planning.md) for Azure file shares.

## Create a file share

You can create an Azure file share in a storage account that is linked to your Batch account, or in a separate storage account. For more information, see [Create an Azure file share](../storage/files/storage-how-to-create-file-share.md).

## Mount an Azure file share on a Batch pool

For details on how to mount an Azure file share on a pool, see [Mount a virtual file system on a Batch pool](virtual-file-mount.md).

## Next steps

- To learn about other options to read and write data in Batch, see [Persist job and task output](batch-task-output.md).
