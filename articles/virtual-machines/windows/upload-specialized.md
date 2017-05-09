---
title: Upload a specialized VHD to Azure to use for creating a new VM | Microsoft Docs
description: Upload a specialized VHD to Azure to use for creating a new VM. 
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/05/2017
ms.author: cynthn
ms.custom: H1Hack27Feb2017

---

# How to upload a specialized VHD to create a VM in Azure

A specialized VHD maintains the user accounts, applications and other state data from your original VM. You can upload a specialized VHD to Azure and use it to create a VM that uses Managed Disks or an unmanaged storage account. We recommend that you use [Managed Disks](../../storage/storage-managed-disks-overview.md) to take advantage of the simplified management and additional features that Managed Disks offer.


> [!IMPORTANT]
> Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
>
>


* For information about pricing of the various VM sizes, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Windows).
* For information on storage pricing, see [Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). 
* For availability of VM sizes in Azure regions, see [Products available by region](https://azure.microsoft.com/regions/services/).
* To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../../azure-subscription-service-limits.md).

## Before you begin
If you use PowerShell, make sure that you have the latest version of the AzureRM.Compute PowerShell module. Run the following command to install it.

```powershell
Install-Module AzureRM.Compute -RequiredVersion 2.6.0
```
For more information, see [Azure PowerShell Versioning](/powershell/azure/overview).


## Prepare the VM
 
