---
title: Sample ARM template for Azure Monitor health model
description: Sample 
ms.topic: conceptual
ms.date: 12/12/2023
---

# Sample ARM template for Azure Monitor health model

The code view for Azure Monitor health models enables you to view and modify the underlying JSON data structure that defines the health model. While the [designer view](./designer-view.md) is the recommended way to create and modify health models, the code view can be useful for making bulk changes. For example, use search and replace with the JSON to rename a large number of nodes or copy and paste a large number of nodes from another health model. You can also use the code view to create an [ARM template](./health-model-create-with-arm-template.md) for a fully templatized deployment.

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



| Argument | Description |
|:---|:---|
| `nodeType` | Must be set to one of the following values:<br><br>- `AzureResourceNode` - Node that represents an Azure resource<br>- `AggregationNode` - Aggregation node with no signal defined<br>- `LogAnalyticsNode` - Aggregate node configured for Log Analytics signals<br>- `PrometheusNode` - Aggregation node configured for Prometheus signals |
| `nodeId` | GUID that uniquely identifies the node. The root node always has a value of 0. |
| `nodeKind` (optional) | Identifies the type of aggregation node. Not used with Azure resource nodes.<br>Must be set to one of the following values:<br><br>- `Generic`<br>- `UserFlow`<br>- `SystemComponent` |
| `name` | Display name of the node. |
| `logAnalyticsResourceId` | Resource ID of the Log Analytics workspace for nodes that are configured for Log Analytics signals. |
| `logAnalyticsWorkspaceId` | Resource ID of the Log Analytics workspace for nodes that are configured for Log Analytics signals. |
| `azureMonitorWorkspaceResourceId` | Resource ID of the Log Analytics workspace for nodes that are configured for Log Analytics signals. |
| `impact` | Specifies the [impact](./health-state.md#impact) of the node's health state.<br>Must be set to one of the following values:<br><br> Can be set to `Standard` (default), `Limited` or `Suppressed`. |
|  `childNodeIds` | Array of `nodeId` for any nodes that should be children of the node. |
| `visual` | Horizontal and vertical position of the node in the [designer view](./designer-view.md). |

### Example definition for an `AggregationNode` entity

```json
{
    nodeType: 'AggregationNode'
    nodeId: guid('Frontend API')
    name: 'Frontend API'
    childNodeIds: [
        'childId1'
        'childId2'
    ]
    queries: []
    visual: {
        x: -285
        y: 270
    }
    nodeKind: 'SystemComponent'
}
```

### Example definition for an `AzureResourceNode` entity

```json
{
    nodeType: 'AzureResourceNode'
    azureResourceId: aksCluster.id // reference to the Azure Resource via its Resource Id
    nodeId: guid(aksCluster.id) // needs to be a string unique within the health model
    name: 'AKS Cluster'
    credentialId: 'SystemAssigned'
    childNodeIds: []
    queries: [
        {
        queryType: 'ResourceMetricsQuery'
        metricName: 'node_cpu_usage_percentage'
        metricNamespace: 'microsoft.containerservice/managedclusters'
        aggregationType: 'Average'
        queryId: guid(aksCluster.id, 'node_cpu_usage_percentage')
        degradedThreshold: '75'
        degradedOperator: 'GreaterThan'
        unhealthyThreshold: '85'
        unhealthyOperator: 'GreaterThan'
        timeGrain: 'PT30M'
        dataUnit: 'Percent'
        enabledState: 'Enabled'
        }
    ]
}
```

> [!NOTE]
> The use of `guid()` for `nodeId` and `queryId` is not mandatory and the use is only an example.