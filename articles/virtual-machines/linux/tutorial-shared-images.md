---
title: Tutorial - Create shared VM images with the Azure CLI | Microsoft Docs
description: In this tutorial, you learn how to use the Azure CLI to create a shared image of a VM in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 08/08/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Preview: Create a shared image gallery with the Azure CLI

The Shared Image Gallery greatly simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. The Shared Image Gallery lets to share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group share images. The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Disks.

In this tutorial, you create your own gallery and custom images of an Azure virtual machine. You learn how to:

> [!div class="checklist"]
> * Deprovision and generalize VMs
> * Create a managed image
> * Create an image gallery
> * Create a shared image
> * Create a VM from a shared image
> * Delete a resources


[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Overview

A managed image is a copy of either a full VM (including any attached data disks) or just the OS disk, depending on how you create the image. When you create a VM  from the image, the copy of the VHDs in the image are used to create the disks for the new VM. The managed image remains in storage and can be used over and over again to create new VMs.

If you have a large number of managed images that you need to maintain and would like to make them available throughout your company, you can use a shared image gallery as a repository that makes it easy to update and share your images. The charges for using a shared image gallery are just the costs for the storage used by the images.

Shared images encompasses multiple resources:

| Resource | Description|
|----------|------------|
| **Managed image** | This is a baseline image that can be used alone or used to create multiple **image versions** in an image gallery.|
| **Image gallery** | Like the public Azure Marketplace, an **image gallery** is a repository for managing and sharing images, but you control who has access within your company. |
| **Gallery image** | Images are defined within a gallery and carry information about the image and requirements for using it internally. This includes whether the image is Windows or Linux, release notes, and minumum and maximum memory requirements. This type of image is a resource within the resource manager deployment model, but it isn't used directly for creating VMs. It is a definition of a type of image. |
| **Image version** | An **image version** is what you use to create a VM when using a gallery. You can have multiple versions of an image as needed for your environment. Like a managed image, when you use an **image version** to create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times. |




### Regional Support

Regional support for shared image alleries is limited, but will expand over time. For preview: 

| Create Gallery In  | Replicate Version To |
|--------------------|----------------------|
| West Central US    |South Central US|
|                    |East US|
|                    |East US 2|
|                    |West US|
|                    |West US 2|
|                    |Central US|
|                    |North Central US|
|                    |Canada Central|
|                    |Canada East|
|                    |North Europe|
|                    |West Europe|
|                    |South India|
|                    |Southeast Asia|


## Before you begin

The steps below detail how to take an existing VM and turn it into a re-usable custom image that you can use to create new VM instances.

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-linux-cli-sample-create-vm-nginx.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

## Prepare the VM

To create an image of a virtual machine, you need to prepare the VM by deprovisioning, deallocating, and then marking the source VM as generalized. Once the VM has been prepared, you can create an image.

### Deprovision the VM 

Deprovisioning generalizes the VM by removing machine-specific information. This generalization makes it possible to deploy many VMs from a single image. During deprovisioning, the host name is reset to *localhost.localdomain*. SSH host keys, nameserver configurations, root password, and cached DHCP leases are also deleted.

To deprovision the VM, use the Azure VM agent (waagent). The Azure VM agent is installed on the VM and manages provisioning and interacting with the Azure Fabric Controller. For more information, see the [Azure Linux Agent user guide](../extensions/agent-linux.md).

Connect to your VM using SSH and run the command to deprovision the VM. With the `+user` argument, the last provisioned user account and any associated data are also deleted. Replace the example IP address with the public IP address of your VM.

SSH to the VM.
```bash
ssh azureuser@52.174.34.95
```
Deprovision the VM.

```bash
sudo waagent -deprovision+user -force
```
Close the SSH session.

```bash
exit
```

### Deallocate and mark the VM as generalized

To create an image, the VM needs to be deallocated. Deallocate the VM using [az vm deallocate](/cli/azure/vm#deallocate). 
   
```azurecli-interactive 
az vm deallocate --resource-group myResourceGroup --name myVM
```

Finally, set the state of the VM as generalized with [az vm generalize](/cli/azure/vm#generalize) so the Azure platform knows the VM has been generalized. You can only create an image from a generalized VM.
   
```azurecli-interactive 
az vm generalize --resource-group myResourceGroup --name myVM
```


## Create the managed image

Create a resource group for the gallery using [az group create](/cli/azure/group#create). In this example, we create a new resource group named *myResourceGroup* in the *West Central US* location.

```azurecli-interactive
az group create -n myGalleryRG -l westcentralus 
```

Now you can create a managed image of the VM by using [az image create](/cli/azure/image#create). The following example creates a managed image named *myImage* from a VM named *myVM*.
   
```azurecli-interactive 
az image create \
    --resource-group myGalleryRG \
    --name myImage \
    --source myVM
```

## Create an image gallery 

An image gallery is the primary resource used for enabling image sharing. Gallery names must be unique within your subscription. Create an image gallery using az image gallery create. The following example creates a gallery named *myGallery* in *myResourceGroup*.

```azurecli-interactive
az image gallery create -g myGalleryRG --gallery-name myGallery
```

## Create an image definition

Create an initial image in the gallery using az image gallery create-image.

```azurecli-interactive 
az image gallery create-image \
   -g myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-name myImage \
   --publisher myPublisher \
   --offer myOffer \
   --sku 16.04-LTS \
   --os-type Linux 
```

## Create an image version 
 
Create versions of the image as needed using az image gallery create-image-version.

```azurecli-interactive 
az image gallery create-image-version \
   -g myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-name myImage \
   --gallery-image-version 1.0.0 \
   --managed-image myImage
```


## Create a VM

Create a VM from the image in the image gallery using [az vm create](/cli/azure/vm#az-vm-create).

```azurecli-interactive 
az vm create\
   -g myGalleryRG \
   -n myVM \
   --image /subscriptions/<subscription-ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImage/versions/1.0.0 \
   --generate-ssh-keys
```


## List information

Get the location, status and other information about the available image galleries using [az image gallery list](/cli/azure/)

```azurecli-interactive 
az image gallery list -o table
```

List the image definitions in a gallery, including information about OS type and status, using [az gallery list images](/cli/azure/).

```azurecli-interactive 
az image gallery list-images -g myGalleryRG -r myGallery -o table
```


## Next steps

In this tutorial, you created a gallery of images that you can share. You learned how to:

> [!div class="checklist"]
> * Deprovision and generalize VMs
> * Create a custom image
> * Create a VM from a custom image
> * List all the images in your subscription
> * Delete an image

Advance to the next tutorial to learn about highly available virtual machines.

> [!div class="nextstepaction"]
> [Create highly available VMs](tutorial-availability-sets.md).

