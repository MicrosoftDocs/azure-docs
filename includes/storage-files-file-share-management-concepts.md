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

There are two main kinds of storage accounts used for classic file share deployments: 

- **Provisioned storage accounts**: Provisioned storage accounts are distinguished using the `FileStorage` storage account kind. Provisioned storage accounts allow you to deploy provisioned classic file shares on either SSD or HDD based hardware. Provisioned storage accounts can only be used to store classic file shares and cannot be used storage other storage resources such as blob containers, queues, and tables. We recommend using provisioned storage accounts for all new classic file share deployments.
- **Pay-as-you-go storage accounts**: Pay-as-you-go storage accounts are distinguished using the `StorageV2` storage account kind. Pay-as-you-go storage accounts allow you to deploy pay-as-you-go file shares on HDD based hardware. Pay-as-you-go storage accounts can be used to store classic file shares and other storage resources such as blob containers, queues, or tables.
