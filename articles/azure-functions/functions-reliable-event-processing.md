---
title: Azure Functions reliable event processing
description: Avoid missing messages in Azure Functions
services: functions
author: craigshoemaker
manager: gwallace
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/20/2019
ms.author: cshoe
---

# Azure Functions reliable event processing

Event processing is one of the most common scenarios in serverless and Azure Functions. This article describes how you can create a reliable message processor to avoid losing messages. While the following samples are in C#, all patterns work across any language (unless explicitly stated otherwise).

## Challenges of event streams in distributed systems

Imagine a system sending events at a constant rate , say 100 events per second. Consuming these events from Azure Functions is easy to setup, and within minutes multiple parallel instances can process the incoming 100 events every second.

However, consider the the following less-optimal conditions:

- What if the event publisher sends a corrupt event?
- What if your Functions instance has a hiccup and crashes mid-execution?
- What if a downstream system goes offline?

How do you handle these situations while preserving the throughput of your application?

With queues, reliable messaging comes a bit more naturally. In Azure Functions when you trigger on a queue message, the function creates a "lock" on the message. With this lock in place, the function attempts to process the message. If processing fails, the lock is released so another instance can retry processing. This back-and-forth continues until either success is reached, or after a number of attempts (4 by default) the message is added to a poison queue.

While a single queue message may be in this retry cycle, other parallel executions aren't prevented from continuing to dequeue the remaining messages . The end result is that the overall throughput remains largely unaffected by one bad message. By contrast, storage queues don’t guarantee ordering and aren’t optimized for the same high throughput of services like Event Hubs.

With event streams like Azure Event Hubs, there is no lock concept. To allow for features like high throughput, multiple consumer groups, and replay-ability, services like Event Hubs read more video player when consuming events. There is one pointer in the stream per partition, and you can read forwards or backwards from that location.

If your stream encounters an error and you decide to keep the pointer in the same spot, processing in that partition is halted until the pointer is moved. In other words, if 100 events per second are arriving while Azure Functions has the  pointer stopped to deal with a single bad event, the unprocessed events begin piling up.

To avoid a deadlock, Functions continue to progress the pointer on the stream regardless of a success or failure. This means your functions need to deal with failures correctly.

## How Azure Functions consume Event Hubs events

Azure Functions consumes Event Hub events while cycling through the following steps:

1. A pointer is created and persisted in Azure Storage for each partition of the Event Hub.
2. When new Event Hub messages are received (in a batch by default), the host attempts to trigger the function with the batch of messages.
3. If the function completes execution (with or without exception) the pointer is progressed and a checkpoint is saved in the storage account.
4. If something prevents the function execution from completing, the host fails to progress the pointer, and on subsequent checks the same messages is received again.
5. Repeat steps 2–4

This behavior reveals a few important points:

- *Unhandled exceptions may cause you to lose messages.* Executions that result in an exception continue to progress the pointer.
- *Functions guarantees at-least-once delivery.* Your code and dependent systems may need to account for the fact that the same message could be received twice.

## Handling exceptions

As a general rule, every function should include a `try/catch` block at the highest level of code. Specifically, all Event Hubs functions should have a `catch` block. Now if an exception is thrown, the catch block can handle error before the pointer progresses.

### Retry mechanisms and policies

Some exceptions are transient in nature. That is, some exception may not reappear if an operation is attempted again a few moments later. There are a number of tools available that allow you to define robust retry-policies, which also help preserve processing order.

Introducing fault-handling libraries to your functions allow you to define both simple and advanced retry policies. For instance, you could implement a policy that follows a workflow such as the following:

- Try to insert a message three times (potentially with a delay between retries).
- If the eventual outcome of all retries is a failure, then add a message to a queue so processing can continue on the stream.
- Corrupt or un-processed messages are then handled later.

