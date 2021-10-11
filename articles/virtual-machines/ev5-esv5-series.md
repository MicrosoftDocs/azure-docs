---
title: Ev5 and Esv5-series - Azure Virtual Machines
description: Specifications for the Ev5 and Esv5-series VMs.
author: styli365
ms.author: sttsinar
ms.reviewer: joelpell
ms.custom: mimckitt
ms.service: virtual-machines
ms.subservice: vm-sizes-memory
ms.topic: conceptual
ms.date: 03/11/2021

---

# Ev5 and Esv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Ev5 and Esv5-series runs on the Intel&reg; Xeon&reg; Platinum 8272CL (Ice Lake) processors in a hyper-threaded configuration, are ideal for various memory-intensive enterprise applications and feature up to 504GiB of RAM. It features an all core Turbo clock speed of 3.4 GHz.

> [!NOTE]
> For frequently asked questions, refer to  [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml).

## Ev5-series

Ev5-series sizes run on the Intel Xeon&reg; Platinum 8272CL (Ice Lake). The Ev5-series instances are ideal for memory-intensive enterprise applications. Ev5-series VMs feature Intel&reg; Hyper-Threading Technology.

Remote Data disk storage is billed separately from virtual machines. To use premium storage disks, use the Esv4 sizes. The pricing and billing meters for Esv5 sizes are the same as Ev5-series.

[ACU](acu.md): 195 - 210<br>
[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max NICs|Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|
| Standard_E2_v5<sup>1</sup>  | 2  | 16  | Remote Storage Only | 4  | 2 | 1000  |
| Standard_E4_v5              | 4  | 32  | Remote Storage Only | 8  | 2 | 2000  |
| Standard_E8_v5              | 8  | 64  | Remote Storage Only | 16 | 4 | 4000  |
| Standard_E16_v5             | 16 | 128 | Remote Storage Only | 32 | 8 | 8000  |
| Standard_E20_v5             | 20 | 160 | Remote Storage Only | 32 | 8 | 10000 |
| Standard_E32_v5             | 32 | 256 | Remote Storage Only | 32 | 8 | 16000 |
| Standard_E48_v5             | 48 | 384 | Remote Storage Only | 32 | 8 | 24000 |
| Standard_E64_v5             | 64 | 512 | Remote Storage Only | 32 | 8 | 30000 |
| Standard_E96_v5             | 96 | 768 | Remote Storage Only | 32 | 8 | 30000 |

<sup>1</sup> Accelerated networking can only be applied to a single NIC.

## Esv5-series

Esv5-series sizes run on the Intel&reg; Xeon&reg; Platinum 8272CL (Ice Lake). The Esv5-series instances are ideal for memory-intensive enterprise applications. Evs5-series VMs feature Intel&reg; Hyper-Threading Technology. Remote Data disk storage is billed separately from virtual machines.

[ACU](acu.md): 195-210<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs|Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_E2s_v5<sup>1</sup>  | 2  | 16  | Remote Storage Only | 4  | 3200/48    | 2 | 1000  |
| Standard_E4s_v5              | 4  | 32  | Remote Storage Only | 8  | 6400/96    | 2 | 2000  |
| Standard_E8s_v5              | 8  | 64  | Remote Storage Only | 16 | 12800/192  | 4 | 4000  |
| Standard_E16s_v5             | 16 | 128 | Remote Storage Only | 32 | 25600/384  | 8 | 8000  |
| Standard_E20s_v5             | 20 | 160 | Remote Storage Only | 32 | 32000/480  | 8 | 10000 |
| Standard_E32s_v5             | 32 | 256 | Remote Storage Only | 32 | 51200/768  | 8 | 16000 |
| Standard_E48s_v5             | 48 | 384 | Remote Storage Only | 32 | 76800/1152 | 8 | 24000 |
| Standard_E64s_v5             | 64 | 512 | Remote Storage Only | 32 | 80000/1200 | 8 | 30000 |
| Standard_E96s_v5             | 96 | 768 | Remote Storage Only | 32 | 80000/1200 | 8 | 30000 |

<sup>1</sup> Accelerated networking can only be applied to a single NIC.

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types : [Disk Types](./disks-types.md#ultra-disk)


## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.