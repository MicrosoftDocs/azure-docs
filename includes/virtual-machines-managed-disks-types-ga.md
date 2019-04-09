---
title: include file
description: include file
services: virtual-machines
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 03/13/2019
ms.author: rogarana
ms.custom: include file
---

## Premium SSD

Azure premium SSDs deliver high-performance and low-latency disk support for virtual machines (VMs) with input/output (IO)-intensive workloads. To take advantage of the speed and performance of premium storage disks, you can migrate existing VM disks to Premium SSDs. Premium SSDs are suitable for mission-critical production applications.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Premium SSD sizes | P4 | P6 | P10 | P15 | P20 | P30 | P40 | P50 | P60* | P70* | P80* |
|-------------------|----|----|-----|-----|-----|-----|-----|-----|------|------|------|
| Disk size in GiB | 32 | 64 | 128 | 256 | 512 | 1,024 | 2,048 | 4,095 | 8,192 | 16,384 | 32,767 |
| IOPS per disk | Up to 120 | Up to 240 | Up to 500 | Up to 1,100 | Up to 2,300 | Up to 5,000 | Up to 7,500 | Up to 7,500 | Up to 12,500 | Up to 15,000 | Up to 20,000 |
| Throughput per disk | Up to 25 MiB/sec | Up to 50 MiB/sec | Up to 100 MiB/sec | Up to 125 MiB/sec | Up to 150 MiB/sec | Up to 200 MiB/sec | Up to 250 MiB/sec | Up to 250 MiB/sec| Up to 480 MiB/sec | Up to 750 MiB/sec | Up to 750 MiB/sec |

## Standard SSD

Azure standard SSDs are a cost-effective storage option optimized for workloads that need consistent performance at lower IOPS levels. Standard SSD offers a good entry level experience for those who wish to move to the cloud, especially if you experience issues with the variance of workloads running on your HDD solutions on premises. Standard SSDs deliver better availability, consistency, reliability, and latency compared to HDD disks. Standard SSDs are suitable for Web servers, low IOPS application servers, lightly used enterprise applications, and Dev/Test workloads.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Standard SSD sizes | E4 | E6 | E10 | E15 | E20 | E30 | E40 | E50 | E60* | E70* | E80* |
|--------------------|----|----|-----|-----|-----|-----|-----|-----|------|------|------|
| Disk size in GiB | 32 | 64 | 128 | 256 | 512 | 1,024 | 2,048 | 4,095 | 8,192 | 16,384 | 32,767 |
| IOPS per disk | Up to 120 | Up to 240 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 1,300 | Up to 2,000 | Up to 2,000 |
| Throughput per disk |  Up to 25 MiB/sec |  Up to 50 MiB/sec  |  Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec | Up to 60 MiB/sec| Up to 300 MiB/sec |  Up to 500 MiB/sec | Up to 500 MiB/sec |

## Standard HDD

Azure standard HDDs deliver reliable, low-cost disk support for VMs running latency-insensitive workloads. It also supports blobs, tables, queues, and files. With standard storage, the data is stored on hard disk drives (HDDs). When working with VMs, you can use standard SSD and HDD disks for dev/test scenarios and less critical workloads. Standard storage is available in all Azure regions.

### Disk size

Sizes marked with an asterisk are currently in preview.

| Standard Disk Type | S4 | S6 | S10 | S15 | S20 | S30 | S40 | S50 | S60* | S70* | S80* |
|--------------------|----|----|-----|-----|-----|-----|-----|-----|------|------|------|
| Disk size in GiB | 32 | 64 | 128 | 256 | 512 | 1,024 | 2,048 | 4,095 | 8,192 | 16,384 | 32,767 |
| IOPS per disk | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 500 | Up to 1,300 | Up to 2,000 | Up to 2,000 |
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