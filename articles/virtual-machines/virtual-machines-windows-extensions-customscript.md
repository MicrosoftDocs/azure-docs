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

## Template example for a Windows VM

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

### Property values

| Name | Value / Example |
| ---- | ---- |
| apiVersion | 2015-06-15 |
| publisher | Microsoft.Compute |
| type | extensions |
| typeHandlerVersion | 1.4 |
| fileUris (e.g) | https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1 |
| commandToExecute (e.g) | powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 |

## Template deployment

## PowerShell deployment

## Troubleshoot and support

### Troubleshoot

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/en-us/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/en-us/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/en-us/support/faq/).


