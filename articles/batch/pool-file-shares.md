---
title: Azure file share for Azure Batch pools
description: How to mount an Azure Files share from compute nodes in a Linux or Windows pool in Azure Batch.
ms.topic: how-to
ms.date: 05/24/2018
---

# Use an Azure file share with a Batch pool

[Azure Files](../storage/files/storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the Server Message Block (SMB) protocol. This article provides information and code examples for mounting and using an Azure file share on pool compute nodes.

## Considerations for use with Batch

* Consider using an Azure file share when you have pools that run a relatively low number of parallel tasks if using non-premium Azure Files. Review the [performance and scale targets](../storage/files/storage-files-scale-targets.md) to determine if Azure Files (which uses an Azure Storage account) should be used, given your expected pool size and number of asset files. 

* Azure file shares are [cost-efficient](https://azure.microsoft.com/pricing/details/storage/files/) and can be configured with data replication to another region so are globally redundant. 

* You can mount an Azure file share concurrently from an on-premises computer. However, ensure that you understand [concurrency implications](../storage/blobs/concurrency-manage.md) especially when using REST APIs.

* See also the general [planning considerations](../storage/files/storage-files-planning.md) for Azure file shares.


## Create a file share

[Create a file share](../storage/files/storage-how-to-create-file-share.md) in a storage account that is linked to your Batch account, or in a separate storage account.

## Mount an Azure File share on a Batch pool

Please refer to the documentation on how to [Mount a virtual file system on a Batch pool](virtual-file-mount.md).

## Next steps

* For other options to read and write data in Batch, see [Persist job and task output](batch-task-output.md).
* See also the [Batch Shipyard](https://github.com/Azure/batch-shipyard) toolkit, which includes [Shipyard recipes](https://github.com/Azure/batch-shipyard/tree/master/recipes) to deploy file systems for Batch container workloads.