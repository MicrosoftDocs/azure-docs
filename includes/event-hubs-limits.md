---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 03/31/2021
ms.author: spelluru
ms.custom: "include file","fasttrack-edit","iot","event-hubs"

---

The following tables provide quotas and limits specific to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/). For information about Event Hubs pricing, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

### Common limits for all tiers
The following limits are common across all tiers. 

| Limit |  Notes | Value |
| --- |  --- | --- |
| Number of Event Hubs namespaces per subscription |- |100 |
| Number of event hubs per namespace | Subsequent requests for creation of a new event hub are rejected. |10 |
| Size of an event hub name |- | 256 characters |
| Size of a consumer group name | Kafka protocol doesn't require the creation of a consumer group. | <p>Kafka: 256 characters</p><p>AMQP: 50 characters |
| Number of non-epoch receivers per consumer group |- |5 |
| Number of authorization rules per namespace | Subsequent requests for authorization rule creation are rejected.|12 |
| Number of calls to the GetRuntimeInformation method |  - | 50 per second | 
| Number of virtual networks (VNet) | - | 128 | 
| Number of IP Config rules | - | 128 | 

### Basic vs. standard tiers
The following table shows limits that may be different for basic and standard tiers. 

| Limit | Notes | Basic | Standard |
|---|---|--|---|
| Maximum size of Event Hubs publication| &nbsp; | 256 KB | 1 MB |
| Number of consumer groups per event hub | &nbsp; |1 |20 |
| Number of AMQP connections per namespace | Subsequent requests for additional connections are rejected, and an exception is received by the calling code. |100 |5,000|
| Maximum retention period of event data | &nbsp; |1 day |1-7 days |
| Maximum throughput units |Exceeding this limit causes your data to be throttled and generates a [server busy exception](/dotnet/api/microsoft.servicebus.messaging.serverbusyexception). To request a larger number of throughput units for a Standard tier, file a [support request](../articles/azure-portal/supportability/how-to-create-azure-support-request.md). [Additional throughput units](../articles/event-hubs/event-hubs-auto-inflate.md) are available in blocks of 20 on a committed purchase basis. |20 | 20 | 
| Number of partitions per event hub | |32 | 32 | 

> [!NOTE]
>
> You can publish events individually or batched. 
> The publication limit (according to SKU) applies regardless of whether it is a single event or a batch. Publishing events larger than the maximum threshold will be rejected.

### Dedicated tier vs. standard tier
The Event Hubs Dedicated offering is billed at a fixed monthly price, with a minimum of 4 hours of usage. The Dedicated tier offers all the features of the Standard plan, but with enterprise scale capacity and limits for customers with demanding workloads. 

Refer to this [document](../articles/event-hubs/event-hubs-dedicated-cluster-create-portal.md) on how to create dedicated Event Hubs cluster using Azure portal.

| Feature | Standard | Dedicated |
| --- |:---|:---|
| Bandwidth | 20 TUs (up to 40 TUs)	| 20 CUs |
| Namespaces |  100 per subscription | 50 per CU (100 per subscription) |
| Event Hubs |  10 per namespace | 1000 per namespace |
| Ingress events | Pay per million events | Included |
| Message Size | 1 Million Bytes | 1 Million Bytes |
| Partitions | 32 per Event Hub | 1024 per event hub<br/>2000 per CU |
| Consumer groups | 20 per Event Hub | No limit per CU, 1000 per event hub |
| Brokered connections | 1,000 included, 5,000 max | 100 K included and max |
| Message Retention | 7 days, 84 GB included per TU | 90 days, 10 TB included per CU |
| Capture | Pay per hour | Included |


### Schema registry limitations

#### Limits that are the same for standard and dedicated tiers 
| Feature | Limit | 
|---|---|
| Maximum length of a schema group name | 50 |  
| Maximum length of a schema name | 100 |    
| Size in bytes per schema | 1 MB |   
| Number of properties per schema group | 1024 |
| Size in bytes per group property key | 256 | 
| Size in bytes per group property value | 1024 | 


#### Limits that are different for standard and dedicated tiers 

| Limit | Standard | Dedicated | 
|---|---|--|
| Size of the schema registry (namespace) in mega bytes | 25 |  1024 |
| Number of schema groups in a schema registry or namespace | 1 - excluding the default group | 1000 |
| Number of schema versions across all schema groups | 25 | 10000 |