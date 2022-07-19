---
title: Understanding Azure Storage Mover billing
description: Understanding Azure Storage Mover billing 
author: fauhse
ms.author: fauhse
ms.service: storage-mover
ms.topic: conceptual
ms.date: 07/19/2022
ms.custom: template-concept
---

# Understanding Azure Storage Mover billing

Azure Storage Mover facilitates the migration of unstructured data (files and folders) into Azure. This article provides insight into the categories of costs that may apply to your migration scenarios.

## Billing components

In a migration to Azure, there are several components involved that can have an impact on your bill:

1. Storage Mover Service usage
1. Target storage usage
1. Network usage

### 1. Storage Mover service usage

All current features of the Azure Storage Mover service are provided free of charge. It is possible, that the service will be enhanced with future, paid features.

### 2. Target Azure storage usage

As part of your migration into Azure, the service will copy your files and folders into your target Azure Storage locations. Depending on the configuration of these targets, storage usage charges may apply.

There are two possible components of a bill in this category:
- storage transactions
- billed capacity

How these charges apply depends on the billing model in effect for each Azure Storage target.
There are two distinct billing models in Azure Storage: *provisioned* billing and *pay-as-you-go* billing.

**Pay-as-you-go billing**
* Transactions caused by the Storage Mover service will be billed. Review your specific storage product's pricing pages for details on transactions. It is very difficult to estimate the impact on your bill. The section [estimating storage transaction charges](#estimating-storage-transaction-charges) in this article illustrates the reasons.
* Capacity charges progressively apply as files move into the cloud and occupy more and more storage capacity.

**Provisioned billing**
* Storage transaction charges typically don't apply to targets covered by this billing model. This means there are no transaction charges for your migration. Review your specific storage product's pricing pages for details.
* Capacity of your Azure target storage is pre-provisioned and billed for regardless of utilization. Progress of your cloud migration has no impact on your bill. Capacity charges only change when you change the provisioned capacity. Always ensure there is enough provisioned capacity in the target to hold all the source content. Otherwise copy jobs might fail.

> [!NOTE]
> A typical cloud migration has multiple sources and multiple Azure storage targets. Both billing models may apply to you across your migration projects.

#### Estimating storage transaction charges

Not all types of Azure Storage charge storage transactions for storage usage. Review the previous section and your specific storage product's pricing pages.

For those storage products that charge for transactions: Estimating the amount or cost for your migration is very hard to do. For any given source share, it is unclear how many transactions are required to migrate the contained files and folders to the cloud until they are actually processed by the migration engine. 

The following factors contribute to the complexity of answering this question:
- It's not possible to estimate the number of transactions based on the utilized storage capacity of the source. One GiB of small files requires more transactions than one GiB of fewer, but larger files. The number of transactions scales with the number of namespace items and their properties that are migrated, not their size.
- It matters if your target already has content. When your target is not empty, the Storage Mover service often needs to enumerate the namespace items (files and folders) in the target. That causes transactions. It's important to evaluate each item in the target in order to create a migration result that complies with your migrations settings.
- In order to minimize downtime, cloud migrations often require you to run a copy from source to target several times. Each time you run a copy, you are processing all the items in the source and the target, even if each subsequent run finishes faster because only the differences since the last copy run need to be transported over the network.
- Copying the same file twice does not have a fixed number of transactions it causes. Processing an item that already had been migrated in a previous copy run, may result in only a few read transactions on the target. In contrast,  metadata, or content changes between copy runs may require a number of transactions to get the file updated in the target. Each file in your namespace can have different requirements for what needs to be done, resulting in a different number of transactions for even the same file across copy runs.

### 3. Network usage

The cost of your upload bandwidth from the location of your Azure Storage Mover agent to your Azure target storage can be another cost component. There is no specific charge associated on the Azure Storage Mover side. You can estimate that the utilized capacity of your migration is charged/not charged just as any other traffic to Azure storage would be. Whether there is a charge associated with upload depends on your specific network connection and provider agreements.

## Next steps
<!-- Add a context sentence for the following links -->
- [Step 1](overview.md)
- [Step 2](overview.md)
