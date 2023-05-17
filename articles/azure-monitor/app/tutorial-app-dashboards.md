---
title: Create custom dashboards in Application Insights | Microsoft Docs
description: This tutorial shows you how to create custom KPI dashboards using Application Insights.
ms.topic: tutorial
ms.date: 11/15/2022
ms.custom: mvc, contperf-fy21q1
ms.reviewer: vitalyg
---

# Create custom KPI dashboards using Application Insights

You can create multiple dashboards in the Azure portal that include tiles visualizing data from multiple Azure resources across different resource groups and subscriptions. You can pin different charts and views from Application Insights to create custom dashboards that provide you with a complete picture of the health and performance of your application. This tutorial walks you through the creation of a custom dashboard that includes multiple types of data and visualizations from Application Insights.

 You learn how to:

> [!div class="checklist"]
> * Create a custom dashboard in Azure.
> * Add a tile from the **Tile Gallery**.
> * Add standard metrics in Application Insights to the dashboard.
> * Add a custom metric chart based on Application Insights to the dashboard.
> * Add the results of a Log Analytics query to the dashboard.

## Prerequisites

To complete this tutorial:

- Deploy a .NET application to Azure.
- Enable the [Application Insights SDK](../app/asp-net.md).

> [!NOTE]
> Required permissions for working with dashboards are discussed in the article on [understanding access control for dashboards](../../azure-portal/azure-portal-dashboard-share-access.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a new dashboard

> [!WARNING]
> If you move your Application Insights resource over to a different resource group or subscription, you'll need to manually update the dashboard by removing the old tiles and pinning new tiles from the same Application Insights resource at the new location.

A single dashboard can contain resources from multiple applications, resource groups, and subscriptions. Start the tutorial by creating a new dashboard for your application.

1. In the menu dropdown on the left in the Azure portal, select **Dashboard**.

    :::image type="content" source="media/tutorial-app-dashboards/dashboard-from-menu.png" lightbox="media/tutorial-app-dashboards/dashboard-from-menu.png" alt-text="Screenshot that shows the Azure portal menu dropdown.":::

1. On the **Dashboard** pane, select **New dashboard** > **Blank dashboard**.

   :::image type="content" source="media/tutorial-app-dashboards/new-dashboard.png" lightbox="media/tutorial-app-dashboards/new-dashboard.png" alt-text="Screenshot that shows the Dashboard pane.":::

1. Enter a name for the dashboard.
1. Look at the **Tile Gallery** for various tiles that you can add to your dashboard. You can also pin charts and other views directly from Application Insights to the dashboard.
1. Locate the **Markdown** tile and drag it on to your dashboard. With this tile, you can add text formatted in Markdown, which is ideal for adding descriptive text to your dashboard. To learn more, see [Use a Markdown tile on Azure dashboards to show custom content](../../azure-portal/azure-portal-markdown-tile.md).
1. Add text to the tile's properties and resize it on the dashboard canvas.

    [:::image type="content" source="media/tutorial-app-dashboards/markdown.png" lightbox="media/tutorial-app-dashboards/markdown.png" alt-text="Screenshot that shows the Edit Markdown tile.":::

1. Select **Done customizing** at the top of the screen to exit tile customization mode.

## Add health overview

A dashboard with static text isn't very interesting, so add a tile from Application Insights to show information about your application. You can add Application Insights tiles from the **Tile Gallery**. You can also pin them directly from Application Insights screens. In this way, you can configure charts and views that you're already familiar with before you pin them to your dashboard.

Start by adding the standard health overview for your application. This tile requires no configuration and allows minimal customization in the dashboard.

1. Select your **Application Insights** resource on the home screen.
1. On the **Overview** pane, select the pin icon :::image type="content" source="media/tutorial-app-dashboards/pushpin.png" lightbox="media/tutorial-app-dashboards/pushpin.png" alt-text="pin icon"::: to add the tile to a dashboard.
1. On the **Pin to dashboard** tab, select which dashboard to add the tile to or create a new one.
1. At the top right, a notification appears that your tile was pinned to your dashboard. Select **Pinned to dashboard** in the notification to return to your dashboard or use the **Dashboard** pane.
1. Select **Edit** to change the positioning of the tile you added to your dashboard. Select and drag it into position and then select **Done customizing**. Your dashboard now has a tile with some useful information.

    [:::image type="content" source="media/tutorial-app-dashboards/dashboard-edit-mode.png" lightbox="media/tutorial-app-dashboards/dashboard-edit-mode.png" alt-text="Screenshot that shows the dashboard in edit mode.":::

## Add custom metric chart

You can use the **Metrics** panel to graph a metric collected by Application Insights over time with optional filters and grouping. Like everything else in Application Insights, you can add this chart to the dashboard. This step does require you to do a little customization first.

1. Select your **Application Insights** resource on the home screen.
1. Select **Metrics**.
1. An empty chart appears, and you're prompted to add a metric. Add a metric to the chart and optionally add a filter and a grouping. The following example shows the number of server requests grouped by success. This chart gives a running view of successful and unsuccessful requests.

	[:::image type="content" source="media/tutorial-app-dashboards/metrics.png" lightbox="media/tutorial-app-dashboards/metrics.png" alt-text="Screenshot that shows adding a metric.":::

1. Select **Pin to dashboard** on the right.

1. In the top right, a notification appears that your tile was pinned to your dashboard. Select **Pinned to dashboard** in the notification to return to your dashboard or use the dashboard tab.

1. That tile is now added to your dashboard. Select **Edit** to change the positioning of the tile. Select and drag the tile into position and then select **Done customizing**.

## Add a logs query

Application Insights Logs provides a rich query language that you can use to analyze all the data collected by Application Insights. Like with charts and other views, you can add the output of a logs query to your dashboard.

1. Select your **Application Insights** resource in the home screen.
1. On the left under **Monitoring**, select **Logs** to open the **Logs** tab.
1. Enter the following query, which returns the top 10 most requested pages and their request count:

    ``` Kusto
	requests
	| summarize count() by name
	| sort by count_ desc
	| take 10
    ```

1. Select **Run** to validate the results of the query.
1. Select the pin icon :::image type="content" source="media/tutorial-app-dashboards/pushpin.png" lightbox="media/tutorial-app-dashboards/pushpin.png" alt-text="Pin icon"::: and then select the name of your dashboard.

1. Before you go back to the dashboard, add another query, but render it as a chart. Now you'll see the different ways to visualize a logs query in a dashboard. Start with the following query that summarizes the top 10 operations with the most exceptions:

    ``` Kusto
	exceptions
	| summarize count() by operation_Name
	| sort by count_ desc
	| take 10
    ```

1. Select **Chart** and then select **Doughnut** to visualize the output.

	[:::image type="content" source="media/tutorial-app-dashboards/logs-doughnut.png" lightbox="media/tutorial-app-dashboards/logs-doughnut.png" alt-text="Screenshot that shows the doughnut chart with the preceding query.":::

1. Select the pin icon :::image type="content" source="media/tutorial-app-dashboards/pushpin.png" lightbox="media/tutorial-app-dashboards/pushpin.png" alt-text="Pin icon"::: at the top right to pin the chart to your dashboard. Then return to your dashboard.
1. The results of the queries are added to your dashboard in the format that you selected. Select and drag each result into position. Then select **Done customizing**.
1. Select the pencil icon :::image type="content" source="media/tutorial-app-dashboards/pencil.png" lightbox="media/tutorial-app-dashboards/pencil.png" alt-text="Pencil icon"::: on each title and use it to make the titles descriptive.

## Share dashboard

1. At the top of the dashboard, select **Share** to publish your changes.
1. You can optionally define specific users who should have access to the dashboard. For more information, see [Share Azure dashboards by using Azure role-based access control](../../azure-portal/azure-portal-dashboard-share-access.md).
1. Select **Publish**.

## Next steps

In this tutorial, you learned how to create custom dashboards. Now look at the rest of the Application Insights documentation, which also includes a case study.

> [!div class="nextstepaction"]
> [Deep diagnostics](../app/devops.md)
