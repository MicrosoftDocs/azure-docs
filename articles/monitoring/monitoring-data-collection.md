---
title: Collecting monitoring data in Azure | Microsoft Docs
description: Overview of the monitoring data that's collected from application and services in Azure and the tools used to analyze it.
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

# Collecting monitoring data in Azure
This article provides an overview of the monitoring data that's collected from application and services in Azure and the tools used to analyze it. 

## Types of monitoring data
All monitoring data fits into one of two fundamental types, metrics or logs. Each type has distinct characteristics and is best suited for particular scenarios as described below.

### Metrics
Metrics are numerical values that describe some aspect of a system at a particular point in time. They include distinct data including the value itself, the time the value was collected, the type of measurement the value represents, and the particular resource that the value is associated with. Metrics are collected at regular intervals whether or not the value changes. For example, you might collect processor utilization from a virtual machine every minute or number of users logged in to your application every 10 minutes.

Metrics are lightweight and capable of supporting near real-time scenarios. They are particularly useful for alerting since metrics can be sampled frequently, and an alert can be fired quickly with relatively simple logic. For example, you might fire an alert when a metric exceeds a threshold value or fire an alert when the difference between value of two metrics reaches a particular value.

Individual metrics typically provide little insight on their own. They provide a single value without any context other than comparison to a simple threshold. They are valuable though when combined with other metrics to identify patterns and trends or when combined with logs that provide context around particular values. For example, a certain number of users on your application at a given time may tell you little about the health of the application. A sudden drop in users though indicated by multiple values of the same metric may indicate a problem. Excessive exceptions thrown by the application and indicated by a separate metric might identify an application issue causing the drop. Events created by the application identifying failure in particular components of the application may assist you in identifying the root cause.

Alerts based on logs are not as responsive as alerts based on metrics, but they can include more complex logic. You can create an alert based on the results of any query that performs complex analysis on data from multiple sources.

### Logs
Logs contain different kinds of data organized into records with different sets of properties for each type. Logs may contain numeric values like metrics but typically contain text data with detailed descriptions. They further differ from metrics in that they vary in their structure and are often not collected at regular intervals.

A common type of log entry is an event. Events are collected sporadically as they are created by an application or service and typically include enough information to provide complete context on their own.  For example, an event may indicate that a particular resource was created or modified, a new host start in response to increased traffic, or an error was detected in an application.

Logs are particularly useful for combining data from a variety of sources for complex analysis and trending over time. Because the format of the data can vary, applications can create custom logs using the structure that they require. Metrics can even be replicated in logs to combine it with other monitoring data for trending and other data analysis.


## Monitoring tools in Azure
Monitoring data in Azure is collected and analyzed using multiple sources that are described in the following sections.

### Azure Metrics
Metrics from Azure resources and applications are collected into Azure Metrics. Metric data is integrated into the pages in the Azure portal for particular Azure resources such as virtual machines, which include graphs of such metrics as CPU and network utilization for the selected machine. It can also be analyzed with the [Metrics Explorer](../monitoring-and-diagnostics/monitoring-metric-charts.md) which can chart the values of multiple metrics over time.  You can view the charts interactively or pin them to a dashboard to view them with other visualizations. You can also retrieve metrics with the [Azure monitoring REST API](../monitoring-and-diagnostics/monitoring-rest-api-walkthrough.md).

You can get detail on the metric data that is collected by different kinds of Azure resources at [Sources of monitoring data in Azure](monitoring-data-sources.md). 

![Metrics Explorer](media/monitoring-data-collection/metrics-explorer.png)


### Azure Activity Log 
The [Azure Activity Log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md) stores logs about the configuration and health of Azure services. You can use the Activity Log Explorer to view these logs in the Azure portal, but they're commonly [copied to Log Analytics](../log-analytics/log-analytics-activity.md) to be analyzed with other log data.

