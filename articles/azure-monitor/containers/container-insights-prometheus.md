---
title: Collect Prometheus metrics with Container insights
description: Describes different methods for configuring the Container insights agent to scrape Prometheus metrics from your Kubernetes cluster.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Collect Prometheus metrics with Container insights
[Prometheus](https://aka.ms/azureprometheus-promio) is a popular open-source metric monitoring solution and is the most common monitoring tool used to monitor Kubernetes clusters. Container insights uses its containerized agent to collect much of the same data that is typically collected from the cluster by Prometheus without requiring a Prometheus server. This data is presented in Container insights views and available to other Azure Monitor features such as [log queries](container-insights-log-query.md) and [log alerts](container-insights-log-alerts.md).

Container insights can also scrape Prometheus metrics from your cluster for the cases described below. This requires exposing the Prometheus metrics endpoint through your exporters or pods and then configuring one of the addons for the Azure Monitor agent used by Container insights as shown the following diagram.

## Collect additional data
You may want to collect additional data in addition to the predefined set of data collected by Container insights. This data isn't used by Container insights views but is available for log queries and alerts like the other data it collects. This requires configuring the *monitoring addon* for the Azure Monitor agent, which is the one currently used by Container insights to send data to a Log Analytics workspace. 

See [Collect Prometheus metrics Logs with Container insights (preview)](container-insights-prometheus-monitoring-addon.md) to configure your cluster to collect additional Prometheus metrics with the monitoring addon.

## Send data to Azure Monitor managed service for Prometheus
Container insights currently stores the data that it collects in Azure Monitor Logs. [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) is a fully managed Prometheus-compatible service that supports industry standard features such as PromQL, Grafana dashboards, and Prometheus alerts. This requires configuring the *metrics addon* for the Azure Monitor agent, which sends data to Prometheus. 

See [Collect Prometheus metrics from Kubernetes cluster with Container insights](container-insights-prometheus-metrics-addon.md) to configure your cluster to send metrics to Azure Monitor managed service for Prometheus.


:::image type="content" source="media/container-insights-prometheus/monitoring-kubernetes-architecture.png" lightbox="media/container-insights-prometheus/monitoring-kubernetes-architecture.png" alt-text="Diagram of container monitoring architecture sending Prometheus metrics to Azure Monitor Logs." border="false":::

## Next steps

- [Configure your cluster to send data to Azure Monitor managed service for Prometheus](container-insights-prometheus-metrics-addon.md).
- [Configure your cluster to send data to Azure Monitor Logs](container-insights-prometheus-metrics-addon.md).
