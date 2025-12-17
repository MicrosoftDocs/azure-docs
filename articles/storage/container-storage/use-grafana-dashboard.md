---
title: Use Grafana Dashboards with Azure Container Storage
description: Learn how to use the default dashboard for Azure Container Storage in Azure Managed Grafana for monitoring with Azure Monitor.
author: khdownie
ms.service: azure-container-storage
ms.date: 12/17/2025
ms.author: kendownie
ms.topic: how-to
# Customer intent: "As a Kubernetes administrator, I want to understand how to use the default dashboard for Azure Container Storage in Azure Managed Grafana for monitoring with Azure Monitor."
---

# Use Grafana dashboards with Azure Container Storage

[Azure Monitor dashboards with Grafana](/azure/azure-monitor/visualize/visualize-grafana-overview) allow you to view and create [Grafana](https://grafana.com/) dashboards directly in the Azure portal. This article describes how to use the default dashboard for Azure Container Storage for monitoring with Azure Monitor.

## Prerequisites

- The Azure Kubernetes Service (AKS) cluster on which you've installed Azure Container Storage must be enabled for Azure Monitor. See [Enable monitoring for AKS clusters](/azure/azure-monitor/containers/kubernetes-monitoring-enable).
- To open the dashboards, you must have read access to the logs and Azure Monitor workspace holding the log and metric data. You can query [analytics tier logs](/azure/azure-monitor/logs/data-platform-logs#table-plans) using the Kubernetes cluster as its [scope](/azure/azure-monitor/logs/scope), so direct access to the Log Analytics workspace isn't required. [Basic logs](/azure/azure-monitor/logs/data-platform-logs#table-plans) only support workspace scoped queries, so access to the Log Analytics workspace is required.

## Open Azure Container Storage dashboard

Azure Managed Grafana includes managed dashboards that are pre-provisioned and automatically updated to help you get started quickly with monitoring Azure Kubernetes Service and other Azure services. These dashboards are identified with an `Azure-managed` tag.

Follow these steps to use the default Azure Container Storage Grafana dashboard in the Azure portal.

1. Sign in to the Azure portal and navigate to your AKS Cluster.

1. Under **Monitoring**, select **Dashboards with Grafana**.

   :::image type="content" source="media/use-grafana-dashboard/open-dashboard.png" alt-text="Screenshot showing how to find the default Azure Container Storage Grafana dashboard in the Azure portal." lightbox="media/use-grafana-dashboard/open-dashboard.png":::

1. Browse the list of available dashboards and select **Azure Container Storage v2** under **Azure Managed Prometheus**.

1. After you select the **Azure Container Storage v2** dashboard, you should see the dashboard overview.

   :::image type="content" source="media/use-grafana-dashboard/dashboard-overview.png" alt-text="Screenshot showing the default Azure Container Storage Grafana dashboard overview page in the Azure portal." lightbox="media/use-grafana-dashboard/dashboard-overview.png":::

## Open Azure Container Storage dashboard using linked Grafana instances

Follow these steps to open the Azure Container Storage dashboard using a linked Grafana instance.

1. Sign in to the Azure portal and navigate to your AKS cluster.
1. Under **Monitoring**, select **Insights**.
1. Select **View Grafana**.
1. Select the linked Grafana instance.
1. Click on the endpoint URL in the next window to browse the dashboards.
1. From the **Azure Managed Grafana** window, select the **Azure Container Storage v2** dashboard.

   :::image type="content" source="media/use-grafana-dashboard/linked-dashboard.png" alt-text="Screenshot showing the Azure Container Storage dashboard using a linked Grafana instance." lightbox="media/use-grafana-dashboard/linked-dashboard.png":::

## See also

- [Install Azure Container Storage for use with AKS](install-container-storage-aks.md)
- [Azure Monitor Grafana overview](/azure/azure-monitor/visualize/visualize-grafana-overview)
- [Use Azure Managed Grafana](/azure/azure-monitor/visualize/visualize-use-managed-grafana-how-to)