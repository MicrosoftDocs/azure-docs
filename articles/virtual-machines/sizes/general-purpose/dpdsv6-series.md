---
title: Dpdsv6 size series
description: Information on and specifications of the Dpdsv6-series sizes
author: tomvcassidy
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 05/09/2024
ms.author: tomcassidy
ms.reviewer: tomcassidy
---

# Dpdsv6 sizes series

[!INCLUDE [dpdsv6-summary](./includes/dpdsv6-summary.md)]

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_D2pds_v6 | 2 | 8 |
| Standard_D4pds_v6 | 4 | 16 |
| Standard_D8pds_v6 | 8 | 332 |
| Standard_D16pds_v6 | 16 | 64 |
| Standard_D32pds_v6 | 32 | 128 |
| Standard_D48pds_v6 | 48 | 192 |
| Standard_D64pds_v6 | 64 | 256 |
| Standard_D96pds_v6 | 96 | 384 |

#### VM Basics resources
- [What are vCPUs (Qty.)](https://learn.microsoft.com/azure/virtual-machines/managed-disks-overview)
- [Check vCPU quotas](https://learn.microsoft.com/azure/virtual-machines/quotas)
- [Introduction to Azure compute units (ACUs)](https://learn.microsoft.com/azure/virtual-machines/acu)

### [Storage](#tab/sizestorage)

Data disks and Temp storage info for each size

| Size Name | Temp-Read-Only-Storage-IOPS | Temp-Read-Only-Storage-Speed-MBps | Temp-Read-Write-Storage-IOPS | Temp-Read-Write-Storage-Speed-MBps | Uncached-Max IOPS | Uncached-Disk Speed (MBps) | Temp Storage Size (GB) | Uncached-Burst-Max IOPS | Uncached-Burst-Disk Speed (MBps) | Uncached-Ultra-Disk-and-Premium-SSD-V2-Storage-IOPS | Uncached-Ultra-Disk-and-Premium-SSD-V2-Storage-Speed-MBps | Uncached-Burst-Ultra-Disk-and-Premium-SSD-V2-Storage-IOPS | Uncached-Burst-Ultra-Disk-and-Premium-SSD-V2-Storage-Speed-MBps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_D2pds_v6 | 37500 | 180 | 15000 | 90 | 3750 | 106 | 1 x 110 | 10000 | 1250 | 4163 | 124 | 11110 | 1463 |
| Standard_D4pds_v6 | 75000 | 360 | 30000 | 180 | 3400 | 212 | 1 x 220 | 20000 | 1250 | 8333 | 248 | 26040 | 1463 |
| Standard_D8pds_v6 | 150000 | 720 | 60000 | 360 | 12800 | 424 | 1 x 440 | 20000 | 1250 | 16666 | 496 | 26040 | 1463 |
| Standard_D16pds_v6 | 300000 | 1440 | 120000 | 720 | 25600 | 848 | 2 x 440 | 40000 | 1250 | 33331 | 992 | 52080 | 1463 |
| Standard_D32pds_v6 | 600000 | 2880 | 240000 | 1440 | 51200 | 1696 | 4 x 440 | 80000 | 2000 | 66662 | 1984 | 104160 | 2340 |
| Standard_D48pds_v6 | 900000 | 4320 | 360000 | 2160 | 76800 | 2544 | 6 x 440 | 80000 | 3000 | 99994 | 2976 | 104160 | 3510 |
| Standard_D64pds_v6 | 1200000 | 5760 | 480000 | 2880 | 102400 | 3392 | 4 x 880 | 102400 | 3392 | 133325 | 3969 | 133325 | 4680 |
| Standard_D96pds_v6 | 1800000 | 8640 | 720000 | 4320 | 153600 | 5000 | 6 x 880 | 153600 | 5000 | 199987 | 5850 | 199987 | 5953 |

#### Storage resources
- [Introduction to Azure managed disks](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview)
- [Azure managed disk types](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types)
- [Share an Azure managed disk](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-shared)

#### Table definitions
- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to ReadOnly or ReadWrite. For uncached data disk operation, the host cache mode is set to None.
- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-performance).

### [Network](#tab/sizenetwork)

Network interface info for each size

| Size Name | Max NICs (Qty.) | Max Bandwidth (Mbps) |
| --- | --- | --- |
| Standard_D2pds_v6 | 2 | 12500 |
| Standard_D4pds_v6 | 2 | 12500 |
| Standard_D8pds_v6 | 4 | 15000 |
| Standard_D16pds_v6 | 8 | 15000 |
| Standard_D32pds_v6 | 8 | 20000 |
| Standard_D48pds_v6 | 8 | 30000 |
| Standard_D64pds_v6 | 8 | 40000 |
| Standard_D96pds_v6 | 8 | 60000 |

#### Networking resources
- [Virtual networks and virtual machines in Azure](https://learn.microsoft.com/azure/virtual-network/network-overview)
- [Virtual machine network bandwidth](https://learn.microsoft.com/azure/virtual-network/virtual-machine-network-throughput)

#### Table definitions
- Expected network bandwidth is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see [Virtual machine network bandwidth](https://learn.microsoft.com/azure/virtual-network/virtual-machine-network-throughput)
- Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance will depend on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimize network throughput for Azure virtual machines](https://learn.microsoft.com/azure/virtual-network/virtual-network-optimize-network-bandwidth). 
-  To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see [Bandwidth/Throughput testing (NTTTCP)](https://learn.microsoft.com/azure/virtual-network/virtual-network-bandwidth-testing).

### [Accelerators](#tab/sizeaccelerators)

Accelerator (GPUs, FPGAs, etc.) info for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_D2pds_v6 | 2 | 8 |
| Standard_D4pds_v6 | 4 | 16 |
| Standard_D8pds_v6 | 8 | 332 |
| Standard_D16pds_v6 | 16 | 64 |
| Standard_D32pds_v6 | 32 | 128 |
| Standard_D48pds_v6 | 48 | 192 |
| Standard_D64pds_v6 | 64 | 256 |
| Standard_D96pds_v6 | 96 | 384 |

---

## Feature support

### Supported special features
- Live Migration: Supported

### Feature limitations
- Premium Storage: Not Supported
- Premium Storage caching: Not Supported
- VM Generation Support: Generation 1
- Accelerated Networking: Supported
- Ephemeral OS Disks: Not Supported
- Nested Virtualization: Not Supported

## Next Steps
- Learn more about how [Azure compute units (ACU)](https://learn.microsoft.com/azure/virtual-machines/acu) can help you compare compute performance across Azure SKUs.
- Check out [Azure Dedicated Hosts](https://learn.microsoft.com/azure/virtual-machines/dedicated-hosts) for physical servers able to host one or more virtual machines assigned to one Azure subscription.
- Learn how to [Monitor Azure virtual machines](https://learn.microsoft.comazure/virtual-machines/monitor-vm)
