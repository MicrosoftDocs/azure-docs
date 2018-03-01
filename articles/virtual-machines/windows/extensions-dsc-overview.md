---
title: Desired State Configuration for Azure Overview | Microsoft Docs
description: Overview for using the Microsoft Azure extension handler for PowerShell Desired State Configuration. Including prerequisites, architecture, cmdlets..
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

The Azure VM Agent and associated Extensions
are part of the Microsoft Azure Infrastructure Services.
VM Extensions are software components that extend the VM functionality
and simplify various VM management operations.

The primary use case for the Desired State Configuration Extension is
to bootstrap a VM to the
[Azure Automation DSC service](../../automation/automation-dsc-overview.md)
that provides
[benefits](https://docs.microsoft.com/en-us/powershell/dsc/metaconfig.md#pull-service)
including ongoing management of the VM configuration
and integration with other operational tools such as Azure Monitoring.

It is also possible to use the DSC Extension independently
from the Azure Automation DSC service,
however this is a singular action that occurs during deployment
and there is no ongoing reporting or management of the configuration
other than locally within the VM.

This article contains information for both scenarios,
DSC Extension for Azure Automation onboarding
and how to use the DSC Extension as a tool
for assigning configurations to virtual machines using the Azure SDK.

## Prerequisites

- **Local machine** - To interact with the Azure VM extension, you need to use either the Azure portal or the Azure PowerShell SDK.
- **Guest Agent** - The Azure VM that is configured by the DSC configuration needs to be an OS that supports Windows Management Framework (WMF) 4.0 or later. The full list of supported OS versions can be found at the page [DSC Extension Version History](https://blogs.msdn.microsoft.com/powershell/2014/11/20/release-history-for-the-azure-dsc-extension/).

## Terms and Concepts

This guide presumes familiarity with the following concepts:

- **Configuration** - A DSC configuration document.
- **Node** - A target for a DSC configuration. In this document, "node" always refers to an Azure VM.
- **Configuration Data** - A .psd1 file containing environmental data for a configuration.

## Architectural Overview

The Azure DSC extension uses the Azure VM Agent framework
to deliver, enact, and report on DSC configurations running on Azure VMs.
The DSC extension accepts a configuration document
and a set of parameters.
If no file is provided,
a [default configuration script](###default-configuration-script)
is embedded with the extension
that is used only for setting metadata in
[Local Configuration Manager](https://docs.microsoft.com/en-us/powershell/dsc/metaconfig).

When the extension is called for the first time,
it installs a version of the Windows Management Framework (WMF)
using the following logic:

1. If the Azure VM OS is Windows Server 2016, no action is taken. Windows Server 2016 already has the latest version of PowerShell installed.
2. If the `wmfVersion` property is specified, that version of the WMF is installed unless it is incompatible with the VM's OS.
3. If no `wmfVersion` property is specified, the latest applicable version of the WMF is installed.

Installation of the WMF requires a reboot.
After reboot, the extension downloads the .zip file specified
in the `modulesUrl` property if provided.
If this location is in Azure blob storage, a SAS token can be specified
in the `sasToken` property to access the file.
After the .zip is downloaded and unpacked,
the configuration function defined in `configurationFunction` is run
to generate a MOF file.
The extension then runs `Start-DscConfiguration -Force`
using the generated MOF file.
The extension captures output and writes it to the Azure Status Channel.

### Default Configuration Script

The Azure DSC Extension includes a default configuration script
intended to be used when onboarding a VM to Azure Automation DSC service.
The script parameters are aligned with the configurable properties
of [Local Configuration Manager](https://docs.microsoft.com/en-us/powershell/dsc/metaconfig).
The script parameters are
[documented](extensions-dsc-template.md##default-configuration-script)
and the full script is available in
[GitHub](https://github.com/Azure/azure-quickstart-templates/blob/master/dsc-extension-azure-automation-pullserver/UpdateLCMforAAPull.zip?raw=true).

## DSC Extension in ARM Templates

Azure Resource Manager (ARM) deployment templates
are the expected way to work with the DSC Extension for most scenarios.
For information and examples of including the DSC Extension
in ARM deployment templates,
see the dedicated documentation page
[Desired State Configuration Extension with Azure Resource Manager templates](extensions-dsc-template.md).

## DSC Extension PowerShell Cmdlets

The PowerShell cmdlets for managing DSC Extension
are best used for interactive troubleshooting
and information gathering scenarios.
The cmdlets can be used to package, publish, and monitor
DSC extension deployments.
Please note that cmdlets for DSC Extension have not yet been updated
to work with the
[Default Configuration Script](###default-configuration-script).

`Publish-AzureRMVMDscConfiguration` takes in a configuration file,
scans it for dependent DSC resources,
and creates a .zip file containing the configuration and DSC resources
needed to enact the configuration.
It can also create the package locally
using the `-ConfigurationArchivePath` parameter.
Otherwise, it publishes the .zip file to Azure blob storage
and secures it with a SAS token.

The .zip file created by this cmdlet has the .ps1 configuration script
at the root of the archive folder.
Resources have the module folder placed in the archive folder.

`Set-AzureRMVMDscExtension` injects the settings needed
by the PowerShell DSC extension into a VM configuration object.

`Get-AzureRMVMDscExtension` retrieves the DSC extension status
of a particular VM.

`Get-AzureRMVMDscExtensionStatus` retrieves the status of the DSC configuration
enacted by the DSC extension handler.
This action can be performed on a single VM, or group of VMs.

`Remove-AzureRMVMDscExtension` removes the extension handler
from a given virtual machine.
This cmdlet does **not** remove the configuration, uninstall the WMF,
or change the applied settings on the virtual machine.
It only removes the extension handler. 

Important information regarding the AzureRM DSC Extension cmdlets:

- Azure Resource Manager cmdlets are synchronous.
- ResourceGroupName, VMName, ArchiveStorageAccountName, Version, and Location are all required parameters.
- ArchiveResourceGroupName is an optional parameter. You can specify this parameter when your storage account belongs to a different resource group than the one where the virtual machine is created.
- The AutoUpdate switch enables automatic updating of the extension handler to the latest version as and when it is available. Note this parameter has the potential to cause reboots on the VM when a new version of the WMF is released.

### Getting Started with Cmdlets

The Azure DSC extension is capable of using DSC configuration documents
directly to configure Azure VMs during deployment
although this will not register the node to Azure Automation so the node
will **NOT*- be centrally managed.

A simple example of a configuration follows.
Save it locally as "IisInstall.ps1":

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

The following steps place the IisInstall.ps1 script on the specified VM, execute the configuration, and report back on status.

```powershell
$resourceGroup = "dscVmDemo"
$location = "westus"
$vmName = "myVM"
$storageName = "demostorage"
#Publish the configuration script into user storage
Publish-AzureRmVMDscConfiguration -ConfigurationPath .\iisInstall.ps1 -ResourceGroupName $resourceGroup -StorageAccountName $storageName -force
#Set the VM to run the DSC configuration
Set-AzureRmVmDscExtension -Version 2.72 -ResourceGroupName $resourceGroup -VMName $vmName -ArchiveStorageAccountName $storageName -ArchiveBlobName iisInstall.ps1.zip -AutoUpdate:$true -ConfigurationName "IISInstall"
```

## Azure Portal Functionality

Browse to a VM. Under Settings -> General click "Extensions."
A new pane is created.
Click "Add" and select PowerShell DSC.

The portal needs input.
**Configuration Modules or Script**:
This field is mandatory
(the form has not been updated for the
[Default Configuration Script](###default-configuration-script).
Requires a .ps1 file containing a configuration script,
or a .zip file with a .ps1 configuration script at the root,
and all dependent resources in module folders within the .zip.
It can be created with the
`Publish-AzureVMDscConfiguration -ConfigurationArchivePath`
cmdlet included in the Azure PowerShell SDK.
The .zip file is uploaded into your user blob storage secured by a SAS token.

**Configuration Data PSD1 File**:
This field is optional.
If your configuration requires a configuration data file in .psd1,
use this field to select it and upload it to your user blob storage,
where it is secured by a SAS token.

**Module-Qualified Name of Configuration**:
.ps1 files can have multiple configuration functions.
Enter the name of the configuration .ps1 script followed by a  '\'
and the name of the configuration function.
For example, if your .ps1 script has the name "configuration.ps1",
and the configuration is "IisInstall",
you would enter: `configuration.ps1\IisInstall`

**Configuration Arguments**:
If the configuration function takes arguments,
enter them in here in the format `argumentName1=value1,argumentName2=value2`.
Note this format is a different format than how configuration arguments
are accepted through PowerShell cmdlets or Resource Manager templates.

## Logging
Logs are placed in:

```powerShell
C:\WindowsAzure\Logs\Plugins\Microsoft.Powershell.DSC\[Version Number]
```

## Next steps
For more information about PowerShell DSC, [visit the PowerShell documentation center](https://msdn.microsoft.com/powershell/dsc/overview). 

Examine the [Azure Resource Manager template for the DSC extension](extensions-dsc-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

To find additional functionality you can manage with PowerShell DSC, [browse the PowerShell gallery](https://www.powershellgallery.com/packages?q=DscResource&x=0&y=0) for more DSC resources.

For details on passing sensitive parameters into configurations, see [Manage credentials securely with the DSC extension handler](extensions-dsc-credentials.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
