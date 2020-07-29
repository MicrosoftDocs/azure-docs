---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 05/22/2019
ms.author: spelluru
ms.custom: "include file"

---

The following tables provide quotas and limits specific to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/). For information about Event Hubs pricing, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

The following limits are common across basic and standard tiers. 

| Limit | Scope | Notes | Value |
| --- | --- | --- | --- |
| Number of Event Hubs namespaces per subscription |Subscription |- |100 |
| Number of event hubs per namespace |Namespace |Subsequent requests for creation of a new event hub are rejected. |10 |
| Number of partitions per event hub |Entity |- |32 |
| Maximum size of an event hub name |Entity |- | 256 characters |
| Maximum size of a consumer group name |Entity |- | 256 characters |
| Number of non-epoch receivers per consumer group |Entity |- |5 |
| Maximum throughput units |Namespace |Exceeding the throughput unit limit causes your data to be throttled and generates a [server busy exception](/dotnet/api/microsoft.servicebus.messaging.serverbusyexception). To request a larger number of throughput units for a Standard tier, file a [support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). [Additional throughput units](../articles/event-hubs/event-hubs-auto-inflate.md) are available in blocks of 20 on a committed purchase basis. |20 |
| Number of authorization rules per namespace |Namespace|Subsequent requests for authorization rule creation are rejected.|12 |
| Number of calls to the GetRuntimeInformation method | Entity | - | 50 per second | 
| Number of virtual network (VNet) and IP Config rules | Entity | - | 128 | 

### Event Hubs Basic and Standard - quotas and limits
| Limit | Scope | Notes | Basic | Standard |
| --- | --- | --- | -- | --- |
| Maximum size of Event Hubs event|Entity | &nbsp; | 256 KB | 1 MB |
| Number of consumer groups per event hub |Entity | &nbsp; |1 |20 |
| Number of AMQP connections per namespace |Namespace |Subsequent requests for additional connections are rejected, and an exception is received by the calling code. |100 |5,000|
| Maximum retention period of event data |Entity | &nbsp; |1 day |1-7 days |
|Apache Kafka enabled namespace|Namespace |Event Hubs namespace streams applications using Kafka protocol |No | Yes |
|Capture |Entity | When enabled, micro-batches on the same stream |No |Yes |


### Event Hubs Dedicated - quotas and limits
The Event Hubs Dedicated offering is billed at a fixed monthly price, with a minimum of 4 hours of usage. The Dedicated tier offers all the features of the Standard plan, but with enterprise scale capacity and limits for customers with demanding workloads. 

| Feature | Limits |
| --- | ---|
| Bandwidth |  20 CUs |
| Namespaces | 50 per CU |
| Event Hubs |  1000 per namespace |
| Ingress events | Included |
| Message Size | 1 MB |
| Partitions | 2000 per CU |
| Consumer groups | No limit per CU, 1000 per event hub |
| Brokered connections | 100 K included |
| Message Retention | 90 days, 10 TB included per CU |
| Capture | Included |
