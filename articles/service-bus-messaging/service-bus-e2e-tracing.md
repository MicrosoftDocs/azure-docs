---
title: Azure Service Bus End to end tracing and diagnostics | Microsoft Docs
description: Overview of Service Bus client diagnostics and end-to-end tracing
services: service-bus-messaging
documentationcenter: ''
author: lmolkova
manager: bfung
editor: ''

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/18/2017
ms.author: lmolkova

---

# Distributed tracing and correlation through the Service Bus Messaging

One of the common problems in microservices development is the ability to trace operation from a client (application or browser) through all the services involved in processing for debugging, performance analysis, A/B testing and other typical diagnostics scenarios.
One part of this problem is tracking logical pieces of work such as request or message processing latency and results, external dependency calls; another part is correlation of these diagnostics events (telemtery) beyond process boundaries.

When a producer sends a message through a queue, it typically happens in the scope of some other logical operation, initiated by some other client or service. Perhaps producer emits some telemetry events related to this operation. Consumer, that receives a message presumably emits telemetry.
They have to stamp it with some trace context that could ensure both correlation and causation for telemetry.

Microsoft Azure Service Bus messaging has defined payload properties that producers and consumers should use to pass trace context.
The protocol is based on the [HTTP Correlation protocol](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md).

| Property Name        | Description                                                 |
|----------------------|-------------------------------------------------------------|
|  Diagnostic-Id       | Unique identifier of an external call from producer to the queue. Please refer to [Request-Id in HTTP protocol](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md#request-id) for the rationale, considerations, and format |
|  Correlation-Context | Operation context which is propagated across all services involved in operation processing. Please refer to [Correlation-Context in HTTP protocol](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/HttpCorrelationProtocol.md#correlation-context) for more details and format |

# Service Bus .NET Client auto-tracing

Starting with version 3.0.0 [Microsoft Azure ServiceBus Client for .NET](/dotnet/api/microsoft.azure.servicebus.queueclient) provides tracing instrumentation points that can be used by Microsoft Application Insights, other tracing system or hooked by a piece of client code.
The instrumentation allows tracking all calls to the Service Bus messaging service from client side. If message processing is done with the [message handler pattern](/dotnet/api/microsoft.azure.servicebus.queueclient.registermessagehandler), message processing is also instrumented

Below we go through the steps needed to enable the instrumentation.

## Service Bus Client Tracing with Microsoft Application Insights

[Microsoft Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) provides rich performance monitoring capabilities including automatical request and dependency tracking.

Depending on your project type, install Application Insights SDK for [ASP.NET](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-asp-net) (version 2.5-beta2 or higher) or [ASP.NET Core](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-asp-net-core) (version 2.2.0-beta2 or higher). Above links provide detailed on installing SDK, creating Azure resource and configuring SDK (if needed).

For non-ASP.NET applications, please refer to [Azure Application Insights for Console Applications](../application-insights/application-insights-console.md) article.

If you use [message handler pattern](/dotnet/api/microsoft.azure.servicebus.queueclient.registermessagehandler) to process messages, you are done: all Service Bus calls done by your service are automatically tracked and correlated with other telemetry items. 

### Trace message processing

If you manually receive and process messages, please refer to the following example in order to track message processing and correlate it with any nested telemetry:

```C#
    private readonly TelemetryClient telemetryClient;
    
    async Task ProcessAsync(Message message)
    {
        var activity = message.ExtractActivity();
        
        // note, if you are using Microsoft.ApplicationInsights package version 2.6-beta or higher, you should call StartOperation<RequestTelemetry>(activity) instead
        using (var operation = telemetryClient.StartOperation<RequestTelemetry>("Process", activity.RootId, activity.ParentId))
        {
            telemetryClient.TrackTrace("Received message");
            try 
            {
               // process message
            }
            catch (Exception ex)
            {
                 telemetryClient.TrackException(ex);
                 operation.Telemetry.Success = false;
                 throw;
            }

            telemetryClient.TrackTrace("Done");
       }
    }
```

In above example, `RequestTelemetry` is reported for each processed message, having a timestamp, duration, and result (success). The telemetry also has a set of correlation properties.
Nested traces and exceptions reported during message processing are also stamped with correlation properties are 'children' of the `RequestTelemetry`.
In case you make calls to external components during message processing, they will also be correlated as long as they are automatically tracked by Application Insights SDK or manually tracked by your code.

## Tracking Service Bus calls in .NET applications without tracing system

If you are not using Application Insights as a tracing system, and your tracing system does not support, this section describes how to track Service Bus client calls.

Service Bus .NET Client is instrumented using .NET tracing primitives [System.Diagnostics.Activity](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) and [System.Diagnostics.DiagnosticSource](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/DiagnosticSourceUsersGuide.md).

`Activity` serves as a trace context while `DiagnosticSource` is a notification mechanism. 

Note that if there is no listener for the DiagnosticSource events, instrumentation is off, keeping zero instrumentation costs. DiagnosticSource gives all control to the listener:
- listener controls which sources and events to listen to
- listener controls event rate and sampling
- events are sent with a payload that provides full context: e.g. you can access and modify Message object during the event

Please familiarize yourself with [DiagnosticSource User Guide](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/DiagnosticSourceUsersGuide.md) before proceeding with implementation.

Let's create a simple listener for Service Bus events in ASP.NET Core app that writes logs with Microsoft.Extension.Logger.
Note, it uses [System.Reactive.Core](https://www.nuget.org/packages/System.Reactive.Core) library to subscribe to DiagnosticSource (it's also easy to subscribe to DiagnosticSource without it)

```C#
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory factory, IApplicationLifetime applicationLifetime)
        {
            // configuration...

            var serviceBusLogger = factory.CreateLogger("Microsoft.Azure.ServiceBus");

            IDisposable innerSubscription = null;
            IDisposable outerSubscription = DiagnosticListener.AllListeners.Subscribe(delegate (DiagnosticListener listener)
            {
                // subscribe to the Service Bus DiagnosticSource
                if (listener.Name == "Microsoft.Azure.ServiceBus")
                {
                    // receive event from Service Bus DiagnosticSource
                    innerSubscription = listener.Subscribe(delegate (KeyValuePair<string, object> evnt)
                    {
                        // Log operation details once it's done
                        if (evnt.Key.EndsWith("Stop"))
                        {
                            Activity currentActivity = Activity.Current;
                            TaskStatus status = (TaskStatus)evnt.Value.GetProperty("Status");
                            serviceBusLogger.LogInformation($"Operation {currentActivity.OperationName} is finished, Duration={currentActivity.Duration}, Status={status}, Id={currentActivity.Id}, StartTime={currentActivity.StartTimeUtc}");
                        }
                    });
                }
            });

            applicationLifetime.ApplicationStopping.Register(() =>
            {
                outerSubscription?.Dispose();
                innerSubscription?.Dispose();
            });
        }
    }
```

In this sample, we configured a listener that logs operation duration, result, unique Id and start time for each Service Bus operation.

### Events

Note that for every operation, two events are sent: 'Start' and 'Stop'. 
Most probably, you only interested in 'Stop' events only as they provide the result of operation and thanks to the `Activity`, we know start time (that is 'Start' event timestamp) and duration (that is duration between 'Start' and 'Stop').

Event payload provides a listener with the context of the operation, it replicates API incoming parameters and return value. 'Stop' event payload has all the properties of 'Start' event payload, so you can ignore 'Start' event completely.

All events also have 'Entity' and 'Endpoint' properties, they are omitted in below table
  * `string Entity` -  - Name if the entity (queue, topic, etc)
  * `Uri Endpoint` - Service Bus endpoint URL

Each 'Stop' event has `Status` property with `TaskStatus` async operation was completed with, that is also omitted below for simplicity.

Here is the full list of instrumented operations:

| Operation Name | Tracked API | Specific Payload Properties|
|----------------|-------------|---------|
| Microsoft.Azure.ServiceBus.Send | `ISenderClient.SendAsync` (i.e. `MessageSender`, `QueueClient`, `TopicClient`) | `IList<Message> Messages` - List of messages being sent |
| Microsoft.Azure.ServiceBus.ScheduleMessage | `ISenderClient.ScheduleMessageAsync` | `Message Message` - Message being processed<br/>`DateTimeOffset ScheduleEnqueueTimeUtc` - Scheduled message offset<br/>`long SequenceNumber` - Sequence number of scheduled message ('Stop' event payload) |
| Microsoft.Azure.ServiceBus.Cancel | `ISenderClient.CancelScheduledMessageAsync` | `long SequenceNumber` - Sequence number of te message to be canceled | 
| Microsoft.Azure.ServiceBus.Receive | `MessageReceiver.ReceiveAsync` |`int RequestedMessageCount` - The maximum number of messages that will be received.<br/>`IList<Message> Messages` -List of received messages ('Stop' event payload) |
| Microsoft.Azure.ServiceBus.Peek | `MessageReceiver.PeekAsync` | `int FromSequenceNumber` - The starting point from which to browse a batch of messages.<br/>`int RequestedMessageCount` - The number of messages to retrieve.<br/>`IList<Message> Messages` - List of received messages ('Stop' event payload) |
| Microsoft.Azure.ServiceBus.ReceiveDeferred | `MessageReceiver.ReceiveDeferredAsync` | `IEnumerable<long> SequenceNumbers` - The list containing the sequence numbers to receive.<br/>`IList<Message> Messages` - List of received messages ('Stop' event payload) |
| Microsoft.Azure.ServiceBus.Complete | `MessageReceiver.CompleteAsync` | `IList<string> LockTokens` - The list containing the lock tokens of the corresponding messages to complete.|
| Microsoft.Azure.ServiceBus.Abandon | `MessageReceiver.AbandonAsync` | `string LockToken` - The lock token of the corresponding message to abandon. |
| Microsoft.Azure.ServiceBus.Defer | `MessageReceiver.DeferAsync` | `string LockToken` - The lock token of the corresponding message to defer. | 
| Microsoft.Azure.ServiceBus.DeadLetter | `MessageReceiver.DeadLetterAsync` | `string LockToken` - The lock token of the corresponding message to dead letter. | 
| Microsoft.Azure.ServiceBus.RenewLock | `MessageReceiver.RenewLockAsync` | `string LockToken` - The lock token of the corresponding message to renew lock on.<br/>`DateTime LockedUntilUtc` - New lock token expiry date and time in UTC format. ('Stop' event payload)|
| Microsoft.Azure.ServiceBus.Process | Message Handler lambda | `Message Message` - Message being processed. |
| Microsoft.Azure.ServiceBus.ProcessSession | Message Session Handler lambda | `Message Message` - Message being processed.<br/>`IMessageSession Session` - Session being processed |
| Microsoft.Azure.ServiceBus.AddRule | `SubscriptionClient.AddRuleAsync` | `RuleDescription Rule` - The rule description that provides the rule to add. |
| Microsoft.Azure.ServiceBus.RemoveRule | `SubscriptionClient.RemoveRuleAsync` | `string RuleName` - Name of the rule to remove. |
| Microsoft.Azure.ServiceBus.GetRules | `SubscriptionClient.GetRulesAsync` | `IEnumerable<RuleDescription> Rules`- All rules associated with the subscription. ('Stop payload only') |
| Microsoft.Azure.ServiceBus.AcceptMessageSession | `SessionClient.AcceptMessageSessionAsync` | `string SessionId` - The sessionId present in the messages. |
| Microsoft.Azure.ServiceBus.GetSessionState | `MessageSession.GetSessionStateAsync` | `string SessionId` - The sessionId present in the messages.<br/>`byte [] State` - Session state ('Stop' event payload) |
| Microsoft.Azure.ServiceBus.SetSessionState | `MessageSession.SetSessionStateAsync` | `string SessionId` - The sessionId present in the messages.<br/>`byte [] State` - Session state |
| Microsoft.Azure.ServiceBus.RenewSessionLock | `MessageSession.RenewSessionLockAsync`| `string SessionId` - The sessionId present in the messages. |
| Microsoft.Azure.ServiceBus.Exception | any instrumented API| `Exception Exception` - Exception instance |

In every event, you can access `Activity.Current` that holds current operation context.

#### Logging additional properties

`Activty.Current` provides detailed context of current operation and its parents, please refer to the [Activity docuemntation](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/ActivityUserGuide.md) for more details.
Service Bus instrumentation provides additional information in the `Activity.Current.Tags` - they hold `MessageId` and `SessionId` whenever they are available.

Activities that track 'Receive', 'Peek' and 'ReceiveDeferred' event also may have `RelatedTo` tag that hold distinct list of `Diagnostic-Id`(s) of messages received during the operation.
Since such operation may result in several unrelated messages to be received, and since the `Diagnostic-Id` is not known when operation starts, 'Receive' operations could be correlated to 'Process' operations using this Tag only. It's useful when analyzing performance issues to check not only message processing duration, but also how long it took to receive the message.

Note that efficient way to log Tags is to iterate over them, so the above example with Tags looks like 

```C#
    Activity currentActivity = Activity.Current;
    TaskStatus status = (TaskStatus)evnt.Value.GetProperty("Status");

    var tagsList = new StringBuilder();
    foreach (var tags in currentActivity.Tags)
    {
        tagsList.Append($", "{tags.Key}={tags.Value}");
    }

    serviceBusLogger.LogInformation($"{currentActivity.OperationName} is finished, Duration={currentActivity.Duration}, Status={status}, Id={currentActivity.Id}, StartTime={currentActivity.StartTimeUtc}{tagsList}");
    
```

#### Filtering and sampling

In some cases, it's desirable to log only part of the events. It could be logging only 'Stop' events as we've done in above example or sampling percentage of the events to reduce performance overhead or log storage consumption. 
`DiagnosticSource` provide way to achieve it with `IsEnabled` predicate. Please refer to the [Context-Based Filtering in DiagnosticSource](https://github.com/dotnet/corefx/blob/master/src/System.Diagnostics.DiagnosticSource/src/DiagnosticSourceUsersGuide.md#context-based-filtering) for more details.

Note that `IsEnabled` callback may be called multiple times for a single operation to control verbosity and ensure minimum performance impact for unwanted events.

`IsEnabled` is called in following sequence:

1. `IsEnabled(<OperationName>, string entity, null)` e.g. `IsEnabled("Microsoft.Azure.ServiceBus.Send", "MyQueue1")`. Note there is no 'Start' or 'Stop' at the end. Use it to filter out particular operations or queues. If callback returns `false`, events for the operation will not be sent

  * For the 'Process' and 'ProcessSession' operations, you will also receive `IsEnabled(<OperationName>, string entity, Activity activity)` callback. Use it to filter events based on `activity.Id` or Tags properties.
  
2. `IsEnabled(<OperationName>.Start)` e.g. `IsEnabled("Microsoft.Azure.ServiceBus.Send.Start")`. Check whether 'Start' event should be fired. Note that it only affects 'Start' event and do not affect further instrumentation.

There is no `IsEnabled` for 'Stop' event.

If some operation result is exception, `IsEnabled("Microsoft.Azure.ServiceBus.Exception")` is called. Note that you could only subscribe to 'Exception' events and prevent the rest of the instrumentation. In this case, you still have to handle such exceptions. Since other instrumentation is disabled, you should not expect trace context to flow woth the messages from consumer to producer.

You can use `IsEnabled` also implement sampling strategies. Sampling based on the `Activity.Id` or `Activity.RootId` ensures consistent sampling across all tires (as long as it is propagated by tracing system or by your own code).

Note that in presence of multiple `DiagnosticSource` listeners for the same source, you may not receive `IsEnabled` callback as it's enough for just one listener to accept the event. 

## Next steps

* [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
* [Application Insights Correlation](../application-insights/application-insights-correlation.md)
* [Application Insights Monitor Dependencies](../application-insights/app-insights-asp-net-dependencies.md) to see if REST, SQL or other external resources are slowing you down.
* [Track custom operations with Application Insights .NET SDK](../application-insights/application-insights-custom-operations-tracking.md)
