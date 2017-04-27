---
title: 'Application Insights: languages, platforms and integrations| Microsoft Docs'
description: Languages, platforms and integrations available for Application Insights
services: application-insights
documentationcenter: ''
author: OlegAnaniev-MSFT
manager: douge

ms.assetid: 974db106-54ff-4318-9f8b-f7b3a869e536
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/01/2016
ms.author: awills

---
# Developer analytics: languages, platforms, and integrations
These items are implementations of [Application Insights](app-insights-overview.md) that we've heard about, including some by third parties.

## Languages
* [C#|VB (.NET)](app-insights-asp-net.md)
* [Java](app-insights-java-get-started.md)
* [JavaScript web pages](app-insights-javascript.md)
* [Objective-C](https://github.com/Microsoft/ApplicationInsights-iOS)
* [PHP](https://github.com/Microsoft/ApplicationInsights-PHP)
* [Python](https://pypi.python.org/pypi/applicationinsights/0.1.0)
* [Ruby](https://rubygems.org/gems/application_insights)
* [Anything else](#projects)

## Platforms and frameworks
* [Angular](https://www.npmjs.com/package/angular-applicationinsights)
* [ASP.NET](app-insights-asp-net.md)
* [ASP.NET - for apps that are already live](app-insights-monitor-performance-live-website-now.md)
* [ASP.NET Core](app-insights-asp-net-core.md)
* [Android](https://github.com/Microsoft/ApplicationInsights-Android) (HockeyApp)
* [Azure Web Apps](app-insights-azure-web-apps.md)
* [Azure Cloud Services](app-insights-cloudservices.md)&#151;including both web and worker roles
* [Docker](app-insights-docker.md)
* [Glimpse](https://azure.microsoft.com/blog/glimpse-application-insights/)
* [iOS](https://github.com/Microsoft/ApplicationInsights-iOS) (HockeyApp)
* [J2EE](app-insights-java-get-started.md)
* [J2EE - for apps that are already live](app-insights-java-live.md)
* [Mac OS X app](https://support.hockeyapp.net/kb/client-integration-ios-mac-os-x-tvos/hockeyapp-for-mac-os-x) (HockeyApp)
* [Node.JS](https://www.npmjs.com/package/applicationinsights)
* [OSX](https://github.com/Microsoft/ApplicationInsights-OSX)
* [Spring](http://joe.blog.freemansoft.com/2015/12/enabling-microsoft-application-insight.html)
* [Universal Windows app](https://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone/how-to-create-an-app-for-uwp) (HockeyApp)
* [WCF](https://github.com/Microsoft/ApplicationInsights-SDK-Labs/blob/master/WCF/readme.md)
* [Windows Phone 8 and 8.1 app](https://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone/hockeyapp-for-windows-phone-silverlight-apps-80-and-81) (HockeyApp)
* [Windows Presentation Foundation app](https://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone/hockeyapp-for-windows-wpf-apps) (HockeyApp)
* [Windows desktop applications, services, and worker roles](app-insights-windows-desktop.md)
* [Anything else](#projects)

## Logging frameworks
* [Log4Net, NLog, or System.Diagnostics.Trace](app-insights-diagnostic-search.md)
* [Java, Log4J, or Logback](app-insights-java-trace-logs.md)
* [Semantic Logging (SLAB)](https://github.com/fidmor89/SLAB_AppInsights) - integrates with [Semantic Logging Application Block](https://msdn.microsoft.com/library/dn440729.aspx)
* [Cloud-based load testing](http://blogs.msdn.com/b/visualstudioalm/archive/2015/07/30/getting-application-insights-counters-with-cloud-based-load-testing.aspx)
* [LogStash plugin](https://github.com/Azure/azure-diagnostics-tools/tree/master/Logstash/logstash-output-applicationinsights)
* [OMS Log Analytics](https://blogs.technet.microsoft.com/msoms/2016/09/26/application-insights-connector-in-oms/)
* [Logary](https://www.nuget.org/packages/Logary.Targets.AppInsights/)

## Content Management Systems
* [Concrete](https://github.com/fidmor89/appInsights-Concrete)
* [Drupal](https://github.com/fidmor89/AppInsights-Drupal)
* [Joomla](https://github.com/fidmor89/AppInsights-Joomla)
* [Orchard](https://azure.microsoft.com/blog/integrating-application-insights-into-a-modular-cms-and-a-multi-tenant-public-saas/preview/)
* [SharePoint](app-insights-sharepoint.md)
* [WordPress](https://wordpress.org/plugins/application-insights/)

## Export and Data Analysis
* [Alooma](https://www.alooma.com/blog/application-insights-amazon-redshift)
* [Power BI](http://blogs.msdn.com/b/powerbi/archive/2015/11/04/explore-your-application-insights-data-with-power-bi.aspx)
* [Stream Analytics](app-insights-export-power-bi.md)

## <a name="projects"></a> Build your own SDK
If there isn't yet an SDK for your language or platform, perhaps you'd like to build one? Take a look at the code of the existing SDKs listed in the [Application Insights SDK project on GitHub](https://github.com/Microsoft/AppInsights-Home).
