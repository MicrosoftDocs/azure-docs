---
title: Azure Custom Script Extension for Windows | Microsoft Docs
description: Automate Windows VM configuration tasks by using the Custom Script extension
services: virtual-machines-windows
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f4181fee-7a9d-4a1c-b517-52956f5b7fa1
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 01/17/2017
ms.author: nepeters

---
# Custom Script Extension for Windows

The Custom Script Extension downloads and executes scripts on Azure virtual machines. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run time. The Custom Script extension integrates with Azure Resource Manager templates, and can also be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API.

This document details how to use the Custom Script Extension using the Azure PowerShell module, Azure Resource Manager templates, and details troubleshooting steps on Windows systems.

## Prerequisites

### Operating System

The Custom Script Extension for Windows can be run against Windows Server 2008 R2, 2012, 2012 R2, and 2016 releases.

### Script Location

The script needs to be stored in Azure storage, or any other location accessible through a valid URL.

### Internet Connectivity

The Custom Script Extension for Windows requires that the target virtual machine is connected to the internet. 

## Extension schema

The following JSON shows the schema for the Custom Script Extension. The extension requires a script location (Azure Storage or other location with valid URL), and a command to execute. If using Azure Storage as the script source, an Azure storage account name and account key is required. These items should be treated as sensitive data and specified in the extensions protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine.

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
		"typeHandlerVersion": "1.8",
		"autoUpgradeMinorVersion": true,
		"settings": {
			"fileUris": [
				"script location"
			]
		},
		"protectedSettings": {
			"commandToExecute": "myExecutionCommand",
            "storageAccountName": "myStorageAccountName",
            "storageAccountKey": "myStorageAccountKey"
		}
	}
}
```

### Property values

| Name | Value / Example |
| ---- | ---- |
| apiVersion | 2015-06-15 |
| publisher | Microsoft.Compute |
| type | extensions |
| typeHandlerVersion | 1.8 |
| fileUris (e.g) | https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1 |
| commandToExecute (e.g) | powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 |
| storageAccountName (e.g) | examplestorageacct |
| storageAccountKey (e.g) | TmJK/1N3AbAZ3q/+hOXoi/l73zOqsaxXDhqa9Y83/v5UpXQp2DQIBuv2Tifp60cE/OaHsJZmQZ7teQfczQj8hg== |

**Note** - these property names are case sensitive. Use the names as seen above to avoid deployment issues.

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Custom Script Extension during an Azure Resource Manager template deployment. A sample template that includes the Custom Script Extension can be found here, [GitHub](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-windows).

## PowerShell deployment

The `Set-AzureRmVMCustomScriptExtension` command can be used to add the Custom Script extension to an existing virtual machine. For more information, see [Set-AzureRmVMCustomScriptExtension
](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.compute/v2.1.0/set-azurermvmcustomscriptextension).
```powershell
Set-AzureRmVMCustomScriptExtension -ResourceGroupName myResourceGroup `
	-VMName myVM `
	-Location myLocation `
	-FileUri myURL `
	-Run 'myScript.ps1' `
	-Name DemoScriptExtension
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure PowerShell module. To see the deployment state of extensions for a given VM, run the following command.

```powershell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

Extension execution output is logged to files found under the following directory on the target virtual machine.
```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.Compute.CustomScriptExtension
```

The specified files are downloaded into the following directory on the target virtual machine.
```cmd
C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.*\Downloads\<n>
```
where `<n>` is a decimal integer which may change between executions of the extension.  The `1.*` value matches the actual, current `typeHandlerVersion` value of the extension.  For example, the actual directory could be `C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2`.  

When executing the `commandToExecute` command, the extension will have set this directory (e.g., `...\Downloads\2`) as the current working directory. This enables the use of relative paths to locate the files downloaded via the `fileURIs` property. See the table below for examples.

Since the absolute download path may vary over time, it is better to opt for relative script/file paths in the `commandToExecute` string, whenever possible. For example:
```json
	"commandToExecute": "powershell.exe . . . -File './scripts/myscript.ps1'"
```

Path information after the first URI segment is retained for files downloaded via the `fileUris` property list.  As shown in the table below, downloaded files are mapped into download subdirectories to reflect the structure of the `fileUris` values.  

#### Examples of Downloaded Files

| URI in fileUris | Relative downloaded location | Absolute downloaded location * |
| ---- | ------- |:--- |
| `https://someAcct.blob.core.windows.net/aContainer/scripts/myscript.ps1` | `./scripts/myscript.ps1` |`C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2\scripts\myscript.ps1`  |
| `https://someAcct.blob.core.windows.net/aContainer/topLevel.ps1` | `./topLevel.ps1` | `C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads\2\topLevel.ps1` |

\* As above, the absolute directory paths will change over the lifetime of the VM, but not within a single execution of the CustomScript extension.

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums]
(https://azure.microsoft.com/en-us/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/en-us/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/en-us/support/faq/).
