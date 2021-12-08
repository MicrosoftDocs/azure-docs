---
title: "Log Analytics tutorial"
description: Learn from this tutorial how to use features of Log Analytics in Azure Monitor to build and run a log query and analyze its results in the Azure portal.
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 06/28/2021

---

# Log Analytics tutorial
Log Analytics is a tool in the Azure portal to edit and run log queries from data collected by Azure Monitor Logs and interactively analyze their results. You can use Log Analytics queries to retrieve records that match particular criteria, identify trends, analyze patterns, and provide a variety of insights into your data. 

This tutorial walks you through the Log Analytics interface, gets you started with some basic queries, and shows you how you can work with the results. You'll learn the following:

> [!div class="checklist"]
> * Understand the log data schema
> * Write and run simple queries, and modify the time range for queries
> * Filter, sort, and group query results
> * View, modify, and share visuals of query results
> * Load, export, and copy queries and results

> [!IMPORTANT]
> In this tutorial, you'll use Log Analytics features to build one query and use another example query. When you're ready to learn the syntax of queries and start directly editing the query itself, read the [Kusto Query Language tutorial](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor). That tutorial walks through example queries that you can edit and run in Log Analytics. It uses several of the features that you'll learn in this tutorial.


## Prerequisites
This tutorial uses the [Log Analytics demo environment](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade), which includes plenty of sample data that supports the sample queries. You can also use your own Azure subscription, but you might not have data in the same tables.

## Open Log Analytics
Open the [Log Analytics demo environment](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade), or select **Logs** from the Azure Monitor menu in your subscription. This step will set the initial scope to a Log Analytics workspace, so that your query will select from all data in that workspace. If you select **Logs** from an Azure resource's menu, the scope is set to only records from that resource. For details about the scope, see [Log query scope](./scope.md).

You can view the scope in the upper-left corner of the screen. If you're using your own environment, you'll see an option to select a different scope. This option isn't available in the demo environment.

:::image type="content" source="media/log-analytics-tutorial/scope.png" alt-text="Screenshot that shows the Log Analytics scope for the demo." lightbox="media/log-analytics-tutorial/scope.png":::

## View table information
The left side of the screen includes the **Tables** tab, where you can inspect the tables that are available in the current scope. These tables are grouped by **Solution** by default, but you can change their grouping or filter them. 

Expand the **Log Management** solution and locate the **AppRequests** table. You can expand the table to view its schema, or hover over its name to show more information about it. 

:::image type="content" source="media/log-analytics-tutorial/table-details.png" alt-text="Screenshot that shows the Tables view." lightbox="media/log-analytics-tutorial/table-details.png":::

Select the link below **Useful links** to go to the table reference that documents each table and its columns. Select **Preview data** to have a quick look at a few recent records in the table. This preview can be useful to ensure that this is the data that you're expecting before you run a query with it.

:::image type="content" source="media/log-analytics-tutorial/sample-data.png" alt-text="Screenshot that shows sample data." lightbox="media/log-analytics-tutorial/sample-data.png":::

## Write a query
Let's write a query by using the **AppRequests** table. Double-click its name to add it to the query window. You can also type directly in the window. You can even get IntelliSense that will help complete the names of tables in the current scope and Kusto Query Language (KQL) commands.

This is the simplest query that we can write. It just returns all the records in a table. Run it by selecting the **Run** button or by selecting Shift+Enter with the cursor positioned anywhere in the query text.

:::image type="content" source="media/log-analytics-tutorial/query-results.png" alt-text="Screenshot that shows query results." lightbox="media/log-analytics-tutorial/query-results.png":::

You can see that we do have results. The number of records that the query has returned appears in the lower-right corner. 

## Filter query results

Let's add a filter to the query to reduce the number of records that are returned. Select the **Filter** tab on the left pane. This tab shows columns in the query results that you can use to filter the results. The top values in those columns are displayed with the number of records that have that value. Select **200** under **ResultCode**, and then select **Apply & Run**. 

:::image type="content" source="media/log-analytics-tutorial/query-pane.png" alt-text="Screenshot that shows the query pane." lightbox="media/log-analytics-tutorial/query-pane.png":::

A **where** statement is added to the query with the value that you selected. The results now include only records with that value, so you can see that the record count is reduced.

:::image type="content" source="media/log-analytics-tutorial/query-results-filter-01.png" alt-text="Screenshot that shows query results filtered." lightbox="media/log-analytics-tutorial/query-results-filter-01.png":::


