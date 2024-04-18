---
title: Third-party monitoring with Prometheus and Grafana (preview)
description: Learn how to monitor your Edge Storage Accelerator deployment using third-party monitoring with Prometheus and Grafana.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 04/08/2024

---

# Third-party monitoring with Prometheus and Grafana (preview)

This article describes how to monitor your deployment using third-party monitoring with Prometheus and Grafana.

## Metrics

### Configure an existing Prometheus instance for use with Edge Storage Accelerator

This guidance assumes that you previously worked with and/or configured Prometheus for Kubernetes. If you haven't previously done so, [see this overview](/azure/azure-monitor/containers/kubernetes-monitoring-enable#enable-prometheus-and-grafana) for more information about how to enable Prometheus and Grafana.

[See the metrics configuration section](azure-monitor-kubernetes.md#metrics-configuration) for information about the required Prometheus scrape configuration. Once you configure Prometheus metrics, you can deploy [Grafana](/azure/azure-monitor/visualize/grafana-plugin) to monitor and visualize your Azure services and applications.

## Logs

The Edge Storage Accelerator logs are accessible through the Azure Kubernetes Service [kubelet logs](/azure/aks/kubelet-logs). You can also collect this log data using the [syslog collection feature in Azure Monitor Container Insights](/azure/azure-monitor/containers/container-insights-syslog).

## Next steps

[Edge Storage Accelerator overview](overview.md)
