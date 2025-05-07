---
title: Transactions in Azure Service Bus
description: This article gives you an overview of transaction processing and the send via feature in Azure Service Bus.
ms.topic: concept-article
ms.date: 12/19/2024
ms.devlang: csharp
ms.custom: devx-track-csharp
# Customer intent: I want to know how Azure Service Bus supports transactions. 
---

# Overview of Service Bus transaction processing

This article discusses the transaction capabilities of Microsoft Azure Service Bus. Much of the discussion is illustrated by the [Transactions sample](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample06_Transactions.md). This article is limited to an overview of transaction processing and the *send via* feature in Service Bus, while the Atomic Transactions sample is broader and more complex in scope.

> [!NOTE]
> - The basic tier of Service Bus doesn't support transactions. The standard and premium tiers support transactions. For differences between these tiers, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).
> - Mixing management and messaging operations in a transaction isn't supported. 
> - JavaScript SDK doesn't support transactions. 

## Transactions in Service Bus

A *transaction* groups two or more operations together into an *execution scope*. By nature, such a transaction must ensure that all operations belonging to a given group of operations either succeed or fail jointly. In this respect transactions act as one unit, which is often referred to as *atomicity*.

Service Bus is a transactional message broker and ensures transactional integrity for all internal operations against its message stores. All transfers of messages in Service Bus, such as moving messages to a [dead-letter queue](service-bus-dead-letter-queues.md) or [automatic forwarding](service-bus-auto-forwarding.md) of messages between entities, are transactional. As such, if Service Bus accepts a message, it has already been stored and labeled with a sequence number. From then on, any message transfers within Service Bus are coordinated operations across entities, and will neither lead to loss (source succeeds and target fails) or to duplication (source fails and target succeeds) of the message.

Service Bus supports grouping operations against a single messaging entity (queue, topic, subscription) within the scope of a transaction. For example, you can send several messages to one queue from within a transaction scope, and the messages will only be committed to the queue's log when the transaction successfully completes.

## Operations within a transaction scope

The operations that can be performed within a transaction scope are as follows:

- Send
- Complete
- Abandon
- Deadletter
- Defer
- Renew lock

Receive operations aren't included, because it's assumed that the application acquires messages using the peek-lock mode, inside some receive loop or with a callback, and only then opens a transaction scope for processing the message.

The disposition of the message (complete, abandon, dead-letter, defer) then occurs within the scope of, and dependent on, the overall outcome of the transaction.

> [!IMPORTANT]
> Azure Service Bus doesn't retry an operation in case of an exception when the operation is in a transaction scope.

## Operations that don't enlist in transaction scopes

Be aware that message processing code that calls into databases and other services like Cosmos DB doesn't automatically enlist those downstream resources into the same transactional scope. For more information on how to handle these scenarios, look into the [guidelines on idempotent message processing](/azure/architecture/reference-architectures/containers/aks-mission-critical/mission-critical-data-platform#idempotent-message-processing).

## Transfers and "send via"

To enable transactional handover of data from a queue or topic to a processor, and then to another queue or topic, Service Bus supports *transfers*. In a transfer operation, a sender first sends a message to a *transfer queue or topic*, and the transfer queue or topic immediately moves the message to the intended destination queue or topic using the same robust transfer implementation that the autoforward capability relies on. The message is never committed to the transfer queue or topic's log such a way that it becomes visible for the transfer queue or topic's consumers.

The power of this transactional capability becomes apparent when the transfer queue or topic itself is the source of the sender's input messages. In other words, Service Bus can transfer the message to the destination queue or topic "via" the transfer queue or topic, while performing a complete (or defer, or dead-letter) operation on the input message, all in one atomic operation. 

If you need to receive from a topic subscription and then send to a queue or topic in the same transaction, the transfer entity must be a topic. In this scenario, start transaction scope on the topic, receive from the subscription with in the transaction scope, and send via the transfer topic to a queue or topic destination. 

> [!NOTE]
> - If a message is sent via a transfer queue in the scope of a transaction, `TransactionPartitionKey` is functionally equivalent to `PartitionKey`. It ensures that messages are kept together and in order as they are transferred. 
> - If the destination queue or topic is deleted, a 404 exception is raised.


### See it in code

To set up such transfers, you create a message sender that targets the destination queue via the transfer queue. You also have a receiver that pulls messages from that same queue. For example:

A simple transaction then uses these elements, as in the following example. To refer the full example, refer the [source code on GitHub](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample06_Transactions.md#transactions-across-entities):

```csharp
var options = new ServiceBusClientOptions { EnableCrossEntityTransactions = true };
await using var client = new ServiceBusClient(connectionString, options);

ServiceBusReceiver receiverA = client.CreateReceiver("queueA");
ServiceBusSender senderB = client.CreateSender("queueB");

ServiceBusReceivedMessage receivedMessage = await receiverA.ReceiveMessageAsync();

using (var ts = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
{
    await receiverA.CompleteMessageAsync(receivedMessage);
    await senderB.SendMessageAsync(new ServiceBusMessage());
    ts.Complete();
}
```

To learn more about the `EnableCrossEntityTransactions` property, see the following reference [ServiceBusClientBuilder.enableCrossEntityTransactions Method](/java/api/com.azure.messaging.servicebus.servicebusclientbuilder.enablecrossentitytransactions). 


## Timeout
A transaction times out after 2 minutes. The transaction timer starts when the first operation in the transaction starts. 


## Related content

For more information about Service Bus queues, see the following articles:

* [Chaining Service Bus entities with autoforwarding](service-bus-auto-forwarding.md)
* [Working with transactions sample](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample06_Transactions.md) (`Azure.Messaging.ServiceBus` library)
* [Azure Queue Storage and Service Bus queues compared](service-bus-azure-and-service-bus-queues-compared-contrasted.md)
