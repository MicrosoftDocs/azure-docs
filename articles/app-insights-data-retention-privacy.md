<properties 
	pageTitle="Data retention and storage in Application Insights" 
	description="Retention and privacy policy statement" 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="keboyd"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/05/2015" 
	ms.author="awills"/>

# Data collection, retention and storage in Application Insights 

*Application Insights is in preview.*

## Overview

This article answers questions about the data collected by  [Visual Studio Application Insights][start] and how it is processed and stored.

Application Insights is an Azure Service in Preview. While in Preview we are working towards protecting your data per the policies described in the [Azure Security, Privacy, and Compliance white paper](http://go.microsoft.com/fwlink/?linkid=392408).


## Collection

#### How is data collected by Application Insights?

Application Insights SDKs and agents that you combine with your application send data to the Application Insights service.  The data is processed by the service to provide you with reports, alerts and other functionality.  This can include data that you choose to capture by using the API, for example in properties and custom events.

#### How much data can be captured? 

Currently, up to 500 events per second per instrumentation key (that is, per application).


#### How long is the data kept? 

Up to 30 days for individual events (that is, data items that you can inspect in Diagnostic Search). 

Aggregated data (that is, counts, averages and other statistical data that you see in Metric Explorer) are retained at a grain of 1 minute for 30 days, and 1 hour or 1 day (depending on type) for 13 months.

#### What limits are there on different types of data?

1.	Maximum of 200 unique metric names and 200 unique property names for your application. Metrics include data send via TrackMetric as well as measurements on other  data types such as Events.  [Metrics and property names][api] are global per instrumentation key not scoped to data type.
2.	[Properties][apiproperties] can be used for filtering and group by only while they have less than 100 unique values for each property. After the unique values exceed 100, the property can still be used for search and filtering but no longer for filters.
3.	Standard properties such as Request Name and Page URL are limited to 1000 unique values per week. After 1000 unique values, additional values are marked as “Other values”. The original value can still be used for full text search and filtering.


## Access

#### Who can see the data?

The data is visible to you and, if you have an organization account, your team members. 

It can be exported by you and your team members and could be copied to other locations and passed on to other people.

#### What does Microsoft do with the information my app sends to Application Insights?

Microsoft uses the data only in order to provide the service to you.


## Location

#### Where is the data held? 

* In the USA. 

#### Can it be stored somewhere else, for example in Europe? 

* Not yet. 

## Security 

#### How secure is my data? 

The data is stored in Microsoft Azure servers. For accounts in the Azure Preview Portal, account restrictions are described in the [Azure Security, Privacy, and Compliance document](http://go.microsoft.com/fwlink/?linkid=392408). For accounts in the Visual Studio Online Portal, the [Visual Studio Online Data Protection](http://download.microsoft.com/download/8/E/E/8EE6A61C-44C2-4F81-B870-A267F1DF978C/MicrosoftVisualStudioOnlineDataProtection.pdf) document applies. 

Access to your data by Microsoft personnel is restricted. We access your data only with your permission and if it is necessary to support your use of Application Insights. 

Data in aggregate across all our customers' applications (such as data rates and average size of traces) is used to improve Application Insights.

#### Could someone else's telemetry interfere with my Application Insights data?

They could send additional telemetry to your account by using the instrumentation key, which can be found in the code of your web pages. With enough additional data, your metrics would not correctly represent your app's performance and usage.

If you share code with other projects, remember to remove your instrumentation key.

## Encryption

#### Is the data encrypted in Application Insights servers? 

Not inside the servers at present.

All data is encrypted as it moves between data centers.

#### Is the data encrypted in transit from my application to Application Insights servers?

Yes, we use https to send data to the portal from nearly all SDKs, including web servers, devices and HTTPS web pages. The only exception is data sent from plain HTTP web pages.

## Personally Identifiable Information

#### Could Personally Identifiable Information (PII) be sent to Application Insights? 

Yes. 

As general guidance:

* Most standard telemetry (that is, telemetry sent without you writing any code) does not include explicit PII. However, it might be possible to identify individuals by inference from a collection of events.
* Exception and trace messages could contain PII
* Custom telemetry - that is, calls such as TrackEvent that you write in code using the API or log traces - can contain any data you choose.


The table at the end of this document contains more detailed descriptions of the data collected.



#### Am I responsible for complying with laws and regulations in regard to PII?

Yes. It is your responsibility to ensure that the collection and use of the data complies with laws and regulations, and with the Microsoft Online Services Terms.

You should inform your customers appropriately about the data your application collects and how the data is used.

#### Can my users turn off Application Insights?

Not directly. We don't provide a switch that your users can operate to turn off Application Insights.

However, you can implement such a feature in your application. All the SDKs include an API setting that turns off telemetry collection. 

#### My application is unintentionally collecting sensitive information. Can Application Insights scrub this data so it isn't retained?

Application Insights does not filter or delete your data. You should manage the data appropriately and avoid sending such data to Application Insights.



## Data sent by Application Insights

The SDKs vary between platforms, and there are are several components that you can install. (Refer to [Application Insights - get started][start].) Each component sends different data.

#### Classes of data sent in different scenarios

Your action  | Data classes collected (see next table)
---|---
[Add Application Insights SDK to a .NET web project][greenbrown] | ServerContext<br/>Inferred<br/>Perf counters<br/>Requests<br/>**Exceptions**<br/>Session<br/>users
[Install Status Monitor on IIS][redfield]<br/>[Add AI Extension to Azure VM or Web App][azure]|Dependencies<br/>ServerContext<br/>Inferred<br/>Perf counters
[Add Application Insights SDK to a Java web app][java]|ServerContext<br/>Inferred<br/>Request<br/>Session<br/>users
[Add JavaScript SDK to web page][client]|ClientContext <br/>Inferred<br/>Page<br/>ClientPerf
[Add SDK to Windows Store app][windows]|DeviceContext<br/>Users<br/>Crash data
[Define default properties][apiproperties]|**Properties** on all standard and custom events
[Call TrackMetric][api]|Numeric values<br/>**Properties**
[Call Track*][api]|Event name<br/>**Properties**
[Call TrackException][api]|**Exceptions**<br/>Stack dump<br/>**Properties**

For [SDKs for other platforms][platforms], see their documents.

#### The classes of collected data

Collected data class | Includes (not an exhaustive list) 
---|---
**Properties**|**Any data - determined by your code**
DeviceContext |Id, IP, Locale, Device model, network, network type, OEM name, screen resolution, Role Instance, Role Name, Device Type
ClientContext |OS, locale, language, network, window resolution
Session | session id
ServerContext |Machine name, locale, OS, device, user session, user context, operation 
Inferred |geo location from IP address, timestamp, OS, browser
Metrics | Metric name and value
Events | Event name and value
PageViews | URL and page name or screen name
Client perf | URL/page name, browser load time
Requests |URL, duration, response code
Dependencies|Type(SQL, HTTP, ...), connection string or URI, sync|async, duration, success, SQL statement (with Status Monitor)
**Exceptions** | Type, **message**, call stacks, source file and line number, thread id
Crashes | Process id, parent process id, crash thread id; application patch, id, build;  exception type, address, reason; obfuscated symbols and registers, binary start and end addresses, binary name and path, cpu type
Trace | **Message** and severity level
Perf counters | Processor time, available memory, request rate, exception rate, process private bytes, IO rate, request duration, request queue length
Availability | Web test response code, duration of each test step




## <a name="video"></a>Videos

#### Introduction

> [AZURE.VIDEO application-insights-introduction]

#### Get started

> [AZURE.VIDEO getting-started-with-application-insights]




<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apiproperties]: app-insights-api-custom-events-metrics.md#properties
[azure]: insights-perf-analytics.md
[client]: app-insights-javascript.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[java]: app-insights-java-get-started.md
[platforms]: app-insights-platforms.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[start]: app-insights-get-started.md
[windows]: app-insights-windows-get-started.md

