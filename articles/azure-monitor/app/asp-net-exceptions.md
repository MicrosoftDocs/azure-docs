---
title: Diagnose failures and exceptions in web apps with Azure Application Insights | Microsoft Docs
description: Capture exceptions from ASP.NET apps along with request telemetry.
services: application-insights
documentationcenter: .net
author: mrbullwinkle
manager: carmonm

ms.assetid: d1e98390-3ce4-4d04-9351-144314a42aa2
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 09/19/2017
ms.author: mbullwin

---
# Diagnose exceptions in your web apps with Application Insights
Exceptions in your live web app are reported by [Application Insights](../../azure-monitor/app/app-insights-overview.md). You can correlate failed requests with exceptions and other events at both the client and server, so that you can quickly diagnose the causes.

## Set up exception reporting
* To have exceptions reported from your server app:
  * Azure web apps: Add the [Application Insights Extension](../../azure-monitor/app/azure-web-apps.md)
  * Azure VM and Azure virtual machine scale set IIS-hosted apps: Add the [Application Monitoring Extension](../../azure-monitor/app/azure-vm-vmss-apps.md)
  * Install [Application Insights SDK](../../azure-monitor/app/asp-net.md) in your app code, or
  * IIS web servers: Run [Application Insights Agent](../../azure-monitor/app/monitor-performance-live-website-now.md); or
  * Java web apps: Install the [Java agent](../../azure-monitor/app/java-agent.md)
