---
title: Azure Monitor Dependency virtual machine extension for Windows
description: Deploy the Azure Monitor Dependency agent on Windows virtual machine by using a virtual machine extension.
ms.topic: article
ms.service: azure-monitor
ms.subservice: agents
author: guywi-ms
ms.author: guywild
ms.reviewer: erd
ms.collection: windows
ms.date: 08/29/2023
---
# Azure Monitor Dependency virtual machine extension for Windows

The Azure Monitor for VMs Map feature gets its data from the Microsoft Dependency agent. The Azure VM Dependency agent virtual machine extension for Windows installs the Dependency agent on Azure virtual machines. This document details the supported platforms, configurations, and deployment options for the Azure VM Dependency agent virtual machine extension for Windows.

## Operating system

The Azure VM Dependency agent extension for Windows can be run against the supported operating systems listed in the [Supported operating systems](../../azure-monitor/vm/vminsights-enable-overview.md#supported-operating-systems) section of the Azure Monitor for VMs deployment article.

## Extension schema

The following JSON shows the schema for the Azure VM Dependency agent extension on an Azure Windows VM.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "The name of existing Azure VM. Supported Windows Server versions:  2008 R2 and above (x64)."
      }
    }
  },
  "variables": {
    "vmExtensionsApiVersion": "2017-03-30"
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "[concat(parameters('vmName'),'/DAExtension')]",
      "apiVersion": "[variables('vmExtensionsApiVersion')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [],
      "properties": {
          "publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
          "type": "DependencyAgentWindows",
          "typeHandlerVersion": "9.10",
          "autoUpgradeMinorVersion": true,
          "settings": {
                "enableAMA": "true"
		    }
      }
    }
  ],
    "outputs": {
    }
}
```

### Property values

| Name | Value/Example |
| ---- | ---- |
| apiVersion | 2015-01-01 |
| publisher | Microsoft.Azure.Monitoring.DependencyAgent |
| type | DependencyAgentWindows |
| typeHandlerVersion | 9.10 |
| autoUpgradeMinorVersion | true |
| settings | "enableAMA": "true" |


> [!IMPORTANT]
> Be sure to add `enableAMA` to your template if you're using Azure Monitor Agent; otherwise, Dependency agent attempts to send data to the legacy Log Analytics agent.
## Template deployment

You can deploy the Azure VM extensions with Azure Resource Manager templates. You can use the JSON schema detailed in the previous section in an Azure Resource Manager template to run the Azure VM Dependency agent extension during an Azure Resource Manager template deployment.

The JSON for a virtual machine extension can be nested inside the virtual machine resource. Or, you can place it at the root or top level of a Resource Manager JSON template. The placement of the JSON affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/templates/child-resource-name-type.md).

The following example assumes the Dependency agent extension is nested inside the virtual machine resource. When you nest the extension resource, the JSON is placed in the `"resources": []` object of the virtual machine.


```json
{
	"type": "extensions",
	"name": "DAExtension",
	"apiVersion": "[variables('apiVersion')]",
	"location": "[resourceGroup().location]",
	"dependsOn": [
		"[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
	],
	"properties": {
      "publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
      "type": "DependencyAgentWindows",
      "typeHandlerVersion": "9.10",
      "autoUpgradeMinorVersion": true,
      "settings": {
            "enableAMA": "true"
    		    }
    }
}
```

When you place the extension JSON at the root of the template, the resource name includes a reference to the parent virtual machine. The type reflects the nested configuration.

```json
{
	"type": "Microsoft.Compute/virtualMachines/extensions",
	"name": "<parentVmResource>/DAExtension",
	"apiVersion": "[variables('apiVersion')]",
	"location": "[resourceGroup().location]",
	"dependsOn": [
		"[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
	],
	"properties": {
      "publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
      "type": "DependencyAgentWindows",
      "typeHandlerVersion": "9.10",
      "autoUpgradeMinorVersion": true,
      "settings": {
            "enableAMA": "true"
    		    }
	}
}
```

## PowerShell deployment

You can use the `Set-AzVMExtension` command to deploy the Dependency agent virtual machine extension to an existing virtual machine. Before you run the command, the public and private configurations need to be stored in a PowerShell hash table.

```powershell

Set-AzVMExtension -ExtensionName "Microsoft.Azure.Monitoring.DependencyAgent" `
    -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" `
    -Publisher "Microsoft.Azure.Monitoring.DependencyAgent" `
    -ExtensionType "DependencyAgentWindows" `
    -TypeHandlerVersion 9.10 `
    -Location WestUS
```

## Automatic extension upgrade
A new feature to [automatically upgrade minor versions](../automatic-extension-upgrade.md) of Dependency extension is now available.

To enable automatic extension upgrade for an extension, you must ensure the property `enableAutomaticUpgrade` is set to `true` and added to the extension template. This property must be enabled on every VM or VM scale set individually. Use one of the methods described in the [enablement](../automatic-extension-upgrade.md#enabling-automatic-extension-upgrade) section enable the feature for your VM or VM scale set.

When automatic extension upgrade is enabled on a VM or VM scale set, the extension is upgraded automatically whenever the extension publisher releases a new version for that extension. The upgrade is applied safely following availability-first principles as described [here](../automatic-extension-upgrade.md#how-does-automatic-extension-upgrade-work).

The `enableAutomaticUpgrade` attribute's functionality is different from that of the `autoUpgradeMinorVersion`. The  `autoUpgradeMinorVersion` attribute doesn't automatically trigger a minor version update when the extension publisher releases a new version. The `autoUpgradeMinorVersion` attribute indicates whether the extension should use a newer minor version if one is available at deployment time. Once deployed, however, the extension won't upgrade minor versions unless redeployed, even with this property set to true.

To keep your extension version updated, we recommend using `enableAutomaticUpgrade` with your extension deployment.

> [!IMPORTANT]
> If you add the `enableAutomaticUpgrade` to your template, make sure that you use at API version 2019-12-01 or higher.

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal and by using the Azure PowerShell module. To see the deployment state of extensions for a given VM, run the following command by using the Azure PowerShell module:

```powershell
Get-AzVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

Extension execution output is logged to files found in the following directory:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Monitoring.DependencyAgent\
```

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [Microsoft Q & A and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Or, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get support**. For information about how to use Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
