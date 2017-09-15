---
title: View or analyze Azure Log Analytics data collected | Microsoft Docs
description: This article includes a tutorial that describes how to create log searches and analyze data stored in your Log Analytics resource using the Log Search portal.  The tutorial includes running some simple queries to return different types of data and analyzing results.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/14/2017
ms.author: magoedte

---
# View or analyze data collected with Log Analytics log search

In Log Analytics you can leverage log searches by constructing queries to analyze the collected data, use pre-existing dashboards which you can customize with graphical views of your most valuable searches.  Now that you have defined collection of operational data from your Azure VMs and Activity Logs, in this tutorial you learn how to:

> [!div class="checklist"]
> * Upgrade your Azure Log Analytics resource to the new query language 
> * Perform a simple search of event data and use features to modify and filter the results 
> * Learn how to work with performance data

To complete the example in this tutorial, you must have an existing virtual machine [connected to the Log Analytics workspace](log-analytics-quick-collect-azurevm.md).  


## Open the Log Search portal 
Start by opening the Log Search portal.   

1. In the Azure portal, click **More services** found on the lower left-hand corner. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.
2. In the Log Analytics subscriptions blade, select a workspace and then select the **Log Search** tile.  

![Log Search button](media/log-analytics-tutorial-viewdata/log-search-tile.png)

You may have noticed the purple banner across the top of your Log Analytics resource page in the portal inviting you to upgrade.<br> ![Log Analytics upgrade notice in the Azure portal](./media/log-analytics-tutorial-viewdata/log-analytics-portal-upgradebanner.png)

Log Analytics recently introduced a new query language to makes it easier to construct queries, correlate data from various sources, and analyze to quickly identify trends or issues.

Upgrading is simple.  Start the process by clicking on the purple banner that says **Learn more and upgrade**.  Read through the additional information about the upgrade on the upgrade information page and then click **Upgrade Now**.

The process will take a few minutes to complete and during this time, you can track its progress under **Notifications** from the menu. You can learn more about the [Benefits of the new query language](log-analytics-log-search-upgrade.md#why-the-new-language).

## Create a simple search
The quickest way to retrieve some data to work with is a simple query that returns all records in table.  If you have any Windows or Linux clients connected to your workspace, then you'll have data in either the Event (Windows) or Syslog (Linux) table.

Type one the following queries in the search box and click the search button.  

```
Event
```
```
Syslog
```

Data is returned in the default list view, and you can see how many total records were returned.

![Simple query](media/log-analytics-tutorial-viewdata/log-analytics-portal-eventlist-01.png)

Only the first few properties of each record are displayed.  Click **show more** to display all properties for a particular record.

## Filter results of the query
On the left side of the screen is the filter pane which allows you to add filtering to the query without modifying it directly.  Several properties of the records returned are displayed with their top ten values with their record count.

If you're working with **Event**, select the checkbox next to **Error** under **EVENTLEVELNAME**.   If you're working with **Syslog**, select the checkbox next to **err** under **SEVERITYLEVEL**.  This changes the query to one of the following to limit the results to error events.

```
Event | where (EventLevelName == "Error")
```
```
Syslog | where (SeverityLevel == "err")
```

![Filter](media/log-analytics-tutorial-viewdata/log-analytics-portal-eventlist-03.png)

Add properties to the filter pane by selecting **Add to filters** from the property menu on one of the records.

![Add to filter menu](media/log-analytics-tutorial-viewdata/log-analytics-portal-eventlist-04.png)

You can set the same filter by selecting **Filter** from the property menu for a record with the value you want to filter.  

You only have the **Filter** option for properties with their name in blue when you hover over them.  These are *searchable* fields which are indexed for search conditions.  Fields in grey are *free text searchable* fields which only have the **Show references** option.  This option returns records that have that value in any property.

You can group the results on a single property by selecting the **Group by** option in the record menu.  This will add a [summarize](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/summarize-operator) operator to your query that displays the results in a chart.  You can group on more than one property, but you would need to edit the query directly.  Select the record menu next the the **Computer** property and select **Group by 'Computer'**.  

![Group by computer](media/log-analytics-tutorial-viewdata/log-analytics-portal-eventlist-05.png)

## Work with results
The Log Search portal has a variety of features for working with the results of a query.  You can sort, filter, and group results to analyze the data without modifying the actual query.  Results of a query are not sorted by default.

To view the data in table form which provides additional options for filtering and sorting, click **Table**.  

![Table view](media/log-analytics-tutorial-viewdata/log-search-portal-table-01.png)

Click the arrow by a record to view the details for that record.

![Sort results](media/log-analytics-tutorial-viewdata/log-search-portal-table-02.png)

Sort on any field by clicking on its column header.

![Sort results](media/log-analytics-tutorial-viewdata/log-search-portal-table-03.png)

Filter the results on a specific value in the column by clicking the filter button and providing a filter condition.

![Filter results](media/log-analytics-tutorial-viewdata/log-search-portal-table-04.png)

Group on a column by dragging its column header to the top of the results.  You can group on multiple fields by dragging multiple columns to the top.

![Group results](media/log-analytics-tutorial-viewdata/log-search-portal-table-05.png)


## Work with performance data
Performance data for both Windows and Linux agents is stored in the Log Analytics workspace in the **Perf** table.  Performance records look just like any other record, and we are going to write a simple query that returns all performance records just like with events.

```
Perf
```

![Performance data](media/log-analytics-tutorial-viewdata/log-analytics-portal-perfsearch-01.png)

Returning millions of records for all performance objects and counters though isn't very useful.  You can use the same methods you used above to filter the data or just type the following query directly into the log search box.  This returns only processor utilization records for both Windows and Linux computers.

```
Perf | where (ObjectName == "Processor")  | where (CounterName == "% Processor Time")
```

![Processor utilization](media/log-analytics-tutorial-viewdata/log-analytics-portal-perfsearch-02.png)

This limits the data to a particular counter, but it still doesn't put it in a form that's particularly useful.  You can display the data in a line chart, but first need to group it by Computer and TimeGenerated.  To group on multiple fields, you need to modify the query directly, so modify the query to the following.  This uses the [avg](https://docs.loganalytics.io/docs/Language-Reference/Aggregation-functions/avg()) function on the **CounterValue** property to calculate the average value over each hour.

```
Perf  | where (ObjectName == "Processor")  | where (CounterName == "% Processor Time") | summarize avg(CounterValue) by Computer, TimeGenerated
```

![Performance data chart](media/log-analytics-tutorial-viewdata/log-analytics-portal-perfsearch-03.png)

Now that the data is suitably grouped, you can display it in a visual chart by adding the [render](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/render-operator) operator.  

```
Perf  | where (ObjectName == "Processor")  | where (CounterName == "% Processor Time") | summarize avg(CounterValue) by Computer, TimeGenerated | render timechart
```

![Line chart](media/log-analytics-tutorial-viewdata/log-analytics-portal-linechart-01.png)

## Next steps
In this tutorial, you learned how to create basic log searches to analyze event and performance data.  Advance to the next tutorial to learn how to visualize the data by creating a dashboard.

> [!div class="nextstepaction"]
> [Log Analytics tutorials](log-analytics-tutorial-dashboards.md)