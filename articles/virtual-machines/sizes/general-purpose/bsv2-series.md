---
title: Bsv2 size series
description: Information on and specifications of the Bsv2-series sizes
author: mattmcinnes
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 07/29/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
---

# Bsv2 sizes series

[!INCLUDE [bsv2-summary](./includes/bsv2-series-summary.md)]

## Host specifications
[!INCLUDE [bsv2-series-specs](./includes/bsv2-series-specs.md)]

## Feature support
[Premium Storage](../../premium-storage-performance.md): Supported <br>[Premium Storage caching](../../premium-storage-performance.md): Supported <br>[Live Migration](../../maintenance-and-updates.md): Supported <br>[Memory Preserving Updates](../../maintenance-and-updates.md): Supported <br>[Generation 2 VMs](../../generation-2.md): Supported <br>[Generation 1 VMs](../../generation-2.md): Not Supported <br>[Accelerated Networking](../../../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>[Ephemeral OS Disk](../../ephemeral-os-disks.md): Not Supported <br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_B2ts_v2 | 2 | 1 |
| Standard_B2ls_v2 | 2 | 4 |
| Standard_B2s_v2 | 2 | 8 |
| Standard_B4ls_v2 | 4 | 8 |
| Standard_B4s_v2 | 4 | 16 |
| Standard_B8ls_v2 | 8 | 16 |
| Standard_B8s_v2 | 8 | 32 |
| Standard_B16ls_v2 | 16 | 32 |
| Standard_B16s_v2 | 16 | 64 |
| Standard_B32ls_v2 | 32 | 64 |
| Standard_B32s_v2 | 32 | 128 |

#### VM Basics resources
- [Check vCPU quotas](../../../virtual-machines/quotas.md)


### [CPU Burst](#tab/sizeburstdata)

Base CPU performance, Credits, and other CPU bursting related info

| Size Name | Base CPU Performance Percentage | Initial Credits (Qty.) | Credits banked/hour (Qty.) | Max Banked Credits (Qty.) |
| --- | --- | --- | --- | --- |
| Standard_B2ts_v2  | 20% | 60  | 24  | 576 |
| Standard_B2ls_v2  | 30% | 60  | 36  | 864 |
| Standard_B2s_v2   | 40% | 60  | 48  | 1152 |
| Standard_B4ls_v2  | 30% | 120 | 72  | 1728 |
| Standard_B4s_v2   | 40% | 120 | 96  | 2304 |
| Standard_B8ls_v2  | 30% | 240 | 144 | 3456 |
| Standard_B8s_v2   | 40% | 240 | 192 | 4608 |
| Standard_B16ls_v2 | 30% | 480 | 288 | 6912 |
| Standard_B16s_v2  | 40% | 480 | 384 | 9216 |
| Standard_B32ls_v2 | 30% | 960 | 576 | 13824 |
| Standard_B32s_v2  | 40% | 960 | 768 | 18432 |

#### CPU Burst resources
- Bsv2-series virtual machines can burst their disk performance and get up to their bursting max for up to 30 minutes at a time.
- Learn more about [CPU bursting](../../b-series-cpu-credit-model/b-series-cpu-credit-model.md)

### [Local Storage](#tab/sizestoragelocal)

Local (temp) storage info for each size

> [!NOTE]
> No local storage present in this series.
>
> For frequently asked questions, see [Azure VM sizes with no local temp disk](../../azure-vms-no-temp-disk.yml).



### [Remote Storage](#tab/sizestorageremote)

Remote (uncached) storage info for each size

| Size Name | Max Remote Storage Disks (Qty.) | Uncached Disk IOPS | Uncached Disk Speed (MBps) | Uncached Disk Burst<sup>1</sup> IOPS | Uncached Disk Burst<sup>1</sup> Speed (MBps) | Uncached Special<sup>2</sup> Disk IOPS | Uncached Special<sup>2</sup> Disk Speed (MBps) | Uncached Burst<sup>1</sup> Special<sup>2</sup> Disk IOPS | Uncached Burst<sup>1</sup> Special<sup>2</sup> Disk Speed (MBps) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_B2ts_v2 | 4 | 3750 | 85 | 10,000 | 960 |  |  |  |  |
| Standard_B2ls_v2 | 4 | 3750 | 85 | 10,000 | 960 |  |  |  |  |
| Standard_B2s_v2 | 4 | 3750 | 85 | 10,000 | 960 |  |  |  |  |
| Standard_B4ls_v2 | 8 | 6,400 | 145 | 20,000 | 960 |  |  |  |  |
| Standard_B4s_v2 | 8 | 6,400 | 145 | 20,000 | 960 |  |  |  |  |
| Standard_B8ls_v2 | 16 | 12,800 | 290 | 20,000 | 960 |  |  |  |  |
| Standard_B8s_v2 | 16 | 12,800 | 290 | 20,000 | 960 |  |  |  |  |
| Standard_B16ls_v2 | 32 | 25,600 | 600 | 40,000 | 960 |  |  |  |  |
| Standard_B16s_v2 | 32 | 25,600 | 600 | 40,000 | 960 |  |  |  |  |
| Standard_B32ls_v2 | 32 | 51,200 | 600 | 80,000 | 960 |  |  |  |  |
| Standard_B32s_v2 | 32 | 51,200 | 600 | 80,000 | 960 |  |  |  |  |

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
| Standard_B2ts_v2 | 2 | 6250 |
| Standard_B2ls_v2 | 2 | 6250 |
| Standard_B2s_v2 | 2 | 6250 |
| Standard_B4ls_v2 | 2 | 6250 |
| Standard_B4s_v2 | 2 | 6250 |
| Standard_B8ls_v2 | 2 | 6250 |
| Standard_B8s_v2 | 2 | 6250 |
| Standard_B16ls_v2 | 4 | 6250 |
| Standard_B16s_v2 | 4 | 6250 |
| Standard_B32ls_v2 | 4 | 6250 |
| Standard_B32s_v2 | 4 | 6250 |

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
