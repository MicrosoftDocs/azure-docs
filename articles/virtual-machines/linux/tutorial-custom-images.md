---
title: Tutorial - Create custom VM images with the Azure CLI 
description: In this tutorial, you learn how to use the Azure CLI to create a custom virtual machine image in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: gwallace

tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.topic: tutorial
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/13/2017
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about how to create custom VM images to minimize the number of post-deployment configuration tasks.
---

# Tutorial: Create a custom image of an Azure VM with the Azure CLI

Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. In this tutorial, you create your own custom image of an Azure virtual machine. You learn how to:

> [!div class="checklist"]
> * Create a Shared Image Gallery
> * Create an image definition
> * Create an image version
> * Create a VM from an image version
> * Learn about creating generalized images

This tutorial uses the CLI within the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview), which is constantly updated to the latest version. To open the Cloud Shell, select **Try it** from the top of any code block.

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.4.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Overview

A [Shared Image Gallery](shared-image-galleries.md) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. 

The Shared Image Gallery lets you share your custom VM images with others. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. 

The Shared Image Gallery feature has multiple resource types:

[!INCLUDE [virtual-machines-shared-image-gallery-resources](../../../includes/virtual-machines-shared-image-gallery-resources.md)]

## Before you begin

The steps below detail how to take an existing VM and turn it into a reusable custom image that you can use to create new VM instances.

To complete the example in this tutorial, you must have an existing virtual machine. If needed, you can see the [CLI quickstart](quick-create-cli.md) to create a VM to use for this tutorial. When working through the tutorial, replace the resource names where needed.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Create an image gallery 

An image gallery is the primary resource used for enabling image sharing. 

Allowed characters for Gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes.   Gallery names must be unique within your subscription. 

Create an image gallery using [az sig create](/cli/azure/sig#az-sig-create). The following example creates a resource group named gallery named *myGalleryRG* in *East US*, and a gallery named *myGallery*.

```azurecli-interactive
az group create --name myGalleryRG --location eastus
az sig create --resource-group myGalleryRG --gallery-name myGallery
```

## Get infornation about the VM

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

For more information about the values you can specify for an image definition, see [Image definitions](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries#image-definitions).

Create an image definition in the gallery using [az sig image-definition create](/cli/azure/sig/image-definition#az-sig-image-definition-create). 

In this example, the image definition is named *myImageDefinition*, and is for a [specialized](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries#generalized-and-specialized-images) Linux OS image. 

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


### Deprovision the VM 

Deprovisioning generalizes the VM by removing machine-specific information. This generalization makes it possible to deploy many VMs from a single image. During deprovisioning, the host name is reset to *localhost.localdomain*. SSH host keys, nameserver configurations, root password, and cached DHCP leases are also deleted.

> [!WARNING]
> Deprovisioning and marking the VM as generalized will make source VM unusable, and it cannot be restarted. 

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

To create an image, the VM needs to be deallocated. Deallocate the VM using [az vm deallocate](/cli//azure/vm). 
   
```azurecli-interactive 
az vm deallocate --resource-group myResourceGroup --name myVM
```

Finally, set the state of the VM as generalized with [az vm generalize](/cli//azure/vm) so the Azure platform knows the VM has been generalized. You can only create an image from a generalized VM.
   
```azurecli-interactive 
az vm generalize --resource-group myResourceGroup --name myVM
```

### Create the image

Now you can create an image of the VM by using [az image create](/cli//azure/image). The following example creates an image named *myImage* from a VM named *myVM*.
   
```azurecli-interactive 
az image create \
    --resource-group myResourceGroup \
    --name myImage \
    --source myVM
```
 
## Create VMs from the image

Now that you have an image, you can create one or more new VMs from the image using [az vm create](/cli/azure/vm). The following example creates a VM named *myVMfromImage* from the image named *myImage*.

```azurecli-interactive 
az vm create \
    --resource-group myResourceGroup \
    --name myVMfromImage \
    --image myImage \
    --admin-username azureuser \
    --generate-ssh-keys
```

We recommend that you limit the number of concurrent deployments to 20 VMs from a single image. If you are planning large-scale, concurrent deployments of over 20 VMs from the same custom image, you should use a [Shared Image Gallery](shared-image-galleries.md) with multiple image replicas. 

## Other options: Creating a generalized image

You can also create images from generalized VMs. The process is very similar to creating specialized images, but you have to use the VM agent to deprovision (*generalize*)the VM before creating the image.

Start an SSH connection to the VM. In this example, the admin username is `azureuser`. Replace `<publicIPAddress>` with the IP address of your source VM.

```bash
ssh azureuser@<publicIpAddress>
```

Now, deprovision your VM. This step removes machine-specific information from the VM. When the VM is deprovisioned, the host name is reset to *localhost.localdomain*. SSH host keys, nameserver configurations, root password, and cached DHCP leases are also deleted.

To deprovision the VM, use the Azure VM agent (*waagent*). The Azure VM agent is installed on every VM and is used to communicate with the Azure platform. The `-force` parameter tells the agent to accept prompts to reset the machine-specific information.

```bash
sudo waagent -deprovision+user -force
```

Close your SSH connection to the VM:

```bash
exit
```

Deallocated the VM with [az vm deallocate](/cli//azure/vm). Then, set the state of the VM as generalized with [az vm generalize](/cli//azure/vm) so that the Azure platform knows the VM is ready to be used to create a generalized image. 

```azurecli-interactive
az vm deallocate --resource-group myResourceGroup --name myVM
az vm generalize --resource-group myResourceGroup --name myVM
```

The rest of the process for creating an image in a Shared Image Gallery is the same, with these exceptions:

- When creating the image definition using [az sig image-definition create](/cli/azure/sig/image-definition#az-sig-image-definition-create), use `--os-state generalized` to show the that source was generalized.
- When creating the VM from the generalized image, don't use the `--specialized` parameter. For more information, see [Create a VM from a generalized image](../vm-generalized-image-version-cli.md).

## Share the gallery

You can share images across subscriptions using Role-Based Access Control (RBAC). You can share images at the gallery, image definition or image version leve. Any user that has read permissions to an image version, even across subscriptions, will be able to deploy a VM using the image version.

We recommend that you share with other users at the gallery level. To get the object ID of your gallery, use [az sig show](/cli/azure/sig#az-sig-show).

```azurecli-interactive
az sig show \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --query id
```

Use the object ID as a scope, along with an email address and [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to give a user access to the shared image gallery. Replace `<email-address>` and `<gallery iD>` with your own information.

```azurecli-interactive
az role assignment create \
   --role "Reader" \
   --assignee <email address> \
   --scope <gallery ID>
```

For more information about how to share resources using RBAC, see [Manage access using RBAC and Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli).

## Next steps

In this tutorial, you created a custom VM image. You learned how to:

> [!div class="checklist"]
> * Deprovision and generalize VMs
> * Create a custom image
> * Create a VM from a custom image
> * List all the images in your subscription
> * Delete an image

Advance to the next tutorial to learn about highly available virtual machines.

> [!div class="nextstepaction"]
> [Create highly available VMs](tutorial-availability-sets.md).

