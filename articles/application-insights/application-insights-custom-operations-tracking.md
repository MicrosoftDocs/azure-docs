---
title: Tracking custom operations with Azure Application Insights .NET SDK | Microsoft Docs
description: Tracking custom operations with Azure Application Insights .NET SDK
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

Application Insights SDKs automatically track incoming HTTP requests and calls to dependant services - HTTP requests, SQL queries, etc. Take application that is combined of multiple micro-services. Tracking and correlation of requests and dependencies gives you visibility into the whole application responsiveness and reliability across all micro-services. We are going to gradually expand the list and give an automatic collection of other well-known platforms and frameworks. 

There is a class of application patterns that cannot be supported generically. Proper monitoring of such patterns requires manual code instrumentation. This article covers a few patterns that may require manual instrumentation. Including a custom queue processing or running background long-running task.

This document provides guidance on how to track custom operations with ApplicationInsights SDK.

It document is relevant for:
- Application Insights for .NET (aka Base SDK) version `2.4+`
- Application Insights for Web Applications (running ASP.NET) version `2.4+`
- Application Insights for AspNetCore version `2.1+`

## Overview
By the operation, we understand some logical piece of work run by application. It has name, start time and duration, context of execution like user name, properties, and result. If operation `A` was initiated by operation `B` - operation `B` is set as a parent for `A`.  Operation can only have one parent and many children operations. You can read more about operations and telemetry correlation [here](application-insights-correlation.md).

In Application Insights .NET SDK operation is described by abstract class [OperationTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/Extensibility/Implementation/OperationTelemetry.cs) and its descendants [RequestTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/DataContracts/RequestTelemetry.cs) and [DependencyTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/DataContracts/DependencyTelemetry.cs).

## Incoming operations tracking 
Application Insights web SDK automatically collects HTTP requests for ASP.NET applications that run in IIS pipeline and all ASP.NET Core applications. There are community-supported solutions for other platforms and frameworks. However, if application is not supported by any of standard or community supported solutions, you can instrument it manually.

Another example that requires custom tracking is worker that receives items from the queue. For some queues, the call to add a message to this queue tracked as a dependency. However high-level operation that describes message processing is not automatically collected.

Let's see how we can track such operations.

On the high level, the task is to create `RequestTelemetry` and set known properties; once the operation is completed, track the telemetry. The following example demonstrates it.

### HTTP request in Owin self-hosted app
We follow the [Http Protocol for Correlation](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md) and you should expect to receive headers that described there.

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
For the HTTP communication, we have created a protocol to pass correlation details. Some queues protocols allow you to pass additional metadata along with the message and others do not.

### Service Bus Queue
[ServiceBus Queue](../service-bus-messaging/index.md) allows you to pass property bag along with the message and we use it to pass correlation id.

ServiceBus Queue uses TCP-based protocols. Application Insights does not automatically track queue operations, so we track them manually. Dequeue operation is a push-style API and we are not able to track it at all.

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
        
        // set operation.Telemetry Success and ResponseCode here
        operation.Telemetry.Success = true;
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
        // set operation.Telemetry Success and ResponseCode here
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
The following example shows how to track [Azure Storage Queue](../storage/storage-dotnet-how-to-use-queues.md) operations and correlate telemetry between producer, consumer, and Azure Storage. 

Azure Storage Queue has HTTP API and all calls to the queue are tracked by ApplicationInsights DependencyCollector for HTTP requests.
Make sure you have `Microsoft.ApplicationInsights.DependencyCollector.HttpDependenciesParsingTelemetryInitializer` in the `applicationInsights.config` or add it programmatically as described [here](app-insights-api-filtering-sampling.md).

If you configure ApplicationInsights manually, make sure you create and initialize `Microsoft.ApplicationInsights.DependencyCollector.DependencyTrackingTelemetryModule` similarly to:
 
``` C#
DependencyTrackingTelemetryModule module = new DependencyTrackingTelemetryModule();

// you can prevent correlation header injection to some domains by adding it to the excluded list.
// Make sure you add Azure Storage endpoint, otherwise you may experience request signature validation issues on the Storage service side
module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.windows.net");
module.Initialize(TelemetryConfiguration.Active);

// do not forget to dispose module during application shutdown
```

