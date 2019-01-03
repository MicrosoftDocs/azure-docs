---
title: Profile live Azure App Service apps with Application Insights | Microsoft Docs
description: Profile live apps on Azure App Service with Application Insights Profiler.
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
# Profile live Azure App Service apps with Application Insights

Profiler currently works for ASP.NET and ASP.NET Core apps that are running on Azure App Service. The Basic service tier or higher is required to use Profiler. Enabling Profiler on Linux is currently only possible via [this method](profiler-aspnetcore-linux.md).

## <a id="installation"></a> Enable Profiler for your app
To enable Profiler for an app, follow the instructions below. If you are running a different type of Azure service, here are instructions for enabling Profiler on other supported platforms:
* [Cloud Services](../../application-insights/app-insights-profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Service Fabric Applications](../../application-insights/app-insights-profiler-servicefabric.md?toc=/azure/azure-monitor/toc.json)
* [Virtual Machines](../../application-insights/app-insights-profiler-vm.md?toc=/azure/azure-monitor/toc.json)

Application Insights Profiler is pre-installed as part of the App Services runtime, but you need to turn it on to get profiles for your App Service app. Once you have deployed an app, even if you have included the App Insights SDK in the source code, follow the steps below to enable the profiler.

1. Go to the **App Services** pane in the Azure portal.
2. Navigate to **Settings > Application Insights** pane.

   ![Enable App Insights on App Services portal](./media/profiler/AppInsights-AppServices.png)

3. Either follow the instructions on the pane to create a new resource or select an existing App Insights resource to monitor your app. Also make sure the Profiler is **On**.

   ![Add App Insights site extension][Enablement UI]

4. Profiler is now enabled using an App Services App Setting.

    ![App Setting for Profiler][profiler-app-setting]

## Disable Profiler

To stop or restart Profiler for an individual app's instance, under **Web Jobs**, go to the app resource. To delete Profiler, go to **Extensions**.

![Disable Profiler for a web job][disable-profiler-webjob]

We recommend that you have Profiler enabled on all your apps to discover any performance issues as early as possible.

If you use WebDeploy to deploy changes to your web application, make sure you exclude the App_Data folder from being deleted during deployment. Otherwise, the Profiler extension's files are deleted the next time you deploy the web application to Azure.



## Next steps

* [Working with Application Insights in Visual Studio](https://docs.microsoft.com/azure/application-insights/app-insights-visual-studio)

[appinsights-in-appservices]:./media/profiler/AppInsights-AppServices.png
[Enablement UI]: ./media/profiler/Enablement_UI.png
[profiler-app-setting]:./media/profiler/profiler-app-setting.png
[performance-blade]: ./media/profiler/performance-blade.png
[performance-blade-examples]: ./media/profiler/performance-blade-examples.png
[performance-blade-v2-examples]:./media/profiler/performance-blade-v2-examples.png
[trace-explorer]: ./media/profiler/trace-explorer.png
[trace-explorer-toolbar]: ./media/profiler/trace-explorer-toolbar.png
[trace-explorer-hint-tip]: ./media/profiler/trace-explorer-hint-tip.png
[trace-explorer-hot-path]: ./media/profiler/trace-explorer-hot-path.png
[enable-profiler-banner]: ./media/profiler/enable-profiler-banner.png
[disable-profiler-webjob]: ./media/profiler/disable-profiler-webjob.png
[linked app services]: ./media/profiler/linked-app-services.png

