---
title: Storage redundancy change FAQs
titleSuffix: Azure Storage
description: Frequently asked questions about changing redundancy configuration.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: concept-article
ms.date: 09/16/2025
ms.author: shaas
ms.subservice: storage-common-concepts
ms.custom: references_regions, engagement
# Customer intent: "As a cloud architect, I want to evaluate Azure Storage redundancy options, so that I can choose the best replication strategy for my data durability and high availability requirements."
---

<!--
Initial: 69 (1620/75)
Current: 99 (3350/0)
-->

# Changing Azure Storage redundancy configuration: FAQs

There are many different factors that can drive the need to change your storage accounts' redundancy options. The correct redundancy option balances your organization's data availability, disaster recovery, performance, and cost requirements. These requirements are weighed against the risks and benefits associated with the various redundancy options. Regular assessment and adjustment are necessary to ensure an optimal and resilient data storage strategy.

There are also many factors to consider when changing redundancy options, especially from a time and cost perspective. The time it takes to change redundancy options can vary based on several factors. These factors can include the options being changed, the size of your account, and the current resource demands within a region. There might also be costs associated with data transfer and increased storage requirements during and after a transition.

> [!IMPORTANT]
> In practice, a storage account *conversion* can refer to changing a storage account's SKU, or type. For example, you might convert a legacy general-purpose v1 storage account to standard general-purpose v2, allowing for enhanced availability, resilience, and features.
>
> For the purposes of this article, a storage account *conversion* refers specifically to changing a storage account's redundancy configuration.

This article contains answers to frequently asked questions about the process of changing Azure Storage redundancy options for your storage accounts:

