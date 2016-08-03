<properties
   pageTitle="Configure multiple NICs on a Windows VM | Microsoft Azure"
   description="Learn how to create a VM with multiple NICs attached to it using Azure PowerShell or Resource Manager templates."
   services="virtual-machines-windows"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure"
   ms.date="08/03/2016"
   ms.author="iainfou"/>

# Creating a VM with multiple NICs
You can create a virtual machine (VM) in Azure that has multiple virtual network interfaces (NICs) attached to it. A common scenario would be to have different subnets for front-end and back-end connectivity, or a network dedicated to a monitoring or backup solution. This article provides quick commands to create a VM with multiple NICs attached to it. For detailed information, including how to create multiple NICs within your own PowerShell scripts, read more about [deploying multi-NIC VMs](../virtual-network/virtual-network-deploy-multinic-arm-ps.md).

>[AZURE.WARNING] You must attach multiple NICs when you create a VM - you cannot add NICs to an existing VM.

## Quick commands
Make sure that you have the [Azure CLI](../xplat-cli-install.md) logged in and using Resource Manager mode (`azure config mode arm`).

First, create a resource group:

```powershell
New-AzureRmResourceGroup -Name TestRG -Location WestUS
```

Create a storage account to hold your VMs:

```powershell
New-AzureRmStorageAccount -Name teststorage `
    -ResourceGroupName TestRG -King Storage -SkuName Premium_LRS -Location WestUS
```

Create a virtual network to connect your VMs to:

```powershell
New-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet `
    -AddressPrefix 192.168.0.0/16 -Location WestUS
```

Create two virtual network subnets - one for front-end traffic and one for back-end traffic:

```powershell
$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet
Add-AzureRmVirtualNetworkSubnetConfig -Name FrontEnd `
    -VirtualNetwork $vnet -AddressPrefix 192.168.1.0/24
Add-AzureRmVirtualNetworkSubnetConfig -Name BackEnd `
    -VirtualNetwork $vnet -AddressPrefix 192.168.2.0/24
```

Create two NICs, attaching one NIC to the front-end subnet and one NIC to the back-end subnet:

```powershell
$FrontEnd = $vnet.Subnets|?{$_.Name -eq 'FrontEnd'}
$NIC1 = New-AzureRmNetworkInterface -Name NIC1 -ResourceGroupName TestRG `
        -Location WestUS -SubnetId $FrontEnd

$BackEnd = $vnet.Subnets|?{$_.Name -eq 'BackEnd'}
$NIC2 = New-AzureRmNetworkInterface -Name NIC1 -ResourceGroupName TestRG `
        -Location WestUS -SubnetId $BackEnd
```

Finally create your VM, attaching the two NICs you previously created:

```powershell
$vmConfig = New-AzureRmVMConfig -VMName TestVM -VMSize $vmSize
$vmConfig = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName TestVM `
    -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
$vmConfig = Set-AzureRmVMSourceImage -VM $vmConfig -PublisherName $publisher -Offer $offer -Skus $sku -Version $version
$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $NIC1.Id -Primary
$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $NIC2.Id
$osDiskName = $vmName + "-" + $osDiskSuffix
$osVhdUri = $stdStorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $osDiskName + ".vhd"
$vmConfig = Set-AzureRmVMOSDisk -VM $vmConfig -Name $osDiskName -VhdUri $osVhdUri -CreateOption fromImage
New-AzureRmVM -VM $vmConfig -ResourceGroupName $backendRGName -Location $location
}
```

## Creating multiple NICs using Azure PowerShell


## Creating multiple NICs using Resource Manager templates
Azure Resource Manager templates use declarative JSON files to define your environment. You can read an [overview of Azure Resource Manager](../resource-group-overview.md). Resource Manager templates provide a way to create multiple instances of a resource during deployment, such as creating multiple NICs. You use *copy* to specify the number of instances to create:

```bash
"copy": {
    "name": "multiplenics"
    "count": "[parameters('count')]"
}
```

Read more about [creating multiple instances using *copy*](../resource-group-create-multiple.md). 

You can also use a `copyIndex()` to then append a number to a resource name, which allows you to create `NIC1`, `NIC2`, etc. The following shows an example of appending the index value:

```bash
"name": "[concat('NIC-', copyIndex())]", 
```

You can read a complete example of [creating multiple NICs using Resource Manager templates](../virtual-network/virtual-network-deploy-multinic-arm-template.md).

## Next steps
Make sure to review [Windows VM sizes](virtual-machines-windows-sizes.md) when trying to creating a VM with multiple NICs. Pay attention to the maximum number of NICs each VM size supports. 

Remember that you cannot add additional NICs to an existing VM, you must create all the NICs when you deploy the VM. Take care when planning your deployments to make sure that you have all the required network connectivity from the outset.