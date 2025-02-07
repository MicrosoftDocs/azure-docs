---
title: Understand Azure Files billing
description: Learn how to interpret the provisioned and pay-as-you-go billing models for Azure Files. Understand total cost of ownership, storage reservations, and burst credits.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 01/23/2025
ms.author: kendownie
ms.custom: references_regions
---

# Understand Azure Files billing models

Azure Files supports two different media tiers of storage, SSD and HDD, which allow you to tailor your file shares to the performance and price requirements of your scenario:

- **SSD (premium)**: file shares hosted on solid-state drives (SSDs) provide consistent high performance and low latency, within single-digit milliseconds for most IO operations.
- **HDD (standard)**: file shares host on hard disk drives (HDDs) provide cost-effective storage for general purpose use.

Azure Files has multiple pricing models including provisioned and pay-as-you-go options:

- **Provisioned billing models**: In a provisioned billing model, the primary costs of the file share are based on the amount of storage, IOPS (input and output operations per second), and throughput you provision when you create or update your file share, regardless of how much you use. Azure Files has two different provisioned models *provisioned v2* and *provisioned v1*.
    - **Provisioned v2**: In the provisioned v2 model, you have the ability to separately provision storage, IOPS, and throughput, although we provide a recommendation for you to help you with first time provisioning.
    - **Provisioned v1**: In the provisioned v1 model, you provision the amount of storage you need for the share while IOPS and throughput are determined based on how much storage you provision. The provisioned v1 model for Azure Files is only available for SSD (premium) file shares.
    
- **Pay-as-you-go billing model**: In a pay-as-you-go model, the cost of the file share is based on how much you use the share, in the form of used storage, transaction, and data transfer costs. The pay-as-you-go model for Azure Files is only available for HDD file shares. We recommend using the provisioned v2 model for new HDD file share deployments.

This article explains how the billing models for Azure Files work to help you understand your monthly Azure Files bill. For Azure Files pricing information, see [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube-nocookie.com/embed/dyqQkheaHYg]
    :::column-end:::
    :::column:::
        This video covers the Azure Files billing models including pay-as-you-go, provisioned v1, and provisioned v2.
   :::column-end:::
:::row-end:::

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)|
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Storage units
Azure Files uses the base-2 units of measurement to represent storage capacity: KiB, MiB, GiB, and TiB.

| Acronym | Definition                         | Unit     |
|---------|------------------------------------|----------|
| KiB     | 1,024 bytes                        | kibibyte |
| MiB     | 1,024 KiB (1,048,576 bytes)        | mebibyte |
| GiB     | 1024 MiB (1,073,741,824 bytes)     | gibibyte |
| TiB     | 1024 GiB (1,099,511,627,776 bytes) | tebibyte |

Although the base-2 units of measure are commonly used by most operating systems and tools to measure storage quantities, they're frequently mislabeled as the base-10 units, which you might be more familiar with: KB, MB, GB, and TB. Although the reasons for the mislabeling vary, the common reason why operating systems like Windows mislabel the storage units is because many operating systems began using these acronyms before they were standardized by the IEC (International Electrotechnical Commission), BIPM (International Bureau of Weights and Measures), and NIST (US National Institute of Standards and Technology).

The following table shows how common operating systems measure and label storage:

