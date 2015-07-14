<properties
	pageTitle="Create a Windows virtual machine with a Resource Manager template and PowerShell"
	description="Use a Resource Manager template and Azure PowerShell to create a new Windows virtual machine."
	services="virtual-machines"
	documentationCenter=""
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/09/2015"
	ms.author="josephd"/>

# Create Windows virtual machine with a Resource Manager template and Azure PowerShell

You can easily create a new Windows-based Azure virtual machine by using a Resource Manager template with Azure PowerShell. This template creates a single virtual machine running Windows in a new virtual network with a single subnet in a new resource group.

![](./media/virtual-machines-create-windows-powershell-resource-manager-template-simple/windowsvm.png)

Before you dive in, follow these instructions to make sure you have Azure, Windows PowerShell, and Azure PowerShell configured and ready to go:

[AZURE.INCLUDE [arm-getting-setup-powershell](../../includes/arm-getting-setup-powershell.md)]

## Create a Windows virtual machine

Follow these steps to create a Windows virtual machine by using a Resource Manager template in the Github template repository with Azure PowerShell.

Run the commands per the following example and provide your Azure deployment name, resource group name, and Azure datacenter location. Note that when you run the **New-AzureResourceGroupDeployment** command, you will be prompted to supply the values of parameters in the "parameters" section of the JSON file. When you have specified all the parameter values, the command creates the resource group and the virtual machine.

	$deployName="TestDeployment"
	$RGName="TestRG"
	$locname="West US"
	$templateURI="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-simple-windows-vm/azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateUri $templateURI

You will see something like this:

	cmdlet New-AzureResourceGroupDeployment at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	newStorageAccountName: newsaacct
	adminUsername: WinAdmin1
	adminPassword: *********
	dnsNameForPublicIP: contoso
	VERBOSE: 10:56:59 AM - Template is valid.
	VERBOSE: 10:56:59 AM - Create template deployment 'TestDeployment'.
	VERBOSE: 10:57:08 AM - Resource Microsoft.Network/virtualNetworks 'MyVNET' provisioning status is succeeded
	VERBOSE: 10:57:11 AM - Resource Microsoft.Network/publicIPAddresses 'myPublicIP' provisioning status is running
	VERBOSE: 10:57:11 AM - Resource Microsoft.Storage/storageAccounts 'newsaacct' provisioning status is running
	VERBOSE: 10:57:38 AM - Resource Microsoft.Storage/storageAccounts 'newsaacct' provisioning status is succeeded
	VERBOSE: 10:57:40 AM - Resource Microsoft.Network/publicIPAddresses 'myPublicIP' provisioning status is succeeded
	VERBOSE: 10:57:45 AM - Resource Microsoft.Compute/virtualMachines 'MyWindowsVM' provisioning status is running
	VERBOSE: 10:57:45 AM - Resource Microsoft.Network/networkInterfaces 'myVMNic' provisioning status is succeeded
	VERBOSE: 11:01:59 AM - Resource Microsoft.Compute/virtualMachines 'MyWindowsVM' provisioning status is succeeded


	DeploymentName    : TestDeployment
	ResourceGroupName : TestRG
	ProvisioningState : Succeeded
	Timestamp         : 4/28/2015 6:02:13 PM
	Mode              : Incremental
	TemplateLink      :
	Parameters        :
                    	Name             Type                       Value
	                    ===============  =========================  ==========
	                    newStorageAccountName  String                     newsaacct
	                    adminUsername    String                     WinAdmin1
	                    adminPassword    SecureString
	                    dnsNameForPublicIP  String                     contoso
	                    windowsOSVersion  String                     2012-R2-Datacenter

	Outputs           :

You now have a new Windows virtual machine named MyWindowsVM in your new resource group.

## Additional resources

[Azure Compute, Network, and Storage providers under Azure Resource Manager](virtual-machines-azurerm-versus-azuresm.md)

[Azure Resource Manager overview](../resource-group-overview.md)

[Create a Windows virtual machine with Azure Resource Manager and Azure PowerShell](virtual-machines-create-windows-powershell-resource-manager.md)

[Create a Windows virtual machine with Azure PowerShell and Azure Service Manager](virtual-machines-create-windows-powershell-service-manager.md)

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

[How to install and configure Azure PowerShell](../powershell-install-configure.md)
