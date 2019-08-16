---
author: alkohli
ms.service: databox
ms.subservice: heavy    
ms.topic: include
ms.date: 06/18/2019
ms.author: alkohli
---

Here are the limits on the size of the data that is copied into storage account. Make sure that the data you upload conforms to these limits. For the most up-to-date information on these limits, go to [Azure blob storage scale targets](https://docs.microsoft.com/azure/storage/common/storage-scalability-targets#azure-blob-storage-scale-targets) and [Azure Files scale targets](https://docs.microsoft.com/azure/storage/common/storage-scalability-targets#azure-files-scale-targets).

| Size of data copied into Azure storage account                      | Default limit          |
|---------------------------------------------------------------------|------------------------|
| Block blob and page blob                                            | 2 PB for US and Europe.<br>500 TB for all other regions, which includes the UK.  <br> This includes data from all the sources including Data Box.|
| Azure Files                                                          | 5 TB per share.<br> All folders under *StorageAccount_AzureFiles* must follow this limit.       |
