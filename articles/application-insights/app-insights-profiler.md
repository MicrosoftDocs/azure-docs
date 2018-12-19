---
title: Profile live Azure web apps with Application Insights | Microsoft Docs
description: Profile live web apps on Azure with Application Insights Profiler.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.reviewer: cawa
ms.date: 08/06/2018
ms.author: mbullwin
---
# Profile live Azure web apps with Application Insights

Profiler currently works for ASP.NET and ASP.NET Core web apps that are running on Web Apps. The Basic service tier or higher is required to use Profiler.

## <a id="installation"></a> Enable Profiler for your Web Apps
To enable Profiler for a web app, follow the instructions below. If you are running a different type of Azure service, here are instructions for enabling Profiler on other supported platforms:
* [Cloud Services](app-insights-profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Service Fabric Applications](app-insights-profiler-servicefabric.md?toc=/azure/azure-monitor/toc.json)
* [Virtual Machines](app-insights-profiler-vm.md?toc=/azure/azure-monitor/toc.json)


Application Insights Profiler is pre-installed as part of the App Services runtime, but you need to turn it on to get profiles for your Azure Web Apps. Once you have deployed a Web App, even if you have included the App Insights SDK in the source code, follow the steps below to enable the profiler.

1. Go to the **App Services** pane in the Azure portal.
1. Navigate to **Settings > Monitoring** pane.

   ![Enable App Insights on App Services portal](./media/app-insights-profiler/AppInsights-AppServices.png)

1. Either follow the instructions on the pane to create a new resource or select an existing App Insights resource to monitor your web app. Also make sure the Profiler is **On**.

   ![Add App Insights site extension][Enablement UI]

1. Profiler is now enabled using an App Services App Setting.

    ![App Setting for Profiler][profiler-app-setting]

## Disable Profiler

To stop or restart Profiler for an individual web app's instance, under **Web Jobs**, go to the Web Apps resource. To delete Profiler, go to **Extensions**.

![Disable Profiler for a web job][disable-profiler-webjob]

We recommend that you have Profiler enabled on all your web apps to discover any performance issues as early as possible.

If you use WebDeploy to deploy changes to your web application, make sure you exclude the App_Data folder from being deleted during deployment. Otherwise, the Profiler extension's files are deleted the next time you deploy the web application to Azure.



## Next steps

* [Working with Application Insights in Visual Studio](https://docs.microsoft.com/azure/application-insights/app-insights-visual-studio)

[appinsights-in-appservices]:./media/app-insights-profiler/AppInsights-AppServices.png
[Enablement UI]: ./media/app-insights-profiler/Enablement_UI.png
[profiler-app-setting]:./media/app-insights-profiler/profiler-app-setting.png
[performance-blade]: ./media/app-insights-profiler/performance-blade.png
[performance-blade-examples]: ./media/app-insights-profiler/performance-blade-examples.png
[performance-blade-v2-examples]:./media/app-insights-profiler/performance-blade-v2-examples.png
[trace-explorer]: ./media/app-insights-profiler/trace-explorer.png
[trace-explorer-toolbar]: ./media/app-insights-profiler/trace-explorer-toolbar.png
[trace-explorer-hint-tip]: ./media/app-insights-profiler/trace-explorer-hint-tip.png
[trace-explorer-hot-path]: ./media/app-insights-profiler/trace-explorer-hot-path.png
[enable-profiler-banner]: ./media/app-insights-profiler/enable-profiler-banner.png
[disable-profiler-webjob]: ./media/app-insights-profiler/disable-profiler-webjob.png
[linked app services]: ./media/app-insights-profiler/linked-app-services.png

