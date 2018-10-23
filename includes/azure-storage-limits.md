---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 10/23/2018
 ms.author: tamram
 ms.custom: include file
---

The following table describes default limits for Azure Storage. The *ingress* limit refers to all data (requests) being sent to a storage account. The *egress* limit refers to all data (responses) being received from a storage account.

| Resource | Default Limit |
| --- | --- |
| Number of storage accounts per region per subscription, including both standard and premium accounts | 200 |
| Max storage account capacity<sup>1</sup> | 2 PB for US and Europe, 500 TB for all other regions including UK |
| Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account | No limit |
| Maximum request rate<sup>1</sup> per storage account | 20,000 requests per second |
| Max ingress<sup>1</sup> for general-purpose v2 and Blob storage accounts (US and Europe regions, except UK regions) | 25 Gbps |
| Max ingress<sup>1</sup> for all storage accounts (all regions including UK and except US and Europe) | 5 Gbps if RA-GRS/GRS enabled, 10 Gbps for LRS/ZRS<sup>2</sup> |
| Max egress<sup>1</sup> for general-purpose v2 and Blob storage accounts (all regions) | 50 Gbps |
| Max egress<sup>1</sup> for general-purpose v1 storage accounts (US regions) | 20 Gbps if RA-GRS/GRS enabled, 30 Gbps for LRS/ZRS <sup>2</sup> |
| Max egress<sup>1</sup> for general-purpose v1 storage accounts (Non-US regions) | 10 Gbps if RA-GRS/GRS enabled, 15 Gbps for LRS/ZRS <sup>2</sup> |

<sup>1</sup> Azure storage accounts support higher limits for capacity, request rate, ingress, and egress by request. For more information about the increased limits, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/). To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).

<sup>2</sup>[Azure Storage replication](https://docs.microsoft.com/azure/storage/common/storage-redundancy) options include:
* **RA-GRS**: Read-access geo-redundant storage. If RA-GRS is enabled, egress targets for the secondary location are identical to those for the primary location.
* **GRS**: Geo-redundant storage. 
* **ZRS**: Zone-redundant storage.
* **LRS**: Locally redundant storage. 

