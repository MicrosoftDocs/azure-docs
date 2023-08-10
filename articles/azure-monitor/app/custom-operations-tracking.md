---
title: Track custom operations with Application Insights .NET SDK 
description: Learn how to track custom operations with the Application Insights .NET SDK.
ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
ms.date: 11/26/2019
ms.reviewer: mmcc
---

# Track custom operations with Application Insights .NET SDK

Application Insights SDKs automatically track incoming HTTP requests and calls to dependent services, such as HTTP requests and SQL queries. Tracking and correlation of requests and dependencies give you visibility into the whole application's responsiveness and reliability across all microservices that combine this application.

There's a class of application patterns that can't be supported generically. Proper monitoring of such patterns requires manual code instrumentation. This article covers a few patterns that might require manual instrumentation, such as custom queue processing and running long-running background tasks.

This article provides guidance on how to track custom operations with the Application Insights SDK. This documentation is relevant for:

- Application Insights for .NET (also known as Base SDK) version 2.4+.
- Application Insights for web applications (running ASP.NET) version 2.4+.
- Application Insights for ASP.NET Core version 2.1+.

## Overview

An operation is a logical piece of work run by an application. It has a name, start time, duration, result, and a context of execution like user name, properties, and result. If operation A was initiated by operation B, then operation B is set as a parent for A. An operation can have only one parent, but it can have many child operations. For more information on operations and telemetry correlation, see [Application Insights telemetry correlation](distributed-tracing-telemetry-correlation.md).

