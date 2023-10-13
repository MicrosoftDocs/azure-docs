---
title: Azure regions
description: Learn about the regions for running virtual machines in Azure.
author: mimckitt
ms.author: mimckitt
ms.reviewer: cynthnn
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure-services
ms.custom: engagement-fy23
ms.date: 02/21/2023
---

# Regions for virtual machines in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

It is important to understand how and where your virtual machines (VMs) operate in Azure, along with your options to maximize performance, availability, and redundancy. This article provides you with an overview of the availability and redundancy features of Azure.


## What are Azure regions?
Azure operates in multiple datacenters around the world. These datacenters are grouped in to geographic regions, giving you flexibility in choosing where to build your applications. 

You create Azure resources in defined geographic regions like 'West US', 'North Europe', or 'Southeast Asia'. You can review the [list of regions and their locations](https://azure.microsoft.com/regions/). Within each region, multiple datacenters exist to provide for redundancy and availability. This approach gives you flexibility as you design applications to create VMs closest to your users and to meet any legal, compliance, or tax purposes.

## Special Azure regions
Azure has some special regions that you may wish to use when building out your applications for compliance or legal purposes. These special regions include:

* **US Gov Virginia** and **US Gov Iowa**
  * A physical and logical network-isolated instance of Azure for US government agencies and partners, operated by screened US persons. Includes additional compliance certifications such as [FedRAMP](https://www.microsoft.com/en-us/TrustCenter/Compliance/FedRAMP) and [DISA](https://www.microsoft.com/en-us/TrustCenter/Compliance/DISA). Read more about [Azure Government](https://azure.microsoft.com/features/gov/).
* **China East** and **China North**
  * These regions are available through a unique partnership between Microsoft and 21Vianet, whereby Microsoft does not directly maintain the datacenters. See more about [Microsoft Azure operated by 21Vianet](https://www.windowsazure.cn/).
* **Germany Central** and **Germany Northeast**
  * These regions are available via a data trustee model whereby customer data remains in Germany under control of T-Systems, a Deutsche Telekom company, acting as the German data trustee.

## Region pairs
Each Azure region is paired with another region within the same geography (such as US, Europe, or Asia). This approach allows for the replication of resources, such as VM storage, across a geography that should reduce the likelihood of natural disasters, civil unrest, power outages, or physical network outages affecting both regions at once. Additional advantages of region pairs include:

* In the event of a wider Azure outage, one region is prioritized out of every pair to help reduce the time to restore for applications. 
* Planned Azure updates are rolled out to paired regions one at a time to minimize downtime and risk of application outage.
* Data continues to reside within the same geography as its pair (except for Brazil South) for tax and law enforcement jurisdiction purposes.

Examples of region pairs include:

| Primary | Secondary |
|:--- |:--- |
| West US |East US |
| North Europe |West Europe |
| Southeast Asia |East Asia |

You can see the full [list of regional pairs here](../availability-zones/cross-region-replication-azure.md#azure-paired-regions).

## Feature availability
Some services or VM features are only available in certain regions, such as specific VM sizes or storage types. There are also some global Azure services that do not require you to select a particular region, such as [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md), [Traffic Manager](../traffic-manager/traffic-manager-overview.md), or [Azure DNS](../dns/dns-overview.md). To assist you in designing your application environment, you can check the [availability of Azure services across each region](https://azure.microsoft.com/regions/#services). You can also [programmatically query the supported VM sizes and restrictions in each region](../azure-resource-manager/templates/error-sku-not-available.md).

## Storage availability
Understanding Azure regions and geographies becomes important when you consider the available storage replication options. Depending on the storage type, you have different replication options.

**Azure Managed Disks**
* Locally redundant storage (LRS)
  * Replicates your data three times within the region in which you created your storage account.

**Storage account-based disks**
* Locally redundant storage (LRS)
  * Replicates your data three times within the region in which you created your storage account.
* Zone redundant storage (ZRS)
  * Replicates your data three times across two to three facilities, either within a single region or across two regions.
* Geo-redundant storage (GRS)
  * Replicates your data to a secondary region that is hundreds of miles away from the primary region.
* Read-access geo-redundant storage (RA-GRS)
  * Replicates your data to a secondary region, as with GRS, but also then provides read-only access to the data in the secondary location.

The following table provides a quick overview of the differences between the storage replication types:

| Replication strategy | LRS | ZRS | GRS | RA-GRS |
|:--- |:--- |:--- |:--- |:--- |
| Data is replicated across multiple facilities. |No |Yes |Yes |Yes |
| Data can be read from the secondary location and from the primary location. |No |No |No |Yes |
| Number of copies of data maintained on separate nodes. |3 |3 |6 |6 |

You can read more about [Azure Storage replication options here](../storage/common/storage-redundancy.md). For more information about managed disks, see [Azure Managed Disks overview](./managed-disks-overview.md).


## Next steps

For more information, see [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
