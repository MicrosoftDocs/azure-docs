---
title: Data replication in Azure Storage | Microsoft Docs
description: Data in your Microsoft Azure Storage account is replicated for durability and high availability. Replication options include locally redundant storage (LRS), zone-redundant storage (ZRS), geo-redundant storage (GRS), and read-access geo-redundant storage (RA-GRS).
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 01/21/2018
ms.author: tamram
---

# Azure Storage replication

The data in your Microsoft Azure storage account is always replicated to ensure durability and high availability. Replication copies your data so that it is protected from transient hardware failures, preserving your application up-time. 

You can choose to replicate your data within the same data center, across data centers within the same region, or across regions. If your data is replicated across multiple data centers or across regions, it's also protected from a catastrophic failure in a single location.

Replication ensures that your storage account meets the [Service-Level Agreement (SLA) for Storage](https://azure.microsoft.com/support/legal/sla/storage/) even in the face of failures. See the SLA for information about Azure Storage guarantees for durability and availability.

## Choosing a replication option

When you create a storage account, you can select one of the following replication options:

* [Locally redundant storage (LRS)](storage-redundancy-lrs.md)
* [Zone-redundant storage (ZRS)](storage-redundancy-zrs.md)
* [Geo-redundant storage (GRS)](storage-redundancy-grs.md)
* [Read-access geo-redundant storage (RA-GRS)](storage-redundancy-grs.md#read-access-geo-redundant-storage)

Locally redundant storage (LRS) is the default option when you create a storage account.

> [!IMPORTANT]
> You can change how your data is replicated after your storage account has been created. However, you may incur an additional one-time data transfer cost if you switch from LRS or ZRS to GRS or RA-GRS.
>

The following table provides a quick overview of the differences between LRS, ZRS, GRS, and RA-GRS:

| Replication strategy | LRS | ZRS | GRS | RA-GRS |
|:--- |:--- |:--- |:--- |:--- |
| Data is replicated across multiple datacenters. |No |Yes |Yes |Yes |
| Data is replicated across multiple availability zones. |No |Yes |No |No |
| Data can be read from a secondary location as well as the primary location. |No |No |No |Yes |
| Designed to provide ___ durability of objects over a given year. |at least 99.999999999% (11 9's)|at least 99.9999999999% (12 9's)|at least 99.99999999999999% (16 9's)|at least 99.99999999999999% (16 9's)|

See [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) for pricing information for the different redundancy options.

> [!NOTE]
> Premium Storage supports only locally redundant storage (LRS). For information about Premium Storage, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../../virtual-machines/windows/premium-storage.md).
>

## Frequently asked questions

<a id="howtochange"></a>
#### 1. How can I change the geo-replication type of my storage account?

   You can change the geo-replication type of your storage account by using the [Azure portal](https://portal.azure.com/), [Azure Powershell](storage-powershell-guide-full.md), or one of the Azure Storage client libraries.

   > [!NOTE]
   > ZRS accounts cannot be converted LRS or GRS. Similarly, an existing LRS or GRS account cannot be converted to a ZRS account.
    
<a id="changedowntime"></a>
#### 2. Does changing the replication type of my storage account result in down time?

   No, changing the replication type of your storage account does not result in down time.

<a id="changecost"></a>
#### 3. Are there additional costs to changing the replication type of my storage account?

   Yes. If you change from LRS to GRS (or RA-GRS) for your storage account, you incur an additional charge for egress involved in copying existing data from primary location to the secondary location. After the initial data is copied, there are no further additional egress charges for geo-replication from the primary to secondary location. For details on bandwidth charges, see [Azure Storage Pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

   If you change from GRS to LRS, there is no additional cost, but your data is deleted from the secondary location.

<a id="ragrsbenefits"></a>
#### 4. How can RA-GRS help me?

   GRS storage provides replication of your data from a primary to a secondary region that is hundreds of miles away from the primary region. With GRS, your data is durable even in the event of a complete regional outage or a disaster in which the primary region is not recoverable. RA-GRS storage offers GRS replication and adds the ability to read the data from the secondary location. For suggestions on how to design for high availability, see [Designing Highly Available Applications using RA-GRS storage](../storage-designing-ha-apps-with-ragrs.md).

<a id="lastsynctime"></a>
#### 5. Is there a way to figure out how long it takes to replicate my data from the primary to the secondary region?

   If you are using RA-GRS storage, you can check the Last Sync Time of your storage account. Last Sync Time is a GMT date/time value. All primary writes before the Last Sync Time have been successfully written to the secondary location, meaning that they are available to be read from the secondary location. Primary writes after the Last Sync Time may or may not be available for reads yet. You can query this value using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](storage-powershell-guide-full.md), or from one of the Azure Storage client libraries.

<a id="outage"></a>
#### 6. If there is an outage in the primary region, how do I switch to the secondary region?

   For more information, see [What to do if an Azure Storage outage occurs](../storage-disaster-recovery-guidance.md).

<a id="rpo-rto"></a>
#### 7. What is the RPO and RTO with GRS?

   **Recover Point Objective (RPO):** In GRS and RA-GRS, the storage service asynchronously geo-replicates the data from the primary to the secondary location. In the event of a major regional disaster in the primary region, Microsoft performs a failover to the secondary region. If a failover happens, recent changes that have not yet been geo-replicated may be lost. The number of minutes of potential data lost is referred to as the RPO, and it indicates the point in time to which data can be recovered. Azure Storage typically has an RPO of less than 15 minutes, although there is currently no SLA on how long geo-replication takes.

   **Recovery Time Objective (RTO):** The RTO is a measure of how long it takes to perform the failover and get the storage account back online. The time to perform the failover includes the following actions:

   * The time Microsoft requires to determine whether the data can be recovered at the primary location, or if a failover is necessary.
   * The time to perform the failover of the storage account by changing the primary DNS entries to point to the secondary location.

   Microsoft takes the responsibility of preserving your data seriously. If there is any chance of recovering the data in the primary region, Microsoft will delay the failover and focus on recovering your data. A future version of the service will allow you to trigger a failover at an account level so that you can control the RTO yourself.

#### 8. What Azure Storage objects does ZRS support? 
Block blobs, page blobs (except for those backing VM disks), tables, files, and queues. 

#### 9. Does ZRS also include geo-replication? 
Currently ZRS does not support geo-replication. If your scenario requires cross-region replication for the purposes of disaster recovery, use a GRS or RA-GRS storage account instead.   

#### 10. What happens when one or more ZRS zones go down? 
When the first zone goes down, ZRS continues to write replicas of your data across the two remaining zones in the region. If a second zone goes down, read and write access is unavailable until at least two zones are available again. 

## Next steps
* [Designing highly available applications using RA-GRS Storage](../storage-designing-ha-apps-with-ragrs.md)
* [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/)
* [About Azure storage accounts](../storage-create-storage-account.md)
* [Azure Storage scalability and performance targets](storage-scalability-targets.md)
* [Microsoft Azure Storage redundancy options and read access geo redundant storage ](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/12/11/introducing-read-access-geo-replicated-storage-ra-grs-for-windows-azure-storage.aspx)
* [SOSP Paper - Azure Storage: A highly available cloud storage service with strong consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx)
