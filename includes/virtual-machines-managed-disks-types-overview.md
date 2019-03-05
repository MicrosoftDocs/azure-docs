---
title: include file
description: include file
services: virtual-machines
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 01/22/2019
ms.author: rogarana
ms.custom: include file
---

# What disk types are available in Azure?

Azure managed disks currently offers four disk types, three of which are generally available (GA) and one that is currently in preview. These four disk types each have their own appropriate target customer scenarios.

## Disk comparison

The following table provides a comparison of ultra solid-state-drives (SSD) (preview), premium SSD, standard SSD, and standard hard disk drives (HDD) for managed disks to help you decide what to use.

|   | Ultra SSD (preview)   | Premium SSD   | Standard SSD   | Standard HDD   |
|---------|---------|---------|---------|---------|
|Disk type   |SSD   |SSD   |SSD   |HDD   |
|Scenario   |IO-intensive workloads such as SAP HANA, top tier databases (for example, SQL, Oracle), and other transaction-heavy workloads.   |Production and performance sensitive workloads   |Web servers, lightly used enterprise applications and dev/test   |Backup, non-critical, infrequent access   |
|Disk size   |65,536 gibibyte (GiB) (Preview)   |4,095 GiB (GA), 32,767 GiB (Preview)    |4,095 (GA) GiB, 32,767 GiB (Preview)   |4,095 GiB (GA), 32,767 GiB (Preview)   |
|Max throughput   |2,000 MiB/s (Preview)   |250 (GA) MiB/s, 750 MiB/s (Preview)   |60 MiB/s (GA), 500 MiB/s (Preview)   |60 Mib/s (GA), 500 MiB/s (Preview)   |
|Max IOPS   |160,000 (Preview)   |7500 (GA), 20,000 (Preview)   |500 (GA), 2,000 (Preview)   |500 (GA), 2,000 (Preview)   |

## Ultra SSD (preview)

Azure ultra SSD (preview) deliver high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. Some additional benefits of ultra SSD include the ability to dynamically change the performance of the disk, along with your workloads, without the need to restart your virtual machines. Ultra SSD are suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads. Ultra SSD can only be used as data disks. We recommend using premium SSDs as OS disks.

### Performance

When you provision an ultra disk, you can independently configure the capacity and the performance of the disk. Ultra SSD come in several fixed sizes, ranging from 4 GiB up to 64 TiB, and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput.

Some key capabilities of Ultra SSD are:

- Disk capacity: Ultra SSD capacity ranges from 4 GiB up to 64 TiB.
- Disk IOPS: Ultra SSD support IOPS limits of 300 IOPS/GiB, up to a maximum of 160 K IOPS per disk. To achieve the IOPS that you provisioned, ensure that the selected Disk IOPS are less than the VM IOPS. The minimum disk IOPS are 100 IOPS.
- Disk throughput: With ultra SSD, the throughput limit of a single disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 2000 MBps per disk (where MBps = 10^6 Bytes per second). The minimum disk throughput is 1 MiB.

### Disk size

|Disk Size (GiB)  |IOPS Caps  |Throughput Cap (MBps)  |
|---------|---------|---------|
|4     |1,200         |300         |
|8     |2,400         |600         |
|16     |4,800         |1,200         |
|32     |9,600         |2,000         |
|64     |19,200         |2,000         |
|128     |38,400         |2,000         |
|256     |76,800         |2,000         |
|512     |80,000         |2,000         |
|1,024-65,536 (sizes in this range increasing in increments of 1 TiB)     |160,000         |2,000         |

### Preview scope and limitations

During preview, ultra SSD:

- Are supported in East US 2 in a single availability zone  
- Can only be used with availability zones (availability sets and single VM deployments outside of zones will not have the ability to attach an ultra disk)
- Are only supported on ES/DS v3 VMs
- Are only available as data disks and only support 4k physical sector size  
- Can only be created as empty disks  
- Currently can only be deployed using Azure Resource Manager templates, CLI, and the python SDK.
- Does not yet support disk snapshots, VM images, availability sets, virtual machine scale sets, and Azure disk encryption.
- Does not yet support integration with Azure Backup or Azure Site Recovery.
- As with [most previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), this feature should not be used for production workloads until general availability (GA).

## Premium SSD

