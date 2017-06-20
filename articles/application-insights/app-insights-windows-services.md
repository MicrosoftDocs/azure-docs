---
title: Azure Application Insights for Windows server and worker roles | Microsoft Docs
description: Manually add the Application Insights SDK to your ASP.NET application to analyze usage, availability and performance.
services: application-insights
documentationcenter: .net
author: alancameronwills
manager: douge

ms.assetid: 106ba99b-b57a-43b8-8866-e02f626c8190
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: get-started-article
ms.date: 11/01/2016
ms.author: awills

---
# Manually configure Application Insights for ASP.NET applications
[Application Insights](app-insights-overview.md) is an extensible tool for web developers to monitor the performance and usage of your live application. You can manually configure it to monitor Windows server, worker roles, and other ASP.NET applications. For web apps, manual configuration is an alternative to the [automatic set-up](app-insights-asp-net.md) offered by Visual Studio.

![Example performance monitoring charts](./media/app-insights-windows-services/10-perf.png)

#### Before you start
You need:

* A subscription to [Microsoft Azure](http://azure.com). If your team or organization has an Azure subscription, the owner can add you to it, using your [Microsoft account](http://live.com).
* Visual Studio 2013 or later.

## <a name="add"></a>1. Create an Application Insights resource
Sign in to the [Azure portal](https://portal.azure.com/), and create a new Application Insights resource. Choose ASP.NET as the application type.

![Click New, Application Insights](./media/app-insights-windows-services/01-new-asp.png)

A [resource](app-insights-resources-roles-access-control.md) in Azure is an instance of a service. This resource is where telemetry from your app will be analyzed and presented to you.

The choice of application type sets the default content of the resource blades and the properties visible in [Metrics Explorer](app-insights-metrics-explorer.md).

#### Copy the Instrumentation Key
The key identifies the resource, and you'll install it soon in the SDK to direct data to the resource.

![Click Properties, select the key, and press ctrl+C](./media/app-insights-windows-services/02-props-asp.png)

The steps you've just done to create a new resource are a good way to start monitoring any application. Now you can send data to it.

## <a name="sdk"></a>2. Install the Application Insights package in your application
Installing and configuring the Application Insights package varies depending on the platform you're working on. For ASP.NET apps, it's easy.

1. In Visual Studio, edit the NuGet packages of your web app project.
   
    ![Right-click the project and select Manage Nuget Packages](./media/app-insights-windows-services/03-nuget.png)
2. Install Application Insights package for Windows server apps.
   
    ![Search for "Application Insights"](./media/app-insights-windows-services/04-ai-nuget.png)
   
    *Can I use other packages?*
   
    Yes. Choose the Core API (Microsoft.ApplicationInsights) if you only want to use the API to send your own telemetry. The Windows Server package automatically includes the Core API plus a number of other packages such as performance counter collection and dependency monitoring. 

#### To upgrade to future package versions
We release a new version of the SDK from time to time.

To upgrade to a [new release of the package](https://github.com/Microsoft/ApplicationInsights-dotnet-server/releases/), open NuGet package manager again and filter on installed packages. Select **Microsoft.ApplicationInsights.WindowsServer** and choose **Upgrade**.

If you made any customizations to ApplicationInsights.config, save a copy of it before you upgrade, and afterwards merge your changes into the new version.

## 3. Send telemetry
**If you installed only the core API package:**

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

#### No data?
* Use the application, opening different pages so that it generates some telemetry.
* Open the [Search](app-insights-diagnostic-search.md) tile, to see individual events. Sometimes it takes events a little while longer to get through the metrics pipeline.
* Wait a few seconds and click **Refresh**. Charts refresh themselves periodically, but you can refresh manually if you're waiting for some data to show up.
* See [Troubleshooting](app-insights-troubleshoot-faq.md).

## Publish your app
Now deploy your application to your server or to Azure and watch the data accumulate.

![Use Visual Studio to publish your app](./media/app-insights-windows-services/15-publish.png)

When you run in debug mode, telemetry is expedited through the pipeline, so that you should see data appearing within seconds. When you deploy your app in Release configuration, data accumulates more slowly.

#### No data after you publish to your server?
Open ports for outgoing traffic in your server's firewall. See [this page](https://docs.microsoft.com/azure/application-insights/app-insights-ip-addresses) for the list of required addresses 

#### Trouble on your build server?
Please see [this Troubleshooting item](app-insights-asp-net-troubleshoot-no-data.md#NuGetBuild).

> [!NOTE]
> If your app generates a lot of telemetry (and you are using the ASP.NET SDK version 2.0.0-beta3 or later), the adaptive sampling module will automatically reduce the volume that is sent to the portal by sending only a representative fraction of events. However, events that are related to the same request will be selected or deselected as a group, so that you can navigate between related events. 
> [Learn about sampling](app-insights-sampling.md).
> 
> 

## Video

> [!VIDEO https://channel9.msdn.com/events/Connect/2016/100/player]

## Next steps
* [Add more telemetry](app-insights-asp-net-more.md) to get the full 360-degree view of your application.

