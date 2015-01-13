<properties title="Track usage in web applications with Application Insights" pageTitle="Track usage in web applications" description="Log user activities." metaKeywords="analytics monitoring application insights" authors="awills" manager="kamrani" />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="2015-01-09" ms.author="awills" />
 
# Track usage of web applications

Find out how your web application is being used. Set up usage analytics and you'll find out how many users experience your service, how many of them come back,  how often they visit your site, and which pages they look at most. Add a few [custom events and metrics][track], and you can analyse in detail the most popular features, the most common mistakes, and tune your app to success with your users.

Here you'll learn about collecting telemetry from the page running in the browser, but if you also set up server telemetry, the two streams will be integrated in  the Application Insights portal. 

* [Set up web usage analytics](#webclient)
* [Usage analytics](#usage)
* [Custom page counts for single-page apps](#spa)
* [Inspecting individual page events](#inspect)
* [Detailed tracking with custom events and metrics](#custom)
* [Video](#video)

## <a name="webclient"></a> Setting up web client analytics

If you chose to add Application Insights when you were creating your web app, you can skip this step. A script will already have been inserted in your web client code. [Skip to the next step](#usage).

#### Get an Application Insights resource in Azure

**If you're developing an ASP.NET app** and you haven't done this yet, [add Application Insights to your web project][start]. 

In Solution Explorer, right-click your project and choose **Open Application Insights**.

**If your website platform isn't ASP.NET:** Sign up to [Microsoft Azure](http://azure.com), go to the [Preview portal](https://portal.azure.com), and add an Application Insights resource.

![](./media/appinsights/appinsights-11newApp.png)

(You can get back to it later with the Browse button.)


#### Add our script to your web pages

In Quick Start, get the script for web pages.

![](./media/appinsights/appinsights-06webcode.png)

Insert the script just before the &lt;/head&gt; tag of every page you want to track. If your website has a master page, you can put the script there. For example, in an ASP.NET MVC project, you'd put it in View\Shared\_Layout.cshtml

(If you're using a well-known web page framework, look around for Application Insights adaptors. For example, there's [an Angularjs module](http://ngmodules.org/modules/angular-appinsights).)

## <a name="usage"></a>Usage analytics

Run your web app, use it a bit to generate telemetry, and wait a few seconds. You can either run it with F5 on your development machine, or deploy it to your server.

In the application overview blade, the top chart on the Overview lens shows average load time at the browser, segmented into the time taken to request the page and the time taken to complete it:

![](./media/appinsights/appinsights-47usage.png)

Scroll down to see the Usage analytics lens:

![](./media/appinsights/appinsights-47usage-2.png)

*No data yet? Click **Refresh** at the top of the page. Still nothing? See [Troubleshooting][qna].*

* **Users:** The count of distinct users over the time range of the chart. (Cookies are used to identify returning users.)
* **Sessions:** A session is counted when a user has not made any requests for 30 minutes.
* **Page views** Counts the number of calls to trackPageView(), typically called once in each web page.

### Click through to more detail

Click any of the charts to see more detail. Notice that you can change the time range of the charts.

![](./media/appinsights/appinsights-49usage.png)


Click a chart to see other metrics that you can display, or add a new chart and select the metrics it displays.

![](./media/appinsights/appinsights-63usermetrics.png)

> [AZURE.NOTE] Metrics can only be displayed in some combinations. When you select a metric, the incompatible ones are disabled.



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

> [AZURE.NOTE] If you use [Search][diagnostic], notice that you have to match whole words: "Abou" and "bout" do not match "About", but "Abou* " does. And you cannot begin a search term with a wildcard. For example, searching for "*bou" would not match "About". 

> [Learn more about diagnostic search][diagnostic]

## <a name="custom"></a> Detailed tracking with custom events and metrics

Want to find out what your users do with your app? By inserting calls in your client and server code, you can send your own telemetry to Application Insights. For example, you could find out the numbers of users who create orders without completing them, or which validation errors are hit most often, or the average score in a game.

[Learn about the custom events and metrics API][track].

## <a name="server"></a> Telemetry from your web server

If you haven't done this yet, you can get insights from your server and display the data along with your client-side data, enabling you to assess performance at the server and diagnose any issues.

[Learn about adding Application Insights to your server][start].

## <a name="video"></a> Video: Tracking Usage

> [AZURE.VIDEO tracking-usage-with-application-insights]

## <a name="next"></a> Next steps

[Track usage with custom events and metrics][track]




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]




