---
title: Azure Service Fabric Application Level Monitoring | Microsoft Docs
description: Learn about application and service level events and logs used to monitor and diagnose Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/26/2017
ms.author: dekapur

---

# Application and service level event and log generation

## Instrumenting the code with custom events

Instrumenting the code is the basis for most other aspects of monitoring your services. Instrumentation is the only way you can know that something is wrong, and to diagnose what needs to be fixed. Although technically it's possible to connect a debugger to a production service, it's not a common practice. So, having detailed instrumentation data is important.

Some products automatically instrument your code. Although these solutions can work well, manual instrumentation is almost always required. In the end, you must have enough information to forensically debug the application. This document describes different approaches to instrumenting your code, and when to choose one approach over another.

## EventSource
When you create a Service Fabric solution from a template in Visual Studio, an **EventSource**-derived class (**ServiceEventSource** or **ActorEventSource**) is generated. A template is created, in which you can add events for your application or service. The **EventSource** name **must** be unique, and should be renamed from the default template string MyCompany-&lt;solution&gt;-&lt;project&gt;. Having multiple **EventSource** definitions that use the same name causes an issue at run time. Each defined event must have a unique identifier. If an identifier is not unique, a runtime failure occurs. Some organizations preassign ranges of values for identifiers to avoid conflicts between separate development teams. For more information, see [Vance's blog](https://blogs.msdn.microsoft.com/vancem/2012/07/09/introduction-tutorial-logging-etw-events-in-c-system-diagnostics-tracing-eventsource/) or the [MSDN documentation](https://msdn.microsoft.com/library/dn774985(v=pandp.20).aspx).

### Using structured EventSource events

Each of the events in the code examples in this section are defined for a specific case, for example, when a service type is registered. When you define messages by use case, data can be packaged with the text of the error, and you can more easily search and filter based on the names or values of the specified properties. Structuring the instrumentation output makes it easier to consume, but requires more thought and time to define a new event for each use case. Some event definitions can be shared across the entire application. For example, a method start or stop event would be reused across many services within an application. A domain-specific service, like an order system, might have a **CreateOrder** event, which has its own unique event. This approach might generate many events, and potentially require coordination of identifiers across project teams. 

```csharp
    [EventSource(Name = "MyCompany-VotingState-VotingStateService")]
    internal sealed class ServiceEventSource : EventSource
    {
        public static readonly ServiceEventSource Current = new ServiceEventSource();

        // The instance constructor is private to enforce singleton semantics.
        private ServiceEventSource() : base() { }

        ...

        // The ServiceTypeRegistered event contains a unique identifier, an event attribute that defined the event, and the code implementation of the event.
        private const int ServiceTypeRegisteredEventId = 3;
        [Event(ServiceTypeRegisteredEventId, Level = EventLevel.Informational, Message = "Service host process {0} registered service type {1}", Keywords = Keywords.ServiceInitialization)]
        public void ServiceTypeRegistered(int hostProcessId, string serviceType)
        {
            WriteEvent(ServiceTypeRegisteredEventId, hostProcessId, serviceType);
        }

        // The ServiceHostInitializationFailed event contains a unique identifier, an event attribute that defined the event, and the code implementation of the event.
        private const int ServiceHostInitializationFailedEventId = 4;
        [Event(ServiceHostInitializationFailedEventId, Level = EventLevel.Error, Message = "Service host initialization failed", Keywords = Keywords.ServiceInitialization)]
        public void ServiceHostInitializationFailed(string exception)
        {
            WriteEvent(ServiceHostInitializationFailedEventId, exception);
        }
```

### Using EventSource generically

Because defining specific events can be difficult, many people define a few events with a common set of parameters that generally output their information as a string. Much of the structured aspect is lost, and it's more difficult to search and filter the results. In this approach, a few events that usually correspond to the logging levels are defined. The following snippet defines a debug and error message:

```csharp
    [EventSource(Name = "MyCompany-VotingState-VotingStateService")]
    internal sealed class ServiceEventSource : EventSource
    {
        public static readonly ServiceEventSource Current = new ServiceEventSource();

        // The Instance constructor is private, to enforce singleton semantics.
        private ServiceEventSource() : base() { }

        ...

        private const int DebugEventId = 10;
        [Event(DebugEventId, Level = EventLevel.Verbose, Message = "{0}")]
        public void Debug(string msg)
        {
            WriteEvent(DebugEventId, msg);
        }

        private const int ErrorEventId = 11;
        [Event(ErrorEventId, Level = EventLevel.Error, Message = "Error: {0} - {1}")]
        public void Error(string error, string msg)
        {
            WriteEvent(ErrorEventId, error, msg);
        }
```

Using a hybrid of structured and generic instrumentation also can work well. Structured instrumentation is used for reporting errors and metrics. Generic events can be used for the detailed logging that is consumed by engineers for troubleshooting.

## ASP.NET Core logging

It's important to carefully plan how you will instrument your code. The right instrumentation plan can help you avoid potentially destabilizing your code base, and then needing to reinstrument the code. To reduce risk, you can choose an instrumentation library like [Microsoft.Extensions.Logging](https://www.nuget.org/packages/Microsoft.Extensions.Logging/), which is part of Microsoft ASP.NET Core. ASP.NET Core has an [ILogger](https://docs.microsoft.com/aspnet/core/api/microsoft.extensions.logging.ilogger) interface that you can use with the provider of your choice, while minimizing the effect on existing code. You can use the code in ASP.NET Core on Windows and Linux, and in the full .NET Framework, so your instrumentation code is standardized. This is further explored below:

### Using Microsoft.Extensions.Logging in Service Fabric

1. Add the Microsoft.Extensions.Logging NuGet package to the project you want to instrument. Also, add any provider packages (for a third-party package, see the following example). For more information, see [Logging in ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/logging).
2. Add a **using** directive for Microsoft.Extensions.Logging to your service file.
3. Define a private variable within your service class.

  ```csharp
  private ILogger _logger = null;

  ```
4. In the constructor of your service class, add this code:

  ```csharp
  _logger = new LoggerFactory().CreateLogger<Stateless>();

  ```
5. Start instrumenting your code in your methods. Here are a few samples:

  ```csharp
  _logger.LogDebug("Debug-level event from Microsoft.Logging");
  _logger.LogInformation("Informational-level event from Microsoft.Logging");

  // In this variant, we're adding structured properties RequestName and Duration, which have values MyRequest and the duration of the request.
  // Later in the article, we discuss why this step is useful.
  _logger.LogInformation("{RequestName} {Duration}", "MyRequest", requestDuration);

  ```

## Using other logging providers

Some third-party providers use the approach described in the preceding section, including [Serilog](https://serilog.net/), [NLog](http://nlog-project.org/), and [Loggr](https://github.com/imobile3/Loggr.Extensions.Logging). You can plug each of these into ASP.NET Core logging, or you can use them separately. Serilog has a feature that enriches all messages sent from a logger. This feature can be useful to output the service name, type, and partition information. To use this capability in the ASP.NET Core infrastructure, do these steps:

1. Add the Serilog, Serilog.Extensions.Logging, and Serilog.Sinks.Observable NuGet packages to the project. For the next example, also add Serilog.Sinks.Literate. A better approach is shown later in this article.
2. In Serilog, create a LoggerConfiguration and the logger instance.

  ```csharp
  Log.Logger = new LoggerConfiguration().WriteTo.LiterateConsole().CreateLogger();
  ```

3. Add a Serilog.ILogger argument to the service constructor, and pass the newly created logger.

  ```csharp
  ServiceRuntime.RegisterServiceAsync("StatelessType", context => new Stateless(context, Log.Logger)).GetAwaiter().GetResult();
  ```

4. In the service constructor, add the following code, which creates the property enrichers for the **ServiceTypeName**, **ServiceName**, **PartitionId**, and **InstanceId** properties of the service. It also adds a property enricher to the ASP.NET Core logging factory, so you can use Microsoft.Extensions.Logging.ILogger in your code.

  ```csharp
  public Stateless(StatelessServiceContext context, Serilog.ILogger serilog)
      : base(context)
  {
      PropertyEnricher[] properties = new PropertyEnricher[]
      {
          new PropertyEnricher("ServiceTypeName", context.ServiceTypeName),
          new PropertyEnricher("ServiceName", context.ServiceName),
          new PropertyEnricher("PartitionId", context.PartitionId),
          new PropertyEnricher("InstanceId", context.ReplicaOrInstanceId),
      };

      serilog.ForContext(properties);

      _logger = new LoggerFactory().AddSerilog(serilog.ForContext(properties)).CreateLogger<Stateless>();
  }
  ```

5. Instrument the code the same as if you were using ASP.NET Core without Serilog.

  >[!NOTE]
  >We recommend that you don't use the static Log.Logger with the preceding example. Service Fabric can host multiple instances of the same service type within a single process. If you use the static Log.Logger, the last writer of the property enrichers will show values for all instances that are running. This is one reason why the _logger variable is a private member variable of the service class. Also, you must make the _logger available to common code, which might be used across services.

## Choosing a logging provider

If your application relies on high performance, **EventSource** is usually a good approach. **EventSource** *generally* uses fewer resources and performs better than ASP.NET Core logging or any of the available third-party solutions.  This isn't an issue for many services, but if your service is performance-oriented, using **EventSource** might be a better choice. However, to get these benefits of structured logging, **EventSource** requires a larger investment from your engineering team. If possible, do a quick prototype of a few logging options, and then choose the one that best meets your needs.

## Next steps

Once you have chosen your logging provider to instrument your applications and services, your logs and events need to be aggregated before they can be sent to any analysis platform. Read about [EventFlow](service-fabric-diagnostics-event-aggregation-eventflow.md) and [WAD](service-fabric-diagnostics-event-aggregation-wad.md) to better understand some of the recommended options.
