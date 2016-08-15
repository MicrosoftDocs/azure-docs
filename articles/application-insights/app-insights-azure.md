<properties 
	pageTitle="Application Insights for Microsoft Azure apps" 
	description="Analyze usage and performance of your Azure app with Application Insights." 
	services="application-insights" 
    documentationCenter="windows"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/06/2016" 
	ms.author="awills"/>

#  Application Insights for Microsoft Azure apps

*Application Insights is in preview.*


Detect issues, solve problems and continuously improve your applications. Quickly diagnose any problems in your live application. Understand what your users do with it.

Configuration is very easy, and you'll see results within minutes.

What type of app do you have?

* [Azure web app](app-insights-asp-net.md)
* [Azure Cloud Services App - web and worker roles](app-insights-cloudservices.md)
* [Web app on IIS in Azure VM](app-insights-asp-net.md)
* [Application outside Azure](app-insights-overview.md)


Additional telemetry

* [Show Azure diagnostic logs in Application Insights](app-insights-azure-diagnostics.md)


## Telemetry from a web app without customization

1. In the [Azure portal](https://portal.azure.com), create an Application Insights resource with type ASP.NET. This will be where your application telemetry will be stored, analyzed and displayed.

    ![Add, Application Insights. Select ASP.NET type.](./media/app-insights-monitor-performance-live-website-now/01-new.png)
     
2. Now open the control blade of your Azure Web App, open **Tools > Performance Monitoring** add the Application Insights extension.

    ![In your web app, Tools, Extensions, Add, Application Insights](./media/app-insights-monitor-performance-live-website-now/05-extend.png)

    Select the Application Insights resource you just created.

3. 


 