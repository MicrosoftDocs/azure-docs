Data in your storage account is replicated to ensure durability that is also highly available, meeting the [Azure Storage SLA ](/en-us/support/legal/sla/) even in the face of transient hardware failures. Azure Storage is deployed in 15 regions around the world and also includes support for replicating data between regions. You have several options for replicating the data in your storage account:

- *Locally redundant storage (LRS)* is triple-replicated within a single location (or data center). When you write data to a blob, queue, or table, the write operation is performed synchronously across all three replicas. LRS protects your data from normal hardware failures. Every storage account is locally redundant at the primary location, regardless of whether it is also replicated to an additional location.

	Locally redundant storage is offered at a discount. For increased durability, update your account to use zone-redundant storage or geo-redundant storage, both described below.  

- *Zone-redundant storage (ZRS)* is triple-replicated synchronously within a primary location, and is additionally triple-replicated asynchronously to a separate location in the same zone. ZRS maintains an equivalent of 6 copies (replicas) of your data (3 in each location) and provides a medium level of storage durability. In the event of a failure at the primary location, Azure Storage will failover to the additional location.

	> [WACOM.NOTE] ZRS is currently available only for block blobs. Note that once you have created your storage account and selected zone-redundant replication, you cannot convert it to use to any other type of replication, or vice versa.

- *Geo-redundant storage (GRS)* is triple-replicated synchronously within a primary location, and is additionally triple-replicated asynchronously to a second region hundreds of miles away from the primary region. GRS maintains an equivalent of 6 copies (replicas) of your data (3 in each region) and provides the highest level of durability. In the event of a failure at the primary location, Azure Storage will failover to the secondary location. 

	GRS is the default option when you create your storage account. Either GRS or ZRS is recommended over LRS.

- *Read-access geo-redundant storage (RA-GRS)* provides all of the benefits of geo-redundant storage noted above, and also allows read access to data at the secondary region in the event that the primary region becomes unavailable. Read-access geo-redundant storage is recommended for maximum availability in addition to durability.  

For more details about replication options, see the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/) and [Azure Storage Redundancy Options](http://msdn.microsoft.com/en-us/library/azure/dn727290.aspx).
	
The pricing differences between the various replication options can be found on the [Storage Pricing Details](/en-us/pricing/details/storage/) page.
