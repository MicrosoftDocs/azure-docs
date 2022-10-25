---
title: Send Prometheus metrics to Azure Monitor managed service for Prometheus with Container insights
description: Configure the Container insights agent to scrape Prometheus metrics from your Kubernetes cluster and send to Azure Monitor managed service for Prometheus.
ms.custom: references_regions, ignite-2022
ms.topic: conceptual
ms.date: 09/28/2022
ms.reviewer: aul
---

# Send metrics to Azure Monitor managed service for Prometheus with Container insights (preview)
This article describes how to configure Container insights to send Prometheus metrics from an Azure Kubernetes cluster to Azure Monitor managed service for Prometheus. This includes installing the metrics addon for Container insights.

## Prerequisites

- The cluster must be [onboarded to Container insights](container-insights-enable-aks.md).
- The cluster must use [managed identity authentication](container-insights-enable-aks.md#migrate-to-managed-identity-authentication).

## Enable Prometheus metric collection
Use the following methods to install the metrics addon on your cluster and send Prometheus metrics to an Azure Monitor workspace.

1. Open the **Kubernetes services** menu in the Azure portal and select your AKS cluster.
2. Click **Insights**.
3. Click **Monitor settings**.

    :::image type="content" source="media/container-insights-prometheus-metrics-addon/aks-cluster-monitor-settings.png" lightbox="media/container-insights-prometheus-metrics-addon/aks-cluster-monitor-settings.png" alt-text="Screenshot of button for monitor settings for an AKS cluster.":::

4. Click the checkbox for **Enable Prometheus metrics** and select your Azure Monitor workspace.
5. To send the collected metrics to Grafana, select a Grafana workspace. See [Create an Azure Managed Grafana instance](../../managed-grafana/quickstart-managed-grafana-portal.md) for details on creating a Grafana workspace.

    :::image type="content" source="media/container-insights-prometheus-metrics-addon/aks-cluster-monitor-settings-details.png" lightbox="media/container-insights-prometheus-metrics-addon/aks-cluster-monitor-settings-details.png" alt-text="Screenshot of monitor settings for an AKS cluster.":::

6. Click **Configure** to complete the configuration.



## Next steps

- [Verify Deployment](../essentials/prometheus-metrics-enable.md#verify-deployment).
- [Limitations](../essentials/prometheus-metrics-enable.md#limitations).
- [Region mappings](../essentials/prometheus-metrics-enable.md#region-mappings).
- [Customize Prometheus metric scraping for the cluster](../essentials/prometheus-metrics-scrape-configuration.md).
- [Create Prometheus alerts based on collected metrics](container-insights-metric-alerts.md)
- [Learn more about collecting Prometheus metrics](container-insights-prometheus.md).
