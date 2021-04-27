---
title: Azure Service Bus - message deferral
description: This article explains how to defer delivery of Azure Service Bus messages. The message remains in the queue or subscription, but it's set aside.
ms.topic: conceptual
ms.date: 04/21/2021
---

# Message deferral
When a queue or subscription client receives a message that it's willing to process, but the processing isn't currently possible because of special circumstances, it has the option of "deferring" retrieval of the message to a later point. The message remains in the queue or subscription, but it's set aside.

> [!NOTE]
> Deferred messages won't be automatically moved to the dead-letter queue [after they expire](./service-bus-dead-letter-queues.md#time-to-live). This behaviour is by design.

## Sample scenarios
Deferral is a feature created specifically for workflow processing scenarios. Workflow frameworks may require certain operations to be processed in a particular order. They may have to postpone processing of some received messages until prescribed prior work that's informed by other messages has been completed.

A simple illustrative example is an order processing sequence in which a payment notification from an external payment provider appears in a system before the matching purchase order has been propagated from the store front to the fulfillment system. In that case, the fulfillment system might defer processing the payment notification until there's an order with which to associate it. In rendezvous scenarios, where messages from different sources drive a workflow forward, the real-time execution order may indeed be correct, but the messages reflecting the outcomes may arrive out of order.

Ultimately, deferral aids in reordering messages from the arrival order into an order in which they can be processed, while leaving those messages safely in the message store for which processing needs to be postponed.

If a message can't be processed because a particular resource for handling that message is temporarily unavailable but message processing shouldn't be summarily suspended, a way to put that message on the side for a few minutes is to remember the sequence number in a [scheduled message](message-sequencing.md) to be posted in a few minutes, and re-retrieve the deferred message when the scheduled message arrives. If a message handler depends on a database for all operations and that database is temporarily unavailable, it shouldn't use deferral, but rather suspend receiving messages altogether until the database is available again. 

## Retrieving deferred messages
Deferred messages remain in the main queue along with all other active messages (unlike dead-letter messages that live in a subqueue), but they can no longer be received using the regular receive operations. Deferred messages can be discovered via [message browsing](message-browsing.md) if an application loses track of them.

To retrieve a deferred message, its owner is responsible for remembering the sequence number as it defers it. Any receiver that knows the sequence number of a deferred message can later receive the message by using receive methods that take the sequence number as a parameter. For more information about sequence numbers, see [Message sequencing and timestamps](message-sequencing.md).

## Next steps
Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for Java](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/) - see the **receive_deferred_message_queue.py** sample. 
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/) - see the **advanced/deferral.js** sample. 
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/) - see the **advanced/deferral.ts** sample. 
- [Azure.Messaging.ServiceBus samples for .NET](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) - See the **Settling Messages** sample. 

Find samples for the older .NET and Java client libraries below:
- [Microsoft.Azure.ServiceBus samples for .NET](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/) - See the **Deferral** sample. 
- [azure-servicebus samples for Java](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus/MessageBrowse)
