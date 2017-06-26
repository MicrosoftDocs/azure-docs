---
title: Upload a Windows VHD for Resource Manager | Microsoft Docs
description: Learn to upload a Windows virtual machine VHD from on-premises to Azure, using the Resource Manager deployment model. You can upload a VHD from either a generalized or a specialized VM.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 192c8e5a-3411-48fe-9fc3-526e0296cf4c
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/06/2017
ms.author: cynthn

---
# Upload a Windows VHD from an on-premises VM to Azure
This article shows you how to create and upload a Windows virtual hard disk (VHD) to be used in creating an Azure Vm. You can upload a VHD from either a generalized VM or a specialized VM. 

For a complete walk-through of how to prepare, upload and create a new VM using managed disks, see [Create a new VM from a generalized VHD uploaded to Azure using Managed Disks](upload-generalized-managed.md) or [Upload a specialized VHD to create a VM in Azure](upload-specialized.md).

For more details about disks and VHDs in Azure, see [About disks and VHDs for virtual machines](../../storage/storage-about-disks-and-vhds-windows.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Prepare the VM
You can upload both generalized and specialized VHDs to Azure. Each type requires that you prepare the VM before starting.

* **Generalized VHD** - a generalized VHD has had all of your personal account information removed using Sysprep. If you intend to use the VHD as an image to create new VMs from, you should:
  
  * [Prepare a Windows VHD to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 
  * [Generalize the virtual machine using Sysprep](generalize-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 
* **Specialized VHD** - a specialized VHD maintains the user accounts, applications and other state data from your original VM. If you intend to use the VHD as-is to create a new VM, ensure the following steps are completed. 
  
  * [Prepare a Windows VHD to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). **Do not** generalize the VM using Sysprep.
  * Remove any guest virtualization tools and agents that are installed on the VM (i.e. VMware tools).
  * Ensure the VM is configured to pull its IP address and DNS settings via DHCP. This ensures that the server obtains an IP address within the VNet when it starts up. 

## Log in to Azure
If you don't already have PowerShell version 1.4 or above installed, read [How to install and configure Azure PowerShell](/powershell/azure/overview).

1. Open Azure PowerShell and sign in to your Azure account. A pop-up window opens for you to enter your Azure account credentials.
   
    ```powershell
    Login-AzureRmAccount
    ```
2. Get the subscription IDs for your available subscriptions.
   
    ```powershell
    Get-AzureRmSubscription
    ```
3. Set the correct subscription using the subscription ID. Replace `<subscriptionID>` with the ID of the correct subscription.
   
    ```powershell
    Select-AzureRmSubscription -SubscriptionId "<subscriptionID>"
    ```

## Get the storage account
You need a storage account in Azure to store the uploaded VM image. You can either use an existing storage account or create a new one. 

To show the available storage accounts, type:

```powershell
Get-AzureRmStorageAccount
```

If you want to use an existing storage account, proceed to the [Upload the VM image](#upload-the-vm-vhd-to-your-storage-account) section.

If you need to create a storage account, follow these steps:

1. You need the name of the resource group where the storage account should be created. To find out all the resource groups that are in your subscription, type:
   
    ```powershell
    Get-AzureRmResourceGroup
    ```

    To create a resource group named **myResourceGroup** in the **West US** region, type:

    ```powershell
    New-AzureRmResourceGroup -Name myResourceGroup -Location "West US"
    ```

2. Create a storage account named **mystorageaccount** in this resource group by using the [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/new-azurermstorageaccount) cmdlet:
   
    ```powershell
    New-AzureRmStorageAccount -ResourceGroupName myResourceGroup -Name mystorageaccount -Location "West US" `
        -SkuName "Standard_LRS" -Kind "Storage"
    ```
   
    Valid values for -SkuName are:
   
   * **Standard_LRS** - Locally redundant storage. 
   * **Standard_ZRS** - Zone redundant storage.
   * **Standard_GRS** - Geo redundant storage. 
   * **Standard_RAGRS** - Read access geo redundant storage. 
   * **Premium_LRS** - Premium locally redundant storage. 

## Upload the VHD to your storage account
Use the [Add-AzureRmVhd](/powershell/module/azurerm.compute/add-azurermvhd) cmdlet to upload the image to a container in your storage account. This example uploads the file **myVHD.vhd** from `"C:\Users\Public\Documents\Virtual hard disks\"` to a storage account named **mystorageaccount** in the **myResourceGroup** resource group. The file will be placed into the container named **mycontainer** and the new file name will be **myUploadedVHD.vhd**.

```powershell
$rgName = "myResourceGroup"
$urlOfUploadedImageVhd = "https://mystorageaccount.blob.core.windows.net/mycontainer/myUploadedVHD.vhd"
Add-AzureRmVhd -ResourceGroupName $rgName -Destination $urlOfUploadedImageVhd `
    -LocalFilePath "C:\Users\Public\Documents\Virtual hard disks\myVHD.vhd"
```


If successful, you get a response that looks similar to this:

```powershell
MD5 hash is being calculated for the file C:\Users\Public\Documents\Virtual hard disks\myVHD.vhd.
MD5 hash calculation is completed.
Elapsed time for the operation: 00:03:35
Creating new page blob of size 53687091712...
Elapsed time for upload: 01:12:49

LocalFilePath           DestinationUri
-------------           --------------
C:\Users\Public\Doc...  https://mystorageaccount.blob.core.windows.net/mycontainer/myUploadedVHD.vhd
```

Depending on your network connection and the size of your VHD file, this command may take a while to complete

## Next steps
* [Create a VM in Azure from a generalized VHD](create-vm-generalized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Create a VM in Azure from a specialized VHD](create-vm-specialized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) by attaching it as an OS disk when you create a new VM.

