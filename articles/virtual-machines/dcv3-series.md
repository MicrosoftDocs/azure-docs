---
title: DCsv3 and DCdsv3-series
description: Specifications for the DCsv3 and DCdsv3-series Azure Virtual Machines.
author: linuxelf001
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 05/24/2022
ms.author: raginjup
ms.custom: ignite-fall-2021
---

# DCsv3 and DCdsv3-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The DCsv3 and DCdsv3-series Azure Virtual Machines help protect the confidentiality and integrity of your code and data while they're being processed in the public cloud. By using Intel&reg; Software Guard Extensions and Intel&reg; [Total Memory Encryption - Multi Key](https://itpeernetwork.intel.com/memory-encryption/), customers can ensure their data is always encrypted and protected in use. 

These machines are powered by the latest 3rd Generation Intel&reg; Xeon Scalable processors, and use Intel&reg; Turbo Boost Max Technology 3.0 to reach 3.5 GHz. 

With this generation, CPU Cores have increased 6x (up to a maximum of 48 physical cores). Encrypted Memory (EPC) has increased 1500x to 256 GB. Regular Memory has increased 12x to 384 GB. All these changes substantially improve the performance and unlock entirely new scenarios. 

> [!NOTE]
> Hyperthreading is disabled for added security posture. Pricing is the same as Dv5 and Dsv5-series per physical core.

There are two variants for each series, depending on whether the workload benefits from a local disk or not. You can attach remote persistent disk storage to all VMs, whether or not the VM has a local disk. As always, remote disk options (such as for the VM boot disk) are billed separately from the VMs in any case.

DCsv3-series instances run on a 3rd Generation Intel&reg; Xeon Scalable Processor 8370C. The base All-Core frequency is 2.8 GHz. [Turbo Boost Max 3.0](https://www.intel.com/content/www/us/en/gaming/resources/turbo-boost.html) is enabled with a max frequency of 3.5 GHz. 

- [Premium Storage](premium-storage-performance.md): Supported
- [Live Migration](maintenance-and-updates.md): Not supported
- [Memory Preserving Updates](maintenance-and-updates.md): Not supported
- [VM Generation Support](generation-2.md): Generation 2
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported
- [Ephemeral OS Disks](ephemeral-os-disks.md): Supported for DCdsv3-series
- [Ultra-Disk Storage](disks-enable-ultra-ssd.md): Supported
- [Azure Kubernetes Service](../aks/intro-kubernetes.md): Supported (CLI provisioning only)
- [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported 
- [Hyper-Threading](https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html): Not supported
- [Trusted Launch](trusted-launch.md): Supported
- [Dedicated Host](dedicated-hosts.md): Not supported


## DCsv3-series

| Size             | Physical Cores | Memory GB | Temp storage (SSD) GiB | Max data disks | Max NICs |  EPC Memory GiB |
|------------------|----------------|-------------|------------------------|----------------|---------|---------------------|
| Standard_DC1s_v3 | 1              | 8           | Remote Storage Only    | 4              | 2     |  4                 |
| Standard_DC2s_v3 | 2              | 16          | Remote Storage Only    | 8              | 2     |  8                 |
| Standard_DC4s_v3 | 4              | 32          | Remote Storage Only    | 16             | 4     |  16                |
| Standard_DC8s_v3 | 8              | 64          | Remote Storage Only    | 32             | 8     |  32                |
| Standard_DC16s_v3  | 16           | 128         | Remote Storage Only    | 32             | 8     |  64                |
| Standard_DC24s_v3  | 24           | 192         | Remote Storage Only    | 32             | 8     |  128               |
| Standard_DC32s_v3  | 32           | 256         | Remote Storage Only    | 32             | 8     |  192               |
| Standard_DC48s_v3  | 48           | 384         | Remote Storage Only    | 32             | 8     |  256               |

## DCdsv3-series

| Size             | Physical Cores | Memory GB | Temp storage (SSD) GiB | Max data disks | Max NICs |  EPC Memory GiB |
|------------------|----------------|-------------|------------------------|----------------|---------|---------------------|
| Standard_DC1ds_v3 | 1              | 8           | 75                    | 4              | 2     |  4                 |
| Standard_DC2ds_v3 | 2              | 16          | 150                    | 8              | 2     |  8                 |
| Standard_DC4ds_v3 | 4              | 32          | 300                    | 16             | 4     |  16                |
| Standard_DC8ds_v3 | 8              | 64          | 600                    | 32             | 8     |  32                |
| Standard_DC16ds_v3  | 16           | 128         | 1200                    | 32             | 8     |  64                |
| Standard_DC24ds_v3  | 24           | 192         | 1800                    | 32             | 8     |  128               |
| Standard_DC32ds_v3  | 32           | 256         | 2400                    | 32             | 8     |  192               |
| Standard_DC48ds_v3  | 48           | 384         | 2400                    | 32             | 8     |  256               |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## More sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)
- [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

## Next steps

- Create DCsv3 and DCdsv3 VMs using the [Azure portal](./linux/quick-create-portal.md)
- DCsv3 and DCdsv3 VMs are [Generation 2 VMs](./generation-2.md#creating-a-generation-2-vm) and only support `Gen2` images.
- Currently available in the regions listed in [Azure Products by Region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines&regions=all).

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
