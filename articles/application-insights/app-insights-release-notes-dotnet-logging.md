<properties 
	pageTitle="Release notes for Application Insights Logging Adapters" 
	description="The latest updates." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>
<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/21/2015" 
	ms.author="abaranch"/>
 
# Release Notes for Logging Adapters for .NET

If you already use a logging framework such as log4net, NLog, or System.Diagnostics.Trace, you can capture those logs and send them to [Application Insights](http://azure.microsoft.com/services/application-insights/), where you can correlate log traces with user actions, exceptions and other events.


#### To get started

See [Logs, exceptions and custom diagnostics for ASP.NET in Application Insights](app-insights-search-diagnostic-logs.md).

## Version 1.2.6

- Bug fixes
- log4Net: Collect log4net properties as custom properties. UserName is not a custom property any more (It is collected as telemetry.Context.User.Id). Timestamp is not a custom property any more.
- NLog: Collect NLog properties as custom properties. SequenceID is not a custom property any more (It is collected as telemetry.Sequence). Timestamp is not a custom property any more. 

## Version 1.2.5
- First open source version: References Application Insights API version 1.2.3 or higher.
