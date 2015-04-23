<properties 
	pageTitle="Create a Windows virtual machine with PowerShell (RM version)" 
	description="Use the Resource Management mode of Azure PowerShell to easily create a new Windows virtual machine." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="josephd"/>

# Create a Windows virtual machine with PowerShell (RM version)

If you have already installed Azure PowerShell, you must have Azure PowerShell version 0.8.0 or later. You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

	Get-Module azure | format-table version

If you haven't done so already, use the instructions in [How to install and configure Azure PowerShell](install-configure-powershell.md) to install Azure PowerShell on your local computer. Then, open an Azure PowerShell command prompt.

First, you must login to Azure with this command.

	Add-AzureAccount

Specify the email address of your Azure account and its password in the Microsoft Azure sign-in dialog.

Next, you need to set your Azure subscription. To see a list of your current subscriptions, run this command.

	Get-AzureSubscription | sort SubscriptionName | Select SubscriptionName

Now, replace everything within the quotes, including the < and > characters, with the correct subscription name and run these commands.

	$subscrName="<subscription name>"
	Select-AzureSubscription -SubscriptionName $subscrName –Current

Next, you need a storage account. You can display your current list of storage accounts with this command.

	Get-AzureStorageAccount | sort Label | Select Label

If you do not already have one, create a new storage account. You must pick a unique name that contains only lowercase letters and numbers.

You can test for the uniqueness of the storage account name with this command.

	Test-AzureName -Storage <Proposed storage account name>

If this command returns "False", your proposed name is unique. 

You will need to specify the location of an Azure datacenter when creating a storage account. To get a list of Azure datacenters, run this command.

	Get-AzureLocation | sort Name | Select Name

Now, create and set the storage account with these commands. Fill in the names of the storage account and replace everything within the quotes, including the < and > characters.

	$stAccount="<chosen storage account name>"
	$locName="<Azure location>"
	New-AzureStorageAccount -StorageAccountName $stAccount -Location $locName
	Set-AzureStorageAccount -StorageAccountName $stAccount
	Set-AzureSubscription -SubscriptionName $subscrName -CurrentStorageAccountName $stAccount

Next, you need to switch the mode of Azure PowerShell to Resource Manager. Run this command.

	Switch-AzureMode AzureResourceManager

Next, you need a resource group. You can get a list of current resource groups with this command.

	Get-AzureResourceGroup | sort ResourceGroupName | Select ResourceGroupName

If you do not have an existing resource group, you must create one with these commands. 

	$rgName="<resource group name>"
	$locName="<Azure location>"
	New-AzureResourceGroup -Name $rgName -Location $locName

Next, create a new virtual network with a single subnet with these commands. 

	$vnetName=TestNet
	$singleSubnet=New-AzureVirtualNetworkSubnetConfig -Name singleSubnet -AddressPrefix 10.0.1.0/24
	New-AzurevirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $locName -AddressPrefix 10.0.0.0/16 -Subnet $singleSubnet

Next, copy the following set of PowerShell commands to a text editor, such as Notepad. 

	$vmName="<VM name>"
	$rgName="<resource group name>"
	$locName="<Azure location>"
	$vnetName=TestNet
	$subnetIndex=0
	Switch-AzureMode AzureResourceManager
	$vm=New-AzureVMConfig -VMName $vmName -VMSize "Standard_A1"
	$imageName="a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd"
	$cred=Get-Credential -Message "Type the name and password of the local administrator account." 
	Set-AzureVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred –ProvisionVMAgent
	New-AzureVM -VM $vm -ResourceGroupName $rgName -Location $locName

In your text editor, fill in the name of the virtual machine in <machine name>, the resource group name in  <cloud service name>, and the location in <Azure location>.
 
Finally, copy the command set to the clipboard and then right-click your open Azure PowerShell command prompt. This will issue the command set as a series of PowerShell commands, prompt you for the name and password of the local administrator account, and create your Azure virtual machine.
Here is an example of what running the command set looks like.

[add an example when its working]


## Additional Resources

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

[Azure virtual machines FAQ](http://msdn.microsoft.com/library/azure/dn683781.aspx)

[Overview of Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156143.aspx)

[How to install and configure Azure PowerShell](install-configure-powershell.md)

[Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md)

