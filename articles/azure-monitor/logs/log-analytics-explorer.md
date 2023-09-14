---
title: Analyze log data in Azure Monitor using the new Log Analytics 
description: This article explains the new Log Analytics interface and how to use simple and advanced modes to explore and analyze data in Azure Monitor Logs.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: roygal
ms.date: 09/04/2023

---

# Analyze log data in Azure Monitor using the new Log Analytics 

The new Log Analytics features a simplified user interface and two modes for working with log data:  

- **Simple mode** provides a spreadsheet-like experience to get you started quickly. Similar to working in Excel, you point and click to navigate your data. Simple mode offers a set of operators that are fundamental to data analysis and help you extract valuable insights without using Kusto Query Language (KQL). 
- For more complex analysis, switch to **advanced mode**, which offers a full-feature query editor and lets you take advantage of all of Azure Monitor's data analysis capabilities.

This article explains the new Log Analytics interface and how to use simple and advanced modes to explore and analyze data in Azure Monitor Logs.     

## Try the new Log Analytics

The new Log Analytics is currently in preview and available to a limited number of customers. To try it, select **Try the new Log Analytics** at the top right corner of the Log Analytics query editor.

:::image type="content" source="media/log-analytics-explorer/try-new-log-analytics.png" alt-text="A GIF showing the Try new Log Analytics button.":::

## New Log Analytics interface

This section explains the elements of the new Log Analytics interface.

:::image type="content" source="media/log-analytics-explorer/new-log-analytics-user-interface.png" alt-text="Screenshot that shows the Log Analytics simple mode interface." lightbox="media/log-analytics-explorer/new-log-analytics-user-interface.png":::

### Top query bar

In simple mode, the top bar has controls for working with data and switching to advanced mode.