> [!NOTE]
> [Polly](https://github.com/App-vNext/Polly) is an example of a resilience and transient-fault-handling library for C# applications.

When working with pre-complied C# class libraries, [exception filters](https://docs.microsoft.com/dotnet/csharp/language-reference/keywords/try-catch) allow you to run run code whenever an unhandled exception occurs.

Samples that demonstrate how to use exception filters are available in the [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki) repo.

## Non-exception errors or issues

Some issues arise even when an error is not present. For instance, consider a failure that occurs in the middle of an execution?

As stated earlier — if a function doesn’t complete execution the offset pointer is never progressed, so the same messages will process again when a new instance begins to pull messages. To simulate this, during the 100,000 message processing I manually stopped, started, and restarted my function app. Here are some of the results (left). You’ll notice while I processed everything and everything is in order, some messages were processed more than once (after 700 I reprocess 601+). That overall is a good thing as it gives me at-least-once guarantees, but does mean my code may require some level of idempotency.

Circuit breaker and stopping the line
The above patterns and behaviors are helpful to retry and make a best-effort at processing any event. While a few failures here and there may be acceptable, what if a significant number of failures are happening and I want to stop triggering on new events until the system reaches a healthy state? This is often achieved with a “circuit breaker” pattern— where you can break the circuit of the event process and resume at a later time.

Polly (the library I used for retries) has support for some circuit-breaker functionality. However these patterns don’t translate as well when working across distributed ephemeral functions where the circuit spans multiple stateless instances. There are some interesting discussions on how this could be solved in Polly, but in the meantime I implemented it manually. There are two pieces that are needed for a circuit breaker in an event process:

Shared state across all instances to track and monitor health of the circuit
Master process that can manage the circuit state (open or closed)
For my purpose I used my Redis cache for #1, and Azure Logic Apps for #2. There are multiple other services that could fill both of these, but I found these two worked well.

Failure threshold across instances
Because I may have multiple instances processing events at a single time, I needed to have shared external state to monitor the health of the circuit. The rule I wanted was “If there are more than 100 eventual failures within 30 seconds across all instances, break the circuit and stop triggering on new messages.”

Without going too deep into specifics (all of these samples are in GitHub) I used the TTL and sorted set features in Redis to have a rolling window of the number of failures within the last 30 seconds. Whenever I add a new failure, I check the rolling window to see if the threshold has been crossed (more than 100 in last 30 seconds), and if so, I emit an event to Azure Event Grid. The relevant Redis code is here if interested. This allows me to detect and send an event and break the circuit.

Managing circuit state with Logic Apps
I used Azure Logic Apps to manage the circuit state as the connectors and stateful orchestration were a natural fit. After detecting I needed to break the circuit, I trigger a workflow (Event Grid trigger). The first step is to stop the Azure Function (with the Azure Resource connector), and send a notification email that includes some response options. I can then investigate the health of the circuit, and when things appear to be healthy I can respond to “Start” the circuit. This resumes the workflow which will then start the function, and messages will begin to be processed from the last Event Hub checkpoint.

IMAGE: The email I receive from Logic Apps after stopping the function. I can press either button and resume circuit when ready.

About 15 minutes ago I sent 100,000 messages and set each 100th message to fail. About ~5,000 messages in I hit the failure threshold, so an event was emitted to Event Grid. My Azure Logic App instantly fired, stopped the function, and sent me an email (above). If I now look at the current state of things in Redis I see a lot of partitions that are partially processed like this:

IMAGE: Bottom of the list — processed the first 200 messages for this partition key and was halted by Logic Apps

After clicking the email to restart the circuit, running the same Redis query I can see the function picked up and continued on from the last Event Hub checkpoint. No messages were lost, everything was processed in order, and I was able to break the circuit for as long as I needed with my logic app managing the state.

IMAGE: Waited for 17 minutes before I sent approval to re-connect the circuit

Hopefully this blog has been helpful in outlining some of the patterns and best practices available for reliably processing message streams with Azure Functions. With this understanding you should be able to take advantage of the dynamic scale and consumption pricing of functions without having to compromise on reliability.

I’ve included a link to the GitHub repo that has pointers to each of the branches for the different pivots of this sample: https://github.com/jeffhollan/functions-csharp-eventhub-ordered-processing. Feel free to reach out to me on Twitter @jeffhollan for any questions.
