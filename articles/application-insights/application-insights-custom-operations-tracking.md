---
title: Track custom operations with Azure Application Insights .NET SDK | Microsoft Docs
description: Tracking custom operations with Azure Application Insights .NET SDK
services: application-insights
documentationcenter: .net
author: mrbullwinkle
manager: carmonm

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: conceptual
ms.date: 06/30/2017
ms.reviewer: sergkanz 
ms.author: mbullwin

---

# Track custom operations with Application Insights .NET SDK

Azure Application Insights SDKs automatically track incoming HTTP requests and calls to dependent services, such as HTTP requests and SQL queries. Tracking and correlation of requests and dependencies give you visibility into the whole application's responsiveness and reliability across all microservices that combine this application. 

There is a class of application patterns that can't be supported generically. Proper monitoring of such patterns requires manual code instrumentation. This article covers a few patterns that might require manual instrumentation, such as custom queue processing and running long-running background tasks.

This document provides guidance on how to track custom operations with the Application Insights SDK. This documentation is relevant for:

- Application Insights for .NET (also known as Base SDK) version 2.4+.
- Application Insights for web applications (running ASP.NET) version 2.4+.
- Application Insights for ASP.NET Core version 2.1+.

## Overview
An operation is a logical piece of work run by an application. It has a name, start time, duration, result, and a context of execution like user name, properties, and result. If operation A was initiated by operation B, then operation B is set as a parent for A. An operation can have only one parent, but it can have many child operations. For more information on operations and telemetry correlation, see [Azure Application Insights telemetry correlation](application-insights-correlation.md).

In the Application Insights .NET SDK, the operation is described by the abstract class [OperationTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Microsoft.ApplicationInsights/Extensibility/Implementation/OperationTelemetry.cs) and its descendants [RequestTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Microsoft.ApplicationInsights/DataContracts/RequestTelemetry.cs) and [DependencyTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Microsoft.ApplicationInsights/DataContracts/DependencyTelemetry.cs).

## Incoming operations tracking 
The Application Insights web SDK automatically collects HTTP requests for ASP.NET applications that run in an IIS pipeline and all ASP.NET Core applications. There are community-supported solutions for other platforms and frameworks. However, if the application isn't supported by any of the standard or community-supported solutions, you can instrument it manually.

Another example that requires custom tracking is the worker that receives items from the queue. For some queues, the call to add a message to this queue is tracked as a dependency. However, the high-level operation that describes message processing is not automatically collected.

Let's see how such operations could be tracked.

On a high level, the task is to create `RequestTelemetry` and set known properties. After the operation is finished, you track the telemetry. The following example demonstrates this task.

### HTTP request in Owin self-hosted app
In this example, trace context is propagated according to the [HTTP Protocol for Correlation](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md). You should expect to receive headers that are described there.

