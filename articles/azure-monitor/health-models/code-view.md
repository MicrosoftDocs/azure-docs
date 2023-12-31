---
title: View the code for a health model
description: Learn how to see and make changes to the underlying JSON data structure for a health model resource by using code view.
ms.topic: conceptual
ms.date: 12/12/2023
---

# View the code for a health model

The code view enables you to see and make changes to the underlying JSON data structure, which defines the health model. This view is mostly for debugging only and shouldn't be required during normal operation.
:::image type="content" source="./media/health-model-code/health-model-resource-code-pane.png" lightbox="./media/health-model-code/health-model-resource-code-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Code pane selected.":::

## Code structure

The structure that the Code view shows can be used to create ARM templates for a fully templatized deployment (see [ARM deployment](./health-model-create-with-arm-template.md)). The shown JSON is what you would put as part of the `nodes` property inside the ARM template. For example:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "healthModelName": {
        "type": "string",
        "metadata": {
          "description": "The name of the health model to create."
        }
      },
      "location": {
        "type": "string",
        "defaultValue": "eastus2",
        "allowedValues": [
          "eastus2"
        ],
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
