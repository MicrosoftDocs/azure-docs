---
title: Create a Windows VM with multiple NICs | Microsoft Docs
description: Learn how to create a Windows VM with multiple NICs attached to it using Azure PowerShell or Resource Manager templates.
services: virtual-machines-windows
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''

ms.assetid: 9bff5b6d-79ac-476b-a68f-6f8754768413
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 03/14/2017
ms.author: iainfou

---
# Create a Windows VM with multiple NICs
You can create a virtual machine (VM) in Azure that has multiple virtual network interfaces (NICs) attached to it. A common scenario would be to have different subnets for front-end and back-end connectivity, or a network dedicated to a monitoring or backup solution. This article provides quick commands to create a VM with multiple NICs attached to it. For detailed information, including how to create multiple NICs within your own PowerShell scripts, read more about [deploying multi-NIC VMs](../../virtual-network/virtual-network-deploy-multinic-arm-ps.md). Different [VM sizes](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) support a varying number of NICs, so size your VM accordingly.

## Create core resources
Make sure that you have the [latest Azure PowerShell installed and configured](/powershell/azure/overview). Log in to your Azure account:

```powershell
Login-AzureRmAccount
```

In the following examples, replace example parameter names with your own values. Example parameter names included `myResourceGroup`, `mystorageaccount`, and `myVM`.

First, create a resource group. The following example creates a resource group named `myResourceGroup` in the `WestUs` location:

```powershell
New-AzureRmResourceGroup -Name "myResourceGroup" -Location "WestUS"
```

Create a storage account to hold your VMs. The following example creates a storage account named `mystorageaccount`:

```powershell
$storageAcc = New-AzureRmStorageAccount -ResourceGroupName "myResourceGroup" `
    -Location "WestUS" -Name "mystorageaccount" `
    -Kind "Storage" -SkuName "Premium_LRS" 
```

## Create virtual network and subnets
Define two virtual network subnets - one for front-end traffic and one for back-end traffic. The following example defines two subnets, named `mySubnetFrontEnd` and `mySubnetBackEnd`:

```powershell
$mySubnetFrontEnd = New-AzureRmVirtualNetworkSubnetConfig -Name "mySubnetFrontEnd" `
    -AddressPrefix "192.168.1.0/24"
$mySubnetBackEnd = New-AzureRmVirtualNetworkSubnetConfig -Name "mySubnetBackEnd" `
    -AddressPrefix "192.168.2.0/24"
```

Create your virtual network and subnets. The following example creates a virtual network named `myVnet`:

```powershell
$myVnet = New-AzureRmVirtualNetwork -ResourceGroupName "myResourceGroup" `
    -Location "WestUS" -Name "myVnet" -AddressPrefix "192.168.0.0/16" `
    -Subnet $mySubnetFrontEnd,$mySubnetBackEnd
```


## Create multiple NICs
Create two NICs, attaching one NIC to the front-end subnet and one NIC to the back-end subnet. The following example creates two NICs, named `myNic1` and `myNic2`:

```powershell
$frontEnd = $myVnet.Subnets|?{$_.Name -eq 'mySubnetFrontEnd'}
$myNic1 = New-AzureRmNetworkInterface -ResourceGroupName "myResourceGroup" `
    -Location "WestUS" -Name "myNic1" -SubnetId $frontEnd.Id

$backEnd = $myVnet.Subnets|?{$_.Name -eq 'mySubnetBackEnd'}
$myNic2 = New-AzureRmNetworkInterface -ResourceGroupName "myResourceGroup" `
    -Location "WestUS" -Name "myNic2" -SubnetId $backEnd.Id
```

Typically you also create a [network security group](../../virtual-network/virtual-networks-nsg.md) or [load balancer](../../load-balancer/load-balancer-overview.md) to help manage and distribute traffic across your VMs. The [more detailed multi-NIC VM](../../virtual-network/virtual-network-deploy-multinic-arm-ps.md) article guides you through creating a Network Security Group and assigning NICs.