```csharp
public class ApplicationInsightsMiddleware : OwinMiddleware
{
    private readonly TelemetryClient telemetryClient = new TelemetryClient(TelemetryConfiguration.Active);
    
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

The HTTP Protocol for Correlation also declares the `Correlation-Context` header. However, it's omitted here for simplicity.

## Queue instrumentation
While there is [HTTP Protocol for Correlation](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md) to pass correlation details with HTTP request, every queue protocol has to define how the same details are passed along the queue message. Some queue protocols (such as AMQP) allow passing additional metadata and some others (such Azure Storage Queue) require the context to be encoded into the message payload.

### Service Bus Queue
Application Insights tracks Service Bus Messaging calls with the new [Microsoft Azure ServiceBus Client for .NET](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus/) version 3.0.0 and higher.
If you use [message handler pattern](/dotnet/api/microsoft.azure.servicebus.queueclient.registermessagehandler) to process messages, you are done: all Service Bus calls done by your service are automatically tracked and correlated with other telemetry items. 
Refer to the [Service Bus client tracing with Microsoft Application Insights](../service-bus-messaging/service-bus-end-to-end-tracing.md) if you manually process messages.

If you use [WindowsAzure.ServiceBus](https://www.nuget.org/packages/WindowsAzure.ServiceBus/) package, read further - following examples demonstrate how to track (and correlate) calls to the Service Bus as Service Bus queue uses AMQP protocol and Application Insights doesn't automatically track queue operations.
Correlation identifiers are passed in the message properties.

#### Enqueue

```csharp
public async Task Enqueue(string payload)
{
    // StartOperation is a helper method that initializes the telemetry item
    // and allows correlation of this operation with its parent and children.
    var operation = telemetryClient.StartOperation<DependencyTelemetry>("enqueue " + queueName);
    operation.Telemetry.Type = "Queue";
    operation.Telemetry.Data = "Enqueue " + queueName;

    var message = new BrokeredMessage(payload);
    // Service Bus queue allows the property bag to pass along with the message.
    // We will use them to pass our correlation identifiers (and other context)
    // to the consumer.
    message.Properties.Add("ParentId", operation.Telemetry.Id);
    message.Properties.Add("RootId", operation.Telemetry.Context.Operation.Id);

    try
    {
        await queue.SendAsync(message);
        
        // Set operation.Telemetry Success and ResponseCode here.
        operation.Telemetry.Success = true;
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
        // Set operation.Telemetry Success and ResponseCode here.
        operation.Telemetry.Success = false;
        throw;
    }
    finally
    {
        telemetryClient.StopOperation(operation);
    }
}
```

#### Process
```csharp
public async Task Process(BrokeredMessage message)
{
    // After the message is taken from the queue, create RequestTelemetry to track its processing.
    // It might also make sense to get the name from the message.
    RequestTelemetry requestTelemetry = new RequestTelemetry { Name = "Dequeue " + queueName };

    var rootId = message.Properties["RootId"].ToString();
    var parentId = message.Properties["ParentId"].ToString();
    // Get the operation ID from the Request-Id (if you follow the HTTP Protocol for Correlation).
    requestTelemetry.Context.Operation.Id = rootId;
    requestTelemetry.Context.Operation.ParentId = parentId;

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

### Azure Storage queue
The following example shows how to track the [Azure Storage queue](../storage/queues/storage-dotnet-how-to-use-queues.md) operations and correlate telemetry between the producer, the consumer, and Azure Storage. 

The Storage queue has an HTTP API. All calls to the queue are tracked by the Application Insights Dependency Collector for HTTP requests.
Make sure you have `Microsoft.ApplicationInsights.DependencyCollector.HttpDependenciesParsingTelemetryInitializer` in `applicationInsights.config`. If you don't have it, add it programmatically as described in [Filtering and Preprocessing in the Azure Application Insights SDK](app-insights-api-filtering-sampling.md).

If you configure Application Insights manually, make sure you create and initialize `Microsoft.ApplicationInsights.DependencyCollector.DependencyTrackingTelemetryModule` similarly to:
 
```csharp
DependencyTrackingTelemetryModule module = new DependencyTrackingTelemetryModule();

// You can prevent correlation header injection to some domains by adding it to the excluded list.
// Make sure you add a Storage endpoint. Otherwise, you might experience request signature validation issues on the Storage service side.
module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.windows.net");
module.Initialize(TelemetryConfiguration.Active);

// Do not forget to dispose of the module during application shutdown.
```

You also might want to correlate the Application Insights operation ID with the Storage request ID. For information on how to set and get a Storage request client and a server request ID, see [Monitor, diagnose, and troubleshoot Azure Storage](../storage/common/storage-monitoring-diagnosing-troubleshooting.md#end-to-end-tracing).

#### Enqueue
Because Storage queues support the HTTP API, all operations with the queue are automatically tracked by Application Insights. In many cases, this instrumentation should be enough. However, to correlate traces on the consumer side with producer traces, you must pass some correlation context similarly to how we do it in the HTTP Protocol for Correlation. 

This example shows how to track the `Enqueue` operation. You can:

 - **Correlate retries (if any)**: They all have one common parent that's the `Enqueue` operation. Otherwise, they're tracked as children of the incoming request. If there are multiple logical requests to the queue, it might be difficult to find which call resulted in retries.
 - **Correlate Storage logs (if and when needed)**: They're correlated with Application Insights telemetry.

The `Enqueue` operation is the child of a parent operation (for example, an incoming HTTP request). The HTTP dependency call is the child of the `Enqueue` operation and the grandchild of the incoming request:

```csharp
public async Task Enqueue(CloudQueue queue, string message)
{
    var operation = telemetryClient.StartOperation<DependencyTelemetry>("enqueue " + queue.Name);
    operation.Telemetry.Type = "Queue";
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
Similarly to `Enqueue`, an actual HTTP request to the Storage queue is automatically tracked by Application Insights. However, the `Enqueue` operation presumably happens in the parent context, such as an incoming request context. Application Insights SDKs automatically correlate such an operation (and its HTTP part) with the parent request and other telemetry reported in the same scope.

The `Dequeue` operation is tricky. The Application Insights SDK automatically tracks HTTP requests. However, it doesn't know the correlation context until the message is parsed. It's not possible to correlate the HTTP request to get the message with the rest of the telemetry.

In many cases, it might be useful to correlate the HTTP request to the queue with other traces as well. The following example demonstrates how to do it:

```csharp
public async Task<MessagePayload> Dequeue(CloudQueue queue)
{
    var telemetry = new DependencyTelemetry
    {
        Type = "Queue",
        Name = "Dequeue " + queue.Name
    };

    telemetry.Start();

    try
    {
        var message = await queue.GetMessageAsync();

        if (message != null)
        {
            var payload = JsonConvert.DeserializeObject<MessagePayload>(message.AsString);

            // If there is a message, we want to correlate the Dequeue operation with processing.
            // However, we will only know what correlation ID to use after we get it from the message,
            // so we will report telemetry after we know the IDs.
            telemetry.Context.Operation.Id = payload.RootId;
            telemetry.Context.Operation.ParentId = payload.ParentId;

            // Delete the message.
            return payload;
        }
    }
    catch (StorageException e)
    {
        telemetry.Properties.Add("AzureServiceRequestID", e.RequestInformation.ServiceRequestID);
        telemetry.Success = false;
        telemetry.ResultCode = e.RequestInformation.HttpStatusCode.ToString();
        telemetryClient.TrackException(e);
    }
    finally
    {
        // Update status code and success as appropriate.
        telemetry.Stop();
        telemetryClient.Track(telemetry);
    }

    return null;
}
```

#### Process

In the following example, an incoming message is tracked in a manner similarly to incoming HTTP request:

```csharp
public async Task Process(MessagePayload message)
{
    // After the message is dequeued from the queue, create RequestTelemetry to track its processing.
    RequestTelemetry requestTelemetry = new RequestTelemetry { Name = "Dequeue " + queueName };
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
- Use `Start/StopOperation`, or call `Track` telemetry manually.

### Batch processing
With some queues, you can dequeue multiple messages with one request. Processing such messages is presumably independent and belongs to the different logical operations. In this case, it's not possible to correlate the `Dequeue` operation to particular message processing.

Each message should be processed in its own asynchronous control flow. For more information, see the [Outgoing dependencies tracking](#outgoing-dependencies-tracking) section.

## Long-running background tasks
Some applications start long-running operations that might be caused by user requests. From the tracing/instrumentation perspective, it's not different from request or dependency instrumentation: 

```csharp
async Task BackgroundTask()
{
    var operation = telemetryClient.StartOperation<RequestTelemetry>(taskName);
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

In this example, `telemetryClient.StartOperation` creates `RequestTelemetry` and fills the correlation context. Let's say you have a parent operation that was created by incoming requests that scheduled the operation. As long as `BackgroundTask` starts in the same asynchronous control flow as an incoming request, it's correlated with that parent operation. `BackgroundTask` and all nested telemetry items are automatically correlated with the request that caused it, even after the request ends.

When the task starts from the background thread that doesn't have any operation (`Activity`) associated with it, `BackgroundTask` doesn't have any parent. However, it can have nested operations. All telemetry items reported from the task are correlated to the `RequestTelemetry` created in `BackgroundTask`.

## Outgoing dependencies tracking
You can track your own dependency kind or an operation that's not supported by Application Insights.

The `Enqueue` method in the Service Bus queue or the Storage queue can serve as examples for such custom tracking.

The general approach for custom dependency tracking is to:

- Call the `TelemetryClient.StartOperation` (extension) method that fills the `DependencyTelemetry` properties that are needed for correlation and some other properties (start  time stamp, duration).
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

Disposing operation causes operation to be stopped, so you may do it instead of calling `StopOperation`.

*Warning*: in some cases unhanded exception may [prevent](https://docs.microsoft.com/dotnet/csharp/language-reference/keywords/try-finally) `finally` to be called so operations may not be tracked.

### Parallel operations processing and tracking

`StopOperation` only stops the operation that was started. If the current running operation doesn't match the one you want to stop, `StopOperation` does nothing. This situation might happen if you start multiple operations in parallel in the same execution context:

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

Make sure you always call `StartOperation` and process operation in the same **async** method to isolate operations running in parallel. If operation is synchronous (or not async), wrap process and track with `Task.Run`:

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

## Next steps

- Learn the basics of [telemetry correlation](application-insights-correlation.md) in Application Insights.
- See the [data model](application-insights-data-model.md) for Application Insights types and data model.
- Report custom [events and metrics](app-insights-api-custom-events-metrics.md) to Application Insights.
- Check out standard [configuration](app-insights-configuration-with-applicationinsights-config.md#telemetry-initializers-aspnet) for context properties collection.
- Check the [System.Diagnostics.Activity User Guide](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) to see how we correlate telemetry.
