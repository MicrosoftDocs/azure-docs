---
author: stevenmatthew
ms.service: databox
ms.subservice: heavy    
ms.topic: include
ms.date: 08/02/2021
ms.author: shaas
---

Here are the limits on the size of the data that's copied into a storage account. Make sure the data you upload conforms to these limits. For the most up-to-date information on these limits, see [Scalability and performance targets for Blob storage](../articles/storage/blobs/scalability-targets.md) and [Azure Files scalability and performance targets](../articles/storage/files/storage-files-scale-targets.md). 

| Size of data copied into Azure storage account                      | Default limit          |
|---------------------------------------------------------------------|------------------------|
| Block blob and page blob                                            | Maximum limit is the same as the [Storage limit defined for Azure Subscription](../articles/azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits) and it includes data from all the sources including Data Box.   |
| Azure Files                                                          | Data Box supports Azure premium file shares, which allow a total of 100 TiB for all shares in the storage account. Maximum usable capacity is slightly less because of the space that copy logs and audit logs use. A minimum 100 GiB each is reserved for the copy log and audit log. For more information, see [Audit logs for Azure Data Box, Azure Data Box Heavy](../articles/databox/data-box-audit-logs.md). All folders under *StorageAccount_AzFile* must follow this limit. For more information, see [Create an Azure file share](../articles/storage/files/storage-how-to-create-file-share.md). |
