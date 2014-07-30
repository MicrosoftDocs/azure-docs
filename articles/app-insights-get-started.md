<properties title="Application Insights" pageTitle="Application Insights" description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." metaKeywords="analytics monitoring application insights" authors="awills"  />

# Application Insights - Get Started

*Application Insights is in preview.*

Application Insights lets you monitor the availability, performance, and usage of your live application. (It doesn't have to be a Microsoft Azure application.) Configuration is very easy, and you'll see results in minutes.

* **Availability** - Make sure your web app is available and responsive. We'll test your URLs every few minutes from locations around the globe, and let you know if there's a problem.
* **Performance** - Diagnose any performance issues or exceptions in your web service. See how your response times vary with the request count, find out if CPU or other resources are being stretched, get stack traces from exceptions, and easily search through log traces. 
* **Usage** - Find out what users are doing with your app, so that you can focus your development work where it's most useful. Currently, you can monitor web apps, Windows Store, and Windows Phone apps.

## Get started

There are two ways to get started:

* [Add Application Insights to your project in Visual Studio][start]

    Add Application Insights to your projects to track usage, performance and availability, and to analyse diagnostic logs. You can see data within minutes in debug mode, and then deploy your project to get live data.

    Use this option if you're updating or creating a project. 
    
    [Get started by adding Application Insights to your project.][start]

* [Diagnose issues in a live web service now][redfield]

    Install the Application Insights agent on your IIS server and see performance data in minutes. Watch  request count, response times, resource load, and get exception traces. 

    Use this option if you need to understand what's going on in your web server right now. It doesn't involve redeploying your code. But you do need administrative access to your server, and a Microsoft Azure account.

    You can add availability monitoring at any time. 

	Later, you can use the other option to add Application Insights to your project to analyse diagnostic logs and track usage.

    [Get started by installing Application Insights on your web server.][redfield]

>[WACOM.NOTE] There's an [older version of Application Insights](http://msdn.microsoft.com/en-us/library/dn481095.aspx) in Visual Studio Online. We're rebuilding it from the ground up as part of Microsoft Azure, and it's the new version that you're reading about here.

![Example application monitor in Application Insights](./media/appinsights/appinsights-00-appblade.png)

## Learn more

* [Application Insights][root]
* [Add Application Insights to your project][start]
* [Monitor a live web server now][redfield]
* [Explore metrics in Application Insights][explore]
* [Diagnostic log search][diagnostic]
* [Availability tracking with web tests][availability]
* [Usage tracking with events and metrics][usage]
* [Q & A and troubleshooting][qna]


<!--Link references-->

[root]: ../app-insights-get-started/
[start]: ../app-insights-monitor-application-health-usage/
[redfield]: ../app-insights-monitor-performance-live-website-now/
[explore]: ../app-insights-explore-metrics/
[diagnostic]: ../app-insights-search-diagnostic-logs/ 
[availability]: ../app-insights-monitor-web-app-availability/
[usage]: ../app-insights-web-track-usage-custom-events-metrics/
[qna]: ../app-insights-troubleshoot-faq/
