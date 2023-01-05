---
title: Understand your customers in Application Insights | Microsoft Docs
description: Tutorial on how to use Application Insights to understand how customers are using your application.
ms.topic: tutorial
ms.date: 07/30/2021
ms.custom: mvc
ms.reviewer: vitalyg
---

# Use Application Insights to understand how customers use your application

 Application Insights collects usage information to help you understand how your users interact with your application. This tutorial walks you through the different resources that are available to analyze this information.

You'll learn how to:

> [!div class="checklist"]
> * Analyze details about users who access your application.
> * Use session information to analyze how customers use your application.
> * Define funnels that let you compare your desired user activity to their actual activity.
> * Create a workbook to consolidate visualizations and queries into a single document.
> * Group similar users to analyze them together.
> * Learn which users are returning to your application.
> * Inspect how users move through your application.

## Prerequisites

To complete this tutorial:

- Install [Visual Studio 2019](https://www.visualstudio.com/downloads/) with the following workloads:
	- ASP.NET and web development.
	- Azure development.
- Download and install the [Visual Studio Snapshot Debugger](https://aka.ms/snapshotdebugger).
- Deploy a .NET application to Azure and [enable the Application Insights SDK](../app/asp-net.md).
- [Send telemetry from your application](../app/usage-overview.md#send-telemetry-from-your-app) for adding custom events/page views.
- Send [user context](./usage-overview.md) to track what a user does over time and fully utilize the usage features.

## Sign in to Azure
Sign in to the [Azure portal](https://portal.azure.com).

## Get information about your users
The **Users** pane helps you to understand important details about your users in various ways. You can use this pane to understand information like where your users are connecting from, details of their client, and what areas of your application they're accessing.

1. In your Application Insights resource, under **Usage**, select **Users**.
1. The default view shows the number of unique users that have connected to your application over the past 24 hours. You can change the time window and set various other criteria to filter this information.

1. Select the **During** dropdown list and change the time window to **7 days**. This setting increases the data included in the different charts in the pane.

1. Select the **Split by** dropdown list to add a breakdown by a user property to the graph. Select **Country or region**. The graph includes the same data, but you can use it to view a breakdown of the number of users for each country/region.

      :::image type="content" source="./media/tutorial-users/user-1.png" alt-text="Screenshot that shows the User tab's query builder." lightbox="./media/tutorial-users/user-1.png":::

1. Position the cursor over different bars in the chart and note that the count for each country/region reflects only the time window represented by that bar.
1. Select **View More Insights** for more information.

      :::image type="content" source="./media/tutorial-users/user-2.png" alt-text="Screenshot that shows the User tab of view more insights." lightbox="./media/tutorial-users/user-2.png":::

## Analyze user sessions
The **Sessions** pane is similar to the **Users** pane. **Users** helps you understand details about the users who access your application. **Sessions** helps you understand how those users used your application.

1. Under **Usage**, select **Sessions**.
1. Look at the graph and note that you have the same options to filter and break down the data as in the **Users** pane.

     :::image type="content" source="./media/tutorial-users/sessions.png" alt-text="Screenshot that shows the Sessions tab with a bar chart displayed." lightbox="./media/tutorial-users/sessions.png":::

1. To view the sessions timeline, select **View More Insights**. Under **Active Sessions**, select **View session timeline** on one of the timelines. The **Session Timeline** pane shows every action in the sessions. This information can help you identify examples like sessions with a large number of exceptions.

     :::image type="content" source="./media/tutorial-users/timeline.png" alt-text="Screenshot that shows the Sessions tab with a timeline selected." lightbox="./media/tutorial-users/timeline.png":::

## Group together similar users
A cohort is a set of users grouped by similar characteristics. You can use cohorts to filter data in other panes so that you can analyze particular groups of users. For example, you might want to analyze only users who completed a purchase.

1. On the **Users**, **Sessions**, or **Events** tab, select **Create a Cohort**.

1. Select a template from the gallery.

    :::image type="content" source="./media/tutorial-users/cohort.png" alt-text="Screenshot that shows the template gallery for cohorts." lightbox="./media/tutorial-users/cohort.png":::
1. Edit your cohort and select **Save**.
1. To see your cohort, select it from the **Show** dropdown list.

    :::image type="content" source="./media/tutorial-users/cohort-2.png" alt-text="Screenshot that shows the Show dropdown, showing a cohort." lightbox="./media/tutorial-users/cohort-2.png":::

## Compare desired activity to reality
The previous panes are focused on what users of your application did. The **Funnels** pane focuses on what you want users to do. A funnel represents a set of steps in your application and the percentage of users who move between steps.

For example, you could create a funnel that measures the percentage of users who connect to your application and search for a product. You can then see the percentage of users who add that product to a shopping cart. You can also see the percentage of customers who complete a purchase.

1. Select **Funnels** > **Edit**.

1. Create a funnel with at least two steps by selecting an action for each step. The list of actions is built from usage data collected by Application Insights.

    :::image type="content" source="./media/tutorial-users/funnel.png" alt-text="Screenshot that shows the Funnel tab and selecting steps on the edit tab." lightbox="./media/tutorial-users/funnel.png":::

1. Select the **View** tab to see the results. The window to the right shows the most common events before the first activity and after the last activity to help you understand user tendencies around the particular sequence.

     :::image type="content" source="./media/tutorial-users/funnel-2.png" alt-text="Screenshot that shows the funnel tab on view." lightbox="./media/tutorial-users/funnel-2.png":::

1. To save the funnel, select **Save**.

## Learn which customers return

Retention helps you understand which users are coming back to your application.

1. Select **Retention** > **Retention Analysis Workbook**.
1. By default, the analyzed information includes users who performed an action and then returned to perform another action. For example, you can change this filter to include only those users who returned after they completed a purchase.

      :::image type="content" source="./media/tutorial-users/retention.png" alt-text="Screenshot that shows a graph for users that match the criteria set for a retention filter." lightbox="./media/tutorial-users/retention.png":::

1. The returning users that match the criteria are shown in graphical and table form for different time durations. The typical pattern is for a gradual drop in returning users over time. A sudden drop from one time period to the next might raise a concern.

      :::image type="content" source="./media/tutorial-users/retention-2.png" alt-text="Screenshot that shows the retention workbook with the User returned after # of weeks chart." lightbox="./media/tutorial-users/retention-2.png":::

## Analyze user movements
A user flow visualizes how users move between the pages and features of your application. The flow helps you answer questions like where users typically move from a particular page, how they usually exit your application, and if there are any actions that are regularly repeated.

1. Select **User flows** on the menu.
1. Select **New** to create a new user flow. Select **Edit** to edit its details.
1. Increase **Time Range** to **7 days** and then select an initial event. The flow will track user sessions that start with that event.

     :::image type="content" source="./media/tutorial-users/flowsedit.png" alt-text="Screenshot that shows how to create a new user flow." lightbox="./media/tutorial-users/flowsedit.png":::

1. The user flow is displayed, and you can see the different user paths and their session counts. Blue lines indicate an action that the user performed after the current action. A red line indicates the end of the user session.

   :::image type="content" source="./media/tutorial-users/flows.png" alt-text="Screenshot that shows the display of user paths and session counts for a user flow." lightbox="./media/tutorial-users/flows.png":::

1. To remove an event from the flow, select the **X** in the upper-right corner of the action. Then select **Create Graph**. The graph is redrawn with any instances of that event removed. Select **Edit** to see that the event is now added to **Excluded events**.

    :::image type="content" source="./media/tutorial-users/flowsexclude.png" alt-text="Screenshot that shows the list of excluded events for a user flow." lightbox="./media/tutorial-users/flowsexclude.png":::

## Consolidate usage data
Workbooks combine data visualizations, Log Analytics queries, and text into interactive documents. You can use workbooks to:
- Group together common usage information.
- Consolidate information from a particular incident.
- Report back to your team on your application's usage.

1. Select **Workbooks** on the menu.
1. Select **New** to create a new workbook.
1. A query that's provided includes all usage data in the last day displayed as a bar chart. You can use this query, manually edit it, or select **Samples** to select from other useful queries.

    :::image type="content" source="./media/tutorial-users/sample-queries.png" alt-text="Screenshot that shows the sample button and list of sample queries that you can use." lightbox="./media/tutorial-users/sample-queries.png":::

1. Select **Done editing**.
1. Select **Edit** in the top pane to edit the text at the top of the workbook. Formatting is done by using Markdown.

1. Select **Add users** to add a graph with user information. Edit the details of the graph if you want. Then select **Done editing** to save it.

To learn more about workbooks, see the [workbooks overview](../visualize/workbooks-overview.md).

## Next steps
You've learned how to analyze your users. In the next tutorial, you'll learn how to create custom dashboards that combine this information with other useful data about your application.

> [!div class="nextstepaction"]
> [Create custom dashboards](./tutorial-app-dashboards.md)