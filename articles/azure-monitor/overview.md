---
title: Azure Monitor overview
description: Overview of Microsoft services and functionalities that contribute to a complete monitoring strategy for your Azure services and applications.
ms.topic: overview
ms.custom: ignite-2022
author: rboucher
ms.author: robb
ms.date: 02/08/2023
ms.reviewer: robb
---
# Azure Monitor overview

Azure Monitor is a comprehensive monitoring solution for collecting, analyzing, and responding to telemetry from your cloud and on-premises environments. You can use Azure Monitor to maximize the availability and performance of your applications and services.

Azure Monitor collects and aggregates the data from every layer and component of your system into a common data platform. It correlates data across multiple Azure subscriptions and tenants, in addition to hosting data for other services. Because this data is stored together, it can be correlated and analyzed using a common set of tools. The data can then be used for analysis and visualizations to help you understand how your applications are performing and respond automatically to system events.

Azure Monitor also includes Azure Monitor SCOM Managed Instance, which allows you to move your on-premises System Center Operation Manager (Operations Manager) installation to the cloud in Azure.

Use Azure Monitor to monitor these types of resources in Azure, other clouds, or on-premises: 
  - Applications 
  - Virtual machines
  - Guest operating systems 
  - Containers
  - Databases
  - Security events in combination with Azure Sentinel
  - Networking events and health in combination with Network Watcher
  - Custom sources that use the APIs to get data into Azure Monitor
	
You can also export monitoring data from Azure Monitor into other systems so you can:
  - Integrate with other third-party and open-source monitoring and visualization tools
  - Integrate with ticketing and other ITSM systems

## Monitoring and observability

Observability is the ability to assess an internal system’s state based on the data it produces. An observability solution analyzes output data, provides an assessment of the system’s health, and offers actionable insights for addressing problems across your IT infrastructure.

Observability wouldn’t be possible without monitoring. Monitoring is the collection and analysis of data pulled from IT systems.

The pillars of observability are the different kinds of data that a monitoring tool must collect and analyze to provide sufficient observability of a monitored system. Metrics, logs, and distributed traces are commonly referred to as the pillars of observability. Azure Monitor adds “changes” to these pillars. 

When a system is observable, a user can identify the root cause of a performance problem by looking at the data it produces without additional testing or coding.
Azure Monitor achieves observability by correlating data from multiple pillars and aggregating data across the entire set of monitored resources. Azure Monitor provides a common set of tools to correlate and analyze the data from multiple Azure subscriptions and tenants, in addition to data hosted for other services. 

## High level architecture

The following diagram gives a high-level view of Azure Monitor. 

:::image type="content" source="media/overview/overview-02-2023.png" alt-text="Diagram that shows an overview of Azure Monitor." border="false" lightbox="media/overview/overview-02-2023.png":::

The diagram depicts the Azure Monitor system components:
- The **[data sources](data-sources.md)** are the types of data collected from each monitored resource. The data is collected and routed to the **data platform**.
- The **[data platform](data-platform.md)** is made up of the data stores for collected data. Azure Monitor's data platform has stores for metrics, logs, traces, and changes.
- The functions and components that consume data include analysis, visualizations, insights, and responses.
- Services that integrate with Azure Monitor to provide additional functionality  and are integrated throughout the system.

## Data sources
Azure Monitor can collect data from multiple sources, including from your application, operating systems, the services they rely on, and from the platform itself.

You can integrate monitoring data from sources outside Azure, including on-premises and other non-Microsoft clouds, using the application, infrastructure, and custom data sources.

Azure Monitor collects these types of data:

