---
author: MelissaHollingshed
ms.author: mehollin
ms.date: 07/31/2024
ms.topic: how-to
ms.service: azure-virtual-machines
title: SCSI to NVMe for Linux VMs
description: How to convert SCSI to NVMe using Linux
---

# Converting Virtual Machines Running Linux from SCSI to NVMe

In this article, we discuss the process of converting virtual machines (VM) running Linux from SCSI to NVMe storage. By migrating to NVMe, you can take advantage of its improved performance and scalability.

For detailed steps, read about [converting VMs from SCSI to NVMe using Linux](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/converting-virtual-machines-running-linux-from-scsi-to-nvme/ba-p/4162497).

## SCSI vs NVMe

Azure VMs support two types of storage interfaces: Small Computer System Interface (SCSI) and NVMe. The SCSI interface is a legacy standard that provides physical connectivity and data transfer between computers and peripheral devices. NVMe is similar to SCSI in that it provides connectivity and data transfer, but NVMe is a faster and more efficient interface for data transfer between servers and storage systems.

> [!NOTE]
> VMs configured with Trusted Launch can't move from SCSI to NVMe.

### Support for SCSI interface VMs

Azure continues to support the SCSI interface on the versions of VM offerings that provide SCSI storage. However, not all new VM series have SCSI storage as an option going forward.


## What is changing for your VM?
Changing the host interface from SCSI to NVMe won't change the remote storage (OS disk or data disks), but change the way the operating systems sees the disks.

|| SCSI enabled VM | NVMe enabled VM |
|-----------------|-----------------|----------------|
| **OS disk**        | /dev/sda        | /dev/nvme0n1   |
| **Temp Disk**      | /dev/sdb        | /dev/sda       |
| **First Data Disk**| /dev/sdc        | /dev/nvme0n2   |