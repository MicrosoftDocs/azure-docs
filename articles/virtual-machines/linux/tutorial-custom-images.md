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
ms.date: 04/14/2017
ms.author: cynthn
---

# Create a custom image of an Azure VM using the CLI

To complete this tutorial, you need to have already created a VM using the [How to automate the deployment of Linux virtual machines in Azure](tutorial-automate-vm-deployment.md) tutorial. In the previous tutorial, we showed you how to use a preconfigured Azure Marketplace image to simplify creating a VM. Custom images are similar to marketplace images, but you create them yourself based on your own Azure VMs. A custom image of a VM is a copy of your VM, including all of the attached data disks. 

In this tutorial, we will create a custom image of the VM from the previous tutorial and then use the custom image to create a new VM. 

To complete this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Create an image

To create an image of a virtual machine, you need to prepare the VM by deprovisioning, deallocating the VM and generalizing the existing VM. After the VM has been prepared, you can take the image.

### Deprovision the VM 

To make the VM ready for generalizing, you first need to deprovision the VM using the Azure VM agent. The Azure Vm agent is installed in the VM OS where it helps with provisioning and interacting with the Azure Fabric Controller. For more information, see the [Azure Linux Agent user guide](../windows/agent-user-guide.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Connect to your Linux VM using SSH and use the **waagent** command with the **deprovision** parameter on your source Linux VM. Replace the example IP address with the public IP address of your VM.

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

Generalizing a VM removes , generalizes the `myVM` virtual machine in the in the `myResourceGroup` resource group. It also creates an image named `myImage` in the same resource group.

Deallocate the VM that you deprovisioned with [az vm deallocate](/cli//azure/vm#deallocate). 
   
```azurecli
az vm deallocate --resource-group myResourceGroup --name myVM
```

Generalize the VM with [az vm generalize](/cli//azure/vm#generalize). 
   
```azurecli
az vm generalize --resource-group myResourceGroup --name myVM
```

### Capture the image

Now create an image of the VM by using [az image create](/cli//azure/image#create). The following example creates an image named `myImage` in the resource group named `myResourceGroup` using the VM named `myAutomatedVM` as the source:
   
```azurecli
az image create --resource-group myResourceGroup --name myImage --source myVM
```
 
## Step 2 - Create VM from image

Create a VM using the image by using [az vm create](/cli/azure/vm#create). You can create VMs in any resource group within your subscription from this image, but we will create our new VM in the same `myResourceGroup` resource group as the source VM. The following example creates a VM named `myVMfromImage` from the image named `myImage`.

Create the VM.

```azurecli
az vm create \
   --resource-group myResourceGroup \
   --name myVMfromImage --image myImage \
   --admin-username azureuser --generate-ssh-keys
```


## Next steps

Further reading - [Images](../../storage/storage-managed-disks-overview.md#images)

