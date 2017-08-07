---
title: User retention analysis for web applications with Azure Application Insights | Microsoft docs
description: How many users return to your app?
services: application-insights
documentationcenter: ''
author: botatoes
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 05/03/2017
ms.author: cfreeman
---

# User retention analysis for web applications with Application Insights

The retention blade in [Azure Application Insights](app-insights-overview.md) helps you analyze how many users return to your app, and how often they perform particular tasks or achieve goals. For example, if you run a game site, you could compare the numbers of users who return to the site after losing a game with the number who return after winning. This knowledge can help you improve both your user experience and your business strategy.

## Get started

If you don't yet see data in the retention blade in the Application Insights portal, [learn how to get started with the usage tools](app-insights-usage-overview.md).

## The Retention tool

![Retention tool](./media/app-insights-usage-retention/retention.png)

1. The toolbar allows users to create new retention reports, open existing retention reports, save current retention report or save as, revert changes made to saved reports, refresh data on the report, share report via email or direct link, and access the documentation page. 
2. By default, retention shows all users who did anything then came back and did anything else over a period. You can select different combination of events to narrow the focus on specific user activities.
3. Add one or more filters on properties. For example, you can focus on users in a particular country or region. Click **Update** after setting the filters. 
4. The overall retention chart shows a summary of user retention across the selected time period. 
5. The grid shows the number of users retained according to the query builder in #2. Each row represents a cohort of users who performed any event in the time period shown. Each cell in the row shows how many of that cohort returned at least once in a later period. Some users may return in more than one period. 
6. The insights cards show top 5 initiating events, and top 5 returned events to give users a better understanding of their retention report. 


## Use business events to track retention

To get the most useful retention analysis, measure events that represent significant business activities. 

For example, many users might open a page in your app without playing the game that it displays. Tracking just the page views would therefore provide an inaccurate estimate of how many people return to play the game after enjoying it previously. To get a clear picture of returning players, your app should send a custom event when a user actually plays.  

It's good practice to code custom events that represent key business actions, and use these for your retention analysis. To capture the game outcome, you need to write a line of code to send a custom event to Application Insights. If you write it in the web page code or in Node.JS, it looks like this:

```JavaScript
    appinsights.trackEvent("won game");
```

Or in ASP.NET server code:

```C#
   telemetry.TrackEvent("won game");
```

[Learn more about writing custom events](app-insights-api-custom-events-metrics.md#trackevent).


## Next steps

* [Usage overview](app-insights-usage-overview.md)
* [Users and sessions](app-insights-usage-segmentation.md)
<<<<<<< HEAD
* [Coding custom events](app-insights-api-custom-events-metrics.md)s
* [Flows](app-insights-usage-flows.md)
=======
* [Coding custom events](app-insights-api-custom-events-metrics.md)
>>>>>>> c873672240e5cda74adc41f25483eb5c00f9d7f4

