---
title: Azure Functions reliable event processing
description: Learn how to use Azure Event Hubs with Azure Functions to reliably process real-time streaming events at scale, including error-handling and circuit breaker patterns.
ms.topic: concept-article
ms.date: 06/12/2025
ai-usage: ai-assisted

#customer intent: As a developer, I want to understand how Azure Functions works with Azure Event Hubs to consume and process event streams in a world of IoT devices, despite transient failures and potential downstream outages.
---

# Reliable event processing with Azure Functions and Event Hubs

Learn how to build robust, reliable serverless solutions using Azure Functions with Azure Event Hubs triggers. This article covers best practices for checkpoints, error handling, and implementing circuit breaker patterns to ensure no events are lost and your event-driven applications remain stable and resilient.

## Challenges of event streams in distributed systems

Consider a system that sends events at a constant rate of 100 events per second. At this rate, within minutes multiple parallel instances can consume the incoming 100 events every second.

However, consider these challenges to consuming an event stream:

- An event publisher sends a corrupt event.
- Your function code encounters an unhandled exception.
- A downstream system goes offline and blocks event processing.

Unlike an Azure Queue storage trigger, which locks messages during processing, Azure Event Hubs reads, per partition, from a single point in the stream. This read behavior, which is more like a video player, provides the desired benefits of high-throughput, multiple consumer groups, and replay-ability. Events are read, forward or backward, from a checkpoint, but you must move the pointer to process new events. For more information, see [Checkpoint](../event-hubs/event-processor-balance-partition-load.md#checkpoint) in the Event Hubs documentation.

When errors occur in a stream and you choose not to advance the pointer, further event processing is blocked. In other words, should you stop the pointer to deal with an issue processing a single event, the unprocessed events begin piling up.

Functions avoids deadlocks by always advancing the stream's pointer, regardless of success or failure. Because the pointer keeps advancing, your functions need to deal with failures appropriately.

## How the Event Hubs trigger consumes events

Azure Functions consumes events from an event hub by cycling through the following steps:

1. A pointer is created and persisted in Azure Storage for each partition of the event hub.
2. New events are received in a batch (by default), and the host tries to trigger the function supplying a the batch of events for processing.
3. When the function completes execution, with or without exceptions, the pointer is advanced and a checkpoint is saved to the default host storage account.
4. Should conditions prevent function execution from completing, the host can't advance the pointer. When the pointer can't advance, subsequent executions reprocess the same events.

This behavior reveals a few important points:

- Unhandled exceptions might cause you to lose events:  

    Function executions that raise an exception continue to progress the pointer. Setting a [retry policy](#retry-policies) or other retry logic delays advancing the pointer until the entire retry completes.

- Functions guarantees _at-least-once_ delivery: 

    Your code and dependent systems might need to account for the fact that the same event could be processed twice. For more information, see [Designing Azure Functions for identical input](functions-idempotent.md).

## Handling exceptions

While all function code should include a [try/catch block](./functions-bindings-error-pages.md) at the highest level of code, having a `catch` block is even more important for functions that consume Event Hubs events. That way, when an exception is raised, the catch block handles the error before the pointer progresses.

## Retry mechanisms and policies

Because many exceptions in the cloud are transient, the first step in error handling is always to retry the operation. You can apply built-in retry policies or define your own retry logic.

### Retry policies

Functions provides built-in retry policies for Event Hubs. When using retry policies, you simply raise a new exception and the host try to process the event again based on the defined policy. This retry behavior requires version 5.x or later of the Event Hubs extension. For more information, see [Retry policies](functions-bindings-error-pages.md#retry-policies). 

### Custom retry logic

You can also define your own retry logic in the function itself. For example, you could implement a policy that follows a workflow illustrated by the following rules:

- Try to process an event three times (potentially with a delay between retries).
- If the eventual outcome of all retries is a failure, then add an event to a queue so processing can continue on the stream.
- Corrupt or unprocessed events are then handled later.

> [!NOTE]
> [Polly](https://github.com/App-vNext/Polly) is an example of a resilience and transient-fault-handling library for C# applications.

## Nonexception errors

Some issues can occur without an exception being raised. For example, consider a case where a request times out or the instance running the function crashes. When a function fails to complete without an exception, the offset pointer is never advanced. If the pointer doesn't advance, then any instance that runs after a failed execution continues to read the same events. This situation provides an _at-least-once_ guarantee.

The assurance that every event is processed at least one time implies that some events could be processed more than once. Your function apps need to be aware of this possibility and must be built around the [principles of idempotency](./functions-idempotent.md).

## Handling failure states

Your app might be able to acceptably handle a few errors in event processing. However, you should also be prepared to handle persistent failure state, which might occur as a result of failures in downstream processing. In such a failure state, such as a downstream data store being offline, your function should stop triggering on events until the system reaches a healthy state. 

### Circuit breaker pattern

When you implement the _circuit breaker_ pattern, your app can effectively pause event processing and then resume it at a later time after issues are resolved. 

There are two components required to implement a circuit breaker in an event stream process:

- Shared state across all instances to track and monitor health of the circuit.
- A primary process that can manage the circuit state, as either `open` or `closed`.

Implementation details can vary, but to share state among instances you need a storage mechanism. You can store state in Azure Storage, a Redis cache, or any other persistent service that can be accessed by your function app instances.

Both [Durable Functions](./durable/durable-functions-overview.md) and [Azure Logic Apps](../logic-apps/logic-apps-overview.md) provide infrastructure to manage workflows and circuit states. This article describes using Logic Apps to pause and restart function executions, giving you the control required to implement the circuit breaker pattern.

### Define a failure threshold across instances

Persisted shared external state is required to monitor the health of the circuit when multiple instances are processing events simultaneously. You can then monitor this persisted state based on rules that indicate a failure state, such as:

>When there are more than 100 event failures within a 30-second period across all instances, break the circuit to stop triggering on new events.

The implementation details for this monitoring logic vary depending on your specific app needs, but in general you must create a system that:

1. Logs failures to persisted storage.
1. Inspect the rolling count when new failures are logged to determine if the event failure threshold is met.
1. When this threshold is met, emit an event telling the system to break the circuit.

### Managing circuit state with Azure Logic Apps

Azure Logic Apps comes with built-in connectors to different services, features, and stateful orchestrations, and it's a natural choice to manage circuit state. After detecting when a circuit must break, you can build a logic app to implement this workflow:

1. Trigger an Event Grid workflow that stops the function processing. 
1. Send a notification email that includes an option to restart the workflow.

To learn how to disable and reenable specific functions using app settings, see [How to disable functions in Azure Functions](disable-function.md).  

The email recipient can investigate the health of the circuit and, when appropriate, restart the circuit via a link in the notification email. As the workflow restarts the function, events are processed from the last event hub checkpoint.

When you use this approach, no events are lost, events are processed in order, and you can break the circuit as long as necessary.

## Migration strategies for Event Grid triggers

When you migrate an existing function app between regions or between some plans, you must recreate the app during the migration process. In this case, during the migration process, you might have two apps that are both able to consume from the same event stream and write to the same output destination. 

You should consider [using consumer groups](../event-hubs/event-hubs-features.md#consumer-groups) to avoid event data loss or duplication during the migration process:

1. Create a new consumer group for the new target app.

1. Configure the trigger in the new app to use this new consumer group. 

    This allows both apps to process events independently during validation.

1. Validate that the new app is processing events correctly.
 
1. Stop the original app or remove its subscription/consumer group.   

## Related resources

- [Reliable event processing samples](https://github.com/jeffhollan/functions-csharp-eventhub-ordered-processing)
- [Azure Durable Entity circuit breaker](https://github.com/jeffhollan/functions-durable-actor-circuitbreaker)
- [Azure Functions error handling](./functions-bindings-error-pages.md)
- [Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json&tabs=dotnet)
- [Create a function that integrates with Azure Logic Apps](./functions-twitter-email.md)
