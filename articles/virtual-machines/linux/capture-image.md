---
title: Upload a Linux VHD and capture an image with Azure CLI 2.0 | Microsoft Docs
description: How to upload a Linux VHD to Azure and capture an image to use for mass deployments with the Azure CLI 2.0.
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
ms.date: 07/05/2017
ms.author: cynthn

---
# How to upload Linux VHD and create an image

<!-- generalize, upload, image -->

To reuse virtual machines (VMs) deployed in Azure, you capture an image of the VM. The process also involves generalizing the VM to remove personal account information before you deploy new VMs from the image. This article details how to uplaod a generalized VHD to Azure and then capture an image with the Azure CLI 2.0. 

> [!TIP]
> If you want to create a copy of your existing Linux VM with its specialized state for backup or debugging, or upload a specialized Linux VHD from an on-premises VM, see [Upload and create a Linux VM from custom disk image](upload-vhd.md).  


## Before you begin
Ensure that you meet the following prerequisites:

* **Azure VM created in the Resource Manager deployment model** - If you haven't created a Linux VM, you can use the [portal](quick-create-portal.md), the [Azure CLI](quick-create-cli.md), or [Resource Manager templates](cli-deploy-templates.md). Configure the VM as needed. For example, [add data disks](add-disk.md), apply updates, and install applications. 

You also need the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/#login).

## Quick commands
If you need to quickly accomplish the task, the following section details the base commands to capture an image of a Linux VM in Azure. More detailed information and context for each step can be found in the rest of the document, starting [here](#detailed-steps). In the following examples, replace example parameter names with your own values. Example parameter names include *myResourceGroup*, *myVM* and *myImage*.

1. Deprovision your source VM. The *+user* parameter also removes the last provisioned user account. If you are baking account credentials in to the VM, use *-deprovision* to leave the user account in place.

    ```bash
    ssh ops@myvm.westus.cloudapp.azure.com
    sudo waagent -deprovision+user -force
    exit
    ```

2. Deallocate the VM with [az vm deallocate](/cli/azure/vm#deallocate):

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

3. Generalize the VM with [az vm generalize](/cli/azure/vm#generalize). If you have used a tool such as [Packer](http://www.packer.io) to build your source VM, skip this step as your image has already been generalized.
   
    ```azurecli
    az vm generalize --resource-group myResourceGroup --name myVM
    ```

4. Create an image from the VM resource with [az image create](/cli/azure/image#create):
   
    ```azurecli
    az image create --resource-group myResourceGroup --name myImage --source myVM
    ```

5. Create a VM from your image resource with [az vm create](/cli/azure/vm#create):

    ```azurecli
    az vm create --resource-group myResourceGroup --name myVMDeployed --image myImage
        --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub
    ```

## Detailed steps
In the following steps you deprovision an existing VM, deallocate and generalize the VM resource, then create an image. You can use this image to create VMs across any resource group within your subscription. This process gives [Azure Managed Disks](../../storage/storage-managed-disks-overview.md) an advantage over unmanaged disks. With unmanaged disks, you create a blob copy of the underlying virtual hard disk (VHD) and are then limited to creating VMs in the same storage account as the copied VHD blob. With managed disks, you create an image resource that can be deployed across your whole subscription.

## Step 1: Remove the Azure Linux agent
To make the VM ready for generalizing, you deprovision the VM using the Azure VM agent to delete files and data. Use the `waagent` command with the *+deprovision* parameter on your target Linux VM. For more information, see the [Azure Linux Agent user guide](../windows/agent-user-guide.md).

1. Connect to your Linux VM using an SSH client.
2. In the SSH window, type the following command:
   
    ```bash
    sudo waagent -deprovision+user
    ```
   > [!NOTE]
   > Only run this command on a VM that you intend to capture as an image. It does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution. The *+user* parameter also removes the last provisioned user account. If you are baking account credentials in to the VM, use *-deprovision* to leave the user account in place.
 
3. Type *y* to continue. You can add the *-force* parameter to avoid this confirmation step.
4. After the command completes, type `exit`. This step closes the SSH client.

## Step 2: Create VM image
Use the Azure CLI 2.0 to generalize and capture the VM. In the following examples, replace example parameter names with your own values. Example parameter names include *myResourceGroup*, *myVnet*, and *myVM*.

1. Deallocate the VM that you deprovisioned with [az vm deallocate](/cli//azure/vm#deallocate). The following example deallocates the VM named *myVM* in the resource group named *myResourceGroup*:
   
    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

2. Generalize the VM with [az vm generalize](/cli//azure/vm#generalize). If you have used a tool such as [Packer](http://www.packer.io) to build your source VM, skip this step as your image has already been generalized. The following example generalizes the VM named *myVM* in the resource group named *myResourceGroup*:
   
    ```azurecli
    az vm generalize --resource-group myResourceGroup --name myVM
    ```

3. Now create an image of the VM resource with [az image create](/cli//azure/image#create). The following example creates an image named *myImage* in the resource group named *myResourceGroup* using the VM resource named *myVM*:
   
    ```azurecli
    az image create --resource-group myResourceGroup --name myImage --source myVM
    ```
   
   > [!NOTE]
   > The image is created in the same resource group as your source VM. You can create VMs in any resource group within your subscription from this image. From a management perspective, you may wish to create a specific resource group for your VM resources and images.

## Step 3: Create a VM from the captured image
Create a VM using the image you created with [az vm create](/cli/azure/vm#create). The following example creates a VM named *myVMDeployed* from the image named *myImage*:

```azurecli
az vm create --resource-group myResourceGroup --name myVMDeployed --image myImage
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub
```

With managed disks, you can create VMs from an image in any resource group within your subscription. This behavior is a change from unmanaged disks where you could only create VMs in the same storage account as your source VHD. To create a VM in a different resource group than the image, specify the full resource ID to your image. Use [az image list](/cli/azure/image#list) to view a list of images. The output is similar to the following example:

```json
"id": "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/images/myImage",
   "location": "westus",
   "name": "myImage",
```

The following example uses [az vm create](/cli/azure/vm#create) to create a VM in a different resource group than the source image by specifying the image resource ID:

```azurecli
az vm create --resource-group myOtherResourceGroup --name myOtherVMDeployed 
    --image "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/images/myImage"
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub
```


### Verify the deployment
Now SSH to the virtual machine you created to verify the deployment and start using the new VM. To connect via SSH, find the IP address or FQDN of your VM with [az vm show](/cli/azure/vm#show):

```azurecli
az vm show --resource-group myResourceGroup --name myVM --show-details
```

## Next steps
You can create multiple VMs from your source VM image. If you need to make changes to your image: 

- Create a VM from your image.
- Make any updates or configuration changes.
- Follow the steps again to deprovision, deallocate, generalize, and create an image.
- Use this new image for future deployments. If desired, delete the original image.

For more information on managing your VMs with the CLI, see [Azure CLI 2.0](/cli/azure/overview).
