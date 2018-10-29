---
title: Azure Service Bus duplicate message detection | Microsoft Docs
description: Detect duplicate Service Bus messages
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

# Duplicate detection

If an application fails due to a fatal error immediately after it sends a message, and the restarted application instance erroneously believes that the prior message delivery did not occur, a subsequent send causes the same message to appear in the system twice.

It is also possible for an error at the client or network level to occur a moment earlier, and for a sent message to be committed into the queue, with the acknowledgment not successfully returned to the client. This scenario leaves the client in doubt about the outcome of the send operation.

Duplicate detection takes the doubt out of these situations by enabling the sender resend the same message, and the queue or topic discards any duplicate copies.

Enabling duplicate detection helps keep track of the application-controlled *MessageId* of all messages sent into a queue or topic during a specified time window. If any new message is sent with *MessageId* that was logged during the time window, the message is reported as accepted (the send operation succeeds), but the newly sent message is instantly ignored and dropped. No other parts of the message other than the *MessageId* are considered.

Application control of the identifier is essential, because only that allows the application to tie the *MessageId* to a business process context from which it can be predictably reconstructed when a failure occurs.

For a business process in which multiple messages are sent in the course of handling some application context, the *MessageId* may be a composite of the application-level context identifier, such as a purchase order number, and the subject of the message, for example, **12345.2017/payment**.

The *MessageId* can always be some GUID, but anchoring the identifier to the business process yields predictable repeatability, which is desired for leveraging the duplicate detection feature effectively.

## Enable duplicate detection

In the portal, the feature is turned on during entity creation with the **Enable duplicate detection** check box, which is off by default. The setting for creating new topics is equivalent.

![][1]

Programmatically, you set the flag with the [QueueDescription.requiresDuplicateDetection](/dotnet/api/microsoft.servicebus.messaging.queuedescription.requiresduplicatedetection#Microsoft_ServiceBus_Messaging_QueueDescription_RequiresDuplicateDetection) property on the full framework .NET API. With the Azure Resource Manager API, the value is set with the [queueProperties.requiresDuplicateDetection](/azure/templates/microsoft.servicebus/namespaces/queues#property-values) property.

The duplicate detection time history defaults to 30 seconds for queues and topics, with a maximum value of seven days. You can change this setting in the queue and topic properties window in the Azure portal.

![][2]

Programmatically, you can configure the size of the duplicate detection window during which message-ids are retained, using the [QueueDescription.DuplicateDetectionHistoryTimeWindow](/dotnet/api/microsoft.servicebus.messaging.queuedescription.duplicatedetectionhistorytimewindow#Microsoft_ServiceBus_Messaging_QueueDescription_DuplicateDetectionHistoryTimeWindow) property with the full .NET Framework API. With the Azure Resource Manager API, the value is set with the [queueProperties.duplicateDetectionHistoryTimeWindow](/azure/templates/microsoft.servicebus/namespaces/queues#property-values) property.

Enabling duplicate detection and the size of the window directly impact the queue (and topic) throughput, since all recorded message-ids must be matched against the newly submitted message identifier.

Keeping the window small means that fewer message-ids must be retained and matched, and throughput is impacted less. For high throughput entities that require duplicate detection, you should keep the window as small as possible.

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[1]: ./media/duplicate-detection/create-queue.png
[2]: ./media/duplicate-detection/queue-prop.png
