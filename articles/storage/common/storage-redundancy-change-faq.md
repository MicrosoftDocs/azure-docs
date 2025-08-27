---
title: Storage redundancy change FAQs
titleSuffix: Azure Storage
description: Frequently asked questions about changing redundancy configuration.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: concept-article
ms.date: 08/18/2025
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

There are many different factors that can help drive the need to change your storage account's redundancy options. The decision to change redundancy options involves carefully balancing your organization's data availability, disaster recovery, performance, and cost requirements. These requirements are then weighed against the risks and benefits of various redundancy options. Regular assessment and adjustment are crucial to ensure an optimal and resilient data storage strategy.

This article contains answers to frequently asked questions about the process of changing Azure Storage redundancy options.

## What charges are associated with a SKU conversion? 

When you add or remove zonal redundancy to a storage account, the storage account undergoes a *conversion*. These conversions include *LRS to or from ZRS*, *GRS to or from GZRS*, or *RA-GRS to or from RA-GZRS*. There are no initial costs for making these conversions. However, after an account is successfully converted, the ongoing data storage and transaction cost might be higher due to the increased replication. 

For example, there's no charge for the initial conversion of an account from LRS to ZRS, but ZRS has a higher data storage and data transaction cost than LRS.

For details on pricing, see the [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) article.

