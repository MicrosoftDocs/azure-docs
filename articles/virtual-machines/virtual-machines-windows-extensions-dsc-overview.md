<properties
   pageTitle="Desired State Configuration for Azure Overview | Microsoft Azure"
   description="Overview for using the Microsoft Azure extension handler for PowerShell Desired State Configuration. Including prerequisites, architecture, cmdlets.."
   services="virtual-machines-windows"
   documentationCenter=""
   authors="zjalexander"
   manager="timlt"
   editor=""
   tags="azure-service-management,azure-resource-manager"
   keywords=""/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="na"
   ms.date="04/18/2016"
   ms.author="zachal"/>

# Introduction to the Azure Desired State Configuration extension handler #

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

The Azure VM Agent and associated Extensions are part of the Microsoft Azure Infrastructure Services. VM Extensions are software components that extend the VM functionality and simplify various VM management operations; for example, the VMAccess extension can be used to reset an administrator's password, or the Custom Script extension can be used to execute a script on the VM.

This article introduces the PowerShell Desired State Configuration (DSC) Extension for Azure VMs as part of the Azure PowerShell SDK. You can use new cmdlets to upload and apply a PowerShell DSC configuration on an Azure VM enabled with the PowerShell DSC extension. PowerShell DSC extension will call into PowerShell DSC to enact the received DSC configuration on the VM. This functionality is also available through the Azure portal.

## Prerequisites ##
**Local machine**
To interact with the Azure VM extension, you will either need to use the Azure portal or the Azure PowerShell SDK. 

**Guest Agent**
The Azure VM that will be configured by the DSC configuration will need to be an OS that supports either Windows Management Framework (WMF) 4.0 or 5.0. The full list of supported OS versions can be found at the DSC Extension Version History.

## Terms and concepts ##
This guide presumes familiarity with the following concepts:

Configuration - A DSC configuration document. 

Node - A target for a DSC configuration. In this document, "node" will always refer to an Azure VM.

Configuration Data - A .psd1 file containing environmental data for a configuration

## Architectural overview ##

The Azure DSC extension uses the Azure VM Agent framework to deliver, enact, and report on DSC configurations running on Azure VMs. The DSC extension expects a .zip file containing at least a configuration document, and a set of parameters provided either through the Azure PowerShell SDK or through the Azure portal.

When the extension is called for the first time, it runs an installation process. This process installs a version of the Windows Management Framework (WMF) as defined below:

1. If the Azure VM OS is Windows Server 2016, no action is taken. WS 2016 already has the latest version of PowerShell installed.
2. If the `wmfVersion` property is specified, that version of the WMF is installed unless it is incompatible with the VM's OS.
3. If no `wmfVersion` property is specified, the latest applicable version of the WMF is installed.

Installation of the WMF requires a reboot. After reboot, the extension downloads the .zip file specified in the `modulesUrl` property. If this location is in Azure blob storage, a SAS token can be specified in the `sasToken` property to access the file. After the .zip is downloaded and unpacked, the configuration function defined in `configurationFunction` is run to generate the MOF file. The extension then runs `Start-DscConfiguration -Force` on the generated MOF file. The extension captures output and writes it back out to the Azure Status Channel. From this point on, the DSC LCM handles monitoring and correction as normal. 

## PowerShell cmdlets ##

PowerShell cmdlets can be used with ARM or ASM to package, publish and monitor DSC extension deployments. The following cmdlets listed are the ASM modules, but "Azure" can be replaced with "AzureRm" to use the ARM model. For example,  `Publish-AzureVMDscConfiguration` will use ASM, where `Publish-AzureRmVMDscConfiguration` will use ARM. 

`Publish-AzureVMDscConfiguration` will take in a configuration file, scan it for dependent DSC resources, and create a .zip file containing the configuration and DSC resources needed to enact the configuration. It can either create the package locally using the `-ConfigurationArchivePath` parameter. Otherwise, it will publish the .zip file to Azure blob storage and secure it with a SAS token.

The .zip file created by this cmdlet has the .ps1 configuration script at the root of the archive folder. Resources have the module folder placed in the archive folder. 

`Set-AzureVMDscExtension` will  injects the settings needed by the PowerShell DSC extension into a VM configuration object, which can then be applied to an Azure VM with `Update-AzureVM`.

