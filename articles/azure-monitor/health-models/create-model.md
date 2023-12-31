---
title: Create a health model resource in Azure Monitor
description: Learn now to create a health model resource.
ms.topic: conceptual
ms.date: 12/12/2023
---

# Create a health model resource in Azure Monitor

As an alternative to the portal UI wizard, it's also possible to create a health model using an ARM template. You can either create just the empty resource - like the portal wizard does - or also a fully designed model with all entities (currently represented as `nodes` in the template), signals etc.



## [ARM](#tab/arm)

The following shows a sample template to create the empty resource:

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
          "eastus2",
          "uksouth"
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
          "nodes": null
        }
      }
    ]
}
```

## [Bicep](#tab/bicep)

> [!TIP]
> The `nodes: []` section can become very complex. Using the [Designer view](./health-model-create-modify-with-designer.md) with the [Code view](./health-model-code.md) can help to define a health model via the UI and take the code artifacts over to Infra-as-Code.

Here's an example template:

```bicep
resource healthModel 'Microsoft.HealthModel/healthmodels@2022-11-01-preview' = {
  name: 'sample-healthmodel'
  location: hmLocation
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    activeState: 'Inactive'
    refreshInterval: 'PT1M'
    nodes: [
      {
        nodeType: 'AggregationNode'
        nodeId: '0'
        name: 'root node'
        impact: 'Standard'
        childNodeIds: [
            '1'
        ]
        visual: {
          x: 0
          y: 0
        }
      }
      {
        nodeType: 'AggregationNode'
        nodeId: '1'
        name: 'child node 1'
        impact: 'Standard'
        childNodeIds: []
        visual: {
          x: 0
          y: -60
        }
      }
    ]
  }
}
```

## Arguments

| Argument | Description |
|:---|:---|
| `identity` | For more information, see [Identity](./health-model-configure-identity.md). |
| `properties` | Contains the HM configuration:<ul><li>`activeState` can be set to `Inactive` or `Active`.</li><li>`refreshInterval` is the execution interval of the Health Model.</li><li>`nodes`. For more information, see [Nodes](#nodes).</li></ul> |

### Nodes

The `nodes` section contains the definition of the health model, its entities and signals:

| Argument | Description |
|:---|:---|
| `nodeType` | Always needs to be on top of each node (entity) definition. It can be set to `AggregationNode`, `LogAnalyticsNode`, `AzureResourceNode` or `PrometheusNode`. |
| `nodeId` (string) | Unique value used to identify and address nodes within the model. |
| `nodeKind` (optional) | Can be used to define the type of a logical aggregation node. Can be set to `Generic`, `UserFlow` or `SystemComponent`. |
| `name` | Display name of a node. |
| `logAnalyticsResourceId` (optional) | Resource ID of the Log Analytics workspace used. |
| `logAnalyticsWorkspaceId` (optional) | Workspace ID used to do log queries. |
| `impact` (optional) | Can be set to `Standard` (default), `Limited` or `Suppressed`. |
|  `childNodeIds` | Contains an array of child node IDs. |
| `visual` | Contains the visual position of a node on the health models canvas. |

### Example definition for an `AggregationNode` entity

```bicep
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

```bicep
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

## [Terraform](#tab/terraform)

Azure Health Models can be deployed using the AzApi Terraform provider. Before you deploy an AHM instance, you need to decide if you'd like to deploy AHM with a system-assigned Identity or a user-assigned Identity. For more information, see [Configure the Managed Identity for a health model](./health-model-configure-identity.md).

The process itself is mostly similar. The main difference is that the user-assigned Identity needs to be created as well. This creation can also be done via Terraform.

### Examples

- [Deploy with system-assigned Identity](https://github.com/Azure/ahm-quickstart/blob/main/docs/samples/tf-with-sai.tf)
- [Deploy with user-assigned Identity](https://github.com/Azure/ahm-quickstart/blob/main/docs/samples/tf-with-uai.tf)

## Usage

The provided samples work as-is and can be deployed into a sandbox or non-production environment.

The example that uses system-assigned Identity deploys an AHM instance in a separate resource group:

:::image type="content" source="./media/health-model-deploy-using-terraform/resource-group-health-model-resource.png" lightbox="./media/health-model-deploy-using-terraform/resource-group-health-model-resource.png" alt-text="Screenshot of a resource group in the Azure portal with a health model resource listed within it.":::

The example using a user-assigned Identity deploys a Managed Identity + an AHM instance:

:::image type="content" source="./media/health-model-deploy-using-terraform/resource-group-managed-identity-health-model-resources.png" lightbox="./media/health-model-deploy-using-terraform/resource-group-managed-identity-health-model-resources.png" alt-text="Screenshot of a resource group in the Azure portal. Managed identity and health model resources are listed within the resource group.":::

The Managed Identity resource is assigned to the AHM instance:

:::image type="content" source="./media/health-model-deploy-using-terraform/health-model-resource-identity-pane-user-assigned-tab.png" lightbox="./media/health-model-deploy-using-terraform/health-model-resource-identity-pane-user-assigned-tab.png" alt-text="Screenshot of the Identity pane for a health model resource in the Azure portal. The User assigned tab is selected.":::

The example with system-assigned Identity also contains example role assignments:

- Grant a specific Azure AD group "Contributor" permissions on the AHM instance
- Grant the AHM's identity "Monitoring Reader" permissions on subscription-level

### Limitations

- Deploying a Health Model with nodes, such as its property bag, is currently not possible with azapi. For example, this deployment can be achieved by using [azurerm_resource_group_template_deployment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group_template_deployment) instead.

---