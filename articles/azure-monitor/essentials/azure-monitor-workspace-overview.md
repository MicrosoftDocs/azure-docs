---
title: Azure Monitor workspace overview (preview)
description: Overview of Azure Monitor workspace, which is a unique environment for data collected by Azure Monitor.
author: edbaynash 
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


## Azure Monitor workspace architecture 

While a single Azure Monitor workspace may be sufficient for many use cases using Azure Monitor, many organizations will create multiple workspaces to better meet their needs Presented here are a set of criteria for determining whether to use a single Azure Monitor workspace, or multiple Azure Monitor workspaces, and the configuration and placement of those accounts to meet your requirements. 

### Design criteria 

As you identify the right criteria to create additional Azure Monitor workspaces, your design should use the fewest number that will match your requirements while optimizing for minimal administrative management overhead. 

The following table briefly presents the criteria that you should consider in designing your Azure Monitor workspace architecture.  

|Criteria|Description|
|---|---|
|Segregate by logical boundaries |Create separate Azure Monitor workspaces for operational data based on logical boundaries, for example, a role, application type, type of metric etc.|
|Azure tenants | For multiple Azure tenants, create an Azure Monitor workspace in each tenant. Data sources can only send monitoring data to an Azure Monitor workspace in the same Azure tenant. |
|Azure regions |Each Azure Monitor workspace resides in a particular Azure region. Regulatory or compliance requirements may dictate the storage of data in particular locations. |
|Data ownership |Create separate Azure Monitor workspaces to define data ownership, for example by subsidiaries or affiliated companies.| 

### Growing account capacity  

Upon creating a new Azure Monitor workspace, it is assigned a default quota/limit for metrics. As your product grows and you need more metrics, you can ask for this limit to be increased to an upper threshold of 50 million events or active time series. If your capacity needs grow exceptionally large, and your data ingestion needs can no longer be met by a single Azure Monitor workspace, you may need to consider creating multiple Azure Monitor workspaces. 

### Multiple Azure Monitor workspaces  

When an Azure Monitor workspace reaches 80% of its max capacity, and/or depending on your current and forecasted metric volume, it is recommended to split the Azure Monitor workspace into multiple workspaces. Based on logical separation, determine which logical grouping makes more sense for your business. For example, a company using Azure cloud service can logically separate its metrics in Azure Monitor workspaces by grouping them by application. By doing this, all the telemetric data can be managed and queried in an efficient way. 

In special scenarios, splitting Azure Monitor workspace into multiple workspaces can be necessary because of one or more reasons listed below: 
1. Monitoring data in sovereign clouds – Create Azure Monitor workspace(s) in each corresponding sovereign cloud.  

1. Compliance/Regulatory requirements that mandate storage of data in specific regions – Create an Azure Monitor workspace per region as per requirements. Need for managing the scale of metrics for large services or financial institutions with regional accounts. 
1. Separating metric data in test, pre-production, and production environments 

>[!Note] 
> When splitting Azure Monitor workspaces, keep in mind that creating a single query across multiple Azure Monitor workspaces is not supported. Setting up Grafana with each workspace as a dedicated data source which will allow for querying both workspaces in a single Grafana panel. 

## Limitations
See [Azure Monitor service limits](../service-limits.md#prometheus-metrics) for performance related service limits for Azure Monitor managed service for Prometheus.
- Private Links aren't supported for Prometheus metrics collection into Azure monitor workspace.
- Azure monitor workspaces are currently only supported in public clouds.
- Azure monitor workspaces do not currently support being moved into a different subscription or resource group once created.


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
