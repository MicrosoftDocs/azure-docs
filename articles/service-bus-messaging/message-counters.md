---
title: Azure Service Bus - message count
description: Retrieve the count of messages held in queues and subscriptions by using Azure Resource Manager and the Azure Service Bus NamespaceManager APIs.
ms.topic: article
ms.date: 06/23/2020
---

# Message counters

You can retrieve the count of messages held in queues and subscriptions by using Azure Resource Manager and the Service Bus [NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager) APIs in the .NET Framework SDK.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

With PowerShell, you can obtain the count as follows:

```powershell
(Get-AzServiceBusQueue -ResourceGroup mygrp -NamespaceName myns -QueueName myqueue).CountDetails
```

## Message count details

Knowing the active message count is useful in determining whether a queue builds up a backlog that requires more resources to process than what has currently been deployed. The following counter details are available in the [MessageCountDetails](/dotnet/api/microsoft.servicebus.messaging.messagecountdetails) class:

-   [ActiveMessageCount](/dotnet/api/microsoft.servicebus.messaging.messagecountdetails.activemessagecount#Microsoft_ServiceBus_Messaging_MessageCountDetails_ActiveMessageCount): Messages in the queue or subscription that are in the active state and ready for delivery.
-   [DeadLetterMessageCount](/dotnet/api/microsoft.servicebus.messaging.messagecountdetails.deadlettermessagecount#Microsoft_ServiceBus_Messaging_MessageCountDetails_DeadLetterMessageCount): Messages in the dead-letter queue.
-   [ScheduledMessageCount](/dotnet/api/microsoft.servicebus.messaging.messagecountdetails.scheduledmessagecount#Microsoft_ServiceBus_Messaging_MessageCountDetails_ScheduledMessageCount): Messages in the scheduled state.
-   [TransferDeadLetterMessageCount](/dotnet/api/microsoft.servicebus.messaging.messagecountdetails.transferdeadlettermessagecount#Microsoft_ServiceBus_Messaging_MessageCountDetails_TransferDeadLetterMessageCount): Messages that failed transfer into another queue or topic and have been moved into the transfer dead-letter queue.
-   [TransferMessageCount](/dotnet/api/microsoft.servicebus.messaging.messagecountdetails.transfermessagecount#Microsoft_ServiceBus_Messaging_MessageCountDetails_TransferMessageCount): Messages pending transfer into another queue or topic.

If an application wants to scale resources based on the length of the queue, it should do so with a measured pace. The acquisition of the message counters is an expensive operation inside the message broker, and executing it frequently directly and adversely impacts the entity performance.

> [!NOTE]
> The messages that are sent to a Service Bus topic are forwarded to subscriptions for that topic. So, the active message count on the topic itself is 0, as those messages have been successfully forwarded to the subscription. Get the message count at the subscription and verify that it's greater than 0. Even though you see messages at the subscription, they are actually stored in a storage owned by the topic. 

If you look at the subscriptions, then they would have non-zero message count (which add up to 323MB of space for this entire entity).

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
