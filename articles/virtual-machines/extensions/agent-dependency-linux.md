---
title: Azure Monitor Dependency virtual machine extension for Linux 
description: Deploy the Azure Monitor Dependency agent on Linux virtual machine by using a virtual machine extension.
services: virtual-machines-linux
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/29/2019
ms.author: magoedte

---
# Azure Monitor Dependency virtual machine extension for Linux

The Azure Monitor for VMs Map feature gets its data from the Microsoft Dependency agent. The Azure VM Dependency agent virtual machine extension for Linux is published and supported by Microsoft. The extension installs the Dependency agent on Azure virtual machines. This document details the supported platforms, configurations, and deployment options for the Azure VM Dependency agent virtual machine extension for Linux.

## Prerequisites

### Operating system

The Azure VM Dependency agent extension for Linux can be run against the supported operating systems listed in the [Supported operating systems](../../azure-monitor/insights/vminsights-enable-overview.md#supported-operating-systems) section of the Azure Monitor for VMs deployment article.

## Extension schema

The following JSON shows the schema for the Azure VM Dependency agent extension on an Azure Linux VM. 

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "The name of existing Linux Azure VM."
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
      "dependsOn": [
      ],
      "properties": {
        "publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
        "type": "DependencyAgentLinux",
        "typeHandlerVersion": "9.5",
        "autoUpgradeMinorVersion": true
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
| type | DependencyAgentLinux |
| typeHandlerVersion | 9.5 |

## Template deployment

You can deploy Azure VM extensions with Azure Resource Manager templates. You can use the JSON schema detailed in the previous section in an Azure Resource Manager template to run the Azure VM Dependency agent extension during an Azure Resource Manager template deployment.

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
        "type": "DependencyAgentLinux",
        "typeHandlerVersion": "9.5",
        "autoUpgradeMinorVersion": true
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
        "type": "DependencyAgentLinux",
        "typeHandlerVersion": "9.5",
        "autoUpgradeMinorVersion": true
	}
}
```

## Azure CLI deployment

You can use the Azure CLI to deploy the Dependency agent VM extension to an existing virtual machine.  

```azurecli

az vm extension set \
    --resource-group myResourceGroup \
    --vm-name myVM \
    --name DependencyAgentLinux \
    --publisher Microsoft.Azure.Monitoring.DependencyAgent \
    --version 9.5 
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command by using the Azure CLI:

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension execution output is logged to the following file:

```
/opt/microsoft/dependcency-agent/log/install.log 
```

### Support

If you need more help at any point in this article, contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Or, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get support**. For information about how to use Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
