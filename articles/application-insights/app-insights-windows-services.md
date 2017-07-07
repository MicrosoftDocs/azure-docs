---
title: Azure Application Insights for Windows server and worker roles | Microsoft Docs
description: Manually add the Application Insights SDK to your ASP.NET application to analyze usage, availability and performance.
services: application-insights
documentationcenter: .net
author: CFreemanwa
manager: carmonm

ms.assetid: 106ba99b-b57a-43b8-8866-e02f626c8190
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: get-started-article
ms.date: 05/15/2017
ms.author: cfreeman

---
# Manually configure Application Insights for .NET applications

You can configure [Application Insights](app-insights-overview.md) to monitor a wide variety of applications or application roles, components, or microservices. For web apps and services, Visual Studio offers [one-step configuration](app-insights-asp-net.md). For other types of .NET application, such as backend server roles or desktop applications, you can configure Application Insights manually.

![Example performance monitoring charts](./media/app-insights-windows-services/10-perf.png)

#### Before you start

You need:

* A subscription to [Microsoft Azure](http://azure.com). If your team or organization has an Azure subscription, the owner can add you to it, using your [Microsoft account](http://live.com).
* Visual Studio 2013 or later.

## <a name="add"></a>1. Choose an Application Insights resource

The 'resource' is where your data is collected and displayed in the Azure portal. You need to decide whether to create a new one, or share an existing one.

### Part of a larger app: Use existing resource

If your web application has several components - for example, a front-end web app and one or more back-end services - then you should send telemetry from all the components to the same resource. This will enable them to be displayed on a single Application Map, and make it possible to trace a request from one component to another.

So, if you're already monitoring other components of this app, then just use the same resource.

Open the resource in the [Azure portal](https://portal.azure.com/). 

### Self-contained app: Create a new resource

If the new app is unrelated to other applications, then it should have its own resource.

Sign in to the [Azure portal](https://portal.azure.com/), and create a new Application Insights resource. Choose ASP.NET as the application type.

![Click New, Application Insights](./media/app-insights-windows-services/01-new-asp.png)

The choice of application type sets the default content of the resource blades.

## 2. Copy the Instrumentation Key
The key identifies the resource. You'll install it soon in the SDK, in order to direct data to the resource.

![Click Properties, select the key, and press ctrl+C](./media/app-insights-windows-services/02-props-asp.png)

## <a name="sdk"></a>3. Install the Application Insights package in your application
Installing and configuring the Application Insights package varies depending on the platform you're working on. 

1. In Visual Studio, right-click your project and choose **Manage Nuget Packages**.
   
    ![Right-click the project and select Manage Nuget Packages](./media/app-insights-windows-services/03-nuget.png)
2. Install the Application Insights package for Windows server apps, "Microsoft.ApplicationInsights.WindowsServer."
   
    ![Search for "Application Insights"](./media/app-insights-windows-services/04-ai-nuget.png)
   
    *Which version?*

    Check **Include prerelease** if you want to try our latest features. The relevant documents or blogs note whether you need a prerelease version.
    
    *Can I use other packages?*
   
    Yes. Choose "Microsoft.ApplicationInsights" if you only want to use the API to send your own telemetry. The Windows Server package includes the API plus a number of other packages such as performance counter collection and dependency monitoring. 

### To upgrade to future package versions
We release a new version of the SDK from time to time.

To upgrade to a [new release of the package](https://github.com/Microsoft/ApplicationInsights-dotnet-server/releases/), open NuGet package manager again and filter on installed packages. Select **Microsoft.ApplicationInsights.WindowsServer** and choose **Upgrade**.

If you made any customizations to ApplicationInsights.config, save a copy of it before you upgrade, and afterwards merge your changes into the new version.

## 4. Send telemetry
**If you installed only the API package:**

* Set the instrumentation key in code, for example in `main()`: 
  
    `TelemetryConfiguration.Active.InstrumentationKey = "` *your key* `";` 
* [Write your own telemetry using the API](app-insights-api-custom-events-metrics.md#ikey).

**If you installed other Application Insights packages,** you can, if you prefer, use the .config file to set the instrumentation key:

* Edit ApplicationInsights.config (which was added by the NuGet install). Insert this just before the closing tag:
  
    `<InstrumentationKey>` *the instrumentation key you copied* `</InstrumentationKey>`
* Make sure that the properties of ApplicationInsights.config in Solution Explorer are set to **Build Action = Content, Copy to Output Directory = Copy**.

It's useful to set the instrumentation key in code if you want to [switch the key for different build configurations](app-insights-separate-resources.md). If you set the key in code, you don't have to set it in the `.config` file.

## <a name="run"></a> Run your project
Use the **F5** to run your application and try it out: open different pages to generate some telemetry.

In Visual Studio, you'll see a count of the events that have been sent.

![Event count in Visual Studio](./media/app-insights-windows-services/appinsights-09eventcount.png)

## <a name="monitor"></a> View your telemetry
Return to the [Azure portal](https://portal.azure.com/) and browse to your Application Insights resource.

Look for data in the Overview charts. At first, you'll just see one or two points. For example:

![Click through to more data](./media/app-insights-windows-services/12-first-perf.png)

Click through any chart to see more detailed metrics. [Learn more about metrics.](app-insights-web-monitor-performance.md)

### No data?
* Use the application, opening different pages so that it generates some telemetry.
* Open the [Search](app-insights-diagnostic-search.md) tile, to see individual events. Sometimes it takes events a little while longer to get through the metrics pipeline.
* Wait a few seconds and click **Refresh**. Charts refresh themselves periodically, but you can refresh manually if you're waiting for some data to show up.
* See [Troubleshooting](app-insights-troubleshoot-faq.md).

## Publish your app
Now deploy your application to your server or to Azure and watch the data accumulate.

![Use Visual Studio to publish your app](./media/app-insights-windows-services/15-publish.png)

When you run in debug mode, telemetry is expedited through the pipeline, so that you should see data appearing within seconds. When you deploy your app in Release configuration, data accumulates more slowly.

### No data after you publish to your server?
Open ports for outgoing traffic in your server's firewall. See [this page](https://docs.microsoft.com/azure/application-insights/app-insights-ip-addresses) for the list of required addresses 

### Trouble on your build server?
Please see [this Troubleshooting item](app-insights-asp-net-troubleshoot-no-data.md#NuGetBuild).

> [!NOTE]
> If your app generates a lot of telemetry, the adaptive sampling module will automatically reduce the volume that is sent to the portal by sending only a representative fraction of events. However, events that are related to the same request will be selected or deselected as a group, so that you can navigate between related events. 
> [Learn about sampling](app-insights-sampling.md).
> 
> 

## Video

> [!VIDEO https://channel9.msdn.com/events/Connect/2016/100/player]

## Next steps
* [Add more telemetry](app-insights-asp-net-more.md) to get the full 360-degree view of your application.

