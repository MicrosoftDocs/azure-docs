---
title: Troubleshoot usage analytics in Application Insights
description: Troubleshooting guide - analyzing site and app usage with Application Insights.
services: application-insights
documentationcenter: ''
author: numberbycolors
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 01/03/2018
ms.author: mbullwin

---
# Troubleshoot usage analytics in Application Insights
Have questions about the [usage analytics tools in Application Insights](app-insights-usage-overview.md): [Users, Sessions, Events](app-insights-usage-segmentation.md), [Funnels](usage-funnels.md), [User Flows](app-insights-usage-flows.md), [Retention](app-insights-usage-retention.md), or Cohorts? Here are some answers.

## Counting Users
**The usage analytics tools show that my app has one user/session, but I know my app has many users/sessions. How can I fix this?**

All telemetry events in Application Insights have an [anonymous user ID](application-insights-data-model-context.md) and a [session ID](application-insights-data-model-context.md) as two of their standard properties. All of the usage analytics tools count users and sessions based on these IDs, by default. If these standard properties aren't being populated with unique IDs for each user and session of your app, you'll see an incorrect count of users and sessions in the usage analytics tools.

If you're monitoring a web app, the easiest solution is to add the [Application Insights JavaScript SDK](app-insights-javascript.md) to your app, and make sure the script snippet is loaded on each page you want to monitor. The JavaScript SDK will automatically generate anonymous user and session IDs, then populate telemetry events with these IDs as they're sent from your app.

If you're monitoring a web service (no user interface), [create a telemetry inintializer that populates the anonymous user ID and session ID properties](app-insights-usage-send-user-context.md) according to your service's notions of unique users and sessions.

If your app is sending [authenticated user IDs](app-insights-api-custom-events-metrics.md#authenticated-users), you can count based on authenticated user IDs in the Users tool. In the "Show" dropdown, choose "Authenticated users."

The usage analytics tools don't currently support counting users or sessions based on properties other than anonymous user ID, authenticated user ID, or session ID.

## Naming Events
**My app has thousands of different page view and custom event names. It's hard to distinguish between them, and the usage analytics tools often become unresponsive. How can I fix this?**

Page view and custom event names are used throughout the usage analytics tools, and naming events carefully is critical to getting value from these tools. Naming events is an art, finding a balance between having too few, overly generic names ("Button clicked") and having too many, overly specific names ("Edit button clicked on http://www.contoso.com/index").

If your app is sending too many event names, the solution is to change the event names in your app's source code. However, be aware that **all telemetry data in Application Insights is stored for 90 days and cannot be deleted**, so changes you make to reduce the number of unique event names will take 90 days to fully manifest.

## Next steps

* [Usage analytics overview][app-insights-usage-overview.md]

## Get help
* [Stack Overflow](http://stackoverflow.com/questions/tagged/ms-application-insights)

