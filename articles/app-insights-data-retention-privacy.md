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
	ms.date="04/04/2015" 
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

## Access

#### Who can see the data?

The data is visible to you and, if you have an organization account, your team members. 

It can be exported by you and your team members and could be copied to other locations and passed on to other people.

#### What does Microsoft do with the information your app sends to Application Insights?

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

Data in aggregate across all our customers’ applications (such as data rates and average size of traces) is used to improve Application Insights.

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
* Exception reports might include PII in parameter data.
* Custom telemetry – that is, calls such as TrackEvent that you write in code using the API or log traces – can contain any data you choose.


The table at the end of this document contains more detailed descriptions of the data collected.



#### Am I responsible for complying with laws and regulations in regard to PII?

Yes. It is your responsibility to ensure that the collection and use of the data complies with laws and regulations, and with the Microsoft Online Services Terms.

You should inform your customers appropriately about the data your application collects and how the data is used.

#### Can my users turn off Application Insights?

Not directly. We don’t provide a switch that your users can operate to turn off Application Insights.

However, you can implement such a feature in your application. All the SDKs include an API setting that turns off telemetry collection. 

#### My application is unintentionally collecting sensitive information. Can Application Insights scrub this data so it isn’t retained?

Application Insights does not filter or delete your data. You should manage the data appropriately and avoid sending such data to Application Insights.



## Data sent by Application Insights

The SDKs vary between platforms, and there are are several components that you can install. (Refer to [Application Insights - get started][start].) Each component sends different data.

#### Classes of data sent in different scenarios

Your action  | Data classes collected (see next table)
---|---
[Add Application Insights SDK to a .NET web project][greenbrown] | ServerContext<br/>Inferred<br/>Perf counters<br/>Requests<br/>**Exceptions**<br/>Session<br/>Anon users<br/>**Auth users**
[Install Status Monitor on IIS][redfield]<br/>[Add AI Extension to Azure VM or Web App][azure]|Dependencies<br/>ServerContext<br/>Inferred<br/>Perf counters<br/>Requests<br/>**Exceptions**<br/>Session<br/>Anon users<br/>**Auth users**
[Add Application Insights SDK to a Java web app][java]|ServerContext<br/>Inferred<br/>Request<br/>Session
[Add JavaScript SDK to web page][client]|ClientContext <br/>Inferred<br/>Page<br/>ClientPerf
[Add SDK to Windows Store app][windows]|DeviceContext<br/>**Auth users**<br/>Crashes
[Define default properties][apiproperties]|**Properties** on all standard and custom events
[Call TrackMetric][api]|Numeric values<br/>**Properties**
[Call Track*][api]|Event name<br/>**Properties**
[Call TrackException][api]|**Exception**

For [SDKs for other platforms][platforms], see their documents.

#### The classes of collected data

Collected data class | Includes (not an exhaustive list) 
---|---|---
ServerContext |Machine name, locale, OS, 
ClientContext |Browser type, OS, locale, language, network, window resolution
DeviceContext |Locale, language, Device model, Device language, network, network type, OEM name, screen resolution
Perf counters | Processor time, available memory, request rate, exception rate, process private bytes, IO rate, request duration, request queue length
Requests |HTTP request string, duration, response code
Dependencies|Type(SQL, HTTP, ...), connection string or URI
**Exceptions** | Type, message, call stacks, **parameter data**
Crashes | Process id, parent process id, crash thread id, application patch, obfuscated symbols and registers, binary start and end addresses, binary name and path, cpu type
Session | session id
Anon users | GUID 
Page | URL and page name
**Auth users** |
Inferred |geo location from IP address, timestamp, OS, browser
**Properties**|**Any data - determined by your code**




## <a name="video"></a>Videos

#### Introduction

> [AZURE.VIDEO application-insights-introduction]

#### Get started

> [AZURE.VIDEO getting-started-with-application-insights]




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


