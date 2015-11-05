<properties 
	pageTitle="Application Insights: Proactive anomaly detection" 
	description="Application Insights performs deep analysis of your app telemetry and warns you of potential problems." 
	services="application-insights" 
    documentationCenter="windows"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/02/2015" 
	ms.author="awills"/>

#  Application Insights: Proactive Alerts

*Application Insights is in preview.*


Application Insights performs deep analysis of your app telemetry, and can warn you about potential performance problems. You're probably reading this because you received one of our proactive alerts by email.

## About the proactive alert

* *Why have I received this alert?*
 * Application Insights periodically analyzes your data using pattern recognition rules. It looks for anomalies that might indicate performance issues in your application.
* *Does the notification mean I definitely have a problem?*
 * No. It's simply a suggestion about something you might want to look at more closely. 
* *What should I do?*
 * [Look at the data presented](#responding-to-an-alert) and consider whether it might represent a problem. If not, that's fine.
* *So, you guys look at my data?*
 * No. The service is entirely automatic. Only you get the notifications. Your data is [private](app-insights-data-retention-privacy.md).


## The detection process

* *What kinds of anomalies are detected?*
 * Patterns that you would find it time-consuming to check for yourself. For example, poor performance in a specific combination of location, time of day and platform.
* *Can I create my own anomaly detection rules?*
 * Not yet. But you can:
 * [Set up alerts](app-insights-alerts.md) that tell you when a metric crosses a threshold.)
 * [Export telemetry](app-insights-export-telemetry.md) to a [database](app-insights-code-sample-export-sql-stream-analytics.md) or [to PowerBI](app-insights-export-power-bi.md) or [other](app-insights-code-sample-export-telemetry-sql-database.md) tools, where you can analyze it yourself.
* *How often is the analysis performed?*
 * We don't perform analysis on an app resource that doesn't get much telemetry. You're unlikely to get warnings about your debugging sessions.


## Responding to an alert

Open the anomaly report either from the email or from the anomalies list.

![](./media/app-insights-anomaly/02.png)

Notice:

* The description
* The impact statement, which tells you how many or how often users are affected.

Click a chart to open a blade that has more detail.

Modify the time range and filters to explore the telemetry.

## Great to get these alerts. But what can I do to improve performance?

Slow and failed responses are one of the biggest frustrations for web site users, as you will know from your own experience. So it's important to address the issues.

### Triage

First, does it matter? If a page is always slow to load, but only 1% of your site's users ever have to look at it, maybe you have more important things to think about. On the other hand, if only 1% of users open it, but it throws exceptions every time, that might be worth investigating.

Use the impact statement in the email as a general guide, but be aware that it isn't the whole story. Gather other evidence to confirm.

Consider the parameters of the issue. If it's geography-dependent, set up [availability tests](app-insights-monitor-web-app-availability.md) including that region: there might simply be network issues in that area. 

### Diagnose slow page loads 

Where is the problem? Is the server slow to respond, is the page very long, or does the browser have to do a lot of work to display it?

Open the Browsers metric blade. The [segmented display of browser page load time](app-insights-javascript.md#explore-your-data) shows where the time is going. 

* If **Send Request Time** is high, either the server is responding slowly, or the request is a post with a lot of data. Look at the [performance metrics](app-insights-web-monitor-performance.md#metrics) to investigate response times. 
* Set up [dependency tracking](app-insights-dependencies.md) to see whether the slowness is due to external services or your database.
* If **Receiving Response** is predominant, your page and its dependent parts - JavaScript, CSS, images and so on (but not asynchronously loaded data) are long. Set up an [availability test](app-insights-monitor-web-app-availability.md), and be sure to set the option to load dependent parts. When you get some results, open the detail of a result and expand it to see the load times of different files.
* High **Client Processing time** suggests scripts are running slowly. If the reason isn't obvious, consider adding some timing code and send the times in trackMetric calls.

### Improve slow pages

There's a web full of advice on improving your server responses and page load times, so we won't try to repeat it all here. Here are a few tips that you probably already know about, just to get you thinking:

* Slow loading because of big files: Load the scripts and other parts asynchronously. Use script bundling. Break the main page into widgets that load their data separately. Don't send plain old HTML for long tables: use a script to request the data as JSON or other compact format, then fill the table in place. There are great frameworks to help with all this. (They also entail big scripts, of course.)
* Slow server dependencies: Consider the geographical locations of your components. For example, if you're using Azure, make sure the web server and the database are in the same region. Do queries retrieve more information than they need? Would caching or batching help?
* Capacity issues: Look at the server metrics of response times and request counts. If response times peak disproportionately with peaks in request counts, it's likely that your servers are stretched. 


## Notification emails

* *Do I have to subscribe to this service in order to receive notifications?*
 * No. Our bot periodically surveys the data from all Application Insights users, and sends notifications if it detects problems.
* *Can I unsubscribe or get the notifications sent to my colleagues instead?*
 * Click the link in the alert or email. Open anomaly settings.
 
    ![](./media/app-insights-anomaly/01.png)

    Currently they're sent to those who have [write access to the Application Insights resource](app-insights-resources-roles-access-control.md).
* *I don't want to be flooded with these messages.*
 * They are limited to three per day. You won't get repeats of any message.
* *If I don't do anything, will I get a reminder?*
 * No, you get a message about each issue only once.
* *I lost the email. Where can I find the notifications in the portal?*
 * In the Application Insights overview of your app, click the **Anomalies** tile. 






 