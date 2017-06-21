---
title: Create Linux VM from a specialized VHD in Azure | Microsoft Docs
description: Create a new Linux VM by attaching a specialized managed disk as the OS disk using in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 3b7d3cd5-e3d7-4041-a2a7-0290447458ea
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 06/20/2017
ms.author: cynthn

---
# Create a Linux VM from a specialized disk

Create a new Linux VM by attaching a specialized managed disk as the OS disk using the Azure CLI. A specialized disk is a copy of VHD from an existing VM that maintains the user accounts, applications and other state data from your original VM. 

You have two options:
* [Upload a VHD](#option-1-upload-a-specialized-vhd)
* [Copy the VHD of an existing Azure VM](#option-2-copy-the-vhd-from-an-existing-azure-vm)


## Prerequisites

This topic requires: 

- Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

- The AzCopy tool. See [AzCopy on Linux Preview](https://azure.microsoft.com/en-us/blog/announcing-azcopy-on-linux-preview/) for installation instructions.

## Option 1: Upload a specialized VHD

You can upload the VHD from a specialized VM created with an on-premises virtualization tool, like Hyper-V, or a VM exported from another cloud.

### Prepare the VM
If you intend to use the VHD as-is to create a new VM, ensure the following steps are completed. 
  
  * Remove any guest virtualization tools and agents that are installed on the VM (i.e. VMware tools).
  * Ensure the VM is configured to pull its IP address and DNS settings via DHCP. This ensures that the server obtains an IP address within the VNet when it starts up. 


### Get the storage account
You need a storage account in Azure to store the uploaded VHD. You can either use an existing storage account or create a new one. 

To show the available storage accounts in the myResourceGroup resource group, type:

```azurecli-interactive
az storage account list -g myResourceGroup
```

Or, to create a new storage account named *mystorageaccount* in the *West US* region in the *myResourceGroup* resource group, type the following:

```azurecli-interactive
az storage account create -n mystorageaccount -g MyResourceGroup -l westus --sku Standard_LRS
```

You also need the storage account key. 

```azurecli-interactive
az storage account keys list --account-name mystorageaccount --resource-group myResourceGroup
```

### Upload the VHD to your storage account 

Use [AzCopy](https://azure.microsoft.com/en-us/blog/announcing-azcopy-on-linux-preview/) to upload the VHD to the storage account. Replace *key1* with your storage account key.

```azurecli-interactive
azcopy --source /mnt --include "*.vhd" --destination "https://mystorageaccount.blob.core.windows.net/mycontainer/" --dest-key key1
```

Depending on your network connection and the size of your VHD file, this command may take a while to complete


## Option 2: Copy the VHD from an existing Azure VM

You can create a copy of a VHD from a VM in another storage account.

### Create a destination storage account and container

If you don't already have one, you can create a destination storage account using [az storage account create](/cli/azure/storage/account#create). Storage account names must be unique, between 3 and 24 characters in length, and contain numbers and lowercase letters only. The following example creates a storage account named *mystorageaccount*:

```azurecli
az storage account create \
    --resource-group myResourceGroup \
    --name mystorageaccount \
    --sku Standard_LRS
```

Create a container using [az storage container create](/cli/azure/storage/container.md#create).

```azurecli-interactive
az storage container create --name mycontainer --account-name mystorageaccount
```
                            
### Get the storage account URLs
You need the URLs of the source and destination storage accounts. The URLs look like: `https://<storageaccount>.blob.core.windows.net/<containerName>/`. If you already know the storage account and container name, you can just replace the information between the brackets to create your URL. 

### Get the storage access keys
Find the access keys for the source and destination storage accounts. For more information about access keys, see [About Azure storage accounts](../../storage/storage-create-storage-account.md).

* **Portal**: Click **More services** > **Storage accounts** > *storage account* > **Access keys**. Copy the key labeled as **key1**.
* **Powershell**: Use [Get-AzureRmStorageAccountKey](/powershell/module/azurerm.storage/get-azurermstorageaccountkey) to get the storage key for the storage account **mystorageaccount** in the resource group **myResourceGroup**. Copy the key labeled **key1**.

```powershell
Get-AzureRmStorageAccountKey -Name mystorageaccount -ResourceGroupName myResourceGroup
```

### Deallocate the VM
Deallocate the VM using [az vm deallocate](/cli/azure/vm#deallocate), which frees up the VHD to be copied. 

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```
### Copy the VHD

To copy all of the files within a container, you use the **/S** switch. This can be used to copy the OS VHD and all of the data disks if they are in the same container. This example shows how to copy all of the files in the container **mysourcecontainer** in storage account **mysourcestorageaccount** to the container **mydestinationcontainer** in the **mydestinationstorageaccount** storage account. Replace the names of the storage accounts and containers with your own. Replace `<sourceStorageAccountKey1>` and `<destinationStorageAccountKey1>` with your own keys.

```
AzCopy /Source:https://mysourcestorageaccount.blob.core.windows.net/mysourcecontainer `
    /Dest:https://mydestinationatorageaccount.blob.core.windows.net/mydestinationcontainer `
    /SourceKey:<sourceStorageAccountKey1> /DestKey:<destinationStorageAccountKey1> /S
```

If you only want to copy a specific VHD in a container with multiple files, you can also specify the file name using the /Pattern switch. In this example, only the file named **myFileName.vhd** will be copied.

```
AzCopy /Source:https://mysourcestorageaccount.blob.core.windows.net/mysourcecontainer `
  /Dest:https://mydestinationatorageaccount.blob.core.windows.net/mydestinationcontainer `
  /SourceKey:<sourceStorageAccountKey1> /DestKey:<destinationStorageAccountKey1> `
  /Pattern:myFileName.vhd
```


When it is finished, you will get a message that looks something like:

```
Finished 2 of total 2 file(s).
[2016/10/07 17:37:41] Transfer summary:
-----------------
Total files transferred: 2
Transfer successfully:   2
Transfer skipped:        0
Transfer failed:         0
Elapsed time:            00.00:13:07
```

### Troubleshooting

When you use AZCopy, if you see the error "Server failed to authenticate the request", make sure the value of the Authorization header is formed correctly including the signature. If you are using Key 2 or the secondary storage key, try using the primary or 1st storage key.

## Create a managed disk
To create a VM from your VHD, first convert the VHD to a managed disk with [az disk create](/cli/azure/disk/create). The following example creates a managed disk named `myManagedDisk` from the VHD you uploaded:

```azurecli
az disk create --resource-group myResourceGroup --name myManagedDisk \
  --source https://mystorageaccount.blob.core.windows.net/mycontainer/myDisk.vhd
```

Obtain the URI of the managed disk you created with [az disk list](/cli/azure/disk/list):

```azurecli
az disk list --resource-group myResourceGroup \
  --query '[].{Name:name,URI:creationData.sourceUri}' --output table
```

The output is similar to the following example:

```azurecli
Name               URI
-----------------  ----------------------------------------------------------------------------------------------------
myManagedDisk    https://vhdstoragezw9.blob.core.windows.net/system/Microsoft.Compute/Images/vhds/myManagedDisk.vhd
```


## Create the VM

Now, create your VM with [az vm create](/cli/azure/vm#create) and specify the name of your managed disk (`--attach-os-disk`). The following example creates a VM named `myVM` using the managed disk created from your uploaded VHD:

```azurecli
az vm create --resource-group myResourceGroup --location westus \
    --name myVM --os-type linux \
    --admin-username azureuser --ssh-key-value ~/.ssh/id_rsa.pub \
    --attach-os-disk myManagedDisk.vhd
```


## Next steps
To sign in to your new virtual machine, browse to the VM in the [portal](https://portal.azure.com), click **Connect**, and open the Remote Desktop RDP file. Use the account credentials of your original virtual machine to sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md).

