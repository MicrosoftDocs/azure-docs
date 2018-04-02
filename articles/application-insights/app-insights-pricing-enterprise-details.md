---
title: Legacy Enterprise pricing plan details for Azure Application Insights | Microsoft Docs
description: Manage telemetry volumes and monitor costs in Application Insights.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: ebd0d843-4780-4ff3-bc68-932aa44185f6
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 04/02/2018
ms.author: mbullwin

---

# Enterprise plan details

Application Insights has two pricing plans. The default plan is called [Basic](app-insights-pricing.md), which includes all of the same features as the Enterprise plan at no addition cost and bills primarily on the volume of data ingested. If you are using the Operations Management Suite, you should opt for the Enterprise plan, which has a per-node charge along with daily data allowances, and then will charge for data ingested above the included allowance.

See the [Application Insights pricing page](http://azure.microsoft.com/pricing/details/application-insights/) for current prices in your currency and region.

## Here's how the Enterprise plan works

* You pay per node that is sending telemetry for any apps in the Enterprise plan.
 * A *node* is a physical or virtual server machine, or a Platform-as-a-Service role instance, that hosts your app.
 * Development machines, client browsers, and mobile devices are not counted as nodes.
 * If your app has several components that send telemetry, such as a web service and a back-end worker, they are counted separately.
 * [Live Metrics Stream](app-insights-live-stream.md) data isn't counted for pricing purposes.* Across a subscription, your charges are per node, not per app. If you have five nodes sending telemetry for 12 apps, then the charge is for five nodes.
* Although charges are quoted per month, you're charged only for any hour in which a node sends telemetry from an app. The hourly charge is the quoted monthly charge / 744 (the number of hours in a 31-day month).
* A data volume allocation of 200 MB per day is given for each node detected (with hourly granularity). Unused data allocation is not carried over from one day to the next.
 * If you choose the Enterprise pricing option, each subscription gets a daily allowance of data based on the number of nodes sending telemetry to the Application Insights resources in that subscription. So if you have 5 nodes sending data all day, you will have a pooled allowance of 1 GB applied to all the Application Insights resources in that subscription. It doesn't matter if certain nodes are sending more data than other nodes because the included data is shared across all nodes. If, on a given day, the Application Insights resources receive more data than is included in the daily data allocation for this subscription, the per-GB overage data charges apply. 
 * The daily data allowance is calculated as the number of hours in the day (using UTC) that each node is sending telemetry divided by 24 times 200 MB. So if you have 4 nodes sending telemetry during 15 of the 24 hours in the day, the included data for that day would be ((4 x 15) / 24) x 200 MB = 500 MB. At the price of 2.30 USD per GB for data overage, the charge would be 1.15 USD if the nodes send 1 GB of data that day.
 * The Enterprise plan's daily allowance is not shared with applications for which you have chosen the Basic option and unused allowance is not carried over from day-to-day. 

## Here are some examples of determining distinct node count

| Scenario                               | Total daily node count |
|:---------------------------------------|:----------------:|
| 1 application is using 3 Azure App Service instances and 1 virtual server | 4 |
| 3 applications running on 2 VMs, and the Application Insights resources for these applications are in the same subscription and in the Enterprise plan | 2 | 
| 4 applications whose Applications Insights resources are in the same subscription. Each application runs 2 instances during 16 off-peak hours, and 4 instances during 8 peak hours. | 13.33 | 
| Cloud services with 1 Worker Role and 1 Web Role, each running 2 instances | 4 | 
| 5-node Service Fabric Cluster running 50 micro-services, each micro-service running 3 instances | 5|

* The precise node counting behavior depends on which Application Insights SDK your application is using. 
  * In SDK versions 2.2 and onwards, both the Application Insights [Core SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) or [Web SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) will report each application host as a node, for example the computer name for physical server and VM hosts or the instance name in the case of cloud services.  The only exception is applications only using [.NET Core](https://dotnet.github.io/) and the Application Insights Core SDK, in which case only one node will be reported for all hosts because the host name is not available. 
  * For earlier versions of the SDK, the [Web SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) will behave just as the newer SDK versions, however the [Core SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) will report only one node regardless of the number of actual application hosts. 
  * If your application is using the SDK to set roleInstance to a custom value, by default that same value will be used to determine the count of nodes. 
  * If you are using a new SDK version with an app that is run from client machines or mobile devices, it is possible that the count of nodes might return a number that is very large (from the large number of client machines or mobile devices). 
