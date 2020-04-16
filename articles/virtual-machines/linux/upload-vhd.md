---
title: Upload or copy a custom Linux VM with Azure CLI 
description: Upload or copy a customized virtual machine by using the Resource Manager deployment model and the Azure CLI
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: gwallace

tags: azure-resource-manager

ms.assetid: a8c7818f-eb65-409e-aa91-ce5ae975c564
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 10/10/2019
ms.author: cynthn

---
# Create a Linux VM from a custom disk with the Azure CLI

<!-- rename to create-vm-specialized -->

This article shows you how to upload a customized virtual hard disk (VHD), and how to copy an existing VHD in Azure. The newly created VHD is then used to create new Linux virtual machines (VMs). You can install and configure a Linux distro to your requirements and then use that VHD to create a new Azure virtual machine.

To create multiple VMs from your customized disk, first create an image from your VM or VHD. For more information, see [Create a custom image of an Azure VM by using the CLI](tutorial-custom-images.md).

You have two options to create a custom disk:
* Upload a VHD
* Copy an existing Azure VM


## Requirements
To complete the following steps, you'll need:

- A Linux virtual machine that has been prepared for use in Azure. The [Prepare the VM](#prepare-the-vm) section of this article covers how to find distro-specific information on installing the Azure Linux Agent (waagent), which is needed for you to connect to a VM with SSH.
- The VHD file from an existing [Azure-endorsed Linux distribution](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) (or see [information for non-endorsed distributions](create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)) to a virtual disk in the VHD format. Multiple tools exist to create a VM and VHD:
  - Install and configure [QEMU](https://en.wikibooks.org/wiki/QEMU/Installing_QEMU) or [KVM](https://www.linux-kvm.org/page/RunningKVM), taking care to use VHD as your image format. If needed, you can [convert an image](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) with `qemu-img convert`.
  - You can also use Hyper-V [on Windows 10](https://msdn.microsoft.com/virtualization/hyperv_on_windows/quick_start/walkthrough_install) or [on Windows Server 2012/2012 R2](https://technet.microsoft.com/library/hh846766.aspx).

> [!NOTE]
> The newer VHDX format is not supported in Azure. When you create a VM, specify VHD as the format. If needed, you can convert VHDX disks to VHD with [qemu-img convert](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) or the [Convert-VHD](https://technet.microsoft.com/library/hh848454.aspx) PowerShell cmdlet. Azure does not support uploading dynamic VHDs, so you'll need to convert such disks to static VHDs before uploading. You can use tools such as [Azure VHD Utilities for GO](https://github.com/Microsoft/azure-vhd-utils-for-go) to convert dynamic disks during the process of uploading them to Azure.
> 
> 


- Make sure that you have the latest [Azure CLI](/cli/azure/install-az-cli2) installed and you are signed in to an Azure account with [az login](/cli/azure/reference-index#az-login).

In the following examples, replace example parameter names with your own values, such as `myResourceGroup`, `mystorageaccount`, and `mydisks`.

<a id="prepimage"> </a>

## Prepare the VM

Azure supports various Linux distributions (see [Endorsed Distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)). The following articles describe how to prepare the various Linux distributions that are supported on Azure:

* [CentOS-based Distributions](create-upload-centos.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Debian Linux](debian-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Oracle Linux](oracle-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Red Hat Enterprise Linux](redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [SLES & openSUSE](suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Ubuntu](create-upload-ubuntu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Others: Non-Endorsed Distributions](create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

Also see the [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more general tips on preparing Linux images for Azure.

> [!NOTE]
> The [Azure platform SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) applies to VMs running Linux only when one of the endorsed distributions is used with the configuration details as specified under "Supported Versions" in [Linux on Azure-Endorsed Distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
> 
> 

## Option 1: Upload a VHD

You can now upload VHD straight into a managed disk. For instructions, see [Upload a VHD to Azure using Azure CLI](disks-upload-vhd-to-managed-disk-cli.md).

## Option 2: Copy an existing VM

You can also create a customized VM in Azure and then copy the OS disk and attach it to a new VM to create another copy. This is fine for testing, but if you want to use an existing Azure VM as the model for multiple new VMs, create an *image* instead. For more information about creating an image from an existing Azure VM, see [Create a custom image of an Azure VM by using the CLI](tutorial-custom-images.md).

If you want to copy an existing VM to another region, you might want to use azcopy to [creat a copy of a disk in another region](disks-upload-vhd-to-managed-disk-cli.md#copy-a-managed-disk). 

Otherwise, you should take a snapshot of the VM and then create a new OS VHD from the snapshot.

### Create a snapshot

This example creates a snapshot of a VM named *myVM* in resource group *myResourceGroup* and creates a snapshot named *osDiskSnapshot*.

```azurecli
osDiskId=$(az vm show -g myResourceGroup -n myVM --query "storageProfile.osDisk.managedDisk.id" -o tsv)
az snapshot create \
    -g myResourceGroup \
	--source "$osDiskId" \
	--name osDiskSnapshot
```
###  Create the managed disk

Create a new managed disk from the snapshot.

Get the ID of the snapshot. In this example, the snapshot is named *osDiskSnapshot* and it is in the *myResourceGroup* resource group.

```azurecli
snapshotId=$(az snapshot show --name osDiskSnapshot --resource-group myResourceGroup --query [id] -o tsv)
```

Create the managed disk. In this example, we will create a managed disk named *myManagedDisk* from our snapshot, where the disk is in standard storage and sized at 128 GB.

```azurecli
az disk create \
    --resource-group myResourceGroup \
	--name myManagedDisk \
	--sku Standard_LRS \
	--size-gb 128 \
	--source $snapshotId
```

## Create the VM

Create your VM with [az vm create](/cli/azure/vm#az-vm-create) and attach (--attach-os-disk) the managed disk as the OS disk. The following example creates a VM named *myNewVM* using the managed disk you created from your uploaded VHD:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --location eastus \
    --name myNewVM \
	--os-type linux \
    --attach-os-disk myManagedDisk
```

You should be able to SSH into the VM with the credentials from the source VM. 

## Next steps
After you have prepared and uploaded your custom virtual disk, you can read more about [using Resource Manager and templates](../../azure-resource-manager/management/overview.md). You may also want to [add a data disk](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to your new VMs. If you have applications running on your VMs that you need to access, be sure to [open ports and endpoints](nsg-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
