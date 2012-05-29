<properties umbracoNaviHide="0" pageTitle="What is a Storage Account" metaKeywords="Windows Azure storage, storage service, service, storage account, account, create storage account, create account" metaDescription="Learn about Windows Azure storage accounts." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />

#What is a Storage Account

A storage account gives your applications access to Windows Azure Blob, Table, and Queue services located in a geographic region. You need a storage account to use Windows Azure storage. 

The storage account represents the highest level of the namespace for accessing the storage services. A storage account can contain up to 100 TB of blob, queue, and table data. You can create up to five storage accounts for your Windows Azure subscription. For more information about storage accounts, see [Windows Azure Storage](http://www.windowsazure.com/en-us/home/features/storage/) and [Data Storage Offerings in Windows Azure](http://www.windowsazure.com/en-us/develop/net/fundamentals/cloud-storage/).

Storage costs are based on storage utilization and the number of storage transactions required to add, update, read, and delete stored data. Storage utilization is calculated based on your average usage of storage for blobs, tables, and queues during a billing period. To learn more about your storage pricing, see [Windows Azure Pricing Overview](http://www.windowsazure.com/en-us/pricing/details).

##Storage Account Concepts


- **geo reundant storage (GRS)**   Geo-redundant storage provides the highest level of storage durability by seamlessly replicating your data to a secondary location within the same region. This enables failover in case of a major failure in the primary location. The secondary location is hundreds of miles from the primary location. GRS is implemented through a feature called *geo-replication*, which is turned on for a storage account by default, but can be turned off if you don’t want to use it (for example, if company policies prevent its use). For more information, see [Introducing Geo-Replication for Windows Azure](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx). 

- **locally redundant storage (LRS)**   Locally redundant storage provides highly durable and available storage within a single location. For locally redundant storage, account data is replicated three times within the same data center. All storage in Windows Azure is locally redundant. For added durability, you can turn on geo-replication. Locally redundant storage is offered at a discount. For pricing information, see [Windows Azure Pricing Overview](http://www.windowsazure.com/en-us/pricing/details/). 

- **affinity group**   An *affinity group* is a geographic grouping of your cloud service deployments and storage accounts within Windows Azure. An affinity group can improve service performance by locating computer workloads in the same data center or near the target user audience. Also, no billing charges are incurred for egress.

- **storage account endpoints**   The *endpoints* for a storage account represent the highest level of the namespace for accessing blobs, tables, or queues. The default endpoints for a storage account have the following formats: 

    - Blob service: http://*mystorageaccount*.blob.core.windows.net

    - Table service: http://*mystorageaccount*.table.core.windows.net

    - Queue service: http://*mystorageaccount*.queue.core.windows.net

- **storage account URLs**   The URL for accessing an object in a storage account is built by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

- **storage account keys**   When you create a storage account, Windows Azure generates two 512-bit storage account keys, which are used for authentication when the storage account is accessed. By providing two storage account keys, Windows Azure enables you to regenerate the keys with no interruption to your storage service or access to that service.

- **minimal vs. verbose metrics**   You can configure minimal or verbose metrics in the monitoring settings for your storage account. *Minimal metrics* collects metrics on data such as ingress/egress, availability, latency, and success percentages, which are aggregated for the Blob, Table, and Queue services. *Verbose metrics* collects operations-level detail in addition to service-level aggregates for the same metrics. Verbose metrics enable closer analysis of issues that occur during application operations. For the full list of available metrics, see [Storage Analytics Metrics Table Schema](http://msdn.microsoft.com/en-us/library/windowsazure/hh343264.aspx). For more information about storage monitoring, see [About Storage Analytics Metrics](http://msdn.microsoft.com/en-us/library/windowsazure/hh343258.aspx).

- **logging**   Logging is a configurable feature of storage accounts that enables logging of requests to read, write, and delete blobs, tables, and queues. You configure logging in the Windows Azure Management Portal, but you can't view the logs in the Management Portal. The logs are stored and accessed in the storage account, in the $logs container. For more information, see [Storage Analytics Overview](http://msdn.microsoft.com/en-us/library/windowsazure/hh343268.aspx).