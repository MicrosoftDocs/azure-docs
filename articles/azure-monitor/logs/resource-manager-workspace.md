---
title: Resource Manager template samples for Log Analytics workspaces
description: Sample Azure Resource Manager templates to deploy Log Analytics workspaces and configure data sources in Azure Monitor.
ms.topic: sample
ms.custom: devx-track-arm-template
author: bwren
ms.author: bwren
ms.date: 08/08/2023
---

# Resource Manager template samples for Log Analytics workspaces in Azure Monitor

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create and configure [Log Analytics workspaces](./log-analytics-workspace-overview.md) in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

##  Prerequisites

Verify that your Azure subscription allows you to create Log Analytics workspaces in the target region.

## Permissions required

| Action | Permissions required |
|:---|:---|
| Deploy ARM templates. | `Microsoft.Resources/deployments/*` permissions, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |
| Create a Log Analytics workspace. | `Microsoft.OperationalInsights/workspaces/write` permissions, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |
| Configure data collection for Log Analytics workspace. | `Microsoft.OperationalInsights/workspaces/write` and `Microsoft.OperationalInsights/workspaces/dataSources/write` permissions, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |

## Template references

- [Microsoft.OperationalInsights workspaces](/azure/templates/microsoft.operationalinsights/2020-03-01-preview/workspaces)
- [Microsoft.OperationalInsights workspaces/dataSources](/azure/templates/microsoft.operationalinsights/2020-03-01-preview/workspaces/datasources)

## Create a Log Analytics workspace

The following sample creates a new empty [Log Analytics workspace](./log-analytics-workspace-insights-overview.md). A workspace has unique workspace ID and resource ID. You can reuse the same workspace name when in different [resource groups](../../azure-resource-manager/management/manage-resource-groups-portal.md#what-is-a-resource-group).

### Notes

- If you specify a pricing tier of **Free**, then remove the **retentionInDays** element.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location for the workspace.')
param location string

@description('Specify the pricing tier: PerGB2018 or legacy tiers (Free, Standalone, PerNode, Standard or Premium) which are not available to all customers.')
@allowed([
  'CapacityReservation'
  'Free'
  'LACluster'
  'PerGB2018'
  'PerNode'
  'Premium'
  'Standalone'
  'Standard'
])
param sku string = 'PerGB2018'

@description('Specify the number of days to retain data.')
param retentionInDays int = 120

@description('Specify true to use resource or workspace permissions, or false to require workspace permissions.')
param resourcePermissions bool

@description('Specify the number of days to retain data in Heartbeat table.')
param heartbeatTableRetention int

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
  properties: {
    sku: {
      name: sku
    }
    retentionInDays: retentionInDays
    features: {
      enableLogAccessUsingOnlyResourcePermissions: resourcePermissions
    }
  }
}

resource table 'Microsoft.OperationalInsights/workspaces/tables@2021-12-01-preview' = {
  parent: workspace
  name: 'Heartbeat'
  properties: {
    retentionInDays: heartbeatTableRetention
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
      "type": "string",
      "metadata": {
        "description": "Specify the name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "Specify the location for the workspace."
      }
    },
    "sku": {
      "type": "string",
      "defaultValue": "PerGB2018",
      "allowedValues": [
        "CapacityReservation",
        "Free",
        "LACluster",
        "PerGB2018",
        "PerNode",
        "Premium",
        "Standalone",
        "Standard"
      ],
      "metadata": {
        "description": "Specify the pricing tier: PerGB2018 or legacy tiers (Free, Standalone, PerNode, Standard or Premium) which are not available to all customers."
      }
    },
    "retentionInDays": {
      "type": "int",
      "defaultValue": 120,
      "metadata": {
        "description": "Specify the number of days to retain data."
      }
    },
    "resourcePermissions": {
      "type": "bool",
      "metadata": {
        "description": "Specify true to use resource or workspace permissions, or false to require workspace permissions."
      }
    },
    "heartbeatTableRetention": {
      "type": "int",
      "metadata": {
        "description": "Specify the number of days to retain data in Heartbeat table."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {
        "sku": {
          "name": "[parameters('sku')]"
        },
        "retentionInDays": "[parameters('retentionInDays')]",
        "features": {
          "enableLogAccessUsingOnlyResourcePermissions": "[parameters('resourcePermissions')]"
        }
      }
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/tables",
      "apiVersion": "2021-12-01-preview",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'Heartbeat')]",
      "properties": {
        "retentionInDays": "[parameters('heartbeatTableRetention')]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
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
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "sku": {
      "value": "PerGB2018"
    },
    "location": {
      "value": "eastus"
    },
    "resourcePermissions": {
      "value": true
    },
    "heartbeatTableRetention": {
      "value": 30
    }
  }
}
```

## Deploy the sample templates

See [Deploy the sample templates](../resource-manager-samples.md).

## Next steps

- [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
- [Learn more about Log Analytics workspaces](./quick-create-workspace.md).
- [Learn more about agent data sources](../agents/agent-data-sources.md).
