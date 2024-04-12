---
title: Resource Manager template samples for VM insights
description: Sample Azure Resource Manager templates to deploy and configureVM insights.
ms.topic: sample
ms.custom: devx-track-arm-template
author: guywi-ms
ms.author: guywild
ms.date: 09/28/2023
---

# Resource Manager template samples for VM insights

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to enable VM insights on virtual machines. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Configure workspace

The following sample enables VM insights for a Log Analytics workspace.

### Template file

# [Bicep](#tab/bicep)

main.bicep

```bicep
@description('Resource ID of the workspace.')
param workspaceResourceId string

@description('Location of the workspace.')
param workspaceLocation string

module VMISolutionDeployment './nested_VMISolutionDeployment.bicep' = {
  name: 'VMISolutionDeployment'
  scope: resourceGroup(split(workspaceResourceId, '/')[2], split(workspaceResourceId, '/')[4])
  params: {
    workspaceLocation: workspaceLocation
    workspaceResourceId: workspaceResourceId
  }
}
```

nested_VMISolutionDeployment.bicep

```bicep
@description('Location of the workspace.')
param workspaceLocation string

@description('Resource ID of the workspace.')
param workspaceResourceId string

resource solution 'Microsoft.OperationsManagement/solutions@2015-11-01-preview' = {
  location: workspaceLocation
  name: 'VMInsights(${split(workspaceResourceId, '/')[8]})'
  properties: {
    workspaceResourceId: workspaceResourceId
  }
  plan: {
    name: 'VMInsights(${split(workspaceResourceId, '/')[8]})'
    product: 'OMSGallery/VMInsights'
    promotionCode: ''
    publisher: 'Microsoft'
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Resource ID of the workspace."
      }
    },
    "workspaceLocation": {
      "type": "string",
      "metadata": {
        "description": "Location of the workspace."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-10-01",
      "name": "VMISolutionDeployment",
      "subscriptionId": "[split(parameters('workspaceResourceId'), '/')[2]]",
      "resourceGroup": "[split(parameters('workspaceResourceId'), '/')[4]]",
      "properties": {
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "mode": "Incremental",
        "parameters": {
          "workspaceLocation": {
            "value": "[parameters('workspaceLocation')]"
          },
          "workspaceResourceId": {
            "value": "[parameters('workspaceResourceId')]"
          }
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "workspaceLocation": {
              "type": "string",
              "metadata": {
                "description": "Location of the workspace."
              }
            },
            "workspaceResourceId": {
              "type": "string",
              "metadata": {
                "description": "Resource ID of the workspace."
              }
            }
          },
          "resources": [
            {
              "type": "Microsoft.OperationsManagement/solutions",
              "apiVersion": "2015-11-01-preview",
              "name": "[format('VMInsights({0})', split(parameters('workspaceResourceId'), '/')[8])]",
              "location": "[parameters('workspaceLocation')]",
              "properties": {
                "workspaceResourceId": "[parameters('workspaceResourceId')]"
              },
              "plan": {
                "name": "[format('VMInsights({0})', split(parameters('workspaceResourceId'), '/')[8])]",
                "product": "OMSGallery/VMInsights",
                "promotionCode": "",
                "publisher": "Microsoft"
              }
            }
          ]
        }
      }
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceResourceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace"
    },
    "workspaceLocation": {
      "value": "eastus"
    }
  }
}
```

## Onboard an Azure virtual machine

The following sample adds an Azure virtual machine to VM insights.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('VM Resource ID.')
param VmResourceId string

@description('The Virtual Machine Location.')
param VmLocation string

@description('OS Type, Example: Linux / Windows')
param osType string

@description('Workspace Resource ID.')
param WorkspaceResourceId string

var VmName_var = split(VmResourceId, '/')[8]
var DaExtensionName = ((toLower(osType) == 'windows') ? 'DependencyAgentWindows' : 'DependencyAgentLinux')
var DaExtensionType = ((toLower(osType) == 'windows') ? 'DependencyAgentWindows' : 'DependencyAgentLinux')
var DaExtensionVersion = '9.5'
var MmaExtensionName = ((toLower(osType) == 'windows') ? 'MMAExtension' : 'OMSExtension')
var MmaExtensionType = ((toLower(osType) == 'windows') ? 'MicrosoftMonitoringAgent' : 'OmsAgentForLinux')
var MmaExtensionVersion = ((toLower(osType) == 'windows') ? '1.0' : '1.4')


resource vm 'Microsoft.Compute/virtualMachines@2021-11-01' = {
  name: VmName_var
  location: VmLocation
}

