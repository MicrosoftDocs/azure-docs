---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 06/23/2021
 ms.author: tamram
 ms.custom: include file
---

The following table describes default limits for Azure general-purpose v2 (GPv2), general-purpose v1 (GPv1), and Blob storage accounts. The *ingress* limit refers to all data that is sent to a storage account. The *egress* limit refers to all data that is received from a storage account.

Microsoft recommends that you use a GPv2 storage account for most scenarios. You can easily upgrade a GPv1 or a Blob storage account to a GPv2 account with no downtime and without the need to copy data. For more information, see [Upgrade to a GPv2 storage account](../articles/storage/common/storage-account-upgrade.md).

> [!NOTE]
> You can request higher capacity and ingress limits. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).

| Resource | Limit |
| --- | --- |
| Number of storage accounts per region per subscription, including standard, and premium storage accounts.| 250 |
| Maximum storage account capacity | 5 PiB <sup>1</sup>|
| Maximum number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account | No limit |
| Maximum request rate<sup>1</sup> per storage account | 20,000 requests per second |
| Default maximum ingress<sup>1</sup> per general-purpose v2 and Blob storage account in most North America, Europe, and Asia public cloud regions. For a list of exceptions, see [Region exceptions](#region-exceptions).  | 60 Gbps |
| Default maximum ingress<sup>1</sup> for general-purpose v1 storage accounts (all regions) | 10 Gbps |
| Default maximum egress for general-purpose v2 and Blob storage accounts in most North America, Europe, and Asia public cloud regions. For a list of exceptions, see [Region exceptions](#region-exceptions). | 120 Gbps |
| Maximum egress for general-purpose v1 storage accounts (US regions) | 20 Gbps if RA-GRS/GRS is enabled, 30 Gbps for LRS/ZRS<sup>2</sup> |
| Maximum egress for general-purpose v1 storage accounts (non-US regions) | 10 Gbps if RA-GRS/GRS is enabled, 15 Gbps for LRS/ZRS<sup>2</sup> |
| Maximum number of IP address rules per storage account | 200 |
| Maximum number of virtual network rules per storage account | 200 |
| Maximum number of resource instance rules per storage account | 200 |
| Maximum number of private endpoints per storage account | 200 |

<sup>1</sup> Azure Storage standard accounts support higher capacity limits and higher limits for ingress by request. To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).

<sup>2</sup> If your storage account has read-access enabled with geo-redundant storage (RA-GRS) or geo-zone-redundant storage (RA-GZRS), then the egress targets for the secondary location are identical to those of the primary location. For more information, see [Azure Storage replication](../articles/storage/common/storage-redundancy.md).

### Region exceptions

All non-public cloud regions and the following public cloud regions have default maximum ingress limits of 25 Gbps and default maximum egress limits of 50 Gbps per general-purpose v2 and Blob storage account:

- For locally-redundant storage (LRS) and geo-redundant storage (GRS) accounts: West Central US, Central India, China East, Germany West Central, Norway East, South India, China East 2, South Africa North
- For zone-redundant storage (ZRS) and geo-zone-redundant storage (GZRS) accounts: Brazil South, Canada Central,  Germany West Central, Central India, Korea Central, Norway East, South Africa North, South Central US, West US 3