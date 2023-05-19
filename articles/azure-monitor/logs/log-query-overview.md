---
title: Log queries in Azure Monitor
description: This reference information for Kusto Query Language used by Azure Monitor includes elements specific to Azure Monitor and elements not supported in Azure Monitor log queries.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: roygal
ms.date: 02/28/2023

---

# Log queries in Azure Monitor
Azure Monitor Logs is based on Azure Data Explorer, and log queries are written by using the same Kusto Query Language (KQL). This rich language is designed to be easy to read and author, so you should be able to start writing queries with some basic guidance.

Areas in Azure Monitor where you'll use queries include:

- [Log Analytics](../logs/log-analytics-overview.md): Use this primary tool in the Azure portal to edit log queries and interactively analyze their results. Even if you intend to use a log query elsewhere in Azure Monitor, you'll typically write and test it in Log Analytics before you copy it to its final location.
- [Log alert rules](../alerts/alerts-overview.md): Proactively identify issues from data in your workspace. Each alert rule is based on a log query that's automatically run at regular intervals. The results are inspected to determine if an alert should be created.
- [Workbooks](../visualize/workbooks-overview.md): Include the results of log queries by using different visualizations in interactive visual reports in the Azure portal.
- [Azure dashboards](../visualize/tutorial-logs-dashboards.md): Pin the results of any query into an Azure dashboard, which allows you to visualize log and metric data together and optionally share with other Azure users.
- [Azure Logic Apps](../../connectors/connectors-azure-monitor-logs.md): Use the results of a log query in an automated workflow by using a logic app workflow.
- [PowerShell](/powershell/module/az.operationalinsights/invoke-azoperationalinsightsquery): Use the results of a log query in a PowerShell script from a command line or an Azure Automation runbook that uses `Invoke-AzOperationalInsightsQuery`.
- [Azure Monitor Logs API](/rest/api/loganalytics/): Retrieve log data from the workspace from any REST API client. The API request includes a query that's run against Azure Monitor to determine the data to retrieve.
- **Azure Monitor Query client libraries**: Retrieve log data from the workspace via an idiomatic client library for the following ecosystems:
  - [.NET](/dotnet/api/overview/azure/Monitor.Query-readme)
  - [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/monitor/azquery)
  - [Java](/java/api/overview/azure/monitor-query-readme)
  - [JavaScript](/javascript/api/overview/azure/monitor-query-readme)
  - [Python](/python/api/overview/azure/monitor-query-readme)

## Get started
The best way to get started learning to write log queries by using KQL is to use available tutorials and samples:

- [Log Analytics tutorial](./log-analytics-tutorial.md): Tutorial on using the features of Log Analytics, which is the tool that you'll use in the Azure portal to edit and run queries. It also allows you to write simple queries without directly working with the query language. If you haven't used Log Analytics before, start here so that you understand the tool you'll use with the other tutorials and samples.
- [KQL tutorial](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor): Guided walk through basic KQL concepts and common operators. This is the best place to start to come up to speed with the language itself and the structure of log queries.
- [Example queries](../logs/queries.md): Description of the example queries available in Log Analytics. You can use the queries without modification or use them as samples to learn KQL.
- [Query samples](/azure/data-explorer/kusto/query/samples?pivots=azuremonitor): Sample queries that illustrate different concepts.

## Reference documentation
[Documentation for KQL](/azure/data-explorer/kusto/query/), including the reference for all commands and operators, is available in the Azure Data Explorer documentation. Even as you get proficient at using KQL, you'll still regularly use the reference to investigate new commands and scenarios that you haven't used before.

## Language differences
Although Azure Monitor uses the same KQL as Azure Data Explorer, there are some differences. The KQL documentation will specify those operators that aren't supported by Azure Monitor or that have different functionality. Operators specific to Azure Monitor are documented in the Azure Monitor content. The following sections list the differences between versions of the language for quick reference.

### Statements not supported in Azure Monitor

* [Alias](/azure/kusto/query/aliasstatement)
* [Query parameters](/azure/kusto/query/queryparametersstatement)

### Functions not supported in Azure Monitor

* [cluster()](/azure/kusto/query/clusterfunction)
* [cursor_after()](/azure/kusto/query/cursorafterfunction)
* [cursor_before_or_at()](/azure/kusto/query/cursorbeforeoratfunction)
* [cursor_current(), current_cursor()](/azure/kusto/query/cursorcurrent)
* [database()](/azure/kusto/query/databasefunction)
* [current_principal()](/azure/kusto/query/current-principalfunction)
* [extent_id()](/azure/kusto/query/extentidfunction)
* [extent_tags()](/azure/kusto/query/extenttagsfunction)

### Operator not supported in Azure Monitor

[Cross-Cluster Join](/azure/kusto/query/joincrosscluster)

### Plug-ins not supported in Azure Monitor

* [Python plugin](/azure/kusto/query/pythonplugin)
* [sql_request plugin](/azure/kusto/query/sqlrequestplugin)

### Other operators in Azure Monitor
The following operators support specific Azure Monitor features and aren't available outside of Azure Monitor:

* [app()](../logs/app-expression.md)
* [resource()](./resource-expression.md)
* [workspace()](../logs/workspace-expression.md)

## Next steps
- Walk through a [tutorial on writing queries](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor).
- Access the complete [reference documentation for KQL](/azure/kusto/query/).
