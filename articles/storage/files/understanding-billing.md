---
title: Understand Azure Files Billing
description: Learn how to interpret the provisioned and pay-as-you-go billing models for Azure Files. Understand total cost of ownership, storage reservations, and burst credits.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 06/04/2025
ms.author: kendownie
ms.custom:
  - references_regions
  - build-2025
# Customer intent: "As a cloud storage administrator, I want to understand the different billing models and cost factors for Azure Files, so that I can accurately estimate and manage storage expenses for our organization's cloud strategy."
---

# Understand Azure Files billing models
The cost of a deployment of Azure Files is determined by four key factors: billing model, media tier, redundancy, and resource model.

- **Billing model**: Azure Files supports three different billing models that shape the cost structure of an Azure Files deployment:
    - **Provisioned v2**: A provisioned billing model where you have the ability to separately provision storage, IOPS, and throughput. You pay based on what you provision, regardless of how much you actually use. We recommend the provisioned v2 model for all new Azure Files deployments.
    - **Provisioned v1**: A provisioned billing model where you provision the amount of storage you need, while IOPS and throughput are determined by how much storage you provision. We recommend using the provisioned v2 model unless you have a specific reason to use the provisioned v1 model.
    - **Pay-as-you-go**: A usage-based billing model where the cost is determined based on how much you use the file share, in the form of used storage, transaction, and data transfer costs. We recommend using the provisioned v2 model unless you have a specific reason to use the pay-as-you-go model.

- **Media tier**: Azure Files supports two different media tiers of storage: solid state drives (SSD) and hard disk drives (HDD). This allows you to tailor your file shares to the performance and price requirements of your scenario.
    - **SSD (premium)**: File shares hosted on SSD provide consistent high performance and low latency, with single-digit millisecond latency for most IO operations.
    - **HDD (standard)**: File shares hosted on HDD provide cost-effective storage for general purpose use.

- **Redundancy**: Azure Files supports four different redundancy options that allow you to control how many copies of your data stored and where those copied are placed within Azure's infrastructure. More resilient options provide greater durability and availability, but at a higher cost:
    - **Locally-redundant storage (LRS)** keeps three copies of your data within a single data center in one region.
    - **Zone-redundant storage (ZRS)** stores three copies of your data across independent datacenters (availability zones) within a region.
    - **Geo-redundant storage (GRS)** stores three copies of the data in the primary region and asynchronously replicates to a paired region, for a total of six copies. Available on HDD storage only.
    - **Geo-zone-redundant storage (GZRS)** combines zone redundancy in the primary region with asynchronous replication to a secondary region. Available on HDD storage only.

- **Resource model**: Azure Files supports two different top-level resource types, which are items that you create and manage within your Azure subscriptions and resource groups. Each resource type supports slightly different billing model options, which in turn impacts both cost and cost structure:
    - **Storage accounts** represent a shared pool of storage, IOPS, and throughput in which you can deploy **classic file shares** or other storage resources, depending on the storage account kind. Storage accounts support all billing models, media tiers, and redundancy options. All storage resources that are deployed into a storage account share the limits that apply to that storage account. Classic file shares support both the SMB and NFS protocols, although NFS is only supported on SSD storage. Storage accounts are offered by the `Microsoft.Storage` resource provider.

    - **File shares** (preview) are a new top-level resource type that simplifies the deployment of Azure file shares by eliminating the need to create a storage account. File shares support the recommended provisioned v2 model only, and support only the SSD media tier with the NFS file system protocol. File shares are offered by the `Microsoft.FileShares` resource provider.

For Azure Files pricing information, see [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube-nocookie.com/embed/dyqQkheaHYg]
    :::column-end:::
    :::column:::
        This video provides a comprehensive overview of the differences between various Azure Files billing models, including pay-as-you-go, provisioned v1, and provisioned v2.
   :::column-end:::
:::row-end:::

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube.com/embed/Tb6y0fvJBMs]
    :::column-end:::
    :::column:::
       This video dives deep into the Azure Files provisioned v2 billing model, offering setup instructions and recommendations to reduce total cost of ownership.
   :::column-end:::
:::row-end:::

## Storage units
Azure Files uses the base-2 units of measurement to represent storage capacity: KiB, MiB, GiB, and TiB.

| Acronym | Definition | Unit |
|-|-|-|
| KiB | 1,024 bytes | kibibyte |
| MiB | 1,024 KiB (1,048,576 bytes) | mebibyte |
| GiB | 1,024 MiB (1,073,741,824 bytes) | gibibyte |
| TiB | 1,024 GiB (1,099,511,627,776 bytes) | tebibyte |

The base-2 units of measure are commonly used by most operating systems and tools to measure storage quantities. However, they're frequently mislabeled as the base-10 units, which you might be more familiar with: KB, MB, GB, and TB. The common reason why operating systems like Windows mislabel the storage units is because many operating systems began using these acronyms before they were standardized by the International Electrotechnical Commission (IEC), International Bureau of Weights and Measures (BIPM), and US National Institute of Standards and Technology (NIST).

The following table shows how common operating systems measure and label storage:

