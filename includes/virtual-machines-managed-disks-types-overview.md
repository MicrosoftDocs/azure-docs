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
|Disk size   |65,536 gibibyte (GiB) (Preview)   |32,767 GiB    |32,767 GiB   |32,767 GiB   |
|Max throughput   |2,000 MiB/s (Preview)   |900 MiB/s   |750 MiB/s   |500 MiB/s   |
|Max IOPS   |160,000 (Preview)   |20,000   |6,000   |2,000   |

## Ultra SSD (preview)

Azure ultra SSD (preview) delivers high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. Some additional benefits of ultra SSD include the ability to dynamically change the performance of the disk, along with your workloads, without the need to restart your virtual machines. Ultra SSDs are suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads. Ultra SSD can only be used as data disks. We recommend using premium SSDs as OS disks.

### Performance

When you provision an ultra disk, you can independently configure the capacity and the performance of the disk. Ultra SSD come in several fixed sizes, ranging from 4 GiB up to 64 TiB, and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput.

Some key capabilities of Ultra SSD are:

- Disk capacity: Ultra SSD capacity ranges from 4 GiB up to 64 TiB.
- Disk IOPS: Ultra SSD support IOPS limits of 300 IOPS/GiB, up to a maximum of 160 K IOPS per disk. To achieve the IOPS that you provisioned, ensure that the selected Disk IOPS are less than the VM IOPS. The minimum disk IOPS are 100 IOPS.
- Disk throughput: With ultra SSD, the throughput limit of a single disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 2000 MBps per disk (where MBps = 10^6 Bytes per second). The minimum disk throughput is 1 MiB.
- Ultra SSDs support adjusting the disk performance attributes (IOPS and throughput) at runtime without detaching the disk from the virtual machine. Once a disk performance resize operation has been issued on a disk, it can take up to an hour for the change to actually take effect.

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

### Transactions

For ultra SSDs, each I/O operation less than or equal to 256 KiB of throughput is considered a single I/O operation. I/O operations larger than 256 KiB of throughput are considered multiple I/Os of size 256 KiB.

### Preview scope and limitations

During preview, ultra SSD:

- Are supported in East US 2 in a single availability zone  
- Can only be used with availability zones (availability sets and single VM deployments outside of zones will not have the ability to attach an ultra disk)
- Are only supported on ES/DS v3 VMs
- Are only available as data disks and only support 4k physical sector size  
- Can only be created as empty disks  
- Currently can only be deployed using Azure Resource Manager templates, CLI, PowerShell, and the Python SDK.
- Cannot be deployed with the Azure portal (yet).
- Does not yet support disk snapshots, VM images, availability sets, virtual machine scale sets, and Azure disk encryption.
- Does not yet support integration with Azure Backup or Azure Site Recovery.
- As with [most previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), this feature should not be used for production workloads until general availability (GA).
