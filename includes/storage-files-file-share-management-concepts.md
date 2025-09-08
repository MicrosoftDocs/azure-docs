---
 title: Include file
 description: Include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 12/26/2019
 ms.author: kendownie
 ms.custom: include file
---
Classic Azure file shares are deployed into *storage accounts*, which are top-level objects that represent a shared pool of storage. You can use storage accounts to deploy multiple file shares and other storage resources, depending on the storage account type. All storage resources that are deployed into a storage account share the limits that apply to that storage account. For current storage account limits, see [Scalability and performance targets for Azure Files and Azure File Sync](../articles/storage/files/storage-files-scale-targets.md).

There are two main types of storage accounts for Azure Files deployments:

- **Provisioned storage accounts**: You distinguish this type by using the `FileStorage` storage account. For these accounts, you can deploy provisioned file shares on either SSD-based or HDD-based hardware.

  You can use provisioned storage accounts only to store Azure file shares. You can deploy NFS file shares only in provisioned storage accounts in the SSD media tier. We recommend using provisioned storage accounts for all new deployments of Azure Files.
- **Pay-as-you-go storage accounts**: You distinguish this type by using the `StorageV2` storage account. For these accounts, you can deploy pay-as-you-go file shares on HDD-based hardware. In addition to storing Azure file shares, GPv2 storage accounts can store resources such as blob containers, queues, or tables.