- [How are geo- and zonal-conversions different?](#how-are-geo--and-zonal-conversions-different)
- [What charges are associated with a SKU conversion?](#what-charges-are-associated-with-a-sku-conversion)
- [How long does the SKU conversion process take?](#how-long-does-the-sku-conversion-process-take)
- [Why is my SKU conversion process taking so long?](#why-is-my-sku-conversion-process-taking-so-long)
- [How does a SKU conversion affect performance and availability? Is there any application downtime expected? Is there any data loss expected?](#how-does-a-sku-conversion-affect-performance-and-availability-is-there-any-application-downtime-expected-is-there-any-data-loss-expected)
- [How do I convert my account from LRS to GZRS?](#how-do-i-convert-my-account-from-lrs-to-gzrs)
- [How do I convert my account from GZRS to LRS?](#how-do-i-convert-my-account-from-gzrs-to-lrs)
- [How do I convert my account from GRS to ZRS?](#how-do-i-convert-my-account-from-grs-to-zrs)
- [How do I convert my account from ZRS to GRS?](#how-do-i-convert-my-account-from-zrs-to-grs)
- [What are the conflicting features or scenarios for SKU conversions?](#what-are-the-conflicting-features-or-scenarios-for-sku-conversions)

### How are geo- and zonal-conversions different?

The terms *geo* and *zonal* refer to two different types of strategies for providing extra data redundancy within Azure. To address these strategies, Azure offers two distinct types of redundancy option changes: those involving *geo-redundant storage* (GRS), and those involving *zone-redundant storage* (ZRS).

As their names imply, zonal redundancy protects against zone failures, while geo-redundancy protects against large-scale regional disasters. When you change a storage account's redundancy option, the type of conversion you initiate affects the duration of the process, potential costs, and conflicting features or scenarios. For more information, see the [Change the redundancy option for a storage account](redundancy-migration.md) article.

#### Zonal conversion

Zonal redundancy replicates data across multiple availability zones, or isolated data centers, within a single region. These zones, or data centers, have independent power, cooling, and networking. 

When you add zonal redundancy to a storage account, your storage account undergoes a zonal conversion that protects your data from failures within a specific data center. Removing zonal redundancy reverses this protection.

Zonal conversions include:

- LRS &rarr; ZRS
- ZRS &rarr; LRS
- GRS &rarr; GZRS
- GZRS &rarr; GRS
- RA-GRS &rarr; RA-GZRS
- RA-GZRS &rarr; RA-GRS

#### Geo conversion

Geo-redundancy replicates data to a secondary, geographically distant region. This replication protects your data from large-scale regional disasters, such as hurricanes, earthquakes, and floods. When you add geo-redundancy to a storage account, your storage account undergoes a geo conversion that protects your data from regional failures. Removing geo-redundancy reverses this protection.

Geo conversions include:

- LRS &rarr; GRS
- GRS &rarr; LRS
- ZRS &rarr; GZRS **or** RA-GZRS
- GZRS **or** RA-GZRS &rarr; ZRS

### What charges are associated with a SKU conversion? 

There are no initial costs for making zonal conversions. However, after an account is successfully converted, the ongoing data storage and transaction cost might be higher due to the increased replication. For example, there's no charge for the initial conversion of an account from LRS to ZRS. But because ZRS has higher costs for both data storage and transactions, it might incur a higher cost than LRS.

- For details on pricing, refer to the [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) article.
- For details on the types of zonal redundancy, see the [Azure Storage Redundancy](storage-redundancy.md) article.

When you **add** geo-redundancy, the resulting geo conversion incurs a [geo-replication data transfer charge](https://azure.microsoft.com/pricing/details/storage/blobs/) at the time of the change. This transfer charge applies because your entire storage account is being replicated to a secondary region. Because all subsequent write operations are also replicated to the secondary region, they too are subject to the data transfer charge. 

You incur no charges when you **remove** geo-redundancy, such as converting **GRS** &rarr; **LRS** or **GZRS** &rarr; **ZRS**.

When you remove read access from a storage account, it continues to incur charges as *RA-GRS* or *RA-GZRS* for 30 days beyond the date on which it was converted. This policy applies to **RA-GRS &rarr; GRS** or **RA-GZRS &rarr; GZRS**.

You can learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.
    
### How long does the SKU conversion process take?

The type of account conversion you initiate affects the duration of the process. To understand the timeline better, it's important to know the differences between zonal and geo redundancy. For details on these differences, see the [How are geo- and zonal-conversions different](#how-are-geo--and-zonal-conversions-different) section.

The actual time it takes to complete either type of conversion can vary based on several factors. You can read more about the differences between conversions and the factors affecting SKU conversion times in the [How are geo- and zonal-conversions different](#how-are-geo--and-zonal-conversions-different) section.

#### Zonal conversion

Zonal redundancy conversions typically begin within a few days after a request is validated. However, it might take weeks to complete, depending on current resource demands in the region, account size, and other factors. The conversion's progress changes to `In progress` when data movement begins.

There's currently no service level agreement (SLA) for completion of a zonal conversion, and the conversion process can't be expedited by submitting a support request. The conversion progress status changes to `In progress` when data movement begins.

If you need more control over a conversion's timeline, such as when it starts and finishes, consider performing a *manual migration*. Manual migrations utilize a feature or tool such as AzCopy to migrate the data of your current storage account to a different storage account with the desired redundancy.

You can learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.

#### Geo conversion

There's currently no SLA for completion of a geo conversion, and it isn't possible to expedite this process by submitting a support request. The timeframe it takes to complete these conversions can vary depending on various factors, including:

- The number and size of the objects in the storage account.
- The available resources for background replication, such as CPU, memory, disk, and WAN capacity.

You can read more about the factors affecting SKU conversion times in the [Initiate a storage account failover](storage-failover-customer-managed-planned.md#how-to-initiate-a-failover) article. You can also learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.

### Why is my SKU conversion process taking so long?

The SKU conversion process typically completes within a few days but can take up to a few weeks depending on the current resource demands in the region, account size along with various other factors. 

There's currently no SLA for completion of either a geo or zonal SKU conversion, and it isn't possible to expedite the process by submitting a support request. 

If you need more control over a conversion's timeline, such as when it starts and finishes, consider performing a *manual migration*. Manual migrations utilize a feature or tool such as AzCopy to migrate the data of your current storage account to a different storage account with the desired redundancy.

You can learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.
        
### How does a SKU conversion affect performance and availability? Is there any application downtime expected? Is there any data loss expected?

During a SKU conversion, you can continue to access data in your storage account with no loss of durability or availability. The Azure Storage SLA is maintained during the conversion process and no data is lost. Similarly, service endpoints, access keys, shared access signatures, and other account options also remain unchanged.
        
You can learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.
    
### How do I convert my account from LRS to GZRS?

A direct **LRS &rarr; GZRS** conversion isn't supported. This specific conversion requires a two-step process that can be completed in two ways:

- **LRS &rarr; ZRS**, followed by **ZRS &rarr; GZRS**, or 
- **LRS &rarr; GRS**, followed by **GRS &rarr; GZRS**.

When performing an **LRS &rarr; ZRS** conversion, followed by **ZRS &rarr; GZRS**, you must wait at least 72 hours between the conversions. This temporary delay ensures the consistency and integrity of the account by allowing background processes to complete before making another change.

### How do I convert my account from GZRS to LRS?

A direct **GZRS &rarr; LRS** conversion isn't supported. This conversion requires a two-step process that can be completed in two ways:

- **GZRS &rarr; ZRS**, followed by **ZRS &rarr; LRS**, or
- **GZRS &rarr; GRS**, followed by **GRS &rarr; LRS**.

When performing a **GZRS &rarr; GRS** conversion, followed by **GRS &rarr; LRS**, you must wait at least 72 hours between the conversions. This temporary delay ensures the consistency and integrity of the account by allowing background processes to complete before making another change.

### How do I convert my account from GRS to ZRS?

A direct **GRS &rarr; ZRS** conversion isn't supported. This conversion requires a two-step process that can be completed in two ways:

- **GRS &rarr; GZRS**, followed by **GZRS &rarr; ZRS**.
- **GRS &rarr; LRS**, followed by **LRS &rarr; ZRS**.

When performing a **GRS &rarr; GZRS conversion** followed by **GZRS &rarr; ZRS**, you must wait at least 72 hours between the conversions. This temporary delay ensures the consistency and integrity of the account by allowing background processes to complete before making another change.

When you complete the initial **GRS &rarr; LRS** conversion, your storage account temporarily becomes **LRS**, a lower redundancy option. This option offers less durability and availability.

### How do I convert my account from ZRS to GRS?

A direct **ZRS &rarr; GRS** conversion isn't supported. This conversion requires a two-step process that can be completed in two ways:

- **ZRS &rarr; GZRS**, followed by **GZRS &rarr; GRS**, or
- **ZRS &rarr; LRS**, followed by **LRS &rarr; GRS**.

When performing a **ZRS &rarr; LRS** conversion followed by **LRS &rarr; GRS**, you must wait at least 72 hours between the conversions. This temporary delay ensures the consistency and integrity of the account by allowing background processes to complete before making another change.

When you complete the initial **ZRS &rarr; LRS** conversion, your storage account is temporarily held in **LRS**, a lower redundancy option. This option offers much less durability and availability.

### What are the conflicting features or scenarios for SKU conversions?

As with [conversion duration](#how-long-does-the-sku-conversion-process-take), the type of account conversion you initiate affects the number of conflicting features and scenarios.

#### Zonal conversions

Zonal conversions involve adding or removing availability zone options to your account. The following list highlights the most common conflicting features or scenarios that can generate errors when attempting a zonal conversion. If you encounter an error, the error message typically provides details about the specific conflict.

- **Object Replication:** Zonal conversions on accounts with object replication (OR) might generate an error. In this case, you can delete your account's OR policies and attempt the conversion again.
- **NFSv3:** NFSv3 can't be unconfigured. To convert an NFSv3-enabled account to ZRS, you need to perform a *manual migration*. Manual migrations utilize a feature or tool such as AzCopy to migrate the data of your current storage account to a different storage account with the desired redundancy. To learn more about using AzCopy, see [Use AzCopy to copy blobs](storage-use-azcopy-blobs-copy.md).
- **Point in time restore (PITR):** Zonal conversions on accounts with point-in-time restore (PITR) might generate an error. In this case, you can disable PITR and retry the migration.
- **Archive data:** Accounts containing data within the archive tier can generate errors. Before converting, you should rehydrate archive data to either the cold, cool, or hot tier, and then retry your conversion. You can also delete any archived data before converting.
- **NFSv4 accounts with public endpoints:** You might encounter issues when attempting to migrate a storage account with a public endpoint. You should disable access to the storage account's public endpoints before retrying your conversion. You can read more about changing account replication in the [Change how a storage account is replicated](redundancy-migration.md) article.
- **Routing choice, internet Routing:** You should set your routing preference to *Microsoft network routing*. For details, see [Configure network routing preference](configure-network-routing-preference.md).
- **Accounts with boot diagnostics enabled:** Boot diagnostics for virtual machines (VMs) isn't supported for *ZRS*. Migrations including **LRS &rarr; ZRS**; **GRS &rarr; GZRS**; and **RA-GRS &rarr; RA-GZRS** are blocked. You can disable boot diagnostics on your account before migrating, but you can't re-enable them after the conversion is complete. For details, see the [Boot diagnostics for VMs in Azure](/troubleshoot/azure/virtual-machines/windows/boot-diagnostics) article.
- **Unsupported target:** Although your account's region might support a particular SKU, not all regions support zonal migrations. Attempting to convert within an unsupported region might generate errors. For example, the *Canada East* region doesn't support GZRS; attempting to convert your account from GRS to GZRS generates a failure. To learn more about which SKUs are supported in a specific region, refer to the [List of Azure Regions](/azure/reliability/regions-list) article.
- **Conflicting conversion:** Your account might currently have a conflicting migration in process. For example, you might already have an **LRS &rarr; GRS** migration in progress. Attempting to perform an **LRS &rarr; ZRS** conversion fails. Wait for the original migration to complete before submitting a new conversion request.
- **Account is failed over:** If your account is failed over, you can fail back your account to its original primary region then resubmit the request.

#### Geo conversions

Geo conversions involve adding or removing replication targets in secondary, geographically distant regions. The following list highlights the most common conflicting features or scenarios that can generate errors when attempting a geo conversion. If you encounter an error, the error message typically provides details about the specific conflict.

- **Archive data:** If your account contains data in the archive tier, the data needs to be rehydrated before an **LRS &rarr; GRS** request can be submitted. Because the storage resource provider (SRP) verifies that no archived data exists before the conversion is performed, you should receive an error message almost instantly.
- **Unsupported target:** There are some Azure regions with three availability zones and no satellite region. These regions support *ZRS* but don't support *GZRS*. Ensure your region supports your desired SKU.

## See also

- [Change the redundancy option for a storage account](redundancy-migration.md)
- Geo replication (GRS/GZRS/RA-GRS/RA-GZRS)
    - [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
    - [Disaster recovery and storage account failover](storage-disaster-recovery-guidance.md)
- Pricing
    - [Blob Storage](https://azure.microsoft.com/pricing/details/storage/blobs)
    - [Azure Files](https://azure.microsoft.com/pricing/details/storage/files/)
    - [Table Storage](https://azure.microsoft.com/pricing/details/storage/tables/)
    - [Queue Storage](https://azure.microsoft.com/pricing/details/storage/queues/)
    - [Azure Disks](https://azure.microsoft.com/pricing/details/managed-disks/)
