<properties 
	pageTitle="Using Analytics - the powerful search tool of Application Insights" 
	description="Using the Analytics, 
	             the powerful diagnostic search tool of Application Insights. " 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/30/2016" 
	ms.author="awills"/>




# Using Analytics in Application Insights


[Analytics](app-insights-analytics.md) is the powerful search feature of 
[Application Insights](app-insights-overview.md). These pages describe the
 Analytics query lanquage.

[AZURE.INCLUDE [app-insights-analytics-top-index](../../includes/app-insights-analytics-top-index.md)]

## Open Analytics

From your app's home resource in Application Insights, click Analytics.

![Open portal.azure.com, open your Application Insights resource, and click Analytics.](./media/app-insights-analytics/001.png)

The inline tutorial will give you some ideas about what you can do.

There's a [more extensive tour here](app-insights-analytics-tour.md).

## Write queries

Write a query beginning with the names of any of the tables listed on the left. Use `|` to create a pipeline of [operators](app-insights-analytics-queries.md). 


![](./media/app-insights-analytics-using/150.png)

* Don't put blank lines in your query.
* You can use single line breaks in a query.
* You can keep several queries in the window, separated by blank lines.
* To run a query, **place the cursor inside or at the end of it**, and click Go.


![](./media/app-insights-analytics-using/130.png)

* You can save and recall the content of the query window.

![](./media/app-insights-analytics-using/140.png)

## Arranging the results

You can pick the columns you'd like to see. Expand any item to see all the returned column values.

![](./media/app-insights-analytics-using/030.png)

> [AZURE.NOTE] Click the head of a column as a quick way to re-order the results available in the web browser. But be aware that for a large result set, the number of rows downloaded to the browser is limited. So, sorting this way doesn't always show you the actual highest or lowest items. For that, you should use the [top](app-insights-analytics-queries.md#top-operator) or [sort](app-insights-analytics-queries.md#sort-operator) operator. 

But it's good practice to use the [take](app-insights-analytics-queries.md#take-operator), [top](app-insights-analytics-queries.md#top-operator) or [summarize](app-insights-analytics-queries.md#summarize-operator) operators to avoid downloading huge tables from the server. There is anyway an automatic limit of about 10k rows per query.


## Diagrams

Select the type of diagram you'd like:

![](./media/app-insights-analytics-using/230.png)

If you have several columns of the right types, you can choose the x and y axes, and a column of dimensions to split the results by:

![](./media/app-insights-analytics-using/100.png)

By default, results are initially displayed as a table, and you select the diagram manually. But you can use the [render directive](app-insights-analytics-queries.md#render-directive) at the end of a query to select a diagram.

## Export to Excel

After you've run a query, you can download a .csv file. Click **Export, to Excel**.

## Export to Power BI

1. Put the cursor in a query and choose **Export to Power BI**.

    ![](./media/app-insights-analytics-using/240.png)

    This downloads an M script file.

3. Copy the M Language script into the Power BI Desktop advanced query editor.
 * Open the exported file.
 * In Power BI Desktop select: **Get Data, Blank Query, Advanced Editor** and paste the M Language script.

    ![](./media/app-insights-analytics-using/250.png)

4. Edit credentials if needed and now you can build your report.

    ![](./media/app-insights-analytics-using/260.png)



[AZURE.INCLUDE [app-insights-analytics-footer](../../includes/app-insights-analytics-footer.md)]

