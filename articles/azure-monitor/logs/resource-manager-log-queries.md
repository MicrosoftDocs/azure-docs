---
title: Resource Manager template samples for log queries
description: Sample Azure Resource Manager templates to deploy Azure Monitor log queries.
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 05/18/2020

---

# Resource Manager template samples for log queries in Azure Monitor
This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create and configure log queries in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]


## Template references

- [Microsoft.OperationalInsights workspaces/savedSearches](/azure/templates/microsoft.operationalinsights/2020-03-01-preview/workspaces/savedsearches)

## Simple log query
The following sample adds a log query to a Log Analytics workspace.

### Template file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
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
      "apiVersion": "2020-08-01",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "resources": [
        {
          "type": "savedSearches",
          "apiVersion": "2015-03-20",
          "name": "VMSS query",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "properties": {
            "eTag": "*",
            "displayName": "VMSS Instance Count",
            "category": "VMSS",
            "query": "Event | where Source == \"ServiceFabricNodeBootstrapAgent\" | summarize AggregatedValue = count() by Computer",
            "version": 1
          }
        }
      ]
    }
  ]
}

```

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentParameters.json#",
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

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
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

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentParameters.json#",
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

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
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
      "apiVersion": "2020-08-01",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "resources": [
        {
          "type": "savedSearches",
          "apiVersion": "2020-08-01",
          "name": "Parameterized function",
            "dependsOn": [
              "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
            ],
            "properties": {
              "etag": "*",
              "displayName": "Unavailable computers function",
              "category": "Samples",
              "FunctionAlias": "UnavailableComputers",
              "FunctionParameters": "argSpan: timespan",
              "query": " Heartbeat | summarize LastHeartbeat=max(TimeGenerated) by Computer| where LastHeartbeat < ago(argSpan)"
          }
        },
        {
          "type": "savedSearches",
          "apiVersion": "2020-08-01",
          "name": "Query using function",
            "dependsOn": [
              "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
            ],
            "properties": {
              "etag": "*",
              "displayName": "Unavailable computers",
              "category": "Samples",
              "query": "UnavailableComputers(7days)"
          }
        }
      ]
    }
  ]
}

```

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentParameters.json#",
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

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about log queries](../logs/log-query-overview.md).
* [Learn more about functions](../logs/functions.md).