<properties 
	pageTitle="Set up web app analytics for ASP.NET with Application Insights" 
	description="Configure performance, availability and usage analytics for your ASP.NET website, hosted on-premises or in Azure." 
	services="application-insights" 
    documentationCenter=".net"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="05/25/2016" 
	ms.author="awills"/>


# Set up Application Insights for ASP.NET

[Visual Studio Application Insights](app-insights-overview.md) monitors your live application to help you [detect and diagnose performance issues and exceptions](app-insights-detect-triage-diagnose.md), and [discover how your app is used](app-insights-overview-usage.md).  It works for apps that are hosted on your own on-premises IIS servers or on cloud VMs, as well as Azure web apps.

[AZURE.INCLUDE [app-insights-selector-get-started](../../includes/app-insights-selector-get-started.md)]




## Before you start

You need:

* Visual Studio 2013 update 3 or later. Later is better.
* A subscription to [Microsoft Azure](http://azure.com). If your team or organization has an Azure subscription, the owner can add you to it, using your [Microsoft account](http://live.com). 


## <a name="ide"></a> Add Application Insights SDK


### If it's a new project...

Make sure Application Insights is selected when you create a new project in Visual Studio. 


![Create an ASP.NET project](./media/app-insights-asp-net/appinsights-01-vsnewp1.png)


### ... or if it's an existing project

Right click the project in Solution Explorer, and choose **Add Application Insights Telemetry** or **Configure Application Insights**.

![Choose Add Application Insights](./media/app-insights-asp-net/appinsights-03-addExisting.png)


### Setup options

* SDK only: Installs the SDK in your project without creating a resource in the Application Insights portal. While you're debugging on your development machine, you'll  be able to see telemetry in Visual Studio. 
    
    ![SDK-only ](./media/app-insights-asp-net/16.png)

    You can configure a portal resource later. You'll need this in order to continue monitoring the app after you deploy it to test or production servers. 

* Resource name and group: Azure resources belong to resource groups, which help you manage access. If this app is part of a bigger application, use **Configure settings** to put it in the same resource group as the other components. 

    You can also change the name of the resource to be different from the project name, which is useful if you want to separate the telemetry from different stamps of your app.

    ![Choose resource and group names](./media/app-insights-asp-net/15.png)



###<a name="land"></a> What did 'Add Application Insights' do?

Application Insights sends telemetry from your app to the Application Insights portal (which is hosted in Microsoft Azure):

![](./media/app-insights-asp-net/01-scheme.png)

So the command did three things:


1. Add the Application Insights Web SDK NuGet package to your project. To see it in Visual Studio, right-click your project and choose Manage NuGet Packages.
2. Create an Application Insights resource in [the Azure portal][portal]. This is where you'll see your data. It retrieves the *instrumentation key,* which identifies the resource.
3. Inserts the instrumentation key in `ApplicationInsights.config`, so that the SDK can send telemetry to the portal.


## <a name="run"></a> Run your app

Run your application with F5 and try it out: open different pages to generate some telemetry.

In Visual Studio, you'll see a count of the events that have been logged. 

![In Visual Studio, the Application Insights button shows during debugging.](./media/app-insights-asp-net/54.png)

## See telemetry in Visual Studio

To open the Application Insights window in Visual Studio, either click the Application Insights button, or right-click your project in Solution Explorer:

![In Visual Studio, the Application Insights button shows during debugging.](./media/app-insights-asp-net/55.png)

This view shows telemetry generated in the server side of your app. Experiment with the filters, and click any event to see more detail.

[Learn more about Application Insights tools in Visual Studio](app-insights-visual-studio.md).

<a name="monitor"></a> 
## See telemetry in the portal

Unless you chose *Install SDK only,* you can also see the telemetry at the Application Insights web portal. 

The portal has more charts, analytic tools, and dashboards than Visual Studio. 


Open your Application Insights resource in the [Azure portal][portal].

![Right-click your project and open the Azure portal](./media/app-insights-asp-net/appinsights-04-openPortal.png)

The portal opens on a view of the telemetry from your app:
![](./media/app-insights-asp-net/18.png)




## What's next?

- [View debugging telemetry in Visual Studio](app-insights-visual-studio.md)
- [View live telemetry in the Azure portal](app-insights-dashboards.md)
- [Get user & page view data](app-insights-javascript.md#selector1)
- [Exceptions](app-insights-asp-net-exceptions.md#selector1)
- [Dependencies](app-insights-asp-net-dependencies.md#selector1)
- [Availability](app-insights-monitor-web-app-availability.md#selector1)




<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apikey]: app-insights-api-custom-events-metrics.md#ikey
[availability]: app-insights-monitor-web-app-availability.md
[azure]: ../insights-perf-analytics.md
[client]: app-insights-javascript.md
[detect]: app-insights-detect-triage-diagnose.md
[diagnostic]: app-insights-diagnostic-search.md
[knowUsers]: app-insights-overview-usage.md
[metrics]: app-insights-metrics-explorer.md
[netlogs]: app-insights-asp-net-trace-logs.md
[perf]: app-insights-web-monitor-performance.md
[portal]: http://portal.azure.com/
[qna]: app-insights-troubleshoot-faq.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[roles]: app-insights-resources-roles-access-control.md
[start]: app-insights-overview.md

 
