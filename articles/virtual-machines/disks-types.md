---
title: Select a disk type for Azure IaaS VMs - managed disks
description: Learn about the available Azure disk types for virtual machines, including ultra disks, premium SSDs, standard SSDs, and Standard HDDs.
author: roygara
ms.author: rogarana
ms.date: 11/03/2021
ms.topic: conceptual
ms.service: storage
ms.subservice: disks
ms.custom: references_regions
---

# Azure managed disk types

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure managed disks currently offers four disk types, each intended to address a specific customer scenario:

- Ultra disks
- Premium SSDs (solid-state drives)
- Standard SSDs
- Standard HDDs (hard disk drives)

## Disk type comparison

The following table provides a comparison of the four disk types to help you decide which to use.

|         | Ultra disk | Premium SSD | Standard SSD | <nobr>Standard HDD</nobr> |
| ------- | ---------- | ----------- | ------------ | ------------ |
| **Disk type** | SSD | SSD | SSD | HDD |
| **Scenario**  | IO-intensive workloads such as [SAP HANA](workloads/sap/hana-vm-operations-storage.md), top tier databases (for example, SQL, Oracle), and other transaction-heavy workloads. | Production and performance sensitive workloads | Web servers, lightly used enterprise applications and dev/test | Backup, non-critical, infrequent access |
| **Max disk size** | 65,536 gibibyte (GiB) | 32,767 GiB | 32,767 GiB | 32,767 GiB |
| **Max throughput** | 4,000 MB/s | 900 MB/s | 750 MB/s | 500 MB/s |
| **Max IOPS** | 160,000 | 20,000 | 6,000 | 2,000 |

## Ultra disks

Azure ultra disks are the highest-performing storage option for Azure virtual machines (VMs). You can change the performance parameters of an ultra disk without having to restart your VMs. Ultra disks are suited for data-intensive workloads such as SAP HANA, top-tier databases, and transaction-heavy workloads.

Ultra disks must be used as data disks and can only be created as empty disks. Microsoft recommends using premium solid-state drives (SSDs) as operating system (OS) disks.

### Ultra disk size

Azure ultra disks offer up to 32 TiB per region per subscription by default, but ultra disks support higher capacity by request. To request an increase in capacity, request a quota increase or contact Azure Support.

The following table provides a comparison of disk sizes and performance caps to help you decide which to use.

|Disk Size (GiB)  |IOPS Cap  |Throughput Cap (MBps)  |
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

The minimum guaranteed IOPS per disk are 1 IOPS/GiB, with an overall baseline minimum of 100 IOPS. For example, if you provisioned a 4 GiB ultra disk, the minimum IOPS for that disk is 100, instead of four.

For more information about IOPS, see [Virtual machine and disk performance](disks-performance.md).

### Ultra disk throughput

The throughput limit of a single ultra disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 4000 MBps per disk (where MBps = 10^6 Bytes per second). The minimum guaranteed throughput per disk is 4KiB/s for each provisioned IOPS, with an overall baseline minimum of 1 MBps.

You can adjust ultra disk IOPS and throughput performance at runtime without detaching the disk from the virtual machine. After a performance resize operation has been issued on a disk, it can take up to an hour for the change to take effect. Up to four performance resize operations are permitted during a 24-hour window.

It's possible for a performance resize operation to fail because of a lack of performance bandwidth capacity.

### Ultra disk limitations

[!INCLUDE [managed-disks-ultra-disks-GA-scope-and-limitations](../../includes/managed-disks-ultra-disks-GA-scope-and-limitations.md)]

If you would like to start using ultra disks, see the article on [using Azure ultra disks](disks-enable-ultra-ssd.md).

## Premium SSDs

Azure premium SSDs deliver high-performance and low-latency disk support for virtual machines (VMs) with input/output (IO)-intensive workloads. To take advantage of the speed and performance of premium SSDs, you can migrate existing VM disks to premium SSDs. Premium SSDs are suitable for mission-critical production applications, but you can use them only with compatible VM series.

To learn more about individual Azure VM types and sizes for Windows or Linux, including size compatibility for premium storage, see [Sizes for virtual machines in Azure](sizes.md). You'll need to check each individual VM size article to determine if it is premium storage-compatible.

### Premium SSD size
[!INCLUDE [disk-storage-premium-ssd-sizes](../../includes/disk-storage-premium-ssd-sizes.md)]

Capacity, IOPS, and throughput are guaranteed when a premium storage disk is provisioned. For example, if you create a P50 disk, Azure provisions 4,095-GB storage capacity, 7,500 IOPS, and 250-MB/s throughput for that disk. Your application can use all or part of the capacity and performance. Premium SSDs are designed to provide the single-digit millisecond latencies, target IOPS, and throughput described in the preceding table 99.9% of the time.

### Premium SSD bursting

