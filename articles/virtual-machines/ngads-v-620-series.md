---
title: Overview of NGads V620 Series (preview)
description: Overview of NGads V620 series GPU-enabled virtual machines  
author: isgonzalez-MSFT 
ms.author: isgonzalez
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 06/11/2023 

---

# NGads V620-series (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

> [!IMPORTANT]
> The NGads V620 Series is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 
>
> Customers can [sign up for NGads V620 Series preview today](https://aka.ms/NGadsV620-Series-Public-Preview). NGads V620 Series VMs are initially available in the East US2 and Europe West Azure regions.

The NGads V620 series are GPU-enabled virtual machines with CPU, memory resources and storage resources balanced to generate and stream high quality graphics for a high performance, interactive gaming experience hosted in Azure.  They're powered by [AMD Radeon(tm) PRO V620 GPU](https://www.amd.com/en/products/server-accelerators/amd-radeon-pro-v620) and [AMD EPYC 7763 (Milan) CPUs](https://www.amd.com/en/products/cpu/amd-epyc-7763).  The AMD Radeon PRO V620 GPUs have a maximum frame buffer of 32 GB, which can be divided up to four ways through hardware partitioning. The AMD EPYC CPUs have a base clock speed of 2.45 GHz and a boost<sup>1</sup> speed of 3.5Ghz. VMs are assigned full cores instead of threads, enabling full access to AMD’s powerful “Zen 3” cores.<br>
(<sup>1</sup> EPYC-018: Max boost for AMD EPYC processors is the maximum frequency achievable by any single core on the processor under normal operating conditions for server systems.)

NGads instances come in four sizes, allowing customers to right-size their gaming environments for the performance and cost that best fits their business needs. The NG-series virtual machines feature partial GPUs to enable you to pick the right-sized virtual machine for GPU accelerated graphics applications and virtual desktops.  The vm sizes start with 1/4 of a GPU with 8-GiB frame buffer up to a full GPU with 32-GiB frame buffer. The NGads VMs also feature Direct Disk NVMe ranging from 1 to 4x 960 GB disks per VM.


[Premium Storage](premium-storage-performance.md): Supported<br>
Premium Storage v2: Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported<br>
<br> 

| Size | vCPU<sup>1</sup> | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU Memory GiB<sup>2</sup> | Max data disks |  Max uncached disk throughput: IOPS/MBps | Direct Disk NVMe<sup>3</sup> | Max NICs / Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_NG8ads_V620_v1               | 8  | 16  | 256  | 1/4 | 8  | 8  | 12800 / 200 | 1x 960 GB | 2 / 10000 |
| Standard_NG16ads_V620_v1              | 16 | 32  | 512  | 1/2 | 16 | 16 | 25600 / 384 | 2x 960 GB | 4 / 20000 |
| Standard_NG32ads_V620_v1              | 32 | 64  | 1024 | 1   | 32 | 32 | 51200 / 768 | 4x 960 GB | 8 / 40000 |
| Standard_NG32adms_V620_v1             | 32 | 176 | 1024 | 1   | 32 | 32 | 51200 / 768 | 4x 960 GB | 8 / 40000 |

<sup>1</sup> Physical Cores.  
<sup>2</sup> The actual GPU VRAM reported in the operating system will be little less due to Error Correcting Code (ECC) support.<br>
<sup>3</sup> Local NVMe disks are ephemeral. Data is lost on these disks if you stop/deallocate your VM. Local NVMe disks aren't encrypted by Azure Storage encryption, even if you enable encryption at host.

## Supported operating systems and drivers

The NGads V620 Series VMs support a new AMD Cloud Software driver that comes in two editions: A Gaming driver with regular updates to support the latest titles, and a Professional driver for accelerated Virtual Desktop environments, with Radeon PRO optimizations to support high-end workstation applications. <br>
To take advantage of the GPU capabilities of Azure NGads V620 Series VMs, AMD GPU drivers must be installed. NG virtual machines currently support only Windows guest operating systems.<br>
To install AMD GPU drivers manually, see [N-series AMD GPU driver setup for Windows](./windows/n-series-amd-driver-setup.md) for supported operating systems, drivers, installation, and verification steps.

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator : Not available during preview.

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
