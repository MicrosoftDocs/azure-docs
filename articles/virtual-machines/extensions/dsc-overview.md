---
title: Desired State Configuration for Azure overview
description: Learn how to use the Microsoft Azure extension handler for PowerShell Desired State Configuration (DSC), including prerequisites, architecture, and cmdlets.
services: virtual-machines
author: mgoedtel
manager: evansma
tags: azure-resource-manager
keywords: 'dsc'
ms.assetid: bbacbc93-1e7b-4611-a3ec-e3320641f9ba
ms.service: virtual-machines
ms.subservice: extensions
ms.collection: windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: na
ms.date: 03/28/2023
ms.author: magoedte
ms.custom: devx-track-azurecli
ms.devlang: azurecli
---

# Introduction to the Azure Desired State Configuration extension handler

The Azure Linux Agent for Azure virtual machines (VM) and the associated extensions are part of Microsoft Azure infrastructure services. Azure VM extensions are software components that extend VM functionality and simplify various VM management operations.

The primary use for the Azure Desired State Configuration (DSC) extension for Windows PowerShell is to bootstrap a VM to the
[Azure Automation State Configuration (DSC) service](../../automation/automation-dsc-overview.md). This service provides [benefits](/powershell/dsc/managing-nodes/metaConfig#pull-service) that include ongoing management of the VM configuration and integration with other operational tools, such as Azure Monitor. You can use the extension to register your VMs to the service and gain a flexible solution that works across Azure subscriptions.

You can run the DSC extension independently of the Automation DSC service, but this method only pushes a configuration to the VM. No ongoing reporting is available, other than locally in the VM. Before you enable the DSC extension, [choose the DSC version](#dsc-versions) that best supports your configuration and implementation goals.

This article describes how to use the DSC extension for Automation onboarding, or use it as a tool to assign configurations to VMs with the Azure SDK.

## DSC versions

There are several versions of DSC available for implementation. Before you enable the DSC extension, choose the DSC version that best supports your configuration and business goals.

| DSC version | Availability | Description |
| --- | --- | --- |
| **DSC 2.0** | General availability | [DSC 2.0](https://learn.microsoft.com/powershell/dsc/overview?view=dsc-2.0) is supported for use with the Azure Automanage [Machine Configuration](../../governance/machine-configuration/overview.md) feature. The machine configuration feature combines features of the DSC extension handler, Azure Automation State Configuration, and the most commonly requested features from customer feedback. Machine configuration also includes hybrid machine support through [Arc-enabled servers](../../azure-arc/servers/overview.md). |
| **DSC 1.1** | General availability | If your implementation doesn't use the Azure Automanage machine configuration feature, you should choose DSC 1.1. For more information, see [PSDesiredStateConfiguration v1.1](https://learn.microsoft.com/powershell/dsc/overview?view=dsc-1.1). |
| **DSC 3.0** | Public preview | [DSC 3.0 is available in public beta](https://learn.microsoft.com/powershell/dsc/overview?view=dsc-3.0). This version should be used only with Azure machine configuration, or for nonproduction environments to test migrating away from DSC 1.1. |

## Prerequisites

- **Local machine**: To interact with the DSC extension, you must use either the Azure portal or the Azure PowerShell SDK on the local machine.

- **Guest agent**: The Azure VM that's prepared by the DSC configuration must use an operating system that supports Windows Management Framework (WMF) 4.0 or later. For the full list of supported operating system versions, see the [DSC extension version history](../../automation/automation-dsc-extension-history.md).

### Terms and concepts

This article assumes familiarity with the following concepts:

- **Configuration** refers to a DSC configuration document.
- **Node** identifies a target for a DSC configuration. In this article, *node* always refers to an Azure VM.
- **Configuration data** is stored in a PowerShell DSC format file (.psd1) that has environmental data for a configuration.

## Architecture

The Azure DSC extension uses the Azure VM Agent framework to deliver, enact, and report on DSC configurations running on Azure VMs. The DSC extension accepts a configuration document and a set of parameters. If no file is provided, a [default configuration script](#default-configuration-script) is embedded with the extension. The default configuration script is used only to set metadata in [Local Configuration Manager](/powershell/dsc/managing-nodes/metaConfig).

When the extension is called the first time, it installs a version of WMF by using the following logic:

- If the Azure VM operating system is Windows Server 2016, no action is taken. Windows Server 2016 already has the latest version of PowerShell installed.
- If the `wmfVersion` property is specified, the specified version of WMF is installed, unless the specified version is incompatible with the VM's operating system.
- If no `wmfVersion` property is specified, the latest applicable version of WMF is installed.

The WMF installation process requires a restart. After you restart, the extension downloads the .zip file that's specified in the `modulesUrl` property, if provided. If this location is in Azure Blob Storage, you can specify an SAS token in the `sasToken` property to access the file. After the .zip is downloaded and unpacked, the configuration function defined in `configurationFunction` runs to generate a [Managed Object Format (MOF)](/windows/win32/wmisdk/managed-object-format--mof-) file (.mof). The extension then runs `Start-DscConfiguration -Force` by using the generated .mof file. The extension captures output and writes it to the Azure status channel.

### Default configuration script

The Azure DSC extension includes a default configuration script that's intended to be used when you onboard a VM to the Azure Automation DSC service. The script parameters are aligned with the configurable properties of [Local Configuration Manager](/powershell/dsc/managing-nodes/metaConfig). For script parameters, see [Default configuration script](dsc-template.md#default-configuration-script) in [Desired State Configuration extension with Azure Resource Manager templates](dsc-template.md). For the full script, see the [Azure Quickstart Template in GitHub](https://github.com/Azure/azure-quickstart-templates/blob/master/demos/azmgmt-demo/nestedtemplates/scripts/UpdateLCMforAAPull.zip).

## Information for registering with Azure Automation State Configuration (DSC) service

To use the DSC Extension to register a node with the State Configuration service, you provide the following three values:

- `RegistrationUrl`: The https address of the Azure Automation account.
- `RegistrationKey`: A shared secret that's used to register nodes with the service.
- `NodeConfigurationName`: The name of the node configuration (MOF) to pull from the service to configure the server role. The value is the name of the node configuration and not the name of the Configuration. 

You can gather these values from the Azure portal, or by running the following commands in Windows PowerShell:

```powershell
(Get-AzAutomationRegistrationInfo -ResourceGroupName <resourcegroupname> -AutomationAccountName <accountname>).Endpoint
(Get-AzAutomationRegistrationInfo -ResourceGroupName <resourcegroupname> -AutomationAccountName <accountname>).PrimaryKey
```

### Node configuration

For the `NodeConfigurationName`, provide the name of the node configuration and not the Configuration.

A Configuration is defined in a script that's used [to compile the node configuration (MOF file)](../../automation/automation-dsc-compile.md). The name of the node configuration is always the Configuration followed by a period `.` and either `localhost` or a specific computer name.

> [!WARNING]
> Make sure the node configuration exists in Azure State Configuration. If this value doesn't exist, the extension deployment returns a failure.


## DSC extension in Resource Manager templates

In most scenarios, Azure Resource Manager (ARM) templates are the expected way to work with the DSC extension. For more information and for examples of how to include the DSC extension in ARM templates, see [Desired State Configuration extension with ARM templates](dsc-template.md).

## DSC extension PowerShell cmdlets

The PowerShell cmdlets that are used to manage the DSC extension are best used in interactive troubleshooting and information-gathering scenarios. You can use the cmdlets to package, publish, and monitor DSC extension deployments. Cmdlets for the DSC extension aren't yet updated to work with the [default configuration script](#default-configuration-script).

The **Publish-AzVMDscConfiguration** cmdlet takes in a configuration file, scans it for dependent DSC resources, and then creates a .zip file. The .zip file contains the configuration and DSC resources that are needed to enact the configuration. The cmdlet can also create the package locally by using the *-OutputArchivePath* parameter. Otherwise, the cmdlet publishes the .zip file to blob storage, and then secures it with an SAS token.

The PowerShell configuration script (.ps1) created by the cmdlet is in the .zip file at the root of the archive folder. The module folder is placed in the archive folder in resources.

The **Set-AzVMDscExtension** cmdlet injects the settings that the PowerShell DSC extension requires into a VM configuration object.

The **Get-AzVMDscExtension** cmdlet retrieves the DSC extension status of a specific VM.

The **Get-AzVMDscExtensionStatus** cmdlet retrieves the status of the DSC configuration that's enacted by the DSC extension handler. This action can be performed on a single VM or on a group of VMs.

The **Remove-AzVMDscExtension** cmdlet removes the extension handler from a specific VM. Keep in mind that this cmdlet doesn't remove the configuration, uninstall WMF, or change the applied settings on the VM. The cmdlet only removes the extension handler.

Important information about Resource Manager DSC extension cmdlets:

- Azure Resource Manager cmdlets are synchronous.
- The following parameters are required: `ResourceGroupName`, `VMName`, `ArchiveStorageAccountName`, `Version`, and `Location`.
- `ArchiveResourceGroupName` is an optional parameter. Specify this parameter when your storage account belongs to a different resource group than the one where the VM is created.
- Use the `AutoUpdate` switch to automatically update the extension handler to the latest version when it's available. This parameter has the potential to cause restarts on the VM when a new version of WMF is released.

### Get started with cmdlets

The Azure DSC extension can use DSC configuration documents to directly configure Azure VMs during deployment. This step doesn't register the node to Automation. Keep in mind that the node isn't centrally managed.

The following example shows a simple example of a configuration. Save the configuration locally as iisInstall.ps1.

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

The following commands place the iisInstall.ps1 script on the specified VM. The commands also execute the configuration, and then report back on status.

```powershell
$resourceGroup = 'dscVmDemo'
$vmName = 'myVM'
$storageName = 'demostorage'
#Publish the configuration script to user storage
Publish-AzVMDscConfiguration -ConfigurationPath .\iisInstall.ps1 -ResourceGroupName $resourceGroup -StorageAccountName $storageName -force
#Set the VM to run the DSC configuration
Set-AzVMDscExtension -Version '2.76' -ResourceGroupName $resourceGroup -VMName $vmName -ArchiveStorageAccountName $storageName -ArchiveBlobName 'iisInstall.ps1.zip' -AutoUpdate -ConfigurationName 'IISInstall'
```

## Azure CLI deployment

The Azure CLI can be used to deploy the DSC extension to an existing virtual machine.

For a virtual machine running Windows:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name DSC \
  --publisher Microsoft.Powershell \
  --version 2.77 --protected-settings '{}' \
  --settings '{}'
```

For a virtual machine running Linux:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name DSCForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 2.7 --protected-settings '{}' \
  --settings '{}'
```

## Azure portal functionality

To set up DSC in the Azure portal:

1. Go to a VM.
1. Under **Settings**, select **Extensions**.
1. In the new page that's created, select **+ Add**, and then select **PowerShell Desired State Configuration**.
1. Select **Create** at the bottom of the extension information page.

The portal collects the following input:

- **Configuration Modules or Script**: This field is mandatory (the form isn't updated for the [default configuration script](#default-configuration-script)). Configuration modules and scripts require a .ps1 file that has a configuration script or a .zip file with a .ps1 configuration script at the root. If you use a .zip file, all dependent resources must be included in module folders in the .zip. You can create the .zip file by using the **Publish-AzureVMDscConfiguration -OutputArchivePath** cmdlet that's included in the Azure PowerShell SDK. The .zip file is uploaded to your user Blob Storage and secured by an SAS token.

- **Module-qualified Name of Configuration**: You can include multiple configuration functions in a .ps1 file. Enter the name of the configuration .ps1 script followed by double slash `\\` and the name of the configuration function. If the .ps1 script has the name **configuration.ps1** and the configuration is **IisInstall**, enter `configuration.ps1\IisInstall`.

- **Configuration Arguments**: If the configuration function takes arguments, enter the values with the format `argumentName1=value1,argumentName2=value2`. This format is a different format in which configuration arguments are accepted in PowerShell cmdlets or ARM templates.

- **Configuration Data PSD1 File**: If your configuration requires a configuration data file in .psd1 format, use this field to select the data file and upload it to your user Blob Storage. The configuration data file is secured with an SAS token in Blob Storage.

- **WMF Version**: Specifies the version of Windows Management Framework (WMF) that should be installed on your VM. Setting this property to latest installs the most recent version of WMF. Currently, the only possible values for this property are 4.0, 5.0, 5.1, and latest. These possible values are subject to updates. The default value is latest.

- **Data Collection**: Determines if the extension collects telemetry. For more information, see [Azure DSC extension data collection](https://devblogs.microsoft.com/powershell/azure-dsc-extension-data-collection-2/).

- **Version**: Specifies the version of the DSC extension to install. For information about versions, see [DSC extension version history](../../automation/automation-dsc-extension-history.md).

- **Auto Upgrade Minor Version**: This field maps to the `AutoUpdate` switch in the cmdlets and enables the extension to automatically update to the latest version during installation.
   - **Yes** instructs the extension handler to use the latest available version.
   - **No** (default) forces installation of the specified **Version**.

## Logs

Logs for the extension are stored in `C:\WindowsAzure\Logs\Plugins\Microsoft.Powershell.DSC\<version number>`.

## Next steps

- For more information about PowerShell DSC, go to the [PowerShell documentation center](/powershell/dsc/overview).
- Examine the [ARM template for the DSC extension](dsc-template.md).
- For more functionality that you can manage by using PowerShell DSC, and for more DSC resources, browse the [PowerShell gallery](https://www.powershellgallery.com/packages?q=DscResource&x=0&y=0).
- For details about passing sensitive parameters into configurations, see [Manage credentials securely with the DSC extension handler](dsc-credentials.md).
