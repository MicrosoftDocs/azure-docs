---
title: Usage analysis with Azure Application Insights | Microsoft docs
description: Understand your users and what they do with your app.
services: application-insights
documentationcenter: ''
author: NumberByColors
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/10/2017
ms.pm_owner: daviste;NumberByColors
ms.reviewer: mbullwin
ms.author: daviste
---

# Usage analysis with Application Insights

Which features of your web or mobile app are most popular? Do your users achieve their goals with your app? Do they drop out at particular points, and do they return later?  [Azure Application Insights](../../azure-monitor/app/app-insights-overview.md) helps you gain powerful insights into how people use your app. Every time you update your app, you can assess how well it works for users. With this knowledge, you can make data driven decisions about your next development cycles.

## Send telemetry from your app

The best experience is obtained by installing Application Insights both in your app server code, and in your web pages. The client and server components of your app send telemetry back to the Azure portal for analysis.

1. **Server code:** Install the appropriate module for your [ASP.NET](../../azure-monitor/app/asp-net.md), [Azure](../../azure-monitor/app/app-insights-overview.md), [Java](../../azure-monitor/app/java-get-started.md), [Node.js](../../azure-monitor/app/nodejs.md), or [other](../../azure-monitor/app/platforms.md) app.

    * *Don't want to install server code? Just [create an Azure Application Insights resource](../../azure-monitor/app/create-new-resource.md ).*

2. **Web page code:** Add the following script to your web page before the closing ``</head>``. Replace instrumentation key with the appropriate value for your Application Insights resource:

   ```javascript
      <script type="text/javascript">
        var appInsights=window.appInsights||function(a){
            function b(a){c[a]=function(){var b=arguments;c.queue.push(function(){c[a].apply(c,b)})}}var c={config:a},d=document,e=window;setTimeout(function(){var b=d.createElement("script");b.src=a.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js",d.getElementsByTagName("script")[0].parentNode.appendChild(b)});try{c.cookie=d.cookie}catch(a){}c.queue=[];for(var f=["Event","Exception","Metric","PageView","Trace","Dependency"];f.length;)b("track"+f.pop());if(b("setAuthenticatedUserContext"),b("clearAuthenticatedUserContext"),b("startTrackEvent"),b("stopTrackEvent"),b("startTrackPage"),b("stopTrackPage"),b("flush"),!a.disableExceptionTracking){f="onerror",b("_"+f);var g=e[f];e[f]=function(a,b,d,e,h){var i=g&&g(a,b,d,e,h);return!0!==i&&c["_"+f](a,b,d,e,h),i}}return c
        }({
            instrumentationKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
        });
        
        window.appInsights=appInsights,appInsights.queue&&0===appInsights.queue.length&&appInsights.trackPageView();
    </script>
    ```
    To learn more advanced configurations for monitoring websites, check out the [JavaScript SDK API reference](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md).

3. **Mobile app code:** Use the App Center SDK to collect events from your app, then send copies of these events to Application Insights for analysis by [following this guide](../../azure-monitor/learn/mobile-center-quickstart.md).

4. **Get telemetry:** Run your project in debug mode for a few minutes, and then look for results in the Overview blade in Application Insights.

    Publish your app to monitor your app's performance and find out what your users are doing with your app.

## Include user and session ID in your telemetry
To track users over time, Application Insights requires a way to identify them. The Events tool is the only Usage tool that does not require a user ID or a session ID.

