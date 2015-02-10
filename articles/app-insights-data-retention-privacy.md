<properties 
	pageTitle="Data retention and storage in Application Insights" 
	description="Retention and privacy policy statement" 
	services="application-insights" 
	authors="alancameronwills" 
	manager="kamrani"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2014-11-14" 
	ms.author="awills"/>

# Data retention and storage in Application Insights 

*Application Insights is in preview.*


This article answers questions about how we store the telemetry that your application sends to Application Insights.

Application Insights stores data in Microsoft Azure servers in the United States of America. Download [Security, Privacy, and Compliance white paper](http://go.microsoft.com/fwlink/?LinkId=392408) for details of the Microsoft Azure policy. Some specifics about Application Insights are answered below. 

#### How much data is stored? 

While Application Insights is in this free Preview stage, for each account, we store: 

* Up to 500 telemetry messages per second (or 30K per minute). 

* Up to 10M page views or events per month. 

*What happens if I go over the limits?* 

* Over the short limits, we drop some messages after counting them. You won't see them in Diagnostic Search. Event counts will be correct. Average metrics are based on the events we keep, and should be valid. 

* Over the monthly limit, the events stop being recorded, so your metrics show zeros after some date. 

####How long is the telemetry kept? 

* 7 days for instance data visible in Diagnostic Search. Individual page views, events, log messages, traces, and exceptions. 

* 13 months for aggregated data visible in Metric Explorer. Statistics on metrics, events and exceptions (counts of type, failed function, and so on) are retained at 1 min (or less) grain for 30 days and 1 hour grain for 13 months. 

####Where is the data held? 

* In the USA. 

Do you have an option to store it in Europe or somewhere else? 

* Not yet. 

####How secure is my telemetry data? 

The data is stored in Microsoft Azure servers, and for accounts in the Azure Preview Portal, account restrictions are described in the Azure Security, Privacy, and Compliance document. For accounts in the Visual Studio Online Portal, the VS Online Data Protection document applies. 

Access to your data by Microsoft personnel is restricted. We access your data only with your permission and if it is necessary to support your use of Application Insights. 

####Is the data encrypted in Application Insights servers? 

Not at present. 

####Could Personally Identifiable Information (PII) be sent to Application Insights? 

Yes. Both PII sent to Application Insights by your code in custom telemetry, and PII included in the standard telemetry. The Azure privacy statement applies to Application Insights. 

There are several ways in which data might be sent to the portal. It might then be displayed in Diagnostic Search. Members of your organization could also export and download the data. 

* If you install Status Monitor or add Application Insights to your project, stack traces are captured when exceptions or performance alerts occur. These can include actual parameter data such as SQL data. 

* If you insert telemetry calls such as TrackEvent in your code, or if you capture logging framework messages, the properties could include PII. The Microsoft Online Services Terms also applies. For Application Insights particularly, you must comply with laws and regulations applicable to privacy and data collection. You should determine whether Notification or other Consent is needed before collecting the information. 


####What telemetry is sent when I use Application Insights? 

There are several components you can install. (Refer to [Application Insights - get started][start].) 

<table>
<tr><th>What you set up</th><th>Telemetry sent to portal</th><th>Could contain sensitive data?</th></tr>
<tr><td><a href="../app-insights-start-monitoring-app-health-usage/">Add Application Insights to your web project</a></td>
  <td>Metrics: server request count, server response time</td>
  <td>No</td></tr>
<tr><td></td>
  <td>Exception reports from server</td><td>Stack dumps can contain parameter values</td></tr>
<tr><td><a href="../app-insights-web-track-usage-custom-events-metrics/">Track custom events and metrics</a></td>
  <td>Events with properties attached by your code</td>
  <td>Yes, if your code sends PII in properties or titles</td></tr>
<tr><td><a href="../app-insights-search-diagnostic-logs/#trace">Log and trace telemetry</a></td><td>Log and trace messages</td><td>Log messages could contain PII</td></tr>
<tr><td><a href="../app-insights-web-track-usage/">Insert the AI script in your web pages</a></td>
  <td>Anonymized user and account id</td><td>No</td></tr>
<tr><td></td><td>Anonymous user session start and end</td><td>No</td></tr>
<tr><td></td><td>Page URI, load times, session timing</td><td>No</td></tr>
<tr><td><a href="../app-insights-monitor-performance-live-website-now/">Install Status Monitor on your server</a></td>
  <td>Dependency calls and durations</td>
  <td>Call data can contain parameters - for example SQL fields</td></tr>
<tr><td></td><td>CPU, memory, network and other resource counters</td><td>No</td></tr>
<tr><td><a href="../app-insights-monitor-web-app-availability/">Web tests</a></td><td>Availability and response times as seen from web</td><td>No</td></tr>
</table>

## <a name="video"></a>Videos

#### Introduction

> [AZURE.VIDEO application-insights-introduction]

#### Get started

> [AZURE.VIDEO getting-started-with-application-insights]




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


