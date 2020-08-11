---
title: Frequently asked questions about the Cassandra API for Azure Cosmos DB
description: Get answers to frequently asked questions about the Cassandra API for Azure Cosmos DB.
author: TheovanKraay
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/09/2020
ms.author: thvankra
---
# Frequently asked questions about the Cassandra API in Azure Cosmos DB

This article describes the functionality differences between Apache Cassandra and Cassandra API in Azure Cosmos DB. It also provides answers to frequently asked questions about the Cassandra API in Azure Cosmos DB.

## Key differences between Apache Cassandra and the Cassandra API

- Apache Cassandra recommends a 100-MB limit on the size of a partition key. The Cassandra API for Azure Cosmos DB allows up to 20 GB per partition.
- Apache Cassandra allows you to disable durable commits. You can skip writing to the commit log and go directly to the memtables. This can lead to data loss if the node goes down before memtables are flushed to SSTables on disk. Azure Cosmos DB always does durable commits to help prevent data loss.
- Apache Cassandra can see diminished performance if the workload involves many replacements or deletions. The reason is tombstones that the read workload needs to skip over to fetch the latest data. The Cassandra API won't see diminished read performance when the workload has many replacements or deletions.
- During scenarios of high replacement workloads, compaction needs to run to merge SSTables on disk. (A merge is needed because Apache Cassandra's writes are append only. Multiple updates are stored as individual SSTable entries that need to be periodically merged). This situation can also lead to lowered read performance during compaction. This performance impact doesn't happen in the Cassandra API because the API doesn't implement compaction.
- Setting a replication factor of 1 is possible with Apache Cassandra. However, it leads to low availability if the only node with the data goes down. This is not an issue with the Cassandra API for Azure Cosmos DB because there is always a replication factor of 4 (quorum of 3).
- Adding or removing nodes in Apache Cassandra requires manual intervention, along with high CPU usage on the new node while existing nodes move some of their token ranges to the new node. This situation is the same when you're decommissioning an existing node. However, the Cassandra API scales out without any issues observed in the service or application.
- There is no need to set **num_tokens** on each node in the cluster as in Apache Cassandra. Azure Cosmos DB fully manages nodes and token ranges.
- The Cassandra API is fully managed. You don't need the **nodetool** commands, such as repair and decommission, that are used in Apache Cassandra.

## Other frequently asked questions

### What protocol version does the Cassandra API support?

The Cassandra API for Azure Cosmos DB supports CQL version 3.x. Its CQL compatibility is based on the public [Apache Cassandra GitHub repository](https://github.com/apache/cassandra/blob/trunk/doc/cql3/CQL.textile). If you have feedback about supporting other protocols, let us know via [user voice feedback](https://feedback.azure.com/forums/263030-azure-cosmos-db) or send email to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com).

### Why is choosing throughput for a table a requirement?

Azure Cosmos DB sets the default throughput for your container based on where you create the table from: Azure portal or CQL.

Azure Cosmos DB provides guarantees for performance and latency, with upper bounds on operations. These guarantees are possible when the engine can enforce governance on the tenant's operations. Setting throughput ensures that you get the guaranteed throughput and latency, because the platform reserves this capacity and guarantees operation success.
You can [elastically change throughput](manage-scale-cassandra.md) to benefit from the seasonality of your application and save costs.

The throughput concept is explained in the [Request Units in Azure Cosmos DB](request-units.md) article. The throughput for a table is equally distributed across the underlying physical partitions.

### What is the throughput of a table that's created through CQL?

Azure Cosmos DB uses Request Units per second (RU/s) as a currency for providing throughput. Tables created through CQL have 400 RU by default. You can change the RU from the Azure portal.

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

Azure Cosmos DB provides guarantees for performance and latency, with upper bounds on operations. These guarantees are possible when the engine can enforce governance on the tenant's operations. Setting throughput ensures that you get the guaranteed throughput and latency, because the platform reserves this capacity and guarantees operation success.

When you go over this capacity, you get the following error message that indicates your capacity was used up:

**0x1001 Overloaded: the request can't be processed because "Request Rate is large"** 

It's essential to see what operations (and their volume) cause this issue. You can get an idea about consumed capacity going over the provisioned capacity with metrics on the Azure portal. Then you need to ensure that capacity is consumed nearly equally across all underlying partitions. If you see that one partition is consuming most of the throughput, you have skew of workload.

Metrics are available that show you how throughput is used over hours, over days, and per seven days, across partitions or in aggregate. For more information, see [Monitoring and debugging with metrics in Azure Cosmos DB](use-metrics.md).

Diagnostic logs are explained in the [Azure Cosmos DB diagnostic logging](logging.md) article.

### Does the primary key map to the partition key concept of Azure Cosmos DB?

Yes, the partition key is used to place the entity in the right location. In Azure Cosmos DB, it's used to find the right logical partition that's stored on a physical partition. The partitioning concept is well explained in the [Partition and scale in Azure Cosmos DB](partition-data.md) article. The essential takeaway here is that a logical partition shouldn't go over the 10-GB limit.

### What happens when I get a notification that a partition is full?

Azure Cosmos DB is a system based on service-level agreement (SLA). It provides unlimited scale, with guarantees for latency, throughput, availability, and consistency. This unlimited storage is based on horizontal scale-out of data, using partitioning as the key concept. The partitioning concept is well explained in the [Partition and scale in Azure Cosmos DB](partition-data.md) article.

You should adhere to the 10-GB limit on the number of entities or items per logical partition. To ensure that your application scales well, we recommend that you *not* create a hot partition by storing all information in one partition and querying it. This error can come only if your data is skewed: that is, you have lot of data for one partition key (more than 10&nbsp;GB). You can find the distribution of data by using the storage portal. The way to fix this error is to re-create the table and choose a granular primary (partition key), which allows better distribution of data.

### Can I use the Cassandra API as a key value store with millions or billions of partition keys?

Azure Cosmos DB can store unlimited data by scaling out the storage. This storage is independent of the throughput. Yes, you can always use the Cassandra API just to store and retrieve keys and values by specifying the right primary/partition key. These individual keys get their own logical partition and sit atop a physical partition without issues.

### Can I create more than one table with the Cassandra API?

Yes, it's possible to create more than one table with the Cassandra API. Each of those tables is treated as unit for throughput and storage.

### Can I create more than one table in succession?

Azure Cosmos DB is resource-governed system for both data and control plane activities. Containers, like collections and tables, are runtime entities that are provisioned for a given throughput capacity. The creation of these containers in quick succession isn't an expected activity and might be throttled. If you have tests that drop or create tables immediately, try to space them out.

### What is the maximum number of tables that I can create?

There's no physical limit on the number of tables. If you have a large number of tables (where the total steady size goes over 10 TB of data) that need to be created, not the usual tens or hundreds, send email to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com).

### What is the maximum number of keyspaces that I can create?

There's no physical limit on the number of keyspaces because they're metadata containers. If you have a large number of keyspaces, send email to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com).

### Can I bring in a lot of data after starting from a normal table?

Yes. Assuming uniformly distributed partitions, the storage capacity is automatically managed and increases as you push in more data. So you can confidently import as much data as you need without managing and provisioning nodes and more. But if you're anticipating a lot of immediate data growth, it makes more sense to directly [provision for the anticipated throughput](set-throughput.md) rather than starting lower and increasing it immediately.

### Can I use YAML file settings to configure API behavior?

The Cassandra API for Azure Cosmos DB provides protocol-level compatibility for executing operations. It hides away the complexity of management, monitoring, and configuration. As a developer/user, you don't need to worry about availability, tombstones, key cache, row cache, bloom filter, and a multitude of other settings. The Cassandra API focuses on providing the read and write performance that you need without the overhead of configuration and management.

### Will the Cassandra API support node addition, cluster status, and node status commands?

The Cassandra API simplifies capacity planning and responding to the elasticity demands for throughput and storage. With Azure Cosmos DB, you provision the throughput that you need. Then you can scale it up and down any number of times through the day, without worrying about adding, deleting, or managing nodes. You don't need to use tools for node and cluster management.

### What happens with various configuration settings for keyspace creation like simple/network?

Azure Cosmos DB provides global distribution out of the box for availability and low-latency reasons. You don't need to set up replicas or other things. Writes are always durably quorum committed in any region where you write, while providing performance guarantees.

### What happens with various settings for table metadata?

Azure Cosmos DB provides performance guarantees for reads, writes, and throughput. So you don't need to worry about touching any of the configuration settings and accidentally manipulating them. Those settings include bloom filter, caching, read repair chance, gc_grace, and compression memtable_flush_period.

### Is time-to-live supported for Cassandra tables?

Yes, TTL is supported.

### How can I monitor infrastructure along with throughput?

Azure Cosmos DB is a platform service that helps you increase productivity and not worry about managing and monitoring infrastructure. For example, you don't need to monitor node status, replica status, gc, and OS parameters earlier with various tools. You just need to take care of throughput that's available in portal metrics to see if you're getting throttled, and then increase or decrease that throughput. You can:

- Monitor [SLAs](monitor-accounts.md)
- Use [metrics](use-metrics.md)
- Use [diagnostic logs](logging.md)

### Which client SDKs can work with the Cassandra API?

The Apache Cassandra SDK's client drivers that use CQLv3 were used for client programs. If you have other drivers that you use or if you're facing issues, send mail to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com).

