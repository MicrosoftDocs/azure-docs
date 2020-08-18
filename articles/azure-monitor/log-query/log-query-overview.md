---
title: Overview of Log Analytics in Azure Monitor
description: Answers common questions related to log queries and gets you started in using them.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/19/2019

---

# Overview of Log Analytics in Azure Monitor
[Azure Monitor Logs](../platform/data-platform-logs.md) stores monitoring data from all of your resources monitored by Azure Monitor. Log Analytics is the primary tool in Azure Monitor to create and run log queries to retrieve this data. You can use interactive tools in Log Analytics to analyze the results of log queries interactively or use the query to visualize results in a workbook or to create a log alert rule.


## Relationship to Azure Data Explorer
If you're already familiar with Azure Data Explorer, then Log Analytics should look familiar. That's because it's built on top of Azure Data Explorer and uses the same Kusto Query Language (KQL). There are some difference in the Azure Monitor flavor of the language that are noted in the [KQL reference](/azure/data-explorer/kusto/query/).


## Meet Log Analytics
The following image identifies the different components of Log Analytics.


### 1. Top action bar
The top action bar provides controls for working with the query in the query window and 

**Scope:** Specifies the scope of data used for the query. This could be all data in a Log Analytics workspace or data for a particular resource across multiple workspaces. See [Log query scope and time range in Azure Monitor Log Analytics](scope.md).

**Run button:** Click to run the selected query in the query window. You can also press shift+enter to run a query.

**Time picker:** Select the time range for the data available to the query. This is overriden if you include a time filter in the query. See [Log query scope and time range in Azure Monitor Log Analytics](scope.md).

**Save button:** Save the query to the Query Explorer for the workspace.

**Copy button:** Copy a link to the query, the query text, or the query results to the clipboard.

**New alert rule button:** Create a new tab with an empty query.

**Export button:** Export the results of the query to a CSV file or the query to Power Query Formula Language format for use with Power Bi.

**Pin to dashboard button:** Add the results of the query to an Azure dashboard.

**Format query button:** Arrange the selected text for readability.

**Example queries button:** Open the example queries dialog box that is displayed when you first open Log Analytics.

**Query Explorer button:** Open **Query Explorer** which provides access to saved queries in the workspace.

### 2. Sidebar

**Tables:** Lists the tables that are part of the selected scope. Select **Group by** to change the grouping of the tables. Hover over a table name to display a dialog box with a description of the table and options to view its documentation and to preview its data. Expand a table to view its columns. Double-click on a table or column name to add it to the query.

**Queries:** List of example queries that you can open in the query window. This is the same list that's displayed when you open Log Analytics. Select **Group by** to change the grouping of the queries. Double-click on a query to add it to the query window or hover over it for other options.

**Filter:** Creates filter options based on the results of a query. After you a run a query, columns will be displayed with different values from the results. Select one or more values and then click **Apply & Run** to add a **where** command to the query and run it again.

### 3. Query window
The query window is where you edit your query. This includes intellisense for KQL commands and color coding to enhance readability. Click the **+** at the top of the window to open another tab.

As single window can include multiple queries. A query cannot include any blank lines, so you can separate multiple queries in a window with one or more blank lines. The current query is the one with the cursor positioned anywhere in it.

To run the current query, click the **Run** button or press Shift+Enter.

### 4. Results window
The results of the query are displayed in the results window. By default, the results are displayed as a table. To display as a chart, either select **Chart** in the results window, or add a **render** command to your query.

#### Results view
The Results view displays query results in a table organized by columns and rows. Click to the left of a row to expand its values. Click on the **Columns** dropdown to change the list of columns. 

Sort the results by clicking on a column name. Filter the results by clicking the funnel next to a column name. Clear the filters and reset the sorting by running the query again.

Select **Group columns** to display the grouping bar above the query results. Group the results by any column by dragging it to the bar. Create nested groups in the results by adding additional columns. 

#### Chart view
The Chart view displays the results as one of multiple available chart types. You can specify the chart type in a **render** command in your query or select it from the **Visualization Type** dropdown.

| Option | Description |
|:---|:---|
| **Visualization Type** | Type of chart to display. |
| **X-Axis** | Column in the results to use for the X-Axis 
| **Y-Axis** | Column in the results to use for the Y-Axis. This will typically be a numeric column. |
| **Split by** | Column in the results that defines the series in the chart. A series is created for each value in the column. |
| **Aggregation** | Type of aggregation to perform on the numeric values in the Y-Axis. |

