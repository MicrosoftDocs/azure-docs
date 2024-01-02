---
title: Resource Manager template samples for diagnostic settings
description: Sample Azure Resource Manager templates to apply Azure Monitor diagnostic settings to an Azure resource.
ms.topic: sample
ms.custom: devx-track-arm-template
author: EdB-MSFT
ms.author: edbaynash
ms.date: 08/09/2023
ms.reviewer: lualderm
---

# Resource Manager template samples for diagnostic settings in Azure Monitor

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create diagnostic settings for an Azure resource. Each sample includes a template file and a parameters file with sample values to provide to the template.

To create a diagnostic setting for an Azure resource, add a resource of type `<resource namespace>/providers/diagnosticSettings` to the template. This article provides examples for some resource types, but the same pattern can be applied to other resource types. The collection of allowed logs and metrics will vary for each resource type.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Diagnostic setting for an activity log

The following sample creates a diagnostic setting for an activity log by adding a resource of type `Microsoft.Insights/diagnosticSettings` to the template.

> [!IMPORTANT]
> Diagnostic settings for activity logs are created for a subscription, not for a resource group like settings for Azure resources. To deploy the Resource Manager template, use `New-AzSubscriptionDeployment` for PowerShell or `az deployment sub create` for the Azure CLI.

### Template file

# [Bicep](#tab/bicep)

```bicep
targetScope = 'subscription'

@description('The name of the diagnostic setting.')
param settingName string

@description('The resource Id for the workspace.')
param workspaceId string

@description('The resource Id for the storage account.')
param storageAccountId string

@description('The resource Id for the event hub authorization rule.')
param eventHubAuthorizationRuleId string

@description('The name of the event hub.')
param eventHubName string

resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: settingName
  properties: {
    workspaceId: workspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    logs: [
      {
        category: 'Administrative'
        enabled: true
      }
      {
        category: 'Security'
        enabled: true
      }
      {
        category: 'ServiceHealth'
        enabled: true
      }
      {
        category: 'Alert'
        enabled: true
      }
      {
        category: 'Recommendation'
        enabled: true
      }
      {
        category: 'Policy'
        enabled: true
      }
      {
        category: 'Autoscale'
        enabled: true
      }
      {
        category: 'ResourceHealth'
        enabled: true
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "settingName": {
      "type": "string",
      "metadata": {
        "description": "The name of the diagnostic setting."
      }
    },
    "workspaceId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id for the workspace."
      }
    },
    "storageAccountId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id for the storage account."
      }
    },
    "eventHubAuthorizationRuleId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id for the event hub authorization rule."
      }
    },
    "eventHubName": {
      "type": "string",
      "metadata": {
        "description": "The name of the event hub."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "name": "[parameters('settingName')]",
      "properties": {
        "workspaceId": "[parameters('workspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
          {
            "category": "Administrative",
            "enabled": true
          },
          {
            "category": "Security",
            "enabled": true
          },
          {
            "category": "ServiceHealth",
            "enabled": true
          },
          {
            "category": "Alert",
            "enabled": true
          },
          {
            "category": "Recommendation",
            "enabled": true
          },
          {
            "category": "Policy",
            "enabled": true
          },
          {
            "category": "Autoscale",
            "enabled": true
          },
          {
            "category": "ResourceHealth",
            "enabled": true
          }
        ]
      }
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "settingName": {
      "value": "Send to all locations"
    },
    "workspaceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    },
    "storageAccountId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "eventHubAuthorizationRuleId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNameSpace/authorizationrules/RootManageSharedAccessKey"
    },
    "eventHubName": {
      "value": "my-eventhub"
    }
  }
}
```

## Diagnostic setting for Azure Data Explorer

The following sample creates a diagnostic setting for an Azure Data Explorer cluster by adding a resource of type `Microsoft.Kusto/clusters/providers/diagnosticSettings` to the template.

### Template file

# [Bicep](#tab/bicep)

