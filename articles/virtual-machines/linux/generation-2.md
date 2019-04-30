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
ms.date: 05/06/2019
ms.author: lahugh
---

# Generation 2 VMs (preview) on Azure

> [!IMPORTANT]
> Generation 2 VMs are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Support for generation 2 virtual machines (VMs) is now available in public preview on Azure. You can't change a virtual machine's generation after you've created it. So, we recommend that you review the considerations [here](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v) as well as the information on this page before choosing a generation.


Generation 2 VMs support key features like: increased memory, Intel® Software Guard Extensions (SGX), and virtual persistent memory (vPMEM), which are not supported on generation 1 VMs. Generation 2 VMs use the new UEFI-based Boot architecture vs the BIOS-based architecture used by generation 1 VMs. Compared to generation 1 VMs, generation 2 VMs may have improved boot and installation times.

This article provides an overview of generation 2 VM features on Azure. If you'd like to learn more about generation 1 and generation 2 VMs in Hyper-V, see [VM Generation](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

## Creating a generation 2 VM

Generation 2 VMs can be created from a marketplace image, a managed image, or a managed disk.

### Marketplace image

Generation 2 VMs can be created from a marketplace image (which supports UEFI Boot) via the Azure portal or Azure CLI.

An offer named `windowsserver-gen2preview` contains Windows generation 2 images only. This avoids confusion with regards to generation 1 vs generation 2 images. To create generation 2 VMs, select **Images** from this offer and follow the standard VM creation process.
 
Currently, the following Windows generation 2 images are published in the Azure Marketplace:

* 2019-datacenter-gen2
* 2016-datacenter-gen2
* 2012-r2-datacenter-gen2
* 2012-datacenter-gen2

See the capabilities section for a list of supported marketplace images as we will continue adding additional images that support Generation 2 (UEFI boot). 

### Managed image or managed disk

Generation 2 VMs can be created from managed image or managed disk in the same way you would create a generation 1 VM.

You can use your on-premises generation 2 VHD file to create a generation 2 VM in Azure too. To do that you would need to the following:

* Create your OS disk as Gen2 from your on-prem VHD via powershell. You can set a property "-HyperVGeneration V2 when creating the disk. (You would need PS version 1.7 and above.)
* You can then create a VM from this disk and it will create a Gen2 VM.

Generation 2 VMs can also be created using Virtual Machine Scale Set (VMSS). You can create generation 2 VMs using VMSS, via command line. 

The ability to create Generation 2 Virtual Machine using VMSS via Portal will be available in the future.


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


## Generation 2 VM images in Azure Marketplace

Generation 2 VMs support the following Azure Marketplace images:

* Windows server 2019 Datacenter
* Windows server 2016 Datacenter
* Windows server 2012 R2 Datacenter
* Windows server 2012 Datacenter

## On-premises vs Azure generation 2 VMs

Azure does not currently support some of the features that on-premises Hyper-V supports for Generation 2 VMs. 

| Generation 2 feature                | On-premises Hyper-V | Azure |
|-------------------------------------|---------------------|-------|
| Secure Boot                         | :heavy_check_mark:  | :x:   |
| Shielded VM                         | :heavy_check_mark:  | :x:   |
| vTPM                                | :heavy_check_mark:  | :x:   |
| Virtualization Based Security (VBS) | :heavy_check_mark:  | :x:   |
| VHDX format                         | :heavy_check_mark:  | :x:   |

## Generation 1 vs generation 2 VM features

| Feature | Generation 1 | Generation 2 |
|---------|--------------|--------------|
| Boot             | PCAT                      | UEFI                               |
| Disk controllers | IDE                       | SCSI                               |
| OS disk type     | Standard and premium      | Premium                            |
| VM Sizes         | Available on all VM sizes | Premium storage supported VMs only |

## Generation 1 vs generation 2 VM capabilities

| Capability | Generation 1 | Generation 2 |
|------------|--------------|--------------|
| OS disk > 2 TB                    | :x:                        | :heavy_check_mark: |
| Custom Disk/Image/Swap OS         | :heavy_check_mark:         | :heavy_check_mark: |
| Virtual machine scale set support | :heavy_check_mark:         | :heavy_check_mark: |
| ASR/Backup                        | :heavy_check_mark:         | :x:                |
| Shared Image Gallery              | :heavy_check_mark:         | :x:                |
| Azure Disk Encryption             | :heavy_check_mark:         | :x:                |

## Frequently asked questions

* **Do generation 2 VMs support Accelerated Networking?**  
    Yes, generation 2 VMs support [Accelerated Networking](../../virtual-network/create-vm-accelerated-networking-cli).

* **Is .vhdx supported on generation 2?**  
    No, only .vhd is supported on generation 2 VMs.

* **Do generation 2 VMs support Ultra Solid State Drives (SSD)?**  
    Yes, generation 2 VMs support Ultra SSD.

* **Can I migrate from generation 1 to generation 2 VMs?**  
    No, you can't change the generation of a VM after you've created it. If you need to switch between VM generations, you need to create a new VM of a different generation.