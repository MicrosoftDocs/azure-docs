---
title: Design Azure Cosmos DB tables for scaling and performance 
description: "Azure Table storage design guide: Scalable and performant tables in Azure Cosmos DB and Azure Table storage"
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: conceptual
ms.date: 05/21/2019
author: sakash279
ms.author: akshanka
ms.custom: seodec18

---
# Azure Table storage table design guide: Scalable and performant tables

[!INCLUDE [storage-table-cosmos-db-tip-include](../../includes/storage-table-cosmos-db-tip-include.md)]

To design scalable and performant tables, you must consider a variety of factors, including cost. If you've previously designed schemas for relational databases, these considerations will be familiar to you. But while there are some similarities between Azure Table storage and relational models, there are also many important differences. These differences typically lead to different designs that might look counter-intuitive or wrong to someone familiar with relational databases, but that do make sense if you're designing for a NoSQL key/value store, such as Table storage.

Table storage is designed to support cloud-scale applications that can contain billions of entities ("rows" in relational database terminology) of data, or for datasets that must support high transaction volumes. You therefore need to think differently about how you store your data, and understand how Table storage works. A well-designed NoSQL data store can enable your solution to scale much further (and at a lower cost) than a solution that uses a relational database. This guide helps you with these topics.  

## About Azure Table storage
This section highlights some of the key features of Table storage that are especially relevant to designing for performance and scalability. If you're new to Azure Storage and Table storage, see [Introduction to Microsoft Azure Storage](../storage/common/storage-introduction.md) and [Get started with Azure Table storage by using .NET](table-storage-how-to-use-dotnet.md) before reading the remainder of this article. Although the focus of this guide is on Table storage, it does include some discussion of Azure Queue storage and Azure Blob storage, and how you might use them along with Table storage in a solution.  

Table storage uses a tabular format to store data. In the standard terminology, each row of the table represents an entity, and the columns store the various properties of that entity. Every entity has a pair of keys to uniquely identify it, and a timestamp column that Table storage uses to track when the entity was last updated. The timestamp field is added automatically, and you can't manually overwrite the timestamp with an arbitrary value. Table storage uses this last-modified timestamp (LMT) to manage optimistic concurrency.  

> [!NOTE]
> Table storage REST API operations also return an `ETag` value that it derives from the LMT. In this document, the terms ETag and LMT are used interchangeably, because they refer to the same underlying data.  
> 
> 

The following example shows a simple table design to store employee and department entities. Many of the examples shown later in this guide are based on this simple design.  

<table>
<tr>
<th>PartitionKey</th>
<th>RowKey</th>
<th>Timestamp</th>
<th></th>
</tr>
<tr>
<td>Marketing</td>
<td>00001</td>
<td>2014-08-22T00:50:32Z</td>
<td>
<table>
<tr>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td>Don</td>
<td>Hall</td>
<td>34</td>
<td>donh@contoso.com</td>
</tr>
</table>
</tr>
<tr>
<td>Marketing</td>
<td>00002</td>
<td>2014-08-22T00:50:34Z</td>
<td>
<table>
<tr>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td>Jun</td>
<td>Cao</td>
<td>47</td>
<td>junc@contoso.com</td>
</tr>
</table>
</tr>
<tr>
<td>Marketing</td>
<td>Department</td>
<td>2014-08-22T00:50:30Z</td>
<td>
<table>
<tr>
<th>DepartmentName</th>
<th>EmployeeCount</th>
</tr>
<tr>
<td>Marketing</td>
<td>153</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>Sales</td>
<td>00010</td>
<td>2014-08-22T00:50:44Z</td>
<td>
<table>
<tr>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td>Ken</td>
<td>Kwok</td>
<td>23</td>
<td>kenk@contoso.com</td>
</tr>
</table>
</td>
</tr>
</table>


