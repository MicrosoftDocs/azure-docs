---
title: Sending user context to enable usage experiences in Azure Application Insights | Microsoft Docs
description: Track how users move through your service after assigning each of them a unique, persistent ID string in Application Insights.
services: application-insights
documentationcenter: ''
author: abgreg
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: csharp
ms.topic: article
ms.date: 08/02/2017
ms.author: bwren

---
#  Sending user context to enable usage experiences in Azure Application Insights

## Tracking users

Application Insights enables you to monitor and track your users through a set of product usage tools: 
* [Users, Sessions, Events](https://docs.microsoft.com/azure/application-insights/app-insights-usage-segmentation)
* [Funnels](https://docs.microsoft.com/azure/application-insights/usage-funnels)
* [Retention](https://docs.microsoft.com/azure/application-insights/app-insights-usage-retention)
* Cohorts
* [Workbooks](https://docs.microsoft.com/azure/application-insights/app-insights-usage-workbooks)

In order to track what a user does over time, Application Insights needs an ID for each user or session. Include these IDs in every custom event or page view.
- Users, Funnels, Retention, and Cohorts: Include user ID.
- Sessions: Include session ID.

If your app is integrated with the [JavaScript SDK](https://docs.microsoft.com/azure/application-insights/app-insights-javascript#set-up-application-insights-for-your-web-page), user ID is tracked automatically.

## Choosing user IDs

User IDs should persist across user sessions to track how users behave over time. There are various approaches for persisting the ID.
- A definition of a user that you already have in your service.
- If the service has access to a browser, it can pass the browser a cookie with an ID in it. The ID will persist for as long as the cookie remains in the user's browser.
- If necessary, you can use a new ID each session, but the results about users will be limited. For example, you won't be able to see how a user's behavior changes over time.

The ID should be a Guid or another string complex enough to identify each user uniquely. For example, it could be a long random number.

If the ID contains personally identifying information about the user, it is not an appropriate value to send to Application Insights as a user ID. You can send such an ID as an [authenticated user ID](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#authenticated-users), but it does not fulfill the user ID requirement for usage scenarios.

## ASP.NET Apps: Set user context in an ITelemetryInitializer

Create a telemetry initializer, as described in detail [here](https://docs.microsoft.com/azure/application-insights/app-insights-api-filtering-sampling#add-properties-itelemetryinitializer), and set the Context.User.Id and the Context.Session.Id.

This example sets the user ID to an identifier that expires after the session. If possible, use a user ID that persists across sessions.

*C#*

```C#

    using System;
    using System.Web;
    using Microsoft.ApplicationInsights.Channel;
    using Microsoft.ApplicationInsights.Extensibility;

    namespace MvcWebRole.Telemetry
    {
      /*
       * Custom TelemetryInitializer that sets the user ID.
       *
       */
      public class MyTelemetryInitializer : ITelemetryInitializer
      {
        public void Initialize(ITelemetry telemetry)
        {
            // For a full experience, track each user across sessions. For an incomplete view of user 
            // behavior within a session, store user ID on the HttpContext Session.
            // Set the user ID if we haven't done so yet.
            if (HttpContext.Current.Session["UserId"] == null)
            {
                HttpContext.Current.Session["UserId"] = Guid.NewGuid();
            }

            // Set the user id on the Application Insights telemetry item.
            telemetry.Context.User.Id = (string)HttpContext.Current.Session["UserId"];

            // Set the session id on the Application Insights telemetry item.
            telemetry.Context.Session.Id = HttpContext.Current.Session.SessionID;
        }
      }
    }
```

## Next steps
- To enable usage experiences, start sending [custom events](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-api-custom-events-metrics#trackevent) or [page views](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#page-views).
- If you already send custom events or page views, explore the Usage tools to learn how users use your service.
    * [Usage overview](app-insights-usage-overview.md)
    * [Users, Sessions, and Events](app-insights-usage-segmentation.md)
    * [Funnels](usage-funnels.md)
    * [Retention](app-insights-usage-retention.md)
    * [Workbooks](app-insights-usage-workbooks.md)
