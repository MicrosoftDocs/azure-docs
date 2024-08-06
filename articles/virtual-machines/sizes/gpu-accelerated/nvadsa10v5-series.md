---
title: NVadsA10_v5 size series
description: Information on and specifications of the NVadsA10_v5-series sizes
author: mattmcinnes
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 07/31/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
---

# NVadsA10_v5 sizes series

[!INCLUDE [nvadsa10_v5-summary](./includes/nvadsa10v5-series-summary.md)]

## Host specifications
[!INCLUDE [nvadsa10v5-series-specs](./includes/nvadsa10v5-series-specs.md)]

## Feature support
[Premium Storage](../../premium-storage-performance.md): Supported <br>[Premium Storage caching](../../premium-storage-performance.md): Supported <br>[Live Migration](../../maintenance-and-updates.md): Supported <br>[Memory Preserving Updates](../../maintenance-and-updates.md): Not Supported <br>[Generation 2 VMs](../../generation-2.md): Supported <br>[Generation 1 VMs](../../generation-2.md): Supported <br>[Accelerated Networking](../../../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>[Ephemeral OS Disk](../../ephemeral-os-disks.md): Supported <br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_NV6ads_A10_v5 | 6 | 55 |
| Standard_NV12ads_A10_v5 | 12 | 110 |
| Standard_NV18ads_A10_v5 | 18 | 220 |
| Standard_NV36ads_A10_v5 | 36 | 440 |
| Standard_NV36adms_A10_v5 | 36 | 880 |
| Standard_NV72ads_A10_v5 | 72 | 880 |

#### VM Basics resources
- [Check vCPU quotas](../../../virtual-machines/quotas.md)

### [Local Storage](#tab/sizestoragelocal)

Local (temp) storage info for each size

| Size Name | Max Temp Storage Disks (Qty.) | Temp Disk Size (GiB) | Temp Disk Random Read (RR)<sup>1</sup> IOPS | Temp Disk Random Read (RR)<sup>1</sup> Speed (MBps) | Temp Disk Random Write (RW)<sup>1</sup> IOPS | Temp Disk Random Write (RW)<sup>1</sup> Speed (MBps) | Local-Special-Disk-Count | Local-Special-Disk-Size-GB | Local-Special-Disk-RR-IOPS | Local-Special-Disk-RR-MBps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NV6ads_A10_v5 | 1 | 180 |  |  |  |  |  |  |  |  |
| Standard_NV12ads_A10_v5 | 1 | 360 |  |  |  |  |  |  |  |  |
| Standard_NV18ads_A10_v5 | 1 | 720 |  |  |  |  |  |  |  |  |
| Standard_NV36ads_A10_v5 | 1 | 1440 |  |  |  |  |  |  |  |  |
| Standard_NV36adms_A10_v5 | 1 | 2880 |  |  |  |  |  |  |  |  |
| Standard_NV72ads_A10_v5 | 1 | 2880 |  |  |  |  |  |  |  |  |

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
| Standard_NV6ads_A10_v5 | 4 | 6400 | 100 |  |  |  |  |  |  |
| Standard_NV12ads_A10_v5 | 4 | 12800 | 200 |  |  |  |  |  |  |
| Standard_NV18ads_A10_v5 | 8 | 25600 | 384 |  |  |  |  |  |  |
| Standard_NV36ads_A10_v5 | 16 | 51200 | 768 |  |  |  |  |  |  |
| Standard_NV36adms_A10_v5 | 32 | 51200 | 768 |  |  |  |  |  |  |
| Standard_NV72ads_A10_v5 | 32 | 80000 | 1200 |  |  |  |  |  |  |

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
| Standard_NV6ads_A10_v5 | 1 | 5000 |
| Standard_NV12ads_A10_v5 | 2 | 10000 |
| Standard_NV18ads_A10_v5 | 4 | 20000 |
| Standard_NV36ads_A10_v5 | 4 | 40000 |
| Standard_NV36adms_A10_v5 | 8 | 80000 |
| Standard_NV72ads_A10_v5 | 8 | 80000 |

#### Networking resources
- [Virtual networks and virtual machines in Azure](../../../virtual-network/network-overview.md)
- [Virtual machine network bandwidth](../../../virtual-network/virtual-machine-network-throughput.md)

#### Table definitions
- Expected network bandwidth is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see [Virtual machine network bandwidth](../../../virtual-network/virtual-machine-network-throughput.md)
- Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance will depend on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimize network throughput for Azure virtual machines](../../../virtual-network/virtual-network-optimize-network-bandwidth.md). 
-  To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see [Bandwidth/Throughput testing (NTTTCP)](../../../virtual-network/virtual-network-bandwidth-testing.md).

### [Accelerators](#tab/sizeaccelerators)

Accelerator (GPUs, FPGAs, etc.) info for each size

| Size Name | Accelerators (Qty.) | Accelerator-Memory (GB) |
| --- | --- | --- |
| Standard_NV6ads_A10_v5 | 1/6 | 4 |
| Standard_NV12ads_A10_v5 | 1/3 | 8 |
| Standard_NV18ads_A10_v5 | 1/2 | 12 |
| Standard_NV36ads_A10_v5 | 1 | 24 |
| Standard_NV36adms_A10_v5 | 1 | 24 |
| Standard_NV72ads_A10_v5 | 2 | 48 |

---

[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]
