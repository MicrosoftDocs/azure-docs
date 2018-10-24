---
title: Azure Application Insights for JavaScript web apps | Microsoft Docs
description: Get page view and session counts, web client data, and track usage patterns. Detect exceptions and performance issues in JavaScript web pages.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: 3b710d09-6ab4-4004-b26a-4fa840039500
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 03/14/2017
ms.author: mbullwin

---
# Application Insights for web pages
Find out about the performance and usage of your web page or app. If you add [Application Insights](app-insights-overview.md) to your page script, you get timings of page loads and AJAX calls, counts and details of browser exceptions and AJAX failures, as well as users and session counts. All these can be segmented by page, client OS and browser version, geo location, and other dimensions. You can set alerts on failure counts or slow page loading. And by inserting trace calls in your JavaScript code, you can track how the different features of your web page application are used.

Application Insights can be used with any web pages - you just add a short piece of JavaScript. If your web service is [Java](app-insights-java-get-started.md) or [ASP.NET](app-insights-asp-net.md), you can integrate telemetry from your server and clients.

![In portal.azure.com, open your app's resource and click Browser](./media/app-insights-javascript/03.png)

You need a subscription to [Microsoft Azure](https://azure.com). If your team has an organizational subscription, ask the owner to add your Microsoft Account to it.

## Set up Application Insights for your web page
Add the loader code snippet to your web pages, as follows.

### Open or create Application Insights resource
The Application Insights resource is where data about your page's performance and usage is displayed. 

Sign into [Azure portal](https://portal.azure.com).

If you already set up monitoring for the server side of your app, you already have a resource:

![Choose Browse, Developer Services, Application Insights.](./media/app-insights-javascript/01-find.png)

If you don't have one, create it:

![Choose New, Developer Services, Application Insights.](./media/app-insights-javascript/01-create.png)

*Questions already?* [More about creating a resource](app-insights-create-new-resource.md).

### Add the SDK script to your app or web pages

```HTML
<!-- 
To collect user behavior analytics about your application, 
insert the following script into each page you want to track.
Place this code immediately before the closing </head> tag,
and before any other scripts. Your first data will appear 
automatically in just a few seconds.
-->
<script type="text/javascript">
var appInsights=window.appInsights||function(a){
  function b(a){c[a]=function(){var b=arguments;c.queue.push(function(){c[a].apply(c,b)})}}var c={config:a},d=document,e=window;setTimeout(function(){var b=d.createElement("script");b.src=a.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js",d.getElementsByTagName("script")[0].parentNode.appendChild(b)});try{c.cookie=d.cookie}catch(a){}c.queue=[];for(var f=["Event","Exception","Metric","PageView","Trace","Dependency"];f.length;)b("track"+f.pop());if(b("setAuthenticatedUserContext"),b("clearAuthenticatedUserContext"),b("startTrackEvent"),b("stopTrackEvent"),b("startTrackPage"),b("stopTrackPage"),b("flush"),!a.disableExceptionTracking){f="onerror",b("_"+f);var g=e[f];e[f]=function(a,b,d,e,h){var i=g&&g(a,b,d,e,h);return!0!==i&&c["_"+f](a,b,d,e,h),i}}return c
  }({
      instrumentationKey:"<your instrumentation key>"
  });
  
window.appInsights=appInsights,appInsights.queue&&0===appInsights.queue.length&&appInsights.trackPageView();
</script>
```

Insert the script just before the `</head>` tag of every page you want to track. If your website has a master page, you can put the script there. For example:

* In an ASP.NET MVC project, you'd put it in `View\Shared\_Layout.cshtml`
* In a SharePoint site, on the control panel, open [Site Settings / Master Page](app-insights-sharepoint.md).

The script contains the instrumentation key that directs the data to your Application Insights resource. 

([Deeper explanation of the script.](http://apmtips.com/blog/2015/03/18/javascript-snippet-explained/))

*(If you're using a well-known web page framework, look around for Application Insights adaptors. For example, there's [an AngularJS module](http://ngmodules.org/modules/angular-appinsights).)*

## Detailed configuration
There are several [parameters](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#config) you can set, though in most cases, you shouldn't need to. For example, you can disable or limit the number of Ajax calls reported per page view (to reduce traffic). Or you can set debug mode to have telemetry move rapidly through the pipeline without being batched.

To set these parameters, look for this line in the code snippet, and add more comma-separated items after it:

    })({
      instrumentationKey: "..."
      // Insert here
    });

The [available parameters](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#config) include:

    // Send telemetry immediately without batching.
    // Remember to remove this when no longer required, as it
    // can affect browser performance.
    enableDebug: boolean,

    // Don't log browser exceptions.
    disableExceptionTracking: boolean,

    // Don't log ajax calls.
    disableAjaxTracking: boolean,

    // Limit number of Ajax calls logged, to reduce traffic.
    maxAjaxCallsPerView: 10, // default is 500

    // Time page load up to execution of first trackPageView().
    overridePageViewDuration: boolean,

    // Set dynamically for an authenticated user.
    accountId: string,

## <a name="run"></a>Run your app
Run your web app, use it a while to generate telemetry, and wait a few seconds. You can either run it using the **F5** key on your development machine, or publish it and let users play with it.

If you want to check the telemetry that a web app is sending to Application Insights, use your browser's debugging tools (**F12** on many browsers). Data is sent to dc.services.visualstudio.com.

## Explore your browser performance data
Open the Browser blade to show aggregated performance data from your users' browsers.

![In portal.azure.com, open your app's resource and click Settings, Browser](./media/app-insights-javascript/03.png)

No data yet? Click **Refresh** at the top of the page. Still nothing? See [Troubleshooting](app-insights-troubleshoot-faq.md).

The Browser blade is a [Metrics Explorer blade](app-insights-metrics-explorer.md) with preset filters and chart selections. You can edit the time range, filters, and chart configuration if you want, and save the result as a favorite. Click **Restore defaults** to get back to the original blade configuration.

## Page load performance
At the top is a segmented chart of page load times. The total height of the chart represents the average time to load and display pages from your app in your users' browsers. The time is measured from when the browser sends the initial HTTP request until all synchronous load events have been processed, including layout and running scripts. It doesn't include asynchronous tasks such as loading web parts from AJAX calls.

The chart segments the total page load time into the [standard timings defined by W3C](http://www.w3.org/TR/navigation-timing/#processing-model). 

![](./media/app-insights-javascript/08-client-split.png)

Note that the *network connect* time is often lower than you might expect, because it's an average over all requests from the browser to the server. Many individual requests have a connect time of 0 because there is already an active connection to the server.

### Slow loading?
Slow page loads are a major source of dissatisfaction for your users. If the chart indicates slow page loads, it's easy to do some diagnostic research.

The chart shows the average of all page loads in your app. To see if the problem is confined to particular pages, look further down the blade, where there's a grid segmented by page URL:

![](./media/app-insights-javascript/09-page-perf.png)

Notice the page view count and standard deviation. If the page count is very low, then the issue isn't affecting users much. A high standard deviation (comparable to the average itself) indicates a lot of variation between individual measurements.

**Zoom in on one URL and one page view.** Click any page name to see a blade of browser charts filtered just to that URL; and then on an instance of a page view.

![](./media/app-insights-javascript/35.png)

Click `...` for a full list of properties for that event, or inspect the Ajax calls and related events. Slow Ajax calls affect the overall page load time if they are synchronous. Related events include server requests for the same URL (if you've set up Application Insights on your web server).

**Page performance over time.** Back at the Browsers blade, change the Page View Load Time grid into a line chart to see if there were peaks at particular times:

![Click the head of the grid and select a new chart type](./media/app-insights-javascript/10-page-perf-area.png)

**Segment by other dimensions.** Maybe your pages are slower to load on a particular browser, client OS, or user locality? Add a new chart and experiment with the **Group-by** dimension.

![](./media/app-insights-javascript/21.png)

## AJAX Performance
Make sure any AJAX calls in your web pages are performing well. They are often used to fill parts of your page asynchronously. Although the overall page might load promptly, your users could be frustrated by staring at blank web parts, waiting for data to appear in them.

AJAX calls made from your web page are shown on the Browsers blade as dependencies.

There are summary charts in the upper part of the blade:

![](./media/app-insights-javascript/31.png)

and detailed grids lower down:

![](./media/app-insights-javascript/33.png)

Click any row for specific details.

> [!NOTE]
> If you delete the Browsers filter on the blade, both server and AJAX dependencies are included in these charts. Click Restore Defaults to reconfigure the filter.
> 
> 

**To drill into failed Ajax calls** scroll down to the Dependency failures grid, and then click a row to see specific instances.

![](./media/app-insights-javascript/37.png)


Click `...` for the full telemetry for an Ajax call.

### No Ajax calls reported?
Ajax calls include any HTTP/HTTPS  calls made from the script of your web page. If you don't see them reported, check that the code snippet doesn't set the `disableAjaxTracking` or `maxAjaxCallsPerView` [parameters](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#config).

## Browser exceptions
On the Browsers blade, there's an exceptions summary chart, and a grid of exception types further down the blade.

![](./media/app-insights-javascript/39.png)

If you don't see browser exceptions reported, check that the code snippet doesn't set the `disableExceptionTracking` [parameter](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#config).

## Inspect individual page view events

Usually page view telemetry is analyzed by Application Insights and you see only cumulative reports, averaged over all your users. But for debugging purposes, you can also look at individual page view events.

In the Diagnostic Search blade, set Filters to Page View.

![](./media/app-insights-javascript/12-search-pages.png)

Select any event to see more detail. In the details page, click "..." to see even more detail.

> [!NOTE]
> If you use [Search](app-insights-diagnostic-search.md), notice that you have to match whole words: "Abou" and "bout" do not match "About".
> 
> 

You can also use the powerful [Log Analytics query language](https://docs.microsoft.com/azure/application-insights/app-insights-analytics-tour#browser-timings-table) to search page views.

### Page view properties
* **Page view duration** 
  
  * By default, the time it takes to load the page, from client request to full load (including auxiliary files but excluding asynchronous tasks such as Ajax calls). 
  * If you set `overridePageViewDuration` in the [page configuration](#detailed-configuration), the interval between client request to execution of the first `trackPageView`. If you moved trackPageView from its usual position after the initialization of the script, it will reflect a different value.
  * If `overridePageViewDuration` is set and a duration argument is provided in the `trackPageView()` call, then the argument value is used instead. 

## Custom page counts
By default, a page count occurs each time a new page loads into the client browser.  But you might want to count additional page views. For example, a page might display its content in tabs and you want to count a page when the user switches tabs. Or JavaScript code in the page might load new content without changing the browser's URL.

Insert a JavaScript call like this at the appropriate point in your client code:

    appInsights.trackPageView(myPageName);

The page name can contain the same characters as a URL, but anything after "#" or "?" is ignored.

## Usage tracking
Want to find out what your users do with your app?

* [Learn about the user behavior analytics tools](app-insights-web-track-usage.md)
* [Learn about custom events and metrics API](app-insights-api-custom-events-metrics.md).

## <a name="video"></a> Video


> [!VIDEO https://channel9.msdn.com/events/Connect/2016/100/player]



## <a name="next"></a> Next steps
* [Track usage](app-insights-web-track-usage.md)
* [Custom events and metrics](app-insights-api-custom-events-metrics.md)
* [Build-measure-learn](app-insights-web-track-usage.md)

