---
title: Capture an image of a Linux VM in Azure using Azure CLI | Microsoft Docs
description: Capture an image of an Azure VM to use for mass deployments by using the Azure CLI.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: e608116f-f478-41be-b787-c2ad91b5a802
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 10/08/2018
ms.author: cynthn

---
# How to create an image of a virtual machine or VHD

<!-- generalize, image - extended version of the tutorial-->

To create multiple copies of a virtual machine (VM) for use in Azure, capture an image of the VM or of the OS VHD. To create an image for deployment, you'll need to remove personal account information. In the following steps, you deprovision an existing VM, deallocate it and create an image. You can use this image to create VMs across any resource group within your subscription.

To create a copy of your existing Linux VM for backup or debugging, or to upload a specialized Linux VHD from an on-premises VM, see [Upload and create a Linux VM from custom disk image](upload-vhd.md).  

You can also use **Packer** to create your custom configuration. For more information, see [How to use Packer to create Linux virtual machine images in Azure](build-image-with-packer.md).

You'll need the following items before creating an image:

* An Azure VM created in the Resource Manager deployment model that uses managed disks. If you haven't yet created a Linux VM, you can use the [portal](quick-create-portal.md), the [Azure CLI](quick-create-cli.md), or [Resource Manager templates](create-ssh-secured-vm-from-template.md). Configure the VM as needed. For example, [add data disks](add-disk.md), apply updates, and install applications. 

* The latest [Azure CLI](/cli/azure/install-az-cli2) installed and be logged in to an Azure account with [az login](/cli/azure/reference-index#az-login).

## Quick commands

For a simplified version of this article, and for testing, evaluating, or learning about VMs in Azure, see [Create a custom image of an Azure VM by using the CLI](tutorial-custom-images.md).


## Step 1: Deprovision the VM
First you'll deprovision the VM by using the Azure VM agent to delete machine-specific files and data. Use the `waagent` command with the `-deprovision+user` parameter on your source Linux VM. For more information, see the [Azure Linux Agent user guide](../extensions/agent-linux.md).

1. Connect to your Linux VM with an SSH client.
2. In the SSH window, enter the following command:
   
    ```bash
    sudo waagent -deprovision+user
    ```
   > [!NOTE]
   > Only run this command on a VM that you'll capture as an image. This command does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution. The `+user` parameter also removes the last provisioned user account. To keep user account credentials in the VM, use only `-deprovision`.
 
3. Enter **y** to continue. You can add the `-force` parameter to avoid this confirmation step.
4. After the command completes, enter **exit** to close the SSH client.

## Step 2: Create VM image
Use the Azure CLI to mark the VM as generalized and capture the image. In the following examples, replace example parameter names with your own values. Example parameter names include *myResourceGroup*, *myVnet*, and *myVM*.

1. Deallocate the VM that you deprovisioned with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocates the VM named *myVM* in the resource group named *myResourceGroup*.
   
    ```azurecli
    az vm deallocate \
	  --resource-group myResourceGroup \
	  --name myVM
    ```

2. Mark the VM as generalized with [az vm generalize](/cli/azure/vm#generalize). The following example marks the VM named *myVM* in the resource group named *myResourceGroup* as generalized.
   
    ```azurecli
    az vm generalize \
	  --resource-group myResourceGroup \
	  --name myVM
    ```

3. Create an image of the VM resource with [az image create](/cli/azure/image#az-image-create). The following example creates an image named *myImage* in the resource group named *myResourceGroup* using the VM resource named *myVM*.
   
    ```azurecli
    az image create \
	  --resource-group myResourceGroup \
	  --name myImage --source myVM
    ```
   
   > [!NOTE]
   > The image is created in the same resource group as your source VM. You can create VMs in any resource group within your subscription from this image. From a management perspective, you may wish to create a specific resource group for your VM resources and images.
   >
   > If you would like to store your image in zone-resilient storage, you need to create it in a region that supports [availability zones](../../availability-zones/az-overview.md) and include the `--zone-resilient true` parameter.

## Step 3: Create a VM from the captured image
Create a VM by using the image you created with [az vm create](/cli/azure/vm#az_vm_create). The following example creates a VM named *myVMDeployed* from the image named *myImage*.

```azurecli
az vm create \
   --resource-group myResourceGroup \
   --name myVMDeployed \
   --image myImage\
   --admin-username azureuser \
   --ssh-key-value ~/.ssh/id_rsa.pub
```

### Creating the VM in another resource group 

You can create VMs from an image in any resource group within your subscription. To create a VM in a different resource group than the image, specify the full resource ID to your image. Use [az image list](/cli/azure/image#az-image-list) to view a list of images. The output is similar to the following example.

```json
"id": "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/images/myImage",
   "location": "westus",
   "name": "myImage",
```

The following example uses [az vm create](/cli/azure/vm#az-vm-create) to create a VM in a resource group other than the source image, by specifying the image resource ID.

```azurecli
az vm create \
   --resource-group myOtherResourceGroup \
   --name myOtherVMDeployed \
   --image "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/images/myImage" \
   --admin-username azureuser \
   --ssh-key-value ~/.ssh/id_rsa.pub
```


## Step 4: Verify the deployment

SSH into the virtual machine you created to verify the deployment and start using the new VM. To connect via SSH, find the IP address or FQDN of your VM with [az vm show](/cli/azure/vm#az-vm-show).

```azurecli
az vm show \
   --resource-group myResourceGroup \
   --name myVMDeployed \
   --show-details
```

## Next steps
You can create multiple VMs from your source VM image. To make changes to your image: 

- Create a VM from your image.
- Make any updates or configuration changes.
- Follow the steps again to deprovision, deallocate, generalize, and create an image.
- Use this new image for future deployments. You may delete the original image.

For more information on managing your VMs with the CLI, see [Azure CLI](/cli/azure).
