---
title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: azure-storage
 ms.topic: include
 ms.date: 05/02/2023
 ms.author: tamram
 ms.custom: include file, references_regions
---

The following table describes default limits for Azure general-purpose v2 (GPv2), general-purpose v1 (GPv1), and Blob storage accounts. The *ingress* limit refers to all data that is sent to a storage account. The *egress* limit refers to all data that is received from a storage account.

Microsoft recommends that you use a GPv2 storage account for most scenarios. You can easily upgrade a GPv1 or a Blob storage account to a GPv2 account with no downtime and without the need to copy data. For more information, see [Upgrade to a GPv2 storage account](../articles/storage/common/storage-account-upgrade.md).

> [!NOTE]
> You can request higher capacity and ingress limits. To request an increase, contact [Azure Support](https://azure.microsoft.com/support/faq/).

| Resource | Limit |
|--|--|
| Maximum number of storage accounts with standard endpoints per region per subscription, including standard and premium storage accounts. | 250 by default, 500 by request<sup>1</sup> |
| Maximum number of storage accounts with Azure DNS zone endpoints (preview) per region per subscription, including standard and premium storage accounts. | 5000 (preview) |
| Default maximum storage account capacity | 5 PiB <sup>2</sup> |
| Maximum number of blob containers, blobs, directories and subdirectories (if Hierarchical Namespace is enabled), file shares, tables, queues, entities, or messages per storage account. | No limit |
| Default maximum request rate per storage account | 20,000 requests per second<sup>2</sup> |
| Default maximum ingress per general-purpose v2 and Blob storage account in the following regions:<br /><ul><li>East Asia</li><li>Southeast Asia</li><li>Australia East</li><li>Brazil South</li><li>Canada Central</li><li>China East 2</li><li>China North 3</li><li>North Europe</li><li>West Europe</li><li>France Central</li><li>Germany West Central</li><li>Central India</li><li>Japan East</li><li>Jio India West</li><li>Korea Central</li><li>Norway East</li><li>South Africa North</li><li>Sweden Central</li><li>UAE North</li><li>UK South</li><li>Central US</li><li>East US</li><li>East US 2</li><li>USGov Virginia</li><li>USGov Arizona</li><li>North Central US</li><li>South Central US</li><li>West US</li><li>West US 2</li><li>West US 3</li></ul>| 60 Gbps<sup>2</sup> |
| Default maximum ingress per general-purpose v2 and Blob storage account in regions that aren't listed in the previous row. | 25 Gbps<sup>2</sup> |
| Default maximum ingress for general-purpose v1 storage accounts (all regions) | 10 Gbps<sup>2</sup> |
| Default maximum egress for general-purpose v2 and Blob storage accounts in the following regions:<br /><ul><li>East Asia</li><li>Southeast Asia</li><li>Australia East</li><li>Brazil South</li><li>Canada Central</li><li>China East 2</li><li>China North 3</li><li>North Europe</li><li>West Europe</li><li>France Central</li><li>Germany West Central</li><li>Central India</li><li>Japan East</li><li>Jio India West</li><li>Korea Central</li><li>Norway East</li><li>South Africa North</li><li>Sweden Central</li><li>UAE North</li><li>UK South</li><li>Central US</li><li>East US</li><li>East US 2</li><li>USGov Virginia</li><li>USGov Arizona</li><li>North Central US</li><li>South Central US</li><li>West US</li><li>West US 2</li><li>West US 3</li></ul> | 120 Gbps<sup>2</sup> |
| Default maximum egress for general-purpose v2 and Blob storage accounts in regions that aren't listed in the previous row. | 50 Gbps<sup>2</sup> |
| Maximum egress for general-purpose v1 storage accounts (US regions) | 20 Gbps if RA-GRS/GRS is enabled, 30 Gbps for LRS/ZRS |
| Maximum egress for general-purpose v1 storage accounts (non-US regions) | 10 Gbps if RA-GRS/GRS is enabled, 15 Gbps for LRS/ZRS |
| Maximum number of IP address rules per storage account | 200 |
| Maximum number of virtual network rules per storage account | 200 |
| Maximum number of resource instance rules per storage account | 200 |
| Maximum number of private endpoints per storage account | 200 |

<sup>1</sup> With a quota increase, you can create up to 500 storage accounts with standard endpoints per region. For more information, see [Increase Azure Storage account quotas](../articles/quotas/storage-account-quota-requests.md).
<sup>2</sup> Azure Storage standard accounts support higher capacity limits and higher limits for ingress and egress by request. To request an increase in account limits, contact [Azure Support](https://azure.microsoft.com/support/faq/).

