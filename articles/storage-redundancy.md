
<properties 
  pageTitle="Azure Storage Redundancy Options | Microsoft Azure" 
  description="The data in your Microsoft Azure storage account is always replicated to ensure durability and high availability. Learn about replication options for your Azure storage account." 
  services="storage" 
  documentationCenter="" 
  authors="tamram" 
  manager="adinah" 
  editor=""/>

<tags 
  ms.service="storage" 
  ms.workload="storage" 
  ms.tgt_pltfrm="na" 
  ms.devlang="na" 
  ms.topic="article" 
  ms.date="03/20/2015" 
  ms.author="tamram"/>

# Azure Storage Redundancy Options



The data in your Microsoft Azure storage account is always replicated to ensure durability and high availability, meeting the [Azure Storage SLA](http://azure.microsoft.com/support/legal/sla/) even in the face of transient hardware failures. For architectural details about durability with Azure Storage, see the [Azure Storage SOSP Paper](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx).

When you create your storage account, you must select one of the following replication options:  

- **Locally redundant storage (LRS).** Locally redundant storage maintains three copies of your data. LRS is replicated three times within a single facility in a single region. LRS protects your data from normal hardware failures, but not from the failure of a single facility.  
  
LRS is offered at a discount. For maximum durability, we recommend that you use geo-redundant storage, described below.


- **Zone-redundant storage (ZRS).** Zone-redundant storage maintains three copies of your data. ZRS is replicated three times across two to three facilities, either within a single region or across two regions, providing higher durability than LRS. ZRS ensures that your data is durable within a single region.  
ZRS provides a higher level of durability than LRS; however, for maximum durability, we recommend that you use geo-redundant storage, described below.  

	> [AZURE.NOTE] ZRS is currently available only for block blobs.  
	> Once you have created your storage account and selected zone-redundant replication, you cannot convert it to use to any other type of replication, or vice versa.
 


- **Geo-redundant storage (GRS)**. Geo-redundant storage is enabled for your storage account by default when you create it. GRS maintains six copies of your data. With GRS, your data is replicated three times within the primary region, and is also replicated three times in a secondary region hundreds of miles away from the primary region, providing the highest level of durability. In the event of a failure at the primary region, Azure Storage will failover to the secondary region. GRS ensures that your data is durable in two separate regions.


- **Read access geo-redundant storage (RA-GRS)**. Read access geo-redundant storage replicates your data to a secondary geographic location, and also provides read access to your data in the secondary location. Read-access geo-redundant storage allows you to access your data from either the primary or the secondary location, in the event that one location becomes unavailable.

	> [AZURE.IMPORTANT] You can change how your data is replicated after your storage account has been created, but note that you may incur an additional one-time data transfer cost if you switch from LRS to GRS or RA-GRS. If you choose GRS when you create your account, then you cannot subsequently switch to any other type of replication, or vice versa.
 

The following table provides a quick overview of the differences between LRS, ZRS, GRS, and RA-GRS, while subsequent sections address each type of replication in more detail.


|Replication Strategy|LRS|ZRS|GRS|RA-GRS 
|--------------------|---|---|---|------
|Data is replicated across multiple facilities|No|Yes|Yes|Yes|
|Data can be read from the secondary location as well as from the primary location|No|No|No|Yes
|Number of copies of data maintained on separate nodes|3|3|6|6
 

For pricing information for storage account replication, see [Storage Pricing Details.](http://azure.microsoft.com/pricing/details/storage/)

## Locally Redundant Storage (LRS)

Locally redundant storage replicates your data within the region in which you created your storage account. To maximize durability, every request made against data in your storage account is replicated three times. These three replicas each reside in separate fault domains and upgrade domains. A fault domain (FD) is a group of nodes that represent a physical unit of failure and can be considered as nodes belonging to the same physical rack. An upgrade domain (UD) is a group of nodes that are upgraded together during the process of service upgrade (rollout). The three replicas are spread across UDs and FDs to ensure that data is available even if hardware failure impacts a single rack and when nodes are upgraded during a rollout. A request returns successfully only once it has been written to all three replicas.

While geo-redundant storage is recommended for most applications, locally redundant storage may be desirable in certain scenarios:  

- LRS is less expensive than GRS, and also offers higher throughput. If your application stores data that can be easily reconstructed, you may opt for LRS.

- Some applications are restricted to replicating data only within a single region due to data governance requirements.

- If your application has its own geo-replication strategy, then it may not require GRS.


## Zone-Redundant Storage (ZRS)

Zone-redundant storage replicates your data across two to three facilities, either within a single region or across two regions, providing higher durability than LRS. If your storage account has ZRS enabled, then your data is durable even in the case of failure at one of the facilities.


>[AZURE.NOTE]  ZRS is currently available only for block blobs. Note that once you have created your storage account and selected zone-redundant replication, you cannot convert it to use to any other type of replication, or vice versa.


## Geo-Redundant Storage (GRS)


Geo-redundant storage replicates your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region is not recoverable. 

For a storage account with GRS enabled, an update is first committed to the primary region, where it is replicated three times. Then the update is replicated to the secondary region, where it is also replicated three times, across separate fault domains and upgrade domains.

 
> [AZURE.NOTE] With GRS, requests to write data are replicated asynchronously to the secondary region. It is important to note that opting for GRS does not impact latency of requests made against the primary region. However, since asychronous replication involves a delay, in the event of a regional disaster it is possible that changes that have not yet been replicated to the secondary region may be lost if the data cannot be recovered from the primary region.
 
When you create a storage account, you select the primary region for the account. The secondary region is determined based on the primary region, and cannot be changed. The following table shows the primary and secondary region pairings:

|Primary            |Secondary        
| ---------------   |----------------
|North Central US   |South Central US
|South Central US   |North Central US
|East US            |West US        
|West US            |East US         
|US East 2          |Central US      
|Central US         |US East 2       
|North Europe       |West Europe     
|West Europe        |North Europe    
|South East Asia    |East Asia       
|East Asia          |South East Asia 
|East China         |North China     
|North China        |East China      
|Japan East         |Japan West      
|Japan West         |Japan East      
|Brazil South       |South Central US
|Australia East     |Australia Southeast
|Australia Southeast|Australia East  

 
## Read-Access Geo-Redundant Storage (RA-GRS)

Read-access geo-redundant storage maximizes availability for your storage account, by providing read-only access to the data in the secondary location, in addition to the replication across two regions provided by GRS. In the event that data becomes unavailable in the primary region, your application can read data from the secondary region.

When you enable read-only access to your data in the secondary region, your data is available on a secondary endpoint, in addition to the primary endpoint for your storage account. The secondary endpoint is similar to the primary endpoint, but appends the suffix `–secondary` to the account name. For example, if your primary endpoint for the Blob service is `myaccount.blob.core.windows.net`, then your secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The access keys for your storage account are the same for both the primary and secondary endpoints.

## Next steps

- [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md) 
- [Microsoft Azure Storage Redundancy Options and Read Access Geo Redundant Storage ](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/12/11/introducing-read-access-geo-replicated-storage-ra-grs-for-windows-azure-storage.aspx)  
- [Microsoft Azure Storage Emulator 3.1 with RA-GRS ](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/08/microsoft-azure-storage-emulator-3-1-with-ra-grs.aspx)
- [Azure Storage SOSP Paper](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx)  
