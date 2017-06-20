---
title: Create a copy of a specialized VM in Azure | Microsoft Docs
description: Learn how to create a copy of a specialized Windows VM running in Azure, in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: ce7e6cd3-6a4a-4fab-bf66-52f699b1398a
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/22/2017
ms.author: cynthn

---
# Create a copy of a specialized Windows VM running in Azure
This article shows you how to use the AZCopy tool to create a copy of the VHD from a specialized Windows VM that is running in Azure. You can then use the copy of the VHD to create a new VM. 

* If want to copy a generalized VM, see [How to create a VM image from an existing generalized Azure VM](capture-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* If you want to upload a VHD from an on-premises VM, like one created using Hyper-V, the see [Upload a Windows VHD from an on-premises VM to Azure](upload-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Before you begin
Make sure that you:

* Have information about the **source and destination storage accounts**. For the source VM, you need to have the storage account and container names. Usually, the container name will be **vhds**. You also need to have a destination storage account. If you don't already have one, you can create one using either the portal (**More Services** > Storage accounts > Add) or using the [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/new-azurermstorageaccount) cmdlet. 
* Have Azure [PowerShell 1.0](/powershell/azure/overview) (or later) installed.
* Have downloaded and installed the [AzCopy tool](../../storage/storage-use-azcopy.md). 

## Deallocate the VM
Deallocate the VM, which frees up the VHD to be copied. 

* **Portal**: Click **Virtual machines** > **myVM** > Stop
* **Powershell**: `Stop-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM` deallocates the VM named **myVM** in resource group **myResourceGroup**.

The **Status** for the VM in the Azure portal changes from **Stopped** to **Stopped (deallocated)**.

## Get the storage account URLs
You need the URLs of the source and destination storage accounts. The URLs look like: `https://<storageaccount>.blob.core.windows.net/<containerName>/`. If you already know the storage account and container name, you can just replace the information between the brackets to create your URL. 

You can use the Azure portal or Azure Powershell to get the URL:

* **Portal**: Click **More services** > **Storage accounts** > <storage account> **Blobs** and your source VHD file is probably in the **vhds** container. Click **Properties** for the container, and copy the text labeled **URL**. You'll need the URLs of both the source and destination containers. 
* **Powershell**: `Get-AzureRmVM -ResourceGroupName "myResourceGroup" -Name "myVM"` gets the information for VM named **myVM** in the resource group **myResourceGroup**. In the results, look in the **Storage profile** section for the **Vhd Uri**. The first part of the Uri is the URL to the container and the last part is the OS VHD name for the VM.

## Get the storage access keys
Find the access keys for the source and destination storage accounts. For more information about access keys, see [About Azure storage accounts](../../storage/storage-create-storage-account.md).

* **Portal**: Click **More services** > **Storage accounts** > <storage account> **All Settings** > **Access keys**. Copy the key labeled as **key1**.
* **Powershell**: `Get-AzureRmStorageAccountKey -Name mystorageaccount -ResourceGroupName myResourceGroup` gets the storage key for the storage account **mystorageaccount** in the resource group **myResourceGroup**. Copy the key labeled as **key1**.

## Copy the VHD
You can copy files between storage accounts using AzCopy. For the destination container, if the specified container doesn't exist, it will be created for you. 

To use AzCopy, open a command prompt on your local machine and navigate to the folder where AzCopy is installed. It will be similar to *C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy*. 

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

## Troubleshooting
* When you use AZCopy, if you see the error "Server failed to authenticate the request", make sure the value of the Authorization header is formed correctly including the signature. If you are using Key 2 or the secondary storage key, try using the primary or 1st storage key.

## Next steps
* You can create a new VM by [attaching the copy of the VHD to a VM as an OS disk](create-vm-specialized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

