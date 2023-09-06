---
title: Application Insights usage impact - Azure Monitor
description: Analyze how different properties potentially affect conversion rates for parts of your apps.
ms.topic: conceptual
ms.date: 05/24/2023
---

# Impact analysis with Application Insights

Impact analyzes how load times and other properties influence conversion rates for various parts of your app. To put it more precisely, it discovers how any dimension of a page view, custom event, or request affects the usage of a different page view or custom event.

## Still not sure what Impact does?

One way to think of Impact is as the ultimate tool for settling arguments with someone on your team about how slowness in some aspect of your site is affecting whether users stick around. Users might tolerate some slowness, but Impact gives you insight into how best to balance optimization and performance to maximize user conversion.

Analyzing performance is only a subset of Impact's capabilities. Impact supports custom events and dimensions, so you can easily answer questions like, How does user browser choice correlate with different rates of conversion?

> [!NOTE]
> Your Application Insights resource must contain page views or custom events to use the Impact analysis workbook. Learn how to [set up your app to collect page views automatically with the Application Insights JavaScript SDK](./javascript.md). Also, because you're analyzing correlation, sample size matters.

## Impact analysis workbook

To use the Impact analysis workbook, in your Application Insights resources go to **Usage** > **More** and select **User Impact Analysis Workbook**. Or on the **Workbooks** tab, select **Public Templates**. Then under **Usage**, select **User Impact Analysis**.

:::image type="content" source="./media/usage-impact/workbooks-gallery.png" alt-text="Screenshot that shows the Workbooks Gallery on public templates." lightbox="./media/usage-impact/workbooks-gallery.png":::

### Use the workbook

:::image type="content" source="./media/usage-impact/selected-event.png" alt-text="Screenshot that shows where to choose an initial page view, custom event, or request." lightbox="./media/usage-impact/selected-event.png":::

1. From the **Selected event** dropdown list, select an event.
1. From the **analyze how its** dropdown list, select a metric.
1. From the  **Impacting event** dropdown list, select an event.
1. To add a filter, use the **Add selected event filters** tab or the **Add impacting event filters** tab.

## Is page load time affecting how many people convert on my page?

To begin answering questions with the Impact workbook, choose an initial page view, custom event, or request.

1. From the **Selected event** dropdown list, select an event.
1. Leave the **analyze how its** dropdown list on the default selection of **Duration**. (In this context, **Duration** is an alias for **Page Load Time**.)
1. From the **Impacting event** dropdown list, select a custom event. This event should correspond to a UI element on the page view you selected in step 1.

   :::image type="content" source="./media/usage-impact/impact.png" alt-text="Screenshot that shows an example with the selected event as Home Page analyzed by duration." lightbox="./media/usage-impact/impact.png":::

## What if I'm tracking page views or load times in custom ways?

Impact supports both standard and custom properties and measurements. Use whatever you want. Instead of duration, use filters on the primary and secondary events to get more specific.

## Do users from different countries or regions convert at different rates?

1. From the **Selected event** dropdown list, select an event.
1. From the **analyze how its** dropdown list, select **Country or region**.
1. From the **Impacting event** dropdown list, select a custom event that corresponds to a UI element on the page view you chose in step 1.

   :::image type="content" source="./media/usage-impact/regions.png" alt-text="Screenshot that shows an example with the selected event as GET analyzed by country and region." lightbox="./media/usage-impact/regions.png":::

## How does the Impact analysis workbook calculate these conversion rates?

Under the hood, the Impact analysis workbook relies on the [Pearson correlation coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient). Results are computed between -1 and 1. The coefficient -1 represents a negative linear correlation and 1 represents a positive linear correlation.

The basic breakdown of how Impact analysis works is listed here:

* Let _A_ = the main page view, custom event, or request you select in the **Selected event** dropdown list.
* Let _B_ = the secondary page view or custom event you select in the **impacts the usage of** dropdown list.

Impact looks at a sample of all the sessions from users in the selected time range. For each session, it looks for each occurrence of _A_.

Sessions are then broken into two different kinds of _subsessions_ based on one of two conditions:

- A converted subsession consists of a session ending with a _B_ event and encompasses all _A_ events that occur prior to _B_.
- An unconverted subsession occurs when all *A*s occur without a terminal _B_.

How Impact is ultimately calculated varies based on whether we're analyzing by metric or by dimension. For metrics, all *A*s in a subsession are averaged. For dimensions, the value of each _A_ contributes _1/N_ to the value assigned to _B_, where _N_ is the number of *A*s in the subsession.

## Next steps

- To learn more about workbooks, see the [Workbooks overview](../visualize/workbooks-overview.md).
- To enable usage experiences, start sending [custom events](./api-custom-events-metrics.md#trackevent) or [page views](./api-custom-events-metrics.md#page-views).
- If you already send custom events or page views, explore the Usage tools to learn how users use your service:
    - [Funnels](usage-funnels.md)
    - [Retention](usage-retention.md)
    - [User flows](usage-flows.md)
    - [Workbooks](../visualize/workbooks-overview.md)
    - [Add user context](./usage-overview.md)