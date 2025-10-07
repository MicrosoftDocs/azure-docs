---
title: Azure Storage failover FAQ - Scenarios, Limitations, and Best Practices
titleSuffix: Azure Storage
description: Learn answers to frequently asked questions about Azure storage failover.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: concept-article
ms.date: 09/25/2025
ms.author: shaas

# Customer intent: "As a cloud architect, I want to understand Azure storage failover mechanisms and geo-redundant options so that I can ensure continuous accessibility and resilience of data across regions during service interruptions."
---
# Azure Storage failover FAQ: scenarios, limitations, and best practices

Azure Storage offers robust redundancy and disaster recovery capabilities through features like locally redundant storage (LRS), geo-redundant storage (GRS), and zone-redundant storage (ZRS). Understanding the nuances of planned and unplanned failover and the subsequent failback process is critical to maintaining data integrity and service availability. 

This document answers frequently asked questions, describes the technical scenarios, conflicting features, and operational impacts associated with Azure Storage failover and failback. It provides guidance on best practices, highlights potential pitfalls such as data loss and unsupported configurations, and explains how to restore storage accounts to their original state after a failover event. By following these recommendations, organizations can better prepare for disaster recovery and ensure business continuity when using Azure Storage.

## How are planned and unplanned failovers different?

Azure Storage accounts support two types of customer-managed failovers:

- **Customer-managed planned failover**: Customers can manage storage account failover to test their disaster recovery plan.
- **Customer-managed (unplanned) failover**: Customers can manage storage account failover if there's an unexpected service outage.

Each type of failover has a unique set of use cases and corresponding expectations for data loss.

**Planned Failover**

Planned failover can be utilized in multiple scenarios including planned disaster recovery testing, a proactive approach to large scale disasters, or to recover from nonstorage related outages. During the planned failover process, the primary and secondary regions are swapped and the account remains geo-redundant. The original primary region is demoted and becomes the new secondary region. At the same time, the original secondary region is promoted and becomes the new primary. Data loss isn't expected during the planned failover and failback process as long as the primary and secondary regions are available throughout the entire process. 

