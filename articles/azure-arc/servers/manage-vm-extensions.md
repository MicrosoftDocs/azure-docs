---
title: VM extension management with Azure Arc enabled servers
description: Azure Arc enabled servers can manage deployment of virtual machine extensions that provide post-deployment configuration and automation tasks with non-Azure VMs.
ms.date: 09/23/2020
ms.topic: conceptual
---

# Virtual machine extension management with Azure Arc enabled servers

Virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, anti-virus protection, or to run a script inside of it, a VM extension can be used.

Azure Arc enabled servers enables you to deploy Azure VM extensions to non-Azure Windows and Linux VMs, simplifying the management of your hybrid machine on-premises, edge, and other cloud environments through their lifecycle.

## Key benefits

Azure Arc enabled servers VM extension support provides the following key benefits:

* Use [Azure Automation State Configuration](../../automation/automation-dsc-overview.md) to centrally store configurations and maintain the desired state of hybrid connected machines enabled through the DSC VM extension.

* Collect log data for analysis with [Logs in Azure Monitor](../../azure-monitor/platform/data-platform-logs.md) enabled through the Log Analytics agent VM extension. This is useful for performing complex analysis across data from a variety of sources.

* With [Azure Monitor for VMs](../../azure-monitor/insights/vminsights-overview.md), analyzes the performance of your Windows and Linux VMs, and monitor their processes and dependencies on other resources and external processes. This is achieved through enabling both the Log Analytics agent and Dependency agent VM extensions.

* Download and execute scripts on hybrid connected machines using the Custom Script Extension. This extension is useful for post deployment configuration, software installation, or any other configuration or management tasks.

## Availability

