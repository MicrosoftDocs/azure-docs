---
title: FX-series
description: Specifications for the FX-series VMs.
author: priyashan-19
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 12/20/2022
ms.author: priyashan
---

# FX-series

The FX-series runs on the Intel® Xeon® Gold 6246R (Cascade Lake) processors. It features an all-core-turbo frequency of 4.0 GHz, 21 GB RAM per vCPU, up to 1 TB total RAM, and local temporary storage. The FX-series will benefit workloads that require a high CPU clock speed and high memory to CPU ratio, workloads with high per-core licensing costs, and applications requiring a high single-core performance. A typical use case for FX-series is the Electronic Design Automation (EDA) workload.

FX-series VMs feature [Intel® Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel® Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html), and [Intel® Advanced Vector Extensions 512 (Intel® AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html).

[ACU](acu.md): 310 - 340<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU's | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max NICs|Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_FX4mds  | 4   | 84   | 168  | 8   | 40000/343     | 6700/104   | 2 | 4000  |
| Standard_FX12mds | 12  | 252  | 504  | 24  | 100000/1029   | 20000/314  | 4 | 8000  |
| Standard_FX24mds | 24  | 504  | 1008 | 32  | 200000/2057   | 40000/629  | 4 | 16000 |
| Standard_FX36mds | 36  | 756  | 1512 | 32  | 300000/3086   | 60000/944  | 8 | 24000 |
| Standard_FX48mds | 48  | 1008 | 2016 | 32  | 400000/3871   | 80000/1258 | 8 | 32000 |


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types: [Disk Types](./disks-types.md#ultra-disks)


## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
