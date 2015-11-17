<properties 
	pageTitle="Enable diagnostics in a Azure Virtual Machine running Windows using PowerShell| Microsoft Azure" 
	description="Learn how use PowerShell to enable diagnostics in a Azure Virtual Machine running Windows" 
	services="virtual-machines" 
	documentationCenter=""
	authors="sbtron"
	manager="timlt"
	editor="""/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/16/2015"
	ms.author="saurabh"/>


# Enable diagnostics in a Azure Virtual Machine running Windows using PowerShell

You can collect diagnostic data like application logs, performance counter etc. from a Azure Virtual machine running Windows using the Azure Diagnostics extension. This article describes how to enable the Azure Diagnostics extension for a Virtual Machine using PowerShell.  See [How to install and configure Azure PowerShell](powershell-install-configure.md) for the prerequisites needed for this article.

## Enable Azure Diagnostics extension on a virtual machine using resource manager stack
>AZURE.NOTE Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](resource-manager-deployment-model.md). This section covers using the classic deployment model which Microsoft recommends for most new deployments instead of the [classic deployment model](virtual-machine-windows-tutorial-classic-portal.md)

To enable the Azure Diagnostics extension on a virtual machine creating using the resource manager stack you need to use the generic extension cmdlet [Set-AzureRMVMExtension]()



## Enable Azure Diagnostics extension on a virtual machine (classic)
>AZURE.IMPORTANT Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](resource-manager-deployment-model.md). This section covers using the classic deployment model. Microsoft recommends that most new deployments use the [Resource Manager deployment model](virtual-machine-windows-tutorial.md). 

The [Set-AzureVMDiagnosticsExtension](https://msdn.microsoft.com/library/mt589189.aspx) cmdlet can be used to enable Azure Diagnostics extension on a virtual machine (classic). The following example shows how to create a new virtual machine (classic) with the Azure diagnostics extension enabled.

	$VM = New-AzureVMConfig -Name $VM -InstanceSize Small -ImageName $VMImage
	$VM = Add-AzureProvisioningConfig -VM $VM -AdminUsername $Username -Password $Password -Windows
	$VM = Set-AzureVMDiagnosticsExtension -DiagnosticsConfigurationPath $Config_Path -VM $VM -StorageContext $Storage_Context
	New-AzureVM -Location $Location -ServiceName $Service_Name -VM $VM

To enable Azure Diagnostics extension on an existing virtual machine (classic) first use [Get-AzureVM](https://msdn.microsoft.com/library/mt589152.aspx) cmdlet to get the virtual machine configuration. Then update the virtual machine configuration to include the Azure Diagnostics extension using the [Set-AzureVMDiagnosticsExtension](https://msdn.microsoft.com/library/mt589189.aspx) cmdlet. Finally apply the updated configuration to the virtual machine using [Update-AzureVM](https://msdn.microsoft.com/library/mt589121.aspx).

	$VM = Get-AzureVM -ServiceName $Service_Name -Name $VM_Name
	$VM_Update = Set-AzureVMDiagnosticsExtension -DiagnosticsConfigurationPath $Config_Path -VM $VM -StorageContext $Storage_Context
	Update-AzureVM -ServiceName $Service_Name -Name $VM_Name -VM $VM_Update.VM


 

This approach of good for continuous integration type of scenarios where the diagnostics extension can be enabled .You can enable the diagnostics extension as part of deploying the cloud service by passing in the *ExtensionConfiguration* parameter to the [New-AzureDeployment](https://msdn.microsoft.com/library/azure/mt589089.aspx) cmdlet. The *ExtensionConfiguration* parameter takes an array of diagnostics configurations that can be created using the [New-AzureServiceDiagnosticsExtensionConfig](https://msdn.microsoft.com/library/azure/mt589168.aspx) cmdlet. 

The following example shows how you can enable diagnostics for a cloud service with a WebRole and WorkerRole each having a different diagnostics configuration.

	$service_name = "MyService"
	$service_package = "CloudService.cspkg"
	$service_config = "ServiceConfiguration.Cloud.cscfg"
	$diagnostics_storagename = "myservicediagnostics"
	$webrole_diagconfigpath = "MyService.WebRole.PubConfig.xml" 
	$workerrole_diagconfigpath = "MyService.WorkerRole.PubConfig.xml"

	$primary_storagekey = (Get-AzureStorageKey -StorageAccountName "$diagnostics_storagename").Primary
	$storage_context = New-AzureStorageContext -StorageAccountName $diagnostics_storagename -StorageAccountKey $primary_storagekey

	$webrole_diagconfig = New-AzureServiceDiagnosticsExtensionConfig -Role "WebRole" -Storage_context $storageContext -DiagnosticsConfigurationPath $webrole_diagconfigpath
	$workerrole_diagconfig = New-AzureServiceDiagnosticsExtensionConfig -Role "WorkerRole" -StorageContext $storage_context -DiagnosticsConfigurationPath $workerrole_diagconfigpath
	  
	 
	New-AzureDeployment -ServiceName $service_name -Slot Production -Package $service_package -Configuration $service_config -ExtensionConfiguration @($webrole_diagconfig,$workerrole_diagconfig) 



## Enable diagnostics extension on an existing Cloud Service

You can use the [Set-AzureServiceDiagnosticsExtension](https://msdn.microsoft.com/library/azure/mt589140.aspx) cmdlet to enable diagnostics on a Cloud Service that is already running. 


	$service_name = "MyService"
	$diagnostics_storagename = "myservicediagnostics"
	$webrole_diagconfigpath = "MyService.WebRole.PubConfig.xml" 
	$workerrole_diagconfigpath = "MyService.WorkerRole.PubConfig.xml"
	$primary_storagekey = (Get-AzureStorageKey -StorageAccountName "$diagnostics_storagename").Primary
	$storage_context = New-AzureStorageContext -StorageAccountName $diagnostics_storagename -StorageAccountKey $primary_storagekey
 
	Set-AzureServiceDiagnosticsExtension -StorageContext $storage_context -DiagnosticsConfigurationPath $webrole_diagconfigpath -ServiceName $service_name -Slot Production -Role "WebRole" 
	Set-AzureServiceDiagnosticsExtension -StorageContext $storage_context -DiagnosticsConfigurationPath $workerrole_diagconfigpath -ServiceName $service_name -Slot Production -Role "WorkerRole"
 

## Get current diagnostics extension configuration
Use the [Get-AzureServiceDiagnosticsExtension](https://msdn.microsoft.com/library/azure/mt589204.aspx) cmdlet to get the current diagnostics configuration for a cloud service.
	
	Get-AzureServiceDiagnosticsExtension -ServiceName "MyService"

## Remove diagnostics extension
To turn off diagnostics on a cloud service you can use the [Remove-AzureServiceDiagnosticsExtension](https://msdn.microsoft.com/library/azure/mt589183.aspx) cmdlet.

	Remove-AzureServiceDiagnosticsExtension -ServiceName "MyService"

If you enabled the diagnostics extension using either *Set-AzureServiceDiagnosticsExtension* or the *New-AzureServiceDiagnosticsExtensionConfig* without the *Role* parameter then you can remove the extension using *Remove-AzureServiceDiagnosticsExtension* without the *Role* parameter. If the *Role* parameter was used when enabling the extension then it must also be used when removing the extension.

To remove the diagnostics extension from each individual role:

	Remove-AzureServiceDiagnosticsExtension -ServiceName "MyService" -Role "WebRole"


## Next Steps
- For more details on creating windows virtual machines (classic), see [Create Windows virtual machines with Powershell and the classic deployment model](virtual-machines-ps-create-preconfigure-windows-vms.md)
- For more details on creating windows virtual machines on the resource manager stack, see [Create a Windows Virtual machine with monitoring and diagnostics using Azure Resource Manager Template](virtual-machines-extensions-diagnostics-windows-template.md)  
- For additional guidance on using Azure diagnostics and other techniques to troubleshoot problems, see [Enabling Diagnostics in Azure Cloud Services and Virtual Machines](cloud-services-dotnet-diagnostics.md).
- The [Diagnostics Configuration Schema](https://msdn.microsoft.com/library/azure/dn782207.aspx) explains the various xml configurations options for the diagnostics extension.
