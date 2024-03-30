---
title: Get started with Azure Monitor Managed Service for Prometheus
description: Get started with Azure Monitor managed service for Prometheus, which provides a Prometheus-compatible interface for storing and retrieving metric data.
author: EdB-MSFT
ms.service: azure-monitor
ms-author: edbaynash
ms.topic: conceptual
ms.date: 02/15/2024
---

# Get Started with Azure Monitor managed service for Prometheus

The only requirement to enable Azure Monitor managed service for Prometheus is to create an [Azure Monitor workspace](azure-monitor-workspace-overview.md), which is where Prometheus metrics are stored. Once this workspace is created, you can onboard services that collect Prometheus metrics.

- To collect Prometheus metrics from your Kubernetes cluster, see [Enable monitoring for Kubernetes clusters](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana).
- To configure remote-write to collect data from your self-managed Prometheus server, see [Azure Monitor managed service for Prometheus remote write](./remote-write-prometheus.md).

## Data sources

Azure Monitor managed service for Prometheus can currently collect data from any of the following data sources:

- Azure Kubernetes service (AKS)
- Azure Arc-enabled Kubernetes
- Any server or Kubernetes cluster running self-managed Prometheus using [remote-write](./remote-write-prometheus.md).

## Next steps

- [Learn more about Azure Monitor Workspace](./azure-monitor-workspace-overview.md)
- [Enable Azure Monitor managed service for Prometheus on your Kubernetes clusters](../containers/kubernetes-monitoring-enable.md).
- [Configure Prometheus alerting and recording rules groups](prometheus-rule-groups.md).
- [Customize scraping of Prometheus metrics](prometheus-metrics-scrape-configuration.md).
