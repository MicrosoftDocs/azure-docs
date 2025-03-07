---
title: Azure Service Bus message transfers, locks, and settlement
description: This article provides an overview of Azure Service Bus message transfers, locks, and settlement operations.
ms.topic: article
ms.date: 02/22/2024
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Message transfers, locks, and settlement

The central capability of a message broker such as Service Bus is to accept messages into a queue or topic and hold them available for later retrieval. *Send* is the term that is commonly used for the transfer of a message into the message broker. *Receive* is the term commonly used for the transfer of a message to a retrieving client.

When a client sends a message, it usually wants to know whether the message is properly transferred to and accepted by the broker or whether some sort of error occurred. This positive or negative acknowledgment settles the understanding of both the client and broker about the transfer state of the message. Therefore, it's referred to as a *settlement*.

Likewise, when the broker transfers a message to a client, the broker and client want to establish an understanding of whether the message is successfully processed and can therefore be removed, or whether the message delivery or processing failed, and thus the message might have to be delivered again.

## Settling send operations

Using any of the supported Service Bus API clients, send operations into Service Bus are always explicitly settled, meaning that the API operation waits for an acceptance result from Service Bus to arrive, and then completes the send operation.

If the message is rejected by Service Bus, the rejection contains an error indicator and text with a **tracking-id** in it. The rejection also includes information about whether the operation can be retried with any expectation of success. In the client, this information is turned into an exception and raised to the caller of the send operation. If the message is accepted, the operation silently completes.

Advanced Messaging Queuing Protocol (AMQP) is the only protocol supported for .NET Standard, Java, JavaScript, Python, and Go clients. For [.NET Framework clients](service-bus-amqp-dotnet.md), you can use Service Bus Messaging Protocol (SBMP) or AMQP. When you use the AMQP protocol, message transfers and settlements are pipelined and asynchronous. We recommend that you use the asynchronous programming model API variants.

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]
 
A sender can put several messages on the wire in rapid succession without having to wait for each message to be acknowledged, as would otherwise be the case with the SBMP protocol or with HTTP 1.1. Those asynchronous send operations complete as the respective messages are accepted and stored, on partitioned entities or when send operation to different entities overlap. The completions might also occur out of the original send order.

The strategy for handling the outcome of send operations can have immediate and significant performance impact for your application. The examples in this section are written in C# and apply to Java futures, Java monos, JavaScript promises, and equivalent concepts in other languages.

If the application produces bursts of messages, illustrated here with a plain loop, and were to await the completion of each send operation before sending the next message, synchronous or asynchronous API shapes alike, sending 10 messages only completes after 10 sequential full round trips for settlement.

With an assumed 70-millisecond Transmission Control Protocol (TCP) roundtrip latency distance from an on-premises site to Service Bus and giving just 10 ms for Service Bus to accept and store each message, the following loop takes up at least 8 seconds, not counting payload transfer time or potential route congestion effects:

```csharp
for (int i = 0; i < 10; i++)
{
    // creating the message omitted for brevity
    await sender.SendMessageAsync(message);
}
```

If the application starts the 10 asynchronous send operations in immediate succession and awaits their respective completion separately, the round-trip time for those 10 send operations overlaps. The 10 messages are transferred in immediate succession, potentially even sharing TCP frames, and the overall transfer duration largely depends on the network-related time it takes to get the messages transferred to the broker.

With the same assumptions as for the prior loop, the total overlapped execution time for the following loop might stay well under one second:

```csharp
var tasks = new List<Task>();
for (int i = 0; i < 10; i++)
{
    tasks.Add(sender.SendMessageAsync(message));
}
await Task.WhenAll(tasks);
```

It's important to note that all asynchronous programming models use some form of memory-based, hidden work queue that holds pending operations. When the send API returns, the send task is queued up in that work queue, but the protocol gesture only commences once it's the task's turn to run. For code that tends to push bursts of messages and where reliability is a concern, care should be taken that not too many messages are put "in flight" at once, because all sent messages take up memory until they're put onto the wire.

Semaphores, as shown in the following code snippet in C#, are synchronization objects that enable such application-level throttling when needed. This use of a semaphore allows for at most 10 messages to be in flight at once. One of the 10 available semaphore locks is taken before the send and it's released as the send completes. The 11th pass through the loop waits until at least one of the prior send operations completes, and then makes its lock available:

```csharp
var semaphore = new SemaphoreSlim(10);

var tasks = new List<Task>();
for (int i = 0; i < 10; i++)
{
    await semaphore.WaitAsync();

    tasks.Add(sender.SendMessageAsync(message).ContinueWith((t)=>semaphore.Release()));
}
await Task.WhenAll(tasks);
```

Applications should **never** initiate an asynchronous send operation in a "fire and forget" manner without retrieving the outcome of the operation. Doing so can load the internal and invisible task queue up to memory exhaustion, and prevent the application from detecting send errors:

```csharp
for (int i = 0; i < 10; i++)
{
    sender.SendMessageAsync(message); // DON’T DO THIS
}
```

With a low-level AMQP client, Service Bus also accepts "presettled" transfers. A presettled transfer is a fire-and-forget operation for which the outcome, either way, isn't reported back to the client and the message is considered settled when sent. The lack of feedback to the client also means that there's no actionable data available for diagnostics, which means that this mode doesn't qualify for help via Azure support.

