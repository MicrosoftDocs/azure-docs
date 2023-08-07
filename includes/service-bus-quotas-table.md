---
title: include file
description: include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 07/19/2022
ms.author: spelluru
ms.custom: "include file"

---

The following table lists quota information specific to Azure Service Bus messaging. For information about pricing and other quotas for Service Bus, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

| Quota name | Scope | Value | Notes | 
| --- | --- | --- | --- |
| Maximum number of namespaces per Azure subscription |Namespace |  1000 (default and maximum) |Subsequent requests for additional namespaces are rejected. |
| Queue or topic size |Entity | <p>1, 2, 3, 4 GB or 5 GB</p><p>In the Premium SKU, and the Standard SKU with [partitioning](../articles/service-bus-messaging/service-bus-partitioning.md) enabled, the maximum queue or topic size is 80 GB.</p><p>Total size limit for a premium namespace is 1 TB per [messaging unit](../articles/service-bus-messaging/service-bus-premium-messaging.md). Total size of all entities in a namespace can't exceed this limit.</p> | Defined upon creation/updation of the queue or topic. <br/><br/> Subsequent incoming messages are rejected, and an exception is received by the calling code. <p>Currently, a large message (size \> 1 MB) sent to a queue is counted twice. And, a large message (size \> 1 MB) sent to a topic is counted X + 1 times, where X is the number of subscriptions to the topic. </p>|
| Number of concurrent connections on a namespace |Namespace |Net Messaging: 1,000.<br /><br />AMQP: 5,000. | Subsequent requests for additional connections are rejected, and an exception is received by the calling code. REST operations don't count toward concurrent TCP connections. |
| Number of concurrent receive requests on a queue, topic, or subscription entity |Entity | 5,000 |Subsequent receive requests are rejected, and an exception is received by the calling code. This quota applies to the combined number of concurrent receive operations across all subscriptions on a topic. |
| Number of topics or queues per namespace |Namespace | 10,000 for the Basic or Standard tier. The total number of topics and queues in a namespace must be less than or equal to 10,000. <br/><br/>For the Premium tier, 1,000 per messaging unit (MU). | Subsequent requests for creation of a new topic or queue on the namespace are rejected. As a result, if configured through the [Azure portal], an error message is generated. If called from the management API, an exception is received by the calling code. |
| Number of [partitioned topics or queues](../articles/service-bus-messaging/service-bus-partitioning.md) per namespace |Namespace | Basic and Standard tiers: 100. Each partitioned queue or topic counts toward the quota of 1,000 entities per namespace. | Subsequent requests for creation of a new partitioned topic or queue in the namespace are rejected. As a result, if configured through the [Azure portal], an error message is generated. If called from the management API, the exception **QuotaExceededException** is received by the calling code. <p>If you want to have more partitioned entities in a basic or a standard tier namespace, create additional namespaces. </p>|
| Maximum size of any messaging entity path: queue or topic |Entity | 260 characters. | &nbsp; |
| Maximum size of any messaging entity name: namespace, subscription, or subscription rule |Entity | 50 characters. | &nbsp; |
| Maximum size of a message ID | Entity | 128 | &nbsp; |
| Maximum size of a message session ID | Entity | 128 | &nbsp; |
| Message size for a queue, topic, or subscription entity | Entity | 256 KB for [Standard tier](../articles/service-bus-messaging/service-bus-premium-messaging.md)<br/> 100 MB for [Premium tier](../articles/service-bus-messaging/service-bus-premium-messaging.md). <br /><br />The message size includes the size of properties (system and user) and the size of payload. The size of system properties varies depending on your scenario.  |Incoming messages that exceed these quotas are rejected, and an exception is received by the calling code. | 
| Message property size for a queue, topic, or subscription entity |Entity | <p>Maximum message property size for each property is 32 KB.</p><p>Cumulative size of all properties can't exceed 64 KB. This limit applies to the entire header of the brokered message, which has both user properties and system properties, such as sequence number, label, and message ID.</p><p>Maximum number of header properties in property bag: **byte/int.MaxValue**.</p> | The exception `SerializationException` is generated.| 
| Number of subscriptions per topic |Entity |2,000 per-topic for the Standard tier and Premium tier. |Subsequent requests for creating additional subscriptions for the topic are rejected. As a result, if configured through the portal, an error message is shown. If called from the management API, an exception is received by the calling code. |
| Number of SQL filters per topic |Entity |2,000 |Subsequent requests for creation of additional filters on the topic are rejected, and an exception is received by the calling code. |
| Number of correlation filters per topic	|Entity | 100,000 |	Subsequent requests for creation of additional filters on the topic are rejected, and an exception is received by the calling code.	 |
| Size of SQL filters or actions |Namespace |Maximum length of filter condition string: 1,024 (1 K).<br /><br />Maximum length of rule action string: 1,024 (1 K).<br /><br />Maximum number of expressions per rule action: 32. |Subsequent requests for creation of additional filters are rejected, and an exception is received by the calling code. |
| Number of shared access authorization rules per namespace, queue, or topic |Entity, namespace |Maximum number of rules per entity type: 12. <br /><br /> Rules that are configured on a Service Bus namespace apply to all types: queues, topics. |Subsequent requests for creation of additional rules are rejected, and an exception is received by the calling code. |
| Number of messages per transaction | Transaction | 100 <br /><br /> For both **Send()** and **SendAsync()** operations. | Additional incoming messages are rejected, and an exception stating "Can't send more than 100 messages in a single transaction" is received by the calling code. |
| Number of virtual network and IP filter rules | Namespace |  128 |&nbsp; |

[Azure portal]: https://portal.azure.com
