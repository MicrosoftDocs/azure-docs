---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 09/10/2020
ms.author: spelluru
ms.custom: "include file"

---

The following tables provide quotas and limits specific to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/). For information about Event Hubs pricing, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

### Common limits for all tiers
The following limits are common across all tiers. 

| Limit |  Notes | Value |
| --- |  --- | --- |
| Number of Event Hubs namespaces per subscription |- |100 |
| Number of event hubs per namespace | Subsequent requests for creation of a new event hub are rejected. |10 |
| Number of partitions per event hub |- |32 |
| Size of an event hub name |- | 256 characters |
| Size of a consumer group name |- | 256 characters |
| Number of non-epoch receivers per consumer group |- |5 |
| Number of authorization rules per namespace | Subsequent requests for authorization rule creation are rejected.|12 |
| Number of calls to the GetRuntimeInformation method |  - | 50 per second | 
| Number of virtual network (VNet) and IP Config rules | - | 128 | 


### Basic and standard tiers
The following table shows limits that may be different for basic and standard tiers. 

| Limit | Notes | Basic | Standard |
| --- |  --- | -- | --- |
| Maximum size of Event Hubs event| &nbsp; | 256 KB | 1 MB |
| Number of consumer groups per event hub | &nbsp; |1 |20 |
| Number of AMQP connections per namespace | Subsequent requests for additional connections are rejected, and an exception is received by the calling code. |100 |5,000|
| Maximum retention period of event data | &nbsp; |1 day |1-7 days |
| Maximum throughput units |Exceeding the throughput unit limit causes your data to be throttled and generates a [server busy exception](/dotnet/api/microsoft.servicebus.messaging.serverbusyexception). To request a larger number of throughput units for a Standard tier, file a [support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). [Additional throughput units](../articles/event-hubs/event-hubs-auto-inflate.md) are available in blocks of 20 on a committed purchase basis. |20 | 20 | 

### Dedicated tier
The Event Hubs Dedicated offering is billed at a fixed monthly price, with a minimum of 4 hours of usage. The Dedicated tier offers all the features of the Standard plan, but with enterprise scale capacity and limits for customers with demanding workloads. 

| Feature | Limits |
| --- | ---|
| Bandwidth |  20 CUs |
| Namespaces | 50 per CU |
| Event hubs |  1000 per namespace |
| Message size | 1 MB |
| Partitions | 2000 per CU |
| Consumer groups | No limit per CU, 1000 per event hub |
| Brokered connections | 100 K included |
| Message retention time | 90 days, 10 TB included per CU |
| Ingress events | Included |
| Capture | Included |


### Schema registry limitations

#### Limits that are the same for **standard** and **dedicated** tiers 
| Feature | Limit | 
| --- |  --- | -- |
| Maximum length of a schema group name | 50 |  
| Maximum length of a schema name | 100 |    
| Size in bytes per schema | 1 MB |   
| Number of properties per schema group | 1024 |
| Size in bytes per group property key | 256 | 
| Size in bytes per group property value | 1024 | 


#### Limits that are different for **standard** and **dedicated** tiers 

| Limit | Standard | Dedicated | 
| --- |  --- | -- | --- |
| Size of the schema registry (namespace) in mega bytes | 25 |  1024 |
| Number of schema groups in a schema registry (namespace)| 1 (excluding the default one) | 1000 |
| Number of schema versions across all schema groups | 25 | 10000 |





