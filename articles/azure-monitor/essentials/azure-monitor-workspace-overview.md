---
title: Azure Monitor workspace overview (preview)
description: Overview of Azure Monitor workspace, which is a unique environment for data collected by Azure Monitor.
author: bwren 
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 10/05/2022
---

# Azure Monitor workspace (preview)
An Azure Monitor workspace is a unique environment for data collected by Azure Monitor. Each workspace has its own data repository, configuration, and permissions.


## Contents of Azure Monitor workspace
Azure Monitor workspaces will eventually contain all metric data collected by Azure Monitor. Currently, the only data hosted by an Azure Monitor workspace is Prometheus metrics.

The following table lists the contents of Azure Monitor workspaces. This table will be updated as other types of data are stored in them.

| Current contents | Future contents |
|:---|:---|
| Prometheus metrics | Native platform metrics<br>Native custom metrics<br>Prometheus metrics |


## Workspace design
A single Azure Monitor workspace can collect data from multiple sources, but there may be circumstances where you require multiple workspaces to address your particular business requirements. Azure Monitor workspace design is similar to [Log Analytics workspace design](../logs/workspace-design.md). There are several reasons that you may consider creating additional workspaces including the following.

- Azure tenants. If you have multiple Azure tenants, you'll usually create a workspace in each because several data sources can only send monitoring data to a workspace in the same Azure tenant.
- Azure regions. Each workspace resides in a particular Azure region, and you may have regulatory or compliance requirements to store data in particular locations.
- Data ownership. You may choose to create separate workspaces to define data ownership, for example by subsidiaries or affiliated companies.
- Workspace limits. See [Azure Monitor service limits](../service-limits.md#prometheus-metrics) for current capacity limits related to Azure Monitor workspaces.
- Multiple environments. You may have Azure Monitor workspaces supporting different environments such as test, pre-production, and production.

> [!NOTE]
> You cannot currently query across multiple Azure Monitor workspaces.

## Workspace limits
These are currently only related to Prometheus metrics, since this is the only data currently stored in Azure Monitor workspaces. 

Many customers will choose an Azure Monitor workspace design to match their Log Analytics workspace design. Since Azure Monitor workspaces currently only contain Prometheus metrics, and metric data is typically not as sensitive as log data, you may choose to further consolidate your Azure Monitor workspaces for simplicity.



## Create an Azure Monitor workspace
In addition to the methods below, you may be given the option to create a new Azure Monitor workspace in the Azure portal as part of a configuration that requires one. For example, when you configure Azure Monitor managed service for Prometheus, you can select an existing Azure Monitor workspace or create a new one.

### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal.
2. Click **Create**.

    :::image type="content" source="media/azure-monitor-workspace-overview/view-azure-monitor-workspaces.png" lightbox="media/azure-monitor-workspace-overview/view-azure-monitor-workspaces.png" alt-text="Screenshot of Azure Monitor workspaces menu and page.":::

3. On the **Create an Azure Monitor Workspace** page, select a **Subscription** and **Resource group** where the workspace should be created.
4. Provide a **Name** and a **Region** for the workspace.
5. Click **Review + create** to create the workspace.

### [CLI](#tab/cli)
Use the following command to create an Azure Monitor workspace using Azure CLI.

```azurecli
az resource create --resource-group divyaj-test --namespace microsoft.monitor --resource-type accounts --name testmac0929 --location westus2 --properties {}
```

### [Resource Manager](#tab/resource-manager)
Use the following Resource Manager template with any of the [standard deployment options](../resource-manager-samples.md#deploy-the-sample-templates) to create an Azure Monitor workspace.

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


---


## Delete an Azure Monitor workspace
When you delete an Azure Monitor workspace, no soft-delete operation is performed like with a [Log Analytics workspace](../logs/delete-workspace.md). The data in the workspace is immediately deleted, and there is no recovery option.


### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal.
2. Select your workspace.
4. Click **Delete**.

    :::image type="content" source="media/azure-monitor-workspace-overview/delete-azure-monitor-workspace.png" lightbox="media/azure-monitor-workspace-overview/delete-azure-monitor-workspace.png" alt-text="Screenshot of Azure Monitor workspaces delete button.":::

### [CLI](#tab/cli)
To be completed.

### [Resource Manager](#tab/resource-manager)
To be completed.

---


## Link a Grafana workspace
Connect an Azure Monitor workspace to an [Azure Managed Grafana](../../managed-grafana/overview.md) workspace to authorize Grafana to use the Azure Monitor workspace as a resource type in a Grafana dashboard. An Azure Monitor workspace can be connected to multiple Grafana workspaces, and a Grafana workspace can be connected to multiple Azure Monitor workspaces.

> [!NOTE]
> When you add the Azure Monitor workspace as a data source to Grafana, it will be listed in form `Managed_Prometheus_<azure-workspace-name>`.

### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspace** menu in the Azure portal.
2. Select your workspace.
3. Click **Linked Grafana workspaces**.
4. Select a Grafana workspace.

### [CLI](#tab/cli)
To be completed.

### [Resource Manager](#tab/resource-manager)
To be completed.

---


## Next steps

- Learn more about the [Azure Monitor data platform](../data-platform.md).
