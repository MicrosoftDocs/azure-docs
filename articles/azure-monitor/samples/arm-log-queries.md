---
title: Resource Manager template samples for Azure Monitor log queries
description: Sample Azure Resource Manager templates to deploy Azure Monitor log queries.
ms.subservice: logs
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 04/22/2020

---

# Resource Manager template samples for Azure Monitor workspaces
This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/template-syntax.md) to create and configure log queries in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

For more information on log queries, see [Overview of log queries in Azure Monitor](../log-query/log-query-overview.md).

## Add a log query to an existing Log Analytics workspace
The following sample adds two log queries to an existing Log Analytics workspace.

### Template file

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
        },
        {
          "type": "savedSearches",
          "apiVersion": "2017-04-26-preview",
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
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
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

## Add a log query as a function to an existing Log Analytics workspace
The following sample adds a log query to an existing Log Analytics workspace.

### Template file

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
          "apiVersion": "2017-04-26-preview",
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
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
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

* [Deploy Windows agent to Azure VMs using Resource Manager template](../../virtual-machines/extensions/oms-windows.md).
* [Deploy Linux agent to Azure VMs using Resource Manager template](../../virtual-machines/extensions/oms-linux.md).
