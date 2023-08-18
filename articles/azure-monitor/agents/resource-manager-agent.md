---
title: Resource Manager template samples for agents
description: Sample Azure Resource Manager templates to deploy and configure virtual machine agents in Azure Monitor.
ms.topic: sample
ms.custom: devx-track-arm-template
author: guywi-ms
ms.author: guywild
ms.date: 07/19/2023
ms.reviewer: jeffwo
---

# Resource Manager template samples for agents in Azure Monitor
This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to deploy and configure the [Azure Monitor agent](./azure-monitor-agent-overview.md), the legacy [Log Analytics agent](./log-analytics-agent.md) and [diagnostic extension](./diagnostics-extension-overview.md) for virtual machines in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Azure Monitor agent

The samples in this section install the Azure Monitor agent on Windows and Linux virtual machines and Azure Arc-enabled servers. 

###  Prerequisites

To use the templates below, you'll need:
- To [create a user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-arm#create-a-user-assigned-managed-identity-3) and [assign the user-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md#user-assigned-managed-identity), or [enable a system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md#system-assigned-managed-identity). A managed identity is required for Azure Monitor agent to collect and publish data. User-assigned managed identities are _strongly recommended_ over system-assigned managed identities due to their ease of management at scale.
- To configure data collection for Azure Monitor Agent, you must also deploy [Resource Manager template data collection rules and associations](./resource-manager-data-collection-rules.md).

### Permissions required

| Built-in Role | Scope(s) | Reason |
|:---|:---|:---|
| <ul><li>[Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)</li><li>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, virtual machine scale sets</li><li>Arc-enabled servers</li></ul> | To deploy agent extension |
| Any role that includes the action *Microsoft.Resources/deployments/** | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing data collection rule</li></ul> | To deploy ARM templates |

### Azure Windows virtual machine

The following sample installs the Azure Monitor agent on an Azure Windows virtual machine. Use the appropriate template below based on your chosen authentication method.

#### User-assigned managed identity (recommended)

# [Bicep](#tab/bicep)

```bicep
param vmName string
param location string
param userAssignedManagedIdentity string

resource windowsAgent 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  name: '${vmName}/AzureMonitorWindowsAgent'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Monitor'
    type: 'AzureMonitorWindowsAgent'
    typeHandlerVersion: '1.0'
    autoUpgradeMinorVersion: true
    enableAutomaticUpgrade: true
    settings: {
      authentication: {
        managedIdentity: {
          'identifier-name': 'mi_res_id'
          'identifier-value': userAssignedManagedIdentity
        }
      }
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
    "vmName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "userAssignedManagedIdentity": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/AzureMonitorWindowsAgent', parameters('vmName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.Azure.Monitor",
        "type": "AzureMonitorWindowsAgent",
        "typeHandlerVersion": "1.0",
        "settings": {
          "authentication": {
            "managedIdentity": {
              "identifier-name": "mi_res_id",
              "identifier-value": "[parameters('userAssignedManagedIdentity')]"
            }
          }
        },
        "autoUpgradeMinorVersion": true,
        "enableAutomaticUpgrade": true
      }
    }
  ]
}
```

---

##### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-windows-vm"
    },
    "location": {
      "value": "eastus"
    },
    "userAssignedManagedIdentity": {
      "value": "/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"
    }
  }
}
```

#### System-assigned managed identity

##### Template file

# [Bicep](#tab/bicep)

```bicep
param vmName string
param location string

resource windowsAgent 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  name: '${vmName}/AzureMonitorWindowsAgent'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Monitor'
    type: 'AzureMonitorWindowsAgent'
    typeHandlerVersion: '1.0'
    autoUpgradeMinorVersion: true
    enableAutomaticUpgrade: true
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/AzureMonitorWindowsAgent', parameters('vmName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.Azure.Monitor",
        "type": "AzureMonitorWindowsAgent",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true,
        "enableAutomaticUpgrade": true
      }
    }
  ]
}
```

---

##### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-windows-vm"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

### Azure Linux virtual machine

The following sample installs the Azure Monitor agent on an Azure Linux virtual machine. Use the appropriate template below based on your chosen authentication method.

#### User-assigned managed identity (recommended)

##### Template file

# [Bicep](#tab/bicep)

```bicep
param vmName string
param location string
param userAssignedManagedIdentity string

resource linuxAgent 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  name: '${vmName}/AzureMonitorLinuxAgent'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Monitor'
    type: 'AzureMonitorLinuxAgent'
    typeHandlerVersion: '1.21'
    autoUpgradeMinorVersion: true
    enableAutomaticUpgrade: true
    settings: {
      authentication: {
        managedIdentity: {
          'identifier-name': 'mi_res_id'
          'identifier-value': userAssignedManagedIdentity
        }
      }
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
    "vmName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "userAssignedManagedIdentity": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/AzureMonitorLinuxAgent', parameters('vmName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.Azure.Monitor",
        "type": "AzureMonitorLinuxAgent",
        "typeHandlerVersion": "1.21",
          "settings": {
          "authentication": {
            "managedIdentity": {
              "identifier-name": "mi_res_id",
              "identifier-value": "[parameters('userAssignedManagedIdentity')]"
            }
          }
        },
        "autoUpgradeMinorVersion": true,
        "enableAutomaticUpgrade": true
      }
    }
  ]
}
```

---

##### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-linux-vm"
    },
    "location": {
      "value": "eastus"
    },
    "userAssignedManagedIdentity": {
      "value": "/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"
    }
  }
}
```

#### System-assigned managed identity

##### Template file

# [Bicep](#tab/bicep)

```bicep
param vmName string
param location string

resource linuxAgent 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  name: '${vmName}/AzureMonitorLinuxAgent'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Monitor'
    type: 'AzureMonitorLinuxAgent'
    typeHandlerVersion: '1.21'
    autoUpgradeMinorVersion: true
    enableAutomaticUpgrade: true
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/AzureMonitorLinuxAgent', parameters('vmName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.Azure.Monitor",
        "type": "AzureMonitorLinuxAgent",
        "typeHandlerVersion": "1.21",
        "autoUpgradeMinorVersion": true,
        "enableAutomaticUpgrade": true
      }
    }
  ]
}
```

---

##### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-linux-vm"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

### Azure Arc-enabled Windows server

The following sample installs the Azure Monitor agent on an Azure Arc-enabled Windows server.

#### Template file

# [Bicep](#tab/bicep)

```bicep
param vmName string
param location string

resource windowsAgent 'Microsoft.HybridCompute/machines/extensions@2021-12-10-preview' = {
  name: '${vmName}/AzureMonitorWindowsAgent'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Monitor'
    type: 'AzureMonitorWindowsAgent'
    autoUpgradeMinorVersion: true
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.HybridCompute/machines/extensions",
      "apiVersion": "2021-12-10-preview",
      "name": "[format('{0}/AzureMonitorWindowsAgent', parameters('vmName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.Azure.Monitor",
        "type": "AzureMonitorWindowsAgent",
        "autoUpgradeMinorVersion": true
      }
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "vmName": {
        "value": "my-windows-vm"
      },
      "location": {
        "value": "eastus"
      }
  }
}
```

### Azure Arc-enabled Linux server

The following sample installs the Azure Monitor agent on an Azure Arc-enabled Linux server.

#### Template file

# [Bicep](#tab/bicep)

```bicep
param vmName string
param location string

resource linuxAgent 'Microsoft.HybridCompute/machines/extensions@2021-12-10-preview'= {
  name: '${vmName}/AzureMonitorLinuxAgent'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Monitor'
    type: 'AzureMonitorLinuxAgent'
    autoUpgradeMinorVersion: true
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.HybridCompute/machines/extensions",
      "apiVersion": "2021-12-10-preview",
      "name": "[format('{0}/AzureMonitorLinuxAgent', parameters('vmName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.Azure.Monitor",
        "type": "AzureMonitorLinuxAgent",
        "autoUpgradeMinorVersion": true
      }
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-linux-vm"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

## Log Analytics agent

The samples in this section install the legacy Log Analytics agent on Windows and Linux virtual machines in Azure and connect it to a Log Analytics workspace.

###  Windows

The following sample installs the Log Analytics agent on an Azure virtual machine. This is done by enabling the [Log Analytics virtual machine extension for Windows](../../virtual-machines/extensions/oms-windows.md).

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the virtual machine.')
param vmName string

@description('Location of the virtual machine')
param location string = resourceGroup().location

@description('Id of the workspace.')
param workspaceId string

@description('Primary or secondary workspace key.')
param workspaceKey string

resource vm 'Microsoft.Compute/virtualMachines@2021-11-01' = {
  name: vmName
  location: location
  properties:{}
}

resource logAnalyticsAgent 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  parent: vm
  name: 'Microsoft.Insights.LogAnalyticsAgent'
  location: location
  properties: {
    publisher: 'Microsoft.EnterpriseCloud.Monitoring'
    type: 'MicrosoftMonitoringAgent'
    typeHandlerVersion: '1.0'
    autoUpgradeMinorVersion: true
    settings: {
      workspaceId: workspaceId
    }
    protectedSettings: {
      workspaceKey: workspaceKey
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
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location of the virtual machine"
      }
    },
    "workspaceId": {
      "type": "string",
      "metadata": {
        "description": "Id of the workspace."
      }
    },
    "workspaceKey": {
      "type": "string",
      "metadata": {
        "description": "Primary or secondary workspace key."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-11-01",
      "name": "[parameters('vmName')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/{1}', parameters('vmName'), 'Microsoft.Insights.LogAnalyticsAgent')]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
        "type": "MicrosoftMonitoringAgent",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "workspaceId": "[parameters('workspaceId')]"
        },
        "protectedSettings": {
          "workspaceKey": "[parameters('workspaceKey')]"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachines', parameters('vmName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-windows-vm"
    },
    "location": {
      "value": "westus"
    },
    "workspaceId": {
      "value": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    "workspaceKey": {
      "value": "Tse-gj9CemT6A80urYa2hwtjvA5axv1xobXgKR17kbVdtacU6cEf+SNo2TdHGVKTsZHZd1W9QKRXfh+$fVY9dA=="
    }
  }
}
```

### Linux

The following sample installs the Log Analytics agent on a Linux Azure virtual machine. This is done by enabling the [Log Analytics virtual machine extension for Linux](../../virtual-machines/extensions/oms-linux.md).

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the virtual machine.')
param vmName string

@description('Location of the virtual machine')
param location string = resourceGroup().location

@description('Id of the workspace.')
param workspaceId string

@description('Primary or secondary workspace key.')
param workspaceKey string

resource vm 'Microsoft.Compute/virtualMachines@2021-11-01' = {
  name: vmName
  location: location
}

resource logAnalyticsAgent 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  parent: vm
  name: 'Microsoft.Insights.LogAnalyticsAgent'
  location: location
  properties: {
    publisher: 'Microsoft.EnterpriseCloud.Monitoring'
    type: 'OmsAgentForLinux'
    typeHandlerVersion: '1.7'
    autoUpgradeMinorVersion: true
    settings: {
      workspaceId: workspaceId
    }
    protectedSettings: {
      workspaceKey: workspaceKey
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
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location of the virtual machine"
      }
    },
    "workspaceId": {
      "type": "string",
      "metadata": {
        "description": "Id of the workspace."
      }
    },
    "workspaceKey": {
      "type": "string",
      "metadata": {
        "description": "Primary or secondary workspace key."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-11-01",
      "name": "[parameters('vmName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/{1}', parameters('vmName'), 'Microsoft.Insights.LogAnalyticsAgent')]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
        "type": "OmsAgentForLinux",
        "typeHandlerVersion": "1.7",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "workspaceId": "[parameters('workspaceId')]"
        },
        "protectedSettings": {
          "workspaceKey": "[parameters('workspaceKey')]"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachines', parameters('vmName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-linux-vm"
    },
    "location": {
      "value": "westus"
    },
    "workspaceId": {
      "value": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    "workspaceKey": {
      "value": "Tse-gj9CemT6A80urYa2hwtjvA5axv1xobXgKR17kbVdtacU6cEf+SNo2TdHGVKTsZHZd1W9QKRXfh+$fVY9dA=="
    }
  }
}
```

## Diagnostic extension

The samples in this section install the diagnostic extension on Windows and Linux virtual machines in Azure and configure it for data collection.

### Windows

The following sample enables and configures the diagnostic extension on an Azure virtual machine. For details on the configuration, see [Windows diagnostics extension schema](./diagnostics-extension-schema-windows.md).

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the virtual machine.')
param vmName string

@description('Location for the virtual machine.')
param location string = resourceGroup().location

@description('Name of the storage account.')
param storageAccountName string

@description('Resource ID of the storage account.')
param storageAccountId string

@description('Resource ID of the workspace.')
param workspaceResourceId string

resource vm 'Microsoft.Compute/virtualMachines@2021-11-01' = {
  name: vmName
  location: location
}

resource vmDiagnosticsSettings 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  parent: vm
  name: 'Microsoft.Insights.VMDiagnosticsSettings'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Diagnostics'
    type: 'IaaSDiagnostics'
    typeHandlerVersion: '1.5'
    autoUpgradeMinorVersion: true
    settings: {
      WadCfg: {
        DiagnosticMonitorConfiguration: {
          overallQuotaInMB: 10000
          DiagnosticInfrastructureLogs: {
            scheduledTransferLogLevelFilter: 'Error'
          }
          PerformanceCounters: {
            scheduledTransferPeriod: 'PT1M'
            sinks: 'AzureMonitorSink'
            PerformanceCounterConfiguration: [
              {
                counterSpecifier: '\\Processor(_Total)\\% Processor Time'
                sampleRate: 'PT1M'
                unit: 'percent'
              }
            ]
          }
          WindowsEventLog: {
            scheduledTransferPeriod: 'PT5M'
            DataSource: [
              {
                name: 'System!*[System[Provider[@Name=\'Microsoft Antimalware\']]]'
              }
              {
                name: 'System!*[System[Provider[@Name=\'NTFS\'] and (EventID=55)]]'
              }
              {
                name: 'System!*[System[Provider[@Name=\'disk\'] and (EventID=7 or EventID=52 or EventID=55)]]'
              }
            ]
          }
        }
        SinksConfig: {
          Sink: [
            {
              name: 'AzureMonitorSink'
              AzureMonitor: {
                ResourceId: workspaceResourceId
              }
            }
          ]
        }
      }
      storageAccount: storageAccountName
    }
    protectedSettings: {
      storageAccountName: storageAccountName
      storageAccountKey: listkeys(storageAccountId, '2021-08-01').key1
      storageAccountEndPoint: 'https://${environment().suffixes.storage}'
    }
  }
}

resource managedIdentity 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  parent: vm
  name: 'ManagedIdentityExtensionForWindows'
  location: location
  properties: {
    publisher: 'Microsoft.ManagedIdentity'
    type: 'ManagedIdentityExtensionForWindows'
    typeHandlerVersion: '1.0'
    autoUpgradeMinorVersion: true
    settings: {
      port: 50342
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
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the virtual machine."
      }
    },
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the storage account."
      }
    },
    "storageAccountId": {
      "type": "string",
      "metadata": {
        "description": "Resource ID of the storage account."
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
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-11-01",
      "name": "[parameters('vmName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/{1}', parameters('vmName'), 'Microsoft.Insights.VMDiagnosticsSettings')]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.Azure.Diagnostics",
        "type": "IaaSDiagnostics",
        "typeHandlerVersion": "1.5",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "WadCfg": {
            "DiagnosticMonitorConfiguration": {
              "overallQuotaInMB": 10000,
              "DiagnosticInfrastructureLogs": {
                "scheduledTransferLogLevelFilter": "Error"
              },
              "PerformanceCounters": {
                "scheduledTransferPeriod": "PT1M",
                "sinks": "AzureMonitorSink",
                "PerformanceCounterConfiguration": [
                  {
                    "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
                    "sampleRate": "PT1M",
                    "unit": "percent"
                  }
                ]
              },
              "WindowsEventLog": {
                "scheduledTransferPeriod": "PT5M",
                "DataSource": [
                  {
                    "name": "System!*[System[Provider[@Name='Microsoft Antimalware']]]"
                  },
                  {
                    "name": "System!*[System[Provider[@Name='NTFS'] and (EventID=55)]]"
                  },
                  {
                    "name": "System!*[System[Provider[@Name='disk'] and (EventID=7 or EventID=52 or EventID=55)]]"
                  }
                ]
              }
            },
            "SinksConfig": {
              "Sink": [
                {
                  "name": "AzureMonitorSink",
                  "AzureMonitor": {
                    "ResourceId": "[parameters('workspaceResourceId')]"
                  }
                }
              ]
            }
          },
          "storageAccount": "[parameters('storageAccountName')]"
        },
        "protectedSettings": {
          "storageAccountName": "[parameters('storageAccountName')]",
          "storageAccountKey": "[listkeys(parameters('storageAccountId'), '2021-08-01').key1]",
          "storageAccountEndPoint": "[format('https://{0}', environment().suffixes.storage)]"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachines', parameters('vmName'))]"
      ]
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/{1}', parameters('vmName'), 'ManagedIdentityExtensionForWindows')]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.ManagedIdentity",
        "type": "ManagedIdentityExtensionForWindows",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "port": 50342
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachines', parameters('vmName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "vmName": {
        "value": "my-windows-vm"
      },
      "location": {
        "value": "westus"
      },
      "storageAccountName": {
        "value": "mystorageaccount"
      },
      "storageAccountId": {
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Storage/storageAccounts/my-windows-vm"
      },
      "workspaceResourceId": {
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace"
      },
      "workspaceKey": {
        "value": "Npl#3y4SmqG4R30ukKo3oxfixZ5axv1xocXgKR17kgVdtacU4cEf+SNr2TdHGVKTsZHZv3R8QKRXfh+ToVR9dA-="
      }
  }
}
```

### Linux

The following sample enables and configures the diagnostic extension on a Linux Azure virtual machine. For details on the configuration, see [Windows diagnostics extension schema](../../virtual-machines/extensions/diagnostics-linux.md).

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of the virtual machine.')
param vmName string

@description('Resource ID of the virtual machine.')
param vmId string

@description('Location for the virtual machine.')
param location string = resourceGroup().location

@description('Name of the storage account.')
param storageAccountName string

@description('Resource ID of the storage account.')
param storageSasToken string

@description('URL of the event hub.')
param eventHubUrl string

resource vm 'Microsoft.Compute/virtualMachines@2021-11-01' = {
  name: vmName
  location: location
}

resource vmDiagnosticsSettings 'Microsoft.Compute/virtualMachines/extensions@2021-11-01' = {
  parent: vm
  name: 'Microsoft.Insights.VMDiagnosticsSettings'
  location: location
  properties: {
    publisher: 'Microsoft.Azure.Diagnostics'
    type: 'LinuxDiagnostic'
    typeHandlerVersion: '3.0'
    autoUpgradeMinorVersion: true
    settings: {
      StorageAccount: storageAccountName
      ladCfg: {
        sampleRateInSeconds: 15
        diagnosticMonitorConfiguration: {
          performanceCounters: {
            sinks: 'MyMetricEventHub,MyJsonMetricsBlob'
            performanceCounterConfiguration: [
              {
                unit: 'Percent'
                type: 'builtin'
                counter: 'PercentProcessorTime'
                counterSpecifier: '/builtin/Processor/PercentProcessorTime'
                annotation: [
                  {
                    locale: 'en-us'
                    displayName: 'Aggregate CPU %utilization'
                  }
                ]
                condition: 'IsAggregate=TRUE'
                class: 'Processor'
              }
              {
                unit: 'Bytes'
                type: 'builtin'
                counter: 'UsedSpace'
                counterSpecifier: '/builtin/FileSystem/UsedSpace'
                annotation: [
                  {
                    locale: 'en-us'
                    displayName: 'Used disk space on /'
                  }
                ]
                condition: 'Name="/"'
                class: 'Filesystem'
              }
            ]
          }
          metrics: {
            metricAggregation: [
              {
                scheduledTransferPeriod: 'PT1H'
              }
              {
                scheduledTransferPeriod: 'PT1M'
              }
            ]
            resourceId: vmId
          }
          eventVolume: 'Large'
          syslogEvents: {
            sinks: 'MySyslogJsonBlob,MyLoggingEventHub'
            syslogEventConfiguration: {
              LOG_USER: 'LOG_INFO'
            }
          }
        }
      }
      perfCfg: [
        {
          query: 'SELECT PercentProcessorTime, PercentIdleTime FROM SCX_ProcessorStatisticalInformation WHERE Name=\'_TOTAL\''
          table: 'LinuxCpu'
          frequency: 60
          sinks: 'MyLinuxCpuJsonBlob,MyLinuxCpuEventHub'
        }
      ]
      fileLogs: [
        {
          file: '/var/log/myladtestlog'
          table: 'MyLadTestLog'
          sinks: 'MyFilelogJsonBlob,MyLoggingEventHub'
        }
      ]
    }
    protectedSettings: {
      storageAccountName: 'yourdiagstgacct'
      storageAccountSasToken: storageSasToken
      sinksConfig: {
        sink: [
          {
            name: 'MySyslogJsonBlob'
            type: 'JsonBlob'
          }
          {
            name: 'MyFilelogJsonBlob'
            type: 'JsonBlob'
          }
          {
            name: 'MyLinuxCpuJsonBlob'
            type: 'JsonBlob'
          }
          {
            name: 'MyJsonMetricsBlob'
            type: 'JsonBlob'
          }
          {
            name: 'MyLinuxCpuEventHub'
            type: 'EventHub'
            sasURL: eventHubUrl
          }
          {
            name: 'MyMetricEventHub'
            type: 'EventHub'
            sasURL: eventHubUrl
          }
          {
            name: 'MyLoggingEventHub'
            type: 'EventHub'
            sasURL: eventHubUrl
          }
        ]
      }
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
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the virtual machine."
      }
    },
    "vmId": {
      "type": "string",
      "metadata": {
        "description": "Resource ID of the virtual machine."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for the virtual machine."
      }
    },
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the storage account."
      }
    },
    "storageSasToken": {
      "type": "string",
      "metadata": {
        "description": "Resource ID of the storage account."
      }
    },
    "eventHubUrl": {
      "type": "string",
      "metadata": {
        "description": "URL of the event hub."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-11-01",
      "name": "[parameters('vmName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2021-11-01",
      "name": "[format('{0}/{1}', parameters('vmName'), 'Microsoft.Insights.VMDiagnosticsSettings')]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.Azure.Diagnostics",
        "type": "LinuxDiagnostic",
        "typeHandlerVersion": "3.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "StorageAccount": "[parameters('storageAccountName')]",
          "ladCfg": {
            "sampleRateInSeconds": 15,
            "diagnosticMonitorConfiguration": {
              "performanceCounters": {
                "sinks": "MyMetricEventHub,MyJsonMetricsBlob",
                "performanceCounterConfiguration": [
                  {
                    "unit": "Percent",
                    "type": "builtin",
                    "counter": "PercentProcessorTime",
                    "counterSpecifier": "/builtin/Processor/PercentProcessorTime",
                    "annotation": [
                      {
                        "locale": "en-us",
                        "displayName": "Aggregate CPU %utilization"
                      }
                    ],
                    "condition": "IsAggregate=TRUE",
                    "class": "Processor"
                  },
                  {
                    "unit": "Bytes",
                    "type": "builtin",
                    "counter": "UsedSpace",
                    "counterSpecifier": "/builtin/FileSystem/UsedSpace",
                    "annotation": [
                      {
                        "locale": "en-us",
                        "displayName": "Used disk space on /"
                      }
                    ],
                    "condition": "Name=\"/\"",
                    "class": "Filesystem"
                  }
                ]
              },
              "metrics": {
                "metricAggregation": [
                  {
                    "scheduledTransferPeriod": "PT1H"
                  },
                  {
                    "scheduledTransferPeriod": "PT1M"
                  }
                ],
                "resourceId": "[parameters('vmId')]"
              },
              "eventVolume": "Large",
              "syslogEvents": {
                "sinks": "MySyslogJsonBlob,MyLoggingEventHub",
                "syslogEventConfiguration": {
                  "LOG_USER": "LOG_INFO"
                }
              }
            }
          },
          "perfCfg": [
            {
              "query": "SELECT PercentProcessorTime, PercentIdleTime FROM SCX_ProcessorStatisticalInformation WHERE Name='_TOTAL'",
              "table": "LinuxCpu",
              "frequency": 60,
              "sinks": "MyLinuxCpuJsonBlob,MyLinuxCpuEventHub"
            }
          ],
          "fileLogs": [
            {
              "file": "/var/log/myladtestlog",
              "table": "MyLadTestLog",
              "sinks": "MyFilelogJsonBlob,MyLoggingEventHub"
            }
          ]
        },
        "protectedSettings": {
          "storageAccountName": "yourdiagstgacct",
          "storageAccountSasToken": "[parameters('storageSasToken')]",
          "sinksConfig": {
            "sink": [
              {
                "name": "MySyslogJsonBlob",
                "type": "JsonBlob"
              },
              {
                "name": "MyFilelogJsonBlob",
                "type": "JsonBlob"
              },
              {
                "name": "MyLinuxCpuJsonBlob",
                "type": "JsonBlob"
              },
              {
                "name": "MyJsonMetricsBlob",
                "type": "JsonBlob"
              },
              {
                "name": "MyLinuxCpuEventHub",
                "type": "EventHub",
                "sasURL": "[parameters('eventHubUrl')]"
              },
              {
                "name": "MyMetricEventHub",
                "type": "EventHub",
                "sasURL": "[parameters('eventHubUrl')]"
              },
              {
                "name": "MyLoggingEventHub",
                "type": "EventHub",
                "sasURL": "[parameters('eventHubUrl')]"
              }
            ]
          }
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachines', parameters('vmName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-linux-vm"
    },
    "vmId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-linux-vm"
    },
    "location": {
      "value": "westus"
    },
    "storageAccountName": {
      "value": "mystorageaccount"
    },
    "storageSasToken": {
      "value": "?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-04-26T23:06:44Z&st=2020-04-26T15:06:44Z&spr=https&sig=1QpoTvrrEW6VN2taweUq1BsaGkhDMnFGTfWakucZl4%3D"
    },
    "eventHubUrl": {
      "value": "https://my-eventhub-namespace.servicebus.windows.net/my-eventhub?sr=my-eventhub-namespace.servicebus.windows.net%2fmy-eventhub&sig=4VEGPTg8jxUAbTcyeF2kwOr8XZdfgTdMWEQWnVaMSqw=&skn=manage"
    }
  }
}
```

## Next steps

* [Learn more about Azure Monitor agent](./azure-monitor-agent-overview.md)
* [Learn more about Data Collection rules and associations](./data-collection-rule-azure-monitor-agent.md)
* [Get sample templates for Data Collection rules and associations](./resource-manager-data-collection-rules.md)
* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about diagnostic extension](./diagnostics-extension-overview.md).