|Data Type  |Description  |
|---------|---------|
|Application|Data about the performance and functionality of your application code on any platform.|
|Infrastructure|**- Container.** Data about containers, such as Azure Kubernetes, and about the applications running inside containers.<br>**- Operating system.** Data about the guest operating system on which your application is running.|
|Azure Platform|**- Azure resource**. The operation of an Azure resource.<br>**- Azure subscription.** The operation and management of an Azure subscription, and data about the health and operation of Azure itself.<br>**- Azure tenant.** Data about the operation of tenant-level Azure services, such as Azure Active Directory.<br>**- Azure resource changes.** Data about changes within your Azure resources and how to address and triage incidents and issues.         |
|Custom Sources|Use the Azure Monitor REST API to send customer metric or log data to Azure Monitor and incorporate monitoring of resources that don’t expose monitoring data through other methods.|

For detailed information about each of the data sources, see [data sources](./data-sources.md).

## Data collection and routing

Azure Monitor collects and routes monitoring data using several mechanisms, depending on the data being routed and the destination data platform stores.

|Collection method|Description  |
|---------|---------|
|Direct data routing|Platform metrics are sent automatically to Azure Monitor Metrics by default and without configuration.|
|[Diagnostic settings](essentials/diagnostic-settings.md)|Use diagnostic settings to determine where to send resource and activity log data on the data platform.|
|[Data collection rules](essentials/data-collection-rule-overview.md)|Use data collection rules to specify what data should be collected, how to transform that data, and where to send that data.|
|[Application SDK](app/app-insights-overview.md)|Add the Application Insights SDK to your application code to receive, store, and explore your monitoring data. The SDK pre-processes telemetry and metrics before sending the data to Azure where it's ingested and processed further before being stored in Azure Monitor Logs.|
|[Azure Monitor REST API](logs/logs-ingestion-api-overview.md)|The Logs Ingestion API in Azure Monitor lets you send data to a Log Analytics workspace from any REST API client.|
|[Azure Monitor Agents](agents/agents-overview.md)|Azure Monitor Agent (AMA) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor for use by features, insights, and other services, such as Microsoft Sentinel and Microsoft Defender for Cloud.|

For detailed information about data collection, see [data collection](./best-practices-data-collection.md).

## Data platform

Azure Monitor stores data in data stores for each of the pillars of observability: metrics, logs, distributed traces, and changes. Each store is optimized for specific types of data and monitoring scenarios.


|Pillar of Observability/<br>Data Store|Description|
|---------|---------|
|[Azure Monitor Metrics](essentials/data-platform-metrics.md)|Metrics are numerical values that describe an aspect of a system at a particular point in time. [Azure Monitor Metrics](./essentials/data-platform-metrics.md) is a time-series database, optimized for analyzing time-stamped data. Azure Monitor collects metrics at regular intervals. Metrics are identified with a timestamp, a name, a value, and one or more defining labels. They can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time. It supports native Azure Monitor metrics and [Prometheus based metrics](essentials/prometheus-metrics-overview.md).|
|[Azure Monitor Logs](logs/data-platform-logs.md)|Logs are recorded system events. Logs can contain different types of data, be structured or free-form text, and they contain a timestamp. Azure Monitor stores structured and unstructured log data of all types in [Azure Monitor Logs](./logs/data-platform-logs.md). You can route data to [Log Analytics workspaces](./logs/log-analytics-overview.md) for querying and analysis.|
|Traces|Distributed traces identify the series of related events that follow a user request through a distributed system. A trace measures the operation and performance of your application across the entire set of components in your system. Traces can be used to determine the behavior of application code and the performance of different transactions. Azure Monitor gets distributed trace data from the Application Insights SDK. The trace data is stored in a separate workspace in Azure Monitor Logs.|
|Changes|Changes are a series of events in your application and resources. They're  tracked and stored when you use the [Change Analysis](./change/change-analysis.md) service, which uses [Azure Resource Graph](../governance/resource-graph/overview.md) as its store. Change Analysis helps you understand which changes, such as deploying updated code, may have caused issues in your systems.|

## The Azure portal

