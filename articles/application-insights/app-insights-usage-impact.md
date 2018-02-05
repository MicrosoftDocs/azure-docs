---
title:  Azure Application Insights Usage Impact | Microsoft docs
description: Analyze how different properties potentially impact conversion rates for parts of your apps.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 01/25/2018
ms.author: mbullwin ; daviste
---

# Impact analysis with Application Insights

Impact analyzes how load times and other properties influence conversion rates for various parts of your app. To put it more precisely, it discovers how **any dimension** of a **page view**, **custom event**, or **request** affects how users convert to  a different **page view** or **custom event**. 

![Impact tool](./media/app-insights-usage-impact/0001-impact.png)

## Still not sure what Impact does?

Think of it as the ultimate tool for settling arguments with someone on your team about how slowness in some aspect of your site is affecting whether users stick around. Oftentimes users may tolerate a certain amount of slowness, but Impact gives you insight into how best to balance optimization and performance to maximize user conversion.

> [!NOTE]
> Your Application Insights resource must contain page views or custom events to use the Impact tool. [Learn how to set up your app to collect page views automatically with the Application Insights JavaScript SDK](app-insights-javascript.md).
>
>

## Is page load time impacting how many people convert on my page?

To begin answering questions with the Impact tool, choose an initial page view, custom event, or request.

![Impact tool](./media/app-insights-usage-impact/0002-dropdown.png)

1. Select a page view from the **For the page view** dropdown.
2. Leave the **analyze how its** dropdown on the default selection of **Duration**
3. For the **impacts the usage of** dropdown, select a custom event that corresponds to a UI element on the page view you selected in step 1.

![Screenshot of results](./media/app-insights-usage-impact/0003-results.png)

In this instance as **Product Page** load time increases the conversion rate to **Product Purchased clicked** goes down. Based on the distribution above, an optimal page load duration of 3.5 seconds could be targeted to achieve a potential 55% conversion rate. Further performance improvements to reduce load time below 3.5 seconds do not currently correlate with further conversion benefits.


## What if I’m tracking page views or load times in custom ways?

Impact supports all standard and custom properties and measurements. Use whatever you want. Instead of duration,
use filters on the primary and secondary events to get more specific.

## Do users from different countries or regions convert at different rates?

1. Select a page view from the **For the page view** dropdown.
2. Choose “Country or region” in **analyze how its** dropdown
3. For the **impacts the usage of** dropdown, select a custom event that corresponds to a UI element on the page view you chose in step 1.

In this case, our results no longer fit into a continuous x-axis model as they did in the first example. Instead, we are presented with a visualization similar to a segmented funnel. Sort by **Usage** to view the variation of conversion to your custom event based on country.


## How does the Impact tool calculate these conversion rates?

Let **A** = the main page view/custom event/request you select in the first dropdown. (**For the page view**).

Let **B** = the secondary page view/custom event you select (**impacts the usage of**).

Impact looks at a sample of all the sessions from users in the selected time range. For each session, it looks for each occurrence of **A**.

From one instance of **A** to the next is considered a sub-session.

If **B** occurs during a sub-session, (for example between one occurrence of **A** and the next) then that sub-session is counted as a conversion.

If **A** occurs followed by **B**, which is in turn followed by an end-of-session this too is counted as a conversion.

So conversion rates are the fraction of A-to-A or A-to-end-of-session sub-sessions that included at least one B.

## Next steps

- To enable usage experiences, start sending [custom events](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#trackevent) or [page views](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#page-views).
- If you already send custom events or page views, explore the Usage tools to learn how users use your service.
    - [Funnels](usage-funnels.md)
    - [Retention](app-insights-usage-retention.md)
    - [User Flows](app-insights-usage-flows.md)
    - [Workbooks](app-insights-usage-workbooks.md)
    - [Add user context](app-insights-usage-send-user-context.md)