## How can I learn how to write queries?
If you want to jump right into things, you can start with the following tutorials:

- [Get started with Log Analytics in Azure Monitor](get-started-portal.md).
- [Get started with log queries in Azure Monitor](get-started-queries.md).

Once you have the basics down, walk through multiple lessons using either your own data or data from our demo environment starting with: 

- [Work with strings in Azure Monitor log queries](string-operations.md)
 
## What language do log queries use?
Azure Monitor Logs is based on [Azure Data Explorer](/azure/data-explorer), and log queries are written using the same Kusto query language (KQL). This is a rich language designed to be easy to read and author, and you should be able to start using it with minimal guidance.

See [Azure Data Explorer KQL documentation](/azure/kusto/query) for complete documentation on KQL and reference on different functions available.<br>
See [Get started with log queries in Azure Monitor](get-started-queries.md) for a quick walkthrough of the language using data from Azure Monitor Logs.
 See [Azure Monitor log query language differences](data-explorer-difference.md) for minor differences in the version of KQL used by Azure Monitor.

## What data is available to log queries?
All data collected in Azure Monitor Logs is available to retrieve and analyze in log queries. Different data sources will write their data to different tables, but you can include multiple tables in a single query to analyze data across multiple sources. When you build a query, you start by determining which tables have the data that you're looking for, so you should have at least a basic understanding of how data in Azure Monitor Logs is structured.

See [Sources of Azure Monitor Logs](../platform/data-platform-logs.md#sources-of-azure-monitor-logs), for a list of different data sources that populate Azure Monitor Logs.<br>
See [Structure of Azure Monitor Logs](logs-structure.md) for an explanation of how the data is structured.




## What is Log Analytics?
Log Analytics is the primary tool in the Azure portal for writing log queries and interactively analyzing their results. Even if a log query is used elsewhere in Azure Monitor, you'll typically write and test the query first using Log Analytics.

You can start Log Analytics from several places in the Azure portal. The scope of the data available to Log Analytics is determined by how you start it. See [Query Scope](scope.md) for more details.

- Select **Logs** from the **Azure Monitor** menu or **Log Analytics workspaces** menu.
- Select **Logs** from the **Overview** page of an Application Insights application.
- Select **Logs** from the menu of an Azure resource.

![Log Analytics](media/log-query-overview/log-analytics.png)

See [Get started with Log Analytics in Azure Monitor](get-started-portal.md) for a tutorial walkthrough of Log Analytics that introduces several of its features.

## Where else are log queries used?
In addition to interactively working with log queries and their results in Log Analytics, areas in Azure Monitor where you will use queries include the following:

- **Alert rules.** [Alert rules](../platform/alerts-overview.md) proactively identify issues from data in your workspace.  Each alert rule is based on a log search that is automatically run at regular intervals.  The results are inspected to determine if an alert should be created.
- **Dashboards.** You can pin the results of any query into an [Azure dashboard](../learn/tutorial-logs-dashboards.md) which allow you to visualize log and metric data together and optionally share with other Azure users.
- **Views.**  You can create visualizations of data to be included in user dashboards with [View Designer](../platform/view-designer.md).  Log queries provide the data used by [tiles](../platform/view-designer-tiles.md) and [visualization parts](../platform/view-designer-parts.md) in each view.  
- **Export.**  When you import log data from Azure Monitor into Excel or [Power BI](../platform/powerbi.md), you create a log query to define the data to export.
- **PowerShell.** You can run a PowerShell script from a command line or an Azure Automation runbook that uses [Get-AzOperationalInsightsSearchResults](/powershell/module/az.operationalinsights/get-azoperationalinsightssearchresult) to retrieve log data from Azure Monitor.  This cmdlet requires a query to determine the data to retrieve.
- **Azure Monitor Logs API.**  The [Azure Monitor Logs API](https://dev.loganalytics.io) allows any REST API client to retrieve log data from the workspace.  The API request includes a query that is run against Azure Monitor to determine the data to retrieve.


## Next steps
- Walk through a [tutorial on using Log Analytics in the Azure portal](get-started-portal.md).
- Walk through a [tutorial on writing queries](get-started-queries.md).
