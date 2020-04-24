---
title: Query Prometheus Metrics from Azure Monitor | Microsoft Docs
description: This article describes how you can query Prometheus Metrics from Azure Monitor for containers.
ms.topic: conceptual
ms.date: 04/16/2020
---

# Query Prometheus Metrics from Azure Monitor

## Query Prometheus metrics data

To view prometheus metrics scraped by Azure Monitor and any configuration/scraping errors reported by the agent, review [Query Prometheus metrics data](container-insights-log-search.md#query-prometheus-metrics-data) and [Query config or scraping errors](container-insights-log-search.md#query-config-or-scraping-errors).

## View Prometheus metrics in Grafana

Azure Monitor for containers supports viewing metrics stored in your Log Analytics workspace in Grafana dashboards. We have provided a template that you can download from Grafana's [dashboard repository](https://grafana.com/grafana/dashboards?dataSource=grafana-azure-monitor-datasource&category=docker) to get you started and reference to help you learn how to query additional data from your monitored clusters to visualize in custom Grafana dashboards.

## Review Prometheus data usage

To identify the ingestion volume of each metrics size in GB per day to understand if it is high, the following query is provided.

```
InsightsMetrics
| where Namespace == "prometheus"
| where TimeGenerated > ago(24h)
| summarize VolumeInGB = (sum(_BilledSize) / (1024 * 1024 * 1024)) by Name
| order by VolumeInGB desc
| render barchart
```

The output will show results similar to the following:

![Log query results of data ingestion volume](./media/container-insights-prometheus-integration/log-query-example-usage-03.png)

To estimate what each metrics size in GB is for a month to understand if the volume of data ingested received in the workspace is high, the following query is provided.

```
InsightsMetrics
| where Namespace contains "prometheus"
| where TimeGenerated > ago(24h)
| summarize EstimatedGBPer30dayMonth = (sum(_BilledSize) / (1024 * 1024 * 1024)) * 30 by Name
| order by EstimatedGBPer30dayMonth desc
| render barchart
```

The output will show results similar to the following:

![Log query results of data ingestion volume](./media/container-insights-prometheus-integration/log-query-example-usage-02.png)

Further information on how to monitor data usage and analyze cost is available in [Manage usage and costs with Azure Monitor Logs](../platform/manage-cost-storage.md).

## Next steps

- [Learn more about configuring the agent collection settings for stdout, stderr, and environmental variables from container workloads](container-insights-agent-config.md)
