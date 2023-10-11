---
title: Azure support for generation 2 VMs 
description: Overview of Azure support for generation 2 VMs
author: lauradolan
ms.service: virtual-machines
ms.subservice: sizes
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 08/26/2022
ms.author: ladolan
---

# Support for generation 2 VMs on Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Support for generation 2 virtual machines (VMs) is now available on Azure. You can't change a virtual machine's generation after you've created it, so review the considerations on this page before you choose a generation.

Generation 2 VMs support key features that aren't supported in generation 1 VMs. These features include increased memory, Intel Software Guard Extensions (Intel SGX), and virtualized persistent memory (vPMEM). Generation 2 VMs running on-premises, have some features that aren't supported in Azure yet. For more information, see the [Features and capabilities](#features-and-capabilities) section.

Generation 2 VMs use the new UEFI-based boot architecture rather than the BIOS-based architecture used by generation 1 VMs. Compared to generation 1 VMs, generation 2 VMs might have improved boot and installation times. For an overview of generation 2 VMs and some of the differences between generation 1 and generation 2, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

## Generation 2 VM sizes

Azure now offers generation 2 support for the following selected VM series:

| VM Series | Generation 1 | Generation 2 | 
|-----------|--------------|--------------|
|[Av2-series](av2-series.md) |  :heavy_check_mark:  |  :x:  |
|[B-series](sizes-b-series-burstable.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[DCsv2-series](dcv2-series.md) |  :x:  | :heavy_check_mark: |
|[Dv2-series](dv2-dsv2-series.md) |  :heavy_check_mark: |  :x:  |
|[DSv2-series](dv2-dsv2-series.md) |  :heavy_check_mark: | :heavy_check_mark: |
|[Dv3-series](dv3-dsv3-series.md) | :heavy_check_mark: |  :x: |
|[Dsv3-series](dv3-dsv3-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Dv4-series](dv4-dsv4-series.md) | :heavy_check_mark: |  :heavy_check_mark: |
|[Dsv4-series](dv4-dsv4-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Dav4-series](dav4-dasv4-series.md) | :heavy_check_mark: |  :heavy_check_mark: |
|[Dasv4-series](dav4-dasv4-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Ddv4-series](ddv4-ddsv4-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Ddsv4-series](ddv4-ddsv4-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Dasv5-series](dasv5-dadsv5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Dadsv5-series](dasv5-dadsv5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[DCasv5-series](dcasv5-dcadsv5-series.md) |  :x: | :heavy_check_mark: |
|[DCadsv5-series](dcasv5-dcadsv5-series.md) |  :x: | :heavy_check_mark: |
|[Dpsv5-series](dpsv5-dpdsv5-series.md) |  :x: | :heavy_check_mark: |
|[Dpdsv5-series](dpsv5-dpdsv5-series.md) |  :x: | :heavy_check_mark: |
|[Dv5-series](dv5-dsv5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Dsv5-series](dv5-dsv5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Ddv5-series](ddv5-ddsv5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Ddsv5-series](ddv5-ddsv5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Ev3-series](ev3-esv3-series.md) | :heavy_check_mark: | :x: |
|[Esv3-series](ev3-esv3-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Ev4-series](ev4-esv4-series.md) |  :heavy_check_mark:|  :heavy_check_mark: |
|[Esv4-series](ev4-esv4-series.md) |  :heavy_check_mark:| :heavy_check_mark: |
|[Eav4-series](eav4-easv4-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Easv4-series](eav4-easv4-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Edv4-series](edv4-edsv4-series.md) |  :heavy_check_mark: | :heavy_check_mark: |
|[Edsv4-series](edv4-edsv4-series.md) |  :heavy_check_mark: | :heavy_check_mark: |
|[Easv5-series](easv5-eadsv5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[Eadsv5-series](easv5-eadsv5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[ECasv5-series](ecasv5-ecadsv5-series.md) |  :x: | :heavy_check_mark: |
|[ECadsv5-series](ecasv5-ecadsv5-series.md) |  :x: | :heavy_check_mark: |
|[Epsv5-series](epsv5-epdsv5-series.md) |  :x: | :heavy_check_mark: |
|[Epdsv5-series](epsv5-epdsv5-series.md) |  :x: | :heavy_check_mark: |
|[Edv5-series](edv5-edsv5-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[Edsv5-series](edv5-edsv5-series.md) |  :heavy_check_mark: | :heavy_check_mark: |
|[Ev5-series](ev5-esv5-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[Esv5-series](ev5-esv5-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[Fsv2-series](fsv2-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[FX-series](fx-series.md) |  :x:  | :heavy_check_mark: |
|[GS-series](sizes-previous-gen.md#gs-series) | :x:| :heavy_check_mark: |
|[HB-series](hb-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[HBv2-series](hbv2-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[HBv3-series](hbv3-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[HC-series](hc-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[Lsv2-series](lsv2-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[M-series](m-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[Mv2-series](mv2-series.md)<sup>1</sup> |  :x: | :heavy_check_mark: |
|[Msv2 and Mdsv2 Medium Memory Series](msv2-mdsv2-series.md)<sup>1</sup> | :x:  | :heavy_check_mark: |
|[NC-series](nc-series.md)  |  :heavy_check_mark:  |  :x: |
|[NCv2-series](ncv2-series.md)  |  :heavy_check_mark:  | :heavy_check_mark: |
|[NCv3-series](ncv3-series.md) |  :heavy_check_mark: | :heavy_check_mark: |
|[NCasT4_v3-series](nct4-v3-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[NC A100 v4-series](nc-a100-v4-series.md) |  :x: | :heavy_check_mark: |
|[ND-series](nd-series.md) |  :heavy_check_mark:  | :heavy_check_mark: |
|[ND A100 v4-series](nda100-v4-series.md) |  :x: | :heavy_check_mark: |
|[NDv2-series](ndv2-series.md) |  :x: | :heavy_check_mark: |
|[NV-series](nv-series.md) | :heavy_check_mark: |   :x: |
|[NVv3-series](nvv3-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[NVv4-series](nvv4-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[NVadsA10 v5-series](nva10v5-series.md) | :heavy_check_mark: | :heavy_check_mark: |
|[NDm A100 v4-series](ndm-a100-v4-series.md) |  :x: | :heavy_check_mark: |
|[NP-series](np-series.md) | :heavy_check_mark: |  :x: |

<sup>1</sup> Mv2-series, DC-series, NDv2-series, Msv2 and Mdsv2-series Medium Memory do not support Generation 1 VM images and only support a subset of Generation 2 images. Please see [Mv2-series documentation](mv2-series.md), [DSv2-series](dv2-dsv2-series.md), [ND A100 v4-series](nda100-v4-series.md), [NDv2-series](ndv2-series.md), and [Msv2 and Mdsv2 Medium Memory Series](msv2-mdsv2-series.md) for details.


## Generation 2 VM images in Azure Marketplace

Generation 2 VMs support the following Marketplace images:

* Windows Server 2022, 2019, 2016, 2012 R2, 2012
* Windows 11 Pro, Windows 11 Enterprise
* Windows 10 Pro, Windows 10 Enterprise
* SUSE Linux Enterprise Server 15 SP3, SP2
* SUSE Linux Enterprise Server 12 SP4
* Ubuntu Server 22.04 LTS, 20.04 LTS, 18.04 LTS, 16.04 LTS 
* RHEL 8.5, 8.4, 8.3, 8.2, 8.1, 8.0, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.0
* Cent OS 8.4, 8.3, 8.2, 8.1, 8.0, 7.7, 7.6, 7.5, 7.4
* Oracle Linux 8.4 LVM, 8.3 LVM, 8.2 LVM, 8.1, 7.9 LVM, 7.9, 7.8, 7.7

> [!NOTE]
> Specific Virtual machine sizes like Mv2-Series, DC-series, ND A100 v4-series, NDv2-series, Msv2 and Mdsv2-series may only support a subset of these images - please look at the relevant virtual machine size documentation for complete details.

## On-premises vs. Azure generation 2 VMs

Azure doesn't currently support some of the features that on-premises Hyper-V supports for generation 2 VMs.

| Generation 2 feature                | On-premises Hyper-V | Azure |
|-------------------------------------|---------------------|-------|
| Secure boot                         | :heavy_check_mark:  | With [trusted launch](trusted-launch.md)   |
| Shielded VM                         | :heavy_check_mark:  | :x:   |
| vTPM                                | :heavy_check_mark:  | With [trusted launch](trusted-launch.md)  |
| Virtualization-based security (VBS) | :heavy_check_mark:  | :heavy_check_mark:   |
| VHDX format                         | :heavy_check_mark:  | :x:   |

For more information, see [Trusted launch](trusted-launch.md).

## Features and capabilities

### Generation 1 vs. generation 2 features

| Feature | Generation 1 | Generation 2 |
|---------|--------------|--------------|
| Boot             | PCAT                      | UEFI                               |
| Disk controllers | IDE                       | SCSI                               |
| VM sizes         | All VM sizes | [See available sizes](#generation-2-vm-sizes) |

### Generation 1 vs. generation 2 capabilities

| Capability | Generation 1 | Generation 2 |
|------------|--------------|--------------|
| OS disk > 2 TB                    | :x:                | :heavy_check_mark: |
| Custom disk/image/swap OS         | :heavy_check_mark: | :heavy_check_mark: |
| Virtual machine scale set support | :heavy_check_mark: | :heavy_check_mark: |
| Azure Site Recovery               | :heavy_check_mark: | :heavy_check_mark: |
| Backup/restore                    | :heavy_check_mark: | :heavy_check_mark: |
| Azure Compute Gallery             | :heavy_check_mark: | :heavy_check_mark: |
| [Azure disk encryption](../virtual-machines/disk-encryption-overview.md)             | :heavy_check_mark: | :heavy_check_mark:                |
| [Server-side encryption](disk-encryption.md)            | :heavy_check_mark: | :heavy_check_mark: |


## Creating a generation 2 VM

### Azure Resource Manager Template
To create a simple Windows Generation 2 VM, see [Create a Windows virtual machine from a Resource Manager template](./windows/ps-template.md)
To create a simple Linux Generation 2 VM, see [How to create a Linux virtual machine with Azure Resource Manager templates](./linux/create-ssh-secured-vm-from-template.md)

### Marketplace image

In the Azure portal or Azure CLI, you can create generation 2 VMs from a Marketplace image that supports UEFI boot.

#### Azure portal

Below are the steps to create a generation 2 (Gen2) VM in Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Virtual Machines**
3. Under **Services**, select **Virtual machines**.
4. In the **Virtual machines** page, select **Add**, and then select **Virtual machine**.
5. Under **Project details**, make sure the correct subscription is selected.
6. Under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
7. Under **Instance details**, type a name for the virtual machine name and choose a region
8. Under **Image**, select a Gen2 image from the **Marketplace images to get started**
   > [!TIP]
   > If you don't see the Gen 2 version of the image you want in the drop-down, select **See all images** and then change the **Image Type** filter to **Gen 2**.
9. Select a VM size that supports Gen2. See a list of [supported sizes](#generation-2-vm-sizes).
10. Fill in the **Administrator account** information and then **Inbound port rules**
11.	At the bottom of the page, select **Review + Create**
12.	On the **Create a virtual machine** page, you can see the details about the VM you are about to deploy. Once validation shows as passed, select **Create**.

#### PowerShell

You can also use PowerShell to create a VM by directly referencing the generation 1 or generation 2 SKU.

For example, use the following PowerShell cmdlet to get a list of the SKUs in the `WindowsServer` offer.

```powershell
Get-AzVMImageSku -Location westus2 -PublisherName MicrosoftWindowsServer -Offer WindowsServer
```

If you're creating a VM with Windows Server 2019 as the OS, then you can select a generation 2 (UEFI) image which looks like this:

```powershell
2019-datacenter-gensecond
```
If you're creating a VM with Windows 10 as the OS, then you can select a generation 2 (UEFI) image which looks like this:

```powershell
20H2-PRO-G2
```

See the [Features and capabilities](#features-and-capabilities) section for a current list of supported Marketplace images.

#### Azure CLI

Alternatively, you can use the Azure CLI to see any available generation 2 images, listed by **Publisher**.

```azurecli
az vm image list --publisher Canonical --sku gen2 --output table --all
```

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
    When the generation 2 VM is created, you can optionally generalize the image of this VM. By generalizing the image, you can use it to create multiple VMs.

* **How do I increase the OS disk size?**  

  OS disks larger than 2 TiB are new to generation 2 VMs. By default, OS disks are smaller than 2 TiB for generation 2 VMs. You can increase the disk size up to a recommended maximum of 4 TiB. Use the Azure CLI or the Azure portal to increase the OS disk size. For information about how to expand disks programmatically, see **Resize a disk** for [Windows](./windows/expand-os-disk.md) or [Linux](./linux/resize-os-disk-gpt-partition.md).

  To increase the OS disk size from the Azure portal:

  1. In the Azure portal, go to the VM properties page.
  1. To shut down and deallocate the VM, select the **Stop** button.
  1. In the **Disks** section, select the OS disk you want to increase.
  1. In the **Disks** section, select **Configuration**, and update the **Size** to the value you want.
  1. Go back to the VM properties page and **Start** the VM.
  
  You might see a warning for OS disks larger than 2 TiB. The warning doesn't apply to generation 2 VMs. However, OS disk sizes larger than 4 TiB are not supported.

* **Do generation 2 VMs support accelerated networking?**  
    Yes. For more information, see [Create a VM with accelerated networking](../virtual-network/create-vm-accelerated-networking-cli.md).

* **Do generation 2 VMs support Secure Boot or vTPM in Azure?**
    Both vTPM and Secure Boot are features of trusted launch for generation 2 VMs. For more information, see [Trusted launch](trusted-launch.md).
    
* **Is VHDX supported on generation 2?**  
    No, generation 2 VMs support only VHD.

* **Do generation 2 VMs support Azure Ultra Disk Storage?**  
    Yes.

* **Can I migrate a VM from generation 1 to generation 2?**  
    No, you can't change the generation of a VM after you create it. If you need to switch between VM generations, create a new VM of a different generation.

* **Why is my VM size not enabled in the size selector when I try to create a Gen2 VM?**

    This may be solved by doing the following:

    1. Verify that the **VM generation** property is set to **Gen 2**.
    1. Verify you are searching for a [VM size which supports Gen2 VMs](#generation-2-vm-sizes).

## Next steps

Learn more about the [trusted launch](trusted-launch-portal.md) with gen 2 VMs.

Learn about [generation 2 virtual machines in Hyper-V](/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).
