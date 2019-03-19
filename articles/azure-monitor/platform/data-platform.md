---
title: Azure Monitor data platform | Microsoft Docs
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn
ms.service: monitoring
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/19/2019
ms.author: bwren
---

# Azure Monitor data platform

Enabling observability across today's complex computing environments running distributed applications that rely on both cloud and on-premise services, requires collection of operational data from every layer and every component of the distributed system. You need to be able to perform deep insights on this data and consolidate it into a single pane of glass with different perspectives to support the multitude of stakeholders in your organization.

[Azure Monitor](../overview.md) collects and aggregates data from a variety of sources into a common data platform where it can be used for analysis, visualization, and alerting. It provides a consistent experience on top of data from multiple sources, which gives you deep insights across all your monitored resources and even with data from other services that store their data in Azure Monitor.


![Azure Monitor overview](media/data-platform/overview.png)

## Pillars of observability
 Metrics, logs, and distributed traces are commonly referred to as the three pillars of observability. These are the different kinds of data that a monitoring tool must collect and analyze to provide sufficient observability of a monitored system. 

| Pillar | Description |
|:---|:---|
| [Metrics](#metrics) | Numerical values that describe some aspect of a system at a particular point in time. They are collected at regular intervals and are identified with a timestamp, a name, a value, and one or more defining labels. Metrics can be aggregated using a variety of algorithms, compared to other metrics, and analyzed for trends over time. Because they're lightweight with consistent collection, metrics are particularly suited for alerting and fast detection of issues. They can tell you how your system is performing but typically need to be combined with logs to identify the root cause of issues. |
| [Logs](#logs) | Events that occurred within the system. They can contain different kinds of data and may be structured or free form text with a timestamp. They may be created sporadically as events in the environment generate log entries, and a system under heavy load will typically generate more log volume. Logs typically provide enough information to provide complete context of the issue being identified and are valuable for identifying root case of issues. |
| [Distributed traces](#distributed-traces) | Series of related events that follow a user request through a distributed system. They can be used to determine behavior of application code and the performance of different transactions. While logs will often be created by individual components of a distributed system, a trace measures the operation and performance of your application across the entire set of components. Distributed tracing in Azure Monitor is enabled with the [Application Insights SDK](../app/distributed-tracing.md), and trace data is stored with log data in an [Application Insights application](data-platform-logs.md#how-is-log-data-structured). |

Complete observability cannot be achieved by focusing on a single observability pillar but rather by correlating data from multiple pillars and aggregating data across the entire set of resources being monitored. Because Azure Monitor stores log and metric data from multiple sources together, the data can be correlated and analyzed using a common set of tools. It also correlates data across multiple Azure subscriptions and tenants, in addition to hosting data for other services.


## Azure Monitor data types

All data collected by Azure Monitor is stored as either [metrics](#metrics) or [logs](#logs).  Each is stored on a platform optimized for its particular monitoring scenarios, and each supports different features in Azure Monitor. Features such as data analysis, visualizations, or alerting require you to understand the differences so that you can implement your required scenario in the most efficient and cost effective manner. Insights in Azure Monitor such as [Application Insights](../app/app-insights-overview.md) or [Azure Monitor for VMs](../insights/vminsights-overview.md) have analysis tools that allow you to focus on the particular monitoring scenario without having to understand the differences between the two types of data. 



### Azure Monitor metrics
**Metrics** are numerical values that describe some aspect of a system at a particular point in time. They are collected at regular intervals and are identified with a timestamp, a name, a value, and the resource that the value is associated with. Some metrics have additional dimensions to further describe the metric value. 

Metrics in Azure Monitor are stored in a time-series database which is optimized for analyzing time-stamped data. This makes metrics particularly suited for alerting and fast detection of issues. They can tell you how your system is performing but typically need to be combined with logs to identify the root cause of issues.

Metrics are available for interactive analysis in the Azure portal with [Metrics Explorer](../app/metrics-explorer.md). They can be added to an [Azure dashboard](../learn/tutorial-app-dashboards.md) for visualization in combination with other data and used for near-real time [alerting](alerts-metric.md).

 Read more about Azure Monitor metrics including their sources of data in [Metrics in Azure Monitor](data-platform-metrics.md).

### Azure Monitor logs
**Logs** contain different kinds of data organized into records with different sets of properties for each type. Logs can contain numeric values like metrics but typically contain text data with detailed descriptions. They further differ from metrics in that they vary in their structure and are often not collected at regular intervals. Logs are particularly useful for deep analysis of data and for identifying root cause of issues.

Logs in Azure Monitor are stored in a Log Analytics workspace that's based on [Azure Data Explorer](/azure/data-explorer/) which provides a powerful analysis engine and [rich query language](/azure/kusto/query/). You can work with [log queries](../log-query/log-query-overview.md) interactively with [Log Analytics](../log-query/portals.md) in the Azure portal or add the results to an [Azure dashboard](../learn/tutorial-app-dashboards.md) for visualization in combination with other data. You can also create [log alerts](alerts-log.md) which will trigger an alert based on the results of a schedule query.

Read more about logs including their sources of data in [Logs in Azure Monitor](data-platform-logs.md).


## Compare data types

The following table compares the two types of data in Azure Monitor.

| Attribute  | Metrics | Logs |
|:---|:---|:---|
| Benefits | Lightweight and capable of near-real time scenarios such as alerting. Ideal for fast detection of issues. | Analyzed with rich query language. Ideal for deep analysis and identifying root cause. |
| Data | Numerical values only | Text or numeric data |
| Structure | Standard set of properties including sample time, resource being monitored, a numeric value. Some metrics include multiple dimensions for further definition. | Unique set of properties depending on the log type. |
| Collection | Collected at regular intervals. | May be collected sporadically as events trigger a record to be created. |
| View in Azure portal | Metrics Explorer | Log Analytics |
| Data sources include | Platform metrics collected from Azure resources.<br>Applications monitored by Application Insights.<br>Custom defined by application or API. | Application and Diagnostics Logs.<br>Monitoring solutions.<br>Agents and VM extensions.<br>Application requests and exceptions.<br>Azure Security Center.<br>Data Collector API. |


## Populating metrics and logs

Different [sources of data for Azure Monitor](data-sources.md) will write to either a Log Analytics workspace (logs) or the Azure Monitor metrics database (metrics) or both. Some sources will write directly to these data stores, while others may write to another location such as Azure storage and require some configuration to populate logs or metrics. 

For example, the [Activity Log](activity-logs-overview.md) collects subscription level events in Azure. They are not stored directly into Azure Monitor logs. When you connect your activity log to a Log Analytics workspace, it streams the events to workspace which allows them to be analyzed with other data using all of the tools in Azure Monitor. 

See [Metrics in Azure Monitor](data-platform-metrics.md) and [Logs in Azure Monitor](data-platform-logs.md) for a listing of different data sources that populate each type.


## Features supporting multiple data types   
Metrics and logs each support different monitoring scenarios, but you can configure some data sources to leverage Azure Monitor features supported by the other type.

- [Send platform metrics for Azure Monitor resources to a Log Analytics workspace](diagnostic-logs-stream-log-store.md) to perform complex analysis with other data types using [log queries](../log-query/log-query-overview.md). Use metrics to support near real-time analysis and alerting while using logs for trending and analysis with other log data. Storing metric data in logs also allows you to retain the data for longer periods of time.

- [Create metric alerts for logs in Azure Monitor](alerts-metric-logs.md) to take advantage of metric alerts for some types of log data. Metric alerts are more responsive than log alerts and are stateful meaning that they only fire once until the issue is resolved.


## Stream data to external systems
In addition to using the tools in Azure to analyze monitoring data, you may have a requirement to forward it to an external tool such as a security information and event management (SIEM) product. This forwarding is typically done directly from monitored resources through [Azure Event Hubs](/azure/event-hubs/). Some sources can be configured to send data directly to an event hub while you can use another process such as a Logic App to retrieve the required data.



## Next steps

- Read more about [metrics in Azure Monitor](data-platform-metrics.md).
- Read more about [logs in Azure Monitor](data-platform-logs.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.
