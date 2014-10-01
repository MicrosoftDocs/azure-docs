<properties title="Track usage in web applications with Application Insights" pageTitle="Track usage in web applications" description="Log user activities." metaKeywords="analytics monitoring application insights" authors="awills" manager="kamrani" />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="2014-09-24" ms.author="awills" />
 
# Track usage of web applications

Find out how your web application is being used. Set up usage analytics and you'll find out which pages are users looking at, how many of them come back, and how often they visit your site. Add a few [custom events and metrics][track], and you can analyse in detail the most popular features, the most common mistakes, and tune your app to success with your users.

Telemetry is gathered from both the client and the server. Client data is collected from all modern web browsers, and server data can be collected if your platform is ASP.NET. (It doesn't have to be running on Azure.) 

* [Set up web usage analytics](#webclient)
* [Usage analytics](#usage)
* [Custom page counts for single-page apps](#spa)
* [Inspecting individual page events](#inspect)
* [Detailed tracking with custom events and metrics](#custom)
* [Video](#video)


## <a name="webclient"></a>Set up web usage analytics

**If you're developing an ASP.NET app** and you haven't done this yet, [add Application Insights to your web project][start]. This lets you get telemetry from both client and server.

**For any other type of app,** you can still get telemetry from the web client. Sign up to [Microsoft Azure](http://azure.com), go to the [Preview portal](https://portal.azure.com), and add an Application Insights resource.

![](./media/appinsights/appinsights-11newApp.png)

(You can get back to it later with the Browse button.)

In Quick Start, get the script for web pages.

![](./media/appinsights/appinsights-06webcode.png)

Insert the script in the header of every page you want to track. Usually you can do that by inserting it in a master page.


## <a name="usage"></a>Usage analytics

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

Click a graph to see other metrics that you can display.

![](./media/appinsights/appinsights-63usermetrics.png)

## <a name="spa"></a> Custom page counts for single-page apps

By default, a page count occurs each time a new page loads into the client browser.  But you might want to count additional page views. For example, a page might display its content in tabs and you want to count a page when the user switches tabs. Or JavaScript code in the page might load new content without changing the browser's URL. 

Insert a JavaScript call like this at the appropriate point in your client code:

    appInsights.trackPageView(myPageName);

The page name can contain the same characters as a URL, but anything after "#" or "?" will be ignored.


## <a name="inspect"></a> Inspecting individual page view events

Usually page view telemetry is analysed by Application Insights and you see only cumulative reports, averaged over all your users. But for debugging purposes, you can also look at individual page view events.

In the Diagnostic Search blade, set Filters to Page View.

![](./media/appinsights/appinsights-51searchpageviews.png)

Select any event to see more detail.

> [WACOM.NOTE] If you use [Search][diagnostic], notice that you have to match whole words: "Abou" and "bout" do not match "About", but "Abou* " does. And you cannot begin a search term with a wildcard. For example, searching for "*bou" would not match "About". 

> [Learn more about diagnostic search][diagnostic]

## <a name="custom"></a> Detailed tracking with custom events and metrics

Want to find out what your users do with your app? By inserting calls in your client and server code, you can send your own telemetry to Application Insights. For example, you could find out the numbers of users who create orders without completing them, or which validation errors are hit most often, or the average score in a game.

[Learn about the custom events and metrics API][track].

## <a name="video"></a> Video: Tracking Usage

> [AZURE.VIDEO tracking-usage-with-application-insights]

## <a name="next"></a> Next steps

[Track usage with custom events and metrics][track]


## Learn more
* [Application Insights - get started][start]
* [Monitor a live web server now][redfield]
* [Monitor performance in web applications][perf]
* [Search diagnostic logs][diagnostic]
* [Availability tracking with web tests][availability]
* [Track usage][usage]
* [Track custom events and metrics][track]
* [Q & A and troubleshooting][qna]

<!--Link references-->


[start]: ../app-insights-start-monitoring-app-health-usage/
[redfield]: ../app-insights-monitor-performance-live-website-now/
[perf]: ../app-insights-web-monitor-performance/
[diagnostic]: ../app-insights-search-diagnostic-logs/ 
[availability]: ../app-insights-monitor-web-app-availability/
[usage]: ../app-insights-web-track-usage/
[track]: ../app-insights-web-track-custom-events-metrics/
[qna]: ../app-insights-troubleshoot-faq/
[webclient]: ../app-insights-start-monitoring-app-health-usage/#webclient

