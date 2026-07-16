---
 title: Include file
 description: Include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 06/17/2026
 ms.author: kendownie
 ms.custom: include file
---

Classic file share deployments use two kinds of storage accounts:

- **Provisioned storage accounts**: The `FileStorage` storage account kind identifies provisioned storage accounts. You can deploy provisioned classic file shares on either SSD or HDD based hardware by using provisioned storage accounts. You can only use provisioned storage accounts to store classic file shares. You can't use them for other storage resources such as blob containers, queues, and tables. Use provisioned storage accounts for all new classic file share deployments.

- **Pay-as-you-go storage accounts**: The `StorageV2` storage account kind identifies pay-as-you-go storage accounts. You can deploy pay-as-you-go file shares on HDD based hardware by using pay-as-you-go storage accounts. You can use pay-as-you-go storage accounts to store classic file shares and other storage resources such as blob containers, queues, or tables.
