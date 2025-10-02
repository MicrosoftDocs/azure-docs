---
author: spelluru
ms.service: azure-service-bus
ms.topic: include
ms.date: 05/12/2025
ms.author: spelluru
---

The following limits are common across all tiers. 

| Quota name | Value | Notes | 
| --- | --- | --- |
| Maximum number of namespaces per Azure subscription | 1000 (default and maximum) | This limit is based on the `Microsoft.ServiceBus` provider, not based on the tier. Therefore, it's the total number of namespaces across all tiers. Subsequent requests for additional namespaces are rejected. |
| Number of concurrent connections on a namespace | Net Messaging: 1,000.<br /><br />AMQP: 5,000. | Subsequent requests for additional connections are rejected. REST operations don't count toward concurrent TCP connections. |
| Number of concurrent receive requests on a queue, topic, or subscription entity | 5,000 | Subsequent receive requests are rejected. This quota applies to the combined number of concurrent receive operations across all subscriptions on a topic. |
| Maximum size of any messaging entity path: queue or topic | 260 characters. | &nbsp; |
| Maximum size of any messaging entity name: namespace, subscription, or subscription rule | 50 characters. | &nbsp; |
| Maximum size of a message ID | 128 | &nbsp; |
| Maximum size of a message session ID | 128 | &nbsp; |
| Message property size for a queue, topic, or subscription entity | <p>Maximum message property size for each property is 32 KB.</p><p>Cumulative size of all properties can't exceed 64 KB. This limit applies to the entire header of the brokered message, which has both user properties and system properties, such as sequence number, label, and message ID.</p><p>Maximum number of header properties in property bag: **byte/int.MaxValue**.</p> | The exception `SerializationException` is generated.| 
| Number of SQL filters per topic | 2,000 | Subsequent requests for creation of additional filters on the topic are rejected, and the calling code receives an exception. |
| Number of correlation filters per topic | 100,000 | Subsequent requests for creation of additional filters on the topic are rejected, and the calling code receives an exception.	 |
| Size of SQL filters or actions | Maximum length of filter condition string: 1,024 (1 K).<br /><br />Maximum length of rule action string: 1,024 (1 K).<br /><br />Maximum number of expressions per rule action: 32. |Subsequent requests for creation of additional filters are rejected, and the calling code receives an exception. |
| Number of shared access authorization rules per namespace, queue, or topic | Maximum number of rules per entity type: 12. <br /><br /> Rules that are configured on a Service Bus namespace apply to all types: queues, topics. | Subsequent requests for creation of additional rules are rejected, and the calling code receives an exception. |
| Number of messages per transaction | 100 <br /><br /> For both **Send()** and **SendAsync()** operations. | Additional incoming messages are rejected, and the calling code receives an exception with the message: Can't send more than 100 messages in a single transaction. |
| Maximum number of messages deleted in DeleteMessagesAsync call | 500 | 	The DeleteMessagesAsync API supports deleting up to 500 messages per call. Requests exceeding this limit (e.g., 4000) will throw an ArgumentOutOfRangeException.|
| Maximum number of messages returned in PeekMessagesAsync call | 250 | 
| Number of virtual network and IP filter rules |  128 |&nbsp; |





