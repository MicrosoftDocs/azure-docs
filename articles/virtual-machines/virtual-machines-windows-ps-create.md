---
title: Create an Azure VM using PowerShell | Microsoft Docs
description: Use Azure PowerShell and Azure Resource Manager to easily create a VM running Windows Server.
services: virtual-machines-windows
documentationcenter: ''
author: davidmu1
manager: timlt
editor: ''
tags: azure-resource-manager
ms.assetid: 14fe9ca9-e228-4d3b-a5d8-3101e9478f6e
ms.service: virtual-machines-windows
ms.topic: get-started-article
ms.date: 02/14/2017
ms.author: davidmu
---

# Create a Windows VM using Resource Manager and PowerShell

This article shows you how to quickly create an Azure Virtual Machine running Windows Server and the resources it needs using [Resource Manager](../azure-resource-manager/resource-group-overview.md) and PowerShell. 
All the steps in this article are required to create a virtual machine and it should take about 30 minutes to do the steps. Replace example parameter values in the commands with names that make sense for your environment.

## Step 1: Install Azure PowerShell

See [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

## Step 2: Create a resource group

All resources must be contained in a resource group, so lets create that first.  

1. Get a list of available locations where resources can be created.
   
    ```powershell
    Get-AzureRmLocation | sort Location | Select Location
    ```

2. Set the location for the resources. This command sets the location to **centralus**.
   
    ```powershell
    $location = "centralus"
    ```

3. Create a resource group. This command creates the resource group named **myResourceGroup** in the location that you set.
   
    ```powershell
    $myResourceGroup = "myResourceGroup"
    New-AzureRmResourceGroup -Name $myResourceGroup -Location $location
    ```

## Step 3: (Optional) Create a storage account

You currently have a choice when creating a virtual machine of using [Azure Managed Disks](../storage/storage-managed-disks-overview.md) or unmanaged disks. If you choose to use an unmanaged disk, you must create a [storage account](../storage/storage-introduction.md) to store the virtual hard disk that is used by the virtual machine that you create. If you choose to use a managed disk, the storage account is not needed. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.

1. Test the storage account name for uniqueness. This command tests the name **myStorageAccount**.
   
    ```powershell
    $myStorageAccountName = "mystorageaccount"
    Get-AzureRmStorageAccountNameAvailability $myStorageAccountName
    ```
   
    If this command returns **True**, your proposed name is unique within Azure. 

2. Now, create the storage account.
   
    ```powershell    
    $myStorageAccount = New-AzureRmStorageAccount -ResourceGroupName $myResourceGroup `
        -Name $myStorageAccountName -SkuName "Standard_LRS" -Kind "Storage" -Location $location
    ```

## Step 4: Create a virtual network

All virtual machines are part of a [virtual network](../virtual-network/virtual-networks-overview.md).

1. Create a subnet for the virtual network. This command creates a subnet named **mySubnet** with an address prefix of 10.0.0.0/24.
   
    ```powershell
    $mySubnet = New-AzureRmVirtualNetworkSubnetConfig -Name "mySubnet" -AddressPrefix 10.0.0.0/24
    ```

2. Now, create the virtual network. This command creates a virtual network named **myVnet** using the subnet that you created and an address prefix of **10.0.0.0/16**.
   
    ```powershell
    $myVnet = New-AzureRmVirtualNetwork -Name "myVnet" -ResourceGroupName $myResourceGroup `
        -Location $location -AddressPrefix 10.0.0.0/16 -Subnet $mySubnet
    ```

## Step 5: Create a public IP address and network interface

To enable communication with the virtual machine in the virtual network, you need a [public IP address](../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

1. Create the public IP address. This command creates a public IP address named **myPublicIp** with an allocation method of **Dynamic**.
   
    ```powershell
    $myPublicIp = New-AzureRmPublicIpAddress -Name "myPublicIp" -ResourceGroupName $myResourceGroup `
        -Location $location -AllocationMethod Dynamic
    ```
2. Create the network interface. This command creates a network interface named **myNIC**.
   
    ```powershell
    $myNIC = New-AzureRmNetworkInterface -Name "myNIC" -ResourceGroupName $myResourceGroup `
        -Location $location -SubnetId $myVnet.Subnets[0].Id -PublicIpAddressId $myPublicIp.Id
    ```

## Step 6: Create a virtual machine

Now that you have all the pieces in place, it's time to create the virtual machine. You can create a virtual machine using a [Marketplace image](virtual-machines-windows-cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json), a [custom generalized (sysprepped) image](virtual-machines-windows-create-vm-generalized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json), or a [custom specialized (non-sysprepped) image](virtual-machines-windows-create-vm-specialized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). This example uses a Windows Server image from the Marketplace. 

1. Run this command to set the administrator account name and password for the virtual machine.

    ```powershell
    $cred = Get-Credential -Message "Type the name and password of the local administrator account."
    ```
   
    The password must be at 12-123 characters long and have at least one lower case character, one upper case character, one number, and one special character.

2. Create the configuration object for the virtual machine. This command creates a configuration object named **myVmConfig** that defines the name of the VM and the size of the VM.
   
    ```powershell
    $myVM = New-AzureRmVMConfig -VMName "myVM" -VMSize "Standard_DS1_v2"
    ```
   
    See [Sizes for virtual machines in Azure](virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for a list of available sizes for a virtual machine.

3. Configure operating system settings for the VM. This command sets the computer name, operating system type, and account credentials for the VM.
   
    ```powershell
    $myVM = Set-AzureRmVMOperatingSystem -VM $myVM -Windows -ComputerName "myVM" -Credential $cred `
        -ProvisionVMAgent -EnableAutoUpdate
    ```

4. Define the image to use to provision the VM. This command defines the Windows Server image to use for the VM. 

    ```powershell
    $myVM = Set-AzureRmVMSourceImage -VM $myVM -PublisherName "MicrosoftWindowsServer" `
        -Offer "WindowsServer" -Skus "2012-R2-Datacenter" -Version "latest"
    ```

5. Add the network interface that you created to the configuration.
   
    ```powershell
    $myVM = Add-AzureRmVMNetworkInterface -VM $myVM -Id $myNIC.Id
    ```

6. If you are using an unmanaged disk, run this command to define the name and location of the VM hard disk; otherwise, skip this step. The virtual hard disk file for an unmanaged disk is stored in a container. This command creates the disk in a container named **vhds/myOsDisk1.vhd** in the storage account that you created.
   
    ```powershell
    $blobPath = "vhds/myOsDisk1.vhd"
    $osDiskUri = $myStorageAccount.PrimaryEndpoints.Blob.ToString() + $blobPath
    ```

7. Add the operating system disk information to the VM configuration. This command creates a disk named **myOsDisk1**.
   
    If you are using a managed disk, run this command to set the operating system disk in the configuration:

    ```powershell
    $myVM = Set-AzureRmVMOSDisk -VM $myVM -Name "myOsDisk1" -StorageAccountType PremiumLRS -DiskSizeInGB 128 -CreateOption FromImage -Caching ReadWrite
    ```

    If you are using an unmanaged disk, run this command to set the operating system disk in the configuration:

    ```powershell
    $myVM = Set-AzureRmVMOSDisk -VM $myVM -Name "myOsDisk1" -VhdUri $osDiskUri -CreateOption fromImage
    ```

8. Finally, create the virtual machine.
   
    ```powershell
    New-AzureRmVM -ResourceGroupName $myResourceGroup -Location $location -VM $myVM
    ```

## Next Steps

* If there were issues with the deployment, a next step would be to look at [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/resource-manager-common-deployment-errors.md)
* Learn how to manage the virtual machine that you created by reviewing [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* Take advantage of using a template to create a virtual machine by using the information in [Create a Windows virtual machine with a Resource Manager template](virtual-machines-windows-ps-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

