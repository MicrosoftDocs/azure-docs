---
author: alkohli
ms.service: databox
ms.subservice: heavy    
ms.topic: include
ms.date: 06/24/2020
ms.author: alkohli
---

Here are the limits on the size of the data that is copied into storage account. Make sure that the data you upload conforms to these limits. For the most up-to-date information on these limits, see [Scalability and performance targets for Blob storage](../articles/storage/blobs/scalability-targets.md) and [Azure Files scalability and performance targets](../articles/storage/files/storage-files-scale-targets.md).

| Size of data copied into Azure storage account                      | Default limit          |
|---------------------------------------------------------------------|------------------------|
| Block blob and page blob                                            | Maximum limit is the same as the [Storage limit defined for Azure Subscription](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#storage-limits) and it includes data from all the sources including Data Box. |
| Azure Files                                                          | Data Box supports large file shares (100TiB) if enabled before creation of the Data Box order. <br> If not enabled before order creation, maximum file share size supported is 5 TiB. <br> Premium file shares are not yet supported.<br> All folders under *StorageAccount_AzureFiles* must follow this limit. <br> For more information, see [Enable and create large file shares](../articles/storage/files/storage-files-how-to-create-large-file-share.md)      |