```bicep
param clusterName string
param settingName string
param workspaceId string
param storageAccountId string
param eventHubAuthorizationRuleId string
param eventHubName string

resource cluster 'Microsoft.Kusto/clusters@2022-02-01' existing = {
  name: clusterName
}

resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: settingName
  scope: cluster
  properties: {
    workspaceId: workspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    metrics: []
    logs: [
      {
        category: 'Command'
        categoryGroup: null
        enabled: true
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
      {
        category: 'Query'
        categoryGroup: null
        enabled: true
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
      {
        category: 'Journal'
        categoryGroup: null
        enabled: true
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
      {
        category: 'SucceededIngestion'
        categoryGroup: null
        enabled: false
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
      {
        category: 'FailedIngestion'
        categoryGroup: null
        enabled: false
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
      {
        category: 'IngestionBatching'
        categoryGroup: null
        enabled: false
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
      {
        category: 'TableUsageStatistics'
        categoryGroup: null
        enabled: false
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
      {
        category: 'TableDetails'
        categoryGroup: null
        enabled: false
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "type": "string"
    },
    "settingName": {
      "type": "string"
    },
    "workspaceId": {
      "type": "string"
    },
    "storageAccountId": {
      "type": "string"
    },
    "eventHubAuthorizationRuleId": {
      "type": "string"
    },
    "eventHubName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.Kusto/clusters/{0}', parameters('clusterName'))]",
      "name": "[parameters('settingName')]",
      "properties": {
        "workspaceId": "[parameters('workspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "metrics": [],
        "logs": [
          {
            "category": "Command",
            "categoryGroup": null,
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "Query",
            "categoryGroup": null,
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "Journal",
            "categoryGroup": null,
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "SucceededIngestion",
            "categoryGroup": null,
            "enabled": false,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "FailedIngestion",
            "categoryGroup": null,
            "enabled": false,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "IngestionBatching",
            "categoryGroup": null,
            "enabled": false,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "TableUsageStatistics",
            "categoryGroup": null,
            "enabled": false,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          },
          {
            "category": "TableDetails",
            "categoryGroup": null,
            "enabled": false,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          }
        ]
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
    "clusterName": {
      "value": "kustoClusterName"
    },
    "diagnosticSettingName": {
      "value": "A new Diagnostic Settings configuration"
    },
    "workspaceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    },
    "storageAccountId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "eventHubAuthorizationRuleId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNameSpace/authorizationrules/RootManageSharedAccessKey"
    },
    "eventHubName": {
      "value": "myEventhub"
    }
  }
}
```

### Template file: Enabling the 'audit' category group

# [Bicep](#tab/bicep)

```bicep
param clusterName string
param settingName string
param workspaceId string
param storageAccountId string
param eventHubAuthorizationRuleId string
param eventHubName string

resource cluster 'Microsoft.Kusto/clusters@2022-02-01' existing = {
  name: clusterName
}

resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: settingName
  scope: cluster
  properties: {
    workspaceId: workspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    logs: [
      {
        category: null
        categoryGroup: 'audit'
        enabled: true
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "type": "string"
    },
    "settingName": {
      "type": "string"
    },
    "workspaceId": {
      "type": "string"
    },
    "storageAccountId": {
      "type": "string"
    },
    "eventHubAuthorizationRuleId": {
      "type": "string"
    },
    "eventHubName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.Kusto/clusters/{0}', parameters('clusterName'))]",
      "name": "[parameters('settingName')]",
      "properties": {
        "workspaceId": "[parameters('workspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
          {
            "category": null,
            "categoryGroup": "audit",
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          }
        ]
      }
    }
  ]
}
```

---

## Diagnostic setting for Azure Key Vault

The following sample creates a diagnostic setting for an instance of Azure Key Vault by adding a resource of type `Microsoft.KeyVault/vaults/providers/diagnosticSettings` to the template.

> [!IMPORTANT]
> For Azure Key Vault, the event hub must be in the same region as the key vault.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('The name of the diagnostic setting.')
param settingName string

@description('The name of the key vault.')
param vaultName string

@description('The resource Id of the workspace.')
param workspaceId string

@description('The resource Id of the storage account.')
param storageAccountId string

@description('The resource Id for the event hub authorization rule.')
param eventHubAuthorizationRuleId string

@description('The name of the event hub.')
param eventHubName string

resource vault 'Microsoft.KeyVault/vaults@2021-11-01-preview' existing = {
  name: vaultName
}

resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: settingName
  scope: vault
  properties: {
    workspaceId: workspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    logs: [
      {
        category: 'AuditEvent'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "settingName": {
      "type": "string",
      "metadata": {
        "description": "The name of the diagnostic setting."
      }
    },
    "vaultName": {
      "type": "string",
      "metadata": {
        "description": "The name of the key vault."
      }
    },
    "workspaceId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id of the workspace."
      }
    },
    "storageAccountId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id of the storage account."
      }
    },
    "eventHubAuthorizationRuleId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id for the event hub authorization rule."
      }
    },
    "eventHubName": {
      "type": "string",
      "metadata": {
        "description": "The name of the event hub."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.KeyVault/vaults/{0}', parameters('vaultName'))]",
      "name": "[parameters('settingName')]",
      "properties": {
        "workspaceId": "[parameters('workspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
          {
            "category": "AuditEvent",
            "enabled": true
          }
        ],
        "metrics": [
          {
            "category": "AllMetrics",
            "enabled": true
          }
        ]
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
    "settingName": {
        "value": "Send to all locations"
    },
    "vaultName": {
      "value": "MyVault"
    },
    "workspaceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    },
    "storageAccountId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "eventHubAuthorizationRuleId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNameSpace/authorizationrules/RootManageSharedAccessKey"
    },
    "eventHubName": {
      "value": "my-eventhub"
    }
  }
}
```

## Diagnostic setting for Azure SQL Database

The following sample creates a diagnostic setting for an instance of Azure SQL Database by adding a resource of type `microsoft.sql/servers/databases/providers/diagnosticSettings` to the template.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('The name of the diagnostic setting.')
param settingName string

@description('The name of the Azure SQL database server.')
param serverName string

@description('The name of the SQL database.')
param dbName string

@description('The resource Id of the workspace.')
param workspaceId string

@description('The resource Id of the storage account.')
param storageAccountId string

@description('The resource Id of the event hub authorization rule.')
param eventHubAuthorizationRuleId string

@description('The name of the event hub.')
param eventHubName string

resource dbServer 'Microsoft.Sql/servers@2021-11-01-preview' existing = {
  name: serverName
}

resource db 'Microsoft.Sql/servers/databases@2021-11-01-preview' existing = {
  parent: dbServer
  name: dbName
}

resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: settingName
  scope: db
  properties: {
    workspaceId: workspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    logs: [
      {
        category: 'SQLInsights'
        enabled: true
      }
      {
        category: 'AutomaticTuning'
        enabled: true
      }
      {
        category: 'QueryStoreRuntimeStatistics'
        enabled: true
      }
      {
        category: 'QueryStoreWaitStatistics'
        enabled: true
      }
      {
        category: 'Errors'
        enabled: true
      }
      {
        category: 'DatabaseWaitStatistics'
        enabled: true
      }
      {
        category: 'Timeouts'
        enabled: true
      }
      {
        category: 'Blocks'
        enabled: true
      }
      {
        category: 'Deadlocks'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'Basic'
        enabled: true
      }
      {
        category: 'InstanceAndAppAdvanced'
        enabled: true
      }
      {
        category: 'WorkloadManagement'
        enabled: true
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "settingName": {
      "type": "string",
      "metadata": {
        "description": "The name of the diagnostic setting."
      }
    },
    "serverName": {
      "type": "string",
      "metadata": {
        "description": "The name of the Azure SQL database server."
      }
    },
    "dbName": {
      "type": "string",
      "metadata": {
        "description": "The name of the SQL database."
      }
    },
    "workspaceId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id of the workspace."
      }
    },
    "storageAccountId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id of the storage account."
      }
    },
    "eventHubAuthorizationRuleId": {
      "type": "string",
      "metadata": {
        "description": "The resource Id of the event hub authorization rule."
      }
    },
    "eventHubName": {
      "type": "string",
      "metadata": {
        "description": "The name of the event hub."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.Sql/servers/{0}/databases/{1}', parameters('serverName'), parameters('dbName'))]",
      "name": "[parameters('settingName')]",
      "properties": {
        "workspaceId": "[parameters('workspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
          {
            "category": "SQLInsights",
            "enabled": true
          },
          {
            "category": "AutomaticTuning",
            "enabled": true
          },
          {
            "category": "QueryStoreRuntimeStatistics",
            "enabled": true
          },
          {
            "category": "QueryStoreWaitStatistics",
            "enabled": true
          },
          {
            "category": "Errors",
            "enabled": true
          },
          {
            "category": "DatabaseWaitStatistics",
            "enabled": true
          },
          {
            "category": "Timeouts",
            "enabled": true
          },
          {
            "category": "Blocks",
            "enabled": true
          },
          {
            "category": "Deadlocks",
            "enabled": true
          }
        ],
        "metrics": [
          {
            "category": "Basic",
            "enabled": true
          },
          {
            "category": "InstanceAndAppAdvanced",
            "enabled": true
          },
          {
            "category": "WorkloadManagement",
            "enabled": true
          }
        ]
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
    "settingName": {
        "value": "Send to all locations"
    },
    "serverName": {
      "value": "MySqlServer"
    },
    "dbName": {
      "value": "MySqlDb"
    },
    "workspaceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    },
    "storageAccountId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "eventHubAuthorizationRuleId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNameSpace/authorizationrules/RootManageSharedAccessKey"
    },
    "eventHubName": {
      "value": "my-eventhub"
    }
  }
}
```