## Settling receive operations

For receive operations, the Service Bus API clients enable two different explicit modes: *Receive-and-Delete* and *Peek-Lock*.

### ReceiveAndDelete

The [Receive-and-Delete](/dotnet/api/azure.messaging.servicebus.servicebusreceivemode) mode tells the broker to consider all messages it sends to the receiving client as settled when sent. That means that the message is considered consumed as soon as the broker puts it onto the wire. If the message transfer fails, the message is lost.

The upside of this mode is that the receiver doesn't need to take further action on the message and is also not slowed by waiting for the outcome of the settlement. If the data contained in the individual messages have low value and/or are only meaningful for a very short time, this mode is a reasonable choice.

### PeekLock

The [Peek-Lock](/dotnet/api/azure.messaging.servicebus.servicebusreceivemode) mode tells the broker that the receiving client wants to settle received messages explicitly. The message is made available for the receiver to process, while held under an exclusive lock in the service so that other, competing receivers can't see it. The duration of the lock is initially defined at the queue or subscription level and can be extended by the client owning the lock, via the [RenewMessageLockAsync](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.renewmessagelockasync) operation. For details about renewing locks, see the [Renew locks](#renew-locks) section in this article. 

When a message is locked, other clients receiving from the same queue or subscription can take on locks and retrieve the next available messages not under active lock. When the lock on a message is explicitly released or when the lock expires, the message is placed at or near the front of the retrieval order for redelivery.

When the message is repeatedly released by receivers or they let the lock elapse for a defined number of times ([Max Delivery Count](service-bus-dead-letter-queues.md#maximum-delivery-count)), the message is automatically removed from the queue or subscription and placed into the associated dead-letter queue.

The receiving client initiates settlement of a received message with a positive acknowledgment when it calls the [Complete](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.completemessageasync) API for the message. It indicates to the broker that the message has been successfully processed and the message is removed from the queue or subscription. The broker replies to the receiver's settlement intent with a reply that indicates whether the settlement could be performed.

When the receiving client fails to process a message but wants the message to be redelivered, it can explicitly ask for the message to be released and unlocked instantly by calling the [Abandon](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.abandonmessageasync) API for the message or it can do nothing and let the lock elapse.

If a receiving client fails to process a message and knows that redelivering the message and retrying the operation won't help, it can reject the message, which moves it into the dead-letter queue by calling the [DeadLetter](/dotnet/api/azure.messaging.servicebus.servicebusreceiver.deadlettermessageasync) API on the message, which also allows setting a custom property including a reason code that can be retrieved with the message from the dead-letter queue.

> [!NOTE]
> A dead-letter subqueue exists for a queue or a topic subscription only when you have the [dead-letter feature](service-bus-dead-letter-queues.md) enabled for the queue or subscription. 

A special case of settlement is deferral. See the [Message deferral](message-deferral.md) for details. 

The `Complete`, `DeadLetter`, or `RenewLock` operations might fail due to network issues, if the held lock has expired, or there are other service-side conditions that prevent settlement. In one of the latter cases, the service sends a negative acknowledgment that surfaces as an exception in the API clients. If the reason is a broken network connection, the lock is dropped since Service Bus doesn't support recovery of existing AMQP links on a different connection.

If `Complete` fails, which occurs typically at the very end of message handling and in some cases after minutes of processing work, the receiving application can decide whether to preserve the state of the work and ignore the same message when it's delivered a second time, or whether to toss out the work result and retries as the message is redelivered.

The typical mechanism for identifying duplicate message deliveries is by checking the message-id, which can and should be set by the sender to a unique value, possibly aligned with an identifier from the originating process. A job scheduler would likely set the message-id to the identifier of the job it's trying to assign to a worker with the given worker, and the worker would ignore the second occurrence of the job assignment if that job is already done.

> [!IMPORTANT]
> It is important to note that the lock that PeekLock or SessionLock acquires on the message is volatile and may be lost in the following conditions
>   * Service Update
>   * OS update
>   * Changing properties on the entity (Queue, Topic, Subscription) while holding the lock.
>   * If the Service Bus Client application loses its connection to the Service Bus for any reason.
>
> When the lock is lost, Azure Service Bus will generate a MessageLockLostException or SessionLockLostException, which will surface in the client application. In this case, the client's default retry logic should automatically kick in and retry the operation. Moreover, the delivery count of the message will not be incremented.

## Renew locks
The default value for the lock duration is **1 minute**. You can specify a different value for the lock duration at the queue or subscription level. The client owning the lock can renew the message lock by using methods on the receiver object. Instead, you can use the automatic lock-renewal feature where you can specify the time duration for which you want to keep getting the lock renewed. 

It's best to set the lock duration to something higher than your normal processing time, so you don't have to renew the lock. The maximum value is 5 minutes, so you need to renew the lock if you want to have it longer. Having a longer lock duration than needed has some implications as well. For example, when your client stops working, the message will only become available again after the lock duration has passed.

## Next steps
- A special case of settlement is deferral. See the [Message deferral](message-deferral.md) for details. 
- To learn about dead-lettering, see [Dead-letter queues](service-bus-dead-letter-queues.md).
- To learn more about Service Bus messaging in general, see [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
