---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 04/03/2018
 ms.author: tamram
 ms.custom: include file
---

| Resource | Default Limit |
| --- | --- |
| Number of storage accounts per region per subscription | 200<sup>1</sup> |
| Max storage account capacity | 500 TiB<sup>2</sup> |
| Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account | No limit |
| Maximum request rate per storage account | 20,000 requests per second<sup>2</sup> |
| Max ingress<sup>3</sup> per storage account (US Regions) | 10 Gbps if RA-GRS/GRS enabled, 20 Gbps for LRS/ZRS<sup>4</sup> |
| Max egress<sup>3</sup> per storage account (US Regions) | 20 Gbps if RA-GRS/GRS enabled, 30 Gbps for LRS/ZRS<sup>4</sup> |
| Max ingress<sup>3</sup> per storage account (Non-US regions) | 5 Gbps if RA-GRS/GRS enabled, 10 Gbps for LRS/ZRS<sup>4</sup> |
| Max egress<sup>3</sup> per storage account (Non-US regions) | 10 Gbps if RA-GRS/GRS enabled, 15 Gbps for LRS/ZRS<sup>4</sup> |

<sup>1</sup>Includes both Standard and Premium storage accounts. If you require more than 200 storage accounts in a given region, make a request through [Azure Support](https://azure.microsoft.com/support/faq/). The Azure Storage team will review your business case and may approve up to 250 storage accounts for a given region. 

<sup>2</sup> If you need expanded limits for your storage account, please contact [Azure Support](https://azure.microsoft.com/support/faq/). The Azure Storage team will review the request and may approve higher limits on a case by case basis. Both general-purpose and Blob storage accounts support increased capacity, ingress/egress, and request rate by request. For the new maximums for Blob storage accounts, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/).

<sup>3</sup> Capped only by the account's ingress/egress limits. *Ingress* refers to all data (requests) being sent to a storage account. *Egress* refers to all data (responses) being received from a storage account.  

<sup>4</sup>Azure Storage redundancy options include:
* **RA-GRS**: Read-access geo-redundant storage. If RA-GRS is enabled, egress targets for the secondary location are identical to those for the primary location.
* **GRS**: Geo-redundant storage. 
* **ZRS**: Zone-redundant storage.
* **LRS**: Locally redundant storage. 
