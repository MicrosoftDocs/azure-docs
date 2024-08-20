---
title: Azure Monitor and Kubernetes monitoring (preview)
description: Learn how to monitor your deployment using Azure Monitor and Kubernetes monitoring in Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 04/08/2024

---

# Azure Monitor and Kubernetes monitoring (preview)

This article describes how to monitor your deployment using Azure Monitor and Kubernetes monitoring.

## Azure Monitor

[Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) is a full-stack monitoring service that you can use to monitor Azure resources for their availability, performance, and operation.

## Azure Monitor metrics

[Azure Monitor metrics](/azure/azure-monitor/essentials/data-platform-metrics) is a feature of Azure Monitor that collects data from monitored resources into a time-series database.

These metrics can originate from a number of different sources, including native platform metrics, native custom metrics via [Azure Monitor agent Application Insights](/azure/azure-monitor/insights/insights-overview), and [Azure Managed Prometheus](/azure/azure-monitor/essentials/prometheus-metrics-overview).

Prometheus metrics can be stored in an [Azure Monitor workspace](/azure/azure-monitor/essentials/azure-monitor-workspace-overview) for subsequent visualization via [Azure Managed Grafana](/azure/managed-grafana/overview).

### Metrics configuration

To configure the scraping of Prometheus metrics data into Azure Monitor, see the [Azure Monitor managed service for Prometheus scrape configuration](/azure/azure-monitor/containers/prometheus-metrics-scrape-configuration#enable-pod-annotation-based-scraping) article, which builds upon [this configmap](https://aka.ms/azureprometheus-addon-settings-configmap). Edge Storage Accelerator specifies the `prometheus.io/scrape:true` and `prometheus.io/port` values, and relies on the default of `prometheus.io/path: '/metrics'`. You must specify the Edge Storage Accelerator installation namespace under `pod-annotation-based-scraping` to properly scope your metrics' ingestion.

Once the Prometheus configuration has been completed, follow the [Azure Managed Grafana instructions](/azure/managed-grafana/overview) to create an [Azure Managed Grafana instance](/azure/managed-grafana/quickstart-managed-grafana-portal).

## Azure Monitor logs

[Azure Monitor logs](/azure/azure-monitor/logs/data-platform-logs) is a feature of Azure Monitor that collects and organizes log and performance data from monitored resources, and can be used to [analyze this data in many ways](/azure/azure-monitor/logs/data-platform-logs#what-can-you-do-with-azure-monitor-logs).

### Logs configuration

If you want to access log data via Azure Monitor, you must enable [Azure Monitor Container Insights](/azure/azure-monitor/containers/container-insights-overview) on your Arc-enabled Kubernetes cluster, and then analyze the collected data with [a collection of views](/azure/azure-monitor/containers/container-insights-analyze) and [workbooks](/azure/azure-monitor/containers/container-insights-reports).

Additionally, you can use [Azure Monitor Log Analytics](/azure/azure-monitor/logs/log-analytics-tutorial) to query collected log data.

## Next steps

[Edge Storage Accelerator overview](overview.md)
