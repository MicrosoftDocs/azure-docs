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
ms.date: 04/18/2017
ms.author: cynthn
---

# Create a custom image of an Azure VM using the CLI

In this tutorial, you learn how to create your own custom image of a VM. In previous tutorials, we showed you how to use a preconfigured Azure Marketplace image to simplify creating a VM. Custom images are similar to marketplace images, but you create them yourself, based on your own Azure VMs. A custom image of a VM is a copy of your VM, including all the attached data disks. If you don't have a VM to use as a source, you can quickly create a VM using the [Quickstart with Azure CLI](quick-create-cli.md).

To try the examples in this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Create an image

To create an image of a virtual machine, you need to prepare the VM by deprovisioning and deallocating the VM, and then marking the source VM as generalized. After the VM has been prepared, you can create the image.

### Deprovision the VM 

To make a VM ready for taking an image, you first need to deprovision the VM using the Azure VM agent (waagent). The Azure VM agent is installed in the operating system of the VM, where it helps with provisioning and interacting with the Azure Fabric Controller. For more information, see the [Azure Linux Agent user guide](agent-user-guide.md).

Deprovisioning removes machine-specific information to make it ready for reprovisioning. This process resets host name to `localhost.localdomain` and deletes the following:

- All SSH host keys (if Provisioning.RegenerateSshHostKeyPair is 'y' in the configuration file)
- Nameserver configuration in `/etc/resolv.conf`
- Root password from `/etc/shadow` (if Provisioning.DeleteRootPassword is 'y' in the configuration file)
- Cached DHCP client leases

We are using `-deprovision+user` in this tutorial, which also deletes the last provisioned user account and any associated data.

Connect to your VM using SSH and use the **waagent** command with the **deprovision** parameter. Replace the example IP address with the public IP address of your VM.

```bash
ssh 52.174.34.95
```

Run the following command to deprovision the VM.
   
```bash
sudo waagent -deprovision+user -force
```

Close the SSH session.

```bash
exit
```

### Deallocate and mark the VM as generalized

To create an image, the VM needs to be deallocated and marked as **generalized** in Azure.  

Deallocate the VM using [az vm deallocate](/cli//azure/vm#deallocate). 
   
```azurecli
az vm deallocate --resource-group myResourceGroup --name myVM
```

Mark the VM as generalized with [az vm generalize](/cli//azure/vm#generalize). 
   
```azurecli
az vm generalize --resource-group myResourceGroup --name myVM
```

### Capture the image

Now you can create an image of the VM by using [az image create](/cli//azure/image#create). The following example creates an image named `myImage` in the resource group named `myResourceGroup` using the VM named `myAutomatedVM` as the source:
   
```azurecli
az image create \
   --resource-group myResourceGroup \
   --name myImage \
   --source myVM
```
 
## Create a VM from an image

You can create a VM using an image with [az vm create](/cli/azure/vm#create). You can create VMs in any resource group within your subscription from this image, but in this example, we create our new VM in the same `myResourceGroup` resource group as the source VM. The following example creates a VM named `myVMfromImage` from the image named `myImage`.

Create the VM.

```azurecli
az vm create \
   --resource-group myResourceGroup \
   --name myVMfromImage \
   --image myImage \
   --admin-username azureuser --generate-ssh-keys
```


## Next steps

Tutorial - [Create highly available VMs](tutorial-availability-sets.md)

Further reading - [Images](../../storage/storage-managed-disks-overview.md#images)

