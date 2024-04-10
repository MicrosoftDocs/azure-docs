---
title: Understand Azure Disk Storage billing
description: Learn about the billing factors that affect Azure managed disks, including ultra disks, Premium SSDs v2, Premium SSDs, standard SSDs, and Standard HDDs.
author: roygara
ms.author: rogarana
ms.date: 03/08/2024
ms.topic: conceptual
ms.service: azure-disk-storage
---

# Understand Azure Disk Storage billing

This article helps you understand how Azure managed disks are billed and how billing is laid out in your Azure Disk Storage bill. Some disks have unique attributes that affect their billing, but most disk types have the same set of attributes and are affected differently by these attributes depending on the disk type. You can also take snapshots of your disks, which are reflected in your bill.

For detailed Azure Disk Storage pricing information, see [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

## Snapshots

There are two kinds of snapshots offered for Azure managed disks: Full snapshots and incremental snapshots. Full snapshots can be stored on standard hard disk drives (HDDs) or premium solid-state drives (SSDs) while incremental snapshots are only stored on standard HDDs. With snapshots, you're billed based on the used size of data. So if you take a full snapshot of a disk with 500-GiB size but only 50 GiB of that size is being used, then your snapshot is billed only for the used size of 50 GiB. Incremental snapshots are more cost efficient than full snapshots, as each snapshot you take only consists of the differences since the last snapshot.

## Ultra Disks

The price of an Azure Ultra Disk is determined by the combination of how large the disk is (its size) and what performance you select (IOPS and throughput) for your disk. If you share an Ultra Disk between multiple VMs that can affect its price as well. The following sections focus on these factors as they relate to the price of your Ultra Disk. For more information on how these factors work, see the [Ultra disks](disks-types.md#ultra-disks) section of the [Azure managed disk types](disks-types.md) article.

### Ultra Disk size

The size of your Ultra Disk also determines what performance caps your disk has. You have granular control of how much IOPS and throughput your disk has, up to that size's performance cap. Pricing increases as you increase your disk's size, and when you set higher IOPS and throughput. Ultra Disks offer up to 32 TiB per region per subscription by default, but support higher size by request. To request an increase in size, request a quota increase or contact Azure Support. 

The following table outlines the available disk sizes and performance caps. Pricing increases as you increase in size.

|Disk Size (GiB)  |IOPS Cap  |Throughput Cap (MB/s)  |
|---------|---------|---------|
|4     |1,200         |300         |
|8     |2,400         |600         |
|16     |4,800         |1,200         |
|32     |9,600         |2,400         |
|64     |19,200         |4,900         |
|128     |38,400         |9,800         |
|256     |76,800         |10,000         |
|512     |153,600         |10,000         |
|1,024    |307,200        |10,000        |
|2,048-65,536 (sizes in this range increasing in increments of 1 TiB)     |400,000         |10,000         |

### Ultra Disk IOPS

Pricing of an Azure Ultra Disk increases as you provision more IOPS to your disk. The minimum guaranteed IOPS per disk is 1 IOPS/GiB, with an overall baseline minimum of 100 IOPS. For example, if you provision a 4-GiB Ultra Disk, the minimum IOPS for that disk is 100, instead of four. As a maximum, Ultra Disks support 300 IOPS/GiB, up to a maximum of 400,000 IOPS per disk.

### Ultra Disk throughput

Pricing of an Ultra Disk increases as you increase the disk's throughput limit. The throughput limit of a single Ultra Disk is 256 kB/s for each provisioned IOPS, up to a maximum of 10,000 MB/s per disk (where MB/s - 10^6 Bytes per second). The minimum guaranteed throughput per disk is 4 kB/s for each provisioned IOPS, with an overall baseline minimum of 1 MB/s.

### Shared Ultra Disks

Ultra Disks can be used as shared disks, where you attach one disk to multiple VMs. For Ultra Disks, there isn't an extra charge for each VM that the disk is mounted to. Ultra Disks that are shared are billed on the total IOPS and MB/s that the disk is configured for. Normally, an Ultra Disk has two performance throttles that determine its total IOPS/MB/s. However, when configured as a shared Ultra Disk, two more performance throttles are exposed, for a total of four. These two extra throttles allow for increased performance at an extra expense and each meter has a default value, which raises the performance and cost of the disk. For more information, see [Share an Azure managed disk](disks-shared.md).

### Ultra Disk billing example

In this example, we provisioned an Ultra Disk with LRS redundancy with a total provisioned capacity of 3 TiB, a target performance of 100,000 IOPS and 2,000 MB/s of throughput. We also created and stored incremental snapshots for our used capacity. 
We're billed for the provisioned capacity of the disk, the extra IOPS and throughput past the baseline values, and the used snapshot capacity that shows as the following tier and meters in our bill:

| Tier | Meter |
|-|-|
|Ultra Disks| Ultra LRS provisioned capacity|
|Ultra Disks| Ultra LRS provisioned IOPS |
|Ultra Disks| Ultra LRS provisioned throughput (MB/s) |
|Standard HDD managed disks| ZRS snapshots |

## Premium SSD v2

The price of an Azure Premium SSD v2 disk is determined by the combination of how large the disk is (its capacity) and what performance you select (IOPS and throughput) for your disk. If you share a Premium SSD v2 disk between multiple VMs that can affect its price as well. The following sections focus on these factors as they relate to the price of your Premium SSD v2 disk. For more information on how these factors work, see the [Premium SSD v2](disks-types.md#premium-ssd-v2) section of the [Azure managed disk types](disks-types.md) article.

### Premium SSD v2 capacities

Premium SSD v2 capacities range from 1 GiB to 64 TiBs, in 1-GiB increments. You're billed on a per GiB ratio. See the [pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for details.

### Premium SSD v2 IOPS

All Premium SSD v2 disks have a baseline IOPS of 3,000 that is free of charge. After 6 GiB, the maximum IOPS a disk can have increases at a rate of 500 per GiB, up to 80,000 IOPS. So an 8-GiB disk can have up to 4,000 IOPS, and a 10 GiB can have up to 5,000 IOPS. To set 80,000 IOPS on a disk, that disk must have at least 160 GiBs. Increasing your IOPS beyond 3,000 increases the price of your disk.

### Premium SSD v2 throughput

All Premium SSD v2 disks have a baseline throughput of 125 MB/s that is free of charge. After 6 GiB, the maximum throughput that can be provisioned increases by 0.25 MB/s per provisioned IOPS. If a disk has 3,000 IOPS, the max throughput it can set is 750 MB/s. To raise the throughput for this disk beyond 750 MB/s, its IOPS must be increased. For example, if you increased the IOPS to 4,000, then the max throughput that can be set is 1,000. 1,200 MB/s is the maximum throughput supported for disks that have 5,000 IOPS or more. Increasing your provisioned throughput beyond 125 MB/s increases the price of your disk.

### Shared Premium SSD v2

Premium SSD v2 managed disks can be used as shared disks, where you attach one disk to multiple VMs. For Premium SSD v2 disks there isn't an extra charge for each VM that the disk is mounted to. Premium SSD v2 disks that are shared are billed on the total IOPS and MB/s that the disk is configured for. Normally, a Premium SSD v2 disk has two performance throttles that determine its total IOPS/MB/s. However, when configured as a shared Premium SSD v2, two more performance throttles are exposed, for a total of four. These two extra throttles allow for increased performance at an extra expense and each meter has a default value, which raises the performance and cost of the disk. For more information, see [Share an Azure managed disk](disks-shared.md).

### Premium SSD v2 billing example

In this example, we provision a Premium SSD v2 Disk with LRS redundancy with a total provisioned capacity of 512 GiB, a target performance of 40,000 IOPS and 200 MB/s of throughput. We also create and store incremental snapshots for our current used capacity. 
We're billed for the provisioned capacity of the disk, the IOPS and throughput past the baseline values, and the used snapshot capacity that show as the following tier and meters in our bill:

| Tier | Meter |
|-|-|
|Azure Premium SSD v2| Premium LRS provisioned capacity|
|Azure Premium SSD v2| Premium LRS provisioned IOPS |
|Azure Premium SSD v2| Premium LRS provisioned throughput (MB/s) |
|Standard HDD managed disks| LRS snapshots |

## Premium SSD

The price of an Azure Premium SSD disk is determined by the performance tier of the disk, whether bursting is enabled, what redundancy options you select, and whether or not you share the disk between multiple VMs. The following sections focus on these factors as they relate to the price of your Premium SSD disk. For more information on how these factors work, see the [Premium SSDs](disks-types.md#premium-ssds) section of the [Azure managed disk types](disks-types.md) article.

### Performance tier

The initial billing of Premium SSD disks is determined by the performance tier of the disk. Generally, the performance tier is set when you select the capacity you require (if you deploy a 1 TiB Premium SSD disk, it has the P30 tier by default) but certain disk sizes can select higher performance tiers. When you select a higher performance tier, your disk is billed at that tier until you change its performance tier again. To learn more about performance tiers, see [Performance tiers for managed disks](disks-change-performance.md).

### Premium SSD bursting

Premium SSD disks offer [two bursting models](disk-bursting.md#disk-level-bursting), credit-based bursting and [on-demand bursting](disks-enable-bursting.md). Only on-demand bursting has billing impact and you must explicitly enable on-demand bursting. Premium SSD managed disks using on-demand bursting are charged an hourly burst enablement flat fee, and transaction costs apply to any burst transactions beyond the provisioned target. Transaction costs are charged using a pay-as-you go model, based on uncached disk IOs, including reads and writes that exceed provisioned targets.

### Premium SSD transactions

For Premium SSD managed disks, each I/O operation less than or equal to 256 kB of throughput is considered a single I/O operation. I/O operations larger than 256 kB of throughput are considered multiple I/Os of size 256 kB. Unless you enable on-demand bursting, there are no transaction costs for Premium SSD disks.

### Redundancy options

Premium SSD managed disks can be deployed either with [locally redundant storage (LRS)](disks-redundancy.md#locally-redundant-storage-for-managed-disks) or [zone-redundant storage (ZRS)](disks-redundancy.md#zone-redundant-storage-for-managed-disks). The redundancy you select for your disk changes its pricing. For details see the [Azure pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

### Shared Premium SSD

Premium SSD managed disks can be used as shared disks, where you attach one disk to multiple VMs. For shared premium SSD disks, there's a charge that increases with each VM the SSD is mounted to. See [managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) for details.

### Premium SSD billing example

In this example, we provision a Premium SSD Disk at 512 GiB with LRS redundancy with bursting enabled.

We're billed for the provisioned capacity of the Premium SSD disk, the burst enablement flat fee, and transaction costs apply to any burst transactions beyond the provisioned target that show as the following tier and meters in our bill:

| Tier | Meter |
|-|-|
|Premium SSD Managed Disks| P20 LRS Disk|
|Premium SSD Managed Disks| LRS Burst Enablement* |
|Premium SSD Managed Disks| LRS Burst Transactions*|

*To see a more detailed example of how bursting is billed, see [Disk-level bursting](disk-bursting.md#disk-level-bursting).

## Standard SSD

The price of an Azure Standard SSD is determined by the performance tier of the disk, number of transactions, what redundancy options you select, and whether or not you share the disk between multiple VMs. The following sections focus on these factors as they relate to the price of your Standard SSD. For more information on how these factors work, see the [Standard SSDs](disks-types.md#standard-ssds) section of the [Azure managed disk types](disks-types.md) article.

### Performance tier

The initial billing of Standard SSDs is determined by the performance tier. The performance tier is set when you select the capacity you require (if you deploy a 1 TiB Standard SSD, it has the E30 tier), your disk is billed at that tier. If you increase the capacity of your disk into the next tier, it's then billed at that tier. For example, if you increased your 1-TiB disk to a 3-TiB disk, it's billed at the E50 tier.

### Standard SSD transactions

For standard SSDs, each I/O operation less than or equal to 256 kB of throughput is considered a single I/O operation. I/O operations larger than 256 kB of throughput are considered multiple I/Os of size 256 kB. These transactions incur a billable cost but, there's an hourly limit on the number of transactions that can incur a billable cost. If that hourly limit is reached, extra transactions during that hour no longer incur a cost. For details, see the [blog post](https://aka.ms/billedcapsblog).

### Redundancy options

Standard SSDs can be deployed either with [locally redundant storage (LRS)](disks-redundancy.md#locally-redundant-storage-for-managed-disks) or [zone-redundant storage (ZRS)](disks-redundancy.md#zone-redundant-storage-for-managed-disks). The redundancy you select for your disk changes its pricing. For details see the [Azure pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

### Shared Standard SSDs

Standard SSDs can be used as shared disks, where you attach one disk to multiple VMs. For shared Standard SSDs, there's a charge that increases with each VM the SSD is mounted to. See [managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) for details.

### Standard SSD billing example

In this example, we provision a 1 TiB Standard SSD Disk with LRS redundancy, where we also have snapshots created on the current used data capacity of 120 GiB. 
We're billed for the provisioned capacity of the HDD disk, the transactions performed on the disk, and the used snapshot capacity that will show as the following tier and meters in our bill:

| Tier | Meter |
|-|-|
|Standard SSD Managed Disks| E30 LRS Disk|
|Standard SSD Managed Disks| E4 LRS Disk Operations|
|Standard HDD managed disks| LRS snapshots |

## Standard HDD

The price of an Azure Standard HDD is determined by the performance tier of the disk and the number of transactions. The following sections focus on these factors as they relate to the price of your Standard HDD. For more information on how these factors work, see the [Standard HDDs](disks-types.md#standard-hdds) section of the [Azure managed disk types](disks-types.md) article.

### Performance tier

The initial billing of Standard HDDs is determined by the performance tier. The performance tier is set when you select the capacity you require (if you deploy a 1 TiB Standard HDD, it has the S30 tier), your disk is billed at that tier. If you increase the capacity of your disk into the next tier, it's billed at that tier. For example, if you increased your 1-TiB disk to a 3-TiB disk, it's billed at the S50 tier.

### Standard HDD Transactions
For Standard HDDs, each I/O operation is considered as a single transaction, whatever the I/O size. These transactions have a billing impact.


### Standard HDD billing example 
In this example, we provision a 512 GiB Standard HDD Disk with LRS redundancy. 
We're billed for the provisioned capacity of the HDD disk and the transactions performed on the disk, which shows as the following tier and meters in our bill:

| Tier | Meter |
|-|-|
|Standard HDD Managed Disks| S20 LRS Disk|
|Standard HDD Managed Disks| S4 LRS Disk Operations|

## See also
- [Azure Managed Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/)
- [Shared disk billing implications](disks-shared.md#billing-implications)