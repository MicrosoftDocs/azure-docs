---
title: include file
description: include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 12/13/2018
ms.author: spelluru
ms.custom: "include file"

---

The following table lists quota information specific to Azure Service Bus messaging. For information about pricing and other quotas for Service Bus, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

| Quota name | Scope | Notes | Value |
| --- | --- | --- | --- |
| Maximum number of Basic or Standard namespaces per Azure subscription |Namespace |Subsequent requests for additional Basic or Standard namespaces are rejected by the Azure portal. |100|
| Maximum number of Premium namespaces per Azure subscription |Namespace |Subsequent requests for additional Premium namespaces are rejected by the portal. |50 |
| Queue or topic size |Entity |Defined upon creation of the queue or topic. <br/><br/> Subsequent incoming messages are rejected, and an exception is received by the calling code. |1, 2, 3, 4 GB or 5 GB.<br /><br />In the Premium SKU, and the Standard SKU with [partitioning](/azure/service-bus-messaging/service-bus-partitioning) enabled, the maximum queue or topic size is 80 GB. |
| Number of concurrent connections on a namespace |Namespace |Subsequent requests for additional connections are rejected, and an exception is received by the calling code. REST operations don't count toward concurrent TCP connections. |NetMessaging: 1,000.<br /><br />AMQP: 5,000. |
| Number of concurrent receive requests on a queue, topic, or subscription entity |Entity |Subsequent receive requests are rejected, and an exception is received by the calling code. This quota applies to the combined number of concurrent receive operations across all subscriptions on a topic. |5,000 |
| Number of topics or queues per namespace |Namespace |Subsequent requests for creation of a new topic or queue on the namespace are rejected. As a result, if configured through the [Azure portal][Azure portal], an error message is generated. If called from the management API, an exception is received by the calling code. |1,000 for the Basic or Standard tier. The total number of topics and queues in a namespace must be less than or equal to 1,000. <br/><br/>For the Premium tier, 1,000 per messaging unit (MU). Maximum limit is 4,000. |
| Number of [partitioned topics or queues](/azure/service-bus-messaging/service-bus-partitioning) per namespace |Namespace |Subsequent requests for creation of a new partitioned topic or queue on the namespace are rejected. As a result, if configured through the [Azure portal][Azure portal], an error message is generated. If called from the management API, the exception **QuotaExceededException** is received by the calling code. |Basic and Standard tiers: 100.<br/><br/>Partitioned entities aren't supported in the [Premium](../articles/service-bus-messaging/service-bus-premium-messaging.md) tier.<br/><br />Each partitioned queue or topic counts toward the quota of 1,000 entities per namespace. |
| Maximum size of any messaging entity path: queue or topic |Entity |- |260 characters. |
| Maximum size of any messaging entity name: namespace, subscription, or subscription rule |Entity |- |50 characters. |
| Maximum size of a [message ID](/dotnet/api/microsoft.azure.servicebus.message.messageid) | Entity |- | 128 |
| Maximum size of a message [session ID](/dotnet/api/microsoft.azure.servicebus.message.sessionid) | Entity |- | 128 |
| Message size for a queue, topic, or subscription entity |Entity |Incoming messages that exceed these quotas are rejected, and an exception is received by the calling code. |Maximum message size: 256 KB for [Standard tier](../articles/service-bus-messaging/service-bus-premium-messaging.md), 1 MB for [Premium tier](../articles/service-bus-messaging/service-bus-premium-messaging.md). <br /><br />Due to system overhead, this limit is less than these values.<br /><br />Maximum header size: 64 KB.<br /><br />Maximum number of header properties in property bag: **byte/int.MaxValue**.<br /><br />Maximum size of property in property bag: No explicit limit. Limited by maximum header size. |
| Message property size for a queue, topic, or subscription entity |Entity | The exception **SerializationException** is generated. |Maximum message property size for each property is 32,000. Cumulative size of all properties can't exceed 64,000. This limit applies to the entire header of the [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage), which has both user properties and system properties, such as [SequenceNumber](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.sequencenumber), [Label](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.label), and [MessageId](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.messageid). |
| Number of subscriptions per topic |Entity |Subsequent requests for creating additional subscriptions for the topic are rejected. As a result, if configured through the portal, an error message is shown. If called from the management API, an exception is received by the calling code. |Standard and Premium tier: Each subscription counts against the quota of 1,000 entities, that is, queues, topics, and subscriptions, per namespace. |
| Number of SQL filters per topic |Entity |Subsequent requests for creation of additional filters on the topic are rejected, and an exception is received by the calling code. |2,000 |
| Number of correlation filters per topic |Entity |Subsequent requests for creation of additional filters on the topic are rejected, and an exception is received by the calling code. |100,000 |
| Size of SQL filters or actions |Namespace |Subsequent requests for creation of additional filters are rejected, and an exception is received by the calling code. |Maximum length of filter condition string: 1,024 (1 K).<br /><br />Maximum length of rule action string: 1,024 (1 K).<br /><br />Maximum number of expressions per rule action: 32. |
| Number of [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) rules per namespace, queue, or topic |Entity, namespace |Subsequent requests for creation of additional rules are rejected, and an exception is received by the calling code. |Maximum number of rules: 12. <br /><br /> Rules that are configured on a Service Bus namespace apply to all queues and topics in that namespace. |
| Number of messages per transaction | Transaction | Additional incoming messages are rejected, and an exception stating "Cannot send more than 100 messages in a single transaction" is received by the calling code. | 100 <br /><br /> For both **Send()** and **SendAsync()** operations. |

[Azure portal]: https://portal.azure.com
