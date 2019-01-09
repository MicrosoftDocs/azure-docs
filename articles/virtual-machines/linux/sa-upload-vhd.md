---
title: Upload a custom Linux disk with Azure CLI | Microsoft Docs
description: Create and upload a virtual hard disk (VHD) to Azure using the Resource Manager deployment model and the Azure CLI
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: a8c7818f-eb65-409e-aa91-ce5ae975c564
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 07/10/2017
ms.author: cynthn

---

# Upload and create a Linux VM from custom disk with the Azure CLI

This article shows you how to upload a virtual hard disk (VHD) to an Azure storage account with the Azure CLI and create Linux VMs from this custom disk. This functionality allows you to install and configure a Linux distro to your requirements and then use that VHD to quickly create Azure virtual machines (VMs).

This topic uses storage accounts for the final VHDs, but you can also do these steps using [managed disks](upload-vhd.md). 

## Quick commands
If you need to quickly accomplish the task, the following section details the base commands to upload a VHD to Azure. More detailed information and context for each step can be found the rest of the document, [starting here](#requirements).

Make sure that you have the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index#az_login).

In the following examples, replace example parameter names with your own values. Example parameter names included `myResourceGroup`, `mystorageaccount`, and `mydisks`.

First, create a resource group with [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named `myResourceGroup` in the `WestUs` location:

```azurecli
az group create --name myResourceGroup --location westus
```

Create a storage account to hold your virtual disks with [az storage account create](/cli/azure/storage/account#az_storage_account_create). The following example creates a storage account named `mystorageaccount`:

```azurecli
az storage account create --resource-group myResourceGroup --location westus \
  --name mystorageaccount --kind Storage --sku Standard_LRS
```

List the access keys for your storage account with [az storage account keys list](/cli/azure/storage/account/keys#az_storage_account_keys_list). Make a note of `key1`:

```azurecli
az storage account keys list --resource-group myResourceGroup --account-name mystorageaccount
```

Create a container within your storage account using the storage key you obtained with [az storage container create](/cli/azure/storage/container#az_storage_container_create). The following example creates a container named `mydisks` using the storage key value from `key1`:

```azurecli
az storage container create --account-name mystorageaccount \
    --account-key key1 --name mydisks
```

Finally, upload your VHD to the container you created with [az storage blob upload](/cli/azure/storage/blob#az_storage_blob_upload). Specify the local path to your VHD under `/path/to/disk/mydisk.vhd`:

```azurecli
az storage blob upload --account-name mystorageaccount \
    --account-key key1 --container-name mydisks --type page \
    --file /path/to/disk/mydisk.vhd --name myDisk.vhd
```

Specify the URI to your disk (`--image`) with [az vm create](/cli/azure/vm#az_vm_create). The following example creates a VM named `myVM` using the virtual disk previously uploaded:

```azurecli
az vm create --resource-group myResourceGroup --location westus \
    --name myVM --storage-account mystorageaccount --os-type linux \
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub \
    --image https://mystorageaccount.blob.core.windows.net/mydisk/myDisks.vhd \
    --use-unmanaged-disk
```

The destination storage account has to be the same as where you uploaded your virtual disk to. You also need to specify, or answer prompts for, all the additional parameters required by the **az vm create** command such as virtual network, public IP address, username, and SSH keys. You can read more about the [available CLI Resource Manager parameters](../azure-cli-arm-commands.md#azure-vm-commands-to-manage-your-azure-virtual-machines).

## Requirements
To complete the following steps, you need:

* **Linux operating system installed in a .vhd file** - Install an [Azure-endorsed Linux distribution](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) (or see [information for non-endorsed distributions](create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)) to a virtual disk in the VHD format. Multiple tools exist to create a VM and VHD:
  * Install and configure [QEMU](https://en.wikibooks.org/wiki/QEMU/Installing_QEMU) or [KVM](http://www.linux-kvm.org/page/RunningKVM), taking care to use VHD as your image format. If needed, you can [convert an image](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) using `qemu-img convert`.
  * You can also use Hyper-V [on Windows 10](https://msdn.microsoft.com/virtualization/hyperv_on_windows/quick_start/walkthrough_install) or [on Windows Server 2012/2012 R2](https://technet.microsoft.com/library/hh846766.aspx).

> [!NOTE]
> The newer VHDX format is not supported in Azure. When you create a VM, specify VHD as the format. If needed, you can convert VHDX disks to VHD using [`qemu-img convert`](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) or the [`Convert-VHD`](https://technet.microsoft.com/library/hh848454.aspx) PowerShell cmdlet. Further, Azure does not support uploading dynamic VHDs, so you need to convert such disks to static VHDs before uploading. You can use tools such as [Azure VHD Utilities for GO](https://github.com/Microsoft/azure-vhd-utils-for-go) to convert dynamic disks during the process of uploading to Azure.
> 
> 

* VMs created from your custom disk must reside in the same storage account as the disk itself
  * Create a storage account and container to hold both your custom disk and created VMs
  * After you have created all your VMs, you can safely delete your disk

Make sure that you have the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index#az_login).

In the following examples, replace example parameter names with your own values. Example parameter names included `myResourceGroup`, `mystorageaccount`, and `mydisks`.

<a id="prepimage"> </a>

## Prepare the disk to be uploaded
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
> 
> 

## Create a resource group
Resource groups logically bring together all the Azure resources to support your virtual machines, such as the virtual networking and storage. For more information resource groups, see [resource groups overview](../../azure-resource-manager/resource-group-overview.md). Before uploading your custom disk and creating VMs, you first need to create a resource group with [az group create](/cli/azure/group#az_group_create).

The following example creates a resource group named `myResourceGroup` in the `westus` location:

```azurecli
az group create --name myResourceGroup --location westus
```

## Create a storage account

Create a storage account for your custom disk and VMs with [az storage account create](/cli/azure/storage/account#az_storage_account_create). Any VMs with unmanaged disks that you create from your custom disk need to be in the same storage account as that disk. 

The following example creates a storage account named `mystorageaccount` in the resource group previously created:

```azurecli
az storage account create --resource-group myResourceGroup --location westus \
  --name mystorageaccount --kind Storage --sku Standard_LRS
```

## List storage account keys
Azure generates two 512-bit access keys for each storage account. These access keys are used when authenticating to the storage account, such as to carry out write operations. Read more about [managing access to storage here](../../storage/common/storage-account-manage.md#access-keys). You view the access keys with [az storage account keys list](/cli/azure/storage/account/keys#az_storage_account_keys_list).

View the access keys for the storage account you created:

```azurecli
az storage account keys list --resource-group myResourceGroup --account-name mystorageaccount
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
In the same way that you create different directories to logically organize your local file system, you create containers within a storage account to organize your disks. A storage account can contain any number of containers. Create a container with [az storage container create](/cli/azure/storage/container#az_storage_container_create).

The following example creates a container named `mydisks`:

```azurecli
az storage container create \
    --account-name mystorageaccount \
    --name mydisks
```

## Upload VHD
Now upload your custom disk with [az storage blob upload](/cli/azure/storage/blob#az_storage_blob_upload). You upload and store your custom disk as a page blob.

Specify your access key, the container you created in the previous step, and then the path to the custom disk on your local computer:

```azurecli
az storage blob upload --account-name mystorageaccount \
    --account-key key1 --container-name mydisks --type page \
    --file /path/to/disk/mydisk.vhd --name myDisk.vhd
```

## Create the VM
To create a VM with unmanaged disks, specify the URI to your disk (`--image`) with [az vm create](/cli/azure/vm#az_vm_create). The following example creates a VM named `myVM` using the virtual disk previously uploaded:

You specify the `--image` parameter with [az vm create](/cli/azure/vm#az_vm_create) to point to your custom disk. Ensure that `--storage-account` matches the storage account where your custom disk is stored. You do not have to use the same container as the custom disk to store your VMs. Make sure to create any additional containers in the same way as the earlier steps before uploading your custom disk.

The following example creates a VM named `myVM` from your custom disk:

```azurecli
az vm create --resource-group myResourceGroup --location westus \
    --name myVM --storage-account mystorageaccount --os-type linux \
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub \
    --image https://mystorageaccount.blob.core.windows.net/mydisks/myDisk.vhd \
    --use-unmanaged-disk
```

You still need to specify, or answer prompts for, all the additional parameters required by the **az vm create** command such as username and SSH keys.


## Resource Manager template
Azure Resource Manager templates are JavaScript Object Notation (JSON) files that define the environment you wish to build. The templates are broken down in to different resource providers such as compute or network. You can use existing templates or write your own. Read more about [using Resource Manager and templates](../../azure-resource-manager/resource-group-overview.md).

Within the `Microsoft.Compute/virtualMachines` provider of your template, you have a `storageProfile` node that contains the configuration details for your VM. The two main parameters to edit are the `image` and `vhd` URIs that point to your custom disk and your new VM's virtual disk. The following shows an example of the JSON for using a custom disk:

```json
"storageProfile": {
          "osDisk": {
            "name": "myVM",
            "osType": "Linux",
            "caching": "ReadWrite",
            "createOption": "FromImage",
            "image": {
              "uri": "https://mystorageaccount.blob.core.windows.net/mydisks/myDisk.vhd"
            },
            "vhd": {
              "uri": "https://mystorageaccount.blob.core.windows.net/vhds/newvmname.vhd"
            }
          }
```

You can use [this existing template to create a VM from a custom image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image) or read about [creating your own Azure Resource Manager templates](../../azure-resource-manager/resource-group-authoring-templates.md). 

Once you have a template configured, use [az group deployment create](/cli/azure/group/deployment#az_group_deployment_create) to create your VMs. Specify the URI of your JSON template with the `--template-uri` parameter:

```azurecli
az group deployment create --resource-group myNewResourceGroup \
  --template-uri https://uri.to.template/mytemplate.json
```

If you have a JSON file stored locally on your computer, you can use the `--template-file` parameter instead:

```azurecli
az group deployment create --resource-group myNewResourceGroup \
  --template-file /path/to/mytemplate.json
```


## Next steps
After you have prepared and uploaded your custom virtual disk, you can read more about [using Resource Manager and templates](../../azure-resource-manager/resource-group-overview.md). You may also want to [add a data disk](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to your new VMs. If you have applications running on your VMs that you need to access, be sure to [open ports and endpoints](nsg-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

