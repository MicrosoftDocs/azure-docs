<properties 
	pageTitle="Release notes for Application Insights" 
	description="The latest updates." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="ronmart"/>
<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/21/2015" 
	ms.author="awills"/>
 
# Release Notes for Application Insights SDK for Java

[Using the SDK for Java](app-insights-java-get-started.md)

## Version 0.9.6
- Make the Java SDK compatible with servlet v2.5 and HttpClient pre-v4.3
- Adding support for Java EE interceptors
- Removing redundant dependencies from the Logback appender

## Version 0.9.5  

- Fix for an issue where custom events are not correlated with Users/Sessions due to cookie parsing errors.  
- Improved logic for resolving the location of the ApplicationInsights.xml configuration file.
- Removed tracking of sessions and users (this will only be done by client-side SDKs).

## Version 0.9.4

- Support collecting performance counters from 32-bit Windows machines.
- Support manual tracking of dependencies using a new ```trackDependency``` method API.
- Ability to tag a telemetry item as synthetic, by adding a ```SyntheticSource``` property to the reported item.
 