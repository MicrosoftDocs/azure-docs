---
title: Create a copy of your Windows VM | Microsoft Docs
description: Learn how to create a copy of your specialized Azure VM running Windows, in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 3b7d3cd5-e3d7-4041-a2a7-0290447458ea
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 09/21/2016
ms.author: cynthn

---
# Create a VM from a specialized VHD
Create a new VM by attaching a specialized VHD as the OS disk using Powershell. A specialized VHD maintains the user accounts, applications and other state data from your original VM. 

If you want to create a VM from a generalized VHD, see [Create a VM from a generalized VHD image](virtual-machines-windows-create-vm-generalized.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Create the subNet and vNet
Create the vNet and subNet of the [virtual network](../virtual-network/virtual-networks-overview.md).

1. Create the subNet. This example creates a subnet named **mySubNet**, in the resource group **myResourceGroup**, and sets the subnet address prefix to **10.0.0.0/24**.
   
    ```powershell
    $rgName = "myResourceGroup"
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
To enable communication with the virtual machine in the virtual network, you need a [public IP address](../virtual-network/virtual-network-ip-addresses-overview-arm.md) and a network interface.

1. Create the public IP. In this example, the public IP address name is set to **myIP**.
   
    ```powershell
    $ipName = "myIP"
    $pip = New-AzureRmPublicIpAddress -Name $ipName -ResourceGroupName $rgName -Location $location `
        -AllocationMethod Dynamic
    ```       
2. Create the NIC. In this example, the NIC name is set to **myNicName**.
   
    ```powershell
    $nicName = "myNicName"
    $nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName -Location $location `
        -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
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

For more information about endpoints and NSG rules, see [Opening ports to a VM in Azure using PowerShell](virtual-machines-windows-nsg-quickstart-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Create the VM configuration
Set up the VM configuration to attach the copied VHD as the OS VHD.

```powershell
# Set the URI for the VHD that you want to use. In this example, the VHD file named "myOsDisk.vhd" is kept 
# in a storage account named "myStorageAccount" in a container named "myContainer".
$osDiskUri = "https://myStorageAccount.blob.core.windows.net/myContainer/myOsDisk.vhd"

# Set the VM name and size. This example sets the VM name to "myVM" and the VM size to "Standard_A2".
$vmName = "myVM"
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A2"

# Add the NIC
$vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id

# Add the OS disk by using the URL of the copied OS VHD. In this example, when the OS disk is created, the 
# term "osDisk" is appened to the VM name to create the OS disk name. This example also specifies that this 
# Windows-based VHD should be attached to the VM as the OS disk.
$osDiskName = $vmName + "osDisk"
$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption attach -Windows
```


If you have data disks that need to be attached to the VM, you should also add the following: 

```powershell
# Optional: Add data disks by using the URLs of the copied data VHDs at the appropriate Logical Unit 
# Number (Lun).
$dataDiskName = $vmName + "dataDisk"
$vm = Add-AzureRmVMDataDisk -VM $vm -Name $dataDiskName -VhdUri $dataDiskUri -Lun 0 -CreateOption attach
```

The data and operating system disk URLs look something like this: `https://StorageAccountName.blob.core.windows.net/BlobContainerName/DiskName.vhd`. You can find this on the portal by browsing to the target storage container, clicking the operating system or data VHD that was copied, and then copying the contents of the URL.

## Create the VM
Create the VM using the configurations that we just created.

```powershell
#Create the new VM
New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm
```

If this command was successful, you'll see output like this:

```powershell
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
To sign in to your new virtual machine, browse to the VM in the [portal](https://portal.azure.com), click **Connect**, and open the Remote Desktop RDP file. Use the account credentials of your original virtual machine to sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](virtual-machines-windows-connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

