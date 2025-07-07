---
title: Guidelines for Azure storage table design
description: Understand guidelines for designing your Azure storage table service to support read and write operations efficiently.
services: storage
ms.service: azure-table-storage
author: akashdubey-ms
ms.author: akashdubey
ms.topic: article
ms.date: 04/23/2018
# Customer intent: As a data engineer, I want to design Azure storage tables for optimal read and write efficiency, so that I can ensure high performance and scalability for my applications.
---
# Guidelines for table design

Designing tables for use with the Azure storage table service is very different from design considerations for a relational database. This article describes guidelines for designing your Table service solution to be read efficient and write efficient.

## Design your Table service solution to be read-efficient

* ***Design for querying in read-heavy applications.*** When you are designing your tables, think about the queries (especially the latency sensitive ones) that you will execute before you think about how you will update your entities. This typically results in an efficient and performant solution.  
* ***Specify both PartitionKey and RowKey in your queries.*** *Point queries* such as these are the most efficient table service queries.  
* ***Consider storing duplicate copies of entities.*** Table storage is cheap so consider storing the same entity multiple times (with different keys) to enable more efficient queries.  
* ***Consider denormalizing your data.*** Table storage is cheap so consider denormalizing your data. For example, store summary entities so that queries for aggregate data only need to access a single entity.  
* ***Use compound key values.*** The only keys you have are **PartitionKey** and **RowKey**. For example, use compound key values to enable alternate keyed access paths to entities.  
* ***Use query projection.*** You can reduce the amount of data that you transfer over the network by using queries that select just the fields you need.  

## Design your Table service solution to be write-efficient  

* ***Do not create hot partitions.*** Choose keys that enable you to spread your requests across multiple partitions at any point of time.  
* ***Avoid spikes in traffic.*** Smooth the traffic over a reasonable period of time and avoid spikes in traffic.
* ***Don't necessarily create a separate table for each type of entity.*** When you require atomic transactions across entity types, you can store these multiple entity types in the same partition in the same table.
* ***Consider the maximum throughput you must achieve.*** You must be aware of the scalability targets for the Table service and ensure that your design will not cause you to exceed them.  

As you read this guide, you will see examples that put all of these principles into practice. 

## Next steps

- [Table design patterns](table-storage-design-patterns.md)
- [Design for querying](table-storage-design-for-query.md)
- [Encrypt table data](table-storage-design-encrypt-data.md)
- [Design for data modification](table-storage-design-for-modification.md)
