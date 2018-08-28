---
title: Create custom dashboards in Azure Application Insights | Microsoft Docs
description: Tutorial to create custom KPI dashboards using Azure Application Insights.
keywords:
services: application-insights
author: mrbullwinkle
ms.author: mbullwin
ms.date: 09/20/2017
ms.service: application-insights
ms.custom: mvc
ms.topic: tutorial
manager: carmonm
---

# Create custom KPI dashboards using Azure Application Insights

You can create multiple dashboards in the Azure portal that each include tiles visualizing data from multiple Azure resources across different resource groups and subscriptions.  You can pin different charts and views from Azure Application Insights to create custom dashboards that provide you with complete picture of the health and performance of your application.  This tutorial walks you through the creation of a custom dashboard that includes multiple types of data and visualizations from Azure Application Insights.  You learn how to:

> [!div class="checklist"]
> * Create a custom dashboard in Azure
> * Add a tile from the Tile Gallery
> * Add standard metrics in Application Insights to the dashboard 
> * Add a custom metric chart Application Insights to the dashboard
> * Add the results of an Analytics query to the dashboard 



## Prerequisites

To complete this tutorial:

- Deploy a .NET application to Azure and [enable the Application Insights SDK](app-insights-asp-net.md). 

## Log in to Azure
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a new dashboard
A single dashboard can contain resources from multiple applications, resource groups, and subscriptions.  Start the tutorial by creating a new dashboard for your application.  

2.  On the main screen of the portal, select **New dashboard**.

	![New dashboard](media/app-insights-tutorial-dashboards/new-dashboard.png)

3. Type a name for the dashboard.
4. Have a look at the **Tile Gallery** for a variety of tiles that you can add to your dashboard.  In addition to adding tiles from the gallery you can pin charts and other views directly from Application Insights to the dashboard.
5. Locate the **Markdown** tile and drag it on to your dashboard.  This tile allows you to add text formatted in markdown which is ideal for adding descriptive text to your dashboard.
6. Add text to the tile's properties and resize it on the dashboard canvas.
	
	![Edit markdown tile](media/app-insights-tutorial-dashboards/edit-markdown.png)

6. Click **Done customizing** at the top of the screen to exit tile customization mode and then **Publish changes** to save your changes.

	![Dashboard with markdown tile](media/app-insights-tutorial-dashboards/dashboard-01.png)


## Add health overview
A dashboard with just static text isn't very interesting, so now add a tile from Application Insights to show information about your application.  You can add Application Insights tiles from the Tile Gallery, or you can pin them directly from Application Insights screens.  This allows you to configure charts and views that you're already familiar with before pinning them to your dashboard.  Start by adding the standard health overview for your application.  This requires no configuration and allows minimal customization in the dashboard.


1. Select **Application Insights** in the Azure menu and then select your application.
2. In the **Overview timeline**, select the context menu and click **Pin to dashboard**.  This adds the tile to the last dashboard that you were viewing.  

	![Pin Overview timeline](media/app-insights-tutorial-dashboards/pin-overview-timeline.png)
 
3. At the top of the screen, click **View dashboard** to return to your dashboard.
4. The Overview timeline is now added to your dashboard.  Click and drag it into position and then click **Done customizing** and **Publish changes**.  Your dashboard now has a tile with some useful information.

	![Dashboard with Overview timeline](media/app-insights-tutorial-dashboards/dashboard-02.png)



## Add custom metric chart
The **Metrics** panel allows you to graph a metric collected by Application Insights over time with optional filters and grouping.  Like everything else in Application Insights, you can add this chart to the dashboard.  This does require you to do a little customization first.

1. Select **Application Insights** in the Azure menu and then select your application.
1. Select **Metrics**.  
2. An empty chart has already been created, and you're prompted to add a metric.  Add a metric to the chart and optionally add a filter and a grouping.  The example below shows the number of server requests grouped by success.  This gives a running view of successful and unsuccessful requests.

	![Add metric](media/app-insights-tutorial-dashboards/metrics-chart.png)

4. Select the context menu for the chart and select **Pin to dashboard**.  This adds the view to the last dashboard that you were working with.

	![Pin metric chart](media/app-insights-tutorial-dashboards/pin-metrics-chart.png)

