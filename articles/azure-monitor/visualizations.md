---
title: Visualizing data from Azure Monitor | Microsoft Docs
description: Provides a summary of the available methods to visualize data stored in Azure Monitor including data from the metrics store and Log Analytics.
author: bwren
manager: carmonm
editor: ''
services: azure-monitor
documentationcenter: azure-monitor

ms.service: azure-monitor
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/15/2018
ms.author: bwren

---

# Visualizing data from Azure Monitor
This article provides a summary of the available methods to visualize data stored in Azure Monitor. This includes [metrics in the Azure metrics store](../monitoring/monitoring-data-collection.md#metrics) and [log data in Log Analytics](../monitoring/monitoring-data-collection.md#logs). 

Visualizations such as charts and graphs can help you analyze your monitoring data to drill-down on issues and identify patterns. Depending on the tool you use, you may also have the option to share visualizations with other users inside and outside of your organization.

## Azure Dashboards
[Azure dashboards](../azure-portal/azure-portal-dashboards.md) are the primary dashboarding technology for Azure. They're particularly useful in providing single pane of glass over your Azure infrastructure and services allowing you to quickly identify important issues.

![Dashboard](media/visualizations/dashboard.png)

### Advantages
- Deep integration into Azure. Visualizations can be pinned to dashboards from multiple Azure pages including Metrics explorer, Log Analytics, and Application Insights.
- Supports both metrics and logs.
- Combine data from multiple sources including output from [Metrics explorer](../monitoring-and-diagnostics/monitoring-metric-charts.md), [Log Analytics queries](../log-analytics/log-analytics-queries.md), and [maps](../application-insights/app-insights-app-map.md) and [availability]() in Application Insights.
- Option for personal or shared dashboards. Integrated with Azure [role based authentication (RBAC)](../role-based-access-control/overview.md).
- Automatic refresh. Metrics refresh depends on time range with minimum of five minutes. Logs refresh at one minute.
- Parametrized metrics dashboards with timestamp and custom parameters.
- Flexible layout options.
- Full screen mode.


### Limitations
- Limited control over Log Analytics visualizations with no support for data tables. Total number of data series is limited to 10 with further data series grouped under an _other_ bucket.
- No custom parameters support for Log Analytics charts.
- Log Analytics charts are limited to last 30 days.
- Log Analytics charts can only be pinned to shared dashboards.
- No interactivity with dashboard data.
- Limited contextual drill-down.

## Azure Monitor Views
[Views in Azure Monitor](../log-analytics/log-analytics-view-designer.md)  allow you to create custom visualizations with log data stored in Log Analytics. They are used by [monitoring solutions](../monitoring/monitoring-solutions.md) to present the data they collect.

![View](media/visualizations/view.png)

### Advantages
- Rich visualizations for Log Analytics data.
- Export and import views to transfer them to other resource groups and subscriptions.
- Integrates into Log Analytic management model with workspaces and monitoring solutions.
- [Filters](../log-analytics/log-analytics-view-designer-filters.md) for custom parameters.
- Interactive, supports multi-level drill-in (view that drills into another view)

### Limitations
- Supports logs but not metrics.
- No personal views. Available to all users with access to the workspace.
- No automatic refresh.
- Limited layout options.
- No support for querying across Log Analytics workspaces and Application Insights applications.
- Queries are limited in response size to 8MB and query execution time of 110 seconds.



## Application Insights Workbooks
[Workbooks](../application-insights/app-insights-usage-workbooks.md) are interactive documents that provide deep insights into your data, investigation, and collaboration inside the team. Specific examples where workbooks are useful are troubleshooting guides and incident postmortem.

![Workbook](media/visualizations/workbook.png)

### Advantages
- Supports both metrics and logs.
- Supports parameters  enabling interactive reports where selecting an element in a table will dynamically update associated charts and visualizations.
- Document-like flow.
- Option for personal or shared workbooks.
- Easy, collaborative-friendly authoring experience.
- Templates support public GitHub-based template gallery.

### Limitations
- No automatic refresh.
- No dense layout like dashboards, which make workbooks less useful as a single pane of glass. Intended more for providing deeper insights.


## Power BI
[Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-get-started/) is particularly useful for creating business-centric dashboards and reports, as well as reports analyzing long-term KPI trends. You can [import the results of a Log Analytics query](../log-analytics/log-analytics-powerbi.md) into a Power BI dataset so you can take advantage of its features such as combining data from different sources and sharing reports on the web and mobile devices.

![Power BI](media/visualizations/power-bi.png)

### Advantages
- Rich visualizations.
- Extensive interactivity including zoom-in and cross-filtering.
- Easy to share throughout your organization.
- Integration with other data from multiple data sources.
- Better performance with results cached in a cube.


### Limitations
- Supports logs but not metrics.
- No Azure integration. Can't manage dashboards and models through Azure Resource Manager.
- Query results need to be imported into Power BI model to configure. Limitation on result size and refresh.
- Limited data refresh of eight times per day.


## Grafana
[Grafana](https://grafana.com/) is an open platform that excels in operational dashboards. It's particularly useful for detecting and isolating and triaging operational incidents. You can add [Grafana Azure Monitor data source plugin](../monitoring-and-diagnostics/monitor-send-to-grafana.md) to your Azure subscription to have it visualize your Azure metrics data.

![Grafana](media/visualizations/grafana.png)

### Advantages
- Rich visualizations.
- Rich ecosystem of datasources.
- Data interactivity including zoom in.
- Supports parameters.

### Limitations
- Supports metrics but not logs.
- No Azure integration. Can't manage dashboards and models through Azure Resource Manager.
- Cost to support additional Grafana infrastructure or additional cost for Grafana Cloud.


## Build your own custom application
You can access data in Azure metrics and Log Analytics through their API using any REST client, which allows you to build your own custom websites and applications.

### Advantages
- Complete flexibility in UI, visualization, interactivity, and features.
- Combine metrics and log data with other data sources.

### Disadvantages
- Significant engineering effort required.


## Next steps
- Learn about the [data collected by Azure Monitor](../monitoring/monitoring-data-collection.md).
- Learn about [Azure dashboards](../azure-portal/azure-portal-dashboards.md).
- Learn about [Views in Azure Monitor](../log-analytics/log-analytics-view-designer.md).
- Learn about [Workbooks in Application Insights](../application-insights/app-insights-usage-workbooks.md).
- Learn about [import log data into Power BI](../log-analytics/log-analytics-powerbi.md).
- Learn about the [Grafana Azure Monitor data source plugin](../monitoring-and-diagnostics/monitor-send-to-grafana.md).
