<properties 
	pageTitle="Application Insights: Proactive detection" 
	description="Application Insights performs deep analysis of your app telemetry and warns you of potential problems." 
	services="application-insights" 
    documentationCenter="windows"
	authors="antonfrMSFT" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/17/2015" 
	ms.author="awills"/>

#  Application Insights: Proactive Detection

*Application Insights is in preview.*


Application Insights performs deep analysis of your app telemetry, and can warn you about potential performance problems. You're probably reading this because you received one of our proactive alerts by email.

## What is Proactive Detection?

Proactive detection uses machine learning and data mining algorithms to detect abnormal patterns that impact application performance. Proactive detection automatically analyzes performance telemetry collected by Application Insights. It sends you email about any abnormal performance in the application. You don't have to set any thresholds rules. Proactive detection notifications are  integrated with Application Insights analytics capabilities which enables a quick triage and diagnosis of the issues. 

Proactive detection is in preview and isn't available for all Application Insights users yet. If you would like to try it out, please contact AppInsightsML@microsoft.com and we will work with you to set it up.

## About the proactive alert

* *Why have I received this email?*
 * Proactive detection analyzed the telemetry your application sent to Application Insights and detected a performance issue in your application.
* *Does the notification mean I definitely have a problem?*
 * No. It's simply a suggestion about something you might want to look at more closely. 
* *What should I do?*
 * [Look at the data presented](#responding-to-an-alert). Use Metrics Explorer to review the performance over time and drill in to additional metrics. Use Search to filter out specific events that will help you identify the root cause. 
* *So, you guys look at my data?*
 * No. The service is entirely automatic. Only you get the notifications. Your data is [private](app-insights-data-retention-privacy.md).


## The detection process

* *What kinds of anomalies are detected?*
 * Patterns that you would find it time-consuming to check for yourself. For example, poor performance in a specific combination of location, time of day and platform.
* *Do you analyze all the data collected by Application Insights?*
 * Not at present. Currently, we analyze request response time and page load time. Analysis of additional metrics is coming soon. 
* *Can I create my own anomaly detection rules?*
 * Not yet. But you can:
 * [Set up alerts](app-insights-alerts.md) that tell you when a metric crosses a threshold.)
 * [Export telemetry](app-insights-export-telemetry.md) to a [database](app-insights-code-sample-export-sql-stream-analytics.md) or [to PowerBI](app-insights-export-power-bi.md) or [other](app-insights-code-sample-export-telemetry-sql-database.md) tools, where you can analyze it yourself.
* *How often is the analysis performed?*
 * We run the analysis daily on the telemetry from the previous day.
* *So does this replace [metric alerts](app-insights-alerts.md)?
 * No.  We don't commit to detect every behaviour that you might consider abnormal.

## How to investigate issues raised by Proactive Detection

Open the anomaly report either from the email or from the anomalies list.

![](./media/app-insights-proactive-detection/03.png)


* **When** shows the time the issue was detected.
* **What** describes
 * The problem that was detected;
 * The characteristics of the set of events that we found displayed the problem behavior.
* The table compares the poorly-performing set with the average behavior of all other events.

Click the links to open Metric Explorer and Search on relevant reports, filtered on the time and properties of the slow performing set.

Modify the time range and filters to explore the telemetry.

## How can I improve performance?

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
 * Click the unsubscribe link in the alert or email. 
 
    Currently they're sent to those who have [write access to the Application Insights resource](app-insights-resources-roles-access-control.md).
* *I don't want to be flooded with these messages.*
 * They are limited to one per day. You won't get repeats of any message.
* *If I don't do anything, will I get a reminder?*
 * No, you get a message about each issue only once.
* *I lost the email. Where can I find the notifications in the portal?*
 * In the Application Insights overview of your app, click the **Proactive Detection** tile. 


## Related articles

* [Detect, Triage, Diagnose](app-insights-detect-triage-diagnose.md)
* [Set metric alerts](app-insights-alerts.md)
* [Metric explorer](app-insights-metrics-explorer.md)
* [Search explorer](app-insights-diagnostic-search.md)
 