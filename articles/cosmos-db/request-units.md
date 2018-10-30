---
title: Request units and throughput in Azure Cosmos DB
description: Learn about how to understand, specify, and estimate request unit requirements in Azure Cosmos DB
services: cosmos-db
author: rimman
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: rimman

---
# Request units

With Azure Cosmos DB, you pay for the throughput you provision and the storage you consume on an hourly basis.  Throughput must be provisioned to ensure that sufficient system resources are available for your Cosmos database at all times to meet or exceed the Cosmos DB SLA.

Cosmos DB supports a variety of APIs (SQL, MongoDB, Cassandra, Gremlin, and Table), each with its own set of database operations, ranging from simple point reads and writes to complex queries. Each database operation consumes system resources to a greater or lesser degree depending upon the complexity of the operation.  The cost of all database operations is normalized by Cosmos DB and is expressed in terms of Request Units (RUs). The cost of performing a read operation of a 1-KB item is 1 Request Unit (1 RU). All other database operations are similarly assigned a cost in terms of RUs. Regardless of the API you are using to interact with your Cosmos container and the specific database operation (write, read, query), costs are always expressed in terms of RUs.

You can think of RU/s as the currency for throughput. RU/s is a rate-based currency, which abstracts the system resources (CPU, IOPS, and memory) required to perform the wide variety of database operations that Cosmos DB supports.

![Database operations consume request units](./media/partition-data/request-units.png)
**Database operations consume request units**

For managing and planning capacity, Cosmos DB ensures that the number of RUs for a given database operation over a given dataset is deterministic. You can track the number of RUs that are consumed by any database operation by examining the response header. See here for the how-to find out the consumed RUs for a database operation. Once you understand the factors that affect Request Unit charges, and your application's throughput requirements, you can run your application as cost-effectively as possible.  For more information about Request Unit charges, see [how to find out the consumed RUs for a database operation](TBD).

While you are billed at an hourly granularity, you provision the number of guaranteed RUs for your application on a per-second basis in increments of 100 RU/s. To scale up or down provisioned throughput for your application, you can increase or decrease the number of RUs (in the increments or decrements of 100 RUs) at any time, either programmatically or via the Azure portal.

You can provision throughput at two distinct granularities: containers and databases. For more information, see [how to provision throughput on Cosmos containers](TBD) and [how to provision throughput on Cosmos databases](TBD).

## Request unit considerations

While estimating the number of RU/s to provision, it is important to consider the following factors:

* Item size. As the size of an item increases, the number of RUs consumed to read or write the item also increases.
* Document indexing. By default, each item is automatically indexed. You consume fewer request units if you choose to not index some of your items in a container.
* Item property count. Assuming the default setting of indexing of all properties, the number of RUs consumed to write an item increases as the property count increases.
* Indexed properties. An index policy on each container determines which properties are indexed by default. You can reduce your request unit consumption for write operations by limiting the number of indexed properties.
* Data consistency. The strong and bounded staleness consistency levels consume approximately 2X more RUs while performing read operations as compared to more relaxed consistency models.
* Query patterns. The complexity of a query affects how many request units are consumed for an operation. The number of query results, the number of predicates, the nature of the predicates, the number of user-defined functions, the size of the source data, the size of the result set and projections all affect the cost of query operations. Cosmos DB guarantees that the same query on the same data will always cost the same number of RUs on repeat executions.
* Script usage. As with queries, stored procedures and triggers consume RUs based on the complexity of the operations being performed. As you develop your application, inspect the request charge header to better understand how much request unit capacity each operation consumes. For more information, see [how to find out the consumed RUs for a database operation](TBD).

## Next steps

* Learn more about [Provisioning throughput for Cosmos DB containers and databases](set-throughput.md)
* Learn more about [Logical partitions](partition-data.md)
* Learn more about [Scaling throughput](scaling-throughput.md)
* Learn [how to provision throughput on Cosmos containers](TBD)
* Learn [how to provision throughput on Cosmos databases](TBD)
* Learn [how to find out the consumed RUs for a database operation](TBD)