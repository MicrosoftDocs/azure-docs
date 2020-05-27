---
title: VM extension management with Azure Arc for servers
description: Azure Arc for servers (preview) can manage deployment of virtual machine extensions that provide post-deployment configuration and automation tasks with non-Azure VMs.
ms.date: 05/27/2020
ms.topic: conceptual
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
---

# Virtual machine extension management with Azure Arc for servers (preview)

Virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, anti-virus protection, or to run a script inside of it, a VM extension can be used. Azure Arc for servers (preview) enables you to deploy Azure VM extensions to non-Azure Windows and Linux VMs. 

VM extensions can be run with the Azure REST API, Azure Resource Manager templates, the Azure portal, or Azure policies on hybrid servers managed by Arc for servers (preview).

In this preview, we are supporting the following VM extensions on Windows and Linux machines.

|Extension |Publisher |Additional information |
|----------|----------|-----------------------|
|CustomScriptExtension |Microsoft.Compute |[Windows Custom Script Extension](../../virtual-machines/extensions/custom-script-windows.md)<br> [Linux Custom Script Extension Version 2](../../virtual-machines/extensions/custom-script-linux.md) |
|DSC |Microsoft.PowerShell|[Windows PowerShell DSC Extension](../../virtual-machines/extensions/dsc-windows.md)<br> [PowerShell DSC Extension for Linux](../../virtual-machines/extensions/dsc-linux.md) |
|MicrosoftMonitoringAgent |Microsoft.EnterpriseCloud.Monitoring |[Log Analytics VM extension for Windows](../../virtual-machines/extensions/oms-windows.md)<br> [Log Analytics VM extension for Linux](../../virtual-machines/extensions/oms-linux.md) |

>[!NOTE]
> VM extension functionality is available only in the following regions:
> * EastUS
> * WestUS2
> * WestEurope
>
> Ensure you onboard your machine in one of these regions.

VM extensions can be run with the Azure PowerShell, Azure Resource Manager templates, and the Azure portal.

## Prerequisite

This feature depends on the following Azure resource providers in your subscription:

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**

If they are not already registered, follow the steps under [Register Azure resource providers](overview.md#register-azure-resource-providers). 

### Connected Machine agent

Verify your machine matches the [supported versions](overview.md#supported-operating-systems) of Windows and Linux operating system for the Azure Connected Machine agent. 

The minimum version of the Connected Machine agent that is supported with this feature is:

* Windows - 0.7.x
* Linux - 0.8.x

To upgrade your machine to the version of the agent required, see [Upgrade agent](manage-agent.md#upgrading-agent).

## Enable extensions from the portal

VM extensions can be applied your Arc for server (preview) managed machine through the Azure portal.

1. From your browser, go to the [Azure portal](https://aka.ms/arcserver-preview). 

2. In the portal, browse to **Machines - Azure Arc** and select your hybrid machine from the list.

3. Choose **Extensions**, then select **Add**. Choose the extension you want from the list of available extensions and follow the instructions in the wizard.

The following example shows the installation of the Log Analytics VM extension from the Azure portal:

![Install Log Analytics VM extension](./media/manage-vm-extensions/mma-extension-config.png)

## Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. With the VM extensions supported by Arc for servers (preview), you can deploy the supported VM extension on Linux or Windows machines using Azure PowerShell. Each sample includes a template file and a parameters file with sample values to provide to the template.

### Deploy the Log Analytics VM extension

The following sample enables the Log Analytics agent for Windows.

#### Template file

```json
{ 
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "String"
        },
        "location": {
            "type": "String"
        },
        "workspaceId": {
            "type": "String"
        },
        "workspaceKey": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.HybridCompute/machines/extensions",
            "apiVersion": "2019-08-02-preview",
            "name": "[concat(parameters('vmName'),'/MicrosoftMonitoringAgent')]",
            "location": "[parameters('location')]",
            "properties": {
                "publisher": "Microsoft.EnterpriseCloud.Monitoring",
                "type": "MicrosoftMonitoringAgent",
                "autoUpgradeMinorVersion": true,
                "settings": {
                    "workspaceId": "[parameters('workspaceId')]"
                },
                "protectedSettings": {
                    "workspaceKey": "[parameters('workspaceKey')]"
                }
            }
        }
    ]
}
```

#### Parameter file

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "value": "<vmName>"
        },
        "location": {
            "value": "<region>"
        },
        "workspaceId": {
            "value": "<MyWorkspaceID>"
        },
        "workspaceKey": {
            "value": "<MyWorkspaceKey>"
        }
    }
}
```

This command creates a new deployment by using a custom template and a template file on disk. The command uses the *TemplateFile* parameter to specify the template and the *TemplateParameterFile* parameter to specify a file that contains parameters and parameter values.

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "ContosoEngineering" -TemplateFile "D:\Azure\Templates\LogAnalyticsAgentWin.json" -TemplateParameterFile "D:\Azure\Templates\LogAnalyticsAgentWinParms.json"
```