If you intend to use the specialized VHD as-is to create a new VM, ensure the following steps are completed. 
  * If you are going to use Managed Disks, review [Plan for the migration to Managed Disks](on-prem-to-azure.md#plan-for-the-migration-to-managed-disks).
  * [Prepare a Windows VHD to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). **Do not** generalize the VM using Sysprep.
  * Remove any guest virtualization tools and agents that are installed on the VM (i.e. VMware tools).
  * Ensure the VM is configured to pull its IP address and DNS settings via DHCP. This ensures that the server obtains an IP address within the VNet when it starts up. 
  * Shut down to VM before proceeding.

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

If you will be using the VHD to create a managed disk for a VM, the storage account location must be same the location where you will be creating the VM.

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

Use the [Add-AzureRmVhd](/powershell/module/azurerm.compute/add-azurermvhd) cmdlet to upload the VHD to a container in your storage account. This example uploads the file **myVHD.vhd** from `"C:\Users\Public\Documents\Virtual hard disks\"` to a storage account named **mystorageaccount** in the **myResourceGroup** resource group. The file will be placed into the container named **mycontainer** and the new file name will be **myUploadedVHD.vhd**.

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

Save the **Destination URI** path to use later if you are going to create a managed disk or a new VM using the uploaded VHD.

### Other options for uploading a VHD

You can also upload a VHD to your storage account using one of the following:

-   [Azure Storage Copy Blob API](https://msdn.microsoft.com/library/azure/dd894037.aspx)

-   [Azure Storage Explorer Uploading Blobs](https://azurestorageexplorer.codeplex.com/)

-   [Storage Import/Export Service REST API Reference](https://msdn.microsoft.com/library/dn529096.aspx)

	We recommend using Import/Export Service if estimated uploading time is longer than 7 days. You can use [DataTransferSpeedCalculator](https://github.com/Azure-Samples/storage-dotnet-import-export-job-management/blob/master/DataTransferSpeedCalculator.html) to estimate the time from data size and transfer unit. 

	Import/Export can be used to copy to a standard storage account. You will need to copy from standard storage to premium storage account using a tool like AzCopy.

	
## Create the subNet and vNet

Create the vNet and subNet of the [virtual network](../../virtual-network/virtual-networks-overview.md).

1. Create the subNet. This example creates a subnet named **mySubNet**, in the resource group **myResourceGroup**, and sets the subnet address prefix to **10.0.0.0/24**.
   
    ```powershell
    $subnetName = "mySubNet"
    $singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/24
    ```
2. Create the vNet. This example sets the virtual network name to be **myVnetName**, the location to **West US**, and the address prefix for the virtual network to **10.0.0.0/16**. 
   
    ```powershell
    $location = "West US"
    $vnetName = "myVnetName"
    $vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location `
        -AddressPrefix 10.0.0.0/16 -Subnet $singleSubnet
    ```    

## Create a public IP address and NIC
To enable communication with the virtual machine in the virtual network, you need a [public IP address](../../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

1. Create the public IP. In this example, the public IP address name is set to **myIP**.
   
    ```powershell
    $ipName = "myIP"
    $pip = New-AzureRmPublicIpAddress -Name $ipName -ResourceGroupName $rgName -Location $location `
        -AllocationMethod Dynamic
    ```       
2. Create the NIC. In this example, the NIC name is set to **myNicName**.
   
    ```powershell
    $nicName = "myNicName"
    $nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName `
	-Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
	```

## Create the network security group and an RDP rule
To be able to log in to your VM using RDP, you need to have an security rule that allows RDP access on port 3389. Because the VHD for the new VM was created from an existing specialized VM, after the VM is created you can use an existing account from the source virtual machine that had permission to log on using RDP.

This example sets the NSG name to **myNsg** and the RDP rule name to **myRdpRule**.

```powershell
$nsgName = "myNsg"

$rdpRule = New-AzureRmNetworkSecurityRuleConfig -Name myRdpRule -Description "Allow RDP" `
    -Access Allow -Protocol Tcp -Direction Inbound -Priority 110 `
    -SourceAddressPrefix Internet -SourcePortRange * `
    -DestinationAddressPrefix * -DestinationPortRange 3389

$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $rgName -Location $location `
    -Name $nsgName -SecurityRules $rdpRule
	
```

For more information about endpoints and NSG rules, see [Opening ports to a VM in Azure using PowerShell](nsg-quickstart-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Set the VM name and size

This example sets the VM name to "myVM" and the VM size to "Standard_A2".

```powershell
$vmName = "myVM"
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A2"
```

## Add the NIC
	
```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id
```
	
	
## Configure the OS disk

The specialised OS could be a VHD that you [uploaded to Azure](upload-image.md) or a [copy the VHD from an existing Azure VM](vhd-copy.md). 

You can choose one of two options:
- **Option 1**: Create a specialized managed disk from a specialied VHD in an existing storage account to use as the OS disk.

or 

- **Option 2**: Use a specialized VHD stored in your own storage account (an unmanaged disk). 

### Option 1: Create a managed disk from an unmanaged specialized disk

1. Create a managed disk from the existing specialized VHD in your storage account. This example uses **myOSDisk1** for the disk name, puts the disk in **StandardLRS** storage and uses **https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vh.vhd** as the URI for the source VHD.

    ```powershell
    $osDisk = New-AzureRmDisk -DiskName "myOSDisk1" -Disk (New-AzureRmDiskConfig `
	-AccountType StandardLRS  -Location $location -CreationDataCreateOption Import `
	-SourceUri $urlOfUploadedImageVhd -ResourceGroupName $rgName
    ```

2. Add the OS disk to the configuration. This example sets the size of the disk to **128 GB** and attaches the managed disk as a **Windows** OS disk.
	
	```powershell
	$vm = Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $osDisk.Id -ManagedDiskStorageAccountType StandardLRS `
	-DiskSizeInGB 128 -CreateOption Attach -Windows
	```

Optional: Attach additional managed disks as data disks. This option assumes that you created your managed data disks using [Create managed data disks](create-managed-disk-ps.md). 

```powershell
$vm = Add-AzureRmVMDataDisk -VM $VirtualMachine -Name $dataDiskName -CreateOption Attach -ManagedDiskId $dataDisk1.Id -Lun 1
```


### Option 2: Attach a VHD that is in an existing storage account

1. Set the URI for the VHD that you want to use. In this example, the VHD file named **myOsDisk.vhd** is kept in a storage account named **myStorageAccount** in a container named **myContainer**.

    ```powershell
    $osDiskUri = $urlOfUploadedImageVhd
    ```
2. Add the OS disk by using the URL of the copied OS VHD. In this example, when the OS disk is created, the term "osDisk" is appened to the VM name to create the OS disk name. This example also specifies that this Windows-based VHD should be attached to the VM as the OS disk.
    
	```powershell
    $osDiskName = $vmName + "osDisk"
    $vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption attach -Windows
    ```

Optional: If you have data disks that need to be attached to the VM, add the data disks by using the URLs of data VHDs and the appropriate Logical Unit Number (Lun).

```powershell
$dataDiskName = $vmName + "dataDisk"
$vm = Add-AzureRmVMDataDisk -VM $vm -Name $dataDiskName -VhdUri $dataDiskUri -Lun 1 -CreateOption attach
```

When using a storage account, the data and operating system disk URLs look something like this: `https://StorageAccountName.blob.core.windows.net/BlobContainerName/DiskName.vhd`. You can find this on the portal by browsing to the target storage container, clicking the operating system or data VHD that was copied, and then copying the contents of the URL.


## Create the VM

Create the VM using the configurations that we just created.

```powershell
New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm
```

If this command was successful, you'll see output like this:

```
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK OK   

```

## Verify that the VM was created
You should see the newly created VM either in the [Azure portal](https://portal.azure.com), under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

```powershell
$vmList = Get-AzureRmVM -ResourceGroupName $rgName
$vmList.Name
```

## Next steps
To sign in to your new virtual machine, browse to the VM in the [portal](https://portal.azure.com), click **Connect**, and open the Remote Desktop RDP file. Use the account credentials of your original virtual machine to sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
