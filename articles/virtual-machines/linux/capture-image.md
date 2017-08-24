---
title: Capture an image of a Linux VM in Azure using CLI 2.0 | Microsoft Docs
description: Capture an image of an Azure VM to use for mass deployments using the Azure CLI 2.0.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: e608116f-f478-41be-b787-c2ad91b5a802
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 07/10/2017
ms.author: cynthn

---
# How to create an image of a virtual machine or VHD

<!-- generalize, image - extended version of the tutorial-->

To create multiple copies of a virtual machine (VM) to use in Azure, capture an image of the VM or the OS VHD. To create an image, you need remove personal account information which makes it safer to deploy multiple times. In the following steps you deprovision an existing VM, deallocate and create an image. You can use this image to create VMs across any resource group within your subscription.

If you want to create a copy of your existing Linux VM for backup or debugging, or upload a specialized Linux VHD from an on-premises VM, see [Upload and create a Linux VM from custom disk image](upload-vhd.md).  

You can also use **Packer** to create your custom configuration. For more information on using Packer, see [How to use Packer to create Linux virtual machine images in Azure](build-image-with-packer.md).


## Before you begin
Ensure that you meet the following prerequisites:

* You need an Azure VM created in the Resource Manager deployment model using managed disks. If you haven't created a Linux VM, you can use the [portal](quick-create-portal.md), the [Azure CLI](quick-create-cli.md), or [Resource Manager templates](create-ssh-secured-vm-from-template.md). Configure the VM as needed. For example, [add data disks](add-disk.md), apply updates, and install applications. 

* You also need to have the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) installed and be logged in to an Azure account using [az login](/cli/azure/#login).

## Quick commands

For a simplified version of this topic, for testing, evaluating or learning about VMs in Azure, see [Create a custom image of an Azure VM using the CLI](tutorial-custom-images.md).


## Step 1: Deprovision the VM
You deprovision the VM, using the Azure VM agent, to delete machine specific files and data. Use the `waagent` command with the *-deprovision+user* parameter on your source Linux VM. For more information, see the [Azure Linux Agent user guide](../windows/agent-user-guide.md).

1. Connect to your Linux VM using an SSH client.
2. In the SSH window, type the following command:
   
    ```bash
    sudo waagent -deprovision+user
    ```
<br>
   > [!NOTE]
   > Only run this command on a VM that you intend to capture as an image. It does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution. The *+user* parameter also removes the last provisioned user account. If you want to keep account credentials in the VM, just use *-deprovision* to leave the user account in place.
 
3. Type **y** to continue. You can add the **-force** parameter to avoid this confirmation step.
4. After the command completes, type **exit**. This step closes the SSH client.

## Step 2: Create VM image
Use the Azure CLI 2.0 to mark the VM as generalized and capture the image. In the following examples, replace example parameter names with your own values. Example parameter names include *myResourceGroup*, *myVnet*, and *myVM*.

1. Deallocate the VM that you deprovisioned with [az vm deallocate](/cli//azure/vm#deallocate). The following example deallocates the VM named *myVM* in the resource group named *myResourceGroup*:
   
    ```azurecli
    az vm deallocate \
	  --resource-group myResourceGroup \
	  --name myVM
    ```

2. Mark the VM as generalized with [az vm generalize](/cli//azure/vm#generalize). The following example marks the the VM named *myVM* in the resource group named *myResourceGroup* as generalized:
   
    ```azurecli
    az vm generalize \
	  --resource-group myResourceGroup \
	  --name myVM
    ```

3. Now create an image of the VM resource with [az image create](/cli//azure/image#create). The following example creates an image named *myImage* in the resource group named *myResourceGroup* using the VM resource named *myVM*:
   
    ```azurecli
    az image create \
	  --resource-group myResourceGroup \
	  --name myImage --source myVM
    ```
   
   > [!NOTE]
   > The image is created in the same resource group as your source VM. You can create VMs in any resource group within your subscription from this image. From a management perspective, you may wish to create a specific resource group for your VM resources and images.

## Step 3: Create a VM from the captured image
Create a VM using the image you created with [az vm create](/cli/azure/vm#create). The following example creates a VM named *myVMDeployed* from the image named *myImage*:

```azurecli
az vm create \
   --resource-group myResourceGroup \
   --name myVMDeployed \
   --image myImage\
   --admin-username azureuser \
   --ssh-key-value ~/.ssh/id_rsa.pub
```

### Creating the VM in another resource group 

You can create VMs from an image in any resource group within your subscription. To create a VM in a different resource group than the image, specify the full resource ID to your image. Use [az image list](/cli/azure/image#list) to view a list of images. The output is similar to the following example:

```json
"id": "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/images/myImage",
   "location": "westus",
   "name": "myImage",
```

The following example uses [az vm create](/cli/azure/vm#create) to create a VM in a different resource group than the source image by specifying the image resource ID:

```azurecli
az vm create \
   --resource-group myOtherResourceGroup \
   --name myOtherVMDeployed \
   --image "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/images/myImage" \
   --admin-username azureuser \
   --ssh-key-value ~/.ssh/id_rsa.pub
```


## Step 4: Verify the deployment

Now SSH to the virtual machine you created to verify the deployment and start using the new VM. To connect via SSH, find the IP address or FQDN of your VM with [az vm show](/cli/azure/vm#show):

```azurecli
az vm show \
   --resource-group myResourceGroup \
   --name myVMDeployed \
   --show-details
```

## Next steps
You can create multiple VMs from your source VM image. If you need to make changes to your image: 

- Create a VM from your image.
- Make any updates or configuration changes.
- Follow the steps again to deprovision, deallocate, generalize, and create an image.
- Use this new image for future deployments. If desired, delete the original image.

For more information on managing your VMs with the CLI, see [Azure CLI 2.0](/cli/azure/overview).
