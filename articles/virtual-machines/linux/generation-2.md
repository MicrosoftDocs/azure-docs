---
title: Azure support for generation 2 VMs (preview) | Microsoft Docs
description: Overview of Azure support for generation 2 VMs
services: virtual-machines-linux
documentationcenter: ''
author: laurenhughes
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 05/23/2019
ms.author: lahugh
---

# Support for generation 2 VMs (preview) on Azure

> [!IMPORTANT]
> Azure support for generation 2 VMs is currently in preview. 
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

Support for generation 2 virtual machines (VMs) is now available in preview in Azure. You can't change a virtual machine's generation after you've created it, so review the considerations on this page before you choose a generation. 

Generation 2 VMs support key features that aren't supported in generation 1 VMs. These features include increased memory, Intel Software Guard Extensions (Intel SGX), and virtualized persistent memory (vPMEM). Generation 2 VMs also have some features that aren't supported in Azure yet. For more information, see the [Features and capabilities](#features-and-capabilities) section.

Generation 2 VMs use the new UEFI-based boot architecture rather than the BIOS-based architecture used by generation 1 VMs. Compared to generation 1 VMs, generation 2 VMs might have improved boot and installation times. For an overview of generation 2 VMs and some of the differences between generation 1 and generation 2, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

## Generation 2 VM sizes

Generation 1 VMs are supported by all VM sizes in Azure. Azure now offers preview generation 2 support for the following selected VM series:

* [Dsv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general#dsv2-series) and [Dsv3-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general#dsv3-series-1)
* [Esv3-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory#esv3-series)
* [Fsv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-compute#fsv2-series-1)
* [GS-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-previous-gen#gs-series)
* [Ls-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-previous-gen#ls-series) and [Lsv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-storage#lsv2-series)
* [Mv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory#mv2-series)

## Generation 2 VM images in Azure Marketplace

Generation 2 VMs support the following Marketplace images:

* Windows Server 2019 Datacenter
* Windows Server 2016 Datacenter
* Windows Server 2012 R2 Datacenter
* Windows Server 2012 Datacenter

## On-premises vs. Azure generation 2 VMs

Azure doesn't currently support some of the features that on-premises Hyper-V supports for generation 2 VMs.

| Generation 2 feature                | On-premises Hyper-V | Azure |
|-------------------------------------|---------------------|-------|
| Secure boot                         | :heavy_check_mark:  | :x:   |
| Shielded VM                         | :heavy_check_mark:  | :x:   |
| vTPM                                | :heavy_check_mark:  | :x:   |
| Virtualization-based security (VBS) | :heavy_check_mark:  | :x:   |
| VHDX format                         | :heavy_check_mark:  | :x:   |

## Features and capabilities

### Generation 1 vs. generation 2 features

| Feature | Generation 1 | Generation 2 |
|---------|--------------|--------------|
| Boot             | PCAT                      | UEFI                               |
| Disk controllers | IDE                       | SCSI                               |
| VM sizes         | All VM sizes | Only VMs that support premium storage |

### Generation 1 vs. generation 2 capabilities

| Capability | Generation 1 | Generation 2 |
|------------|--------------|--------------|
| OS disk > 2 TB                    | :x:                        | :heavy_check_mark: |
| Custom disk/image/swap OS         | :heavy_check_mark:         | :heavy_check_mark: |
| Virtual machine scale set support | :heavy_check_mark:         | :heavy_check_mark: |
| ASR/backup                        | :heavy_check_mark:         | :x:                |
| Shared image gallery              | :heavy_check_mark:         | :x:                |
| Azure disk encryption             | :heavy_check_mark:         | :x:                |

## Creating a generation 2 VM

### Marketplace image

In the Azure portal or Azure CLI, you can create generation 2 VMs from a Marketplace image that supports UEFI boot.

The `windowsserver-gen2preview` offer contains Windows generation 2 images only. This packaging avoids confusion between generation 1 and generation 2 images. To create a generation 2 VM, select **Images** from this offer and follow the standard process to create the VM.

Currently, Marketplace offers the following Windows generation 2 images:

* 2019-datacenter-gen2
* 2016-datacenter-gen2
* 2012-r2-datacenter-gen2
* 2012-datacenter-gen2

See the [Features and capabilities](#features-and-capabilities) section for a current list of supported Marketplace images.

### Managed image or managed disk

You can create a generation 2 VM from a managed image or managed disk in the same way you would create a generation 1 VM.

### Virtual machine scale sets

You can also create generation 2 VMs by using virtual machine scale sets. In the Azure CLI, use Azure scale sets to create generation 2 VMs.

## Frequently asked questions

* **Are generation 2 VMs available in all Azure regions?**  
    Yes. But not all [generation 2 VM sizes](#generation-2-vm-sizes) are available in every region. The availability of the generation 2 VM depends on the availability of the VM size.

* **Is there a price difference between generation 1 and generation 2 VMs?**  
    No.

* **How do I increase the OS disk size?**  
  OS disks larger than 2 TB are new to generation 2 VMs. By default, OS disks are smaller than 2 TB for generation 2 VMs. You can increase the disk size up to a recommended maximum of 4 TB. Use the Azure CLI or the Azure portal to increase the OS disk size. For information about how to expand disks programmatically, see [Resize a disk](expand-disks.md).

  To increase the OS disk size from the Azure portal:

  1. In the Azure portal, go to the VM properties page.
  1. To shut down and deallocate the VM, select the **Stop** button.
  1. In the **Disks** section, select the OS disk you want to increase.
  1. In the **Disks** section, select **Configuration**, and update the **Size** to the value you want.
  1. Go back to the VM properties page and **Start** the VM.

  You might see a warning for OS disks larger than 2 TB. The warning doesn't apply to generation 2 VMs. However, OS disk sizes larger than 4 TB are *not recommended.*

* **Do generation 2 VMs support accelerated networking?**  
    Yes. For more information, see [Create a VM with accelerated networking](../../virtual-network/create-vm-accelerated-networking-cli.md).

* **Is VHDX supported on generation 2?**  
    No, generation 2 VMs support only VHD.

* **Do generation 2 VMs support Azure Ultra Disk Storage?**  
    Yes.

* **Can I migrate a VM from generation 1 to generation 2?**  
    No, you can't change the generation of a VM after you create it. If you need to switch between VM generations, create a new VM of a different generation.

## Next steps

* Learn about [generation 2 virtual machines in Hyper-V](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).
