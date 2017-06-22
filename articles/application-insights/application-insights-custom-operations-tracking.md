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
By the operation, we understand some logical piece of work that has duration, some context, result in most of the cases, and may have nested operations. It's described by abstract class [OperationTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/Extensibility/Implementation/OperationTelemetry.cs) and it's descendants [RequestTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/DataContracts/RequestTelemetry.cs) and [DependencyTelemetry](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Core/Managed/Shared/DataContracts/DependencyTelemetry.cs).

We use.NET API `System.Diagnostics.Activity` to correlate telemetry and flow the correlation details with async calls. You may find more details about it in the [Activity User Guide](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md). 

With the help of `Activity`, we ensure that any telemetry that is reported within the scope of the operation is automatically correlated with this operation. Underlying components may start nested operations using Activity, and such operation is also be automatically correlated with parent operation.

We also follow the [Http Protocol for Correlation](https://github.com/lmolkova/corefx/blob/bab520c06b77b951ff0236a6414447ba2fc72962/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md) and you should expect to receive headers described in the protocol with incoming HTTP requests from other instrumented services.

## Incoming operations tracking 
ApplicationInsights automatically collects HTTP requests for ASP.NET applications that run in IIS pipeline and all ASP.NET Core applications. Applications that do not use ASP.NET or does not run in IIS pipeline require should be instrumented manually at this point.

Another example that requires custom tracking is worker that receives items from the queue. While the request to the queue itself might be done over HTTP and tracked as a dependency, it does not allow you to have high-level operation that describes message processing.

Let's see how we can track such operations.

On the high level, the task is to create `RequestTelemetry`. Fill it's with important details at the beginning of the operation and once the operation is completed, track the telemetry. The following example demonstrates it.

### HTTP request in Owin self-hosted app

``` C#
public class ApplicationInsightsMiddleware : OwinMiddleware
{
    private readonly TelemetryClient telemetryClient = new TelemetryClient(TelemetryConfiguration.Active);
    
    public ApplicationInsightsMiddleware(OwinMiddleware next) : base(next) {}

    public override async Task Invoke(IOwinContext context)
    {
        // Let's create and start RequestTelemetry
        var requestTelemetry = new RequestTelemetry();
        requestTelemetry.Start();

        // operation name contains incoming request method and path for simplicity
        // however route data may be more useful than path
        requestTelemetry.Name = $"{context.Request.Method} {context.Request.Uri.GetLeftPart(UriPartial.Path)}";

        // create Activity that describes operation context (including correlation details)
        Activity activity = new Activity(requestTelemetry.Name);

        // if there is Request-Id recevied from the upstream service, set parent on the Activity 
        if (context.Request.Headers.ContainsKey("Request-Id"))
            activity.SetParentId(context.Request.Headers.Get("Request-Id"));

        // Start Activity and set correlation iddentifiers on the request
        activity.Start();
        requestTelemetry.Context.Operation.Id = activity.RootId;
        requestTelemetry.Context.Operation.ParentId = activity.ParentId;
        requestTelemetry.Id = activity.Id;

        try
        {
            await Next.Invoke(context);
        }
        catch (Exception e)
        {
            // you may also want to update status of request telemetry
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

            // now it's time to track telemetry and stop the activity
            requestTelemetry.Stop();
            telemetryClient.Track(requestTelemetry);
            activity.Stop();
        }
    }
}
```

HTTP Correlation protocol also declares `Correlation-Context`header, however it's omitted for simplicity.

## Queue instrumentation
For the HTTP communication, we have created a protocol to pass correlation details. However there are many queue protocols and APIs, some queues allow you to pass additional metadata, properties, or headers along with the message and others do not.

### Service Bus Queue
[ServiceBus Queue](https://docs.microsoft.com/en-us/azure/service-bus-messaging/) allows you to pass property bag along with the message and we use it to pass correlation id.

#### Enqueue
```C#
public async Task Enqueue(string payload)
{
    // StartOperation is helper method that hides Activity creation, and common telemetry properties assignment
    // It is usually more convenient to use it for dependency tracking when there is no need to parse Activity.Id 
    // from the 'incoming request'.
    var operation = telemetryClient.StartOperation<DependencyTelemetry>("enqueue " + queueName);
    operation.Telemetry.Type = "Queue";
    operation.Telemetry.Data = "Enqueue " + queueName;

    var message = new BrokeredMessage(payload);
    message.Properties.Add("ActivityId", Activity.Current.Id);

    try
    {
        await queue.SendAsync(message);
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
        // set operation.Telemetry Success and ResponseCode here
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
    RequestTelemetry telemetry = new RequestTelemetry();
    telemetry.Start();
    telemetry.Name = "Dequeue " + queueName; // it may also make sense to get name from the message

    // create Activity that describes operation context (including correlation details)
    Activity activity = new Activity(telemetry.Name);

    if (message.Properties.ContainsKey("ActivityId"))
    {
        activity.SetParentId(message.Properties["ActivityId"].ToString());
    }

    // Start Activity and telemetry and set telemetry Id
    activity.Start();
    telemetry.Start();
    telemetry.Context.Operation.Id = activity.RootId;
    telemetry.Context.Operation.ParentId = activity.ParentId;
    telemetry.Id = activity.Id;

    try
    {
        await ProcessMessage();
    }
    catch (Exception e)
    {
        telemetryClient.TrackException(e);
    }
    finally
    {
        // set Success and ResponseCode here

        // let's stop everything and track telemetry
        telemetry.Stop();
        telemetryClient.Track(telemetry);
        activity.Stop();
    }
}
```

### Azure Storage Queue
The following example shows how to track [Azure Storage Queue](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-how-to-use-queues) operations, message processing and correlate telemetry between producer and consumer and Azure Storage logs. 

Azure Storage Queue has REST API and all calls to the queue itself are tracked by ApplicationInsights DependencyCollector for HTTP requests.
Make sure you have `Microsoft.ApplicationInsights.DependencyCollector.HttpDependenciesParsingTelemetryInitializer` in the `applicationInsights.config` or add it programmatically as described [here](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-api-filtering-sampling).

If you configure ApplicationInsights manually, make sure you create and initialize `Microsoft.ApplicationInsights.DependencyCollector.DependencyTrackingTelemetryModule` similarly to:
 
``` C#
DependencyTrackingTelemetryModule module = new DependencyTrackingTelemetryModule();

// you may prevent correlation header injection to some URLs, but make sure you have Azure Storage URL there
module.ExcludeComponentCorrelationHttpHeadersOnDomains.Add("core.windows.net");
module.Initialize(TelemetryConfiguration.Active);

// do not forget to dispose module during application shutdown
```

You may also want to correlate ApplicationInsights operation Id with Azure Storage RequestId. Check [this article](https://docs.microsoft.com/en-us/azure/storage/storage-monitoring-diagnosing-troubleshooting#end-to-end-tracing) on how to set and get storage request client and server request Id.

#### Enqueue

In `Enqueue` method, we track dependency telemetry. Even though AddMessageAsync does HTTP request that is tracked automatically, there may be several retries of the request.

`Enqueue` operation is the child of a 'parent' operation (for example, incoming HTTP request), and 'Http' dependency call is the child of `Enqueue` operation and grandchild of the incoming request.

Tracking dependency for Enqueue operation is optional. However creating and starting Activity is important as it allows you to pass correlation Id to the consumer and correlate particular Enqueue operation with corresponding message processing. 

```C#
public async Task Enqueue(CloudQueue queue, string message)
{
    var operation = telemetryClient.StartOperation<DependencyTelemetry>("enqueue " + queue.Name);
    operation.Telemetry.Type = "Queue";
    operation.Telemetry.Data = "Enqueue " + queue.Name;

    // MessagePayload represents your custom message and also serializes Activity.Current.Id into payload
    // e.g. if you choose to pass payload serialized to json, it may look like
    // {'activityId' : '|some-id.1.2.3.', 'message' : 'your message to process'}
    var jsonPayload = JsonConvert.SerializeObject(new MessagePayload { ActivityId = Activity.Current.Id, Payload = message });
    CloudQueueMessage queueMessage = new CloudQueueMessage(jsonPayload);

    // Add Activity.Current.Id to the OperationContext to correlate Azure Storage logs and ApplciationInsights telemetry
    OperationContext context = new OperationContext { ClientRequestID = Activity.Current.Id};

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
        telemetryClient.StopOperation(operation);
    }
}

public class MessagePayload
{
    public string ActivityId { get; set; }
    public string Payload { get; set; }
}    
```

#### Dequeue
`Dequeue` operation is tricky. Again, we want to track the dependency telemetry, but we also want to correlate producer and consumer logs.
What we will do, we will parse activity Id from the payload and fill dependency telemetry after the operation is completed, but before we track it.

However corresponding HTTP dependency is not correlated with the message enqueue, dequeue, or processing because ApplicationInsights is not aware of our custom message format and cannot parse message.

``` C#
public async Task<MessagePayload> Dequeue(CloudQueue queue)
{
    DependencyTelemetry telemetry = new DependencyTelemetry
    {
        Type = "Queue",
        Name = "Dequeue " + queue.Name
    };
    telemetry.Start();

    Activity activity = null;

    try
    {
        var message = await queue.GetMessageAsync();
        telemetry.Stop();

        if (message != null)
        {
            // MessagePayload represents your custom message and also serializes Activity.Current.Id into payload
            // e.g. if you choose to pass payload serialized to json, it may look like
            // {'activityId' : '|some-id.1.2.3.', 'message' : 'your message to process'}
            var payload = JsonConvert.DeserializeObject<MessagePayload>(message.AsString);

            // if there is a message, we want to correlate Dequeue operation with processing
            // However we will only know what correlation Id to use AFTER we will get it from the message
            // So we will report telemetry once we know the Id.
            activity = new Activity(telemetry.Name);

            if (payload.ActivityId != null)
            {
                activity.SetParentId(payload.ActivityId);
            }

            activity.Start();

            if (payload.ActivityId == null)
            {
                // in fact, if there were no ActivityId in the payload
                // we still want to correlate Dequeue operation with corresponding message processing
                // we can achieve it with setting Activity.Id on the payload and using it in the message processing
                payload.ActivityId = activity.RootId;
            }

            // now we know all the correlation ids for telemetry, so we can report it
            telemetry.Context.Operation.Id = activity.RootId;
            telemetry.Context.Operation.ParentId = activity.ParentId;
            telemetry.Id = activity.Id;
            return payload;
        }
    }
    catch (StorageException e)
    {
        telemetry.Stop();
        telemetry.Properties.Add("AzureServiceRequestID", e.RequestInformation.ServiceRequestID);
        telemetry.Success = false;
        telemetry.ResultCode = e.RequestInformation.HttpStatusCode.ToString();
        telemetryClient.TrackException(e);
    }
    finally
    {
        telemetryClient.Track(telemetry);
        activity?.Stop();
    }

    return null;
}
```

#### Process Message

In the following example, we trace 'incoming' message similarly to incoming HTTP request.

```C#
public async Task Process(MessagePayload message)
{
    // once the message is dequeued from the queue, create ReqeustTelemetry to track it's processing
    RequestTelemetry telemetry = new RequestTelemetry();
    telemetry.Start();
    telemetry.Name = "Dequeue " + queueName; // it may also make sense to get name from the message

    // create Activity that describes operation context (including correlation details)
    Activity activity = new Activity(telemetry.Name);
    activity.SetParentId(message.ActivityId);

    // Start Activity and telemetry and set telemetry Id
    activity.Start();
    telemetry.Start();
    telemetry.Context.Operation.Id = activity.RootId;
    telemetry.Context.Operation.ParentId = activity.ParentId;
    telemetry.Id = activity.Id;

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
        // set Success and ResponseCode here

        // let's stop everything and track telemetry
        telemetry.Stop();
        telemetryClient.Track(telemetry);
        activity.Stop();
    }
}
```

Similarly, other queue operations may be instrumented. Peek operation should be instrumented in a similar way as dequeue. Instrumenting queue creation and deletion may not be necessary as they are tracked by HTTP and in most of the cases is enough.

When instrumenting delete message operation, make sure it happens under the scope of the same ActivityId as Dequeue and Process.

### Other considerations
Some queues allow dequeuing multiple messages with one request. Activity should be created for every message separately as their processing is presumably independent and belongs to the different logical operations.

Another important aspect of using nested operations and Activity is making sure every processing happen in its own `ExecutionContext`. It could be achieved with `async` function that processes the message or by processing every message in a different `Task`.

## Long-running background tasks
Sometimes an application needs to start some long-running operation that may or may not be caused by user requests. From the tracing/instrumentation perspective, it's not different from the request or dependency instrumentation. 

``` C#
async Task BackgroundTask()
{
    var operation = telemetryClient.StartOperation<DependencyTelemetry>(taskName);
    operation.Telemetry.Type = "Background";
    try
    {
        int progress = 0;
        while (progress < 100)
        {
            // process task
            progress++;
            telemetryClient.TrackTrace($"done {progress}%");
        }
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

In this example, we use `telemetryClient.StartOperation` to create `DependencyTelemetry` and fill the correlation context. Let's say you have a parent operation. It is set in `Activity.Current` when `BackgroundTask` starts. For example, it was created by user requests that scheduled the operation. As long as `BackgroundTask` starts in the same asynchronous control flow as request, it is correlated with that parent operation. `BackgroundTask` and all nested telemetry items will automatically be correlated with the request that caused it even after request ends.

When the task was started from some background thread that does not have any Activity associated with it, `BackgroundTask` does not have any parent. But it can have nested operations and all telemetry reported from the task is correlated to the `DependencyTelemetry` created by the `BackgroundTask`.

## Outgoing dependencies tracking
Refer to the `Enqueue` method in the ServiceBus Queue or Azure Storage Queue examples.

## Next steps

- Learn basics of [telemetry correlation](application-insights-correlation.md) in Application Insights.
- See [data model](application-insights-data-model.md) for Application Insights types and data model.
- Report custom [events and metrics](app-insights-api-custom-events-metrics.md) to Application Insights.
- Check out standard context properties collection [configuration](app-insights-configuration-with-applicationinsights-config.md#telemetry-initializers-aspnet).