## Diagnostic setting for Azure SQL Managed Instance

The following sample creates a diagnostic setting for an instance of Azure SQL Managed Instance by adding a resource of type `microsoft.sql/managedInstances/providers/diagnosticSettings` to the template.

### Template file

# [Bicep](#tab/bicep)

```bicep
param sqlManagedInstanceName string
param diagnosticSettingName string
param diagnosticWorkspaceId string
param storageAccountId string
param eventHubAuthorizationRuleId string
param eventHubName string

resource instance 'Microsoft.Sql/managedInstances@2021-11-01-preview' existing = {
  name: sqlManagedInstanceName
}

resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: diagnosticSettingName
  scope: instance
  properties: {
    workspaceId: diagnosticWorkspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    logs: [
      {
        category: 'ResourceUsageStats'
        enabled: true
      }
      {
        category: 'DevOpsOperationsAudit'
        enabled: true
      }
      {
        category: 'SQLSecurityAuditEvents'
        enabled: true
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
  "parameters": {
    "sqlManagedInstanceName": {
      "type": "string"
    },
    "diagnosticSettingName": {
      "type": "string"
    },
    "diagnosticWorkspaceId": {
      "type": "string"
    },
    "storageAccountId": {
      "type": "string"
    },
    "eventHubAuthorizationRuleId": {
      "type": "string"
    },
    "eventHubName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.Sql/managedInstances/{0}', parameters('sqlManagedInstanceName'))]",
      "name": "[parameters('diagnosticSettingName')]",
      "properties": {
        "workspaceId": "[parameters('diagnosticWorkspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
          {
            "category": "ResourceUsageStats",
            "enabled": true
          },
          {
            "category": "DevOpsOperationsAudit",
            "enabled": true
          },
          {
            "category": "SQLSecurityAuditEvents",
            "enabled": true
          }
        ]
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
    "sqlManagedInstanceName": {
        "value": "MyInstanceName"
    },
    "diagnosticSettingName": {
        "value": "Send to all locations"
    },
    "diagnosticWorkspaceId": {
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    },
    "storageAccountId": {
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "eventHubAuthorizationRuleId": {
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNameSpace/authorizationrules/RootManageSharedAccessKey"
    },
    "eventHubName": {
        "value": "myEventhub"
    }
  }
}
```

## Diagnostic setting for a managed instance of Azure SQL Database

The following sample creates a diagnostic setting for a managed instance of Azure SQL Database by adding a resource of type `microsoft.sql/managedInstances/databases/providers/diagnosticSettings` to the template.

### Template file

# [Bicep](#tab/bicep)

