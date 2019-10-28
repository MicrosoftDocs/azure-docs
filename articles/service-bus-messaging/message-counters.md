---
title: Azure Service Bus message count | Microsoft Docs
description: Retrieve the count of Azure Service Bus messages.
services: service-bus-messaging
documentationcenter: ''
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2019
ms.author: aschhab

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

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
