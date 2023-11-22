---
title: Azure Monitor data platform
description: Overview of the Azure Monitor data platform and collection of observability data.
author: bwren
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 08/09/2023
ms.reviewer: bwren
---

# Azure Monitor data platform

Today's complex computing environments run distributed applications that rely on both cloud and on-premises services. To enable observability, operational data must be collected from every layer and component of the distributed system. You need to be able to perform deep insights on this data and consolidate it with different perspectives so that it supports the range of stakeholders in your organization.

[Azure Monitor](overview.md) collects and aggregates data from various sources into a common data platform where it can be used for analysis, visualization, and alerting. It provides a consistent experience on top of data from multiple sources. You can gain deep insights across all your monitored resources and even with data from other services that store their data in Azure Monitor.

:::image type="content" source="media/overview/overview-simple-20230707-opt.svg" alt-text="Diagram that shows an overview of Azure Monitor with data sources on the left sending data to a central data platform and features of Azure Monitor on the right that use the collected data." border="false" lightbox="media/overview/overview-blowout-20230707-opt.svg":::

## Observability data in Azure Monitor

Metrics, logs, and distributed traces are commonly referred to as the three pillars of observability. A monitoring tool must collect and analyze these three different kinds of data to provide sufficient observability of a monitored system. Observability can be achieved by correlating data from multiple pillars and aggregating data across the entire set of resources being monitored. Because Azure Monitor stores data from multiple sources together, the data can be correlated and analyzed by using a common set of tools. It also correlates data across multiple Azure subscriptions and tenants, in addition to hosting data for other services.

Azure resources generate a significant amount of monitoring data. Azure Monitor consolidates this data along with monitoring data from other sources into either a Metrics or Logs platform. Each is optimized for particular monitoring scenarios, and each supports different features in Azure Monitor. Features such as data analysis, visualizations, or alerting require you to understand the differences so that you can implement your required scenario in the most efficient and cost effective manner. Insights in Azure Monitor such as [Application Insights](app/app-insights-overview.md) or [Container insights](containers/container-insights-overview.md) have analysis tools that allow you to focus on the particular monitoring scenario without having to understand the differences between the two types of data. 

### Metrics

[Metrics](essentials/data-platform-metrics.md) are numerical values that describe some aspect of a system at a particular point in time. They're collected at regular intervals and are identified with a timestamp, a name, a value, and one or more defining labels. Metrics can be aggregated by using various algorithms. They can be compared to other metrics and analyzed for trends over time.

Metrics in Azure Monitor are stored in a time-series database that's optimized for analyzing time-stamped data. Time-stamping makes metrics well suited for alerting and fast detection of issues. Metrics can tell you how your system is performing but typically must be combined with logs to identify the root cause of issues.

Azure Monitor Metrics includes two types of metrics - native metrics and Prometheus metrics. See a comparison of the two and further details about Azure Monitor metrics, including their sources of data, at [Metrics in Azure Monitor](essentials/data-platform-metrics.md).

### Logs

[Logs](logs/data-platform-logs.md) are events that occurred within the system. They can contain different kinds of data and might be structured or freeform text with a timestamp. They might be created sporadically as events in the environment generate log entries. A system under heavy load typically generates more log volume.

Logs in Azure Monitor are stored in a Log Analytics workspace that's based on [Azure Data Explorer](/azure/data-explorer/), which provides a powerful analysis engine and [rich query language](/azure/kusto/query/). Logs typically provide enough information to provide complete context of the issue being identified and are valuable for identifying the root cause of issues.

> [!NOTE]
> It's important to distinguish between Azure Monitor Logs and sources of log data in Azure. For example, subscription-level events in Azure are written to an [Activity log](essentials/platform-logs-overview.md) that you can view from the Azure Monitor menu. Most resources will write operational information to a [resource log](essentials/platform-logs-overview.md) that you can forward to different locations.
>
>Azure Monitor Logs is a log data platform that collects Activity logs and resource logs along with other monitoring data to provide deep analysis across your entire set of resources.

 You can work with [log queries](logs/log-query-overview.md) interactively with [Log Analytics](logs/log-query-overview.md) in the Azure portal. You can also add the results to an [Azure dashboard](app/overview-dashboard.md#create-custom-kpi-dashboards-using-application-insights) for visualization in combination with other data. You can create [log alerts](alerts/alerts-log.md), which will trigger an alert based on the results of a schedule query.

Read more about Azure Monitor logs including their sources of data in [Logs in Azure Monitor](logs/data-platform-logs.md).

### Distributed traces

Traces are series of related events that follow a user request through a distributed system. They can be used to determine the behavior of application code and the performance of different transactions. While logs will often be created by individual components of a distributed system, a trace measures the operation and performance of your application across the entire set of components.

Distributed tracing in Azure Monitor is enabled with the [Application Insights SDK](app/distributed-tracing-telemetry-correlation.md). Trace data is stored with other application log data collected by Application Insights. This way it's available to the same analysis tools as other log data including log queries, dashboards, and alerts.

Read more about distributed tracing at [What is distributed tracing?](app/distributed-tracing-telemetry-correlation.md).

### Changes

[Changes](./change/change-analysis-visualizations.md) are a series of events that occur in your Azure application, from the infrastructure layer through application deployment. Changes are traced on a subscription-level using [the Change Analysis tool](./change/change-analysis.md). The Change Analysis tool increases observability by building on the power of [Azure Resource Graph](../governance/resource-graph/overview.md) to provide detailed insights into your application changes. 

Once [Change Analysis is enabled](./change/change-analysis-enable.md), the `Microsoft.ChangeAnalysis` resource provider is registered with an Azure Resource Manager subscription to make the resource properties and configuration change data available. Change Analysis provides data for various management and troubleshooting scenarios to help users understand what changes might have caused the issues:
- Troubleshoot your application via the [Diagnose & solve problems tool](./change/change-analysis-enable.md).
- Perform general management and monitoring via the [Change Analysis overview portal](./change/change-analysis-visualizations.md#view-change-analysis-data) and [the activity log](./change/change-analysis-visualizations.md#view-the-activity-log-change-history).
- [Learn more about how to view data results for other scenarios](./change/change-analysis-visualizations.md).

Read more about Change Analysis, including data sources in [Use Change Analysis in Azure Monitor](./change/change-analysis.md).

## Collect monitoring data
Different [sources of data for Azure Monitor](data-sources.md) will write to either a Log Analytics workspace (Logs) or the Azure Monitor metrics database (Metrics) or both. Some sources will write directly to these data stores, while others might write to another location such as Azure storage and require some configuration to populate logs or metrics. 

For a listing of different data sources that populate each type, see [Metrics in Azure Monitor](essentials/data-platform-metrics.md) and [Logs in Azure Monitor](logs/data-platform-logs.md).

## Stream data to external systems

In addition to using the tools in Azure to analyze monitoring data, you might have a requirement to forward it to an external tool like a security information and event management product. This forwarding is typically done directly from monitored resources through [Azure Event Hubs](../event-hubs/index.yml).

Some sources can be configured to send data directly to an event hub while you can use another process, such as a logic app, to retrieve the required data. For more information, see [Stream Azure monitoring data to an event hub for consumption by an external tool](essentials/stream-monitoring-data-event-hubs.md).





## Next steps
- Read more about [Metrics in Azure Monitor](essentials/data-platform-metrics.md).
- Read more about [Logs in Azure Monitor](logs/data-platform-logs.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.
