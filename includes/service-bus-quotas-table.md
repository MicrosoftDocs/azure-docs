---
title: include file
description: include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 06/08/2021
ms.author: spelluru
ms.custom: "include file"

---

The following table lists quota information specific to Azure Service Bus messaging. For information about pricing and other quotas for Service Bus, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

| Quota name | Scope | Value | Notes | 
| --- | --- | --- | --- |
| Maximum number of namespaces per Azure subscription |Namespace |  1000 (default and maximum) |Subsequent requests for additional namespaces are rejected. |
| Queue or topic size |Entity | 1, 2, 3, 4 GB or 5 GB.<p>In the Premium SKU, and the Standard SKU with [partitioning](../articles/service-bus-messaging/service-bus-partitioning.md) enabled, the maximum queue or topic size is 80 GB.</p><p>Total size limit for a premium namespace is 1 TB per [messaging unit](service-bus-premium-messaging.md). Total size of all entities in a namespace can't exceed this limit.</p> | Defined upon creation/updation of the queue or topic. <br/><br/> Subsequent incoming messages are rejected, and an exception is received by the calling code. |
| Number of concurrent connections on a namespace |Namespace |Net Messaging: 1,000.<br /><br />AMQP: 5,000. | Subsequent requests for additional connections are rejected, and an exception is received by the calling code. REST operations don't count toward concurrent TCP connections. |
| Number of concurrent receive requests on a queue, topic, or subscription entity |Entity | 5,000 |Subsequent receive requests are rejected, and an exception is received by the calling code. This quota applies to the combined number of concurrent receive operations across all subscriptions on a topic. |
| Number of topics or queues per namespace |Namespace | 10,000 for the Basic or Standard tier. The total number of topics and queues in a namespace must be less than or equal to 10,000. <br/><br/>For the Premium tier, 1,000 per messaging unit (MU). | Subsequent requests for creation of a new topic or queue on the namespace are rejected. As a result, if configured through the [Azure portal][Azure portal], an error message is generated. If called from the management API, an exception is received by the calling code. |
| Number of [partitioned topics or queues](../articles/service-bus-messaging/service-bus-partitioning.md) per namespace |Namespace | Basic and Standard tiers: 100.<br/><br/>Partitioned entities aren't supported in the [Premium](../articles/service-bus-messaging/service-bus-premium-messaging.md) tier.<br/><br />Each partitioned queue or topic counts toward the quota of 1,000 entities per namespace. | Subsequent requests for creation of a new partitioned topic or queue on the namespace are rejected. As a result, if configured through the [Azure portal][Azure portal], an error message is generated. If called from the management API, the exception **QuotaExceededException** is received by the calling code. <p>If you want to have more partitioned entities in a basic or a standard tier namespace, create additional namespaces. </p>|
| Maximum size of any messaging entity path: queue or topic |Entity |- |260 characters. |
| Maximum size of any messaging entity name: namespace, subscription, or subscription rule |Entity |- |50 characters. |
| Maximum size of a message ID | Entity |- | 128 |
| Maximum size of a message session ID | Entity |- | 128 |
| Message size for a queue, topic, or subscription entity |Entity |Incoming messages that exceed these quotas are rejected, and an exception is received by the calling code. |Maximum message size: 256 KB for [Standard tier](../articles/service-bus-messaging/service-bus-premium-messaging.md), 1 MB for [Premium tier](../articles/service-bus-messaging/service-bus-premium-messaging.md). <br /><br />Due to system overhead, this limit is less than these values.<br /><br />Maximum header size: 64 KB.<br /><br />Maximum number of header properties in property bag: **byte/int.MaxValue**.<br /><br />Maximum size of property in property bag: Both the property name and value are limited at 32KB. |
| Message property size for a queue, topic, or subscription entity |Entity | The exception `SerializationException` is generated. |Maximum message property size for each property is 32 KB. Cumulative size of all properties can't exceed 64 KB. This limit applies to the entire header of the brokered message, which has both user properties and system properties, such as sequence number, label, and message ID. |
| Number of subscriptions per topic |Entity |Subsequent requests for creating additional subscriptions for the topic are rejected. As a result, if configured through the portal, an error message is shown. If called from the management API, an exception is received by the calling code. |2,000 per-topic for the Standard tier and Premium tier. |
| Number of SQL filters per topic |Entity |Subsequent requests for creation of additional filters on the topic are rejected, and an exception is received by the calling code. |2,000 |
| Number of correlation filters per topic |Entity |Subsequent requests for creation of additional filters on the topic are rejected, and an exception is received by the calling code. |100,000 |
| Size of SQL filters or actions |Namespace |Subsequent requests for creation of additional filters are rejected, and an exception is received by the calling code. |Maximum length of filter condition string: 1,024 (1 K).<br /><br />Maximum length of rule action string: 1,024 (1 K).<br /><br />Maximum number of expressions per rule action: 32. |
| Number of shared access authorization rules per namespace, queue, or topic |Entity, namespace |Subsequent requests for creation of additional rules are rejected, and an exception is received by the calling code. |Maximum number of rules per entity type: 12. <br /><br /> Rules that are configured on a Service Bus namespace apply to all types: queues, topics. |
| Number of messages per transaction | Transaction | Additional incoming messages are rejected, and an exception stating "Cannot send more than 100 messages in a single transaction" is received by the calling code. | 100 <br /><br /> For both **Send()** and **SendAsync()** operations. |
| Number of virtual network and IP filter rules | Namespace | &nbsp; | 128 |

[Azure portal]: https://portal.azure.com
