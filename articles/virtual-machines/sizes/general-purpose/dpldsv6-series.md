---
title: Dpldsv6 size series
description: Information on and specifications of the Dpldsv6-series sizes
author: tomvcassidy
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 05/09/2024
ms.author: tomcassidy
ms.reviewer: tomcassidy
---

# Dpldsv6 sizes series

[!INCLUDE [dpldsv6-summary](./includes/dpldsv6-summary.md)]

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_D2plds_v6 | 2 | 4 |
| Standard_D4plds_v6 | 4 | 8 |
| Standard_D8plds_v6 | 8 | 16 |
| Standard_D16plds_v6 | 16 | 32 |
| Standard_D32plds_v6 | 32 | 34 |
| Standard_D48plds_v6 | 48 | 96 |
| Standard_D64plds_v6 | 64 | 128 |
| Standard_D96plds_v6 | 96 | 192 |

#### VM Basics resources
- [What are vCPUs (Qty.)](https://learn.microsoft.com/azure/virtual-machines/managed-disks-overview)
- [Check vCPU quotas](https://learn.microsoft.com/azure/virtual-machines/quotas)
- [Introduction to Azure compute units (ACUs)](https://learn.microsoft.com/azure/virtual-machines/acu)

### [Storage](#tab/sizestorage)

Data disks and Temp storage info for each size

| Size Name | Max Data Disks | Temp-Read-Only-Storage-IOPS | Temp-Read-Only-Storage-Speed-MBps | Temp-Read-Write-Storage-IOPS | Temp-Read-Write-Storage-Speed-MBps | Temp Storage Size (GB) | Uncached-Max IOPS | Uncached-Disk Speed (MBps) | Uncached-Burst-Max IOPS | Uncached-Burst-Disk Speed (MBps) | Uncached-Ultra-Disk-and-Premium-SSD-V2-IOPS | Uncached-Ultra-Disk-and-Premium-SSD-V2-Speed-MBps | Uncached-Burst-Ultra-Disk-and-Premium-SSD-V2-IOPS | Uncached-Burst-Ultra-Disk-and-Premium-SSD-V2-Speed-MBps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_D2plds_v6 | 8 | 37500 | 180 | 15000 | 90 | 1 x 110 | 3750 | 106 | 10000 | 1250 | 4163 | 124 | 11100 | 1463 |
| Standard_D4plds_v6 | 12 | 75000 | 360 | 30000 | 180 | 1 x 220 | 6400 | 212 | 20000 | 1250 | 8333 | 248 | 26040 | 1463 |
| Standard_D8plds_v6 | 24 | 150000 | 720 | 60000 | 360 | 1 x 440 | 12800 | 424 | 20000 | 1250 | 16666 | 496 | 26040 | 1463 |
| Standard_D16plds_v6 | 48 | 300000 | 1440 | 120000 | 720 | 2 x 440 | 25600 | 848 | 40000 | 1250 | 33331 | 992 | 52080 | 1463 |
| Standard_D32plds_v6 | 64 | 600000 | 2880 | 240000 | 1440 | 4 x 440 | 51200 | 1696 | 80000 | 2000 | 66662 | 1984 | 104160 | 2340 |
| Standard_D48plds_v6 | 64 | 900000 | 4320 | 360000 | 2160 | 6 x 440 | 76800 | 2544 | 80000 | 3000 | 99994 | 2976 | 104160 | 3510 |
| Standard_D64plds_v6 | 64 | 1200000 | 5760 | 480000 | 2880 | 4 x 880 | 102400 | 3392 | 102400 | 3392 | 133325 | 3969 | 133325 | 4680 |
| Standard_D96plds_v6 | 64 | 1800000 | 8640 | 720000 | 4320 | 6 x 880 | 153600 | 5000 | 153600 | 5000 | 199987 | 5850 | 199987 | 5953 |

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
| Standard_D2plds_v6 | 2 | 12500 |
| Standard_D4plds_v6 | 2 | 12500 |
| Standard_D8plds_v6 | 4 | 15000 |
| Standard_D16plds_v6 | 8 | 15000 |
| Standard_D32plds_v6 | 8 | 20000 |
| Standard_D48plds_v6 | 8 | 30000 |
| Standard_D64plds_v6 | 8 | 40000 |
| Standard_D96plds_v6 | 8 | 60000 |

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
| Standard_D2plds_v6 | 2 | 4 |
| Standard_D4plds_v6 | 4 | 8 |
| Standard_D8plds_v6 | 8 | 16 |
| Standard_D16plds_v6 | 16 | 32 |
| Standard_D32plds_v6 | 32 | 34 |
| Standard_D48plds_v6 | 48 | 96 |
| Standard_D64plds_v6 | 64 | 128 |
| Standard_D96plds_v6 | 96 | 192 |

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
