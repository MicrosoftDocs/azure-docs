---
title: Generation 2 VMs (preview) on Azure | Microsoft Docs
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
ms.date: 05/23/2019
ms.author: lahugh
---

# Generation 2 VMs (preview) on Azure

> [!IMPORTANT]
> Generation 2 VMs are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Support for generation 2 virtual machines (VMs) is now available in public preview on Azure. You can't change a virtual machine's generation after you've created it. So, we recommend that you review the considerations [here](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v) as well as the information on this page before choosing a generation.

Generation 2 VMs support key features that aren't supported on generation 1 VMs, such as: increased memory, Intel® Software Guard Extensions (SGX), and virtual persistent memory (vPMEM). Generation 2 VMs also have some features that aren't supported on Azure yet. For more information, see the [Features and capabilities](#features-and-capabilities) section.

Generation 2 VMs use the new UEFI-based Boot architecture vs the BIOS-based architecture used by generation 1 VMs. Compared to generation 1 VMs, generation 2 VMs may have improved boot and installation times. For an overview of generation 2 VMs and some of the key differences between generation 1 and generation 2, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

## Generation 2 VM sizes

Generation 1 VMs are supported by all VM sizes in Azure. Azure now offers Generation 2 support for the following selected VM series in public preview:

* [Dsv2](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-general#dsv2-series) and [Dsv3-series](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-general#dsv3-series-1)
* [Esv3-series](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-memory#esv3-series)
* [Fsv2-series](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-compute#fsv2-series-1)
* [GS-series](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-memory#gs-series)
* [Ls-series](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-previous-gen#ls-series) and [Lsv2-series](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-storage#lsv2-series)
* [Mv2-series](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-memory#mv2-series)

## Generation 2 VM images in Azure Marketplace

Generation 2 VMs support the following Azure Marketplace images:

* Windows Server 2019 Datacenter
* Windows Server 2016 Datacenter
* Windows Server 2012 R2 Datacenter
* Windows Server 2012 Datacenter

## On-premises vs Azure generation 2 VMs

Azure does not currently support some of the features that on-premises Hyper-V supports for Generation 2 VMs.

| Generation 2 feature                | On-premises Hyper-V | Azure |
|-------------------------------------|---------------------|-------|
| Secure Boot                         | :heavy_check_mark:  | :x:   |
| Shielded VM                         | :heavy_check_mark:  | :x:   |
| vTPM                                | :heavy_check_mark:  | :x:   |
| Virtualization-Based Security (VBS) | :heavy_check_mark:  | :x:   |
| VHDX format                         | :heavy_check_mark:  | :x:   |

## Features and capabilities

### Generation 1 vs generation 2 features

| Feature | Generation 1 | Generation 2 |
|---------|--------------|--------------|
| Boot             | PCAT                      | UEFI                               |
| Disk controllers | IDE                       | SCSI                               |
| VM Sizes         | Available on all VM sizes | Premium storage supported VMs only |

### Generation 1 vs generation 2 capabilities

| Capability | Generation 1 | Generation 2 |
|------------|--------------|--------------|
| OS disk > 2 TB                    | :x:                        | :heavy_check_mark: |
| Custom Disk/Image/Swap OS         | :heavy_check_mark:         | :heavy_check_mark: |
| Virtual machine scale set support | :heavy_check_mark:         | :heavy_check_mark: |
| ASR/Backup                        | :heavy_check_mark:         | :x:                |
| Shared Image Gallery              | :heavy_check_mark:         | :x:                |
| Azure Disk Encryption             | :heavy_check_mark:         | :x:                |

## Creating a generation 2 VM

### Marketplace image

Generation 2 VMs can be created from a marketplace image (which supports UEFI boot) via the Azure portal or Azure CLI.

The `windowsserver-gen2preview` offer contains Windows generation 2 images only. This avoids confusion with regards to generation 1 vs generation 2 images. To create generation 2 VMs, select **Images** from this offer and follow the standard VM creation process.

Currently, the following Windows generation 2 images are published in the Azure Marketplace:

* 2019-datacenter-gen2
* 2016-datacenter-gen2
* 2012-r2-datacenter-gen2
* 2012-datacenter-gen2

See the capabilities section for a list of supported marketplace images as we will continue adding additional images that support Generation 2.

### Managed image or managed disk

Generation 2 VMs can be created from managed image or managed disk in the same way you would create a generation 1 VM.

### Virtual machine scale sets

Generation 2 VMs can also be created using virtual machine scale sets. You can create generation 2 VMs using Azure virtual machine scale sets via Azure CLI.

## Frequently asked questions

* **Are generation 2 VMs available in all Azure regions?**  
    Yes; however, not all [generation 2 VM sizes](#generation-2-vm-sizes) are available in every region. The availability of generation 2 VMs is dependent upon the availability of the VM size.

* **Is there a price difference between generation 1 and generation 2 VMs?**  
    There is no difference in pricing between generation 1 and generation 2 VMs.

* **How do I increase the OS disk size?**  
  OS disks larger than 2 TB are new to generation 2 VMs. By default, most OS disks are less than 2 TB for generation 2 VMs, but the disk size can be increased to a recommended maximum of 4 TB. You can increase the OS disk size via the Azure CLI or the Azure portal. For more information on expanding disks programmatically, see [Resize a disk](expand-os-disk.md).

  To increase the OS disk size via Azure portal:

  * Navigate to the VM properties page on the Azure portal.

  * Shut down and deallocate the VM using the **Stop** button on the Azure portal.

  * In the **Disks** section, select the OS disk that you'd like to increase.

  * Select **Configuration** in the **Disks** section and update the **Size** to the desired value.

  * Navigate back to the VM properties page and **Start** the VM.
  
  You may see a warning for OS disks larger than 2 TB. The warning does not apply to generation 2 VMs; however, OS disk sizes larger than 4 TB are **not recommended.**

* **Do generation 2 VMs support Accelerated Networking?**  
    Yes, generation 2 VMs support [Accelerated Networking](../../virtual-network/create-vm-accelerated-networking-cli.md).

* **Is .vhdx supported on generation 2?**  
    No, only .vhd is supported on generation 2 VMs.

* **Do generation 2 VMs support Ultra Solid State Drives (SSD)?**  
    Yes, generation 2 VMs support Ultra SSD.

* **Can I migrate from generation 1 to generation 2 VMs?**  
    No, you can't change the generation of a VM after you've created it. If you need to switch between VM generations, you need to create a new VM of a different generation.

## Next steps

* Learn more about [generation 2 virtual machines in Hyper-V](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

* Learn how to [prepare a VHD](prepare-for-upload-vhd-image.md) for upload from on-premises to Azure.
