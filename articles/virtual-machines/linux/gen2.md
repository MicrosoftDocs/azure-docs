---
title: Generation 2 VMs (preview) | Microsoft Docs
description: Overview of Azure Generation 2 VMs
services: virtual-machines-linux
documentationcenter: ''
author: laurenhughes
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 04/08/2019
ms.author: lahugh
---

# Generation 2 VMs (preview) on Azure

> [!IMPORTANT]
> Generation 2 VMs are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Support for generation 2 virtual machines (VMs) is now available in public preview on Azure. Now, you can upload a generation 2 Windows virtual machines (VM) from on-premises to Azure.

Generation 2 VMs support key features like: increased memory, Intel® Software Guard Extensions (SGX), and virtual persistent memory (vPMEM), which are not supported on generation 1 VMs. Compared to generation 1 VMs, generation 2 VMs may have improved boot and installation times.

For public preview, custom image generation 2 VMs cannot be created in the Azure portal. Instead, create a custom image generation 2 VM using [PowerShell](quick-create-powershell.md). The Portal can be used to create a generation 2 VM from an Azure Marketplace image. See the [capabilities](#generation-1-vs-generation-2-vm-capabilities) section for a list of supported marketplace images.

All VM sizes in Azure currently support Generation 1 VMs. Azure now offers Generation 2 support for the following selected VM series in public preview:

* [Dsv2](/sizes-general.md#dsv2-series) and [Dsv3-series](/sizes-general.md#dsv3-series-1)
* [Esv3-series](/sizes-memory.md#esv3-series)
* [Fsv2-series](/sizes-compute.md#fsv2-series-1)
* [GS-series](/sizes-memory.md#gs-series)
* [Ls-series](/sizes-storage.md#ls-series) and [Lsv2-series](/sizes-storage.md#lsv2-series)

Generation 2 VMs support UEFI BIOS configurations. UEFI provides support for features like:

* GPT disks, which enables OS disks up to 2 TB.
* Up to 12 TB of memory.

But, Azure does not currently support some of the features that on-premises Hyper-V supports for Generation 2 VMs. 

| Generation 2 feature                | On-premises Hyper-V | Azure |
|-------------------------------------|---------------------|-------|
| Secure Boot                         | :heavy_check_mark:  | :x:   |
| Shielded VM                         | :heavy_check_mark:  | :x:   |
| vTPM                                | :heavy_check_mark:  | :x:   |
| Virtualization Based Security (VBS) | :heavy_check_mark:  | :x:   |

## Generation 1 vs Generation 2 VM capabilities

| Feature                           | Generation 1               | Generation 2                        |
|-----------------------------------|----------------------------|-------------------------------------|
| O.S Disk > 2 TB                   | :x:                        | :heavy_check_mark:                  |
| Custom Disk/Image/Swap O.S        | :heavy_check_mark:         | :heavy_check_mark:                  |
| Virtual Machine Scale Set Support | :heavy_check_mark:         | :heavy_check_mark:                  |
| VM Sizes                          | Available on all VM sizes. | Premium Storage supported VMs only. |
| ASR/Backup                        | :heavy_check_mark:         | :x:                                 |
| Shared Image Gallery              | :heavy_check_mark:         | :x:                                 |

Generation 2 VMs support the following Azure Marketplace images:

* Windows server 2019 Datacenter
* Windows server 2016 Datacenter
* Windows server 2012 R2 Datacenter
* Windows server 2012 Datacenter
* Ubuntu
* SUSE
* Third Party publishers including SQL and others

## Frequently asked questions

* **Do Gen2 VMs support Accelerated Networking?**  
    Yes, Gen2 VMs support [Accelerated Networking](../../articles/virtual-network/create-vm-accelerated-networking-cli.md).

* **Is .vhdx supported on Gen2?**
    No, only .vhd is supported on Gen2 VMs.

* **Do generation 2 VMs support Ultra Solid State Drives (SSD)?**
    Yes, generation 2 VMs support Ultra SSD.

* **Can I migrate from generation 1 to generation 2 VMs?**
    No, (TBD).