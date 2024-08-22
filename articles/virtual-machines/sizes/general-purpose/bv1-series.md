---
title: Bv1 size series
description: Information on and specifications of the Bv1-series sizes
author: mattmcinnes
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 07/29/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
---

# Bv1 sizes series
[!INCLUDE [previous-gen-header](../includes/sizes-previous-gen-header.md)]

[!INCLUDE [bv1-summary](./includes/bv1-series-summary.md)]

## Host specifications
[!INCLUDE [bv1-series-specs](./includes/bv1-series-specs.md)]

## Feature support
[Premium Storage](../../premium-storage-performance.md): Supported <br>[Premium Storage caching](../../premium-storage-performance.md): Not Supported <br>[Live Migration](../../maintenance-and-updates.md): Supported <br>[Memory Preserving Updates](../../maintenance-and-updates.md): Supported <br>[Generation 2 VMs](../../generation-2.md): Supported <br>[Generation 1 VMs](../../generation-2.md): Supported <br>[Accelerated Networking](../../../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>[Ephemeral OS Disk](../../ephemeral-os-disks.md): Supported <br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>

> [!NOTE] 
> Accelerated Networking is only supported for Standard_B12ms, Standard_B16ms and Standard_B20ms.

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_B1ls2 | 1 | 0.5 |
| Standard_B1s | 1 | 1 |
| Standard_B1ms | 1 | 2 |
| Standard_B2s | 2 | 4 |
| Standard_B2ms | 2 | 8 |
| Standard_B4ms | 4 | 16 |
| Standard_B8ms | 8 | 32 |
| Standard_B12ms | 12 | 48 |
| Standard_B16ms | 16 | 64 |
| Standard_B20ms | 20 | 80 |

#### VM Basics resources
- [Check vCPU quotas](../../../virtual-machines/quotas.md)


### [CPU Burst](#tab/sizeburstdata)

Base CPU performance, Credits, and other CPU bursting related info

| Size Name | Base CPU Performance Percentage | Initial Credits (Qty.) | Credits banked/hour (Qty.) | Max Banked Credits (Qty.) |
| --- | --- | --- | --- | --- |
| Standard_B1ls  | 5% | 30 | 3 | 72 |
| Standard_B1s   | 10% | 30 | 6 | 144 |
| Standard_B1ms  | 20% | 30 | 12 | 288 |
| Standard_B2s   | 20% | 60 | 24 | 576 |
| Standard_B2ms  | 30% | 60 | 36 | 864 |
| Standard_B4ms  | 22.5% | 120 | 54 | 1296 |
| Standard_B8ms  | 17% | 240 | 81 | 1994 |
| Standard_B12ms | 17% | 360 | 121 | 2908 |
| Standard_B16ms | 17% | 480 | 162 | 3888 |
| Standard_B20ms | 17% | 600 | 202 | 4867 |

#### CPU Burst resources
- B-series VMs can burst their disk performance and get up to their bursting max for up to 30 minutes at a time.
- B1ls is supported only on Linux
- Learn more about [CPU bursting](../../b-series-cpu-credit-model/b-series-cpu-credit-model.md)

### [Local Storage](#tab/sizestoragelocal)

Local (temp) storage info for each size

| Size Name | Max Temp Storage Disks (Qty.) | Temp Disk Size (GiB) | Temp Disk Random Read (RR)<sup>1</sup> IOPS | Temp Disk Random Read (RR)<sup>1</sup> Speed (MBps) | Temp Disk Random Write (RW)<sup>1</sup> IOPS | Temp Disk Random Write (RW)<sup>1</sup> Speed (MBps) |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_B1ls2 | 1 | 4 |  |  |  |  |
| Standard_B1s | 1 | 4 |  |  |  |  |
| Standard_B1ms | 1 | 4 |  |  |  |  |
| Standard_B2s | 1 | 8 |  |  |  |  |
| Standard_B2ms | 1 | 16 |  |  |  |  |
| Standard_B4ms | 1 | 32 |  |  |  |  |
| Standard_B8ms | 1 | 64 |  |  |  |  |
| Standard_B12ms | 1 | 96 |  |  |  |  |
| Standard_B16ms | 1 | 128 |  |  |  |  |
| Standard_B20ms | 1 | 160 |  |  |  |  |

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
| Standard_B1ls2 | 2 | 160 | 10 | 4000 | 100 |  |  |  |  |
| Standard_B1s | 2 | 320 | 10 | 4000 | 100 |  |  |  |  |
| Standard_B1ms | 2 | 640 | 10 | 4000 | 100 |  |  |  |  |
| Standard_B2s | 4 | 1280 | 15 | 4000 | 100 |  |  |  |  |
| Standard_B2ms | 4 | 1920 | 22.5 | 4000 | 100 |  |  |  |  |
| Standard_B4ms | 8 | 2880 | 35 | 8000 | 200 |  |  |  |  |
| Standard_B8ms | 16 | 4320 | 50 | 8000 | 200 |  |  |  |  |
| Standard_B12ms | 16 | 4320 | 50 | 16000 | 400 |  |  |  |  |
| Standard_B16ms | 32 | 4320 | 50 | 16000 | 400 |  |  |  |  |
| Standard_B20ms | 32 | 4320 | 50 | 16000 | 400 |  |  |  |  |

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
| Standard_B1ls2 | 2 |  |
| Standard_B1s | 2 |  |
| Standard_B1ms | 2 |  |
| Standard_B2s | 3 |  |
| Standard_B2ms | 3 |  |
| Standard_B4ms | 4 |  |
| Standard_B8ms | 4 |  |
| Standard_B12ms | 6 |  |
| Standard_B16ms | 8 |  |
| Standard_B20ms | 8 |  |

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
