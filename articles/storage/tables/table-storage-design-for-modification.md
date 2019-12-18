---
title: Design Azure Table storage for data modification | Microsoft Docs
description: Design tables for data modification in Azure Table storage.
services: storage
author: MarkMcGeeAtAquent
ms.service: storage
ms.topic: article
ms.date: 04/23/2018
ms.author: sngun
ms.subservice: tables
---
# Design for data modification
This article focuses on the design considerations for optimizing inserts, updates, and deletes. In some cases, you will need to evaluate the trade-off between designs that optimize for querying against designs that optimize for data modification just as you do in designs for relational databases (although the techniques for managing the design trade-offs are different in a relational database). The section Table Design Patterns describes some detailed design patterns for the Table service and highlights some these trade-offs. In practice, you will find that many designs optimized for querying entities also work well for modifying entities.  

## Optimize the performance of insert, update, and delete operations
To update or delete an entity, you must be able to identify it by using the **PartitionKey** and **RowKey** values. In this respect, your choice of **PartitionKey** and **RowKey** for modifying entities should follow similar criteria to your choice to support point queries because you want to identify entities as efficiently as possible. You do not want to use an inefficient partition or table scan to locate an entity in order to discover the **PartitionKey** and **RowKey** values you need to update or delete it.  

The following patterns in the section Table design patterns address optimizing the performance or your insert, update, and delete operations:  

* [High volume delete pattern](table-storage-design-patterns.md#high-volume-delete-pattern) - Enable the deletion of a high volume of entities by storing all the entities for simultaneous deletion in their own separate table; you delete the entities by deleting the table.  
* [Data series pattern](table-storage-design-patterns.md#data-series-pattern) - Store complete data series in a single entity to minimize the number of requests you make.  
* [Wide entities pattern](table-storage-design-patterns.md#wide-entities-pattern) - Use multiple physical entities to store logical entities with more than 252 properties.  
* [Large entities pattern](table-storage-design-patterns.md#large-entities-pattern) - Use blob storage to store large property values.  

## Ensure consistency in your stored entities
The other key factor that influences your choice of keys for optimizing data modifications is how to ensure consistency by using atomic transactions. You can only use an EGT to operate on entities stored in the same partition.  

The following patterns in the article [Table design patterns](table-storage-design-patterns.md) address managing consistency:  

* [Intra-partition secondary index pattern](table-storage-design-patterns.md#intra-partition-secondary-index-pattern) - Store multiple copies of each entity using different **RowKey** values (in the same partition) to enable fast and efficient lookups and alternate sort orders by using different **RowKey** values.  
* [Inter-partition secondary index pattern](table-storage-design-patterns.md#inter-partition-secondary-index-pattern) - Store multiple copies of each entity using different RowKey values in separate partitions or in separate tables to enable fast and efficient lookups and alternate sort orders by using different **RowKey** values.  
* [Eventually consistent transactions pattern](table-storage-design-patterns.md#eventually-consistent-transactions-pattern) - Enable eventually consistent behavior across partition boundaries or storage system boundaries by using Azure queues.
* [Index entities pattern](table-storage-design-patterns.md#index-entities-pattern) - Maintain index entities to enable efficient searches that return lists of entities.  
* [Denormalization pattern](table-storage-design-patterns.md#denormalization-pattern) - Combine related data together in a single entity to enable you to retrieve all the data you need with a single point query.  
* [Data series pattern](table-storage-design-patterns.md#data-series-pattern) - Store complete data series in a single entity to minimize the number of requests you make.  

For information about entity group transactions, see the section [Entity group transactions](table-storage-design.md#entity-group-transactions).  

## Ensure your design for efficient modifications facilitates efficient queries
In many cases, a design for efficient querying results in efficient modifications, but you should always evaluate whether this is the case for your specific scenario. Some of the patterns in the article [Table Design Patterns](table-storage-design-patterns.md) explicitly evaluate trade-offs between querying and modifying entities, and you should always take into account the number of each type of operation.  

The following patterns in the article [Table design patterns](table-storage-design-patterns.md) address trade-offs between designing for efficient queries and designing for efficient data modification:  

* [Compound key pattern](table-storage-design-patterns.md#compound-key-pattern) - Use compound **RowKey** values to enable a client to lookup related data with a single point query.  
* [Log tail pattern](table-storage-design-patterns.md#log-tail-pattern) - Retrieve the *n* entities most recently added to a partition by using a **RowKey** value that sorts in reverse date and time order.  
