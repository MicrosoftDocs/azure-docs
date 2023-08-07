---
title: Azure Service Bus duplicate message detection | Microsoft Docs
description: This article explains how you can detect duplicates in Azure Service Bus messages. The duplicate message can be ignored and dropped.
ms.topic: article
ms.custom: ignite-2022
ms.date: 06/08/2023
---

# Duplicate detection

If an application fails due to a fatal error immediately after it sends a message, and the restarted application instance erroneously believes that the prior message delivery didn't occur, a subsequent send causes the same message to appear in the system twice.

It's also possible for an error at the client or network level to occur a moment earlier, and for a sent message to be committed into the queue, with the acknowledgment not successfully returned to the client. This scenario leaves the client in doubt about the outcome of the send operation.

Duplicate detection takes the doubt out of these situations by enabling the sender resend the same message, and the queue or topic discards any duplicate copies.

> [!NOTE]
> The basic tier of Service Bus doesn't support duplicate detection. The standard and premium tiers support duplicate detection. For differences between these tiers, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

## How it works
Enabling duplicate detection helps keep track of the application-controlled `MessageId` of all messages sent into a queue or topic during a specified time window. If any new message is sent with `MessageId` that was logged during the time window, the message is reported as accepted (the send operation succeeds), but the newly sent message is instantly ignored and dropped. No other parts of the message other than the `MessageId` are considered.

Application control of the identifier is essential, because only that allows the application to tie the `MessageId` to a business process context from which it can be predictably reconstructed when a failure occurs.

For a business process in which multiple messages are sent in the course of handling some application context, the `MessageId` may be a composite of the application-level context identifier, such as a purchase order number, and the subject of the message, for example, **12345.2017/payment**.

The `MessageId` can always be some GUID, but anchoring the identifier to the business process yields predictable repeatability, which is desired for using the duplicate detection feature effectively.

> [!IMPORTANT]
>- When **partitioning** is **enabled**, `MessageId+PartitionKey` is used to determine uniqueness. When sessions are enabled, partition key and session ID must be the same. 
>- When **partitioning** is **disabled** (default), only `MessageId` is used to determine uniqueness.
>- For information about `SessionId`, `PartitionKey`, and `MessageId`, see [Use of partition keys](service-bus-partitioning.md#use-of-partition-keys).

> [!NOTE]
> Scheduled messages are included in duplicate detection. Therefore, if you send a scheduled message and then send a duplicate non-scheduled message, the non-scheduled message gets dropped. Similarly, if you send a non-scheduled message and then a duplicate scheduled message, the scheduled message is dropped. 
 

## Duplicate detection window size

Apart from just enabling duplicate detection, you can also configure the size of the duplicate detection history time window during which message-ids are retained. This value defaults to 10 minutes for queues and topics, with a minimum value of 20 seconds to maximum value of 7 days.

Enabling duplicate detection and the size of the window directly impact the queue (and topic) throughput, since all recorded message IDs must be matched against the newly submitted message identifier.

Keeping the window small means that fewer message IDs must be retained and matched, and throughput is impacted less. For high throughput entities that require duplicate detection, you should keep the window as small as possible.

## Next steps
You can enable duplicate message detection using Azure portal, PowerShell, CLI, Resource Manager template, .NET, Java, Python, and JavaScript. For more information, see [Enable duplicate message detection](enable-duplicate-detection.md). 

In scenarios where client code is unable to resubmit a message with the same *MessageId* as before, it's important to design messages that can be safely reprocessed. This [blog post about idempotence](https://particular.net/blog/what-does-idempotent-mean) describes various techniques for how to do that.

Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/) 
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)

See samples for the older .NET and Java client libraries here:
- [Azure Service Bus client library samples for .NET (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/)
- [Azure Service Bus client library samples for Java (legacy)](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus)
