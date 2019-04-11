---
title: Generation 2 VMs (preview) | Microsoft Docs
description: Overview of Azure Generation 2 VMs
services: virtual-machines-windows
documentationcenter: ''
author: laurenhughes
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
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

Support for generation 2 virtual machines (VMs) is now available in public preview on Azure. Generation 2 VMs support key features like: increased memory, Intel® Software Guard Extensions (SGX), and virtual persistent memory (vPMEM), which are not supported on generation 1 VMs. Compared to generation 1 VMs, generation 2 VMs may have improved boot and installation times. 

This article provides an overview of generation 2 VM features on Azure. If you'd like to learn more about generation 1 and generation 2 VMs in Hyper-V, see [VM Generation](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

## Supported scenarios

Generation 2 VMs can be created from a marketplace image, a managed image, or a managed disk.

### Create a generation 2 VM from a Marketplace image

The Portal can be used to create a generation 2 VM from an Azure Marketplace image. See the [capabilities](#generation-1-vs-generation-2-vm-capabilities) section for a list of supported marketplace images.

### Create a generation 2 VM from a managed image

For public preview, generation 2 VMs can't be created with managed images using the Azure portal. Instead, use [PowerShell](quick-create-powershell.md) to create a generation 2 VM from a managed image.

### Create a generation 2 VM from a managed disk

Similar to managed images, in public preview generation 2 VMs can't be created with managed disks using the Azure portal. Instead, use [PowerShell](quick-create-powershell.md) to create a generation 2 VM from a managed disk. 

## Generation 2 VM sizes

Generation 1 VMs are supported by all VM sizes in Azure. Azure now offers Generation 2 support for the following selected VM series in public preview:

* [Dsv2](/sizes-general.md#dsv2-series) and [Dsv3-series](/sizes-general.md#dsv3-series-1)
* [Esv3-series](/sizes-memory.md#esv3-series)
* [Fsv2-series](/sizes-compute.md#fsv2-series-1)
* [GS-series](/sizes-memory.md#gs-series)
* [Ls-series](/sizes-storage.md#ls-series) and [Lsv2-series](/sizes-storage.md#lsv2-series)


## Generation 2 VM images

Generation 2 VMs support the following Azure Marketplace images:

* Windows server 2019 Datacenter
* Windows server 2016 Datacenter
* Windows server 2012 R2 Datacenter
* Windows server 2012 Datacenter


Azure does not currently support some of the features that on-premises Hyper-V supports for Generation 2 VMs. 

| Generation 2 feature                | On-premises Hyper-V | Azure |
|-------------------------------------|---------------------|-------|
| Secure Boot                         | :heavy_check_mark:  | :x:   |
| Shielded VM                         | :heavy_check_mark:  | :x:   |
| vTPM                                | :heavy_check_mark:  | :x:   |
| Virtualization Based Security (VBS) | :heavy_check_mark:  | :x:   |
| VHDX format                         | :heavy_check_mark:  | :x:   |

## Generation 1 vs Generation 2 VM capabilities

| Feature                           | Generation 1               | Generation 2                        |
|-----------------------------------|----------------------------|-------------------------------------|
| O.S Disk > 2 TB                   | :x:                        | :heavy_check_mark:                  |
| Custom Disk/Image/Swap O.S        | :heavy_check_mark:         | :heavy_check_mark:                  |
| Virtual Machine Scale Set Support | :heavy_check_mark:         | :heavy_check_mark:                  |
| VM Sizes                          | Available on all VM sizes. | Premium Storage supported VMs only. |
| ASR/Backup                        | :heavy_check_mark:         | :x:                                 |
| Shared Image Gallery              | :heavy_check_mark:         | :x:                                 |
| Azure Disk Encryption             | :heavy_check_mark:         | :x:                                 |

## Frequently asked questions

* **Do generation 2 VMs support Accelerated Networking?**  
    Yes, generation 2 VMs support [Accelerated Networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli).

* **Is .vhdx supported on generation 2?**  
    No, only .vhd is supported on generation 2 VMs.

* **Do generation 2 VMs support Ultra Solid State Drives (SSD)?**  
    Yes, generation 2 VMs support Ultra SSD.

* **Can I migrate from generation 1 to generation 2 VMs?**  
    No, you can't change the generation of a VM after you've created it. If you need to switch between VM generations, create a new VM with the generation you need.