3. At the top of the screen, click **View dashboard** to return to your dashboard.

4. The Timeline Metrics Chart is now added to your dashboard. Click and drag it into position and then click **Done customizing** and then **Publish changes**. 

	![Dashboard with metrics](media/app-insights-tutorial-dashboards/dashboard-03.png)


## Metrics Explorer
**Metrics Explorer** is similar to Metrics although it allows significantly more customization when added to the dashboard.  Which you use to graph your metrics depends on your particular preference and requirements.

1. Select **Application Insights** in the Azure menu and then select your application.
1. Select **Metrics Explorer**. 
2. Click to edit the chart and select one or more metrics and optionally a detailed configuration.  The example displays a line chart tracking average page response time.
3. Click the pin icon in the top right to add the chart to your dashboard and then drag it into position.

	![Metrics Explorer](media/app-insights-tutorial-dashboards/metrics-explorer.png)

4. The Metrics Explorer tile allows more customization once it's added to the dashboard.  Right click the tile and select **Edit title** to add a custom title.  Go ahead and make other customizations if you want.

	![Dashboard with metrics explorer](media/app-insights-tutorial-dashboards/dashboard-04a.png)

5. You now have the Metrics Explorer chart added to your dashboard.

	![Dashboard with metrics explorer](media/app-insights-tutorial-dashboards/dashboard-04.png)

## Add Analytics query
Azure Application Insights Analytics provides a rich query language that allows you to analyze all of the data collected Application Insights.  Just like charts and other views, you can add the output of an Analytics query to your dashboard.   

Since Azure Applications Insights Analytics is a separate service, you need to share your dashboard for it to include an Analytics query.  When you share an Azure dashboard, you publish it as an Azure resource which can make it available to other users and resources.  

1. At the top of the dashboard screen, click **Share**.

	![Publish dashboard](media/app-insights-tutorial-dashboards/publish-dashboard.png)

2. Keep the **Dashboard name** the same and select the **Subscription Name** to share the dashboard.  Click **Publish**.  The dashboard is now available to other services and subscriptions.  You can optionally define specific users who should have access to the dashboard.
1. Select **Application Insights** in the Azure menu and then select your application.
2. Click **Analytics** at the top of the screen to open the Analytics portal.

	![Start Analytics](media/app-insights-tutorial-dashboards/start-analytics.png)

3. Type the following query, which returns the top 10 most requested pages and their request count:

	```
	requests
	| summarize count() by name
	| sort by count_ desc
	| take 10 
	```

4. Click **Go** to validate the results of the query.
5. Click the pin icon and select the name of your dashboard.  The reason that this option has you select a dashboard unlike the previous steps where the last dashboard was used is because the Analytics console is a separate service and needs to select from all available shared dashboards.

	![Pin Analytics query](media/app-insights-tutorial-dashboards/analytics-pin.png)

5. Before you go back to the dashboard, add another query, but this time render it as a chart so you see the different ways to visualize an Analytics query in a dashboard.  Start with the following query that summarizes the top 10 operations with the most exceptions.

	```
	exceptions
	| summarize count() by operation_Name
	| sort by count_ desc
	| take 10 
	```

6. Select **Chart** and then change to a **Doughnut** to visualize the output.

	![Analytics chart](media/app-insights-tutorial-dashboards/analytics-chart.png)

6. Click the pin icon to pin the chart to your dashboard and this time select the link to return to your dashboard.
4. The results of the queries are now added to your dashboard in the format that you selected.  Click and drag each into position and then click **Done editing**.
5. Right click each of the tiles and select **Edit Title** to give them a descriptive title.

	![Dashboard with Analytics](media/app-insights-tutorial-dashboards/dashboard-05.png)

5. Click **Publish changes** to commit the changes to your dashboard that now includes a variety of charts and visualizations from Application Insights.


## Next steps
Now that you've learned how to create custom dashboards, have a look at the rest of the Application Insights documentation including a case study.

> [!div class="nextstepaction"]
> [Deep diagnostics](app-insights-devops.md)
