---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 09/30/2020
 ms.author: tamram
 ms.custom: include file
---

The following table describes default limits for Azure general-purpose v1, v2, Blob storage, and block blob storage accounts. The *ingress* limit refers to all data that is sent to a storage account. The *egress* limit refers to all data that is received from a storage account.

> [!NOTE]
> You can request higher capacity and ingress limits. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).

| Resource | Limit |
| --- | --- |
| Number of storage accounts per region per subscription, including standard, and premium storage accounts.| 250 |
| Maximum storage account capacity | 5 PiB <sup>1</sup>|
| Maximum number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account | No limit |
| Maximum request rate<sup>1</sup> per storage account | 20,000 requests per second |
| Maximum ingress<sup>1</sup> per storage account (US, Europe regions) | 10 Gbps |
| Maximum ingress<sup>1</sup> per storage account (regions other than US and Europe) | 5 Gbps if RA-GRS/GRS is enabled, 10 Gbps for LRS/ZRS<sup>2</sup> |
| Maximum egress for general-purpose v2 and Blob storage accounts (all regions) | 50 Gbps |
| Maximum egress for general-purpose v1 storage accounts (US regions) | 20 Gbps if RA-GRS/GRS is enabled, 30 Gbps for LRS/ZRS<sup>2</sup> |
| Maximum egress for general-purpose v1 storage accounts (non-US regions) | 10 Gbps if RA-GRS/GRS is enabled, 15 Gbps for LRS/ZRS<sup>2</sup> |
| Maximum number of virtual network rules per storage account | 200 |
| Maximum number of IP address rules per storage account | 200 |

<sup>1</sup> Azure Storage standard accounts support higher capacity limits and higher limits for ingress by request. To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).

<sup>2</sup> If your storage account has read-access enabled with geo-redundant storage (RA-GRS) or geo-zone-redundant storage (RA-GZRS), then the egress targets for the secondary location are identical to those of the primary location. For more information, see [Azure Storage replication](../articles/storage/common/storage-redundancy.md).

> [!NOTE]
> Microsoft recommends that you use a general-purpose v2 storage account for most scenarios. You can easily upgrade a general-purpose v1 or an Azure Blob storage account to a general-purpose v2 account with no downtime and without the need to copy data. For more information, see [Upgrade to a general-purpose v2 storage account](../articles/storage/common/storage-account-upgrade.md).

All storage accounts run on a flat network topology regardless of when they were created. For more information on the Azure Storage flat network architecture and on scalability, see [Microsoft Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](/archive/blogs/hanuk/windows-azures-flat-network-storage-to-enable-higher-scalability-targets).