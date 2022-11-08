---
title: Overview of Azure Monitor Managed Service for Prometheus (preview)
description: Overview of Azure Monitor managed service for Prometheus, which provides a Prometheus-compatible interface for storing and retrieving metric data.
author: bwren 
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
---

# Azure Monitor managed service for Prometheus (preview)
Azure Monitor managed service for Prometheus allows you to collect and analyze metrics at scale using a Prometheus-compatible monitoring solution, based on the [Prometheus](https://aka.ms/azureprometheus-promio) project from the Cloud Native Compute Foundation. This fully managed service allows you to use the [Prometheus query language (PromQL)](https://aka.ms/azureprometheus-promio-promql) to analyze and alert on the performance of monitored infrastructure and workloads without having to operate the underlying infrastructure.

Azure Monitor managed service for Prometheus is a component of [Azure Monitor Metrics](data-platform-metrics.md), providing additional flexibility in the types of metric data that you can collect and analyze with Azure Monitor. Prometheus metrics share some features with platform and custom metrics, but use some different features to better support open source tools such as [PromQL](https://aka.ms/azureprometheus-promio-promql) and [Grafana](../../managed-grafana/overview.md).

> [!IMPORTANT] 
> Azure Monitor managed service for Prometheus is intended for storing information about service health of customer machines and applications. It is not intended for storing any data classified as Personal Identifiable Information (PII) or End User Identifiable Information (EUII). We strongly recommend that you do not send any sensitive information (usernames, credit card numbers etc.) into Azure Monitor managed service for Prometheus fields like metric names, label names, or label values.

## Data sources
Azure Monitor managed service for Prometheus can currently collect data from any of the following data sources.

- Azure Kubernetes service (AKS)
- Any Kubernetes cluster running self-managed Prometheus using [remote-write](https://aka.ms/azureprometheus-promio-prw).

## Enable
The only requirement to enable Azure Monitor managed service for Prometheus is to create an [Azure Monitor workspace](azure-monitor-workspace-overview.md), which is where Prometheus metrics are stored. Once this workspace is created, you can onboard services that collect Prometheus metrics.

- To collect Prometheus metrics from your AKS cluster without using Container insights, see [Collect Prometheus metrics from AKS cluster (preview)](prometheus-metrics-enable.md).
- To add collection of Prometheus metrics to your cluster using Container insights, see [Collect Prometheus metrics with Container insights](../containers/container-insights-prometheus.md#send-data-to-azure-monitor-managed-service-for-prometheus).
- To configure remote-write to collect data from your self-managed Prometheus server, see [Azure Monitor managed service for Prometheus remote write - managed identity (preview)](prometheus-remote-write-managed-identity.md).

## Grafana integration
The primary method for visualizing Prometheus metrics is [Azure Managed Grafana](../../managed-grafana/overview.md). [Connect your Azure Monitor workspace to a Grafana workspace](azure-monitor-workspace-overview.md#link-a-grafana-workspace) so that it can be used as a data source in a Grafana dashboard. You then have access to multiple prebuilt dashboards that use Prometheus metrics and the ability to create any number of custom dashboards.

## Rules and alerts
Azure Monitor managed service for Prometheus adds a new Prometheus alert type for creating alert rules and recording rules using PromQL queries. You can view fired and resolved Prometheus alerts in the Azure portal along with other alert types. Prometheus alerts are configured with the same [alert rules](https://aka.ms/azureprometheus-promio-alertrules) used by Prometheus. For your AKS cluster, you can use a [set of predefined Prometheus alert rules](../containers/container-insights-metric-alerts.md).


## Limitations
See [Azure Monitor service limits](../service-limits.md#prometheus-metrics) for performance related service limits for Azure Monitor managed service for Prometheus.

- Private Links aren't supported for Prometheus metrics collection into Azure monitor workspace.
- Azure monitor managed service for Prometheus is only supported in public clouds.
- Metrics addon doesn't work on AKS clusters configured with HTTP proxy. 
- Scraping and storing metrics at frequencies less than 1 second isn't supported.


## Prometheus references
Following are links to Prometheus documentation.

- [PromQL](https://aka.ms/azureprometheus-promio-promql)
- [Grafana](https://aka.ms/azureprometheus-promio-grafana)
- [Recording rules](https://aka.ms/azureprometheus-promio-recrules)
- [Alerting rules](https://aka.ms/azureprometheus-promio-alertrules)
- [Writing Exporters](https://aka.ms/azureprometheus-promio-exporters)


## Next steps

- [Enable Azure Monitor managed service for Prometheus](prometheus-metrics-enable.md).
- [Collect Prometheus metrics for your AKS cluster](../containers/container-insights-prometheus-metrics-addon.md).
- [Configure Prometheus alerting and recording rules groups](prometheus-rule-groups.md).
- [Customize scraping of Prometheus metrics](prometheus-metrics-scrape-configuration.md).
