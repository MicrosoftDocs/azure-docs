---
title: Create custom VM iamges with the Azure CLI | Microsoft Docs
description: Tutorial - Create a custom VM image using the Azure CLI.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/13/2017
ms.author: cynthn
---

# Create a custom image of an Azure VM using the CLI

To complete this tutorial, you need to have already created a VM using the [How to automate the deployment of Linux virtual machines in Azure](tutorial-automate-vm-deployment.md) tutorial. In the previous tutorial, we showed you how to use a preconfigured Azure Marketplace image to simplify creating a VM. Custom images are similar to marketplace images, but you create them yourself based on your own Azure VMs. A custom image of a VM is a copy of your VM, including all of the attached data disks. 

In this tutorial, we will create a custom image of the VM from the previous tutorial and then use the custom image to create a new VM. 

To complete this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Step 1 - Create the image

In the following steps we will deprovision, deallocate and generalize the existing VM, then create the custom image. 

### Deprovision the VM 

To make the VM ready for generalizing, you deprovision the VM using the Azure VM agent to delete files and data. Use the **waagent** command with the **deprovision** parameter on your source Linux VM. For more information, see the [Azure Linux Agent user guide](../windows/agent-user-guide.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Connect to your Linux VM using SSH. Replace the example IP address with the public IP address noted in the previous step.

```bash
ssh 52.174.34.95
```

Run the following command to deprovision the VM
   
```bash
sudo waagent -deprovision+user -force
```

Close the SSH session.

```bash
exit
```

### Generalize the VM

Use the Azure CLI 2.0 to generalize and capture the VM. This example deallocates, generalizes the `myVM` virtual machine in the in the `myResourceGroup` resource group. It also creates an image named `myImage` in the same resource group.

Deallocate the VM that you deprovisioned with [az vm deallocate](/cli//azure/vm#deallocate). 
   
```azurecli
az vm deallocate --resource-group myResourceGroup --name myAutomatedVM
```

Generalize the VM with [az vm generalize](/cli//azure/vm#generalize). 
   
```azurecli
az vm generalize --resource-group myResourceGroup --name myAutomatedVM
```

### Capture the image

Now create an image of the VM by using [az image create](/cli//azure/image#create). The following example creates an image named `myImage` in the resource group named `myResourceGroup` using the VM named `myAutomatedVM` as the source:
   
```azurecli
az image create --resource-group myResourceGroup --name myImage --source myAutomatedVM
```
 
## Step 2 - Create VM from image

Create a VM using the image by using [az vm create](/cli/azure/vm#create). You can create VMs in any resource group within your subscription from this image, but we will create our new VM in the same `myResourceGroup` resource group as the source VM. The following example creates a VM named `myVMfromImage` from the image named `myImage`.

Create the VM.

```azurecli
az vm create --resource-group myResourceGroup --name myVMfromImage --image myImage --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub
```

Open port 80 on the new VM.

```azurecli
az vm open-port --port 80 --resource-group myResourceGroup --name myVMfromImage
```

## Step 3 - Verify the deployment

Find the IP address of your VM with [az vm show](/cli/azure/vm#show):

```azurecli
az vm show --resource-group myResourceGroup2 --name myVM2 --show-details
```
	
Open a web browser and type in the IP address. You should see this message: `Hello World from host myVMfromImage!`

## Step 4 - Delete resource group 

When you are done with this tutorial, you can delete the resource group, which deletes the virtual machine. 

```azurecli 
az group delete --name myResourceGroup --no-wait --yes 
``` 

## Next steps

Further reading - [Images](../../storage/storage-managed-disks-overview.md#images)

