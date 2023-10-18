---
title: Manage an Azure Monitor workspace
description: How to create and delete Azure Monitor workspaces.
author: EdB-MSFT
ms.author: edbaynash 
ms.reviewer: poojaa
ms.topic: conceptual
ms.date: 03/28/2023
---

# Manage an Azure Monitor workspace

This article shows you how to create and delete an Azure Monitor workspace. When you configure Azure Monitor managed service for Prometheus, you can select an existing Azure Monitor workspace or create a new one.

> [!NOTE]
> When you create an Azure Monitor workspace, by default a data collection rule and a data collection endpoint in the form `<azure-monitor-workspace-name>` will automatically be created in a resource group in the form `MA_<azure-monitor-workspace-name>_<location>_managed`.

## Create an Azure Monitor workspace
### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal.
2. Select **Create**.

    :::image type="content" source="media/azure-monitor-workspace-overview/view-azure-monitor-workspaces.png" lightbox="media/azure-monitor-workspace-overview/view-azure-monitor-workspaces.png" alt-text="Screenshot of Azure Monitor workspaces menu and page.":::

3. On the **Create an Azure Monitor Workspace** page, select a **Subscription** and **Resource group** where the workspace should be created.
4. Provide a **Name** and a **Region** for the workspace.
5. Select **Review + create** to create the workspace.

### [CLI](#tab/cli)
Use the following command to create an Azure Monitor workspace using Azure CLI.

```azurecli
az resource create --resource-group <resource-group-name> --namespace microsoft.monitor --resource-type accounts --name <azure-monitor-workspace-name> --location <location> --properties "{}"
```

### [Resource Manager](#tab/resource-manager)
Use one of the following Resource Manager templates with any of the [standard deployment options](../resource-manager-samples.md#deploy-the-sample-templates) to create an Azure Monitor workspace.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "type": "string"
        },
        "location": {
            "type": "string",
            "defaultValue": ""
        }
    },
    "resources": [
        {
            "type": "microsoft.monitor/accounts",
            "apiVersion": "2021-06-03-preview",
            "name": "[parameters('name')]",
            "location": "[if(empty(parameters('location')), resourceGroup().location, parameters('location'))]"
        }
    ]
}
```

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location for the workspace.')
param location string = resourceGroup().location

resource workspace 'microsoft.monitor/accounts@2021-06-03-preview' = {
  name: workspaceName
  location: location
}

```
---

When you create an Azure Monitor workspace, a new resource group is created. The resource group name has the following format: `MA_<azure-monitor-workspace-name>_<location>_managed`, where the tokenized elements are lowercased. The resource group contains both a data collection endpoint and a data collection rule with the same name as the workspace. The resource group and its resources are automatically deleted when you delete the workspace.
 
To connect your Azure Monitor managed service for Prometheus to your Azure Monitor workspace, see [Collect Prometheus metrics from AKS cluster](./prometheus-metrics-enable.md)


## Delete an Azure Monitor workspace
When you delete an Azure Monitor workspace, unlike with a [Log Analytics workspace](../logs/delete-workspace.md), there is no soft delete operation. The data in the workspace is immediately deleted, and there's no recovery option.


### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal.
2. Select your workspace.
4. Select **Delete**.

    :::image type="content" source="media/azure-monitor-workspace-overview/delete-azure-monitor-workspace.png" lightbox="media/azure-monitor-workspace-overview/delete-azure-monitor-workspace.png" alt-text="Screenshot of Azure Monitor workspaces delete button.":::

### [CLI](#tab/cli)
To delete an AzureMonitor workspace use `az resource delete`

For example:
```azurecli
  az resource delete --ids /subscriptions/abcdef01-2345-6789-0abc-def012345678/resourcegroups/rg-azmon/providers/microsoft.monitor/accounts/prometheus-metrics-workspace
```
or 

```azurecli
    az resource delete -g rg-azmon -n prometheus-metrics-workspace --resource-type Microsoft.Monitor/accounts
```

### [Resource Manager](#tab/resource-manager)
For information on deleting resources and Azure Resource Manager, see [Azure Resource Manager resource group and resource deletion](../../azure-resource-manager/management/delete-resource-group.md)


---


## Link a Grafana workspace  
Connect an Azure Monitor workspace to an [Azure Managed Grafana](../../managed-grafana/overview.md) workspace to allow Grafana to use the Azure Monitor workspace data in a Grafana dashboard. An Azure Monitor workspace can be connected to multiple Grafana workspaces, and a Grafana workspace can be connected to multiple Azure Monitor workspaces.

> [!NOTE]
> When you add the Azure Monitor workspace as a data source to Grafana, it will be listed in form `Managed_Prometheus_<azure-monitor-workspace-name>`.
### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspace** menu in the Azure portal.
2. Select your workspace.
3. Select **Linked Grafana workspaces**.
4. Select a Grafana workspace.

### [CLI](#tab/cli)

Create a link between the Azure Monitor workspace and the Grafana workspace by updating the Azure Kubernetes Service cluster that you're monitoring.

If your cluster is already configured to send data to an Azure Monitor managed service for Prometheus, you must disable it first using the following command:

```azurecli
az aks update --disable-azuremonitormetrics -g <cluster-resource-group> -n <cluster-name> 
```

Then, either enable or re-enable using the following command:
```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id 
<azure-monitor-workspace-name-resource-id> --grafana-resource-id  <grafana-workspace-name-resource-id>
```

Output
```JSON
"azureMonitorProfile": {
    "metrics": {
        "enabled": true,
        "kubeStateMetrics": {
            "metricAnnotationsAllowList": "",
            "metricLabelsAllowlist": ""
        }
    }
}
```

### [Resource Manager](#tab/resource-manager)  
  

To set up an Azure monitor workspace as a data source for Grafana using a Resource Manager template, see [Collect Prometheus metrics from AKS cluster](prometheus-metrics-enable.md?tabs=resource-manager#enable-prometheus-metric-collection)

---

If your Grafana instance is self managed, see [Use Azure Monitor managed service for Prometheus as data source for self-managed Grafana using managed system identity](./prometheus-self-managed-grafana-azure-active-directory.md)







## Next steps
- [Link a Grafana instance to your Azure Monitor workspace](./prometheus-metrics-enable.md#enable-prometheus-metric-collection)
- Learn more about the [Azure Monitor data platform](../data-platform.md).
- [Azure Monitor workspace Overview](./azure-monitor-workspace-overview.md)