When you *add* geo-redundancy, the conversion incurs a [geo-replication data transfer charge](https://azure.microsoft.com/pricing/details/storage/blobs/) at the time of the change. This transfer charge applies because your entire storage account is being replicated to the secondary region. All subsequent writes to the primary region also incur geo-replication data transfer charges to replicate the write to the secondary region. This charge applies to LRS to GRS, RA-GRS or ZRS to GZRS, and RA to GZRS.

There are no charges incurred when you *remove* geo-redundancy, for example, *GRS to LRS* or *ZRS to GZRS*.

When you remove read access from your storage account, your account is billed as RA-GRS or RA-GZRS for 30 days beyond the date on which it was converted. This policy applies to *RA-GRS to GRS* or *RA-GZRS to GZRS*, for example.

You can learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.
    
## How long does the SKU conversion process take? 

Zonal redundancy conversions such as *LRS to or from ZRS*, *GRS to or from GZRS*, or *RA-GRS to or from RA-GZRS* typically begin within a few days after a request is validated. However, it might take weeks to complete, depending on current resource demands in the region, account size, and other factors.

It isn't possible to speed up this process by submitting a support request. The conversion progress changes to 'In progress' when data movement begins.

There's currently no service level agreement (SLA) for completion of a SKU conversion. If you need more control over when a conversion begins and finishes, consider a Manual migration. Manual migrations utilize a feature or tool such as AzCopy to migrate the data of your current storage account to another storage account with the desired redundancy.

You can learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.

Geo redundancy conversions, including *LRS to or from GRS* or *ZRS to or from GZRS*, currently have no SLA for completion. It isn't possible to speed up this process by submitting a support request. The timeframe it takes to complete these conversions can vary depending on various factors, including:

- The number and size of the objects in the storage account.
- The available resources for background replication, such as CPU, memory, disk, and WAN capacity.

You can read more about the factors affecting SKU conversion times in the [Initiate a storage account failover - Azure Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-failover) article.

## Why is my SKU conversion process taking so long?

There's currently no SLA for completion of a  SKU conversion. It isn't possible to speed up this process by submitting a support request. The conversion progress changes to 'In progress' when data movement begins.

If you need more control over when a conversion begins and finishes, consider a Manual migration. Manual migrations utilize a feature or tool such as AzCopy to migrate the data of your current storage account to another storage account with the desired redundancy. The SKU conversion process typically completes within a few days but can take up to a few weeks depending on the current resource demands in the region, account size along with various other factors.

You can learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.
        
## What is the performance and availability impact of a SKU conversion? Is there any application downtime expected? Is there any data loss expected?

During a SKU conversion, you can access data in your storage account with no loss of durability or availability. The Azure Storage SLA is maintained during the migration process and no data is lost during a conversion. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.
        
You can learn more about changing a storage account's replication options in the [Change the redundancy option for a storage account](redundancy-migration.md) article.
    
## How do I convert my account from LRS to GZRS?

A direct conversion form LRS to GZRS isn't supported today and this conversion requires a two-step process. You have the option of completing this conversion two ways:

1. *LRS to ZRS*, followed by *ZRS to GZRS*, or 
1. *LRS to GRS*, followed by *GRS to GZRS*. 

When performing an *LRS to ZRS* conversion followed by *ZRS to GZRS*, you must wait at least 72 hours between the conversions. This temporary delay allows background processes to complete before making another change, ensuring the consistency and integrity of the account.

## How do I convert my account from GZRS to LRS?

A direct *GZRS to LRS* conversion isn't supported and requires a two-step process. You have the option of completing this conversion two ways: 

1. *GZRS to ZRS*, followed by *ZRS to LRS*, or 
1. *GZRS to GRS*, followed by *GRS to LRS*. 

When performing a *GZRS to GRS* conversion followed by *GRS to LRS*, you must wait at least 72 hours between the conversions. This temporary delay allows background processes to complete before making another change, ensuring the consistency and integrity of the account.

## How do I convert my account from GRS to ZRS?

A direct *GRS to ZRS* conversion isn't supported and requires a two-step process. You have the option of completing this conversion two ways: 

1. *GRS to GZRS*, followed by *GZRS to ZRS*.
1. *GRS to LRS*, followed by *LRS to ZRS*.

When performing a *GRS to GZRS* conversion followed by *GZRS to ZRS*, you must wait at least 72 hours between the conversions. This temporary hold allows background processes to complete before making another change, ensuring the consistency and integrity of the account.

If you perform a *GRS to LRS* conversion followed by *LRS to ZRS*, your storage account is temporarily held in LRS, a lower redundancy option. This option offers much less durability and availability.

## How do I convert my account from ZRS to GRS?

A direct *ZRS to GRS* conversion isn't supported and requires a two-step process. You have the option of completing this conversion two ways: 

1. *ZRS to GZRS*, followed by *GZRS to GRS*, or 
1. *ZRS to LRS*, followed by *LRS to GRS*.

When performing a *ZRS to LRS* conversion followed by *LRS to GRS*, you must wait at least 72 hours between the conversions. This temporary hold allows background processes to complete before making another change, ensuring the consistency and integrity of the account. When you complete the initial *ZRS to LRS* conversion, your storage account is temporarily held in LRS, a lower redundancy option. This option offers much less durability and availability.

## What are the conflicting features or scenarios for SKU conversions?

### Zonal Conversions (LRS <-> ZRS, GRS <-> GZRS, and RA-GRS <-> RA-GZRS)

- Object Replication: User can delete their object replication policies and retry. (WILL BE UNBLOCKED SOON)
- NFSv3: User can't unconfigure NFSv3 once enabled so if they really want ZRS they have to do a manual migration. For example, use AzCopy
- Point in time restore (PITR): User can disable PITR and retry (WILL BE UNBLOCKED SOON)
- Archive data: User can rehydrate their data to cold, cool, or hot, then retry or they can delete the archived data.
- NFSv4 accounts with public endpoints: User can disable access to the storage account’s public endpoints (Change how a storage account is replicated - Azure Storage | Microsoft Learn)
- Routing choice == Internet Routing: User can set their routing preference to Microsoft network routing (Configure network routing preference - Azure Storage | Microsoft Learn)
- Accounts with boot diagnostics enabled (this is only blocked for LRS -> ZRS, GRS -> GZRS and RA-GRS -> RA-GZRS): User can disable boot diagnostics on their account (Boot diagnostics for VMs in Azure - Virtual Machines | Microsoft Learn). Users can’t re-enable once the conversion is completed because boot diagnostics isn't supported for ZRS. 
- Requested current and target SKU change is supported (example: GRS -> ZRS is currently not supported). If the user attempts to change their GRS account to ZRS, they run into a failure.
- Their region supports the SKU they're attempting to convert to. Example: Mexico Central doesn't support GZRS so if a user attempts to convert their account from GRS to GZRS it fails.
- There's a conflicting migration currently ongoing on their account. Example: attempting to do LRS -> ZRS while LRS -> GRS is already in progress. User has to wait until the original migration completes before submitting a new conversion request.
- Account is failed over: User can failback their account to the original primary region then resubmit the request.


### Geo Conversions (LRS <-> GRS, ZRS <-> GZRS)

- Archive data (If accounts have archive data the data needs to be rehydrated before the LRS -> GRS request can be submitted). This is a check performed by SRP and users receive an error message almost instantly.
- Ensure your region supports your desired SKU (ex: there are 3+0 regions that support ZRS but don't support GZRS)

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
