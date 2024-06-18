---
title: Usage analysis with Application Insights | Azure Monitor
description: Understand your users and what they do with your app.
ms.topic: conceptual
ms.date: 09/12/2023
ms.reviewer: mmcc
---

# Usage analysis with Application Insights

Which features of your web or mobile app are most popular? Do your users achieve their goals with your app? Do they drop out at particular points, and do they return later? [Application Insights](./app-insights-overview.md) helps you gain powerful insights into how people use your app. Every time you update your app, you can assess how well it works for users. With this knowledge, you can make data-driven decisions about your next development cycles.

## Send telemetry from your app

The best experience is obtained by installing Application Insights both in your app server code and in your webpages. The client and server components of your app send telemetry back to the Azure portal for analysis.

1. **Server code:** Install the appropriate module for your [ASP.NET](./asp-net.md), [Azure](./app-insights-overview.md), [Java](./opentelemetry-enable.md?tabs=java), [Node.js](./nodejs.md), or [other](./app-insights-overview.md#supported-languages) app.

    * If you don't want to install server code, [create an Application Insights resource](./create-workspace-resource.md).

1. **Webpage code:** Use the JavaScript SDK to collect data from webpages. See [Get started with the JavaScript SDK](./javascript-sdk.md).
    
   [!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

   To learn more advanced configurations for monitoring websites, check out the [JavaScript SDK reference article](./javascript.md).

1. **Mobile app code:** Use the App Center SDK to collect events from your app. Then send copies of these events to Application Insights for analysis by [following this guide](https://github.com/Microsoft/appcenter).

1. **Get telemetry:** Run your project in debug mode for a few minutes. Then look for results in the **Overview** pane in Application Insights.

    Publish your app to monitor your app's performance and find out what your users are doing with your app.

## Explore usage demographics and statistics

Find out when people use your app and what pages they're most interested in. You can also find out where your users are located and what browsers and operating systems they use.

The **Users** and **Sessions** reports filter your data by pages or custom events. The reports segment the data by properties such as location, environment, and page. You can also add your own filters.

:::image type="content" source="./media/usage-overview/users.png" alt-text="Screenshot that shows the Users tab with a bar chart." lightbox="./media/usage-overview/users.png":::

Insights on the right point out interesting patterns in the set of data.

* The **Users** report counts the numbers of unique users that access your pages within your chosen time periods. For web apps, users are counted by using cookies. If someone accesses your site with different browsers or client machines, or clears their cookies, they're counted more than once.
* The **Sessions** report tabulates the number of user sessions that access your site. A session represents a period of activity initiated by a user and concludes with a period of inactivity exceeding half an hour.

For more information about the Users, Sessions, and Events tools, see [Users, sessions, and events analysis in Application Insights](usage-segmentation.md).

## Retention: How many users come back?

Retention helps you understand how often your users return to use their app, based on cohorts of users that performed some business action during a certain time bucket. You can:

- Understand what specific features cause users to come back more than others.
- Form hypotheses based on real user data.
- Determine whether retention is a problem in your product.

:::image type="content" source="./media/usage-overview/retention.png" alt-text="Screenshot that shows the Retention workbook, which displays information about how often users return to use their app." lightbox="./media/usage-overview/retention.png":::

You can use the retention controls on top to define specific events and time ranges to calculate retention. The graph in the middle gives a visual representation of the overall retention percentage by the time range specified. The graph on the bottom represents individual retention in a specific time period. This level of detail allows you to understand what your users are doing and what might affect returning users on a more detailed granularity.

For more information about the Retention workbook, see [User retention analysis for web applications with Application Insights](usage-retention.md).

## Custom business events

To understand user interactions in your app, insert code lines to log custom events. These events track various user actions, like button selections, or important business events, such as purchases or game victories.

You can also use the [Click Analytics Autocollection plug-in](javascript-feature-extensions.md) to collect custom events.

In some cases, page views can represent useful events, but it isn't true in general. A user can open a product page without buying the product.

With specific business events, you can chart your users' progress through your site. You can find out their preferences for different options and where they drop out or have difficulties. With this knowledge, you can make informed decisions about the priorities in your development backlog.

Events can be logged from the client side of the app:

```JavaScript
      appInsights.trackEvent({name: "incrementCount"});
```

Or events can be logged from the server side:

```csharp
    var tc = new Microsoft.ApplicationInsights.TelemetryClient();
    tc.TrackEvent("CreatedAccount", new Dictionary<string,string> {"AccountType":account.Type}, null);
    ...
    tc.TrackEvent("AddedItemToCart", new Dictionary<string,string> {"Item":item.Name}, null);
    ...
    tc.TrackEvent("CompletedPurchase");
```

You can attach property values to these events so that you can filter or split the events when you inspect them in the portal. A standard set of properties is also attached to each event, such as anonymous user ID, which allows you to trace the sequence of activities of an individual user.

Learn more about [custom events](./api-custom-events-metrics.md#trackevent) and [properties](./api-custom-events-metrics.md#properties).

### Slice and dice events

In the Users, Sessions, and Events tools, you can slice and dice custom events by user, event name, and properties.

:::image type="content" source="./media/usage-overview/events.png" alt-text="Screenshot that shows the Events tab filtered by AnalyticsItemsOperation and split by AppID." lightbox="./media/usage-overview/events.png":::

Whenever you’re in any usage experience, select the **Open the last run query** icon to take you back to the underlying query.

:::image type="content" source="./media/usage-overview/open-last-run-query-icon.png" alt-text="Screenshot of the Application Insights Session pane in the Azure portal. The Open the last run query icon is highlighted." lightbox="./media/usage-overview/open-last-run-query-icon.png":::

You can then modify the underlying query to get the kind of information you’re looking for. 

Here’s an example of an underlying query about page views. Go ahead and paste it directly into the query editor to test it out.

```kusto
// average pageView duration by name
let timeGrain=5m;
let dataset=pageViews
// additional filters can be applied here
| where timestamp > ago(1d)
| where client_Type == "Browser" ;
// calculate average pageView duration for all pageViews
dataset
| summarize avg(duration) by bin(timestamp, timeGrain)
| extend pageView='Overall'
// render result in a chart
| render timechart
```
  
## Design the telemetry with the app

When you design each feature of your app, consider how you're going to measure its success with your users. Decide what business events you need to record, and code the tracking calls for those events into your app from the start.

## A | B testing

If you're unsure which feature variant is more successful, release both and let different users access each variant. Measure the success of each variant, and then transition to a unified version.

In this technique, you attach unique property values to all the telemetry sent by each version of your app. You can do it by defining properties in the active TelemetryContext. These default properties get included in every telemetry message sent by the application. It includes both custom messages and standard telemetry.

In the Application Insights portal, filter and split your data on the property values so that you can compare the different versions.

To do this step, [set up a telemetry initializer](./api-filtering-sampling.md#addmodify-properties-itelemetryinitializer):

```csharp
    // Telemetry initializer class
    public class MyTelemetryInitializer : ITelemetryInitializer
    {
        // In this example, to differentiate versions, we use the value specified in the AssemblyInfo.cs
        // for ASP.NET apps, or in your project file (.csproj) for the ASP.NET Core apps. Make sure that
        // you set a different assembly version when you deploy your application for A/B testing.
        static readonly string _version = 
            System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString();
            
        public void Initialize(ITelemetry item)
        {
            item.Context.Component.Version = _version;
        }
    }
```

# [NET 6.0+](#tab/aspnetcore)

For [ASP.NET Core](asp-net-core.md#add-telemetryinitializers) applications, add a new telemetry initializer to the Dependency Injection service collection in the `Program.cs` class.

```csharp
using Microsoft.ApplicationInsights.Extensibility;

builder.Services.AddSingleton<ITelemetryInitializer, MyTelemetryInitializer>();
```

# [.NET Framework 4.8](#tab/aspnet-framework)

In the web app initializer, such as `Global.asax.cs`:

```csharp

    protected void Application_Start()
    {
        // ...
        TelemetryConfiguration.Active.TelemetryInitializers
            .Add(new MyTelemetryInitializer());
    }
```

---

## Next steps

   - [Users, sessions, and events](usage-segmentation.md)
   - [Funnels](usage-funnels.md)
   - [Retention](usage-retention.md)
   - [User Flows](usage-flows.md)
   - [Workbooks](../visualize/workbooks-overview.md)
