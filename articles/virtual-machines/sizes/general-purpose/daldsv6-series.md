---
title: Daldsv6 size series
description: Information on and specifications of the Daldsv6-series sizes
author: mattmcinnes
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 07/29/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
---

# Daldsv6 sizes series

>[!NOTE]
>This VM series is currently in **Preview**. See the [Preview Terms Of Use | Microsoft Azure](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

[!INCLUDE [daldsv6-summary](./includes/daldsv6-series-summary.md)]

## Host specifications
[!INCLUDE [daldsv6-series-specs](./includes/daldsv6-series-specs.md)]

## Feature support
[Premium Storage](../../premium-storage-performance.md): Supported <br>[Premium Storage caching](../../premium-storage-performance.md): Supported <br>[Live Migration](../../maintenance-and-updates.md): Not Supported <br>[Memory Preserving Updates](../../maintenance-and-updates.md): Supported <br>[Generation 2 VMs](../../generation-2.md): Supported <br>[Generation 1 VMs](../../generation-2.md): Not Supported <br>[Accelerated Networking](../../../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>[Ephemeral OS Disk](../../ephemeral-os-disks.md): Not Supported <br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_D2alds_v6 | 2 | 4 |
| Standard_D4alds_v6 | 4 | 8 |
| Standard_D8alds_v6 | 8 | 16 |
| Standard_D16alds_v6 | 16 | 32 |
| Standard_D32alds_v6 | 32 | 64 |
| Standard_D48alds_v6 | 48 | 96 |
| Standard_D64alds_v6 | 64 | 128 |
| Standard_D96alds_v6 | 96 | 192 |

#### VM Basics resources
- [Check vCPU quotas](../../../virtual-machines/quotas.md)

### [Local Storage](#tab/sizestoragelocal)

Local (temp) storage info for each size

| Size Name | Max Temp Storage Disks (Qty.) | Temp Disk Size (GiB) | Temp Disk Random Read (RR)<sup>1</sup> IOPS | Temp Disk Random Read (RR)<sup>1</sup> Speed (MBps) | Temp Disk Random Write (RW)<sup>1</sup> IOPS | Temp Disk Random Write (RW)<sup>1</sup> Speed (MBps) |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_D2alds_v6 | 1 | 110 | 37500 | 180 |  |  |
| Standard_D4alds_v6 | 1 | 220 | 75000 | 360 |  |  |
| Standard_D8alds_v6 | 1 | 440 | 150000 | 720 |  |  |
| Standard_D16alds_v6 | 2 | 440 | 300000 | 1440 |  |  |
| Standard_D32alds_v6 | 4 | 440 | 600000 | 2880 |  |  |
| Standard_D48alds_v6 | 6 | 440 | 900000 | 4320 |  |  |
| Standard_D64alds_v6 | 4 | 880 | 1200000 | 5760 |  |  |
| Standard_D96alds_v6 | 6 | 880 | 1800000 | 8640 |  |  |

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
| Standard_D2alds_v6 | 4 | 4000 | 90 | 20000 | 1250 | 4000 | 90 | 20000 | 1250 |
| Standard_D4alds_v6 | 8 | 7600 | 180 | 20000 | 1250 | 7600 | 180 | 20000 | 1250 |
| Standard_D8alds_v6 | 16 | 15200 | 360 | 20000 | 1250 | 15200 | 360 | 20000 | 1250 |
| Standard_D16alds_v6 | 32 | 30400 | 720 | 40000 | 1250 | 30400 | 720 | 40000 | 1250 |
| Standard_D32alds_v6 | 32 | 57600 | 1440 | 80000 | 1700 | 57600 | 1440 | 80000 | 1700 |
| Standard_D48alds_v6 | 32 | 86400 | 2160 | 90000 | 2550 | 86400 | 2160 | 90000 | 2550 |
| Standard_D64alds_v6 | 32 | 115200 | 2880 | 120000 | 3400 | 115200 | 2880 | 120000 | 3400 |
| Standard_D96alds_v6 | 32 | 175000 | 4320 | 175000 | 5090 | 175000 | 4320 | 175000 | 5090 |

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
| Standard_D2alds_v6 | 2 | 12500 |
| Standard_D4alds_v6 | 2 | 12500 |
| Standard_D8alds_v6 | 4 | 12500 |
| Standard_D16alds_v6 | 8 | 16000 |
| Standard_D32alds_v6 | 8 | 20000 |
| Standard_D48alds_v6 | 8 | 28000 |
| Standard_D64alds_v6 | 8 | 36000 |
| Standard_D96alds_v6 | 8 | 40000 |

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
