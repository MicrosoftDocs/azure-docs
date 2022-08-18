---
title: Azure Monitor best practices - Analysis and visualizations
description: Guidance and recommendations for customizing visualizations beyond standard analysis features in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/18/2021
ms.reviewer: bwren

---

# Azure Monitor best practices: Analyze and visualize data

This article is part of the scenario [Recommendations for configuring Azure Monitor](best-practices.md). It describes built-in features in Azure Monitor for analyzing collected data. It also describes options for creating custom visualizations to meet the requirements of different users in your organization. Visualizations like charts and graphs can help you analyze your monitoring data to drill down on issues and identify patterns.

## Built-in analysis features

The following sections describe Azure Monitor features that provide analysis of collected data without any configuration.

### Overview page

Most Azure services have an **Overview** page in the Azure portal that includes a **Monitor** section with charts that show recent critical metrics. This information is intended for owners of individual services to quickly assess the performance of the resource. Because this page is based on platform metrics that are collected automatically, configuration isn't required for this feature.

### Metrics Explorer

You can use Metrics Explorer to interactively work with metric data and create metric alerts. Typically, you need minimal training to use Metrics Explorer, but you must be familiar with the metrics you want to analyze. Configuration isn't required for this feature after data collection is configured. Platform metrics for Azure resources are automatically available. Guest metrics for virtual machines are available after an Azure Monitor agent is deployed to them. Application metrics are available after Application Insights is configured.

### Log Analytics

With Log Analytics, you can create log queries to interactively work with log data and create log query alerts. Some training is required for you to become familiar with the query language, although you can use prebuilt queries for common requirements. You can also add [query packs](logs/query-packs.md) with queries that are unique to your organization. Then if you're familiar with the query language, you can build queries for others in your organization.

## Workbooks

[Workbooks](./visualize/workbooks-overview.md) are the visualization platform of choice for Azure. They provide a flexible canvas for data analysis and the creation of rich visual reports. You can use workbooks to tap into multiple data sources from across Azure and combine them into unified interactive experiences. They're especially useful to prepare end-to-end monitoring views across multiple Azure resources.

Insights use prebuilt workbooks to present you with critical health and performance information for a particular service. You can access a gallery of workbooks on the **Workbooks** tab of the Azure Monitor menu and create custom workbooks to meet the requirements of your different users.

![Diagram that shows screenshots of three pages from a workbook, including Analysis of Page Views, Usage, and Time Spent on Page.](media/visualizations/workbook.png)

Common scenarios for workbooks:

- Create an interactive report with parameters where selecting an element in a table dynamically updates associated charts and visualizations.
- Share a report with other users in your organization.
- Collaborate with other workbook authors in your organization by using a public GitHub-based template gallery.

## Azure dashboards

[Azure dashboards](../azure-portal/azure-portal-dashboards.md) are useful in providing a "single pane of glass" over your Azure infrastructure and services. While a workbook provides richer functionality, a dashboard can combine Azure Monitor data with data from other Azure services.

![Screenshot that shows an example of an Azure dashboard with customizable information.](media/visualizations/dashboard.png)

Here's a video walk-through on how to create dashboards:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4AslH]

Common scenarios for dashboards:

- Create a dashboard that combines a metrics graph and the results of a log query with operational data for related services.
- Share a dashboard with service owners through integration with [Azure role-based access control](../role-based-access-control/overview.md).

For details on how to create a dashboard that includes data from Azure Monitor Logs, see [Create and share dashboards of Log Analytics data](visualize/tutorial-logs-dashboards.md). For details on how to create a dashboard that includes data from Application Insights, see [Create custom key performance indicator (KPI) dashboards using Application Insights](app/tutorial-app-dashboards.md).

## Grafana

[Grafana](https://grafana.com/) is an open platform that excels in operational dashboards. It's useful for:

- Detecting, isolating, and triaging operational incidents.
- Combining visualizations of Azure and non-Azure data sources. These sources include on-premises, third-party tools, and data stores in other clouds.

Grafana has popular plug-ins and dashboard templates for APM tools such as Dynatrace, New Relic, and AppDynamics. You can use these resources to visualize Azure platform data alongside other metrics from higher in the stack collected by other tools. It also has AWS CloudWatch and GCP BigQuery plug-ins for multi-cloud monitoring in a single pane of glass.

All versions of Grafana include the [Azure Monitor datasource plug-in](visualize/grafana-plugin.md) to visualize your Azure Monitor metrics and logs.

[Azure Managed Grafana](../managed-grafana/overview.md) also optimizes this experience for Azure-native data stores such as Azure Monitor and Azure Data Explorer. In this way, you can easily connect to any resource in your subscription and view all resulting telemetry in a familiar Grafana dashboard. It also supports pinning charts from Azure Monitor metrics and logs to Grafana dashboards. Grafana includes out-of-the-box dashboards for Azure resources. [Create your first Azure Managed Grafana workspace](../managed-grafana/quickstart-managed-grafana-portal.md) to get started.

![Screenshot that shows Grafana visualizations.](media/visualizations/grafana.png)

Common scenarios for Grafana:

- Combine time-series and event data in a single visualization panel.
- Create a dynamic dashboard based on user selection of dynamic variables.
- Create a dashboard from a community-created and community-supported template.
- Create a vendor-agnostic business continuity and disaster scenario that runs on any cloud provider or on-premises.

## Power BI

[Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-get-started/) is useful for creating business-centric dashboards and reports, along with reports that analyze long-term KPI trends. You can [import the results of a log query](./logs/log-powerbi.md) into a Power BI dataset. Then you can take advantage of its features, such as combining data from different sources and sharing reports on the web and mobile devices.

![Screenshot that shows an example Power B I report for I T operations.](media/visualizations/power-bi.png)

Common scenarios for Power BI:

- Create rich visualizations.
- Benefit from extensive interactivity, including zoom-in and cross-filtering.
- Share easily throughout your organization.
- Integrate data from multiple data sources.
- Experience better performance with results cached in a cube.

## Azure Monitor partners

Some Azure Monitor partners provide visualization functionality. For a list of partners that Microsoft has evaluated, see [Azure Monitor partner integrations](./partners.md). An Azure Monitor partner might provide out-of-the-box visualizations to save you time, although these solutions might have an extra cost.

## Custom application

You can build your own custom websites and applications by using metric and log data in Azure Monitor accessed through a REST API. This approach gives you complete flexibility in UI, visualization, interactivity, and features.

## Next steps

To define alerts and automated actions from Azure Monitor data, see [Alerts and automated actions](best-practices-alerts.md).
