---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 05/10/2021
ms.author: spelluru
ms.custom: "include file","fasttrack-edit","iot","event-hubs"

---

The following limits are common across all tiers. 

| Limit |  Notes | Value |
| --- |  --- | --- |
 Size of an event hub name |- | 256 characters |
| Size of a consumer group name | Kafka protocol doesn't require the creation of a consumer group. | <p>Kafka: 256 characters</p><p>AMQP: 50 characters |
| Number of non-epoch receivers per consumer group |- |5 |
| Number of authorization rules per namespace | Subsequent requests for authorization rule creation are rejected.|12 |
| Number of calls to the GetRuntimeInformation method |  - | 50 per second | 
| Number of virtual networks (VNet) | - | 128 | 
| Number of IP Config rules | - | 128 | 
| Maximum length of a schema group name | | 50 |  
| Maximum length of a schema name | | 100 |    
| Size in bytes per schema | | 1 MB |   
| Number of properties per schema group | | 1024 |
| Size in bytes per schema group property key | | 256 | 
| Size in bytes per schema group property value | | 1024 | 

