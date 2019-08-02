---
title: include file
description: include file
services: event-hubs
author: sethmanheim
ms.service: event-hubs
ms.topic: include
ms.date: 05/22/2019
ms.author: spelluru
ms.custom: "include file"

---

The following table lists quotas and limits specific to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/). For information about Event Hubs pricing, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

| Limit | Scope | Notes | Value |
| --- | --- | --- | --- |
| Number of Event Hubs namespaces per subscription |Subscription |- |100 |
| Number of event hubs per namespace |Namespace |Subsequent requests for creation of a new event hub are rejected. |10 |
| Number of partitions per event hub |Entity |- |32 |
| Number of consumer groups per event hub |Entity |- |20 |
| Number of AMQP connections per namespace |Namespace |Subsequent requests for additional connections are rejected, and an exception is received by the calling code. |5,000 |
| Maximum size of Event Hubs event|Entity |- |1 MB |
| Maximum size of an event hub name |Entity |- |50 characters |
| Number of non-epoch receivers per consumer group |Entity |- |5 |
| Maximum retention period of event data |Entity |- |1-7 days |
| Maximum throughput units |Namespace |Exceeding the throughput unit limit causes your data to be throttled and generates a [server busy exception](/dotnet/api/microsoft.servicebus.messaging.serverbusyexception). To request a larger number of throughput units for a Standard tier, file a [support request](/azure/azure-supportability/how-to-create-azure-support-request). [Additional throughput units](../articles/event-hubs/event-hubs-auto-inflate.md) are available in blocks of 20 on a committed purchase basis. |20 |
| Number of authorization rules per namespace |Namespace|Subsequent requests for authorization rule creation are rejected.|12 |
| Number of calls to the GetRuntimeInformation method | Entity | - | 50 per second | 
| Number of virtual network (VNet) and IP Config rules | Entity | - | 128 | 

### Event Hubs Dedicated - quotas and limits
The Event Hubs Dedicated offering is billed at a fixed monthly price, with a minimum of 4 hours of usage. The Dedicated tier offers all the features of the Standard plan, but with enterprise scale capacity and limits for customers with demanding workloads. 

| Feature | Limits |
| --- | ---|
| Bandwidth |  20 CUs |
| Namespaces | 50 per CU |
| Event Hubs |  1000 per namespace |
| Ingress events | Included |
| Message Size | 1 Million Bytes |
| Partitions | 2000 per CU |
| Consumer groups | No limit per CU, 1000 per event hub |
| Brokered connections | 100 K included |
| Message Retention | Up to 7 days (90 day retention coming soon), 10 TB included per CU |
| Capture | Included |
