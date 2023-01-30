---
title: Azure Monitor overview
description: Overview of Microsoft services and functionalities that contribute to a complete monitoring strategy for your Azure services and applications.
ms.topic: overview
ms.custom: ignite-2022
author: rboucher
ms.author: robb
ms.date: 01/25/2023
ms.reviewer: robb
---
# Azure Monitor overview

Azure Monitor is a comprehensive monitoring solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. With Azure Monitor, you can maximize the availability and performance of your applications and services. 
Azure Monitor collects and aggregates the data from every layer and component of your system into a common data platform. It correlates data across multiple Azure subscriptions and tenants, in addition to hosting data for other services. Because this data is stored together, it can be correlated and analyzed using a common set of tools. The data can then be used for analysis and visualizations to help you understand how your applications are performing and respond automatically to system events.
Azure Monitor now includes Azure Monitor SCOM Managed Instance which provides you the option to move your on-premises System Center Operation Manager (SCOM) installation to the cloud in Azure. 

## Monitoring and Observability
Observability is the ability to assess an internal system’s state based on the data it produces. An observability solution analyzes output data, provides an assessment of the system’s health, and offers actionable insights for addressing problems across your IT infrastructure.

Observability wouldn’t be possible without monitoring. Monitoring is the collection and analysis of data pulled from IT systems.

The pillars of observability are the different kinds of data that a monitoring tool must collect and analyze to provide sufficient observability of a monitored system. Metrics, logs, and distributed traces are commonly referred to as the pillars of observability. Azure Monitor adds “changes” to these pillars. 

When a system is observable, a user can identify the root cause of a performance problem by looking at the data it produces without additional testing or coding.
Azure Monitor achieves observability by correlating data from multiple pillars and aggregating data across the entire set of monitored resources. Azure Monitor provides a common set of tools to correlate and analyze the data from multiple Azure subscriptions and tenants, in addition to data hosted for other services. 

## Common use cases for Azure Monitor
A few examples of what you can do with Azure Monitor include:

- Detect and diagnose issues in your applications using [Application Insights](app/app-insights-overview.md).
- Troubleshoot by drilling into your monitoring data using [Log Analytics](logs/log-query-overview.md).
- Enable operations at scale using [automated actions](alerts/alerts-action-rules.md).
- Detect and anlayze infrastructure issues with [VM insights](vm/vminsights-overview.md) and [Container insights](containers/container-insights-overview.md).
- Create visualizations with Azure [dashboards](visualize/tutorial-logs-dashboards.md) and [workbooks](visualize/workbooks-overview.md).
- Investigate change data for routine monitoring or for triaging incidents by using [Change Analysis](./change/change-analysis.md).

## High level architecture
The following diagram gives a high-level view of Azure Monitor. 

:::image type="content" source="media/overview/azure-monitor-overview-2022_10_15-add-prometheus-opt.svg" alt-text="Diagram that shows an overview of Azure Monitor." border="false" lightbox="media/overview/azure-monitor-overview-2022_10_15-add-prometheus-opt.svg":::

- **[Data sources](data-sources.md)** are depicted at the left of the diagram. Data is collected and routed to the data platform.
- **[Data platform](data-platform.md)** stores are at the center of the diagram. 
- The different functions and components that consume data are at the right of hte diagram. This includes such actions as analysis, visualizations, insights and responses.
- Services that integrate with Azure Monitor to provide additional functionality are at the bottom of the diagram. These are actually integrated throughout other parts of the diagram, but that is too complex to show visually.

## Data sources
Azure Monitor can collect data from multiple sources, including from your application, operating systems, the services they rely on, and from the platform itself. 

Azure Monitor collects data of the following types:
- **Application**. The performance and functionality of the code you've written, on any platform.
- **Infrastructure:**
    - **Container.** Containers, such as Azure Kubernetes and applications running inside containers.
    - **Operating system.** The guest operating system on which your application is running. 
- **Azure Platform:**
    - **Azure resource**. The operation of an Azure resource.
    - **Azure subscription.** The operation and management of an Azure subscription, and data about the health and operation of Azure itself. 
    - **Azure tenant.** Data about the operation of tenant-level Azure services, such as Azure Active Directory.
    - **Azure resource changes.** Data about changes within your Azure resources and how to address and triage incidents and issues.
- **Custom Sources.** You can use the Azure Monitor REST API to send customer metric or log data to Azure Monitor and incorporate monitoring of resources that don’t expose telemetry through other methods.

You can integrate monitoring data from sources outside Azure, including on-premises and other non-Microsoft clouds, using the application, infrastructure, and custom data sources. 

For detailed information about each of the data sources, see [data sources](./data-sources.md).

## Data collection and routing
Azure Monitor collects and routes monitoring data using several mechanisms, depending on the data being routed and the destination.

You can configure data collection to retrieve data and route it to the data platform stores using these methods:

- Direct data routing
- Diagnostic settings
- Data collection rules
- Application SDK
- the Azure Monitor REST API

For detailed information about data collection, see [data collection](./best-practices-data-collection.md).

## Data platform

Azure Monitor stores data in data stores for each of the pillars of observability: metrics, logs, distributed traces, and changes. Each store is optimized for specific types of data and monitoring scenarios.

### Azure Monitor metrics

Azure Monitor Metrics is a time-series database, optimized for analyzing time-stamped data. It supports native Azure Monitor metrics and [Prometheus based metrics](/articles/azure-monitor/essentials/prometheus-metrics-overview.md). 
Metrics are numerical values that describe an aspect of a system at a particular point in time.  They are collected at regular intervals, and identified with a timestamp, a name, a value, and one or more defining labels. They can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.

![Diagram that shows metrics data flowing into Metrics Explorer to use in visualizations.](media/overview/metrics.png)

### Azure Monitor logs

Azure Monitor Logs stores structured and unstructured log data or all types. You can route and separate data from different sources into different [Log Analytics workspaces](link), (which are described later) for querying. 
Logs are recorded system events that can have a greatly varying size and structure. They can contain different kinds of data and may be structured or free-form text with a timestamp. Azure Monitor Logs can also store metrics data, but in log form.

![Diagram that shows logs data flowing into Log Analytics for analysis.](media/overview/logs.png)

### Traces


### Changes



## Insights and Visualizations

### The Azure portal

### Insights

### Visualizations

### Metrics Explorer

### Log Analytics

## Repond

## Integrate

![Screenshot that shows Application Insights.](media/overview/app-insights.png)

### Container insights

![Screenshot that shows container health.](media/overview/container-insights.png)

### VM insights


![Screenshot that shows VM insights.](media/overview/vm-insights.png)



![Screenshot that shows alerts in Azure Monitor with severity, total alerts, and other information.](media/overview/alerts.png)


![Diagram shows autoscale, with several servers on a line labeled Processor Time > 80% and two servers marked as minimum, three servers as current capacity, and five as maximum.](media/overview/autoscale.png)


![Screenshot that shows an Azure dashboard, which includes Application and Security tiles and other customizable information.](media/overview/dashboard.png)

![Screenshot that shows workbook examples.](media/overview/workbooks.png)


![Screenshot that shows Power BI.](media/overview/power-bi.png)


## Next steps
- [Getting started with Azure Monitor](getting-started.md)
- [Sources of monitoring data for Azure Monitor](data-sources.md)
- [Data collection in Azure Monitor](essentials/data-collection.md)