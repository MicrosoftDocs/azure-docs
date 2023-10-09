---
title: Ev4 and Esv4-series - Azure Virtual Machines
description: Specifications for the Ev4, and Esv4-series VMs.
author: andysports8
ms.author: shuji
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 12/21/2022

---

# Ev4 and Esv4-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Ev4 and Esv4-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, are ideal for various memory-intensive enterprise applications and feature up to 504GiB of RAM. It features an all core Turbo clock speed of 3.4 GHz.

> [!NOTE]
> For frequently asked questions, refer to  [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml).

## Ev4-series

Ev4-series sizes run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel Xeon&reg; Platinum 8272CL (Cascade Lake). The Ev4-series instances are ideal for memory-intensive enterprise applications. Ev4-series VMs feature Intel&reg; Hyper-Threading Technology.

Remote Data disk storage is billed separately from virtual machines. To use premium storage disks, use the Esv4 sizes. The pricing and billing meters for Esv4 sizes are the same as Ev4-series.

[ACU](acu.md): 195 - 210<br>
[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max NICs|Expected network bandwidth  (Mbps) |
|---|---|---|---|---|---|---|
| Standard_E2_v4<sup>1</sup>  | 2 | 16   | Remote Storage Only | 4 | 2|5000  |
| Standard_E4_v4  | 4 | 32  | Remote Storage Only | 8 | 2|10000  |
| Standard_E8_v4  | 8 | 64 | Remote Storage Only | 16 | 4|12500 |
| Standard_E16_v4 | 16 | 128 | Remote Storage Only | 32 | 8|12500 |
| Standard_E20_v4 | 20 | 160 | Remote Storage Only | 32 | 8|10000 |
| Standard_E32_v4 | 32 | 256 | Remote Storage Only | 32 | 8|16000 |
| Standard_E48_v4 | 48 | 384 | Remote Storage Only | 32 | 8|24000 |
| Standard_E64_v4 | 64 | 504 | Remote Storage Only | 32| 8|30000 |

<sup>1</sup> Accelerated networking can only be applied to a single NIC. 


## Esv4-series

Esv4-series sizes run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake). The Esv4-series instances are ideal for memory-intensive enterprise applications. Evs4-series VMs feature Intel&reg; Hyper-Threading Technology. Remote Data disk storage is billed separately from virtual machines.

[ACU](acu.md): 195-210<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>


| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>1</sup> |Max NICs|Expected network bandwidth  (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_E2s_v4<sup>4</sup>  | 2 | 16  | Remote Storage Only | 4 | 3200/48 | 4000/200 | 2|5000  |
| Standard_E4s_v4  | 4 | 32  | Remote Storage Only | 8 | 6400/96 | 8000/200 | 2|10000  |
| Standard_E8s_v4  | 8 | 64  | Remote Storage Only | 16 | 12800/192 | 16000/400 | 4|12500 |
| Standard_E16s_v4 | 16 | 128 | Remote Storage Only | 32 | 25600/384 | 32000/800 | 8|12500 |
| Standard_E20s_v4 | 20 | 160 | Remote Storage Only | 32 | 32000/480  | 40000/1000 | 8|10000 |
| Standard_E32s_v4 | 32 | 256 | Remote Storage Only | 32 | 51200/768  | 64000/1600 | 8|16000 |
| Standard_E48s_v4 | 48 | 384 | Remote Storage Only | 32 | 76800/1152 | 80000/2000 | 8|24000 |
| Standard_E64s_v4 <sup>2</sup> | 64 | 504| Remote Storage Only | 32 | 80000/1200 | 80000/2000 | 8|30000 |
| Standard_E80is_v4 <sup>3,5</sup> | 80 | 504 | Remote Storage Only | 64 | 80000/1500 | 80000/2000 | 8|30000 |

<sup>1</sup>  Esv4-series VMs can [burst](./disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

<sup>2</sup> [Constrained core sizes available)](./constrained-vcpu.md).

<sup>3</sup> Instance is isolated to hardware dedicated to a single customer.

<sup>4</sup> Accelerated networking can only be applied to a single NIC. 

<sup>5</sup> Attaching Ultra Disk or Premium SSDs V2 to **Standard_E80is_v4** results in higher IOPs and MBps than standard premium disks:
- Max uncached Ultra Disk and Premium SSD V2throughput (IOPS/ MBps): 120000/1800 
- Max burst uncached Ultra Disk and Premium SSD V2 disk throughput (IOPS/ MBps): 120000/2000






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
