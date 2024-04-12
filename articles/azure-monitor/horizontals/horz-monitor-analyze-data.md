---
author: rboucher
ms.author: robb
ms.service: azure-monitor
ms.topic: include
ms.date: 02/27/2024
---

## Analyze monitoring data

There are many tools for analyzing monitoring data.

### Azure Monitor tools

Azure Monitor supports the following basic tools:

- [Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started), a tool in the Azure portal that allows you to view and analyze metrics for Azure resources. For more information, see [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started).

- [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace), a tool in the Azure portal that allows you to query and analyze log data by using the [Kusto query language (KQL)](/azure/data-explorer/kusto/query). For more information, see [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).

- The [activity log](/azure/azure-monitor/essentials/activity-log), which has a user interface in the Azure portal for viewing and basic searches. To do more in-depth analysis, you have to route the data to Azure Monitor logs and run more complex queries in Log Analytics.

Tools that allow more complex visualization include:

- [Dashboards](/azure/azure-monitor/visualize/tutorial-logs-dashboards) that let you combine different kinds of data into a single pane in the Azure portal.
- [Workbooks](/azure/azure-monitor/visualize/workbooks-overview), customizable reports that you can create in the Azure portal. Workbooks can include text, metrics, and log queries.
- [Grafana](/azure/azure-monitor/visualize/grafana-plugin), an open platform tool that excels in operational dashboards. You can use Grafana to create dashboards that include data from multiple sources other than Azure Monitor.
- [Power BI](/azure/azure-monitor/logs/log-powerbi), a business analytics service that provides interactive visualizations across various data sources. You can configure Power BI to automatically import log data from Azure Monitor to take advantage of these visualizations.

