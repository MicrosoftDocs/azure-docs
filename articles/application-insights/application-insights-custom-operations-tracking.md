---
title: Tracking custom operations with Application Insights .NET SDK | Microsoft Docs
description: Tracking custom operations with Application Insights .NET SDK
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: carmonm

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 06/31/2017
ms.author: sergkanz

---
# Tracking custom operations with Application Insights .NET SDK

ApplicationInsights SDKs automatically track 'requests' (incoming HTTP requests) and 'dependencies' (outgoing HTTP requests, and in some cases SQL queries). We are going to gradually expand the list and give an automatic collection of other well-known operations: for example, request collection in Owin self-hosted apps.

Typical operations that we do not support yet include processing a work item from a queue or running background long-running task.

This document provides guidance on how to track custom operations with ApplicationInsights SDK.

It document is relevant for:
- ApplicationInsights for .NET (aka Base SDK) version 2.4
- ApplicationInsights for Web Applications (running ASP.NET) version 2.4
- ApplicationInsights for AspNetCore version 2.1

More improvements and features are coming in the future versions!

## Overview
By the operation, we understand some logical piece of work that has duration, some context, result (in most of the cases), and may have nested operations. It's described by abstract class [OperationTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/Extensibility/Implementation/OperationTelemetry.cs) and it's descendants [RequestTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/DataContracts/RequestTelemetry.cs) and [DependencyTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/DataContracts/DependencyTelemetry.cs).

## Incoming operations tracking 
ApplicationInsights automatically collects HTTP requests for ASP.NET applications that run in IIS pipeline and all ASP.NET Core applications. Applications that do not use ASP.NET or does not run in IIS pipeline require should be instrumented manually at this point.

Another example that requires custom tracking is a worker that receives items from the queue. While the request to the queue itself might be done over HTTP and tracked as a dependency, it does not allow you to have a high-level operation that describes message processing.

Let's see how we can track such operations.

On the high level, the task is to create `RequestTelemetry`. Fill it's with important details at the beginning of the operation and once the operation is completed, track the telemetry. The following example demonstrates it.

### HTTP request in Owin self-hosted app
We follow the [Http Protocol for Correlation](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md) so you should expect to receive headers described in the protocol with incoming HTTP requests from other instrumented services.

``` C#
public class ApplicationInsightsMiddleware : OwinMiddleware
{
    private readonly TelemetryClient telemetryClient = new TelemetryClient(TelemetryConfiguration.Active);
    
    public ApplicationInsightsMiddleware(OwinMiddleware next) : base(next) {}

    public override async Task Invoke(IOwinContext context)
    {
        // Let's create and start RequestTelemetry
        var requestTelemetry = new RequestTelemetry
        {
            Name = $"{context.Request.Method} {context.Request.Uri.GetLeftPart(UriPartial.Path)}"
        };

        // if there is Request-Id recevied from the upstream service, set telemetry context accordingly
        if (context.Request.Headers.ContainsKey("Request-Id"))
        {
            var requestId = context.Request.Headers.Get("Request-Id");
            // get the operation id from the Request-Id (if you follow the 'Http Protocol for Correlation')
            requestTelemetry.Context.Operation.Id = GetOperationId(requestId);
            requestTelemetry.Context.Operation.ParentId = requestId;
        }

        // StartOperation is a helper method that allows to correlate 
        // current operations with nested operations/telemetry
        // and initializes start time and duration on telemetry item
        var operation = telemetryClient.StartOperation(requestTelemetry);

        // process request
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
            // update status code and success as appropriate
            if (context.Response != null)
            {
                requestTelemetry.ResponseCode = context.Response.StatusCode.ToString();
                requestTelemetry.Success = context.Response.StatusCode >= 200 && context.Response.StatusCode <= 299;
            }
            else
            {
                requestTelemetry.Success = false;
            }

            // now it's time to stop operation (and track telemetry)
            telemetryClient.StopOperation(operation);
        }
    }
    
    public static string GetOperationId(string id)
    {
        // returns root Id from the '|' to first '.' if any
        int rootEnd = id.IndexOf('.');
        if (rootEnd < 0)
            rootEnd = id.Length;

        int rootStart = id[0] == '|' ? 1 : 0;
        return id.Substring(rootStart, rootEnd - rootStart);
    }
}
```

