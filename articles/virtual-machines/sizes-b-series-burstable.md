---
title: B-series burstable - Azure Virtual Machines
description: Describes the B-series of burstable Azure VM sizes.
services: virtual-machines
ms.subservice: sizes
author: rishabv90
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 02/03/2020
ms.author: risverma
---

# B-series burstable virtual machine sizes

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The B-series VMs can be deployed on a variety of hardware types and processors, so competitive bandwidth allocation is provided. B-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake), the Intel® Xeon® Platinum 8272CL (Cascade Lake), the Intel® Xeon® 8171M 2.1 GHz (Skylake), the Intel® Xeon® E5-2673 v4 2.3 GHz (Broadwell), or the Intel® Xeon® E5-2673 v3 2.4 GHz (Haswell) processors.  B-series VMs are ideal for workloads that do not need the full performance of the CPU continuously, like web servers, proof of concepts, small databases and development build environments. These workloads typically have burstable performance requirements. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the virtual machine. The B-series provides you with the ability to purchase a VM size with baseline performance that can build up credits when it is using less than its baseline. When the VM has accumulated credits, the VM can burst above the baseline using up to 100% of the vCPU when your application requires higher CPU performance.

The B-series comes in the following VM sizes:

[Azure Compute Unit (ACU)](./acu.md): Varies*<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported**<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>

*B-series VMs are burstable and thus ACU numbers will vary depending on workloads and core usage.<br>
**Accelerated Networking is only supported for *Standard_B12ms*, *Standard_B16ms* and *Standard_B20ms*.
<br>
<br>

| Size           | vCPU | Memory: GiB | Temp storage (SSD) GiB | Base CPU Performance of VM (%) | Initial Credits | Credits banked/hour | Max Banked Credits | Max data disks | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps1 | Max NICs |
|----------------|------|-------------|------------------------|--------------------------------|-----------------|---------------------|--------------------|----------------|-----------------------------------------|------------------------------------------------|----------|
| Standard_B1ls2 | 1    | 0.5         | 4                      | 10                             | 30              | 3                   | 72                 | 2              | 160/10                                  | 4000/100                                       | 2        |
| Standard_B1s   | 1    | 1           | 4                      | 20                             | 30              | 6                   | 144                | 2              | 320/10                                  | 4000/100                                       | 2        |
| Standard_B1ms  | 1    | 2           | 4                      | 40                             | 30              | 12                  | 288                | 2              | 640/10                                  | 4000/100                                       | 2        |
| Standard_B2s   | 2    | 4           | 8                      | 40                             | 60              | 24                  | 576                | 4              | 1280/15                                 | 4000/100                                       | 3        |
| Standard_B2ms  | 2    | 8           | 16                     | 60                             | 60              | 36                  | 864                | 4              | 1920/22.5                               | 4000/100                                       | 3        |
| Standard_B4ms  | 4    | 16          | 32                     | 45                             | 120             | 54                  | 1296               | 8              | 2880/35                                 | 8000/200                                       | 4        |
| Standard_B8ms  | 8    | 32          | 64                     | 33                             | 240             | 81                  | 1944               | 16             | 4320/50                                 | 8000/200                                       | 4        |
| Standard_B12ms | 12   | 48          | 96                     | 36                             | 360             | 121                 | 2909               | 16             | 4320/50                                 | 16000/400                                      | 6        |
| Standard_B16ms | 16   | 64          | 128                    | 40                             | 480             | 162                 | 3888               | 32             | 4320/50                                 | 16000/400                                      | 8        |
| Standard_B20ms | 20   | 80          | 160                    | 40                             | 600             | 203                 | 4860               | 32             | 4320/50                                 | 16000/400                                      | 8        |

<sup>1</sup> B-series VMs can [burst](./disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

<sup>2</sup> B1ls is supported only on Linux


## Other sizes and information

- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types: [Disk Types](./disks-types.md#ultra-disks)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
