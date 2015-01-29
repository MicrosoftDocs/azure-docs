<properties 
	pageTitle="Upgrade from the old Visual Studio Online version of Application Insights" 
	description="Upgrade existing projects" services="application-insights" 
	services="application-insights" 
	authors="alancameronwills" 
	manager="kamrani"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2015-01-29" 
	ms.author="awills"/>
 
# Upgrade from the old Visual Studio Online version of Application Insights

This document is of interest to you only if you have a project that is still using the older version of Application Insights, which was part of Visual Studio Online. That version will be switched off in due course, and so we encourage you to upgrade to the new version, which is a service within Microsoft Azure.

## Which version have I got?

If you added Application Insights to your project using Visual Studio 2013 Update 3 or later, it most probably uses the new Azure version.

Open ApplicationInsights.config in your project. If the top node includes a schemaVersion later than 2014-05-01, then your project sends telemetry to the new Application Insights portal in Microsoft Azure.

If there is no schema version, then your project sends data to the old Application Insights portal in Visual Studio Online.

## If you have a Visual Studio project ...

1. Open the project in Visual Studio 2013 Update 3 or later.
2. Delete ApplicationInsights.config 
3. Remove the Application Insights NuGet packages from the project. 
To do this, right-click the project in Solution Explorer and choose Manage NuGet Packages.
4. Right-click the project and [choose Add Application Insights][greenbrown].
5. If your code includes calls to the old API such as LogEvent(), you’ll discover them when you try to build the solution. Update them to [use the new API][track].
6. Replace the scripts in the <head> sections of your web pages. Typically there’s just one copy in a master page such as Views\Shared\_Layout.cshtml. [Get the new script from your Azure account][usage]. 
If your web pages include telemetry calls in the body such as logEvent or logPage, [update them to use the new API][track].
7. In your IIS server machine, uninstall Microsoft Monitoring Agent, and then [install Application Insights Status Monitor][redfield].

## If you have a Java web service ...

1. In your server machine, disable the old agent by removing references to the APM agent from the web service startup file. On a TomCat server, edit Catalina.bat. On a JBoss server, edit Run.bat. 
2. Restart the web service.
3. In your development machine, add the new [Java SDK][java] to your web project.
You can now [send custom telemetry][track] from the server code.
4. Replace the scripts in the <head> sections of your web pages. Typically there’s just one copy in a master page such as Views\Shared\_Layout.cshtml. [Get the new script from your Azure account][usage]. 
If your web pages include telemetry calls in the body such as logEvent or logPage, [update them to use the new API][track].



[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]

