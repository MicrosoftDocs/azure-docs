---
title: Virtual machine extensions and features for Windows in Azure | Microsoft Docs
description: Learn what extensions are available for Azure virtual machines, grouped by what they provide or improve.
services: virtual-machines-windows
documentationcenter: ''
author: danielsollondon
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
ms.author: danis
ms.custom: H1Hack27Feb2017

---
# Virtual machine extensions and features for Windows

Azure virtual machine extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. For example, if a virtual machine requires software installation, anti-virus protection, or script to be run inside it, a VM extension can be used to complete these tasks. Azure VM extensions can be run by using the Azure CLI, PowerShell, Azure Resource Manager templates, and the Azure portal. Extensions can be bundled with a new virtual machine deployment or run against any existing system.

This document provides an overview of virtual machine extensions, prerequisites for using virtual machine extensions, and guidance on how to detect, manage, and remove virtual machine extensions. This document provides generalized information because many VM extensions are available, each with a potentially unique configuration. Extension-specific details can be found in each document specific to the individual extension.

## Use cases and samples

There are many different Azure VM extensions available, each with a specific use case. Some example use cases are:

- Apply PowerShell Desired State configurations to a virtual machine by using the DSC extension for Windows. For more information, see [Azure Desired State configuration extension](dsc-overview.md).
- Configure virtual machine monitoring by using the Microsoft Monitoring Agent VM extension. For more information, see [Connect Azure virtual machines to Log Analytics](../../log-analytics/log-analytics-azure-vm-extension.md).
- Configure monitoring of your Azure infrastructure with the Datadog extension. For more information, see the [Datadog blog](https://www.datadoghq.com/blog/introducing-azure-monitoring-with-one-click-datadog-deployment/).
- Configure an Azure virtual machine by using Chef. For more information, see [Automating Azure virtual machine deployment with Chef](../windows/chef-automation.md).

In addition to process-specific extensions, a Custom Script extension is available for both Windows and Linux virtual machines. The Custom Script extension for Windows allows any PowerShell script to be run on a virtual machine. This is useful when you're designing Azure deployments that require configuration beyond what native Azure tooling can provide. For more information, see [Windows VM Custom Script extension](custom-script-windows.md).


## Prerequisites

Each virtual machine extension may have its own set of prerequisites. For instance, some extensions are only designed to work on Windows Server and not Windows Client OS's. Requirements of individual extensions are detailed in the extension-specific documentation.

### Azure VM agent
The Azure VM agent manages interaction between an Azure virtual machine and the Azure fabric controller. The VM agent is responsible for many functional aspects of deploying and managing Azure virtual machines, including running VM extensions. The Azure VM agent is preinstalled on Azure Marketplace images and can be installed on supported operating systems. The Azure VM Agent for Windows is known as the Windows Guest agent.

For information on supported operating systems and installation instructions, see [Azure virtual machine agent](agent-windows.md).

#### Supported Agent Versions
In order to provide the best possible experience for our customers, there are minimum versions of the agent, please see this [article](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support).

#### Supported OSs
The Windows Guest agent will run on multiple OS's, however the extensions framework has a limit on for the OS's that extensions could possibly run on, please see this [article] (https://support.microsoft.com/en-us/help/4078134/azure-extension-supported-operating-systems
). 
It must be noted that some extensions will not be supported across all of these and will emit Error Code 51, 'Unsupported OS'. You need to check the induvidual extension documentation for supportability. 

#### Network Access
Extension packages are downloaded from the Azure storage Extension repositry, and extension status uploads are posted to Azure storage. If you are using [non-supported](https://support.microsoft.com/en-us/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support) version of the agents, you do not need to allow access to Azure storage in the VM region, as we can use the agent to redirect the communication to the Azure Fabric Controller for agent communications. If you are on a non-supported version of the agent, you will need to allow outbound access to Azure storage in that region from the VM. 

If you have blocked access to 168.63.129.16 using the guest firewall, then extensions will fail irrespective of the above. 

It should be noted that the agents can only be used for downloading extension packages and reporting status, for example, if an extension installs and needs to download a script from github (Custom Script) or needs access to Azure Storage (Azure Backup), then additional firewall/nsg ports need to be opened. Different extensions will have different requirements, since they are applications in their own right. For extensions that require access to Azure Storage you can allow access using Azure NSG Service Tags for [Storage](https://docs.microsoft.com/en-us/azure/virtual-network/security-overview#service-tags).

The Windows Guest Agent does not have proxy server support for you to redirect agent traffic requests through.

## Discover VM extensions
Many different VM extensions are available for use with Azure virtual machines. To see a complete list, run the following command with the Azure Resource Manager PowerShell module. Make sure to specify the desired location when you're running this command.

```powershell
Get-AzureRmVmImagePublisher -Location WestUS | `
Get-AzureRmVMExtensionImageType | `
Get-AzureRmVMExtensionImage | Select Type, Version
```

## Run VM extensions

Azure virtual machine extensions can be run on existing virtual machines, which is useful when you need to make configuration changes or recover connectivity on an already deployed VM. VM extensions can also be bundled with Azure Resource Manager template deployments of new deployments. By using extensions with Resource Manager templates, you can enable Azure virtual machines to be deployed and configured without the need for post-deployment intervention.

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

The following example uses the Custom Script extension to download a script from a GitHub repository onto the target virtual machine and then run the script. For more information on the Custom Script extension, see [Custom Script extension overview](custom-script-windows.md).

```powershell
Set-AzureRmVMCustomScriptExtension -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" -Name "myCustomScript" `
    -FileUri "https://raw.githubusercontent.com/neilpeterson/nepeters-azure-templates/master/windows-custom-script-simple/support-scripts/Create-File.ps1" `
    -Run "Create-File.ps1" -Location "West US"
```

In this example, the VM Access extension is used to reset the administrative password of a Windows virtual machine to a temporary password. For more information on the VM Access extension, see [Reset Remote Desktop service in a Windows VM](../windows/reset-rdp.md). Once you have run this, you should reset the password at first login.

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

![Install antimalware extension](./media/features-windows/installantimalwareextension.png)

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
    "typeHandlerVersion": "1.9",
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

For more information, see [Authoring Azure Resource Manager templates with Windows VM extensions](../windows/template-description.md#extensions).

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
    "typeHandlerVersion": "1.9",
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
    "typeHandlerVersion": "1.9",
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
### How do Agents and Extensions get updated?
The Agents and Extensions share the same update mechanism, with some differences, updates do not require additional firewall rules. 

When an update is available, this will only get installed on the VM when there is a change to extensions, and other VM Model changes, for example:
* Data disks
* Extensions
* Boot diagnostics container
* Guest OS secrets
* VM size
* Network profile

As part of safe deployment practice, publishers will make updates available to regions at different times, so it is possible you can have VMs in different regions on different versions.

#### Listing Extensions Deployed to a VM
```powerShell
$vm = Get-AzureRmVM -ResourceGroupName <rgName> -VMName <vmName>
$vm.Extensions | select Publisher, VirtualMachineExtensionType, TypeHandlerVersion
```

```text

Publisher             VirtualMachineExtensionType          TypeHandlerVersion                 ---------             ---------------------------          ------------------                Microsoft.Compute     CustomScriptExtension                1.9    
```


#### Agent updates
The Windows Guest Agent only contains Extension Handling code, the Windows Provisioning code is separate, and therefore you can uninstall the Windows Guest Agent. You cannot disable the automatic update of the Window Guest Agent.

The Extension Handling code is responsible communicating to the Azure Fabric, and handling the VM Extensions, such as installing them, reporting status, updating the induvidual extensions, and removing them. Updates will contain security fixes, bug fixes and enhancements to the Extension Handling code.

To check what version you are running, see [Detecting installed Windows Guest Agent](\agent-user-guide#detect-the-vm-agent).

#### Extension updates
When an extension update is available the Windows Guest Agent will download this, and upgrade the extension to this version. Automatic extension updates are either Minor or Hotfix, you can opt in or opt out of extensions Minor updates when you provision the extension, the example shows this in an ARM template, '"autoUpgradeMinorVersion": true,'.

```json
    "properties": {
    "publisher": "Microsoft.Compute",
    "type": "CustomScriptExtension",
    "typeHandlerVersion": "1.9",
    "autoUpgradeMinorVersion": true,
    "settings": {
        "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
        ]
    },
```
It is highly recommended that you always select auto update in your extension deployments, this will allow you to get the latest minor release bug fixes. Hotfix updates that carry security or key bug fixes cannot be opt out.

### How to Identify Extension Updates
#### Identifying if the Extension is set with autoUpgradeMinorVersion on a VM

You can see from the VM model, if the extension was provisioned with 'autoUpgradeMinorVersion' using:

```powerShell
 $vm = Get-AzureRmVM -ResourceGroupName w2016dc -VMName wincli1
 $vm.Extensions
```

VM extension resources:
```
ForceUpdateTag              :
Publisher                   : Microsoft.Compute
VirtualMachineExtensionType : CustomScriptExtension
TypeHandlerVersion          : 1.9
AutoUpgradeMinorVersion     : True
```

#### Identifying when an autoUpgradeMinorVersion occurred

Look at the agent logs on the VM, these will show when an update to the extension occured.

Log file: C:\WindowsAzure\Logs\WaAppAgent.log

In the example below, the VM had Microsoft.Compute.CustomScriptExtension installed. A hotfix was available to it, 1.9, below shows the pattern of events where the Windows Guest Agent is selecting 1.9 at the version to use.
```text
[INFO]  Getting plugin locations for plugin 'Microsoft.Compute.CustomScriptExtension'. Current Version: '1.8', Requested Version: '1.9'
[INFO]  Auto-Upgrade mode. Highest public version for plugin 'Microsoft.Compute.CustomScriptExtension' with requested version: '1.9', is: '1.9'
```

## Agent Permissions
The agent will need to run as Local System in order to perform its tasks.

## Troubleshoot VM extensions

Each VM extension may have troubleshooting steps specific to the extension. For example, when you're using the Custom Script extension, script execution details can be found locally on the virtual machine on which the extension was run. Any extension-specific troubleshooting steps are detailed in extension-specific documentation.

The following troubleshooting steps apply to all virtual machine extensions.

1. Check the Windows Guest Agent Log, look at the activity when your extension was being provisioned : C:\WindowsAzure\Logs\WaAppAgent.txt

2. Check the actual extension logs for more details : C:\WindowsAzure\Logs\Plugins\<extensionName>

3. Check extension specific documentation troubleshooting sections for error codes, known issues etc.

3. Look at the system logs, check for other operations that may have interferred with the extendion, such as a long running installation of another application that required exclusive package manager access.

### Common Reasons for Extension Failures
1. Extensions have 20mins to run (exceptions CustomScript Extensions, Chef, DSC that have 90mins), so if your deployment exceeds this, it will be marked as a timeout. The cause of this can be due to low resource VMs, other VM configurations/start up tasks consuming high amounts of resource whilst the extension is trying to provision.

2. Minimum prerequistes not met, some extensions will have dependencies on VM SKUs, for example HPC images, other extensions may require certain networking access requirements, such as communicating to Azure Storage, public services etc. Other examples could be access to package repositries, running out of disk space, security restrictions.

3. Exclusive package manager access, in some cases you may get a long running VM configuration and extension installation conflicting, where they both need exclusive access to the package manager. 


### View extension status

After a virtual machine extension has been run against a virtual machine, use the following PowerShell command to return extension status. Substatuses[0] shows that the extension provisioning succeeded, meaning that it successful deployed to the VM, but the execution of the extension inside the VM failed, Substatuses[1].

```PowerShell
Get-AzureRmVM -ResourceGroupName w2016dc -VMName wincli1 -Status 
```

The output looks like the following:

```text
Extensions[0]           :
  Name                  : CustomScriptExtension
  Type                  : Microsoft.Compute.CustomScriptExtension
  TypeHandlerVersion    : 1.9
  Substatuses[0]        :
    Code                : ComponentStatus/StdOut/succeeded
    Level               : Info
    DisplayStatus       : Provisioning succeeded
    Message             : Windows PowerShell \nCopyright (C) Microsoft Corporation. All rights reserved.\n
  Substatuses[1]        :
    Code                : ComponentStatus/StdErr/succeeded
    Level               : Info
    DisplayStatus       : Provisioning succeeded
    Message             : The argument 'cseTest%20Scriptparam1.ps1' to the -File parameter does not exist. Provide the path to an existing '.ps1' file as an argument to the

-File parameter.
  Statuses[0]           :
    Code                : ProvisioningState/failed/-196608
    Level               : Error
    DisplayStatus       : Provisioning failed
    Message             : Finished executing command                                      
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
| Custom Script Extension for Windows |Run scripts against an Azure virtual machine |[Custom Script Extension for Windows](custom-script-windows.md) |
| DSC Extension for Windows |PowerShell DSC (Desired State Configuration) Extension |[DSC Extension for Windows](dsc-overview.md) |
| Azure Diagnostics Extension |Manage Azure Diagnostics |[Azure Diagnostics Extension](https://azure.microsoft.com/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) |
| Azure VM Access Extension |Manage users and credentials |[VM Access Extension for Linux](https://azure.microsoft.com/en-us/blog/using-vmaccess-extension-to-reset-login-credentials-for-linux-vm/) |
