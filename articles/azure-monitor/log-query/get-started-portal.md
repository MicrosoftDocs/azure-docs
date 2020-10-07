---
title: "Tutorial: Get started with Log Analytics queries"
description: Learn from this tutorial how to write and manage Azure Monitor log queries using Log Analytics in the Azure portal.
ms.subservice: logs
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 03/17/2020

---

# Log Analytics tutorial
Log Analytics is a tool in the Azure portal to edit and run log queries in Azure Monitor Logs and interactively analyze their results. You can use Log Analytics queries to search for terms, identify trends, analyze patterns, and provide many other insights from your data. 

This tutorial walks you through the Log Analytics interface, gets you started with some basic queries, and shows you how you can work with the results. You will learn the following:

> [!div class="checklist"]
> * Understand the log data schema
> * Write and run simple queries, and modify the time range for queries
> * Filter, sort, and group query results
> * View, modify, and share visuals of query results
> * Save, load, export, and copy queries and results

> [!IMPORTANT]
> This tutorial uses features of Log Analytics instead of working with the query itself. you'll leverage Log Analytics features to build one query and use another example query. When you're ready to learn the syntax of queries and start directly editing the query itself, go through the [Kusto Query Language tutorial](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor). That tutorial walks through several example queries that you can edit and run in Log Analytics, leveraging several of the features that you'll learn in this tutorial.


## Prerequisites
To use Log Analytics, you need to be signed in to an Azure account. If you don't have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). To complete most of the steps in this tutorial, you can use the [Log Analytics demo environment](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade). This includes plenty of sample data supporting the sample queries. With the demo environment though, you won't be able to save queries or pin results to a dashboard. You should perform these steps in your own environment.

## Open Log Analytics
Open the [Log Analytics demo environment](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade) or select **Logs** from the Azure Monitor menu. This will set the initial scope to a Log Analytics workspace meaning that your query will select from all data in that workspace. If you select **Logs** from an Azure resource's menu, the scope is set to that resource. See [Log query scope](scope.md) for details about the scope.

You can view the scope in the top left corner of the screen. If you're using your own environment, you'll see an option to select a different scope, but this option isn't available in the demo environment.

