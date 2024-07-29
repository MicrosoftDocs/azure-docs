---
title: Configure observability manually
description: How to configure observability features manually in Azure IoT Operations so that you can monitor your solution.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 02/27/2024

# CustomerIntent: As an IT admin or operator, I want to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Configure observability manually

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article shows how to install and configure Azure IoT Operations observability components manually. This approach provides more options and control over your environment. For a simplified setup process that installs all the components you need to get started, see [Get started: configure observability](howto-configure-observability.md).

## Configure your subscription

Run the following code to register providers with the subscription where your cluster is located:

```azurecli
az account set -s <subscription-id>
az provider register -n "Microsoft.Insights"
az provider register -n "Microsoft.AlertsManagement"
```

## Install Azure Monitor managed service for Prometheus
Azure Monitor managed service for Prometheus is a component of Azure Monitor Metrics. This managed service provides flexibility in the types of metric data that you can collect and analyze with Azure Monitor. Prometheus metrics share some features with platform and custom metrics. Prometheus metrics also use some different features to better support open-source tools such as PromQL and Grafana.

Azure Monitor managed service for Prometheus allows you to collect and analyze metrics at scale using a Prometheus-compatible monitoring solution. This fully managed service is based on the Prometheus project from the Cloud Native Computing Foundation (CNCF). The service allows you to use the Prometheus query language (PromQL) to analyze and alert on the performance of monitored infrastructure and workloads, without having to operate the underlying infrastructure.

To set up Prometheus metrics collection for the new Arc-enabled cluster, follow the steps in [Configure Prometheus metrics collection](howto-configure-observability.md#configure-prometheus-metrics-collection).

## Install Container Insights
Container Insights monitors the performance of container workloads deployed to the cloud. It gives you performance visibility by collecting memory and processor metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. After you enable monitoring from Kubernetes clusters, metrics and container logs are automatically collected through a containerized version of the Log Analytics agent for Linux. Metrics are sent to the metrics database in Azure Monitor. Log data is sent to your Log Analytics workspace.

To monitor container workload performance, complete the steps to [enable container insights](../../azure-monitor/containers/container-insights-onboard.md).

## Install Grafana
Azure Managed Grafana is a data visualization platform built on top of the Grafana software by Grafana Labs. Azure Managed Grafana is a fully managed Azure service operated and supported by Microsoft. Grafana helps you bring together metrics, logs and traces into a single user interface. With its extensive support for data sources and graphing capabilities, you can view and analyze your application and infrastructure telemetry data in real-time.

Azure IoT Operations provides a collection of dashboards designed to give you many of the visualizations you need to understand the health and performance of your Azure IoT Operations deployment.

To install Azure Managed Grafana, complete the following steps:

1. Use the Azure portal to [create an Azure Managed Grafana instance](../../managed-grafana/quickstart-managed-grafana-portal.md).

1. Configure an [Azure Monitor managed service for Prometheus as a data source for Azure Managed Grafana](../../azure-monitor/essentials/prometheus-grafana.md).

1. Configure the dashboards by following the steps in [Deploy dashboards to Grafana](howto-configure-observability.md#deploy-dashboards-to-grafana).

## Related content

- [Get started: configure observability](howto-configure-observability.md)
