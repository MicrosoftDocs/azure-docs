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

Azure Resource Groups can be exported into a Resource Manager template that can then be redeployed. The export process interprets existing resources and configurations, and create a Resource Manager template that when deployed results in a similar Resource Group. When using the Resource Group export option against a Resource Group containing Virtual Machine extensions, several items need to be considered such as extension compatibility and secured settings.

This document details how the Resource Group export process works regarding virtual machine extensions, including a list of supported extension, and details on handling secured data.

## Supported Virtual Machine Extensions

Many Virtual Machine extensions are available. However not all extensions can be exported into a Resource Manager template using the “Automation Script” feature. If a VM extension is not supported, it needs to be manually placed back into the exported template.

The following extensions can be exported with the automation Script feature.

| Extension ||||
|---|---|---|---|
| Acronis Backup | Datadog Windows Agent | OS Patching For Linux | VM Snapshot Linux
| Acronis Backup Linux | Docker Extension | Puppet Agent |
| Bg Info | DSC Extension | Site 24x7 Apm Insight |
| BMC CTM Agent Linux | Dynatrace Linux | Site 24x7 Linux Server |
| BMC CTM Agent Windows | Dynatrace Windows | Site 24x7 Windows Server |
| Chef Client | HPE Security Application Defender | Trend Micro DSA |
| Custom Script | IaaS Antimalware | Trend Micro DSA Linux |
| Custom Script Extension | IaaS Diagnostics | VM Access For Linux |
| Custom Script for Linux | Linux Chef Client | VM Access For Linux |
| Datadog Linux Agent | Linux Diagnostic | VM Snapshot |

## Export the Resource Group

To export a Resource Group into a reuseable template, complete the following steps:

1. Sign in to the Azure portal
2. On the Hub Menu, click Resource Groups
3. Select the resource group from the list
4. In the Resource Group blade, click Automation Script

![Template Export](./media/virtual-machines-windows-extensions-export-templates/template-export.png)

The Azure Resource Manager automations script produces a Resource Manager template, a parameters file, and several sample deployment scripts such as PowerShell and CLI. At this point, the automation assets can be downloaded using the download button, added as a new template to the template library, or redeployed using the deploy button.

## Configure protected settings

Many Azure virtual machine extensions include a protected settings configuration, that encrypts sensitive data such as credentials and configuration strings. Protected settings are not exported with the automation script. If required, protected settings will need to be re-inserted into the exported templated.

### Step 1 - Remove exported parameter

When the Resource Group is exported, a single parameter is created to provide a value to the extension resource. This parameter can be removed.  To remove the parameter, look through the parameter list and delete the parameter that looks similar to this JSON example.

```json
"extensions_extensionname_protectedSettings": {
	"defaultValue": null,
	"type": "SecureObject"
}
```

New parameters may be created once the extensions protected settings has been reconfigured.

### Step 2 - Get protected settings properties

Because each protected setting has a set of required properties, a list of these properties need to be gathered. Each parameter of the protected configuration can be found in the [Azure Resource Manager schema on GitHub](https://raw.githubusercontent.com/Azure/azure-resource-manager-schemas/master/schemas/2015-08-01/Microsoft.Compute.json). This schema only includes the parameter sets for the extensions listed in the overview section of this document. 

From within the schema repository, search for the desired extension, for this example `IaaSDiagnostics`. Once the extension `protectedSettings` object has been located, take note of each parameter. In the example of the `IaasDiagnostic` extension, the require parameters are `storageAccountName`, `storageAccountKey`, and `storageAccountEndPoint`.

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

### Step 3 - Re-create the protected configuration

On the exported template, search for `protectedSettings` and replace the extensions protected setting object with a new one that includes the required parameters and a value for each parameter. If using a template variable or template parameter for the property values, these need to be created. When creating parameters for protected setting values, make sure to use the `SecureObject` type so that the sensitive values are secured. For more information on using variables and parameters, see [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md). 

In the example of the `IaasDiagnostic` extension, the protected setting would look like the following example:

```json
"protectedSettings": {
	"storageAccountName": "[parameters('storageAccountName')]",
	"storageAccountKey": "[parameters('storageAccountKey')]",
	"storageAccountEndPoint": "https://core.windows.net"
}
```

The final extension resource looks similar to the following JSON example:

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
			"storageAccountName": "[parameters('storageAccountName')]",
			"storageAccountKey": "[parameters('storageAccountKey')]",
			"storageAccountEndPoint": "https://core.windows.net"
		}
	}
}
```

At this point, the template can be deployed using any template deployment method.