| Option | Description |
|:---|:---|
| **Time range** | Select the time range for the data available to the query. In advanced mode, if you set a different time range in your query, the time range you set in the time picker is overridden. See [Log query scope and time range in Azure Monitor Log Analytics](./scope.md). |
|**Filter**|Filter data, and apply simple mode operators, as described in [Query in simple mode](#query-in-simple-mode).|
|**Limit**|Configure the number of entries Log Analytics displays in simple mode. The default limit is 1000.|
|**Simple/Advanced**|Switch between simple and advanced mode.|
| **Queries** | Open the example queries dialog that appears when you first open Log Analytics. |

### Left pane

The collapsible left pane gives you access to tables in the workspace, sample and saved queries, query history, and filter options for the current query.

Pin the left pane to keep it open while you work, or maximize your query window by selecting an icon from the left pane only when you need it.

:::image type="content" source="media/log-analytics-explorer/log-analytics-left-sidebar.png" alt-text="Screenshot that shows the left sidebar in Log Analytics.":::

| Option | Description |
|:---|:---|
| **Tables** | Lists the tables that are part of the selected scope. Select **Group by** to change the grouping of the tables. Hover over a table name to display a dialog with a description of the table and options to view its documentation and preview its data. Expand a table to view its columns. Double-click a table or column name to add it to the query. |
| **Queries** | List of example and saved queries you can open in the query window. This list is the same one that appears when you open Log Analytics. Select **Group by** to change the grouping of the queries. Double-click a query to add it to the query window or hover over it for other options. |
|**Functions**|Lists functions, which allow you to reuse predefined query logic in your log queries. For more information, see [Function](../logs/functions.md)|
|**Query history**|Lists your query history. Select a query to rerun it.|
| **Filter** | We recommend using the new filter experience in the [top action bar](#top-action-bar). However, you can still access the classic filter experience here.|
## Switch modes

To switch modes, select **Simple mode** or **Advanced mode** from the dropdown in the top right corner of the query editor.

When you begin to query logs in simple mode and then switch to advanced mode, the query editor is pre-populated with the KQL query related to your simple mode analysis. You can then edit and continue working with the query.

:::image type="content" source="media/log-analytics-explorer/log-analytics-switch-modes-1.gif" alt-text="A GIF showing two Log Analytics query tabs, one in simple mode and one in advanced mode.":::

### More tools

:::image type="content" source="media/log-analytics-explorer/log-analytics-more-tools.png" alt-text="Screenshot that shows the More tools window in Log Analytics.":::

| Option | Description |
|:---|:---|
| **Save** | [Save a query to a query pack](../logs/save-query.md). |
| **Share** | Copy a link to your query, the query text, or query results. |
| **New alert rule** | [Create a new alert rule](../alerts/alerts-create-new-alert-rule.md#create-or-edit-an-alert-rule-in-the-azure-portal). |
|**Export**|[Export data to Excel](../logs/log-excel.md), CSV, or [Power BI](../logs/log-powerbi.md).|
|**Pin to**|Pin your query to a [workbook](../visualize/workbooks-overview.md), or an [Azure dashboard](../visualize/tutorial-logs-dashboards.md) or [Grafana dashboard](../visualize/grafana-plugin.md#pin-charts-from-the-azure-portal-to-azure-managed-grafana).|
| **Format query** | Format query text in advanced mode. |
| **Search job mode** | [Run a search job](../logs/search-jobs.md). |
| **Switch back to classic Logs** | Switch back to the classic Log Analytics user interface. |

## Query in simple mode 

**Select a table to view log data**

1. Click **Select a table** and select a table from the **Tables** tab.

    :::image type="content" source="media/log-analytics-explorer/log-analytics-select-table.png" alt-text="Screenshot that shows the Select a table button in Log Analytics.":::
    By default, simple mode lists the last 1000 entries in the table from the last 24 hours. 

1. To change the time range and number of records displayed, use the **Time range** and **Limit** selectors.
    
    :::image type="content" source="media/log-analytics-explorer/log-analytics-time-range-limit.png" alt-text="Screenshot that shows the time range and limit selectors in Log Analytics.":::

**Filter by column**

1. Select **Filter** and choose a column.
1. Select an operator and enter a value for the filter, or enter text or numbers in the **Search** box.
    
    :::image type="content" source="media/log-analytics-explorer/log-analytics-filter.png" alt-text="Screenshot that shows the filter menu that opens when you select Filter in Log Analytics simple mode.":::

**Search for entries that have a specific value in the table**

1. Select **Search**.

    :::image type="content" source="media/log-analytics-explorer/log-analytics-search.png" alt-text="Screenshot that shows the Search option in Log Analytics simple mode.":::

1. Enter a value in the **Search this table** box and select **Apply**.

    Log Analytics filters the table to show only entries that contain the value you entered.

> [!IMPORTANT]
> We recommend using **Filter** if you know which column holds the data you're searching for. The [search operator is substantially less performant](../logs/query-optimization.md#avoid-unnecessary-use-of-search-and-union-operators) than filtering, and might not function well on large volumes of data.

**Aggregate**

1. Select **Aggregate**.
1. Select a column to aggregate by and select an operator to aggregate by, as described in [Use aggregation operators](#use-aggregation-operators).

**Show or hide columns**

1. Select **Show columns**.
1. Select or clear columns to show or hide them, then select **Apply**.

    :::image type="content" source="media/log-analytics-explorer/log-analytics-show-column.png" alt-text="Screenshot that shows the Show columns window in Log Analytics.":::

> [!NOTE]
> Showing or hiding columns in simple mode does not add the [project](/azure/data-explorer/kusto/query/projectoperator) or [project-away](/azure/data-explorer/kusto/query/projectawayoperator) operators to your query when you switch to advanced mode.


**Sort by column**

1. Select **Sort**.
1. Select a column to sort by.
1. Select **Ascending** or **Descending**, then select **Apply**.  

    :::image type="content" source="media/log-analytics-explorer/log-analytics-sort.png" alt-text="Screenshot that shows the Sort by column window in Log Analytics.":::

1. Select **Sort** again to sort by another column.

### Use aggregation operators

| Operator | Description |
|:---|:---|
|`count`|Counts the number of times each distinct value exists in the column.|
|`dcount`|For the `dcount` operator, you select two columns. The operator counts the total number of distinct values in the second column correlated to each value in the first column. For example, this shows the distinct number of result codes for successful and failed operations:<br/> :::image type="content" source="media/log-analytics-explorer/log-analytics-dcount.png" alt-text="Screenshot that shows the result of an aggregation using the dcount operator in Azure Monitor Log Analytics.":::  |
|`sum`<br/>`avg`<br/>`max`<br/>`min`|For these operators, you select two columns. The operators calculate the sum, average, maximum, or minimum of all values in the second column for each value in the first column. For example, this shows the total duration of each operation in milliseconds for the past 24 hours:<br/>:::image type="content" source="media/log-analytics-explorer/log-analytics-sum.png" alt-text="Screenshot that shows the results of an aggregation using the sum operator in Azure Monitor Log Analytics.":::  |

## Advanced mode

The query window is where you edit your query. IntelliSense is used for KQL commands and color coding enhances readability. Select **+** at the top of the window to open another tab.

A single window can include multiple queries. A query can't include any blank lines, so you can separate multiple queries in a window with one or more blank lines. The current query is the one with the cursor positioned anywhere in it.

To run the current query, select the **Run** button or select **Shift+Enter**.

## Results window

The results of a query appear in the results window. By default, the results are displayed as a table. To display the results as a chart, select **Chart** in the results window. You can also add a **render** command to your query.

### Results view

The results view displays query results in a table organized by columns and rows. Click to the left of a row to expand its values. Select the **Columns** dropdown to change the list of columns. Sort the results by selecting a column name. Filter the results by selecting the funnel next to a column name. Clear the filters and reset the sorting by running the query again.

Select **Group columns** to display the grouping bar above the query results. Group the results by any column by dragging it to the bar. Create nested groups in the results by adding more columns.

### Chart view

The chart view displays the results as one of multiple available chart types. You can specify the chart type in a **render** command in your query. You can also select it from the **Visualization Type** dropdown.

| Option | Description |
|:---|:---|
| Visualization type | Type of chart to display. |
| X-axis | Column in the results to use for the x-axis.
| Y-axis | Column in the results to use for the y-axis. Typically, this is a numeric column. |
| Split by | Column in the results that defines the series in the chart. A series is created for each value in the column. |
| Aggregation | Type of aggregation to perform on the numeric values in the y-axis. |

 
## Next steps
- Walk through a [tutorial on writing queries](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor).
- Access the complete [reference documentation for KQL](/azure/kusto/query/).
