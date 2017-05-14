---
title: Upload a custom Linux image with Azure CLI 1.0 | Microsoft Docs
description: Create and upload a virtual hard disk (VHD) to Azure with a custom Linux image using the Resource Manager deployment model and the Azure CLI 1.0.
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: a8c7818f-eb65-409e-aa91-ce5ae975c564
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 10/10/2016
ms.author: iainfou

---
# Upload and create a Linux VM from custom disk image by using the Azure CLI 1.0
This article shows you how to upload a virtual hard disk (VHD) to Azure using the Resource Manager deployment model and create Linux VMs from this custom image. This functionality allows you to install and configure a Linux distro to your requirements and then use that VHD to quickly create Azure virtual machines (VMs).


## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#quick-commands) – our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) - our next generation CLI for the resource management deployment model


## Quick commands
If you need to quickly accomplish the task, the following section details the base commands to upload a VM to Azure. More detailed information and context for each step can be found the rest of the document, [starting here](#requirements).

Make sure that you have [the Azure CLI 1.0](../../cli-install-nodejs.md) logged in and using Resource Manager mode:

```azurecli
azure config mode arm
```

In the following examples, replace example parameter names with your own values. Example parameter names included `myResourceGroup`, `mystorageaccount`, and `myimages`.

First, create a resource group. The following example creates a resource group named `myResourceGroup` in the `WestUs` location:

```azurecli
azure group create myResourceGroup --location "WestUS"
```

Create a storage account to hold your virtual disks. The following example creates a storage account named `mystorageaccount`:

```azurecli
azure storage account create mystorageaccount --resource-group myResourceGroup \
    --location "WestUS" --kind Storage --sku-name PLRS
```

List the access keys for your storage account. Make a note of `key1`:

```azurecli
azure storage account keys list mystorageaccount --resource-group myResourceGroup
```

Create a container within your storage account using the storage key you obtained. The following example creates a container named `myimages` using the storage key value from `key1`:

```azurecli
azure storage container create --account-name mystorageaccount \
    --account-key key1 --container myimages
```

Finally, upload your VHD to the container you created. Specify the local path to your VHD under `/path/to/disk/mydisk.vhd`:

```azurecli
azure storage blob upload --blobtype page --account-name mystorageaccount \
    --account-key key1 --container myimages /path/to/disk/mydisk.vhd
```

You can now create a VM from your uploaded virtual disk [using a Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-from-specialized-vhd). You can also use the CLI by specifying the URI to your disk (`--image-urn`). The following example creates a VM named `myVM` using the virtual disk previously uploaded:

```azurecli
azure vm create myVM -l "WestUS" --resource-group myResourceGroup \
    --image-urn https://mystorageaccount.blob.core.windows.net/myimages/mydisk.vhd
```

The destination storage account has to be the same as where you uploaded your virtual disk to. You also need to specify, or answer prompts for, all the additional parameters required by the `azure vm create` command such as virtual network, public IP address, username, and SSH keys. You can read more about the [available CLI Resource Manager parameters](../azure-cli-arm-commands.md#azure-vm-commands-to-manage-your-azure-virtual-machines).

## Requirements
To complete the following steps, you need:

* **Linux operating system installed in a .vhd file** - Install an [Azure-endorsed Linux distribution](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) (or see [information for non-endorsed distributions](create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)) to a virtual disk in the VHD format. Multiple tools exist to create a VM and VHD:
  * Install and configure [QEMU](https://en.wikibooks.org/wiki/QEMU/Installing_QEMU) or [KVM](http://www.linux-kvm.org/page/RunningKVM), taking care to use VHD as your image format. If needed, you can [convert an image](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) using `qemu-img convert`.
  * You can also use Hyper-V [on Windows 10](https://msdn.microsoft.com/virtualization/hyperv_on_windows/quick_start/walkthrough_install) or [on Windows Server 2012/2012 R2](https://technet.microsoft.com/library/hh846766.aspx).

> [!NOTE]
> The newer VHDX format is not supported in Azure. When you create a VM, specify VHD as the format. If needed, you can convert VHDX disks to VHD using [`qemu-img convert`](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) or the [`Convert-VHD`](https://technet.microsoft.com/library/hh848454.aspx) PowerShell cmdlet. Further, Azure does not support uploading dynamic VHDs, so you need to convert such disks to static VHDs before uploading. You can use tools such as [Azure VHD Utilities for GO](https://github.com/Microsoft/azure-vhd-utils-for-go) to convert dynamic disks during the process of uploading to Azure.
> 
> 

* VMs created from your custom image must reside in the same storage account as the image itself
  * Create a storage account and container to hold both your custom image and created VMs
  * After you have created all your VMs, you can safely delete your image

Make sure that you have [the Azure CLI 1.0](../../cli-install-nodejs.md) logged in and using Resource Manager mode:

```azurecli
azure config mode arm
```

In the following examples, replace example parameter names with your own values. Example parameter names included `myResourceGroup`, `mystorageaccount`, and `myimages`.

<a id="prepimage"> </a>

## Prepare the image to be uploaded
Azure supports various Linux distributions (see [Endorsed Distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)). The following articles guide you through how to prepare the various Linux distributions that are supported on Azure:

* **[CentOS-based Distributions](create-upload-centos.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Debian Linux](debian-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Oracle Linux](oracle-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Red Hat Enterprise Linux](redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[SLES & openSUSE](suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Ubuntu](create-upload-ubuntu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**
* **[Other - Non-Endorsed Distributions](create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)**

Also see the **[Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes)** for more general tips on preparing Linux images for Azure.

> [!NOTE]
> The [Azure platform SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) applies to VMs running Linux only when one of the endorsed distributions is used with the configuration details as specified under 'Supported Versions' in [Linux on Azure-Endorsed Distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).


## Create a resource group
Resource groups logically bring together all the Azure resources to support your virtual machines, such as the virtual networking and storage. Read more about [Azure resource groups here](../../azure-resource-manager/resource-group-overview.md). Before uploading your custom disk image and creating VMs, you first need to create a resource group. 

The following example creates a resource group named `myResourceGroup` in the `WestUS` location:

```azurecli
azure group create myResourceGroup --location "WestUS"
```

## Create a storage account
VMs are stored as page blobs within a storage account. Read more about [Azure blob storage here](../../storage/storage-introduction.md#blob-storage). You create a storage account for your custom disk image and VMs. Any VMs that you create from your custom disk image need to be in the same storage account as that image.

The following example creates a storage account named `mystorageaccount` in the resource group previously created:

```azurecli
azure storage account create mystorageaccount --resource-group myResourceGroup \
    --location "WestUS" --kind Storage --sku-name PLRS
```

## List storage account keys
Azure generates two 512-bit access keys for each storage account. These access keys are used when authenticating to the storage account, such as to carry out write operations. Read more about [managing access to storage here](../../storage/storage-create-storage-account.md#manage-your-storage-account). You can view access keys with the `azure storage account keys list` command.

View the access keys for the storage account you created:

```azurecli
azure storage account keys list mystorageaccount --resource-group myResourceGroup
```

The output is similar to:

```azurecli
info:    Executing command storage account keys list
+ Getting storage account keys
data:    Name  Key                                                                                       Permissions
data:    ----  ----------------------------------------------------------------------------------------  -----------
data:    key1  d4XAvZzlGAgWdvhlWfkZ9q4k9bYZkXkuPCJ15NTsQOeDeowCDAdB80r9zA/tUINApdSGQ94H9zkszYyxpe8erw==  Full
data:    key2  Ww0T7g4UyYLaBnLYcxIOTVziGAAHvU+wpwuPvK4ZG0CDFwu/mAxS/YYvAQGHocq1w7/3HcalbnfxtFdqoXOw8g==  Full
info:    storage account keys list command OK

```
Make a note of `key1` as you will use it to interact with your storage account in the next steps.

## Create a storage container
In the same way that you create different directories to logically organize your local file system, you create containers within a storage account to organize your virtual disks and images. A storage account can contain any number of containers. 

The following example creates a container named `myimages`, specifying the access key obtained in the previous step (`key1`):

```azurecli
azure storage container create --account-name mystorageaccount \
    --account-key key1 --container myimages
```

## Upload VHD
Now you can actually upload your custom disk image. As with all virtual disks used by VMs, you upload and store your custom disk image as a page blob.

Specify your access key, the container you created in the previous step, and then the path to the custom disk image on your local computer:

```azurecli
azure storage blob upload --blobtype page --account-name mystorageaccount \
    --account-key key1 --container myimages /path/to/disk/mydisk.vhd
```

## Create VM from custom image
When you create VMs from your custom disk image, specify the URI to the disk image. Ensure that the destination storage account matches where your custom disk image is stored. You can create your VM using the Azure CLI or Resource Manager JSON template.

### Create a VM using the Azure CLI
You specify the `--image-urn` parameter with the `azure vm create` command to point to your custom disk image. Ensure that `--storage-account-name` matches the storage account where your custom disk image is stored. You do not have to use the same container as the custom disk image to store your VMs. Make sure to create any additional containers in the same way as the earlier steps before uploading your custom disk images.

The following example creates a VM named `myVM` from your custom disk image:

```azurecli
azure vm create myVM -l "WestUS" --resource-group myResourceGroup \
    --image-urn https://mystorageaccount.blob.core.windows.net/myimages/mydisk.vhd
    --storage-account-name mystorageaccount
```

You still need to specify, or answer prompts for, all the additional parameters required by the `azure vm create` command such as virtual network, public IP address, username, and SSH keys. Read more about the [available CLI Resource Manager parameters](../azure-cli-arm-commands.md#azure-vm-commands-to-manage-your-azure-virtual-machines).

### Create a VM using a JSON template
Azure Resource Manager templates are JavaScript Object Notation (JSON) files that define the environment you wish to build. The templates are broken down in to different resource providers such as compute or network. You can use existing templates or write your own. Read more about [using Resource Manager and templates](../../azure-resource-manager/resource-group-overview.md).

Within the `Microsoft.Compute/virtualMachines` provider of your template, you have a `storageProfile` node that contains the configuration details for your VM. The two main parameters to edit are the `image` and `vhd` URIs that point to your custom disk image and your new VM's virtual disk. The following shows an example of the JSON for using a custom disk image:

```json
"storageProfile": {
          "osDisk": {
            "name": "myVM",
            "osType": "Linux",
            "caching": "ReadWrite",
            "createOption": "FromImage",
            "image": {
              "uri": "https://mystorageaccount.blob.core.windows.net/myimages/mydisk.vhd"
            },
            "vhd": {
              "uri": "https://mystorageaccount.blob.core.windows.net/vhds/newvmname.vhd"
            }
          }
```

You can use [this existing template to create a VM from a custom image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image) or read about [creating your own Azure Resource Manager templates](../../azure-resource-manager/resource-group-authoring-templates.md). 

Once you have a template configured, you create your VMs using the `azure group deployment create` command. Specify the URI of your JSON template with the `--template-uri` parameter:

```azurecli
azure group deployment create --resource-group myResourceGroup
    --template-uri https://uri.to.template/mytemplate.json
```

If you have a JSON file stored locally on your computer, you can use the `--template-file` parameter instead:

```azurecli
azure group deployment create --resource-group myResourceGroup
    --template-file /path/to/mytemplate.json
```


## Next steps
After you have prepared and uploaded your custom virtual disk, you can read more about [using Resource Manager and templates](../../azure-resource-manager/resource-group-overview.md). You may also want to [add a data disk](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to your new VMs. If you have applications running on your VMs that you need to access, be sure to [open ports and endpoints](nsg-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

