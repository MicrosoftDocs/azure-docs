---
title: Ddsv4 size series
description: Information on and specifications of the Ddsv4-series sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 07/29/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
---

# Ddsv4 sizes series

[!INCLUDE [ddsv4-summary](./includes/ddsv4-series-summary.md)]

## Host specifications
[!INCLUDE [ddsv4-series-specs](./includes/ddsv4-series-specs.md)]

## Feature support

Premium Storage: Supported<br>
Premium Storage caching: Supported<br>
Live Migration: Supported<br>
Memory Preserving Updates: Supported<br>
VM Generation Support: Generation 1 and 2<br>
Accelerated Networking: Supported<br>
Ephemeral OS Disks: Supported<br>
Nested Virtualization: Supported<br>

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_D2ds_v4 | 2 | 8 |
| Standard_D4ds_v4 | 4 | 16 |
| Standard_D8ds_v4 | 8 | 32 |
| Standard_D16ds_v4 | 16 | 64 |
| Standard_D32ds_v4 | 32 | 128 |
| Standard_D48ds_v4 | 48 | 192 |
| Standard_D64ds_v4 | 64 | 256 |

#### VM Basics resources
- [What are vCPUs](../../../virtual-machines/managed-disks-overview.md)
- [Check vCPU quotas](../../../virtual-machines/quotas.md)

### [Local Storage](#tab/sizestoragelocal)

Local (temp) storage info for each size

| Size Name | Max Temp Storage Disks (Qty.) | Temp Disk Size (GiB) | Temp Disk Random Read (RR)<sup>1</sup> IOPS | Temp Disk Random Read (RR)<sup>1</sup> Speed (MBps) | Temp Disk Random Write (RW)<sup>1</sup> IOPS | Temp Disk Random Write (RW)<sup>1</sup> Speed (MBps) |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D2ds_v42 | 1 | 75 | 9000 | 125 |  |  |
| Standard_D4ds_v4 | 1 | 150 | 19000 | 250 |  |  |
| Standard_D8ds_v4 | 1 | 300 | 38000 | 500 |  |  |
| Standard_D16ds_v4 | 1 | 600 | 85000 | 1000 |  |  |
| Standard_D32ds_v4 | 1 | 1200 | 150000 | 2000 |  |  |
| Standard_D48ds_v4 | 1 | 1800 | 225000 | 3000 |  |  |
| Standard_D64ds_v4 | 1 | 2400 | 300000 | 4000 |  |  |

#### Storage resources
- [Introduction to Azure managed disks](../../../virtual-machines/managed-disks-overview.md)
- [Azure managed disk types](../../../virtual-machines/disks-types.md)
- [Share an Azure managed disk](../../../virtual-machines/disks-shared.md)

#### Table definitions
- <sup>1</sup>Temp disk speed often differs between RR (Random Read) and RW (Random Write) operations. RR operations are typically faster than RW operations. The RW speed is usually slower than the RR speed on series where only the RR speed value is listed.
- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](../../../virtual-machines/disks-performance.md).

### [Remote Storage](#tab/sizestorageremote)

Remote (uncached) storage info for each size

| Size Name | Max Remote Storage Disks (Qty.) | Uncached Disk IOPS | Uncached Disk Speed (MBps) | Uncached Disk Burst<sup>1</sup> IOPS | Uncached Disk Burst<sup>1</sup> Speed (MBps) | Uncached Special<sup>2</sup> Disk IOPS | Uncached Special<sup>2</sup> Disk Speed (MBps) | Uncached Burst<sup>1</sup> Special<sup>2</sup> Disk IOPS | Uncached Burst<sup>1</sup> Special<sup>2</sup> Disk Speed (MBps) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_D2ds_v42 | 4 | 3200 | 48 | 4000 | 200 |  |  |  |  |
| Standard_D4ds_v4 | 8 | 6400 | 96 | 8000 | 200 |  |  |  |  |
| Standard_D8ds_v4 | 16 | 12800 | 192 | 16000 | 400 |  |  |  |  |
| Standard_D16ds_v4 | 32 | 25600 | 384 | 32000 | 800 |  |  |  |  |
| Standard_D32ds_v4 | 32 | 51200 | 768 | 64000 | 1600 |  |  |  |  |
| Standard_D48ds_v4 | 32 | 76800 | 1152 | 80000 | 2000 |  |  |  |  |
| Standard_D64ds_v4 | 32 | 80000 | 1200 | 80000 | 2000 |  |  |  |  |

#### Storage resources
- [Introduction to Azure managed disks](../../../virtual-machines/managed-disks-overview.md)
- [Azure managed disk types](../../../virtual-machines/disks-types.md)
- [Share an Azure managed disk](../../../virtual-machines/disks-shared.md)

#### Table definitions
- <sup>1</sup>Some sizes support [bursting](../../disk-bursting.md) to temporarily increase disk performance. Burst speeds can be maintained for up to 30 minutes at a time.
- <sup>2</sup>Special Storage refers to either [Ultra Disk](../../../virtual-machines/disks-enable-ultra-ssd.md) or [Premium SSD v2](../../../virtual-machines/disks-deploy-premium-v2.md) storage.
- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to ReadOnly or ReadWrite. For uncached data disk operation, the host cache mode is set to None.
- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](../../../virtual-machines/disks-performance.md).


### [Network](#tab/sizenetwork)

Network interface info for each size

| Size Name | Max NICs (Qty.) | Max Bandwidth (Mbps) |
| --- | --- | --- |
| Standard_D2ds_v42 | 2 | 5000 |
| Standard_D4ds_v4 | 2 | 10000 |
| Standard_D8ds_v4 | 4 | 12500 |
| Standard_D16ds_v4 | 8 | 12500 |
| Standard_D32ds_v4 | 8 | 16000 |
| Standard_D48ds_v4 | 8 | 24000 |
| Standard_D64ds_v4 | 8 | 30000 |

#### Networking resources
- [Virtual networks and virtual machines in Azure](../../../virtual-network/network-overview.md)
- [Virtual machine network bandwidth](../../../virtual-network/virtual-machine-network-throughput.md)

#### Table definitions
- Expected network bandwidth is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see [Virtual machine network bandwidth](../../../virtual-network/virtual-machine-network-throughput.md)
- Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance will depend on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimize network throughput for Azure virtual machines](../../../virtual-network/virtual-network-optimize-network-bandwidth.md). 
-  To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see [Bandwidth/Throughput testing (NTTTCP)](../../../virtual-network/virtual-network-bandwidth-testing.md).

### [Accelerators](#tab/sizeaccelerators)

Accelerator (GPUs, FPGAs, etc.) info for each size

> [!NOTE]
> No accelerators are present in this series.

---

[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]
