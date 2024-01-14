---
title: Resource Manager template samples for Azure Monitor health models
description: Sample Azure Resource Manager templates to deploy Azure Monitor health model.
ms.topic: sample
ms.custom: devx-track-arm-template
author: bwren
ms.author: bwren
ms.date: 08/08/2023
---

# Resource Manager template samples for Azure Monitor health models

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create and define an [Azure Monitor health model](./overview.md) in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

The `node` section of the JSON includes the definition of the health model. See [Code view in Azure Monitor health models](./create-model.md#designer-view) for details on this definition. One method is to define the health model using the [designer view](./create-model.md#designer-view) and the copy and paste the definition from the code view.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Template file

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "healthModelName": {
        "type": "string",
        "metadata": {3
          "description": "The name of the health model to create."
        }
      },
      "location": {
        "type": "string",
        "metadata": {
          "description": "The location of the health model resource."
        }
      }
    },
    "resources": [
      {
        "type": "Microsoft.HealthModel/healthmodels",
        "apiVersion": "2022-11-01-preview",
        "name": "[parameters('healthModelName')]",
        "location": "[parameters('location')]",
        "identity": {
          "type": "SystemAssigned"
        },
        "properties": {
          "activeState": "Inactive",
          "refreshInterval": "PT1M",
          "nodes": [
            {
                "nodeType": "AggregationNode",
                "nodeId": "0",
                "name": "My root node",
                "childNodeIds": [
                    "2cd5f0bb-10ac-4124-89c6-91bde135a724"
                ],
                "visual": {
                    "x": 0,
                    "y": 0
                },
                "impact": "Standard"
            },
            {
                "nodeType": "AzureResourceNode",
                "azureResourceId": "/subscriptions/1111111-2222-333-b352-828cbd55d6f4/resourceGroups/my-rg/providers/Microsoft.Cache/Redis/my-cache",
                "nodeId": "2cd5f0bb-10ac-4124-89c6-91bde135a724",
                "name": "my-cache",
                "credentialId": "SystemAssigned",
                "childNodeIds": [],
                "queries": [],
                "visual": {
                    "x": 0,
                    "y": 165
                },
                "impact": "Standard"
            }
          ]
        }
      }
    ]
}
```

## Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "healthModelName": {
      "value": "MyHealthModel"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

## Next steps

- [Get details on the health model definition in JSON](./code-view.md)
- [Learn more about health models](./overview.md).
- [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
