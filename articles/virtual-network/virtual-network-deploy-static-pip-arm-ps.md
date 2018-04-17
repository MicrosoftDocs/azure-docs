---
title: Create a VM with a static public IP address - Azure PowerShell | Microsoft Docs
description: Learn how to create a VM with a static public IP address using PowerShell.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: ad975ab9-d69f-45c1-9e45-0d3f0f51e87e
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2016
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Create a VM with a static public IP address using PowerShell

> [!div class="op_single_selector"]
> * [Azure portal](virtual-network-deploy-static-pip-arm-portal.md)
> * [PowerShell](virtual-network-deploy-static-pip-arm-ps.md)
> * [Azure CLI](virtual-network-deploy-static-pip-arm-cli.md)
> * [PowerShell (Classic)](virtual-networks-reserved-public-ip.md)

[!INCLUDE [virtual-network-deploy-static-pip-intro-include.md](../../includes/virtual-network-deploy-static-pip-intro-include.md)]

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md). This article covers using the Resource Manager deployment model, which Microsoft recommends for most new deployments instead of the classic deployment model.

[!INCLUDE [virtual-network-deploy-static-pip-scenario-include.md](../../includes/virtual-network-deploy-static-pip-scenario-include.md)]

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Start your script
You can download the full PowerShell script used [here](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/03-Static-public-IP/virtual-network-deploy-static-pip-arm-ps.ps1). Follow the steps below to change the script to work in your environment.

Change the values of the variables below based on the values you want to use for your deployment. The following values map to the scenario used in this article:

```powershell
# Set variables resource group
$rgName                = "IaaSStory"
$location              = "West US"

# Set variables for VNet
$vnetName              = "WTestVNet"
$vnetPrefix            = "192.168.0.0/16"
$subnetName            = "FrontEnd"
$subnetPrefix          = "192.168.1.0/24"

# Set variables for storage
$stdStorageAccountName = "iaasstorystorage"

# Set variables for VM
$vmSize                = "Standard_A1"
$diskSize              = 127
$publisher             = "MicrosoftWindowsServer"
$offer                 = "WindowsServer"
$sku                   = "2012-R2-Datacenter"
$version               = "latest"
$vmName                = "WEB1"
$osDiskName            = "osdisk"
$nicName               = "NICWEB1"
$privateIPAddress      = "192.168.1.101"
$pipName               = "PIPWEB1"
$dnsName               = "iaasstoryws1"
```

## Create the necessary resources for your VM
Before creating a VM, you need a resource group, VNet, public IP, and NIC to be used by the VM.

1. Create a new resource group.

	```powershell
	New-AzureRmResourceGroup -Name $rgName -Location $location
	```

2. Create the VNet and subnet.

	```powershell
	$vnet = New-AzureRmVirtualNetwork -ResourceGroupName $rgName -Name $vnetName `
		-AddressPrefix $vnetPrefix -Location $location

	Add-AzureRmVirtualNetworkSubnetConfig -Name $subnetName `
		-VirtualNetwork $vnet -AddressPrefix $subnetPrefix

	Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
	```

3. Create the public IP resource. 

	```powershell
	$pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName `
		-AllocationMethod Static -DomainNameLabel $dnsName -Location $location
	```

4. Create the network interface (NIC) for the VM in the subnet created above, with the public IP. Notice the first cmdlet retrieving the VNet from Azure, this is necessary since a `Set-AzureRmVirtualNetwork` was executed to change the existing VNet.

	```powershell
	$vnet = Get-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName
	$subnet = Get-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name $subnetName
	$nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgName `
		-Subnet $subnet -Location $location -PrivateIpAddress $privateIPAddress `
		-PublicIpAddress $pip
	```

5. Create a storage account to host the VM OS drive.

	```powershell
	$stdStorageAccount = New-AzureRmStorageAccount -Name $stdStorageAccountName `
	-ResourceGroupName $rgName -Type Standard_LRS -Location $location
	```

## Create the VM
Now that all necessary resources are in place, you can create a new VM.

1. Create the configuration object for the VM.

	```powershell
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize
	```

2. Get credentials for the VM local administrator account.

	```powershell
	$cred = Get-Credential -Message "Type the name and password for the local administrator account."
	```

3. Create a VM configuration object.

	```powershell
	$vmConfig = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $vmName `
		-Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	```

4. Set the operating system image for the VM.

	```powershell
	$vmConfig = Set-AzureRmVMSourceImage -VM $vmConfig -PublisherName $publisher `
		-Offer $offer -Skus $sku -Version $version
	```

5. Configure the OS disk.

	```powershell
	$osVhdUri = $stdStorageAccount.PrimaryEndpoints.Blob.ToString() + "vhds/" + $osDiskName + ".vhd"
	$vmConfig = Set-AzureRmVMOSDisk -VM $vmConfig -Name $osDiskName -VhdUri $osVhdUri -CreateOption fromImage
	```

6. Add the NIC to the VM.

	```powershell
	$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id -Primary
	```

7. Create the VM.

	```powershell
	New-AzureRmVM -VM $vmConfig -ResourceGroupName $rgName -Location $location
	```

8. Save the script file.

## Run the script

After making any necessary changes, run the previous script. The virtual machine is created after a few minutes.

## Set IP addresses within the operating system

You should never manually assign the public IP address assigned to an Azure virtual machine within the virtual machine's operating system. It’s recommended that you do not statically assign the private IP assigned to the Azure virtual machine within the operating system of a VM, unless necessary, such as when [assigning multiple IP addresses to a Windows VM](virtual-network-multiple-ip-addresses-powershell.md). If you do manually set the private IP address within the operating system, ensure that it is the same address as the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings), or you can lose connectivity to the virtual machine. Learn more about [private IP address](virtual-network-network-interface-addresses.md#private) settings.

## Next steps

Any network traffic can flow to and from the VM created in this article. You can define inbound and outbound security rules within a network security group that limit the traffic that can flow to and from the network interface, the subnet, or both. To learn more about network security groups, see [Network security group overview](security-overview.md).