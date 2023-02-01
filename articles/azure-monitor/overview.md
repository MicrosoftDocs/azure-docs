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

Azure Monitor also includes Azure Monitor SCOM Managed Instance, which allows you to move your on-premises System Center Operation Manager (SCOM) installation to the cloud in Azure. 

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
- Detect and analyze infrastructure issues with [VM insights](vm/vminsights-overview.md) and [Container insights](containers/container-insights-overview.md).
- Create visualizations with Azure [dashboards](visualize/tutorial-logs-dashboards.md) and [workbooks](visualize/workbooks-overview.md).
- Investigate change data for routine monitoring or for triaging incidents by using [Change Analysis](./change/change-analysis.md).

## High level architecture

The following diagram gives a high-level view of Azure Monitor. 

:::image type="content" source="media/overview/overview-02-2023.png" alt-text="Diagram that shows an overview of Azure Monitor." border="false" lightbox="media/overview/overview-02-2023.png":::

- **[Data sources](data-sources.md)** are depicted at the left of the diagram. Data is collected and routed to the data platform.
- **[Data platform](data-platform.md)** stores are at the center of the diagram. 
- The different functions and components that consume data are at the right of the diagram. This includes such actions as analysis, visualizations, insights and responses.
- Services that integrates with Azure Monitor to provide additional functionality are at the bottom of the diagram. These are integrated throughout other parts of the diagram, but that is too complex to show visually.

## Data sources
Azure Monitor can collect data from multiple sources, including from your application, operating systems, the services they rely on, and from the platform itself. 

Azure Monitor collects these types of data:
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
- Azure Monitor REST API
- Azure Monitor Agents

For detailed information about data collection, see [data collection](./best-practices-data-collection.md).

## Data platform

Azure Monitor stores data in data stores for each of the pillars of observability: metrics, logs, distributed traces, and changes. Each store is optimized for specific types of data and monitoring scenarios.


|Data Store or<br>Pillar of Observability|Description  |
|---------|---------|
|Azure Monitor Metrics|Metrics are numerical values that describe an aspect of a system at a particular point in time. [Azure Monitor Metrics](./essentials/data-platform-metrics.md) is a time-series database, optimized for analyzing time-stamped data. Azure Monitor collects metrics at regular intervals. Metrics are identified with a timestamp, a name, a value, and one or more defining labels. They can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time. It supports native Azure Monitor metrics and [Prometheus based metrics](/articles/azure-monitor/essentials/prometheus-metrics-overview.md).|
|Azure Monitor Logs     |Logs are recorded system events. Logs can contain different types of data, be structured or free-form text, and they contain a timestamp. Azure Monitor stores structured and unstructured log data of all types in [Azure Monitor Logs](./logs/data-platform-logs.md). You can route data to [Log Analytics workspaces](./logs/log-analytics-overview.md) for querying and analysis.|
|Traces   |Distributed traces identify the series of related events that follow a user request through a distributed system. A trace measures the operation and performance of your application across the entire set of components in your system. Traces can be used to determine the behavior of application code and the performance of different transactions. Azure Monitor gets distributed trace data from the Application Insights SDK. The trace data is stored in a separate workspace in Azure Monitor Logs.|
|Changes|Changes are a series of events in your application and resources. They're  tracked and stored when you use the [Change Analysis](./change/change-analysis.md) service, which uses [Azure Resource Graph](../governance/resource-graph/overview.md) as its store. Change Analysis helps you understand which changes, such as deploying updated code, may have caused issues in your systems.|

## The Azure portal

The Azure portal is a web-based, unified console that provides an alternative to command-line tools. With the Azure portal, you can manage your Azure subscription using a graphical user interface. You can build, manage, and monitor everything from simple web apps to complex cloud deployments in the portal. 
The Monitor section of the Azure portal provides a visual interface that gives you access to the data collected for Azure resources and an easy way to access the tools, insights, and visualizations in Azure Monitor.

:::image type="content" source="media/overview/azure-portal.png" alt-text="Screenshot that shows the Monitor section of the Azure portal.":::

### Metrics Explorer

### Log Analytics

## Insights and Visualizations
Insights and visualizations help increase your visibility into the operation of your computing environment. Some Azure resource providers have curated visualizations that provide a customized monitoring experience and require minimal configuration.

### Insights

Insights are large, scalable, curated visualizations. For more information, see List of insights and curated visualizations using Azure Monitor.
The following table describes the three most robust insights:

|Insight  |Description  |
|---------|---------|
|Application Insights|Application Insights takes advantage of the powerful data analysis platform in Azure Monitor to provide you with deep insights into your application's operations. Application Insights monitors the availability, performance, and usage of your web applications whether they're hosted in the cloud or on-premises. You can use it to diagnose errors without waiting for a user to report them. Application Insights includes connection points to various development tools and integrates with Visual Studio to support your DevOps processes.|
|Container Insights|Container insights gives you performance visibility into container workloads that are deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service. Container Insights collects container logs and metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. After you enable monitoring from Kubernetes clusters, these metrics and logs are automatically collected for you through a containerized version of the Log Analytics agent for Linux.|
|VM Insights|VM insights monitors your Azure VMs. It analyzes the performance and health of your Windows and Linux VMs and identifies their different processes and interconnected dependencies on external processes. The solution includes support for monitoring performance and application dependencies for VMs hosted on-premises or another cloud provider.|

### Visualizations

Visualizations such as charts and tables are effective tools for summarizing monitoring data and presenting it to different audiences. Azure Monitor has its own features for visualizing monitoring data and uses other Azure services for publishing it to different audiences.

|Visualization  |Description  |
|---------|---------|
|Dashboards|Azure dashboards allow you to combine different kinds of data into a single pane in the Azure portal. You can optionally share the dashboard with other Azure users. You can add the output of any log query or metrics chart to an Azure dashboard. For example, you could create a dashboard that combines tiles that show a graph of metrics, a table of activity logs, a usage chart from Application Insights, and the output of a log query.|
|Workbooks|Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports in the Azure portal. You can use them to query data from multiple data sources. Workbooks can combine and correlate data from multiple data sets in one visualization giving you easy visual representation of your system. Workbooks are interactive and can be shared across teams with data updating in real time. Use workbooks provided with Insights, utilize the library of templates, or create your own.|
|Power BI|Power BI is a business analytics service that provides interactive visualizations across various data sources. It's an effective means of making data available to others within and outside your organization. You can configure Power BI to automatically import log data from Azure Monitor to take advantage of these visualizations.|
|Grafana|Grafana is an open platform that excels in operational dashboards. Grafana has popular plug-ins and dashboard templates for APM tools such as Dynatrace, New Relic, and AppDynamics. You can use these resources to visualize Azure platform data alongside other metrics from higher in the stack collected by other tools. It also has AWS CloudWatch and GCP BigQuery plug-ins for multicloud monitoring in a single pane of glass. All versions of Grafana include the Azure Monitor data source plug-in to visualize your Azure Monitor metrics and logs. Azure Managed Grafana also optimizes this experience for Azure-native data stores such as Azure Monitor and Azure Data Explorer. In this way, you can easily connect to any resource in your subscription and view all resulting telemetry in a familiar Grafana dashboard. It also supports pinning charts from Azure Monitor metrics and logs to Grafana dashboards.|


## Respond

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