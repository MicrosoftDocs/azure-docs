---
title: NV A10 v5-series 
description: Specifications for the NV A10 v5-series VMs.
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 02/01/2022
ms.author: vikancha
ms.custom: references_regions
---

# NVadsA10 v5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The NVadsA10v5-series virtual machines are powered by [NVIDIA A10](https://www.nvidia.com/en-us/data-center/products/a10-gpu/) GPUs and AMD EPYC 74F3V(Milan) CPUs with a base frequency of 3.2 GHz, all-cores peak frequency of 4.0 GHz. With NVadsA10v5-series Azure is introducing virtual machines with partial NVIDIA GPUs. Pick the right sized virtual machine for GPU accelerated graphics applications and virtual desktops starting at 1/6th of a GPU with 4-GiB frame buffer to a full A10 GPU with 24-GiB frame buffer.

Each virtual machine instance in NVadsA10v5-series comes with a GRID license. This license gives you the flexibility to use an NV instance as a virtual workstation for a single user, or 25 concurrent users can connect to the VM for a virtual application scenario.

<br>

[ACU](acu.md): Not Available<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU partition | GPU memory: GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs / Expected network bandwidth (Mbps) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NV6ads_A10_v5 |6 |55 |180 | 1/6 | 4 | 4 | 6400 / 100 | 2 / 5000 |
| Standard_NV12ads_A10_v5 |12 |110 |360 | 1/3 | 8 | 4 | 12800 / 200 | 2 / 10000 |
| Standard_NV18ads_A10_v5 |18 |220 |720 | 1/2 | 12 | 8 | 25600 / 384 | 4 / 20000 |
| Standard_NV36ads_A10_v5 |36 |440 |1440 | 1 | 24 | 16 |51200 / 768 | 4 / 40000 |
| Standard_NV36adms_A10_v5 |36 |880 |2880 | 1 | 24 | 32 |51200 / 768 | 8 / 80000 |
| Standard_NV72ads_A10_v5 |72 |880 |2880 | 2 | 48 | 32 | 80000 / 1200 | 8 / 80000 |

<sup>1</sup> NVadsA10v5-series VMs feature AMD Simultaneous multithreading Technology

<sup>2</sup> The actual GPU VRAM reported in the operating system will be little less due to Error Correcting Code (ECC) support.



## Supported operating systems and drivers

To take advantage of the GPU capabilities of Azure NVadsA10v5-series VMs, NVIDIA GPU drivers must be installed.

The [NVIDIA GPU Driver Extension](./extensions/hpccompute-gpu-windows.md) installs appropriate NVIDIA CUDA or GRID drivers on an N-series VM. Install or manage the extension using the Azure portal or tools such as Azure PowerShell or Azure Resource Manager templates. See the [NVIDIA GPU Driver Extension documentation](./extensions/hpccompute-gpu-windows.md) for supported operating systems and deployment steps. For general information about VM extensions, see [Azure virtual machine extensions and features](./extensions/overview.md).

If you choose to install NVIDIA GPU drivers manually, see [N-series GPU driver setup for Windows](./windows/n-series-driver-setup.md) or [N-series GPU driver setup for Linux](./linux/n-series-driver-setup.md) for supported operating systems, drivers, installation, and verification steps.


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