resource daExtension 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  parent: vm
  name: DaExtensionName
  location: VmLocation
  properties: {
    publisher: 'Microsoft.Azure.Monitoring.DependencyAgent'
    type: DaExtensionType
    typeHandlerVersion: DaExtensionVersion
    autoUpgradeMinorVersion: true
  }
}

resource mmaExtension 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  parent: vm
  name: MmaExtensionName
  location: VmLocation
  properties: {
    publisher: 'Microsoft.EnterpriseCloud.Monitoring'
    type: MmaExtensionType
    typeHandlerVersion: MmaExtensionVersion
    autoUpgradeMinorVersion: true
    settings: {
      workspaceId: reference(WorkspaceResourceId, '2021-12-01-preview').customerId
      azureResourceId: VmResourceId
      stopOnMultipleConnections: true
    }
    protectedSettings: {
      workspaceKey: listKeys(WorkspaceResourceId, '2021-12-01-preview').primarySharedKey
    }
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.5.6.12127",
      "templateHash": "5890554597225741728"
    }
  },
  "parameters": {
    "VmResourceId": {
      "type": "string",
      "metadata": {
        "description": "VM Resource ID."
      }
    },
    "VmLocation": {
      "type": "string",
      "metadata": {
        "description": "The Virtual Machine Location."
      }
    },
    "osType": {
      "type": "string",
      "metadata": {
        "description": "OS Type, Example: Linux / Windows"
      }
    },
    "WorkspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Workspace Resource ID."
      }
    }
  },
  "variables": {
    "VmName_var": "[split(parameters('VmResourceId'), '/')[8]]",
    "DaExtensionName": "[if(equals(toLower(parameters('osType')), 'windows'), 'DependencyAgentWindows', 'DependencyAgentLinux')]",
    "DaExtensionType": "[if(equals(toLower(parameters('osType')), 'windows'), 'DependencyAgentWindows', 'DependencyAgentLinux')]",
    "DaExtensionVersion": "9.5",
    "MmaExtensionName": "[if(equals(toLower(parameters('osType')), 'windows'), 'MMAExtension', 'OMSExtension')]",
    "MmaExtensionType": "[if(equals(toLower(parameters('osType')), 'windows'), 'MicrosoftMonitoringAgent', 'OmsAgentForLinux')]",
    "MmaExtensionVersion": "[if(equals(toLower(parameters('osType')), 'windows'), '1.0', '1.4')]"
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-11-01",
      "name": "[variables('VmName_var')]",
      "location": "[parameters('VmLocation')]"
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/{1}', variables('VmName_var'), variables('DaExtensionName'))]",
      "location": "[parameters('VmLocation')]",
      "properties": {
        "publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
        "type": "[variables('DaExtensionType')]",
        "typeHandlerVersion": "[variables('DaExtensionVersion')]",
        "autoUpgradeMinorVersion": true
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachines', variables('VmName_var'))]"
      ]
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/{1}', variables('VmName_var'), variables('MmaExtensionName'))]",
      "location": "[parameters('VmLocation')]",
      "properties": {
        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
        "type": "[variables('MmaExtensionType')]",
        "typeHandlerVersion": "[variables('MmaExtensionVersion')]",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "workspaceId": "[reference(parameters('WorkspaceResourceId'), '2021-12-01-preview').customerId]",
          "azureResourceId": "[parameters('VmResourceId')]",
          "stopOnMultipleConnections": true
        },
        "protectedSettings": {
          "workspaceKey": "[listKeys(parameters('WorkspaceResourceId'), '2021-12-01-preview').primarySharedKey]"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachines', variables('VmName_var'))]"
      ]
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmResourceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-linux-vm"
    },
    "vmLocation": {
      "value": "westus"
    },
    "osType": {
      "value": "linux"
    },
    "workspaceResourceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace"
    }
  }
}