| Operating system | Measurement system | Labeling |
|-|-|-|-|
| Windows | Base-2 | Consistently mislabels as base-10. |
| Linux distributions | Commonly base-2, some software uses base-10 | Inconsistent labeling, alignment between measurement and labeling depends on the software package. |
| macOS, iOS, and iPad OS | Base-10 | [Consistently labels as base-10](https://support.apple.com/HT201402). |

Check with your operating system vendor if your operating system isn't listed.

## File share total cost of ownership checklist
If you're migrating to Azure Files from on-premises or comparing Azure Files to other cloud storage solutions, you should consider the following factors to ensure a fair, apples-to-apples comparison:

- **How do you pay for storage, IOPS, and bandwidth?** Most cloud solutions have models that align with the principles of either provisioned storage, such as price determinism and simplicity, or pay-as-you-go storage, which can optimize costs by only charging you for what you actually use. Of particular interest for provisioned models are minimum provisioned share size, the provisioning unit, and the ability to increase and decrease provisioning.

- **Are there any methods to optimize storage costs?** You can use [Azure Files Reservations](#reservations) to achieve an up to 36% discount on storage. Other solutions might employ strategies like deduplication or compression to optionally optimize storage efficiency. However, these storage optimization strategies often have non-monetary costs, such as reducing performance. Azure Files Reservations have no side effects on performance.

- **How do you achieve storage resiliency and redundancy?** With Azure Files, storage resiliency and redundancy are included in the product offering. All tiers and redundancy levels ensure that data is highly available and at least three copies of your data are accessible. When considering other file storage options, consider whether storage resiliency and redundancy is built in or something you must assemble yourself.

- **What do you need to manage?** With Azure Files, the basic unit of management is a storage account. Other solutions might require extra management, such as operating system updates or virtual resource management such as VMs, disks, and network IP addresses.

- **What are the costs of value-added products?** Azure Files supports integrations with multiple first- and third-party [value-added services](#value-added-services). Value-added services such as Azure Backup, Azure File Sync, and Microsoft Defender for Storage provide backup, replication and caching, and security functionality for Azure Files. Value-added solutions, whether on-premises or in the cloud, have their own licensing and product costs, but are often considered part of the total cost of ownership for file storage.

## Provisioned v2 model
The provisioned v2 model for Azure Files pairs predictability of total cost of ownership with flexibility, allowing you to create a file share that meets your exact storage and performance requirements. When you create a new provisioned v2 file share, you specify how much storage, IOPS, and throughput your file share needs. The amount of each quantity that you provision determines your total bill. 

The amount of storage, IOPS, and throughput you provision are the guaranteed limits of your file share's usage. For example, if you provision a 2 TiB share and upload 2 TiB of data to your share, your share will be full and you will not be able to add more data unless you increase the size of your share, or delete some of the data. Credit-based IOPS bursting provides added flexibility around usage, on a best-effort basis, while credits remain.

The amount of storage, IOPS, and throughput you provision can be dynamically scaled up or down as your needs change, however, you can only decrease a provisioned quantity only after 24 hours have elapsed since your last quantity increase. Storage, IOPS, and throughput changes are effective within a few minutes after a provisioning change.  

By default, when you create a new file share using the provisioned v2 model, we provide a recommendation for how many IOPS and how much throughput you need based on the amount of provisioned storage you specify. Although these recommendations are based on typical customer usage for that amount of provisioned storage for that media tier in Azure Files, you may find that your workload requires more or less IOPS and throughput than the "typical file share", and you can optionally provision more or less IOPS and throughput depending on your individual file share requirements.

### Provisioned v2 availability
The provisioned v2 model is provided for file shares in storage accounts with the *FileStorage* storage account kind. At present, the following subset of storage account SKUs are available:

| Storage account kind | Storage account SKU | Type of file share available |
|-|-|-|
| FileStorage | StandardV2_LRS | HDD provisioned v2 file shares with the Local (LRS) redundancy specified. |
| FileStorage | StandardV2_ZRS | HDD provisioned v2 file shares with the Zone (ZRS) redundancy specified. |
| FileStorage | StandardV2_GRS | HDD provisioned v2 file shares with the Geo (GRS) redundancy specified. |
| FileStorage | StandardV2_GZRS | HDD provisioned v2 file shares with the GeoZone (GZRS) redundancy specified. |

Currently, these SKUs are generally available in a limited subset of regions:

- France Central
- France South
- Australia East
- Australia Southeast
- East Asia
- Southeast Asia
- West US 2
- West Central US
- West Europe
- North Europe
- Germany West Central
- Germany North
- UK South
- UK West
- Central India
- South India

### Provisioned v2 provisioning detail
When you create a provisioned v2 file share, you specify the provisioned capacity for the file share in terms of storage, IOPS, and throughput. File shares are limited based on the following attributes:

| Item | HDD value |
|-|-|
| Storage provisioning unit | 1 GiB |
| IOPS provisioning unit | 1 IO / sec |
| Throughput provisioning unit | 1 MiB / sec |
| Minimum provisioned storage per file share | 32 GiB |
| Minimum provisioned IOPS per file share | 500 IOPS |
| Minimum provisioned throughput per file share | 60 MiB / sec |
| Maximum provisioned storage per file share | 256 TiB (262,144 GiB) |
| Maximum provisioned IOPS per file share | 50,000 IOPS |
| Maximum provisioned throughput per file share | 5,120 MiB / sec |
| Maximum provisioned storage per storage account | 4 PiB (4,194,304 GiB) |
| Maximum provisioned IOPS per storage account | 50,000 IOPS |
| Maximum provisioned throughput per storage account | 5,120 MiB / sec |
| Maximum number of file shares per storage account | 50 file shares |

By default, we recommended IOPS and throughput provisioning based on the provisioned storage you specify. These recommendation formulas are based on typical customer usage for that amount of provisioned storage for that media tier in Azure Files:

| Formula name | HDD formula |
|-|-|
| IOPS recommendation | `MIN(MAX(1000 + CEILING(0.2 * ProvisionedStorageGiB), 500), 50000)` |
| Throughput recommendation | `MIN(MAX(60 + CEILING(0.02 * ProvisionedStorageGiB), 60), 5120)` |

Depending on your individual file share requirements, you may find that you require more or less IOPS or throughput than our recommendations, and can optionally override these recommendations with your own values as desired.

### Provisioned v2 bursting
Credit-based IOPS bursting provides added flexibility around IOPS usage. This flexibility is best used as a buffer against unanticipated IO-spikes. For established IO patterns, we recommend provisioning for IO peaks.

Burst IOPS credits accumulate whenever traffic for your file share is below provisioned (baseline) IOPS. Whenever a file share's IOPS usage exceeds the provisioned IOPS and there are available burst IOPS credits, the file share can burst up to the maximum allowed burst IOPS limit. File shares can continue to burst as long as there are credits remaining, but this is based on the number of burst credits accrued. Each IO beyond provisioned IOPS consumes one credit. Once all credits are consumed, the share returns to the provisioned IOPS. IOPS against the file share don't have to do anything special to use bursting. Bursting operates on a best effort basis.  

Share credits have three states:

- Accruing, when the file share is using less than the provisioned IOPS.
- Declining, when the file share is using more than the provisioned IOPS and in the bursting mode.
- Constant, when the files share is using exactly the provisioned IOPS and there are either no credits accrued or used.

A new file share starts with the full number of credits in its burst bucket. Burst credits don't accrue if the share IOPS fall below the provisioned limit due to throttling by the server. The following formulas are used to determine the burst IOPS limit and the number of credits possible for a file share:

| Item | HDD formula |
|-|-|
| Burst IOPS limit | `MIN(MAX(3 * ProvisionedIOPS, 5000), 50000)` |
| Burst IOPS credits | `(BurstLimit - ProvisionedIOPS) * 3600` |

The following table illustrates a few examples of these formulas for various provisioned IOPS amounts:

| Provisioned IOPS | HDD burst IOPS limit | HDD burst credits |
|-|-|-|
| 500 | Up to 5,000 | 16,200,000 |
| 1,000 | Up to 5,000 | 14,400,000 |
| 3,000 | Up to 9,000 | 21,600,000 |
| 5,000 | Up to 15,000 | 36,000,000 |
| 10,000 | Up to 30,000 | 72,000,000 |
| 25,000 | Up to 50,000 | 90,000,000 |
| 50,000 | Up to 50,000 | 0 |

### Provisioned v2 snapshots
Azure Files supports snapshots, which are similar to volume shadow copies (VSS) on Windows File Server. For more information on share snapshots, see [Overview of snapshots for Azure Files](storage-snapshots-files.md).

Snapshots are always differential from the live share and from each other. In the provisioned v2 billing model, if the total differential size of all snapshots fits within the excess provisioned storage space of the file share, there is no extra cost for snapshot storage. If the size of the live share data plus the differential snapshot data is greater than the provisioned storage of the share, the excess used capacity of the snapshots is billed against the **Overflow Snapshot Usage** meter. The formula for determining the amount of overflow is: `MAX((LiveShareUsedGiB + SnapshotDifferentialUsedGiB) - ProvisionedStorageGiB, 0)`

Some value-added services for Azure Files use snapshots as part of their value proposition. See [value-added services for Azure Files](#value-added-services) for more information.

### Provisioned v2 soft delete
Deleted file shares in storage accounts with soft-delete enabled are billed based on the used storage capacity of the deleted share for the duration of the soft delete period. To ensure that a deleted file share can always be restored, the provisioned storage, IOPS, and throughput of the share count against the storage account's limits until the file share is purged, however are not billed. For more information on soft delete, see [How to enable soft delete on Azure file shares](storage-files-enable-soft-delete.md).

### Provisioned v2 billing meters
File shares provisioned using the provisioned v2 billing model are billed against the following five billing meters:

- **Provisioned Storage**: The amount of storage provisioned in GiB.
- **Provisioned IOPS**: The amount of IOPS (IO / sec) provisioned.
- **Provisioned Throughput MiBPS**: The amount of throughput provisioned in MiB / sec.
- **Overflow Snapshot Usage**: Any amount of differential snapshot usage in GiB that does not fit within the provisioned storage capacity. See [provisioned v2 snapshots](#provisioned-v2-snapshots) for more information.
- **Soft-Deleted Usage**: Used storage capacity in GiB for soft-deleted file shares. See [provisioned v2 soft-delete](#provisioned-v2-soft-delete) for more information.

Consumption against the provisioned v2 billing meters are emitted hourly in terms of hourly units. For example, for a share with 1024 GiB provisioned, you should see:

- 1,024 units against the **Provisioned Storage** meter for an individual hour.
- 24,576 units against the **Provisioned Storage** meter if aggregated for a day.
- A variable number of units if aggregated for a month depending on the number of days in the month:
    - 28 day month (normal February): 688,128 units against the **Provisioned Storage** meter.
    - 29 day month (leap year February): 712,704 units against the **Provisioned Storage** meter.
    - 30 day month: 737,280 units against the **Provisioned Storage** meter.
    - 31 day month: 761,856 units against the **Provisioned Storage** meter.

### Provisioned v2 migrations
The process for migrating your SMB Azure file shares from a pay-as-you-go model to the provisioned v2 billing model differs depending on whether or not you're using Azure File Sync. 

- If you're using Azure Files without Azure File Sync, see [Migrate files from one SMB Azure file share to another](migrate-files-between-shares.md).
- If you're using Azure File Sync, see [Migrate files from one Azure file share to another when using Azure File Sync](../file-sync/file-sync-share-to-share-migration.md).

## Provisioned v1 model
The provisioned v1 method provides storage, IOPS, and throughput in a fixed ratio to each other, similar to how storage is purchased in an on-premises storage solution. When you create a new provisioned v1 file share, you specify how much storage your share needs, and IOPS and throughput are computed values. The provisioned v1 model for Azure Files is only available for SSD file shares. 

The amount of storage you provision determines the guaranteed storage, IOPS, and throughput limits of your file share's usage. For example, if you provision a 2 TiB share and upload 2 TiB of data to your share, your share will be full and you will not be able to add more data unless you increase the size of your share, or delete some of the data. Credit-based IOPS bursting provides added flexibility around usage, on a best-effort basis, while credits remain.

Unlike purchasing storage on-premises, provisioned v1 file shares can be dynamically scaled up or down as your needs change, however, you can only decrease the provisioned storage only after 24 hours have elapsed since your last storage increase. Storage, IOPS, and throughput changes are effective within a few minutes after a provisioning change.

It's possible to decrease the size of your provisioned share below your used GiB. If you do, you won't lose data, but you'll still be billed for the size used and receive the performance of the provisioned share, not the size used.

### Provisioned v1 availability
The provisioned v1 model is provided for SSD file shares in storage accounts with the *FileStorage* storage account kind:

| Storage account kind | Storage account SKU | Type of file share available |
|-|-|-|
| FileStorage | Premium_LRS | SSD provisioned v1 file share with the Local (LRS) redundancy specified. |
| FileStorage | Premium_ZRS | SSD provisioned v1 file share with the Zone (ZRS) redundancy specified. |

SSD file shares using the provisioned v1 model are generally available in most Azure regions. See [Azure products by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region) for more information.

### Provisioned v1 provisioning detail
When you create a provisioned v1 file share, you specify how much storage your share needs. Each GiB that you provision entitles you to more IOPS and throughput in a fixed ratio. File shares are limited based on the following attributes: 

| Item | Value |
|-|-|
| Storage provisioning unit | 1 GiB |
| Minimum provisioned storage per file share | 100 GiB |
| Maximum provisioned storage per file share | 100 TiB (102,400 GiB) |
| Maximum provisioned storage per storage account | 100 TiB (102,400 GiB) |

The amount of IOPS and throughput provisioned on the share are determined by the following formulas:

| Item | Formula |
|-|-|
| Computed provisioned (baseline) IOPS | `MIN(3000 + 1 * ProvisionedStorageGiB, 102400)` |
| Computed provisioned throughput (MiB / sec) | `100 + CEILING(0.04 * ProvisionedStorageGiB) + CEILING(0.06 * ProvisionedStorageGiB)` |

Depending on your individual file share requirement, you may find that you require more IOPS or throughput than our provisioning formulas provide. In this case, you will need to provision more storage to get the required IOPS or throughput.

### Provisioned v1 bursting
Credit-based IOPS bursting provides added flexibility around IOPS usage. This flexibility is best used as a buffer against unanticipated IO-spikes. For established IO patterns, we recommend provisioning for IO peaks.

Burst IOPS credits accumulate whenever traffic for your file share is below provisioned (baseline) IOPS. Whenever a file share's IOPS usage exceeds the provisioned IOPS and there are available burst IOPS credits, the file share can burst up to the maximum allowed burst IOPS limit. File shares can continue to burst as long as there are credits remaining, but this is based on the number of burst credits accrued. Each IO beyond provisioned IOPS consumes one credit. Once all credits are consumed, the share returns to the provisioned IOPS. IOPS against the file share don't have to do anything special to use bursting. Bursting operates on a best effort basis.  

Share credits have three states:

- Accruing, when the file share is using less than the provisioned IOPS.
- Declining, when the file share is using more than the provisioned IOPS and in the bursting mode.
- Constant, when the files share is using exactly the provisioned IOPS and there are either no credits accrued or used.

A new file share starts with the full number of credits in its burst bucket. Burst credits don't accrue if the share IOPS fall below the provisioned limit due to throttling by the server. The following formulas are used to determine the burst IOPS limit and the number of credits possible for a file share:

| Item | Formula |
|-|-|
| Burst limit | `MIN(MAX(3 * ProvisionedStorageGiB, 10000), 102400)` |
| Burst credits | `(BurstLimit - BaselineIOPS) * 3600` |

The following table illustrates a few examples of these formulas for the provisioned share sizes:

| Capacity (GiB) | Baseline IOPS | Burst IOPS | Burst credits | Throughput (ingress + egress) (MiB/sec) |
|-|-|-|-|-|
| 100 | 3,100 | Up to 10,000 | 24,840,000 | 110 |
| 500 | 3,500 | Up to 10,000 | 23,400,000 | 150 |
| 1,024 | 4,024 | Up to 10,000 | 21,513,600 | 203 |
| 5,120 | 8,120 | Up to 15,360 | 26,064,000 | 613 |
| 10,240 | 13,240 | Up to 30,720 | 62,928,000 | 1,125 |
| 33,792 | 36,792 | Up to 102,400 | 227,548,800 | 3,480 |
| 51,200 | 54,200 | Up to 102,400 | 164,880,000 | 5,220 |
| 102,400 | 102,400 | Up to 102,400 | 0 | 10,340 |

Effective file share performance is subject to machine network limits, available network bandwidth, IO sizes, and parallelism, among many other factors. To achieve maximum benefit from parallelization, we recommend enabling [SMB Multichannel](files-smb-protocol.md#smb-multichannel) on SSD file shares. Refer to [SMB performance](smb-performance.md) and [performance troubleshooting guide](/troubleshoot/azure/azure-storage/files-troubleshoot-performance?toc=/azure/storage/files/toc.json) for some common performance issues and workarounds.

### Provisioned v1 snapshots
Azure Files supports snapshots, which are similar to volume shadow copies (VSS) on Windows File Server. For more information on share snapshots, see [Overview of snapshots for Azure Files](storage-snapshots-files.md).

Snapshots are always differential from the live share and from each other. In the provisioned v1 billing model, the total differential size is billed against a usage meter, regardless of how much provisioned storage is unused. The used snapshot storage meter has a reduced price over the provisioned storage price.

### Provisioned v1 soft delete
Deleted file shares in storage accounts with soft-delete enabled are billed based on the used storage capacity of the deleted share for the duration of the soft delete period. The soft-deleted usage storage capacity is emitted against the used snapshot storage meter. For more information on soft delete, see [How to enable soft delete on Azure file shares](storage-files-enable-soft-delete.md).

### Provisioned v1 billing meters
File shares provisioned using the provisioned v1 billing model are billed against the following two meters:

- **Premium Provisioned**: The amount of storage provisioned in GiB.
- **Premium Snapshots**: The amount of used snapshots and used soft-deleted capacity.

Consumption against the provisioned v1 billing meters are emitted hourly in terms of monthly units. For example, for a share with 1024 GiB provisioned, you should see:

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
- 1024 units against the **Premium Provisioned** meter if aggregated for a month.

## Pay-as-you-go model
In the pay-as-you-go model, the amount you pay is determined by how much you use, rather than based on a provisioned amount. At a high level, you pay a cost for the amount of logical data stored, and you're also charged for transactions based on your usage of that data. Pay-as-you-go billing model can be difficult to plan for as part of a budgeting process, because the model is driven by end-user consumption. We therefore recommend using the [provisioned v2 model](#provisioned-v2-model) for new file share deployments. The pay-as-you-go model is only available for HDD file shares.

### Pay-as-you-go availability
The pay-as-you-go model is provided for HDD file shares in storage accounts with the *StorageV2* or *Storage* storage account kind:

| Storage account kind | Storage account SKU | Type of file share available |
|-|-|-|
| StorageV2 or Storage | Standard_LRS | HDD pay-as-you-go file share with the Local (LRS) redundancy specified. |
| StorageV2 or Storage | Standard_ZRS | HDD pay-as-you-go file share with the Zone (ZRS) redundancy specified. |
| StorageV2 or Storage | Standard_GRS | HDD pay-as-you-go file share with the Geo (GRS) redundancy specified. |
| StorageV2 or Storage | Standard_GZRS | HDD pay-as-you-go file share with the GeoZone (GZRS) redundancy specified. |

HDD file shares using the pay-as-you-go model are generally available in all Azure regions.

### Differences in access tiers
When you create a HDD file share, you pick between the following access tiers: transaction optimized, hot, and cool. All three access tiers are stored on the exact same storage hardware. The main difference for these three access tiers is their data at-rest storage prices, which are lower in cooler tiers, and the transaction prices, which are higher in the cooler tiers. This means:

- Transaction optimized, as the name implies, optimizes the price for high IOPS (transaction) workloads. Transaction optimized has the highest data at-rest storage price, but the lowest transaction prices.
- Hot is for active workloads that don't involve a large number of transactions. It has a slightly lower data at-rest storage price, but slightly higher transaction prices as compared to transaction optimized. Think of it as the middle ground between the transaction optimized and cool tiers.
- Cool optimizes the price for workloads that don't have high activity, offering the lowest data at-rest storage price, but the highest transaction prices.

If you put an infrequently accessed workload in the transaction optimized access tier, you'll pay almost nothing for the few times in a month that you make transactions against your share. However, you'll pay a high amount for the data storage costs. If you moved this same share to the cool access tier, you'd still pay almost nothing for the transaction costs, simply because you're infrequently making transactions for this workload. However, the cool access tier has a much cheaper data storage price. Selecting the appropriate access tier for your use case allows you to considerably reduce your costs.

Similarly, if you put a highly accessed workload in the cool access tier, you'll pay a lot more in transaction costs, but less for data storage costs. This can lead to a situation where the increased costs from the transaction prices increase outweigh the savings from the decreased data storage price, leading you to pay more money on cool than you would have on transaction optimized. For some usage levels, it's possible that the hot access tier will be the most cost efficient, and the cool access tier will be more expensive than transaction optimized.

Your workload and activity level will determine the most cost efficient access tier for your pay-as-you-go file share. In practice, the best way to pick the most cost efficient access tier involves looking at the actual resource consumption of the share (data stored, write transactions, etc.). For pay-as-you-go file shares, we recommend starting in the transaction optimized tier during the initial migration into Azure Files, and then picking the correct access tier based on usage after the migration is complete. Transaction usage during migration is not typically indicative of normal transaction usage.

### What are transactions?
When you mount an Azure file share on a computer using SMB, the Azure file share is exposed on your computer as if it were local storage. This means that applications, scripts, and other programs on your computer can access the files and folders on the Azure file share without needing to know that they're stored in Azure.

When you read or write to a file, the application you're using performs a series of API calls to the file system API provided by your operating system. Your operating system then interprets these calls into SMB protocol transactions, which are sent over the wire to Azure Files to fulfill. A task that the end user perceives as a single operation, such as reading a file from start to finish, might be translated into multiple SMB transactions served by Azure Files.

As a principle, the pay-as-you-go billing model used by standard file shares bills based on usage. SMB and FileREST transactions made by applications and scripts represent usage of your file share and show up as part of your bill. The same concept applies to value-added cloud services that you might add to your share, such as Azure File Sync or Azure Backup. Transactions are grouped into five different transaction categories which have different prices based on their impact on the Azure file share. These categories are: write, list, read, other, and delete.

The following table shows the categorization of each transaction:

| Transaction bucket | Management operations | Data operations |
|-|-|-|
| Write transactions | <ul><li>`CreateShare`</li><li>`SetFileServiceProperties`</li><li>`SetShareMetadata`</li><li>`SetShareProperties`</li><li>`SetShareAcl`</li><li>`SnapshotShare`</li><li>`RestoreShare`</li></ul> | <ul><li>`CopyFile`</li><li>`Create`</li><li>`CreateDirectory`</li><li>`CreateFile`</li><li>`PutRange`</li><li>`PutRangeFromURL`</li><li>`SetDirectoryMetadata`</li><li>`SetFileMetadata`</li><li>`SetFileProperties`</li><li>`SetInfo`</li><li>`Write`</li><li>`PutFilePermission`</li><li>`Flush`</li><li>`SetDirectoryProperties`</li></ul> |
| List transactions | <ul><li>`ListShares`</li></ul> | <ul><li>`ListFileRanges`</li><li>`ListFiles`</li><li>`ListHandles`</li></ul> |
| Read transactions | <ul><li>`GetFileServiceProperties`</li><li>`GetShareAcl`</li><li>`GetShareMetadata`</li><li>`GetShareProperties`</li><li>`GetShareStats`</li></ul> | <ul><li>`FilePreflightRequest`</li><li>`GetDirectoryMetadata`</li><li>`GetDirectoryProperties`</li><li>`GetFile`</li><li>`GetFileCopyInformation`</li><li>`GetFileMetadata`</li><li>`GetFileProperties`</li><li>`QueryDirectory`</li><li>`QueryInfo`</li><li>`Read`</li><li>`GetFilePermission`</li></ul> |
| Other/protocol transactions | <ul><li>`AcquireShareLease`</li><li>`BreakShareLease`</li><li>`ReleaseShareLease`</li><li>`RenewShareLease`</li><li>`ChangeShareLease`</li></ul> | <ul><li>`AbortCopyFile`</li><li>`Cancel`</li><li>`ChangeNotify`</li><li>`Close`</li><li>`Echo`</li><li>`Ioctl`</li><li>`Lock`</li><li>`Logoff`</li><li>`Negotiate`</li><li>`OplockBreak`</li><li>`SessionSetup`</li><li>`TreeConnect`</li><li>`TreeDisconnect`</li><li>`CloseHandles`</li><li>`AcquireFileLease`</li><li>`BreakFileLease`</li><li>`ChangeFileLease`</li><li>`ReleaseFileLease`</li></ul> |
| Delete transactions | <ul><li>`DeleteShare`</li></ul> | <ul><li>`ClearRange`</li><li>`DeleteDirectory`</li><li>`DeleteFile`</li></ul> |  

> [!NOTE]
> NFS 4.1 is only available for SSD file shares, which use a provisioned billing model. Transactions buckets don't affect billing for provisioned file shares.

### Switching between access tiers
Although you can change a pay-as-you-go file share between the three access tiers, the best practice to optimize costs after the initial migration is to pick the most cost optimal access tier to be in, and stay there unless your access pattern changes. This is because changing the access tier of a standard file share results in additional costs as follows:

- Transactions: When you move a share from a hotter access tier to a cooler access tier, you'll incur the cooler access tier's write transaction charge for each file in the share. Moving a file share from a cooler access tier to a hotter access tier will incur the cooler access tier's read transaction charge for each file in the share.

- Data retrieval: If you're moving from the cool access tier to hot or transaction optimized, you'll incur a data retrieval charge based on the size of data moved. Only the cool access tier has a data retrieval charge.

The following table illustrates the cost breakdown of moving access tiers:

| Access tier | Transaction optimized (destination) | Hot (destination) | Cool (destination) |
|-|-|-|-|
| **Transaction optimized (source)** | -- | <ul><li>1 hot write transaction per file.</li></ul> | <ul><li>1 cool write transaction per file.</li></ul> |
| **Hot (source)** | <ul><li>1 hot read transaction per file.</li><ul> | -- | <ul><li>1 cool write transaction per file.</li></ul> |
| **Cool (source)** | <ul><li>1 cool read transaction per file.</li><li>Data retrieval per total used GiB.</li></ul> | <ul><li>1 cool read transaction per file.</li><li>Data retrieval per total used GiB.</li></ul> | -- |

You can change a file share's access tier up to 5 times within a 30 day window. The first day of the 30 day window begins when the first tier change happens. Changes between access tiers happen instantly, however, once you've changed the access tier of a share, you can't change it again within 24 hours, even if you've changed the access tier property fewer than 5 times within the last 30 days.

### Choosing an access tier
Regardless of how you migrate existing data into Azure Files, we recommend initially creating the file share in transaction optimized access tier due to the large number of transactions incurred during migration. After your migration is complete and you've operated for a few days or weeks with regular usage, you can plug your transaction counts into the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to figure out which access tier is best suited for your workload.

Because pay-as-you-go file shares only show transaction information at the storage account level, using the storage metrics to estimate which access tier is cheaper at the file share level is an imperfect science. If possible, we recommend deploying only one file share in each storage account to ensure full visibility into billing.

To see previous transactions:

1. Navigate to your storage account in the Azure portal.
1. In the service menu, under **Monitoring**, select **Metrics**.
1. Select **Scope** as your storage account name, **Metric Namespace** as "File", **Metric** as "Transactions", and **Aggregation** as "Sum".
1. Select **Apply Splitting**.
1. Select **Values** as "API Name". Select your desired **Limit** and **Sort**.
1. Select your desired time period.

> [!NOTE]
> Make sure you view transactions over a period of time to get a better idea of average number of transactions. Ensure that the chosen time period doesn't overlap with initial provisioning. Multiply the average number of transactions during this time period to get the estimated transactions for an entire month.

### Pay-as-you-go snapshots
Azure Files supports snapshots, which are similar to volume shadow copies (VSS) on Windows File Server. For more information on share snapshots, see [Overview of snapshots for Azure Files](storage-snapshots-files.md).

Snapshots are always differential from the live share and from each other. In the pay-as-you-go billing model, the total differential size is billed against the normal used storage meter. This means that you won't see a separate line item on your bill representing snapshots for your pay-as-you-go storage account. This also means that differential snapshot usage counts against reservations that are purchased for pay-as-you-go file shares.

### Pay-as-you-go soft-delete
Deleted file shares in storage accounts with soft-delete enabled are billed based on the used storage capacity of the deleted file share for the duration of the soft-delete period. The soft-deleted used storage capacity is emitted against the normal used storage meter. This means that you won't see a separate line item on your bill representing soft-deleted file shares for your pay-as-you-go storage account. This also means that soft-deleted file share usage counts against reservations that are purchased for pay-as-you-go file shares.

### Pay-as-you-go billing meters
File shares created using the pay-as-you-go billing model are billed against the following meters:

- **Data Stored**: The used storage including the live shares, differential snapshots, and soft-deleted file shares in GiB.
- **Metadata**: The size of the file system metadata associated with files and directories such as access control lists (ACLs) and other properties in GiB. This billing meter is only used for file shares in the hot or cool access tiers.
- **Write Operations**: The number of write transaction buckets (1 bucket = 10,000 transactions).
- **List Operations**: The number of list transaction buckets (1 bucket = 10,000 transactions).
- **Read Operations**: The number of read transaction buckets (1 bucket = 10,000 transactions).
- **Other Operations** / **Protocol Operations**: The number of other transaction buckets (1 bucket = 10,000 transactions).
- **Data Retrieval**: The amount of data read from the file share in GiB. This meter is only used for file shares in the cool access tier.
- **Geo-Replication Data Transfer**: If the file share has the Geo or GeoZone redundancy, the amount of data written to the file share replicated to the secondary region in GiB.

Consumption against the **Data Stored** and **Metadata** billing meters are emitted hourly in terms of monthly units. For example, for a share with 1024 used GiB, you should see:

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
- 1024 units against the **Data Stored** meter if aggregated for a month.

Consumption against the other meters (ex. **Write Operations** or **Data Retrieval**) are emitted hourly, but since they aren't emitted in terms of a timeframe, don't have any special unit transformations to be aware of.

## Provisioned/quota, logical size, and physical size
Azure Files tracks three distinct quantities with respect to share capacity:

- **Provisioned size or quota**: With both provisioned and pay-as-you-go file shares, you specify the maximum size that the file share is allowed to grow to. In provisioned file shares, this value is called the provisioned size. Whatever amount you provision is what you pay for, regardless of how much you actually use. In pay-as-you-go file shares, this value is called quota and doesn't directly affect your bill. Provisioned size is a required field for provisioned file shares. For pay-as-you-go file shares, if provisioned size isn't directly specified, the share will default to the maximum value supported by the storage account (100 TiB).

- **Logical size**: The logical size of a file share or file relates to how big it is without considering how it's actually stored, where storage optimizations might be applied. The logical size of the file is how many KiB/MiB/GiB would be transferred over the wire if you copied it to a different location. In both provisioned and pay-as-you-go file shares, the total logical size of the file share is used for enforcement against provisioned size/quota. In pay-as-you-go file shares, the logical size is the quantity used for the data at-rest usage billing. Logical size is referred to as "size" in the Windows properties dialog for a file/folder and as "content length" by Azure Files metrics.

- **Physical size**: The physical size of the file relates to the size of the file as encoded on disk. This might align with the file's logical size, or it might be smaller, depending on how the file has been written to by the operating system. A common reason for the logical size and physical size to be different is by using [sparse files](/windows/win32/fileio/sparse-files). The physical size of the files in the share is used for snapshot billing, although allocated ranges are shared between snapshots if they are unchanged (differential storage).

## Value-added services
Like many on-premises storage solutions, Azure Files provides integration points for first- and third-party products to integrate with customer-owned file shares. Although these solutions can provide considerable extra value to Azure Files, you should consider the extra costs that these services add to the total cost of an Azure Files solution.

Costs break down into three buckets:

- **Licensing costs for the value-added service.** These might come in the form of a fixed cost per customer, end user (sometimes called a "head cost"), Azure file share or storage account. They might also be based on units of storage utilization, such as a fixed cost for every 500 GiB chunk of data in the file share.

- **Transaction costs for the value-added service.** Some value-added services have their own concept of transactions on top of the Azure Files billing model selected. These transactions will show up on your bill under the value-added service's charges; however, they relate directly to how you use the value-added service with your file share.

- **Azure Files costs for using a value-added service.** Azure Files doesn't directly charge customers for adding value-added services, but as part of adding value to the Azure file share, the value-added service might increase the costs that you see on your Azure file share. This is easy to see with pay-as-you-go file shares, because of transaction charges. If the value-added service does transactions against the file share on your behalf, they will show up in your Azure Files transaction bill even though you didn't directly do those transactions yourself. This applies to provisioned file shares as well, although it might be less noticeable. Transactions against provisioned file shares from value-added services count against your provisioned IOPS numbers, meaning that value-added services might require provisioning more storage to have enough IOPS or throughput available for your workload.

When computing the total cost of ownership for your file share, you should consider the costs of Azure Files and of all value-added services that you would like to use with Azure Files.

There are multiple value-added first- and third-party services. This document covers a subset of the common first-party services customers use with Azure file shares. You can learn more about services not listed here by reading the pricing page for that service.

### Azure File Sync
Azure File Sync is a value-added service for Azure Files that synchronizes one or more on-premises Windows file shares with an Azure file share. Because the cloud Azure file share has a complete copy of the data in a synchronized file share that is available on-premises, you can transform your on-premises Windows File Server into a cache of the Azure file share to reduce your on-premises footprint. Learn more by reading [Introduction to Azure File Sync](../file-sync/file-sync-introduction.md).

When considering the total cost of ownership for a solution deployed using Azure File Sync, you should consider the following cost aspects:

[!INCLUDE [storage-file-sync-cost-categories](../../../includes/storage-file-sync-cost-categories.md)]

### Azure Backup
Azure Backup provides a serverless backup solution for Azure Files that seamlessly integrates with your file shares, and with other value-added services such as Azure File Sync. Azure Backup for Azure Files is a snapshot-based backup solution that provides a scheduling mechanism for automatically taking snapshots on an administrator-defined schedule. It also provides a user-friendly interface for restoring deleted files/folders or the entire share to a particular point in time. To learn more, see [About Azure file share backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json).

When considering the costs of using Azure Backup, consider the following:

- **Protected instance licensing cost for Azure file share data.** Azure Backup charges a protected instance licensing cost per storage account containing backed up Azure file shares. A protected instance is defined as 250 GiB of Azure file share storage. Storage accounts containing less than 250 GiB are subject to a fractional protected instance cost. For more information, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). You must select *Azure Files* from the list of services Azure Backup can protect.

- **Azure Files costs.** Azure Backup increases the costs of Azure Files in the following ways:
    - **Differential costs from Azure file share snapshots.** Azure Backup automates taking Azure file share snapshots on an administrator-defined schedule. Snapshots are always differential; however, the added cost added depends on the length of time snapshots are kept and the amount of churn on the file share during that time. This dictates how different the snapshot is from the live file share and therefore how much extra data is stored by Azure Files.

    - **Transaction costs from restore operations.** Restore operations from the snapshot to the live share will cause transactions. For standard file shares, this means that reads from snapshots/writes from restores are billed as normal file share transactions. For provisioned file shares, these operations are counted against the provisioned IOPS for the file share.

### Microsoft Defender for Storage
Microsoft Defender supports Azure Files as part of its Microsoft Defender for Storage product. Microsoft Defender for Storage detects unusual and potentially harmful attempts to access or exploit your Azure file shares over SMB or FileREST. Microsoft Defender for Storage is enabled on the subscription level for all file shares in storage accounts in that subscription.

Microsoft Defender for Storage doesn't support antivirus capabilities for Azure file shares.

The main cost from Microsoft Defender for Storage is an extra set of transaction costs that the product levies on top of the transactions that are done against the Azure file share. Although these costs are based on the transactions incurred in Azure Files, they aren't part of the billing for Azure Files, but rather are part of the Microsoft Defender pricing. Microsoft Defender for Storage charges a transaction rate even on provisioned file shares, where Azure Files includes transactions as part of IOPS provisioning. The current transaction rate can be found on [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) under the *Microsoft Defender for Storage* table row.

Transaction heavy file shares will incur significant costs using Microsoft Defender for Storage. Based on these costs, you might want to opt-out of Microsoft Defender for Storage for specific storage accounts. For more information, see [Exclude a storage account from Microsoft Defender for Storage protections](/azure/defender-for-cloud/defender-for-storage-exclude).

## Reservations
Azure Files supports reservations (also referred to as *reserved instances*) for the provisioned v1 and pay-as-you-go models. Reservations enable you to achieve a discount on storage by pre-committing to storage utilization. You should consider purchasing reserved instances for any production workload, or dev/test workloads with consistent footprints. When you purchase a Reservation, you must specify the following dimensions:

- **Capacity size**: Reservations can be for either 10 TiB or 100 TiB, with more significant discounts for purchasing a higher capacity Reservation. You can purchase multiple Reservations, including Reservations of different capacity sizes to meet your workload requirements. For example, if your production deployment has 120 TiB of file shares, you could purchase one 100 TiB Reservation and two 10 TiB Reservations to meet the total storage capacity requirements.
- **Term**: You can purchase reservations for either a one-year or three-year term, with more significant discounts for purchasing a longer Reservation term.
- **Tier**: The tier of Azure Files for the Reservation. Reservations currently are available for the premium (SSD), hot (HDD), and cool (HDD) tiers.
- **Location**: The Azure region for the Reservation. Reservations are available in a subset of Azure regions.
- **Redundancy**: The storage redundancy for the Reservation. Reservations are supported for all redundancies Azure Files supports, including LRS, ZRS, GRS, and GZRS.
- **Billing frequency**: Indicates how often the account is billed for the Reservation. Options include *Monthly* or *Upfront*.

Once you purchase a Reservation, it will automatically be consumed by your existing storage utilization. If you use more storage than you have reserved, you'll pay list price for the balance not covered by the Reservation. Transaction, bandwidth, data transfer, and metadata storage charges aren't included in the Reservation.

There are differences in how Reservations work with Azure file share snapshots for pay-as-you-go and provisioned v1 file shares. If you're taking snapshots of pay-as-you-go file shares, then the snapshot differentials count against the Reservation and are billed as part of the normal used storage meter. However, if you're taking snapshots of provisioned v1 file shares, then the snapshots are billed using a separate meter and don't count against the Reservation.

For more information on how to purchase Reservations, see [Optimize costs for Azure Files with Reservations](files-reserve-capacity.md).

## See also
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).
- [Planning for an Azure Files deployment](storage-files-planning.md) and [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md).
- [Create a file share](storage-how-to-create-file-share.md) and [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md).
