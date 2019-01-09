---
title: Azure Service Bus message transfers, locks, and settlement | Microsoft Docs
description: Overview of Service Bus message transfers and settlement operations
services: service-bus-messaging
documentationcenter: ''
author: clemensv
manager: timlt
editor: ''

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2018
ms.author: spelluru

---

# Message transfers, locks, and settlement

The central capability of a message broker such as Service Bus is to accept messages into a queue or topic and hold them available for later retrieval. *Send* is the term that is commonly used for the transfer of a message into the message broker. *Receive* is the term commonly used for the transfer of a message to a retrieving client.

When a client sends a message, it usually wants to know whether the message has been properly transferred to and accepted by the broker or whether some sort of error occurred. This positive or negative acknowledgment settles the client and the broker understanding about the transfer state of the message and is thus referred to as *settlement*.

Likewise, when the broker transfers a message to a client, the broker and client want to establish an understanding of whether the message has been successfully processed and can therefore be removed, or whether the message delivery or processing failed, and thus the message might have to be delivered again.

## Settling send operations

Using any of the supported Service Bus API clients, send operations into Service Bus are always explicitly settled, meaning that the API operation waits for an acceptance result from Service Bus to arrive, and then completes the send operation.

If the message is rejected by Service Bus, the rejection contains an error indicator and text with a "tracking-id" inside of it. The rejection also includes information about whether the operation can be retried with any expectation of success. In the client, this information is turned into an exception and raised to the caller of the send operation. If the message has been accepted, the operation silently completes.

When using the AMQP protocol, which is the exclusive protocol for the .NET Standard client and the Java client and [which is an option for the .NET Framework client](service-bus-amqp-dotnet.md), message transfers and settlements are pipelined and completely asynchronous, and it is recommended that you use the asynchronous programming model API variants.

A sender can put several messages on the wire in rapid succession without having to wait for each message to be acknowledged, as would otherwise be the case with the SBMP protocol or with HTTP 1.1. Those asynchronous send operations complete as the respective messages are accepted and stored, on partitioned entities or when send operation to different entities overlap. The completions might also occur out of the original send order.

The strategy for handling the outcome of send operations can have immediate and significant performance impact for your application. The examples in this section are written in C# and apply equivalently for Java Futures.

If the application produces bursts of messages, illustrated here with a plain loop, and were to await the completion of each send operation before sending the next message, synchronous or asynchronous API shapes alike, sending 10 messages only completes after 10 sequential full round trips for settlement.

With an assumed 70 millisecond TCP roundtrip latency distance from an on-premises site to Service Bus and giving just 10 ms for Service Bus to accept and store each message, the following loop takes up at least 8 seconds, not counting payload transfer time or potential route congestion effects:

```csharp
for (int i = 0; i < 100; i++)
{
  // creating the message omitted for brevity
  await client.SendAsync(…);
}
```

If the application starts the 10 asynchronous send operations in immediate succession and awaits their respective completion separately, the round trip time for those 10 send operations overlaps. The 10 messages are transferred in immediate succession, potentially even sharing TCP frames, and the overall transfer duration largely depends on the network-related time it takes to get the messages transferred to the broker.

Making the same assumptions as for the prior loop, the total overlapped execution time for the following loop might stay well under one second:

```csharp
var tasks = new List<Task>();
for (int i = 0; i < 100; i++)
{
  tasks.Add(client.SendAsync(…));
}
await Task.WhenAll(tasks);
```

