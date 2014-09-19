<properties title="Track usage with custom events and metrics" pageTitle="Track usage" description="Log user activities." metaKeywords="analytics monitoring application insights" authors="awills"  />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="awills" />
 
# Track usage



## <a name="webclient"></a>Set up web usage analytics

If you haven't done this yet, [add Application Insights to your web project][start].


## <a name="usage"></a>Usage Analytics

In the application overview blade, you'll see these usage tiles:

![](./media/appinsights/appinsights-47usage.png)


### Sessions per browser

A *session* is a period that starts when a user opens any page on your website, and ends after the user has not sent any web request for a timeout period of 30 minutes. 

Click through to zoom into the chart.

### Top page views

Shows total counts in the last 24 hours.

Click the page views tile to get a more detailed history.

![](./media/appinsights/appinsights-49usage.png)

Click Time Range to see a longer history up to seven days.

## Custom page counts

By default, a page count occurs each time a new page loads into the client browser.  But you might want to count additional page views. For example, a page might display its content in tabs and you want to count a page when the user switches tabs. Or JavaScript code in the page might load new content without changing the browser's URL. 

Insert a JavaScript call like this at the appropriate point in your client code:

    appInsights.trackPageView(myPageName);

The page name can contain the same characters as a URL, but anything after "#" or "?" will be ignored.

## Inspecting individual page view events

Usually page view telemetry is analysed by Application Insights and you see only cumulative reports, averaged over all your users. But for debugging purposes, you can look at some page view events. Only a sample of the recent events are retained for inspection.

In the Diagnostic Search blade, set Filters to Page View.

![](./media/appinsights/appinsights-51searchpageviews.png)

Select any event to see more detail.

> If you use Search, notice that you have to match whole words: "Abou" and "bout" do not match "About", but "Abou* " does. And you cannot begin a search term with a wildcard. For example, searching for "*bou" would not match "About". 

> [Learn more about diagnostic search][diagnostic]



## Tracking usage

> [WACOM.VIDEO tracking-usage-with-application-insights]


## Learn more

* [Application Insights - get started][start]
* [Monitor a live web server now][redfield]
* [Monitor performance in web applications][perf]
* [Search diagnostic logs][diagnostic]
* [Availability tracking with web tests][availability]
* [Track usage][usage]
* [Q & A and troubleshooting][qna]

<!--Link references-->


[start]: ../app-insights-start-monitoring-app-health-usage/
[redfield]: ../app-insights-monitor-performance-live-website-now/
[perf]: ../app-insights-web-monitor-performance/
[diagnostic]: ../app-insights-search-diagnostic-logs/ 
[availability]: ../app-insights-monitor-web-app-availability/
[usage]: ../app-insights-web-track-usage/
[qna]: ../app-insights-troubleshoot-faq/
[webclient]: ../app-insights-start-monitoring-app-health-usage/#webclient