Premium SSDs offer disk bursting, which provides better tolerance on unpredictable changes of IO patterns. Disk bursting is especially useful during OS disk boot and for applications with spiky traffic. To learn more about how bursting for Azure disks works, see [Disk-level bursting](disk-bursting.md#disk-level-bursting).

### Premium SSD transactions

For premium SSDs, each I/O operation less than or equal to 256 KiB of throughput is considered a single I/O operation. I/O operations larger than 256 KiB of throughput are considered multiple I/Os of size 256 KiB.

## Standard SSDs

Azure standard SSDs are optimized for workloads that need consistent performance at lower IOPS levels. They're an especially good choice for customers with varying workloads supported by on-premises hard disk drive (HDD) solutions. Compared to standard HDDs, standard SSDs deliver better availability, consistency, reliability, and latency. Standard SSDs are suitable for web servers, low IOPS application servers, lightly-used enterprise applications, and non-production workloads. Like standard HDDs, standard SSDs are available on all Azure VMs.

### Standard SSD size

[!INCLUDE [disk-storage-standard-ssd-sizes](../../includes/disk-storage-standard-ssd-sizes.md)]

Standard SSDs are designed to provide single-digit millisecond latencies and the IOPS and throughput up to the limits described in the preceding table 99% of the time. Actual IOPS and throughput may vary sometimes depending on the traffic patterns. Standard SSDs will provide more consistent performance than the HDD disks with the lower latency.

### Standard SSD transactions

For standard SSDs, each I/O operation less than or equal to 256 KiB of throughput is considered a single I/O operation. I/O operations larger than 256 KiB of throughput are considered multiple I/Os of size 256 KiB. These transactions incur a billable cost.

### Standard SSD Bursting

Standard SSDs offer disk bursting, which provides better tolerance for the unpredictable IO pattern changes. OS boot disks and applications prone to traffic spikes will both benefit from disk bursting. To learn more about how bursting for Azure disks works, see [Disk-level bursting](disk-bursting.md#disk-level-bursting).

## Standard HDDs

Azure standard HDDs deliver reliable, low-cost disk support for VMs running latency-tolerant workloads. With standard storage, your data is stored on HDDs, and performance may vary more widely than that of SSD-based disks. Standard HDDs are designed to deliver write latencies of less than 10 ms and read latencies of less than 20 ms for most IO operations. Actual performance may vary depending on IO size and workload pattern, however. When working with VMs, you can use standard HDD disks for dev/test scenarios and less critical workloads. Standard HDDs are available in all Azure regions and can be used with all Azure VMs.

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

**Managed disk size**: Managed disks are billed according to their provisioned size. Azure maps the provisioned size (rounded up) to the nearest offered disk size. For details of the disk sizes offered, see the previous tables. Each disk maps to a supported provisioned disk-size offering and is billed accordingly. For example, if you provisioned a 200 GiB standard SSD, it maps to the disk size offer of E15 (256 GiB). Billing for any provisioned disk is prorated hourly by using the monthly price for the storage offering. For example, you provision an E10 disk and delete it after 20 hours of use. In this case, you're billed for the E10 offering prorated to 20 hours, regardless of the amount of data written to the disk.

**Snapshots**: Snapshots are billed based on the size used. For example, you create a snapshot of a managed disk with provisioned capacity of 64 GiB and actual used data size of 10 GiB. In this case, the snapshot is billed only for the used data size of 10 GiB.

For more information on snapshots, see the section on snapshots in the [managed disk overview](managed-disks-overview.md#managed-disk-snapshots).

**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/bandwidth/) (data going out of Azure data centers) incur billing for bandwidth usage.

**Transactions**: You're billed for the number of transactions performed on a standard managed disk. For standard SSDs, each I/O operation less than or equal to 256 KiB of throughput is considered a single I/O operation. I/O operations larger than 256 KiB of throughput are considered multiple I/Os of size 256 KiB. For Standard HDDs, each IO operation is considered a single transaction, whatever the I/O size.

For detailed information on pricing for managed disks (including transaction costs), see [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks).

### Ultra disks VM reservation fee

Azure VMs have the capability to indicate if they are compatible with ultra disks. An ultra disk-compatible VM allocates dedicated bandwidth capacity between the compute VM instance and the block storage scale unit to optimize the performance and reduce latency. When you add this capability on the VM, it results in a reservation charge. The reservation charge is only imposed if you enabled ultra disk capability on the VM without an attached ultra disk. When an ultra disk is attached to the ultra disk compatible VM, the reservation charge would not be applied. This charge is per vCPU provisioned on the VM.

> [!Note]
> For [constrained core VM sizes](constrained-vcpu.md), the reservation fee is based on the actual number of vCPUs and not the constrained cores. For Standard_E32-8s_v3, the reservation fee will be based on 32 cores.

Refer to the [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/) for ultra disk pricing details.

### Azure disk reservation

Disk reservation provides you a discount on the advance purchase of one year's of disk storage, reducing your total cost. When you purchase a disk reservation, you select a specific disk SKU in a target region. For example, you may choose five P30 (1 TiB) premium SSDs in the Central US region for a one year term. The disk reservation experience is similar to Azure reserved VM instances. You can bundle VM and Disk reservations to maximize your savings. For now, Azure Disks Reservation offers one year commitment plan for premium SSD SKUs from P30 (1 TiB) to P80 (32 TiB) in all production regions. For more details about reserved disks pricing, see [Azure Disks pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

## Next steps

See [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) to get started.
