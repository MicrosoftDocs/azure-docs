---
title: Analyze web app user retention with Application Insights
description: This article shows you how to determine how many users return to your app.
ms.topic: conceptual
ms.date: 07/30/2021
ms.reviewer: mmcc
---

# User retention analysis for web applications with Application Insights

The retention feature in [Application Insights](./app-insights-overview.md) helps you analyze how many users return to your app, and how often they perform particular tasks or achieve goals. For example, if you run a game site, you could compare the numbers of users who return to the site after losing a game with the number who return after winning. This knowledge can help you improve your user experience and your business strategy.

## Get started

If you don't yet see data in the retention tool in the Application Insights portal, [learn how to get started with the usage tools](usage-overview.md).

## The Retention workbook

To use the Retention workbook, in your Application Insights resources go to **Usage** > **Retention** > **Retention Analysis Workbook**. Or on the **Workbooks** tab, select **Public Templates**. Then under **Usage**, select **User Retention Analysis**.

:::image type="content" source="./media/usage-retention/workbooks-gallery.png" alt-text="Screenshot that shows the Workbooks Gallery on the Public Templates tab." lightbox="./media/usage-retention/workbooks-gallery.png":::

### Use the workbook

:::image type="content" source="./media/usage-retention/retention.png" alt-text="Screenshot that shows the Retention workbook showing a line chart." lightbox="./media/usage-retention/retention.png":::

Workbook capabilities:

- By default, retention shows all users who did anything and then came back and did anything else over a defined period. You can select different combinations of events to narrow the focus on specific user activities.
- To add one or more filters on properties, select **Add Filters**. For example, you can focus on users in a particular country or region.
- The **Overall Retention** chart shows a summary of user retention across the selected time period.
- The grid shows the number of users retained. Each row represents a cohort of users who performed any event in the time period shown. Each cell in the row shows how many of that cohort returned at least once in a later period. Some users might return in more than one period.
- The insights cards show the top five initiating events and the top five returned events. This information gives users a better understanding of their retention report.

    :::image type="content" source="./media/usage-retention/retention-2.png" alt-text="Screenshot that shows the Retention workbook showing the User returned after # of weeks chart." lightbox="./media/usage-retention/retention-2.png":::

## Use business events to track retention

To get the most useful retention analysis, measure events that represent significant business activities.

For example, many users might open a page in your app without playing the game that it displays. Tracking only the page views would provide an inaccurate estimate of how many people returned to play the game after enjoying it previously. To get a clear picture of returning players, your app should send a custom event when a user actually plays.

It's good practice to code custom events that represent key business actions. Then you can use these events for your retention analysis. To capture the game outcome, you need to write a line of code to send a custom event to Application Insights. If you write it in the webpage code or in Node.JS, it looks like this example:

```JavaScript
    appinsights.trackEvent("won game");
```

Or in ASP.NET server code:

```csharp
   telemetry.TrackEvent("won game");
```

Learn more about [writing custom events](./api-custom-events-metrics.md#trackevent).

## Next steps

- To learn more about workbooks, see the [workbooks overview](../visualize/workbooks-overview.md).
- To enable usage experiences, start sending [custom events](./api-custom-events-metrics.md#trackevent) or [page views](./api-custom-events-metrics.md#page-views).
- If you already send custom events or page views, explore the Usage tools to learn how users use your service:
    - [Users, sessions, events](usage-segmentation.md)
    - [Funnels](usage-funnels.md)
    - [User flows](usage-flows.md)
    - [Workbooks](../visualize/workbooks-overview.md)
    - [Add user context](./usage-overview.md)