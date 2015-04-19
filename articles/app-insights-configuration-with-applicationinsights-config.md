<properties 
	pageTitle="Configuring Application Insights SDK with ApplicationInsights.config or .xml" 
	description="Enable or disable data collection modules, and add performance counters and other parameters" 
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
	ms.date="04/13/2015" 
	ms.author="awills"/>

# Configuring the Application Insights SDK with ApplicationInsights.config or .xml

The Application Insights SDK consists of a number of modules. The core module provides the basic API that sends telemetry to the Application Insights portal. Additional modules collect data from your application and its context. By adjusting the configuration file, you can enable or disable modules, and set parameters for some of them.

The configuration file is named `ApplicationInsights.config` or `ApplicationInsights.xml`, depending on the type of your application. It is automatically added to your project when you [install the SDK][start]. It is also added to a web app by [Status Monitor on an IIS server][redfield], or when you [select the Appplication Insights extension for an Azure website or VM][azure].

There isn't an equivalent file to control the [SDK in a web page][client].


## Telemetry Modules

There's a node in the configuration file for each module. To disable a module, delete the node or comment it out.

#### Implementation.Tracing.DiagnosticsTelemetryModule

Required if you use the Application Insights [TrackTrace() API][api], or if you use [log collection][netlogs]. Trace events appear in [Diagnostic Search][diagnostic].

#### RuntimeTelemetry.RemoteDependencyModule

Collects data on the responsiveness of external components used by your application. To allow this module to work in an IIS server, you need to [install Status Monitor][redfield]. To use it in Azure web apps or VMs, [select the Application Insights extension][azure].

#### Web.WebApplicationLifecycleModule



#### Web.RequestTracking.TelemetryModules.WebRequestTrackingTelemetryModule

Counts requests arriving at your web app and measures the response times.

#### Web.RequestTracking.TelemetryModules.WebExceptionTrackingTelemetryModule

Counts unhandled exceptions in your web app. See [Failures and exceptions][exceptions].

#### Web.RequestTracking.TelemetryModules.WebSessionTrackingTelemetryModule

Tracks sessions. A session is counted as complete if there is no request from the same client machine and browser for more than a standard period.

#### Web.RequestTracking.TelemetryModules.WebUserTrackingTelemetryModule

Cookies are used to track users. If one person logs in with a different browser or an in-private session, that is counted as a separate user.

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

## Context Initializers

These components collect data from the platform. The data is collected in the [TelemetryContext object][api].

#### BuildInfoConfigComponentVersionContextInitializer

#### DeviceContextInitializer

#### MachineNameContextInitializer

#### ComponentContextInitializer

#### Web.AzureRoleEnvironmentContextInitializer

## Telemetry Initializers

These components add data to each telemetry event send to Application Insights.

#### Web.TelemetryInitializers.WebOperationNameTelemetryInitializer

Adds an operation name to every item of telemetry. For web apps, "operation" means an HTTP request.

#### Web.TelemetryInitializers.WebOperationIdTelemetryInitializer

This enables the feature "find events in the same operation" in [Diagnostic search][diagnostic].

Adds an operation ID to each data item sent to Application Insights. For web apps, an "operation" is an HTTP request. So, for example, the request, any custom events and traces that are part of processing the request all carry the same operation ID.

#### Web.TelemetryInitializers.WebUserTelemetryInitializer

Adds an anonymous user id to every telemetry item. This enables you to filter just the events relating to one user's activities in diagnostic search. For example, if an exception is reported, you can trace what that user was doing.

#### Web.TelemetryInitializers.WebSessionTelemetryInitializer

Adds a session id to each event.

## Custom Telemetry Initializers

If the standard telemetry initializers aren't suitable for your application, you can create your own.

    class MyTelemetryInitializer: IContextInitializer
    {
        public void Initialize(TelemetryContext context)
        {
            context.User.Id = Environment.UserName;
            context.Session.Id = DateTime.Now.ToFileTime().ToString();
            context.Session.IsNewSession = true;
        }
    }

Install the initializer at an early point in execution of your application - for example, 


    // In the app initializer such as Global.asax.cs:

    protected void Application_Start()
    {
      TelemetryConfiguration.Active.ContextInitializers.Add(
                new MyTelemetryInitializer());
            ...


## InstrumentationKey

This determines the Application Insights resource in which your data appears. Typically you create a separate resource, with a separate key, for each of your applications.

If you want to set the key dynamically - for example if you want to send results from your application to different resources - you can omit the key from the configuration file, and set it in code instead.

Set the key in an initialization method, such as global.aspx.cs in an ASP.NET service:

*C#*

    protected void Application_Start()
    {
      Microsoft.ApplicationInsights.Extensibility.
        TelemetryConfiguration.Active.InstrumentationKey = 
          // - for example -
          WebConfigurationManager.Settings["ikey"];
      ...

To get a new key, [create a new resource in the Application Insights portal][new].

[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]




