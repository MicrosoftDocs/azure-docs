---
title: Monitor Azure Data Explorer performance, health, and usage with metrics
description: Learn how to use Azure Data Explorer metrics to monitor the cluster's performance, health, and usage.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/19/2020
---

# Monitor Azure Data Explorer performance, health, and usage with metrics

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. Azure Data Explorer metrics provide key indicators as to the health and performance of the cluster resources. Use the metrics that are detailed in this article to monitor Azure Data Explorer cluster health and performance in your specific scenario as standalone metrics. You can also use metrics as the basis for operational [Azure Dashboards](/azure/azure-portal/azure-portal-dashboards) and [Azure Alerts](/azure/azure-monitor/platform/alerts-metric-overview).

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/).

* Create a [cluster and database](create-cluster-database-portal.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Using metrics

In your Azure Data Explorer cluster, select **Metrics** to open the metrics pane and begin analysis on your cluster.

![Select Metrics](media/using-metrics/select-metrics.png)

In the Metrics pane:

![Metrics pane](media/using-metrics/metrics-pane.png)

1. To create a metric chart, select **Metric** name and relevant **Aggregation** per metric. The **Resource** and **Metric Namespace** pickers are pre-selected for your Azure Data Explorer cluster. For more information regarding different metrics see [supported Azure Data Explorer metrics](#supported-azure-data-explorer-metrics).
1. Select the **Add metric** button to see multiple metrics plotted in the same chart.
1. Select the **+ New chart** button to see multiple charts in one view.
1. Use the time picker to change the time range (default: past 24 hours).
1. Use [**Add filter** and **Apply splitting**](/azure/azure-monitor/platform/metrics-getting-started#apply-dimension-filters-and-splitting) for metrics that have dimensions.
1. Select **Pin to dashboard** to add your chart configuration to the dashboards so that you can view it again.
1. Set **New alert rule** to visualize your metrics using the set criteria. The new alerting rule will include your target resource, metric, splitting, and filter dimensions from your chart. Modify these settings in the [alert rule creation pane](/azure/azure-monitor/platform/metrics-charts#create-alert-rules).

Additional information on using the [Metrics Explorer](/azure/azure-monitor/platform/metrics-getting-started).

## Supported Azure Data Explorer metrics

The supported Azure Data Explorer Metrics are separated into various categories according to usage. 

### Cluster health metrics

The cluster health metrics track the general health of the cluster. This includes resource and ingestion utilization and responsiveness.

**Metric** | **Unit** | **Aggregation** | **Metric description**
|---|---|---|---|
| Cache utilization | Percent | Avg, Max, Min | Percentage of allocated cache resources currently in use by the cluster. Cache is the size of SSD allocated for user activity according to the defined cache policy. An average cache utilization of 80% or less is a sustainable state for a cluster. If the average cache utilization is above 80%, the cluster should be [scaled up](manage-cluster-vertical-scaling.md) to a storage optimized pricing tier or [scaled out](manage-cluster-horizontal-scaling.md) to more instances. Alternatively, adapt the cache policy (fewer days in cache). If cache utilization is over 100%, the size of data to be cached, according to the caching policy, is larger that the total size of cache on the cluster. |
| CPU | Percent | Avg, Max, Min | Percentage of allocated compute resources currently in use by machines in the cluster. An average CPU of 80% or less is sustainable for a cluster. The maximum value of CPU is 100%, which means there are no additional compute resources to process data. When a cluster isn't performing well, check the maximum value of the CPU to determine if there are specific CPUs that are blocked. |
| Ingestion utilization | Percent | Avg, Max, Min | Percentage of actual resources used to ingest data from the total resources allocated, in the capacity policy, to perform ingestion. The default capacity policy is no more than 512 concurrent ingestion operations or 75% of the cluster resources invested in ingestion. Average ingestion utilization of 80% or less is a sustainable state for a cluster. Maximum value of ingestion utilization is 100%, which means all cluster ingestion ability is used and an ingestion queue may result. |
| Keep alive | Count | Avg | Tracks the responsiveness of the cluster. A fully responsive cluster returns value 1 and a blocked or disconnected cluster returns 0. |
| Total number of throttled commands | Count | Avg, Max, Min, Sum | The number of throttled (rejected) commands in the cluster, since the maximum allowed number of concurrent (parallel) commands was reached. |
| Total number of extents | Count | Avg, Max, Min, Sum | Total number of data extents in the cluster. Changes in this metric can imply massive data structure changes and high load on the cluster, since merging data extents is a CPU-heavy activity. |
| | | | |

### Export health and performance metrics

Export health and performance metrics track the general health and performance of export operations like lateness, results, number of records, and utilization.

**Metric** | **Unit** | **Aggregation** | **Metric description**
|---|---|---|---|
Continuous export number of exported records	| Count	| Sum |	Total number of records exported from the cluster. |
Continuous export max lateness minutes |	Count	| Max	| Max value in minutes of exported records.|
Continuous export pending count	| Count	| Max	| Max value of pending export operations.
Continuous export result	| Count |	Count	| Total number of continuous export operations, by result. Metric includes a continuous export name and database. 
Export utilization |	Percent	| Max	| Usage of defined slot for export operations.
| | | | |

### Ingestion health and performance metrics

Ingestion health and performance metrics track the general health and performance of ingestion operations like latency, results, and volume.

**Metric** | **Unit** | **Aggregation** | **Metric description**
|---|---|---|---|
| Events processed (for Event/IoT Hubs) | Count | Max, Min, Sum | Total number of events read from event hubs and processed by the cluster. The events are split into events rejected and events accepted by the cluster engine. |
| Ingestion latency | Seconds | Avg, Max, Min | Latency of data ingested, from the time the data was received in the cluster until it's ready for query. The ingestion latency period depends on the ingestion scenario. |
| Ingestion result | Count | Count | Total number of ingestion operations that failed and succeeded. Use **apply splitting** to create buckets of success and fail results and analyze the dimensions (**Value** > **Status**).|
| Ingestion volume (in MB) | Count | Max, Sum | The total size of data ingested to the cluster (in MB) before compression. |
| | | | |  

### Query performance

Query performance metrics track query duration and total number of concurrent or throttled queries.

**Metric** | **Unit** | **Aggregation** | **Metric description**
|---|---|---|---|
| Query duration | Milliseconds | Avg, Min, Max, Sum | Total time until query results are received (doesn't include network latency). |
| Total number of concurrent queries | Count | Avg, Max, Min, Sum | The number of queries run in parallel in the cluster. This metric is a good way to estimate the load on the cluster. |
| Total number of throttled queries | Count | Avg, Max, Min, Sum | The number of throttled (rejected) queries in the cluster. The maximum number of concurrent (parallel) queries allowed is defined in the concurrent query policy. |
| | | | |

### Streaming ingest metrics

Streaming ingest metrics track streaming ingestion data and request rate, duration, and results.

**Metric** | **Unit** | **Aggregation** | **Metric description**
|---|---|---|---|
Streaming Ingest Data Rate |	Count	| RateRequestsPerSecond	| Total volume of data ingested to the cluster. |
Streaming Ingest Duration	| Milliseconds	| Avg, Max, Min	| Total duration of all streaming ingestion requests. |
Streaming Ingest Request Rate	| Count	| Count, Avg, Max, Min, Sum	| Total number of streaming ingestion requests. |
Streaming Ingest Result	| Count	| Avg	| Total number of streaming ingestion requests by result type. |
| | | | |

Additional information about [supported Azure Data Explorer cluster metrics](/azure/azure-monitor/platform/metrics-supported#microsoftkustoclusters)


## Next steps

* [Tutorial: Ingest and query monitoring data in Azure Data Explorer](/azure/data-explorer/ingest-data-no-code)
* [Monitor Azure Data Explorer ingestion operations using diagnostic logs](/azure/data-explorer/using-diagnostic-logs)
* [Quickstart: Query data in Azure Data Explorer](web-query-data.md)
