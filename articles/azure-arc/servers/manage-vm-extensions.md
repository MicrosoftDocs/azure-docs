---
title: VM extension management with Azure Arc for servers
description: Azure Arc for servers (preview) can manage deployment of virtual machine extensions that provide post-deployment configuration and automation tasks with non-Azure VMs.
ms.date: 06/02/2020
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
|Log Analytics agent |Microsoft.EnterpriseCloud.Monitoring |[Log Analytics VM extension for Windows](../../virtual-machines/extensions/oms-windows.md)<br> [Log Analytics VM extension for Linux](../../virtual-machines/extensions/oms-linux.md) |
|Microsoft Dependency agent | Microsoft.Compute | [Dependency agent virtual machine extension for Windows](../../virtual-machines/extensions/agent-dependency-windows.md)<br> [Dependency agent virtual machine extension for Linux](../../virtual-machines/extensions/agent-dependency-linux.md) |

We also support the Dependency Agent extension for AzMon for VMs - so I need to take the extension template and tweak to reflect the proper resource type and we need to explain tie-in to each service and summarize benefit/capability. Auto-update is same experience on a minor update of the extension when released, just like Azure VM.

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

If they are not already registered, follow the steps under [Register Azure resource providers](agent-overview.md#register-azure-resource-providers). 

### Connected Machine agent

Verify your machine matches the [supported versions](agent-overview.md#supported-operating-systems) of Windows and Linux operating system for the Azure Connected Machine agent.

The minimum version of the Connected Machine agent that is supported with this feature is:

* Windows - 0.7.x
* Linux - 0.8.x

To upgrade your machine to the version of the agent required, see [Upgrade agent](manage-agent.md#upgrading-agent).

## Enable extensions from the portal

VM extensions can be applied your Arc for server (preview) managed machine through the Azure portal.

1. From your browser, go to the [Azure portal](https://aka.ms/arcserver-preview). 

2. In the portal, browse to **Machines - Azure Arc** and select your hybrid machine from the list.

3. Choose **Extensions**, then select **Add**. Choose the extension you want from the list of available extensions and follow the instructions in the wizard.

    ![Select VM extension for selected machine](./media/manage-vm-extensions/add-vm-extensions.png)

    The following example shows the installation of the Log Analytics VM extension from the Azure portal:

    ![Install Log Analytics VM extension](./media/manage-vm-extensions/mma-extension-config.png)

4. After confirming the required information provided, select **Create**. A summary of the deployment is displayed and you can review the status of the deployment.

## Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. With the VM extensions supported by Arc for servers (preview), you can deploy the supported VM extension on Linux or Windows machines using Azure PowerShell. Each sample includes a template file and a parameters file with sample values to provide to the template.

### Deploy the Log Analytics VM extension

To easily deploy the Log Analytics agent, the following sample is provided to install the agent on either Windows or Linux.

#### Template file for Linux

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        },
        "location": {
            "type": "string"
        },
        "workspaceId": {
            "type": "string"
        },
        "workspaceKey": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'),'/OMSAgentForLinux')]",
            "type": "Microsoft.HybridCompute/machines/extensions",
            "location": "[parameters('location')]",
            "apiVersion": "2019-08-02-preview",
            "properties": {
                "publisher": "Microsoft.EnterpriseCloud.Monitoring",
                "type": "OmsAgentForLinux",
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

#### Template file for Windows

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        },
        "location": {
            "type": "string"
        },
        "workspaceId": {
            "type": "string"
        },
        "workspaceKey": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'),'/MicrosoftMonitoringAgent')]",
            "type": "Microsoft.HybridCompute/machines/extensions",
            "location": "[parameters('location')]",
            "apiVersion": "2019-08-02-preview",
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

### Deploy the Custom Script Extension

To use the Custom Script Extension, the following sample is provided to run on Windows and Linux. If you are unfamiliar with the Custom Script extension, see [Custom Script extension for Windows](../../virtual-machines/extensions/custom-script-windows.md) or [Custom Script Extension for Linux](../../virtual-machines/extensions/custom-script-linux.md). There are a couple of differing characteristics that you should understand when using this extension with hybrid machines:

* The list of supported operating systems with the Azure VM Custom Script extension is not applicable to Azure Arc for servers. The list of supported OSs for Arc for servers can be found [here](agent-overview.md#supported-operating-systems).

* Configuration details regarding Azure Virtual Machine Scale Sets or Classic VMs are not applicable.

* If your machines need to download a script externally and can only communicate through a proxy server, you need to [configure the Connected Machine agent](manage-agent.md#update-or-remove-proxy-settings) to set the proxy server envionmental variable.

The Custom Script Extension configuration specifies things like script location and the command to be run. This configuration is specified in an Azure Resource Manager template, provided below for both Linux and Windows hybrid machines.

#### Template file for Linux

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "fileUris": {
      "type": "array"
    },
    "commandToExecute": {
      "type": "securestring"
    }
  },
  "resources": [
    {
      "name": "[concat(parameters('vmName'),'/CustomScript')]",
      "type": "Microsoft.HybridCompute/machines/extensions",
      "location": "[parameters('location')]",
      "apiVersion": "2019-08-02-preview",
      "properties": {
        "publisher": "Microsoft.Azure.Extensions",
        "type": "CustomScript",
        "autoUpgradeMinorVersion": true,
        "settings": {},
        "protectedSettings": {
          "commandToExecute": "[parameters('commandToExecute')]",
          "fileUris": "[parameters('fileUris')]"
        }
      }
    }
  ]
}
```

#### Template file for Windows

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        },
        "location": {
            "type": "string"
        },
        "fileUris": {
            "type": "string"
        },
        "arguments": {
            "type": "securestring",
            "defaultValue": " "
        }
    },
    "variables": {
        "UriFileNamePieces": "[split(parameters('fileUris'), '/')]",
        "firstFileNameString": "[variables('UriFileNamePieces')[sub(length(variables('UriFileNamePieces')), 1)]]",
        "firstFileNameBreakString": "[split(variables('firstFileNameString'), '?')]",
        "firstFileName": "[variables('firstFileNameBreakString')[0]]"
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'),'/CustomScriptExtension')]",
            "type": "Microsoft.HybridCompute/machines/extensions",
            "location": "[parameters('location')]",
            "apiVersion": "2019-08-02-preview",
            "properties": {
                "publisher": "Microsoft.Compute",
                "type": "CustomScriptExtension",
                "autoUpgradeMinorVersion": true,
                "settings": {
                    "fileUris": "[split(parameters('fileUris'), ' ')]"
                },
                "protectedSettings": {
                    "commandToExecute": "[concat ('powershell -ExecutionPolicy Unrestricted -File ', variables('firstFileName'), ' ', parameters('arguments'))]"
                }
            }
        }
    ]
}
```

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {}
    ],
    "steps": [
      {
        "name": "customScriptExt",
        "label": "Add Custom Script Extension",
        "elements": [
          {
            "name": "fileUris",
            "type": "Microsoft.Common.FileUpload",
            "label": "Script files",
            "toolTip": "The script files that will be downloaded to the virtual machine.",
            "constraints": {
              "required": false
            },
            "options": {
              "multiple": true,
              "uploadMode": "url"
            },
            "visible": true
          },
          {
            "name": "commandToExecute",
            "type": "Microsoft.Common.TextBox",
            "label": "Command",
            "defaultValue": "sh script.sh",
            "toolTip": "The command to execute, for example: sh script.sh",
            "constraints": {
              "required": true
            },
            "visible": true
          }
        ]
      }
    ],
    "outputs": {
      "vmName": "[vmName()]",
      "location": "[location()]",
      "fileUris": "[steps('customScriptExt').fileUris]",
      "commandToExecute": "[steps('customScriptExt').commandToExecute]"
    }
  }
}
```

## Next steps

- Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [Azure Monitor with VMs](../../azure-monitor/insights/vminsights-enable-at-scale-policy.md), and much more.

- Learn more about the [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to proactively monitor the OS and workloads running on the machine, manage it using Automation runbooks or solutions like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-intro.md).