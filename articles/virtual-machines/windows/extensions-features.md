---
title: Virtual machine extensions and features for Windows in Azure | Microsoft Docs
description: Learn what extensions are available for Azure virtual machines, grouped by what they provide or improve.
services: virtual-machines-windows
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 999d63ee-890e-432e-9391-25b3fc6cde28
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/06/2017
ms.author: nepeters
ms.custom: H1Hack27Feb2017

---
# Virtual machine extensions and features for Windows

Azure virtual machine extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. For example, if a virtual machine requires software installation, anti-virus protection, or Docker configuration, a VM extension can be used to complete these tasks. Azure VM extensions can be run by using the Azure CLI, PowerShell, Azure Resource Manager templates, and the Azure portal. Extensions can be bundled with a new virtual machine deployment or run against any existing system.

This document provides an overview of virtual machine extensions, prerequisites for using virtual machine extensions, and guidance on how to detect, manage, and remove virtual machine extensions. This document provides generalized information because many VM extensions are available, each with a potentially unique configuration. Extension-specific details can be found in each document specific to the individual extension.

## Use cases and samples

There are many different Azure VM extensions available, each with a specific use case. Some example use cases are:

- Apply PowerShell Desired State configurations to a virtual machine by using the DSC extension for Windows. For more information, see [Azure Desired State configuration extension](extensions-dsc-overview.md).
- Configure virtual machine monitoring by using the Microsoft Monitoring Agent VM extension. For more information, see [Connect Azure virtual machines to Log Analytics](../../log-analytics/log-analytics-azure-vm-extension.md).
- Configure monitoring of your Azure infrastructure with the Datadog extension. For more information, see the [Datadog blog](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).
- Configure an Azure virtual machine by using Chef. For more information, see [Automating Azure virtual machine deployment with Chef](chef-automation.md).

In addition to process-specific extensions, a Custom Script extension is available for both Windows and Linux virtual machines. The Custom Script extension for Windows allows any PowerShell script to be run on a virtual machine. This is useful when you're designing Azure deployments that require configuration beyond what native Azure tooling can provide. For more information, see [Windows VM Custom Script extension](extensions-customscript.md).

To work through an example where a VM extension is used in an end-to-end application deployment, see [Automating application deployments to Azure virtual machines](dotnet-core-1-landing.md).

## Prerequisites

Each virtual machine extension may have its own set of prerequisites. For instance, the Docker VM extension has a prerequisite of a supported Linux distribution. Requirements of individual extensions are detailed in the extension-specific documentation.

### Azure VM agent
The Azure VM agent manages interaction between an Azure virtual machine and the Azure fabric controller. The VM agent is responsible for many functional aspects of deploying and managing Azure virtual machines, including running VM extensions. The Azure VM agent is preinstalled on Azure Marketplace images and can be installed on supported operating systems.

For information on supported operating systems and installation instructions, see [Azure virtual machine agent](agent-user-guide.md).

## Discover VM extensions
Many different VM extensions are available for use with Azure virtual machines. To see a complete list, run the following command with the Azure Resource Manager PowerShell module. Make sure to specify the desired location when you're running this command.

```powershell
Get-AzureRmVmImagePublisher -Location WestUS | `
Get-AzureRmVMExtensionImageType | `
Get-AzureRmVMExtensionImage | Select Type, Version
```

## Run VM extensions

Azure virtual machine extensions can be run on existing virtual machines, which is useful when you need to make configuration changes or recover connectivity on an already deployed VM. VM extensions can also be bundled with Azure Resource Manager template deployments. By using extensions with Resource Manager templates, you can enable Azure virtual machines to be deployed and configured without the need for post-deployment intervention.

The following methods can be used to run an extension against an existing virtual machine.

### PowerShell

Several PowerShell commands exist for running individual extensions. To see a list, run the following PowerShell commands.

```powershell
get-command Set-AzureRM*Extension* -Module AzureRM.Compute
```

This provides output similar to the following:

