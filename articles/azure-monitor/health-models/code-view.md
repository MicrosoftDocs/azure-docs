---
title: View the code for a health model
description: Learn how to see and make changes to the underlying JSON data structure for a health model resource by using code view.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# Code view in Azure Monitor health models

The code view for Azure Monitor health models enables you to view and modify the underlying JSON data structure that defines the health model. While the [designer view](./designer-view.md) is the recommended way to create and modify health models, the code view can be useful for making bulk changes. For example, use search and replace with the JSON to rename a large number of nodes or copy and paste a large number of nodes from another health model. You can also use the code view to create an [ARM template](./resource-manager-health-model.md) for a fully templatized deployment.

:::image type="content" source="./media/health-model-code/health-model-resource-code-pane.png" lightbox="./media/health-model-code/health-model-resource-code-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Code pane selected.":::

## Code structure


| Argument | Description |
|:---|:---|
| `nodeType` | Must be set to one of the following values:<br><br>- `AzureResourceNode` - Node that represents an Azure resource<br>- `AggregationNode` - Aggregation node with no signal defined<br>- `LogAnalyticsNode` - Aggregate node configured for Log Analytics signals<br>- `PrometheusNode` - Aggregation node configured for Prometheus signals |
| `nodeId` | GUID that uniquely identifies the node. The root node always has a value of 0. |
| `nodeKind` | Identifies the type of aggregation node. Not used with Azure resource nodes.<br>Must be set to one of the following values:<br><br>- `Generic`<br>- `UserFlow`<br>- `SystemComponent` |
| `name` | Display name of the node. |
| `logAnalyticsResourceId` | Resource ID of the Log Analytics workspace for nodes that are configured for Log Analytics signals. |
| `logAnalyticsWorkspaceId` | Workspace ID of the Log Analytics workspace for nodes that are configured for Log Analytics signals. |
| `azureMonitorWorkspaceResourceId` | Resource ID of the Azure Monitor workspace for nodes that are configured for Prometheus signals. |
| `impact` | Specifies the [impact](./health-state.md#impact) of the node's health state.<br>Must be set to one of the following values:<br><br>- `Standard` (default)<br>- `Limited`<br>- `Suppressed`. |
| `childNodeIds` | Array of `nodeId` values for any nodes that should be children of the current node. |
| `visual` | Horizontal and vertical position of the node in the [designer view](./designer-view.md). |
| `healthTargetPercentage` | Value for the target service level. Only used on the root entity.  |

## Example definition for an `AggregationNode` entity

```json
   {
      "nodeType": "AggregationNode",
      "nodeId": "00000000-0000-0000-0000-000000000000",
      "name": "my-user-flow",
      "childNodeIds": [
         "00000000-0000-0000-0000-000000000000",
         "00000000-0000-0000-0000-000000000000"
      ],
      "visual": {
         "x": 135,
         "y": -105
      },
      "nodeKind": "UserFlow",
      "impact": "Standard"
   }
```


## Example definition for an `AzureResourceNode` entity

```json
{
    "nodeType": "AzureResourceNode",
    "azureResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.ContainerService/managedClusters/my-cluster",
    "logAnalyticsResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace",
    "logAnalyticsWorkspaceId": "00000000-0000-0000-0000-000000000000",
    "nodeId": "00000000-0000-0000-0000-000000000000",
    "name": "my-cluster",
    "credentialId": "SystemAssigned",
    "childNodeIds": [],
    "queries": [
         {
            "queryType": "ResourceMetricsQuery",
            "metricName": "node_cpu_usage_percentage",
            "metricNamespace": "microsoft.containerservice/managedclusters",
            "aggregationType": "Average",
            "queryId": "00000000-0000-0000-0000-000000000000",
            "degradedThreshold": "75",
            "degradedOperator": "GreaterThan",
            "unhealthyThreshold": "85",
            "unhealthyOperator": "GreaterThan",
            "timeGrain": "PT15M",
            "dataUnit": "Percent",
            "enabledState": "Enabled"
         },
         {
            "queryType": "ResourceMetricsQuery",
            "metricName": "node_disk_usage_percentage",
            "metricNamespace": "microsoft.containerservice/managedclusters",
            "aggregationType": "Average",
            "queryId": "00000000-0000-0000-0000-000000000000",
            "degradedThreshold": "75",
            "degradedOperator": "GreaterThan",
            "unhealthyThreshold": "90",
            "unhealthyOperator": "GreaterThan",
            "timeGrain": "PT15M",
            "dataUnit": "Percent",
            "enabledState": "Enabled"
         }
    ]
}
```

