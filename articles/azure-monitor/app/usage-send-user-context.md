---
title: User context IDs to track activity - Azure Application Insights
description: Track how users move through your service by assigning each of them a unique, persistent ID string in Application Insights.
ms.topic: conceptual
author: NumberByColors
ms.author: daviste
ms.date: 01/03/2019

ms.reviewer: abgreg;mbullwin
---

# Send user context IDs to enable usage experiences in Azure Application Insights

## Tracking users

Application Insights enables you to monitor and track your users through
a set of product usage tools:

- [Users, Sessions, Events](https://docs.microsoft.com/azure/application-insights/app-insights-usage-segmentation)
- [Funnels](https://docs.microsoft.com/azure/application-insights/usage-funnels)
- [Retention](https://docs.microsoft.com/azure/application-insights/app-insights-usage-retention)
  Cohorts
- [Workbooks](https://docs.microsoft.com/azure/azure-monitor/platform/workbooks-overview)

In order to track what a user does over time, Application Insights needs
an ID for each user or session. Include the following IDs in every
custom event or page view.

- Users, Funnels, Retention, and Cohorts: Include user ID.
- Sessions: Include session ID.

> [!NOTE]
> This is an advanced article outlining the manual steps for tracking user activity with Application Insights. With many web applications **these steps may not be required**, as the default server-side SDKs in conjunction with the [Client/Browser-side JavaScript SDK](../../azure-monitor/app/website-monitoring.md ), are often sufficient to automatically track user activity. If you haven't configured [client-side monitoring](../../azure-monitor/app/website-monitoring.md ) in addition to the server-side SDK, do that first and test to see if the user behavior analytics tools are performing as expected.

## Choosing user IDs

User IDs should persist across user sessions to track how users behave
over time. There are various approaches for persisting the ID.

- A definition of a user that you already have in your service.
- If the service has access to a browser, it can pass the browser a cookie with an ID in it. The ID will persist for as long as the cookie remains in the user's browser.
- If necessary, you can use a new ID each session, but the results about users will be limited. For example, you won't be able to see how a user's behavior changes over time.

The ID should be a Guid or another string complex enough to identify each user uniquely. For example, it could be a long random number.

If the ID contains personally identifying information about the user, it is not an appropriate value to send to Application Insights as a user ID. You can send such an ID as an [authenticated user ID](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#authenticated-users), but it does not fulfill the user ID requirement for usage scenarios.

## ASP.NET apps: Setting the user context in an ITelemetryInitializer

Create a telemetry initializer, as described in detail [here](https://docs.microsoft.com/azure/application-insights/app-insights-api-filtering-sampling#addmodify-properties-itelemetryinitializer). Pass the session ID through the request telemetry, and set the Context.User.Id and the Context.Session.Id.

This example sets the user ID to an identifier that expires after the session. If possible, use a user ID that persists across sessions.

### Telemetry initializer

```csharp
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
        var ctx = HttpContext.Current;

        // If telemetry initializer is called as part of request execution and not from some async thread
        if (ctx != null)
        {
            var requestTelemetry = ctx.GetRequestTelemetry();
 
            // Set the user and session ids from requestTelemetry.Context.User.Id, which is populated in Application_PostAcquireRequestState in Global.asax.cs.
            if (requestTelemetry != null && !string.IsNullOrEmpty(requestTelemetry.Context.User.Id) &&
                (string.IsNullOrEmpty(telemetry.Context.User.Id) || string.IsNullOrEmpty(telemetry.Context.Session.Id)))
            {
                // Set the user id on the Application Insights telemetry item.
                telemetry.Context.User.Id = requestTelemetry.Context.User.Id;
 
                // Set the session id on the Application Insights telemetry item.
                telemetry.Context.Session.Id = requestTelemetry.Context.User.Id;
            }
        }
    }
  }
}
```

### Global.asax.cs

```csharp
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace MvcWebRole.Telemetry
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
 
        protected void Application_PostAcquireRequestState()
        {
            var requestTelemetry = Context.GetRequestTelemetry();
 
            if (HttpContext.Current.Session != null && requestTelemetry != null && string.IsNullOrEmpty(requestTelemetry.Context.User.Id))
            {
                requestTelemetry.Context.User.Id = Session.SessionID;
            }
        }
    }
}
```

## Next steps

- To enable usage experiences, start sending [custom events](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#trackevent) or [page views](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#page-views).
- If you already send custom events or page views, explore the Usage tools to learn how users use your service.
    - [Usage overview](usage-overview.md)
    - [Users, Sessions, and Events](usage-segmentation.md)
    - [Funnels](usage-funnels.md)
    - [Retention](usage-retention.md)
    - [Workbooks](../../azure-monitor/platform/workbooks-overview.md)
