---
title: Overview of Log Analytics in Azure Monitor
description: Describes Log Analytics which is a tool in the Azure portal used to edit and run log queries for analyzing data in Azure Monitor Logs.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/04/2020

---

# Overview of Log Analytics in Azure Monitor
Log Analytics is a tool in the Azure portal used to edit and run log queries with data in Azure Monitor Logs. You may write a simple query that returns a set of records and then use features of Log Analytics to sort, filter, and analyze them. Or you may write a more advanced query to perform statistical analysis and visualize the results in a chart to identify a particular trend. Whether you work with the results of your queries interactively or use them with other Azure Monitor features such as log query alerts or workbooks, Log Analytics is the tool that you're going to use write and test them. 


> [!TIP]
> This article provides a description of Log Analytics and each of its features. If you want to jump right into a tutorial, see [Log Analytics tutorial](./log-analytics-tutorial.md).



## Starting Log Analytics
Start Log Analytics from **Logs** in the **Azure Monitor** menu in the Azure portal. You'll also see this option in the menu for most Azure resources. Regardless of where you start it from, it will be the same Log Analytics tool. The menu you use to start Log Analytics determines the data that will be available though. If you start it from the **Azure Monitor** menu or the **Log Analytics workspaces** menu, you'll have access to all of the records in a workspace. If you select **Logs** from another type of resource, then your data will be limited to log data for that resource. See [Log query scope and time range in Azure Monitor Log Analytics](./scope.md) for details.

[![Start Log Analytics](media/log-analytics-overview/start-log-analytics.png)](media/log-analytics-overview/start-log-analytics.png#lightbox)

When you start Log Analytics, the first thing you'll see is a dialog box with [example queries](../logs/example-queries.md). These are categorized by solution, and you can browse or search for queries that match your particular requirements. You may be able to find a that does exactly what you need, or load one to the editor and modify it as required. Browsing through example queries is actually a great way to learn how to write your own queries. 
Of course if you want to start with an empty script and write it yourself, you can close the example queries. Just click the **Queries** at the top of the screen if you want to get them back.

## Log Analytics interface
The following image identifies the different components of Log Analytics.

[![Log Analytics](media/log-analytics-overview/log-analytics.png)](media/log-analytics-overview/log-analytics.png#lightbox)

### 1. Top action bar
Controls for working with the query in the query window.

| Option | Description |
|:---|:---|
| Scope | Specifies the scope of data used for the query. This could be all data in a Log Analytics workspace or data for a particular resource across multiple workspaces. See [Query scope](./scope.md). |
| Run button | Click to run the selected query in the query window. You can also press shift+enter to run a query. |
| Time picker | Select the time range for the data available to the query. This is overridden if you include a time filter in the query. See [Log query scope and time range in Azure Monitor Log Analytics](./scope.md). |
| Save button | Save the query to the Query Explorer for the workspace. |
 Copy button | Copy a link to the query, the query text, or the query results to the clipboard. |
| New alert rule button | Create a new tab with an empty query. |
| Export button | Export the results of the query to a CSV file or the query to Power Query Formula Language format for use with Power Bi. |
| Pin to dashboard button | Add the results of the query to an Azure dashboard. |
| Format query button | Arrange the selected text for readability. |
| Example queries button | Open the example queries dialog box that is displayed when you first open Log Analytics. |
| Query Explorer button | Open **Query Explorer** which provides access to saved queries in the workspace. |


### 2. Sidebar
Lists of tables in the workspace, sample queries, and filter options for the current query.

| Tab | Description |
|:---|:---|
| Tables | Lists the tables that are part of the selected scope. Select **Group by** to change the grouping of the tables. Hover over a table name to display a dialog box with a description of the table and options to view its documentation and to preview its data. Expand a table to view its columns. Double-click on a table or column name to add it to the query. |
| Queries | List of example queries that you can open in the query window. This is the same list that's displayed when you open Log Analytics. Select **Group by** to change the grouping of the queries. Double-click on a query to add it to the query window or hover over it for other options. |
| Filter | Creates filter options based on the results of a query. After you a run a query, columns will be displayed with different values from the results. Select one or more values and then click **Apply & Run** to add a **where** command to the query and run it again. |

### 3. Query window
The query window is where you edit your query. This includes intellisense for KQL commands and color coding to enhance readability. Click the **+** at the top of the window to open another tab.

As single window can include multiple queries. A query cannot include any blank lines, so you can separate multiple queries in a window with one or more blank lines. The current query is the one with the cursor positioned anywhere in it.

To run the current query, click the **Run** button or press Shift+Enter.

### 4. Results window
The results of the query are displayed in the results window. By default, the results are displayed as a table. To display as a chart, either select **Chart** in the results window, or add a **render** command to your query.

#### Results view
Displays query results in a table organized by columns and rows. Click to the left of a row to expand its values. Click on the **Columns** dropdown to change the list of columns. Sort the results by clicking on a column name. Filter the results by clicking the funnel next to a column name. Clear the filters and reset the sorting by running the query again.

Select **Group columns** to display the grouping bar above the query results. Group the results by any column by dragging it to the bar. Create nested groups in the results by adding additional columns. 

#### Chart view
Displays the results as one of multiple available chart types. You can specify the chart type in a **render** command in your query or select it from the **Visualization Type** dropdown.

| Option | Description |
|:---|:---|
| **Visualization Type** | Type of chart to display. |
| **X-Axis** | Column in the results to use for the X-Axis 
| **Y-Axis** | Column in the results to use for the Y-Axis. This will typically be a numeric column. |
| **Split by** | Column in the results that defines the series in the chart. A series is created for each value in the column. |
| **Aggregation** | Type of aggregation to perform on the numeric values in the Y-Axis. |

## Relationship to Azure Data Explorer
If you're already familiar with the Azure Data Explorer Web UI, then Log Analytics should look familiar. That's because it's built on top of Azure Data Explorer and uses the same Kusto Query Language (KQL). Log Analytics adds features specific to Azure Monitor such as filtering by time range and the ability to create an alert rule from a query. Both tools included an explorer that lets you scan through the structure of available tables, but the Azure Data Explorer Web UI primarily works with tables in Azure Data Explorer databases while Log Analytics works with tables in a Log Analytics workspace. 

## Next steps
- Walk through a [tutorial on using Log Analytics in the Azure portal](./log-analytics-tutorial.md).
- Walk through a [tutorial on writing queries](./get-started-queries.md).