```powershell
CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Cmdlet          Set-AzureRmVMAccessExtension                       2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMADDomainExtension                     2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMAEMExtension                          2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMBackupExtension                       2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMBginfoExtension                       2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMChefExtension                         2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMCustomScriptExtension                 2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMDiagnosticsExtension                  2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMDiskEncryptionExtension               2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMDscExtension                          2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMExtension                             2.2.0      AzureRM.Compute
Cmdlet          Set-AzureRmVMSqlServerExtension                    2.2.0      AzureRM.Compute
```

The following example uses the Custom Script extension to download a script from a GitHub repository onto the target virtual machine and then run the script. For more information on the Custom Script extension, see [Custom Script extension overview](extensions-customscript.md).

```powershell
Set-AzureRmVMCustomScriptExtension -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" -Name "myCustomScript" `
    -FileUri "https://raw.githubusercontent.com/neilpeterson/nepeters-azure-templates/master/windows-custom-script-simple/support-scripts/Create-File.ps1" `
    -Run "Create-File.ps1" -Location "West US"
```

In this example, the VM Access extension is used to reset the administrative password of a Windows virtual machine. For more information on the VM Access extension, see [Reset Remote Desktop service in a Windows VM](reset-rdp.md).

```powershell
$cred=Get-Credential

Set-AzureRmVMAccessExtension -ResourceGroupName "myResourceGroup" -VMName "myVM" -Name "myVMAccess" `
    -Location WestUS -UserName $cred.GetNetworkCredential().Username `
    -Password $cred.GetNetworkCredential().Password -typeHandlerVersion "2.0"
```