```bicep
param sqlManagedInstanceName string
param sqlManagedDatabaseName string
param diagnosticSettingName string
param diagnosticWorkspaceId string
param storageAccountId string
param eventHubAuthorizationRuleId string
param eventHubName string

resource dbInstance 'Microsoft.Sql/managedInstances@2021-11-01-preview' existing = {
  name:sqlManagedInstanceName
}

resource db 'Microsoft.Sql/managedInstances/databases@2021-11-01-preview' existing = {
  name: sqlManagedDatabaseName
  parent: dbInstance
}

resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: diagnosticSettingName
  scope: db
  properties: {
    workspaceId: diagnosticWorkspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    logs: [
      {
        category: 'SQLInsights'
        enabled: true
      }
      {
        category: 'QueryStoreRuntimeStatistics'
        enabled: true
      }
      {
        category: 'QueryStoreWaitStatistics'
        enabled: true
      }
      {
        category: 'Errors'
        enabled: true
      }
    ]
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
      "templateHash": "10835183659402804631"
    }
  },
  "parameters": {
    "sqlManagedInstanceName": {
      "type": "string"
    },
    "sqlManagedDatabaseName": {
      "type": "string"
    },
    "diagnosticSettingName": {
      "type": "string"
    },
    "diagnosticWorkspaceId": {
      "type": "string"
    },
    "storageAccountId": {
      "type": "string"
    },
    "eventHubAuthorizationRuleId": {
      "type": "string"
    },
    "eventHubName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.Sql/managedInstances/{0}/databases/{1}', parameters('sqlManagedInstanceName'), parameters('sqlManagedDatabaseName'))]",
      "name": "[parameters('diagnosticSettingName')]",
      "properties": {
        "workspaceId": "[parameters('diagnosticWorkspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
          {
            "category": "SQLInsights",
            "enabled": true
          },
          {
            "category": "QueryStoreRuntimeStatistics",
            "enabled": true
          },
          {
            "category": "QueryStoreWaitStatistics",
            "enabled": true
          },
          {
            "category": "Errors",
            "enabled": true
          }
        ]
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
    "sqlManagedInstanceName": {
      "value": "MyInstanceName"
    },
    "sqlManagedDatabaseName": {
      "value": "MyManagedDatabaseName"
    },
    "diagnosticSettingName": {
      "value": "Send to all locations"
    },
    "diagnosticWorkspaceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    },
    "storageAccountId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "eventHubAuthorizationRuleId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNameSpace/authorizationrules/RootManageSharedAccessKey"
    },
    "eventHubName": {
      "value": "myEventhub"
    }
  }
}
```

## Diagnostic setting for Recovery Services vault

