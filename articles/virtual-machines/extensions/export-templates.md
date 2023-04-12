---
title: Exporting Azure Resource Groups that contain VM extensions 
description: Export Resource Manager templates that include virtual machine extensions.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.reviewer: erd
ms.collection: windows
ms.date: 03/29/2023

---

# Exporting Resource Groups that contain VM extensions

Azure Resource Groups can be exported into a new Resource Manager template that can then be redeployed. The export process interprets existing resources, and creates a Resource Manager template that when deployed results in a similar Resource Group. When using the Resource Group export option against a Resource Group containing Virtual Machine extensions, several items need to be considered such as extension compatibility and protected settings.

This document details how the Resource Group export process works regarding virtual machine extensions, including a list of supported extensions, and details on handling secured data.

## Supported Virtual Machine Extensions

Many Virtual Machine extensions are available. Not all extensions can be exported into a Resource Manager template using the “Automation Script” feature. If a virtual machine extension is not supported, it needs to be manually placed back into the exported template.

The following extensions can be exported with the automation script feature.

> Acronis Backup, Acronis Backup Linux, Bg Info, BMC CTM Agent Linux, BMC CTM Agent Windows, Chef Client, Custom Script, Custom Script Extension, Custom Script for Linux, Datadog Linux Agent, Datadog Windows Agent, Docker Extension, DSC Extension, Dynatrace Linux, Dynatrace Windows, HPE Security Application Defender for Cloud, IaaS Antimalware, IaaS Diagnostics, Linux Chef Client, Linux Diagnostic, OS Patching For Linux, Puppet Agent, Site 24x7 Apm Insight, Site 24x7 Linux Server, Site 24x7 Windows Server, Trend Micro DSA, Trend Micro DSA Linux, VM Access For Linux, VM Access For Linux, VM Snapshot, VM Snapshot Linux

## Export the Resource Group

To export a Resource Group into a reusable template, complete the following steps:

1. Sign in to the Azure portal
2. On the Hub Menu, click Resource Groups
3. Select the target resource group from the list
4. In the Resource Group blade, select **Export template** under the **Automation** section

![Template Export](./media/export-templates/template-export.png)

The Azure Resource Manager automations script produces a Resource Manager template, a parameters file, and several sample deployment scripts such as PowerShell and Azure CLI. At this point, the exported template can be downloaded using the download button, added as a new template to the template library, or redeployed using the deploy button.

## Configure protected settings

Many Azure virtual machine extensions include a protected settings configuration, that encrypts sensitive data such as credentials and configuration strings. Protected settings are not exported with the automation script. If necessary, protected settings need to be reinserted into the exported templated.

### Step 1 - Remove template parameter

When the Resource Group is exported, a single template parameter is created to provide a value to the exported protected settings. This parameter can be removed. To remove the parameter, look through the parameter list and delete the parameter that looks similar to this JSON example.

```json
"extensions_extensionname_protectedSettings": {
	"defaultValue": null,
	"type": "SecureObject"
}
```

### Step 2 - Get protected settings properties

Because each protected setting has a set of required properties, a list of these properties need to be gathered. Each parameter of the protected settings configuration can be found in the [Azure Resource Manager schema on GitHub](https://raw.githubusercontent.com/Azure/azure-resource-manager-schemas/master/schemas/2015-08-01/Microsoft.Compute.json). This schema only includes the parameter sets for the extensions listed in the overview section of this document. 

From within the schema repository, search for the desired extension, for this example `IaaSDiagnostics`. Once the extensions `protectedSettings` object has been located, take note of each parameter. In the example of the `IaasDiagnostic` extension, the require parameters are `storageAccountName`, `storageAccountKey`, and `storageAccountEndPoint`.

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

On the exported template, search for `protectedSettings` and replace the exported protected setting object with a new one that includes the required extension parameters and a value for each one.

In the example of the `IaasDiagnostic` extension, the new protected setting configuration would look like the following example:

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

If using template parameters to provide property values, these need to be created. When creating template parameters for protected setting values, make sure to use the `SecureString` parameter type so that sensitive values are secured. For more information on using parameters, see [Authoring Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md).

In the example of the `IaasDiagnostic` extension, the following parameters would be created in the parameters section of the Resource Manager template.

```json
"storageAccountName": {
	"defaultValue": null,
	"type": "SecureString"
},
"storageAccountKey": {
	"defaultValue": null,
	"type": "SecureString"
}
```

At this point, the template can be deployed using any template deployment method.
