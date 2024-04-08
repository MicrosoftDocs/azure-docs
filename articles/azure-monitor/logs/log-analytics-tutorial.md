---
title: "Log Analytics tutorial"
description: Learn how to use Log Analytics in Azure Monitor to build and run a log query and analyze its results in the Azure portal.
ms.topic: tutorial
author: guywild
ms.author: guywild
ms.reviewer: roygal
ms.date: 10/31/2023

---

# Log Analytics tutorial

Log Analytics is a tool in the Azure portal to edit and run log queries from data collected by Azure Monitor logs and interactively analyze their results. You can use Log Analytics queries to retrieve records that match particular criteria, identify trends, analyze patterns, and provide various insights into your data.

This tutorial walks you through the Log Analytics interface, gets you started with some basic queries, and shows you how you can work with the results. You'll learn how to:

> [!div class="checklist"]
> * Understand the log data schema.
> * Write and run simple queries, and modify the time range for queries.
> * Filter, sort, and group query results.
> * View, modify, and share visuals of query results.
> * Load, export, and copy queries and results.

> [!IMPORTANT]
> In this tutorial, you'll use Log Analytics features to build one query and use another example query. When you're ready to learn the syntax of queries and start directly editing the query itself, read the [Kusto Query Language tutorial](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor). That tutorial walks you through example queries that you can edit and run in Log Analytics. It uses several of the features that you'll learn in this tutorial.

## Prerequisites

This tutorial uses the [Log Analytics demo environment](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade), which includes plenty of sample data that supports the sample queries. You can also use your own Azure subscription, but you might not have data in the same tables.

## Open Log Analytics

Open the [Log Analytics demo environment](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade), or select **Logs** from the Azure Monitor menu in your subscription. This step sets the initial scope to a Log Analytics workspace so that your query selects from all data in that workspace. If you select **Logs** from an Azure resource's menu, the scope is set to only records from that resource. For details about the scope, see [Log query scope](./scope.md).

You can view the scope in the upper-left corner of the screen. If you're using your own environment, you'll see an option to select a different scope. This option isn't available in the demo environment.

:::image type="content" source="media/log-analytics-tutorial/log-analytics-query-scope.png" alt-text="Screenshot that shows the Log Analytics scope for the demo." lightbox="media/log-analytics-tutorial/log-analytics-query-scope.png":::

## View table information

The left side of the screen includes the **Tables** tab, where you can inspect the tables that are available in the current scope. These tables are grouped by **Solution** by default, but you can change their grouping or filter them.

Expand the **Log Management** solution and locate the **AppRequests** table. You can expand the table to view its schema, or hover over its name to show more information about it.

:::image type="content" source="media/log-analytics-tutorial/table-details.png" alt-text="Screenshot that shows the Tables view." lightbox="media/log-analytics-tutorial/table-details.png":::

Select the link below **Useful links** to go to the table reference that documents each table and its columns. Select **Preview data** to have a quick look at a few recent records in the table. This preview can be useful to ensure that this is the data that you're expecting before you run a query with it.

:::image type="content" source="media/log-analytics-tutorial/preview-data.png" alt-text="Screenshot that shows preview data for the AppRequests table." lightbox="media/log-analytics-tutorial/preview-data.png":::

## Write a query

Let's write a query by using the **AppRequests** table. Double-click its name to add it to the query window. You can also type directly in the window. You can even get IntelliSense that will help complete the names of tables in the current scope and Kusto Query Language (KQL) commands.

This is the simplest query that we can write. It just returns all the records in a table. Run it by selecting the **Run** button or by selecting **Shift+Enter** with the cursor positioned anywhere in the query text.

:::image type="content" source="media/log-analytics-tutorial/query-results.png" alt-text="Screenshot that shows query results." lightbox="media/log-analytics-tutorial/query-results.png":::

You can see that we do have results. The number of records that the query has returned appears in the lower-right corner.

### Time range

All queries return records generated within a set time range. By default, the query returns records generated in the last 24 hours.

