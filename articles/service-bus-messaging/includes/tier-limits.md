---
author: spelluru
ms.service: azure-service-bus
ms.topic: include
ms.date: 05/12/2025
ms.author: spelluru
---


The following table shows limits that are different for Basic, Standard, and Premium tiers.


| Quota name | Basic | Standard | Premium | Notes | 
| --- | --- | --- | --- | --- |
| Queue or topic size | 1, 2, 3, 4 GB or 5 GB<br/><br/>80 GB, if partitioning is enabled. | 1, 2, 3, 4 GB or 5 GB<br/><br/>80 GB, if partitioning is enabled. | 80 GB | Defined upon creation/updation of the queue or topic. <p>Total size of all entities in a namespace can't exceed the namespace size limit documented in the next row.</p><p>Subsequent incoming messages are rejected, and the calling code receives an exception.</p> <p>Currently, a large message (size \> 1 MB) sent to a queue is counted twice. And, a large message (size \> 1 MB) sent to a topic is counted X + 1 times, where X is the number of subscriptions to the topic. </p>|
| Namespace size | 400 GB | 400 GB | 1 TB per [messaging unit (MU)](../service-bus-premium-messaging.md).| Total size of all entities in a namespace can't exceed this limit. | 
| Number of topics or queues per namespace | 10,000 | 10,000 | 1,000 per messaging unit (MU). | Subsequent requests for creation of a new topic or queue on the namespace are rejected. As a result, if configured through the Azure portal, an error message is generated. If called from the management API, the calling code receives an exception. |
| Number of [partitioned topics or queues](/azure/service-bus-messaging/service-bus-partitioning) per namespace | 100 | 100 | N/A | Each partitioned queue or topic counts toward the quota of 1,000 entities per namespace. <p>Subsequent requests for creation of a new partitioned topic or queue in the namespace are rejected. As a result, if configured through the Azure portal, an error message is generated. If called from the management API, the exception **QuotaExceededException** is received by the calling code.</p> <p>If you want to have more partitioned entities in a basic or a standard tier namespace, create additional namespaces. </p>|
| Message size or batch size for a queue, topic, or subscription entity | 256 KB | 256 KB | 100 MB on AMQP<br/><br/>1 MB for on HTTP and SBMP | The message size includes the size of properties (system and user) and the size of payload. The size of system properties varies depending on your scenario. Incoming messages that exceed these quotas are rejected, and the calling code receives an exception. | 
| Number of subscriptions per topic | 2,000 | 2,000 | 2,000 | Subsequent requests for creating additional subscriptions for the topic are rejected. As a result, if configured through the portal, an error message is shown. If called from the management API, the calling code receives an exception. |
| Operations per second| 1,000 | 1,000 | N/A | Premium doesn't have fixed limitations on the operations per second. The throughput varies depending on the [number of MUs](../service-bus-premium-messaging.md#how-many-messaging-units-are-needed) and the characteristics of the workload. For more information on how the workload impacts the throughput, and how to optimize this, see [Best Practices for performance improvements using Service Bus Messaging](../service-bus-performance-improvements.md). |