To learn more, refer to the [How planned failover works](storage-failover-customer-managed-planned.md#how-customer-managed-planned-failover-preview-works) article

**Unplanned Failover**

You can initiate an unplanned failover to your storage account's secondary region if the data endpoints for the storage services become unavailable in the primary region. After the failover is complete, the storage account becomes Locally Redundant Storage (LRS) and the secondary region becomes the new primary. Users can proceed to access data from their new primary region. 

Because data is written asynchronously from the primary region to the secondary region, there's always a delay before a write to the primary region is copied to the secondary. When an unplanned failover is initiated, all data in the primary region is lost as the secondary region becomes the new primary. All data already copied to the secondary region is maintained when the failover happens. However, any data written to the primary that doesn't yet exist within the secondary region is lost permanently. Users can utilize their Last Sync Time, to confirm the last time a full sync between the primary and secondary region was completed.

To learn more, refer to the [How unplanned failover works](storage-failover-customer-managed-unplanned.md#how-customer-managed-unplanned-failover-works) article

## What impact will failover have on my account after it completes?

**Planned Failover**

Planned Failover has the following impacts on your storage account: 

- The storage account's redundancy will either remain or be converted to GRS/RA-GRS.
- The primary and secondary regions will be swapped. The original secondary region will become the new primary region and the original primary region will become the new secondary region.
- There is no data loss expected.

**Unplanned Failover**

- The storage account will lose geo-redundancy, resulting in the new redundancy becoming Locally Redundant Storage (LRS).
- The account's previous secondary region, will now be the primary region.
- Users may experience data loss if any writes were made to their storage account after the Last Sync Time.

A summary of the impact of Planned and Unplanned Failover can be found here: 

| Result of failover on... | Customer-managed planned failover (preview)  | Customer-managed (unplanned) failover        |
|--------------------------|----------------------------------------------|----------------------------------------------|
| ...the secondary region  | The secondary region becomes the new primary | The secondary region becomes the new primary |
| ...the original primary region | The original primary region becomes the new secondary | The copy of the data in the original primary region is deleted |
| ...the account redundancy configuration | The storage account is converted to GRS | The storage account is converted to LRS |
| ...the geo-redundancy configuration | Geo-redundancy is retained | Geo-redundancy is lost |

The following table summarizes the resulting redundancy configuration at every stage of the failover and failback process for each type of failover:

| Original configuration           | After failover | After re-enabling geo redundancy | After failback | After re-enabling geo redundancy |
|----------------------------------|----------------|----------------------------------|----------------|----------------------------------|
| **Customer-managed planned failover** |           |                                  |                |                                  |
| GRS                              | GRS            | n/a<sup>1</sup>                  | GRS            | n/a<sup>1</sup>                  |
| GZRS                             | GZRS           | n/a<sup>1</sup>                  | GZRS           | n/a<sup>1</sup>                  |
| **Customer-managed (unplanned) failover** |       |                                  |                |                                  |
| LRS                              | LRS            | GRS                              | LRS            | GRS                              |
| GZRS                             | LRS            | GRS                              | ZRS            | GZRS                             |

    
## Why can't I change my SKU to Zonal Redundant Storage (ZRS) or Geo-Zonal Redundant Storage (GZRS) after a failover?

Performing a zonal conversion (adding zonal redundancy) after any failover operation is currently not supported. After an unplanned failover completes, the storage account's redundancy becomes LRS regardless of what the redundancy was before the failover operation. After the unplanned failover is completed, the user can only convert their account to GRS or RA-GRS, converting the account to ZRS, GZRS, or RA-GZRS isn't possible. If a user would like to convert their account back to ZRS, they need to perform a failback operation (complete another unplanned or planned failover back to the original primary region). After the failback completes, the user can convert their storage account back to ZRS, GZRS, or RA-GZRS. The behavior is similar with a planned failover, except the account's redundancy becomes GRS regardless of the original account redundancy. If you would like to convert the account back to GZRS, you need to failback to the original primary region then submit a request to have the account converted from GRS to GZRS.

This chart describes the changes to a storage account's redundancy after a failover and failback:

| Original configuration           | After failover | After re-enabling geo redundancy | After failback | After re-enabling geo redundancy |
|----------------------------------|----------------|----------------------------------|----------------|----------------------------------|
| **Customer-managed planned failover** |           |                                  |                |                                  |
| GRS                              | GRS            | n/a<sup>1</sup>                  | GRS            | n/a<sup>1</sup>                  |
| GZRS                             | GZRS           | n/a<sup>1</sup>                  | GZRS           | n/a<sup>1</sup>                  |
| **Customer-managed (unplanned) failover** |       |                                  |                |                                  |
| LRS                              | LRS            | GRS                              | LRS            | GRS                              |
| GZRS                             | LRS            | GRS                              | ZRS            | GZRS                             |

## Is there data loss expected after a failover?

Whether your account will experience data loss after a failover depends on which failover operation you initiated. For Planned Failover, there's no data loss expected after completing a planned failover. With Unplanned Failover, users might experience data loss. Users can utilize the Last Sync Time property to determine the last time a full synchronization completed between their primary and secondary region. Any data or metadata written before the Last Sync Time successfully replicates to the secondary region and will be available after the unplanned failover but any data or metadata written after might be lost.

## How long will it take to convert my account from LRS to GRS after an unplanned failover?

There's currently no service level agreement (SLA) for completion of a geo conversion, and it isn't possible to expedite this process by submitting a support request. The timeframe it takes to complete these conversions can vary depending on various factors, including:

- The number and size of the objects in the storage account.
- The available resources for background replication, such as CPU, memory, disk, and WAN capacity.

You can read more about the factors affecting SKU conversion times in the Initiate a storage account failover article. You can also learn more about changing a storage account's replication options in the Change the redundancy option for a storage account article.

## Why is my account's "Location" property different than my "Primary region" after a failover?

Microsoft provides two REST APIs for working with Azure Storage resources. These APIs form the basis of all actions you can perform against Azure Storage. The Azure Storage REST API, often referred to as the data plane, enables you to work with data in your storage account, including blob, queue, file, and table data. The Azure Storage resource provider REST API, often referred to as the control plane, enables you to manage the storage account and related resources.

After a failover is complete, clients can once again read and write Azure Storage data in the new primary region. However, the Azure Storage resource provider doesn't fail over, so resource management operations must still take place in the primary region. Because the Azure Storage resource provider doesn't fail over, the Location property will return the original primary location after the failover is complete.

The following image contains an example of the expected **Location** and **Primary Region** after a planned failover:

:::image type="content" source="media/storage-failover-faq/account-details.png" alt-text="Screen capture showing storage account details.":::

## What is a failback?

A failback is a term we use to describe the process of utilizing a failover operation to restore the storage account to its original primary region. After an unplanned or planned failover, the original secondary region of the GRS account becomes the new primary region. A user must initiate another failover operation in order to the restore the account back to its original primary region. 

Essentially, a failback is a failover that is initiated after the original failover operation is performed on the account. The failback experience for unplanned and planned failover differ in a few ways. 

**Planned Failover**

After a planned failover the account remains geo-redundant, so the user is only required to initiate another planned failover. Learn more about [how to initiate a planned failover](storage-failover-customer-managed-planned.md#how-to-initiate-a-failover).

**Unplanned Failover**

After an unplanned failover the account becomes LRS so there a few steps required to failback: 

1. Convert the account from LRS to GRS. It's important to remember that the conversion from LRS to GRS does not have an SLA, and there are data bandwidth charges that will apply when completing this conversion.
2. Initiate an unplanned failover or failback.

Learn more about [how to initiate an unplanned failover](storage-failover-customer-managed-unplanned.md#how-to-initiate-an-unplanned-failover).

## What are the conflicting features or scenarios for failovers?

Failovers carry with them a few limitations and conflicting features that users should be aware of. The following features or scenarios will block a failover operation from being initiated:

**Unplanned Failover:**

- Object Replication: Attempting to initiate a unplanned failover on an accounts with object replication (OR) will generate an error. In this case, you can delete your account's OR policies and attempt the conversion again.
- NFSv3: Attempting to initiate a unplanned failover on an accounts with NFSv3 will generate an error. Users are unable to disable NFSv3 on a storage account.

**Planned Failover:**

- Change Feed: Attempting to initiate a planned failover on an accounts with Change Feed will generate an error. In this case, you can disable Change Feed and attempt the failover again.
- Object Replication: Attempting to initiate a planned failover on an accounts with object replication (OR) will generate an error. In this case, you can delete your account's OR policies and attempt the conversion again.
- NFSv3:  Attempting to initiate a planned failover on an accounts with NFSv3 will generate an error. Users are unable to disable NFSv3 on a storage account.
- Point-in-time-Restore: Attempting to initiate a planned failover on an accounts with Point-in-time-Restore (PITR) will generate an error. In this case, you can disable PITR and Change Feed and attempt the failover again.
- Last Sync Time is greater than 30 minutes: Planned Failover is not supported for storage accounts with a Last Sync Time greater than 30 minutes.

Azure File Sync doesn't support customer-managed planned or unplanned failover. Storage accounts used as cloud endpoints for Azure File Sync shouldn't be failed over. Failover disrupts file sync and might cause the unexpected data loss of newly tiered files. For more information, see Best practices for disaster recovery with Azure File Sync for details.

## Next steps

As part of planning for your storage account resiliency, you can review the following articles for more information:

- [Well-Architected Framework Reliability Pillar](/azure/well-architected/resiliency/overview)
- [Storage Account Overview](./storage-account-overview.md)
- [Azure Storage redundancy](./storage-redundancy.md)
- [Initiate Account Failover](./storage-initiate-account-failover.md)
- [Cross region replication](/azure/reliability/cross-region-replication-azure)
- [Private endpoint DNS](../../private-link/private-endpoint-dns.md)
