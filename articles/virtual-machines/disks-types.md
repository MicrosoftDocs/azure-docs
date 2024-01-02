---
title: Select a disk type for Azure IaaS VMs - managed disks
description: Learn about the available Azure disk types for virtual machines, including ultra disks, Premium SSDs v2, Premium SSDs, standard SSDs, and Standard HDDs.
author: roygara
ms.author: rogarana
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure-disk-storage
ms.custom: references_regions
---

# Azure managed disk types

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure managed disks currently offers five disk types, each intended to address a specific customer scenario:

- [Ultra disks](#ultra-disks)
- [Premium SSD v2](#premium-ssd-v2)
- [Premium SSDs (solid-state drives)](#premium-ssds)
- [Standard SSDs](#standard-ssds)
- [Standard HDDs (hard disk drives)](#standard-hdds)

## Disk type comparison

The following table provides a comparison of the five disk types to help you decide which to use.

|         | Ultra disk | Premium SSD v2 | Premium SSD | Standard SSD | <nobr>Standard HDD</nobr> |
| ------- | ---------- | ----------- | ------------ | ------------ | ------------ |
| **Disk type** | SSD | SSD |SSD | SSD | HDD |
| **Scenario**  | IO-intensive workloads such as [SAP HANA](workloads/sap/hana-vm-operations-storage.md), top tier databases (for example, SQL, Oracle), and other transaction-heavy workloads. | Production and performance-sensitive workloads that consistently require low latency and high IOPS and throughput | Production and performance sensitive workloads | Web servers, lightly used enterprise applications and dev/test | Backup, non-critical, infrequent access |
| **Max disk size** | 65,536 GiB | 65,536 GiB |32,767 GiB | 32,767 GiB | 32,767 GiB |
| **Max throughput** | 4,000 MB/s | 1,200 MB/s | 900 MB/s | 750 MB/s | 500 MB/s |
| **Max IOPS** | 160,000 | 80,000 | 20,000 | 6,000 | 2,000, 3,000* |
| **Usable as OS Disk?** | No | No | Yes | Yes | Yes |

\* Only applies to disks with performance plus (preview) enabled.

For more help deciding which disk type suits your needs, this decision tree should help with typical scenarios:

:::image type="content" source="media/disks-types/managed-disk-decision-tree.png" alt-text="Diagram of a decision tree for managed disk types." lightbox="media/disks-types/managed-disk-decision-tree.png":::

For a video that covers some high level differences for the different disk types, as well as some ways for determining what impacts your workload requirements, see [Block storage options with Azure Disk Storage and Elastic SAN](https://youtu.be/igfNfUvgaDw).

## Ultra disks

Azure ultra disks are the highest-performing storage option for Azure virtual machines (VMs). You can change the performance parameters of an ultra disk without having to restart your VMs. Ultra disks are suited for data-intensive workloads such as SAP HANA, top-tier databases, and transaction-heavy workloads.

Ultra disks must be used as data disks and can only be created as empty disks. You should use Premium solid-state drives (SSDs) as operating system (OS) disks.

### Ultra disk size

Azure ultra disks offer up to 32-TiB per region per subscription by default, but ultra disks support higher capacity by request. To request an increase in capacity, request a quota increase or contact Azure Support.

The following table provides a comparison of disk sizes and performance caps to help you decide which to use.

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

Ultra disks are designed to provide submillisecond latencies and target IOPS and throughput described in the preceding table 99.99% of the time.

### Ultra disk performance

Ultra disks feature a flexible performance configuration model that allows you to independently configure IOPS and throughput  both before and after you provision the disk. Ultra disks come in several fixed sizes, ranging from 4 GiB up to 64 TiB.

### Ultra disk IOPS

Ultra disks support IOPS limits of 300 IOPS/GiB, up to a maximum of 160,000 IOPS per disk. To achieve the target IOPS for the disk, ensure that the selected disk IOPS are less than the VM IOPS limit.

The current maximum limit for IOPS for a single VM in generally available sizes is 80,000. Ultra disks with greater IOPS can be used as shared disks to support multiple VMs.

The minimum guaranteed IOPS per disk are 1 IOPS/GiB, with an overall baseline minimum of 100 IOPS. For example, if you provisioned a 4-GiB ultra disk, the minimum IOPS for that disk is 100, instead of four.

For more information about IOPS, see [Virtual machine and disk performance](disks-performance.md).

### Ultra disk throughput

The throughput limit of a single ultra disk is 256-kB/s for each provisioned IOPS, up to a maximum of 4000 MB/s per disk (where MB/s = 10^6 Bytes per second). The minimum guaranteed throughput per disk is 4kB/s for each provisioned IOPS, with an overall baseline minimum of 1 MB/s.

You can adjust ultra disk IOPS and throughput performance at runtime without detaching the disk from the virtual machine. After a performance resize operation has been issued on a disk, it can take up to an hour for the change to take effect. Up to four performance resize operations are permitted during a 24-hour window.

It's possible for a performance resize operation to fail because of a lack of performance bandwidth capacity.

### Ultra disk limitations

[!INCLUDE [managed-disks-ultra-disks-GA-scope-and-limitations](../../includes/managed-disks-ultra-disks-GA-scope-and-limitations.md)]

If you would like to start using ultra disks, see the article on [using Azure Ultra Disks](disks-enable-ultra-ssd.md).

## Premium SSD v2

Premium SSD v2 offers higher performance than Premium SSDs while also generally being less costly. You can individually tweak the performance (capacity, throughput, and IOPS) of Premium SSD v2 disks at any time, allowing workloads to be cost efficient while meeting shifting performance needs. For example, a transaction-intensive database may need a large amount of IOPS at a small size, or a gaming application may need a large amount of IOPS but only during peak hours. Because of this, for most general purpose workloads, Premium SSD v2 can provide the best price performance. 

Premium SSD v2 is suited for a broad range of workloads such as SQL server, Oracle, MariaDB, SAP, Cassandra, Mongo DB, big data/analytics, and gaming, on virtual machines or stateful containers.

Premium SSD v2 support a 4k physical sector size by default, but can be configured to use a 512E sector size as well. While most applications are compatible with 4k sector sizes, some require 512 byte sector sizes. Oracle Database, for example, requires release 12.2 or later in order to support 4k native disks.

### Differences between Premium SSD and Premium SSD v2

Unlike Premium SSDs, Premium SSD v2 doesn't have dedicated sizes. You can set a Premium SSD v2 to any supported size you prefer, and make granular adjustments to the performance without downtime. Premium SSD v2 doesn't support host caching but, benefits significantly from lower latency, which addresses some of the same core problems host caching addresses. The ability to adjust IOPS, throughput, and size at any time also means you can avoid the maintenance overhead of having to stripe disks to meet your needs.

### Premium SSD v2 limitations

[!INCLUDE [disks-prem-v2-limitations](../../includes/disks-prem-v2-limitations.md)]

#### Regional availability

[!INCLUDE [disks-premv2-regions](../../includes/disks-premv2-regions.md)]

### Premium SSD v2 performance

With Premium SSD v2 disks, you can individually set the capacity, throughput, and IOPS of a disk based on your workload needs, providing you with more flexibility and reduced costs. Each of these values determines the cost of your disk.  

#### Premium SSD v2 capacities

Premium SSD v2 capacities range from 1 GiB to 64 TiBs, in 1-GiB increments. You're billed on a per GiB ratio, see the [pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for details.

Premium SSD v2 offers up to 32 TiBs per region per subscription by default, but supports higher capacity by request. To request an increase in capacity, request a quota increase or contact Azure Support.

#### Premium SSD v2 IOPS

All Premium SSD v2 disks have a baseline IOPS of 3000 that is free of charge. After 6 GiB, the maximum IOPS a disk can have increases at a rate of 500 per GiB, up to 80,000 IOPS. So an 8 GiB disk can have up to 4,000 IOPS, and a 10 GiB can have up to 5,000 IOPS. To be able to set 80,000 IOPS on a disk, that disk must have at least 160 GiBs. Increasing your IOPS beyond 3000 increases the price of your disk.

#### Premium SSD v2 throughput

All Premium SSD v2 disks have a baseline throughput of 125 MB/s that is free of charge. After 6 GiB, the maximum throughput that can be set increases by 0.25 MB/s per set IOPS. If a disk has 3,000 IOPS, the max throughput it can set is 750 MB/s. To raise the throughput for this disk beyond 750 MB/s, its IOPS must be increased. For example, if you increased the IOPS to 4,000, then the max throughput that can be set is 1,000. 1,200 MB/s is the maximum throughput supported for disks that have 5,000 IOPS or more. Increasing your throughput beyond 125 increases the price of your disk.

#### Premium SSD v2 Sector Sizes
Premium SSD v2 supports a 4k physical sector size by default. A 512E sector size is also supported. While most applications are compatible with 4k sector sizes, some require 512-byte sector sizes. Oracle Database, for example, requires release 12.2 or later in order to support 4k native disks.

#### Summary

The following table provides a comparison of disk capacities and performance maximums to help you decide which to use.

|Disk Size  |Maximum available IOPS  |Maximum available throughput (MB/s)  |
|---------|---------|---------|
|1 GiB-64 TiBs    |3,000-80,000 (Increases by 500 IOPS per GiB)        |125-1,200 (increases by 0.25 MB/s per set IOPS)         |

To deploy a Premium SSD v2, see [Deploy a Premium SSD v2](disks-deploy-premium-v2.md).

## Premium SSDs

Azure Premium SSDs deliver high-performance and low-latency disk support for virtual machines (VMs) with input/output (IO)-intensive workloads. To take advantage of the speed and performance of Premium SSDs, you can migrate existing VM disks to Premium SSDs. Premium SSDs are suitable for mission-critical production applications, but you can use them only with compatible VM series. Premium SSDs support the [512E sector size](https://en.wikipedia.org/wiki/Advanced_Format#512_emulation_(512e)).

To learn more about individual Azure VM types and sizes for Windows or Linux, including size compatibility for premium storage, see [Sizes for virtual machines in Azure](sizes.md). You'll need to check each individual VM size article to determine if it's premium storage-compatible.

### Premium SSD size
[!INCLUDE [disk-storage-premium-ssd-sizes](../../includes/disk-storage-premium-ssd-sizes.md)]

Capacity, IOPS, and throughput are guaranteed when a premium storage disk is provisioned. For example, if you create a P50 disk, Azure provisions 4,095-GB storage capacity, 7,500 IOPS, and 250-MB/s throughput for that disk. Your application can use all or part of the capacity and performance. Premium SSDs are designed to provide the single-digit millisecond latencies, target IOPS, and throughput described in the preceding table 99.9% of the time.

### Premium SSD bursting

Premium SSDs offer disk bursting, which provides better tolerance on unpredictable changes of IO patterns. Disk bursting is especially useful during OS disk boot and for applications with spiky traffic. To learn more about how bursting for Azure disks works, see [Disk-level bursting](disk-bursting.md#disk-level-bursting).

### Premium SSD transactions

For Premium SSDs, each I/O operation less than or equal to 256 kB of throughput is considered a single I/O operation. I/O operations larger than 256 kB of throughput are considered multiple I/Os of size 256 kB.

## Standard SSDs

Azure standard SSDs are optimized for workloads that need consistent performance at lower IOPS levels. They're an especially good choice for customers with varying workloads supported by on-premises hard disk drive (HDD) solutions. Compared to standard HDDs, standard SSDs deliver better availability, consistency, reliability, and latency. Standard SSDs are suitable for web servers, low IOPS application servers, lightly used enterprise applications, and non-production workloads. Like standard HDDs, standard SSDs are available on all Azure VMs. Standard SSDs support the [512E sector size](https://en.wikipedia.org/wiki/Advanced_Format#512_emulation_(512e)).

### Standard SSD size

[!INCLUDE [disk-storage-standard-ssd-sizes](../../includes/disk-storage-standard-ssd-sizes.md)]

Standard SSDs are designed to provide single-digit millisecond latencies and the IOPS and throughput up to the limits described in the preceding table 99% of the time. Actual IOPS and throughput may vary sometimes depending on the traffic patterns. Standard SSDs provide more consistent performance than the HDD disks with the lower latency.

### Standard SSD transactions

For standard SSDs, each I/O operation less than or equal to 256 kB of throughput is considered a single I/O operation. I/O operations larger than 256 kB of throughput are considered multiple I/Os of size 256 kB. These transactions incur a billable cost but, there's an hourly limit on the number of transactions that can incur a billable cost. If that hourly limit is reached, additional transactions during that hour no longer incur a cost. For details, see the [blog post](https://aka.ms/billedcapsblog).

### Standard SSD Bursting

Standard SSDs offer disk bursting, which provides better tolerance for the unpredictable IO pattern changes. OS boot disks and applications prone to traffic spikes will both benefit from disk bursting. To learn more about how bursting for Azure disks works, see [Disk-level bursting](disk-bursting.md#disk-level-bursting).

## Standard HDDs

Azure standard HDDs deliver reliable, low-cost disk support for VMs running latency-tolerant workloads. With standard storage, your data is stored on HDDs, and performance may vary more widely than that of SSD-based disks. Standard HDDs are designed to deliver write latencies of less than 10 ms and read latencies of less than 20 ms for most IO operations. Actual performance may vary depending on IO size and workload pattern, however. When working with VMs, you can use standard HDD disks for dev/test scenarios and less critical workloads. Standard HDDs are available in all Azure regions and can be used with all Azure VMs. Standard HDDs support the [512E sector size](https://en.wikipedia.org/wiki/Advanced_Format#512_emulation_(512e)).

### Standard HDD size
[!INCLUDE [disk-storage-standard-hdd-sizes](../../includes/disk-storage-standard-hdd-sizes.md)]

### Standard HDD Transactions

For Standard HDDs, each I/O operation is considered as a single transaction, whatever the I/O size. These transactions have a billing impact.

## Billing

When using managed disks, the following billing considerations apply:

- Disk type
- Managed disk Size
- Snapshots
- Outbound data transfers
- Number of transactions

**Managed disk size**: Managed disks are billed according to their provisioned size. Azure maps the provisioned size (rounded up) to the nearest offered disk size. For details of the disk sizes offered, see the previous tables. Each disk maps to a supported provisioned disk-size offering and is billed accordingly. For example, if you provisioned a 200-GiB standard SSD, it maps to the disk size offer of E15 (256 GiB). Billing for any provisioned disk is prorated hourly by using the monthly price for the storage offering. For example, you provision an E10 disk and delete it after 20 hours of use. In this case, you're billed for the E10 offering prorated to 20 hours, regardless of the amount of data written to the disk.

**Snapshots**: Snapshots are billed based on the size used. For example, you create a snapshot of a managed disk with provisioned capacity of 64 GiB and actual used data size of 10 GiB. In this case, the snapshot is billed only for the used data size of 10 GiB.

For more information on snapshots, see the section on snapshots in the [managed disk overview](managed-disks-overview.md#managed-disk-snapshots).

**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/bandwidth/) (data going out of Azure data centers) incur billing for bandwidth usage.

**Transactions**: You're billed for the number of transactions performed on a standard managed disk. For standard SSDs, each I/O operation less than or equal to 256 kB of throughput is considered a single I/O operation. I/O operations larger than 256 kB of throughput are considered multiple I/Os of size 256 kB. For Standard HDDs, each IO operation is considered a single transaction, whatever the I/O size.

For detailed information on pricing for managed disks (including transaction costs), see [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks).

### Ultra disks VM reservation fee

Azure VMs have the capability to indicate if they're compatible with ultra disks. An ultra disk-compatible VM allocates dedicated bandwidth capacity between the compute VM instance and the block storage scale unit to optimize the performance and reduce latency. When you add this capability on the VM, it results in a reservation charge. The reservation charge is only imposed if you enabled ultra disk capability on the VM without an attached ultra disk. When an ultra disk is attached to the ultra disk compatible VM, the reservation charge wouldn't be applied. This charge is per vCPU provisioned on the VM.

> [!Note]
> For [constrained core VM sizes](constrained-vcpu.md), the reservation fee is based on the actual number of vCPUs and not the constrained cores. For Standard_E32-8s_v3, the reservation fee will be based on 32 cores.

Refer to the [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for ultra disk pricing details.

### Azure disk reservation

Disk reservation provides you with a discount on the advance purchase of one year's of disk storage, reducing your total cost. When you purchase a disk reservation, you select a specific disk SKU in a target region. For example, you may choose five P30 (1 TiB) Premium SSDs in the Central US region for a one year term. The disk reservation experience is similar to Azure reserved VM instances. You can bundle VM and Disk reservations to maximize your savings. For now, Azure Disks Reservation offers one year commitment plan for Premium SSD SKUs from P30 (1 TiB) to P80 (32 TiB) in all production regions. For more information about reserved disks pricing, see [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

## Next steps

See [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) to get started.
