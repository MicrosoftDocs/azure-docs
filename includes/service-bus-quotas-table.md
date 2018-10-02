---
title: include file
description: include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 08/29/2018
ms.author: spelluru
ms.custom: "include file"

---

The following table lists quota information specific to Service Bus messaging. For information about pricing and other quotas for Service Bus, see the [Service Bus Pricing](https://azure.microsoft.com/pricing/details/service-bus/) overview.

| Quota Name | Scope | Notes | Value |
| --- | --- | --- | --- | --- |
| Maximum number of basic / standard namespaces per Azure subscription |Namespace |Subsequent requests for additional basic / standard namespaces are rejected by the portal. |100|
| Maximum number of premium namespaces per Azure subscription |Namespace |Subsequent requests for additional premium namespaces are rejected by the portal. |10 |
| Queue/topic size |Entity |Defined upon creation of the queue/topic. <br/><br/> Subsequent incoming messages are rejected and an exception is received by the calling code. |1, 2, 3, 4 GB or 5 GB.<br /><br />In the Premium SKU, as well as Standard with [partitioning](/azure/service-bus-messaging/service-bus-partitioning) enabled, the maximum queue/topic size is 80 GB. |
| Number of concurrent connections on a namespace |Namespace |Subsequent requests for additional connections are rejected and an exception is received by the calling code. REST operations do not count towards concurrent TCP connections. |NetMessaging: 1,000<br /><br />AMQP: 5,000 |
| Number of concurrent receive requests on a queue/topic/subscription entity |Entity |Subsequent receive requests are rejected and an exception is received by the calling code. This quota applies to the combined number of concurrent receive operations across all subscriptions on a topic. |5,000 |
| Number of topics/queues per namespace |Namespace |Subsequent requests for creation of a new topic or queue on the namespace are rejected. As a result, if configured through the [Azure portal][Azure portal], an error message is generated. If called from the management API, an exception is received by the calling code. |10,000 (Basic/Standard tier). The total number of topics and queues in a namespace must be less than or equal to 10,000. <br/><br/>For premium tier, 1000 per messaging unit(MU). Maximum limit is 4000. |
| Number of [partitioned topics/queues](/azure/service-bus-messaging/service-bus-partitioning) per namespace |Namespace |Subsequent requests for creation of a new partitioned topic or queue on the namespace are rejected. As a result, if configured through the [Azure portal][Azure portal], an error message is generated. If called from the management API, a **QuotaExceededException** exception is received by the calling code. |Basic and Standard Tiers - 100<br/><br/>Partitioned entities are not supported in the [Premium](../articles/service-bus-messaging/service-bus-premium-messaging.md) tier.<br/><br />Each partitioned queue or topic counts towards the quota of 10,000 entities per namespace. |
| Maximum size of any messaging entity path: queue or topic |Entity |- |260 characters |
| Maximum size of any messaging entity name: namespace, subscription, or subscription rule |Entity |- |50 characters |
| Maximum size of a message [SessionID](/dotnet/api/microsoft.azure.servicebus.message.sessionid) | Entity |- | 128 |
| Message size for a queue/topic/subscription entity |Entity |Incoming messages that exceed these quotas are rejected and an exception is received by the calling code. |Maximum message size: 256 KB ([Standard tier](../articles/service-bus-messaging/service-bus-premium-messaging.md)) / 1 MB ([Premium tier](../articles/service-bus-messaging/service-bus-premium-messaging.md)). <br /><br />Due to system overhead, this limit is less than these values.<br /><br />Maximum header size: 64 KB<br /><br />Maximum number of header properties in property bag: **byte/int.MaxValue**<br /><br />Maximum size of property in property bag: No explicit limit. Limited by maximum header size. |
| Message property size for a queue/topic/subscription entity |Entity |A **SerializationException** exception is generated. |Maximum message property size for each property is 32 K. Cumulative size of all properties cannot exceed 64 K. This limit applies to the entire header of the [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage), which has both user properties as well as system properties (such as [SequenceNumber](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.sequencenumber), [Label](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.label), [MessageId](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.messageid), and so on). |
| Number of subscriptions per topic |Entity |Subsequent requests for creating additional subscriptions for the topic are rejected. As a result, if configured through the portal, an error message is shown. If called from the management API an exception is received by the calling code. |2,000 |
| Number of SQL filters per topic |Entity |Subsequent requests for creation of additional filters on the topic are rejected and an exception is received by the calling code. |2,000 |
| Number of correlation filters per topic |Entity |Subsequent requests for creation of additional filters on the topic are rejected and an exception is received by the calling code. |100,000 |
| Size of SQL filters/actions |Namespace |Subsequent requests for creation of additional filters are rejected and an exception is received by the calling code. |Maximum length of filter condition string: 1024 (1 K).<br /><br />Maximum length of rule action string: 1024 (1 K).<br /><br />Maximum number of expressions per rule action: 32. |
| Number of [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) rules per namespace, queue, or topic |Entity, namespace |Subsequent requests for creation of additional rules are rejected and an exception is received by the calling code. |Maximum number of rules: 12. <br /><br /> Rules that are configured on a Service Bus namespace apply to all queues and topics in that namespace. |
| Number of messages per transaction | Transaction | Additional incoming messages are rejected and an exception stating "Cannot send more than 100 messages in a single transaction" is received by the calling code. | 100 <br /><br /> For both **Send()** and **SendAsync()** operations. |

[Azure portal]: https://portal.azure.com