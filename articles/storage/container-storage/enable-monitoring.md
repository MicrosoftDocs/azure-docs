---
title: Enable Monitoring for Azure Container Storage
description: Enable monitoring for stateful workloads running on Azure Container Storage using Azure Monitor managed service for Prometheus.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 09/03/2025
ms.author: kendownie
# Customer intent: As a cloud administrator, I want to enable monitoring for stateful workloads on Azure Container Storage using managed Prometheus, so that I can gain insights into performance metrics and ensure the reliability of my systems.
---

# Enable monitoring for Azure Container Storage with managed Prometheus

You can now monitor your stateful workloads running on Azure Container Storage using managed Prometheus. Prometheus is a popular open-source monitoring and alerting solution that's widely used in Kubernetes environments to monitor and alert on infrastructure and workload performance.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). If you want to enable monitoring for version 1.x.x, see [this article](enable-monitoring-version-1.md).

[Azure Monitor managed service for Prometheus](/azure/azure-monitor/essentials/prometheus-metrics-overview#azure-monitor-managed-service-for-prometheus) is a component of [Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics) that provides a fully managed and scalable environment for running Prometheus. It enables collecting Prometheus metrics from your Azure Kubernetes Service (AKS) clusters to monitor your workloads.

Prometheus metrics are stored in an Azure Monitor workspace, where you can analyze and visualize the data using [Azure Monitor Metrics Explorer with PromQL](/azure/azure-monitor/essentials/metrics-explorer) and [Azure Managed Grafana](/azure/managed-grafana/overview).

## Limitations

Azure Managed Grafana default dashboard support isn't currently enabled for Azure Container Storage.

## Collect Azure Container Storage Prometheus metrics

You can use Azure Monitor managed service for Prometheus to collect Azure Container Storage metrics along with other Prometheus metrics from your AKS cluster. To start collecting Azure Container Storage metrics, [enable Managed Prometheus on the AKS cluster](/azure/azure-monitor/containers/kubernetes-monitoring-enable?tabs=cli#enable-prometheus-and-grafana). If your AKS cluster already has Prometheus enabled, then installing Azure Container Storage on that cluster will automatically start collecting Azure Container Storage metrics.

### Scrape frequency

The default scrape frequency for all default targets and scrapes is 30 seconds.

### Metrics collected for default targets

The following Azure Container Storage targets are enabled by default, which means you don't have to provide any scrape job configuration for these targets:

- `acstor-metrics-exporter` (disk metrics)

You can customize data collection for the default targets using the Managed Prometheus ConfigMap. See [Customize scraping of Prometheus metrics in Azure Monitor](/azure/azure-monitor/containers/prometheus-metrics-scrape-configuration).

#### Disk metrics

Azure Container Storage provides the following disk metrics collected from the `acstor-metrics-exporter` target (job=acstor-metrics-exporter):

| **Metric** | **Description** |
|------------------|-----------------|
| `disk_read_operations_completed_total` | The number of total disk read operations performed successfully over the disk. |
| `disk_write_operations_completed_total` | The number of total disk write operations performed successfully over the disk. |
| `disk_read_operations_time_seconds_total` | The total time spent performing read operations in seconds. |
| `disk_write_operations_time_seconds_total` | The total time spent performing write operations in seconds. |
| `disk_errors_total` | Count of disk errors. |
| `disk_read_bytes_total` | The total number of bytes read successfully. |
| `disk_written_bytes_total` | The total number of bytes written successfully. |
| `disk_readonly_errors_gauge` | This is a gauge metric to measure read-only volume mounts. |
| `disk_discard_operations_completed_total` | The number of total discards completed successfully over the disk. |
| `disk_discard_operations_time_seconds_total` | The total time spent by all discards on the disk in seconds. |
| `disk_discarded_sectors_total` | The total number of sectors discarded successfully. |
| `disk_discards_merged_total` | The total number of discards merged. |
| `disk_flush_requests_time_seconds_total` | The total time spent by all flush requests in seconds. |
| `disk_flush_requests_total` | The total number of flush requests completed successfully. |
| `disk_io_now` | The number of I/Os currently in progress. |
| `disk_io_time_seconds_total` | The total time spent doing I/Os in seconds. |
| `disk_io_time_weighted_seconds_total` | The weighted time spent doing I/Os in seconds. |
| `disk_readonly_status_gauge` | This is a gauge metric to measure the readonly status of volume mounts |
| `disk_reads_merged_total` | The total number of reads merged. |
| `disk_writes_merged_total` | The total number of writes merged. |
| `disk_scrape_collector_duration_seconds` | This is the duration of a collector scrape. |
| `disk_scrape_collector_success` | This is a gauge metric which indicates whether the disk information was successfully collected. |

## Query Azure Container Storage metrics

Azure Container Storage metrics are stored in the Azure Monitor workspace that's associated with managed Prometheus. You can query metrics directly from the workspace or through the Azure Managed Grafana instance that's connected to the workspace.

To view Azure Container Storage metrics, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com?azure-portal=true) and navigate to your AKS cluster.

1. From the service menu, under **Monitoring**, select **Insights**, and then select **Monitor Settings**.

   :::image type="content" source="media/enable-monitoring/monitor-settings.png" alt-text="Screenshot showing how to find Monitor Settings in the Azure portal." lightbox="media/enable-monitoring/monitor-settings.png":::

1. Under **Managed Prometheus**, select the appropriate Azure Monitor workspace instance. On the instance overview page, select the **Metrics** section, and query the desired metrics.

   :::image type="content" source="media/enable-monitoring/metrics.png" alt-text="Screenshot showing how to query Azure Container Storage metrics using the Azure portal." lightbox="media/enable-monitoring/metrics.png":::

1. Alternatively, you can select the Managed Grafana instance, and on the instance overview page, click on the endpoint URL. This will navigate to the Grafana portal where you can query the metrics. The data source will be automatically configured for you to query metrics from the associated Azure Monitor workspace.

   :::image type="content" source="media/enable-monitoring/dashboard.png" alt-text="Screenshot of an Azure Managed Prometheus dashboard and metrics browser." lightbox="media/enable-monitoring/dashboard.png":::

To learn more about querying Prometheus metrics from Azure Monitor workspace, see [Use Azure Monitor managed service for Prometheus as data source for Grafana](/azure/azure-monitor/essentials/prometheus-grafana).

## Next steps

- [Create a dashboard in Azure Managed Grafana](/azure/managed-grafana/how-to-create-dashboard?tabs=azure-portal)
- [Create alerts on Azure Container Store metrics using Prometheus Rule Groups](/azure/azure-monitor/essentials/prometheus-rule-groups)