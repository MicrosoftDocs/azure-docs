---
title: User, session, and event analysis in Application Insights
description: Demographic analysis of users of your web app.
ms.topic: conceptual
author: lgayhardt
ms.author: lagayhar
ms.date: 07/30/2021

---

# Users, sessions, and events analysis in Application Insights

Find out when people use your web app, what pages they're most interested in, where your users are located, and what browsers and operating systems they use. Analyze business and usage telemetry by using [Application Insights](./app-insights-overview.md).

:::image type="content" source="./media/usage-segmentation/users.png" alt-text="Screen capture shows the Users tab with an area chart. " lightbox="./media/usage-overview/users.png":::

## Get started

If you don't yet see data in the users, sessions, or events blades in the Application Insights portal, [learn how to get started with the usage tools](usage-overview.md).

## The Users, Sessions, and Events segmentation tool

Three of the usage blades use the same tool to slice and dice telemetry from your web app from three perspectives. By filtering and splitting the data, you can uncover insights about the relative usage of different pages and features.

* **Users tool**: How many people used your app and its features.  Users are counted by using anonymous IDs stored in browser cookies. A single person using different browsers or machines will be counted as more than one user.
* **Sessions tool**: How many sessions of user activity have included certain pages and features of your app. A session is counted after half an hour of user inactivity, or after 24 hours of continuous use.
* **Events tool**: How often certain pages and features of your app are used. A page view is counted when a browser loads a page from your app, provided you've [instrumented it](./javascript.md). 

    A custom event represents one occurrence of something happening in your app, often a user interaction like a button select or the completion of some task. You insert code in your app to [generate custom events](./api-custom-events-metrics.md#trackevent).

## Querying for certain users

Explore different groups of users by adjusting the query options at the top of the Users tool:

- During: Choose a time range.
- Show: Choose a cohort of users to analyze.
- Who used: Choose which custom events, requests, and page views.
- Events: Choose multiple events, requests, and page views that will show users who did at least one, not necessarily all of the selected.
- By value x-axis: Choose how to bucket the data, either by time range or by another property such as browser or city.
- Split By: Choose a property by which to split or segment the data. 
- Add Filters: Limit the query to certain users, sessions, or events based on their properties, such as browser or city. 
 
## Meet your users

The **Meet your users** section shows information about five sample users matched by the current query. Exploring the behaviors of individuals and in aggregate, can provide insights about how people actually use your app.

## Next steps

- To enable usage experiences, start sending [custom events](./api-custom-events-metrics.md#trackevent) or [page views](./api-custom-events-metrics.md#page-views).
- If you already send custom events or page views, explore the Usage tools to learn how users use your service.
    - [Funnels](usage-funnels.md)
    - [Retention](usage-retention.md)
    - [User Flows](usage-flows.md)
    - [Workbooks](../visualize/workbooks-overview.md)
    - [Add user context](./usage-overview.md)