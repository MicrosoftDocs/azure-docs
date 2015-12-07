<properties 
	pageTitle="Release notes for Application Insights for Windows" 
	description="The latest updates for Windows Store SDK." 
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
	ms.date="09/18/2015" 
	ms.author="sergkanz"/>
 
# Release Notes for Application Insights SDK for Windows Phone and Store

The [Application Insights SDK](app-insights-windows-get-started.md) sends telemetry about your live app to [Application Insights](http://azure.microsoft.com/services/application-insights/), where you can analyze its usage and performance.


#### To install the SDK in your application

See [Get started with Application Insights for Windows Phone and Store apps](app-insights-windows-get-started.md).

#### To upgrade to the latest SDK 

* Take a copy of ApplicationInsights.config, to keep any customizations you have done.
* In Solution Explorer, right-click your project and choose **Manage NuGet packages**.
* Set the filter to show installed packages. 
* Select the installed Application Insights packages and choose Upgrade.
* Compare the old and new versions of ApplicationInsights.config. Merge back any customizations you made to the old version.
* Rebuild your solution.

## Version 1.2

### Windows App SDK

- Fix a FileNotFound exception that was preventing persisted telemetries from being sent after the app is re-opened.

### Core SDK

- First version of Application Insights SDK shipped from [github](http://github.com/microsoft/ApplicationInsights-dotnet)

## Version 1.1

### Core SDK

- SDK now introduces new telemetry type ```DependencyTelemetry``` which contains information about dependency call from application
- New method ```TelemetryClient.TrackDependency``` allows to send information about dependency calls from application

## Version 1.0.0

### Windows App SDK

- New initialization for Windows Apps. New `WindowsAppInitializer` class with `InitializeAsync()` method allows for bootstrapping initialization of SDK collection. This change allow more precise control and significant app initialization performance improvements over previous ApplicationInsights.config technique.
- DeveloperMode is no longer automatically set. To change DeveloperMode behavior you must specify in code.
- NuGet package no longer injects ApplicationInsights.config. Recommend to use the new WindowsAppInitializer when manually adding NuGet package.
- ApplicationInsights.config only reads `<InstrumentationKey>`, all other settings are ignored in preference for WindowsAppInitializer settings.
- Store Market will be auto collected by SDK.
- Lots of bug fixes, stability improvements, and performance enhancements.

### Core SDK

- ApplicationInsights.config file is no longer requiered. And not added by the NuGet package. Configuration can be fully specified in code.
- NuGet package will no longer add a targets file to your solution. This removes the automatic setting of DeveloperMode during a debug build. DeveloperMode should be manually set in code.

## Version 0.17

### Windows App SDK

- Windows App SDK now supports Universal Windows Apps created against Windows 10 technical preview and with VS 2015 RC.

### Core SDK

- TelemetryClient defaults to initialize with the InMemoryChannel.
- New API added, `TelemetryClient.Flush()`. This Flush method will trigger an immediate blocking upload of all telemetry logged to that client. This enables manual triggering of upload before process shutdown.
- NuGet package added a .Net 4.5 target. This target has no external dependencies (removed BCL and EventSource dependencies).

## Version 0.16 

2015-04-28 preview

- SDK now supports DNX target platform to enable monitoring of [.NET Core framework](http://www.dotnetfoundation.org/NETCore5) applications.
- Instances of ```TelemetryClient``` do not cache Instrumentation Key anymore. Now if instrumentation key wasn't set in ```TelemetryClient``` explicitly ```InstrumentationKey``` will return null. It fixes an issue when you set ```TelemetryConfiguration.Active.InstrumentationKey``` after some telemetry was already collected, telemetry modules like dependency collector, web requests data collection and performance counters collector will use new instrumentation key.

## Version 0.15

- New property ```Operation.SyntheticSource``` now available on ```TelemetryContext```. Now you can mark your telemetry items as "not a real user traffic" and specify how this traffic was generated. As an example by setting this property you can distinguish traffic from your test automation from load test traffic.
- Channel logic was moved to the separate NuGet called Microsoft.ApplicationInsights.PersistenceChannel. Default channel is now called InMemoryChannel
- New method ```TelemetryClient.Flush``` allows to flush telemetry items from the buffer synchronously

## Version 0.13

No release notes for older versions available. 