It is important to note that all asynchronous programming models use some form of memory-based, hidden work queue that holds pending operations. When [SendAsync](/dotnet/api/microsoft.azure.servicebus.queueclient.sendasync#Microsoft_Azure_ServiceBus_QueueClient_SendAsync_Microsoft_Azure_ServiceBus_Message_) (C#) or **Send** (Java) return, the send task is queued up in that work queue but the protocol gesture only commences once it is the task's turn to run. For code that tends to push bursts of messages and where reliability is a concern, care should be taken that not too many messages are put "in flight" at once, because all sent messages take up memory until they have factually been put onto the wire.

Semaphores, as shown in the following code snippet in C#, are synchronization objects that enable such application-level throttling when needed. This use of a semaphore allows for at most 10 messages to be in flight at once. One of the 10 available semaphore locks is taken before the send and it is released as the send completes. The 11th pass through the loop waits until at least one of the prior sends has completed, and then makes its lock available:

```csharp
var semaphore = new SemaphoreSlim(10);

var tasks = new List<Task>();
for (int i = 0; i < 100; i++)
{
  await semaphore.WaitAsync();

  tasks.Add(client.SendAsync(…).ContinueWith((t)=>semaphore.Release()));
}
await Task.WhenAll(tasks);
```

Applications should **never** initiate an asynchronous send operation in a "fire and forget" manner without retrieving the outcome of the operation. Doing so can load the internal and invisible task queue up to memory exhaustion, and prevent the application from detecting send errors:

```csharp
for (int i = 0; i < 100; i++)
{

  client.SendAsync(message); // DON’T DO THIS
}
```

With a low-level AMQP client, Service Bus also accepts "pre-settled" transfers. A pre-settled transfer is a fire-and-forget operation for which the outcome, either way, is not reported back to the client and the message is considered settled when sent. The lack of feedback to the client also means that there is no actionable data available for diagnostics, which means that this mode does not qualify for help via Azure support.

## Settling receive operations

For receive operations, the Service Bus API clients enable two different explicit modes: *Receive-and-Delete* and *Peek-Lock*.

The [Receive-and-Delete](/dotnet/api/microsoft.servicebus.messaging.receivemode) mode tells the broker to consider all messages it sends to the receiving client as settled when sent. That means that the message is considered consumed as soon as the broker has put it onto the wire. If the message transfer fails, the message is lost.

The upside of this mode is that the receiver does not need to take further action on the message and is also not slowed by waiting for the outcome of the settlement. If the data contained in the individual messages have low value and/or are only meaningful for a very short time, this mode is a reasonable choice.

The [Peek-Lock](/dotnet/api/microsoft.servicebus.messaging.receivemode) mode tells the broker that the receiving client wants to settle received messages explicitly. The message is made available for the receiver to process, while held under an exclusive lock in the service so that other, competing receivers cannot see it. The duration of the lock is initially defined at the queue or subscription level and can be extended by the client owning the lock, via the [RenewLock](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver.renewlockasync#Microsoft_Azure_ServiceBus_Core_MessageReceiver_RenewLockAsync_System_String_) operation.

When a message is locked, other clients receiving from the same queue or subscription can take on locks and retrieve the next available messages not under active lock. When the lock on a message is explicitly released or when the lock expires, the message pops back up at or near the front of the retrieval order for redelivery.

When the message is repeatedly released by receivers or they let the lock elapse for a defined number of times ([maxDeliveryCount](/dotnet/api/microsoft.servicebus.messaging.queuedescription.maxdeliverycount#Microsoft_ServiceBus_Messaging_QueueDescription_MaxDeliveryCount)), the message is automatically removed from the queue or subscription and placed into the associated dead-letter queue.

The receiving client initiates settlement of a received message with a positive acknowledgment when it calls [Complete](/dotnet/api/microsoft.servicebus.messaging.queueclient.complete#Microsoft_ServiceBus_Messaging_QueueClient_Complete_System_Guid_) at the API level. This indicates to the broker that the message has been successfully processed and the message is removed from the queue or subscription. The broker replies to the receiver's settlement intent with a reply that indicates whether the settlement could be performed.

When the receiving client fails to process a message but wants the message to be redelivered, it can explicitly ask for the message to be released and unlocked instantly by calling [Abandon](/dotnet/api/microsoft.servicebus.messaging.queueclient.abandon) or it can do nothing and let the lock elapse.

If a receiving client fails to process a message and knows that redelivering the message and retrying the operation will not help, it can reject the message, which moves it into the dead-letter queue by calling [DeadLetter](/dotnet/api/microsoft.servicebus.messaging.queueclient.deadletter), which also allows setting a custom property including a reason code that can be retrieved with the message from the dead-letter queue.

A special case of settlement is deferral, which is discussed in a separate article.

The **Complete** or **Deadletter** operations as well as the **RenewLock** operations may fail due to network issues, if the held lock has expired, or there are other service-side conditions that prevent settlement. In one of the latter cases, the service sends a negative acknowledgment that surfaces as an exception in the API clients. If the reason is a broken network connection, the lock is dropped since Service Bus does not support recovery of existing AMQP links on a different connection.

If **Complete** fails, which occurs typically at the very end of message handling and in some cases after minutes of processing work, the receiving application can decide whether it preserves the state of the work and ignores the same message when it is delivered a second time, or whether it tosses out the work result and retries as the message is redelivered.

The typical mechanism for identifying duplicate message deliveries is by checking the message-id, which can and should be set by the sender to a unique value, possibly aligned with an identifier from the originating process. A job scheduler would likely set the message-id to the identifier of the job it is trying to assign to a worker with the given worker, and the worker would ignore the second occurrence of the job assignment if that job is already done.

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
