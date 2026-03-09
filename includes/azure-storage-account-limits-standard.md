---
title: include file
 description: include file
 services: storage
 author: normesta
 ms.service: azure-storage
 ms.topic: include
 ms.date: 11/19/2025
 ms.author: normesta
 ms.custom: include file, references_regions
---

The following table describes default limits for Azure general-purpose v2 (GPv2), general-purpose v1 (GPv1), and Blob Storage accounts.

A few entries in the table also apply to disk access and are explicitly labeled. Disk access is a resource that is exclusively used for importing or exporting managed disks through [private links](/azure/virtual-machines/disks-restrict-import-export-overview#private-links).

Customers should use a GPv2 storage account, because [GPv1 is being retired](/azure/storage/common/general-purpose-version-1-account-migration-overview). You can easily upgrade a GPv1 or Blob Storage account to a GPv2 account with no downtime and no need to copy data. For more information, see [Upgrade to a GPv2 storage account](/azure/storage/common/storage-account-upgrade).

The *ingress* limit refers to all data sent to a storage account or disk access. The *egress* limit refers to all data received from a storage account or disk access.

> [!NOTE]
> You can request higher capacity and ingress limits. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).

| Resource | Limit |
|--|--|
| Maximum number of storage accounts with standard endpoints per region per subscription, including standard and premium storage accounts. | 250 by default, 500 by request<sup>1</sup> |
| Maximum number of storage accounts with Azure DNS zone endpoints (preview) per region per subscription, including standard and premium storage accounts. | 5,000 (preview) |
| Default maximum storage account capacity. | 5 PiB <sup>2</sup> |
| Maximum number of blob containers, blobs, directories, and subdirectories (if hierarchical namespace is enabled), file shares, tables, queues, entities, or messages per storage account. | No limit |
| Default maximum request rate per general-purpose v2, Blob Storage account, and disk access resources in the following regions:<br /><ul><li>**Americas**: Brazil South, Canada Central, Central US, East US, East US 2, North Central US, South Central US, West US, West US 2, West US 3</li><li>**Asia Pacific**: Australia East, Central India, China East 2, China North 3, East Asia, Japan East, Jio India West, Korea Central, Southeast Asia</li><li>**Europe**: France Central, Germany West Central, North Europe, Norway East, Sweden Central, UK South, West Europe</li><li>**Africa**: South Africa North</li><li>**Azure Government**: USGov Arizona, USGov Virginia</li></ul>| 40,000 requests per second<sup>2</sup> |
| Default maximum request rate per general-purpose v2, Blob Storage account, and disk access resources in regions that aren't listed in the previous row. | 20,000 requests per second<sup>2</sup> |
| Default maximum ingress per general-purpose v2, Blob Storage account, and disk access resources in the following regions:<br /><ul><li>**Americas**: Brazil South, Canada Central, Central US, East US, East US 2, North Central US, South Central US, West US, West US 2, West US 3</li><li>**Asia Pacific**: Australia East, Central India, China East 2, China North 3, East Asia, Japan East, Jio India West, Korea Central, Southeast Asia</li><li>**Europe**: France Central, Germany West Central, North Europe, Norway East, Sweden Central, UK South, West Europe</li><li>**Africa**: South Africa North</li><li>**Azure Government**: USGov Arizona, USGov Virginia</li></ul>| 60 Gbps<sup>2</sup> |
| Default maximum ingress per general-purpose v2, Blob Storage account, and disk access resources in regions that aren't listed in the previous row. | 25 Gbps<sup>2</sup> |
| Default maximum ingress for general-purpose v1 storage accounts (all regions). | 10 Gbps<sup>2</sup> |
| Default maximum egress for general-purpose v2, Blob Storage accounts, and disk access resources in the following regions:<br /><ul><li>**Americas**: Brazil South, Canada Central, Central US, East US, East US 2, North Central US, South Central US, West US, West US 2, West US 3</li><li>**Asia Pacific**: Australia East, Central India, China East 2, China North 3, East Asia, Japan East, Jio India West, Korea Central, Southeast Asia</li><li>**Europe**: France Central, Germany West Central, North Europe, Norway East, Sweden Central, UK South, West Europe</li><li>**Africa**: South Africa North</li><li>**Azure Government**: USGov Arizona, USGov Virginia</li></ul> | 200 Gbps<sup>2</sup> |
| Default maximum egress for general-purpose v2, Blob Storage accounts, and disk access resources in regions that aren't listed in the previous row. | 50 Gbps<sup>2</sup> |
| Maximum egress for general-purpose v1 storage accounts (US regions). | 20 Gbps if RA-GRS/GRS is enabled, 30 Gbps for LRS/ZRS |
| Maximum egress for general-purpose v1 storage accounts (non-US regions). | 10 Gbps if RA-GRS/GRS is enabled, 15 Gbps for LRS/ZRS |
| Maximum number of IP address rules per storage account. | 400 |
| Maximum number of virtual network rules per storage account. | 400 |
| Maximum number of resource instance rules per storage account. | 200 |
| Maximum number of private endpoints per storage account. | 200 |

<sup>1</sup> With a quota increase, you can create up to 500 storage accounts with standard endpoints per region. For more information, see [Increase Azure Storage account quotas](/azure/quotas/storage-account-quota-requests).

<sup>2</sup> Azure Storage standard accounts support higher capacity limits and higher limits for ingress and egress by request. To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).
