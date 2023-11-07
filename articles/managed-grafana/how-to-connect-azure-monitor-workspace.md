---
title: Connect an Azure Monitor workspace to Azure Managed Grafana
description: Learn how to connect an Azure Monitor workspace to Azure Managed Grafana to collect Prometheus data.
service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 11/07/2023
--- 

# Connect an Azure Monitor workspace to Azure Managed Grafana to collect Prometheus data

In this guide, learn how to link your Azure monitor workspace to Grafana directly from your Azure Managed Grafana workspace. This feature is designed to provide a quick way to collect Azure Monitor data to visualize Prometheus metrics stored in an Azure Kubernetes Service (AKS) cluster.

> [!IMPORTANT]
> The integration of Azure Monitor workspaces within Azure Managed Grafana workspaces is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance in the Standard tier. [Create a new instance](quickstart-managed-grafana-portal.md) if you don't have one.
- An [Azure Monitor workspace with Prometheus data](../azure-monitor/containers/prometheus-metrics-enable.md).

## Connect Azure Monitor to an Azure Managed Grafana workspace

1. Open you Azure Managed Grafana workspace.
1. In the left menu, select **Integrations** > **Azure Monitor workspaces (Preview**)
    :::image type="content" source="media\monitor-integration\add-azure-monitor.png" alt-text="Screenshot of the Grafana roles in the Azure platform.":::

1. Select **Add**.
1. In the pane that opens, select an Azure Monitor workspace from the list and confirm with **Add**.

   > [!TIP]
   > If you get the message "Role assignment not found in selected Azure Monitor workspace", ensure that the managed identity has the Monitoring Data Reader role assigned to the Managed Grafana instance. To do so, in the Azure Managed Grafana workspace, go to **Identity** and **Azure role assignments**.

1. Once the operation is complete, Azure displays all the Azure Monitor workspaces that have been added to the Azure Grafana workspace.

## Get Prometheus data in Grafana

When you added the Azure Monitor workspace to Azure Managed Grafana in the previous step, Azure added a new Prometheus data source to Grafana.

To create a dashboard with AKS metrics, either use one of the prebuilt dashboards or build a brand new dashboard.

### Use a prebuilt dashboard

In Grafana, go to **Dashboards** from the left menu and expand the **Managed Prometheus** data source. Review the list of prebuilt dashboards and open one that seems interesting to you.

The following automatically generated dashboards are available, as of November 7, 2023:

- Kubernetes / Compute Resources / Cluster
- Kubernetes / Compute Resources / Cluster (Windows)
- Kubernetes / Compute Resources / Namespace (Pods)
- Kubernetes / Compute Resources / Namespace (Windows)
- Kubernetes / Compute Resources / Namespace (Workloads)
- Kubernetes / Compute Resources / Node (Pods)
- Kubernetes / Compute Resources / Pod
- Kubernetes / Compute Resources / Pod (Windows)
- Kubernetes / Compute Resources / Workload
- Kubernetes / Kubelet
- Kubernetes / Networking
- Kubernetes / USE Method / Cluster (Windows)
- Kubernetes / USE Method / Node (Windows)
- Node Exporter / Nodes
- Node Exporter / USE Method / Node
- Overview

:::image type="content" source="media\monitor-integration\prometheus-prebuilt-dashboard.png" alt-text="Screenshot of a new Prometheus data source displayed in the Grafana user interface.":::

Edit the dashboard as desired. For more information about editing a dashboard, go to [Edit a panel](./how-to-create-dashboard.md#edit-a-dashboard-panel).

### Create a new dashboard

To build a brand new dashboard from Prometheus data:

1. Open the Grafana UI and select **Connections** > **Your connections** from the left menu.
1. Find the new Prometheus data source.

    :::image type="content" source="media\monitor-integration\prometheus-data-source.png" alt-text="Screenshot of a new Prometheus data source displayed in the Grafana user interface.":::

1. Select **Build a dashboard** to start creating a new dashboard with Prometheus metrics. Alternatively, review the connection settings by selecting **Explore.**
1. Select **Add visalization** to start creating a new panel.
1. Under **metrics**, select a metric and then **Run queries** to check that your dashboard can collect and display your Prometheus data.

    :::image type="content" source="media\monitor-integration\new-dashboard.png" alt-text="Screenshot the Grafana UI, showing a new dashboard displaying Prometheus data.":::

   > [!TIP]
   > If you're unable to get Prometheus data in your dashboard, check if your Azure Monitor workspace is collecting Prometheus data. Go to [Troubleshoot collection of Prometheus metrics in Azure Monitor](../azure-monitor/containers/prometheus-metrics-troubleshoot) for more information.

For more information about editing a dashboard, go to [Edit a panel](./how-to-create-dashboard.md#edit-a-dashboard-panel).

To learn more about Azure Monitor managed service for Prometheus, read the [Azure Monitor managed service for Prometheus guide](https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/prometheus-metrics-overview).

## Next steps

In this how-to guide, you learned how to connect an Azure Monitor workspace to Grafana. To learn how to create and configure Grafana dashboards, go to [Create dashboards](how-to-create-dashboard.md).
