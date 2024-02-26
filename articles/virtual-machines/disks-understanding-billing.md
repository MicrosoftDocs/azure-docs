---
title: Understand Azure Disk Storage billing
description: Learn about the available Azure disk types for virtual machines, including ultra disks, Premium SSDs v2, Premium SSDs, standard SSDs, and Standard HDDs.
author: roygara
ms.author: rogarana
ms.date: 01/30/2024
ms.topic: conceptual
ms.service: azure-disk-storage
---

# Understand Azure Disk Storage billing

This article helps you understand how Azure managed disks are billed, including what factors that affect Disk Storage billing, and how billing is laid out in your Azure Disk Storage bill. Some disks have unique factors that affect their billing but most disk types have the same set of factors that affect their billing, but depending on the type of disk are affected differently by these factors. and differences between each disk type's pricing model, and how this looks on your Azure Disks bill. We’ll also provide pricing examples for some common scenarios and show how Azure disk types compare.

For detailed Azure Disk Storage pricing information, see [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

Azure Disk Storage has five managed disk options: Ultra Disks, Premium solid-state drives (SSD) V2, Premium SSD, Standard SSD, and Standard hard-disk drives (HDDs). Most disk types have different factors that change their billing. Ultra Disks and Premium SSD v2 are priced based on the provisioned performance and capacity that you select. Premium SSD, Standard SSD, and Standard HDDs are priced based on the tier they're deployed as. All disk types are billed at an hourly rate. Other factors may impact billing as well, such as transactions or bursting.

## Ultra Disks

The price of an Azure Ultra Disk is determined by the combination of how large the disk is (its size) and what performance you select (IOPS and throughput) for your disk.

### Ultra Disk size

The size of your Ultra Disk also determines what performance caps your disk has. You have granular control of how much IOPS and throughput your disk has, up to that size's performance cap. Pricing increases as you increase in size, as well as when you set higher IOPS and throughput. Ultra Disks offer up to 32-TiB per region per subscription by default, but support higher capacity by request. To request an increase in capacity, request a quota increase or contact Azure Support. 

The following table outlines the available disk sizes and performance caps. Pricing increases as you increase in size.

|Disk Size (GiB)  |IOPS Cap  |Throughput Cap (MB/s)  |
|---------|---------|---------|
|4     |1,200         |300         |
|8     |2,400         |600         |
|16     |4,800         |1,200         |
|32     |9,600         |2,400         |
|64     |19,200         |4,000         |
|128     |38,400         |4,000         |
|256     |76,800         |4,000         |
|512     |153,600         |4,000         |
|1,024-65,536 (sizes in this range increasing in increments of 1 TiB)     |160,000         |4,000         |

### Ultra Disk IOPS

Pricing of an Azure Ultra Disk increases as you provision more IOPS to your disk. The minimum guaranteed IOPS per disk is 1 IOPS/GiB, with an overall baseline minimum of 100 IOPS. For example, if you provision a 4-GiB Ultra Disk, the minimum IOPS for that disk is 100, instead of four.

### Ultra Disk throughput

Pricing of an Ultra Disk increases as you increase the disk's throughput limit. The throughput limit of a single Ultra Disk is 256-kB/s for each provisioned IOPS, up to a maximum of 4000 MB/s per disk (where MB/s - 10^6 Bytes per second). The minimum guaranteed throughput per disk is 4kB/s for each provisioned IOPS, with an overall baseline minimum of 1 MB/s.

## Premium SSD v2

### Differences between Premium SSD and Premium SSD v2

Unlike Premium SSDs, Premium SSD v2 doesn't have dedicated sizes. You can set a Premium SSD v2 to any supported size you prefer, and make granular adjustments to the performance without downtime. Premium SSD v2 doesn't support host caching but, benefits significantly from lower latency, which addresses some of the same core problems host caching addresses. The ability to adjust IOPS, throughput, and size at any time also means you can avoid the maintenance overhead of having to stripe disks to meet your needs.

### Premium SSD v2 limitations

[!INCLUDE [disks-prem-v2-limitations](../../includes/disks-prem-v2-limitations.md)]

#### Regional availability

[!INCLUDE [disks-premv2-regions](../../includes/disks-premv2-regions.md)]

### Premium SSD v2 performance

Premium SSD v2 disks are designed to provide sub millisecond latencies and provisioned IOPS and throughput 99.9% of the time. With Premium SSD v2 disks, you can individually set the capacity, throughput, and IOPS of a disk based on your workload needs, providing you with more flexibility and reduced costs. Each of these values determines the cost of your disk. 

#### Premium SSD v2 capacities

Premium SSD v2 capacities range from 1 GiB to 64 TiBs, in 1-GiB increments. You're billed on a per GiB ratio, see the [pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for details.

Premium SSD v2 offers up to 100 TiBs per region per subscription by default, but supports higher capacity by request. To request an increase in capacity, request a quota increase or contact Azure Support.

#### Premium SSD v2 IOPS

All Premium SSD v2 disks have a baseline IOPS of 3000 that is free of charge. After 6 GiB, the maximum IOPS a disk can have increases at a rate of 500 per GiB, up to 80,000 IOPS. So an 8 GiB disk can have up to 4,000 IOPS, and a 10 GiB can have up to 5,000 IOPS. To be able to set 80,000 IOPS on a disk, that disk must have at least 160 GiBs. Increasing your IOPS beyond 3000 increases the price of your disk.

#### Premium SSD v2 throughput

All Premium SSD v2 disks have a baseline throughput of 125 MB/s that is free of charge. After 6 GiB, the maximum throughput that can be set increases by 0.25 MB/s per set IOPS. If a disk has 3,000 IOPS, the max throughput it can set is 750 MB/s. To raise the throughput for this disk beyond 750 MB/s, its IOPS must be increased. For example, if you increased the IOPS to 4,000, then the max throughput that can be set is 1,000. 1,200 MB/s is the maximum throughput supported for disks that have 5,000 IOPS or more. Increasing your throughput beyond 125 increases the price of your disk.

## Premium SSD

## Standard SSD

## Standard HDD

## Factors that affect Azure Disk Storage billing

To understand Azure Disk Storage pricing, be aware of how the following criteria affects costs:

### Disk type

Premium SSD, Standard SSD, and Standard HDD are priced based on the tier they're deployed as, the tier is determined when you select a size. For example, a 58 GiB Premium SSD is billed as a P6 disk, and a 400 GiB Premium SSD is billed as a P20 disk.

Ultra Disks are and Premium SSD v2 are priced based on the combination of provisioned performance and size that you select. Ultra Disks have set sizes that you select, whereas you can input the exact size you want for Premium SSD v2

- Disk type: Each disk type has separate pricing models: Ultra Disk Storage, Premium SSD V2, Premium SSD, Standard SSD, Standard HDD.
- Disk size: Standard HDD, Standard SSD, and Premium SSD are charged on the total provisioned size, not actual usage. Each disk maps to a supported provisioned disk-size offering and is billed accordingly. Ultra Disks and Premium SSD v2 are charged on the actual size.
- Data transactions: You're billed for the number of transactions performed on a standard managed disk. (For certain disk sizes and configurations, a fee is charged per 10,000 transactions.)
- Data redundancy: Prices can change depending on the redundancy option selected: LRS, ZRS.
- Snapshots: Snapshots are a separate resource from your disks, and they're billed based on the size used and the type of storage used. So if you create a snapshot of a managed disk, you will be billed for the used size not the provisioned size of the disk.
- (Ultra Disks and Premium SSD v2 only) customizable IOPS and throughput: You're billed for the IOPS and throughput you assign to your disk.

This table displays our current disk types and the available billable features:

| Disk Category | Data Transactions | Snapshots | Bursting | Customizable IOPS and Throughput | zone-redundant storage option |
|-|-|-|-|-|-|
|Premium SSD | ⛔ | ✔️ | ✔️ |⛔| ✔️ |
|Standard SSD|✔️| ✔️ | ✔️ |⛔| ✔️ |
|Standard HHD|✔️| ✔️ |⛔|⛔|⛔|
|Premium SSD v2|⛔| ✔️ |⛔| ✔️ |⛔|
|Ultra Disk|⛔| ✔️ |⛔| ✔️|⛔|


## Understand your Azure Disk Storage Bill  

### Provisioning examples 
Disk pricing can include different combinations of features as well as provisioned and used size. Let's take a look at some examples for different disk types, feature definitions, and redundancy for each disk type:
For detailed Azure Disks pricing information, see [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

### Standard Disks:
- Standard HDDs: Azure standard HDDs deliver reliable, low-cost disk support for VMs running latency-tolerant workloads. 
- Standard SSDs: Azure standard SSDs are optimized for workloads that need consistent performance at lower IOPS levels.

#### Standard HDD Transactions
For Standard HDDs, each I/O operation is considered as a single transaction, whatever the I/O size. These transactions have a billing impact.

#### Standard SSD transactions
For standard SSDs, each I/O operation less than or equal to 256 kB of throughput is considered a single I/O operation. I/O operations larger than 256 kB of throughput are considered multiple I/Os of size 256 kB. These transactions incur a billable cost but, there's an hourly limit on the number of transactions that can incur a billable cost. If that hourly limit is reached, additional transactions during that hour no longer incur a cost. For details, see the blog post.

#### Standard SSD Bursting
Standard SSDs offer disk bursting, which provides better tolerance for the unpredictable IO pattern changes. OS boot disks and applications prone to traffic spikes will both benefit from disk bursting. To learn more about how bursting for Azure disks works, see Disk-level bursting.

#### Zone-redundant storage
Standard SSDs can optionally be deployed using zone-redundant storage (ZSR), which synchronously replicates your Azure managed disk across three Azure availability zones in the region you select. Each availability zone is a separate physical location with independent power, cooling, and networking. ZRS disks provide at least 99.9999999999% (12 9's) of durability over a given year. See [Zone-redundant storage for managed disks](disks-redundancy.md#zone-redundant-storage-for-managed-disks), for details.

#### Snapshots
Full snapshots and images are charged at a monthly rate for both LRS and ZRS snapshot options based on the used portion of the disk. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GB and actual used data size of 10 GB, snapshot will be billed only for the used data size of 10 GB.

Incremental snapshots for Standard HDDs also incur a monthly charge for both LRS and ZRS snapshot options based on the storage occupied by the delta changes since the last snapshot. 

#### Example 1 - Standard HDD 
In this example, we provision a 512 Gb Standard HDD Disk with LRS redundancy. 
You will be billed for the provisioned size of the HDD disk and the transactions performed on the disk, which will show as the following tier and meters in your bill:

| Tier | Meter |
|-|-|
|Standard HDD Managed Disks| S20 LRS Disk|
|Standard HDD Managed Disks| S4 LRS Disk Operations|

#### Example 2 - Standard SSD 
In this example, we provision a 1 Tb Standard SSD Disk with LRS redundancy, where we also have snapshot created on the current used data size of 120 Gb. 
You will be billed for the provisioned size of the HDD disk, the transactions performed on the disk, and the used snapshot size which will show as the following tier and meters in your bill:

| Tier | Meter |
|-|-|
|Standard SSD Managed Disks| E30 LRS Disk|
|Standard SSD Managed Disks| E4 LRS Disk Operations|
|Standard SSD Managed Disks| E10 LRS Disk |

### Premium Storage:
- Premium SSDs: Azure Premium SSDs deliver high-performance and low-latency disk support for virtual machines (VMs) with input/output (IO)-intensive workloads. 
- Premium SSD v2: Premium SSD v2 disks, you can individually set the capacity, throughput, and IOPS of a disk based on your workload needs, providing you with more flexibility and reduced costs
- Ultra SSDs: Ultra disks feature a flexible performance configuration model that allows you to independently configure IOPS and throughput both before and after you provision the disk.

#### Premium SSD bursting
Premium SSD managed disks offer [on-demand disk bursting](disks-enable-bursting.md), providing better tolerance on unpredictable changes of IO patterns. Disk bursting is especially useful during OS disk boot and for applications with spiky traffic. 
Premium SSD managed disks using the on-demand bursting model are charged an hourly burst enablement flat fee and transaction costs apply to any burst transactions beyond the provisioned target. Transaction costs are charged using the pay-as-you go model, based on uncached disk IOs, including both reads and writes that exceed provisioned targets. 

#### Premium SSD transactions
For Premium SSD managed disks, each I/O operation less than or equal to 256 kB of throughput is considered a single I/O operation. I/O operations larger than 256 kB of throughput are considered multiple I/Os of size 256 kB.

#### Zone-redundant storage

> [!NOTE]
> Premium SSD v2 doesn't support zone-redundant storage.

Premium SSD can optionally be deployed using zone-redundant storage (ZSR), which synchronously replicates your Azure managed disk across three Azure availability zones in the region you select. Each availability zone is a separate physical location with independent power, cooling, and networking. ZRS disks provide at least 99.9999999999% (12 9's) of durability over a given year. See [Zone-redundant storage for managed disks](disks-redundancy.md#zone-redundant-storage-for-managed-disks), for details.

#### Premium SSD v2 IOPS
All Premium SSD v2 disks have a baseline IOPS of 3000 that is free of charge. After 6 GiB, the maximum IOPS a disk can have increases at a rate of 500 per GiB, up to 80,000 IOPS. So an 8 GiB disk can have up to 4,000 IOPS, and a 10 GiB can have up to 5,000 IOPS. To be able to set 80,000 IOPS on a disk, that disk must have at least 160 GiBs. Increasing your IOPS beyond 3000 increases the price of your disk.

#### Premium SSD v2 throughput
All Premium SSD v2 disks have a baseline throughput of 125 MB/s that is free of charge. After 6 GiB, the maximum throughput that can be set increases by 0.25 MB/s per set IOPS. If a disk has 3,000 IOPS, the max throughput it can set is 750 MB/s. To raise the throughput for this disk beyond 750 MB/s, its IOPS must be increased. Increasing your throughput beyond 125 increases the price of your disk.

#### Snapshots
You can store incremental snapshots for Premium SSD and Premium SSD v2 only on Standard storage (which will also be reflected on the bill, see below examples). They are charged a monthly rate for both Standard LRS and ZRS snapshot options of the storage occupied by the delta changes since the last snapshot. For example, you are using a managed disk with provisioned size of 128 GiB and a used size of 10 GiB. The first incremental snapshot is billed only for the used size of 10 GiB. Before you create the second snapshot, 20 GiB of data is added to the disk. Now, the second incremental snapshot is billed for only 20 GiB.

#### Example 1 - Premium SSD 
In this example, we want to provision a Premium SSD Disk at 512 GiB with LRS redundancy with bursting enabled.
You are billed for the provisioned size of the Premium SSD disk and the burst enablement flat fee and transaction costs apply to any burst transactions beyond the provisioned target which will show as the following tier and meters in your bill:

| Tier | Meter |
|-|-|
|Premium SSD Managed Disks| P20 LRS Disk|
|Premium SSD Managed Disks| LRS Burst Enablement* |

*To see a more detailed example of how bursting is billed, see [Disk-level bursting](disk-bursting.md#disk-level-bursting).

#### Example 2 - Premium SSD v2 
In this example, we want to provision a Premium SSD v2 Disk with LRS redundancy with a total provisioned size of 512 GiB, a target performance of 40,000 IOPS and 200 MB/s of throughput. You also create and store incremental snapshots for your current used capacity. 
You will be billed for the provisioned size of the disk, the additional IOPS and throughput past the baseline values, and the used snapshot size which will show as the following tier and meters in your bill:

| Tier | Meter |
|-|-|
|Azure Premium SSD v2| Premium LRS provisioned capacity|
|Azure Premium SSD v2| Premium LRS provisioned IOPS |
|Azure Premium SSD v2| Premium LRS provisioned throughput (MB/s) |
|Standard HDD managed disks| LRS snapshots |

### Ultra Disks:
- Ultra SSDs: Ultra Disks feature a flexible performance configuration model that allows you to independently configure IOPS and throughput both before and after you provision the disk.

#### Ultra disk IOPS
Ultra disks support IOPS limits of 300 IOPS/GiB, up to a maximum of 160,000 IOPS per disk. To achieve the target IOPS for the disk, ensure that the selected disk IOPS are less than the VM IOPS limit.

The current maximum limit for IOPS for a single VM in generally available sizes is 80,000. Ultra disks with greater IOPS can be used as shared disks to support multiple VMs.

The minimum guaranteed IOPS per disk are 1 IOPS/GiB, with an overall baseline minimum of 100 IOPS. For example, if you provisioned a 4-GiB ultra disk, the minimum IOPS for that disk is 100, instead of four.


#### Ultra disk throughput
The throughput limit of a single ultra disk is 256-kB/s for each provisioned IOPS, up to a maximum of 4000 MB/s per disk (where MB/s = 10^6 Bytes per second). The minimum guaranteed throughput per disk is 4kB/s for each provisioned IOPS, with an overall baseline minimum of 1 MB/s.

You can adjust ultra disk IOPS and throughput performance at runtime without detaching the disk from the virtual machine. After a performance resize operation has been issued on a disk, it can take up to an hour for the change to take effect. Up to four performance resize operations are permitted during a 24-hour window.

#### Snapshots
You can store incremental snapshots for Ultra Disk only on Standard storage (which will also be reflected on the bill, see below examples). They are charged a monthly rate for both Standard LRS and ZRS snapshot options of the storage occupied by the delta changes since the last snapshot. For example, you are using a managed disk with provisioned size of 128 GB and a used size of 10 GB. The first incremental snapshot is billed only for the used size of 10 GB. Before you create the second snapshot, 20 GB of data is added to the disk. Now, the second incremental snapshot is billed for only 20 GB.

#### Example 1 - Ultra Disk 
In this example, we want to provision an Ultra Disk with ZRS redundancy with a total provisioned size of 3 Tb, a target performance of 100,000 IOPS and 2,000 MB/s of throughput. You also create and store incremental snapshots for your current used capacity. 
You will be billed for the provisioned size of the disk, the additional IOPS and throughput past the baseline values, and the used snapshot size which will show as the following tier and meters in your bill:

| Tier | Meter |
|-|-|
|Ultra Disks| Ultra ZRS provisioned capacity|
|Ultra Disks| Ultra ZRS provisioned IOPS |
|Ultra Disks| Ultra ZRS provisioned throughput (MB/s) |
|Standard HDD managed disks| ZRS snapshots |

## See also
- [Azure Managed Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/)
- [Planning for an Azure Files deployment](../storage/files/storage-files-planning.md) and [Planning for an Azure File Sync deployment](../storage/file-sync/file-sync-planning.md)
- [Create an SMB Azure file share](../storage/files/storage-how-to-create-file-share.md) and [Deploy Azure File Sync](../storage/file-sync/file-sync-deployment-guide.md)

## Notes 
- Merge info from https://learn.microsoft.com/azure/virtual-machines/disks-types#billing
- Add Meter names in table