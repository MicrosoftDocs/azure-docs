---
title: Azure Functions reliable event processing
description: Avoid missing Event Hub messages in Azure Functions
author: craigshoemaker
ms.topic: conceptual
ms.date: 09/12/2019
ms.author: cshoe
---

# Azure Functions reliable event processing

Event processing is one of the most common scenarios associated with serverless architecture. This article describes how to create a reliable message processor with Azure Functions to avoid losing messages.

## Challenges of event streams in distributed systems

Consider a system that sends events at a constant rate  of 100 events per second. At this rate, within minutes multiple parallel Functions instances can consume the incoming 100 events every second.

However, any of the following less-optimal conditions are possible:

- What if the event publisher sends a corrupt event?
- What if your Functions instance encounters unhandled exceptions?
- What if a downstream system goes offline?

How do you handle these situations while preserving the throughput of your application?

With queues, reliable messaging comes naturally. When paired with a Functions trigger, the function creates a lock on the queue message. If processing fails, the lock is released to allow another instance to retry processing. Processing then continues until either the message is evaluated successfully, or it is added to a poison queue.

Even while a single queue message may remain in a retry cycle, other parallel executions continue to keep to dequeueing remaining messages. The result is that the overall throughput remains largely unaffected by one bad message. However, storage queues don’t guarantee ordering and aren’t optimized for the high throughput demands required by Event Hubs.

By contrast, Azure Event Hubs doesn't include a locking concept. To allow for features like high-throughput, multiple consumer groups, and replay-ability, Event Hubs events behave more like a video player. Events are read from a single point in the stream per partition. From the pointer you can read forwards or backwards from that location, but you have to choose to move the pointer for events to process.

When errors occur in a stream, if you decide to keep the pointer in the same spot, event processing is blocked until the pointer is advanced. In other words, if the pointer is stopped to deal with problems processing a single event, the unprocessed events begin piling up.

Azure Functions avoids deadlocks by advancing the stream's pointer regardless of success or failure. Since the pointer keeps advancing, your functions need to deal with failures appropriately.

## How Azure Functions consumes Event Hubs events

Azure Functions consumes Event Hub events while cycling through the following steps:

1. A pointer is created and persisted in Azure Storage for each partition of the event hub.
2. When new messages are received (in a batch by default), the host attempts to trigger the function with the batch of messages.
3. If the function completes execution (with or without exception) the pointer advances and a checkpoint is saved to the storage account.
4. If conditions prevent the function execution from completing, the host fails to progress the pointer. If the pointer isn't advanced, then later checks end up processing the same messages.
5. Repeat steps 2–4

This behavior reveals a few important points:

- *Unhandled exceptions may cause you to lose messages.* Executions that result in an exception will continue to progress the pointer.
- *Functions guarantees at-least-once delivery.* Your code and dependent systems may need to [account for the fact that the same message could be received twice](./functions-idempotent.md).

## Handling exceptions

As a general rule, every function should include a [try/catch block](./functions-bindings-error-pages.md) at the highest level of code. Specifically, all functions that consume Event Hubs events should have a `catch` block. That way, when an exception is raised, the catch block handles the error before the pointer progresses.

### Retry mechanisms and policies

Some exceptions are transient in nature and don't reappear when an operation is attempted again moments later. This is why the first step is always to retry the operation. You could write retry processing rules yourself, but they are so commonplace that a number of tools are available. Using these libraries allow you to define robust retry policies, which can also help preserve processing order.

Introducing fault-handling libraries to your functions allow you to define both basic and advanced retry policies. For instance, you could implement a policy that follows a workflow illustrated by the following rules:

- Try to insert a message three times (potentially with a delay between retries).
- If the eventual outcome of all retries is a failure, then add a message to a queue so processing can continue on the stream.
- Corrupt or unprocessed messages are then handled later.

> [!NOTE]
> [Polly](https://github.com/App-vNext/Polly) is an example of a resilience and transient-fault-handling library for C# applications.

When working with pre-complied C# class libraries, [exception filters](https://docs.microsoft.com/dotnet/csharp/language-reference/keywords/try-catch) allow you to run code whenever an unhandled exception occurs.

Samples that demonstrate how to use exception filters are available in the [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki) repo.

## Non-exception errors

Some issues arise even when an error is not present. For example, consider a failure that occurs in the middle of an execution. In this case, if a function doesn’t complete execution, the offset pointer is never progressed. If the pointer doesn't advance, then any instance that runs after a failed execution continues to read the same messages. This situation provides an "at-least-once" guarantee.

The assurance that every message is processed at least one time implies that some messages may be processed more than once. Your function apps need to be aware of this possibility and must be built around the [principles of idempotency](./functions-idempotent.md).

## Stop and restart execution

While a few errors may be acceptable, what if your app experiences significant failures? You may want to stop triggering on events until the system reaches a healthy state. Having the opportunity to pause processing is often achieved with a circuit breaker pattern. The circuit breaker pattern allows your app to "break the circuit" of the event process and resume at a later time.

There are two pieces required to implement a circuit breaker in an event process:

- Shared state across all instances to track and monitor health of the circuit
- Master process that can manage the circuit state (open or closed)

Implementation details may vary, but to share state among instances you need a storage mechanism. You may choose to store state in Azure Storage, a Redis cache, or any other account that is accessible by a collection of functions.

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) or [durable functions](./durable/durable-functions-overview.md) are a natural fit to manage the workflow and circuit state. Other services may work just as well, but logic apps are used for this example. Using logic apps, you can pause and restart a function's execution giving you the control required to implement the circuit breaker pattern.

### Define a failure threshold across instances

To account for multiple instances processing events simultaneously, persisting shared external state is needed to monitor the health of the circuit.

A rule you may choose to implement might enforce that:

- If there are more than 100 eventual failures within 30 seconds across all instances, then break the circuit and stop triggering on new messages.

The implementation details will vary given your needs, but in general you can create a system that:

1. Log failures to a storage account (Azure Storage, Redis, etc.)
1. When new failure is logged, inspect the rolling count to see if the threshold is met (for example, more than 100 in last 30 seconds).
1. If the threshold is met, emit an event to Azure Event Grid telling the system to break the circuit.

### Managing circuit state with Azure Logic Apps

The following description highlights one way you could create an Azure Logic App to halt a Functions app from processing.

Azure Logic Apps comes with built-in connectors to different services, features stateful orchestrations, and is a natural choice to manage circuit state. After detecting the circuit needs to break, you can build a logic app to implement the following workflow:

1. Trigger an Event Grid workflow and stop the Azure Function (with the Azure Resource connector)
1. Send a notification email that includes an option to restart the workflow

The email recipient can investigate the health of the circuit and, when appropriate, restart the circuit via a link in the notification email. As the workflow restarts the function, messages are processed from the last Event Hub checkpoint.

Using this approach, no messages are lost, all messages are processed in order, and you can break the circuit as long as necessary.

## Resources

- [Reliable event processing samples](https://github.com/jeffhollan/functions-csharp-eventhub-ordered-processing)
- [Azure Durable Entity Circuit Breaker](https://github.com/jeffhollan/functions-durable-actor-circuitbreaker)

## Next steps

For more information, see the following resources:

- [Azure Functions error handling](./functions-bindings-error-pages.md)
- [Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json&tabs=dotnet)
- [Create a function that integrates with Azure Logic Apps](./functions-twitter-email.md)
