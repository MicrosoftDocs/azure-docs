<properties 
	pageTitle="Enable diagnostics in a Azure Virtual Machine running Windows using PowerShell| Microsoft Azure" 
	description="Learn how use PowerShell to enable diagnostics in a Azure Virtual Machine running Windows" 
	services="virtual-machines" 
	documentationCenter=""
	authors="sbtron"
	manager=""
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

You can enable the diagnostics extension while creating a windows virtual machines on the resource manager stack by adding the extension configuration to the resource manager template. See [Create a Windows Virtual machine with monitoring and diagnostics using Azure Resource Manager Template](virtual-machines-extensions-diagnostics-windows-template.md).

To enable the Azure Diagnostics extension on an existing virtual machine that was created using the resource manager stack you can use the [Set-AzureRMVMExtension](https://msdn.microsoft.com/library/mt603745.aspx) powershell cmdlet as shown below.


	$vm_resourcegroup = "myvmresourcegroup"
	$vm_name = "myvm"
	$diagnosticsconfig_path = "DiagnosticsPubConfig.xml"
	$diagnostics_storageresourcegroup = "myvmdiagnosticsresourcegroup"
	$diagnostics_storagename = "myvmdiagnostics"

	$xmlconfig = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((get-content $diagnosticsconfig_path)))
	$diagnostics_storagekey = (Get-AzureRmStorageAccountKey -ResourceGroupName $diagnostics_storageresourcegroup -Name $diagnostics_storagename).Key1
	
	$public_settings = @{"storageAccount"= $diagnostics_storagename ; "xmlCfg" = $xmlconfig}
	$protected_settings = @{"storageAccountName"= $diagnostics_storagename ; "storageAccountKey" = $diagnostics_storagekey ; "storageAccountEndPoint" = "http://core.windows.net"}
	
	Set-AzureRmVMExtension -ResourceGroupName $vm_resourcegroup -VMName $vm_name -Name "Microsoft.Insights.VMDiagnosticsSettings" -Publisher "Microsoft.Azure.Diagnostics" -ExtensionType "IaaSDiagnostics" -Settings $public_settings -ProtectedSettings $protected_settings -Location "West US" -TypeHandlerVersion "1.5" 


*$diagnosticsconfig_path* is the path to the file containing the diagnostics configuration in xml. This configuration should only include the elements under the **<WADCfg>** node as described in the [Diagnostics Configuration Schema](https://msdn.microsoft.com/library/azure/dn782207.aspx). Specifically make sure that this xml file does not include the *<StorageAccount>* element in the XML. The storage account will be specified separately as part of the *$public_settings* hashtable. 

The *Settings* parameter of the *Set-AzureRmExtension* cmdlet accepts an Hashtable with two values, the storage account name where diagnostics data will be stored and base64 encoded value of the public configuration xml.
   
The *ProtectedSettings* parameter of the *Set-AzureRmExtension* cmdlet accepts an Hashtable with the storage account name where diagnostics data will be stored along with the key and http endpoint for that storage account.

The Azure diagnostics extension is identified by the *Publisher* value of **Microsoft.Azure.Diagnostics** and *ExtensionType* of **IaaSDiagnostics**. 

The *Name* parameter can be set to any string used to identify the Azure diagnostics extension. Set it to the standard value of **Microsoft.Insights.VMDiagnosticsSettings** so that it can be easily identified by other tools like Visual Studio and the Azure Portal.

*Location* is a required parameter make sure you pass in the same location as that of the VM you want to enable the diagnostics extension on. 

The *TypeHandlerVersion* specified the version of the extension to use. Set it to latest available version of **1.5**.

Once the Azure diagnostics extension is enabled on a VM you can get the current settings using the [Get-AzureRMVmExtension](https://msdn.microsoft.com/en-us/library/mt603744.aspx) cmdlet and passing in the details for the extension used with the Set-AzureRmVMExtension cmdlet.  To remove the extension from the virtual machine use the [Remove-AzureRMVmExtension](https://msdn.microsoft.com/library/mt603782.aspx) cmdlet. 
  

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



## Next Steps
- For more details on creating windows virtual machines (classic), see [Create Windows virtual machines with Powershell and the classic deployment model](virtual-machines-ps-create-preconfigure-windows-vms.md)  
- For additional guidance on using Azure diagnostics and other techniques to troubleshoot problems, see [Enabling Diagnostics in Azure Cloud Services and Virtual Machines](cloud-services-dotnet-diagnostics.md).
- The [Diagnostics Configuration Schema](https://msdn.microsoft.com/library/azure/dn782207.aspx) explains the various xml configurations options for the diagnostics extension.
