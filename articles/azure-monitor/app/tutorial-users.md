---
title: Understand your customers in  Application Insights | Microsoft Docs
description: Tutorial on using Application Insights to understand how customers are using your application.

ms.topic: tutorial
author: lgayhardt
ms.author: lagayhar
ms.date: 07/30/2021

ms.custom: mvc
---

# Use Azure Application Insights to understand how customers are using your application

 Application Insights collects usage information to help you understand how your users interact with your application.  This tutorial walks you through the different resources that are available to analyze this information.  You'll learn how to:

> [!div class="checklist"]
> * Analyze details about users accessing your application
> * Use session information to analyze how customers use your application
> * Define funnels that let you compare your desired user activity to their actual activity 
> * Create a workbook to consolidate visualizations and queries into a single document
> * Group similar users to analyze them together
> * Learn which users are returning to your application
> * Inspect how users navigate through your application


## Prerequisites

To complete this tutorial:

- Install [Visual Studio 2019](https://www.visualstudio.com/downloads/) with the following workloads:
	- ASP.NET and web development
	- Azure development
- Download and install the [Visual Studio Snapshot Debugger](https://aka.ms/snapshotdebugger).
- Deploy a .NET application to Azure and [enable the Application Insights SDK](../app/asp-net.md). 
- [Send telemetry from your application](../app/usage-overview.md#send-telemetry-from-your-app) for adding custom events/page views
- Send [user context](./usage-overview.md) to track what a user does over time and fully utilize the usage features.

## Log in to Azure
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Get information about your users
The **Users** panel allows you to understand important details about your users in a variety of ways. You can use this panel to understand such information as where your users are connecting from, details of their client, and what areas of your application they're accessing. 

1. In your Application Insights resource under *Usage*, select **Users** in the menu.
2. The default view shows the number of unique users that have connected to your application over the past 24 hours.  You can change the time window and set various other criteria to filter this information.

3. Click the **During** dropdown and change the time window to 7 days.  This increases the data included in the different charts in the panel.

4. Click the **Split by** dropdown to add a breakdown by a user property to the graph.  Select **Country or region**.  The graph includes the same data but allows you to view a breakdown of the number of users for each country/region.

      :::image type="content" source="./media/tutorial-users/user-1.png" alt-text="Screenshot of the User tab's query builder." lightbox="./media/tutorial-users/user-1.png":::

5. Position the cursor over different bars in the chart and note that the count for each country/region reflects only the time window represented by that bar.
6. Select **View More Insights** for more information. 

      :::image type="content" source="./media/tutorial-users/user-2.png" alt-text="Screenshot of the User tab of view more insights." lightbox="./media/tutorial-users/user-2.png":::


## Analyze user sessions
The **Sessions** panel is similar to the **Users** panel.  Where **Users** helps you understand details about the users accessing your application, **Sessions** helps you understand how those users used your application.  

1. User *Usage*, select **Sessions**.
2. Have a look at the graph and note that you have the same options to filter and break down the data as in the **Users** panel.

     :::image type="content" source="./media/tutorial-users/sessions.png" alt-text="Screenshot of the Sessions tab with a bar chart displayed." lightbox="./media/tutorial-users/sessions.png":::

4. To view the sessions timeline, select **View More Insights** then under active sessions select **View session timeline** on one of the timelines. Session Timeline shows every action in the sessions. This can help you identify information such as the sessions with a large number of exceptions.

     :::image type="content" source="./media/tutorial-users/timeline.png" alt-text="Screenshot of the Sessions tab with a timeline selected." lightbox="./media/tutorial-users/timeline.png":::

## Group together similar users
A **Cohort** is a set of users grouped on similar characteristics.  You can use cohorts to filter data in other panels allowing you to analyze particular groups of users.  For example, you might want to analyze only users who completed a purchase.

1.  Select **Create a Cohort** at the top of one of the usage tabs ( Users, Sessions, Events and so on).

1.  Select a template from the gallery.

    :::image type="content" source="./media/tutorial-users/cohort.png" alt-text="Screenshot of the template gallery for cohorts." lightbox="./media/tutorial-users/cohort.png":::
1.  Edit your Cohort then select **save**.
1.  To see your Cohort select it from the **Show** dropdown menu. 

    :::image type="content" source="./media/tutorial-users/cohort-2.png" alt-text="Screenshot of the Show dropdown, showing a cohort." lightbox="./media/tutorial-users/cohort-2.png":::


## Compare desired activity to reality
While the previous panels are focused on what users of your application did, **Funnels** focus on what you want users to do.  A funnel represents a set of steps in your application and the percentage of users who move between steps.  For example, you could create a funnel that measures the percentage of users who connect to your application who search product.  You can then see the percentage of users who add that product to a shopping cart, and then the percentage of those who complete a purchase.

1. Select **Funnels** in the menu and then select **Edit**. 

3. Create a funnel with at least two steps by selecting an action for each step.  The list of actions is built from usage data collected by Application Insights.

    :::image type="content" source="./media/tutorial-users/funnel.png" alt-text="Screenshot of the Funnel tab and selecting steps on the edit tab." lightbox="./media/tutorial-users/funnel.png":::

4. Select the **View** tab to see the results. The window to the right shows the most common events before the first activity and after the last activity to help you understand user tendencies around the particular sequence.

     :::image type="content" source="./media/tutorial-users/funnel-2.png" alt-text="Screenshot of the funnel tab on view." lightbox="./media/tutorial-users/funnel-2.png":::

4. To save the funnel, select **Save**. 

## Learn which customers return

**Retention** helps you understand which users are coming back to your application.  

1. Select **Retention** in the menu, then *Retention Analysis Workbook.
2. By default, the analyzed information includes users who performed any action and then returned to perform any action.  You can change this filter to any include, for example, only those users who returned after completing a purchase.

      :::image type="content" source="./media/tutorial-users/retention.png" alt-text="Screenshot showing a graph for users that match the criteria set for a retention filter." lightbox="./media/tutorial-users/retention.png":::

3. The returning users that match the criteria are shown in graphical and table form for different time durations. The typical pattern is for a gradual drop in returning users over time.  A sudden drop from one time period to the next might raise a concern. 

      :::image type="content" source="./media/tutorial-users/retention-2.png" alt-text="Screenshot of the retention workbook, showing user return after # of weeks chart." lightbox="./media/tutorial-users/retention-2.png":::

## Analyze user navigation
A **User flow** visualizes how users navigate between the pages and features of your application.  This helps you answer questions such as where users typically move from a particular page, how they typically exit your application, and if there are any actions that are regularly repeated.

1.  Select **User flows** in the menu.
2.  Click **New** to create a new user flow and then select **Edit** to edit its details.
3.  Increase the **Time Range** to 7 days and then select an initial event.  The flow will track user sessions that start with that event.

     :::image type="content" source="./media/tutorial-users/flowsedit.png" alt-text="Screenshot showing how to create a new user flow." lightbox="./media/tutorial-users/flowsedit.png":::
    
4.  The user flow is displayed, and you can see the different user paths and their session counts.  Blue lines indicate an action that the user performed after the current action.  A red line indicates the end of the user session.

   :::image type="content" source="./media/tutorial-users/flows.png" alt-text="Screenshot showing the display of user paths and session counts for a user flow." lightbox="./media/tutorial-users/flows.png":::

5.  To remove an event from the flow, select the **x** in the corner of the action and then select **Create Graph**.  The graph is redrawn with any instances of that event removed. Select **Edit** to see that the event is now added to **Excluded events**.

    :::image type="content" source="./media/tutorial-users/flowsexclude.png" alt-text="Screenshot showing the list of excluded events for a user flow." lightbox="./media/tutorial-users/flowsexclude.png":::

## Consolidate usage data
**Workbooks** combine data visualizations, Analytics queries, and text into interactive documents.  You can use workbooks to group together common usage information, consolidate information from a particular incident, or report back to your team on your application's usage.

1.  Select **Workbooks** in the menu.
2.  Select **New** to create a new workbook.
3.  A query is already provided that includes all usage data in the last day displayed as a bar chart.  You can use this query, manually edit it, or select **Samples** to select from other useful queries.

    :::image type="content" source="./media/tutorial-users/sample-queries.png" alt-text="Screenshot showing the sample button and list of sample queries that you can use." lightbox="./media/tutorial-users/sample-queries.png":::

4.  Select **Done editing**.
5.  Select **Edit** in the top pane to edit the text at the top of the workbook.  This is formatted using markdown.

6.  Select **Add users** to add a graph with user information.  Edit the details of the graph if you want and then select **Done editing** to save it.

To learn more about workbooks, visit [the workbooks overview](../visualize/workbooks-overview.md).

## Next steps
Now that you've learned how to analyze your users, advance to the next tutorial to learn how to create custom dashboards that combine this information with other useful data about your application.

> [!div class="nextstepaction"]
> [Create custom dashboards](./tutorial-app-dashboards.md)