## Create the virtual machine
Now start to build your VM configuration. Each VM size has a limit for the total number of NICs that you can add to a VM. Read more about [Windows VM sizes](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

First, set your VM credentials to the `$cred` variable as follows:

```powershell
$cred = Get-Credential
```

The following example defines a VM named `myVM` and uses a VM size that supports up to two NICs (`Standard_DS2_v2`):

```powershell
$vmConfig = New-AzureRmVMConfig -VMName "myVM" -VMSize "Standard_DS2_v2"
```

Create the rest of your VM config. The following example creates a Windows Server 2012 R2 VM:

```powershell
$vmConfig = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName "myVM" `
    -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
$vmConfig = Set-AzureRmVMSourceImage -VM $vmConfig -PublisherName "MicrosoftWindowsServer" `
    -Offer "WindowsServer" -Skus "2012-R2-Datacenter" -Version "latest"
```

Attach the two NICs you previously created:

```powershell
$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $myNic1.Id -Primary
$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $myNic2.Id
```

Configure the storage and virtual disk for your new VM:

```powershell
$blobPath = "vhds/WindowsVMosDisk.vhd"
$osDiskUri = $storageAcc.PrimaryEndpoints.Blob.ToString() + $blobPath
$diskName = "windowsvmosdisk"
$vmConfig = Set-AzureRmVMOSDisk -VM $vmConfig -Name $diskName -VhdUri $osDiskUri `
    -CreateOption "fromImage"
```

Finally, create a VM:

```powershell
New-AzureRmVM -VM $vmConfig -ResourceGroupName "myResourceGroup" -Location "WestUS"
```

## Add a NIC to an existing VM

It is now possible to add a NIC to an existing VM. To use this feature, you'll first need to deallocate the VM using the Stop-AzureRmVM cmdlet below.

```powershell
Stop-AzureRmVM -Name "myVM" -ResourceGroupName "myResourceGroup"
```

Next, get the existing configuration of the VM using the Get-AzureRmVM cmdlet

```powershell
$vm = Get-AzureRmVm -Name "myVM" -ResourceGroupName "myResourceGroup"
```

You can create a new NIC in the **same VNET as the VM** as shown at the beginning of this article or attach an existing NIC. We'll assume you're attaching an existing NIC `MyNic3` in the VNET. 

```powershell
$nicId = (Get-AzureRmNetworkInterface -ResourceGroupName "myResourceGroup" -Name "MyNic3").Id
Add-AzureRmVMNetworkInterface -VM $vm -Id $nicId -Primary | Update-AzureRmVm -ResourceGroupName "myResourceGroup"
```

> [!NOTE]
> One of the NICs on a multi-NIC VM needs to be Primary so we're setting the new NIC as primary. If your previous NIC on the VM is Primary, then you do not need to specify the -Primary switch. If you want to switch the Primary NIC on the VM, follow the steps below

```powershell
$vm = Get-AzureRmVm -Name "myVM" -ResourceGroupName "myResourceGroup"

# Find out all the NICs on the VM and find which one is Primary
$vm.NetworkProfile.NetworkInterfaces

# Set the NIC 0 to be primary
$vm.NetworkProfile.NetworkInterfaces[0].Primary = $true
$vm.NetworkProfile.NetworkInterfaces[1].Primary = $false

# Update the VM state in Azure
Update-AzureRmVM -VM $vm -ResourceGroupName "myResourceGroup"
```

## Remove a NIC from an existing VM

A NIC can also be removed from a VM. To use this feature, you'll first need to deallocate the VM using the Stop-AzureRmVM cmdlet below.

```powershell
Stop-AzureRmVM -Name "myVM" -ResourceGroupName "myResourceGroup"
```

Next, get the existing configuration of the VM using the Get-AzureRmVM cmdlet

```powershell
$vm = Get-AzureRmVm -Name "myVM" -ResourceGroupName "myResourceGroup"
```

Now view all the NICs on the VM and copy the name of the one you want to remove

```powershell
$vm.NetworkProfile.NetworkInterfaces

Remove-AzureRmNetworkInterface -Name "myNic3" -ResourceGroupName "myResourceGroup"
```

## Creating multiple NICs using Resource Manager templates
Azure Resource Manager templates use declarative JSON files to define your environment. You can read an [overview of Azure Resource Manager](../../azure-resource-manager/resource-group-overview.md). Resource Manager templates provide a way to create multiple instances of a resource during deployment, such as creating multiple NICs. You use *copy* to specify the number of instances to create:

```json
"copy": {
    "name": "multiplenics"
    "count": "[parameters('count')]"
}
```

Read more about [creating multiple instances using *copy*](../../resource-group-create-multiple.md). 

You can also use a `copyIndex()` to then append a number to a resource name, which allows you to create `myNic1`, `MyNic2`, etc. The following shows an example of appending the index value:

```json
"name": "[concat('myNic', copyIndex())]", 
```

You can read a complete example of [creating multiple NICs using Resource Manager templates](../../virtual-network/virtual-network-deploy-multinic-arm-template.md).

## Next steps
Make sure to review [Windows VM sizes](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) when trying to creating a VM with multiple NICs. Pay attention to the maximum number of NICs each VM size supports. 


