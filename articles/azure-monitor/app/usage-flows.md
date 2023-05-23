---
title: Application Insights User Flows analyzes navigation flows
description: Analyze how users move between the pages and features of your web app.
ms.topic: conceptual
ms.date: 05/13/2023
ms.reviewer: mmcc
---

# Analyze user navigation patterns with User Flows in Application Insights

:::image type="content" source="./media/usage-flows/flows.png" lightbox="./media/usage-flows/flows.png" alt-text="Screenshot that shows the Application Insights User Flows tool.":::

The User Flows tool visualizes how users move between the pages and features of your site. It's great for answering questions like:

* How do users move away from a page on your site?
* What do users select on a page on your site?
* Where are the places that users churn most from your site?
* Are there places where users repeat the same action over and over?

The User Flows tool starts from an initial page view, custom event, or exception that you specify. From this initial event, User Flows shows the events that happened before and after user sessions. Lines of varying thickness show how many times users followed each path. Special **Session Started** nodes show where the subsequent nodes began a session. **Session Ended** nodes show how many users sent no page views or custom events after the preceding node, highlighting where users probably left your site.

> [!NOTE]
> Your Application Insights resource must contain page views or custom events to use the User Flows tool. [Learn how to set up your app to collect page views automatically with the Application Insights JavaScript SDK](./javascript.md).
>

## Choose an initial event

:::image type="content" source="./media/usage-flows/initial-event.png" lightbox="./media/usage-flows/initial-event.png" alt-text="Screenshot that shows choosing an initial event for User Flows.":::

To begin answering questions with the User Flows tool, choose an initial page view, custom event, or exception to serve as the starting point for the visualization:

1. Select the link in the **What do users do after?** title or select **Edit**.
1. Select a page view, custom event, or exception from the **Initial event** dropdown list.
1. Select **Create graph**.

The **Step 1** column of the visualization shows what users did most frequently after the initial event. The items are ordered from top to bottom and from most to least frequent. The **Step 2** and subsequent columns show what users did next. The information creates a picture of all the ways that users moved through your site.

By default, the User Flows tool randomly samples only the last 24 hours of page views and custom events from your site. You can increase the time range and change the balance of performance and accuracy for random sampling on the **Edit** menu.

If some of the page views, custom events, and exceptions aren't relevant to you, select **X** on the nodes you want to hide. After you've selected the nodes you want to hide, select **Create graph**. To see all the nodes you've hidden, select **Edit** and look at the **Excluded events** section.

If page views or custom events are missing that you expect to see in the visualization:

* Check the **Excluded events** section on the **Edit** menu.
* Use the plus buttons on **Others** nodes to include less-frequent events in the visualization.
* If the page view or custom event you expect is sent infrequently by users, increase the time range of the visualization on the **Edit** menu.
* Make sure the page view, custom event, or exception you expect is set up to be collected by the Application Insights SDK in the source code of your site. Learn more about [collecting custom events](./api-custom-events-metrics.md).

If you want to see more steps in the visualization, use the **Previous steps** and **Next steps** dropdown lists above the visualization.

## After users visit a page or feature, where do they go and what do they select?

:::image type="content" source="./media/usage-flows/one-step.png" lightbox="./media/usage-flows/one-step.png" alt-text="Screenshot that shows using User Flows to understand where users select.":::

If your initial event is a page view, the first column (**Step 1**) of the visualization is a quick way to understand what users did immediately after they visited the page. 

Open your site in a window next to the User Flows visualization. Compare your expectations of how users interact with the page to the list of events in the **Step 1** column. Often, a UI element on the page that seems insignificant to your team can be among the most used on the page. It can be a great starting point for design improvements to your site.

If your initial event is a custom event, the first column shows what users did after they performed that action. As with page views, consider if the observed behavior of your users matches your team's goals and expectations.

If your selected initial event is **Added Item to Shopping Cart**, for example, look to see if **Go to Checkout** and **Completed Purchase** appear in the visualization shortly thereafter. If user behavior is different from your expectations, use the visualization to understand how users are getting "trapped" by your site's current design.

## Where are the places that users churn most from your site?

Watch for **Session Ended** nodes that appear high up in a column in the visualization, especially early in a flow. This positioning means many users probably churned from your site after they followed the preceding path of pages and UI interactions.

Sometimes churn is expected. For example, it's expected after a user makes a purchase on an e-commerce site. But usually churn is a sign of design problems, poor performance, or other issues with your site that can be improved.

Keep in mind that **Session Ended** nodes are based only on telemetry collected by this Application Insights resource. If Application Insights doesn't receive telemetry for certain user interactions, users might have interacted with your site in those ways after the User Flows tool says the session ended.

## Are there places where users repeat the same action over and over?

Look for a page view or custom event that's repeated by many users across subsequent steps in the visualization. This activity usually means that users are performing repetitive actions on your site. If you find repetition, think about changing the design of your site or adding new functionality to reduce repetition. For example, you might add bulk edit functionality if you find users performing repetitive actions on each row of a table element.

## Frequently asked questions

This section provides answers to common questions.

### Does the initial event represent the first time the event appears in a session or any time it appears in a session?

The initial event on the visualization only represents the first time a user sent that page view or custom event during a session. If users can send the initial event multiple times in a session, then the **Step 1** column only shows how users behave after the *first* instance of an initial event, not all instances.

### Some of the nodes in my visualization have a level that's too high. How can I get more detailed nodes?

Use the **Split by** options on the **Edit** menu:

1. Select the event you want to break down on the **Event** menu.
1. Select a dimension on the **Dimension** menu. For example, if you have an event called **Button Clicked**, try a custom property called **Button Name**.

## Next steps

* [Usage overview](usage-overview.md)
* [Users, sessions, and events](usage-segmentation.md)
* [Retention](usage-retention.md)
* [Adding custom events to your app](./api-custom-events-metrics.md)