You may also want to correlate ApplicationInsights operation Id with Azure Storage RequestId. Check [this article](../storage/storage-monitoring-diagnosing-troubleshooting.md#end-to-end-tracing) on how to set and get storage request client and server request Id.

#### Enqueue
Since Azure Storage Queues support HTTP API, all operations with the queue are automatically tracked by ApplicationInsights. In many cases, this instrumentation should be enough.
However, to correlate traces on the consumer side with producer traces, you need to pass some correlation context similarly to how we do it in 'Http Protocol for Correlation'. 

In the example below, we track optional `Enqueue` operation. It allows to
 - Correlate retries (if any): all of them have one common parent that is `Enqueue` operation. Otherwise, they are tracked as children of the incoming request. So if there are multiple logical requests to the queue, it could be difficult to find which call resulted in retries.
 - Correlate Log Azure Storage logs (if and when needed) with ApplicationInsights telemetry.

`Enqueue` operation is the child of a 'parent' operation (for example, incoming HTTP request), and 'Http' dependency call is the child of `Enqueue` operation and grandchild of the incoming request.

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

- Create (and start) a new `Activity` instead of starting ApplicationInsights operation (you do NOT need to assign any properties on it except the operation name).
- Serialize `yourActivity.Id` into the message payload instead of `operation.Telemetry.Id`. You may also use `Activity.Current.Id`


#### Dequeue
Similarly to `Enqueue`, actual HTTP request to Azure Storage Queue is automatically tracked by ApplicationInsights. However `Enqueue` operation presumably happens in the parent context such as 'incoming' request context. Application Insights SDKs automatically correlate such operation (and its HTTP part) with the parent request and other telemetry reported in the same scope.

`Dequeue` operation is tricky: Application Insights SDK automatically tracks HTTP requests, however it does not know correlation context until message is parsed. It is not possible to correlate HTTP request to get the message with the rest of telemetry.

In many cases, it could be useful to correlate the HTTP request to the queue with other traces as well. The next example demonstrates how to achieve it.

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

Similarly, other queue operations may be instrumented. Peek operation should be instrumented in a similar way as dequeue. Instrumenting queue management operations is not necessary. Application Insights track such operations as HTTP and in most of the cases it is enough.

When instrumenting message deletion, make sure you set the operation (correlation) identifiers. Alternatively, you may use `Activity` API (then you don't need to set operations identifiers on the telemetry items, ApplicationInsights does it for you):

- Create a new `Activity` once you've got an item from the queue
- Use `Activity.SetParentId(message.ParentId)` to correlate consumer and producer logs
- Start the `Activity`
- Track Dequeue, Process, and Delete operations using `Start/StopOperation` helpers. Do it from the same asynchronous control flow (execution context). This way they are correlated properly.
- Then stop the `Activity`
- Use `Start/StopOperation` or call Track telemetry manually 

### Batch Processing
Some queues allow dequeuing multiple messages with one request, but processing such messages is presumably independent and belongs to the different logical operations.
In this case, it's not possible to correlate `Dequeue` operation to particular message processing.

Each message processing should happen in its own asynchronous control flow. You may find more details on it in the [Outgoing Dependencies Tracking](#outgoing-dependencies-tracking) section.

## Long-running background tasks
Some applications start long-running operation that may be caused by user requests. From the tracing/instrumentation perspective, it's not different from request or dependency instrumentation. 

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
        // update status code and success as appropriate
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
        // update status code and success as appropriate
        throw;
    }
    finally
    {
        telemetryClient.StopOperation(operation);
    }
}
```

In this example, we use `telemetryClient.StartOperation` to create `RequestTelemetry` and fill the correlation context. Let's say you have a parent operation, for example it was created by incoming requests that scheduled the operation. As long as `BackgroundTask` starts in the same asynchronous control flow as an incoming request, it is correlated with that parent operation. `BackgroundTask` and all nested telemetry items will automatically be correlated with the request that caused it even after request ends.

When the task is started from the background thread that does not have any operation (Activity) associated with it, `BackgroundTask` does not have any parent. However, it can have nested operations and all telemetry items reported from the task are correlated to the `RequestTelemetry` created in the `BackgroundTask`.

## Outgoing dependencies tracking
You may want to track your own 'dependency' kind or some operation that is not supported by ApplicationInsights.

`Enqueue` method in the ServiceBus Queue or Azure Storage Queue can serve as examples for such custom tracking.

General approach for custom dependency tracking is:
- Call `TelemetryClient.StartOperation` (extension) method that fills `DependencyTelemetry` properties needed for correlation and some other properties (start timestamp, duration).
- Set other custom properties on the `DependencyTelemetry`: name and any other context you need
- Make dependency call and await it
- Stop the operation with `StopOperation` when done
- Handle exceptions

`StopOperation` only stops the operation that was started: if current running operation does not match the one you want to stop, StopOperation does nothing. It could happen if you start multiple operations in parallel in the same execution context:

```C#
var firstOperation = telemetryClient.StartOperation<DependencyTelemetry>("task 1");
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
        // update status code and success as appropriate
    }
    catch(...) 
    {
        // update status code and success as appropriate
    }
    finally 
    {
        telemetryClient.StopOperation(operation);
    }
}
```

## Next steps

- Learn basics of [telemetry correlation](application-insights-correlation.md) in Application Insights.
- See [data model](application-insights-data-model.md) for Application Insights types and data model.
- Report custom [events and metrics](app-insights-api-custom-events-metrics.md) to Application Insights.
- Check out standard context properties collection [configuration](app-insights-configuration-with-applicationinsights-config.md#telemetry-initializers-aspnet).
- Check [System.Diagnostics.Activity User Guide](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) to see how we correlate telemetry