`Get-AzureVMDscExtension` retrieves the DSC extension status of a particular VM. 

`Get-AzureVMDscExtensionStatus` retrieves the status of the DSC configuration enacted by the DSC extension handler on a VM or group of VMs.

`Remove-AzureVMDscExtension` removes the extension handler from a given virtual machine. This does **not** remove the configuration, uninstall the WMF, or change the applied settings on the virtual machine. It only removes the extension handler. 

**Key differences in ASM and ARM cmdlets**

- ARM cmdlets are synchronous. ASM cmdlets are asynchronous.
- ResourceGroupName, VMName, ArchiveStorageAccountName, Version, and Location are all new required parameters.
- ArchiveResourceGroupName is a new optional parameter for ARM. You can specify this when your storage account belongs to a different resource group than the one where the virtual machine is created.
- ConfigurationArchive is called ArchiveBlobName in ARM
- ContainerName is called ArchiveContainerName in ARM
- StorageEndpointSuffix is called ArchiveStorageEndpointSuffix in ARM
- The AutoUpdate switch has been added to ARM to enable automatic updating of the extension handler to the latest version as and when it is available. Please note this has the potential to cause reboots on the VM when a new version of the WMF is released. 


## Azure portal functionality ##
Browse to a classic VM. Under Settings -> General click "Extensions". A new pane is created. Click "Add" and select PowerShell DSC.

The portal will need input.
**Configuration Modules or Script**: This is a mandatory field. Requires a .ps1 file containing a configuration script, or a .zip file with a .ps1 configuration script at the root and all dependent resources in module folders within the .zip. It can be created with the `Publish-AzureVMDscConfiguration -ConfigurationArchivePath` cmdlet included in the Azure PowerShell SDK. The .zip file will be uploaded into your user blob storage secured by a SAS token. 

**Configuration Data PSD1 File**: This is an optional field. If your configuration requires a configuration data file in .psd1, use this field to select it and upload it to your user blob storage, where it will be secured by a SAS token. 
 
**Module-Qualified Name of Configuration**: .ps1 files can have multiple configuration functions. Enter the name of the configuration .ps1 script followed by a  '\' and the name of the configuration function. For example, if your .ps1 script has the name "configuration.ps1", and the configuration is "IisInstall", you would enter: `configuration.ps1\IisInstall`

**Configuration Arguments**: If the configuration function takes arguments, enter them in here in the format `argumentName1=value1,argumentName2=value2`. Note this is a different format than how configuration arguments are accepted through PowerShell cmdlets or ARM templates. 

## Getting started ##

The Azure DSC extension takes in DSC configuration documents and enacts them on Azure VMs. A simple example of a configuration follows. Save it locally as "IisInstall.ps1":

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

The following steps will then place the IisInstall.ps1 script on the specified VM, execute the configuration, and report back on status.
 
```powershell
#Azure PowerShell cmdlets are required
Import-Module Azure

#Use an existing Azure Virtual Machine, 'DscDemo1'
$demoVM = Get-AzureVM DscDemo1

#Publish the configuration script into user storage.
Publish-AzureVMDscConfiguration -ConfigurationPath ".\IisInstall.ps1" -StorageContext $storageContext -Verbose -Force

#Set the VM to run the DSC configuration
Set-AzureVMDscExtension -VM $demoVM -ConfigurationArchive "demo.ps1.zip" -StorageContext $storageContext -ConfigurationName "runScript" -Verbose

#Update the configuration of an Azure Virtual Machine
$demoVM | Update-AzureVM -Verbose

#check on status
Get-AzureVMDscExtensionStatus -VM $demovm -Verbose
```

## Logging ##

Logs are placed in:

C:\WindowsAzure\Logs\Plugins\Microsoft.Powershell.DSC\[Version Number]

## Next steps ##

For more information about PowerShell DSC, [visit the PowerShell documentation center](https://msdn.microsoft.com/powershell/dsc/overview). 

To find additional functionality you can manage with PowerShell DSC, [browse the PowerShell gallery](https://www.powershellgallery.com/packages?q=DscResource&x=0&y=0) for more DSC resources.

For details on passing sensitive parameters into configurations, see [Manage credentials securely with the DSC extension handler](virtual-machines-windows-extensions-dsc-credentials.md).