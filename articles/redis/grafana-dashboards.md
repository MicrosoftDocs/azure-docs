---
title: Dashboards with Grafana - Azure Managed Redis
description: Learn how to use the built-in Grafana experience in Azure Managed Redis to monitor cache performance, memory, operations, and connectivity with prebuilt dashboards and ad-hoc queries.
ms.topic: how-to
ms.date: 04/03/2026
---

# Dashboards with Grafana in Azure Managed Redis

**Dashboards with Grafana** in [Azure Managed Redis](overview.md) bring [Azure Monitor's](/azure/azure-monitor/fundamentals/overview) built-in Grafana experience directly into the Azure portal. You can create and customize Grafana dashboards by using your Azure Managed Redis metrics and logs without deploying a separate [Azure Managed Grafana](/azure/managed-grafana/overview) instance. Built-in Grafana controls support a wide range of visualization panels and client-side transformations.

> [!NOTE]
> This feature uses the Grafana experience built into Azure Monitor. It is separate from [Azure Managed Grafana](/azure/managed-grafana/overview), which is a standalone, fully managed Grafana service.

## Key capabilities

- **Start from prebuilt dashboards.** Use Azure-managed dashboards tailored for Azure Managed Redis monitoring scenarios including cache performance, memory, operations, and connectivity.
- **Create and edit dashboards.** Add panels, modify queries, and apply client-side transformations.
- **Save and share as Azure resources.** Store dashboards as standard Azure resources with [Azure role-based access control (RBAC)](/azure/role-based-access-control/overview) and automate with [Azure Resource Manager (ARM) templates](/azure/azure-resource-manager/templates/overview) or [Bicep](/azure/azure-resource-manager/bicep/overview).
- **Explore data ad-hoc.** Use Grafana **Explore** to run queries and add the results to new or existing dashboards.

## Prerequisites

- An [Azure Managed Redis resource](overview.md).
- Permissions to read Azure Managed Redis monitoring data and create resources in the target subscription and resource group.
- [Diagnostic settings configured](monitor-diagnostic-settings.md) on the Azure Managed Redis resource so that metrics flow to Azure Monitor.

## Open the Grafana experience in Azure Managed Redis

1. In the Azure portal, open your **Azure Managed Redis** resource.
1. In the left menu, under **Monitoring**, select **Dashboards with Grafana**.

The gallery lists **Azure-managed** dashboards and your **Saved dashboards** for the current Azure Managed Redis resource.

:::image type="content" source="media/grafana-dashboards/gallery.png" alt-text="Screenshot of the Dashboards with Grafana gallery in Azure Managed Redis, showing Featured dashboards including the Azure Managed Redis dashboard." lightbox="media/grafana-dashboards/gallery.png":::

## Start quickly with prebuilt dashboards

Azure provides a prebuilt **Azure Managed Redis** dashboard with four sections:

**Summary** — at-a-glance stat panels for CPU Usage, Memory Usage, Connected Clients, Total Operations, Cache Read, Cache Write

**Performance** — time-series charts for CPU and Memory, Read and Write

**Operations** — time-series charts for Operations (per second) and Hit and Miss ratio

**Connectivity** — time-series charts for Connected Clients and Geo Replication Healthy.

To open the dashboard, select **Azure Managed Redis** from the gallery. Use the time range picker and the **Redis** and **Namespace** filters at the top to scope data to your resource.

:::image type="content" source="media/grafana-dashboards/dashboard-panels.png" alt-text="Screenshot of the Azure Managed Redis Grafana dashboard showing summary with CPU Usage, Memory Usage, Connected Clients, Total Operations, Cache Read, and Cache Write panels, and Performance section with a CPU and Memory time-series chart." lightbox="media/grafana-dashboards/dashboard-panels.png":::

## Create, edit, and save dashboards

You can customize the prebuilt dashboard or start from scratch.

- **Edit the prebuilt dashboard.** Open the dashboard and select **Edit**. Modify panels, queries, and transformations.
- **Save a copy.** Select **Save As** to save your changes as a new dashboard. Choose a subscription, resource group, and name.
- **Start from scratch.** In the gallery, select **New** to create a blank dashboard and add panels.

Every saved dashboard is an **Azure resource**. You can manage it with Azure RBAC, export an ARM template, and include the dashboard in automation pipelines.

:::image type="content" source="media/grafana-dashboards/edit-save.png" alt-text="Screenshot of the Azure Managed Redis Grafana dashboard toolbar with the Edit and Save As buttons highlighted." lightbox="media/grafana-dashboards/edit-save.png":::

> [!NOTE]
> Dashboards saved from within an Azure Managed Redis resource are automatically associated with that resource and appear in the gallery under **Saved dashboards**.

## Ensure dashboards appear in Azure Managed Redis

Dashboards visible in **Dashboards with Grafana** inside an Azure Managed Redis resource use a specific resource tag:

| Name | Value |
|---|---|
| `GrafanaDashboardResourceType` | `microsoft.cache/redisenterprise` |

Dashboards you create *inside* an Azure Managed Redis resource receive this tag automatically. If you import or create a dashboard outside the resource and want it to appear in the gallery, add the tag manually:

1. Open the dashboard resource in the Azure portal.
1. Select **Tags**, and add the name and value shown in the preceding table.
1. Save the changes.

After adding the tag, refresh the gallery. The dashboard appears under **Saved dashboards**.

## Use Grafana Explore

Grafana **Explore** helps you run ad-hoc queries without starting inside a dashboard. You can add the results to a new or existing dashboard.

1. From the top menu of the Grafana experience, select **Explore**.
1. Choose a data source and build queries for the desired time range.
1. Select **Add to dashboard** to turn the visualization into a panel.

:::image type="content" source="media/grafana-dashboards/explore.png" alt-text="Screenshot of the Grafana Explore view with Azure Monitor selected as data source, a CPU metric query configured for an Azure Managed Redis resource, and a time-series graph showing results." lightbox="media/grafana-dashboards/explore.png":::

## Manage access and automate at scale

- **Control access with Azure RBAC.** Assign roles at the dashboard resource, resource group, or subscription scope to control who can view or edit dashboards.
- **Automate with ARM or Bicep.** Export an ARM template from a saved dashboard and deploy it consistently across environments.

## Costs

The Grafana experience within Azure Managed Redis has no extra cost beyond your [Azure Managed Redis](https://azure.microsoft.com/pricing/details/managed-redis/) resource charges. Standard Azure Monitor charges apply for any diagnostic data you configure to flow to Log Analytics workspaces, storage accounts, or event hubs.

## Limitations

- **Supports Azure data sources only.** These sources include Azure Monitor, Azure Monitor managed service for Prometheus, and Azure Data Explorer.
- **Saved dashboards are scoped per resource.** Dashboards saved from within an Azure Managed Redis resource appear only in that resource's gallery.

## Troubleshooting

**Q: Why doesn't a saved dashboard appear in the gallery?**

A: Verify the dashboard was saved from within the Azure Managed Redis resource's **Dashboards with Grafana** experience. If you saved it elsewhere, open the gallery and select **Refresh**.

**Q: Why can't I save a dashboard?**

A: Verify you have permissions to create resources in the target subscription and resource group.

**Q: Why doesn't data load?**

A: Check that the Azure Managed Redis resource has [diagnostic settings configured](monitor-diagnostic-settings.md) and that the selected time range contains data. Diagnostic settings can take up to 90 minutes to start flowing after they're first configured.

## Related content

- [Monitor Azure Managed Redis using diagnostic settings](monitor-diagnostic-settings.md)
- [Azure Monitor overview](/azure/azure-monitor/fundamentals/overview)
- [Azure Managed Grafana overview](/azure/managed-grafana/overview)
