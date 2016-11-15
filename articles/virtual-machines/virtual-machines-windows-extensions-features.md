---
title: Virtual machine extensions and features | Microsoft Docs
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
ms.date: 11/15/2016
ms.author: nepeters

---
# About virtual machine extensions and features

## Azure VM extensions
Azure Virtual Machine extensions are small applications that provide post deployment configuration and automation task on Azure Virtual Machines. For example, if a Virtual Machine requires software to be installed, anti-virus protection, or Docker configuration, a VM extension can be used to complete these tasks. Azure VM extensions can be run using the Azure CLI, PowerShell, Resource Manage templates, and the Azure portal. Extensions can be bundled with a new virtual machine deployment, or run against any existing system.

This document provides prerequisites for Azure Virtual Machine extension, and guidance on how to detect available VM extensions. 

## Use cases and samples

There are many different Azure VM extension available each with a specific use case. Some example use cases are:
Apply PowerShell Desired State Configurations to an Azure virtual machine. For more information, see [Azure Desired State configuration extension]( virtual-machines-windows-extensions-dsc-overview.md).
Configure monitoring of your Azure virtual machine with the Log Analytics using the Microsoft Monitoring Agent VM extension. For more information, see [Connect Azure virtual machines to Log Analytics](../log-analytics/log-analytics-azure-vm-extension.md). 
Configure monitoring of your Azure infrastructure with the Datadog extension. For more information, see [Datadog blog]( https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).
Configure an Azure virtual machine using Chef. For more information, see [Automating Azure virtual machine deployment with Chef](virtual-machines-windows-chef-automation.md).

In addition to process specific extension, a Custom Script extension is available for both Windows and Linux virtual machines. The Custom Script extension for Windows allows any PowerShell script to be run on the virtual machine. For more information, see [Windows VM Custom Script extension](virtual-machines-windows-extensions-customscript.md).

To see how a VM extension can be used in an end to end application deployment, check out [Automating application deployments to Azure Virtual Machines]( virtual-machines-windows-dotnet-core-1-landing.md).

## Prerequisites

Each virtual machine extension may have its own set of prerequisites. For instance, the Docker VM extension has a prerequisite of a supported Linux distribution. Prerequisites specific to an individual extension will be detailed in extension specific documentation. 

### Azure VM Agent
The Azure VM Agent manages interaction between an Azure Virtual Machine and the Azure Fabric Controller. The VM agent is responsible for many functional aspects of deploying and managing Azure Virtual Machines, including running VM Extensions. The Azure VM Agent is pre-installed on Azure Gallery Images, and can be installed on supported operating systems. 

For information on supported operating systems and installation instructions, see [Azure Virtual Machine Agent](virtual-machines-windows-classic-agents-and-extensions.md).

## Discover VM extensions
Many different VM extensions are available for use with Azure Virtual Machines. To see a complete list, run the following command with the Azure PowerShell module.

```powershell
Get-AzureVMAvailableExtension | Select ExtensionName, Version
```

## Running VM extensions

Azure virtual machine extensions can be run on existing virtual machines, or bundled with Azure Resource Manager template deployments. Using extension with new deployment enables complete end to end deployment and configuration solutions.

The following methods can be used to run an extension against an existing virtual machine. 

### PowerShell

Several PowerShell commands exist for running individual extensions. To see a list, run the following PowerShell commands.

```powershell
get-command *set*azure*vm*extension* -Module AzureRM.Compute
```

Which will provide output similar to the following:

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

The `Set-AzureRmVMExtension` command can be used as a catch all or general command for starting a VM extension. For more information, see [Set-AzureRmVMExtension reference](https://msdn.microsoft.com/en-us/library/mt603745.aspx).

### Azure Portal

VM extension can be applied to an existing virtual machine through the Azure portal. To do so, select the virtual machine – extensions – and click add. Doing so will provide a list of available extensions. Select the one you want, which will provide a wizard for configuration. The following image depicts the installation of the Microsoft Antimalware extension from the Azure portal.

![Antimalware Extension](./media/virtual-machines-windows-extensions-features/anti-virus-extension.png)

### Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. This is useful in creating fully configured Azure deployments. For more information, see [Authoring Azure Resource Manager templates with Windows VM extensions](virtual-machines-windows-extensions-authoring-templates.md).

## Troubleshooting VM extension

Each VM extension may have troubleshooting steps specific to that extensions. For instance, when using the Custom Script Extension, script execution details can be found locally on the virtual machine on which the extension was run. Any extension specific troubleshooting steps will be detailed in extension specific documentation. 
The following troubleshooting steps apply to all Virtual Machine extensions.

### Viewing extension status

Once a Virtual Machine extension has been run against a virtual machine, use the following PowerShell command to return extension status. Replace example parameter names with your own values. The `Name` paramater takes the name given to the extension at execution time.

```PowerShell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

The output will look similar to the following:

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

### Re-running VM Extension 

If you are running scripts on the VM using Custom Script Extension, you may sometimes run into an error where VM was created successfully but the script has failed. Under these conditons, the recommended way to recover from this error is to remove the extension and rerun the template again.

```powershell
Remove-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

<br />

## Common VM Extensions
| Extension Name | Description | More Information |
| --- | --- | --- |
| Custom Script Extension for Windows |Run scripts against an Azure Virtual Machine |[Custom Script Extension for Windows](virtual-machines-windows-extensions-customscript.md) |
| DSC Extension for Windows |PowerShell DSC (Desired State Configuration) Extension. |[Docker VM Extension](virtual-machines-windows-extensions-dsc-overview.md) |
| Azure Diagnostics Extension |Manage Azure Diagnostics |[Azure Diagnostics Extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |

