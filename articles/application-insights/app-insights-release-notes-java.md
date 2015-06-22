<properties 
	pageTitle="Release notes for Application Insights" 
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
	ms.date="06/18/2015" 
	ms.author="awills"/>
 
# Release Notes for Application Insights SDK for Java

The [Application Insights SDK for Java](app-insights-java-get-started.md) sends telemetry about your live app to [Application Insights](http://azure.microsoft.com/services/application-insights/), where you can analyze its usage and performance.

#### To install the SDK in your application

See [Get started with the SDK for Java](app-insights-java-get-started.md).

#### To upgrade to the latest SDK 

After you upgrade, you'll need to merge back any customizations you made to ApplicationInsights.xml. Take a copy of it to compare with the new file.

*If you're using Maven or Gradle*

1. If you specified a particular version number in pom.xml or build.gradle, update it.
2. Refresh your project's dependencies.

*Otherwise*

* Download the latest version of [Azure Libraries for Java](http://dl.msopentech.com/lib/PackageForWindowsAzureLibrariesForJava.html) and replace the old ones. 
 
Compare the old and new ApplicationInsights.xml. Many of the changes you see are because we added and removed modules. Reinstate any customizations that you made.

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
 