<properties 
	pageTitle="Configuring Application Insights SDK with ApplicationInsights.config or .xml" 
	description="Enable or disable data collection modules, and add performance counters and other parameters" 
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
	ms.date="06/04/2015" 
	ms.author="awills"/>

# Configuring the Application Insights SDK with ApplicationInsights.config or .xml

The Application Insights SDK consists of a number of modules. The core module provides the basic API that sends telemetry to the Application Insights portal. Additional modules collect data from your application and its context. By adjusting the configuration file, you can enable or disable modules, and set parameters for some of them.

The configuration file is named `ApplicationInsights.config` or `ApplicationInsights.xml`, depending on the type of your application. It is automatically added to your project when you [install the SDK][start]. It is also added to a web app by [Status Monitor on an IIS server][redfield], or when you [select the Appplication Insights extension for an Azure website or VM][azure].

There isn't an equivalent file to control the [SDK in a web page][client].


## Telemetry Modules

There's a node in the configuration file for each module. To disable a module, delete the node or comment it out.

#### Implementation.Tracing.DiagnosticsTelemetryModule

Reports errors in the SDK. For example, if the SDK cannot access performance counters or if a custom TelemetryInitializer throws an exception.

Data appears in [Diagnostic Search][diagnostic].

#### RuntimeTelemetry.RemoteDependencyModule

Collects data on the responsiveness of external components used by your application. To allow this module to work in an IIS server, you need to [install Status Monitor][redfield]. To use it in Azure web apps or VMs, [select the Application Insights extension][azure].

#### Web.WebApplicationLifecycleModule

Attempts to flush all in-memory buffers of telemetry data so it will not be lost on process shutdown.

#### Web.RequestTracking.TelemetryModules.WebRequestTrackingTelemetryModule

Counts requests arriving at your web app and measures the response times.

#### Web.RequestTracking.TelemetryModules.WebExceptionTrackingTelemetryModule

Counts unhandled exceptions in your web app. See [Failures and exceptions][exceptions].



#### Web.TelemetryModules.DeveloperModeWithDebuggerAttachedTelemetryModule



## Performance collector module

#### PerfCollector.PerformanceCollectorModule

By default, this module collects a variety of Windows performance counters. You can see these counters when you open the Filters blade in Metric Explorer.

You can monitor additional performance counters - both standard Windows counters and any others that you have added.
      
Use the following syntax to collect additional performance counters:
      
      <Counters>
        <Add PerformanceCounter="\MyCategory\MyCounter" />
        <Add PerformanceCounter="\Process(??APP_WIN32_PROC??)\Handle Count" ReportAs="Process handle count" />
        ...
      </Counters>
      
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

    <ApplicationInsights>
      ...
      <Channel>
       <MaxTelemetryBufferCapacity>100</MaxTelemetryBufferCapacity>
      </Channel>
      ...
    </ApplicationInsights>

#### FlushIntervalInSeconds 

Determines how often the data that is stored in the in-memory storage should be flushed (sent to Application Insights).

-	Min: 1
-	Max: 300
-	Default: 5

    <ApplicationInsights>
      ...
      <Channel>
        <FlushIntervalInSeconds>100</FlushIntervalInSeconds>
      </Channel>
      ...
    </ApplicationInsights>

#### MaxTransmissionStorageCapacityInMB

Determines the maximum size in MB that is allotted to the persistent storage on the local disk. This storage is used for persisting telemetry items that failed to be transmitted to the Application Insights endpoint. When the storage size has been met, new telemetry items will be discarded.

-	Min: 1
-	Max: 100
-	Default: 10

    <ApplicationInsights>
      ...
      <Channel>
        <MaxTransmissionStorageCapacityInMB>50</MaxTransmissionStorageCapacityInMB>
      </Channel>
      ...
    </ApplicationInsights>


## Context Initializers

These components collect data from the platform. The data is collected in the [TelemetryContext object][api].

#### BuildInfoConfigComponentVersionContextInitializer

#### DeviceContextInitializer

#### MachineNameContextInitializer

#### ComponentContextInitializer

#### Web.AzureRoleEnvironmentContextInitializer

#### Web.DomainNameRoleInstanceContextInitializer

#### Web.BuildInfoConfigComponentVersionContextInitializer

#### Web.DeviceContextInitializer



## Telemetry Initializers

These components add data to each telemetry event sent to Application Insights.


#### Web.TelemetryInitializers.WebSyntheticTelemetryInitializer

This component identifies HTTP requests that appear to come from robots such as search engines and web tests. It sets TelemetryClient.Context.Operation.SyntheticSource.

#### Web.TelemetryInitializers.WebOperationNameTelemetryInitializer

Adds an operation name to every item of telemetry. For web apps, "operation" means an HTTP request. Sets TelemetryClient.Context.Operation.Name

#### Web.TelemetryInitializers.WebOperationIdTelemetryInitializer

This enables the feature "find events in the same request" in [Diagnostic search][diagnostic]. Sets TelemetryClient.Context.Operation.Id

Adds an operation ID to each data item sent to Application Insights. For web apps, an "operation" is an HTTP request. So, for example, the request and any custom events and traces that are part of processing the request all carry the same operation ID. 

#### Web.TelemetryInitializers.WebUserTelemetryInitializer

Adds an anonymous user id to every telemetry item. This enables you to filter just the events relating to one user's activities in diagnostic search. For example, if an exception is reported, you can trace what that user was doing.

Sets telemetryClient.Context.User

#### Web.TelemetryInitializers.WebSessionTelemetryInitializer

Adds a session id to each event. Sets telemetryClient.Context.Session

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
[start]: app-insights-get-started.md

 