| Operating system | Measurement system | Labeling |
|-|-|-|-|
| Windows | Base-2 | Consistently mislabels as base-10. |
| Linux distributions | Commonly base-2, some software uses base-10 | Inconsistent labeling, alignment between measurement and labeling depends on the software package. |
| macOS, iOS, and iPad OS | Base-10 | [Consistently labels as base-10](https://support.apple.com/HT201402). |

Check with your operating system vendor if your operating system isn't listed.

## File share total cost of ownership checklist
If you're migrating to Azure Files from on-premises or comparing Azure Files to other cloud storage solutions, consider the following factors to ensure a fair, apples-to-apples comparison:

- **How do you pay for storage, IOPS, and bandwidth?** Most cloud solutions have models that align with the principles of either **provisioned storage**, such as price determinism and simplicity, or **pay-as-you-go storage**, which can optimize costs by only charging you for what you actually use. Provisioned billing models can differ based on minimum provisioned share size, the provisioning unit, and the ability to increase and decrease provisioning.

- **Are there any methods to optimize storage costs?** You can use [Azure Files reservations](#reservations) to achieve an up to 36% discount on storage. Other solutions might employ strategies like deduplication or compression to optionally optimize storage efficiency. However, these storage optimization strategies often have non-monetary costs, such as reducing performance. Azure Files reservations have no side effects on performance.

- **How do you achieve storage resiliency and redundancy?** With Azure Files, storage resiliency and redundancy are included in the product offering. All tiers and redundancy levels ensure that data is highly available and at least three copies of your data are accessible. When considering other file storage options, consider whether storage resiliency and redundancy is built in, or something you must assemble yourself.

- **What do you need to manage?** Azure Files is a fully managed solution. Other solutions might require operating system updates or managing virtual resources such as VMs, disks, and network IP addresses.

- **What are the costs of value-added products?** Azure Files supports integrations with multiple first- and third-party [value-added services](#value-added-services). Value-added services such as Azure Backup, Azure File Sync, and Microsoft Defender for Storage provide backup, replication and caching, and security functionality for Azure Files. Value-added solutions, whether on-premises or in the cloud, have their own licensing and product costs, but are often considered part of the total cost of ownership for file storage.

## Provisioned v2 model
The provisioned v2 model for Azure Files pairs **predictability** of total cost of ownership with **flexibility**, allowing you to create a file share that meets your exact storage and performance requirements. When you create a new provisioned v2 file share, you specify how much storage, IOPS, and throughput your file share needs. The amount of each quantity that you provision determines your total bill.

The amount of storage, IOPS, and throughput you provision are the guaranteed limits of your file share's usage. For example, if you provision a 2 TiB share and upload 2 TiB of data to your share, your share will be full. You won't be able to add more data unless you increase the size of your share or delete some of the data. Credit-based IOPS bursting provides added flexibility around usage, on a best-effort basis, while credits remain.

The amount of storage, IOPS, and throughput you provision can be dynamically scaled up or down as your needs change. However, you can only decrease a provisioned quantity after 24 hours have elapsed since your last quantity increase. Storage, IOPS, and throughput changes are effective within a few minutes after a provisioning change.  

By default, when you create a new file share using the provisioned v2 model, we provide a recommendation for how many IOPS and how much throughput you need. This is calculated based on the amount of provisioned storage you specify. These recommendations are based on typical customer usage for that amount of provisioned storage for the media tier you choose. However, you might find that your workload requires more or less IOPS and throughput than the "typical file share." In this case, you can optionally provision more or less IOPS and throughput, depending on your individual file share requirements.

### Provisioned v2 availability
The provisioned v2 model is available for the following combinations of media tier, redundancy, and file sharing protocol:

| Media tier | Redundancy | File sharing protocol | Classic file shares (`Microsoft.Storage`) | File shares (`Microsoft.FileShares`) |
|-|-|-|-|-|
| SSD | Local | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD | Zone | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD | Local | NFS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| SSD | Zone | NFS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| HDD | Local | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Zone | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Geo | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | GeoZone | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Local | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Zone | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Geo | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | GeoZone | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |

The provisioned v2 model is generally available in all Azure public cloud regions and all Azure US Government cloud regions. Not all regions support all media tiers and redundancy options.

### Provisioned v2 provisioning
When you create a provisioned v2 file share, you specify the provisioned capacity for the file share in terms of storage, IOPS, and throughput. File shares are limited based on the following attributes:

| Item | SSD value | HDD value |
|-|-|-|
| Storage provisioning unit | 1 GiB | 1 GiB |
| IOPS provisioning unit | 1 IO / sec | 1 IO / sec |
| Throughput provisioning unit | 1 MiB / sec | 1 MiB / sec |
| Minimum provisioned storage | 32 GiB | 32 GiB |
| Minimum provisioned IOPS | 3,000 IOPS | 500 IOPS |
| Minimum provisioned throughput | 100 MiB / sec | 60 MiB / sec |
| Maximum provisioned storage | 256 TiB (262,144 GiB) | 256 TiB (262,144 GiB) |
| Maximum provisioned IOPS | 102,400 IOPS | 50,000 IOPS |
| Maximum provisioned throughput | 10,340 MiB / sec | 5,120 MiB / sec |

By default, we provide recommendations for IOPS and throughput provisioning based on the provisioned storage you specify. These recommendation formulas are based on typical customer usage for that amount of provisioned storage for that media tier in Azure Files:

| Formula name | SSD formula | HDD formula |
|-|-|-|
| IOPS recommendation | `MIN(MAX(3000 + CEILING(1 * ProvisionedStorageGiB), 3000), 102400)` | `MIN(MAX(1000 + CEILING(0.2 * ProvisionedStorageGiB), 500), 50000)` |
| Throughput recommendation | `MIN(MAX(100 + CEILING(0.1 * ProvisionedStorageGiB), 100), 10340)` | `MIN(MAX(60 + CEILING(0.02 * ProvisionedStorageGiB), 60), 5120)` |

Depending on your individual file share requirements, you might find that you require more or less IOPS or throughput than our recommendations. You can optionally override these recommendations with your own values as desired.

### Provisioned v2 bursting
Credit-based IOPS bursting provides added flexibility around IOPS usage. This flexibility is best used as a buffer against unanticipated IO-spikes. For established IO patterns, we recommend provisioning for IO peaks.

Burst IOPS credits accumulate whenever traffic for your file share is less than provisioned (baseline) IOPS. Whenever a file share's IOPS usage exceeds the provisioned IOPS and there are available burst IOPS credits, the file share can burst up to the maximum allowed burst IOPS limit. File shares can continue to burst as long as there are credits remaining, based on the number of burst credits accrued. Each IO beyond provisioned IOPS consumes one credit. Once all credits are consumed, the share returns to the provisioned IOPS. IOPS against the file share don't have to do anything special to use bursting. Bursting operates on a best effort basis.  

Share credits have three states:

- **Accruing**, when the file share is using less than the provisioned IOPS.
- **Declining**, when the file share is using more than the provisioned IOPS and in the bursting mode.
- **Constant**, when the files share is using exactly the provisioned IOPS and there are either no credits accrued or used.

A new file share starts with the full number of credits in its burst bucket. Burst credits don't accrue if the share IOPS fall below the provisioned limit due to throttling by the server. The following formulas are used to determine the burst IOPS limit and the number of credits possible for a file share:

| Item | SSD formula | HDD formula |
|-|-|-|
| Burst IOPS limit | `MIN(MAX(3 * ProvisionedIOPS, 10000), 102400)` | `MIN(MAX(3 * ProvisionedIOPS, 5000), 50000)` |
| Burst IOPS credits | `(BurstLimit - ProvisionedIOPS) * 3600` | `(BurstLimit - ProvisionedIOPS) * 3600` |

The following table illustrates a few examples of these formulas for various provisioned IOPS amounts:

| Provisioned IOPS | SSD burst IOPS limit | SSD burst credits | HDD burst IOPS limit | HDD burst credits |
|-|-|-|-|-|
| 500 | -- | -- | Up to 5,000 | 16,200,000 |
| 1,000 | -- | -- | Up to 5,000 | 14,400,000 |
| 3,000 | Up to 10,000 | 25,200,000 | Up to 9,000 | 21,600,000 |
| 5,000 | Up to 15,000 | 36,000,000 | Up to 15,000 | 36,000,000 |
| 10,000 | Up to 30,000 | 72,000,000 | Up to 30,000 | 72,000,000 |
| 25,000 | Up to 75,000 | 180,000,000 | Up to 50,000 | 90,000,000 |
| 50,000 | Up to 102,400 | 188,640,000 | Up to 50,000 | 0 |
| 75,000 | Up to 102,400 | 98,640,000 | -- | -- |
| 102,400 | Up to 102,400 | 0 | -- | -- |

### Provisioned v2 resource models
The provisioned v2 billing model is available for both resource types used by Azure Files. You can create a provisioned v2 file share as either a classic file share within a storage account (`Microsoft.Storage`) or directly as top-level file share (`Microsoft.FileShares`).

#### Provisioned v2 classic file shares (Microsoft.Storage)
To create a classic file share using the provisioned v2 model, your storage account must use one of the following combinations of settings:

| Storage account kind | Storage account SKU | Type of classic file share available |
|-|-|-|
| FileStorage | PremiumV2_LRS | SSD provisioned v2 classic file shares with the Local redundancy specified. |
| FileStorage | PremiumV2_ZRS | SSD provisioned v2 classic file shares with the Zone redundancy specified. |
| FileStorage | StandardV2_LRS | HDD provisioned v2 classic file shares with the Local redundancy specified. |
| FileStorage | StandardV2_ZRS | HDD provisioned v2 classic file shares with the Zone redundancy specified. |
| FileStorage | StandardV2_GRS | HDD provisioned v2 classic file shares with the Geo redundancy specified. |
| FileStorage | StandardV2_GZRS | HDD provisioned v2 classic file shares with the GeoZone redundancy specified. |

For more information on how to create a classic file share using the provisioned v2 model, see [create a classic file share](./create-classic-file-share.md).

Classic file shares created in the same storage account share that storage account's limits for storage, IOPS, and throughput:

| Attribute | SSD value | HDD value | Enforcement strategy |
|-|-|-|-|
| Maximum provisioned storage per storage account | 256 TiB (262,144 GiB) | 4 PiB (4,194,304) | At provision time. |
| Maximum provisioned IOPS per storage account | 102,400 IOPS | 50,000 IOPS | At provision time. |
| Maximum provisioned throughput per storage account | 10,340 MiB / sec | 5,120 MiB / sec | At provision time. |
| Maximum number of classic file shares per storage account | 50 classic file shares | 50 classic file shares | At provision time. | 

To deploy Azure Files with the provisioned v2 billing model on classic file shares, you need to consider the following dimensions of capacity planning:

- **How much provisioned storage, IOPS, and throughput do you need for each classic file share? How do these requirements change over time?**  
    Because storage accounts have shared limits, when you allocate classic file shares to storage accounts, you need to consider the needs of each classic file share both now and over time. The provisioning logic for the provisioned v2 model prevents you from provisioning more storage, IOPS, or throughput than the storage account supports. If enough classic file shares are placed in a single storage account so that one of these dimensions is maxed out, existing classic file shares can't grow without first migrating to a different storage account. To reduce this risk, plan sufficient headroom in each storage account so that you can maintain mappings of classic file shares to storage accounts for at least 3 to 5 years.

- **Do you have special requirements regarding tracking the bill for each classic file share back to individual projects, departments, or customers?**  
    In Azure, the lowest granularity that you can see billing for is the *resource*, meaning that if you put two classic file shares in the same storage account, you can't easily track their costs back to individual projects, departments, or customers. To solve this, you should group classic file shares into storage accounts based on how they need to be tracked from a billing perspective.

- **How many storage accounts are available in your subscription for your target region?**  
    An additional complicating factor is the number of storage accounts you can have per subscription per region. See [`Microsoft.Storage` control plane limits](./storage-files-scale-targets.md#microsoftstorage-control-plane-limits) for more information. Depending on how many storage accounts you need, you might need to use additional subscriptions to create additional storage accounts.

#### Provisioned v2 file shares (Microsoft.FileShares)
Creating file shares using the `Microsoft.FileShares` management model makes deploying Azure Files considerably easier:

- **You don't need to consider the current and future of needs of each file share to decide where to deploy that file share.**  
    Each file share's provisioning is independent of every other file share's provisioning. The only consideration on the growth of the file share is the limits of the file share, detailed in [Provisioned v2 provisioning](#provisioned-v2-provisioning).

- **The bill for each file share is tracked independently.**  
    Because file shares created with the Microsoft.FileShares resource provider are top-level resources, you can track the bill for each file share independently from every other file share. You can also use tags to make it easy to group together the resources to track costs for projects, departments, or customers.

- **While file shares still have a limit per subscription per region, the limit of file shares is much higher than the limit of storage accounts.**  
    For more information, see [`Microsoft.FileShares` control plane limits](./storage-files-scale-targets.md#microsoftfileshares-control-plane-limits).

### Provisioned v2 snapshots
Azure Files supports snapshots, which are similar to volume shadow copies (VSS) on Windows File Server. For more information on share snapshots, see [Overview of snapshots for Azure Files](storage-snapshots-files.md).

Snapshots are always differential from the live share and from each other. In the provisioned v2 billing model, if the total differential size of all snapshots fits within the excess provisioned storage space of the file share, there's no extra cost for snapshot storage. If the size of the live share data plus the differential snapshot data is greater than the provisioned storage of the share, the excess used capacity of the snapshots is billed against the **Overflow Snapshot Usage** meter. The formula for determining the amount of overflow is: `MAX((LiveShareUsedGiB + SnapshotDifferentialUsedGiB) - ProvisionedStorageGiB, 0)`

Some value-added services for Azure Files use snapshots as part of their value proposition. For more information, see [value-added services for Azure Files](#value-added-services).

### Provisioned v2 soft delete
When soft delete is enabled, deleted file shares are billed based on their used storage capacity during the retention period. The provisioned storage, IOPS, and throughput of a deleted share continue to count toward the storage account’s limits until the share is purged, ensuring it can be restored. However, these resources are not billed. For details on enabling soft delete, see [How to enable soft delete on Azure file shares](storage-files-enable-soft-delete.md).

### Provisioned v2 billing meters
File shares provisioned using the provisioned v2 billing model are billed against the following billing meters:

- **Provisioned Storage**: The amount of storage provisioned in GiB.
- **Provisioned IOPS**: The amount of IOPS (IO / sec) provisioned.
- **Provisioned Throughput MiBPS**: The amount of throughput provisioned in MiB / sec.
- **Overflow Snapshot Usage**: Any amount of differential snapshot usage in GiB that doesn't fit within the provisioned storage capacity. For more information, see [provisioned v2 snapshots](#provisioned-v2-snapshots).
- **Soft-Deleted Usage**: Used storage capacity in GiB for soft-deleted file shares. For more information, see [provisioned v2 soft-delete](#provisioned-v2-soft-delete).

Consumption units against the provisioned v2 billing meters are emitted hourly. For example, for a share with 1,024 GiB provisioned, you should see:

- 1,024 units against the **Provisioned Storage** meter for an individual hour.
- 24,576 units against the **Provisioned Storage** meter if aggregated for a day.
- A variable number of units if aggregated for a month depending on the number of days in the month:
    - 28 day month (normal February): 688,128 units against the **Provisioned Storage** meter.
    - 29 day month (leap year February): 712,704 units against the **Provisioned Storage** meter.
    - 30 day month: 737,280 units against the **Provisioned Storage** meter.
    - 31 day month: 761,856 units against the **Provisioned Storage** meter.

### Provisioned v2 migrations
The process for migrating your SMB Azure file shares from a pay-as-you-go model to the provisioned v2 billing model differs depending on whether you're using Azure File Sync.

- If you're using Azure Files without Azure File Sync, see [Migrate files from one SMB Azure file share to another](migrate-files-between-shares.md).
- If you're using Azure File Sync, see [Migrate files from one Azure file share to another when using Azure File Sync](../file-sync/file-sync-share-to-share-migration.md).

## Provisioned v1 model
The provisioned v1 method provides storage, IOPS, and throughput in a fixed ratio to each other, similar to how storage is purchased in an on-premises storage solution. When you create a new provisioned v1 classic file share, you specify how much storage your share needs, and IOPS and throughput are computed values. The provisioned v1 model for Azure Files is only available for the SSD media tier.

The amount of storage you provision determines the guaranteed storage, IOPS, and throughput limits of your classic file share's usage. For example, if you provision a 2 TiB share and upload 2 TiB of data to your classic file share, it will be full. You won't be able to add more data unless you increase the size of your classic file share, or delete some of the data. Credit-based IOPS bursting provides added flexibility around usage, on a best-effort basis, while credits remain.

Unlike purchasing storage on-premises, provisioned v1 classic file shares can be dynamically scaled up or down as your needs change. However, you can only decrease the provisioned storage after 24 hours have elapsed since your last storage increase. Storage, IOPS, and throughput changes are effective within a few minutes after a provisioning change.

It's possible to decrease the size of your provisioned share below your used GiB. If you do, you won't lose data, but you're still billed for the size used. You'll receive the performance of the provisioned share, not the size used.

### Provisioned v1 availability
The provisioned v1 model is available for the following combinations of media tier, redundancy, and file sharing protocol:

| Media tier | Redundancy | File sharing protocol | Classic file shares (`Microsoft.Storage`) | File shares (`Microsoft.FileShares`) |
|-|-|-|-|-|
| SSD | Local | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD | Zone | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD | Local | NFS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD | Zone | NFS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Local | SMB | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Zone | SMB | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Geo | SMB | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | GeoZone | SMB | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Local | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Zone | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Geo | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | GeoZone | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |

SSD classic file shares using the provisioned v1 model are generally available in most Azure regions. For more information, see [Azure products by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region).

### Provisioned v1 provisioning detail
When you create a provisioned v1 classic file share, you specify how much storage your share needs. Each GiB that you provision entitles you to more IOPS and throughput in a fixed ratio. Provisioned v1 classic file shares are limited based on the following attributes:

| Item | Value |
|-|-|
| Storage provisioning unit | 1 GiB |
| Minimum provisioned storage | 100 GiB |
| Minimum provisioned IOPS (computed) | 3,100 IOPS |
| Minimum provisioned throughput (computed) | 110 MiB / sec |
| Maximum provisioned storage | 100 TiB (102,400 GiB) |
| Maximum provisioned IOPS (computed) | 102,400 IOPS |
| Maximum provisioned throughput (computed) | 10,340 MiB / sec |

The following formulas determine the amount of IOPS and throughput provisioned on the share:

| Item | Formula |
|-|-|
| Computed provisioned (baseline) IOPS | `MIN(3000 + 1 * ProvisionedStorageGiB, 102400)` |
| Computed provisioned throughput (MiB / sec) | `100 + CEILING(0.04 * ProvisionedStorageGiB) + CEILING(0.06 * ProvisionedStorageGiB)` |

Depending on your individual classic file share requirement, you might find that you require more IOPS or throughput than our provisioning formulas provide. In this case, you need to provision more storage to get the required IOPS or throughput.

### Provisioned v1 bursting
The provisioned v1 model supports two types of bursting: **credit-based bursting**, which is included for free as a part of the provisioning, and **paid bursting**, which is an advanced feature that can you can optionally enable to support usage-based billing whenever the IOPS and throughput go over the provisioned amount.

#### Provisioned v1 credit-based bursting
Credit-based IOPS bursting provides added flexibility around IOPS usage. This flexibility is best used as a buffer against unanticipated IO-spikes. For established IO patterns, we recommend provisioning for IO peaks.

Burst IOPS credits accumulate whenever traffic for your classic file share is less than provisioned (baseline) IOPS. Whenever a classic file share's IOPS usage exceeds the provisioned IOPS and there are available burst IOPS credits, the classic file share can burst up to the maximum allowed burst IOPS limit. Classic file shares can continue to burst as long as there are credits remaining, based on the number of burst credits accrued. Each IO beyond provisioned IOPS consumes one credit. Once all credits are consumed, the classic file share returns to the provisioned IOPS. IOPS against the classic file share don't have to do anything special to use bursting. Bursting operates on a best effort basis.  

Share credits have three states:

- **Accruing**, when the classic file share is using less than the provisioned IOPS.
- **Declining**, when the classic file share is using more than the provisioned IOPS and in the bursting mode.
- **Constant**, when the classic file share is using exactly the provisioned IOPS and there are either no credits accrued or used.

A new classic file share starts with the full number of credits in its burst bucket. Burst credits don't accrue if the share IOPS fall below the provisioned limit due to throttling by the server. The following formulas are used to determine the burst IOPS limit and the number of credits possible for a classic file share:

| Item | Formula |
|-|-|
| Burst limit | `MIN(MAX(3 * ProvisionedStorageGiB, 10000), 102400)` |
| Burst credits | `(BurstLimit - BaselineIOPS) * 3600` |

The following table illustrates a few examples of these formulas for the provisioned sizes:

| Capacity (GiB) | Baseline IOPS | Burst IOPS | Burst credits | Throughput (MiB/sec) |
|-|-|-|-|-|
| 100 | 3,100 | Up to 10,000 | 24,840,000 | 110 |
| 500 | 3,500 | Up to 10,000 | 23,400,000 | 150 |
| 1,024 | 4,024 | Up to 10,000 | 21,513,600 | 203 |
| 5,120 | 8,120 | Up to 15,360 | 26,064,000 | 613 |
| 10,240 | 13,240 | Up to 30,720 | 62,928,000 | 1,125 |
| 33,792 | 36,792 | Up to 102,400 | 227,548,800 | 3,480 |
| 51,200 | 54,200 | Up to 102,400 | 164,880,000 | 5,220 |
| 102,400 | 102,400 | Up to 102,400 | 0 | 10,340 |

#### Provisioned v1 paid bursting
Paid bursting is an advanced feature of the provisioned v1 model designed to support customers who never want to be throttled. Paid bursting adds extra usage-based billing for any amount of IOPS or throughput above the provisioned storage. This is distinct from credit-based bursting, which is included for free as part of provisioned storage. While paid bursting can add powerful flexibility to how you provision your classic file share, it can also lead to unexpected billing if used incorrectly.

Like credit-based bursting, paid bursting isn't a replacement for provisioning the correct amount of IOPS and throughput. Rather, it provides further protection against throttling if you run into unexpected demand. If you have a consistent level of IOPS or throughput usage, it's cheaper to provision enough IOPS and throughput (through storage provisioning) to cover demand instead relying on paid bursting.

Paid bursting is disabled by default, but you can enable it by following the instructions to [change the cost and performance characteristics of a provisioned v1 classic file share](./modify-file-share.md?tabs=azure-powershell#change-the-cost-and-performance-characteristics-of-a-provisioned-v1-classic-file-share) (PowerShell and CLI only). If paid bursting is enabled, we recommend carefully monitoring IOPS and throughput usage using the following metrics available through Azure monitor:

- File Share Provisioned IOPS
- File Share Provisioned Bandwidth MiB/s (throughput)
- Transactions by Max IOPS
- Bandwidth by Max MiB/sec (throughput)
- Burst Credits for IOPS (credit-based bursting)
- Paid Bursting IOS (IOs)
- Paid Bursting Bandwidth

### Provisioned v1 resource models
You can create a provisioned v1 file share only as a classic file share within a storage account (`Microsoft.Storage`).

#### Provisioned v1 classic file shares (Microsoft.Storage)
To create a classic file share using the provisioned v1 model, your storage account must use one of the following combinations of settings:

| Storage account kind | Storage account SKU | Type of file share available |
|-|-|-|
| FileStorage | Premium_LRS | SSD provisioned v1 file shares with the Local (LRS) redundancy specified. |
| FileStorage | Premium_ZRS | SSD provisioned v1 file shares with the Zone (ZRS) redundancy specified. |

For more information on how to create a classic file share using the provisioned v1 model, see [create a classic file share](./create-classic-file-share.md).

Classic file shares created in the same storage account share that storage account's limits for storage, IOPS, and throughput:

| Attribute | SSD value | Enforcement strategy |
|-|-|-|
| Maximum provisioned storage per storage account | 100 TiB (102,400 GiB) | At provision time |
| Maximum used IOPS per storage account | 102,400 IOPS | You are allowed to provision more than 102,400 IOPS, but usage above this limit is throttled. |
| Maximum used throughput per storage account | 10,340 MiB / sec | You are allowed to provision more than 10,340 MiB / sec, but usage above this limit is throttled. |
| Maximum number of classic file shares per storage account | 1,024 classic file shares | This limit is implicitly enforced by the maximum provisioned storage for a storage account. |

To correctly do a deployment of Azure Files with the provisioned v1 billing model on classic file shares, you need to consider the following dimensions of capacity planning:

- **How much provisioned storage, IOPS, and throughput do you need for each classic file share? How do these requirements change over time?**  
    Because of the shared storage account limits, when you allocate classic file shares to storage accounts, you need to consider the needs of each classic file share both now and over time. The provisioning logic for the provisioned v1 model prevents you from provisioning more storage than the storage account supports. While you are allowed to provision more IOPS and throughput than the storage account provides, you can't use more than the storage account's limits for IOPS and throughput. To avoid unexpected throttling, don't provision more IOPS or throughput than the storage account supports. 
    
    In addition, placing too many classic file shares in a storage account can restrict future growth. Once a storage account is full, you can't expand existing classic file shares without first migrating some to another storage account. To reduce this risk, plan enough headroom in your storage accounts that you can maintain the mappings of classic file shares to storage accounts for at least 3 to 5 years.

- **Do you have special requirements regarding tracking the bill for each classic file share back to individual projects, departments, or customers?**  
    In Azure, the lowest granularity that you can see billing for is the *resource*, meaning that if you put two classic file shares in the same storage account, you cannot easily track their costs back to individual projects, departments, or customers. To solve this, group classic file shares into storage accounts based on how they need to be tracked from a billing perspective.

- **How many storage accounts are available in your subscription for your target region?**  
    An additional complicating factor is the number of storage accounts you can have per subscription per region. See [`Microsoft.Storage` control plane limits](./storage-files-scale-targets.md#microsoftstorage-control-plane-limits) for more information. Depending on how many storage accounts you need, you may need to use additional subscriptions to achieve additional storage accounts.

### Provisioned v1 snapshots
Azure Files supports snapshots, which are similar to volume shadow copies (VSS) on Windows File Server. For more information on share snapshots, see [Overview of snapshots for Azure Files](storage-snapshots-files.md).

Snapshots are always differential from the live share and from each other. In the provisioned v1 billing model, the total differential size is billed against a usage meter, regardless of how much provisioned storage is unused. The used snapshot storage meter has a reduced price over the provisioned storage price.

### Provisioned v1 soft delete
Deleted classic file shares in storage accounts with soft-delete enabled are billed based on the used storage capacity of the deleted share for the defined retention period. The soft-deleted usage storage capacity is emitted against the used snapshot storage meter. For more information on soft delete, see [How to enable soft delete on Azure file shares](storage-files-enable-soft-delete.md).

### Provisioned v1 billing meters
Classic file shares provisioned using the provisioned v1 billing model are billed against the following meters:

- **Premium Provisioned**: The amount of storage provisioned in GiB.
- **Premium Snapshots**: The amount of used snapshots and used soft-deleted capacity.

Consumption against the provisioned v1 billing meters is emitted hourly in terms of monthly units. For example, for a share with 1,024 GiB provisioned, you should see:

- A variable number of units for an individual hour depending on the number of days in the month:
    - 28 day month (normal February): 1.5238 units against the **Premium Provisioned** meter.
    - 29 day month (leap year February): 1.4713 units against the **Premium Provisioned** meter.
    - 30 day month: 1.4222 units against the **Premium Provisioned** meter.
    - 31 day month: 1.3763 units against the **Premium Provisioned** meter.
- A variable number of units if aggregated for a day depending on the number of days in the month:
    - 28 day month (normal February): 36.5714 units against the **Premium Provisioned** meter.
    - 29 day month (leap year February): 35.3103 units against the **Premium Provisioned** meter.
    - 30 day month: 34.1333 units against the **Premium Provisioned** meter.
    - 31 day month: 33.0323 units against the **Premium Provisioned** meter.
- 1,024 units against the **Premium Provisioned** meter if aggregated for a month.

## Pay-as-you-go model
In the pay-as-you-go model, you're billed on how much storage you use, not how much you provision. At a high level, you pay a cost for the amount of logical data stored, and you're also charged for transactions based on your usage of that data. Pay-as-you-go billing can be difficult to plan for as part of a budgeting process, because you pay based on end-user consumption. We therefore recommend using the [provisioned v2 model](#provisioned-v2-model) for new classic file share deployments. The pay-as-you-go model is only available for HDD storage.

### Pay-as-you-go availability
The pay-as-you-go model is available for the following combinations of media tier, redundancy, and file sharing protocol:

| Media tier | Redundancy | File sharing protocol | Classic file shares (`Microsoft.Storage`) | File shares (`Microsoft.FileShares`) |
|-|-|-|-|-|
| SSD | Local | SMB | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD | Zone | SMB | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD | Local | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD | Zone | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Local | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Zone | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Geo | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | GeoZone | SMB | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Local | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Zone | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | Geo | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| HDD | GeoZone | NFS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |

HDD classic file shares using the pay-as-you-go model are generally available in all Azure regions.

### Differences in access tiers
When you create a classic file share in a pay-as-you-go storage account, you pick between the following access tiers: transaction optimized, hot, and cool. All three access tiers are stored on the exact same storage hardware. The main difference for these three access tiers is their data at-rest storage prices, which are lower in cooler tiers, and the transaction prices, which are higher in the cooler tiers. This means:

- **Transaction optimized**, as the name implies, optimizes the price for high IOPS (transaction) workloads. Transaction optimized has the highest data at-rest storage price, but the lowest transaction prices.
- **Hot** is for active workloads that don't involve a large number of transactions. It has a slightly lower data at-rest storage price, but slightly higher transaction prices as compared to transaction optimized. Think of it as the middle ground between the transaction optimized and cool tiers.
- **Cool** optimizes the price for workloads that don't have high activity, offering the lowest data at-rest storage price, but the highest transaction prices.

Selecting the appropriate access tier for your use case allows you to considerably reduce your costs. If you put an infrequently accessed workload in the transaction optimized access tier, you pay almost nothing for the few times in a month that you make transactions against your classic file share. However, you pay a high amount for the data storage costs. If you moved this same share to the cool access tier, you'd still pay almost nothing for the transaction costs, simply because you're infrequently making transactions for this workload. However, the cool access tier has a cheaper data storage price.

Similarly, if you put a highly accessed workload in the cool access tier, you pay a lot more in transaction costs, but less for data storage costs. This can lead to a situation where the increased costs from the transaction prices increase outweigh the savings from the decreased data storage price, and you might pay more for cool than you would have paid for transaction optimized. For some usage levels, it's possible that the hot access tier will be the most cost efficient, and the cool access tier will be more expensive than transaction optimized.

Your workload and activity level determine the most cost efficient access tier for your pay-as-you-go classic file share. In practice, the best way to pick the most cost efficient access tier involves looking at the actual resource consumption of the share (data stored, write transactions, etc.). For pay-as-you-go classic file shares, we recommend starting in the transaction optimized tier during the initial migration into Azure Files, and then picking the correct access tier based on usage after the migration is complete. Transaction usage during migration typically isn't indicative of normal transaction usage.

### What are transactions?
When you mount a classic file share using the pay-as-you-go model on a computer using SMB, the classic file share is exposed on your computer as if it were local storage. This means that applications, scripts, and other programs on your computer can access the files and folders on the classic file share without needing to know that they're stored in Azure.

When you read or write to a file, the application you're using performs a series of API calls to the file system API provided by your operating system. Your operating system then interprets these calls into SMB protocol transactions, which are sent over the wire to Azure Files to fulfill. A simple task that the end user perceives as a single operation, such as reading a file from start to finish, might be translated into multiple SMB transactions served by Azure Files.

As a principle, the classic file shares using the pay-as-you-go model bills based on usage. SMB and FileREST transactions made by applications and scripts represent usage of your classic file share, and they show up as part of your bill. The same concept applies to value-added cloud services that you might add to your share, such as Azure File Sync or Azure Backup. 

Transactions are grouped into five different transaction categories which have different prices based on their impact on the classic file share. These categories are: write, list, read, other, and delete.

The following table shows the categorization of each transaction:

| Transaction bucket | Management operations | Data operations |
|-|-|-|
| Write transactions | <ul><li>`CreateShare`</li><li>`SetFileServiceProperties`</li><li>`SetShareMetadata`</li><li>`SetShareProperties`</li><li>`SetShareAcl`</li><li>`SnapshotShare`</li><li>`RestoreShare`</li></ul> | <ul><li>`CopyFile`</li><li>`Create`</li><li>`CreateDirectory`</li><li>`CreateFile`</li><li>`PutRange`</li><li>`PutRangeFromURL`</li><li>`SetDirectoryMetadata`</li><li>`SetFileMetadata`</li><li>`SetFileProperties`</li><li>`SetInfo`</li><li>`Write`</li><li>`PutFilePermission`</li><li>`Flush`</li><li>`SetDirectoryProperties`</li></ul> |
| List transactions | <ul><li>`ListShares`</li></ul> | <ul><li>`ListFileRanges`</li><li>`ListFiles`</li><li>`ListHandles`</li></ul> |
| Read transactions | <ul><li>`GetFileServiceProperties`</li><li>`GetShareAcl`</li><li>`GetShareMetadata`</li><li>`GetShareProperties`</li><li>`GetShareStats`</li></ul> | <ul><li>`FilePreflightRequest`</li><li>`GetDirectoryMetadata`</li><li>`GetDirectoryProperties`</li><li>`GetFile`</li><li>`GetFileCopyInformation`</li><li>`GetFileMetadata`</li><li>`GetFileProperties`</li><li>`QueryDirectory`</li><li>`QueryInfo`</li><li>`Read`</li><li>`GetFilePermission`</li></ul> |
| Other/protocol transactions | <ul><li>`AcquireShareLease`</li><li>`BreakShareLease`</li><li>`ReleaseShareLease`</li><li>`RenewShareLease`</li><li>`ChangeShareLease`</li></ul> | <ul><li>`AbortCopyFile`</li><li>`Cancel`</li><li>`ChangeNotify`</li><li>`Close`</li><li>`Echo`</li><li>`Ioctl`</li><li>`Lock`</li><li>`Logoff`</li><li>`Negotiate`</li><li>`OplockBreak`</li><li>`SessionSetup`</li><li>`TreeConnect`</li><li>`TreeDisconnect`</li><li>`CloseHandles`</li><li>`AcquireFileLease`</li><li>`BreakFileLease`</li><li>`ChangeFileLease`</li><li>`ReleaseFileLease`</li></ul> |
| Delete transactions | <ul><li>`DeleteShare`</li></ul> | <ul><li>`ClearRange`</li><li>`DeleteDirectory`</li><li>`DeleteFile`</li></ul> |  

> [!NOTE]
> NFSv4.1 is only available for SSD file shares using either the provisioned v2 or provisioned v1 billing models. Transactions buckets don't affect billing for provisioned file shares.

### Switching between access tiers
Although you can change the access tier of a classic file share using the pay-as-you-go model, the best practice to optimize costs after the initial migration is to pick the most cost optimal access tier to be in, and stay there unless your access pattern changes. This is because changing the access tier of a classic file share results in extra costs as follows:

- Transactions: When you move a share from a hotter access tier to a cooler access tier, you incur the cooler access tier's write transaction charge for each file in the classic file share. Moving a classic file share from a cooler access tier to a hotter access tier incurs the cooler access tier's read transaction charge for each file in the classic file share.

- Data retrieval: If you're moving from the cool access tier to hot or transaction optimized, you incur a data retrieval charge based on the size of data moved. Only the cool access tier has a data retrieval charge.

The following table illustrates the cost breakdown of moving access tiers:

| Access tier | Transaction optimized (destination) | Hot (destination) | Cool (destination) |
|-|-|-|-|
| **Transaction optimized (source)** | -- | <ul><li>One hot write transaction per file.</li></ul> | <ul><li>One cool write transaction per file.</li></ul> |
| **Hot (source)** | <ul><li>One hot read transaction per file.</li><ul> | -- | <ul><li>One cool write transaction per file.</li></ul> |
| **Cool (source)** | <ul><li>One cool read transaction per file.</li><li>Data retrieval per total used GiB.</li></ul> | <ul><li>One cool read transaction per file.</li><li>Data retrieval per total used GiB.</li></ul> | -- |

You can change a classic file share's access tier up to five times within a 30-day window. The first day of the 30-day window begins when the first tier change happens. Changes between access tiers happen instantly, however, once you change the access tier of a share, you can't change it again within 24 hours, even if you've changed the access tier property fewer than five times within the last 30 days.

### Choosing an access tier
Regardless of how you migrate existing data into Azure Files, we recommend initially creating the classic file share in the transaction optimized access tier. This is due to the large number of transactions incurred during migration. After your migration is complete and you operate for a few days or weeks with regular usage, you can plug your transaction counts into the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to determine which access tier is best suited for your workload.

Because pay-as-you-go storage accounts only show transaction information at the storage account level, using the storage metrics to estimate which access tier is cheaper at the classic file share level is an imperfect science. If possible, we recommend deploying only one classic file share in each storage account to ensure full visibility into billing.

To see previous transactions:

1. Navigate to your storage account in the Azure portal.
1. In the service menu, under **Monitoring**, select **Metrics**.
1. Select **Scope** as your storage account name, **Metric Namespace** as "File", **Metric** as "Transactions", and **Aggregation** as "Sum".
1. Select **Apply Splitting**.
1. Select **Values** as "API Name". Select your desired **Limit** and **Sort**.
1. Select your desired time period.

> [!NOTE]
> Make sure you view transactions over a long enough period of time to get a realistic idea of average number of transactions. Ensure that the chosen time period doesn't overlap with initial provisioning. Multiply the average number of transactions during this time period to get the estimated transactions for an entire month.

### Pay-as-you-go resource models
You can create a pay-as-you-go file share only as a classic file share within a storage account (`Microsoft.Storage`).

#### Pay-as-you-go classic file shares (Microsoft.Storage)
To create a classic file share using the pay-as-you-go model, your storage account must use one of the following combinations of settings:

| Storage account kind | Storage account SKU | Type of file share available |
|-|-|-|
| StorageV2 | Standard_LRS | HDD pay-as-you-go file share with the Local (LRS) redundancy specified. |
| StorageV2 | Standard_ZRS | HDD pay-as-you-go file share with the Zone (ZRS) redundancy specified. |
| StorageV2 | Standard_GRS | HDD pay-as-you-go file share with the Geo (GRS) redundancy specified. |
| StorageV2 | Standard_GZRS | HDD pay-as-you-go file share with the GeoZone (GZRS) redundancy specified. |
| StorageV2 | Standard_RAGRS | HDD pay-as-you-go file share with the Geo (GRS) redundancy specified. |
| StorageV2 | Standard_RAGZRS | HDD pay-as-you-go file share with the GeoZone (GZRS) redundancy specified. |

Classic file shares created in the same storage account share that storage account's limits for storage, IOPS, and throughput:

| Attribute | HDD value | Enforcement strategy |
|-|-|-|
| Maximum used storage per storage account | 5 PiB (5,242,880) | Usage is capped. |
| Maximum used IOPS per storage account | <ul><li>Select regions: 40,000 IOPS</li><li>Default: 20,000 IOPS</li></ul> | Usage above the limit is throttled. |
| Maximum used throughput per storage account | <ul><li>Select regions:<ul><li>Ingress: 7,680 MiB / sec</li><li>Egress: 25,600 MiB / sec</li></ul></li><li>Default:<ul><li>Ingress: 3,200 MiB / sec</li><li>Egress: 6,400 MiB / sec</li></ul></li></ul> | Usage above the limit is throttled. |
| Maximum number of classic file shares per storage account | Unlimited | Storage, IOPS, and throughput limits are meant to be a practical bound on the number of classic file shares. |

See [storage account data plane limits](./storage-files-scale-targets.md#storage-account-data-plane-limits) for more detail, including which regions support increased limits for IOPS and throughput.

To correctly do a deployment of Azure Files with the pay-as-you-go billing model on classic file shares, you need to consider the following dimensions of capacity planning:

- **How much used storage, IOPS, and throughput do you need for each classic file share? How do these requirements change over time?**  
    Because of the shared storage account limits, when you allocate classic file shares to storage accounts, you need to consider the needs of each classic file share both now and over time. Unlike the provisioned v2 and provisioned v1 models, the pay-as-you-go model offers few protections to help you share the limits of the storage account between classic file shares in the same storage account. Each classic file share in a pay-as-you-go storage account can span up to the classic file share limits on the size of the file share, and up to the storage account limits for IOPS and throughput. Putting two classic file shares in the same pay-as-you-go storage account could cause IOPS or throughput contention. To avoid unexpected throttling, limit the number of classic file shares that you place in a pay-as-you-go storage account.

- **Do you have special requirements regarding tracking the bill for each classic file share back to individual projects, departments, or customers?**  
    In Azure, the lowest granularity that you can see billing for is the *resource*, meaning that if you put two classic file shares in the same storage account, you cannot easily track their costs back to individual projects, departments or customers. To solve this, group classic file shares into storage accounts based on how they need to be tracked from a billing perspective.

- **How many storage accounts are available in your subscription for your target region?**  
    An additional complicating factor is the number of storage accounts you can have per subscription per region. See [`Microsoft.Storage` control plane limits](./storage-files-scale-targets.md#microsoftstorage-control-plane-limits) for more information. Depending on how many storage accounts you need, you may need to use additional subscriptions to achieve additional storage accounts.

### Pay-as-you-go snapshots
Azure Files supports snapshots, which are similar to volume shadow copies (VSS) on Windows File Server. For more information on share snapshots, see [Overview of snapshots for Azure Files](storage-snapshots-files.md).

Snapshots are always differential from the live share and from each other. In the pay-as-you-go billing model, the total differential size is billed against the normal used storage meter. This means that you won't see a separate line item on your bill representing snapshots for your pay-as-you-go storage account. This also means that differential snapshot usage counts against reservations that are purchased for pay-as-you-go classic file shares.

### Pay-as-you-go soft-delete
Deleted classic file shares in storage accounts with soft-delete enabled are billed based on used storage capacity for the defined retention period. The soft-deleted used storage capacity is emitted against the normal used storage meter. This means that you won't see a separate line item on your bill representing soft-deleted classic file shares for your pay-as-you-go storage account. This also means that soft-deleted classic file share usage counts against reservations that are purchased for pay-as-you-go classic file shares.

### Pay-as-you-go billing meters
Classic file shares created using the pay-as-you-go billing model are billed against the following meters:

- **Data Stored**: The used storage including the live shares, differential snapshots, and soft-deleted classic file shares in GiB.
- **Metadata**: The size of the file system metadata associated with files and directories such as access control lists (ACLs) and other properties in GiB. This billing meter is only used for classic file shares in the hot or cool access tiers.
- **Write Operations**: The number of write transaction buckets (one bucket = 10,000 transactions).
- **List Operations**: The number of list transaction buckets (one bucket = 10,000 transactions).
- **Read Operations**: The number of read transaction buckets (one bucket = 10,000 transactions).
- **Other Operations** / **Protocol Operations**: The number of other transaction buckets (one bucket = 10,000 transactions).
- **Data Retrieval**: The amount of data read from the classic file share in GiB. This meter is only used for classic file shares in the cool access tier.
- **Geo-Replication Data Transfer**: If the classic file share has the Geo or GeoZone redundancy, the amount of data written to the classic file share replicated to the secondary region in GiB.

Consumption units against the **Data Stored** and **Metadata** billing meters are emitted hourly in terms of monthly units. For example, for a share with 1,024 used GiB, you should see:

- A variable number of units for an individual hour depending on the number of days in the month:
    - 28 day month (normal February): 1.5238 units against the **Data Stored** meter.
    - 29 day month (leap year February): 1.4713 units against the **Data Stored** meter.
    - 30 day month: 1.4222 units against the **Data Stored** meter.
    - 31 day month: 1.3763 units against the **Data Stored** meter.
- A variable number of units if aggregated for a day depending on the number of days in the month:
    - 28 day month (normal February): 36.5714 units against the **Data Stored** meter.
    - 29 day month (leap year February): 35.3103 units against the **Data Stored** meter.
    - 30 day month: 34.1333 units against the **Data Stored** meter.
    - 31 day month: 33.0323 units against the **Data Stored** meter.
- 1,024 units against the **Data Stored** meter if aggregated for a month.

Consumption against the other meters (ex. **Write Operations** or **Data Retrieval**) is emitted hourly, but since these meters don't have a specific timeframe associated with them, they don't have any special unit transformations to be aware of.

## Provisioned/quota, logical size, and physical size
Azure Files tracks three distinct quantities with respect to share capacity:

- **Provisioned size or quota**: With both provisioned and pay-as-you-go file shares, you specify the maximum size that the file share is allowed to grow to. In provisioned file shares, this value is called the provisioned size. Whatever amount you provision is what you pay for, regardless of how much you actually use. In pay-as-you-go file shares, this value is called quota and doesn't directly affect your bill. Provisioned size is a required field for provisioned file shares. For pay-as-you-go file shares, if provisioned size isn't directly specified, the share defaults to the maximum value that the storage account supports (100 TiB).

- **Logical size**: The logical size of a file share or file relates to how large it is without considering how it's actually stored, without any storage optimization. The logical size of the file is how many KiB/MiB/GiB would be transferred over the wire if you copied it to a different location. In both provisioned and pay-as-you-go file shares, the total logical size of the file share is used for enforcement against provisioned size/quota. In pay-as-you-go file shares, the logical size is the quantity used for the data at-rest usage billing. Logical size is referred to as "size" in the Windows properties dialog for a file/folder and as "content length" by Azure Files metrics.

- **Physical size**: The physical size of the file relates to the size of the file as encoded on disk. Physical size might align with the file's logical size, or it might be smaller, depending on how the file has been written to by the operating system. A common reason for the logical size and physical size to be different is by using [sparse files](/windows/win32/fileio/sparse-files). The physical size of the files in the share is used for snapshot billing, although allocated ranges are shared between snapshots if they're unchanged (differential storage).

## Value-added services
Like many on-premises storage solutions, Azure Files provides integration points for first- and third-party products to integrate with customer-owned file shares. Although these solutions can provide considerable extra value to Azure Files, you should consider the extra costs that these services add to the total cost of an Azure Files solution.

Costs break down into three buckets:

- **Licensing costs for the value-added service.** Licensing costs might come in the form of a fixed cost per customer, end user (sometimes called a "head cost"), file share, or storage account. They might also be based on units of storage utilization, such as a fixed cost for every 500 GiB-chunk of data in the file share.

- **Transaction costs for the value-added service.** Some value-added services have their own concept of transactions on top of the Azure Files billing model selected. These transactions show up on your bill under the value-added service's charges; however, they relate directly to how you use the value-added service with your file share.

- **Azure Files costs for using a value-added service.** Azure Files doesn't directly charge customers for adding value-added services, but as part of adding value to the Azure file share, the value-added service might increase the costs that you see on your Azure file share. These costs are easy to see with pay-as-you-go file shares, because of transaction charges. If the value-added service does transactions against the file share on your behalf, they show up in your Azure Files transaction bill even though you didn't directly do those transactions yourself. This applies to provisioned file shares as well, although it might be less noticeable. Transactions against provisioned file shares from value-added services count against your provisioned IOPS numbers, meaning that value-added services might require provisioning more storage to have enough IOPS or throughput available for your workload.

When computing the total cost of ownership for your file share, you should consider the costs of Azure Files and of all value-added services that you would like to use with Azure Files.

There are multiple value-added first- and third-party services. This document covers a subset of the common first-party services customers use with Azure file shares. You can learn more about services not listed here by reading the pricing page for that service.

### Azure File Sync
Azure File Sync is a value-added service for Azure Files that synchronizes one or more on-premises Windows file shares with an Azure file share. Because the cloud Azure file share has a complete copy of the data in a synchronized file share that is available on-premises, you can transform your on-premises Windows File Server into a cache of the Azure file share to reduce your on-premises footprint. Learn more by reading [Introduction to Azure File Sync](../file-sync/file-sync-introduction.md).

When considering the total cost of ownership for a solution deployed using Azure File Sync, you should consider the following cost aspects:

[!INCLUDE [storage-file-sync-cost-categories](../../../includes/storage-file-sync-cost-categories.md)]

### Azure Backup
Azure Backup provides a serverless backup solution for Azure Files that seamlessly integrates with your file shares, and with other value-added services such as Azure File Sync. Azure Backup for Azure Files is a snapshot-based backup solution that provides a scheduling mechanism for automatically taking snapshots on an administrator-defined schedule. It also provides a user-friendly interface for restoring deleted files/folders or the entire share to a particular point in time. To learn more, see [About Azure file share backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json).

When considering the costs of using Azure Backup, consider the following factors:

- **Protected instance licensing cost for Azure file share data.** Azure Backup charges a protected instance licensing cost per storage account containing backed up Azure file shares. A protected instance is defined as 250 GiB of Azure file share storage. Storage accounts containing less than 250 GiB are subject to a fractional protected instance cost. For more information, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). You must select *Azure Files* from the list of services Azure Backup can protect.

- **Azure Files costs.** Azure Backup increases the costs of Azure Files in the following ways:
    - **Differential costs from Azure file share snapshots.** Azure Backup automates taking Azure file share snapshots on an administrator-defined schedule. Snapshots are always differential; however, the added cost added depends on the length of time snapshots are kept and the amount of churn on the file share during that time. These factors dictate how different the snapshot is from the live file share and therefore how much extra data is stored by Azure Files.

    - **Transaction costs from restore operations.** Restore operations from the snapshot to the live share incur transaction costs. For standard file shares, reads from snapshots/writes from restores are billed as normal file share transactions. For provisioned file shares, these operations count against the provisioned IOPS for the file share.

### Microsoft Defender for Storage
Microsoft Defender supports Azure Files as part of its Microsoft Defender for Storage product. Microsoft Defender for Storage detects unusual and potentially harmful attempts to access or exploit your Azure file shares over SMB or FileREST. Microsoft Defender for Storage is enabled on the subscription level for all file shares in storage accounts in that subscription.

Microsoft Defender for Storage doesn't support antivirus capabilities for Azure file shares.

The main cost from Microsoft Defender for Storage is an extra set of transaction costs that the product levies on top of the transactions that are done against the Azure file share. Although these costs are based on the transactions incurred in Azure Files, they aren't part of the billing for Azure Files, but rather are part of the Microsoft Defender pricing. Microsoft Defender for Storage charges a transaction rate even on provisioned file shares, where Azure Files includes transactions as part of IOPS provisioning. The current transaction rate can be found on [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) under the *Microsoft Defender for Storage* table row.

Transaction heavy file shares incur significant costs using Microsoft Defender for Storage. Based on these costs, you might want to opt-out of Microsoft Defender for Storage for specific storage accounts. For more information, see [Exclude a storage account from Microsoft Defender for Storage protections](/azure/defender-for-cloud/defender-for-storage-exclude).

## Reservations
Azure Files supports reservations (also referred to as *reserved instances*) for the provisioned v1 and pay-as-you-go models. Reservations enable you to achieve a discount on storage by pre-committing to storage utilization. You should consider purchasing reserved instances for any production workload, or dev/test workloads with consistent footprints. When you purchase a reservation, you must specify the following dimensions:

- **Capacity size**: Reservations can be for either 10 TiB or 100 TiB, with more significant discounts for purchasing a higher capacity reservation. You can purchase multiple Reservations, including Reservations of different capacity sizes to meet your workload requirements. For example, if your production deployment has 120 TiB of classic file shares, you could purchase one 100 TiB reservation and two 10 TiB reservations to meet the total storage capacity requirements.
- **Term**: You can purchase reservations for either a one-year or three-year term, with more significant discounts for purchasing a longer Reservation term.
- **Tier**: The tier of Azure Files for the reservation. Reservations currently are available for the SSD provisioned v1 (as "premium") and HDD pay-as-you-go (hot and cool access tiers only) billing models.
- **Location**: The Azure region for the reservation. Reservations are available in a subset of Azure regions.
- **Redundancy**: The storage redundancy for the reservation. Reservations are supported for all redundancies Azure Files supports, including LRS, ZRS, GRS, and GZRS.
- **Billing frequency**: Indicates how often the account is billed for the reservation. Options include *Monthly* or *Upfront*.

Once you purchase a reservation, it is automatically consumed by your existing storage utilization. If you use more storage than you have reserved, you pay list price for the balance not covered by the reservation. Transaction, bandwidth, data transfer, and metadata storage charges aren't included in the Reservation.

There are differences in how reservations work with share snapshots for pay-as-you-go and provisioned v1 file shares. If you're taking snapshots of pay-as-you-go classic file shares, then the snapshot differentials count against the reservation and are billed as part of the normal used storage meter. However, if you're taking snapshots of provisioned v1 classic file shares, then the snapshots are billed using a separate meter and don't count against the Reservation.

For more information on how to purchase reservations, see [Optimize costs for Azure Files with reservations](files-reserve-capacity.md).

## See also
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)
- [Cost estimation examples](./file-estimate-cost.md)
- [Planning for an Azure Files deployment](storage-files-planning.md) and [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
- [Create a classic file share](./create-classic-file-share.md)
- [Create a file share (preview)](./create-file-share.md)
