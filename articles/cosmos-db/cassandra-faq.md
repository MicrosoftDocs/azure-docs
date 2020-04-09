---
title: Frequently asked questions on Azure Cosmos DB API for Cassandra.
description: Get answers to frequently asked questions about Azure Cosmos DB API for Cassandra.
author: TheovanKraay
ms.service: cosmos-db
ms.topic: overview
ms.date: 04/09/2020
ms.author: thvankra
ms.custom: seodec20
---
# Frequently asked questions about the Azure Cosmos DB API for Cassandra

### What are some reasons I would want to chose the Cosmos DB Cassandra API over a native Apache Cassandra implementation?

- Cassandra API is fully managed Platform as a Service (PaaS) offering, providing consistent performance for reads/writes and throughput without the need for touching any of the typical configuration settings in a native Apache Cassandra setup. This significantly simplifies maintenance.
- Despite the PaaS nature of Cassandra API, it still supports a large surface area of the native [Apache Cassandra wire protocol](cassandra-support.md), allowing you to build applications on a widely used and cloud agnostic open source standard.
- Cassandra API provides a number of mechanisms and choices for [elastic scale](manage-scale-cassandra.md), which are much more difficult to achieve in a native Apache Cassandra implementation. 
- Cassandra API provides access to a persistent change log, the [Change Feed](cassandra-change-feed.md), which can facilitate event sourcing directly from the database. In native Cassandra, the only equivalent is change data capture (CDC), which is merely a mechanism to flag specific tables for archival as well as rejecting writes to those tables once a configurable size-on-disk for the CDC log is reached (these capabilities are redundant in Cosmos DB as the relevant aspects are automatically governed).
- Apache Cassandra has a 100MB limit on the size of a partition key. Cassandra API allows up to 10GB per partition.
- Apache Cassandra allows you to disable durable commits - i.e. skip writing to the commit log and go directly to the Memtable(s). This can lead to data loss if the node goes down prior to Memtables being flushed to SStables on disk. Cosmos DB always does durable commits so you will never have data loss.
- Apache Cassandra can see diminished performance if the workload involves a lot of replaces and/or deletes. The reason for this is tombstones that the read workload needs to skip over to fetch the latest data. Cassandra API will not see diminished read performance when the workload has a lot of replaces and/or deletes.
- In addition, during high replace workload scenarios, compaction needs to run to merge SSTables on disk (merge is needed because native Cassandra's writes are append only, thus multiple updates are stored as individual SSTable entries that need to be periodically merged). This can also lead to lowered read performance during compaction. This is not a problem with Cassandra API as it does not allow compaction.
- Setting a replication factor of 1 is possible with native Cassandra. However, this will lead to low availability should the only node with the data go down. This is not an issue with Cassandra API as there is always a replication factor = 4 (quorum of 3).
- Adding/removing nodes in native Cassandra requires a lot of manual intervention, but also high CPU on the new node while existing nodes move some of their token ranges to the new node. This is the same when decommissioning an existing node. However, scaling out is done seamlessly under the hood in the Cassandra API, without any issues observed in the service/application.
- There is no need to set num_tokens on each node in the cluster as in native Cassandra. Nodes and token ranges are fully managed by Cosmos DB.
- No need for nodetool commands such as repair, decommission etc. as in native Cassandra. Cassandra API is fully managed by Cosmos DB and none of this is needed.


### What is the protocol version supported by Azure Cosmos DB Cassandra API? Is there a plan to support other protocols?

Apache Cassandra API for Azure Cosmos DB supports today CQL version 4. If you have feedback about supporting other protocols, let us know via [user voice feedback](https://feedback.azure.com/forums/263030-azure-cosmos-db) or send an email to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com).

### Why is choosing a throughput for a table a requirement?

Azure Cosmos DB sets default throughput for your container based on where you create the table from - portal or CQL.
Azure Cosmos DB provides guarantees for performance and latency, with upper bounds on operation. This guarantee is possible when the engine can enforce governance on the tenant's operations. Setting throughput ensures that you get the guaranteed throughput and latency, because the platform reserves this capacity and guarantees operation success.
You can elastically change throughput to benefit from the seasonality of your application and save costs.

The throughput concept is explained in the [Request Units in Azure Cosmos DB](request-units.md) article. The throughput for a table is distributed across the underlying physical partitions equally.

### What is the default RU/s of table when created through CQL? What If I need to change it?

Azure Cosmos DB uses request units per second (RU/s) as a currency for providing throughput. Tables created through CQL have 400 RU. You can change the RU from the portal.

CQL

```shell
CREATE TABLE keyspaceName.tablename (user_id int PRIMARY KEY, lastname text) WITH cosmosdb_provisioned_throughput=1200
```

.NET

```csharp
int provisionedThroughput = 400;
var simpleStatement = new SimpleStatement($"CREATE TABLE {keyspaceName}.{tableName} (user_id int PRIMARY KEY, lastname text)");
var outgoingPayload = new Dictionary<string, byte[]>();
outgoingPayload["cosmosdb_provisioned_throughput"] = Encoding.UTF8.GetBytes(provisionedThroughput.ToString());
simpleStatement.SetOutgoingPayload(outgoingPayload);
```

### What happens when throughput is used up?

Azure Cosmos DB provides guarantees for performance and latency, with upper bounds on operation. This guarantee is possible when the engine can enforce governance on the tenant's operations. This is possible based on setting the throughput, which ensures that you get the guaranteed throughput and latency, because platform reserves this capacity and guarantees operation success.
When you go over this capacity, you get overloaded error message indicating your capacity was used up.
0x1001 Overloaded: the request can't be processed because "Request Rate is large". At this juncture, it's essential to see what operations and their volume causes this issue. You can get an idea about consumed capacity going over the provisioned capacity with metrics on the portal. Then you need to ensure capacity is consumed nearly equally across all underlying partitions. If you see most of the throughput is consumed by one partition, you have skew of workload.

Metrics are available that show you how throughput is used over hours, days, and per seven days, across partitions or in aggregate. For more information, see [Monitoring and debugging with metrics in Azure Cosmos DB](use-metrics.md).

Diagnostic logs are explained in the [Azure Cosmos DB diagnostic logging](logging.md) article.

### Does the primary key map to the partition key concept of Azure Cosmos DB?

Yes, the partition key is used to place the entity in right location. In Azure Cosmos DB, it's used to find right logical partition that's stored on a physical partition. The partitioning concept is well explained in the [Partition and scale in Azure Cosmos DB](partition-data.md) article. The essential take away here is that a logical partition shouldn't go over the 10-GB limit today.

### What happens when I get a quota full" notification indicating that a partition is full?

Azure Cosmos DB is a SLA-based system that provides unlimited scale, with guarantees for latency, throughput, availability, and consistency. This unlimited storage is based on horizontal scale out of data using partitioning as the key concept. The partitioning concept is well explained in the [Partition and scale in Azure Cosmos DB](partition-data.md) article.

The 10-GB limit on the number of entities or items per logical partition you should adhere to. To ensure that your application scales well, we recommend that you *not* create a hot partition by storing all information in one partition and querying it. This error can only come if your data is skewed: that is, you have lot of data for one partition key (more than 10&nbsp;GB). You can find the distribution of data using the storage portal. Way to fix this error is to recreate the table and choose a granular primary (partition key), which allows better distribution of data.

### Is it possible to use Cassandra API as key value store with millions or billions of individual partition keys?

Azure Cosmos DB can store unlimited data by scaling out the storage. This is independent of the throughput. Yes you can always just use Cassandra API to store and retrieve key/values by specifying right primary/partition key. These individual keys get their own logical partition and sit atop physical partition without issues.

### Is it possible to create more than one table with Apache Cassandra API of Azure Cosmos DB?

Yes, it's possible to create more than one table with Apache Cassandra API. Each of those tables is treated as unit for throughput and storage.

### Is it possible to create more than one table in succession?

Azure Cosmos DB is resource governed system for both data and control plane activities. Containers like collections, tables are runtime entities that are provisioned for given throughput capacity. The creation of these containers in quick succession isn't expected activity and throttled. If you have tests that drop/create tables immediately, try to space them out.

### What is maximum number of tables that can be created?

There's no physical limit on number of tables, send an email at [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) if you have large number of tables (where the total steady size goes over 10 TB of data) that need to be created from usual 10s or 100s.

### What is the maximum # of keyspace that we can create?

There's no physical limit on number of keyspaces as they're metadata containers, send an email at [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) if you have large number of keyspaces for some reason.

### Is it possible to bring in lot of data after starting from normal table?

The storage capacity is automatically managed and increases as you push in more data. So you can confidently import as much data as you need without managing and provisioning nodes, and more.

### Is it possible to supply yaml file settings to configure Apache Casssandra API of Azure Cosmos DB behavior?

Apache Cassandra API of Azure Cosmos DB is a platform service. It provides protocol level compatibility for executing operations. It hides away the complexity of management, monitoring, and configuration. As a developer/user, you don't need to worry about availability, tombstones, key cache, row cache, bloom filter, and multitude of other settings. Azure Cosmos DB's Apache Cassandra API focuses on providing read and write performance that you require without the overhead of configuration and management.

### Will Apache Cassandra API for Azure Cosmos DB support node addition/cluster status/node status commands?

Apache Cassandra API is a platform service that makes capacity planning, responding to the elasticity demands for throughput & storage a breeze. With Azure Cosmos DB you provision throughput, you need. Then you can scale it up and down any number of times through the day without worrying about adding/deleting nodes or managing them. This implies you don't need to use the node, cluster management tool too.

### What happens with respect to various config settings for keyspace creation like simple/network?

Azure Cosmos DB provides global distribution out of the box for availability and low latency reasons. You don't need to setup replicas or other things. All writes are always durably quorum committed in any region where you write while providing performance guarantees.

### What happens with respect to various settings for table metadata like bloom filter, caching, read repair change, gc_grace, compression memtable_flush_period, and more?

Azure Cosmos DB provides performance for reads/writes and throughput without need for touching any of the configuration settings and accidentally manipulating them.

### Is time-to-live (TTL) supported for Cassandra tables?

Yes, TTL is supported.

### Is it possible to monitor node status, replica status, gc, and OS parameters earlier with various tools? What needs to be monitored now?

Azure Cosmos DB is a platform service that helps you increase productivity and not worry about managing and monitoring infrastructure. You just need to take care of throughput that's available on portal metrics to find if you're getting throttled and increase or decrease that throughput.
Monitor [SLAs](monitor-accounts.md).
Use [Metrics](use-metrics.md)
Use [Diagnostic logs](logging.md).

### Which client SDKs can work with Apache Cassandra API of Azure Cosmos DB?

Apache Cassandra SDK's client drivers that use CQLv3 were used for client programs. If you have other drivers that you use or if you're facing issues, send mail to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com).

### Is composite partition key supported?

Yes, you can use regular syntax to create composite partition key.

### Can I use sstableloader for data loading?

No, sstableloader isn't supported.

### Can an on-premises Apache Cassandra cluster be paired with Azure Cosmos DB's Cassandra API?

At present Azure Cosmos DB has an optimized experience for cloud environment without overhead of operations. If you require pairing, send mail to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) with a description of your scenario. We are working on offering to help pair the on-premises/different cloud Cassandra cluster to Cosomos DB's Cassandra API.

