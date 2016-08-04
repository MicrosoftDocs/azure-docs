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
   ms.date="08/04/2016"
   ms.author="iainfou"/>

# Creating a VM with multiple NICs
You can create a virtual machine (VM) in Azure that has multiple virtual network interfaces (NICs) attached to it. A common scenario would be to have different subnets for front-end and back-end connectivity, or a network dedicated to a monitoring or backup solution. This article provides quick commands to create a VM with multiple NICs attached to it. For detailed information, including how to create multiple NICs within your own PowerShell scripts, read more about [deploying multi-NIC VMs](../virtual-network/virtual-network-deploy-multinic-arm-ps.md).

>[AZURE.WARNING] You must attach multiple NICs when you create a VM - you cannot add NICs to an existing VM.

## Creating multiple NICs using Azure PowerShell
Make sure that you have the [latest Azure PowerShell installed and configured](../powershell-install-configure.md).

First, create a resource group:

```powershell
New-AzureRmResourceGroup -Name TestRG -Location WestUS
```

Create a storage account to hold your VMs:

```powershell
$storageAcc = New-AzureRmStorageAccount -Name teststorageikf `
    -ResourceGroupName TestRG -Kind Storage -SkuName Premium_LRS -Location WestUS
```

Define two virtual network subnets - one for front-end traffic and one for back-end traffic. Create your virtual network with these subnets:

```powershell
$frontEndSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name "FrontEnd" -AddressPrefix 192.168.1.0/24
$backEndSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name "BackEnd" -AddressPrefix 192.168.2.0/24


$vnet = New-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet `
    -AddressPrefix 192.168.0.0/16 -Location WestUS `
    -Subnet $frontEndSubnet,$backEndSubnet
```

Create two NICs, attaching one NIC to the front-end subnet and one NIC to the back-end subnet:

```powershell
$frontEnd = $vnet.Subnets|?{$_.Name -eq 'FrontEnd'}
$NIC1 = New-AzureRmNetworkInterface -Name NIC1 -ResourceGroupName TestRG `
        -Location WestUS -SubnetId $FrontEnd.Id

$backEnd = $vnet.Subnets|?{$_.Name -eq 'BackEnd'}
$NIC2 = New-AzureRmNetworkInterface -Name NIC2 -ResourceGroupName TestRG `
        -Location WestUS -SubnetId $BackEnd.Id
```

Typically you would also create a [network security group](../virtual-network/virtual-networks-nsg.md) or [load balancer](../load-balancer/load-balancer-overview.md) to help manage and distribute traffic across your VMs. The [more detailed multi-NIC VM](../virtual-network/virtual-network-deploy-multinic-arm-ps.md) article guides you through creating a Network Security Group and assigning NICs.

Finally create your VM, attaching the two NICs you previously created. Take care when you select the VM size. There are limits for the total number of NICs that you can add to a VM. Read more about [Windows VM sizes](virtual-machines-windows-sizes.md). The following example uses a VM size that supports using multiple NICs (`Standard_DS2_v2`):

```powershell
$cred = Get-Credential

$vmConfig = New-AzureRmVMConfig -VMName TestVM -VMSize "Standard_DS2_v2"
$vmConfig = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName TestVM `
    -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
$vmConfig = Set-AzureRmVMSourceImage -VM $vmConfig -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $NIC1.Id -Primary
$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $NIC2.Id

$blobPath = "vhds/WindowsVMosDisk.vhd"
$osDiskUri = $storageAcc.PrimaryEndpoints.Blob.ToString() + $blobPath
$diskName = "windowsvmosdisk"
$vmConfig = Set-AzureRmVMOSDisk -VM $vmConfig -Name $diskName -VhdUri $osDiskUri -CreateOption fromImage

New-AzureRmVM -VM $vmConfig -ResourceGroupName TestRG -Location WestUS
```

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