The `Set-AzureRmVMExtension` command can be used to start any VM extension. For more information, see the [Set-AzureRmVMExtension reference](https://msdn.microsoft.com/en-us/library/mt603745.aspx).


### Azure portal

A VM extension can be applied to an existing virtual machine through the Azure portal. To do so, select the virtual machine you want to use, choose **Extensions**, and click **Add**. This provides a list of available extensions. Select the one you want and follow the steps in the wizard.

The following image shows the installation of the Microsoft Antimalware extension from the Azure portal.

![Install antimalware extension](./media/extensions-features/installantimalwareextension.png)

### Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. Deploying extensions with a template is useful for creating fully configured Azure deployments. For example, the following JSON is taken from a Resource Manager template that deploys a set of load-balanced virtual machines and an Azure SQL database, and then installs a .NET Core application on each VM. The VM extension takes care of the software installation.

For more information, see the [full Resource Manager template](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-windows).

```json
{
    "apiVersion": "2015-06-15",
    "type": "extensions",
    "name": "config-app",
    "location": "[resourceGroup().location]",
    "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'),copyindex())]",
    "[variables('musicstoresqlName')]"
    ],
    "tags": {
    "displayName": "config-app"
    },
    "properties": {
    "publisher": "Microsoft.Compute",
    "type": "CustomScriptExtension",
    "typeHandlerVersion": "1.4",
    "autoUpgradeMinorVersion": true,
    "settings": {
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
        ]
    },
    "protectedSettings": {
        "commandToExecute": "[concat('powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 -user ',parameters('adminUsername'),' -password ',parameters('adminPassword'),' -sqlserver ',variables('musicstoresqlName'),'.database.windows.net')]"
    }
    }
}
```

For more information, see [Authoring Azure Resource Manager templates with Windows VM extensions](extensions-authoring-templates.md).

## Secure VM extension data

When you're running a VM extension, it may be necessary to include sensitive information such as credentials, storage account names, and storage account access keys. Many VM extensions include a protected configuration that encrypts data and only decrypts it inside the target virtual machine. Each extension has a specific protected configuration schema that will be detailed in extension-specific documentation.

The following example shows an instance of the Custom Script extension for Windows. Notice that the command to execute includes a set of credentials. In this example, the command to execute will not be encrypted.


```json
{
    "apiVersion": "2015-06-15",
    "type": "extensions",
    "name": "config-app",
    "location": "[resourceGroup().location]",
    "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'),copyindex())]",
    "[variables('musicstoresqlName')]"
    ],
    "tags": {
    "displayName": "config-app"
    },
    "properties": {
    "publisher": "Microsoft.Compute",
    "type": "CustomScriptExtension",
    "typeHandlerVersion": "1.4",
    "autoUpgradeMinorVersion": true,
    "settings": {
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
        ],
        "commandToExecute": "[concat('powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 -user ',parameters('adminUsername'),' -password ',parameters('adminPassword'),' -sqlserver ',variables('musicstoresqlName'),'.database.windows.net')]"
    }
    }
}
```

Secure the execution string by moving the **command to execute** property to the **protected** configuration.

```json
{
    "apiVersion": "2015-06-15",
    "type": "extensions",
    "name": "config-app",
    "location": "[resourceGroup().location]",
    "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'),copyindex())]",
    "[variables('musicstoresqlName')]"
    ],
    "tags": {
    "displayName": "config-app"
    },
    "properties": {
    "publisher": "Microsoft.Compute",
    "type": "CustomScriptExtension",
    "typeHandlerVersion": "1.4",
    "autoUpgradeMinorVersion": true,
    "settings": {
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
        ]
    },
    "protectedSettings": {
        "commandToExecute": "[concat('powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 -user ',parameters('adminUsername'),' -password ',parameters('adminPassword'),' -sqlserver ',variables('musicstoresqlName'),'.database.windows.net')]"
    }
    }
}
```

## Troubleshoot VM extensions

Each VM extension may have specific troubleshooting steps. For instance, when you're using the Custom Script extension, script execution details can be found locally on the virtual machine on which the extension was run. Any extension-specific troubleshooting steps are detailed in extension-specific documentation.

The following troubleshooting steps apply to all virtual machine extensions.

### View extension status

After a virtual machine extension has been run against a virtual machine, use the following PowerShell command to return extension status. Replace example parameter names with your own values. The `Name` parameter takes the name given to the extension at execution time.

```PowerShell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

The output looks like the following:

```json
ResourceGroupName       : myResourceGroup
VMName                  : myVM
Name                    : myExtensionName
Location                : westus
Etag                    : null
Publisher               : Microsoft.Azure.Extensions
ExtensionType           : DockerExtension
TypeHandlerVersion      : 1.0
Id                      : /subscriptions/mySubscriptionIS/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM/extensions/myExtensionName
PublicSettings          :
ProtectedSettings       :
ProvisioningState       : Succeeded
Statuses                :
SubStatuses             :
AutoUpgradeMinorVersion : False
ForceUpdateTag          :
```

Extension execution status can also be found in the Azure portal. To view the status of an extension, select the virtual machine, choose **Extensions**, and select the desired extension.

### Rerun VM extensions

There may be cases in which a virtual machine extension needs to be rerun. You can do this by removing the extension and then rerunning the extension with an execution method of your choice. To remove an extension, run the following command with the Azure PowerShell module. Replace example parameter names with your own values.

```powershell
Remove-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

An extension can also be removed using the Azure portal. To do so:

1. Select a virtual machine.
2. Select **Extensions**.
3. Choose the desired extension.
4. Select **Uninstall**.

## Common VM extensions reference
| Extension name | Description | More information |
| --- | --- | --- |
| Custom Script Extension for Windows |Run scripts against an Azure virtual machine |[Custom Script Extension for Windows](extensions-customscript.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) |
| DSC Extension for Windows |PowerShell DSC (Desired State Configuration) Extension |[DSC Extension for Windows](extensions-dsc-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) |
| Azure Diagnostics Extension |Manage Azure Diagnostics |[Azure Diagnostics Extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |
| Azure VM Access Extension |Manage users and credentials |[VM Access Extension for Linux](https://azure.microsoft.com/en-us/blog/using-vmaccess-extension-to-reset-login-credentials-for-linux-vm/) |