### Does Cassandra API provide full backups?

Azure Cosmos DB provides two free full backups taken at four hours interval today across all APIs. This ensures you don't need to set up a backup schedule and other things.
If you want to modify retention and frequency, send an email to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) or raise a support case. Information about backup capability is provided in the [Automatic online backup and restore with Azure Cosmos DB](../synapse-analytics/sql-data-warehouse/backup-and-restore.md) article.

### How does the Cassandra API account handle failover if a region goes down?

The Azure Cosmos DB Cassandra API borrows from the globally distributed platform of Azure Cosmos DB. To ensure that your application can tolerate datacenter downtime, enable at least one more region for the account in the Azure Cosmos DB portal [Developing with multi-region Azure Cosmos DB accounts](high-availability.md). You can set the priority of the region by using the portal [Developing with multi-region Azure Cosmos DB accounts](high-availability.md).

You can add as many regions as you want for the account and control where it can fail over to by providing a failover priority. To use the database, you need to provide an application there too. When you do so, your customers won't experience downtime.

### Does the Apache Cassandra API index all attributes of an entity by default?

Cassandra API is planning to support Secondary indexing to help create selective index on certain attributes. 


### Can I use the new Cassandra API SDK locally with the emulator?

Yes this is supported. You can find learn details of how to enable this [here](local-emulator.md#cassandra-api)


### Feature x of regular Cassandra API isn't working as today, where can the feedback be provided?

Provide feedback via [user voice feedback](https://feedback.azure.com/forums/263030-azure-cosmos-db).

[azure-portal]: https://portal.azure.com
[query]: sql-api-sql-query.md
