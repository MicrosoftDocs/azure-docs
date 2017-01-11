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
ms.date: 01/11/2017
ms.author: nepeters

---
# Custom Script Extension for Windows

The Custom Script Extension downloads and executes scripts on Azure virtual machines. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or other accessible internet location, or provided to the extension run time. The Custom Script extension integrates with Azure Resource Manager templates, and can also be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API.

This document details how to use the Custom Script Extension using the Azure PowerShell module, Azure Resource Manager templates, and details troubleshooting steps on Windows systems.

## Prerequisites

### Operating System

The Custom Script Extension for Windows can be run against Windows Server 2008 R2, 2012, 2012 R2, and 2016 releases.

### Internet Connectivity

The Custom Script Extension for Windows requires that the target virtual machine is connected to the internet. 

## Extension schema

The following JSON shows the schema for the Custom Script Extension. The extension will require a script location (GitHub or in Azure Storage), and a command to execute. If using Azure Storage as the script source an Azure storage account name and account key will be required. These items should be treated as sensitive data and specified in the extensions protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine.

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
			"commandToExecute": "Script execution command",
            "storageAccountName": "yourStorageAccountName",
            "storageAccountKey": "yourStorageAccountKey"
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

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Custom Script Extension during an Azure Resource Manager template deployment. A sample template that includes the Custom Script Extension can be found here, [GitHub](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-windows).

## PowerShell deployment

The `Set-AzureRmVMCustomScriptExtension` command can be used to add the Custom Script extension to an existing virtual machines. For more information, see [Set-AzureRmVMCustomScriptExtension
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

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure PowerShell Module.

```powershell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

Extension execution output us logged to files found in the following directory:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.Compute.CustomScriptExtension
```

The script itself is downloaded into the following directory:

```cmd
C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.8\Downloads
```

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/en-us/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/en-us/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/en-us/support/faq/).


