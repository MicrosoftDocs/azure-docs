<properties 
	pageTitle="Performance analytics for Azure Web Apps" 
	description="Chart load and response time, dependency information and set alerts on performance." 
	services="application-insights"
    documentationCenter=""
	authors="alancameronwills" 
	manager="keboyd"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/25/2015" 
	ms.author="awills"/>

# Performance analytics for Azure Web Apps

After enabling the Azure web app extension (detailed steps below) you’ll be able to see statistics and details on the application dependencies of your [Azure App Service Web App](websites-learning-map.md).  These application dependencies are automatically discovered. 

Here's an example that shows the amount of time spent in a SQL dependency including the number of SQL calls and related statistics such as the average duration and standard deviation. 

![](./media/insights-perf-analytics/01-example.png) 



## Create a new Azure Web App with Performance Analytics

#### 1. Add Visual Studio Application Insights to your Visual Studio project

If you're creating a new Web Application project make sure to check the Application Insights option:

![In the New Project dialog, check Add Application Insights](./media/insights-perf-analytics/04-new.png)

Or if you have an existing project:

![In the New Project dialog, check Add Application Insights](./media/insights-perf-analytics/03-add.png)

When you're asked to login, use the credentials for your Azure account.

#### 2. Enable the Application Insights extension

In [the Azure portal](http://portal.azure.com), open the control blade of your web app (not the Application Insights blade), and enable the Application Insights Extension:

![](./media/insights-perf-analytics/05-extend.png)



## Explore the data

Use your website for a while to generate some telemetry.

Then, from your web app overview blade, open Application Monitoring. (Or from the [Azure portal home](http://portal.azure.com), Browse to Application Insights.)  

![Click Refresh](./media/insights-perf-analytics/06-overview.png)

Scroll down and open Performance:

![On the Application Insights overview blade, click the Performance tile](./media/insights-perf-analytics/07-dependency.png)

Drill through to see individual requests:

![In the grid, click a dependency to see related requests.](./media/insights-perf-analytics/08-requests.png)

## Q & A


*Can I automate adding the Application Insights extension to the web app?*

Yes, there's a REST API for Azure web apps. In PowerShell:

    $extension = "https://<sitename>.scm.azurewebsites.net/api/siteextensions/Microsoft.ApplicationInsights.AzureWebSites"
    Invoke-RestMethod -Uri $extension -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT -Verbose

## Next steps

* [Monitor usage][azure-usage] to find out how many users you have, how often they visit, and how the pages perform on their browsers.
* [Create web tests][azure-availability] to make sure your site is available and responsive
* [Capture and search diagnostic logging](app-insights-diagnostic-search.md)
* [Use the API](app-insights-web-track-usage-custom-events-metrics.md) for usage tracking and diagnostic logging
* [Set performance alerts](app-insights-metrics-explorer.md)


## Learn more 

* [Azure App Service Web App](websites-learning-map.md)
* [Application Insights](app-insights-get-started.md)

[azure-usage]: insights-usage-analytics.md
[azure-availability]: insights-create-web-tests.md
