---
title: Resource Manager template samples for Log Analytics clusters
description: Sample Azure Resource Manager templates to deploy Log Analytics clusters.
ms.topic: sample
ms.custom: devx-track-arm-template
ms.reviewer: yossiy
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
@description('Specify the name of the Log Analytics cluster.')
param clusterName string

@description('Specify the location of the resources.')
param location string = resourceGroup().location

@description('Specify the capacity reservation value.')
@allowed([
  500
  1000
  2000
  5000
])
param CommitmentTier int

@description('Specify the billing type settings. Can be \'Cluster\' (default) or \'Workspaces\' for proportional billing on workspaces.')
@allowed([
  'Cluster'
  'Workspaces'
])
param billingType string

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
        "description": "Specify the name of the Log Analytics cluster."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Specify the location of the resources."
      }
    },
    "CommitmentTier": {
      "type": "int",
      "allowedValues": [
        500,
        1000,
        2000,
        5000
      ],
      "metadata": {
        "description": "Specify the capacity reservation value."
      }
    },
    "billingType": {
      "type": "string",
      "allowedValues": [
        "Cluster",
        "Workspaces"
      ],
      "metadata": {
        "description": "Specify the billing type settings. Can be 'Cluster' (default) or 'Workspaces' for proportional billing on workspaces."
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
@description('Specify the name of the Log Analytics cluster.')
param clusterName string

@description('Specify the location of the resources')
param location string = resourceGroup().location

@description('Specify the key vault name.')
param keyVaultName string

@description('Specify the key name.')
param keyName string

@description('Specify the key version. When empty, latest key version is used.')
param keyVersion string

var keyVaultUri = format('{0}{1}', keyVaultName, environment().suffixes.keyvaultDns)

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
        "description": "Specify the name of the Log Analytics cluster."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Specify the location of the resources"
      }
    },
    "keyVaultName": {
      "type": "string",
      "metadata": {
        "description": "Specify the key vault name."
      }
    },
    "keyName": {
      "type": "string",
      "metadata": {
        "description": "Specify the key name."
      }
    },
    "keyVersion": {
      "type": "string",
      "metadata": {
        "description": "Specify the key version. When empty, latest key version is used."
      }
    }
  },
  "variables": {
    "keyVaultUri": "[format('{0}{1}', parameters('keyVaultName'), environment().suffixes.keyvaultDns)]"
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
          "keyVaultUri": "[variables('keyVaultUri')]",
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
