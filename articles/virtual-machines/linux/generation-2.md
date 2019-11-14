---
title: Azure support for generation 2 VMs | Microsoft Docs
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

ms.topic: article
ms.date: 11/04/2019
ms.author: lahugh
---

# Support for generation 2 VMs on Azure

Support for generation 2 virtual machines (VMs) is now available on Azure. You can't change a virtual machine's generation after you've created it, so review the considerations on this page before you choose a generation.

Generation 2 VMs support key features that aren't supported in generation 1 VMs. These features include increased memory, Intel Software Guard Extensions (Intel SGX), and virtualized persistent memory (vPMEM). Generation 2 VMs running on-premises, have some features that aren't supported in Azure yet. For more information, see the [Features and capabilities](#features-and-capabilities) section.

Generation 2 VMs use the new UEFI-based boot architecture rather than the BIOS-based architecture used by generation 1 VMs. Compared to generation 1 VMs, generation 2 VMs might have improved boot and installation times. For an overview of generation 2 VMs and some of the differences between generation 1 and generation 2, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

## Generation 2 VM sizes

Generation 1 VMs are supported by all VM sizes in Azure. Azure now offers generation 2 support for the following selected VM series:

* [B-series](https://docs.microsoft.com/azure/virtual-machines/linux/b-series-burstable)
* [DC-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general#dc-series)
* [Dsv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general#dsv2-series) and [Dsv3-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general#dsv3-series-1)
* [Esv3-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory#esv3-series)
* [Fsv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-compute#fsv2-series-1)
* [GS-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-previous-gen#gs-series)
* [HB-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-hpc#hb-series)
* [HC-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-hpc#hc-series)
* [Ls-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-previous-gen#ls-series) and [Lsv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-storage#lsv2-series)
* [Mv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory#mv2-series)
* [NCv2-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu#ncv2-series) and [NCv3-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu#ncv3-series)
* [ND-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu#nd-series)
* [NVv3-series](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu#nvv3-series--1)

> [!NOTE]
> The usage of generation 2 VM images for Mv2-series VMs is generally available since the Mv2-series works with generation 2 VM images exclusively. Generation 1 VM images are not supported on Mv2-series VMs. 

## Generation 2 VM images in Azure Marketplace

Generation 2 VMs support the following Marketplace images:

* Windows Server 2019 Datacenter
* Windows Server 2016 Datacenter
* Windows Server 2012 R2 Datacenter
* Windows Server 2012 Datacenter
* SUSE Linux Enterprise Server 15 SP1
* SUSE Linux Enterprise Server 12 SP4
* Ubuntu Server 16.04+

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
| Boot             | PCAT         | UEFI |
| Disk controllers | IDE          | SCSI |
| VM sizes         | All VM sizes | Only VMs that support premium storage |

### Generation 1 vs. generation 2 capabilities

| Capability | Generation 1 | Generation 2 |
|------------|--------------|--------------|
| OS disk > 2 TB                    | :x:                | :heavy_check_mark: |
| Custom disk/image/swap OS         | :heavy_check_mark: | :heavy_check_mark: |
| Virtual machine scale set support | :heavy_check_mark: | :heavy_check_mark: |
| Azure Site Recovery               | :heavy_check_mark: | :x:                |
| Backup/restore                    | :heavy_check_mark: | :heavy_check_mark: |
| Shared image gallery              | :heavy_check_mark: | :heavy_check_mark: |
| Azure disk encryption             | :heavy_check_mark: | :x:                |

## Creating a generation 2 VM

### Marketplace image

In the Azure portal or Azure CLI, you can create generation 2 VMs from a Marketplace image that supports UEFI boot.

#### Azure portal

Generation 2 images for Windows and SLES are included in the same server offer as the Gen1 images. What that means from a flow perspective is that, you select the Offer and the SKU from the Portal for your VM. If the SKU supports both generation 1 and generation 2 images, you can select to create a generation 2 VM from the *Advanced* tab in the VM creation flow.

Currently, the following SKUs support both generation 1 and generation 2 images:

* Windows Server 2012
* Windows Server 2012 R2
* Windows Server 2016
* Windows Server 2019

When you select a Windows Server SKU as the offer, in the **Advanced** tab, there's an option to create either a **Gen 1** (BIOS) or **Gen 2** (UEFI) VM. If you select **Gen 2**, ensure the VM size selected in the **Basics** tab is [supported for generation 2 VMs](#generation-2-vm-sizes).

![Select Gen 1 or Gen 2 VM](./media/generation-2/gen1-gen2-select.png)

#### PowerShell

You can also use PowerShell to create a VM by directly referencing the generation 1 or generation 2 SKU.

For example, use the following PowerShell cmdlet to get a list of the SKUs in the `WindowsServer` offer.

```powershell
Get-AzVMImageSku -Location westus2 -PublisherName MicrosoftWindowsServer -Offer WindowsServer
```

If you're creating a VM with Windows Server 2012 as the OS, then you will select either the generation 1 (BIOS) or generation 2 (UEFI) VM SKU, which look like this:

```powershell
2012-Datacenter
2012-datacenter-gensecond
```

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

* **I have a .vhd file from my on-premises generation 2 VM. Can I use that .vhd file to create a generation 2 VM in Azure?**
  Yes, you can bring your generation 2 .vhd file to Azure and use that to create a generation 2 VM. Use the following steps to do so:
    1. Upload the .vhd to a storage account in the same region where you'd like to create your VM.
    1. Create a managed disk from the .vhd file. Set the Hyper-V Generation property to V2. The following PowerShell commands set Hyper-V Generation property when creating managed disk.

        ```powershell
        $sourceUri = 'https://xyzstorage.blob.core.windows.net/vhd/abcd.vhd'. #<Provide location to your uploaded .vhd file>
        $osDiskName = 'gen2Diskfrmgenvhd'  #<Provide a name for your disk>
        $diskconfig = New-AzDiskConfig -Location '<location>' -DiskSizeGB 127 -AccountType Standard_LRS -OsType Windows -HyperVGeneration "V2" -SourceUri $sourceUri -CreateOption 'Import'
        New-AzDisk -DiskName $osDiskName -ResourceGroupName '<Your Resource Group>' -Disk $diskconfig
        ```

    1. Once the disk is available, create a VM by attaching this disk. The VM created will be a generation 2 VM.
    When the generation 2 VM is created, you can optionally generalize the image of this VM. By generalizing the image you can use it to create multiple VMs.

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
