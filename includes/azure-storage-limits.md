---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 09/13/2018
 ms.author: tamram
 ms.custom: include file
---

The following table describes default limits for Azure Storage. The *ingress* limit refers to all data (requests) being sent to a storage account. The *egress* limit refers to all data (responses) being received from a storage account.

| Resource | Default Limit |
| --- | --- |
| Number of storage accounts per region per subscription, including both standard and premium accounts | 200 |
| Max storage account capacity | 500 TiB |
| Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account | No limit |
| Maximum request rate per storage account | 20,000 requests per second |
| Max ingress per storage account (US Regions) | 10 Gbps if RA-GRS/GRS enabled, 20 Gbps for LRS/ZRS<sup>1</sup> |
| Max egress per storage account (US Regions) | 50 Gbps |
| Max ingress per storage account (Non-US regions) | 5 Gbps if RA-GRS/GRS enabled, 10 Gbps for LRS/ZRS<sup>1</sup> |
| Max egress per storage account (Non-US regions) | 50 Gbps |

<sup>1</sup>[Azure Storage replication](https://docs.microsoft.com/azure/storage/common/storage-redundancy) options include:
* **RA-GRS**: Read-access geo-redundant storage. If RA-GRS is enabled, egress targets for the secondary location are identical to those for the primary location.
* **GRS**: Geo-redundant storage. 
* **ZRS**: Zone-redundant storage.
* **LRS**: Locally redundant storage. 

**Increasing storage account limits**

If you require expanded limits for your storage account, or a greater number of storage accounts in a specific region, please contact [Azure Support](https://azure.microsoft.com/support/faq/). The Azure Storage team will review your request and may approve higher limits on a case by case basis. Both general-purpose and Blob storage accounts support increased capacity, ingress/egress, and request rate upon request. 