VM extension functionality is available only in the list of [supported regions](overview.md#supported-regions). Ensure you onboard your machine in one of these regions.

## Extensions

In this release, we support the following VM extensions on Windows and Linux machines.

|Extension |OS |Publisher |Additional information |
|----------|---|----------|-----------------------|
|CustomScriptExtension |Windows |Microsoft.Compute |[Windows Custom Script Extension](../../virtual-machines/extensions/custom-script-windows.md)|
|DSC |Windows |Microsoft.PowerShell|[Windows PowerShell DSC Extension](../../virtual-machines/extensions/dsc-windows.md)|
|Log Analytics agent |Windows |Microsoft.EnterpriseCloud.Monitoring |[Log Analytics VM extension for Windows](../../virtual-machines/extensions/oms-windows.md)|
|Microsoft Dependency agent | Windows |Microsoft.Compute | [Dependency agent virtual machine extension for Windows](../../virtual-machines/extensions/agent-dependency-windows.md)|
|CustomScript|Linux |Microsoft.Azure.Extension |[Linux Custom Script Extension Version 2](../../virtual-machines/extensions/custom-script-linux.md) |
|DSC |Linux |Microsoft.OSTCExtensions |[PowerShell DSC Extension for Linux](../../virtual-machines/extensions/dsc-linux.md) |
|Log Analytics agent |Linux |Microsoft.EnterpriseCloud.Monitoring |[Log Analytics VM extension for Linux](../../virtual-machines/extensions/oms-linux.md) |
|Microsoft Dependency agent | Linux |Microsoft.Compute | [Dependency agent virtual machine extension for Linux](../../virtual-machines/extensions/agent-dependency-linux.md) |

VM extensions can be run with Azure Resource Manager templates, from the Azure portal, or Azure PowerShell on hybrid servers managed by Arc enabled servers.

To learn about the Azure Connected Machine agent package and details about the Extension agent component, see [Agent overview](agent-overview.md#agent-component-details).

## Prerequisites

This feature depends on the following Azure resource providers in your subscription:

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**

If they are not already registered, follow the steps under [Register Azure resource providers](agent-overview.md#register-azure-resource-providers).

The Log Analytics agent VM extension for Linux requires Python 2.x is installed on the target machine.

### Connected Machine agent

Verify your machine matches the [supported versions](agent-overview.md#supported-operating-systems) of Windows and Linux operating system for the Azure Connected Machine agent.

The minimum version of the Connected Machine agent that is supported with this feature on Windows and Linux is the 1.0 release.

To upgrade your machine to the version of the agent required, see [Upgrade agent](manage-agent.md#upgrading-agent).

## Enable extensions from the portal

VM extensions can be applied your Arc for server managed machine through the Azure portal.

1. From your browser, go to the [Azure portal](https://portal.azure.com).

2. In the portal, browse to **Servers - Azure Arc** and select your hybrid machine from the list.

3. Choose **Extensions**, then select **Add**. Choose the extension you want from the list of available extensions and follow the instructions in the wizard. In this example, we will deploy the Log Analytics VM extension.

    ![Select VM extension for selected machine](./media/manage-vm-extensions/add-vm-extensions.png)

    The following example shows the installation of the Log Analytics VM extension from the Azure portal:

    ![Install Log Analytics VM extension](./media/manage-vm-extensions/mma-extension-config.png)

    To complete the installation, you are required to provide the workspace ID and primary key. If you are not familiar with how to find this information, see [obtain workspace ID and key](../../azure-monitor/platform/log-analytics-agent.md#workspace-id-and-key).

4. After confirming the required information provided, select **Create**. A summary of the deployment is displayed and you can review the status of the deployment.

>[!NOTE]
>While multiple extensions can be batched together and processed, they are installed serially. Once the first extension installation is complete, installation of the next extension is attempted.

## Azure Resource Manager templates

VM extensions can be added to an Azure Resource Manager template and executed with the deployment of the template. With the VM extensions supported by Arc enabled servers, you can deploy the supported VM extension on Linux or Windows machines using Azure PowerShell. Each sample below includes a template file and a parameters file with sample values to provide to the template.

>[!NOTE]
>While multiple extensions can be batched together and processed, they are installed serially. Once the first extension installation is complete, installation of the next extension is attempted.

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

Save the template and parameter files to disk, and edit the parameter file with the appropriate values for your deployment. You can then install the extension on all the connected machines within a resource group with the following command. The command uses the *TemplateFile* parameter to specify the template and the *TemplateParameterFile* parameter to specify a file that contains parameters and parameter values.

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "ContosoEngineering" -TemplateFile "D:\Azure\Templates\LogAnalyticsAgentWin.json" -TemplateParameterFile "D:\Azure\Templates\LogAnalyticsAgentWinParms.json"
```

### Deploy the Custom Script Extension

To use the Custom Script Extension, the following sample is provided to run on Windows and Linux. If you are unfamiliar with the Custom Script extension, see [Custom Script extension for Windows](../../virtual-machines/extensions/custom-script-windows.md) or [Custom Script Extension for Linux](../../virtual-machines/extensions/custom-script-linux.md). There are a couple of differing characteristics that you should understand when using this extension with hybrid machines:

* The list of supported operating systems with the Azure VM Custom Script extension is not applicable to Azure Arc enabled servers. The list of supported OSs for Arc enabled servers can be found [here](agent-overview.md#supported-operating-systems).

* Configuration details regarding Azure Virtual Machine Scale Sets or Classic VMs are not applicable.

* If your machines need to download a script externally and can only communicate through a proxy server, you need to [configure the Connected Machine agent](manage-agent.md#update-or-remove-proxy-settings) to set the proxy server environmental variable.

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

### Deploy the PowerShell DSC Extension

To use the PowerShell DSC Extension, the following sample is provided to run on Windows and Linux. If you are unfamiliar with the PowerShell DSC extension, see [DSC extension handler overview](../../virtual-machines/extensions/dsc-overview.md). There are a couple of differing characteristics that you should understand when using this extension with hybrid machines:

* The list of supported operating systems with the Azure VM PowerShell DSC extension is not applicable to Azure Arc enabled servers. The list of supported OSs for Arc enabled servers can be found [here](agent-overview.md#supported-operating-systems).

* If your machines need to download a script externally and can only communicate through a proxy server, you need to [configure the Connected Machine agent](manage-agent.md#update-or-remove-proxy-settings) to set the proxy server environmental variable.

#### Template file for Linux

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string",
            "metadata": {
                "description": "Name of the vm, will be used as DNS Name for the Public IP used to access the Virtual Machine."
            }
        },
        "location": {
            "type": "string",
            "metadata": {
                "description": "Location for all resources."
            }
        },
        "mode": {
            "type": "string",
            "defaultValue": "Push",
            "metadata": {
                "description": "The functional mode, push MOF configuration (Push), distribute MOF configuration (Pull), install custom DSC module (Install)"
            },
            "allowedValues": [
                "Push",
                "Pull",
                "Install",
                "Register"
            ]
        },
        "fileUri": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "The uri of the MOF file/Meta MOF file/resource ZIP file"
            }
        },
        "registrationUrl": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "The URL of the Azure Automation account"
            }
        },
        "registrationKey": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "The access key of the Azure Automation account"
            }
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'),'/DSCForLinux')]",
            "type": "Microsoft.HybridCompute/machines/extensions",
            "location": "[parameters('location')]",
            "apiVersion": "2019-08-02-preview",
            "properties": {
                "publisher": "Microsoft.OSTCExtensions",
                "type": "DSCForLinux",
                "settings": {
                    "Mode": "[parameters('mode')]",
                    "FileUri": "[parameters('fileUri')]"
                },
                "protectedSettings": {
                    "RegistrationUrl": "[parameters('registrationUrl')]",
                    "RegistrationKey": "[parameters('registrationKey')]"
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
        "modulesUrl": {
            "type": "string"
        },
        "configurationFunction": {
            "type": "string"
        },
        "properties": {
            "type": "string",
            "defaultValue": ""
        },
        "dataBlobUri": {
            "type": "string",
            "defaultValue": ""
        },
        "wmfVersion": {
            "type": "string",
            "defaultValue": "latest",
            "allowedValues": [
                "4.0",
                "5.0",
                "5.1",
                "latest"
            ]
        },
        "privacy": {
            "type": "string",
            "defaultValue": ""
        },
        "autoUpdate": {
            "type": "bool",
            "defaultValue": false
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'),'/Microsoft.Powershell.DSC')]",
            "type": "Microsoft.HybridCompute/machines/extensions",
            "location": "[parameters('location')]",
            "apiVersion": "2019-08-02-preview",
            "properties": {
                "publisher": "Microsoft.Powershell",
                "type": "DSC",
                "autoUpgradeMinorVersion": "[parameters('autoUpdate')]",
                "settings": {
                    "ModulesUrl": "[parameters('modulesUrl')]",
                    "ConfigurationFunction": "[parameters('configurationFunction')]",
                    "Properties": "[parameters('properties')]",
                    "WmfVersion": "[parameters('wmfVersion')]",
                    "Privacy": {
                        "DataCollection": "[parameters('privacy')]"
                    }
                },
                "protectedSettings": {
                    "DataBlobUri": "[parameters('dataBlobUri')]"
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
        "name": "dscExtension",
        "label": "Add DSC Extension",
        "elements": [
          {
            "name": "Mode",
            "type": "Microsoft.Common.OptionsGroup",
            "label": "Mode",
            "defaultValue": 0,
            "toolTip": "The functional mode, push MOF configuration (Push), distribute MOF configuration (Pull), install custom DSC module (Install)",
            "constraints": {
              "allowedValues": [
                {
                  "label": "Push",
                  "value": "Push"
                },
                {
                  "label": "Pull",
                  "value": "Pull"
                },
                {
                  "label": "Install",
                  "value": "Install"
                },
                {
                  "label": "Register",
                  "value": "Register"
                }
              ]
            },
            "visible": true
          },
          {
            "name": "FileUri",
            "type": "Microsoft.Common.FileUpload",
            "label": "File URI",
            "toolTip": "The uri of the MOF file/Meta MOF file/resource ZIP file",
            "constraints": {
              "required": false,
              "accept": ".psd1"
            },
            "options": {
              "multiple": false,
              "uploadMode": "url",
              "openMode": "binary",
              "encoding": "UTF-8"
            }
          },
          {
            "name": "RegistrationUrl",
            "type": "Microsoft.Common.TextBox",
            "label": "Registration URL",
            "toolTip": "The URL of the Azure Automation account",
            "constraints": {
              "required": false
            }
          },
          {
            "name": "RegistrationKey",
            "type": "Microsoft.Common.TextBox",
            "label": "Registration key",
            "toolTip": "The access key of the Azure Automation account",
            "constraints": {
              "required": false
            }
          }
        ]
      }
    ],
    "outputs": {
      "vmName": "[vmName()]",
      "location": "[location()]",
      "mode": "[steps('dscExtension').Mode]",
      "fileUri": "[steps('dscExtension').FileUri]",
      "registrationUrl": "[steps('dscExtension').RegistrationUrl]",
      "registrationKey": "[steps('dscExtension').RegistrationKey]"
    }
  }
}
```

### Dependency agent

To use the Azure Monitor Dependency agent extension, the following sample is provided to run on Windows and Linux. If you are unfamiliar with the Dependency agent, see [Overview of Azure Monitor agents](../../azure-monitor/platform/agents-overview.md#dependency-agent).

#### Template file for Linux

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "The name of existing Linux machine."
      }
    }
  },
  "variables": {
    "vmExtensionsApiVersion": "2017-03-30"
  },
  "resources": [
    {
      "type": "Microsoft.HybridCompute/machines/extensions",
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

#### Template file for Windows

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "The name of existing Windows machine."
      }
    }
  },
  "variables": {
    "vmExtensionsApiVersion": "2017-03-30"
  },
  "resources": [
    {
      "type": "Microsoft.HybridCompute/machines/extensions",
      "name": "[concat(parameters('vmName'),'/DAExtension')]",
      "apiVersion": "[variables('vmExtensionsApiVersion')]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
      ],
      "properties": {
        "publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
        "type": "DependencyAgentWindows",
        "typeHandlerVersion": "9.5",
        "autoUpgradeMinorVersion": true
      }
    }
  ],
    "outputs": {
    }
}
```

## Uninstall extension

Removing one or more extensions from an Arc enabled server can only be carried out from the Azure portal. Perform the following steps to remove an extension.

1. From your browser, go to the [Azure portal](https://portal.azure.com).

2. In the portal, browse to **Servers - Azure Arc** and select your hybrid machine from the list.

3. Choose **Extensions**, then select an extension from the list of installed extensions.

4. Select **Uninstall** and when prompted to verify, select **Yes** to proceed.

## Next steps

* Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [Azure Monitor with VMs](../../azure-monitor/insights/vminsights-enable-policy.md), and much more.

* Learn more about the [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to collect operating system and workload monitoring data, manage it using Automation runbooks or features like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-intro.md).