So far, this design looks similar to a table in a relational database. The key differences are the mandatory columns and the ability to store multiple entity types in the same table. In addition, each of the user-defined properties, such as **FirstName** or **Age**, has a data type, such as integer or string, just like a column in a relational database. Unlike in a relational database, however, the schema-less nature of Table storage means that a property need not have the same data type on each entity. To store complex data types in a single property, you must use a serialized format such as JSON or XML. For more information, see [Understanding Table storage data model](https://msdn.microsoft.com/library/azure/dd179338.aspx).

Your choice of `PartitionKey` and `RowKey` is fundamental to good table design. Every entity stored in a table must have a unique combination of `PartitionKey` and `RowKey`. As with keys in a relational database table, the `PartitionKey` and `RowKey` values are indexed to create a clustered index that enables fast look-ups. Table storage, however, doesn't create any secondary indexes, so these are the only two indexed properties (some of the patterns described later show how you can work around this apparent limitation).  

A table is made up of one or more partitions, and many of the design decisions you make will be around choosing a suitable `PartitionKey` and `RowKey` to optimize your solution. A solution can consist of just a single table that contains all your entities organized into partitions, but typically a solution has multiple tables. Tables help you to logically organize your entities, and help you manage access to the data by using access control lists. You can drop an entire table by using a single storage operation.  

### Table partitions
The account name, table name, and `PartitionKey` together identify the partition within the storage service where Table storage stores the entity. As well as being part of the addressing scheme for entities, partitions define a scope for transactions (see the section later in this article, [Entity group transactions](#entity-group-transactions)), and form the basis of how Table storage scales. For more information on table partitions, see [Performance and scalability checklist for Table storage](../storage/tables/storage-performance-checklist.md).  

In Table storage, an individual node services one or more complete partitions, and the service scales by dynamically load-balancing partitions across nodes. If a node is under load, Table storage can split the range of partitions serviced by that node onto different nodes. When traffic subsides, Table storage can merge the partition ranges from quiet nodes back onto a single node.  

For more information about the internal details of Table storage, and in particular how it manages partitions, see [Microsoft Azure Storage: A highly available
cloud storage service with strong consistency](https://docs.microsoft.com/archive/blogs/windowsazurestorage/sosp-paper-windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency).  

### Entity group transactions
In Table storage, entity group transactions (EGTs) are the only built-in mechanism for performing atomic updates across multiple entities. EGTs are also referred to as *batch transactions*. EGTs can only operate on entities stored in the same partition (sharing the same partition key in a particular table), so anytime you need atomic transactional behavior across multiple entities, ensure that those entities are in the same partition. This is often a reason for keeping multiple entity types in the same table (and partition), and not using multiple tables for different entity types. A single EGT can operate on at most 100 entities.  If you submit multiple concurrent EGTs for processing, it's important to ensure that those EGTs don't operate on entities that are common across EGTs. Otherwise, you risk delaying processing.

EGTs also introduce a potential trade-off for you to evaluate in your design. Using more partitions increases the scalability of your application, because Azure has more opportunities for load-balancing requests across nodes. But this might limit the ability of your application to perform atomic transactions and maintain strong consistency for your data. Furthermore, there are specific scalability targets at the level of a partition that might limit the throughput of transactions you can expect for a single node.

For more information about scalability targets for Azure storage accounts, see [Scalability targets for standard storage accounts](../storage/common/scalability-targets-standard-account.md). For more information about scalability targets for Table storage, see [Scalability and performance targets for Table storage](../storage/tables/scalability-targets.md). Later sections of this guide discuss various design strategies that help you manage trade-offs such as this one, and discuss how best to choose your partition key based on the specific requirements of your client application.  

### Capacity considerations
The following table includes some of the key values to be aware of when you're designing a Table storage solution:  

| Total capacity of an Azure storage account | 500 TB |
| --- | --- |
| Number of tables in an Azure storage account |Limited only by the capacity of the storage account. |
| Number of partitions in a table |Limited only by the capacity of the storage account. |
| Number of entities in a partition |Limited only by the capacity of the storage account. |
| Size of an individual entity |Up to 1 MB, with a maximum of 255 properties (including the `PartitionKey`, `RowKey`, and `Timestamp`). |
| Size of the `PartitionKey` |A string up to 1 KB in size. |
| Size of the `RowKey` |A string up to 1 KB in size. |
| Size of an entity group transaction |A transaction can include at most 100 entities, and the payload must be less than 4 MB in size. An EGT can only update an entity once. |

For more information, see [Understanding the Table service data model](https://msdn.microsoft.com/library/azure/dd179338.aspx).  

### Cost considerations
Table storage is relatively inexpensive, but you should include cost estimates for both capacity usage and the quantity of transactions as part of your evaluation of any solution that uses Table storage. In many scenarios, however, storing denormalized or duplicate data in order to improve the performance or scalability of your solution is a valid approach to take. For more information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).  

## Guidelines for table design
These lists summarize some of the key guidelines you should keep in mind when you're designing your tables. This guide addresses them all in more detail later on. These guidelines are different from the guidelines you'd typically follow for relational database design.  

Designing your Table storage to be *read* efficient:

* **Design for querying in read-heavy applications.** When you're designing your tables, think about the queries (especially the latency-sensitive ones) you'll run before you think about how you'll update your entities. This typically results in an efficient and performant solution.  
* **Specify both `PartitionKey` and `RowKey` in your queries.** *Point queries* such as these are the most efficient Table storage queries.  
* **Consider storing duplicate copies of entities.** Table storage is cheap, so consider storing the same entity multiple times (with different keys), to enable more efficient queries.  
* **Consider denormalizing your data.** Table storage is cheap, so consider denormalizing your data. For example, store summary entities so that queries for aggregate data only need to access a single entity.  
* **Use compound key values.** The only keys you have are `PartitionKey` and `RowKey`. For example, use compound key values to enable alternate keyed access paths to entities.  
* **Use query projection.** You can reduce the amount of data that you transfer over the network by using queries that select just the fields you need.  

Designing your Table storage to be *write* efficient:  

* **Don't create hot partitions.** Choose keys that enable you to spread your requests across multiple partitions at any point of time.  
* **Avoid spikes in traffic.** Distribute the traffic over a reasonable period of time, and avoid spikes in traffic.
* **Don't necessarily create a separate table for each type of entity.** When you require atomic transactions across entity types, you can store these multiple entity types in the same partition in the same table.
* **Consider the maximum throughput you must achieve.** You must be aware of the scalability targets for Table storage, and ensure that your design won't cause you to exceed them.  

Later in this guide, you'll see examples that put all of these principles into practice.  

## Design for querying
Table storage can be read intensive, write intensive, or a mix of the two. This section considers designing to support read operations efficiently. Typically, a design that supports read operations efficiently is also efficient for write operations. However, there are additional considerations when designing to support write operations. These are discussed in the next section, [Design for data modification](#design-for-data-modification).

A good starting point to enable you to read data efficiently is to ask "What queries will my application need to run to retrieve the data it needs?"  

> [!NOTE]
> With Table storage, it's important to get the design correct up front, because it's difficult and expensive to change it later. For example, in a relational database, it's often possible to address performance issues simply by adding indexes to an existing database. This isn't an option with Table storage.  

### How your choice of `PartitionKey` and `RowKey` affects query performance
The following examples assume Table storage is storing employee entities with the following structure (most of the examples omit the `Timestamp` property for clarity):  

| Column name | Data type |
| --- | --- |
| `PartitionKey` (Department name) |String |
| `RowKey` (Employee ID) |String |
| `FirstName` |String |
| `LastName` |String |
| `Age` |Integer |
| `EmailAddress` |String |

Here are some general guidelines for designing Table storage queries. The filter syntax used in the following examples is from the Table storage REST API. For more information, see [Query entities](https://msdn.microsoft.com/library/azure/dd179421.aspx).  

* A *point query* is the most efficient lookup to use, and is recommended for high-volume lookups or lookups requiring the lowest latency. Such a query can use the indexes to locate an individual entity efficiently by specifying both the `PartitionKey` and `RowKey` values. For example:
  `$filter=(PartitionKey eq 'Sales') and (RowKey eq '2')`.  
* Second best is a *range query*. It uses the `PartitionKey`, and filters on a range of `RowKey` values to return more than one entity. The `PartitionKey` value identifies a specific partition, and the `RowKey` values identify a subset of the entities in that partition. For example:
  `$filter=PartitionKey eq 'Sales' and RowKey ge 'S' and RowKey lt 'T'`.  
* Third best is a *partition scan*. It uses the `PartitionKey`, and filters on another non-key property and might return more than one entity. The `PartitionKey` value identifies a specific partition, and the property values select for a subset of the entities in that partition. For example:
  `$filter=PartitionKey eq 'Sales' and LastName eq 'Smith'`.  
* A *table scan* doesn't include the `PartitionKey`, and is inefficient because it searches all of the partitions that make up your table for any matching entities. It performs a table scan regardless of whether or not your filter uses the `RowKey`. For example:
  `$filter=LastName eq 'Jones'`.  
* Azure Table storage queries that return multiple entities sort them in `PartitionKey` and `RowKey` order. To avoid resorting the entities in the client, choose a `RowKey` that defines the most common sort order. Query results returned by the Azure Table API in Azure Cosmos DB aren't sorted by partition key or row key. For a detailed list of feature differences, see [differences between Table API in Azure Cosmos DB and Azure Table storage](table-api-faq.md#table-api-vs-table-storage).

Using an "**or**" to specify a filter based on `RowKey` values results in a partition scan, and isn't treated as a range query. Therefore, avoid queries that use filters such as:
`$filter=PartitionKey eq 'Sales' and (RowKey eq '121' or RowKey eq '322')`.  

For examples of client-side code that use the Storage Client Library to run efficient queries, see:  

* [Run a point query by using the Storage Client Library](#run-a-point-query-by-using-the-storage-client-library)
* [Retrieve multiple entities by using LINQ](#retrieve-multiple-entities-by-using-linq)
* [Server-side projection](#server-side-projection)  

For examples of client-side code that can handle multiple entity types stored in the same table, see:  

* [Work with heterogeneous entity types](#work-with-heterogeneous-entity-types)  

### Choose an appropriate `PartitionKey`
Your choice of `PartitionKey` should balance the need to enable the use of EGTs (to ensure consistency) against the requirement to distribute your entities across multiple partitions (to ensure a scalable solution).  

At one extreme, you can store all your entities in a single partition. But this might limit the scalability of your solution, and would prevent Table storage from being able to load-balance requests. At the other extreme, you can store one entity per partition. This is highly scalable and enables Table storage to load-balance requests, but prevents you from using entity group transactions.  

An ideal `PartitionKey` enables you to use efficient queries, and has sufficient partitions to ensure your solution is scalable. Typically, you'll find that your entities will have a suitable property that distributes your entities across sufficient partitions.

> [!NOTE]
> For example, in a system that stores information about users or employees, `UserID` can be a good `PartitionKey`. You might have several entities that use a particular `UserID` as the partition key. Each entity that stores data about a user is grouped into a single partition. These entities are accessible via EGTs, while still being highly scalable.
> 
> 

There are additional considerations in your choice of `PartitionKey` that relate to how you insert, update, and delete entities. For more information, see [Design for data modification](#design-for-data-modification) later in this article.  

### Optimize queries for Table storage
Table storage automatically indexes your entities by using the `PartitionKey` and `RowKey` values in a single clustered index. This is the reason that point queries are the most efficient to use. However, there are no indexes other than that on the clustered index on the `PartitionKey` and `RowKey`.

Many designs must meet requirements to enable lookup of entities based on multiple criteria. For example, locating employee entities based on email, employee ID, or last name. The following patterns in the section [Table design patterns](#table-design-patterns) address these types of requirements. The patterns also describe ways of working around the fact that Table storage doesn't provide secondary indexes.  

* [Intra-partition secondary index pattern](#intra-partition-secondary-index-pattern): Store multiple copies of each entity by using different `RowKey` values (in the same partition). This enables fast and efficient lookups, and alternate sort orders by using different `RowKey` values.  
* [Inter-partition secondary index pattern](#inter-partition-secondary-index-pattern): Store multiple copies of each entity by using different `RowKey` values in separate partitions or in separate tables. This enables fast and efficient lookups, and alternate sort orders by using different `RowKey` values.  
* [Index entities pattern](#index-entities-pattern): Maintain index entities to enable efficient searches that return lists of entities.  

### Sort data in Table storage

Table storage returns query results sorted in ascending order, based on `PartitionKey` and then by `RowKey`.

> [!NOTE]
> Query results returned by the Azure Table API in Azure Cosmos DB aren't sorted by partition key or row key. For a detailed list of feature differences, see [differences between Table API in Azure Cosmos DB and Azure Table storage](table-api-faq.md#table-api-vs-table-storage).

Keys in Table storage are string values. To ensure that numeric values sort correctly, you should convert them to a fixed length, and pad them with zeroes. For example, if the employee ID value you use as the `RowKey` is an integer value, you should convert employee ID **123** to **00000123**. 

Many applications have requirements to use data sorted in different orders: for example, sorting employees by name, or by joining date. The following patterns in the section [Table design patterns](#table-design-patterns) address how to alternate sort orders for your entities:  

* [Intra-partition secondary index pattern](#intra-partition-secondary-index-pattern): Store multiple copies of each entity by using different `RowKey` values (in the same partition). This enables fast and efficient lookups, and alternate sort orders by using different `RowKey` values.  
* [Inter-partition secondary index pattern](#inter-partition-secondary-index-pattern): Store multiple copies of each entity by using different `RowKey` values in separate partitions in separate tables. This enables fast and efficient lookups, and alternate sort orders by using different `RowKey` values.
* [Log tail pattern](#log-tail-pattern): Retrieve the *n* entities most recently added to a partition, by using a `RowKey` value that sorts in reverse date and time order.  

## Design for data modification
This section focuses on the design considerations for optimizing inserts, updates, and deletes. In some cases, you'll need to evaluate the trade-off between designs that optimize for querying against designs that optimize for data modification. This evaluation is similar to what you do in designs for relational databases (although the techniques for managing the design trade-offs are different in a relational database). The section [Table design patterns](#table-design-patterns) describes some detailed design patterns for Table storage, and highlights some of these trade-offs. In practice, you'll find that many designs optimized for querying entities also work well for modifying entities.  

### Optimize the performance of insert, update, and delete operations
To update or delete an entity, you must be able to identify it by using the `PartitionKey` and `RowKey` values. In this respect, your choice of `PartitionKey` and `RowKey` for modifying entities should follow similar criteria to your choice to support point queries. You want to identify entities as efficiently as possible. You don't want to use an inefficient partition or table scan to locate an entity in order to discover the `PartitionKey` and `RowKey` values you need to update or delete it.  

The following patterns in the section [Table design patterns](#table-design-patterns) address optimizing the performance of your insert, update, and delete operations:  

* [High volume delete pattern](#high-volume-delete-pattern): Enable the deletion of a high volume of entities by storing all the entities for simultaneous deletion in their own separate table. You delete the entities by deleting the table.  
* [Data series pattern](#data-series-pattern): Store complete data series in a single entity to minimize the number of requests you make.  
* [Wide entities pattern](#wide-entities-pattern): Use multiple physical entities to store logical entities with more than 252 properties.  
* [Large entities pattern](#large-entities-pattern): Use blob storage to store large property values.  

### Ensure consistency in your stored entities
The other key factor that influences your choice of keys for optimizing data modifications is how to ensure consistency by using atomic transactions. You can only use an EGT to operate on entities stored in the same partition.  

The following patterns in the section [Table design patterns](#table-design-patterns) address managing consistency:  

* [Intra-partition secondary index pattern](#intra-partition-secondary-index-pattern): Store multiple copies of each entity by using different `RowKey` values (in the same partition). This enables fast and efficient lookups, and alternate sort orders by using different `RowKey` values.  
* [Inter-partition secondary index pattern](#inter-partition-secondary-index-pattern): Store multiple copies of each entity by using different `RowKey` values in separate partitions or in separate tables. This enables fast and efficient lookups, and alternate sort orders by using different `RowKey` values.  
* [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern): Enable eventually consistent behavior across partition boundaries or storage system boundaries by using Azure queues.
* [Index entities pattern](#index-entities-pattern): Maintain index entities to enable efficient searches that return lists of entities.  
* [Denormalization pattern](#denormalization-pattern): Combine related data together in a single entity, to enable you to retrieve all the data you need with a single point query.  
* [Data series pattern](#data-series-pattern): Store complete data series in a single entity, to minimize the number of requests you make.  

For more information, see [Entity group transactions](#entity-group-transactions) later in this article.  

### Ensure your design for efficient modifications facilitates efficient queries
In many cases, a design for efficient querying results in efficient modifications, but you should always evaluate whether this is the case for your specific scenario. Some of the patterns in the section [Table design patterns](#table-design-patterns) explicitly evaluate trade-offs between querying and modifying entities, and you should always take into account the number of each type of operation.  

The following patterns in the section [Table design patterns](#table-design-patterns) address trade-offs between designing for efficient queries and designing for efficient data modification:  

* [Compound key pattern](#compound-key-pattern): Use compound `RowKey` values to enable a client to look up related data with a single point query.  
* [Log tail pattern](#log-tail-pattern): Retrieve the *n* entities most recently added to a partition, by using a `RowKey` value that sorts in reverse date and time order.  

## Encrypt table data
The .NET Azure Storage client library supports encryption of string entity properties for insert and replace operations. The encrypted strings are stored on the service as binary properties, and they're converted back to strings after decryption.    

For tables, in addition to the encryption policy, users must specify the properties to be encrypted. Either specify an `EncryptProperty` attribute (for POCO entities that derive from `TableEntity`), or specify an encryption resolver in request options. An encryption resolver is a delegate that takes a partition key, row key, and property name, and returns a Boolean that indicates whether that property should be encrypted. During encryption, the client library uses this information to decide whether a property should be encrypted while writing to the wire. The delegate also provides for the possibility of logic around how properties are encrypted. (For example, if X, then encrypt property A; otherwise encrypt properties A and B.) It's not necessary to provide this information while reading or querying entities.

Merge isn't currently supported. Because a subset of properties might have been encrypted previously by using a different key, simply merging the new properties and updating the metadata will result in data loss. Merging either requires making extra service calls to read the pre-existing entity from the service, or using a new key per property. Neither of these are suitable for performance reasons.     

For information about encrypting table data, see [Client-side encryption and Azure Key Vault for Microsoft Azure Storage](../storage/common/storage-client-side-encryption.md).  

## Model relationships
Building domain models is a key step in the design of complex systems. Typically, you use the modeling process to identify entities and the relationships between them, as a way to understand the business domain and inform the design of your system. This section focuses on how you can translate some of the common relationship types found in domain models to designs for Table storage. The process of mapping from a logical data model to a physical NoSQL-based data model is different from that used when designing a relational database. Relational databases design typically assumes a data normalization process optimized for minimizing redundancy. Such design also assumes a declarative querying capability that abstracts the implementation of how the database works.  

### One-to-many relationships
One-to-many relationships between business domain objects occur frequently: for example, one department has many employees. There are several ways to implement one-to-many relationships in Table storage, each with pros and cons that might be relevant to the particular scenario.  

Consider the example of a large multinational corporation with tens of thousands of departments and employee entities. Every department has many employees and each employee is associated with one specific department. One approach is to store separate department and employee entities, such as the following:  

![Graphic showing a department entity and an employee entity][1]

This example shows an implicit one-to-many relationship between the types, based on the `PartitionKey` value. Each department can have many employees.  

This example also shows a department entity and its related employee entities in the same partition. You can choose to use different partitions, tables, or even storage accounts for the different entity types.  

An alternative approach is to denormalize your data, and store only employee entities with denormalized department data, as shown in the following example. In this particular scenario, this denormalized approach might not be the best if you have a requirement to be able to change the details of a department manager. To do this, you would need to update every employee in the department.  

![Graphic of employee entity][2]

For more information, see the [Denormalization pattern](#denormalization-pattern) later in this guide.  

The following table summarizes the pros and cons of each of the approaches for storing employee and department entities that have a one-to-many relationship. You should also consider how often you expect to perform various operations. It might be acceptable to have a design that includes an expensive operation if that operation only happens infrequently.  

<table>
<tr>
<th>Approach</th>
<th>Pros</th>
<th>Cons</th>
</tr>
<tr>
<td>Separate entity types, same partition, same table</td>
<td>
<ul>
<li>You can update a department entity with a single operation.</li>
<li>You can use an EGT to maintain consistency if you have a requirement to modify a department entity whenever you update/insert/delete an employee entity. For example, if you maintain a departmental employee count for each department.</li>
</ul>
</td>
<td>
<ul>
<li>You might need to retrieve both an employee and a department entity for some client activities.</li>
<li>Storage operations happen in the same partition. At high transaction volumes, this can result in a hotspot.</li>
<li>You can't move an employee to a new department by using an EGT.</li>
</ul>
</td>
</tr>
<tr>
<td>Separate entity types, different partitions, or tables or storage accounts</td>
<td>
<ul>
<li>You can update a department entity or employee entity with a single operation.</li>
<li>At high transaction volumes, this can help spread the load across more partitions.</li>
</ul>
</td>
<td>
<ul>
<li>You might need to retrieve both an employee and a department entity for some client activities.</li>
<li>You can't use EGTs to maintain consistency when you update/insert/delete an employee and update a department. For example, updating an employee count in a department entity.</li>
<li>You can't move an employee to a new department by using an EGT.</li>
</ul>
</td>
</tr>
<tr>
<td>Denormalize into single entity type</td>
<td>
<ul>
<li>You can retrieve all the information you need with a single request.</li>
</ul>
</td>
<td>
<ul>
<li>It can be expensive to maintain consistency if you need to update department information (this would require you to update all the employees in a department).</li>
</ul>
</td>
</tr>
</table>

How you choose among these options, and which of the pros and cons are most significant, depends on your specific application scenarios. For example, how often do you modify department entities? Do all your employee queries need the additional departmental information? How close are you to the scalability limits on your partitions or your storage account?  

### One-to-one relationships
Domain models can include one-to-one relationships between entities. If you need to implement a one-to-one relationship in Table storage, you must also choose how to link the two related entities when you need to retrieve them both. This link can be either implicit, based on a convention in the key values, or explicit, by storing a link in the form of `PartitionKey` and `RowKey` values in each entity to its related entity. For a discussion of whether you should store the related entities in the same partition, see the section [One-to-many relationships](#one-to-many-relationships).  

There are also implementation considerations that might lead you to implement one-to-one relationships in Table storage:  

* Handling large entities (for more information, see [Large entities pattern](#large-entities-pattern)).  
* Implementing access controls (for more information, see [Control access with shared access signatures](#control-access-with-shared-access-signatures)).  

### Join in the client
Although there are ways to model relationships in Table storage, don't forget that the two prime reasons for using Table storage are scalability and performance. If you find you are modeling many relationships that compromise the performance and scalability of your solution, you should ask yourself if it's necessary to build all the data relationships into your table design. You might be able to simplify the design, and improve the scalability and performance of your solution, if you let your client application perform any necessary joins.  

For example, if you have small tables that contain data that doesn't change often, you can retrieve this data once, and cache it on the client. This can avoid repeated roundtrips to retrieve the same data. In the examples we've looked at in this guide, the set of departments in a small organization is likely to be small and change infrequently. This makes it a good candidate for data that a client application can download once and cache as lookup data.  

### Inheritance relationships
If your client application uses a set of classes that form part of an inheritance relationship to represent business entities, you can easily persist those entities in Table storage. For example, you might have the following set of classes defined in your client application, where `Person` is an abstract class.

![Diagram of inheritance relationships][3]

You can persist instances of the two concrete classes in Table storage by using a single `Person` table. Use entities that look like the following:  

![Graphic showing customer entity and employee entity][4]

For more information about working with multiple entity types in the same table in client code, see [Work with heterogeneous entity types](#work-with-heterogeneous-entity-types) later in this guide. This provides examples of how to recognize the entity type in client code.  

## Table design patterns
In previous sections, you learned about how to optimize your table design for both retrieving entity data by using queries, and for inserting, updating, and deleting entity data. This section describes some patterns appropriate for use with Table storage. In addition, you'll see how you can practically address some of the issues and trade-offs raised previously in this guide. The following diagram summarizes the relationships among the different patterns:  

![Diagram of table design patterns][5]

The pattern map highlights some relationships between patterns (blue) and anti-patterns (orange) that are documented in this guide. There are of course many other patterns that are worth considering. For example, one of the key scenarios for Table storage is to use the [materialized view pattern](https://msdn.microsoft.com/library/azure/dn589782.aspx) from the [command query responsibility segregation](https://msdn.microsoft.com/library/azure/jj554200.aspx) pattern.  

### Intra-partition secondary index pattern
Store multiple copies of each entity by using different `RowKey` values (in the same partition). This enables fast and efficient lookups, and alternate sort orders by using different `RowKey` values. Updates between copies can be kept consistent by using EGTs.  

#### Context and problem
Table storage automatically indexes entities by using the `PartitionKey` and `RowKey` values. This enables a client application to retrieve an entity efficiently by using these values. For example, using the following table structure, a client application can use a point query to retrieve an individual employee entity by using the department name and the employee ID (the `PartitionKey` and `RowKey` values). A client can also retrieve entities sorted by employee ID within each department.

![Graphic of employee entity][6]

If you also want to find an employee entity based on the value of another property, such as email address, you must use a less efficient partition scan to find a match. This is because Table storage doesn't provide secondary indexes. In addition, there's no option to request a list of employees sorted in a different order than `RowKey` order.  

#### Solution
To work around the lack of secondary indexes, you can store multiple copies of each entity, with each copy using a different `RowKey` value. If you store an entity with the following structures, you can efficiently retrieve employee entities based on email address or employee ID. The prefix values for `RowKey`, `empid_`, and `email_` enable you to query for a single employee, or a range of employees, by using a range of email addresses or employee IDs.  

![Graphic showing employee entity with varying RowKey values][7]

The following two filter criteria (one looking up by employee ID, and one looking up by email address) both specify point queries:  

* $filter=(PartitionKey eq 'Sales') and (RowKey eq 'empid_000223')  
* $filter=(PartitionKey eq 'Sales') and (RowKey eq 'email_jonesj@contoso.com')  

If you query for a range of employee entities, you can specify a range sorted in employee ID order, or a range sorted in email address order. Query for entities with the appropriate prefix in the `RowKey`.  

* To find all the employees in the Sales department with an employee ID in the range 000100 to 000199, use:
  $filter=(PartitionKey eq 'Sales') and (RowKey ge 'empid_000100') and (RowKey le 'empid_000199')  
* To find all the employees in the Sales department with an email address starting with the letter "a", use:
  $filter=(PartitionKey eq 'Sales') and (RowKey ge 'email_a') and (RowKey lt 'email_b')  
  
The filter syntax used in the preceding examples is from the Table storage REST API. For more information, see [Query entities](https://msdn.microsoft.com/library/azure/dd179421.aspx).  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* Table storage is relatively cheap to use, so the cost overhead of storing duplicate data shouldn't be a major concern. However, you should always evaluate the cost of your design based on your anticipated storage requirements, and only add duplicate entities to support the queries your client application will run.  
* Because the secondary index entities are stored in the same partition as the original entities, ensure that you don't exceed the scalability targets for an individual partition.  
* You can keep your duplicate entities consistent with each other by using EGTs to update the two copies of the entity atomically. This implies that you should store all copies of an entity in the same partition. For more information, see [Use entity group transactions](#entity-group-transactions).  
* The value used for the `RowKey` must be unique for each entity. Consider using compound key values.  
* Padding numeric values in the `RowKey` (for example, the employee ID 000223) enables correct sorting and filtering based on upper and lower bounds.  
* You don't necessarily need to duplicate all the properties of your entity. For example, if the queries that look up the entities by using the email address in the `RowKey` never need the employee's age, these entities can have the following structure:

  ![Graphic of employee entity][8]

* Typically, it's better to store duplicate data and ensure that you can retrieve all the data you need with a single query, than to use one query to locate an entity and another to look up the required data.  

#### When to use this pattern
Use this pattern when:

- Your client application needs to retrieve entities by using a variety of different keys.
- Your client needs to retrieve entities in different sort orders.
- You can identify each entity by using a variety of unique values.

However, be sure that you don't exceed the partition scalability limits when you're performing entity lookups by using the different `RowKey` values.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Inter-partition secondary index pattern](#inter-partition-secondary-index-pattern)
* [Compound key pattern](#compound-key-pattern)
* [Entity group transactions](#entity-group-transactions)
* [Work with heterogeneous entity types](#work-with-heterogeneous-entity-types)

### Inter-partition secondary index pattern
Store multiple copies of each entity by using different `RowKey` values in separate partitions or in separate tables. This enables fast and efficient lookups, and alternate sort orders by using different `RowKey` values.  

#### Context and problem
Table storage automatically indexes entities by using the `PartitionKey` and `RowKey` values. This enables a client application to retrieve an entity efficiently by using these values. For example, using the following table structure, a client application can use a point query to retrieve an individual employee entity by using the department name and the employee ID (the `PartitionKey` and `RowKey` values). A client can also retrieve entities sorted by employee ID within each department.  

![Graphic of employee entity][9]

If you also want to be able to find an employee entity based on the value of another property, such as email address, you must use a less efficient partition scan to find a match. This is because Table storage doesn't provide secondary indexes. In addition, there's no option to request a list of employees sorted in a different order than `RowKey` order.  

You're anticipating a high volume of transactions against these entities, and want to minimize the risk of the Table storage rate limiting your client.  

#### Solution
To work around the lack of secondary indexes, you can store multiple copies of each entity, with each copy using different `PartitionKey` and `RowKey` values. If you store an entity with the following structures, you can efficiently retrieve employee entities based on email address or employee ID. The prefix values for `PartitionKey`, `empid_`, and `email_` enable you to identify which index you want to use for a query.  

![Graphic showing employee entity with primary index and employee entity with secondary index][10]

The following two filter criteria (one looking up by employee ID, and one looking up by email address) both specify point queries:  

* $filter=(PartitionKey eq 'empid_Sales') and (RowKey eq '000223')
* $filter=(PartitionKey eq 'email_Sales') and (RowKey eq 'jonesj@contoso.com')  

If you query for a range of employee entities, you can specify a range sorted in employee ID order, or a range sorted in email address order. Query for entities with the appropriate prefix in the `RowKey`.  

* To find all the employees in the Sales department with an employee ID in the range **000100** to **000199**, sorted in employee ID order, use:
  $filter=(PartitionKey eq 'empid_Sales') and (RowKey ge '000100') and (RowKey le '000199')  
* To find all the employees in the Sales department with an email address that starts with "a", sorted in email address order, use:
  $filter=(PartitionKey eq 'email_Sales') and (RowKey ge 'a') and (RowKey lt 'b')  

Note that the filter syntax used in the preceding examples is from the Table storage REST API. For more information, see [Query entities](https://msdn.microsoft.com/library/azure/dd179421.aspx).  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* You can keep your duplicate entities eventually consistent with each other by using the [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern) to maintain the primary and secondary index entities.  
* Table storage is relatively cheap to use, so the cost overhead of storing duplicate data should not be a major concern. However, always evaluate the cost of your design based on your anticipated storage requirements, and only add duplicate entities to support the queries your client application will run.  
* The value used for the `RowKey` must be unique for each entity. Consider using compound key values.  
* Padding numeric values in the `RowKey` (for example, the employee ID 000223) enables correct sorting and filtering based on upper and lower bounds.  
* You don't necessarily need to duplicate all the properties of your entity. For example, if the queries that look up the entities by using the email address in the `RowKey` never need the employee's age, these entities can have the following structure:
  
  ![Graphic showing employee entity with secondary index][11]
* Typically, it's better to store duplicate data and ensure that you can retrieve all the data you need with a single query, than to use one query to locate an entity by using the secondary index and another to look up the required data in the primary index.  

#### When to use this pattern
Use this pattern when:

- Your client application needs to retrieve entities by using a variety of different keys.
- Your client needs to retrieve entities in different sort orders.
- You can identify each entity by using a variety of unique values.

Use this pattern when you want to avoid exceeding the partition scalability limits when you are performing entity lookups by using the different `RowKey` values.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern)  
* [Intra-partition secondary index pattern](#intra-partition-secondary-index-pattern)  
* [Compound key pattern](#compound-key-pattern)  
* [Entity group transactions](#entity-group-transactions)  
* [Work with heterogeneous entity types](#work-with-heterogeneous-entity-types)  

### Eventually consistent transactions pattern
Enable eventually consistent behavior across partition boundaries or storage system boundaries by using Azure queues.  

#### Context and problem
EGTs enable atomic transactions across multiple entities that share the same partition key. For performance and scalability reasons, you might decide to store entities that have consistency requirements in separate partitions or in a separate storage system. In such a scenario, you can't use EGTs to maintain consistency. For example, you might have a requirement to maintain eventual consistency between:  

* Entities stored in two different partitions in the same table, in different tables, or in different storage accounts.  
* An entity stored in Table storage and a blob stored in Blob storage.  
* An entity stored in Table storage and a file in a file system.  
* An entity stored in Table storage, yet indexed by using Azure Cognitive Search.  

#### Solution
By using Azure queues, you can implement a solution that delivers eventual consistency across two or more partitions or storage systems.

To illustrate this approach, assume you have a requirement to be able to archive former employee entities. Former employee entities are rarely queried, and should be excluded from any activities that deal with current employees. To implement this requirement, you store active employees in the **Current** table and former employees in the **Archive** table. Archiving an employee requires you to delete the entity from the **Current** table, and add the entity to the **Archive** table.

But you can't use an EGT to perform these two operations. To avoid the risk that a failure causes an entity to appear in both or neither tables, the archive operation must be eventually consistent. The following sequence diagram outlines the steps in this operation.  

![Solution diagram for eventual consistency][12]

A client initiates the archive operation by placing a message on an Azure queue (in this example, to archive employee #456). A worker role polls the queue for new messages; when it finds one, it reads the message and leaves a hidden copy on the queue. The worker role next fetches a copy of the entity from the **Current** table, inserts a copy in the **Archive** table, and then deletes the original from the **Current** table. Finally, if there were no errors from the previous steps, the worker role deletes the hidden message from the queue.  

In this example, step 4 in the diagram inserts the employee into the **Archive** table. It can add the employee to a blob in Blob storage or a file in a file system.  

#### Recover from failures
It's important that the operations in steps 4-5 in the diagram be *idempotent* in case the worker role needs to restart the archive operation. If you're using Table storage, for step 4 you should use an "insert or replace" operation; for step 5, you should use a "delete if exists" operation in the client library you're using. If you're using another storage system, you must use an appropriate idempotent operation.  

If the worker role never completes step 6 in the diagram, then, after a timeout, the message reappears on the queue ready for the worker role to try to reprocess it. The worker role can check how many times a message on the queue has been read and, if necessary, flag it as a "poison" message for investigation by sending it to a separate queue. For more information about reading queue messages and checking the dequeue count, see [Get messages](https://msdn.microsoft.com/library/azure/dd179474.aspx).  

Some errors from Table storage and Queue storage are transient errors, and your client application should include suitable retry logic to handle them.  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* This solution doesn't provide for transaction isolation. For example, a client might read the **Current** and **Archive** tables when the worker role was between steps 4-5 in the diagram, and see an inconsistent view of the data. The data will be consistent eventually.  
* You must be sure that steps 4-5 are idempotent in order to ensure eventual consistency.  
* You can scale the solution by using multiple queues and worker role instances.  

#### When to use this pattern
Use this pattern when you want to guarantee eventual consistency between entities that exist in different partitions or tables. You can extend this pattern to ensure eventual consistency for operations across Table storage and Blob storage, and other non-Azure Storage data sources, such as a database or the file system.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Entity group transactions](#entity-group-transactions)  
* [Merge or replace](#merge-or-replace)  

> [!NOTE]
> If transaction isolation is important to your solution, consider redesigning your tables to enable you to use EGTs.  
> 
> 

### Index entities pattern
Maintain index entities to enable efficient searches that return lists of entities.  

#### Context and problem
Table storage automatically indexes entities by using the `PartitionKey` and `RowKey` values. This enables a client application to retrieve an entity efficiently by using a point query. For example, using the following table structure, a client application can efficiently retrieve an individual employee entity by using the department name and the employee ID (the `PartitionKey` and `RowKey`).  

![Graphic of employee entity][13]

If you also want to be able to retrieve a list of employee entities based on the value of another non-unique property, such as last name, you must use a less efficient partition scan. This scan finds matches, rather than using an index to look them up directly. This is because Table storage doesn't provide secondary indexes.  

#### Solution
To enable lookup by last name with the preceding entity structure, you must maintain lists of employee IDs. If you want to retrieve the employee entities with a particular last name, such as Jones, you must first locate the list of employee IDs for employees with Jones as their last name, and then retrieve those employee entities. There are three main options for storing the lists of employee IDs:  

* Use Blob storage.  
* Create index entities in the same partition as the employee entities.  
* Create index entities in a separate partition or table.  

Option 1: Use Blob storage  

Create a blob for every unique last name, and in each blob store a list of the `PartitionKey` (department) and `RowKey` (employee ID) values for employees who have that last name. When you add or delete an employee, ensure that the content of the relevant blob is eventually consistent with the employee entities.  

Option 2: Create index entities in the same partition  

Use index entities that store the following data:  

![Graphic showing employee entity, with string containing a list of employee IDs with same last name][14]

The `EmployeeIDs` property contains a list of employee IDs for employees with the last name stored in the `RowKey`.  

The following steps outline the process you should follow when you're adding a new employee. In this example, we're adding an employee with ID 000152 and last name Jones in the Sales department:  

1. Retrieve the index entity with a `PartitionKey` value "Sales", and the `RowKey` value "Jones". Save the ETag of this entity to use in step 2.  
2. Create an entity group transaction (that is, a batch operation) that inserts the new employee entity (`PartitionKey` value "Sales" and `RowKey` value "000152"), and updates the index entity (`PartitionKey` value "Sales" and `RowKey` value "Jones"). The EGT does this by adding the new employee ID to the list in the EmployeeIDs field. For more information about EGTs, see [Entity group transactions](#entity-group-transactions).  
3. If the EGT fails because of an optimistic concurrency error (that is, someone else has modified the index entity), then you need to start over at step 1.  

You can use a similar approach to deleting an employee if you're using the second option. Changing an employee's last name is slightly more complex, because you need to run an EGT that updates three entities: the employee entity, the index entity for the old last name, and the index entity for the new last name. You must retrieve each entity before making any changes, in order to retrieve the ETag values that you can then use to perform the updates by using optimistic concurrency.  

The following steps outline the process you should follow when you need to look up all the employees with a particular last name in a department. In this example, we're looking up all the employees with last name Jones in the Sales department:  

1. Retrieve the index entity with a `PartitionKey` value "Sales", and the `RowKey` value "Jones".  
2. Parse the list of employee IDs in the `EmployeeIDs` field.  
3. If you need additional information about each of these employees (such as their email addresses), retrieve each of the employee entities by using `PartitionKey` value "Sales", and `RowKey` values from the list of employees you obtained in step 2.  

Option 3: Create index entities in a separate partition or table  

For this option, use index entities that store the following data:  

![Graphic showing employee entity, with string containing a list of employee IDs with same last name][15]

The `EmployeeIDs` property contains a list of employee IDs for employees with the last name stored in the `RowKey`.  

You can't use EGTs to maintain consistency, because the index entities are in a separate partition from the employee entities. Ensure that the index entities are eventually consistent with the employee entities.  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* This solution requires at least two queries to retrieve matching entities: one to query the index entities to obtain the list of `RowKey` values, and then queries to retrieve each entity in the list.  
* Because an individual entity has a maximum size of 1 MB, option 2 and option 3 in the solution assume that the list of employee IDs for any particular last name is never more than 1 MB. If the list of employee IDs is likely to be more than 1 MB in size, use option 1 and store the index data in Blob storage.  
* If you use option 2 (using EGTs to handle adding and deleting employees, and changing an employee's last name), you must evaluate if the volume of transactions will approach the scalability limits in a particular partition. If this is the case, you should consider an eventually consistent solution (option 1 or option 3). These use queues to handle the update requests, and enable you to store your index entities in a separate partition from the employee entities.  
* Option 2 in this solution assumes that you want to look up by last name within a department. For example, you want to retrieve a list of employees with a last name Jones in the Sales department. If you want to be able to look up all the employees with a last name Jones across the whole organization, use either option 1 or option 3.
* You can implement a queue-based solution that delivers eventual consistency. For more details, see the [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern).  

#### When to use this pattern
Use this pattern when you want to look up a set of entities that all share a common property value, such as all employees with the last name Jones.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Compound key pattern](#compound-key-pattern)  
* [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern)  
* [Entity group transactions](#entity-group-transactions)  
* [Work with heterogeneous entity types](#work-with-heterogeneous-entity-types)  

### Denormalization pattern
Combine related data together in a single entity to enable you to retrieve all the data you need with a single point query.  

#### Context and problem
In a relational database, you typically normalize data to remove duplication that occurs when queries retrieve data from multiple tables. If you normalize your data in Azure tables, you must make multiple round trips from the client to the server to retrieve your related data. For example, with the following table structure, you need two round trips to retrieve the details for a department. One trip fetches the department entity that includes the manager's ID, and the second trip fetches the manager's details in an employee entity.  

![Graphic of department entity and employee entity][16]

#### Solution
Instead of storing the data in two separate entities, denormalize the data and keep a copy of the manager's details in the department entity. For example:  

![Graphic of denormalized and combined department entity][17]

With department entities stored with these properties, you can now retrieve all the details you need about a department by using a point query.  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* There is some cost overhead associated with storing some data twice. The performance benefit resulting from fewer requests to Table storage typically outweighs the marginal increase in storage costs. Further, this cost is partially offset by a reduction in the number of transactions you require to fetch the details of a department.  
* You must maintain the consistency of the two entities that store information about managers. You can handle the consistency issue by using EGTs to update multiple entities in a single atomic transaction. In this case, the department entity and the employee entity for the department manager are stored in the same partition.  

#### When to use this pattern
Use this pattern when you frequently need to look up related information. This pattern reduces the number of queries your client must make to retrieve the data it requires.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Compound key pattern](#compound-key-pattern)  
* [Entity group transactions](#entity-group-transactions)  
* [Work with heterogeneous entity types](#work-with-heterogeneous-entity-types)

### Compound key pattern
Use compound `RowKey` values to enable a client to look up related data with a single point query.  

#### Context and problem
In a relational database, it's natural to use joins in queries to return related pieces of data to the client in a single query. For example, you might use the employee ID to look up a list of related entities that contain performance and review data for that employee.  

Assume you are storing employee entities in Table storage by using the following structure:  

![Graphic of employee entity][18]

You also need to store historical data relating to reviews and performance for each year the employee has worked for your organization, and you need to be able to access this information by year. One option is to create another table that stores entities with the following structure:  

![Graphic of employee review entity][19]

With this approach, you might decide to duplicate some information (such as first name and last name) in the new entity, to enable you to retrieve your data with a single request. However, you can't maintain strong consistency because you can't use an EGT to update the two entities atomically.  

#### Solution
Store a new entity type in your original table by using entities with the following structure:  

![Graphic of employee entity with compound key][20]

Notice how the `RowKey` is now a compound key, made up of the employee ID and the year of the review data. This enables you to retrieve the employee's performance and review data with a single request for a single entity.  

The following example outlines how you can retrieve all the review data for a particular employee (such as employee 000123 in the Sales department):  

$filter=(PartitionKey eq 'Sales') and (RowKey ge 'empid_000123') and (RowKey lt 'empid_000124')&$select=RowKey,Manager Rating,Peer Rating,Comments  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* You should use a suitable separator character that makes it easy to parse the `RowKey` value: for example, **000123_2012**.  
* You're also storing this entity in the same partition as other entities that contain related data for the same employee. This means you can use EGTs to maintain strong consistency.
* You should consider how frequently you'll query the data to determine whether this pattern is appropriate. For example, if you access the review data infrequently, and the main employee data often, you should keep them as separate entities.  

#### When to use this pattern
Use this pattern when you need to store one or more related entities that you query frequently.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Entity group transactions](#entity-group-transactions)  
* [Work with heterogeneous entity types](#work-with-heterogeneous-entity-types)  
* [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern)  

### Log tail pattern
Retrieve the *n* entities most recently added to a partition by using a `RowKey` value that sorts in reverse date and time order.  

> [!NOTE]
> Query results returned by the Azure Table API in Azure Cosmos DB aren't sorted by partition key or row key. Thus, while this pattern is suitable for Table storage, it isn't suitable for Azure Cosmos DB. For a detailed list of feature differences, see [differences between Table API in Azure Cosmos DB and Azure Table Storage](table-api-faq.md#table-api-vs-table-storage).

#### Context and problem
A common requirement is to be able to retrieve the most recently created entities, for example the ten most recent expense claims submitted by an employee. Table queries support a `$top` query operation to return the first *n* entities from a set. There's no equivalent query operation to return the last *n* entities in a set.  

#### Solution
Store the entities by using a `RowKey` that naturally sorts in reverse date/time order, so the most recent entry is always the first one in the table.  

For example, to be able to retrieve the ten most recent expense claims submitted by an employee, you can use a reverse tick value derived from the current date/time. The following C# code sample shows one way to create a suitable "inverted ticks" value for a `RowKey` that sorts from the most recent to the oldest:  

`string invertedTicks = string.Format("{0:D19}", DateTime.MaxValue.Ticks - DateTime.UtcNow.Ticks);`  

You can get back to the date/time value by using the following code:  

`DateTime dt = new DateTime(DateTime.MaxValue.Ticks - Int64.Parse(invertedTicks));`  

The table query looks like this:  

`https://myaccount.table.core.windows.net/EmployeeExpense(PartitionKey='empid')?$top=10`  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* You must pad the reverse tick value with leading zeroes, to ensure the string value sorts as expected.  
* You must be aware of the scalability targets at the level of a partition. Be careful to not create hot spot partitions.  

#### When to use this pattern
Use this pattern when you need to access entities in reverse date/time order, or when you need to access the most recently added entities.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Prepend / append anti-pattern](#prepend-append-anti-pattern)  
* [Retrieve entities](#retrieve-entities)  

### High volume delete pattern
Enable the deletion of a high volume of entities by storing all the entities for simultaneous deletion in their own separate table. You delete the entities by deleting the table.  

#### Context and problem
Many applications delete old data that no longer needs to be available to a client application, or that the application has archived to another storage medium. You typically identify such data by a date. For example, you have a requirement to delete records of all sign-in requests that are more than 60 days old.  

One possible design is to use the date and time of the sign-in request in the `RowKey`:  

![Graphic of login attempt entity][21]

This approach avoids partition hotspots, because the application can insert and delete sign-in entities for each user in a separate partition. However, this approach can be costly and time consuming if you have a large number of entities. First, you need to perform a table scan in order to identify all the entities to delete, and then you must delete each old entity. You can reduce the number of round trips to the server required to delete the old entities by batching multiple delete requests into EGTs.  

#### Solution
Use a separate table for each day of sign-in attempts. You can use the preceding entity design to avoid hotspots when you are inserting entities. Deleting old entities is now simply a question of deleting one table every day (a single storage operation), instead of finding and deleting hundreds and thousands of individual sign-in entities every day.  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* Does your design support other ways your application will use the data, such as looking up specific entities, linking with other data, or generating aggregate information?  
* Does your design avoid hot spots when you are inserting new entities?  
* Expect a delay if you want to reuse the same table name after deleting it. It's better to always use unique table names.  
* Expect some rate limiting when you first use a new table, while Table storage learns the access patterns and distributes the partitions across nodes. You should consider how frequently you need to create new tables.  

#### When to use this pattern
Use this pattern when you have a high volume of entities that you must delete at the same time.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Entity group transactions](#entity-group-transactions)
* [Modify entities](#modify-entities)  

### Data series pattern
Store complete data series in a single entity to minimize the number of requests you make.  

#### Context and problem
A common scenario is for an application to store a series of data that it typically needs to retrieve all at once. For example, your application might record how many IM messages each employee sends every hour, and then use this information to plot how many messages each user sent over the preceding 24 hours. One design might be to store 24 entities for each employee:  

![Graphic of message stats entity][22]

With this design, you can easily locate and update the entity to update for each employee whenever the application needs to update the message count value. However, to retrieve the information to plot a chart of the activity for the preceding 24 hours, you must retrieve 24 entities.  

#### Solution
Use the following design, with a separate property to store the message count for each hour:  

![Graphic showing message stats entity with separated properties][23]

With this design, you can use a merge operation to update the message count for an employee for a specific hour. Now, you can retrieve all the information you need to plot the chart by using a request for a single entity.  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* If your complete data series doesn't fit into a single entity (an entity can have up to 252 properties), use an alternative data store such as a blob.  
* If you have multiple clients updating an entity simultaneously, use the **ETag** to implement optimistic concurrency. If you have many clients, you might experience high contention.  

#### When to use this pattern
Use this pattern when you need to update and retrieve a data series associated with an individual entity.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Large entities pattern](#large-entities-pattern)  
* [Merge or replace](#merge-or-replace)  
* [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern) (if you're storing the data series in a blob)  

### Wide entities pattern
Use multiple physical entities to store logical entities with more than 252 properties.  

#### Context and problem
An individual entity can have no more than 252 properties (excluding the mandatory system properties), and can't store more than 1 MB of data in total. In a relational database, you would typically work around any limits on the size of a row by adding a new table, and enforcing a 1-to-1 relationship between them.  

#### Solution
By using Table storage, you can store multiple entities to represent a single large business object with more than 252 properties. For example, if you want to store a count of the number of IM messages sent by each employee for the last 365 days, you can use the following design that uses two entities with different schemas:  

![Graphic showing message stats entity with Rowkey 01 and message stats entity with Rowkey 02][24]

If you need to make a change that requires updating both entities to keep them synchronized with each other, you can use an EGT. Otherwise, you can use a single merge operation to update the message count for a specific day. To retrieve all the data for an individual employee, you must retrieve both entities. You can do this with two efficient requests that use both a `PartitionKey` and a `RowKey` value.  

#### Issues and considerations
Consider the following point when deciding how to implement this pattern:  

* Retrieving a complete logical entity involves at least two storage transactions: one to retrieve each physical entity.  

#### When to use this pattern
Use this pattern when you need to store entities whose size or number of properties exceeds the limits for an individual entity in Table storage.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Entity group transactions](#entity-group-transactions)
* [Merge or replace](#merge-or-replace)

### Large entities pattern
Use Blob storage to store large property values.  

#### Context and problem
An individual entity can't store more than 1 MB of data in total. If one or several of your properties store values that cause the total size of your entity to exceed this value, you can't store the entire entity in Table storage.  

#### Solution
If your entity exceeds 1 MB in size because one or more properties contain a large amount of data, you can store data in Blob storage, and then store the address of the blob in a property in the entity. For example, you can store the photo of an employee in Blob storage, and store a link to the photo in the `Photo` property of your employee entity:  

![Graphic showing employee entity with string for Photo pointing to Blob storage][25]

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* To maintain eventual consistency between the entity in Table storage and the data in Blob storage, use the [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern) to maintain your entities.
* Retrieving a complete entity involves at least two storage transactions: one to retrieve the entity and one to retrieve the blob data.  

#### When to use this pattern
Use this pattern when you need to store entities whose size exceeds the limits for an individual entity in Table storage.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Eventually consistent transactions pattern](#eventually-consistent-transactions-pattern)  
* [Wide entities pattern](#wide-entities-pattern)

<a name="prepend-append-anti-pattern"></a>

### Prepend/append anti-pattern
When you have a high volume of inserts, increase scalability by spreading the inserts across multiple partitions.  

#### Context and problem
Prepending or appending entities to your stored entities typically results in the application adding new entities to the first or last partition of a sequence of partitions. In this case, all of the inserts at any particular time are taking place in the same partition, creating a hotspot. This prevents Table storage from load-balancing inserts across multiple nodes, and possibly causes your application to hit the scalability targets for partition. For example, consider the case of an application that logs network and resource access by employees. An entity structure such as the following can result in the current hour's partition becoming a hotspot, if the volume of transactions reaches the scalability target for an individual partition:  

![Graphic of employee entity][26]

#### Solution
The following alternative entity structure avoids a hotspot on any particular partition, as the application logs events:  

![Graphic showing employee entity with RowKey compounding the Year, Month, Day, Hour, and Event ID][27]

Notice with this example how both the `PartitionKey` and `RowKey` are compound keys. The `PartitionKey` uses both the department and employee ID to distribute the logging across multiple partitions.  

#### Issues and considerations
Consider the following points when deciding how to implement this pattern:  

* Does the alternative key structure that avoids creating hot partitions on inserts efficiently support the queries your client application makes?  
* Does your anticipated volume of transactions mean that you're likely to reach the scalability targets for an individual partition, and be throttled by Table storage?  

#### When to use this pattern
Avoid the prepend/append anti-pattern when your volume of transactions is likely to result in rate limiting by Table storage when you access a hot partition.  

#### Related patterns and guidance
The following patterns and guidance might also be relevant when implementing this pattern:  

* [Compound key pattern](#compound-key-pattern)  
* [Log tail pattern](#log-tail-pattern)  
* [Modify entities](#modify-entities)  

### Log data anti-pattern
Typically, you should use Blob storage instead of Table storage to store log data.  

#### Context and problem
A common use case for log data is to retrieve a selection of log entries for a specific date/time range. For example, you want to find all the error and critical messages that your application logged between 15:04 and 15:06 on a specific date. You don't want to use the date and time of the log message to determine the partition you save log entities to. That results in a hot partition because at any particular time, all the log entities will share the same `PartitionKey` value (see the [Prepend/append anti-pattern](#prepend-append-anti-pattern)). For example, the following entity schema for a log message results in a hot partition, because the application writes all log messages to the partition for the current date and hour:  

![Graphic of log message entity][28]

In this example, the `RowKey` includes the date and time of the log message to ensure that log messages are sorted in date/time order. The `RowKey` also includes a message ID, in case multiple log messages share the same date and time.  

Another approach is to use a `PartitionKey` that ensures that the application writes messages across a range of partitions. For example, if the source of the log message provides a way to distribute messages across many partitions, you can use the following entity schema:  

![Graphic of log message entity][29]

However, the problem with this schema is that to retrieve all the log messages for a specific time span, you must search every partition in the table.

#### Solution
The previous section highlighted the problem of trying to use Table storage to store log entries, and suggested two unsatisfactory designs. One solution led to a hot partition with the risk of poor performance writing log messages. The other solution resulted in poor query performance, because of the requirement to scan every partition in the table to retrieve log messages for a specific time span. Blob storage offers a better solution for this type of scenario, and this is how Azure Storage analytics stores the log data it collects.  

This section outlines how Storage analytics stores log data in Blob storage, as an illustration of this approach to storing data that you typically query by range.  

Storage analytics stores log messages in a delimited format in multiple blobs. The delimited format makes it easy for a client application to parse the data in the log message.  

Storage analytics uses a naming convention for blobs that enables you to locate the blob (or blobs) that contain the log messages for which you are searching. For example, a blob named "queue/2014/07/31/1800/000001.log" contains log messages that relate to the queue service for the hour starting at 18:00 on July 31, 2014. The "000001" indicates that this is the first log file for this period. Storage analytics also records the timestamps of the first and last log messages stored in the file, as part of the blob's metadata. The API for Blob storage enables you locate blobs in a container based on a name prefix. To locate all the blobs that contain queue log data for the hour starting at 18:00, you can use the prefix "queue/2014/07/31/1800".  

Storage analytics buffers log messages internally, and then periodically updates the appropriate blob or creates a new one with the latest batch of log entries. This reduces the number of writes it must perform to Blob storage.  

If you're implementing a similar solution in your own application, consider how to manage the trade-off between reliability and cost and scalability. In other words, evaluate the effect of writing every log entry to Blob storage as it happens, compared to buffering updates in your application and writing them to Blob storage in batches.  

#### Issues and considerations
Consider the following points when deciding how to store log data:  

* If you create a table design that avoids potential hot partitions, you might find that you can't access your log data efficiently.  
* To process log data, a client often needs to load many records.  
* Although log data is often structured, Blob storage might be a better solution.  

### Implementation considerations
This section discusses some of the considerations to bear in mind when you implement the patterns described in the previous sections. Most of this section uses examples written in C# that use the Storage Client Library (version 4.3.0 at the time of writing).  

### Retrieve entities
As discussed in the section [Design for querying](#design-for-querying), the most efficient query is a point query. However, in some scenarios you might need to retrieve multiple entities. This section describes some common approaches to retrieving entities by using the Storage Client Library.  

#### Run a point query by using the Storage Client Library
The easiest way to run a point query is to use the **Retrieve** table operation. As shown in the following C# code snippet, this operation retrieves an entity with a `PartitionKey` of value "Sales", and a `RowKey` of value "212":  

```csharp
TableOperation retrieveOperation = TableOperation.Retrieve<EmployeeEntity>("Sales", "212");
var retrieveResult = employeeTable.Execute(retrieveOperation);
if (retrieveResult.Result != null)
{
    EmployeeEntity employee = (EmployeeEntity)retrieveResult.Result;
    ...
}  
```

Notice how this example expects the entity it retrieves to be of type `EmployeeEntity`.  

#### Retrieve multiple entities by using LINQ
You can retrieve multiple entities by using LINQ with Storage Client Library, and specifying a query with a **where** clause. To avoid a table scan, you should always include the `PartitionKey` value in the where clause, and if possible the `RowKey` value to avoid table and partition scans. Table storage supports a limited set of comparison operators (greater than, greater than or equal, less than, less than or equal, equal, and not equal) to use in the where clause. The following C# code snippet finds all the employees whose last name starts with "B" (assuming that the `RowKey` stores the last name) in the Sales department (assuming the `PartitionKey` stores the department name):  

```csharp
TableQuery<EmployeeEntity> employeeQuery = employeeTable.CreateQuery<EmployeeEntity>();
var query = (from employee in employeeQuery
            where employee.PartitionKey == "Sales" &&
            employee.RowKey.CompareTo("B") >= 0 &&
            employee.RowKey.CompareTo("C") < 0
            select employee).AsTableQuery();
var employees = query.Execute();  
```

Notice how the query specifies both a `RowKey` and a `PartitionKey` to ensure better performance.  

The following code sample shows equivalent functionality by using the fluent API (for more information about fluent APIs in general, see [Best practices for designing a fluent API](https://visualstudiomagazine.com/articles/2013/12/01/best-practices-for-designing-a-fluent-api.aspx)):  

```csharp
TableQuery<EmployeeEntity> employeeQuery = new TableQuery<EmployeeEntity>().Where(
    TableQuery.CombineFilters(
    TableQuery.CombineFilters(
        TableQuery.GenerateFilterCondition(
    "PartitionKey", QueryComparisons.Equal, "Sales"),
    TableOperators.And,
    TableQuery.GenerateFilterCondition(
    "RowKey", QueryComparisons.GreaterThanOrEqual, "B")
),
TableOperators.And,
TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.LessThan, "C")
    )
);
var employees = employeeTable.ExecuteQuery(employeeQuery);  
```

> [!NOTE]
> The sample nests multiple `CombineFilters` methods to include the three filter conditions.  
> 
> 

#### Retrieve large numbers of entities from a query
An optimal query returns an individual entity based on a `PartitionKey` value and a `RowKey` value. However, in some scenarios you might have a requirement to return many entities from the same partition, or even from many partitions. You should always fully test the performance of your application in such scenarios.  

A query against Table storage can return a maximum of 1,000 entities at one time, and run for a maximum of five seconds. Table storage returns a continuation token to enable the client application to request the next set of entities, if any of the following are true:

- The result set contains more than 1,000 entities.
- The query didn't complete within five seconds.
- The query crosses the partition boundary. 

For more information about how continuation tokens work, see [Query timeout and pagination](https://msdn.microsoft.com/library/azure/dd135718.aspx).  

If you're using the Storage Client Library, it can automatically handle continuation tokens for you as it returns entities from Table storage. For example, the following C# code sample automatically handles continuation tokens if Table storage returns them in a response:  

```csharp
string filter = TableQuery.GenerateFilterCondition(
        "PartitionKey", QueryComparisons.Equal, "Sales");
TableQuery<EmployeeEntity> employeeQuery =
        new TableQuery<EmployeeEntity>().Where(filter);

var employees = employeeTable.ExecuteQuery(employeeQuery);
foreach (var emp in employees)
{
        ...
}  
```

The following C# code handles continuation tokens explicitly:  

```csharp
string filter = TableQuery.GenerateFilterCondition(
        "PartitionKey", QueryComparisons.Equal, "Sales");
TableQuery<EmployeeEntity> employeeQuery =
        new TableQuery<EmployeeEntity>().Where(filter);

TableContinuationToken continuationToken = null;

do
{
        var employees = employeeTable.ExecuteQuerySegmented(
        employeeQuery, continuationToken);
    foreach (var emp in employees)
    {
    ...
    }
    continuationToken = employees.ContinuationToken;
} while (continuationToken != null);  
```

By using continuation tokens explicitly, you can control when your application retrieves the next segment of data. For example, if your client application enables users to page through the entities stored in a table, a user might decide not to page through all the entities retrieved by the query. Your application would only use a continuation token to retrieve the next segment when the user had finished paging through all the entities in the current segment. This approach has several benefits:  

* You can limit the amount of data to retrieve from Table storage and that you move over the network.  
* You can perform asynchronous I/O in .NET.  
* You can serialize the continuation token to persistent storage, so you can continue in the event of an application crash.  

> [!NOTE]
> A continuation token typically returns a segment containing 1,000 entities, although it can contain fewer. This is also the case if you limit the number of entries a query returns by using **Take** to return the first n entities that match your lookup criteria. Table storage might return a segment containing fewer than n entities, along with a continuation token to enable you to retrieve the remaining entities.  
> 
> 

The following C# code shows how to modify the number of entities returned inside a segment:  

```csharp
employeeQuery.TakeCount = 50;  
```

#### Server-side projection
A single entity can have up to 255 properties and be up to 1 MB in size. When you query the table and retrieve entities, you might not need all the properties, and can avoid transferring data unnecessarily (to help reduce latency and cost). You can use server-side projection to transfer just the properties you need. The following example retrieves just the `Email` property (along with `PartitionKey`, `RowKey`, `Timestamp`, and `ETag`) from the entities selected by the query.  

```csharp
string filter = TableQuery.GenerateFilterCondition(
        "PartitionKey", QueryComparisons.Equal, "Sales");
List<string> columns = new List<string>() { "Email" };
TableQuery<EmployeeEntity> employeeQuery =
        new TableQuery<EmployeeEntity>().Where(filter).Select(columns);

var entities = employeeTable.ExecuteQuery(employeeQuery);
foreach (var e in entities)
{
        Console.WriteLine("RowKey: {0}, EmployeeEmail: {1}", e.RowKey, e.Email);
}  
```

Notice how the `RowKey` value is available even though it isn't included in the list of properties to retrieve.  

### Modify entities
The Storage Client Library enables you to modify your entities stored in Table storage by inserting, deleting, and updating entities. You can use EGTs to batch multiple inserts, update, and delete operations together, to reduce the number of round trips required and improve the performance of your solution.  

Exceptions thrown when the Storage Client Library runs an EGT typically include the index of the entity that caused the batch to fail. This is helpful when you are debugging code that uses EGTs.  

You should also consider how your design affects how your client application handles concurrency and update operations.  

#### Managing concurrency
By default, Table storage implements optimistic concurrency checks at the level of individual entities for insert, merge, and delete operations, although it's possible for a client to force Table storage to bypass these checks. For more information, see [Managing concurrency in Microsoft Azure Storage](../storage/common/storage-concurrency.md).  

#### Merge or replace
The `Replace` method of the `TableOperation` class always replaces the complete entity in Table storage. If you don't include a property in the request when that property exists in the stored entity, the request removes that property from the stored entity. Unless you want to remove a property explicitly from a stored entity, you must include every property in the request.  

You can use the `Merge` method of the `TableOperation` class to reduce the amount of data that you send to Table storage when you want to update an entity. The `Merge` method replaces any properties in the stored entity with property values from the entity included in the request. This method leaves intact any properties in the stored entity that aren't included in the request. This is useful if you have large entities, and only need to update a small number of properties in a request.  

> [!NOTE]
> The `*Replace` and `Merge` methods fail if the entity doesn't exist. As an alternative, you can use the `InsertOrReplace` and `InsertOrMerge` methods that create a new entity if it doesn't exist.  
> 
> 

### Work with heterogeneous entity types
Table storage is a *schema-less* table store. That means that a single table can store entities of multiple types, providing great flexibility in your design. The following example illustrates a table storing both employee and department entities:  

<table>
<tr>
<th>PartitionKey</th>
<th>RowKey</th>
<th>Timestamp</th>
<th></th>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>
<table>
<tr>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</table>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>
<table>
<tr>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</table>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>
<table>
<tr>
<th>DepartmentName</th>
<th>EmployeeCount</th>
</tr>
<tr>
<td></td>
<td></td>
</tr>
</table>
</td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>
<table>
<tr>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</table>
</td>
</tr>
</table>

Each entity must still have `PartitionKey`, `RowKey`, and `Timestamp` values, but can have any set of properties. Furthermore, there's nothing to indicate the type of an entity unless you choose to store that information somewhere. There are two options for identifying the entity type:  

* Prepend the entity type to the `RowKey` (or possibly the `PartitionKey`). For example, `EMPLOYEE_000123` or `DEPARTMENT_SALES` as `RowKey` values.  
* Use a separate property to record the entity type, as shown in the following table.  

<table>
<tr>
<th>PartitionKey</th>
<th>RowKey</th>
<th>Timestamp</th>
<th></th>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>
<table>
<tr>
<th>EntityType</th>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td>Employee</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</table>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>
<table>
<tr>
<th>EntityType</th>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td>Employee</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</table>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>
<table>
<tr>
<th>EntityType</th>
<th>DepartmentName</th>
<th>EmployeeCount</th>
</tr>
<tr>
<td>Department</td>
<td></td>
<td></td>
</tr>
</table>
</td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>
<table>
<tr>
<th>EntityType</th>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
<th>Email</th>
</tr>
<tr>
<td>Employee</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</table>
</td>
</tr>
</table>

The first option, prepending the entity type to the `RowKey`, is useful if there is a possibility that two entities of different types might have the same key value. It also groups entities of the same type together in the partition.  

The techniques discussed in this section are especially relevant to the discussion about[Inheritance relationships](#inheritance-relationships).  

> [!NOTE]
> Consider including a version number in the entity type value, to enable client applications to evolve POCO objects and work with different versions.  
> 
> 

The remainder of this section describes some of the features in the Storage Client Library that facilitate working with multiple entity types in the same table.  

#### Retrieve heterogeneous entity types
If you're using the Storage Client Library, you have three options for working with multiple entity types.  

If you know the type of the entity stored with specific `RowKey` and `PartitionKey` values, then you can specify the entity type when you retrieve the entity. You saw this in the previous two examples that retrieve entities of type `EmployeeEntity`: [Run a point query by using the Storage Client Library](#run-a-point-query-by-using-the-storage-client-library) and [Retrieve multiple entities by using LINQ](#retrieve-multiple-entities-by-using-linq).  

The second option is to use the `DynamicTableEntity` type (a property bag), instead of a concrete POCO entity type. This option might also improve performance, because there's no need to serialize and deserialize the entity to .NET types. The following C# code potentially retrieves multiple entities of different types from the table, but returns all entities as `DynamicTableEntity` instances. It then uses the `EntityType` property to determine the type of each entity:  

```csharp
string filter = TableQuery.CombineFilters(
    TableQuery.GenerateFilterCondition("PartitionKey",
    QueryComparisons.Equal, "Sales"),
    TableOperators.And,
    TableQuery.CombineFilters(
    TableQuery.GenerateFilterCondition("RowKey",
                    QueryComparisons.GreaterThanOrEqual, "B"),
        TableOperators.And,
        TableQuery.GenerateFilterCondition("RowKey",
        QueryComparisons.LessThan, "F")
    )
);
TableQuery<DynamicTableEntity> entityQuery =
    new TableQuery<DynamicTableEntity>().Where(filter);
var employees = employeeTable.ExecuteQuery(entityQuery);

IEnumerable<DynamicTableEntity> entities = employeeTable.ExecuteQuery(entityQuery);
foreach (var e in entities)
{
EntityProperty entityTypeProperty;
if (e.Properties.TryGetValue("EntityType", out entityTypeProperty))
{
    if (entityTypeProperty.StringValue == "Employee")
    {
        // Use entityTypeProperty, RowKey, PartitionKey, Etag, and Timestamp
        }
    }
}  
```

To retrieve other properties, you must use the `TryGetValue` method on the `Properties` property of the `DynamicTableEntity` class.  

A third option is to combine using the `DynamicTableEntity` type and an `EntityResolver` instance. This enables you to resolve to multiple POCO types in the same query. In this example, the `EntityResolver` delegate is using the `EntityType` property to distinguish between the two types of entity that the query returns. The `Resolve` method uses the `resolver` delegate to resolve `DynamicTableEntity` instances to `TableEntity` instances.  

```csharp
EntityResolver<TableEntity> resolver = (pk, rk, ts, props, etag) =>
{

        TableEntity resolvedEntity = null;
        if (props["EntityType"].StringValue == "Department")
        {
        resolvedEntity = new DepartmentEntity();
        }
        else if (props["EntityType"].StringValue == "Employee")
        {
        resolvedEntity = new EmployeeEntity();
        }
        else throw new ArgumentException("Unrecognized entity", "props");

        resolvedEntity.PartitionKey = pk;
        resolvedEntity.RowKey = rk;
        resolvedEntity.Timestamp = ts;
        resolvedEntity.ETag = etag;
        resolvedEntity.ReadEntity(props, null);
        return resolvedEntity;
};

string filter = TableQuery.GenerateFilterCondition(
        "PartitionKey", QueryComparisons.Equal, "Sales");
TableQuery<DynamicTableEntity> entityQuery =
        new TableQuery<DynamicTableEntity>().Where(filter);

var entities = employeeTable.ExecuteQuery(entityQuery, resolver);
foreach (var e in entities)
{
        if (e is DepartmentEntity)
        {
    ...
        }
        if (e is EmployeeEntity)
        {
    ...
        }
}  
```

#### Modify heterogeneous entity types
You don't need to know the type of an entity to delete it, and you always know the type of an entity when you insert it. However, you can use the `DynamicTableEntity` type to update an entity without knowing its type, and without using a POCO entity class. The following code sample retrieves a single entity, and checks that the `EmployeeCount` property exists before updating it.  

```csharp
TableResult result =
        employeeTable.Execute(TableOperation.Retrieve(partitionKey, rowKey));
DynamicTableEntity department = (DynamicTableEntity)result.Result;

EntityProperty countProperty;

if (!department.Properties.TryGetValue("EmployeeCount", out countProperty))
{
        throw new
        InvalidOperationException("Invalid entity, EmployeeCount property not found.");
}
countProperty.Int32Value += 1;
employeeTable.Execute(TableOperation.Merge(department));  
```

### Control access with shared access signatures
You can use shared access signature (SAS) tokens to enable client applications to modify (and query) table entities directly, without the need to authenticate directly with Table storage. Typically, there are three main benefits to using SAS in your application:  

* You don't need to distribute your storage account key to an insecure platform (such as a mobile device) in order to allow that device to access and modify entities in Table storage.  
* You can offload some of the work that web and worker roles perform in managing your entities. You can offload to client devices such as end-user computers and mobile devices.  
* You can assign a constrained and time-limited set of permissions to a client (such as allowing read-only access to specific resources).  

For more information about using SAS tokens with Table storage, see [Using shared access signatures (SAS)](../storage/common/storage-dotnet-shared-access-signature-part-1.md).  

However, you must still generate the SAS tokens that grant a client application to the entities in Table storage. Do this in an environment that has secure access to your storage account keys. Typically, you use a web or worker role to generate the SAS tokens and deliver them to the client applications that need access to your entities. Because there is still an overhead involved in generating and delivering SAS tokens to clients, you should consider how best to reduce this overhead, especially in high-volume scenarios.  

It's possible to generate a SAS token that grants access to a subset of the entities in a table. By default, you create a SAS token for an entire table. But it's also possible to specify that the SAS token grant access to either a range of `PartitionKey` values, or a range of `PartitionKey` and `RowKey` values. You might choose to generate SAS tokens for individual users of your system, such that each user's SAS token only allows them access to their own entities in Table storage.  

### Asynchronous and parallel operations
Provided you are spreading your requests across multiple partitions, you can improve throughput and client responsiveness by using asynchronous or parallel queries.
For example, you might have two or more worker role instances accessing your tables in parallel. You can have individual worker roles responsible for particular sets of partitions, or simply have multiple worker role instances, each able to access all the partitions in a table.  

Within a client instance, you can improve throughput by running storage operations asynchronously. The Storage Client Library makes it easy to write asynchronous queries and modifications. For example, you might start with the synchronous method that retrieves all the entities in a partition, as shown in the following C# code:  

```csharp
private static void ManyEntitiesQuery(CloudTable employeeTable, string department)
{
        string filter = TableQuery.GenerateFilterCondition(
        "PartitionKey", QueryComparisons.Equal, department);
        TableQuery<EmployeeEntity> employeeQuery =
        new TableQuery<EmployeeEntity>().Where(filter);

        TableContinuationToken continuationToken = null;

        do
        {
        var employees = employeeTable.ExecuteQuerySegmented(
                employeeQuery, continuationToken);
        foreach (var emp in employees)
    {
        ...
    }
        continuationToken = employees.ContinuationToken;
        } while (continuationToken != null);
}  
```

You can easily modify this code so that the query runs asynchronously, as follows:  

```csharp
private static async Task ManyEntitiesQueryAsync(CloudTable employeeTable, string department)
{
        string filter = TableQuery.GenerateFilterCondition(
        "PartitionKey", QueryComparisons.Equal, department);
        TableQuery<EmployeeEntity> employeeQuery =
        new TableQuery<EmployeeEntity>().Where(filter);
        TableContinuationToken continuationToken = null;

        do
        {
        var employees = await employeeTable.ExecuteQuerySegmentedAsync(
                employeeQuery, continuationToken);
        foreach (var emp in employees)
        {
            ...
        }
        continuationToken = employees.ContinuationToken;
            } while (continuationToken != null);
}  
```

In this asynchronous example, you can see the following changes from the synchronous version:  

* The method signature now includes the `async` modifier, and returns a `Task` instance.  
* Instead of calling the `ExecuteSegmented` method to retrieve results, the method now calls the `ExecuteSegmentedAsync` method. The method uses the `await` modifier to retrieve results asynchronously.  

The client application can call this method multiple times, with different values for the `department` parameter. Each query runs on a separate thread.  

There is no asynchronous version of the `Execute` method in the `TableQuery` class, because the `IEnumerable` interface doesn't support asynchronous enumeration.  

You can also insert, update, and delete entities asynchronously. The following C# example shows a simple, synchronous method to insert or replace an employee entity:  

```csharp
private static void SimpleEmployeeUpsert(CloudTable employeeTable,
        EmployeeEntity employee)
{
        TableResult result = employeeTable
        .Execute(TableOperation.InsertOrReplace(employee));
        Console.WriteLine("HTTP Status: {0}", result.HttpStatusCode);
}  
```

You can easily modify this code so that the update runs asynchronously, as follows:  

```csharp
private static async Task SimpleEmployeeUpsertAsync(CloudTable employeeTable,
        EmployeeEntity employee)
{
        TableResult result = await employeeTable
        .ExecuteAsync(TableOperation.InsertOrReplace(employee));
        Console.WriteLine("HTTP Status: {0}", result.HttpStatusCode);
}  
```

In this asynchronous example, you can see the following changes from the synchronous version:  

* The method signature now includes the `async` modifier, and returns a `Task` instance.  
* Instead of calling the `Execute` method to update the entity, the method now calls the `ExecuteAsync` method. The method uses the `await` modifier to retrieve results asynchronously.  

The client application can call multiple asynchronous methods like this one, and each method invocation runs on a separate thread.  


[1]: ./media/storage-table-design-guide/storage-table-design-IMAGE01.png
[2]: ./media/storage-table-design-guide/storage-table-design-IMAGE02.png
[3]: ./media/storage-table-design-guide/storage-table-design-IMAGE03.png
[4]: ./media/storage-table-design-guide/storage-table-design-IMAGE04.png
[5]: ./media/storage-table-design-guide/storage-table-design-IMAGE05.png
[6]: ./media/storage-table-design-guide/storage-table-design-IMAGE06.png
[7]: ./media/storage-table-design-guide/storage-table-design-IMAGE07.png
[8]: ./media/storage-table-design-guide/storage-table-design-IMAGE08.png
[9]: ./media/storage-table-design-guide/storage-table-design-IMAGE09.png
[10]: ./media/storage-table-design-guide/storage-table-design-IMAGE10.png
[11]: ./media/storage-table-design-guide/storage-table-design-IMAGE11.png
[12]: ./media/storage-table-design-guide/storage-table-design-IMAGE12.png
[13]: ./media/storage-table-design-guide/storage-table-design-IMAGE13.png
[14]: ./media/storage-table-design-guide/storage-table-design-IMAGE14.png
[15]: ./media/storage-table-design-guide/storage-table-design-IMAGE15.png
[16]: ./media/storage-table-design-guide/storage-table-design-IMAGE16.png
[17]: ./media/storage-table-design-guide/storage-table-design-IMAGE17.png
[18]: ./media/storage-table-design-guide/storage-table-design-IMAGE18.png
[19]: ./media/storage-table-design-guide/storage-table-design-IMAGE19.png
[20]: ./media/storage-table-design-guide/storage-table-design-IMAGE20.png
[21]: ./media/storage-table-design-guide/storage-table-design-IMAGE21.png
[22]: ./media/storage-table-design-guide/storage-table-design-IMAGE22.png
[23]: ./media/storage-table-design-guide/storage-table-design-IMAGE23.png
[24]: ./media/storage-table-design-guide/storage-table-design-IMAGE24.png
[25]: ./media/storage-table-design-guide/storage-table-design-IMAGE25.png
[26]: ./media/storage-table-design-guide/storage-table-design-IMAGE26.png
[27]: ./media/storage-table-design-guide/storage-table-design-IMAGE27.png
[28]: ./media/storage-table-design-guide/storage-table-design-IMAGE28.png
[29]: ./media/storage-table-design-guide/storage-table-design-IMAGE29.png