You can use the Activity Log Explorer to view the Activity log filtered to match certain criteria.  Most resources will also have an Activity Log option in their menu in the Azure portal that displays the Activity Log Explorer filtered for that resource. You can also retrieve Activity logs with the [Azure monitoring REST API](../monitoring-and-diagnostics/monitoring-rest-api-walkthrough.md).

![Activity Log Explorer](media/monitoring-data-collection/activity-log-explorer.png)


### Log Analytics
Log Analytics provides a common data platform for management in Azure. It is the primary service used for storage and analysis of logs in Azure, collecting data from a variety of sources including agents on virtual machines, management solutions, and different Azure resources. Data from other sources including metrics and the Activity Log can be copied into Log Analytics in order to create a complete central repository of monitoring data.

Log Analytics has a rich query language for analyzing the data it collects.  You can use [log search portals](../log-analytics/log-analytics-log-search-portals.md) for interactively writing and testing queries and analyzing their results. You can also [create views](../log-analytics/log-analytics-view-designer.md) to visualize the results of log searches or paste the results of a query directly to an Azure dashboard.  Management solutions include log searches and views in Log Analytics for analyzing the data they collect. Other services such as Application Insights store data in Log Analytics and provide additional tools for analysis.  

![Logs](media/monitoring-data-collection/logs.png)

### Application Insights
Application Insights collects telemetry for web applications installed on a variety of platforms. It stores its data in Azure Metrics and Log Analytics and provides an extensive set of rich tools, on top of the existing tools for analyzing this data, for analyzing and visualizing its data. This allows you to leverage a common set of services such as alerts, log searches, and dashboards that you use for other monitoring.


![App Insights](media/monitoring-data-collection/app-insights.png)

### Service Map
Service Map provides a visual representation of virtual machines with their processes and dependencies. It stores most of this data in Log Analytics so you can analyze it with other management data. The Service Map console also retrieves data from Log Analytics to present it in the context of the virtual machine being analyzed.

![Service Map](media/monitoring-data-collection/service-map.png)


## Transferring monitoring data

### Metrics to Logs
Metrics can also be replicated into Log Analytics to perform complex analysis with other data types using its rich query language. You can also retain log data for longer periods than metrics, which allows you to perform trending over time. When metrics or any other performance data is stored in Log Analytics, that data acts as a log. Use metrics to support near real-time analysis and alerting while using logs for trending and analysis with other data.

You can get guidance for collecting metrics from Azure resources at [Collect Azure service logs and metrics for use in Log Analytics](../log-analytics/log-analytics-azure-storage.md). Get guidance for collecting resources metrics from Azure PaaS resources at [Configure collection of Azure PaaS resource metrics with Log Analytics](../log-analytics/log-analytics-collect-azurepass-posh.md).

### Logs to metrics
As described above, metrics are more responsive than logs allowing you to create alerts with lower latency and at a lower cost. Log Analytics collects a significant amount of numeric data that would be suitable for metrics but isn't stored in Azure Metrics. A common example is performance data collected from agents and management solutions. Some of these values can be copied into Azure Metrics where they are available for alerting and for analysis with Metrics Explorer.

The explanation of this feature is available at [Faster Metric Alerts for Logs now in limited public preview](https://azure.microsoft.com/blog/faster-metric-alerts-for-logs-now-in-limited-public-preview/). The list of values support is available at 
[Supported metrics and creation methods for new metric alerts](../monitoring-and-diagnostics/monitoring-near-real-time-metric-alerts.md).

### Event Hub
In addition to using the tools in Azure to analyze monitoring data, you may want to forward it to an external tool such a security information and event management (SIEM) product. This is typically done using [Azure Event Hub](https://docs.microsoft.com/azure/event-hubs/). 

You can get guidance for the different kinds of monitoring data at [Stream Azure monitoring data to an event hub for consumption by an external tool](../monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs.md).

## Next steps

- Learn about the [monitoring data available](monitoring-data-sources.md) for different resources in Azure. 