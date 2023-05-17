---
title: Av2-series 
description: Specifications for the Av2-series VMs.
author: rishabv90
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 12/21/2022
ms.author: risverma
---

# Av2-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Av2-series VMs can be deployed on a variety of hardware types and processors. Av2-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake), the Intel® Xeon® Platinum 8272CL (Cascade Lake), the Intel® Xeon® 8171M 2.1 GHz (Skylake), the Intel® Xeon® E5-2673 v4 2.3 GHz (Broadwell), or the Intel® Xeon® E5-2673 v3 2.4 GHz (Haswell) processors. Av2-series VMs have CPU performance and memory configurations best suited for entry level workloads like development and test. The size is throttled to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine. Some example use cases include development and test servers, low traffic web servers, small to medium databases, proof-of-concepts, and code repositories.

[ACU](acu.md): 100<br>
[Premium Storage](premium-storage-performance.md): Not Supported <br>
[Premium Storage caching](premium-storage-performance.md): Not Supported <br>
[Live Migration](maintenance-and-updates.md): Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported <br>
[VM Generation Support](generation-2.md): Generation 1 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>

| Size | vCore | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS/Read MBps/Write MBps | Max data disks/throughput: IOPS | Max NICs | Expected network bandwidth (Mbps)
|---|---|---|---|---|---|---|---|
| Standard_A1_v2  | 1 | 2  | 10 | 1000/20/10  | 2/2x500   | 2 | 250  |
| Standard_A2_v2  | 2 | 4  | 20 | 2000/40/20  | 4/4x500   | 2 | 500  |
| Standard_A4_v2  | 4 | 8  | 40 | 4000/80/40  | 8/8x500   | 4 | 1000 |
| Standard_A8_v2  | 8 | 16 | 80 | 8000/160/80 | 16/16x500 | 8 | 2000 |
| Standard_A2m_v2 | 2 | 16 | 20 | 2000/40/20  | 4/4x500   | 2 | 500  |
| Standard_A4m_v2 | 4 | 32 | 40 | 4000/80/40  | 8/8x500   | 4 | 1000 |
| Standard_A8m_v2 | 8 | 64 | 80 | 8000/160/80 | 16/16x500 | 8 | 2000 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator : [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types : [Disk Types](./disks-types.md#ultra-disks)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
