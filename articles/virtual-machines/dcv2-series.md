---
title: DCsv2-series - Azure Virtual Machines
description: Specifications for the DCsv2-series VMs.
author: mmcrey
ms.service: virtual-machines
ms.subservice: vm-sizes-general
ms.topic: conceptual
ms.date: 02/20/2020
ms.author: jushiman
---

# DCsv2-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The DCsv2-series virtual machines help protect the confidentiality and integrity of your data and code while it’s processed in the public cloud. DCsv2-series leverage Intel® Software Guard Extensions, which enable customers to use secure enclaves for protection.

These machines are backed by 3.7 GHz Intel® Xeon E-2288G (Coffee Lake) with SGX technology. With Intel® Turbo Boost Max Technology 3.0 these machines can go up to 5.0 GHz. 

Example use cases include: confidential multiparty data sharing, fraud detection, confidential databases, anti-money laundering, blockchain, confidential usage analytics, intelligence analysis and confidential machine learning.

## Configuration

[Turbo Boost Max 3.0](https://www.intel.com/content/www/us/en/gaming/resources/turbo-boost.html): Supported (Tenant VM will report 3.7 GHz, but will reach Turbo Speeds)<br>
[Hyper-Threading](https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html): Not Supported<br>
[Premium Storage](premium-storage-performance.md): Supported (Not Supported for Standard_DC8_v2)<br>
[Premium Storage Caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>

## Technical specifications

| Size             | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max NICs / Expected network bandwidth (MBps) | EPC Memory (MiB) |
|------------------|------|-------------|------------------------|----------------|-------------------------------------------------------------------------|----------------------------------------------|---------------------|
| Standard_DC1s_v2 | 1    | 4           | 50                     | 1              | 2000/16                                                                                               | 2   | 28                                      |
| Standard_DC2s_v2 | 2    | 8           | 100                    | 2              | 4000/32                                                                                               | 2  | 56                                          |
| Standard_DC4s_v2 | 4    | 16          | 200                    | 4              | 8000/64                                                                                               | 2  | 112                                          |
| Standard_DC8_v2  | 8   | 32          | 400                    | 8              | 16000/128                                                                                         | 2   | 168                                         |


## Get started

- Create DCsv2 VMs using the [Azure portal](./linux/quick-create-portal.md) or [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-compute.acc-virtual-machine-v2?tab=overview)
- DCsv2-series VMs are [Generation 2 VMs](./generation-2.md#creating-a-generation-2-vm) and only support `Gen2` images.
- Currently available in the regions listed in [Azure Products by Region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines&regions=all).
- Next generation of DC-series VMs: [Join the Preview Program](https://aka.ms/intelgen3)

## More sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)
- [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [More On Disk Types](./disks-types.md#ultra-disk)

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.