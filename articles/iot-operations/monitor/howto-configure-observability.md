---
title: Configure observability
# titleSuffix: Azure IoT Operations
description: Configure observability features in Azure IoT Operations to monitor the health of your solution.
author: timlt
ms.author: timlt
ms.topic: how-to
ms.date: 11/2/2023

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data 
# on the health of my industrial assets and edge environment. 
---

# Configure observability

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Observability provides visibility into every layer of your Azure IoT Operations Preview configuration. It gives you insight into the actual behavior of issues, which increases the effectiveness of site reliability engineering. Azure IoT Operations offers observability through custom curated Grafana dashboards that are hosted in Azure. These dashboards are powered by Azure Monitor managed service for Prometheus and by Container Insights. This article shows you how to configure the services you need for observability of your solution. 

## Prerequisites

- Azure IoT Operations Preview installed. For more information, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).

## Install Azure Monitor managed service for Prometheus
Azure Monitor managed service for Prometheus is a component of Azure Monitor Metrics. This managed service provides flexibility in the types of metric data that you can collect and analyze with Azure Monitor. Prometheus metrics share some features with platform and custom metrics.  Prometheus metrics also use some different features to better support open source tools such as PromQL and Grafana.

Azure Monitor managed service for Prometheus allows you to collect and analyze metrics at scale using a Prometheus-compatible monitoring solution.  This fully managed service is based on the Prometheus project from the Cloud Native Computing Foundation (CNCF). The service allows you to use the Prometheus query language (PromQL) to analyze and alert on the performance of monitored infrastructure and workloads, without having to operate the underlying infrastructure.

1. Follow the steps to [enable Prometheus metrics collection from your Arc-enabled Kubernetes cluster](../../azure-monitor/containers/prometheus-metrics-from-arc-enabled-cluster.md).

1. To create a `configmap` to configure metrics scraping from your cluster, run the following command from within your cluster: 

   ```bash
   kubectl create configmap ama-metrics-prometheus-config --from-literal=prometheus-config='{"scrape_configs": [{ "job_name": "akri", "scrape_interval": "1m", "static_configs": [{ "targets": [ "akri-agent-metrics-service.alice-springs.svc.cluster.local:8080" ]}]},{ "job_name": "e4k", "scrape_interval": "1m", "static_configs": [{ "targets": [ "azedge-diagnostics-service.alice-springs.svc.cluster.local:9600" ]}]},{ "job_name": "nats", "scrape_interval": "1m", "static_configs": [{ "targets": [ "bluefin-nats-0.bluefin-nats-headless.alice-springs.svc.cluster.local:7777" ]}]},{ "job_name": "otel", "scrape_interval": "1m", "static_configs": [{ "targets": [ "otel-collector.alice-springs.svc.cluster.local:8889" ] }]}]}' -n kube-system
   ```
1. If you're using an AKS Edge Essentials cluster, run the following extra command to have node level metrics monitored by the Managed Prometheus agent:

   ```bash
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -command "sudo sed -i '/-A OUTPUT -j ACCEPT/i-A INPUT -p tcp -m tcp --dport 9110 -j ACCEPT' /etc/systemd/scripts/ip4save"
   ```


## Install Container Insights
Container Insights monitors the performance of container workloads deployed to the cloud. It gives you performance visibility by collecting memory and processor metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. After you enable monitoring from Kubernetes clusters, metrics and container logs are automatically collected through a containerized version of the Log Analytics agent for Linux. Metrics are sent to the metrics database in Azure Monitor. Log data is sent to your Log Analytics workspace.

Complete the steps to [enable container insights](../../azure-monitor/containers/container-insights-onboard.md).

## Deploy dashboards to Grafana
Azure Managed Grafana is a data visualization platform built on top of the Grafana software by Grafana Labs. Azure Managed Grafana is a fully managed Azure service operated and supported by Microsoft. Grafana helps you bring together metrics, logs and traces into a single user interface. With its extensive support for data sources and graphing capabilities, you can view and analyze your application and infrastructure telemetry data in real-time.

Azure IoT Operations provides a collection of dashboards designed to give you many of the visualizations you need to understand the health and performance of your Alice Springs deployment.

To deploy a custom curated dashboard to Azure Managed Grafana, complete the following steps:

1. Use the Azure portal to [create an Azure Managed Grafana instance](../../managed-grafana/quickstart-managed-grafana-portal.md).

1. Configure an [Azure Monitor managed service for Prometheus as a data source for Azure Managed Grafana](../../azure-monitor/essentials/prometheus-grafana.md).

Complete the following steps to install the Azure IoT Operations curated Grafana dashboards. 

1. Clone the Azure IoT Operations repo by using the following command:

    ```console
    git clone https://github.com/Azure/azure-iot-operations.git
    ```

1. In the upper right area of the Grafana application, select the **+** icon. 

1. Select **Import dashboard**, then follow the prompts to browse to the *samples\grafana-dashboards* path in your cloned copy of the repo, and select a JSON dashboard file.

1. When the application prompts, select your managed Prometheus data source.

1. Select **Import**. 


## Related content

- [Azure Monitor overview](../../azure-monitor/overview.md)
