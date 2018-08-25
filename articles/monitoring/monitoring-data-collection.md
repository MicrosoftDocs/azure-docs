---
title: Collect monitoring data in Azure | Microsoft Docs
description: Overview of the monitoring data that's collected from applications and services in Azure, and the tools used to analyze it.
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.service: monitoring
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/06/2018
ms.author: bwren

---

# Data collected by Azure Monitor
Azure Monitor is a service that 

This article provides a complete description of each of these types of data and how they are managed in Azure Monitor.

All data collected by Azure Monitor fits into one of two fundamental types, [metrics](#metrics) and [logs](#logs). Metrics are numerical values that describe some aspect of a system at a particular point in time. They are lightweight and capable of supporting near real-time scenarios. Logs contain different kinds of data organized into records with different sets of properties for each type. Telemetry such as events and traces are stored as logs in addition to performance data so that it can all be combined for analysis.

![Azure Monitor overview](../azure-monitor/media/overview/overview.png)


## Metrics
Metrics are numerical values that describe some aspect of a system at a particular time. They are collected at regular intervals whether or not the value changes. For example, you might collect processor utilization from a virtual machine every minute or the number of users logged in to your application every 10 minutes.

Metrics are lightweight and capable of supporting near real-time scenarios. They're useful for alerting because metrics can be sampled frequently, and an alert can be fired quickly with relatively simple logic. For example, you might fire an alert when a metric exceeds a threshold value. Or you might fire an alert when the difference between two metrics reaches a particular value.

The specific properties of metrics includes the following:

* Distinct data, including the value itself.
* The time that the value was collected.
* The type of measurement that the value represents.
* The resource that the value is associated with. 

Individual metrics typically provide little insight on their own. They provide a single value without any context other than comparison to a simple threshold. They're valuable when combined with other metrics to identify patterns and trends, or when combined with logs that provide context around particular values. 

For example, a certain number of users on your application at a given time might tell you little about the health of the application. But a sudden drop in users, indicated by multiple values of the same metric, might indicate a problem. Excessive exceptions thrown by the application, and indicated by a separate metric, might identify an application issue that's causing the drop. Events that the application creates to identify failures in its components can help you identify the root cause.

### Sources of metric data
Metrics in Azure are collected in the Azure Monitor metrics store. This is a time series database optimized for quick retrieval. There are three fundamental types of metrics collected by Azure Monitor. All of these metrics are available together in the metric store where they can be evaluated together.

#### Platform metrics
Platform metrics are created by Azure resources. Each type of resource creates a [distinct set of metrics](../monitoring-and-diagnostics/monitoring-supported-metrics.md) without any configuration required. These metrics have the following characteristics:

* All metrics have **one-minute frequency** (unless specified otherwise in a metric's definition). You receive a metric value every minute from your resource, giving you near real-time visibility into the state and health of your resource.
* Metrics are **available immediately**. You don't need to opt in or set up additional diagnostics.
* You can access **93 days of history** for each metric. You can quickly look at the recent and monthly trends in the performance or health of your resource.
* Some metrics can have name-value pair attributes called **dimensions**. These enable you to further segment and explore a metric in a more meaningful way.

#### Application metrics
[Application metrics](../application-insights/app-insights-metrics-explorer.md) are created by Application Insights for your monitored applications. This includes such values as _Server response time_ and _Browser exceptions_.


#### Custom metrics
Custom metrics are metrics that you define. They can be created using the following methods:

- Define custom metrics [in your application](../application-insights/app-insights-api-custom-events-metrics.md) that's monitored by Application Insights.
- Publish custom metrics from your Windows virtual machine using [Windows Diagnostic Extension (WAD)](../monitoring-and-diagnostics/azure-diagnostics.md).
- - Publish custom metrics from your Linux virtual machine using [InfluxData Telegraf Agent](https://www.influxdata.com/time-series-platform/telegraf/).
- Write custom metrics from any REST client using the custom metrics API.

  

### Viewing metrics
Metric data is used in a variety of ways as described in the next section. Use [Metrics explorer](../monitoring-and-diagnostics/monitoring-metric-charts.md) to directly analyze the data in your metric store and chart the values of multiple metrics over time. You can view the charts interactively or pin them to a dashboard to view them with other visualizations. You can also retrieve metrics by using the [Azure monitoring REST API](../monitoring-and-diagnostics/monitoring-rest-api-walkthrough.md).

![Metrics Explorer](media/monitoring-data-collection/metrics-explorer.png)

### What can you do with metrics?
Metrics enable you to do the following tasks:

- Configure a metric **alert rule that sends a notification or takes automated action** when the metric crosses the threshold that you have set. Actions are controlled through [action groups](../monitoring-and-diagnostics/monitoring-action-groups.md). Example actions include email, phone, and SMS notifications, calling a webhook, starting a runbook, and more. **Autoscale** is a special automated action that enables you to scale your a resource up and down to handle load yet keep costs lower when not under load. You can configure an autoscale setting rule to scale in or out based on a metric crossing a threshold.
- **Route** all metrics to *Application Insights* or *Log Analytics* to enable instant analytics, search, and custom alerting on metrics data from your resources. You can also stream metrics to an *Event Hub*, enabling you to then route them to Azure Stream Analytics or to custom apps for near-real time analysis. You set up Event Hub streaming using diagnostic settings.
- **Archive** the performance or health history of your resource for compliance, auditing, or offline reporting purposes.  You can route your metrics to Azure Blob storage when you configure diagnostic settings for your resource.
- Use the **Azure portal** to discover, access, and view all metrics when you select a resource and plot the metrics on a chart. You can track the performance of your resource (such as a VM, website, or logic app) by pinning that chart to your dashboard.  
- **Perform advanced analytics** or reporting on performance or usage trends of your resource.
- **Query** metrics by using the PowerShell cmdlets or the Cross-Platform REST API.
- **Consume** the metrics via the new Azure Monitor REST APIs.

  ![Routing of Metrics in Azure Monitor](media//monitoring-data-collection/metrics-overview.png)



## Logs
Logs contain different kinds of data organized into records with different sets of properties for each type. Logs might contain numeric values like metrics but typically contain text data with detailed descriptions. They further differ from metrics in that they vary in their structure and are often not collected at regular intervals.

A common type of log entry is an event. Events are collected sporadically. They're created by an application or service and typically include enough information to provide complete context on their own. For example, an event can indicate that a particular resource was created or modified, a new host started in response to increased traffic, or an error was detected in an application.

Logs are especially useful for combining data from a variety of sources, for complex analysis and trending over time. Because the format of the data can vary, applications can create custom logs by using the structure that they need. Metrics can even be replicated in logs to combine them with other monitoring data for trending and other data analysis.

Log Analytics collects data from a variety of sources.  Once collected, the data is organized into separate tables for each data type, which allows all data to be analyzed together regardless of its original source.

### Log Analytics
Logs collected by Azure Monitor are stored in Log Analytics which can collect data from a variety of sources and has a rich query language for analyzing the data that it collects. 


You can use [log search portals](../log-analytics/log-analytics-log-search-portals.md) for interactively writing and testing queries and analyzing their results.



![Logs](media/monitoring-data-collection/logs.png)

### Sources of log data
Methods for collecting data into Log Analytics include the following:


- Configure Azure Monitor to copy [metrics and logs](../monitoring/monitoring-data-collection.md#types-of-monitoring-data) that it collects from Azure resources.
- Collect telemetry written to [Azure Storage](../log-analytics/log-analytics-azure-storage-iis-table.md).
- Agents on [Windows](../log-analytics/log-analytics-windows-agent.md) and [Linux](../log-analytics/log-analytics-linux-agents.md) virtual machines send telemetry from the guest operating system and applications to Log Analytics according to [Data Sources](../log-analytics/log-analytics-data-sources.md) that you configure. Agents can be directly connected, connect through an [OMS Gateway](../log-analytics/log-analytics-oms-gateway.md) when they don't have firewall access, or connect through a [System Center Operations Manager management group](../log-analytics/log-analytics-om-agents.md).
- Azure services such as [Application Insights](https://docs.microsoft.com/azure/application-insights/) and [Azure Security Center](https://docs.microsoft.com/azure/security-center/) store their data directly in Log Analytics without any configuration.
- Write data from PowerShell command line or [Azure Automation runbook](../automation/automation-runbook-types.md) using Log Analytics cmdlets.
- If you have custom requirements, then you can use the [HTTP Data Collector API](../log-analytics/log-analytics-data-collector-api.md) to write data to Log Analytics from any REST API client or an [Azure Logic App](https://docs.microsoft.com/azure/logic-apps/) to write data from a custom workflow.

![Log Analytics components](media/monitoring-data-collection/logs-overview.png)


### Logs in Azure

#### Activity log 
The [Azure Activity Log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md) stores logs about the configuration and health of Azure services. You can use Activity Log Explorer to view these logs in the Azure portal, but they're commonly [copied to Log Analytics](../log-analytics/log-analytics-activity.md) to be analyzed with other log data.

#### Diagnostic logs
While the Activity Log provides information about operations performed on an Azure resources, resource level Diagnostic logs provide insights into the operation of the resource itself. The configuration requirements and content of these logs varies by resource type. You can't directly view diagnostic logs in the Azure portal, but you can send them to Log Analytics for analysis or export them to Event Hub for redirection to other services. 

### Viewing log data
Log data is used in a variety of ways as described in the next section. Use the [Log Analytics page](../monitoring-and-diagnostics/monitoring-metric-charts.md) to write queries 


to directly analyze the data in your metric store and chart the values of multiple metrics over time. You can view the charts interactively or pin them to a dashboard to view them with other visualizations. You can also retrieve metrics by using the [Azure monitoring REST API](../monitoring-and-diagnostics/monitoring-rest-api-walkthrough.md).

![Metrics Explorer](media/monitoring-data-collection/metrics-explorer.png)

## Transferring monitoring data

### Metrics to logs
You can replicate metrics in Log Analytics to perform complex analysis with other data types by using its rich query language. You can also retain log data for longer periods than metrics, which enables you to perform trending over time. When metrics or any other performance data is stored in Log Analytics, that data acts as a log. Use metrics to support near real-time analysis and alerting while using logs for trending and analysis with other data.

You can get guidance for collecting metrics from Azure resources at [Collect Azure service logs and metrics for use in Log Analytics](../log-analytics/log-analytics-azure-storage.md). Get guidance for collecting resources metrics from Azure PaaS resources at [Configure collection of Azure PaaS resource metrics with Log Analytics](../log-analytics/log-analytics-collect-azurepass-posh.md).

### Logs to metrics
As described earlier, metrics are more responsive than logs, so you can create alerts with lower latency and at a lower cost. Log Analytics collects a significant amount of numeric data that would be suitable for metrics but isn't stored in Azure Monitor. 

A common example is performance data collected from agents and management solutions. Some of these values can be copied into Azure Monitor, where they are available for alerting and for analysis with Metrics Explorer.

The explanation of this feature is available at [Faster Metric Alerts for Logs now in limited public preview](https://azure.microsoft.com/blog/faster-metric-alerts-for-logs-now-in-limited-public-preview/). The list of values support is available at 
[Supported metrics and creation methods for new metric alerts](../monitoring-and-diagnostics/monitoring-near-real-time-metric-alerts.md).

### Event Hubs
In addition to using the tools in Azure to analyze monitoring data, you might want to forward it to an external tool such as a security information and event management (SIEM) product. This forwarding is typically done through [Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/). 

You can get guidance for the different kinds of monitoring data at [Stream Azure monitoring data to an event hub for consumption by an external tool](../monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs.md).

## Next steps

- Learn about the [monitoring data available](monitoring-data-sources.md) for different resources in Azure. 