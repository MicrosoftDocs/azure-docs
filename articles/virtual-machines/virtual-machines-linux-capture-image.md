---
title: Capture a Linux VM using Azure CLI 2.0 (Preview) | Microsoft Docs
description: How to capture and generalize an image of a Linux-based Azure virtual machine (VM) using managed disks created with the Azure CLI 2.0 (Preview)
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: e608116f-f478-41be-b787-c2ad91b5a802
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 02/02/2017
ms.author: iainfou

---
# How to generalize and capture a Linux virtual machine using the Azure CLI 2.0 (Preview)
To reuse virtual machines (VMs) deployed and configured in Azure, you capture an image of the VM. The process also involves generalizing the VM to remove personal account information before you deploy new VMs from the image. This article details how to capture a VM image using the Azure CLI 2.0 (Preview) for a VM using Azure Managed Disks. These disks are handled by the Azure platform and do not require any preparation or location to store them. For more information about Azure Managed Disks, see [insert link to overview doc](). 

> [!TIP]
> If you want to create a copy of your existing Linux VM with its specialized state for backup or debugging, see [Create a copy of a Linux virtual machine running on Azure](virtual-machines-linux-copy-vm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). And if you want to upload a Linux VHD from an on-premises VM, see [Upload and create a Linux VM from custom disk image](virtual-machines-linux-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).  

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](virtual-machines-linux-capture-image-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) – our CLI for the classic and resource management deployment models
- [Azure CLI 2.0 (Preview) - Azure Managed Disks](#quick-commands) - our next generation CLI for the resource management deployment model (this article)

## Before you begin
Ensure that you meet the following prerequisites:

* **Azure VM created in the Resource Manager deployment model** - If you haven't created a Linux VM, you can use the [portal](virtual-machines-linux-quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), the [Azure CLI](virtual-machines-linux-quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), or [Resource Manager templates](virtual-machines-linux-cli-deploy-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). Configure the VM as needed. For example, [add data disks](virtual-machines-linux-add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), apply updates, and install applications. 

You also need the latest [Azure CLI 2.0 (Preview)](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/#login).

## Quick commands
If you need to quickly accomplish the task, the following section details the base commands to capture an image of a Linux VM in Azure. More detailed information and context for each step can be found in the rest of the document, starting [here](#step-1-remove-the-azure-linux-agent). In the following examples, replace example parameter names with your own values. Example parameter names include `myResourceGroup`, `myVM`, and `myImage`.

1. Deprovision your source VM:

    ```bash
    ssh ops@myvm.westus.cloudapp.azure.com
    sudo waagent -deprovision+user -force
    exit
    ```

2. Deallocate the VM with [az vm deallocate](/cli//azure/vm#deallocate):

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

3. Generalize the VM with [az vm generalize](/cli//azure/vm#generalize):
   
    ```azurecli
    az vm generalize --resource-group myResourceGroup --name myVM
    ```

4. Create an image from the VM resource with [az image create](/cli//azure/image#create):
   
    ```azurecli
    az image create --resource-group myResourceGroup --name myImage --source myVM
    ```

5. Create a VM from your image resource with [az vm create](/cli/azure/vm#create):

    ```azurecli
    az vm create --resource-group myResourceGroup --name myVMDeployed --image myImage
        --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub
    ```


## Step 1: Remove the Azure Linux agent
To make the VM ready for generalizing, you deprovision the VM using the Azure VM agent to delete files and data. Use the **waagent** command with the **deprovision** parameter on your target Linux VM. For more information, see the [Azure Linux Agent user guide](virtual-machines-linux-agent-user-guide.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

1. Connect to your Linux VM using an SSH client.
2. In the SSH window, type the following command:
   
    ```bash
    sudo waagent -deprovision+user
    ```
   > [!NOTE]
   > Only run this command on a VM that you intend to capture as an image. It does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution.
 
3. Type **y** to continue. You can add the **-force** parameter to avoid this confirmation step.
4. After the command completes, type **exit**. This step closes the SSH client.

## Step 2: Capture the VM
Use the Azure CLI 2.0 (Preview) to generalize and capture the VM. In the following examples, replace example parameter names with your own values. Example parameter names include **myResourceGroup**, **myVnet**, and **myVM**.

1. Deallocate the VM that you deprovisioned with [az vm deallocate](/cli//azure/vm#deallocate). The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`:
   
    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

2. Generalize the VM with [az vm generalize](/cli//azure/vm#generalize). The following example generalizes the VM named `myVM` in the resource group named `myResourceGroup`:
   
    ```azurecli
    az vm generalize --resource-group myResourceGroup --name myVM
    ```

3. Now reate an image of the VM resource with [az image create](/cli//azure/image#create). The following example creates an image named `myImage` in the resource group named `myResourceGroup` using the VM resource named `myVM`:
   
    ```azurecli
    az image create --resource-group myResourceGroup --name myImage --source myVM
    ```
   
   > [!NOTE]
   > The image is created in the same resource group as your source VM. You can create VMs in any resource group within your subscription from this image. From a management perspective, you may wish to create a specific resource group for your VM resources and images.

## Step 3: Create a VM from the captured image
Create a VM using the image you created with [az vm create](/cli/azure/vm#create). The following example creates a VM named `myVMDeployed` from the image named `myImage`:

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

The following example uses **az vm create** to create a VM in a different resource group than the source image by specifying the image resource ID:

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

- Power on the source VM resource.
- Make any updates or configuration changes.
- Follow the steps again to deprovision, deallocate, generalize, and capture the VM. 

For more information on managing your VMs with the CLI, see [Azure CLI 2.0 (Preview)](/cli/azure/overview).
