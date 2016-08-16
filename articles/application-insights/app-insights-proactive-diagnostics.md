<properties 
	pageTitle="Application Insights: Proactive diagnostics" 
	description="Application Insights performs automatic deep analysis of your app telemetry and warns you of potential problems." 
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
	ms.date="08/15/2016" 
	ms.author="awills"/>

#  Application Insights: Proactive Diagnostics

 Proactive Diagnostics automatically warns you of potential performance problems in your web application. It performs smart analysis of the telemetry that your app sends to [Visual Studio Application Insights](app-insights-overview.md). If there is a sudden rise in failure rates, or abnormal patterns in client or server performance, you get an alert. This feature needs no configuration. It operates if your application sends enough telemetry.

You can access Proactive Detection alerts both from the emails you receive, and from the Proactive Detection blade.

Here's a typical email alert:


![Email alert](./media/app-insights-proactive-diagnostics/03.png)


## Review your Proactive Detections

From your app's overview blade in Application Insights, select Proactive Detection to see a list of recent alerts. Or click the button in the email.

![View recent detections](./media/app-insights-proactive-diagnostics/04.png)

Select an alert to see its details.

## Configure email alert recipients

By default, emails are sent to subscription administrators. Open Settings to add additional or alternative recipients, or to switch off email alerts.

![Configure email recipients](./media/app-insights-proactive-diagnostics/05.png)



## What problems are detected?

There are three kinds of detection:

* [Near-real time failure alerts](app-insights-nrt-proactive-diagnostics.md). We use machine learning to set the expected rate of failed requests for your app, correlating with load and other factors. If the failure rate goes outside the expected envelope, we send an alert.
* [Anomalous behavior](app-insights-proactive-detection.md). We search for anomalous patterns in response times and failure rates every day. We correlate these issues with properties such as location, browser, client OS, server instance, and time of day.
* [Azure Cloud Services](https://azure.microsoft.com/blog/proactive-notifications-on-cloud-service-issues-with-azure-diagnostics-and-application-insights/). You get alerts if your app is hosted in Azure Cloud Services and a role instance has startup failures, frequent recycling, or runtime crashes.




## Related articles

* [Manually configured metric alerts](app-insights-alerts.md)
 

