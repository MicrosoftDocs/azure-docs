---
title: Analyze web app user retention with Application Insights
description: How many users return to your app?
ms.topic: conceptual
ms.date: 07/30/2021
ms.reviewer: mmcc
---

# User retention analysis for web applications with Application Insights

The retention feature in [Application Insights](./app-insights-overview.md) helps you analyze how many users return to your app, and how often they perform particular tasks or achieve goals. For example, if you run a game site, you could compare the numbers of users who return to the site after losing a game with the number who return after winning. This knowledge can help you improve both your user experience and your business strategy.

## Get started

If you don't yet see data in the retention tool in the Application Insights portal, [learn how to get started with the usage tools](usage-overview.md).

## The Retention workbook

To use the Retention Workbook, in your Application Insights resources navigate to **Usage** > **Retention** and select **Retention Analysis Workbook**. Or in the  **Workbooks** tab select **Public Templates** then select **User Retention Analysis** under *Usage*.

:::image type="content" source="./media/usage-retention/workbooks-gallery.png" alt-text="Screenshot of the workbooks gallery on public templates." lightbox="./media/usage-retention/workbooks-gallery.png":::



### Using the workbook

:::image type="content" source="./media/usage-retention/retention.png" alt-text="Screenshot of the retention workbook showing a line chart." lightbox="./media/usage-retention/retention.png":::

- By default, retention shows all users who did anything then came back and did anything else over a period. You can select different combination of events to narrow the focus on specific user activities.
- Add one or more filters on properties by selecting **Add Filters**. For example, you can focus on users in a particular country or region. 
- The overall retention chart shows a summary of user retention across the selected time period. 
- The grid shows the number of users retained. Each row represents a cohort of users who performed any event in the time period shown. Each cell in the row shows how many of that cohort returned at least once in a later period. Some users may return in more than one period. 
- The insights cards show top five initiating events, and top five returned events to give users a better understanding of their retention report. 

    :::image type="content" source="./media/usage-retention/retention-2.png" alt-text="Screenshot of the retention workbook, showing user return after # of weeks chart." lightbox="./media/usage-retention/retention-2.png":::

## Use business events to track retention

To get the most useful retention analysis, measure events that represent significant business activities. 

For example, many users might open a page in your app without playing the game that it displays. Tracking just the page views would therefore provide an inaccurate estimate of how many people return to play the game after enjoying it previously. To get a clear picture of returning players, your app should send a custom event when a user actually plays.  

It's good practice to code custom events that represent key business actions, and use these for your retention analysis. To capture the game outcome, you need to write a line of code to send a custom event to Application Insights. If you write it in the web page code or in Node.JS, it looks like this:

```JavaScript
    appinsights.trackEvent("won game");
```

Or in ASP.NET server code:

```csharp
   telemetry.TrackEvent("won game");
```

[Learn more about writing custom events](./api-custom-events-metrics.md#trackevent).


## Next steps
- - To learn more about workbooks, visit [the workbooks overview](../visualize/workbooks-overview.md).
- To enable usage experiences, start sending [custom events](./api-custom-events-metrics.md#trackevent) or [page views](./api-custom-events-metrics.md#page-views).
- If you already send custom events or page views, explore the Usage tools to learn how users use your service.
    - [Users, Sessions, Events](usage-segmentation.md)
    - [Funnels](usage-funnels.md)
    - [User Flows](usage-flows.md)
    - [Workbooks](../visualize/workbooks-overview.md)
    - [Add user context](./usage-overview.md)