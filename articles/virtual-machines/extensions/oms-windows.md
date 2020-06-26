---
title: Log Analytics virtual machine extension for Windows 
description: Deploy the Log Analytics agent on Windows virtual machine using a virtual machine extension.
services: virtual-machines-windows
documentationcenter: ''
author: axayjo
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: feae6176-2373-4034-b5d9-a32c6b4e1f10
ms.service: virtual-machines-windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 06/26/2020
ms.author: akjosh

---
# Log Analytics virtual machine extension for Windows

Azure Monitor Logs provides monitoring capabilities across cloud and on-premises assets. The Log Analytics agent virtual machine extension for Windows is published and supported by Microsoft. The extension installs the Log Analytics agent on Azure virtual machines, and enrolls virtual machines into an existing Log Analytics workspace. This document details the supported platforms, configurations, and deployment options for the Log Analytics virtual machine extension for Windows.

## Prerequisites

### Operating system

For details about the supported Windows operating systems, refer to the [Log Analytics agent overview](../../azure-monitor/platform/log-analytics-agent.md#supported-windows-operating-systems) article.

### Agent and VM Extension version
The following table provides a mapping of the version of the Windows Log Analytics VM extension and Log Analytics agent bundle for each release. 

| Log Analytics Windows agent bundle version | Log Analytics Windows VM extension version | Release Date | Release Notes |
|--------------------------------|--------------------------|--------------------------|--------------------------|
| 10.20.18038 | 1.0.18038 | April 2020   | <ul><li>Enables connectivity over Private Link using Azure Monitor Private Link Scopes</li><li>Adds ingestion throttling to avoid a sudden, accidental influx in ingestion to a workspace</li><li>Adds support for additional Azure Government clouds and regions</li><li>Resolves a bug where HealthService.exe crashed</li></ul> |
| 10.20.18029 | 1.0.18029 | March 2020   | <ul><li>Adds SHA-2 code signing support</li><li>Improves VM extension installation and management</li><li>Resolves a bug in Azure Arc for Servers integration</li><li>Adds a built-in troubleshooting tool for customer support</li><li>Adds support for additional Azure Government regions</li> |
| 10.20.18018 | 1.0.18018 | October 2019 | <ul><li> Minor bug fixes and stabilization improvements </li></ul> |
| 10.20.18011 | 1.0.18011 | July 2019 | <ul><li> Minor bug fixes and stabilization improvements </li><li> Increased MaxExpressionDepth to 10000 </li></ul> |
| 10.20.18001 | 1.0.18001 | June 2019 | <ul><li> Minor bug fixes and stabilization improvements </li><li> Added ability to disable default credentials when making proxy connection (support for WINHTTP_AUTOLOGON_SECURITY_LEVEL_HIGH) </li></ul>|
| 10.19.13515 | 1.0.13515 | March 2019 | <ul><li>Minor stabilization fixes </li></ul> |
| 10.19.10006 | n/a | Dec 2018 | <ul><li> Minor stabilization fixes </li></ul> | 
| 8.0.11136 | n/a | Sept 2018 |  <ul><li> Added support for detecting resource ID change on VM move </li><li> Added Support for reporting resource ID when using non-extension install </li></ul>| 
| 8.0.11103 | n/a |  April 2018 | |
| 8.0.11081 | 1.0.11081 | Nov 2017 | | 
| 8.0.11072 | 1.0.11072 | Sept 2017 | |
| 8.0.11049 | 1.0.11049 | Feb 2017 | |


### Azure Security Center

Azure Security Center automatically provisions the Log Analytics agent and connects it with the default Log Analytics workspace of the Azure subscription. If you are using Azure Security Center, do not run through the steps in this document. Doing so overwrites the configured workspace and break the connection with Azure Security Center.

### Internet connectivity
The Log Analytics agent extension for Windows requires that the target virtual machine is connected to the internet. 

## Extension schema

The following JSON shows the schema for the Log Analytics agent extension. The extension requires the workspace ID and workspace key from the target Log Analytics workspace. These can be found in the settings for the workspace in the Azure portal. Because the workspace key should be treated as sensitive data, it should be stored in a protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine. Note that **workspaceId** and **workspaceKey** are case-sensitive.

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
| workspaceId (e.g)* | 6f680a37-00c6-41c7-a93f-1437e3462574 |
| workspaceKey (e.g) | z4bU3p1/GrnWpQkky4gdabWXAhbWSTz70hm4m2Xt92XI+rSRgE8qVvRhsGo9TXffbrTahyrwv35W0pOqQAU7uQ== |

\* The workspaceId is called the consumerId in the Log Analytics API.

> [!NOTE]
> For additional properties see Azure [Connect Windows Computers to Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/agent-windows).

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Log Analytics agent extension during an Azure Resource Manager template deployment. A sample template that includes the Log Analytics agent VM extension can be found on the [Azure Quickstart Gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/201-oms-extension-windows-vm). 

>[!NOTE]
>The template does not support specifying more than one workspace ID and workspace key when you want to configure the agent to report to multiple workspaces. To configure the agent to report to multiple workspaces, see [Adding or removing a workspace](../../azure-monitor/platform/agent-manage.md#adding-or-removing-a-workspace).  

The JSON for a virtual machine extension can be nested inside the virtual machine resource, or placed at the root or top level of a Resource Manager JSON template. The placement of the JSON affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/templates/child-resource-name-type.md). 

The following example assumes the Log Analytics extension is nested inside the virtual machine resource. When nesting the extension resource, the JSON is placed in the `"resources": []` object of the virtual machine.


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

The `Set-AzVMExtension` command can be used to deploy the Log Analytics agent virtual machine extension to an existing virtual machine. Before running the command, the public and private configurations need to be stored in a PowerShell hash table. 

```powershell
$PublicSettings = @{"workspaceId" = "myWorkspaceId"}
$ProtectedSettings = @{"workspaceKey" = "myWorkspaceKey"}

Set-AzVMExtension -ExtensionName "MicrosoftMonitoringAgent" `
    -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" `
    -Publisher "Microsoft.EnterpriseCloud.Monitoring" `
    -ExtensionType "MicrosoftMonitoringAgent" `
    -TypeHandlerVersion 1.0 `
    -Settings $PublicSettings `
    -ProtectedSettings $ProtectedSettings `
    -Location WestUS 
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure PowerShell module. To see the deployment state of extensions for a given VM, run the following command using the Azure PowerShell module.

```powershell
Get-AzVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

Extension execution output is logged to files found in the following directory:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\
```

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
