---
title: Explore log data in Azure Monitor using Log Analytics simple mode
description: This article describes how to use simple query mode in Log Analytics
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: roygal
ms.date: 09/04/2023

---

# Explore log data in Azure Monitor using Log Analytics simple mode 


Simple mode provides an easy, spreadsheet-like experience for navigating your logs and arriving at insights in Log Analytics, without writing queries. Similar to working with data in Excel, you can scroll through entries, search for specific values, filter and sort, hide columns you don't need, and aggregate data, all without any query language expertise.

This article explains how to use simple mode in Log Analytics.     

## Switch modes

To switch modes, select **Simple mode** or **Advanced mode** from the dropdown in the top right corner of the query editor.

When you switch from simple to advanced mode, the query editor populates the query for the work you did in simple mode. You can then edit and continue working with the query.

## Select a table to view logs

Select a table.

Log Analytics presents up to 1000 entries in the table from the last 24 hours. You can change the time range and the number of records displayed using the **Time range** and **Limit** cards.

## Log Analytics interface

This image identifies the Log Analytics simple mode components.

:::image type="content" source="media/log-analytics-simple-mode/log-analytics-simple-mode.png" alt-text="Screenshot that shows the Log Analytics simple mode interface." lightbox="media/log-analytics-simple-mode/log-analytics-simple-mode.png":::

### Top action bar

The top bar has controls for working with a query in the query window.

| Option | Description |
|:---|:---|
| Scope | Specifies the scope of data used for the query. This could be all the data in a Log Analytics workspace or data for a particular resource across multiple workspaces. See [Query scope](./scope.md). |
| Run button | Run the selected query in the query window. You can also select **Shift+Enter** to run a query. |
| Time picker | Select the time range for the data available to the query. This action is overridden if you include a time filter in the query. See [Log query scope and time range in Azure Monitor Log Analytics](./scope.md). |
| Save button | Save the query to **Query Explorer** for the workspace. |
 Copy button | Copy a link to the query, the query text, or the query results to the clipboard. |
| New alert rule button | Create a new tab with an empty query. |
| Export button | Export the results of the query to a CSV file or the query to Power Query Formula Language format for use with Power BI. |
| Pin to button | Pin the results of the query to an Azure dashboard or add them to an Azure workbook. |
| Format query button | Arrange the selected text for readability. |
| Example queries button | Open the example queries dialog that appears when you first open Log Analytics. |
| Query Explorer button | Open **Query Explorer**, which provides access to saved queries in the workspace. |

### Left sidebar

The sidebar on the left lists tables in the workspace, sample queries, and filter options for the current query.

| Tab | Description |
|:---|:---|
| Tables | Lists the tables that are part of the selected scope. Select **Group by** to change the grouping of the tables. Hover over a table name to display a dialog with a description of the table and options to view its documentation and preview its data. Expand a table to view its columns. Double-click a table or column name to add it to the query. |
| Queries | List of example queries that you can open in the query window. This list is the same one that appears when you open Log Analytics. Select **Group by** to change the grouping of the queries. Double-click a query to add it to the query window or hover over it for other options. |
| Filter | Creates filter options based on the results of a query. After you run a query, columns appear with different values from the results. Select one or more values, and then select **Apply & Run** to add a **where** command to the query and run it again. |

### Query window

The query window is where you edit your query. IntelliSense is used for KQL commands and color coding enhances readability. Select **+** at the top of the window to open another tab.

A single window can include multiple queries. A query can't include any blank lines, so you can separate multiple queries in a window with one or more blank lines. The current query is the one with the cursor positioned anywhere in it.

To run the current query, select the **Run** button or select **Shift+Enter**.

### Results window

The results of a query appear in the results window. By default, the results are displayed as a table. To display the results as a chart, select **Chart** in the results window. You can also add a **render** command to your query.

#### Results view

The results view displays query results in a table organized by columns and rows. Click to the left of a row to expand its values. Select the **Columns** dropdown to change the list of columns. Sort the results by selecting a column name. Filter the results by selecting the funnel next to a column name. Clear the filters and reset the sorting by running the query again.

Select **Group columns** to display the grouping bar above the query results. Group the results by any column by dragging it to the bar. Create nested groups in the results by adding more columns.

#### Chart view

The chart view displays the results as one of multiple available chart types. You can specify the chart type in a **render** command in your query. You can also select it from the **Visualization Type** dropdown.

| Option | Description |
|:---|:---|
| Visualization type | Type of chart to display. |
| X-axis | Column in the results to use for the x-axis.
| Y-axis | Column in the results to use for the y-axis. Typically, this is a numeric column. |
| Split by | Column in the results that defines the series in the chart. A series is created for each value in the column. |
| Aggregation | Type of aggregation to perform on the numeric values in the y-axis. |

## Relationship to Azure Data Explorer


## Filter and sort columns

## Show or hide columns

## Aggregate data

 
## Next steps
- Walk through a [tutorial on writing queries](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor).
- Access the complete [reference documentation for KQL](/azure/kusto/query/).
