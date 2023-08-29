---
title: Overview of Azure Monitor Managed Service for Prometheus
description: Overview of Azure Monitor managed service for Prometheus, which provides a Prometheus-compatible interface for storing and retrieving metric data.
author: EdB-MSFT
ms.service: azure-monitor
ms-author: edbaynash
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 05/10/2023
---

# Azure Monitor managed service for Prometheus

Azure Monitor managed service for Prometheus is a component of [Azure Monitor Metrics](data-platform-metrics.md), providing more flexibility in the types of metric data that you can collect and analyze with Azure Monitor. Prometheus metrics share some features with platform and custom metrics, but use some different features to better support open source tools such as [PromQL](https://aka.ms/azureprometheus-promio-promql) and [Grafana](../../managed-grafana/overview.md).

Azure Monitor managed service for Prometheus allows you to collect and analyze metrics at scale using a Prometheus-compatible monitoring solution, based on the [Prometheus](https://aka.ms/azureprometheus-promio) project from the Cloud Native Computing Foundation. This fully managed service allows you to use the [Prometheus query language (PromQL)](https://aka.ms/azureprometheus-promio-promql) to analyze and alert on the performance of monitored infrastructure and workloads without having to operate the underlying infrastructure.

> [!IMPORTANT] 
> Azure Monitor managed service for Prometheus is intended for storing information about service health of customer machines and applications. It is not intended for storing any data classified as Personal Identifiable Information (PII) or End User Identifiable Information (EUII). We strongly recommend that you do not send any sensitive information (usernames, credit card numbers etc.) into Azure Monitor managed service for Prometheus fields like metric names, label names, or label values.

## Data sources
Azure Monitor managed service for Prometheus can currently collect data from any of the following data sources:

- Azure Kubernetes service (AKS)
- Any Kubernetes cluster running self-managed Prometheus using [remote-write](https://aka.ms/azureprometheus-promio-prw).
- Azure Arc-enabled Kubernetes 

## Enable
The only requirement to enable Azure Monitor managed service for Prometheus is to create an [Azure Monitor workspace](azure-monitor-workspace-overview.md), which is where Prometheus metrics are stored. Once this workspace is created, you can onboard services that collect Prometheus metrics.

- To collect Prometheus metrics from your AKS cluster without using Container insights, see [Collect Prometheus metrics from AKS cluster](prometheus-metrics-enable.md).
- To add collection of Prometheus metrics to your cluster using Container insights, see [Collect Prometheus metrics with Container insights](../containers/container-insights-prometheus.md#send-data-to-azure-monitor-managed-service-for-prometheus).
- To configure remote-write to collect data from your self-managed Prometheus server, see [Azure Monitor managed service for Prometheus remote write - managed identity](prometheus-remote-write-managed-identity.md).
- To collect Prometheus metrics from your Azure Arc-enabled Kubernetes cluster without using Container insights, see [Collect Prometheus metrics from Azure Arc-enabled Kubernetes cluster](./prometheus-metrics-from-arc-enabled-cluster.md)

## Grafana integration
The primary method for visualizing Prometheus metrics is [Azure Managed Grafana](../../managed-grafana/overview.md). [Connect your Azure Monitor workspace to a Grafana workspace](./azure-monitor-workspace-manage.md#link-a-grafana-workspace) so that it can be used as a data source in a Grafana dashboard. You then have access to multiple prebuilt dashboards that use Prometheus metrics and the ability to create any number of custom dashboards.

## Rules and alerts
Azure Monitor managed service for Prometheus supports recording rules and alert rules using PromQL queries. Metrics recorded by recording rules are stored back in the Azure Monitor workspace and can be queried by dashboard or by other rules. Alert rules and recording rules can be created and managed using [Azure Managed Prometheus rule groups](prometheus-rule-groups.md). For your AKS cluster, a set of [predefined Prometheus alert rules](../containers/container-insights-metric-alerts.md) and [recording rules](./prometheus-metrics-scrape-default.md#recording-rules) is provided to allow easy quick start.

Alerts fired by alert rules can trigger actions or notifications, as defined in the [action groups](../alerts/action-groups.md) configured for the alert rule. You can also view fired and resolved Prometheus alerts in the Azure portal along with other alert types. 

## Service limits & quotas

See [Azure Monitor service limits](../service-limits.md#prometheus-metrics) for service limits & quotas for Azure Monitor Managed service for Prometheus.

## Limitations/Known issues - Azure Monitor managed Service for Prometheus

- Scraping and storing metrics at frequencies less than 1 second isn't supported.
- Metrics with the same label names but different cases are rejected during ingestion (ex;- `diskSize(cluster="eastus", node="node1", filesystem="usr_mnt", FileSystem="usr_opt")` is invalid due to `filesystem` and `FileSystem` labels, and are rejected).
- Microsoft Azure operated by 21Vianet cloud and Air gapped clouds aren't supported for Azure Monitor managed service for Prometheus.
- To monitor Windows nodes & pods in your cluster(s), follow steps outlined [here](./prometheus-metrics-enable.md#enable-windows-metrics-collection).
- Azure Managed Grafana isn't currently available in the Azure US Government cloud.
- Usage metrics (metrics under `Metrics` menu for the Azure Monitor workspace) - Ingestion quota limits and current usage for any Azure monitor Workspace aren't available yet in US Government cloud.
- During node updates, you may experience gaps lasting 1 to 2 minutes in some metric collections from our cluster level collector. This gap is due to a regular action from Azure Kubernetes Service to update the nodes in your cluster. This behavior is expected and occurs due to the node it runs on being updated. None of our recommended alert rules are affected by this behavior. 

## Prometheus references
Following are links to Prometheus documentation.

- [PromQL](https://aka.ms/azureprometheus-promio-promql)
- [Grafana](https://aka.ms/azureprometheus-promio-grafana)
- [Recording rules](https://aka.ms/azureprometheus-promio-recrules)
- [Alerting rules](https://aka.ms/azureprometheus-promio-alertrules)
- [Writing Exporters](https://aka.ms/azureprometheus-promio-exporters)


## Next steps

- [Enable Azure Monitor managed service for Prometheus](prometheus-metrics-enable.md).
- [Configure Prometheus alerting and recording rules groups](prometheus-rule-groups.md).
- [Customize scraping of Prometheus metrics](prometheus-metrics-scrape-configuration.md).