HTTP Correlation protocol also declares `Correlation-Context` header, however it's omitted for simplicity.

## Queue instrumentation
For the HTTP communication, we have created a protocol to pass correlation details. However there are many queue protocols and APIs, some queues allow you to pass additional metadata, properties, or headers along with the message and others do not.

### Service Bus Queue
[ServiceBus Queue](https://docs.microsoft.com/en-us/azure/service-bus-messaging/) allows you to pass property bag along with the message and we use it to pass correlation id.

ServiceBus Queue use TCP-based protocols and therefore ApplicationInsights does not automatically track the enqueue operations. Dequeue is push based API, so we are not able to track it.

#### Enqueue
```C#
public async Task Enqueue(string payload)
{
    // StartOperation is a helper method that initializes telemetry item
    // and allows to correlate this operation with its parent and children
    var operation = telemetryClient.StartOperation<DependencyTelemetry>("enqueue " + queueName);
    operation.Telemetry.Type = "Queue";
    operation.Telemetry.Data = "Enqueue " + queueName;

    var message = new BrokeredMessage(payload);
    // ServiceBus Queue allows to pass property bag along with the message
    // we will use them to pass our correlation identifiers (and other context)
    // to the consumer
    message.Properties.Add("ParentId", operation.Telemetry.Id);
    message.Properties.Add("RootId", operation.Telemetry.Context.Operation.Id);

    try
    {
        await queue.SendAsync(message);
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
        // set operation.Telemetry Success and ResponseCode here
        throw;
    }
    finally
    {
        // set operation.Telemetry Success and ResponseCode here
        telemetryClient.StopOperation(operation);
    }
}
```

#### Process
```C#
public async Task Process(BrokeredMessage message)
{
    // once the message is taken from the queue, create ReqeustTelemetry to track its processing
    // it may also make sense to get name from the message
    RequestTelemetry requestTelemetry = new RequestTelemetry { Name = "Dequeue " + queueName };

    var rootId = message.Properties["RootId"].ToString();
    var parentId = message.Properties["ParentId"].ToString();
    // get the operation id from the Request-Id (if you follow the 'Http Protocol for Correlation')
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
        // update status code and success as appropriate
        telemetryClient.StopOperation(operation);
    }
}
```

### Azure Storage Queue
The following example shows how to track [Azure Storage Queue](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-how-to-use-queues) operations, message processing and correlate telemetry between producer and consumer and Azure Storage logs. 

Azure Storage Queue has HTTP API and all calls to the queue itself are tracked by ApplicationInsights DependencyCollector for HTTP requests.
Make sure you have `Microsoft.ApplicationInsights.DependencyCollector.HttpDependenciesParsingTelemetryInitializer` in the `applicationInsights.config` or add it programmatically as described [here](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-api-filtering-sampling).

If you configure ApplicationInsights manually, make sure you create and initialize `Microsoft.ApplicationInsights.DependencyCollector.DependencyTrackingTelemetryModule` similarly to:
 
``` C#
DependencyTrackingTelemetryModule module = new DependencyTrackingTelemetryModule();

// you can prevent correlation header injection to some domains by adding it to the excluded list.
// Make sure you add Azure Storage endpoint, otherwise you may experience request signature validation issues on the Storage service side
module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.windows.net");
module.Initialize(TelemetryConfiguration.Active);

// do not forget to dispose module during application shutdown
```

You may also want to correlate ApplicationInsights operation Id with Azure Storage RequestId. Check [this article](https://docs.microsoft.com/en-us/azure/storage/storage-monitoring-diagnosing-troubleshooting#end-to-end-tracing) on how to set and get storage request client and server request Id.

#### Enqueue
Since Azure Storage Queues support HTTP API, all operations with the queue are automatically tracked by ApplicationInsights. In many cases, this instrumentation should be enough.
However, to correlate logs on the consumer and producer sides, you need to pass some correlation context similarly to how we do it in 'Http Protocol for Correlation'. 

In the example below, we will track optional `Enqueue` operation. It allows to
 - Correlate retries (if any) to one common parent `Enqueue` operation
 - Correlate Log Azure Storage logs (if and when) needed with ApplicationInsights telemetry)

Note that `Enqueue` operation is the child of a 'parent' operation (for example, incoming HTTP request), and 'Http' dependency call is the child of `Enqueue` operation and grandchild of the incoming request.

```C#
public async Task Enqueue(CloudQueue queue, string message)
{
    var operation = telemetryClient.StartOperation<DependencyTelemetry>("enqueue " + queue.Name);
    operation.Telemetry.Type = "Queue";
    operation.Telemetry.Data = "Enqueue " + queue.Name;

    // MessagePayload represents your custom message and also serializes correlation identifiers into payload
    // e.g. if you choose to pass payload serialized to json, it may look like
    // {'RootId' : 'some-id', 'ParentId' : '|some-id.1.2.3.', 'message' : 'your message to process'}
    var jsonPayload = JsonConvert.SerializeObject(new MessagePayload
    {
        RootId = operation.Telemetry.Context.Operation.Id,
        ParentId = operation.Telemetry.Id,
        Payload = message
    });
    
    CloudQueueMessage queueMessage = new CloudQueueMessage(jsonPayload);

    // Add operation.Telemetry.Id to the OperationContext to correlate Azure Storage logs and ApplciationInsights telemetry
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
        // update status code and success as appropriate
        telemetryClient.StopOperation(operation);
    }
}  
```

If you want to reduce an amount of telemetry your application reports or do not want to track `enqueue` operation for other reasons, you can use `Activity` API directly:

* create (and start) a new `Activity` instead of starting ApplicationInsights operation (you do NOT need to assign any properties on it except the operation name).
* serialize `yourActivity.Id` into the message payload instead of `operation.Telemetry.Id`. You may also use `Activity.Current.Id`


#### Dequeue
Similarly to `Enqueue`, actual HTTP request to Azure Storage Queue will be automatically tracked by ApplicationInsights. However `Enqueue` operation presumably happens in the parent context such as 'incoming' request context, in this case, this operation (and it's HTTP part) is automatically correlated to this request and other telemetry reported in the same scope.  
`Dequeue` operation is tricky: ApplicationInsights tracks HTTP request to the storage, however probably it does not happen in the 'parent' context and we will know the correlation context only after we will get the message from the queue and parse it.
After that, we'll be able to correlated message processing traces with the producer (frontend) traces.

In many cases, it could be useful to correlate the request to the queue with other traces as well and below (advanced) example demonstrates how to achieve it.
Note that we will not be able to correlate HTTP `DependencyTelemetry` with the rest of telemetry, however, we can correlate custom `Dequeue` telemetry.

``` C#
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

            // if there is a message, we want to correlate Dequeue operation with processing
            // However we will only know what correlation Id to use AFTER we will get it from the message
            // So we will report telemetry once we know the Ids.
            telemetry.Context.Operation.Id = payload.RootId;
            telemetry.Context.Operation.ParentId = payload.ParentId;

            // delete message
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
        // update status code and success as appropriate
        telemetry.Stop();
        telemetryClient.Track(telemetry);
    }

    return null;
}
```

#### Process

In the following example, we trace 'incoming' message similarly to how we trace incoming HTTP request.

```C#
public async Task Process(MessagePayload message)
{
    // once the message is dequeued from the queue, create ReqeustTelemetry to track it's processing
    RequestTelemetry requestTelemetry = new RequestTelemetry { Name = "Dequeue " + queueName };
    // it may also make sense to get name from the message
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
        // update status code and success as appropriate
        telemetryClient.StopOperation(operation);
    }
}
```

Similarly, other queue operations may be instrumented. Peek operation should be instrumented in a similar way as dequeue. Instrumenting queue creation and deletion may not be necessary as they are tracked by HTTP and in most of the cases it is enough.

When instrumenting delete message operation, make sure you set the operation (correlation) identifiers. Alternatively, you may use `Activity` API - then you don't need to set operations identifiers on the telemetry items, ApplicationInsights will do it for you:
- create a new `Activity` once you've got an item from the queue
- use `Activity.SetParentId(message.ParentId)` to correlate consumer and producer logs
- start the `Activity`
- track Dequeue, Process and Delete operations (preferably with `Start/StopOperation` helpers) from the same asynchronous control flow (execution context) and then stop the `Activity`
- use Start/StopOperation or call Track telemetry manually 

### Batch Processing
Some queues allow dequeuing multiple messages with one request, but processing such messages is presumably independent and belongs to the different logical operations.
In this case, it's not possible to correlate `Dequeue` operation to particular message processing.

Each message processing should happen in its own asychronous control flow. You may find more details on it in the [Outgoing Dependencies Tracking](#outgoing-dependencies-tracking) section.

## Long-running background tasks
Sometimes an application needs to start some long-running operation that may or may not be caused by user requests. From the tracing/instrumentation perspective, it's not different from the request or dependency instrumentation. 

``` C#
async Task BackgroundTask()
{
    var operation = telemetryClient.StartOperation<RequestTelemetry>(taskName);
    operation.Telemetry.Type = "Background";
    try
    {
        int progress = 0;
        while (progress < 100)
        {
            // process task
            telemetryClient.TrackTrace($"done {progress++}%");
        }
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
        throw;
    }
    finally
    {
        // update status code and success as appropriate
        telemetryClient.StopOperation(operation);
    }
}
```

In this example, we use `telemetryClient.StartOperation` to create `RequestTelemetry` and fill the correlation context. Let's say you have a parent operation, e.g. it was created by incoming requests that scheduled the operation. As long as `BackgroundTask` starts in the same asynchronous control flow as an incoming request, it is correlated with that parent operation. `BackgroundTask` and all nested telemetry items will automatically be correlated with the request that caused it even after request ends.

When the task is started from the background thread that does not have any operation (Activity) associated with it, `BackgroundTask` does not have any parent. However, it can have nested operations and all telemetry items reported from the task are correlated to the `RequestTelemetry` created in the `BackgroundTask`.

## Outgoing dependencies tracking
You may want to track your own 'dependency' kind or some operation that is not supported by ApplicationInsights.
`Enqueue` method in the ServiceBus Queue or Azure Storage Queue can serve as examples for such custom tracking.

It boils down to
- calling `TelemetryClient.StartOperation` (extension) method that fills `DependencyTelemetry` properties needed for correlation and some other properties (start timestamp, duration).
- setting other custom properties on the `DependencyTelemetry`: name and any other context you need
- processing dependency call
- stopping the operation with `StopOperation` when done
- handling exceptions

Note that `StopOperation` only stops the operation that was started, but if current running operation does not match the one you want to stop, StopOperation does nothing.
It could happen if you start multiple operations in parallel in the same execution context:

```C#
    var firstOperation = telemetryClient.StartOperation<DependencyTelemetry>("task 1");
    var firstTask = RunMyTaskAsync();
    
    var secondOperation = telemetryClient.StartOperation<DependencyTelemetry>("task 2");
    var secondTask = RunMyTaskAsync();
    
    await firstTask;
    
    // this will do nothing and will not report telemetry for the first operation
    // as currently secondOperation is active
    telemetryClient.StopOperation(firstOperation); 
    
    await secondTask;
```

So you need to make sure you always call `StartOperation` and run your task in its own context:
```C#
    public async Task RunMyTaskAsync()
    {
      var operation = telemetryClient.StartOperation<DependencyTelemetry>("task 1");
      try 
      {
        var myTask = await StartMyTaskAsync();
      }
      catch(...) {}
      finally 
      {
        // update status code and success as appropriate
        telemetryClient.StopOperation(operation);
      }

```

## Next steps

- Learn basics of [telemetry correlation](application-insights-correlation.md) in Application Insights.
- See [data model](application-insights-data-model.md) for Application Insights types and data model.
- Report custom [events and metrics](app-insights-api-custom-events-metrics.md) to Application Insights.
- Check out standard context properties collection [configuration](app-insights-configuration-with-applicationinsights-config.md#telemetry-initializers-aspnet).
- Check [System.Diagnostics.Activity User Guide](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) to see how we correlate telemetry
