---
title: Create a managed Azure VM from a generalized on-premises VHD | Microsoft Docs
description: Upload a generalized VHD to Azure and use it to create new VMs, in the Resource Manager deployment model.
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
ms.date: 05/19/2017
ms.author: cynthn
---

# Upload a generalized VHD and use it to create new VMs in Azure

This topic walks you through using PowerShell to upload a VHD of a generalized VM to Azure, create an image from the VHD and create a new VM from that image. You can upload a VHD exported from an on-premises virtualization tool or from another cloud. Using [Managed Disks](../../storage/storage-managed-disks-overview.md) for the new VM simplifies the VM managment and provides better availability when the VM is placed in an availability set. 

If you want to use a sample script, see [Sample script to upload a VHD to Azure and create a new VM](../scripts/virtual-machines-windows-powershell-upload-generalized-script.md)

## Before you begin

- Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
- Review [Plan for the migration to Managed Disks](on-prem-to-azure.md#plan-for-the-migration-to-managed-disks) before starting your migration to [Managed Disks](../../storage/storage-managed-disks-overview.md).
- Make sure that you have the latest version of the AzureRM.Compute PowerShell module. Run the following command to install it.

    ```powershell
    Install-Module AzureRM.Compute -RequiredVersion 2.6.0
    ```
    For more information, see [Azure PowerShell Versioning](/powershell/azure/overview).


## Generalize the Windows VM using Sysprep

Sysprep removes all your personal account information, among other things, and prepares the machine to be used as an image. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

Make sure the server roles running on the machine are supported by Sysprep. For more information, see [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles)

> [!IMPORTANT]
> If you are running Sysprep before uploading your VHD to Azure for the first time, make sure you have [prepared your VM](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) before running Sysprep. 
> 
> 

1. Sign in to the Windows virtual machine.
2. Open the Command Prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.
4. In **Shutdown Options**, select **Shutdown**.
5. Click **OK**.
   
    ![Start Sysprep](./media/upload-generalized-managed/sysprepgeneral.png)
6. When Sysprep completes, it shuts down the virtual machine. Do not restart the VM.



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
3. Set the correct subscription using the subscription ID. Replace *<subscriptionID>* with the ID of the correct subscription.
   
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

    To create a resource group named **myResourceGroup** in the **East US** region, type:

    ```powershell
    New-AzureRmResourceGroup -Name myResourceGroup -Location "East US"
    ```

2. Create a storage account named **mystorageaccount** in this resource group by using the [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/new-azurermstorageaccount) cmdlet:
   
    ```powershell
    New-AzureRmStorageAccount -ResourceGroupName myResourceGroup -Name mystorageaccount -Location "East US"`
        -SkuName "Standard_LRS" -Kind "Storage"
    ```
   
    Valid values for -SkuName are:
   
   * **Standard_LRS** - Locally redundant storage. 
   * **Standard_ZRS** - Zone redundant storage.
   * **Standard_GRS** - Geo redundant storage. 
   * **Standard_RAGRS** - Read access geo redundant storage. 
   * **Premium_LRS** - Premium locally redundant storage. 

## Upload the VHD to your storage account

Use the [Add-AzureRmVhd](https://msdn.microsoft.com/library/mt603554.aspx) cmdlet to upload the VHD to a container in your storage account. This example uploads the file *myVHD.vhd* from *"C:\Users\Public\Documents\Virtual hard disks\"* to a storage account named *mystorageaccount* in the *myResourceGroup* resource group. The file will be placed into the container named *mycontainer* and the new file name will be *myUploadedVHD.vhd*.

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

- [AzCopy](http://aka.ms/downloadazcopy)
- [Azure Storage Copy Blob API](https://msdn.microsoft.com/library/azure/dd894037.aspx)
- [Azure Storage Explorer Uploading Blobs](https://azurestorageexplorer.codeplex.com/)
- [Storage Import/Export Service REST API Reference](https://msdn.microsoft.com/library/dn529096.aspx)
-	We recommend using Import/Export Service if estimated uploading time is longer than 7 days. You can use [DataTransferSpeedCalculator](https://github.com/Azure-Samples/storage-dotnet-import-export-job-management/blob/master/DataTransferSpeedCalculator.html) to estimate the time from data size and transfer unit. 
	Import/Export can be used to copy to a standard storage account. You will need to copy from standard storage to premium storage account using a tool like AzCopy.


## Create a managed image from the uploaded VHD 

Create a managed image using your generalized OS VHD. Replace the values with your own information.


1.  First, set the common parameters:

    ```powershell
	$vmName = "myVM"
	$computerName = "myComputer"
	$vmSize = "Standard_DS1_v2"
	$location = "East US" 
	$imageName = "yourImageName"
    ```

4.  Create the image using your generalized OS VHD.

    ```powershell
	$imageConfig = New-AzureRmImageConfig -Location $location
	$imageConfig = Set-AzureRmImageOsDisk -Image $imageConfig -OsType Windows -OsState Generalized -BlobUri $urlOfUploadedImageVhd
	$image = New-AzureRmImage -ImageName $imageName -ResourceGroupName $rgName -Image $imageConfig
    ```

## Create a virtual network
Create the vNet and subnet of the [virtual network](../../virtual-network/virtual-networks-overview.md).

1. Create the subnet. This example creates a subnet named *mySubnet* with the address prefix of *10.0.0.0/24*.  
   
    ```powershell
    $subnetName = "mySubnet"
    $singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/24
    ```
2. Create the virtual network. This example creates a virtual network named *myVnet* with the address prefix of *10.0.0.0/16*.  
   
    ```powershell
    $vnetName = "myVnet"
    $vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location `
        -AddressPrefix 10.0.0.0/16 -Subnet $singleSubnet
    ```    

## Create a public IP address and network interface

To enable communication with the virtual machine in the virtual network, you need a [public IP address](../../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

1. Create a public IP address. This example creates a public IP address named *myPip*. 
   
    ```powershell
    $ipName = "myPip"
    $pip = New-AzureRmPublicIpAddress -Name $ipName -ResourceGroupName $rgName -Location $location `
        -AllocationMethod Dynamic
    ```       
2. Create the NIC. This example creates a NIC named **myNic**. 
   
    ```powershell
    $nicName = "myNic"
    $nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $location `
        -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
    ```

## Create the network security group and an RDP rule

To be able to log in to your VM using RDP, you need to have a network security rule (NSG) that allows RDP access on port 3389. 

This example creates an NSG named *myNsg* that contains a rule called *myRdpRule* that allows RDP traffic over port 3389. For more information about NSGs, see [Opening ports to a VM in Azure using PowerShell](nsg-quickstart-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

```powershell
$nsgName = "myNsg"
$ruleName = "myRdpRule"
$rdpRule = New-AzureRmNetworkSecurityRuleConfig -Name $ruleName -Description "Allow RDP" `
    -Access Allow -Protocol Tcp -Direction Inbound -Priority 110 `
    -SourceAddressPrefix Internet -SourcePortRange * `
    -DestinationAddressPrefix * -DestinationPortRange 3389

$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $rgName -Location $location `
    -Name $nsgName -SecurityRules $rdpRule
```


## Create a variable for the virtual network

Create a variable for the completed virtual network. 

```powershell
$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName $rgName -Name $vnetName

```

## Get the credentials for the VM

The following cmdlet will open a window where you will enter a new user name and password to use as the local administrator account for remotely accessing the VM. 

```powershell
$cred = Get-Credential
```

## Add the VM name and size to the VM configuration.

```powershell
$vm = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize
```

## Set the VM image as source image for the new VM

Set the source image using the ID of the managed VM image.

```powershell
$vm = Set-AzureRmVMSourceImage -VM $vm -Id $image.Id
```

## Set the OS configuration and add the NIC.

Enter the storage type (PremiumLRS or StandardLRS) and the size of the OS disk. This example sets the account type to *PremiumLRS*, the disk size to *128 GB* and disk caching to *ReadWrite*.

```powershell
$vm = Set-AzureRmVMOSDisk -VM $vm -DiskSizeInGB 128 `
-CreateOption FromImage -Caching ReadWrite

$vm = Set-AzureRmVMOperatingSystem -VM $vm -Windows -ComputerName $computerName `
-Credential $cred -ProvisionVMAgent -EnableAutoUpdate

$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

## Create the VM

Create the new VM using the configuration stored in the **$vm** variable.

```powershell
New-AzureRmVM -VM $vm -ResourceGroupName $rgName -Location $location
```

## Verify that the VM was created
When complete, you should see the newly created VM in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

```powershell
    $vmList = Get-AzureRmVM -ResourceGroupName $rgName
    $vmList.Name
```

## Next steps

To sign in to your new virtual machine, browse to the VM in the [portal](https://portal.azure.com), click **Connect**, and open the Remote Desktop RDP file. Use the account credentials of your original virtual machine to sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