You can set a different time range by using the [where operator](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor#filter-by-boolean-expression-where-1) in the query. You can also use the **Time range** dropdown list at the top of the screen.

Let's change the time range of the query by selecting **Last 12 hours** from the **Time range** dropdown. Select **Run** to return the results.

> [!NOTE]
> Changing the time range by using the **Time range** dropdown doesn't change the query in the query editor.

:::image type="content" source="media/log-analytics-tutorial/query-time-range.png" alt-text="Screenshot that shows the time range." lightbox="media/log-analytics-tutorial/query-time-range.png":::

### Multiple query conditions

Let's reduce our results further by adding another filter condition. A query can include any number of filters to target exactly the set of records that you want. Select **Get Home/Index** under **Name**, and then select **Apply & Run**.

:::image type="content" source="media/log-analytics-tutorial/query-multiple-filters.png" alt-text="Screenshot that shows query results with multiple filters." lightbox="media/log-analytics-tutorial/query-multiple-filters.png":::

## Analyze results

In addition to helping you write and run queries, Log Analytics provides features for working with the results. Start by expanding a record to view the values for all of its columns.

:::image type="content" source="media/log-analytics-tutorial/expand-query-search-result.png" alt-text="Screenshot that shows a record expanded in the search results." lightbox="media/log-analytics-tutorial/expand-query-search-result.png":::

Select the name of any column to sort the results by that column. Select the filter icon next to it to provide a filter condition. This action is similar to adding a filter condition to the query itself, except that this filter is cleared if the query is run again. Use this method if you want to quickly analyze a set of records as part of interactive analysis.

For example, set a filter on the **DurationMs** column to limit the records to those that took more than **150** milliseconds.

:::image type="content" source="media/log-analytics-tutorial/query-results-filter.png" alt-text="Screenshot that shows a query results filter." lightbox="media/log-analytics-tutorial/query-results-filter.png":::

### Search through query results

Let's search through the query results by using the search box at the top right of the results pane.

Enter **Chicago** in the query results search box, and select the arrows to find all instances of this string in your search results.

:::image type="content" source="media/log-analytics-tutorial/search-query-results.png" alt-text="Screenshot that shows the search box at the top right of the result pane." lightbox="media/log-analytics-tutorial/search-query-results.png":::

### Reorganize and summarize data

To better visualize your data, you can reorganize and summarize the data in the query results based on your needs.

Select **Columns** to the right of the results pane to open the **Columns** sidebar.

:::image type="content" source="media/log-analytics-tutorial/query-results-group-columns.png" alt-text="Screenshot that shows the Column link to the right of the results pane, which you select to open the Columns sidebar." lightbox="media/log-analytics-tutorial/query-results-group-columns.png":::

In the sidebar, you'll see a list of all available columns. Drag the **Url** column into the **Row Groups** section. Results are now organized by that column, and you can collapse each group to help you with your analysis. This action is similar to adding a filter condition to the query, but instead of refetching data from the server, you're processing the data your original query returned. When you run the query again, Log Analytics retrieves data based on your original query. Use this method if you want to quickly analyze a set of records as part of interactive analysis.

:::image type="content" source="media/log-analytics-tutorial/query-results-grouped.png" alt-text="Screenshot that shows query results grouped by URL." lightbox="media/log-analytics-tutorial/query-results-grouped.png":::

### Create a pivot table

To analyze the performance of your pages, create a pivot table.

In the **Columns** sidebar, select **Pivot Mode**.

Select **Url** and **DurationMs** to show the total duration of all calls to each URL.

To view the maximum call duration to each URL, select **sum(DurationMs)** > **max**.

:::image type="content" source="media/log-analytics-tutorial/log-analytics-pivot-table.png" alt-text="Screenshot that shows how to turn on Pivot Mode and configure a pivot table based on the URL and DurationMS values." lightbox="media/log-analytics-tutorial/log-analytics-pivot-table.png":::

Now let's sort the results by longest maximum call duration by selecting the **max(DurationMs)** column in the results pane.

:::image type="content" source="media/log-analytics-tutorial/sort-pivot-table.png" alt-text="Screenshot that shows the query results pane being sorted by the maximum DurationMS values." lightbox="media/log-analytics-tutorial/sort-pivot-table.png":::

## Work with charts

Let's look at a query that uses numerical data that we can view in a chart. Instead of building a query, we'll select an example query.

Select **Queries** on the left pane. This pane includes example queries that you can add to the query window. If you're using your own workspace, you should have various queries in multiple categories. If you're using the demo environment, you might see only a single **Log Analytics workspaces** category. Expand that to view the queries in the category.

Select the query called **Function Error rate** in the **Applications** category. This step adds the query to the query window. Notice that the new query is separated from the other by a blank line. A query in KQL ends when it encounters a blank line, so these are considered separate queries.

:::image type="content" source="media/log-analytics-tutorial/example-query.png" alt-text="Screenshot that shows a new query." lightbox="media/log-analytics-tutorial/example-query.png":::

The current query is the one that the cursor is positioned on. You can see that the first query is highlighted, indicating that it's the current query. Click anywhere in the new query to select it, and then select the **Run** button to run it.

:::image type="content" source="media/log-analytics-tutorial/example-query-output-table.png" alt-text="Screenshot that shows the query results table." lightbox="media/log-analytics-tutorial/example-query-output-table.png":::

To view the results in a graph, select **Chart** on the results pane. Notice that there are various options for working with the chart, such as changing it to another type.

:::image type="content" source="media/log-analytics-tutorial/example-query-output-chart.png" alt-text="Screenshot that shows the query results chart." lightbox="media/log-analytics-tutorial/example-query-output-chart.png":::

## Next steps

Now that you know how to use Log Analytics, complete the tutorial on using log queries:
> [!div class="nextstepaction"]
> [Write Azure Monitor log queries](get-started-queries.md)
