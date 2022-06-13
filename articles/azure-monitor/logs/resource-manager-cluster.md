---
title: Resource Manager template samples for Log Analytics clusters
description: Sample Azure Resource Manager templates to deploy Log Analytics clusters.
ms.topic: sample
author: yossiy
ms.author: yossiy
ms.date: 06/13/2022

---

# Resource Manager template samples for Log Analytics clusters in Azure Monitor

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create and configure Log Analytics clusters in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Template references

- [Microsoft.OperationalInsights clusters](/azure/templates/microsoft.operationalinsights/2020-03-01-preview/clusters)

## Create a Log Analytics cluster

The following sample creates a new empty Log Analytics cluster.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('The name of the Log Analytics cluster.')
param clusterName string

@description('The location of the soureces.')
param location string = resourceGroup().location

@description('The Capacity Reservation value.')
@allowed([
  500
  1000
  2000
  5000
])
param CommitmentTier int = 500

@description('The billing type settings. Can be \'Cluster\' (default) or \'Workspaces\' for proportional billing on workspaces.')
@allowed([
  'Cluster'
  'Workspaces'
])
param billingType string = 'Cluster'

resource cluster 'Microsoft.OperationalInsights/clusters@2021-06-01' = {
  name: clusterName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'CapacityReservation'
    capacity: CommitmentTier
  }
  properties: {
    billingType: billingType
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
      "type": "string",
      "metadata": {
        "description": "The name of the Log Analytics cluster."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location of the soureces."
      }
    },
    "CommitmentTier": {
      "type": "int",
      "defaultValue": 500,
      "allowedValues": [
        500,
        1000,
        2000,
        5000
      ],
      "metadata": {
        "description": "The Capacity Reservation value."
      }
    },
    "billingType": {
      "type": "string",
      "defaultValue": "Cluster",
      "allowedValues": [
        "Cluster",
        "Workspaces"
      ],
      "metadata": {
        "description": "The billing type settings. Can be 'Cluster' (default) or 'Workspaces' for proportional billing on workspaces."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/clusters",
      "apiVersion": "2021-06-01",
      "name": "[parameters('clusterName')]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "sku": {
        "name": "CapacityReservation",
        "capacity": "[parameters('CommitmentTier')]"
      },
      "properties": {
        "billingType": "[parameters('billingType')]"
      }
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "value": "MyCluster"
    },
    "CommitmentTier": {
      "value": 500
    },
    "billingType": {
      "value": "Cluster"
    }
  }
}
```

## Update a Log Analytics cluster

The following sample updates a Log Analytics cluster to use customer-managed key.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('The name of the Log Analytics cluster.')
param clusterName string

@description('The location of the resources')
param location string = resourceGroup().location

@description('The key identifier URI.')
param keyVaultUri string = 'https://key-vault-name.vault.azure.net'

@description('The key name.')
param keyName string = 'key-name'

@description('The key version. When empty, latest key version is used.')
param keyVersion string = 'current-version'

resource cluster 'Microsoft.OperationalInsights/clusters@2021-06-01' = {
  name: clusterName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    keyVaultProperties: {
      keyVaultUri: keyVaultUri
      keyName: keyName
      keyVersion: keyVersion
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
    "clusterName": {
      "type": "string",
      "metadata": {
        "description": "The name of the Log Analytics cluster."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location of the resources"
      }
    },
    "keyVaultUri": {
      "type": "string",
      "defaultValue": "https://key-vault-name.vault.azure.net",
      "metadata": {
        "description": "The key identifier URI."
      }
    },
    "keyName": {
      "type": "string",
      "defaultValue": "key-name",
      "metadata": {
        "description": "The key name."
      }
    },
    "keyVersion": {
      "type": "string",
      "defaultValue": "current-version",
      "metadata": {
        "description": "The key version. When empty, latest key version is used."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/clusters",
      "apiVersion": "2021-06-01",
      "name": "[parameters('clusterName')]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "keyVaultProperties": {
          "keyVaultUri": "[parameters('keyVaultUri')]",
          "keyName": "[parameters('keyName')]",
          "keyVersion": "[parameters('keyVersion')]"
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
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "value": "MyCluster"
    },
    "keyVaultUri": {
      "value": "https://key-vault-name.vault.azure.net"
    },
    "keyName": {
      "value": "MyKeyName"
    },
    "keyVersion": {
      "value": ""
    }
  }
}
```

## Next steps

- [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
- [Learn more about Log Analytics dedicated clusters](./logs-dedicated-clusters.md).
- [Learn more about agent data sources](../agents/agent-data-sources.md).
