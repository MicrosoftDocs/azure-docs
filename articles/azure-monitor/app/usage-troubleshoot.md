---
title: Troubleshoot user analytics tools - Azure Application Insights
description: Troubleshooting guide - analyzing site and app usage with Application Insights.
ms.topic: conceptual
author: NumberByColors
ms.author: daviste
ms.date: 07/11/2018

ms.reviewer: mbullwin
---

# Troubleshoot user behavior analytics tools in Application Insights
Have questions about the [user behavior analytics tools in Application Insights](usage-overview.md): [Users, Sessions, Events](usage-segmentation.md), [Funnels](usage-funnels.md), [User Flows](usage-flows.md), [Retention](usage-retention.md), or Cohorts? Here are some answers.

## Counting Users
**The user behavior analytics tools show that my app has one user/session, but I know my app has many users/sessions. How can I fix these incorrect counts?**

All telemetry events in Application Insights have an [anonymous user ID](../../azure-monitor/app/data-model-context.md) and a [session ID](../../azure-monitor/app/data-model-context.md) as two of their standard properties. By default, all of the usage analytics tools count users and sessions based on these IDs. If these standard properties aren't being populated with unique IDs for each user and session of your app, you'll see an incorrect count of users and sessions in the usage analytics tools.

If you're monitoring a web app, the easiest solution is to add the [Application Insights JavaScript SDK](../../azure-monitor/app/javascript.md) to your app, and make sure the script snippet is loaded on each page you want to monitor. The JavaScript SDK automatically generates anonymous user and session IDs, then populates telemetry events with these IDs as they're sent from your app.

If you're monitoring a web service (no user interface), [create a telemetry initializer that populates the anonymous user ID and session ID properties](usage-send-user-context.md) according to your service's notions of unique users and sessions.

If your app is sending [authenticated user IDs](../../azure-monitor/app/api-custom-events-metrics.md#authenticated-users), you can count based on authenticated user IDs in the Users tool. In the "Show" dropdown, choose "Authenticated users."

The user behavior analytics tools don't currently support counting users or sessions based on properties other than anonymous user ID, authenticated user ID, or session ID.

## Naming Events
**My app has thousands of different page view and custom event names. It's hard to distinguish between them, and the user behavior analytics tools often become unresponsive. How can I fix these naming issues?**

Page view and custom event names are used throughout the user behavior analytics tools. Naming events well is critical to getting value from these tools. The goal is a balance between having too few, overly generic names ("Button clicked") and having too many, overly specific names ("Edit button clicked on http:\//www.contoso.com/index").

To make any changes to the page view and custom event names your app is sending, you need to change your app's source code and redeploy. **All telemetry data in Application Insights is stored for 90 days and cannot be deleted**, so changes you make to event names will take 90 days to fully manifest. For the 90 days after making name changes, both the old and new event names will show up in your telemetry, so adjust queries and communicate within your teams, accordingly.

If your app is sending too many page view names, check whether these page view names are specified manually in code or if they're being sent automatically by the Application Insights JavaScript SDK:

* If the page view names are manually specified in code using the [`trackPageView` API](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md), change the name to be less specific. Avoid common mistakes like putting the URL in the name of the page view. Instead, use the URL parameter of the `trackPageView` API. Move other details from the page view name into custom properties.

* If the Application Insights JavaScript SDK is automatically sending page view names, you can either change your pages' titles or switch to manually sending page view names. The SDK sends the [title](https://developer.mozilla.org/docs/Web/HTML/Element/title) of each page as the page view name, by default. You could change your titles to be more general, but be mindful of SEO and other impacts this change could have. Manually specifying page view names with the `trackPageView` API overrides the automatically collected names, so you could send more general names in telemetry without changing page titles.   

If your app is sending too many custom event names, change the name in the code to be less specific. Again, avoid putting URLs and other per-page or dynamic information in the custom event names directly. Instead, move these details into custom properties of the custom event with the `trackEvent` API. For example, instead of `appInsights.trackEvent("Edit button clicked on http://www.contoso.com/index")`, we suggest something like `appInsights.trackEvent("Edit button clicked", { "Source URL": "http://www.contoso.com/index" })`.

## Next steps

* [User behavior analytics tools overview](usage-overview.md)

## Get help
* [Stack Overflow](https://stackoverflow.com/questions/tagged/ms-application-insights)

