---
title: Add an Azure Monitor workspace to Azure Managed Grafana
description: Learn how to add an Azure Monitor workspace to Azure Managed Grafana to collect Prometheus data.
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 11/10/2023
--- 

# Add an Azure Monitor workspace to Azure Managed Grafana to collect Prometheus data

In this guide, learn how to connect an Azure Monitor workspace to Grafana directly from an Azure Managed Grafana workspace. This feature is designed to provide a quick way to collect Prometheus metrics stored in an Azure Monitor workspace and enables you to monitor your Azure Kubernetes Service (AKS) clusters in Grafana.

> [!IMPORTANT]
> The integration of Azure Monitor workspaces within Azure Managed Grafana workspaces is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance in the Standard tier. [Create a new instance](quickstart-managed-grafana-portal.md) if you don't have one.
- An [Azure Monitor workspace with Prometheus data](../azure-monitor/containers/prometheus-metrics-enable.md).

## Add a new role assignment

In the Azure Monitor workspace, assign the *Monitoring Data Reader* role to the Azure Managed Grafana resource's managed identity, so that Grafana can collect data from the Azure Monitor workspace.

> [!NOTE]
> A system-assigned managed identity must be enabled in your Azure Managed Grafana resource. If needed, enable it by going to **Identity** and select **Status**: **On**.

To assign the Monitoring Data Reader role:

1. Open the Azure Monitor workspace that holds Prometheus data.
1. Go to **Access control (IAM)** > **Add** > **Add role assignment**.
1. Select the **Monitoring Data Reader** role, then **Next**.
1. For **Assign access to**, select **Managed identity**
1. Open **Select members** and select your Azure Managed Grafana resource.
1. Select **Review + assign** to initiate the role assignment

## Add an Azure Monitor workspace

1. Open your Azure Managed Grafana workspace.
1. In the left menu, select **Integrations** > **Azure Monitor workspaces (Preview**).

    :::image type="content" source="media\monitor-integration\add-azure-monitor.png" alt-text="Screenshot of the Grafana roles in the Azure platform.":::

1. Select **Add**.
1. In the pane that opens, select an Azure Monitor workspace from the list and confirm with **Add**.
1. Once the operation is complete, Azure displays all the Azure Monitor workspaces added to the Azure Managed Grafana workspace. You can add more Azure Monitor workspaces by selecting **Add** again.

## Display Prometheus data in Grafana

When you added the Azure Monitor workspace to Azure Managed Grafana in the previous step, Azure added a new Prometheus data source to Grafana.

To get a dashboard with Prometheus metrics, either use one of the prebuilt dashboards or build a brand new one.

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

The following screenshot shows some of the panels from the "Kubernetes / Compute Resources / Cluster" dashboard.

:::image type="content" source="media\monitor-integration\prometheus-prebuilt-dashboard.png" alt-text="Screenshot of prebuilt dashboard showing Prometheus metrics.":::

Edit the dashboard as desired. For more information about editing a dashboard, read [Edit a dashboard panel](./how-to-create-dashboard.md#edit-a-dashboard-panel).

### Create a new dashboard

To build a brand new dashboard with Prometheus metrics:

1. Open Grafana and select **Connections** > **Your connections** from the left menu.
1. Find the new Prometheus data source.

    :::image type="content" source="media\monitor-integration\prometheus-data-source.png" alt-text="Screenshot of a new Prometheus data source displayed in the Grafana user interface.":::

1. Select **Build a dashboard** to start creating a new dashboard with Prometheus metrics.
1. Select **Add visualization** to start creating a new panel.
1. Under **metrics**, select a metric and then **Run queries** to check that your dashboard can collect and display your Prometheus data.

    :::image type="content" source="media\monitor-integration\new-dashboard.png" alt-text="Screenshot the Grafana UI, showing a new dashboard displaying Prometheus data.":::

    For more information about editing a dashboard, read [Edit a dashboard panel](./how-to-create-dashboard.md#edit-a-dashboard-panel).

> [!TIP]
> If you're unable to get Prometheus data in your dashboard, check if your Azure Monitor workspace is collecting Prometheus data. Go to [Troubleshoot collection of Prometheus metrics in Azure Monitor](../azure-monitor/containers/prometheus-metrics-troubleshoot.md) for more information.

## Remove an Azure Monitor workspace

If you no longer need it, you can remove an Azure Monitor workspace from your Azure Managed Grafana workspace:

1. In your Azure Managed Grafana workspace, select **Integrations** > **Azure Monitor workspaces (Preview**) from the left menu.
1. Select the row  with the resource to delete and select **Delete** > **Yes**.

Optionally also remove the role assignment that was previously added in the Azure Monitor workspace:

1. In the Azure Monitor workspace resource, select **Access control (IAM)** > **Role assignments**.
1. Under **Monitoring Data Reader**, select the row with the name of your Azure Managed Grafana resource and select **Remove** > **OK**.

To learn more about Azure Monitor managed service for Prometheus, read the [Azure Monitor managed service for Prometheus guide](../azure-monitor/essentials/prometheus-metrics-overview.md).

## Next steps

In this how-to guide, you learned how to connect an Azure Monitor workspace to Grafana. To learn how to create and configure Grafana dashboards, go to [Create dashboards](how-to-create-dashboard.md).
