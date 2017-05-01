---
title: Different ways to create a Linux VM in Azure | Microsoft Azure
description: Learn the different ways to create a Linux virtual machine on Azure, including links to tools and tutorials for each method.
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f38f8a44-6c88-4490-a84a-46388212d24c
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: get-started-article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 01/03/2017
ms.author: iainfou

---
# Different ways to create a Linux VM
You have the flexibility in Azure to create a Linux virtual machine (VM) using tools and workflows comfortable to you. This article summarizes these differences and examples for creating your Linux VMs, including the Azure CLI 2.0. You can also view creation choices including the [Azure CLI 1.0](creation-choices-nodejs.md).

The [Azure CLI 2.0](/cli/azure/install-az-cli2) is available across platforms via an npm package, distro-provided packages, or Docker container. Install the most appropriate build for your environment and log in to an Azure account using [az login](/cli/azure/#login)

The following examples use the Azure CLI 2.0. Read each article for more details on the commands shown. You can also find examples on Linux creation choices using the [Azure CLI 1.0](creation-choices-nodejs.md).

* [Create a Linux VM using the Azure CLI 2.0](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
  
  * This example uses [az group create](/cli/azure/group#create) to create a resource group named `myResourceGroup`: 
-    
    ```azurecli
    az group create --name myResourceGroup --location westus
    ```
    
  * This example uses [az vm create](/cli/azure/vm#create) to create a VM named `myVM` using the latest Debian image with Azure Managed Disks and a public key named `id_rsa.pub`:

    ```azurecli
    az vm create \
    --image credativ:Debian:8:latest \
     --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub \
az vm disk attach –g myResourceGroup –-vm-name myVM –-disk myDataDisk  –-new --size-gb 5    --public-ip-address-dns-name myPublicDNS \
    --resource-group myResourceGroup \
    --location westus \
    --name myVM
    ```

    * If you wish to use unmanaged disks, add the `--use-unmanaged-disks` flag to the above command. A storage account is created for you. For more information, see [Azure Managed Disks overview](../../storage/storage-managed-disks-overview.md).

* [Create a secured Linux VM using an Azure template](create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
  
  * The following example uses [az group deployment create](/cli/azure/group/deployment#create) to create a VM using a template stored on GitHub:
    
    ```azurecli
    az group deployment create --resource-group myResourceGroup \ 
      --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json \
      --parameters @myparameters.json
    ```
    
* [Create a complete Linux environment using the Azure CLI](create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
  
  * Includes creating a load balancer and multiple VMs in an availability set.

* [Add a disk to a Linux VM](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
  
  * The following example uses [az vm disk attach-new](/cli/azure/vm/disk#attach-new) to add a 50 Gb managed disk to an existing VM named `myVM`:
  
    ```azurecli
    az vm disk attach –g myResourceGroup –-vm-name myVM –-disk myDataDisk  \
    –-new --size-gb 50
    ```

## Azure portal
The [Azure portal](https://portal.azure.com) allows you to quickly create a VM since there is nothing to install on your system. Use the Azure portal to create the VM:

* [Create a Linux VM using the Azure portal](quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) 
* [Attach a disk using the Azure portal](../windows/attach-disk-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Operating system and image choices
When creating a VM, you choose an image based on the operating system you want to run. Azure and its partners offer many images, some of which include applications and tools pre-installed. Or, upload one of your own images (see [the following section](#use-your-own-image)).

### Azure images
Use the [az vm image](/cli/azure/vm/image) commands to see what's available by publisher, distro release, and builds.

List available publishers:

```azurecli
az vm image list-publishers --location WestUS
```

List available products (offers) for a given publisher:

```azurecli
az vm image list-offers --publisher Canonical --location WestUS
```

List available SKUs (distro releases) of a given offer:

```azurecli
az vm image list-skus --publisher Canonical --offer UbuntuServer --location WestUS
```

List all available images for a given release:

```azurecli
az vm image list --publisher Canonical --offer UbuntuServer --sku 16.04.0-LTS --location WestUS
```

For more examples on browsing and using available images, see [Navigate and select Azure virtual machine images with the Azure CLI](../windows/cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

The **az vm create** command has aliases you can use to quickly access the more common distros and their latest releases. Using aliases is often quicker than specifying the publisher, offer, SKU, and version each time you create a VM:

| Alias | Publisher | Offer | SKU | Version |
|:--- |:--- |:--- |:--- |:--- |
| CentOS |OpenLogic |Centos |7.2 |latest |
| CoreOS |CoreOS |CoreOS |Stable |latest |
| Debian |credativ |Debian |8 |latest |
| openSUSE |SUSE |openSUSE |13.2 |latest |
| RHEL |Redhat |RHEL |7.2 |latest |
| SLES |SLES |SLES |12-SP1 |latest |
| UbuntuLTS |Canonical |UbuntuServer |14.04.4-LTS |latest |

### Use your own image
If you require specific customizations, you can use an image based on an existing Azure VM by *capturing* that VM. You can also upload an image created on-premises. For more information on supported distros and how to use your own images, see the following articles:

* [Azure endorsed distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Information for non-endorsed distributions](create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [How to capture a Linux virtual machine as a Resource Manager template](capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
  
  * Quick-start **az vm** example commands to capture an existing VM using unmanaged disks:
    
    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    az vm generalize --resource-group myResourceGroup --name myVM
    az vm capture --resource-group myResourceGroup --name myVM --vhd-name-prefix myCapturedVM
    ```

## Next steps
* Create a Linux VM from the [portal](quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), with the [CLI](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), or using an [Azure Resource Manager template](../windows/cli-deploy-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* After creating a Linux VM, [add a data disk](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* Quick steps to [reset a password or SSH keys and manage users](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