The Azure portal is a web-based, unified console that provides an alternative to command-line tools. With the Azure portal, you can manage your Azure subscription using a graphical user interface. You can build, manage, and monitor everything from simple web apps to complex cloud deployments in the portal. 
The Monitor section of the Azure portal provides a visual interface that gives you access to the data collected for Azure resources and an easy way to access the tools, insights, and visualizations in Azure Monitor.

:::image type="content" source="media/overview/azure-portal.png" alt-text="Screenshot that shows the Monitor section of the Azure portal.":::

## Insights and Visualizations

Insights and visualizations help increase your visibility into the operation of your computing environment. Some Azure resource providers have curated visualizations that provide a customized monitoring experience and require minimal configuration.

### Insights

Insights are large, scalable, curated visualizations. For more information, see List of insights and curated visualizations using Azure Monitor.
The following table describes the three major insights:

|Insight  |Description  |
|---------|---------|
|[Application Insights](app/app-insights-overview.md)|Application Insights takes advantage of the powerful data analysis platform in Azure Monitor to provide you with deep insights into your application's operations. Application Insights monitors the availability, performance, and usage of your web applications whether they're hosted in the cloud or on-premises. You can use it to diagnose errors without waiting for a user to report them. Application Insights includes connection points to various development tools and integrates with Visual Studio to support your DevOps processes.|
|[Container Insights](containers/container-insights-overview.md)|Container Insights gives you performance visibility into container workloads that are deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service. Container Insights collects container logs and metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. After you enable monitoring from Kubernetes clusters, these metrics and logs are automatically collected for you through a containerized version of the Log Analytics agent for Linux.|
|[VM Insights](vm/vminsights-overview.md)|VM Insights monitors your Azure VMs. It analyzes the performance and health of your Windows and Linux VMs and identifies their different processes and interconnected dependencies on external processes. The solution includes support for monitoring performance and application dependencies for VMs hosted on-premises or another cloud provider.|

### Visualize

Visualizations such as charts and tables are effective tools for summarizing monitoring data and presenting it to different audiences. Azure Monitor has its own features for visualizing monitoring data and uses other Azure services for publishing it to different audiences.

|Visualization|Description  |
|---------|---------|
|[Dashboards](visualize/tutorial-logs-dashboards.md)|Azure dashboards allow you to combine different kinds of data into a single pane in the Azure portal. You can optionally share the dashboard with other Azure users. You can add the output of any log query or metrics chart to an Azure dashboard. For example, you could create a dashboard that combines tiles that show a graph of metrics, a table of activity logs, a usage chart from Application Insights, and the output of a log query.|
|[Workbooks](visualize/workbooks-overview.md)|Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports in the Azure portal. You can use them to query data from multiple data sources. Workbooks can combine and correlate data from multiple data sets in one visualization giving you easy visual representation of your system. Workbooks are interactive and can be shared across teams with data updating in real time. Use workbooks provided with Insights, utilize the library of templates, or create your own.|
|[Power BI](logs/log-powerbi.md)|Power BI is a business analytics service that provides interactive visualizations across various data sources. It's an effective means of making data available to others within and outside your organization. You can configure Power BI to automatically import log data from Azure Monitor to take advantage of these visualizations.|
|[Grafana](visualize/grafana-plugin.md)|Grafana is an open platform that excels in operational dashboards. Grafana has popular plug-ins and dashboard templates for APM tools such as Dynatrace, New Relic, and AppDynamics. You can use these resources to visualize Azure platform data alongside other metrics from higher in the stack collected by other tools. It also has AWS CloudWatch and GCP BigQuery plug-ins for multicloud monitoring in a single pane of glass. All versions of Grafana include the Azure Monitor data source plug-in to visualize your Azure Monitor metrics and logs. Azure Managed Grafana also optimizes this experience for Azure-native data stores such as Azure Monitor and Azure Data Explorer. In this way, you can easily connect to any resource in your subscription and view all resulting monitoring data in a familiar Grafana dashboard. It also supports pinning charts from Azure Monitor metrics and logs to Grafana dashboards.|