### Time range
All tables in a Log Analytics workspace have a column called **TimeGenerated**, which is the time that the record was created. All queries have a time range that limits the results to records that have a **TimeGenerated** value within that range. You can set the time range in the query or by using the selector at the top of the screen.

By default, the query returns records from the last 24 hours. You should see a message here that says we're not seeing all of the results. This is because Log Analytics can return a maximum of 30,000 records, and our query returned more records than that. Select the **Time range** dropdown list, and change the value to **12 hours**. Select **Run** again to return the results. 

:::image type="content" source="media/log-analytics-tutorial/query-results-max.png" alt-text="Screenshot that shows the time range." lightbox="media/log-analytics-tutorial/query-results-max.png":::


### Multiple query conditions
Let's reduce our results further by adding another filter condition. A query can include any number of filters to target exactly the set of records that you want. Select **Get Home/Index** under **Name**, and then select **Apply & Run**. 

:::image type="content" source="media/log-analytics-tutorial/query-results-filter-02.png" alt-text="Screenshot that shows query results with multiple filters." lightbox="media/log-analytics-tutorial/query-results-filter-02.png":::


## Analyze results
In addition to helping you write and run queries, Log Analytics provides features for working with the results. Start by expanding a record to view the values for all of its columns.

:::image type="content" source="media/log-analytics-tutorial/expand-record.png" alt-text="Screenshot that shows expanding a record." lightbox="media/log-analytics-tutorial/expand-record.png":::

Select the name of any column to sort the results by that column. Select the filter icon next to it to provide a filter condition. This is similar to adding a filter condition to the query itself, except that this filter is cleared if the query is run again. Use this method if you want to quickly analyze a set of records as part of interactive analysis.

For example, set a filter on the **DurationMs** column to limit the records to those that took more than **100** milliseconds. 

:::image type="content" source="media/log-analytics-tutorial/query-results-filter.png" alt-text="Screenshot that shows a query results filter." lightbox="media/log-analytics-tutorial/query-results-filter.png":::

Instead of filtering the results, you can group records by a particular column. Clear the filter that you just created and then turn on the **Group columns** toggle. 

:::image type="content" source="media/log-analytics-tutorial/query-results-group-columns.png" alt-text="Screenshot that shows turning on grouping of columns." lightbox="media/log-analytics-tutorial/query-results-group-columns.png":::

Drag the **Url** column into the grouping row. Results are now organized by that column, and you can collapse each group to help you with your analysis.

:::image type="content" source="media/log-analytics-tutorial/query-results-grouped.png" alt-text="Screenshot that shows query results grouped." lightbox="media/log-analytics-tutorial/query-results-grouped.png":::

## Work with charts
Let's look at a query that uses numerical data that we can view in a chart. Instead of building a query, we'll select an example query.

Select **Queries** on the left pane. This pane includes example queries that you can add to the query window. If you're using your own workspace, you should have a variety of queries in multiple categories. If you're using the demo environment, you might see only a single **Log Analytics workspaces** category. Expand that to view the queries in the category.

Select the query called **Function Error rate** in the **Applications** category. This step adds the query to the query window. Notice that the new query is separated from the other by a blank line. A query in KQL ends when it encounters a blank line, so these are considered separate queries. 

:::image type="content" source="media/log-analytics-tutorial/example-query.png" alt-text="Screenshot that shows a new query." lightbox="media/log-analytics-tutorial/example-query.png":::

The current query is the one that the cursor is positioned on. You can see that the first query is highlighted, indicating that it's the current query. Click anywhere in the new query to select it, and then select the **Run** button to run it.

:::image type="content" source="media/log-analytics-tutorial/example-query-output-table.png" alt-text="Screenshot that shows the query results table." lightbox="media/log-analytics-tutorial/example-query-output-table.png":::

To view the results in a graph, select **Chart** on the results pane.  Notice that there are various options for working with the chart, such as changing it to another type.

:::image type="content" source="media/log-analytics-tutorial/example-query-output-chart.png" alt-text="Screenshot that shows the query results chart." lightbox="media/log-analytics-tutorial/example-query-output-chart.png":::


## Next steps

Now that you know how to use Log Analytics, complete the tutorial on using log queries:
> [!div class="nextstepaction"]
> [Write Azure Monitor log queries](get-started-queries.md)
