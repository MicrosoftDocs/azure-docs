---
title: Exporting Resource Groups that contain VM extensions | Microsoft Docs
description: Export Resource Manager templates that include virtual machine extensions.
services: virtual-machines-windows
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 7f4e2ca6-f1c7-4f59-a2cc-8f63132de279
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 11/28/2016
ms.author: nepeters
---

# Exporting Resource Groups that contain VM extensions

Azure Resource Groups can be exported into a Resource Manager template that can then be redeployed. The export process will interpret existing resources and configurations, and create a resource manager template that when deployed will result in a similar Resource Group. When using the Resource Group export option against a Resource Group containing Virtual Machine extensions, several items need to be considered such as extension compatibility, secured settings, and extension dependencies.

This document will detail how the Resource Group export process works regarding virtual machine extensions including a list of supported extension and details on handling secured data.

## Supported Virtual Machine Extensions

Many Virtual Machine extensions are available, however not all of them can be exported into a Resource Manager template using the “Automation Script” feature. If a VM extension is not supported, it will need to be manually placed back into the exported template.

The following extension can be exported with the automation Script feature.

- IaaS Diagnostics
- Iaas Antimalware
- Custom Script Extension for windows
- Custom Script Extension for Linux
- ..
- ..

## Export the Resource Group

To export a Resource Group into a re-useable template, complete the following:

1. Sign in to the Azure Portal
2. On the Hub Menu, click Resource Groups
3. Select the resource group from the list
4. In the Resource Group blade, click Automation Script

![Template Export](./media/virtual-machines-windows-extensions-export-templates/template-export.png)

The Azure Resource Manager automations script includes a Resource Manager template, a parameters file, and several sample deployment scripts such as PowerShell and CLI. At this point the automation assets can be downloaded using the download button, added as a new template to the template library, or re-deployed using the deploy button.

## Configure protected settings

Protected settings are not exported with the automation script. If the target resource group includes a virtual machine extension with a protected setting configuration, this will need to be manually re-configured. Modifications to the exported template can be made directly in the Azure portal, or on the downloaded template.

For this example, a Resource Group was deployed that includes a virtual machine and the diagnostic extension. When this deployment initially occurred the diagnostic extension resource included a protected setting configuration which held storage account information.

*Initial diagnostic extension:*

```json
{
	"name": "Microsoft.Insights.VMDiagnosticsSettings",
	"type": "extensions",
	"location": "[resourceGroup().location]",
	"apiVersion": "[variables('apiVersion')]",
	"dependsOn": [
		"[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
	],
	"tags": {
		"displayName": "AzureDiagnostics"
	},
	"properties": {
		"publisher": "Microsoft.Azure.Diagnostics",
		"type": "IaaSDiagnostics",
		"typeHandlerVersion": "1.5",
		"autoUpgradeMinorVersion": true,
		"settings": {
			"xmlCfg": "[base64(concat(variables('wadcfgxstart'), variables('wadmetricsresourceid'), variables('vmName'), variables('wadcfgxend')))]",
			"storageAccount": "[parameters('existingdiagnosticsStorageAccountName')]"
		},
		"protectedSettings": {
			"storageAccountName": "[parameters('existingdiagnosticsStorageAccountName')]",
			"storageAccountKey": "[listkeys(variables('accountid'), variables('apiVersion')).key1]",
			"storageAccountEndPoint": "https://core.windows.net"
		}
	}
}
```

Once exported using the automation script, all protected settings are replaced with a single parameter. This replacement can be seen in the below example. 

*Exported diagnostic extension:*

```json
{
	"comments": "Generalized from resource: '/subscriptions/d5b9d4b7-6fc1-46c5-bafe-38effaed19b2/resourceGroups/diagdemo01/providers/Microsoft.Compute/virtualMachines/MyWindowsVM/extensions/Microsoft.Insights.VMDiagnosticsSettings'.",
	"type": "Microsoft.Compute/virtualMachines/extensions",
	"name": "[parameters('extensions_Microsoft.Insights.VMDiagnosticsSettings_name')]",
	"apiVersion": "2016-03-30",
	"location": "westus",
	"tags": {
		"displayName": "AzureDiagnostics"
	},
	"properties": {
		"publisher": "Microsoft.Azure.Diagnostics",
		"type": "IaaSDiagnostics",
		"typeHandlerVersion": "1.5",
		"autoUpgradeMinorVersion": true,
		"settings": {
			"xmlCfg": "<truncated for docs",
			"storageAccount": "disgstor01"
		},
		"protectedSettings": "[parameters('extensions_Microsoft.Insights.VMDiagnosticsSettings_protectedSettings')]"
	},
	"resources": [],
	"dependsOn": [
		"[resourceId('Microsoft.Compute/virtualMachines', parameters('virtualMachines_MyWindowsVM_name'))]"
	]
}
```

When reconfiguring the protected settings configuration, the properties of the configuration may be needed. These can be found in the Azure Resource Manager schema repository, which is on [GitHub](https://raw.githubusercontent.com/Azure/azure-resource-manager-schemas/master/schemas/2015-08-01/Microsoft.Compute.json).

From within the schema repository, search for the desired extension, for this example `IaaSDiagnostics`. The listed properties can be used to re-build the protected settings configuration. Each required property will need to be defined for the protected setting and given a value. 

```json
"protectedSettings": {
	"type": "object",
	"properties": {
		"storageAccountName": {
			"type": "string"
		},
		"storageAccountKey": {
			"type": "string"
		},
		"storageAccountEndPoint": {
			"type": "string"
		}
	},
	"required": [
		"storageAccountName",
		"storageAccountKey",
		"storageAccountEndPoint"
	]
}
```

## Configure extension dependencies

When a Resource Group includes a VM extension, the exported copy will create a dependency for the extension on the virtual machine on which it will run. If a template deployment requires additional dependencies, these will need to be recreated.

For this example, a Resource Group was deployed that includes a Virtual Machine, an Azure SQL Database server, and the Virtual Machine Custom Script extension. The extension in this case has a dependency on both the virtual machine and the Azure SQL DB server. These dependencies can be seen in the below sample.  

*Initial custom script extension:*

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
			"commandToExecute": "<truncated for docs>"
		}
	}
}
```

Once exported, only the virtual machine dependency remains. In this case, the addition dependency will need to be manually re-configured.

*Exported custom script extension:*

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
			"commandToExecute": "<truncated for docs>"
		}
	}
}
```


