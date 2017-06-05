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
ms.date: 05/11/2017
ms.author: iainfou

---
# Different ways to create a Linux VM
You have the flexibility in Azure to create a Linux virtual machine (VM) using tools and workflows comfortable to you. This article summarizes these differences and examples for creating your Linux VMs, including the Azure CLI 2.0. You can also view creation choices including the [Azure CLI 1.0](creation-choices-nodejs.md).

The [Azure CLI 2.0](/cli/azure/install-az-cli2) is available across platforms via an npm package, distro-provided packages, or Docker container. Install the most appropriate build for your environment and log in to an Azure account using [az login](/cli/azure/#login)

* [Create a Linux VM with the Azure CLI 2.0](quick-create-cli.md)
  
  * Create a resource group with [az group create](/cli/azure/group#create) named *myResourceGroup*: 
   
    ```azurecli
    az group create --name myResourceGroup --location eastus
    ```
    
  * Create a VM with [az vm create](/cli/azure/vm#create) named *myVM* using the latest *UbuntuLTS* image and generate SSH keys if they do not already exist in *~/.ssh*:

    ```azurecli
    az vm create \
        --resource-group myResourceGroup \
        --name myVM \
        --image UbuntuLTS \
        --generate-ssh-keys
    ```

* [Create a Linux VM with an Azure template](create-ssh-secured-vm-from-template.md)
  
  * The following example uses [az group deployment create](/cli/azure/group/deployment#create) to create a VM from a template stored on GitHub:
    
    ```azurecli
    az group deployment create --resource-group myResourceGroup \ 
      --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json \
      --parameters @myparameters.json
    ```
* [Create a Linux VM and customize with cloud-init](tutorial-automate-vm-deployment.md)

* [Create a load balanced and highly available application on multiple Linux VMs](tutorial-load-balancer.md)


## Azure portal
The [Azure portal](https://portal.azure.com) allows you to quickly create a VM since there is nothing to install on your system. Use the Azure portal to create the VM:

* [Create a Linux VM using the Azure portal](quick-create-portal.md) 


## Operating system and image choices
When creating a VM, you choose an image based on the operating system you want to run. Azure and its partners offer many images, some of which include applications and tools pre-installed. Or, upload one of your own images (see [the following section](#use-your-own-image)).

### Azure images
Use the [az vm image](/cli/azure/vm/image) commands to see what's available by publisher, distro release, and builds.

List available publishers:

```azurecli
az vm image list-publishers --location eastus
```

List available products (offers) for a given publisher:

```azurecli
az vm image list-offers --publisher Canonical --location eastus
```

List available SKUs (distro releases) of a given offer:

```azurecli
az vm image list-skus --publisher Canonical --offer UbuntuServer --location eastus
```

List all available images for a given release:

```azurecli
az vm image list --publisher Canonical --offer UbuntuServer --sku 16.04.0-LTS --location eastus
```

For more examples on browsing and using available images, see [Navigate and select Azure virtual machine images with the Azure CLI](cli-ps-findimage.md).

The [az vm create](/cli/azure/vm#create) command has aliases you can use to quickly access the more common distros and their latest releases. Using aliases is often quicker than specifying the publisher, offer, SKU, and version each time you create a VM:

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
If you require specific customizations, you can use an image based on an existing Azure VM by capturing that VM. You can also upload an image created on-premises. For more information on supported distros and how to use your own images, see the following articles:

* [Azure endorsed distributions](endorsed-distros.md)
* [Information for non-endorsed distributions](create-upload-generic.md)
* [How to create an image from an existing Azure VM](tutorial-custom-images.md).
  
  * Quick-start example commands to create an image from an existing Azure VM:
    
    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    az vm generalize --resource-group myResourceGroup --name myVM
    az vm image create --resource-group myResourceGroup --source myVM --name myImage
    ```

## Next steps
* Create a Linux VM with the [CLI](quick-create-cli.md), from the [portal](quick-create-portal.md), or using an [Azure Resource Manager template](../windows/cli-deploy-templates.md).
* After creating a Linux VM, [learn about Azure disks and storage](tutorial-manage-disks.md).
* Quick steps to [reset a password or SSH keys and manage users](using-vmaccess-extension.md).