[![Scope](media/get-started-portal/scope.png)](media/get-started-portal/scope.png#lightbox)

## Table schema
The left side of the screen includes the **Tables** tab which allows you to inspect the tables that are available in the current scope. These are grouped by **Solution** by default, but you change their grouping or filter them. 

Expand the **Log Management** solution and locate the **AzureActivity** table. You can expand the table to view its schema, or hover over its name to show additional information about it. 

[![Tables view](media/get-started-portal/table-details.png)](media/get-started-portal/table-details.png#lightbox)

Click **Learn more** to go to the table reference that documents each table and its columns. Click **Preview data** to have a quick look at a few recent records in the table to determine 

[![Sample data](media/get-started-portal/sample-data.png)](media/get-started-portal/sample-data.png#lightbox)

## Write a query
Let's go ahead and write a query using the **SecurityEvent** table. Double-click its name to add it to the query window. You can also type directly in the window and even get intellisense that will help complete the names of tables in the current scope and KQL commands.

This is the simplest query that we can write. It just returns all the records in a table. Run it by clicking the **Run** button or by pressing Shift+Enter with the cursor positioned anywhere in the query text.

[![Query results](media/get-started-portal/query-results.png)](media/get-started-portal/query-results.png#lightbox)

You can see that we do have results. The number of records returned by the query is displayed in the bottom right corner. 

## Filter

Let's add a filter to the query to reduce the number of records that are returned. Select the **Filter** tab in the left pane. This shows different columns in the query results that you can use to filter the results. The top values in those columns are displayed with the number of records with that value. Click on **Administrative** under **CategoryValue** and then **Apply & Run**. 

[![Query pane](media/get-started-portal/query-pane.png)](media/get-started-portal/query-pane.png#lightbox)

A **where** statement is added to the query with the value you selected. The results now include only those records with that value so you can see that the record count is reduced.

[![Query results filtered](media/get-started-portal/query-results-filter-01.png)](media/get-started-portal/query-results-filter-01.png#lightbox)


## Time range
All tables in a Log Analytics workspace have a column called **TimeGenerated** which is the time that the record was created. All queries have a time range that limits the results to records with a **TimeGenerated** value within that range. The time range can either be set in the query or with the selector at the top of the screen.

By default, the query will return records form the last 24 hours. Select the **Time range** dropdown and change it to **7 days**. Click **Run** again to return the results. You can see that results are returned, but we have a message here that we're not seeing all of the results. This is because Log Analytics can return a maximum of 10,000 records, and our query returned more records than that. 

[![Time range](media/get-started-portal/query-results-max.png)](media/get-started-portal/query-results-max.png#lightbox)


## Multiple query conditions
Let's reduce our results further by adding another filter condition. A query can include any number of filters to target exactly the set of records that you want. Select **Success** under **ActivityStatusValue** and click **Apply & Run**. 

[![Query results multiple filters](media/get-started-portal/query-results-filter-02.png)](media/get-started-portal/query-results-filter-02.png#lightbox)


## Analyze results
In addition to helping you write and run queries, Log Analytics provides features for working with the results. Start by expanding a record to view the values for all of its columns.

[![Expand record](media/get-started-portal/expand-record.png)](media/get-started-portal/expand-record.png#lightbox)

Click on the name of any column to sort the results by that column. Click on the filter icon next to it to provide a filter condition. This is similar to adding a filter condition to the query itself except that this filter is cleared if the query is run again. Use this method if you want to quickly analyze a set of records as part of interactive analysis.

For example, set a filter on the **CallerIpAddress** column to limit the records to a single caller. 

[![Query results filter](media/get-started-portal/query-results-filter.png)](media/get-started-portal/query-results-filter.png#lightbox)

Instead of filtering the results, you can group records by a particular column. Clear the filter that you just created and then turn on the **Group columns** slider. 

[![Group columns](media/get-started-portal/query-results-group-columns.png)](media/get-started-portal/query-results-group-columns.png#lightbox)

Now drag the **CallerIpAddress** column into the grouping row. Results are now organized by that column, and you can collapse each group to help you with your analysis.

[![Query results grouped](media/get-started-portal/query-results-grouped.png)](media/get-started-portal/query-results-grouped.png#lightbox)

## Work with charts
Let's have a look at a query that uses numerical data that we can view in a chart. Instead of building a query, we'll select an example query.

Click on **Queries** in the left pane. This pane includes example queries that you can add to the query window. If you're using your own workspace, you should have a variety of queries in multiple categories, but if you're using the demo environment, you may only see a single **Log Analytics workspaces** category. Expand that to view the queries in the category.

Click on the query called **Request Count by ResponseCode**. This will add the query to the query window. Notice that the new query is separated from the other by a blank line. A query in KQL ends when it encounters a blank line, so these are seen as separate queries. 

[![Example query](media/get-started-portal/example-query.png)](media/get-started-portal/example-query.png#lightbox)

The current query is the one that the cursor is positioned on. You can see that the first query is highlighted indicating it's the current query. Click anywhere in the new query to select it and then click the **Run** button to run it.





## View and modify charts
You can also see query results in visual formats. Enter the following query as an example:

```Kusto
Event 
| where EventLevelName == "Error" 
| where TimeGenerated > ago(1d) 
| summarize count() by Source 
```

By default, results appear in a table. Select **Chart** above the table to see the results in a graphic view.

![Bar chart](media/get-started-portal/bar-chart.png)

The results appear in a stacked bar chart. Select other options like **Stacked Column** or **Pie** to show other views of the results.

![Pie chart](media/get-started-portal/pie-chart.png)

You can change properties of the view, such as x and y axes, or grouping and splitting preferences, manually from the control bar.

You can also set the preferred view in the query itself, using the [render](/azure/kusto/query/renderoperator) operator.

## Pin results to a dashboard

To pin a results table or chart from Log Analytics to a shared Azure dashboard, select **Pin to dashboard** on the top bar. 

![Pin to dashboard](media/get-started-portal/pin-dashboard.png)

In the **Pin to another dashboard** pane, select or create a shared dashboard to pin to, and select **Apply**. The table or chart appears on the selected Azure dashboard.

![Chart pinned to dashboard](media/get-started-portal/pin-dashboard2.png)

A table or chart that you pin to a shared dashboard has the following simplifications: 

- Data is limited to the past 14 days.
- A table shows only up to four columns and the top seven rows.
- Charts with many discrete categories automatically group less populated categories into a single **others** bin.

## Save, load, or export queries

Once you create a query, you can save or share the query or results with others. 

### Save queries

To save a query:

1. Select **Save** on the top bar.
   
1. In the **Save** dialog, give the query a **Name**, using the characters a–z, A–Z, 0-9, space, hyphen, underscore, period, parenthesis, or pipe. 
   
1. Select whether to save the query as a **Query** or a **Function**. Functions are queries that other queries can reference. 
   
   To save a query as a function, provide a **Function Alias**, which is a short name for other queries to use to call this query.
   
1. If you are in a Log Analytics workspace, provide a **Category** for **Query explorer** to use for the query. (Categories aren't available for Applications Insights queries)
   
1. Select **Save**.
   
   ![Save function](media/get-started-portal/save-function.png)

### Load queries
To load a saved query, select **Query explorer** at upper right. The **Query explorer** pane opens, listing all queries by category. Expand the categories or enter a query name in the search bar, then select a query to load it into the **Query editor**. You can mark a query as a **Favorite** by selecting the star next to the query name.

![Query explorer](media/get-started-portal/query-explorer.png)

### Export and share queries
To export a query, select **Export** on the top bar, and then select **Export to CSV - all columns**, **Export to CSV - displayed columns**, or **Export to Power BI (M query)** from the dropdown list.

The following video shows you how to integrate Log Analytics with Excel.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4Asme]

To share a link to a query, select **Copy link** on the top bar, and then select **Copy link to query**, **Copy query text**, or **Copy query results** to copy to the clipboard. You can send the query link to others who have access to the same workspace.

## Next steps

Advance to the next tutorial to learn more about writing Azure Monitor log queries.
> [!div class="nextstepaction"]
> [Write Azure Monitor log queries](get-started-queries.md)
