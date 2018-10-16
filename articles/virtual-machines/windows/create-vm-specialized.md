---
title: Create a Windows VM from a specialized VHD in Azure | Microsoft Docs
description: Create a new Windows VM by attaching a specialized managed disk as the OS disk by using the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 3b7d3cd5-e3d7-4041-a2a7-0290447458ea
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 10/10/2018
ms.author: cynthn

---
# Create a Windows VM from a specialized disk by using PowerShell

Create a new VM by attaching a specialized managed disk as the OS disk. A specialized disk is a copy of a virtual hard disk (VHD) from an existing VM that contains the user accounts, applications, and other state data from your original VM. 

When you use a specialized VHD to create a new VM, the new VM retains the computer name of the original VM. Other computer-specific information is also kept and, in some cases, this duplicate information could cause issues. When copying a VM, be aware of what types of computer-specific information your applications rely on.

You have several options:
* [Use an existing managed disk](#option-1-use-an-existing-disk). This option is useful if you have a VM that isn't working correctly. You can delete the VM and then reuse the managed disk to create a new VM. 
* [Upload a VHD](#option-2-upload-a-specialized-vhd) 
* [Copy an existing Azure VM by using snapshots](#option-3-copy-an-existing-azure-vm)

You can also use the Azure portal to [create a new VM from a specialized VHD](create-vm-specialized-portal.md).

This article shows you how to use managed disks. If you have a legacy deployment that requires using a storage account, see [Create a VM from a specialized VHD in a storage account](sa-create-vm-specialized.md).

## Before you begin
To use PowerShell, make sure that you have the latest version of the AzureRM.Compute PowerShell module. 

```powershell
Install-Module AzureRM -RequiredVersion 6.0.0
```
For more information, see [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview).

## Option 1: Use an existing disk

If you had a VM that you deleted and you want to reuse the OS disk to create a new VM, use [Get-AzureRmDisk](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermdisk?view=azurermps-6.8.1).

```powershell
$resourceGroupName = 'myResourceGroup'
$osDiskName = 'myOsDisk'
$osDisk = Get-AzureRmDisk `
-ResourceGroupName $resourceGroupName `
-DiskName $osDiskName
```
You can now attach this disk as the OS disk to a [new VM](#create-the-new-vm).

## Option 2: Upload a specialized VHD

You can upload the VHD from a specialized VM created with an on-premises virtualization tool, like Hyper-V, or a VM exported from another cloud.

### Prepare the VM
Use the VHD as-is to create a new VM. 
  
  * [Prepare a Windows VHD to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). **Do not** generalize the VM by using Sysprep.
  * Remove any guest virtualization tools and agents that are installed on the VM (such as VMware tools).
  * Make sure the VM is configured to get the IP address and DNS settings from DHCP. This ensures that the server obtains an IP address within the virtual network when it starts up. 


### Get the storage account
You'll need a storage account in Azure to store the uploaded VHD. You can either use an existing storage account or create a new one. 

Show the available storage accounts.

```powershell
Get-AzureRmStorageAccount
```

To use an existing storage account, proceed to the [Upload the VHD](#upload-the-vhd-to-your-storage-account) section.

Create a storage account.

1. You'll need the name of the resource group where the storage account will be created. Use Get-AzureRmResourceGroup see all the resource groups that are in your subscription.
   
    ```powershell
    Get-AzureRmResourceGroup
    ```

    Create a resource group named *myResourceGroup* in the *West US* region.

    ```powershell
    New-AzureRmResourceGroup `
	   -Name myResourceGroup `
	   -Location "West US"
    ```

2. Create a storage account named *mystorageaccount* in the new resource group by using the [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/new-azurermstorageaccount) cmdlet.
   
    ```powershell
    New-AzureRmStorageAccount `
	   -ResourceGroupName myResourceGroup `
	   -Name mystorageaccount `
	   -Location "West US" `
       -SkuName "Standard_LRS" `
	   -Kind "Storage"
    ```

### Upload the VHD to your storage account 
Use the [Add-AzureRmVhd](/powershell/module/azurerm.compute/add-azurermvhd) cmdlet to upload the VHD to a container in your storage account. This example uploads the file *myVHD.vhd* from "C:\Users\Public\Documents\Virtual hard disks\" to a storage account named *mystorageaccount* in the *myResourceGroup* resource group. The file is stored in the container named *mycontainer* and the new file name will be *myUploadedVHD.vhd*.

```powershell
$resourceGroupName = "myResourceGroup"
$urlOfUploadedVhd = "https://mystorageaccount.blob.core.windows.net/mycontainer/myUploadedVHD.vhd"
Add-AzureRmVhd -ResourceGroupName $resourceGroupName `
   -Destination $urlOfUploadedVhd `
   -LocalFilePath "C:\Users\Public\Documents\Virtual hard disks\myVHD.vhd"
```


If the commands are successful, you'll get a response that looks similar to this:

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

This command may take a while to complete, depending on your network connection and the size of your VHD file.

### Create a managed disk from the VHD

Create a managed disk from the specialized VHD in your storage account by using [New-AzureRMDisk](/powershell/module/azurerm.compute/new-azurermdisk). This example uses *myOSDisk1* for the disk name, puts the disk in *Standard_LRS* storage, and uses *https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd* as the URI for the source VHD.

Create a new resource group for the new VM.

```powershell
$destinationResourceGroup = 'myDestinationResourceGroup'
New-AzureRmResourceGroup -Location $location `
   -Name $destinationResourceGroup
```

Create the new OS disk from the uploaded VHD. 

```powershell
$sourceUri = (https://storageaccount.blob.core.windows.net/vhdcontainer/osdisk.vhd)
$osDiskName = 'myOsDisk'
$osDisk = New-AzureRmDisk -DiskName $osDiskName -Disk `
    (New-AzureRmDiskConfig -AccountType Standard_LRS  `
	-Location $location -CreateOption Import `
    -SourceUri $sourceUri) `
    -ResourceGroupName $destinationResourceGroup
```

## Option 3: Copy an existing Azure VM

You can create a copy of a VM that uses managed disks by taking a snapshot of the VM, and then by using that snapshot to create a new managed disk and a new VM.


### Take a snapshot of the OS disk

You can take a snapshot of an entire VM (including all disks) or of just a single disk. The following steps show you how to take a snapshot of just the OS disk of your VM with the [New-AzureRmSnapshot](/powershell/module/azurerm.compute/new-azurermsnapshot) cmdlet. 

First, set some parameters. 

 ```powershell
$resourceGroupName = 'myResourceGroup' 
$vmName = 'myVM'
$location = 'westus' 
$snapshotName = 'mySnapshot'  
```

Get the VM object.

```powershell
$vm = Get-AzureRmVM -Name $vmName `
   -ResourceGroupName $resourceGroupName
```
Get the OS disk name.

 ```powershell
$disk = Get-AzureRmDisk -ResourceGroupName $resourceGroupName `
   -DiskName $vm.StorageProfile.OsDisk.Name
```

Create the snapshot configuration. 

 ```powershell
$snapshotConfig =  New-AzureRmSnapshotConfig `
   -SourceUri $disk.Id `
   -OsType Windows `
   -CreateOption Copy `
   -Location $location 
```

Take the snapshot.

```powershell
$snapShot = New-AzureRmSnapshot `
   -Snapshot $snapshotConfig `
   -SnapshotName $snapshotName `
   -ResourceGroupName $resourceGroupName
```


To use this snapshot to create a VM that needs to be high-performing, add the parameter `-AccountType Premium_LRS` to the New-AzureRmSnapshot command. This parameter creates the snapshot so that it's stored as a Premium Managed Disk. Premium Managed Disks are more expensive than Standard, so be sure you'll need Premium before using this parameter.

### Create a new disk from the snapshot

Create a managed disk from the snapshot by using [New-AzureRMDisk](/powershell/module/azurerm.compute/new-azurermdisk). This example uses *myOSDisk* for the disk name.

Create a new resource group for the new VM.

```powershell
$destinationResourceGroup = 'myDestinationResourceGroup'
New-AzureRmResourceGroup -Location $location `
   -Name $destinationResourceGroup
```

Set the OS disk name. 

```powershell
$osDiskName = 'myOsDisk'
```

Create the managed disk.

```powershell
$osDisk = New-AzureRmDisk -DiskName $osDiskName -Disk `
    (New-AzureRmDiskConfig  -Location $location -CreateOption Copy `
	-SourceResourceId $snapshot.Id) `
    -ResourceGroupName $destinationResourceGroup
```


## Create the new VM 

Create networking and other VM resources to be used by the new VM.

### Create the subnet and virtual network

Create the [virtual network](../../virtual-network/virtual-networks-overview.md) and subnet for the VM.

1. Create the subnet. This example creates a subnet named *mySubNet*, in the resource group *myDestinationResourceGroup*, and sets the subnet address prefix to *10.0.0.0/24*.
   
    ```powershell
    $subnetName = 'mySubNet'
    $singleSubnet = New-AzureRmVirtualNetworkSubnetConfig `
       -Name $subnetName `
       -AddressPrefix 10.0.0.0/24
    ```
    
2. Create the virtual network. This example sets the virtual network name to *myVnetName*, the location to *West US*, and the address prefix for the virtual network to *10.0.0.0/16*. 
   
    ```powershell
    $vnetName = "myVnetName"
    $vnet = New-AzureRmVirtualNetwork `
       -Name $vnetName -ResourceGroupName $destinationResourceGroup `
       -Location $location `
       -AddressPrefix 10.0.0.0/16 `
       -Subnet $singleSubnet
    ```    
    

### Create the network security group and an RDP rule
To be able to sign in to your VM with remote desktop protocol (RDP), you'll need to have a security rule that allows RDP access on port 3389. In our example, the VHD for the new VM was created from an existing specialized VM, so you can use an account that existed on the source virtual machine for RDP.

This example sets the network security group (NSG) name to *myNsg* and the RDP rule name to *myRdpRule*.

```powershell
$nsgName = "myNsg"

$rdpRule = New-AzureRmNetworkSecurityRuleConfig -Name myRdpRule -Description "Allow RDP" `
    -Access Allow -Protocol Tcp -Direction Inbound -Priority 110 `
    -SourceAddressPrefix Internet -SourcePortRange * `
    -DestinationAddressPrefix * -DestinationPortRange 3389
$nsg = New-AzureRmNetworkSecurityGroup `
   -ResourceGroupName $destinationResourceGroup `
   -Location $location `
   -Name $nsgName -SecurityRules $rdpRule
	
```

For more information about endpoints and NSG rules, see [Opening ports to a VM in Azure by using PowerShell](nsg-quickstart-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

### Create a public IP address and NIC
To enable communication with the virtual machine in the virtual network, you'll need a [public IP address](../../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

1. Create the public IP. In this example, the public IP address name is set to *myIP*.
   
    ```powershell
    $ipName = "myIP"
    $pip = New-AzureRmPublicIpAddress `
       -Name $ipName -ResourceGroupName $destinationResourceGroup `
       -Location $location `
       -AllocationMethod Dynamic
    ```       
    
2. Create the NIC. In this example, the NIC name is set to *myNicName*.
   
    ```powershell
    $nicName = "myNicName"
    $nic = New-AzureRmNetworkInterface -Name $nicName `
       -ResourceGroupName $destinationResourceGroup `
       -Location $location -SubnetId $vnet.Subnets[0].Id `
       -PublicIpAddressId $pip.Id `
       -NetworkSecurityGroupId $nsg.Id
    ```
    


### Set the VM name and size

This example sets the VM name to *myVM* and the VM size to *Standard_A2*.

```powershell
$vmName = "myVM"
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A2"
```

### Add the NIC
	
```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id
```
	

### Add the OS disk 

Add the OS disk to the configuration by using [Set-AzureRmVMOSDisk](/powershell/module/azurerm.compute/set-azurermvmosdisk). This example sets the size of the disk to *128 GB* and attaches the managed disk as a *Windows* OS disk.
 
```powershell
$vm = Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $osDisk.Id -StorageAccountType Standard_LRS `
    -DiskSizeInGB 128 -CreateOption Attach -Windows
```

### Complete the VM 

Create the VM by using [New-AzureRMVM](/powershell/module/azurerm.compute/new-azurermvm) with the configurations that we just created.

```powershell
New-AzureRmVM -ResourceGroupName $destinationResourceGroup -Location $location -VM $vm
```

If this command is successful, you'll see output like this:

```powershell
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK OK   

```

### Verify that the VM was created
You should see the newly created VM either in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, or by using the following PowerShell commands.

```powershell
$vmList = Get-AzureRmVM -ResourceGroupName $destinationResourceGroup
$vmList.Name
```

## Next steps
Sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md).

