<properties 
	pageTitle="Export to Power BI from Application Insights" 
	description="Articles " 
	services="application-insights" 
    documentationCenter=""
	authors="noamben" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/05/2016" 
	ms.author="awills"/>

# Feed Power BI from Application Insights

[Power BI](http://www.powerbi.com/) is a suite of business analytics tools to analyze data and share insights. Rich dashboards are available on every device. You can combine data from many sources, including from [Visual Studio Application Insights](app-insights-overview.md).

To get started, see [Display Application Insights data in Power BI](https://powerbi.microsoft.com/documentation/powerbi-content-pack-application-insights/).

You get an initial dashboard that you can customize, combining the Application Insights charts with those of other sources. There's a visualization gallery where you can get more charts, and each chart has a parameters you can set.

![](./media/app-insights-export-power-bi/010.png)


After the initial import, the dashboard and the reports continue to update daily. You can control the refresh schedule on the dataset.

## Alternative ways to see Application Insights data

* [Azure Dashboards containing Application Insights charts](app-insights-dashboards.md) may be more appropriate if you don't need to show non-Azure data. For example, if you want to set up a dashboard of Application Insights charts monitoring different components of a system, perhaps together with some Azure service monitors, then an Azure dashboard is ideal. It updates more frequently by default. 
* [Continuous export](app-insights-export-telemetry.md) copies your incoming data to Azure storage, from where you can move and process it however you like.
* [Analytics](app-insights-analytics.md) lets you perform complex queries on the raw data retained by Application Insights.

