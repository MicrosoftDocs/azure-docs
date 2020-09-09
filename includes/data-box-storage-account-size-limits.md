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
| Block blob and page blob                                            | Maximum limit is the same as the [Storage limit defined for Azure Subscription](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#storage-limits) and it includes data from all the sources including Data Box.|
| Azure Files                                                          | Maximum size of Standard file shares is 5 TB <br> Maximum size of Premium file shares is 100TiB per share.<br> All folders under *StorageAccount_AzureFiles* must follow this limit.       |
