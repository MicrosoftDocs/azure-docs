---
title: M-series - Azure Virtual Machines
description: Specifications for the M-series VMs.
author: lauradolan
ms.service: virtual-machines
ms.subservice: sizes
ms.custom: devx-track-linux
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: ayshak
---

# M-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The M-series offers a high vCPU count (up to 128 vCPUs) and a large amount of memory (up to 3.8 TiB). It's also ideal for extremely large databases or other applications that benefit from high vCPU counts and large amounts of memory. M-series sizes are supported both on the Intel&reg; Xeon&reg; CPU E7-8890 v3 @ 2.50GHz and on the Intel&reg; Xeon&reg; Platinum 8280M (Cascade Lake).

M-series VM's feature Intel&reg; Hyper-Threading Technology.

[ACU](acu.md): 160-180<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Write Accelerator](./how-to-enable-write-accelerator.md): Supported<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Burst cached and temp storage throughput: IOPS/MBps<sup>4</sup> | Max uncached disk throughput: IOPS/MBps | Burst uncached disk throughput: IOPS/MBps<sup>4</sup> | Max NICs|Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|---|
| Standard_M8ms <sup>3</sup>       | 8   | 218.75 | 256   | 8  | 10000/100 (793)     | 10000/250   | 5000/125   | 10000/250  | 4 | 2000  |
| Standard_M16ms <sup>3</sup>      | 16  | 437.5  | 512   | 16 | 20000/200 (1587)    | 20000/500   | 10000/250  | 20000/500  | 8 | 4000  |
| Standard_M32ts                   | 32  | 192    | 1024  | 32 | 40000/400 (3174)    | 40000/1000  | 20000/500  | 40000/1000 | 8 | 8000  |
| Standard_M32ls                   | 32  | 256    | 1024  | 32 | 40000/400 (3174)    | 40000/1000  | 20000/500  | 40000/1000 | 8 | 8000  |
| Standard_M32ms <sup>3</sup>      | 32  | 875    | 1024  | 32 | 40000/400 (3174)    | 40000/1000  | 20000/500  | 40000/1000 | 8 | 8000  |
| Standard_M64s <sup>1</sup>       | 64  | 1024   | 2048  | 64 | 80000/800 (6348)    | 80000/2000  | 40000/1000 | 80000/2000 | 8 | 16000 |
| Standard_M64ls <sup>1</sup>      | 64  | 512    | 2048  | 64 | 80000/800 (6348)    | 80000/2000  | 40000/1000 | 80000/2000 | 8 | 16000 |
| Standard_M64ms <sup>1,3</sup>    | 64  | 1792   | 2048  | 64 | 80000/800 (6348)    | 80000/2000  | 40000/1000 | 80000/2000 | 8 | 16000 |
| Standard_M128s <sup>1</sup>      | 128 | 2048   | 4096  | 64 | 160000/1600 (12696) | 250000/4000 | 80000/2000 | 80000/4000 | 8 | 30000 |
| Standard_M128ms <sup>1,2,3</sup> | 128 | 3892   | 4096  | 64 | 160000/1600 (12696) | 250000/4000 | 80000/2000 | 80000/4000 | 8 | 30000 |
| Standard_M64 <sup>1</sup>        | 64  | 1024   | 7168  | 64 | 80000/800 (1228)    | 80000/2000  | 40000/1000 | 80000/2000 | 8 | 16000 |
| Standard_M64m <sup>1</sup>       | 64  | 1792   | 7168  | 64 | 80000/800 (1228)    | 80000/2000  | 40000/1000 | 80000/2000 | 8 | 16000 |
| Standard_M128 <sup>1</sup>       | 128 | 2048   | 14336 | 64 | 250000/1600 (2456)  | 250000/4000 | 80000/2000 | 80000/4000 | 8 | 32000 |
| Standard_M128m <sup>1</sup>      | 128 | 3892   | 14336 | 64 | 250000/1600 (2456)  | 250000/4000 | 80000/2000 | 80000/4000 | 8 | 32000 |

<sup>1</sup> More than 64 vCPU's require one of these supported guest versions: Windows Server 2016, Ubuntu 18.04+ LTS, SLES 12 SP2+, Red Hat Enterprise Linux 7/8/9, CentOS 7.3+ or Oracle Linux 7.3+ with LIS 4.2.1 or higher.

<sup>2</sup> Instance is isolated to hardware dedicated to a single customer.

<sup>3</sup> [Constrained core sizes available](./constrained-vcpu.md).

<sup>4</sup> M-series VMs can [burst](./disk-bursting.md) their disk performance for up to 30 minutes at a time. 

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types : [Disk Types](./disks-types.md#ultra-disks)


## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
