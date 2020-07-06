---
title: include file
description: include file
services: virtual-machines
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 06/03/2020
ms.author: rogarana
ms.custom: include file
---



Azure managed disks currently offers four disk types, each type is aimed towards specific customer scenarios.

## Disk comparison

The following table provides a comparison of ultra disks, premium solid-state drives (SSD), standard SSD, and standard hard disk drives (HDD) for managed disks to help you decide what to use.

|   | Ultra disk   | Premium SSD   | Standard SSD   | Standard HDD   |
|---------|---------|---------|---------|---------|
|Disk type   |SSD   |SSD   |SSD   |HDD   |
|Scenario   |IO-intensive workloads such as [SAP HANA](../articles/virtual-machines/workloads/sap/hana-vm-operations-storage.md), top tier databases (for example, SQL, Oracle), and other transaction-heavy workloads.   |Production and performance sensitive workloads   |Web servers, lightly used enterprise applications and dev/test   |Backup, non-critical, infrequent access   |
|Max disk size   |65,536 gibibyte (GiB)    |32,767 GiB    |32,767 GiB   |32,767 GiB   |
|Max throughput   |2,000 MB/s    |900 MB/s   |750 MB/s   |500 MB/s   |
|Max IOPS   |160,000    |20,000   |6,000   |2,000   |

## Ultra disk

Azure ultra disks deliver high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. Some additional benefits of ultra disks include the ability to dynamically change the performance of the disk, along with your workloads, without the need to restart your virtual machines (VM). Ultra disks are suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads. Ultra disks can only be used as data disks. We recommend using premium SSDs as OS disks.

### Performance

When you provision an ultra disk, you can independently configure the capacity and the performance of the disk. Ultra disks come in several fixed sizes, ranging from 4 GiB up to 64 TiB, and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput.

Some key capabilities of ultra disks are:

- Disk capacity: Ultra disks capacity ranges from 4 GiB up to 64 TiB.
- Disk IOPS: Ultra disks support IOPS limits of 300 IOPS/GiB, up to a maximum of 160 K IOPS per disk. To achieve the IOPS that you provisioned, ensure that the selected Disk IOPS are less than the VM IOPS limit. The minimum guaranteed IOPS per disk is 2 IOPS/GiB, with an overall baseline minimum of 100 IOPS. For example, if you had a 4 GiB ultra disk, you will have a minimum of 100 IOPS, instead of eight IOPS.
- Disk throughput: With ultra disks, the throughput limit of a single disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 2000 MBps per disk (where MBps = 10^6 Bytes per second). The minimum guaranteed throughput per disk is 4KiB/s for each provisioned IOPS, with an overall baseline minimum of 1 MBps.
- Ultra disks support adjusting the disk performance attributes (IOPS and throughput) at runtime without detaching the disk from the virtual machine. Once a disk performance resize operation has been issued on a disk, it can take up to an hour for the change to actually take effect. There is a limit of four performance resize operations during a 24 hour window. It is possible for a performance resize operation to fail due to a lack of performance bandwidth capacity.

### Disk size

|Disk Size (GiB)  |IOPS Cap  |Throughput Cap (MBps)  |
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

### GA scope and limitations

[!INCLUDE [managed-disks-ultra-disks-GA-scope-and-limitations](managed-disks-ultra-disks-GA-scope-and-limitations.md)]
