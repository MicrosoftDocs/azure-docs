<properties 
    pageTitle="Service Bus dead-letter queues | Microsoft Azure" 
    description="Overview of Azure Service Bus dead-letter queues" 
    services="service-bus" 
    documentationCenter=".net" 
    authors="sethmanheim" 
    manager="timlt" 
    editor=""/>

<tags
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na" 
    ms.date="06/21/2016"
    ms.author="clemensv;sethm"/>

# Overview of Service Bus dead-letter queues

Service Bus queues and topic subscriptions provide a secondary sub-queue, called a *dead-letter queue* (DLQ). The dead-letter queue does not need to be explicitly created and cannot be deleted or otherwise managed independent of the main entity.

The purpose of the dead-letter queue is to hold messages that cannot be delivered to any receiver, or simply messages that could not be processed. Messages can then be removed from the DLQ and inspected. An application might, with help of an operator, correct issues and resubmit the message, log the fact that there was an error, and/or take corrective action. 

From an API and protocol perspective, the DLQ is mostly similar to any other queue, except that messages can only be submitted via the dead-letter gesture of the parent entity. In addition, time-to-live is not observed, and you can't dead-letter a message from a DLQ. The dead-letter queue fully supports peek-lock delivery and transactional operations.

Note that there is no automatic cleanup of the DLQ. Messages remain in the DLQ until you explicitly retrieve them from the DLQ and call [Complete()](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.completeasync.aspx) on the dead-letter message.

## Moving messages to the DLQ

There are several activities in Service Bus that cause messages to get pushed to the DLQ from within the messaging engine itself. An application can also explicitly push messages to the DLQ. 

As the message gets moved by the broker, two properties are added to the message as the broker calls its internal version of the [DeadLetter](https://msdn.microsoft.com/library/azure/hh291941.aspx) method on the message: `DeadLetterReason` and `DeadLetterErrorDescription`.

Applications can define their own codes for the `DeadLetterReason` property, but the system sets the following values.

| Condition                                                                                                                             | DeadLetterReason            | DeadLetterErrorDescription                                                       |
|---------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|----------------------------------------------------------------------------------|
| Always                                                                                                                                | HeaderSizeExceeded          | The size quota for this stream has been exceeded.                                |
| !TopicDescription.<br />EnableFilteringMessagesBeforePublishing and SubscriptionDescription.<br />EnableDeadLetteringOnFilterEvaluationExceptions | exception.GetType().Name    | exception.Message                                                                |
| EnableDeadLetteringOnMessageExpiration                                                                                                | TTLExpiredException         | The message expired and was dead lettered.                                       |
| SubscriptionDescription.RequiresSession                                                                                               | Session id is null.         | Session enabled entity doesn't allow a message whose session identifier is null. |
| !dead letter queue                                                                                                                    | MaxTransferHopCountExceeded | Null                                                                             |
| Application explicit dead lettering                                                                                                   | Specified by application    | Specified by application                                                         |

## Exceeding MaxDeliveryCount

Queues and subscriptions each have a [QueueDescription.MaxDeliveryCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.maxdeliverycount.aspx) and [SubscriptionDescription.MaxDeliveryCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptiondescription.maxdeliverycount.aspx) property respectively; the default value is 10. Whenever a message has been delivered under a lock ([ReceiveMode.PeekLock](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.receivemode.aspx)), but has been either explicitly abandoned or the lock has expired, the message's [BrokeredMessage.DeliveryCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.deliverycount.aspx) is incremented. When [DeliveryCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.deliverycount.aspx) exceeds [MaxDeliveryCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.maxdeliverycount.aspx), the message is moved to the DLQ, specifying the `MaxDeliveryCountExceeded` reason code.

This behavior cannot be disabled, but you can set [MaxDeliveryCount](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.maxdeliverycount.aspx) to a very large number.

## Exceeding TimeToLive

When the [QueueDescription.EnableDeadLetteringOnMessageExpiration](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.enabledeadletteringonmessageexpiration.aspx) or [SubscriptionDescription.EnableDeadLetteringOnMessageExpiration](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptiondescription.enabledeadletteringonmessageexpiration.aspx) property is set to **true** (the default is **false**), all expiring messages are moved to the DLQ, specifying the  `TTLExpiredException` reason code.

Note that expired messages are only purged and therefore moved to the DLQ when there is at least one active receiver pulling on the main queue or subscription; that behavior is by design.

## Errors while processing subscription rules

When the [SubscriptionDescription.EnableDeadLetteringOnFilterEvaluationExceptions](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptiondescription.enabledeadletteringonfilterevaluationexceptions.aspx) property is enabled for a subscription, any errors that occur while a subscription's SQL filter rule executes are captured in the DLQ along with the offending message.

## Application-level dead-lettering

In addition to the system-provided dead-lettering features, applications can use the DLQ to explicitly reject unacceptable messages. This may include messages that cannot be properly processed due to any sort of system issue, messages that hold malformed payloads, or messages that fail authentication when some message-level security scheme is used.

## Example

The following code snippet creates a message receiver. In the receive loop for the main queue, the code retrieves the message with [Receive(TimeSpan.Zero)](https://msdn.microsoft.com/library/azure/dn130350.aspx), which asks the broker to instantly return any message readily available, or to return with no result. If the code receives a message, it immediately abandons it, which increments the  `DeliveryCount`. Once the system moves the message to the DLQ, the main queue is empty and the loop exits, as [ReceiveAsync](https://msdn.microsoft.com/library/azure/dn130350.aspx) returns **null**.

```
var receiver = await receiverFactory.CreateMessageReceiverAsync(queueName, ReceiveMode.PeekLock);
while(true)
{
    var msg = await receiver.ReceiveAsync(TimeSpan.Zero);
    if (msg != null)
    {
        Console.WriteLine("Picked up message; DeliveryCount {0}", msg.DeliveryCount);
        await msg.AbandonAsync();
    }
    else
    {
        break;
    }
}
```

## Next steps

See the following articles for more information about Service Bus queues:

- [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
- [Azure Queues and Service Bus queues compared](service-bus-azure-and-service-bus-queues-compared-contrasted.md)