### Are composite partition keys supported?

Yes, you can use regular syntax to create composite partition keys.

### Can I use sstableloader for data loading?

No, sstableloader isn't supported.

### Can I pair an on-premises Apache Cassandra cluster with the Cassandra API?

At present, Azure Cosmos DB has an optimized experience for a cloud environment without the overhead of operations. If you require pairing, send mail to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) with a description of your scenario. We're working on an offering to help pair the on-premises or cloud Cassandra cluster with the Cassandra API for Azure Cosmos DB.

### Does the Cassandra API provide full backups?

Azure Cosmos DB provides two free full backups taken at four-hour intervals across all APIs. So you don't need to set up a backup schedule. 

If you want to modify retention and frequency, send email to [askcosmosdbcassandra@microsoft.com](mailto:askcosmosdbcassandra@microsoft.com) or raise a support case. Information about backup capability is provided in the [Automatic online backup and restore with Azure Cosmos DB](online-backup-and-restore.md) article.

### How does the Cassandra API account handle failover if a region goes down?

The Cassandra API borrows from the globally distributed platform of Azure Cosmos DB. To ensure that your application can tolerate datacenter downtime, enable at least one more region for the account in the Azure portal. For more information, see [High availability with Azure Cosmos DB](high-availability.md).

You can add as many regions as you want for the account and control where it can fail over to by providing a failover priority. To use the database, you need to provide an application there too. When you do so, your customers won't experience downtime.

### Does the Cassandra API index all attributes of an entity by default?

No. The Cassandra API supports [secondary indexes](cassandra-secondary-index.md), which behave in a similar way to Apache Cassandra. The API does not index every attribute by default.  


### Can I use the new Cassandra API SDK locally with the emulator?

Yes, this is supported. You can find details on how to enable this in the [Use the Azure Cosmos Emulator for local development and testing](local-emulator.md#cassandra-api) article.


### How can I migrate data from Apache Cassandra clusters to Azure Cosmos DB?

You can read about migration options in the [Migrate your data to Cassandra API account in Azure Cosmos DB](cassandra-import-data.md) tutorial.


### Where can I give feedback on Cassandra API features?

Provide feedback via [user voice feedback](https://feedback.azure.com/forums/263030-azure-cosmos-db).

[azure-portal]: https://portal.azure.com
[query]: sql-api-sql-query.md

## Next steps

- Get started with [elastically scaling an Azure Cosmos DB Cassandra API account](manage-scale-cassandra.md).
