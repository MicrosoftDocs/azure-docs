<properties 
	pageTitle="Configuring Application Insights SDK with ApplicationInsights.config or .xml" 
	description="Enable or disable data collection modules, and add performance counters and other parameters" 
	services="application-insights"
    documentationCenter="" 
	authors="OlegAnaniev-MSFT"
    editor="alancameronwills" 
	manager="meravd"/>
 
<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2015" 
	ms.author="awills"/>

# Configuring the Application Insights SDK with ApplicationInsights.config or .xml

The Application Insights .NET SDK consists of a number of NuGet packages. The 
[core package](http://www.nuget.org/packages/Microsoft.ApplicationInsights) provides the API for sending telemetry to 
the Application Insights. [Additional packages](http://www.nuget.org/packages?q=Microsoft.ApplicationInsights) provide 
telemetry _modules_ and _initializers_ for automatically tracking telemetry from your application and its context. By 
adjusting the configuration file, you can enable or disable telemetry modules and initializers, and set parameters for 
some of them.

The configuration file is named `ApplicationInsights.config` or `ApplicationInsights.xml`, depending on the type of your
application. It is automatically added to your project when you [install some versions of the SDK][start]. It is also added to a web app 
by [Status Monitor on an IIS server][redfield], or when you select the Appplication Insights 
[extension for an Azure website or VM][azure].

There isn't an equivalent file to control the [SDK in a web page][client].

There's a node in the configuration file for each module. To disable a module, delete the node or comment it out.

## [Microsoft.ApplicationInsights](http://www.nuget.org/packages/Microsoft.ApplicationInsights) NuGet package

The `Microsoft.ApplicationInsights` NuGet package provides the following telemetry modules in the 
`ApplicationInsights.config`.

```
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Implementation.Tracing.DiagnosticsTelemetryModule, Microsoft.ApplicationInsights" />
  </TelemetryModules>
</ApplicationInsights>
```
The `DiagnosticsTelemetryModule` reports errors in the Application Insights instrumenation code itself. For example, 
if the code cannot access performance counters or if an `ITelemetryInitializer` throws an exception. Trace telemetry 
tracked by this module appears in the [Diagnostic Search][diagnostic].

## [Microsoft.ApplicationInsights.DependencyCollector](http://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector) NuGet package

The `Microsoft.ApplicationInsights.DependencyCollector` NuGet package provides the following telemetry modules in 
`ApplicationInsights.config`.

```
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.DependencyCollector.DependencyTrackingTelemetryModule, Microsoft.ApplicationInsights.Extensibility.DependencyCollector" />
  </TelemetryModules>
</ApplicationInsights>
```
The `DependencyTrackingTelemetryModule` tracks telemetry about calls to external dependencies made by your application, 
such as HTTP requests and SQL queries. To allow this module to work in an IIS server, you need to [install Status Monitor][redfield]. To use it in Azure web apps or VMs, [select the Application Insights extension][azure].

You can also write your own dependency tracking code using the [TrackDependency API](app-insights-api-custom-events-metrics.md#track-dependency).

## [Microsoft.ApplicationInsights.Web](http://www.nuget.org/packages/Microsoft.ApplicationInsights.Web) NuGet package

The `Microsoft.ApplicationInsights.Web` NuGet package provides the following telemetry initializers and modules in the
`ApplicationInsights.config`.

```
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
  <TelemetryInitializers>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.SyntheticTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.ClientIpHeaderTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.UserAgentTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.OperationNameTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.OperationIdTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.UserTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.SessionTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.AzureRoleEnvironmentTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.DomainNameRoleInstanceTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.BuildInfoConfigComponentVersionTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.DeviceTelemetryInitializer, Microsoft.ApplicationInsights.Extensibility.Web"/>
  </TelemetryInitializers>
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.RequestTrackingTelemetryModule, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.ExceptionTrackingTelemetryModule, Microsoft.ApplicationInsights.Extensibility.Web" />
    <Add Type="Microsoft.ApplicationInsights.Extensibility.Web.DeveloperModeWithDebuggerAttachedTelemetryModule, Microsoft.ApplicationInsights.Extensibility.Web" />
  </TelemetryModules>
</ApplicationInsights>
```

**Initializers**

* `SyntheticTelemetryInitializer` updates the `User`, `Session` and `Operation` contexts properties of all telemetry 
items tracked when handling a request from a synthetic source, such as an availability test. The Application Insights 
portal does not display synthetic telemetry by default.
* `ClientIpHeaderTelemetryInitializer` updates `Ip` property of the `Location` context of all telemetry items based on the 
`X-Forwarded-For` HTTP header of the request.
* `UserAgentTelemetryInitializer` updates the `UserAgent` property of the `User` context of all telemetry items based 
on the `User-Agent` HTTP header of the request.
* `OperationNameTelemetryInitializer` updates the `Name` property of the `RequestTelemetry` and the `Name` property of 
the `Operation` context of all telemetry items based on the HTTP method, as well as names of ASP.NET MVC controller and 
action invoked to process the request.
* `OperationNameTelemetryInitializer` updates the 'Operation.Id` context property of all telemetry items tracked while 
handling a request with the automatically generated `RequestTelemetry.Id`.
* `UserTelemetryInitializer` updates the `Id` and `AcquisitionDate` properties of `User` context for all telemetry items
with values extracted from the `ai_user` cookie generated by the Application Insights JavaScript instrumentation code 
running in the user's browser.
* `SessionTelemetryInitializer` updates the `Id` property of the `Session` context for all telemetry items with value
extracted from the `ai_session` cookie generated by the ApplicationInsights JavaScript instrumentation code running in the
user's browser. 
* `AzureRoleEnvironmentTelemetryInitializer` updates the `RoleName` and `RoleInstance` properties of the `Device` context
for all telemetry items with information extracted from the Azure runtime environment.
* `DomainNameRoleInstanceTelemetryInitializer` updates the `RoleInstance` property of the `Device` context for all
telemetry items with the domain name of the computer where the web application is running.
* `BuildInfoConfigComponentVersionTelemetryInitializer` updates the `Version` property of the `Component` context for 
all telemetry items with the value extracted from the `BuildInfo.config` file produced by TFS build.
* `DeviceTelemetryInitializer` updates the following properties of the `Device` context for all telemetry items.
 - `Type` is set to "PC"
 - `Id` is set to the domain name of the computer where the web application is running.
 - `OemName` is set to the value extracted from the `Win32_ComputerSystem.Manufacturer` field using WMI.
 - `Model` is set to the value extracted from the `Win32_ComputerSystem.Model` field using WMI.
 - `NetworkType` is set to the value extracted from the `NetworkInterface`.
 - `Language` is set to the name of the `CurrentCulture`.

**Modules**

* `RequestTrackingTelemetryModule` tracks requests received by your web app and measures the response times.
* `ExceptionTrackingTelemetryModule` tracks unhandled exceptions in your web app. See [Failures and exceptions][exceptions].
* `DeveloperModeWithDebuggerAttachedTelemetryModule` forces the Application Insights `TelemetryChannel` to send data
immediately, one telemetry item at a time, when a debugger is attached to the application process. This reduces the 
amount of time between the moment when your application tracks telemetry and when it appears on the Application Insights
portal at the cost of significant CPU and network bandwidth overhead.

## [Microsoft.ApplicationInsights.PerfCounterCollector](http://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector) NuGet package

The `Microsoft.ApplicationInsights.PerfCounterCollector` NuGet package adds the following telemetry modules to the `ApplicationInsights.config` by default.

```
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule, Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector" />
  </TelemetryModules>
</ApplicationInsights>
```

### PerformanceCollectorModule

`PerformanceCollectorModule` tracks a number of Windows performance counters. You can see these 
counters when you click a chart in Metric Explorer to open its details blade.

You can monitor additional performance counters - both standard Windows counters and any others that you have added.
      
Use the following syntax to collect additional performance counters:

```
<Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule, Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector">
  <Counters>
    <Add PerformanceCounter="\MyCategory\MyCounter" />
    <Add PerformanceCounter="\Process(??APP_WIN32_PROC??)\Handle Count" ReportAs="Process handle count" />
    <!-- ... -->
  </Counters>
</Add>
```      
      
`PerformanceCounter` must be either `\CategoryName(InstanceName)\CounterName` or `\CategoryName\CounterName`
      
If you provide a `ReportAs` attribute, this will be used as the name displayed in Application Insights.

For reporting to Application Insights, counter names must include only: letters, round brackets, forward slashes, hyphens, underscores, spaces and dots.

You must use ReportAs if the counter you want to monitor contains any invalid characters such as '#' or digits.
      
The following placeholders are supported as `InstanceName`:

    ?APP_WIN32_PROC?? - instance name of the application process  for Win32 counters.
    ??APP_W3SVC_PROC?? - instance name of the application IIS worker process for IIS/ASP.NET counters.
    ??APP_CLR_PROC?? - instance name of the application CLR process for .NET counters.

## Channel parameters (Java)

These parameters affect how the Java SDK should store and flush the telemetry data that it collects.

#### MaxTelemetryBufferCapacity

The number of telemetry items that can be stored in the SDK's in-memory storage. When this number is reached, the telemetry buffer is flushed - that is, the telemetry items are sent to the Application Insights server.

-	Min: 1
-	Max: 1000
-	Default: 500

```

  <ApplicationInsights>
      ...
      <Channel>
       <MaxTelemetryBufferCapacity>100</MaxTelemetryBufferCapacity>
      </Channel>
      ...
  </ApplicationInsights>
```

#### FlushIntervalInSeconds 

Determines how often the data that is stored in the in-memory storage should be flushed (sent to Application Insights).

-	Min: 1
-	Max: 300
-	Default: 5

```

    <ApplicationInsights>
      ...
      <Channel>
        <FlushIntervalInSeconds>100</FlushIntervalInSeconds>
      </Channel>
      ...
    </ApplicationInsights>
```

#### MaxTransmissionStorageCapacityInMB

Determines the maximum size in MB that is allotted to the persistent storage on the local disk. This storage is used for persisting telemetry items that failed to be transmitted to the Application Insights endpoint. When the storage size has been met, new telemetry items will be discarded.

-	Min: 1
-	Max: 100
-	Default: 10

```

   <ApplicationInsights>
      ...
      <Channel>
        <MaxTransmissionStorageCapacityInMB>50</MaxTransmissionStorageCapacityInMB>
      </Channel>
      ...
   </ApplicationInsights>
```

## Custom Initializers


If the standard initializers aren't suitable for your application, you can create your own.

Use Context Initializers to set values that will be used to initialize every telemetry client. For example, if you have published more than one version of your app, you could make sure you can separate the data by filtering on a custom property:

    plublic class MyContextInitializer: IContextInitializer
    {
        public void Initialize(TelemetryContext context)
        {
          context.Properties["AppVersion"] = "v2.1";
        }
    }

Use Telemetry Initializers to add processing to each event. For example, the web SDK flags as failed any request with a response code >= 400. You could override that behavior:  

    public class MyTelemetryInitializer : ITelemetryInitializer
    {
        public void Initialize(ITelemetry telemetry)
        {
            var requestTelemetry = telemetry as RequestTelemetry;
            if (requestTelemetry == null) return;
            int code;
            bool parsed = Int32.TryParse(requestTelemetry.ResponseCode, out code);
            if (!parsed) return;
            if (code >= 400 && code < 500)
            {
                requestTelemetry.Success = true;
                requestTelemetry.Context.Properties["Overridden400s"] = "true";
            }            
        }
    }
 
To install your initializers, add lines in ApplicationInsights.config:

    <TelemetryInitializers> <!-- or ContextInitializers -->
    <Add Type="MyNamespace.MyTelemetryInitializer, MyAssemblyName" />


Alternatively you can write code to install the initializer at an early point in execution of your application. For example: 


    // In the app initializer such as Global.asax.cs:

    protected void Application_Start()
    {
      TelemetryConfiguration.Active.TelemetryInitializers.Add(
                new MyTelemetryInitializer());
            ...




## InstrumentationKey

This determines the Application Insights resource in which your data appears. Typically you create a separate resource, with a separate key, for each of your applications.

If you want to set the key dynamically - for example if you want to send results from your application to different resources - you can omit the key from the configuration file, and set it in code instead.

To set the key for all instances of TelemetryClient, including standard telemetry modules, set the key in TelemetryConfiguration.Active. Do this in an initialization method, such as global.aspx.cs in an ASP.NET service:

```C#

    protected void Application_Start()
    {
      Microsoft.ApplicationInsights.Extensibility.
        TelemetryConfiguration.Active.InstrumentationKey = 
          // - for example -
          WebConfigurationManager.Settings["ikey"];
      //...
```

If you just want to send a specific set of events to a different resource, you can set the key for a specific TelemetryClient:

```C#

    var tc = new TelemetryClient();
    tc.Context.InstrumentationKey = "----- my key ----";
    tc.TrackEvent("myEvent");
    // ...

```

[Learn more about the API][api].

To get a new key, [create a new resource in the Application Insights portal][new].

<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[azure]: ../insights-perf-analytics.md
[client]: app-insights-javascript.md
[diagnostic]: app-insights-diagnostic-search.md
[exceptions]: app-insights-web-failures-exceptions.md
[netlogs]: app-insights-asp-net-trace-logs.md
[new]: app-insights-create-new-resource.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[start]: app-insights-overview.md

