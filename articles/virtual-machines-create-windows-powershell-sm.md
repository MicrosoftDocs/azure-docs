<properties 
	pageTitle="Create a Windows virtual machine with PowerShell and Azure Service Manager" 
	description="Use Azure PowerShell to quickly create a new Windows virtual machine." 
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

# Create a Windows virtual machine with PowerShell and Azure Service Manager

If you have already installed Azure PowerShell, you must have Azure PowerShell version 0.8.0 or later. You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

	Get-Module azure | format-table version

If you haven't done so already, use the instructions in [How to install and configure Azure PowerShell](install-configure-powershell.md) to install Azure PowerShell on your local computer. Then, open an Azure PowerShell command prompt.

First, you must login to Azure with this command.

	Add-AzureAccount

Specify the email address of your Azure account and its password in the Microsoft Azure sign-in dialog.

Next, if you have multiple Azure subscriptons, you need to set your Azure subscription. To see a list of your current subscriptions, run this command.

	Get-AzureSubscription | sort SubscriptionName | Select SubscriptionName

Now, replace everything within the quotes, including the < and > characters, with the correct subscription name and run these commands.

	$subscrName="<subscription name>"
	Select-AzureSubscription -SubscriptionName $subscrName –Current

Next, you need a storage account. You can display your current list of storage accounts with this command.

	Get-AzureStorageAccount | sort Label | Select Label

If you do not already have one, create a new storage account. You must pick a unique name that contains only lowercase letters and numbers. You can test for the uniqueness of the storage account name with this command.

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

Next, you need a cloud service. If you do not have an existing cloud service, you must create one. You must pick a unique name that contains only letters, numbers, and hyphens. The first and last character in the field must be a letter or number.

For example, you could name it TestCS-*UniqueSequence*, in which *UniqueSequence* is an abbreviation of your organization. For example, if your organization is named Tailspin Toys, you could name the cloud service TestCS-Tailspin.

You can test for the uniqueness of the name with the following Azure PowerShell command.

	Test-AzureName -Service <Proposed cloud service name>

If this command returns "False", your proposed name is unique. Create the cloud service with these commands.

	$csName="<cloud service name>"
	$locName="<Azure location>"
	New-AzureService -Service $csName -Location $locName

Next, copy the following set of PowerShell commands to a text editor, such as Notepad. 

	$vmName="<machine name>"
	$csName="<cloud service name>"
	$locName="<Azure location>"
	$vm=New-AzureVMConfig -Name $vmName -InstanceSize Medium -ImageName "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd"
	$cred=Get-Credential -Message "Type the name and password of the local administrator account."
	$vm | Add-AzureProvisioningConfig -Windows -AdminUsername $cred.GetNetworkCredential().Username -Password $cred.GetNetworkCredential().Password
	New-AzureVM –ServiceName $csName –Location $locName -VMs $vm

In your text editor, fill in the name of the virtual machine, the cloud service name, and the location. 

Finally, copy the command set to the clipboard and then right-click your open Azure PowerShell command prompt. This will issue the command set as a series of PowerShell commands, prompt you for the name and password of the local administrator account, and create your Azure virtual machine.
Here is an example of what running the command set looks like.

	PS C:\> $vmName="PSTest"
	PS C:\> $csName=" TestCS-Tailspin"
	PS C:\> $locName="West US"
	PS C:\> $vm=New-AzureVMConfig -Name $vmName -InstanceSize Medium -ImageName "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd"
	PS C:\> $cred=Get-Credential -Message "Type the name and password of the local administrator account."
	PS C:\> $vm | Add-AzureProvisioningConfig -Windows -AdminUsername $cred.GetNetworkCredential().Username -Password $cred.
	GetNetworkCredential().Password

	
	AvailabilitySetName               :
	ConfigurationSets                 : PSTest,Microsoft.WindowsAzure.Commands.ServiceManagement.Model.NetworkConfigurationSet}
	DataVirtualHardDisks              : {}
	Label                             : PSTest
	OSVirtualHardDisk                 : Microsoft.WindowsAzure.Commands.ServiceManagement.Model.OSVirtualHardDisk
	RoleName                          : PSTest
	RoleSize                          : Medium
	RoleType                          : PersistentVMRole
	WinRMCertificate                  :
	X509Certificates                  : {}
	NoExportPrivateKey                : False
	NoRDPEndpoint                     : False
	NoSSHEndpoint                     : False
	DefaultWinRmCertificateThumbprint :
	ProvisionGuestAgent               : True
	ResourceExtensionReferences       : {BGInfo}
	DataVirtualHardDisksToBeDeleted   :
	VMImageInput                      :
	
	PS C:\> New-AzureVM -ServiceName $csName -Location $locName -VMs $vm
	VERBOSE: 3:01:46 PM - Begin Operation: New-AzureVM - Create Deployment with VM PSTest
	VERBOSE: 3:02:49 PM - Completed Operation: New-AzureVM - Create Deployment with VM PSTest
	
	OperationDescription                    OperationId                            OperationStatus
	--------------------                    -----------                            --------------
	New-AzureVM                             8072cbd1-4abe-9278-9de2-8826b56e9221   Succeeded
	

## Additional Resources

[Create a Windows virtual machine with Azure Resource Manager and PowerShell](virtual-machines-create-windows-powershell-rm.md)

[Create a Windows virtual machine with a Resource Manager template and PowerShell](virtual-machines-create-windows-powershell-rm-template-simple.md)

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

[How to install and configure Azure PowerShell](install-configure-powershell.md)

[Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md)