Azure premium SSDs deliver high-performance and low-latency disk support for virtual machines (VMs) with input/output (IO)-intensive workloads. To take advantage of the speed and performance of premium storage disks, you can migrate existing VM disks to Premium SSDs. Premium SSDs are suitable for mission-critical production applications.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Premium SSD sizes  | P4               | P6               | P10             | P15 | P20              | P30              | P40              | P50              | P60*              | P70*              | P80*              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB           | 32             | 64             | 128            | 256  | 512            | 1,024    | 2,048     | 4,095    | 8,192     | 16,384     | 32,767     |
| IOPS per disk       | Up to 120 | Up to 240              | Up to 500              | Up to 1,100 | Up to 2,300              | Up to 5,000              | Up to 7,500             | Up to 7,500              | Up to 12,500              | Up to 15,000              | Up to 20,000              |
| Throughput per disk | Up to 25 MiB/sec | Up to 50 MiB/sec | Up to 100 MiB/sec | Up to 125 MiB/sec | Up to 150 MiB/sec | Up to 200 MiB/sec | Up to 250 MiB/sec | Up to 250 MiB/sec| Up to 480 MiB/sec | Up to 750 MiB/sec | Up to 750 MiB/sec |

## Standard SSD

Azure standard SSDs are a cost-effective storage option optimized for workloads that need consistent performance at lower IOPS levels. Standard SSD offers a good entry level experience for those who wish to move to the cloud, especially if you experience issues with the variance of workloads running on your HDD solutions on premises. Standard SSDs deliver better availability, consistency, reliability, and latency compared to HDD disks. Standard SSDs are suitable for Web servers, low IOPS application servers, lightly used enterprise applications, and Dev/Test workloads.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Standard SSD sizes  | E4                   | E6                   | E10               | E15               | E20             | E30 | E40              | E50              | E60*              | E70*              | E80*              |
|---------------------|---------------------|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB           | 32             | 64             | 128             | 256             | 512            | 1,024  | 2,048            | 4,095     | 8,192     | 16,384     | 32,767    |
| IOPS per disk       | Up to 120              | Up to 240              | Up to 500              | Up to 500              | Up to 500              | Up to 500 | Up to 500              | Up to 500              | Up to 500             | Up to 500              | Up to 1,300              | Up to 2,000              | Up to 2,000              |
| Throughput per disk |  Up to 25 MiB/sec  |  Up to 50 MiB/sec  |  Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec| Up to 300 MiB/sec |  Up to 500 MiB/sec | Up to 500 MiB/sec |

## Standard HDD

Azure standard HDDs deliver reliable, low-cost disk support for VMs running latency-insensitive workloads. It also supports blobs, tables, queues, and files. With standard storage, the data is stored on hard disk drives (HDDs). When working with VMs, you can use standard SSD and HDD disks for dev/test scenarios and less critical workloads. Standard storage is available in all Azure regions.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Standard Disk Type  | S4               | S6               | S10             | S15 | S20              | S30              | S40              | S50              | S60*              | S70*              | S80*              |
|---------------------|---------------------|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size in GiB          | 32             | 64             | 128            | 256  | 512            | 1,024    | 2,048     | 4,095    | 8,192     | 16,384     | 32,767     |
| IOPS per disk       | Up to 500              | Up to 500              | Up to 500              | Up to 500 | Up to 500              | Up to 500              | Up to 500             | Up to 500              | Up to 1,300              | Up to 2,000              | Up to 2,000              |
| Throughput per disk | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec| Up to 300 MiB/sec | Up to 500 MiB/sec | Up to 500 MiB/sec |

## Billing

When using managed disks, the following billing considerations apply:

- Disk type
- managed disk Size
- Snapshots
- Outbound data transfers
- Number of transactions

**Managed disk size**: managed disks are billed on the provisioned size. Azure maps the provisioned size (rounded up) to the nearest offered disk size. For details of the disk sizes offered, see the previous tables. Each disk maps to a supported provisioned disk size offering and is billed accordingly. For example, if you provisioned a 200 GiB Standard SSD, it maps to the disk size offer of E15 (256 GiB). Billing for any provisioned disk is prorated hourly by using the monthly price for the Premium Storage offer. For example, if you provisioned an E10 disk and deleted it after 20 hours, you're billed for the E10 offering prorated to 20 hours. This is regardless of the amount of actual data written to the disk.

**Snapshots**: Snapshots are billed based on the size used. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GiB and actual used data size of 10 GiB, the snapshot is billed only for the used data size of 10 GiB.
