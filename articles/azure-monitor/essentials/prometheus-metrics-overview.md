---
title: Overview of Azure Monitor Managed Service for Prometheus
description: Overview of Azure Monitor managed service for Prometheus which provides a Prometheus-compatible interface for storing and retrieving metric data.
author: bwren 
ms.topic: conceptual
ms.date: 09/15/2022
---

# Azure Monitor managed service for Prometheus
Azure Monitor managed service for Prometheus allows you to collect and analyze metrics at scale using our Prometheus-compatible monitoring solution, based on the [Prometheus](https://prometheus.io/) project from the Cloud Native Compute Foundation. The fully managed service allows you to use the [Prometheus query language (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/) to analyze and alert on the performance of monitored infrastructure and workloads without having to operate the underlying infrastructure.

Azure Monitor managed service for Prometheus is a component of [Azure Monitor Metrics](data-platform-metrics.md), providing additional flexibility in the types of metric data that you can collect and analyze with Azure Monitor. Prometheus metrics share some features with platform and custom metrics, but use some different features to better support open source tools such as [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) and [Grafana](../../managed-grafana/overview.md).

## Data sources
Azure Monitor managed service for Prometheus can currently collect data from any of the following data sources.

- Azure Kubernetes service (AKS). Configure the Azure Monitor managed service for Prometheus AKS add-on to scrape metrics from an AKS cluster.
- Any Kubernetes cluster running self-managed Prometheus using [remote-write](https://prometheus.io/docs/practices/remote_write/#remote-write-tuning). In this configuration, metrics are collected by a local Prometheus server for each cluster and then consolidated in Azure Monitor managed service for Prometheus.



## Grafana integration
The primary method for visualizing Prometheus metrics is [Azure Managed Grafana](../../managed-grafana/overview.md). Connect your Azure Monitor workspace to a Grafana workspace so that it can be used as a data source in a Grafana dashboard. You then have access to multiple prebuilt dashboards that use Prometheus metrics and the ability to create any number of custom dashboards.

## Alerts
Azure Monitor managed service for Prometheus adds a new Prometheus metric alert type for creating alerts using PromQL queries. You can view fired and resolved Prometheus alerts in the Azure portal along with other alert types. Prometheus alerts are configured with the same [alert rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) used by Prometheus.

## Enable
The only requirement to enable Azure Monitor managed service for Prometheus is to create an [Azure Monitor workspace](azure-monitor-workspace-overview.md), which is where Prometheus metrics are stored. One this workspace is created, you can onboard services that collect Prometheus metrics.

### Service limits
See [Azure Monitor service limits](../service-limits.md) for any service limits related to Azure Monitor managed service for Prometheus.

## Prometheus references

- [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana](https://prometheus.io/docs/visualization/grafana/)
- [Recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#defining-recording-rules)
- [Alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
- [Writing Exporters](https://prometheus.io/docs/instrumenting/writing_exporters/)


## Next steps


- [Configure alerting and recording rules groups](prometheus-metrics-rule-groups.md)
