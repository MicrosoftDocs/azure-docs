<properties
	pageTitle="Manage Azure Resource Manager VMs | Microsoft Azure"
	description="Manage virtual machines using Azure Resource Manager, templates, and PowerShell."
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
	ms.date="09/10/2015"
	ms.author="davidmu"/>

# Manage virtual machines using Azure Resource Manager and PowerShell

> [AZURE.SELECTOR]
- [Portal](virtual-machines-windows-tutorial.md)
- [PowerShell](virtual-machines-deploy-rmtemplates-powershell.md)

Using Azure PowerShell and Resource Manager templates provides you with a lot of power and flexibility when managing resources in Microsoft Azure. You can use the tasks in this article to create and manage virtual machine resources.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers managing resources with the Resource Manager deployment model. You can also manage resources with the [classic deployment model](virtual-machines-windows-tutorial-classic-portal.md).

These tasks use a Resource Manager template and PowerShell:

- [Create a virtual machine](#windowsvm)
- [Create a virtual machine with a specialized disk](#customvm)
- [Create a multiple virtual machines in a virtual network with an external load balancer](#multivm)

These tasks use only PowerShell:

- [Remove a resource group](#removerg)
- [Display information about a virtual machine](#displayvm)
- [Start a virtual machine](#start)
- [Stop a virtual machine](#stop)
- [Restart a virtual machine](#restart)
- [Delete a virtual machine](#delete)

Before you get started, make sure you have Azure PowerShell ready to go.

[AZURE.INCLUDE [arm-getting-setup-powershell](../../includes/arm-getting-setup-powershell.md)]



## Azure Resource Manager templates and resource groups

Some of the tasks in this article show you how to use Azure Resource Manager templates and PowerShell to automatically deploy and manage Azure virtual machines.

Most applications running in Microsoft Azure are built from a combination of different cloud resource types, such as one or more virtual machines and storage accounts, a SQL database, or a virtual network. Azure Resource Manager templates make it possible for you to manage these different resources together by using a JSON description of the resources and associated configuration and deployment parameters.

After you define a JSON-based resource template, you can use it with a PowerShell command to deploy the defined resources in Azure. You can run these commands either separately in the PowerShell command shell, or you can integrate them with a script that contains additional automation logic.

The resources you create using Azure Resource Manager templates are deployed to either a new or existing *Azure resource group*. A resource group allows you to manage multiple deployed resources together as a logical group; this means that you to manage the overall lifecycle of the group/application.

If you're interested in authoring templates, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).

### Create a resource group

For tasks that create a resource, you'll need a resource group if you don't already have one.

In the following command, replace *resource group name* with the name of the new resource group and *Azure location* with the Azure datacenter location where you want the resource to be located, and then run it:

	New-AzureResourceGroup -Name "resource group name" -Location "Azure location"

## <a id="windowsvm"></a>TASK: Create a virtual machine

This task uses a template from the template gallery. To learn more about the template, see [Deploy a simple Windows VM in West US](https://azure.microsoft.com/documentation/templates/101-simple-windows-vm/).

![](./media/virtual-machines-deploy-rmtemplates-powershell/windowsvm.png)

In the following command, replace *deployment name* with the name that you want to use for the deployment and *resource group name* with the name of the existing resource group, and then run it:

	New-AzureResourceGroupDeployment -Name "deployment name" -ResourceGroupName "resource group name" -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-simple-windows-vm/azuredeploy.json"

Here's an example:

	New-AzureResourceGroupDeployment -Name "TestDeployment" -ResourceGroupName "TestRG" -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-simple-windows-vm/azuredeploy.json"

You're prompted to supply the values of parameters in the **parameters** section of the JSON file:

	cmdlet New-AzureResourceGroupDeployment at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	newStorageAccountName: saacct
	adminUsername: WinAdmin1
	adminPassword: *********
	dnsNameForPublicIP: contoso

It returns something like this:

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
	                    newStorageAccountName  String                     saacct
	                    adminUsername    String                     WinAdmin1
	                    adminPassword    SecureString
	                    dnsNameForPublicIP  String                     contoso9875
	                    windowsOSVersion  String                     2012-R2-Datacenter

	Outputs           :

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO deploy-a-windows-virtual-machine-with-azure-resource-manager-templates-and-powershell]

## <a id="customvm"></a>TASK: Create a virtual machine with a specialized disk

This task uses a template from the template gallery. To learn more about the template, see [Create a VM from a specialized VHD disk](https://azure.microsoft.com/documentation/templates/201-vm-from-specialized-vhd/).

In the following command, replace *deployment name* with the name that you want to use for the deployment and *resource group name* with the name of the existing resource group, and then run it:

	New-AzureResourceGroupDeployment -Name "deployment name" -ResourceGroupName "resource group name" -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-from-specialized-vhd/azuredeploy.json"

Here's an example:

	New-AzureResourceGroupDeployment -Name "TestDeployment" -ResourceGroupName "TestRG" -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-from-specialized-vhd/azuredeploy.json"

You're prompted to supply the values of parameters in the **parameters** section of the JSON file:

	cmdlet New-AzureResourceGroup at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	osDiskVhdUri: http://saacct.blob.core.windows.net/vhds/osdiskforwindows.vhd
	osType: windows
	location: West US
	vmSize: Standard_A3
	...

> [AZURE.NOTE] The example shown above uses a vhd file that exists in the saacct storage account. The name of the disk was provided as a parameter to the template.

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO create-a-custom-virtual-machine-image-in-azure-resource-manager-with-powershell]

## <a id="multivm"></a>TASK: Create a multiple virtual machines in a virtual network with an external load balancer

This task uses a template from the template gallery. To learn more about the template, see [Create a VM from a specialized VHD disk](https://azure.microsoft.com/documentation/templates/201-2-vms-loadbalancer-lbrules/).

![](./media/virtual-machines-deploy-rmtemplates-powershell/multivmextlb.png)

In the following command, replace *deployment name* with the name that you want to use for the deployment and *resource group name* with the name of the existing resource group, and then run it:

	New-AzureResourceGroupDeployment -Name "deployment name" -ResourceGroupName "resource group name" -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-loadbalancer-lbrules/azuredeploy.json"

You're prompted to supply the values of parameters in the **parameters** section of the JSON file:

	cmdlet New-AzureResourceGroup at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	newStorageAccountName: saTest
	adminUserName: WebAdmin1
	adminPassword: *******
	dnsNameforLBIP: web07
	backendPort: 80
	vmNamePrefix: WEBFARM
	...

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO deploy-multi-vm-app-with-a-virtual-network-and-load-balancer-in-azure-resource-manager]

## <a id="removerg"></a>TASK: Remove a resource group

In the following command, replace *resource group name* with the name of the resource group that you want to remove, and then run it:

	Remove-AzureResourceGroup  -Name "resource group name"

> [AZURE.NOTE] You can use the **-Force** parameter to skip the confirmation prompt.

You're asked for confirmation if you didn't use the -Force parameter:

	Confirm
	Are you sure you want to remove resource group 'BuildRG'
	[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO removing-a-resource-group-in-azure]

## <a id="displayvm"></a>TASK: Display information about a virtual machine

In the following command, replace *resource group name* with the name of the resource group that contains the virtual machine and *VM name* with the name of the machine, and then run it:

	Get-AzureVM -ResourceGroupName "resource group name" -Name "VM name"

It returns something like this:

	AvailabilitySetReference : null
	Extensions               : []
	HardwareProfile          : {
	                             "VirtualMachineSize": "Standard_D1"
	                           }
	Id                       : /subscriptions/{subscription-id}/resourceGroups/BuildRG/providers/Microso
	                           ft.Compute/virtualMachines/MyWindowsVM
	InstanceView             : null
	Location                 : westus
	Name                     : MyWindowsVM
	NetworkProfile           : {
	                             "NetworkInterfaces": [
	                               {
	                                 "Primary": null,
	                                 "ReferenceUri": "/subscriptions/{subscription-id}/resourceGroups/Bu
	                           ildRG/providers/Microsoft.Network/networkInterfaces/myVMNic"
	                               }
	                             ]
	                           }
	OSProfile                : {
	                             "AdminPassword": null,
	                             "AdminUsername": "WinAdmin1",
	                             "ComputerName": "MyWindowsVM",
	                             "CustomData": null,
	                             "LinuxConfiguration": null,
	                             "Secrets": [],
	                             "WindowsConfiguration": {
	                               "AdditionalUnattendContents": [],
	                               "EnableAutomaticUpdates": true,
	                               "ProvisionVMAgent": true,
	                               "TimeZone": null,
	                               "WinRMConfiguration": null
	                             }
	                           }
	Plan                     : null
	ProvisioningState        : Succeeded
	StorageProfile           : {
	                             "DataDisks": [],
	                             "ImageReference": {
	                               "Offer": "WindowsServer",
	                               "Publisher": "MicrosoftWindowsServer",
	                               "Sku": "2012-R2-Datacenter",
	                               "Version": "latest"
	                             },
	                             "OSDisk": {
	                               "OperatingSystemType": "Windows",
	                               "Caching": "ReadWrite",
	                               "CreateOption": "FromImage",
	                               "Name": "osdisk",
	                               "SourceImage": null,
	                               "VirtualHardDisk": {
	                                 "Uri": "http://saacct.blob.core.windows.net/vhds/osdiskforwindowssimple.vhd"
	                               }
	                             },
	                             "SourceImage": null
	                           }
	Tags                     : {}
	Type                     : Microsoft.Compute/virtualMachines

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO displaying-information-about-a-virtual-machine-in-microsoft-azure-with-powershell]

## <a id="start"></a>TASK: Start a virtual machine

In the following command, replace *resource group name* with the name of the resource group that contains the virtual machine and *VM name* with the name of the machine, and then run it:

	Start-AzureVM -ResourceGroupName "resource group name" -Name "VM name"

It returns something like this:

	EndTime             : 4/28/2015 11:11:41 AM -07:00
	Error               :
	Output              :
	StartTime           : 4/28/2015 11:10:35 AM -07:00
	Status              : Succeeded
	TrackingOperationId : e1705973-d266-467e-8655-920016145347
	RequestId           : aac41de1-b85d-4429-9a3d-040b922d2e6d
	StatusCode          : OK

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO start-stop-restart-and-delete-vms-in-microsoft-azure-with-powershell]

## <a id="stop"></a>TASK: Stop a virtual machine

In the following command, replace *resource group name* with the name of the resource group that contains the virtual machine and *VM name* with the name of the machine, and then run it:

	Stop-AzureVM -ResourceGroupName "resource group name" -Name "VM name"

You're asked for confirmation:

	Virtual machine stopping operation
	This cmdlet will stop the specified virtual machine. Do you want to continue?
	[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):

It returns something like this:

	EndTime             : 4/28/2015 11:09:08 AM -07:00
	Error               :
	Output              :
	StartTime           : 4/28/2015 11:06:55 AM -07:00
	Status              : Succeeded
	TrackingOperationId : 0c94dc74-c553-412c-a187-108bdb29657e
	RequestId           : 5cc9ddba-0643-4b5e-82b6-287b321394ee
	StatusCode          : OK

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO start-stop-restart-and-delete-vms-in-microsoft-azure-with-powershell]

## <a id="restart"></a>TASK: Restart a virtual machine

In the following command, replace *resource group name* with the name of the resource group that contains the virtual machine and *VM name* with the name of the machine, and then run it:

	Restart-AzureVM -ResourceGroupName "resource group name" -Name "VM name"

It returns something like this:

	EndTime             : 4/28/2015 11:16:26 AM -07:00
	Error               :
	Output              :
	StartTime           : 4/28/2015 11:16:25 AM -07:00
	Status              : Succeeded
	TrackingOperationId : 390571e0-c804-43ce-88c5-f98e0feb588e
	RequestId           : 7dac33e3-0164-4a08-be33-96205284cb0b
	StatusCode          : OK

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO start-stop-restart-and-delete-vms-in-microsoft-azure-with-powershell]

## <a id="delete"></a>TASK: Delete a virtual machine

In the following command, replace *resource group name* with the name of the resource group that contains the virtual machine and *VM name* with the name of the machine, and then run it:  

	Remove-AzureVM -ResourceGroupName "resource group name" –Name "VM name"

> [AZURE.NOTE] You can use the **-Force** parameter to skip the confirmation prompt.

You're asked for confirmation if you didn't use the -Force parameter:

	Virtual machine removal operation
	This cmdlet will remove the specified virtual machine. Do you want to continue?
	[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):

It returns something like this:

	EndTime             : 4/28/2015 11:21:55 AM -07:00
	Error               :
	Output              :
	StartTime           : 4/28/2015 11:20:13 AM -07:00
	Status              : Succeeded
	TrackingOperationId : f74fad9e-f6bc-46ae-82b1-bfad3952aa44
	RequestId           : 6a30d2e0-63ca-43cf-975b-058631e048e7
	StatusCode          : OK

If you would like to see a video of this task being done, take a look at this:

[AZURE.VIDEO start-stop-restart-and-delete-vms-in-microsoft-azure-with-powershell]

## Additional resources
[Azure Quickstart Templates](http://azure.microsoft.com/documentation/templates/) and [App Frameworks](virtual-machines-app-frameworks.md)

[Azure compute, network and storage providers under Azure Resource Manager](virtual-machines-azurerm-versus-azuresm.md)

[Azure Resource Manager overview](resource-group-overview.md)

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)
