---
title: Export an Azure VM for Resource Manager | Microsoft Docs
description: Download a Windows virtual machine VHD from Azure, using the Resource Manager deployment model. 
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 01/05/2017
ms.author: cynthn

---
# Download a Windows VHD from Azure

You can download your VHDs from Azure to your local computer using Powershell. 

For more details about disks and VHDs in Azure, see [About disks and VHDs for virtual machines](virtual-machines-linux-about-disks-vhds.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Prepare the VM

You can download the VHDs from generalized or specialized VMs. 

* **Specialized VHD** - a specialized VHD maintains the user accounts, applications and other state data from your original VM. If you intend to use the VHD as-is to create a new VM, you should remove Azure VM agent that is installed on the VM.


* **Generalized VHD** - a generalized VHD has had all of your personal account information removed using Sysprep. If you intend to use the downloaded VHD create new VMs, in addition to removing the Azure agent, you should also [Generalize the virtual machine using Sysprep](virtual-machines-windows-generalize-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 



Save-AzureRmVhd -Source "http://mystorageaccount.blob.core.windows.net/vhds/MyVM.vhd" -LocalFilePath "C:\vhd\MyVM.vhd"

### Removing the Azure VM agent



## Sign in to Azure
If you don't already have PowerShell version installed, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).

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

You need The URI for the storage account in Azure where your VHD is stored. 

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

2. Create a storage account named **mystorageaccount** in this resource group by using the [New-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607148.aspx) cmdlet:
   
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
Use the [Add-AzureRmVhd](https://msdn.microsoft.com/library/mt603554.aspx) cmdlet to upload the image to a container in your storage account. This example uploads the file **myVHD.vhd** from `"C:\Users\Public\Documents\Virtual hard disks\"` to a storage account named **mystorageaccount** in the **myResourceGroup** resource group. The file will be placed into the container named **mycontainer** and the new file name will be **myUploadedVHD.vhd**.

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
* [Create a VM in Azure from a generalized VHD](virtual-machines-windows-create-vm-generalized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Create a VM in Azure from a specialized VHD](virtual-machines-windows-create-vm-specialized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) by attaching it as an OS disk when you create a new VM.

