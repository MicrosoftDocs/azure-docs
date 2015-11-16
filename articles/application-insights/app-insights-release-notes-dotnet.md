<properties 
	pageTitle="Release notes for Application Insights for .NET" 
	description="The latest updates for .NET SDK." 
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
	ms.date="08/06/2015" 
	ms.author="sergkanz"/>
 
# Release Notes for Application Insights SDK for .NET

The [Application Insights SDK for .NET](app-insights-start-monitoring-app-health-usage.md) sends telemetry about your live app to [Application Insights](http://azure.microsoft.com/services/application-insights/), where you can analyze its usage and performance.


#### To install the SDK in your application

See [Get started with Application Insights for .NET](app-insights-start-monitoring-app-health-usage.md).

#### To upgrade to the latest SDK 

* After you upgrade, you'll need to merge back any customizations you made to ApplicationInsights.config. If you're unsure whether you customized it, create a new project, add Application Insights to it, and compare your .config file with the one in the new project. Make a note of any differences.
* In Solution Explorer, right-click your project and choose **Manage NuGet packages**.
* Set the filter to show installed packages. 
* Select **Microsoft.ApplicationInsights.Web** and choose **Upgrade**. (This will also upgrade all the dependent packages.)
* Compare ApplicationInsights.config with the old copy. Most of the changes you'll see are because we removed some modules and made others parameterizable. Reinstate any customizations you made to the old file.
* Rebuild your solution.

## Version 2.0.0-beta1
- TrackDependency will produce valid JSON when not all required fields were specified.
- Redundant property ```RequestTelemetry.ID``` is now just a proxy for ```RequestTelemetry.Operation.Id```.
- New interface ```ISupportSampling``` and explicit implementation of it by most of data item types.
- ```Count``` property on DependencyTelemetry marked as Obsolete. Use ```SamplingPercentage``` instead.
- New ```CloudContext``` introduced and properties ```RoleName``` and ```RoleInstance``` moved to it from ```DeviceContext```.
- New property ```AuthenticatedUserId``` on ```UserContext``` to specify authenticated user identity.
- Added `Microsoft.ApplicationInsights.Web.AccountIdTelemetryInitializer`, `Microsoft.ApplicationInsights.Web.AuthenticatedUserIdTelemetryInitializer` that initialize authenticated user context as set by Javascript SDK.
- Added `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ITelemetryProcessor` and fixed-rate Sampling support as an implementation of it.
- Added `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.TelemetryChannelBuilder` that allows creation of a `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel` with a set of `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ITelemetryProcessor`.

## Version 1.2

- Telemetry initializers that do not have dependencies on ASP.NET libraries were moved from `Microsoft.ApplicationInsights.Web` to the new dependency nuget `Microsoft.ApplicationInsights.WindowsServer`
- `Microsoft.ApplicationInsights.Web.dll` was renamed on `Microsoft.AI.Web.dll`
- `Microsoft.ApplicationInsights.Web.TelemetryChannel` nuget was renamed on `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel`. `Microsoft.ApplicationInsights.Extensibility.Web.TelemetryChannel` assembly was renamed on `Microsoft.AI.ServerTelemetryChannel.dll`. `Microsoft.ApplicationInsights.Extensibility.Web.TelemetryChannel` class was renamed on `Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel`.
- All namespaces that are part of Web SDK were changed to exclude `Extensibility` part. That includes all telemetry initializers in ApplicationInsights.config and `ApplicationInsightsWebTracking` module in web.config.
- Dependencies collected using runtime instrumentation agent (enabled via Status Monitor or Azure WebSite extension) will not be marked as asynchronous if there are no HttpContext.Current on the thread.
- Property `SamplingRatio` of `DependencyTrackingTelemetryModule` does nothing and marked as obsolete.
- `Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector` assembly was renamed on `Microsoft.AI.PerfCounterCollector`
- Several minor bug fixes in Web and Devices SDKs


## Version 1.1

- New telemetry type `DependencyTelemetry` was added which can be used to send information about dependency calls from application (like SQL, HTTP calls etc).
- New overload method `TelemetryClient.TrackDependency` was added that allows you to send information about dependency calls.
- Fixed NullReferenceException thrown by diagnostics module when TelemetryConfiguration.CreateDefault is used.

## Version 1.0

- Moved telemetry initializers and telemetry modules from separate sub-namespaces to the root `Microsoft.ApplicationInsights.Extensibility.Web` namespace.
- Removed "Web" prefix from names of telemetry initializers and telemetry modules because it is already included in the `Microsoft.ApplicationInsights.Extensibility.Web` namespace name.
- Moved `DeviceContextInitializer` from the `Microsoft.ApplicationInsights` assembly to the `Microsoft.ApplicationInsights.Extensibility.Web` assembly and converted it to an `ITelemetryInitializer`.
- Change namespace and assembly names from `Microsoft.ApplicationInsights.Extensibility.RuntimeTelemetry` to `Microsoft.ApplicationInsights.Extensibility.DependencyCollector` for consistency with the name of the NuGet package.
- Rename `RemoteDependencyModule` to `DependencyTrackingTelemetryModule`.
- Rename `CustomPerformanceCounterCollectionRequest` to `PerformanceCounterCollectionRequest`.

## Version 0.17
- Removed dependency to EventSource NuGet for the framework 4.5 applications.
- Anonymous User and Session cookies will not be generated on server side. To implement user and session tracking for web apps, instrumentation with JS SDK is now required – cookies from JavaScript SDK are still respected. Telemetry modules ```WebSessionTrackingTelemetryModule``` and ```WebUserTrackingTelemetryModule``` are no longer supported and were removed from ApplicationInsights.config file. Note that this change may cause a significant restatement of user and session counts as only user-originated sessions are being counted now.
- OSVersion is no longer populuated by SDK by default. When empty, OS and OSVersion is calculated by Application Insights pipeline, based on the user agent. 
- Persistence channel optimized for high-load scenarios is used for web SDK. "Spiral of death" issue fixed. Spiral of death is a condition when spike in telemetry items count that greatly exceeds throttling limit on endpoint will lead to retry after certain time and will be throttled during retry again.
- Developer Mode is optimized for production. If left by mistake it will not cause as big overhead as before attempting to output additional information.
- Developer Mode by default will only be enabled when application is under debugger. You can override it using ```DeveloperMode``` property of  ```ITelemetryChannel``` interface.

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

 
