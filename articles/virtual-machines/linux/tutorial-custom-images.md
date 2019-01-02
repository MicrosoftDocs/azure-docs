---
title: Tutorial - Create custom VM images with the Azure CLI | Microsoft Docs
description: In this tutorial, you learn how to use the Azure CLI to create a custom virtual machine image in Azure
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
ms.date: 12/13/2017
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about how to create custom VM images to minimize the number of post-deployment configuration tasks.
---

# Tutorial: Create a custom image of an Azure VM with the Azure CLI

Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. In this tutorial, you create your own custom image of an Azure virtual machine. You learn how to:

> [!div class="checklist"]
> * Deprovision and generalize VMs
> * Create a custom image
> * Create a VM from a custom image
> * List all the images in your subscription
> * Delete an image

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Before you begin

The steps below detail how to take an existing VM and turn it into a reusable custom image that you can use to create new VM instances.

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-linux-cli-sample-create-vm-nginx.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

## Create a custom image

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

To create an image, the VM needs to be deallocated. Deallocate the VM using [az vm deallocate](/cli//azure/vm#deallocate). 
   
```azurecli-interactive 
az vm deallocate --resource-group myResourceGroup --name myVM
```

Finally, set the state of the VM as generalized with [az vm generalize](/cli//azure/vm#generalize) so the Azure platform knows the VM has been generalized. You can only create an image from a generalized VM.
   
```azurecli-interactive 
az vm generalize --resource-group myResourceGroup --name myVM
```

### Create the image

Now you can create an image of the VM by using [az image create](/cli//azure/image#create). The following example creates an image named *myImage* from a VM named *myVM*.
   
```azurecli-interactive 
az image create \
    --resource-group myResourceGroup \
    --name myImage \
    --source myVM
```
 
## Create VMs from the image

Now that you have an image, you can create one or more new VMs from the image using [az vm create](/cli/azure/vm#az_vm_create). The following example creates a VM named *myVMfromImage* from the image named *myImage*.

```azurecli-interactive 
az vm create \
    --resource-group myResourceGroup \
    --name myVMfromImage \
    --image myImage \
    --admin-username azureuser \
    --generate-ssh-keys
```

## Image management 

Here are some examples of common image management tasks and how to complete them using the Azure CLI.

List all images by name in a table format.

```azurecli-interactive 
az image list \
    --resource-group myResourceGroup
```

Delete an image. This example deletes the image named *myOldImage* from the *myResourceGroup*.

```azurecli-interactive 
az image delete \
    --name myOldImage \
	--resource-group myResourceGroup
```

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

