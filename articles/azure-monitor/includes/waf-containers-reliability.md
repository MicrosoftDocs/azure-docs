---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---


### Design checklist

> [!div class="checklist"]
> - Enable scraping of Prometheus metrics for your cluster. 
> - Enable Container insights for collection of logs and performance data from your cluster.
> - Create diagnostic settings to collect control plane logs for AKS clusters.
> - Enable recommended Prometheus alerts.
> - Ensure the availability of the Log Analytics workspace supporting Container insights.


### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Enable scraping of Prometheus metrics for your cluster. | [Enable Prometheus](../containers/prometheus-metrics-enable.md) on your cluster with [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) if you don't already have a Prometheus environment. Use [Azure Managed Grafana](../../managed-grafana/overview.md) to analyze the Prometheus data collected. See [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](../containers/prometheus-metrics-scrape-configuration.md) to collect additional metrics beyond the [default configuration](../containers/prometheus-metrics-scrape-default.md). |
| Enable Container insights for collection of logs and performance data from your cluster. | [Container insights](../containers/container-insights-overview.md) collects stdout/stderr logs, performance metrics, and Kubernetes events from each node in your cluster. It provides dashboards and reports for analyzing this data, including the availability of your nodes and other components. Use [Log Analytics](../logs/log-analytics-overview.md) to identify any availability errors in your collected logs.  |
| Create diagnostic settings to collect control plane logs for AKS clusters. | AKS implements control planes logs as [resource logs](../essentials/resource-logs.md) in Azure Monitor. [Create a diagnostic setting](../essentials/diagnostic-settings.md) to send these logs to your Log Analytics workspace so you can use [log queries](../logs/log-query-overview.md) to identify errors and issues affecting availability. |
| Enable recommended Prometheus alerts. | [Alerts](../alerts/alerts-overview.md) in Azure Monitor proactively notify you when issues are detected.  Start with a set of [recommended Prometheus alert rules](../containers/container-insights-metric-alerts.md#enable-prometheus-alert-rules) that detect the most common availability and performance issues with your cluster. Potentially add [log query alerts](../containers/container-insights-log-alerts.md) using data collected by Container insights. |
| Ensure the availability of the Log Analytics workspace supporting Container insights. | Container insights relies on a Log Analytics workspace. See [Best practices for Azure Monitor Logs](../best-practices-logs.md#reliability) for recommendations to ensure the reliability of the workspace. |