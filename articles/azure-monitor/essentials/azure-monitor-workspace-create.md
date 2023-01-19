---
title: Manage a Azure Monitor workspace (preview)
description: How to create and delete Azure Monitor workspaces.
author: EdB-MSFT
ms.author: edbaynash 
ms.topic: conceptual
ms.date: 19/01/2023
---


# Manage an Azure Monitor workspace

This article shows you how to create and delete an Azure Monitor workspace and link it toa Grafana instance.

In addition to the methods below, you may be given the option to create a new Azure Monitor workspace in the Azure portal as part of a configuration that requires one. For example, when you configure Azure Monitor managed service for Prometheus, you can select an existing Azure Monitor workspace or create a new one.

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
az resource create --resource-group <resource-group-name> --namespace microsoft.monitor --resource-type accounts --name <azure-monitor-workspace-name> --location <location> --properties {}
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


## Delete an Azure Monitor workspace
When you delete an Azure Monitor workspace, no soft-delete operation is performed like with a [Log Analytics workspace](../logs/delete-workspace.md). The data in the workspace is immediately deleted, and there's no recovery option.


### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal.
2. Select your workspace.
4. Select **Delete**.

    :::image type="content" source="media/azure-monitor-workspace-overview/delete-azure-monitor-workspace.png" lightbox="media/azure-monitor-workspace-overview/delete-azure-monitor-workspace.png" alt-text="Screenshot of Azure Monitor workspaces delete button.":::

### [CLI](#tab/cli)
To delete an AzureMonitor workspace use [az resource delete](https://learn.microsoft.com/cli/azure/resource?view=azure-cli-latest#az-resource-delete)

For example:
```azurecli
  az resource delete --ids /subscriptions/abcdef01-2345-6789-0abc-def012345678/resourcegroups/rg-azmon/providers/microsoft.monitor/accounts/prometheus-metrics-workspace
```
or 

```azurecli
    az resource delete -g rg-azmon -n prometheus-metrics-workspace --resource-type Microsoft.Monitor/accounts
```




---


## Link a Grafana workspace
Connect an Azure Monitor workspace to an [Azure Managed Grafana](../../managed-grafana/overview.md) workspace to authorize Grafana to use the Azure Monitor workspace as a resource type in a Grafana dashboard. An Azure Monitor workspace can be connected to multiple Grafana workspaces, and a Grafana workspace can be connected to multiple Azure Monitor workspaces.

> [!NOTE]
> When you add the Azure Monitor workspace as a data source to Grafana, it will be listed in form `Managed_Prometheus_<azure-workspace-name>`.

### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspace** menu in the Azure portal.
2. Select your workspace.
3. Select **Linked Grafana workspaces**.
4. Select a Grafana workspace.

### [CLI](#tab/cli)
To be completed.

### [Resource Manager](#tab/resource-manager)
To be completed.

---


## Next steps

- Learn more about the [Azure Monitor data platform](../data-platform.md).
