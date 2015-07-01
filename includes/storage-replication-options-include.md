The data in your Microsoft Azure storage account is always replicated to ensure durability and high availability, meeting the [Azure Storage SLA](http://azure.microsoft.com/support/legal/sla/) even in the face of transient hardware failures. 
When you create a storage account, you must select one of the following replication options:  

- **Locally redundant storage (LRS).** Locally redundant storage maintains three copies of your data. LRS is replicated three times within a single facility in a single region. LRS protects your data from normal hardware failures, but not from the failure of a single facility.  
  
	LRS is offered at a discount. For maximum durability, we recommend that you use geo-redundant storage, described below.


- **Zone-redundant storage (ZRS).** Zone-redundant storage maintains three copies of your data. ZRS is replicated three times across two to three facilities, either within a single region or across two regions, providing higher durability than LRS. ZRS ensures that your data is durable within a single region.  

	ZRS provides a higher level of durability than LRS; however, for maximum durability, we recommend that you use geo-redundant storage, described below.  

	> [AZURE.NOTE] ZRS is currently available only for block blobs.
	> 
	> Once you have created your storage account and selected ZRS, you cannot convert it to use to any other type of replication, or vice versa. 

- **Geo-redundant storage (GRS)**. Geo-redundant storage is enabled for your storage account by default when you create it. GRS maintains six copies of your data. With GRS, your data is replicated three times within the primary region, and is also replicated three times in a secondary region hundreds of miles away from the primary region, providing the highest level of durability. In the event of a failure at the primary region, Azure Storage will failover to the secondary region. GRS ensures that your data is durable in two separate regions.


- **Read access geo-redundant storage (RA-GRS)**. Read access geo-redundant storage replicates your data to a secondary geographic location, and also provides read access to your data in the secondary location. Read-access geo-redundant storage allows you to access your data from either the primary or the secondary location, in the event that one location becomes unavailable.

	> [AZURE.IMPORTANT] You can change how your data is replicated after your storage account has been created, unless you specified ZRS when you created the account. However, note that you may incur an additional one-time data transfer cost if you switch from LRS to GRS or RA-GRS.
 
See [Azure Storage Replication](../articles/storage/storage-redundancy.md) for additional details about storage replication options.

For pricing information for storage account replication, see [Storage Pricing Details](http://azure.microsoft.com/pricing/details/storage/).

For architectural details about durability with Azure Storage, see the [Azure Storage SOSP Paper](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx).

