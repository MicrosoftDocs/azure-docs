---
title: Dashboards with Grafana in Azure Managed Redis
description: Learn how to use the built-in Grafana experience in Azure Managed Redis to monitor cache performance, memory, operations, and connectivity with prebuilt dashboards and ad-hoc queries.
ms.topic: how-to
ms.date: 04/03/2026
---

# Dashboards with Grafana in Azure Managed Redis

**Dashboards with Grafana** in [Azure Managed Redis](overview.md) brings [Azure Monitor's](../azure-monitor/fundamentals/overview.md) built-in Grafana experience directly into the Azure portal. You can create and customize Grafana dashboards using your Azure Managed Redis metrics and logs without deploying a separate [Azure Managed Grafana](../managed-grafana/overview.md) instance. Built-in Grafana controls support a wide range of visualization panels and client-side transformations.

> [!NOTE]
> This feature uses the Grafana experience built into Azure Monitor. It is separate from [Azure Managed Grafana](../managed-grafana/overview.md), which is a standalone fully managed Grafana service.

## Key capabilities

- **Start from prebuilt dashboards.** Use Azure-managed dashboards tailored for Azure Managed Redis monitoring scenarios including cache performance, memory, operations, and connectivity.
- **Create and edit dashboards.** Add panels, modify queries, and apply client-side transformations.
- **Save and share as Azure resources.** Store dashboards as standard Azure resources with [Azure role-based access control (RBAC)](../role-based-access-control/overview.md) and automate with [Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/overview.md) or [Bicep](../azure-resource-manager/bicep/overview.md).
- **Explore data ad-hoc.** Use Grafana **Explore** to run queries and add the results to new or existing dashboards.

## Prerequisites

- An [Azure Managed Redis resource](overview.md).
- Permissions to read Azure Managed Redis monitoring data and create resources in the target subscription and resource group.
- [Diagnostic settings configured](monitor-diagnostic-settings.md) on the Azure Managed Redis resource so that metrics flow to Azure Monitor.

## Open the Grafana experience in Azure Managed Redis

1. In the Azure portal, open your **Azure Managed Redis** resource.
2. In the left menu, under **Monitoring**, select **Dashboards with Grafana**.

The gallery lists **Azure-managed** dashboards and your **Saved dashboards** for the current Azure Managed Redis resource.

:::image type="content" source="media/grafana-dashboards/gallery.png" alt-text="Screenshot of the Dashboards with Grafana gallery in Azure Managed Redis, showing Featured dashboards including the Azure Managed Redis dashboard.":::

## Start quickly with prebuilt dashboards

Azure provides a prebuilt **Azure Managed Redis** dashboard with four sections:

**Summary** — at-a-glance stat panels:
- CPU Usage, Memory Usage, Connected Clients, Total Operations, Cache Read, Cache Write

**Performance** — time-series charts:
- CPU & Memory, Read & Write

**Operations** — time-series charts:
- Operations (per second), Hit & Miss ratio

**Connectivity** — time-series charts:
- Connected Clients, Geo Replication Healthy

To open the dashboard, select **Azure Managed Redis** from the gallery. Use the time range picker and the **Redis** and **Namespace** filters at the top to scope data to your resource.

:::image type="content" source="media/grafana-dashboards/dashboard-panels.png" alt-text="Screenshot of the Azure Managed Redis Grafana dashboard showing the Summary row with CPU Usage, Memory Usage, Connected Clients, Total Operations, Cache Read, and Cache Write panels, and the Performance section with a CPU and Memory time-series chart.":::

## Create, edit, and save dashboards

You can customize the prebuilt dashboard or start from scratch.

- **Edit the prebuilt dashboard.** Open the dashboard and select **Edit**. Modify panels, queries, and transformations.
- **Save a copy.** Select **Save As** to save your changes as a new dashboard. Choose a subscription, resource group, and name.
- **Start from scratch.** In the gallery, select **New** to create a blank dashboard and add panels.

Every saved dashboard is an **Azure resource**. You can manage it with Azure RBAC, export an ARM template, and include the dashboard in automation pipelines.

:::image type="content" source="media/grafana-dashboards/edit-save.png" alt-text="Screenshot of the Azure Managed Redis Grafana dashboard toolbar with the Edit and Save As buttons highlighted.":::

> [!NOTE]
> Dashboards saved from within an Azure Managed Redis resource are automatically associated with that resource and appear in the gallery under **Saved dashboards**.

## Use Grafana Explore

Grafana **Explore** helps you run ad-hoc queries without starting inside a dashboard. You can add the results to a new or existing dashboard.

1. From the top menu of the Grafana experience, select **Explore**.
2. Choose a data source and build queries for the desired time range.
3. Select **Add to dashboard** to turn the visualization into a panel.

:::image type="content" source="media/grafana-dashboards/explore.png" alt-text="Screenshot of the Grafana Explore view with Azure Monitor selected as the data source, a CPU metric query configured for an Azure Managed Redis resource, and a time-series graph showing results.":::

## Manage access and automate at scale

- **Control access with Azure RBAC.** Assign roles at the dashboard resource, resource group, or subscription scope to control who can view or edit dashboards.
- **Automate with ARM or Bicep.** Export an ARM template from a saved dashboard and deploy it consistently across environments.

## Costs

The Grafana experience within Azure Managed Redis has no additional cost beyond your [Azure Managed Redis](https://azure.microsoft.com/pricing/details/managed-redis/) resource charges. Standard Azure Monitor charges apply for any diagnostic data you configure to flow to Log Analytics workspaces, storage accounts, or event hubs.

## Limitations

- **Supports Azure data sources only.** Azure Monitor, Azure Monitor managed service for Prometheus, and Azure Data Explorer.
- **Saved dashboards are scoped per resource.** Dashboards saved from within an Azure Managed Redis resource appear only in that resource's gallery.

## Troubleshooting

**A saved dashboard doesn't appear in the gallery.**

Verify the dashboard was saved from within the Azure Managed Redis resource's **Dashboards with Grafana** experience. If you saved it elsewhere, open the gallery and select **Refresh**.

**You can't save a dashboard.**

Verify you have permissions to create resources in the target subscription and resource group.

**Data doesn't load.**

Check that the Azure Managed Redis resource has [diagnostic settings configured](monitor-diagnostic-settings.md) and that the selected time range contains data. Diagnostic settings can take up to 90 minutes to start flowing after they are first configured.

## Related content

- [Monitor Azure Managed Redis using diagnostic settings](monitor-diagnostic-settings.md)
- [Azure Monitor overview](../azure-monitor/fundamentals/overview.md)
- [Azure Managed Grafana overview](../managed-grafana/overview.md)
