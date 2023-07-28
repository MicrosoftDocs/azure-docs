---
title: Generate log events from a .NET app
description: Learn about how to add logging to your .NET Service Fabric application hosted on an Azure cluster or a standalone-cluster.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-dotnet
services: service-fabric
ms.date: 07/14/2022
---

# Add logging to your Service Fabric application

Your application must provide enough information to forensically debug it when problems arise. Logging is one of the most important things you can add to your Service Fabric application. When a failure occurs, good logging can give you a way to investigate failures. By analyzing log patterns, you may find ways to improve the performance or design of your application. This document demonstrates a few different logging options.

## EventFlow

The [EventFlow library](https://github.com/Azure/diagnostics-eventflow) suite allows applications to define what diagnostics data to collect, and where they should be outputted to. Diagnostics data can be anything from performance counters to application traces. It runs in the same process as the application, so communication overhead is minimized. For more information about EventFlow and Service Fabric, see [Azure Service Fabric Event Aggregation with EventFlow](service-fabric-diagnostics-event-aggregation-eventflow.md).

### Using structured EventSource events

Defining message events by use case allows you to package data about the event, in the context of the event. You can more easily search and filter based on the names or values of the specified event properties. Structuring the instrumentation output makes it easier to read, but requires more thought and time to define an event for each use case. 

Some event definitions can be shared across the entire application. For example, a method start or stop event would be reused across many services within an application. A domain-specific service, like an order system, might have a **CreateOrder** event, which has its own unique event. This approach might generate many events, and potentially require coordination of identifiers across project teams. 

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

    ...

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

    ...

```

Using a hybrid of structured and generic instrumentation also can work well. Structured instrumentation is used for reporting errors and metrics. Generic events can be used for the detailed logging that is consumed by engineers for troubleshooting.

## Microsoft.Extensions.Logging

The ASP.NET Core logging ([Microsoft.Extensions.Logging NuGet package](https://www.nuget.org/packages/Microsoft.Extensions.Logging)) is a logging framework that provides a standard logging API for your application. Support for other logging backends can be plugged into ASP.NET Core logging. This gives you a wide variety of support for logging in your application is processed, without having to change much code.

1. Add the **Microsoft.Extensions.Logging** NuGet package to the project you want to instrument. Also, add any provider packages. For more information, see [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging).
2. Add a **using** directive for **Microsoft.Extensions.Logging** to your service file.
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

### Using other logging providers

Some third-party providers use the approach described in the preceding section, including [Serilog](https://serilog.net/), [NLog](https://nlog-project.org/), and [Loggr](https://github.com/imobile3/Loggr.Extensions.Logging). You can plug each of these into ASP.NET Core logging, or you can use them separately. Serilog has a feature that enriches all messages sent from a logger. This feature can be useful to output the service name, type, and partition information. To use this capability in the ASP.NET Core infrastructure, do these steps:

1. Add the **Serilog**, **Serilog.Extensions.Logging**, **Serilog.Sinks.Literate**, and **Serilog.Sinks.Observable** NuGet packages to the project. 
2. Create a `LoggerConfiguration` and the logger instance.

   ```csharp
   Log.Logger = new LoggerConfiguration().WriteTo.LiterateConsole().CreateLogger();
   ```

3. Add a `Serilog.ILogger` argument to the service constructor, and pass the newly created logger.

   ```csharp
   ServiceRuntime.RegisterServiceAsync("StatelessType", context => new Stateless(context, Log.Logger)).GetAwaiter().GetResult();
   ```

4. In the service constructor, creates property enrichers for **ServiceTypeName**, **ServiceName**, **PartitionId**, and **InstanceId**.

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
   >We recommend that you *don't* use the static `Log.Logger` with the preceding example. Service Fabric can host multiple instances of the same service type within a single process. If you use the static `Log.Logger`, the last writer of the property enrichers will show values for all instances that are running. This is one reason why the _logger variable is a private member variable of the service class. Also, you must make the `_logger` available to common code, which might be used across services.

## Next steps

- Read more information about [application monitoring in Service Fabric](service-fabric-diagnostics-event-generation-app.md).
- Read about logging with [EventFlow](service-fabric-diagnostics-event-aggregation-eventflow.md) and [Windows Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md).
