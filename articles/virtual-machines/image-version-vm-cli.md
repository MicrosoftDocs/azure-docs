---
title: Create an image from a VM  
description: Learn how to create an image in a Shared Image Gallery from a VM in Azure.
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 05/01/2020
ms.author: cynthn
ms.reviewer: akjosh

---

# Create an image version from a VM in Azure using the Azure CLI

If you have an existing VM that you would like to use to make multiple, identical VMs, you can use that VM to create an image in a Shared Image Gallery using the Azure CLI. You can also create an image from a VM using [Azure PowerShell](image-version-vm-powershell.md).

An **image version** is what you use to create a VM when using a Shared Image Gallery. You can have multiple versions of an image as needed for your environment. When you use an image version to create a VM, the image version is used to create disks for the new VM. Image versions can be used multiple times.


## Before you begin

To complete this article, you must have an existing Shared Image Gallery. 

You must also have an existing VM in Azure, in the same region as your gallery. 

If the VM has a data disk attached, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource names where needed.

## Get information about the VM

You can see a list of VMs that are available using [az vm list](/cli/azure/vm#az-vm-list). 

```azurecli-interactive
az vm list --output table
```

Once you know the VM name and what resource group it is in, get the ID of the VM using [az vm get-instance-view](/cli/azure/vm#az-vm-get-instance-view). 

```azurecli-interactive
az vm get-instance-view -g MyResourceGroup -n MyVm --query id
```


## Create an image definition

Image definitions create a logical grouping for images. They are used to manage information about the image versions that are created within them. 

Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes, and periods. 

Make sure your image definition is the right type. If you have generalized the VM (using Sysprep for Windows, or waagent -deprovision for Linux) then you should create a generalized image definition using `--os-state generalized`. If you want to use the VM without removing existing user accounts, create a specialized image definition using `--os-state specialized`.

For more information about the values you can specify for an image definition, see [Image definitions](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries#image-definitions).

Create an image definition in the gallery using [az sig image-definition create](/cli/azure/sig/image-definition#az-sig-image-definition-create).

In this example, the image definition is named *myImageDefinition*, and is for a [specialized](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries#generalized-and-specialized-images) Linux OS image. To create a definition for images using a Windows OS, use `--os-type Windows`. 

```azurecli-interactive 
az sig image-definition create \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --publisher myPublisher \
   --offer myOffer \
   --sku mySKU \
   --os-type Linux \
   --os-state specialized
```


## Create the image version

Create an image version from the VM using [az image gallery create-image-version](/cli/azure/sig/image-version#az-sig-image-version-create).  

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the version of our image is *1.0.0* and we are going to create 2 replicas in the *West Central US* region, 1 replica in the *South Central US* region and 1 replica in the *East US 2* region using zone-redundant storage. The replication regions must include the region the source VM is located.

Replace the value of `--managed-image` in this example with the ID of your VM from the previous step.

```azurecli-interactive 
az sig image-version create \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --target-regions "westcentralus" "southcentralus=1" "eastus=1=standard_zrs" \
   --replica-count 2 \
   --managed-image "/subscriptions/<Subscription ID>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM"
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store your image in Premiun storage by a adding `--storage-account-type  premium_lrs`, or [Zone Redundant Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) by adding `--storage-account-type  standard_zrs` when you create the image version.
>

## Next steps

Create a VM from the [generalized image](vm-generalized-image-version-cli.md) using the Azure CLI.
