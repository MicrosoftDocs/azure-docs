<properties title="Track usage with custom events and metrics" pageTitle="Track usage" description="Log user activities." metaKeywords="analytics monitoring application insights" authors="awills"  />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="awills" />
 
# Track usage

If you haven't yet [set up your web project for Application Insights][start], do that now.

## <a name="usage"></a>Usage Analytics

![](./media/appinsights/appinsights-47usage.png)

Usage data comes partly from the server and partly from the [scripts in the web pages][start].

### Sessions per browser

A *session* is a period that starts when a user opens any page on your website, and ends after the user has not sent any web request for a timeout period of 30 minutes. 

Click through to zoom into the chart.

### Top page views

Shows total counts in the last 24 hours.

Click through to see graphs of page views over the past week.

## Track usage with custom events and metrics

### Coming soon

The Application Insights SDK lets you insert lines of code into your application to monitor user activities, so that you can tune your app to their needs.

We're currently still porting this feature over to the new Application Insights portal in Microsoft Azure. (If you want, you can [see how it works in the old portal](http://msdn.microsoft.com/library/dn481100.aspx).)

However, one thing you can do right now is to [capture and search diagnostic event logs generated with Trace, NLog or Log4Net][diagnostic]. 


## Tracking usage

[WACOM.VIDEO tracking-usage-with-application-insights]


## Application Insights

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
[start]: ../app-insights-monitor-application-health-performance/
[redfield]: ../app-insights-monitor-performance-live-website-now/
[explore]: ../app-insights-explore-metrics/
[diagnostic]: ../app-insights-search-diagnostic-logs/ 
[availability]: ../app-insights-monitor-web-app-availability/
[usage]: ../app-insights-track-usage-custom-events-metrics/
[qna]: ../app-insights-troubleshoot-faq/

