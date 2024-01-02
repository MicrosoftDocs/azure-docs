---
title: Resource Manager template samples for log queries
description: Sample Azure Resource Manager templates to deploy Azure Monitor log queries.
ms.topic: sample
ms.custom: devx-track-arm-template
author: guywi-ms
ms.author: guywild
ms.date: 06/13/2022
---

# Resource Manager template samples for log queries in Azure Monitor

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create and configure log queries in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Template references

- [Microsoft.OperationalInsights workspaces/savedSearches](/azure/templates/microsoft.operationalinsights/2020-03-01-preview/workspaces/savedsearches)

## Simple log query

The following sample adds a log query to a Log Analytics workspace.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('The name of the workspace.')
param workspaceName string

@description('The location of the resources.')
param location string = resourceGroup().location

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
}

resource savedSearch 'Microsoft.OperationalInsights/workspaces/savedSearches@2020-08-01' = {
  parent: workspace
  name: 'VMSS query'
  properties: {
    etag: '*'
    displayName: 'VMSS Instance Count'
    category: 'VMSS'
    query: 'Event | where Source == "ServiceFabricNodeBootstrapAgent" | summarize AggregatedValue = count() by Computer'
    version: 1
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
        "description": "The name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location of the resources."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/savedSearches",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'VMSS query')]",
      "properties": {
        "etag": "*",
        "displayName": "VMSS Instance Count",
        "category": "VMSS",
        "query": "Event | where Source == \"ServiceFabricNodeBootstrapAgent\" | summarize AggregatedValue = count() by Computer",
        "version": 1
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
    "location": {
      "value": "eastus"
    }
  }
}
```

## Log query as a function

The following sample adds a log query as a function to a Log Analytics workspace.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('The name of the workspace.')
param workspaceName string

@description('The location of the resources.')
param location string = resourceGroup().location

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
}

resource savedSearch 'Microsoft.OperationalInsights/workspaces/savedSearches@2020-08-01' = {
  parent: workspace
  name: 'VMSS query'
  properties: {
    etag: '*'
    displayName: 'VMSS Instance Count'
    category: 'VMSS'
    query: 'Event | where Source == "ServiceFabricNodeBootstrapAgent" | summarize AggregatedValue = count() by Computer'
    version: 1
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
      "location": {
        "type": "string"
      }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2017-03-15-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "resources": [
        {
          "type": "savedSearches",
          "apiVersion": "2020-08-01",
          "name": "Cross workspace query",
            "dependsOn": [
              "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
            ],
            "properties": {
              "etag": "*",
              "displayName": "Failed Logon Events",
              "category": "Security",
              "FunctionAlias": "failedlogonsecurityevents",
              "query": "
                union withsource=SourceWorkspace
                workspace('workspace1').SecurityEvent,
                workspace('workspace2').SecurityEvent,
                workspace('workspace3').SecurityEvent,
                | where EventID == 4625",
              "version": 1
          }
        }
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
    "location": {
      "value": "eastus"
    }
  }
}
```

## Parameterized function

The following sample adds a log query as a function that uses a parameter to a Log Analytics workspace. A second log query is included that uses the parameterized function.

> [!NOTE]
> Resource template is currently the only method that can be used to parameterized functions. Any log query can use the function once it's installed in the workspace.

### Template file

# [Bicep](#tab/bicep)

```bicep
param workspaceName string
param location string

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
}

resource parameterizedFunctionSavedSearch 'Microsoft.OperationalInsights/workspaces/savedSearches@2020-08-01' = {
  parent: workspace
  name: 'Parameterized function'
  properties: {
    etag: '*'
    displayName: 'Unavailable computers function'
    category: 'Samples'
    functionAlias: 'UnavailableComputers'
    functionParameters: 'argSpan: timespan'
    query: ' Heartbeat | summarize LastHeartbeat=max(TimeGenerated) by Computer| where LastHeartbeat < ago(argSpan)'
  }
}

resource queryUsingFunctionSavedSearch 'Microsoft.OperationalInsights/workspaces/savedSearches@2020-08-01' = {
  parent: workspace
  name: 'Query using function'
  properties: {
    etag: '*'
    displayName: 'Unavailable computers'
    category: 'Samples'
    query: 'UnavailableComputers(7days)'
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
    "location": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/savedSearches",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'Parameterized function')]",
      "properties": {
        "etag": "*",
        "displayName": "Unavailable computers function",
        "category": "Samples",
        "functionAlias": "UnavailableComputers",
        "functionParameters": "argSpan: timespan",
        "query": " Heartbeat | summarize LastHeartbeat=max(TimeGenerated) by Computer| where LastHeartbeat < ago(argSpan)"
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/savedSearches",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'Query using function')]",
      "properties": {
        "etag": "*",
        "displayName": "Unavailable computers",
        "category": "Samples",
        "query": "UnavailableComputers(7days)"
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
    "location": {
      "value": "eastus"
    }
  }
}
```

## Next steps

- [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
- [Learn more about log queries](../logs/log-query-overview.md).
- [Learn more about functions](../logs/functions.md).
