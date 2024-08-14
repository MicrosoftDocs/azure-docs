---
title: Integrate common workloads with Azure Managed Prometheus
description: Describes how to integrate Azure Kubernetes Service workloads with Azure Managed Prometheus and list of available workloads that are ready to be integrated.
ms.topic: conceptual
ms.date: 6/20/2024
ms.reviewer: rashmy
ms.service: azure-monitor
ms.subservice: containers
---

# Use Prometheus exporters for common workloads with Azure Managed Prometheus

You can use Prometheus exporters to collect metrics from third-party workloads or other applications and send them to Azure Monitor Workspace along with other metrics collected by Azure Managed Prometheus running on AKS.

The enablement of Managed Prometheus automatically deploys the custom resource definitions (CRD) for [pod monitors](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/deploy/addon-chart/azure-monitor-metrics-addon/templates/ama-metrics-podmonitor-crd.yaml) and [service monitors](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/deploy/addon-chart/azure-monitor-metrics-addon/templates/ama-metrics-servicemonitor-crd.yaml).

You can configure any Prometheus exporter to work with Azure Managed Prometheus. For more information, see [Configure collection using Service and Pod Monitor custom resources](./prometheus-metrics-scrape-crd.md).

This document lists a set of commonly used workloads which have curated configurations and instructions to help you set up metrics collection from the workload. You can use this only with the managed add-on for Azure Managed Prometheus. For self-managed Prometheus, refer to the relevant exporter documentation for setting up metrics collection.

## Common workloads

- [Apache Kafka](./prometheus-kafka-integration.md)
- [Argo CD](./prometheus-argo-cd-integration.md)
- [Elastic Search](./prometheus-elasticsearch-integration.md)

## Next steps

[Customize collection using CRDs (Service and Pod Monitors)](./prometheus-metrics-scrape-crd.md)
[Customize metrics scraping with Azure Managed Prometheus](./prometheus-metrics-scrape-configuration.md)
