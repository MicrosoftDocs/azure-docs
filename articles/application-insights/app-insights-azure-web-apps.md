---
title: Monitor Azure web app performance | Microsoft Docs
description: Application performance monitoring for Azure web apps. Chart load and response time, dependency information and set alerts on performance.
services: application-insights
documentationcenter: .net
author: alancameronwills
manager: carmonm

ms.assetid: 0b2deb30-6ea8-4bc4-8ed0-26765b85149f
ms.service: azure-portal
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/30/2017
ms.author: awills

---
# Monitor Azure web app performance
In the [Azure Portal](https://portal.azure.com) you can set up application performance monitoring for your [Azure web apps](../app-service-web/app-service-web-overview.md). [Azure Application Insights](app-insights-overview.md) instruments your app to send telemetry about its activities to the Application Insights service, where it is stored and analyzed. There, metric charts and search tools can be used to help diagnose issues, improve performance, and assess usage.

## Run time or build time
You can configure monitoring by instrumenting the app in either of two ways:

* **Run-time** - You can select a performance monitoring extension when your web app is already live. It isn't necessary to rebuild or re-install your app. You get a standard set of packages that monitor response times, success rates, exceptions, dependencies, and so on. 
* **Build time** - You can install a package in your app in development. This option is more versatile. In addition to the same standard packages, you can write code to customize the telemetry or to send your own telemetry. You can log specific activities or record events according to the semantics of your app domain. 

## Run time instrumentation with Application Insights
If you're already running a web app in Azure, you already get some monitoring: request and error rates. Add Application Insights to get more, such as response times, monitoring calls to dependencies, smart detection, and the powerful Analytics query language. 

1. **Select Application Insights** in the Azure control panel for your web app.
   
    ![Under Monitoring, choose Application Insights](./media/app-insights-azure-web-apps/05-extend.png)
   
   * Choose to create a new resource, unless you already set up an Application Insights resource for this app by another route.
2. **Instrument your web app** after Application Insights has been installed. 
   
    ![Instrument your web app](./media/app-insights-azure-web-apps/restart-web-app-for-insights.png)
3. **Monitor your app**.  [Expore the data](#explore-the-data).

Later, you can build and redeploy the app with Application Insights if you want.

*How do I remove Application Insights, or switch to sending to another resource?*

* In Azure, open the web app control blade, and under Development Tools, open **Extensions**. Delete the Application Insights extension. Then under Monitoring, choose Application Insights and create or select the resource you want.

## Build the app with Application Insights
Application Insights can provide more detailed telemetry by installing an SDK into your app. In particular, you can collect trace logs, [write custom telemetry](app-insights-api-custom-events-metrics.md), and get more detailed exception reports.

1. **In Visual Studio** (2013 update 2 or later), configure Application Insights for your project.

    Right-click the web project, and select **Add > Application Insights** or **Configure Application Insights**.
   
    ![Right-click the web project and choose Add or Configure Application Insights](./media/app-insights-azure-web-apps/03-add.png)
   
    If you're asked to sign in, use the credentials for your Azure account.
   
    The operation has two effects:
   
   1. Creates an Application Insights resource in Azure, where telemetry is stored, analyzed and displayed.
   2. Adds the Application Insights NuGet package to your code (if it isn't there already), and configures it to send telemetry to the Azure resource.
2. **Test the telemetry** by running the app in your development machine (F5).
3. **Publish the app** to Azure in the usual way. 

*How do I switch to sending to a different Application Insights resource?*

* In Visual Studio, right-click the project, choose **Configure Application Insights** and choose the resource you want. You get the option to create a new resource. Rebuild and redeploy.

## Explore the data
1. On the Application Insights blade of your web app control panel, you see Live Metrics, which shows requests and failures within a second or two of them occurring. It's very useful display when you're republishing your app - you can see any problems immediately.
2. Click through to the full Application Insights resource.

    ![Click through](./media/app-insights-azure-web-apps/view-in-application-insights.png)

    You can also go there either directly from Azure resource navigation.

1. Click through any chart to get more detail:
   
    ![On the Application Insights overview blade, click a chart](./media/app-insights-azure-web-apps/07-dependency.png)
   
    You can [customize metrics blades](app-insights-metrics-explorer.md).
2. Click through further to see individual events and their properties:
   
    ![Click an event type to open a search filtered on that type](./media/app-insights-azure-web-apps/08-requests.png)
   
    Notice the "..." link to open all properties.
   
    You can [customize searches](app-insights-diagnostic-search.md).

For more powerful searches over your telemetry, use the [Analytics query language](app-insights-analytics-tour.md).

## More telemetry

* [Web page load data](app-insights-javascript.md)
* [Custom telemetry](app-insights-api-custom-events-metrics.md)

## Video

> [!VIDEO https://channel9.msdn.com/events/Connect/2016/100/player]

## Next steps
* [Run the profiler on your live app](app-insights-profiler.md).
* [Enable Azure diagnostics](app-insights-azure-diagnostics.md) to be sent to Application Insights.
* [Monitor service health metrics](../monitoring-and-diagnostics/insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.
* [Receive alert notifications](../monitoring-and-diagnostics/insights-receive-alert-notifications.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and web pages](app-insights-javascript.md) to get client telemetry from the browsers that visit a web page.
* [Set up Availability web tests](app-insights-monitor-web-app-availability.md) to be alerted if your site is down.

