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
	ms.date="06/13/2015" 
	ms.author="awills"/>

#  Application Insights: Code Samples

*Application Insights is in preview.*

This is a compilation of code samples that show you how to use [Visual Studio Application Insights](app-insights-get-started.md).

## Web services

* [Add telemetry to Azure web and worker roles](https://github.com/Microsoft/ApplicationInsights-Home/tree/master/Samples/AzureEmailService).

## Continuous Export

To analyze telemetry data with your own tools, [export it](app-insights-export-telemetry.md) to storage, where you can parse and process it.

* [Export to SQL using a worker role](app-insights-code-sample-export-telemetry-sql-database.md)
* [Export to SQL using Stream Analytics](app-insights-code-sample-export-sql-stream-analytics.md)


## Automate tasks

* [Script to create a new Application Insights resource](app-insights-powershell-script-create-resource.md)








 