<properties 
	pageTitle="Diagnosing issues with dependencies in Application Insights" 
	description="Find failures and slow performance caused by depeendencies" 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="ronmart"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/16/2015" 
	ms.author="awills"/>
 
# Diagnosing issues with dependencies in Application Insights


A *dependency* is an external component that is called by your app. It's typically a service called using HTTP, or a database, or a file system. In Visual Studio Application Insights, you can easily see how long your application waits for dependencies and how often a dependency call fails.

## Where you can use it

Out of the box dependency monitoring is currently available for:

* ASP.NET web apps and services running on an IIS server or on Azure

For other types, such as Java web apps or device apps, you can write your own monitor using the TrackDependency API.

The out-of-the-box dependency monitor currently reports calls to these  types of dependencies:

* SQL databases
* ASP.NET web and wcf services
* Local or remote HTTP calls
* Azure DocumentDb, table, blob storage, and queue

Again, you could write your own SDK calls to monitor other dependencies.

## Setting up dependency monitoring

To get dependency monitoring, you must:

* Use [Status Monitor](app-insights-monitor-performance-live-website-now.md) on your IIS server and use it to enable monitoring
* Add the [Application Insights Extension](insights-perf-analytics.md) to your Azure Web App or VM.

(For an Azure VM, you can either use install the extension from the Azure control panel, or install the Status Monitor just as you would on any machine.)

You can do the above steps to an already-deployed web app. To get standard dependency monitoring, you don't have to add Application Insights to your source project. 

## Diagnosing dependency performance issues

To assess the performance of requests at your server:

![In the Overview page of your application in Application Insights, click the Performance tile](./media/app-insights-dependencies/01-performance.png)

Scroll down to look at the grid of requests:

![List of requests with averages and counts](./media/app-insights-dependencies/02-reqs.png)

The top one is taking very long. Let's see if we can find out where the time is spent.

Click that row to see individual request events:


![List of request occurrences](./media/app-insights-dependencies/03-instances.png)

Click any long-running instance to inspect it further.

> AZURE.NOTE Scroll down a bit to choose an instance. Latency in the pipeline might mean that the data for the top instances is incomplete.

Scroll down to the remote dependency calls related to this request:

![Find Calls to Remote Dependencies, identify unusual Duration](./media/app-insights-dependencies/04-dependencies.png)

It looks like most of the time servicing this request was spent in a call to a local service. 

Select that row to get more information:


![Click through that remote dependency to identify the culprit](./media/app-insights-dependencies/05-detail.png)

The detail includes sufficient information to diagnose the problem.



## Failures

If there are failed requests, click the chart.

![Click the failed requests chart](./media/app-insights-dependencies/06-fail.png)

Click through a request type and request instance, to find a failed call to a remote dependency.


![Click a request type, click the instance to get to a different view of the same instance, click it to get exception details.](./media/app-insights-dependencies/07-faildetail.png)


<!--Link references-->


