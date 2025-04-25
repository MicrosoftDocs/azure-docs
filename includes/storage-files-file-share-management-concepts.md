---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 12/26/2019
 ms.author: kendownie
 ms.custom: include file
---
Azure file shares are deployed into *storage accounts*, which are top-level objects that represent a shared pool of storage. Storage accounts can be used to deploy multiple file shares, as well as other storage resources depending on the storage account type. All storage resources that are deployed into a storage account share the limits that apply to that storage account. For current storage account limits, see [Azure Files scalability and performance targets](../articles/storage/files/storage-files-scale-targets.md).

There are two main types of storage accounts used for Azure Files deployments: 

- **Provisioned storage accounts**: Provisioned storage accounts are distinguished using the `FileStorage` storage account kind. Provisioned storage accounts allow you to deploy provisioned file shares on either SSD or HDD based hardware. Provisioned storage accounts can only be used to store Azure file shares. NFS file shares can only be deployed in provisioned storage accounts in the SSD media tier. We recommend using the provisioned storage accounts for all new deployments of Azure Files.
- **Pay-as-you-go storage accounts**: Pay-as-you-go storage accounts are distinguished using the `StorageV2` storage account kind. Pay-as-you-go storage accounts allow you to deploy pay-as-you-go file shares on HDD based hardware. In addition to storing Azure file shares, GPv2 storage accounts can store other storage resources such as blob containers, queues, or tables.
