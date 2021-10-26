---
title: Ebsv5 and Ebdsv5 series
description: Specifications for the Ebsv5 and Ebdsv5 series VMs.
author: priyashan-19
ms.author: priyashan
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: vm-sizes-memory
ms.topic: conceptual
ms.date: 10/4/2021
---

# Ebsv5 and Ebdsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

 The memory-optimized Ebsv5 and Ebdsv5 VM series delivers higher remote storage performance in each VM size than the Esv5 VM series. The increased remote storage performance of the Ebsv5 and Ebdsv5 VMs is ideal for storage throughput-intensive workloads, such as relational databases and data analytics applications.  

The Ebsv5 and Ebdsv5 VMs offer up to 120,000 IOPS and 4,000 MBps of remote disk storage throughput. They also include up to 512 GiB of RAM and local SSD storage (up to 2,400 GiB). These series provide a 3X increase in remote storage performance of data-intensive workloads compared to prior VM generations and helps consolidate existing workloads on fewer VMs or smaller VM sizes while achieving potential cost savings. The Ebsv5-series provides a better value proposition for workloads that do not require local temp disk.

The Ebsv5 and Ebdsv5-series run on the Intel® Xeon® Platinum 8272CL (Ice Lake) processors in a hyper-threaded configuration and are ideal for various memory-intensive enterprise applications and feature up to 512 GiB of RAM, [Intel&reg; Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html), and [Intel&reg; Advanced Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html). They also support [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html).  


## Ebsv5-series

Ebsv5-series sizes run on the Intel® Xeon® Platinum 8272CL (Ice Lake). These virtual machines are ideal for memory-intensive enterprise applications and applications that benefit from high remote storage performance but with no local SSD storage. Ebsv5-series VMs feature [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html). Remote Data disk storage is billed separately from virtual machines.

[ACU](acu.md): 195 - 210<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<sup>1, 2</sup> <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Remote IOPs burst<sup>3</sup> | Remote throughput burst (MBps) | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_E2bs_v5   | 2  | 16  | Remote Storage Only | 4  | 5500/156    | 10000  | 1200 | 2 | 10000 |
| Standard_E4bs_v5               | 4  | 32  | Remote Storage Only | 8  | 11000/350   | 20000  | 1200 | 2 | 10000 |
| Standard_E8bs_v5               | 8  | 64  | Remote Storage Only | 16 | 22000/625   | 40000  | 1200 | 4 | 10000 |
| Standard_E16bs_v5              | 16 | 128 | Remote Storage Only | 32 | 44000/1250  | 64000  | 2000 | 8 | 12500 |
| Standard_E32bs_v5              | 32 | 256 | Remote Storage Only | 32 | 88000/2500  | 120000 | 4000 | 8 | 16000 |
| Standard_E48bs_v5              | 48 | 384 | Remote Storage Only | 32 | 120000/4000 | 120000 | 4000 | 8 | 16000 |
| Standard_E64bs_v5              | 64 | 512 | Remote Storage Only | 32 | 120000/4000 | 120000 | 4000 | 8 | 20000 |

<sup>1</sup> Accelerated networking is required and turned on by default on all Ebsv5 and Ebdsv5 virtual machines.<br>
<sup>2</sup> Accelerated networking can be applied to two NICs.<br>
<sup>3</sup> Ebsv5 and Ebdsv5 series VMs can burst their disk performance and get up to their bursting max for up to 30 minutes at a time.

## Ebdsv5-series

Ebdsv5-series sizes run on the Intel® Xeon® Platinum 8272CL (Ice Lake) processors. The Ebdsv5 virtual machine sizes feature up to 512 GiB of RAM, in addition to fast and large local SSD storage (up to 2,400 GiB). These virtual machines are ideal for memory-intensive enterprise applications and applications that benefit from high remote storage performance, low latency, high-speed local storage. Remote Data disk storage is billed separately from virtual machines. 

[ACU](acu.md): 195-210<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<sup>1, 2</sup> <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Remote IOPs burst<sup>3</sup> | Remote throughput burst (MBps) | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|---|
| Standard_E2bds_v5  | 2  | 16  | 75   | 4  | 9375/120    | 5500/156    | 10000  | 1200 | 2 | 10000 |
| Standard_E4bds_v5               | 4  | 32  | 150  | 8  | 18750/242   | 11000/350   | 20000  | 1200 | 2 | 10000 |
| Standard_E8bds_v5               | 8  | 64  | 300  | 16 | 37500/485   | 22000/625   | 40000  | 1200 | 4 | 10000 |
| Standard_E16bds_v5              | 16 | 128 | 600  | 32 | 75000/968   | 44000/1250  | 64000  | 2000 | 8 | 12500 |
| Standard_E32bds_v5              | 32 | 256 | 1200 | 32 | 150000/1936 | 88000/2500  | 120000 | 4000 | 8 | 16000 |
| Standard_E48bds_v5              | 48 | 384 | 1800 | 32 | 225000/2904 | 120000/4000 | 120000 | 4000 | 8 | 16000 |
| Standard_E64bds_v5              | 64 | 512 | 2400 | 32 | 300000/3872 | 120000/4000 | 120000 | 4000 | 8 | 20000 |

<sup>1</sup> Accelerated networking is required and turned on by default on all Ebsv5 and Ebdsv5 virtual machines.<br>
<sup>2</sup> Accelerated networking can be applied to two NICs.<br>
<sup>3</sup> Ebsv5 and Ebdsv5 series VMs can burst their disk performance and get up to their bursting max for up to 30 minutes at a time.

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