The following sample creates a diagnostic setting for an Azure Recovery Services vault by adding a resource of type `microsoft.recoveryservices/vaults/providers/diagnosticSettings` to the template. This example specifies the collection mode as described in [Azure resource logs](./resource-logs.md#send-to-log-analytics-workspace). Specify `Dedicated` or `AzureDiagnostics` for the `logAnalyticsDestinationType` property.

### Template file

# [Bicep](#tab/bicep)

```bicep
param recoveryServicesName string
param settingName string
param workspaceId string
param storageAccountId string
param eventHubAuthorizationRuleId string
param eventHubName string

resource vault 'Microsoft.RecoveryServices/vaults@2021-08-01' existing = {
  name: recoveryServicesName
}

resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: settingName
  scope: vault
  properties: {
    workspaceId: workspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    logs: [
      {
        category: 'AzureBackupReport'
        enabled: false
      }
      {
        category: 'CoreAzureBackup'
        enabled: true
      }
      {
        category: 'AddonAzureBackupJobs'
        enabled: true
      }
      {
        category: 'AddonAzureBackupAlerts'
        enabled: true
      }
      {
        category: 'AddonAzureBackupPolicy'
        enabled: true
      }
      {
        category: 'AddonAzureBackupStorage'
        enabled: true
      }
      {
        category: 'AddonAzureBackupProtectedInstance'
        enabled: true
      }
      {
        category: 'AzureSiteRecoveryJobs'
        enabled: false
      }
      {
        category: 'AzureSiteRecoveryEvents'
        enabled: false
      }
      {
        category: 'AzureSiteRecoveryReplicatedItems'
        enabled: false
      }
      {
        category: 'AzureSiteRecoveryReplicationStats'
        enabled: false
      }
      {
        category: 'AzureSiteRecoveryRecoveryPoints'
        enabled: false
      }
      {
        category: 'AzureSiteRecoveryReplicationDataUploadRate'
        enabled: false
      }
      {
        category: 'AzureSiteRecoveryProtectedDiskDataChurn'
        enabled: false
      }
    ]
    logAnalyticsDestinationType: 'Dedicated'
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "recoveryServicesName": {
      "type": "string"
    },
    "settingName": {
      "type": "string"
    },
    "workspaceId": {
      "type": "string"
    },
    "storageAccountId": {
      "type": "string"
    },
    "eventHubAuthorizationRuleId": {
      "type": "string"
    },
    "eventHubName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.RecoveryServices/vaults/{0}', parameters('recoveryServicesName'))]",
      "name": "[parameters('settingName')]",
      "properties": {
        "workspaceId": "[parameters('workspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
          {
            "category": "AzureBackupReport",
            "enabled": false
          },
          {
            "category": "CoreAzureBackup",
            "enabled": true
          },
          {
            "category": "AddonAzureBackupJobs",
            "enabled": true
          },
          {
            "category": "AddonAzureBackupAlerts",
            "enabled": true
          },
          {
            "category": "AddonAzureBackupPolicy",
            "enabled": true
          },
          {
            "category": "AddonAzureBackupStorage",
            "enabled": true
          },
          {
            "category": "AddonAzureBackupProtectedInstance",
            "enabled": true
          },
          {
            "category": "AzureSiteRecoveryJobs",
            "enabled": false
          },
          {
            "category": "AzureSiteRecoveryEvents",
            "enabled": false
          },
          {
            "category": "AzureSiteRecoveryReplicatedItems",
            "enabled": false
          },
          {
            "category": "AzureSiteRecoveryReplicationStats",
            "enabled": false
          },
          {
            "category": "AzureSiteRecoveryRecoveryPoints",
            "enabled": false
          },
          {
            "category": "AzureSiteRecoveryReplicationDataUploadRate",
            "enabled": false
          },
          {
            "category": "AzureSiteRecoveryProtectedDiskDataChurn",
            "enabled": false
          }
        ],
        "logAnalyticsDestinationType": "Dedicated"
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
    "settingName": {
      "value": "Send to all locations"
    },
    "recoveryServicesName": {
      "value": "my-vault"
    },
    "workspaceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    },
    "storageAccountId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "eventHubAuthorizationRuleId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNameSpace/authorizationrules/RootManageSharedAccessKey"
    },
    "eventHubName": {
      "value": "my-eventhub"
    }
  }
}
```

## Diagnostic setting for a Log Analytics workspace

The following sample creates a diagnostic setting for a Log Analytics workspace by adding a resource of type `Microsoft.OperationalInsights/workspaces/providers/diagnosticSettings` to the template. This example sends audit data about queries executed in the workspace to the same workspace.

### Template file

# [Bicep](#tab/bicep)

```bicep
param workspaceName string
param settingName string
param workspaceId string
param storageAccountId string
param eventHubAuthorizationRuleId string
param eventHubName string

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' existing = {
  name: workspaceName
}
resource setting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: settingName
  scope: workspace
  properties: {
    workspaceId: workspaceId
    storageAccountId: storageAccountId
    eventHubAuthorizationRuleId: eventHubAuthorizationRuleId
    eventHubName: eventHubName
    logs: [
      {
        category: 'Audit'
        enabled: true
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string"
    },
    "settingName": {
      "type": "string"
    },
    "workspaceId": {
      "type": "string"
    },
    "storageAccountId": {
      "type": "string"
    },
    "eventHubAuthorizationRuleId": {
      "type": "string"
    },
    "eventHubName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.OperationalInsights/workspaces/{0}', parameters('workspaceName'))]",
      "name": "[parameters('settingName')]",
      "properties": {
        "workspaceId": "[parameters('workspaceId')]",
        "storageAccountId": "[parameters('storageAccountId')]",
        "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
        "eventHubName": "[parameters('eventHubName')]",
        "logs": [
          {
            "category": "Audit",
            "enabled": true
          }
        ]
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
    "settingName": {
        "value": "Send to all locations"
    },
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "workspaceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    },
    "storageAccountId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
    },
    "eventHubAuthorizationRuleId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.EventHub/namespaces/MyNameSpace/authorizationrules/RootManageSharedAccessKey"
    },
    "eventHubName": {
      "value": "my-eventhub"
    }
  }
}
```

## Diagnostic setting for Azure Storage

The following sample creates a diagnostic setting for each storage service endpoint that's available in the Azure Storage account. A setting is applied to each individual storage service that's available on the account. The storage services that are available depend on the type of storage account.

This template creates a diagnostic setting for a storage service in the account only if it exists for the account. For each available service, the diagnostic setting enables transaction metrics, and the collection of resource logs for read, write, and delete operations.

### Template file

# [Bicep](#tab/bicep)

main.bicep

```bicep
param storageAccountName string
param settingName string
param storageSyncName string
param workspaceId string

module nested './module.bicep' = {
  name: 'nested'
  params: {
    endpoints: reference(resourceId('Microsoft.Storage/storageAccounts', storageAccountName), '2019-06-01', 'Full').properties.primaryEndpoints
    settingName: settingName
    storageAccountName: storageAccountName
    storageSyncName: storageSyncName
    workspaceId: workspaceId
  }
}
```

module.bicep

```bicep
param endpoints object
param settingName string
param storageAccountName string
param storageSyncName string
param workspaceId string

var hasblob = contains(endpoints, 'blob')
var hastable = contains(endpoints, 'table')
var hasfile = contains(endpoints, 'file')
var hasqueue = contains(endpoints, 'queue')

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' existing = {
  name: storageAccountName
}

resource diagnosticSetting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: settingName
  scope: storageAccount
  properties: {
    workspaceId: workspaceId
    storageAccountId: resourceId('Microsoft.Storage/storageAccounts', storageSyncName)
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}

resource blob 'Microsoft.Storage/storageAccounts/blobServices@2021-09-01' existing = {
  name:'default'
  parent:storageAccount
}

resource blobSetting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (hasblob) {
  name: settingName
  scope: blob
  properties: {
    workspaceId: workspaceId
    storageAccountId: resourceId('Microsoft.Storage/storageAccounts', storageSyncName)
    logs: [
      {
        category: 'StorageRead'
        enabled: true
      }
      {
        category: 'StorageWrite'
        enabled: true
      }
      {
        category: 'StorageDelete'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}

resource table 'Microsoft.Storage/storageAccounts/tableServices@2021-09-01' existing = {
  name:'default'
  parent:storageAccount
}

resource tableSetting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (hastable) {
  name: settingName
  scope: table
  properties: {
    workspaceId: workspaceId
    storageAccountId: resourceId('Microsoft.Storage/storageAccounts', storageSyncName)
    logs: [
      {
        category: 'StorageRead'
        enabled: true
      }
      {
        category: 'StorageWrite'
        enabled: true
      }
      {
        category: 'StorageDelete'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}

resource file 'Microsoft.Storage/storageAccounts/fileServices@2021-09-01' existing = {
  name:'default'
  parent:storageAccount
}

resource fileSetting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (hasfile) {
  name: settingName
  scope: file
  properties: {
    workspaceId: workspaceId
    storageAccountId: resourceId('Microsoft.Storage/storageAccounts', storageSyncName)
    logs: [
      {
        category: 'StorageRead'
        enabled: true
      }
      {
        category: 'StorageWrite'
        enabled: true
      }
      {
        category: 'StorageDelete'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}

resource queue 'Microsoft.Storage/storageAccounts/queueServices@2021-09-01' existing = {
  name:'default'
  parent:storageAccount
}


resource queueSetting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (hasqueue) {
  name: settingName
  scope: queue
  properties: {
    workspaceId: workspaceId
    storageAccountId: resourceId('Microsoft.Storage/storageAccounts', storageSyncName)
    logs: [
      {
        category: 'StorageRead'
        enabled: true
      }
      {
        category: 'StorageWrite'
        enabled: true
      }
      {
        category: 'StorageDelete'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string"
    },
    "settingName": {
      "type": "string"
    },
    "storageSyncName": {
      "type": "string"
    },
    "workspaceId": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-10-01",
      "name": "nested",
      "properties": {
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "mode": "Incremental",
        "parameters": {
          "endpoints": {
            "value": "[reference(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2019-06-01', 'Full').properties.primaryEndpoints]"
          },
          "settingName": {
            "value": "[parameters('settingName')]"
          },
          "storageAccountName": {
            "value": "[parameters('storageAccountName')]"
          },
          "storageSyncName": {
            "value": "[parameters('storageSyncName')]"
          },
          "workspaceId": {
            "value": "[parameters('workspaceId')]"
          }
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "endpoints": {
              "type": "object"
            },
            "settingName": {
              "type": "string"
            },
            "storageAccountName": {
              "type": "string"
            },
            "storageSyncName": {
              "type": "string"
            },
            "workspaceId": {
              "type": "string"
            }
          },
          "variables": {
            "hasblob": "[contains(parameters('endpoints'), 'blob')]",
            "hastable": "[contains(parameters('endpoints'), 'table')]",
            "hasfile": "[contains(parameters('endpoints'), 'file')]",
            "hasqueue": "[contains(parameters('endpoints'), 'queue')]"
          },
          "resources": [
            {
              "type": "Microsoft.Insights/diagnosticSettings",
              "apiVersion": "2021-05-01-preview",
              "scope": "[format('Microsoft.Storage/storageAccounts/{0}', parameters('storageAccountName'))]",
              "name": "[parameters('settingName')]",
              "properties": {
                "workspaceId": "[parameters('workspaceId')]",
                "storageAccountId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageSyncName'))]",
                "metrics": [
                  {
                    "category": "Transaction",
                    "enabled": true
                  }
                ]
              }
            },
            {
              "condition": "[variables('hasblob')]",
              "type": "Microsoft.Insights/diagnosticSettings",
              "apiVersion": "2021-05-01-preview",
              "scope": "[format('Microsoft.Storage/storageAccounts/{0}/blobServices/{1}', split(parameters('storageAccountName'), '/')[0], split(parameters('storageAccountName'), '/')[1])]",
              "name": "[parameters('settingName')]",
              "properties": {
                "workspaceId": "[parameters('workspaceId')]",
                "storageAccountId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageSyncName'))]",
                "logs": [
                  {
                    "category": "StorageRead",
                    "enabled": true
                  },
                  {
                    "category": "StorageWrite",
                    "enabled": true
                  },
                  {
                    "category": "StorageDelete",
                    "enabled": true
                  }
                ],
                "metrics": [
                  {
                    "category": "Transaction",
                    "enabled": true
                  }
                ]
              }
            },
            {
              "condition": "[variables('hastable')]",
              "type": "Microsoft.Insights/diagnosticSettings",
              "apiVersion": "2021-05-01-preview",
              "scope": "[format('Microsoft.Storage/storageAccounts/{0}/tableServices/{1}', split(parameters('storageAccountName'), '/')[0], split(parameters('storageAccountName'), '/')[1])]",
              "name": "[parameters('settingName')]",
              "properties": {
                "workspaceId": "[parameters('workspaceId')]",
                "storageAccountId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageSyncName'))]",
                "logs": [
                  {
                    "category": "StorageRead",
                    "enabled": true
                  },
                  {
                    "category": "StorageWrite",
                    "enabled": true
                  },
                  {
                    "category": "StorageDelete",
                    "enabled": true
                  }
                ],
                "metrics": [
                  {
                    "category": "Transaction",
                    "enabled": true
                  }
                ]
              }
            },
            {
              "condition": "[variables('hasfile')]",
              "type": "Microsoft.Insights/diagnosticSettings",
              "apiVersion": "2021-05-01-preview",
              "scope": "[format('Microsoft.Storage/storageAccounts/{0}/fileServices/{1}', split(parameters('storageAccountName'), '/')[0], split(parameters('storageAccountName'), '/')[1])]",
              "name": "[parameters('settingName')]",
              "properties": {
                "workspaceId": "[parameters('workspaceId')]",
                "storageAccountId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageSyncName'))]",
                "logs": [
                  {
                    "category": "StorageRead",
                    "enabled": true
                  },
                  {
                    "category": "StorageWrite",
                    "enabled": true
                  },
                  {
                    "category": "StorageDelete",
                    "enabled": true
                  }
                ],
                "metrics": [
                  {
                    "category": "Transaction",
                    "enabled": true
                  }
                ]
              }
            },
            {
              "condition": "[variables('hasqueue')]",
              "type": "Microsoft.Insights/diagnosticSettings",
              "apiVersion": "2021-05-01-preview",
              "name": "[parameters('settingName')]",
              "properties": {
                "workspaceId": "[parameters('workspaceId')]",
                "storageAccountId": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageSyncName'))]",
                "logs": [
                  {
                    "category": "StorageRead",
                    "enabled": true
                  },
                  {
                    "category": "StorageWrite",
                    "enabled": true
                  },
                  {
                    "category": "StorageDelete",
                    "enabled": true
                  }
                ],
                "metrics": [
                  {
                    "category": "Transaction",
                    "enabled": true
                  }
                ]
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
    "storageAccountName": {
      "value": "mymonitoredstorageaccount"
    },
    "settingName": {
      "value": "Send to all locations"
    },
    "storageSyncName": {
      "value": "mystorageaccount"
    },
    "workspaceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/MyResourceGroup/providers/microsoft.operationalinsights/workspaces/MyWorkspace"
    }
  }
}
```

## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md)
* [Learn more about diagnostic settings](../essentials/diagnostic-settings.md)