```

## Onboard an Azure virtual machine scale set

The following sample adds an Azure virtual machine scale set to VM insights.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('VM Resource ID.')
param VmssResourceId string

@description('The Virtual Machine Location.')
param VmssLocation string

@description('OS Type, Example: Linux / Windows')
param osType string

@description('Workspace Resource ID.')
param WorkspaceResourceId string

var VmssName_var = split(VmssResourceId, '/')[8]
var DaExtensionName = ((toLower(osType) == 'windows') ? 'DependencyAgentWindows' : 'DependencyAgentLinux')
var DaExtensionType = ((toLower(osType) == 'windows') ? 'DependencyAgentWindows' : 'DependencyAgentLinux')
var DaExtensionVersion = '9.5'
var MmaExtensionName = ((toLower(osType) == 'windows') ? 'MMAExtension' : 'OMSExtension')
var MmaExtensionType = ((toLower(osType) == 'windows') ? 'MicrosoftMonitoringAgent' : 'OmsAgentForLinux')
var MmaExtensionVersion = ((toLower(osType) == 'windows') ? '1.0' : '1.4')

resource vmss 'Microsoft.Compute/virtualMachineScaleSets@2021-11-01' = {
  name: VmssName_var
  location: VmssLocation
  properties:{}
}

resource daExtension 'Microsoft.Compute/virtualMachineScaleSets/extensions@2018-10-01' = {
  parent: vmss
  name: DaExtensionName
  properties: {
    publisher: 'Microsoft.Azure.Monitoring.DependencyAgent'
    type: DaExtensionType
    typeHandlerVersion: DaExtensionVersion
    autoUpgradeMinorVersion: true
  }
}

resource mmaExtension 'Microsoft.Compute/virtualMachineScaleSets/extensions@2018-10-01' = {
  parent: vmss
  name: MmaExtensionName
  properties: {
    publisher: 'Microsoft.EnterpriseCloud.Monitoring'
    type: MmaExtensionType
    typeHandlerVersion: MmaExtensionVersion
    autoUpgradeMinorVersion: true
    settings: {
      workspaceId: reference(WorkspaceResourceId, '2021-12-01-preview').customerId
      azureResourceId: VmssResourceId
      stopOnMultipleConnections: true
    }
    protectedSettings: {
      workspaceKey: listKeys(WorkspaceResourceId, '2021-12-01-preview').primarySharedKey
    }
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "VmssResourceId": {
      "type": "string",
      "metadata": {
        "description": "VM Resource ID."
      }
    },
    "VmssLocation": {
      "type": "string",
      "metadata": {
        "description": "The Virtual Machine Location."
      }
    },
    "osType": {
      "type": "string",
      "metadata": {
        "description": "OS Type, Example: Linux / Windows"
      }
    },
    "WorkspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Workspace Resource ID."
      }
    }
  },
  "variables": {
    "VmssName_var": "[split(parameters('VmssResourceId'), '/')[8]]",
    "DaExtensionName": "[if(equals(toLower(parameters('osType')), 'windows'), 'DependencyAgentWindows', 'DependencyAgentLinux')]",
    "DaExtensionType": "[if(equals(toLower(parameters('osType')), 'windows'), 'DependencyAgentWindows', 'DependencyAgentLinux')]",
    "DaExtensionVersion": "9.5",
    "MmaExtensionName": "[if(equals(toLower(parameters('osType')), 'windows'), 'MMAExtension', 'OMSExtension')]",
    "MmaExtensionType": "[if(equals(toLower(parameters('osType')), 'windows'), 'MicrosoftMonitoringAgent', 'OmsAgentForLinux')]",
    "MmaExtensionVersion": "[if(equals(toLower(parameters('osType')), 'windows'), '1.0', '1.4')]"
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachineScaleSets",
      "apiVersion": "2021-11-01",
      "name": "[variables('VmssName_var')]",
      "location": "[parameters('VmssLocation')]",
      "properties": {}
    },
    {
      "type": "Microsoft.Compute/virtualMachineScaleSets/extensions",
      "apiVersion": "2018-10-01",
      "name": "[format('{0}/{1}', variables('VmssName_var'), variables('DaExtensionName'))]",
      "properties": {
        "publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
        "type": "[variables('DaExtensionType')]",
        "typeHandlerVersion": "[variables('DaExtensionVersion')]",
        "autoUpgradeMinorVersion": true
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachineScaleSets', variables('VmssName_var'))]"
      ]
    },
    {
      "type": "Microsoft.Compute/virtualMachineScaleSets/extensions",
      "apiVersion": "2018-10-01",
      "name": "[format('{0}/{1}', variables('VmssName_var'), variables('MmaExtensionName'))]",
      "properties": {
        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
        "type": "[variables('MmaExtensionType')]",
        "typeHandlerVersion": "[variables('MmaExtensionVersion')]",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "workspaceId": "[reference(parameters('WorkspaceResourceId'), '2021-12-01-preview').customerId]",
          "azureResourceId": "[parameters('VmssResourceId')]",
          "stopOnMultipleConnections": true
        },
        "protectedSettings": {
          "workspaceKey": "[listKeys(parameters('WorkspaceResourceId'), '2021-12-01-preview').primarySharedKey]"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachineScaleSets', variables('VmssName_var'))]"
      ]
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "VmssResourceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-windows-vmss"
    },
    "VmssLocation": {
      "value": "westus"
    },
    "OsType": {
      "value": "windows"
    },
    "WorkspaceResourceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace"
    }
  }
}
```

## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about VM insights](vminsights-overview.md).
