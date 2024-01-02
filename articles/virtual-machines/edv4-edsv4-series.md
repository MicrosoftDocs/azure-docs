---
title: Edv4 and Edsv4-series 
description: Specifications for the Ev4, Edv4, Esv4 and Edsv4-series VMs.
author: andysports8
ms.author: shuji
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 10/20/2021
---

# Edv4 and Edsv4-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Edv4 and Edsv4-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, and are ideal for various memory-intensive enterprise applications and feature up to 504 GiB of RAM, [Intel&reg; Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) and [Intel&reg; Advanced Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html). They also support [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). These new VM sizes will have 50% larger local storage, as well as better local disk IOPS for both read and write compared to the [Ev3/Esv3](./ev3-esv3-series.md) sizes with [Gen2 VMs](./generation-2.md). It features an all core Turbo clock speed of 3.4 GHz. 

## Edv4-series

Edv4-series sizes run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors. The Edv4 virtual machine sizes feature up to 504 GiB of RAM, in addition to fast and large local SSD storage (up to 2,400 GiB). These virtual machines are ideal for memory-intensive enterprise applications and applications that benefit from low latency, high-speed local storage. You can attach Standard SSDs and Standard HDDs disk storage to the Edv4 VMs. 

[ACU](acu.md): 195 - 210<br>
[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<sup>1</sup> <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps<sup>*</sup>  | Max NICs|Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_E2d_v4<sup>1</sup>  | 2  | 16  | 75   | 4  | 9000/125    | 2 | 5000  |
| Standard_E4d_v4              | 4  | 32  | 150  | 8  | 19000/250   | 2 | 10000  |
| Standard_E8d_v4              | 8  | 64  | 300  | 16 | 38000/500   | 4 | 12500  |
| Standard_E16d_v4             | 16 | 128 | 600  | 32 | 75000/1000   | 8 | 12500  |
| Standard_E20d_v4             | 20 | 160 | 750  | 32 | 94000/1250  | 8 | 16000 |
| Standard_E32d_v4             | 32 | 256 | 1200 | 32 | 150000/2000 | 8 | 16000 |
| Standard_E48d_v4             | 48 | 384 | 1800 | 32 | 225000/3000 | 8 | 24000 |
| Standard_E64d_v4             | 64 | 504 | 2400 | 32 | 300000/4000 | 8 | 30000 |

<sup>*</sup> These IOPs values can be achieved by using [Gen2 VMs](generation-2.md)
<sup>1</sup> Accelerated networking can only be applied to a single NIC. <br>

## Edsv4-series

Edsv4-series sizes run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors. The Edsv4 virtual machine sizes feature up to 504 GiB of RAM, in addition to fast and large local SSD storage (up to 2,400 GiB). These virtual machines are ideal for memory-intensive enterprise applications and applications that benefit from low latency, high-speed local storage.

[ACU](acu.md): 195-210<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps<sup>*</sup> | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>1</sup> | Max NICs|Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_E2ds_v4<sup>4</sup>    | 2  | 16  | 75   | 4  | 9000/125    | 3200/48    | 4000/200   | 2 | 5000  |
| Standard_E4ds_v4                | 4  | 32  | 150  | 8  | 19000/250   | 6400/96    | 8000/200   | 2 | 10000  |
| Standard_E8ds_v4                | 8  | 64  | 300  | 16 | 38000/500   | 12800/192  | 16000/400  | 4 | 12500  |
| Standard_E16ds_v4               | 16 | 128 | 600  | 32 | 75000/1000   | 25600/384  | 32000/800  | 8 | 12500  |
| Standard_E20ds_v4               | 20 | 160 | 750  | 32 | 94000/1250  | 32000/480  | 40000/1000 | 8 | 16000 |
| Standard_E32ds_v4               | 32 | 256 | 1200 | 32 | 150000/2000 | 51200/768  | 64000/1600 | 8 | 16000 |
| Standard_E48ds_v4               | 48 | 384 | 1800 | 32 | 225000/3000 | 76800/1152 | 80000/2000 | 8 | 24000 |
| Standard_E64ds_v4 <sup>2</sup>  | 64 | 504 | 2400 | 32 | 300000/4000 | 80000/1200 | 80000/2000 | 8 | 30000 |
| Standard_E80ids_v4 <sup>3,5</sup> | 80 | 504 | 2400 | 64 | 375000/4000 | 80000/1500 | 80000/2000 | 8 | 30000 |

<sup>*</sup> These IOPs values can be guaranteed by using [Gen2 VMs](generation-2.md)

<sup>1</sup>  Edsv4-series VMs can [burst](./disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

<sup>2</sup> [Constrained core sizes available](./constrained-vcpu.md).

<sup>3</sup> Instance is isolated to hardware dedicated to a single customer.

<sup>4</sup> Accelerated networking can only be applied to a single NIC. 

<sup>5</sup> Attaching Ultra Disk or Premium SSDs V2 to **Standard_E80ids_v4** results in higher IOPs and MBps than standard premium disks:
- Max uncached Ultra Disk and Premium SSD V2 throughput (IOPS/ MBps): 120000/1800 
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
