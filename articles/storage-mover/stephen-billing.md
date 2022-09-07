---
title: Stephen - Understanding Azure Storage Mover billing
description: Stephen - Understanding Azure Storage Mover billing 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: conceptual
ms.date: 07/19/2022
ms.custom: template-concept
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed
EDIT PASS: not started

!########################################################
-->

# Understanding Azure Storage Mover billing

Azure Storage Mover facilitates the migration of unstructured data such as documents, multimedia and image files, and their folders into Azure. This article provides insight into billing categories that may apply to your migration scenarios.

## Billing components

In a migration to Azure, there are several components involved that can have an impact on your bill:

- Storage Mover Service usage
- Target storage usage
- Network usage

### Storage Mover Service usage

All current features of the Azure Storage Mover service are provided free of charge during the public preview. However, service enhancements and additional features may be included in future releases. It's possible that the use of these features may incur a charge.

### Target Azure storage usage

As you begin your migration into Azure, the service will copy your files and folders into your target Azure Storage locations. Depending on the configuration of these storage targets, usage charges may apply.

Any storage usage charges incurred will be the result of the following factors:

- Storage transactions
- Billed capacity

The billing model for each Azure Storage target will determine how these charges apply. There are two different billing models in Azure Storage:

- *Pay-as-you-go* billing
- *Provisioned* billing

> [!NOTE]
> A typical cloud migration has multiple sources and multiple Azure storage targets. Both billing models may apply to you across your migration projects.

#### Pay-as-you-go billing

The *pay-as-you-go* billing model is also known as the *consumption-based-model*. In this model, you are billed only for the amount of logical data your store. Since over-provisioning isn't necessary to to guard against future growth or performance increases, the *pay-as-you-go* model can be cost-efficient for many users. In addition, *pay-as-you-go* users needn't deprovision when their workload and data footprint varies over time. On the other hand, *pay-as-you-go* billing can make the budgeting process more difficult to plan because it is driven by end-user consumption. Some of the underlying causes are illustrated in the [estimating storage transaction charges](#estimating-storage-transaction-charges) section of this article.

Capacity charges progressively apply as files move into the cloud and occupy more and more storage capacity. You're also charged for the number of transactions, based on your data usage. It's important to remember that you'll be billed for transactions initiated by the Storage Mover service as well as its increase in storage consumption. To understand the complexity of estimating the impact on your bill, review your specific storage product's pricing pages.

#### Provisioned billing

Unlike the *pay-as-you-go* billing model, storage transaction charges typically don't apply to targets covered by this billing model. The capacity of your Azure target storage is pre-provisioned and is billed regardless of utilization. This is beneficial because there are no transaction charges for your migration, and your bill will not be impacted as your cloud migration continues to progress.

Capacity charges will only vary in response to a change in provisioned capacity. Review your specific storage product's pricing pages for details.

> [!CAUTION]
> Always ensure there is enough provisioned capacity in the target to hold all the source content. Otherwise copy jobs might fail.

#### Estimating storage transaction charges

Storage transaction and storage usage charges are not billable for every Azure Storage type. Estimating the cost of your migration can be very hard to do when you utilize those storage products that charge for transactions. However, an understanding of the following factors will help increase the accuracy of your estimates.

- It's not possible to estimate the number of transactions based on the utilized storage capacity of the source. The number of transactions scales with the number of namespace items and their properties that are migrated, not their size. For example, more transactions are required to migrate one GiB of small files than one GiB of larger files.

- An empty target resource requires fewer resources than a target which contains existing data. To comply with your migration's settings, the Storage Mover service will often need to enumerate a target's existing file and folder namespace items. This enumeration increases the number of transactions necessary.

- In order to minimize downtime, you may need to run a copy operation several times. All source and target items are processed during each copy operation, though subsequent runs finishes faster. This is because only the differences introduced between copy runs need to be transported over the network.

- Copying the same file twice does not require a fixed number of transactions. Processing an item migrated in a previous copy run may result in only a few read transactions. In contrast,  changes to metadata or content between copy runs may require a larger number of transactions when updating the target. Each file in your namespace may have unique requirements, requiring a different number of transactions. This remains true even when the same file spans multiple copy runs.

### Network usage

Upload bandwidth is another factor that could impact overall cost. The capacity utilized by your migration carries the same charge as any other Azure-bound traffic. There's no Storage Mover-specific premium for higher throughput connections between agents and target storage. You can calculate this cost based on the estimated capacity of your migration.

Any additional charge associated with upload will depend on your specific network connection and provider agreements.

## Next steps

After understanding the billing implications of your cloud migration, it's a good idea to get more familiar with the Storage Mover service. Select an article below to learn more.

- [Managing a Azure Storage Mover: resource hierarchy](resource-hierarchy.md)
- [Deploy an Azure Storage Mover agent VM](agent-deploy.md)
