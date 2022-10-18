---
title: Usage analysis with Application Insights | Azure Monitor
description: Understand your users and what they do with your app.
ms.topic: conceptual
ms.date: 07/30/2021
ms.reviewer: mmcc
---

# Usage analysis with Application Insights

Which features of your web or mobile app are most popular? Do your users achieve their goals with your app? Do they drop out at particular points, and do they return later? [Application Insights](./app-insights-overview.md) helps you gain powerful insights into how people use your app. Every time you update your app, you can assess how well it works for users. With this knowledge, you can make data-driven decisions about your next development cycles.

## Send telemetry from your app

The best experience is obtained by installing Application Insights both in your app server code and in your webpages. The client and server components of your app send telemetry back to the Azure portal for analysis.

1. **Server code:** Install the appropriate module for your [ASP.NET](./asp-net.md), [Azure](./app-insights-overview.md), [Java](./java-in-process-agent.md), [Node.js](./nodejs.md), or [other](./platforms.md) app.

    * If you don't want to install server code, [create an Application Insights resource](./create-new-resource.md).

1. **Webpage code:** Add the following script to your webpage before the closing ``</head>``. Replace the instrumentation key with the appropriate value for your Application Insights resource.
    
    The current snippet is version 5 and is listed here. The version is encoded in the snippet as sv:"#". The [current version is also available on GitHub](https://go.microsoft.com/fwlink/?linkid=2156318).

    ```html
    <script type="text/javascript">
    !function(T,l,y){var S=T.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"5",version:2,config:d};function v(e,t){var n={},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e){var t,n,a,i,r,o,s,c,u,p,l;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){var e={},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){var i=n[a].split("=");2===i.length&&(e[i[0][b]()]=i[1])}if(!e[C]){var r=e.endpointsuffix,o=r?e.location:null;e[C]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}return e}(),c=s[D]||d[D]||"",u=s[C],p=u?u+"/v2/track":d.endpointUrl,(l=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=p,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{typeName:"SDKLoadFailed",message:n.replace(/\./g,"-"),hasFullStack:!1,stack:n+"\nSnippet failed to load ["+a+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+i,parsedStack:[]}],r)),l.push(function(e,t,n,a){var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\"/g,"")+'"',o.properties={endpoint:a},i}(0,0,t,p)),function(e,t){if(JSON){var n=T.fetch;if(n&&!y.useXhr)n(t,{method:N,body:JSON.stringify(e),mode:"cors"});else if(XMLHttpRequest){var a=new XMLHttpRequest;a.open(N,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}(l,p))}function i(e,t){f||setTimeout(function(){!t&&m.core||a()},500)}var e=function(){var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(k)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie=l.cookie}catch(p){}function t(e){for(;e.length;)!function(t){m[t]=function(){var e=arguments;g||m.queue.push(function(){m[t].apply(m,e)})}}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{}).ApplicationInsightsAnalytics||{};if(!0!==d[I]&&!0!==s[I]){var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);function a(){y.onInit&&y.onInit(n)}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({})):a()}(window,document,{
    src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", // The SDK URL Source
    // name: "appInsights", // Global SDK Instance name defaults to "appInsights" when not supplied
    // ld: 0, // Defines the load delay (in ms) before attempting to load the sdk. -1 = block page load and add to head. (default) = 0ms load after timeout,
    // useXhr: 1, // Use XHR instead of fetch to report failures (if available),
    crossOrigin: "anonymous", // When supplied this will add the provided value as the cross origin attribute on the script tag
    // onInit: null, // Once the application insights instance has loaded and initialized this callback function will be called with 1 argument -- the sdk instance (DO NOT ADD anything to the sdk.queue -- as they won't get called)
    cfg: { // Application Insights Configuration
      instrumentationKey:"INSTRUMENTATION_KEY"
    }});
    </script>
    ```
   [!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

   To learn more advanced configurations for monitoring websites, check out the [JavaScript SDK reference article](./javascript.md).

1. **Mobile app code:** Use the App Center SDK to collect events from your app. Then send copies of these events to Application Insights for analysis by [following this guide](../app/mobile-center-quickstart.md).

1. **Get telemetry:** Run your project in debug mode for a few minutes. Then look for results in the **Overview** pane in Application Insights.

    Publish your app to monitor your app's performance and find out what your users are doing with your app.

## Explore usage demographics and statistics

Find out when people use your app and what pages they're most interested in. You can also find out where your users are located and what browsers and operating systems they use.

The **Users** and **Sessions** reports filter your data by pages or custom events. The reports segment the data by properties such as location, environment, and page. You can also add your own filters.

:::image type="content" source="./media/usage-overview/users.png" alt-text="Screenshot that shows the Users tab with a bar chart." lightbox="./media/usage-overview/users.png":::

Insights on the right point out interesting patterns in the set of data.

* The **Users** report counts the numbers of unique users that access your pages within your chosen time periods. For web apps, users are counted by using cookies. If someone accesses your site with different browsers or client machines, or clears their cookies, they'll be counted more than once.
* The **Sessions** report counts the number of user sessions that access your site. A session is a period of activity by a user. It's terminated by a period of inactivity of more than half an hour.

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

To get a clear understanding of what users do with your app, it's useful to insert lines of code to log custom events. These events can track anything from detailed user actions, such as selecting specific buttons, to more significant business events, such as making a purchase or winning a game.

You can also use the [Click Analytics Auto-collection plug-in](javascript-click-analytics-plugin.md) to collect custom events.

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
  
## Design the telemetry with the app

When you design each feature of your app, consider how you're going to measure its success with your users. Decide what business events you need to record, and code the tracking calls for those events into your app from the start.

## A | B testing

If you don't know which variant of a feature will be more successful, release both and make each variant accessible to different users. Measure the success of each variant, and then move to a unified version.

For this technique, you attach distinct property values to all the telemetry that's sent by each version of your app. You can do that step by defining properties in the active TelemetryContext. These default properties are added to every telemetry message that the application sends. That means the properties are added to your custom messages and the standard telemetry.

In the Application Insights portal, filter and split your data on the property values so that you can compare the different versions.

To do this step, [set up a telemetry initializer](./api-filtering-sampling.md#addmodify-properties-itelemetryinitializer):

**ASP.NET apps**

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

In the web app initializer, such as Global.asax.cs:

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
> Adding an initializer by using `ApplicationInsights.config` or `TelemetryConfiguration.Active` isn't valid for ASP.NET Core applications.

For [ASP.NET Core](asp-net-core.md#adding-telemetryinitializers) applications, adding a new telemetry initializer is done by adding it to the Dependency Injection container, as shown here. This step is done in the `ConfigureServices` method of your `Startup.cs` class.

```csharp
using Microsoft.ApplicationInsights.Extensibility;

public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<ITelemetryInitializer, MyTelemetryInitializer>();
}
```

## Next steps

   - [Users, sessions, and events](usage-segmentation.md)
   - [Funnels](usage-funnels.md)
   - [Retention](usage-retention.md)
   - [User Flows](usage-flows.md)
   - [Workbooks](../visualize/workbooks-overview.md)
