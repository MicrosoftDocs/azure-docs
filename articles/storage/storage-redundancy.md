<properties
	pageTitle="Azure Storage replication | Microsoft Azure"
	description="Data in your Microsoft Azure storage account is replicated for durability and high availability. Replication options include locally redundant storage (LRS), zone-redundant storage (ZRS), geo-redundant storage (GRS), and read-access geo-redundant storage (RA-GRS)."
	services="storage"
	documentationCenter=""
	authors="tamram"
	manager="carmonm"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/03/2016"
	ms.author="tamram"/>

# Azure Storage replication

The data in your Microsoft Azure storage account is always replicated to ensure durability and high availability, meeting the [Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage) even in the face of transient hardware failures.

When you create a storage account, you must select one of the following replication options:  

- [Locally redundant storage (LRS)](#locally-redundant-storage)
- [Zone-redundant storage (ZRS)](#zone-redundant-storage)
- [Geo-redundant storage (GRS)](#geo-redundant-storage)
- [Read-access geo-redundant storage (RA-GRS)](#read-access-geo-redundant-storage)

The following table provides a quick overview of the differences between LRS, ZRS, GRS, and RA-GRS, while subsequent sections address each type of replication in more detail.


| Replication strategy                                                               | LRS | ZRS | GRS | RA-GRS |
|:----------------------------------------------------------------------------------|:---|:---|:---|:------|
| Data is replicated across multiple facilities.                                     | No  | Yes | Yes | Yes    |
| Data can be read from the secondary location as well as from the primary location. | No  | No  | No  | Yes    |
| Number of copies of data maintained on separate nodes.                             | 3   | 3   | 6   | 6      |

See [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) for pricing information for the different redundancy options.

## Locally redundant storage

Locally redundant storage (LRS) replicates your data within the region in which you created your storage account. To maximize durability, every request made against data in your storage account is replicated three times. These three replicas each reside in separate fault domains and upgrade domains. A fault domain (FD) is a group of nodes that represent a physical unit of failure and can be considered as nodes belonging to the same physical rack. An upgrade domain (UD) is a group of nodes that are upgraded together during the process of a service upgrade (rollout). The three replicas are spread across UDs and FDs to ensure that data is available even if hardware failure impacts a single rack and when nodes are upgraded during a rollout. A request returns successfully only once it has been written to all three replicas.

While geo-redundant storage (GRS) is recommended for most applications, locally redundant storage may be desirable in certain scenarios:  

- LRS is less expensive than GRS, and also offers higher throughput. If your application stores data that can be easily reconstructed, you may opt for LRS.

- Some applications are restricted to replicating data only within a single region due to data governance requirements.

- If your application has its own geo-replication strategy, then it may not require GRS.


## Zone-redundant storage

Zone-redundant storage (ZRS) replicates your data across two to three facilities, either within a single region or across two regions, providing higher durability than LRS. If your storage account has ZRS enabled, then your data is durable even in the case of failure at one of the facilities.


>[AZURE.NOTE]  ZRS is currently available only for block blobs, and is supported only in versions 2014-02-14 and later. Note that once you have created your storage account and selected zone-redundant replication, you cannot convert it to use any other type of replication, or vice versa.


## Geo-redundant storage

Geo-redundant storage (GRS) replicates your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region is not recoverable.

For a storage account with GRS enabled, an update is first committed to the primary region, where it is replicated three times. Then the update is replicated to the secondary region, where it is also replicated three times, across separate fault domains and upgrade domains.

> [AZURE.NOTE] With GRS, requests to write data are replicated asynchronously to the secondary region. It is important to note that opting for GRS does not impact latency of requests made against the primary region. However, since asychronous replication involves a delay, in the event of a regional disaster it is possible that changes that have not yet been replicated to the secondary region may be lost if the data cannot be recovered from the primary region.
 
When you create a storage account, you select the primary region for the account. The secondary region is determined based on the primary region, and cannot be changed. The following table shows the primary and secondary region pairings.

| Primary             | Secondary           |
|---------------------|---------------------|
| North Central US    | South Central US    |
| South Central US    | North Central US    |
| East US             | West US             |
| West US             | East US             |
| US East 2           | Central US          |
| Central US          | US East 2           |
| North Europe        | West Europe         |
| West Europe         | North Europe        |
| South East Asia     | East Asia           |
| East Asia           | South East Asia     |
| East China          | North China         |
| North China         | East China          |
| Japan East          | Japan West          |
| Japan West          | Japan East          |
| Brazil South        | South Central US    |
| Australia East      | Australia Southeast |
| Australia Southeast | Australia East      |
| India South         | India Central       |
| India Central       | India South         |
| US Gov Iowa         | US Gov Virginia     |
| US Gov Virginia     | US Gov Iowa         |
| Canada Central      | Canada East     	|
| Canada East         | Canada Central      |
| UK North            | UK South 2          |
| UK South 2          | UK North            |
| Germany Central     | Germany Northeast   |
| Germany Northeast   | Germany Central     |
| West US 2           | Central West US     |
| Central West US     | West US 2           |

For up-to-date information about regions supported by Azure, see [Azure Regions](https://azure.microsoft.com/regions/).
 
## Read-access geo-redundant storage

Read-access geo-redundant storage (RA-GRS) maximizes availability for your storage account, by providing read-only access to the data in the secondary location, in addition to the replication across two regions provided by GRS. In the event that data becomes unavailable in the primary region, your application can read data from the secondary region.

When you enable read-only access to your data in the secondary region, your data is available on a secondary endpoint, in addition to the primary endpoint for your storage account. The secondary endpoint is similar to the primary endpoint, but appends the suffix `–secondary` to the account name. For example, if your primary endpoint for the Blob service is `myaccount.blob.core.windows.net`, then your secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The access keys for your storage account are the same for both the primary and secondary endpoints.

## Next steps

- [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/)
- [About Azure storage accounts](storage-create-storage-account.md)
- [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md)
- [Microsoft Azure Storage Redundancy Options and Read Access Geo Redundant Storage ](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/12/11/introducing-read-access-geo-replicated-storage-ra-grs-for-windows-azure-storage.aspx)  
- [SOSP Paper - Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx)  
