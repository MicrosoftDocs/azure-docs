---
title: Azure Monitor workspace overview
description: Overview of Azure Monitor workspace which is a unique environment for data collected by Azure Monitor.
author: bwren 
ms.topic: conceptual
ms.date: 05/09/2022
---

# Azure Monitor workspace (preview)
An Azure Monitor workspace is a unique environment for data collected by Azure Monitor. Each workspace has its own data repository, configuration, and permissions.


## Contents of Azure Monitor workspace
Azure Monitor workspaces will eventually contain all data collected by Azure Monitor, including Log Analytics workspaces and native metrics. Currently, the only data hosted by an Azure Monitor workspace is Prometheus metrics.

The following table lists the contents of Azure Monitor workspaces. This table will be updated as other types of data are stored in them.

| Current contents | Future contents |
|:---|:---|
| Prometheus metrics | Log Analytics workspace<br>Native platform metrics<br>Native custom metrics<br>Prometheus metrics |


## Workspace design
A single Azure Monitor workspace can collect data from multiple sources, but there may be circumstances where you require multiple workspaces to address your particular business requirements. Azure Monitor workspace design is similar to [Log Analytics workspace design](../logs/workspace-design.md). There are several reasons that you may consider creating additional workspaces including the following.

- If you have multiple Azure tenants, you'll usually create a workspace in each because several data sources can only send monitoring data to a workspace in the same Azure tenant.
- Each workspace resides in a particular Azure region, and you may have regulatory or compliance requirements to store data in particular locations.
- You may choose to create separate workspaces to define data ownership, for example by subsidiaries or affiliated companies.

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

### [Resource Manager](#tab/resource-manager)
To be completed.

---


## Delete an Azure Monitor workspace
When you delete an Azure Monitor workspace, no soft-delete operation is performed like with a [Log Analytics workspace](../logs/delete-workspace.md). The data in the workspace is immediately deleted, and there is no recovery option.


### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal.
2. Select your workspace.
4. Click **Delete**.

    :::image type="content" source="media/azure-monitor-workspace-overview/delete-azure-monitor-workspace.png" lightbox="media/azure-monitor-workspace-overview/delete-azure-monitor-workspace.png" alt-text="Screenshot of Azure Monitor workspaces delete button.":::

### [Resource Manager](#tab/resource-manager)
To be completed.

---


## Link a Grafana workspace
Connect an Azure Monitor workspace to an [Azure Managed Grafana](../../managed-grafana/overview.md) workspace to authorize Grafana to use the Azure Monitor workspace as a resource type in a Grafana dashboard. An Azure Monitor workspace can be connected to multiple Grafana workspaces, and a Grafana workspace can be connected to multiple Azure Monitor workspaces.



### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspace** menu in the Azure portal.
2. Select your workspace.
3. Click **Linked Grafana workspaces**.
4. Select a Grafana workspace.

### [Resource Manager](#tab/resource-manager)
To be completed.

---


## Next steps

- Learn more about the [Azure Monitor data platform](../data-platform.md).
- Learn about [log data in Azure Monitor](../logs/data-platform-logs.md).
- Learn about the [monitoring data available](../data-sources.md) for various resources in Azure.