* Install the [JavaScript snippet](../../azure-monitor/app/javascript.md) in your web pages to catch browser exceptions.
* In some application frameworks or with some settings, you need to take some extra steps to catch more exceptions:
  * [Web forms](#web-forms)
  * [MVC](#mvc)
  * [Web API 1.*](#web-api-1x)
  * [Web API 2.*](#web-api-2x)
  * [WCF](#wcf)

## Diagnosing exceptions using Visual Studio
Open the app solution in Visual Studio to help with debugging.

Run the app, either on your server or on your development machine by using F5.

Open the Application Insights Search window in Visual Studio, and set it to display events from your app. While you're debugging, you can do this just by clicking the Application Insights button.

![Right-click the project and choose Application Insights, Open.](./media/asp-net-exceptions/34.png)

Notice that you can filter the report to show just exceptions.

*No exceptions showing? See [Capture exceptions](#exceptions).*

Click an exception report to show its stack trace.
Click a line reference in the stack trace, to open the relevant code file.

In the code, notice that CodeLens shows data about the exceptions:

![CodeLens notification of exceptions.](./media/asp-net-exceptions/35.png)

## Diagnosing failures using the Azure portal
Application Insights comes with a curated APM experience to help you diagnose failures in your monitored applications. To start, click on the Failures option in the Application Insights resource menu located in the Investigate section.
You should see a full-screen view that shows you the failure rate trends for your requests, how many of them are failing, and how many users are impacted. On the right you'll see some of the most useful distributions specific to the selected failing operation, including top 3 response codes, top 3 exception types, and top 3 failing dependency types.

![Failures triage view (operations tab)](./media/asp-net-exceptions/FailuresTriageView.png)

In a single click you can then review representative samples for each of these subsets of operations. In particular, to diagnose exceptions, you can click on the count of a particular exception to be presented with an Exceptions details blade,
such as this one:

![Exception details blade](./media/asp-net-exceptions/ExceptionDetailsBlade.png)

**Alternatively,** instead of looking at exceptions of a specific failing operation, you can start from the overall view of exceptions, by switching to the Exceptions tab:

![Failures triage view (exceptions tab)](./media/asp-net-exceptions/FailuresTriageView_Exceptions.png)

Here you can see all the exceptions collected for your monitored app.

*No exceptions showing? See [Capture exceptions](#exceptions).*


## Custom tracing and log data
To get diagnostic data specific to your app, you can insert code to send your own telemetry data. This displayed in diagnostic search alongside the request, page view and other automatically-collected data.

You have several options:

* [TrackEvent()](../../azure-monitor/app/api-custom-events-metrics.md#trackevent) is typically used for monitoring usage patterns, but the data it sends also appears under Custom Events in diagnostic search. Events are named, and can carry string properties and numeric metrics on which you can [filter your diagnostic searches](../../azure-monitor/app/diagnostic-search.md).
* [TrackTrace()](../../azure-monitor/app/api-custom-events-metrics.md#tracktrace) lets you send longer data such as POST information.
* [TrackException()](#exceptions) sends stack traces. [More about exceptions](#exceptions).
* If you already use a logging framework like Log4Net or NLog, you can [capture those logs](asp-net-trace-logs.md) and see them in diagnostic search alongside request and exception data.

To see these events, open [Search](../../azure-monitor/app/diagnostic-search.md), open Filter, and then choose Custom Event, Trace, or Exception.

![Drill through](./media/asp-net-exceptions/viewCustomEvents.png)

> [!NOTE]
> If your app generates a lot of telemetry, the adaptive sampling module will automatically reduce the volume that is sent to the portal by sending only a representative fraction of events. Events that are part of the same operation will be selected or deselected as a group, so that you can navigate between related events. [Learn about sampling.](../../azure-monitor/app/sampling.md)
>
>

### How to see request POST data
Request details don't include the data sent to your app in a POST call. To have this data reported:

* [Install the SDK](../../azure-monitor/app/asp-net.md) in your application project.
* Insert code in your application to call [Microsoft.ApplicationInsights.TrackTrace()](../../azure-monitor/app/api-custom-events-metrics.md#tracktrace). Send the POST data in the message parameter. There is a limit to the permitted size, so you should try to send just the essential data.
* When you investigate a failed request, find the associated traces.

![Drill through](./media/asp-net-exceptions/060-req-related.png)

## <a name="exceptions"></a> Capturing exceptions and related diagnostic data
At first, you won't see in the portal all the exceptions that cause failures in your app. You'll see any browser exceptions (if you're using the [JavaScript SDK](../../azure-monitor/app/javascript.md) in your web pages). But most server exceptions are caught by IIS and you have to write a bit of code to see them.

You can:

* **Log exceptions explicitly** by inserting code in exception handlers to report the exceptions.
* **Capture exceptions automatically** by configuring your ASP.NET framework. The necessary additions are different for different types of framework.

## Reporting exceptions explicitly
The simplest way is to insert a call to TrackException() in an exception handler.

```javascript
    try
    { ...
    }
    catch (ex)
    {
      appInsights.trackException(ex, "handler loc",
        {Game: currentGame.Name,
         State: currentGame.State.ToString()});
    }
```

```csharp
    var telemetry = new TelemetryClient();
    ...
    try
    { ...
    }
    catch (Exception ex)
    {
       // Set up some properties:
       var properties = new Dictionary <string, string>
         {{"Game", currentGame.Name}};

       var measurements = new Dictionary <string, double>
         {{"Users", currentGame.Users.Count}};

       // Send the exception telemetry:
       telemetry.TrackException(ex, properties, measurements);
    }
```

```VB
    Dim telemetry = New TelemetryClient
    ...
    Try
      ...
    Catch ex as Exception
      ' Set up some properties:
      Dim properties = New Dictionary (Of String, String)
      properties.Add("Game", currentGame.Name)

      Dim measurements = New Dictionary (Of String, Double)
      measurements.Add("Users", currentGame.Users.Count)

      ' Send the exception telemetry:
      telemetry.TrackException(ex, properties, measurements)
    End Try
```

The properties and measurements parameters are optional, but are useful for [filtering and adding](../../azure-monitor/app/diagnostic-search.md) extra information. For example, if you have an app that can run several games, you could find all the exception reports related to a particular game. You can add as many items as you like to each dictionary.

## Browser exceptions
Most browser exceptions are reported.

If your web page includes script files from content delivery networks or other domains, ensure your script tag has the attribute ```crossorigin="anonymous"```,  and that the server sends [CORS headers](https://enable-cors.org/). This will allow you to get a stack trace and detail for unhandled JavaScript exceptions from these resources.

## Web forms
For web forms, the HTTP Module will be able to collect the exceptions when there are no redirects configured with CustomErrors.

But if you have active redirects, add the following lines to the Application_Error function in Global.asax.cs. (Add a Global.asax file if you don't already have one.)

```csharp
    void Application_Error(object sender, EventArgs e)
    {
      if (HttpContext.Current.IsCustomErrorEnabled && Server.GetLastError () != null)
      {
         var ai = new TelemetryClient(); // or re-use an existing instance

         ai.TrackException(Server.GetLastError());
      }
    }
```

## MVC
Starting with Application Insights Web SDK version 2.6 (beta3 and later), Application Insights collects unhandled exceptions thrown in the MVC 5+ controllers methods automatically. If you have previously added a custom handler to track such exceptions (as described in following examples), you may remove it to prevent double tracking of exceptions.

There are a number of cases that the exception filters cannot handle. For example:

* Exceptions thrown from controller constructors.
* Exceptions thrown from message handlers.
* Exceptions thrown during routing.
* Exceptions thrown during response content serialization.
* Exception thrown during application start-up.
* Exception thrown in background tasks.

All exceptions *handled* by application still need to be tracked manually.
Unhandled exceptions originating from controllers typically result in 500 "Internal Server Error" response. If such response is manually constructed as a result of handled exception (or no exception at all) it is tracked in corresponding request telemetry with `ResultCode` 500, however Application Insights SDK is unable to track corresponding exception.

### Prior versions support
If you use MVC 4 (and prior) of Application Insights Web SDK 2.5 (and prior), refer to the following examples to track exceptions.

If the [CustomErrors](https://msdn.microsoft.com/library/h0hfz6fc.aspx) configuration is `Off`, then exceptions will be available for the [HTTP Module](https://msdn.microsoft.com/library/ms178468.aspx) to collect. However, if it is `RemoteOnly` (default), or `On`, then the exception will be cleared and not available for Application Insights to automatically collect. You can fix that by overriding the [System.Web.Mvc.HandleErrorAttribute class](https://msdn.microsoft.com/library/system.web.mvc.handleerrorattribute.aspx), and applying the overridden class as shown for the different MVC versions below ([GitHub source](https://github.com/AppInsightsSamples/Mvc2UnhandledExceptions/blob/master/MVC2App/Controllers/AiHandleErrorAttribute.cs)):

```csharp
    using System;
    using System.Web.Mvc;
    using Microsoft.ApplicationInsights;

    namespace MVC2App.Controllers
    {
      [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
      public class AiHandleErrorAttribute : HandleErrorAttribute
      {
        public override void OnException(ExceptionContext filterContext)
        {
            if (filterContext != null && filterContext.HttpContext != null && filterContext.Exception != null)
            {
                //If customError is Off, then AI HTTPModule will report the exception
                if (filterContext.HttpContext.IsCustomErrorEnabled)
                {   //or reuse instance (recommended!). see note above
                    var ai = new TelemetryClient();
                    ai.TrackException(filterContext.Exception);
                }
            }
            base.OnException(filterContext);
        }
      }
    }
```

#### MVC 2
Replace the HandleError attribute with your new attribute in your controllers.

```csharp
    namespace MVC2App.Controllers
    {
        [AiHandleError]
        public class HomeController : Controller
        {
    ...
```

[Sample](https://github.com/AppInsightsSamples/Mvc2UnhandledExceptions)

#### MVC 3
Register `AiHandleErrorAttribute` as a global filter in Global.asax.cs:

```csharp
    public class MyMvcApplication : System.Web.HttpApplication
    {
      public static void RegisterGlobalFilters(GlobalFilterCollection filters)
      {
         filters.Add(new AiHandleErrorAttribute());
      }
     ...
```

[Sample](https://github.com/AppInsightsSamples/Mvc3UnhandledExceptionTelemetry)

#### MVC 4, MVC5
Register AiHandleErrorAttribute as a global filter in FilterConfig.cs:

```csharp
    public class FilterConfig
    {
      public static void RegisterGlobalFilters(GlobalFilterCollection filters)
      {
        // Default replaced with the override to track unhandled exceptions
        filters.Add(new AiHandleErrorAttribute());
      }
    }
```

[Sample](https://github.com/AppInsightsSamples/Mvc5UnhandledExceptionTelemetry)

## Web API
Starting with Application Insights Web SDK version 2.6 (beta3 and later), Application Insights collects unhandled exceptions thrown in the controller methods automatically for WebAPI 2+. If you have previously added a custom handler to track such exceptions (as described in following examples), you may remove it to prevent double tracking of exceptions.

There are a number of cases that the exception filters cannot handle. For example:

* Exceptions thrown from controller constructors.
* Exceptions thrown from message handlers.
* Exceptions thrown during routing.
* Exceptions thrown during response content serialization.
* Exception thrown during application start-up.
* Exception thrown in background tasks.

All exceptions *handled* by application still need to be tracked manually.
Unhandled exceptions originating from controllers typically result in 500 "Internal Server Error" response. If such response is manually constructed as a result of handled exception (or no exception at all) it is tracked in a corresponding request telemetry with `ResultCode` 500, however Application Insights SDK is unable to track corresponding exception.

### Prior versions support
If you use WebAPI 1 (and prior) of Application Insights Web SDK 2.5 (and prior), refer to the following examples to track exceptions.

#### Web API 1.x
Override System.Web.Http.Filters.ExceptionFilterAttribute:

```csharp
    using System.Web.Http.Filters;
    using Microsoft.ApplicationInsights;

    namespace WebAPI.App_Start
    {
      public class AiExceptionFilterAttribute : ExceptionFilterAttribute
      {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext != null && actionExecutedContext.Exception != null)
            {  //or reuse instance (recommended!). see note above
                var ai = new TelemetryClient();
                ai.TrackException(actionExecutedContext.Exception);
            }
            base.OnException(actionExecutedContext);
        }
      }
    }
```

You could add this overridden attribute to specific controllers, or add it to the global filter configuration in the WebApiConfig class:

```csharp
    using System.Web.Http;
    using WebApi1.x.App_Start;

    namespace WebApi1.x
    {
      public static class WebApiConfig
      {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(name: "DefaultApi", routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional });
            ...
            config.EnableSystemDiagnosticsTracing();

            // Capture exceptions for Application Insights:
            config.Filters.Add(new AiExceptionFilterAttribute());
        }
      }
    }
```

[Sample](https://github.com/AppInsightsSamples/WebApi_1.x_UnhandledExceptions)

#### Web API 2.x
Add an implementation of IExceptionLogger:

```csharp
    using System.Web.Http.ExceptionHandling;
    using Microsoft.ApplicationInsights;

    namespace ProductsAppPureWebAPI.App_Start
    {
      public class AiExceptionLogger : ExceptionLogger
      {
        public override void Log(ExceptionLoggerContext context)
        {
            if (context !=null && context.Exception != null)
            {//or reuse instance (recommended!). see note above
                var ai = new TelemetryClient();
                ai.TrackException(context.Exception);
            }
            base.Log(context);
        }
      }
    }
```

Add this to the services in WebApiConfig:

```csharp
    using System.Web.Http;
    using System.Web.Http.ExceptionHandling;
    using ProductsAppPureWebAPI.App_Start;

    namespace WebApi2WithMVC
    {
      public static class WebApiConfig
      {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Services.Add(typeof(IExceptionLogger), new AiExceptionLogger());
        }
      }
     }
```

[Sample](https://github.com/AppInsightsSamples/WebApi_2.x_UnhandledExceptions)

As alternatives, you could:

1. Replace the only ExceptionHandler with a custom implementation of IExceptionHandler. This is only called when the framework is still able to choose which response message to send (not when the connection is aborted for instance)
2. Exception Filters (as described in the section on Web API 1.x controllers above) - not called in all cases.

## WCF
Add a class that extends Attribute and implements IErrorHandler and IServiceBehavior.

```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.ServiceModel.Description;
    using System.ServiceModel.Dispatcher;
    using System.Web;
    using Microsoft.ApplicationInsights;

    namespace WcfService4.ErrorHandling
    {
      public class AiLogExceptionAttribute : Attribute, IErrorHandler, IServiceBehavior
      {
        public void AddBindingParameters(ServiceDescription serviceDescription,
            System.ServiceModel.ServiceHostBase serviceHostBase,
            System.Collections.ObjectModel.Collection<ServiceEndpoint> endpoints,
            System.ServiceModel.Channels.BindingParameterCollection bindingParameters)
        {
        }

        public void ApplyDispatchBehavior(ServiceDescription serviceDescription,
            System.ServiceModel.ServiceHostBase serviceHostBase)
        {
            foreach (ChannelDispatcher disp in serviceHostBase.ChannelDispatchers)
            {
                disp.ErrorHandlers.Add(this);
            }
        }

        public void Validate(ServiceDescription serviceDescription,
            System.ServiceModel.ServiceHostBase serviceHostBase)
        {
        }

        bool IErrorHandler.HandleError(Exception error)
        {//or reuse instance (recommended!). see note above
            var ai = new TelemetryClient();

            ai.TrackException(error);
            return false;
        }

        void IErrorHandler.ProvideFault(Exception error,
            System.ServiceModel.Channels.MessageVersion version,
            ref System.ServiceModel.Channels.Message fault)
        {
        }
      }
    }

Add the attribute to the service implementations:

    namespace WcfService4
    {
        [AiLogException]
        public class Service1 : IService1
        {
         ...
```

[Sample](https://github.com/AppInsightsSamples/WCFUnhandledExceptions)

## Exception performance counters
If you have [installed the Application Insights Agent](../../azure-monitor/app/monitor-performance-live-website-now.md) on your server, you can get a chart of the exceptions rate, measured by .NET. This includes both handled and unhandled .NET exceptions.

Open a Metric Explorer blade, add a new chart, and select **Exception rate**, listed under Performance Counters.

The .NET framework calculates the rate by counting the number of exceptions in an interval and dividing by the length of the interval.

This is different from the 'Exceptions' count calculated by the Application Insights portal counting TrackException reports. The sampling intervals are different, and the SDK doesn't send TrackException reports for all handled and unhandled exceptions.

## Video

> [!VIDEO https://channel9.msdn.com/events/Connect/2016/112/player]

## Next steps
* [Monitor REST, SQL, and other calls to dependencies](../../azure-monitor/app/asp-net-dependencies.md)
* [Monitor page load times, browser exceptions, and AJAX calls](../../azure-monitor/app/javascript.md)
* [Monitor performance counters](../../azure-monitor/app/performance-counters.md)
