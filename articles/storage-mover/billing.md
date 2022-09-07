---
title: Stephen - Understanding Azure Storage Mover billing
description: Stephen - Understanding Azure Storage Mover billing 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: conceptual
ms.date: 09/06/2022
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed
EDIT PASS: started

!########################################################
-->

# Understanding Azure Storage Mover billing

Azure Storage Mover facilitates the migration of unstructured data into Azure. This article provides insight into the categories of costs that may apply to your migration scenarios.

## Billing components

In a migration to Azure, there are several components involved that can have an impact on your bill:

1. Storage Mover service usage
1. Target storage usage
1. Network usage

### 1. Storage Mover service usage

All current features of the Azure Storage Mover service are provided free of charge during the public preview. However, service enhancements and additional features may be included in future releases. It's possible that the use of these features may incur a charge.

### 2. Target Azure storage usage

As you begin your migration into Azure, the service will copy your files and folders into your target Azure Storage locations. Depending on the configuration of these storage targets, usage charges may apply.

Any storage usage charges incurred will be the result of the following factors:

- Storage transactions
- Billed capacity

The billing model for each Azure Storage target will determine how these charges apply. There are two different billing models in Azure Storage:

#### [Consumption-based billing](#tab/consumption)

* Storage transactions caused by the Storage Mover service will be billed. Review your specific storage product's pricing pages for details on transaction charges. The section [estimating storage transaction charges](#estimating-storage-transaction-charges) in this article illustrates that estimating the impact a migration will have on your storage transaction charges is very difficult.
* An advantage of the consumption-based model is that capacity charges progressively apply as files move into the cloud and occupy more and more storage capacity. No pre-provisioning or over-provisioning of storage required ahead of a migration.
   
#### [Provisioned billing](#tab/provisioned)

* Storage transaction charges typically don't apply to targets covered by this billing model. Review your specific storage product's pricing pages for details and to confirm the previous statement actually applies to your product.
* Capacity of your Azure target storage is pre-provisioned and is billed for regardless of utilization. Progress of your cloud migration has no impact on your bill. 

> [!CAUTION]
> Always ensure there is enough provisioned capacity in the target to hold all the source content. Otherwise copy jobs might fail.

---
> [!NOTE]
> A typical cloud migration has multiple sources and multiple Azure storage targets. Both billing models may apply to you across your migration projects.

#### Estimating storage transaction charges

Storage transaction are not billable for every Azure Storage type. Review the previous section and your specific storage product's pricing pages.

If you have determined that your Azure storage product charges for transactions, estimating the amount caused by your migration is very difficult. 

- It's not possible to estimate the number of transactions based on the utilized storage capacity of the source. The number of transactions scales with the number of namespace items (files and folder) and their properties that are migrated, not their size. For example, more transactions are required to migrate one GiB of small files than one GiB of larger files.
- An empty Azure target requires fewer resources than a target which already contains items. To comply with your migration's settings, the Storage Mover agent will often need to enumerate a target's existing namespace. This enumeration increases the number of transactions.
- In order to minimize downtime, you may need to copy several times between a source and its target. All source and target items are processed during each copy operation, though subsequent runs finishes faster. The reason for the speed increase is that only the differences introduced between copy runs need to be transported over the network, but this is no indication for fewer transactions required.
- Copying the same file twice might not result in the same number of transactions. Processing an item migrated in a previous copy run may result in only a few read transactions. In contrast, changes to metadata or content between copy runs may require a larger number of transactions to update the target. Each file in your namespace may have unique requirements, resulting in a different number of transactions.

### 3. Network usage

Upload bandwidth is another factor that could impact overall cost. The bandwidth utilized by your migration carries the same charge as any other Azure-bound traffic. There's no Storage Mover-specific premium. If there is a charge associated with upload depends on your specific network connection and provider agreements. 

## Next steps

After understanding the billing implications of your cloud migration, it's a good idea to get more familiar with the Storage Mover service. Select an article below to learn more.

- [Understand file and folder cloud migration basics](migration-basics.md)
- [Learn about the Azure Storage Mover resource hierarchy](resource-hierarchy.md)
- [Plan for an Azure Storage Mover deployment](deployment-planning.md)
