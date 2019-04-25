---
title: Design Azure storage tables for queries | Microsoft Docs
description: Design tables for queries in Azure table storage.
services: storage
author: MarkMcGeeAtAquent
ms.service: storage
ms.topic: article
ms.date: 04/23/2018
ms.author: sngun
ms.subservice: tables
---
# Design for querying
Table service solutions may be read intensive, write intensive, or a mix of the two. This article focuses on the things to bear in mind when you are designing your Table service to support read operations efficiently. Typically, a design that supports read operations efficiently is also efficient for write operations. However, there are additional considerations to bear in mind when designing to support write operations, discussed in the article [Design for data modification](table-storage-design-for-modification.md).

A good starting point for designing your Table service solution to enable you to read data efficiently is to ask "What queries will my application need to execute to retrieve the data it needs from the Table service?"  

> [!NOTE]
> With the Table service, it's important to get the design correct up front because it's difficult and expensive to change it later. For example, in a relational database it's often possible to address performance issues simply by adding indexes to an existing database: this is not an option with the Table service.  
> 
> 

This section focuses on the key issues you must address when you design your tables for querying. The topics covered in this section include:

* [How your choice of PartitionKey and RowKey impacts query performance](#how-your-choice-of-partitionkey-and-rowkey-impacts-query-performance)
* [Choosing an appropriate PartitionKey](#choosing-an-appropriate-partitionkey)
* [Optimizing queries for the Table service](#optimizing-queries-for-the-table-service)
* [Sorting data in the Table service](#sorting-data-in-the-table-service)

## How your choice of PartitionKey and RowKey impacts query performance
The following examples assume the table service is storing employee entities with the following structure (most of the examples omit the **Timestamp** property for clarity):  

| *Column name* | *Data type* |
| --- | --- |
| **PartitionKey** (Department Name) |String |
| **RowKey** (Employee Id) |String |
| **FirstName** |String |
| **LastName** |String |
| **Age** |Integer |
| **EmailAddress** |String |

The article [Azure Table storage overview](table-storage-overview.md) describes some of the key features of the Azure Table service that have a direct influence on designing for query. These result in the following general guidelines for designing Table service queries. Note that the filter syntax used in the examples below is from the Table service REST API, for more information see [Query Entities](https://docs.microsoft.com/rest/api/storageservices/Query-Entities).  

* A ***Point Query*** is the most efficient lookup to use and is recommended to be used for high-volume lookups or lookups requiring lowest latency. Such a query can use the indexes to locate an individual entity very efficiently by specifying both the **PartitionKey** and **RowKey** values. For example:
  $filter=(PartitionKey eq 'Sales') and (RowKey eq '2')  
* Second best is a ***Range Query*** that uses the **PartitionKey** and filters on a range of **RowKey** values to return more than one entity. The **PartitionKey** value identifies a specific partition, and the **RowKey** values identify a subset of the entities in that partition. For example:
  $filter=PartitionKey eq 'Sales' and RowKey ge 'S' and RowKey lt 'T'  
* Third best is a ***Partition Scan*** that uses the **PartitionKey** and filters on another non-key property and that may return more than one entity. The **PartitionKey** value identifies a specific partition, and the property values select for a subset of the entities in that partition. For example:
  $filter=PartitionKey eq 'Sales' and LastName eq 'Smith'  
* A ***Table Scan*** does not include the **PartitionKey** and is very inefficient because it searches all of the partitions that make up your table in turn for any matching entities. It will perform a table scan regardless of whether or not your filter uses the **RowKey**. For example:
  $filter=LastName eq 'Jones'  
* Queries that return multiple entities return them sorted in **PartitionKey** and **RowKey** order. To avoid resorting the entities in the client, choose a **RowKey** that defines the most common sort order.  

Note that using an "**or**" to specify a filter based on **RowKey** values results in a partition scan and is not treated as a range query. Therefore, you should avoid queries that use filters such as:
$filter=PartitionKey eq 'Sales' and (RowKey eq '121' or RowKey eq '322')  

For examples of client-side code that use the Storage Client Library to execute efficient queries, see:  

* [Execute a point query using the Storage Client Library](table-storage-design-patterns.md#executing-a-point-query-using-the-storage-client-library)
* [Retrieve multiple entities using LINQ](table-storage-design-patterns.md#retrieving-multiple-entities-using-linq)
* [Server-side projection](table-storage-design-patterns.md#server-side-projection)  

For examples of client-side code that can handle multiple entity types stored in the same table, see:  

* [Work with heterogeneous entity types](table-storage-design-patterns.md#working-with-heterogeneous-entity-types)  

## Choosing an appropriate PartitionKey
Your choice of **PartitionKey** should balance the need to enable the use of EGTs (to ensure consistency) against the requirement to distribute your entities across multiple partitions (to ensure a scalable solution).  

At one extreme, you could store all your entities in a single partition, but this may limit the scalability of your solution and would prevent the table service from being able to load-balance requests. At the other extreme, you could store one entity per partition, which would be highly scalable and which enables the table service to load-balance requests, but which would prevent you from using entity group transactions.  

An ideal **PartitionKey** is one that enables you to use efficient queries and that has sufficient partitions to ensure your solution is scalable. Typically, you will find that your entities will have a suitable property that distributes your entities across sufficient partitions.

> [!NOTE]
> For example, in a system that stores information about users or employees, UserID may be a good PartitionKey. You may have several entities that use a given UserID as the partition key. Each entity that stores data about a user is grouped into a single partition, and so these entities are accessible via entity group transactions, while still being highly scalable.
> 
> 

There are additional considerations in your choice of **PartitionKey** that relate to how you will insert, update, and delete entities. For more information, see [Designing tables for data modification](table-storage-design-for-modification.md).  

## Optimizing queries for the Table service
The Table service automatically indexes your entities using the **PartitionKey** and **RowKey** values in a single clustered index, hence the reason that point queries are the most efficient to use. However, there are no indexes other than that on the clustered index on the **PartitionKey** and **RowKey**.

Many designs must meet requirements to enable lookup of entities based on multiple criteria. For example, locating employee entities based on email, employee id, or last name. The patterns described in [Table Design Patterns](table-storage-design-patterns.md) address these types of requirement and describe ways of working around the fact that the Table service does not provide secondary indexes:  

* [Intra-partition secondary index pattern](table-storage-design-patterns.md#intra-partition-secondary-index-pattern) - Store multiple copies of each entity using different **RowKey** values (in the same partition) to enable fast and efficient lookups and alternate sort orders by using different **RowKey** values.  
* [Inter-partition secondary index pattern](table-storage-design-patterns.md#inter-partition-secondary-index-pattern) - Store multiple copies of each entity using different **RowKey** values in separate partitions or in separate tables to enable fast and efficient lookups and alternate sort orders by using different **RowKey** values.  
* [Index Entities Pattern](table-storage-design-patterns.md#index-entities-pattern) - Maintain index entities to enable efficient searches that return lists of entities.  

## Sorting data in the Table service
The Table service returns entities sorted in ascending order based on **PartitionKey** and then by **RowKey**. These keys are string values and to ensure that numeric values sort correctly, you should convert them to a fixed length and pad them with zeroes. For example, if the employee id value you use as the **RowKey** is an integer value, you should convert employee id **123** to **00000123**.  

Many applications have requirements to use data sorted in different orders: for example, sorting employees by name, or by joining date. The following patterns address how to alternate sort orders for your entities:  

* [Intra-partition secondary index pattern](table-storage-design-patterns.md#intra-partition-secondary-index-pattern) - Store multiple copies of each entity using different RowKey values (in the same partition) to enable fast and efficient lookups and alternate sort orders by using different RowKey values.  
* [Inter-partition secondary index pattern](table-storage-design-patterns.md#inter-partition-secondary-index-pattern) - Store multiple copies of each entity using different RowKey values in separate partitions in separate tables to enable fast and efficient lookups and alternate sort orders by using different RowKey values.
* [Log tail pattern](table-storage-design-patterns.md#log-tail-pattern) - Retrieve the *n* entities most recently added to a partition by using a **RowKey** value that sorts in reverse date and time order.  

## Next steps

- [Table design patterns](table-storage-design-patterns.md)
- [Modeling relationships](table-storage-design-modeling.md)
- [Encrypt table data](table-storage-design-encrypt-data.md)
- [Design for data modification](table-storage-design-for-modification.md)
