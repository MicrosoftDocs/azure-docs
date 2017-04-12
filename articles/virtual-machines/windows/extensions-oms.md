---
title: OMS Azure virtual machine extension for Windows | Microsoft Docs
description: Deploy the OMS agent on Windows virtual machine using a virtual machine extension.
services: virtual-machines-windows
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: feae6176-2373-4034-b5d9-a32c6b4e1f10
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/14/2017
ms.author: nepeters

---
# OMS virtual machine extension for Windows

Operations Management Suite (OMS) provides monitoring, alerting, and alert remediation capabilities across cloud and on-premises assets. The OMS Agent virtual machine extension for Windows is published and supported by Microsoft. The extension installs the OMS agent on Azure virtual machines, and enrolls virtual machines into an existing OMS workspace. This document details the supported platforms, configurations, and deployment options for the OMS virtual machine extension for Windows.

## Prerequisites

### Operating system
The OMS Agent extension for Windows can be run against Windows Server 2008 R2, 2012, 2012 R2, and 2016 releases.

### Internet connectivity
The OMS Agent extension for Windows requires that the target virtual machine is connected to the internet. 

## Extension schema

The following JSON shows the schema for the OMS Agent extension. The extension requires the workspace Id and workspace key from the target OMS workspace, these can be found in the OMS portal. Because the workspace key should be treated as sensitive data, it should be stored in a protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine. Note that **workspaceId** and **workspaceKey** are case-sensitive.

```json
{
	"type": "extensions",
	"name": "OMSExtension",
	"apiVersion": "[variables('apiVersion')]",
	"location": "[resourceGroup().location]",
	"dependsOn": [
		"[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
	],
	"properties": {
		"publisher": "Microsoft.EnterpriseCloud.Monitoring",
		"type": "MicrosoftMonitoringAgent",
		"typeHandlerVersion": "1.0",
		"autoUpgradeMinorVersion": true,
		"settings": {
			"workspaceId": "myWorkSpaceId"
		},
		"protectedSettings": {
			"workspaceKey": "myWorkspaceKey"
		}
	}
}
```
### Property values

| Name | Value / Example |
| ---- | ---- |
| apiVersion | 2015-06-15 |
| publisher | Microsoft.EnterpriseCloud.Monitoring |
| type | MicrosoftMonitoringAgent |
| typeHandlerVersion | 1.0 |
| workspaceId (e.g) | 6f680a37-00c6-41c7-a93f-1437e3462574 |
| workspaceKey (e.g) | z4bU3p1/GrnWpQkky4gdabWXAhbWSTz70hm4m2Xt92XI+rSRgE8qVvRhsGo9TXffbrTahyrwv35W0pOqQAU7uQ== |

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the OMS Agent extension during an Azure Resource Manager template deployment. A sample template that includes the OMS Agent VM extension can be found on the [Azure Quick Start Gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/201-oms-extension-windows-vm). 

The JSON for a virtual machine extension can be nested inside the virtual machine resource, or placed at the root or top level of a Resource Manager JSON template. The placement of the JSON affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/resource-manager-template-child-resource.md). 

The following example assumes the OMS extension is nested inside the virtual machine resource. When nesting the extension resource, the JSON is placed in the `"resources": []` object of the virtual machine.


```json
{
	"type": "extensions",
	"name": "OMSExtension",
	"apiVersion": "[variables('apiVersion')]",
	"location": "[resourceGroup().location]",
	"dependsOn": [
		"[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
	],
	"properties": {
		"publisher": "Microsoft.EnterpriseCloud.Monitoring",
		"type": "MicrosoftMonitoringAgent",
		"typeHandlerVersion": "1.0",
		"autoUpgradeMinorVersion": true,
		"settings": {
			"workspaceId": "myWorkSpaceId"
		},
		"protectedSettings": {
			"workspaceKey": "myWorkspaceKey"
		}
	}
}
```

When placing the extension JSON at the root of the template, the resource name includes a reference to the parent virtual machine, and the type reflects the nested configuration. 

```json
{
	"type": "Microsoft.Compute/virtualMachines/extensions",
	"name": "<parentVmResource>/OMSExtension",
	"apiVersion": "[variables('apiVersion')]",
	"location": "[resourceGroup().location]",
	"dependsOn": [
		"[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
	],
	"properties": {
		"publisher": "Microsoft.EnterpriseCloud.Monitoring",
		"type": "MicrosoftMonitoringAgent",
		"typeHandlerVersion": "1.0",
		"autoUpgradeMinorVersion": true,
		"settings": {
			"workspaceId": "myWorkSpaceId"
		},
		"protectedSettings": {
			"workspaceKey": "myWorkspaceKey"
		}
	}
}
```

## PowerShell deployment

The `Set-AzureRmVMExtension` command can be used to deploy the OMS Agent virtual machine extension to an existing virtual machine. Before running the command, the public and private configurations need to be stored in a PowerShell hash table. 

```powershell
$PublicSettings = @{"workspaceId" = "myWorkspaceId"}
$ProtectedSettings = @{"workspaceKey" = "myWorkspaceKey"}

Set-AzureRmVMExtension -ExtensionName "Microsoft.EnterpriseCloud.Monitoring" `
    -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" `
    -Publisher "Microsoft.EnterpriseCloud.Monitoring" `
    -ExtensionType "MicrosoftMonitoringAgent" `
    -TypeHandlerVersion 1.0 `
    -Settings $PublicSettings `
    -ProtectedSettings $ProtectedSettings `
    -Location WestUS ` 
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure PowerShell module. To see the deployment state of extensions for a given VM, run the following command using the Azure PowerShell module.

```powershell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

Extension execution output is logged to files found in the following directory:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\
```

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/en-us/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/en-us/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/en-us/support/faq/).
