Zone redundant storage (ZRS) is designed to simplify the development of highly available applications. If your storage account uses ZRS for redundancy, then any data objects that you store in that account automatically benefit from the high availability provided by ZRS. You do not need to rewrite your application to take advantage of ZRS.

With ZRS, your data is replicated across multiple availability zones within the same region. For more information about availability zones, see [Availability zones overview](https://docs.microsoft.com/azure/availability-zones/az-overview).

Because your data is replicated across multiple availability zones, ZRS protects your data against hardware failures or catastrophic failures in a single zone. In the event of a failure in a single zone, clients can continue to read and write data to your storage account. 

ZRS replicates data synchronously, so data replication is guaranteed to be complete when the service returns its response. ZRS provides excellent performance for applications using Azure Storage.

ZRS offers durability for storage objects of at least 99.9999999999% (12 9's) over a given year. Consider ZRS for scenarios like transactional applications where downtime is not acceptable.

ZRS may not protect your data against a regional disaster where multiple zones are affected. For protection against regional disasters, Microsoft recommends using [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](../articles/storage/common/storage-redundancy-grs.md). ZRS is a less expensive option than GRS.

ZRS is currently available for the following regions, with more regions coming soon:

- US East 2 
- US Central 
- France Central (This region is currently in preview. See [Microsoft Azure preview with Azure Availability Zones now open in France](https://azure.microsoft.com/blog/microsoft-azure-preview-with-azure-availability-zones-now-open-in-france) to request access.)

> [!IMPORTANT]
> You can change how your data is replicated after your storage account has been created. However, you may incur an additional one-time data transfer cost if you switch from LRS or ZRS to GRS or RA-GRS.
>
