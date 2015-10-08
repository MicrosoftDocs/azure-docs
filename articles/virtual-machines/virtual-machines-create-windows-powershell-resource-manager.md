<properties
	pageTitle="Create a Windows VM | Microsoft Azure"
	description="Use Azure PowerShell and Resource Manager templates to easily create a new Windows virtual machine."
	services="virtual-machines"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/08/2015"
	ms.author="davidmu"/>

# Create a Windows VM with Resource Manager and PowerShell

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers creating a resource with the Resource Manager deployment model. You can also create a resource with the [classic deployment model](virtual-machines-create-windows-powershell-service-manager.md).

This topic describes how to quickly create a Windows-based Azure virtual machine using Azure Resource Manager and PowerShell.

## Create the Windows virtual machine

If you have already installed Azure PowerShell, you must have Azure PowerShell version 1.0.0 or later. You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

	Get-Module azure | format-table version

If you haven't done so already or need to update the version of Azure PowerShell installed, use the instructions in [How to install and configure Azure PowerShell](install-configure-powershell.md) to install Azure PowerShell on your local computer. Then, open an Azure PowerShell command prompt.

First, you must logon to Azure with this command.

	Login-AzureRmAccount

Specify the email address of your Azure account and its password in the Microsoft Azure sign-in dialog.

Next, if you have multiple Azure subscriptions, you need to set your Azure subscription. To see a list of your current subscriptions, run this command.

	Get-AzureSubscription | sort SubscriptionName | Select SubscriptionName

Now, replace everything within the quotes, including the < and > characters, with the correct subscription name and run these commands.

	$subscrName="<subscription name>"
	Select-AzureSubscription -SubscriptionName $subscrName –Current

Next, you need to create a storage account. You must pick a unique name that contains only lowercase letters and numbers. You can test for the uniqueness of the storage account name with this command.

	Test-AzureName -Storage <Proposed storage account name>

If this command returns "False", your proposed name is unique.

You will need to specify the location of an Azure datacenter. To get a list of Azure datacenters, run this command.

	Get-AzureLocation | sort Name | Select Name

Now, copy the following block of PowerShell commands to a text editor. Fill in your chosen storage account and location, replacing everything within the quotes, including the < and > characters.

	$stName = "<chosen storage account name>"
	$locName = "<chosen Azure location name>"
	$rgName = "TestRG"
	New-AzureRmResourceGroup -Name $rgName -Location $locName
	$storageAcc = New-AzureRmStorageAccount -ResourceGroupName $rgName -Name $stName -Type "Standard_GRS" -Location $locName
	$singleSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name singleSubnet -AddressPrefix 10.0.0.0/24
	$vnet = New-AzureRmVirtualNetwork -Name TestNet -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $singleSubnet
	$pip = New-AzureRmPublicIpAddress -Name TestPIP -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
	$nic = New-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
	$cred = Get-Credential -Message "Type the name and password of the local administrator account."
	$vm = New-AzureRmVMConfig -VMName WindowsVM -VMSize "Standard_A1"
	$vm = Set-AzureRmVMOperatingSystem -VM $vm -Windows -ComputerName MyWindowsVM -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm = Set-AzureRmVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
	$osDiskUri = $storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/WindowsVMosDisk.vhd"
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name "windowsvmosdisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureRmVM -ResourceGroupName $rgName -Location $locName -VM $vm

Finally, copy the above command set to the clipboard and then right-click your open Azure PowerShell command prompt. This will issue the command set as a series of PowerShell commands, prompt you for the name and password of the local administrator account, and create your Azure virtual machine.

Here is an example of you might see:

	PS C:\> $stName="contosost"
	PS C:\> $locName="West US"
	PS C:\> $rgName="TestRG"
	PS C:\> New-AzureRmResourceGroup -Name $rgName -Location $locName
	VERBOSE: 12:45:15 PM - Created resource group 'TestRG' in location 'westus'


	ResourceGroupName : TestRG
	Location          : westus
	ProvisioningState : Succeeded
	Tags              :
	Permissions       :
	                    Actions  NotActions
	                    =======  ==========
	                    *

	ResourceId        : /subscriptions/fd92919d-eeca-4f5b-840a-e45c6770d92e/resourceGroups/TestRG


	PS C:\> $storageAcc=New-AzureRmStorageAccount -ResourceGroupName $rgName -Name $stName -Type "Standard_GRS" -Location $locName
	PS C:\> $singleSubnet=New-AzureRmVirtualNetworkSubnetConfig -Name singleSubnet -AddressPrefix 10.0.0.0/24
	PS C:\> $vnet=New-AzureRmVirtualNetwork -Name TestNet3 -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $singleSubnet
	PS C:\> $pip = New-AzureRmPublicIpAddress -Name TestNIC -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic
	PS C:\> $nic = New-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
	PS C:\> $cred = Get-Credential -Message "Type the name and password of the local administrator account."
	PS C:\> $vm = New-AzureRmVMConfig -VMName WindowsVM -VMSize "Standard_A1"
	PS C:\> $vm = Set-AzureRmVMOperatingSystem -VM $vm -Windows -ComputerName MyWindowsVM -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	PS C:\> $vm = Set-AzureRmVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	PS C:\> $vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
	PS C:\> $osDiskUri = $storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/MyWindowsVMosDisk.vhd"
	PS C:\> $vm = Set-AzureRmVMOSDisk -VM $vm -Name "windowsvmosdisk" -VhdUri $osDiskUri -CreateOption fromImage
	PS C:\> New-AzureRmVM -ResourceGroupName $rgName -Location $locName -VM $vm


	EndTime             : 4/28/2015 1:00:05 PM -07:00
	Error               :
	Output              :
	StartTime           : 4/28/2015 12:52:52 PM -07:00
	Status              : Succeeded
	TrackingOperationId : 45035a90-ea12-4e1e-87e7-2a5e9ed12c93
	RequestId           : 98c7b4fb-b26e-4a58-b17a-b0983d896aae
	StatusCode          : OK

## Additional Resources

[Azure Compute, Network and Storage Providers under Azure Resource Manager](virtual-machines-azurerm-versus-azuresm.md)

[Azure Resource Manager Overview](resource-group-overview.md)

[Create a Windows virtual machine with a Resource Manager template and PowerShell](virtual-machines-create-windows-powershell-resource-manager-template-simple.md)

[Create a Windows virtual machine with PowerShell and Azure Service Management](virtual-machines-create-windows-powershell-service-manager.md)

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

[How to install and configure Azure PowerShell](install-configure-powershell.md)
