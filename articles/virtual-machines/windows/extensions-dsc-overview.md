---
title: Desired State Configuration for Azure overview | Microsoft Docs
description: Learn how to use the Microsoft Azure extension handler for PowerShell Desired State Configuration (DSC). The article includes prerequisites, architecture, and cmdlets.
services: virtual-machines-windows
documentationcenter: ''
author: mgreenegit
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: 'dsc'

ms.assetid: bbacbc93-1e7b-4611-a3ec-e3320641f9ba
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: na
ms.date: 02/02/2018
ms.author: migreene

---
# Introduction to the Azure Desired State Configuration extension handler

[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-both-include.md)]

The Azure VM Agent and associated extensions are part of Microsoft Azure infrastructure services. VM extensions are software components that extend VM functionality and simplify various VM management operations.

The primary use case for the Azure Desired State Configuration (DSC) extension is to bootstrap a VM to the [Azure Automation DSC service](../../automation/automation-dsc-overview.md). Bootstrapping a VM provides [benefits](https://docs.microsoft.com/en-us/powershell/dsc/metaconfig#pull-service) that include ongoing management of the VM configuration and integration with other operational tools, such as Azure Monitoring.

You can use the DSC extension independently of the Automation DSC service. However, this involves a singular action that occurs during deployment. No ongoing reporting or configuration management is available, other than locally in the VM.

This article provides information about both scenarios: using the DSC extension for Automation onboarding, and using the DSC extension as a tool for assigning configurations to VMs by using the Azure SDK.

## Prerequisites

- **Local machine**: To interact with the Azure VM extension, you must use either the Azure portal or the Azure PowerShell SDK.
- **Guest Agent**: The Azure VM that's configured by the DSC configuration must be an OS that supports Windows Management Framework (WMF) 4.0 or later. For the full list of supported OS versions, see the [DSC extension version history](https://blogs.msdn.microsoft.com/powershell/2014/11/20/release-history-for-the-azure-dsc-extension/).

## Terms and concepts

This guide assumes familiarity with the following concepts:

- **Configuration**: A DSC configuration document.
- **Node**: A target for a DSC configuration. In this document, *node* always refers to an Azure VM.
- **Configuration data**: A .psd1 file that has environmental data for a configuration.

## Architecture

The Azure DSC extension uses the Azure VM Agent framework to deliver, enact, and report on DSC configurations running on Azure VMs. The DSC extension accepts a configuration document and a set of parameters. If no file is provided, a [default configuration script](#default-configuration-script) is embedded with the extension. The default configuration script is used only to set metadata in [Local Configuration Manager](https://docs.microsoft.com/en-us/powershell/dsc/metaconfig).

When the extension is called for the first time, it installs a version of WMF by using the following logic:

* If the Azure VM OS is Windows Server 2016, no action is taken. Windows Server 2016 already has the latest version of PowerShell installed.
* If the **wmfVersion** property is specified, that version of WMF is installed, unless that version is incompatible with the VM's OS.
* If no **wmfVersion** property is specified, the latest applicable version of WMF is installed.

Installing WMF requires a restart. After restarting, the extension downloads the .zip file that's specified in the **modulesUrl** property, if provided. If this location is in Azure Blob storage, you can specify an SAS token in the **sasToken** property to access the file. After the .zip is downloaded and unpacked, the configuration function defined in **configurationFunction** runs to generate an .mof file. The extension then runs **Start-DscConfiguration -Force** by using the generated .mof file. The extension captures output and writes it to the Azure status channel.

### Default configuration script

The Azure DSC extension includes a default configuration script that's intended to be used when you onboard a VM to the Azure Automation DSC service. The script parameters are aligned with the configurable properties of [Local Configuration Manager](https://docs.microsoft.com/en-us/powershell/dsc/metaconfig). For script parameters, see [Default configuration script](extensions-dsc-template.md#default-configuration-script) in [Desired State Configuration extension with Azure Resource Manager templates](extensions-dsc-template.md). For the full script, see the [Azure quickstart template in GitHub](https://github.com/Azure/azure-quickstart-templates/blob/master/dsc-extension-azure-automation-pullserver/UpdateLCMforAAPull.zip?raw=true).

## DSC extension in Resource Manager templates

In most scenarios, Resource Manager deployment templates are the expected way to work with the DSC extension. For more information and for examples of how to include the DSC extension in Resource Manager deployment templates, see [Desired State Configuration extension with Azure Resource Manager templates](extensions-dsc-template.md).

## DSC extension PowerShell cmdlets

The PowerShell cmdlets that are used to manage the DSC extension are best used in interactive troubleshooting and information-gathering scenarios. You can use the cmdlets to package, publish, and monitor DSC extension deployments. Note that cmdlets for the DSC extension aren't yet updated to work with the [default configuration script](#default-configuration-script).

The **Publish-AzureRMVMDscConfiguration** cmdlet takes in a configuration file, scans it for dependent DSC resources, and then creates a .zip file. The .zip file contains the configuration and DSC resources that are needed to enact the configuration. The cmdlet can also create the package locally by using the *-OutputArchivePath* parameter. Otherwise, the cmdlet publishes the .zip file to blob storage, and then secures it with an SAS token.

The .ps1 configuration script that the cmdlet creates is in the .zip file at the root of the archive folder. The module folder is placed in the archive folder in resources.

The **Set-AzureRMVMDscExtension** cmdlet injects the settings that the PowerShell DSC extension requires into a VM configuration object.

The **Get-AzureRMVMDscExtension** cmdlet retrieves the DSC extension status of a specific VM.

The **Get-AzureRMVMDscExtensionStatus** cmdlet retrieves the status of the DSC configuration that's enacted by the DSC extension handler. This action can be performed on a single VM or on a group of VMs.

The **Remove-AzureRMVMDscExtension** cmdlet removes the extension handler from a specific VM. This cmdlet does *not* remove the configuration, uninstall WMF, or change the applied settings on the VM. It only removes the extension handler. 

Important information about Resource Manager DSC extension cmdlets:

- Azure Resource Manager cmdlets are synchronous.
- The *ResourceGroupName*, *VMName*, *ArchiveStorageAccountName*, *Version*, and *Location* parameters are all required.
- *ArchiveResourceGroupName* is an optional parameter. You can specify this parameter when your storage account belongs to a different resource group than the one where the VM is created.
- Use the **AutoUpdate** switch to automatically update the extension handler to the latest version when it's available. Note that this parameter has the potential to cause restarts on the VM when a new version of WMF is released.

### Get started with cmdlets

The Azure DSC extension can use DSC configuration documents to directly configure Azure VMs during deployment. This step doesn't register the node to Automation. The node is *not* centrally managed.

The following example shows a simple example of a configuration. Save the configuration locally as IisInstall.ps1.

```powershell
configuration IISInstall
{
    node "localhost"
    {
        WindowsFeature IIS
        {
            Ensure = "Present"
            Name = "Web-Server"
        }
    }
}
```

The following commands place the IisInstall.ps1 script on the specified VM. The commands also execute the configuration, and then report back on status.

```powershell
$resourceGroup = "dscVmDemo"
$location = "westus"
$vmName = "myVM"
$storageName = "demostorage"
#Publish the configuration script to user storage
Publish-AzureRmVMDscConfiguration -ConfigurationPath .\iisInstall.ps1 -ResourceGroupName $resourceGroup -StorageAccountName $storageName -force
#Set the VM to run the DSC configuration
Set-AzureRmVmDscExtension -Version 2.72 -ResourceGroupName $resourceGroup -VMName $vmName -ArchiveStorageAccountName $storageName -ArchiveBlobName iisInstall.ps1.zip -AutoUpdate:$true -ConfigurationName "IISInstall"
```

## Azure portal functionality

To set up DSC in the portal:

1. Go to a VM. 
2. Under **Settings** > **General**, select **Extensions**. 
3. In the new pane that's created, select **Add**, and then select **PowerShell DSC**.

The portal requires the following input:

* **Configuration Modules or Script**: This field is mandatory (the form has not been updated for the [default configuration script](#default-configuration-script)). Configuration modules and scripts require a .ps1 file that has a configuration script or a .zip file with a .ps1 configuration script at the root. If you use a .zip file, all dependent resources must be included in module folders in the .zip. You can create the .zip file by using the **Publish-AzureVMDscConfiguration -OutputArchivePath** cmdlet that's included in the Azure PowerShell SDK. The .zip file is uploaded to your user blob storage and secured by an SAS token.

* **Configuration Data PSD1 File**: This field is optional. If your configuration requires a configuration data file in .psd1, use this field to select the data field and upload it to your user blob storage. The configuration data file is secured by an SAS token in blob storage.

* **Module-Qualified Name of Configuration**: You can include multiple configuration functions in a .ps1 file. Enter the name of the configuration .ps1 script followed by  \\ and the name of the configuration function. For example, if your .ps1 script has the name configuration.ps1 and the configuration is **IisInstall**, enter **configuration.ps1\IisInstall**.

* **Configuration Arguments**:
If the configuration function takes arguments, enter them here in the format **argumentName1=value1,argumentName2=value2**. This format is a different format in which configuration arguments are accepted in PowerShell cmdlets or Resource Manager templates.

## Logs
Place logs in this location:

```powerShell
C:\WindowsAzure\Logs\Plugins\Microsoft.Powershell.DSC\<version number>
```

## Next steps
* For more information about PowerShell DSC, go to the [PowerShell documentation center](https://msdn.microsoft.com/powershell/dsc/overview). 
* Examine the [Resource Manager template for the DSC extension](extensions-dsc-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 
* For more functionality that you can manage by using PowerShell DSC, and for more DSC resources, browse the [PowerShell gallery](https://www.powershellgallery.com/packages?q=DscResource&x=0&y=0).
* For details about passing sensitive parameters into configurations, see [Manage credentials securely with the DSC extension handler](extensions-dsc-credentials.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