## Analyze
The Azure portal contains built in tools that allow you to analyze monitoring data.

|Tool  |Description  |
|---------|---------|
|[Metrics explorer](essentials/metrics-getting-started.md)|Use the Azure Monitor metrics explorer user interface in the Azure portal to investigate the health and utilization of your resources. Metrics explorer helps you plot charts, visually correlate trends, and investigate spikes and dips in metric values. Metrics explorer contains features for applying dimensions and filtering, and for customizing charts. These features help you analyze exactly the data you need in a visually intuitive way.|
|[Log Analytics](logs/log-analytics-overview.md)|The Log Analytics user interface in the Azure portal helps you query the log data collected by Azure Monitor so that you can quickly retrieve, consolidate, and analyze collected data. After creating test queries, you can then directly analyze the data with Azure Monitor tools, or you can save the queries for use with visualizations or alert rules. Log Analytics workspaces are based on Azure Data Explorer, using a powerful analysis engine and the rich Kusto query language (KQL).Azure Monitor Logs uses a version of the Kusto Query Language suitable for simple log queries, and advanced functionality such as aggregations, joins, and smart analytics. You can [get started with KQL](logs/get-started-queries.md) quickly and easily.|
|[Change Analysis](change/change-analysis.md)| The Change Analysis user interface in the Azure portal gives you insight into the cause of live site issues, outages, or component failures. Change Analysis uses the power of [Azure Resource Graph](../governance/resource-graph/overview.md) to detect various types of changes, from the infrastructure layer through application deployment. Change Analysis is a subscription-level Azure resource provider that checks resource changes in the subscription and provides data for diagnostic tools to help users understand what changes might have caused issues.|


## Respond

An effective monitoring solution proactively responds to critical events, without the need for an individual or team to notice the issue. The response could be a text or email to an administrator, or an automated process that attempts to correct an error condition.

- **[Alerts](alerts/alerts-overview.md)** notify you of critical conditions and can take corrective action. Alert rules can be based on metric or log data. Metric alert rules provide near-real-time alerts based on collected metrics. Log alerts rules based on logs allow for complex logic across data from multiple sources. 
Alert rules use action groups, which can perform actions like sending email or SMS notifications. Action groups can send notifications using webhooks to trigger external processes or to integrate with your IT service management tools. Action groups, actions, and sets of recipients can be shared across multiple rules.
- **[Autoscale](autoscale/autoscale-overview.md)** allows you to dynamically control the number of resources running to handle the load on your application. You can create rules that use Azure Monitor metrics to determine when to automatically add resources when the load increases or remove resources that are sitting idle. You can specify a minimum and maximum number of instances, and the logic for when to increase or decrease resources to save money and to increase performance.

## Integrate

You may need to integrate Azure Monitor with other systems or to build custom solutions that use your monitoring data. These Azure services work with Azure Monitor to provide integration capabilities.


|Azure service  |Description  |
|---------|---------|
|[Event Hubs](../event-hubs/event-hubs-about.md)|Azure Event Hubs is a streaming platform and event ingestion service. It can transform and store data by using any real-time analytics provider or batching/storage adapters. Use Event Hubs to stream Azure Monitor data to partner SIEM and monitoring tools.|
|[Logic Apps](../logic-apps/logic-apps-overview.md)|Azure Logic Apps is a service you can use to automate tasks and business processes by using workflows that integrate with different systems and services. Activities are available that read and write metrics and logs in Azure Monitor.|
|[API](/rest/api/monitor/)|Multiple APIs are available to read and write metrics and logs to and from Azure Monitor in addition to accessing generated alerts. You can also configure and retrieve alerts. With APIs, you have unlimited possibilities to build custom solutions that integrate with Azure Monitor.|

## Next steps
- [Getting started with Azure Monitor](getting-started.md)
- [Sources of monitoring data for Azure Monitor](data-sources.md)
- [Data collection in Azure Monitor](essentials/data-collection.md)