In the Application Insights .NET SDK, the operation is described by the abstract class [OperationTelemetry](https://github.com/microsoft/ApplicationInsights-dotnet/blob/7633ae849edc826a8547745b6bf9f3174715d4bd/BASE/src/Microsoft.ApplicationInsights/Extensibility/Implementation/OperationTelemetry.cs) and its descendants [RequestTelemetry](https://github.com/microsoft/ApplicationInsights-dotnet/blob/7633ae849edc826a8547745b6bf9f3174715d4bd/BASE/src/Microsoft.ApplicationInsights/DataContracts/RequestTelemetry.cs) and [DependencyTelemetry](https://github.com/microsoft/ApplicationInsights-dotnet/blob/7633ae849edc826a8547745b6bf9f3174715d4bd/BASE/src/Microsoft.ApplicationInsights/DataContracts/DependencyTelemetry.cs).

## Incoming operations tracking

The Application Insights web SDK automatically collects HTTP requests for ASP.NET applications that run in an IIS pipeline and all ASP.NET Core applications. There are community-supported solutions for other platforms and frameworks. If the application isn't supported by any of the standard or community-supported solutions, you can instrument it manually.

Another example that requires custom tracking is the worker that receives items from the queue. For some queues, the call to add a message to this queue is tracked as a dependency. The high-level operation that describes message processing isn't automatically collected.

Let's see how such operations could be tracked.

On a high level, the task is to create `RequestTelemetry` and set known properties. After the operation is finished, you track the telemetry. The following example demonstrates this task.

### HTTP request in Owin self-hosted app

In this example, trace context is propagated according to the [HTTP Protocol for Correlation](https://github.com/dotnet/runtime/blob/master/src/libraries/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md). You should expect to receive headers that are described there.

```csharp
public class ApplicationInsightsMiddleware : OwinMiddleware
{
    // You may create a new TelemetryConfiguration instance, reuse one you already have,
    // or fetch the instance created by Application Insights SDK.
    private readonly TelemetryConfiguration telemetryConfiguration = TelemetryConfiguration.CreateDefault();
    private readonly TelemetryClient telemetryClient = new TelemetryClient(telemetryConfiguration);
    
    public ApplicationInsightsMiddleware(OwinMiddleware next) : base(next) {}

    public override async Task Invoke(IOwinContext context)
    {
        // Let's create and start RequestTelemetry.
        var requestTelemetry = new RequestTelemetry
        {
            Name = $"{context.Request.Method} {context.Request.Uri.GetLeftPart(UriPartial.Path)}"
        };

        // If there is a Request-Id received from the upstream service, set the telemetry context accordingly.
        if (context.Request.Headers.ContainsKey("Request-Id"))
        {
            var requestId = context.Request.Headers.Get("Request-Id");
            // Get the operation ID from the Request-Id (if you follow the HTTP Protocol for Correlation).
            requestTelemetry.Context.Operation.Id = GetOperationId(requestId);
            requestTelemetry.Context.Operation.ParentId = requestId;
        }

        // StartOperation is a helper method that allows correlation of 
        // current operations with nested operations/telemetry
        // and initializes start time and duration on telemetry items.
        var operation = telemetryClient.StartOperation(requestTelemetry);

        // Process the request.
        try
        {
            await Next.Invoke(context);
        }
        catch (Exception e)
        {
            requestTelemetry.Success = false;
            telemetryClient.TrackException(e);
            throw;
        }
        finally
        {
            // Update status code and success as appropriate.
            if (context.Response != null)
            {
                requestTelemetry.ResponseCode = context.Response.StatusCode.ToString();
                requestTelemetry.Success = context.Response.StatusCode >= 200 && context.Response.StatusCode <= 299;
            }
            else
            {
                requestTelemetry.Success = false;
            }

            // Now it's time to stop the operation (and track telemetry).
            telemetryClient.StopOperation(operation);
        }
    }
    
    public static string GetOperationId(string id)
    {
        // Returns the root ID from the '|' to the first '.' if any.
        int rootEnd = id.IndexOf('.');
        if (rootEnd < 0)
            rootEnd = id.Length;

        int rootStart = id[0] == '|' ? 1 : 0;
        return id.Substring(rootStart, rootEnd - rootStart);
    }
}
```

The HTTP Protocol for Correlation also declares the `Correlation-Context` header. It's omitted here for simplicity.

## Queue instrumentation

The [W3C Trace Context](https://www.w3.org/TR/trace-context/) and [HTTP Protocol for Correlation](https://github.com/dotnet/runtime/blob/master/src/libraries/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md) pass correlation details with HTTP requests, but every queue protocol has to define how the same details are passed along the queue message. Some queue protocols, such as AMQP, allow passing more metadata. Other protocols, such as Azure Storage Queue, require the context to be encoded into the message payload.

> [!NOTE]
> Cross-component tracing isn't supported for queues yet.
>
> With HTTP, if your producer and consumer send telemetry to different Application Insights resources, transaction diagnostics experience and Application Map show transactions and map end-to-end. In the case of queues, this capability isn't supported yet.

### Service Bus queue

For tracing information, see [Distributed tracing and correlation through Azure Service Bus messaging](../../service-bus-messaging/service-bus-end-to-end-tracing.md#distributed-tracing-and-correlation-through-service-bus-messaging).

> [!IMPORTANT]
> The WindowsAzure.ServiceBus and Microsoft.Azure.ServiceBus packages are deprecated.

### Azure Storage queue

The following example shows how to track the [Azure Storage queue](/azure/storage/queues/storage-quickstart-queues-dotnet?tabs=passwordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli) operations and correlate telemetry between the producer, the consumer, and Azure Storage.

The Storage queue has an HTTP API. All calls to the queue are tracked by the Application Insights Dependency Collector for HTTP requests. It's configured by default on ASP.NET and ASP.NET Core applications. With other kinds of applications, see the [Console applications documentation](./console.md).

You also might want to correlate the Application Insights operation ID with the Storage request ID. For information on how to set and get a Storage request client and a server request ID, see [Monitor, diagnose, and troubleshoot Azure Storage](../../storage/common/storage-monitoring-diagnosing-troubleshooting.md#end-to-end-tracing).

#### Enqueue

Because Storage queues support the HTTP API, all operations with the queue are automatically tracked by Application Insights. In many cases, this instrumentation should be enough. To correlate traces on the consumer side with producer traces, you must pass some correlation context similarly to how we do it in the HTTP Protocol for Correlation.

This example shows how to track the `Enqueue` operation. You can:

 - **Correlate retries (if any)**: They all have one common parent that's the `Enqueue` operation. Otherwise, they're tracked as children of the incoming request. If there are multiple logical requests to the queue, it might be difficult to find which call resulted in retries.
 - **Correlate Storage logs (if and when needed)**: They're correlated with Application Insights telemetry.

The `Enqueue` operation is the child of a parent operation. An example is an incoming HTTP request. The HTTP dependency call is the child of the `Enqueue` operation and the grandchild of the incoming request.

```csharp
public async Task Enqueue(CloudQueue queue, string message)
{
    var operation = telemetryClient.StartOperation<DependencyTelemetry>("enqueue " + queue.Name);
    operation.Telemetry.Type = "Azure queue";
    operation.Telemetry.Data = "Enqueue " + queue.Name;

    // MessagePayload represents your custom message and also serializes correlation identifiers into payload.
    // For example, if you choose to pass payload serialized to JSON, it might look like
    // {'RootId' : 'some-id', 'ParentId' : '|some-id.1.2.3.', 'message' : 'your message to process'}
    var jsonPayload = JsonConvert.SerializeObject(new MessagePayload
    {
        RootId = operation.Telemetry.Context.Operation.Id,
        ParentId = operation.Telemetry.Id,
        Payload = message
    });
    
    CloudQueueMessage queueMessage = new CloudQueueMessage(jsonPayload);

    // Add operation.Telemetry.Id to the OperationContext to correlate Storage logs and Application Insights telemetry.
    OperationContext context = new OperationContext { ClientRequestID = operation.Telemetry.Id};

    try
    {
        await queue.AddMessageAsync(queueMessage, null, null, new QueueRequestOptions(), context);
    }
    catch (StorageException e)
    {
        operation.Telemetry.Properties.Add("AzureServiceRequestID", e.RequestInformation.ServiceRequestID);
        operation.Telemetry.Success = false;
        operation.Telemetry.ResultCode = e.RequestInformation.HttpStatusCode.ToString();
        telemetryClient.TrackException(e);
    }
    finally
    {
        // Update status code and success as appropriate.
        telemetryClient.StopOperation(operation);
    }
}  
```

To reduce the amount of telemetry your application reports or if you don't want to track the `Enqueue` operation for other reasons, use the `Activity` API directly:

- Create (and start) a new `Activity` instead of starting the Application Insights operation. You do *not* need to assign any properties on it except the operation name.
- Serialize `yourActivity.Id` into the message payload instead of `operation.Telemetry.Id`. You can also use `Activity.Current.Id`.

#### Dequeue

Similarly to `Enqueue`, an actual HTTP request to the Storage queue is automatically tracked by Application Insights. The `Enqueue` operation presumably happens in the parent context, such as an incoming request context. Application Insights SDKs automatically correlate such an operation, and its HTTP part, with the parent request and other telemetry reported in the same scope.

The `Dequeue` operation is tricky. The Application Insights SDK automatically tracks HTTP requests. But it doesn't know the correlation context until the message is parsed. It's not possible to correlate the HTTP request to get the message with the rest of the telemetry, especially when more than one message is received.

```csharp
public async Task<MessagePayload> Dequeue(CloudQueue queue)
{
    var operation = telemetryClient.StartOperation<DependencyTelemetry>("dequeue " + queue.Name);
    operation.Telemetry.Type = "Azure queue";
    operation.Telemetry.Data = "Dequeue " + queue.Name;
    
    try
    {
        var message = await queue.GetMessageAsync();
    }
    catch (StorageException e)
    {
        operation.telemetry.Properties.Add("AzureServiceRequestID", e.RequestInformation.ServiceRequestID);
        operation.telemetry.Success = false;
        operation.telemetry.ResultCode = e.RequestInformation.HttpStatusCode.ToString();
        telemetryClient.TrackException(e);
    }
    finally
    {
        // Update status code and success as appropriate.
        telemetryClient.StopOperation(operation);
    }

    return null;
}
```

#### Process

In the following example, an incoming message is tracked in a manner similar to an incoming HTTP request:

```csharp
public async Task Process(MessagePayload message)
{
    // After the message is dequeued from the queue, create RequestTelemetry to track its processing.
    RequestTelemetry requestTelemetry = new RequestTelemetry { Name = "process " + queueName };
    
    // It might also make sense to get the name from the message.
    requestTelemetry.Context.Operation.Id = message.RootId;
    requestTelemetry.Context.Operation.ParentId = message.ParentId;

    var operation = telemetryClient.StartOperation(requestTelemetry);

    try
    {
        await ProcessMessage();
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
        throw;
    }
    finally
    {
        // Update status code and success as appropriate.
        telemetryClient.StopOperation(operation);
    }
}
```

Similarly, other queue operations can be instrumented. A peek operation should be instrumented in a similar way as a dequeue operation. Instrumenting queue management operations isn't necessary. Application Insights tracks operations such as HTTP, and in most cases, it's enough.

When you instrument message deletion, make sure you set the operation (correlation) identifiers. Alternatively, you can use the `Activity` API. Then you don't need to set operation identifiers on the telemetry items because Application Insights SDK does it for you:

- Create a new `Activity` after you've got an item from the queue.
- Use `Activity.SetParentId(message.ParentId)` to correlate consumer and producer logs.
- Start the `Activity`.
- Track dequeue, process, and delete operations by using `Start/StopOperation` helpers. Do it from the same asynchronous control flow (execution context). In this way, they're correlated properly.
- Stop the `Activity`.
- Use `Start/StopOperation` or call `Track` telemetry manually.

### Dependency types

Application Insights uses dependency type to customize UI experiences. For queues, it recognizes the following types of `DependencyTelemetry` that improve [Transaction diagnostics experience](./transaction-diagnostics.md):

- `Azure queue` for Azure Storage queues
- `Azure Event Hubs` for Azure Event Hubs
- `Azure Service Bus` for Azure Service Bus

### Batch processing

With some queues, you can dequeue multiple messages with one request. Processing such messages is presumably independent and belongs to the different logical operations. It's not possible to correlate the `Dequeue` operation to a particular message being processed.

Each message should be processed in its own asynchronous control flow. For more information, see the [Outgoing dependencies tracking](#outgoing-dependencies-tracking) section.

## Long-running background tasks

Some applications start long-running operations that might be caused by user requests. From the tracing/instrumentation perspective, it's not different from request or dependency instrumentation:

```csharp
async Task BackgroundTask()
{
    var operation = telemetryClient.StartOperation<DependencyTelemetry>(taskName);
    operation.Telemetry.Type = "Background";
    try
    {
        int progress = 0;
        while (progress < 100)
        {
            // Process the task.
            telemetryClient.TrackTrace($"done {progress++}%");
        }
        // Update status code and success as appropriate.
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
        // Update status code and success as appropriate.
        throw;
    }
    finally
    {
        telemetryClient.StopOperation(operation);
    }
}
```

In this example, `telemetryClient.StartOperation` creates `DependencyTelemetry` and fills the correlation context. Let's say you have a parent operation that was created by incoming requests that scheduled the operation. As long as `BackgroundTask` starts in the same asynchronous control flow as an incoming request, it's correlated with that parent operation. `BackgroundTask` and all nested telemetry items are automatically correlated with the request that caused it, even after the request ends.

When the task starts from the background thread that doesn't have any operation (`Activity`) associated with it, `BackgroundTask` doesn't have any parent. However, it can have nested operations. All telemetry items reported from the task are correlated to the `DependencyTelemetry` created in `BackgroundTask`.

## Outgoing dependencies tracking

You can track your own dependency kind or an operation that's not supported by Application Insights.

The `Enqueue` method in the Service Bus queue or the Storage queue can serve as examples for such custom tracking.

The general approach for custom dependency tracking is to:

- Call the `TelemetryClient.StartOperation` (extension) method that fills the `DependencyTelemetry` properties that are needed for correlation and some other properties, like start, time stamp, and duration.
- Set other custom properties on the `DependencyTelemetry`, such as the name and any other context you need.
- Make a dependency call and wait for it.
- Stop the operation with `StopOperation` when it's finished.
- Handle exceptions.

```csharp
public async Task RunMyTaskAsync()
{
    using (var operation = telemetryClient.StartOperation<DependencyTelemetry>("task 1"))
    {
        try 
        {
            var myTask = await StartMyTaskAsync();
            // Update status code and success as appropriate.
        }
        catch(...) 
        {
            // Update status code and success as appropriate.
        }
    }
}
```

Disposing an operation causes the operation to stop, so you might do it instead of calling `StopOperation`.

> [!WARNING]
> In some cases, an unhanded exception might [prevent](/dotnet/csharp/language-reference/keywords/try-finally) `finally` from being called, so operations might not be tracked.

### Parallel operations processing and tracking

Calling `StopOperation` only stops the operation that was started. If the current running operation doesn't match the one you want to stop, `StopOperation` does nothing. This situation might happen if you start multiple operations in parallel in the same execution context.

```csharp
var firstOperation = telemetryClient.StartOperation<DependencyTelemetry>("task 1");
var firstTask = RunMyTaskAsync();

var secondOperation = telemetryClient.StartOperation<DependencyTelemetry>("task 2");
var secondTask = RunMyTaskAsync();

await firstTask;

// FAILURE!!! This will do nothing and will not report telemetry for the first operation
// as currently secondOperation is active.
telemetryClient.StopOperation(firstOperation); 

await secondTask;
```

Make sure you always call `StartOperation` and process the operation in the same **async** method to isolate operations running in parallel. If the operation is synchronous (or not async), wrap the process and track with `Task.Run`.

```csharp
public void RunMyTask(string name)
{
    using (var operation = telemetryClient.StartOperation<DependencyTelemetry>(name))
    {
        Process();
        // Update status code and success as appropriate.
    }
}

public async Task RunAllTasks()
{
    var task1 = Task.Run(() => RunMyTask("task 1"));
    var task2 = Task.Run(() => RunMyTask("task 2"));
    
    await Task.WhenAll(task1, task2);
}
```

## ApplicationInsights operations vs. System.Diagnostics.Activity

`System.Diagnostics.Activity` represents the distributed tracing context and is used by frameworks and libraries to create and propagate context inside and outside of the process and correlate telemetry items. `Activity` works together with `System.Diagnostics.DiagnosticSource` as the notification mechanism between the framework/library to notify about interesting events like incoming or outgoing requests and exceptions.

Activities are first-class citizens in Application Insights. Automatic dependency and request collection rely heavily on them along with `DiagnosticSource` events. If you created `Activity` in your application, it wouldn't result in Application Insights telemetry being created. Application Insights needs to receive `DiagnosticSource` events and know the events names and payloads to translate `Activity` into telemetry.

Each Application Insights operation (request or dependency) involves `Activity`. When `StartOperation` is called, it creates `Activity` underneath. `StartOperation` is the recommended way to track request or dependency telemetries manually and ensure everything is correlated.

## Next steps

- Learn the basics of [telemetry correlation](distributed-tracing-telemetry-correlation.md) in Application Insights.
- Check out how correlated data powers [transaction diagnostics experience](./transaction-diagnostics.md) and [Application Map](./app-map.md).
- See the [data model](./data-model-complete.md) for Application Insights types and data model.
- Report custom [events and metrics](./api-custom-events-metrics.md) to Application Insights.
- Check out standard [configuration](configuration-with-applicationinsights-config.md#telemetry-initializers-aspnet) for context properties collection.
- Check the [System.Diagnostics.Activity User Guide](https://github.com/dotnet/runtime/blob/master/src/libraries/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) to see how we correlate telemetry.