Start sending user and session IDs using [this process](https://docs.microsoft.com/azure/application-insights/app-insights-usage-send-user-context).

## Explore usage demographics and statistics
Find out when people use your app, what pages they're most interested in, where your users are located, what browsers and operating systems they use. 

The Users and Sessions reports filter your data by pages or custom events, and segment them by properties such as location, environment, and page. You can also add your own filters.

![Users](./media/usage-overview/users.png)  

Insights on the right point out interesting patterns in the set of data.  

* The **Users** report counts the numbers of unique users that access your pages within your chosen time periods. For web apps, users are counted by using cookies. If someone accesses your site with different browsers or client machines, or clears their cookies, then they will be counted more than once.
* The **Sessions** report counts the number of user sessions that access your site. A session is a period of activity by a user, terminated by a period of inactivity of more than half an hour.

[More about the Users, Sessions, and Events tools](usage-segmentation.md)  

## Retention - how many users come back?

Retention helps you understand how often your users return to use their app, based on cohorts of users that performed some business action during a certain time bucket. 

- Understand what specific features cause users to come back more than others 
- Form hypotheses based on real user data 
- Determine whether retention is a problem in your product 

![Retention](./media/usage-overview/retention.png) 

The retention controls on top allow you to define specific events and time range to calculate retention. The graph in the middle gives a visual representation of the overall retention percentage by the time range specified. The graph on the bottom represents individual retention in a given time period. This level of detail allows you to understand what your users are doing and what might affect returning users on a more detailed granularity.  

[More about the Retention tool](usage-retention.md)

## Custom business events

To get a clear understanding of what users do with your app, it's useful to insert lines of code to log custom events. These events can track anything from detailed user actions such as clicking specific buttons, to more significant business events such as making a purchase or winning a game. 

Although in some cases, page views can represent useful events, it isn't true in general. A user can open a product page without buying the product. 

With specific business events, you can chart your users' progress through your site. You can find out their preferences for different options, and where they drop out or have difficulties. With this knowledge, you can make informed decisions about the priorities in your development backlog.

Events can be logged from the client side of the app:

```JavaScript

    appInsights.trackEvent("ExpandDetailTab", {DetailTab: tabName});
```

Or from the server side:

```csharp
    var tc = new Microsoft.ApplicationInsights.TelemetryClient();
    tc.TrackEvent("CreatedAccount", new Dictionary<string,string> {"AccountType":account.Type}, null);
    ...
    tc.TrackEvent("AddedItemToCart", new Dictionary<string,string> {"Item":item.Name}, null);
    ...
    tc.TrackEvent("CompletedPurchase");
```

You can attach property values to these events, so that you can filter or split the events when you inspect them in the portal. In addition, a standard set of properties is attached to each event, such as anonymous user ID, which allows you to trace the sequence of activities of an individual user.

Learn more about [custom events](../../azure-monitor/app/api-custom-events-metrics.md#trackevent) and [properties](../../azure-monitor/app/api-custom-events-metrics.md#properties).

### Slice and dice events

In the Users, Sessions, and Events tools, you can slice and dice custom events by user, event name, and properties.
![Users](./media/usage-overview/users.png)  
  
## Design the telemetry with the app

When you are designing each feature of your app, consider how you are going to measure its success with your users. Decide what business events you need to record, and code the tracking calls for those events into your app from the start.

## A | B Testing
If you don't know which variant of a feature will be more successful, release both of them, making each accessible to different users. Measure the success of each, and then move to a unified version.

For this technique, you attach distinct property values to all the telemetry that is sent by each version of your app. You can do that by defining properties in the active TelemetryContext. These default properties are added to every telemetry message that the application sends - not just your custom messages, but the standard telemetry as well.

In the Application Insights portal, filter and split your data on the property values, so as to compare the different versions.

To do this, [set up a telemetry initializer](../../azure-monitor/app/api-filtering-sampling.md#add-properties-itelemetryinitializer):

**ASP.NET apps**

```csharp
    // Telemetry initializer class
    public class MyTelemetryInitializer : ITelemetryInitializer
    {
        public void Initialize (ITelemetry telemetry)
        {
            telemetry.Properties["AppVersion"] = "v2.1";
        }
    }
```

In the web app initializer such as Global.asax.cs:

```csharp

    protected void Application_Start()
    {
        // ...
        TelemetryConfiguration.Active.TelemetryInitializers
         .Add(new MyTelemetryInitializer());
    }
```

**ASP.NET Core apps**

> [!NOTE]
> Adding initializer using `ApplicationInsights.config` or using `TelemetryConfiguration.Active` is not valid for ASP.NET Core applications. 

For [ASP.NET Core](asp-net-core.md#adding-telemetryinitializers) applications, adding a new `TelemetryInitializer` is done by adding it to the Dependency Injection container, as shown below. This is done in `ConfigureServices` method of your `Startup.cs` class.

```csharp
 using Microsoft.ApplicationInsights.Extensibility;
 using CustomInitializer.Telemetry;
 public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<ITelemetryInitializer, MyTelemetryInitializer>();
}
```

All new TelemetryClients automatically add the property value you specify. Individual telemetry events can override the default values.

## Next steps
   - [Users, Sessions, Events](usage-segmentation.md)
   - [Funnels](usage-funnels.md)
   - [Retention](usage-retention.md)
   - [User Flows](usage-flows.md)
   - [Workbooks](../../azure-monitor/app/usage-workbooks.md)
   - [Add user context](usage-send-user-context.md)
