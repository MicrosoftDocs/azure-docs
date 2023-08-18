---
title: Dlsv5 and Dldsv5
description: Specifications for the Dlsv5 and Dldsv5-series VMs.
author: iamwilliew 
ms.author: wwilliams 
ms.service: virtual-machines 
ms.subservice: sizes 
ms.topic: reference 
ms.date: 02/16/2023

---

# Dlsv5 and Dldsv5-series 

The Dlsv5 and Dldsv5-series Virtual Machines runs on the Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processor in a [hyper threaded](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) configuration. This new processor features an all core turbo clock speed of 3.5 GHz with [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). The Dlsv5 and Dldsv5 VM series provides 2GiBs of RAM per vCPU and optimized for workloads that require less RAM per vCPU than standard VM sizes. Target workloads include web servers, gaming, video encoding, AI/ML, and batch processing.

## Dlsv5-series
Dlsv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz. These virtual machines offer up to 96 vCPU and 192 GiB of RAM. These VM sizes can reduce cost when running non-memory intensive applications.

Dlsv5-series virtual machines do not have any temporary storage thus lowering the price of entry. You can attach Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines.   [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).


[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br> 

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps<sup>*</sup> | Max burst uncached disk throughput: IOPS/MBps3 | Max NICs |Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---| ---|
| Standard_D2ls_v5 | 2  | 4   | Remote Storage Only | 4  | 3750/85 | 10000/1200 | 2  | 12500 |
| Standard_D4ls_v5               | 4  | 8  | Remote Storage Only  | 8  | 6400/145   | 20000/1200 | 2 | 12500 |
| Standard_D8ls_v5               | 8  | 16  | Remote Storage Only  | 16 | 12800/290   | 20000/1200 | 4 | 12500 |
| Standard_D16ls_v5              | 16 | 32  | Remote Storage Only  | 32 | 25600/600 | 40000/1200 | 8 | 12500 |
| Standard_D32ls_v5              | 32 | 64 | Remote Storage Only | 32 | 51200/865 | 80000/2000 | 8 | 16000 |
| Standard_D48ls_v5              | 48 | 96 | Remote Storage Only | 32 | 76800/1315 | 80000/3000 | 8 | 24000 |
| Standard_D64ls_v5              | 64 | 128 | Remote Storage Only | 32 | 80000/1735 | 80000/3000 | 8 | 30000 |
| Standard_D96ls_v5              | 96 | 192 | Remote Storage Only | 32 | 80000/2600 | 80000/4000 |8 | 35000 |

<sup>*</sup> These IOPs values can be guaranteed by using [Gen2 VMs](generation-2.md)<br>
<sup>1</sup> Accelerated networking is required and turned on by default on all Dlsv5 virtual machines.<br>

## Dldsv5-series

Dldsv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  These virtual machines offer up to 96 vCPU and 192 GiB of RAM as well as fast, local SSD storage up to 3,600 GiB. These VM sizes can reduce cost when running non-memory intensive applications.  

Dldsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).


[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br> 


| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps<sup>*</sup> | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>3</sup> | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_D2lds_v5 | 2  | 4   | 75   | 4  | 9000/125    | 3750/85     | 10000/1200 | 2 | 12500 |
| Standard_D4lds_v5               | 4  | 8  | 150  | 8  | 19000/250   | 6400/145    | 20000/1200 | 2 | 12500 |
| Standard_D8lds_v5               | 8  | 16  | 300  | 16 | 38000/500   | 12800/290   | 20000/1200 | 4 | 12500 |
| Standard_D16lds_v5              | 16 | 32  | 600  | 32 | 75000/1000  | 25600/600   | 40000/1200 | 8 | 12500 |
| Standard_D32lds_v5              | 32 | 64 | 1200 | 32 | 150000/2000 | 51200/865   | 80000/2000 | 8 | 16000 |
| Standard_D48lds_v5              | 48 | 96 | 1800 | 32 | 225000/3000 | 76800/1315  | 80000/3000 | 8 | 24000 |
| Standard_D64lds_v5              | 64 | 128 | 2400 | 32 | 300000/4000 | 80000/1735  | 80000/3000 | 8 | 30000 |
| Standard_D96lds_v5              | 96 | 192 | 3600 | 32 | 450000/4000 | 80000/2600  | 80000/4000 | 8 | 35000 |

<sup>*</sup> These IOPs values can be guaranteed by using [Gen2 VMs](generation-2.md)<br>
<sup>1</sup> Accelerated networking is required and turned on by default on all Dldsv5 virtual machines.<br>
<sup>2</sup> Dldsv5-series virtual machines can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

For more information on Disks Types: [Disk Types](./disks-types.md#ultra-disks)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
