---
title: Partitioning and horizontal scaling in Azure Cosmos DB | Microsoft Docs
description: Learn about how partitioning works in Azure Cosmos DB, how to configure partitioning and partition keys, and how to pick the right partition key for your application.
services: cosmos-db
author: arramac
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: cac9a8cd-b5a3-4827-8505-d40bb61b2416
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/29/2017
ms.author: arramac
ms.custom: H1Hack27Feb2017

---

# Partition and scale in Azure Cosmos DB

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) is a globally distributed, multimodel database service designed to help you achieve fast, predictable performance. It scales seamlessly along with your application as it grows. This article provides an overview of how partitioning works for all the data models in Azure Cosmos DB. It also describes how you can configure Azure Cosmos DB containers to effectively scale your applications.

Partitioning and partition keys are discussed in this Azure Friday video with Scott Hanselman and Azure Cosmos DB Principal Engineering Manager, Shireesh Thota:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Azure-DocumentDB-Elastic-Scale-Partitioning/player]
> 

## Partitioning in Azure Cosmos DB
In Azure Cosmos DB, you can store and query schema-less data with order-of-millisecond response times at any scale. Azure Cosmos DB provides containers for storing data called *collections* (for documents), *graphs*, or *tables*. Containers are logical resources and can span one or more physical partitions or servers. The number of partitions is determined by Azure Cosmos DB based on the storage size and the provisioned throughput of the container. Every partition in Azure Cosmos DB has a fixed amount of SSD-backed storage associated with it and is replicated for high availability. Partition management is fully managed by Azure Cosmos DB, and you don't have to write complex code or manage your partitions. Azure Cosmos DB containers are unlimited in terms of storage and throughput. 

![Resource partitioning](./media/introduction/azure-cosmos-db-partitioning.png) 

Partitioning is transparent to your application. Azure Cosmos DB supports fast reads and writes, queries, transactional logic, consistency levels, and fine-grained access control via methods/APIs to a single container resource. The service handles distributing data across partitions and routing query requests to the right partition. 

How does partitioning work? Each item must have a partition key and a row key, which uniquely identify it. Your partition key acts as a logical partition for your data and provides Azure Cosmos DB with a natural boundary for distributing data across partitions. In brief, here's how partitioning works in Azure Cosmos DB:

* You provision a Azure Cosmos DB container with `T` requests/s throughput.
* Behind the scenes, Azure Cosmos DB provisions partitions needed to serve `T` requests/s. If `T` is higher than the maximum throughput per partition `t`, then Azure Cosmos DB provisions `N` = `T/t` partitions.
* Azure Cosmos DB allocates the key space of partition key hashes evenly across the `N` partitions. So, each partition (physical partition) hosts 1-N partition key values (logical partitions).
* When a physical partition `p` reaches its storage limit, Azure Cosmos DB seamlessly splits `p` into two new partitions, `p1` and `p2`. It distributes values corresponding to roughly half the keys to each of the partitions. This split operation is invisible to your application.
* Similarly, when you provision throughput higher than `t*N`, Azure Cosmos DB splits one or more of your partitions to support the higher throughput.

The semantics for partition keys are slightly different to match the semantics of each API, as shown in the following table:

| API | Partition key | Row key |
| --- | --- | --- |
| Azure Cosmos DB | Custom partition key path | Fixed `id` | 
| MongoDB | Custom shared key  | Fixed `_id` | 
| Graph | Custom partition key property | Fixed `id` | 
| Table | Fixed `PartitionKey` | Fixed `RowKey` | 

Azure Cosmos DB uses hash-based partitioning. When you write an item, Azure Cosmos DB hashes the partition key value and uses the hashed result to determine which partition to store the item in. Azure Cosmos DB stores all items with the same partition key in the same physical partition. The choice of the partition key is an important decision that you have to make at design time. You must pick a property name that has a wide range of values and has even access patterns.

> [!NOTE]
> It's a best practice to have a partition key with many distinct values (hundreds to thousands at a minimum).
>

Azure Cosmos DB containers can be created as *fixed* or *unlimited*. Fixed-size containers have a maximum limit of 10 GB and 10,000 RU/s throughput. Some APIs allow the partition key to be omitted for fixed-size containers. To create a container as unlimited, you must specify a minimum throughput of 2,500 RU/s.

## Partitioning and provisioned throughput
Azure Cosmos DB is designed for predictable performance. When you create a container, you reserve throughput in terms of *[request units](request-units.md) (RU) per second*. Each request is assigned a RU charge that is proportionate to the amount of system resources like CPU, memory, and IO consumed by the operation. A read of a 1-KB document with session consistency consumes 1 RU. A read is 1 RU regardless of the number of items stored or the number of concurrent requests running at the same time. Larger items require higher RUs depending on the size. If you know the size of your entities and the number of reads you need to support for your application, you can provision the exact amount of throughput required for your application's read needs. 

> [!NOTE]
> To achieve the full throughput of the container, you must choose a partition key that allows you to evenly distribute requests among some distinct partition key values.
> 
> 

<a name="designing-for-partitioning"></a>
## Work with the Azure Cosmos DB APIs
You can use the Azure portal or Azure CLI to create containers and scale them at any time. This section shows how to create containers and specify the throughput and partition key definition in each of the supported APIs.

### Azure Cosmos DB API
The following sample shows how to create a container (collection) by using the Azure Cosmos DB API. 

```csharp
DocumentClient client = new DocumentClient(new Uri(endpoint), authKey);
await client.CreateDatabaseAsync(new Database { Id = "db" });

DocumentCollection myCollection = new DocumentCollection();
myCollection.Id = "coll";
myCollection.PartitionKey.Paths.Add("/deviceId");

await client.CreateDocumentCollectionAsync(
    UriFactory.CreateDatabaseUri("db"),
    myCollection,
    new RequestOptions { OfferThroughput = 20000 });
```

You can read an item (document) by using the `GET` method in the REST API or by using `ReadDocumentAsync` in one of the SDKs.

```csharp
// Read document. Needs the partition key and the ID to be specified
DeviceReading document = await client.ReadDocumentAsync<DeviceReading>(
  UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
  new RequestOptions { PartitionKey = new PartitionKey("XMS-0001") });
```

### MongoDB API
With the MongoDB API, you can create a sharded collection through your favorite tool, driver, or SDK. In this example, we use the Mongo Shell for the collection creation.

In the Mongo Shell:

```
db.runCommand( { shardCollection: "admin.people", key: { region: "hashed" } } )
```
    
Results:

```JSON
{
    "_t" : "ShardCollectionResponse",
    "ok" : 1,
    "collectionsharded" : "admin.people"
}
```

### Table API

With the Table API, you specify the throughput for tables in the appSettings configuration for your application.

```xml
<configuration>
    <appSettings>
      <!--Table creation options -->
      <add key="TableThroughput" value="700"/>
    </appSettings>
</configuration>
```

Then you create a table by using the Azure Table storage SDK. The partition key is implicitly created as the `PartitionKey` value. 

```csharp
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

CloudTable table = tableClient.GetTableReference("people");
table.CreateIfNotExists();
```

You can retrieve a single entity by using the following snippet:

```csharp
// Create a retrieve operation that takes a customer entity.
TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>("Smith", "Ben");

// Execute the retrieve operation.
TableResult retrievedResult = table.Execute(retrieveOperation);
```
For more information, see [Develop with the Table API](tutorial-develop-table-dotnet.md).

### Graph API

With the Graph API, you must use the Azure portal or Azure CLI to create containers. Alternatively, because Azure Cosmos DB is multimodel, you can use one of the other models to create and scale your graph container.

You can read any vertex or edge by using the partition key and ID in Gremlin. For example, for a graph with region ("USA") as the partition key and "Seattle" as the row key, you can find a vertex by using the following syntax:

```
g.V(['USA', 'Seattle'])
```

You can reference an edge by using the partition key and the row key.

```
g.E(['USA', 'I5'])
```

For more information, see [Gremlin support for Azure Cosmos DB](gremlin-support.md).


<a name="designing-for-partitioning"></a>
## Design for partitioning
To scale effectively with Azure Cosmos DB, you need to pick a good partition key when you create your container. There are two main considerations for choosing a partition key:

* **Boundary for query and transactions**. Your choice of partition key should balance the need to enable the use of transactions against the requirement to distribute your entities across multiple partition keys to ensure a scalable solution. At one extreme, you can set the same partition key for all your items, but this option might limit the scalability of your solution. At the other extreme, you can assign a unique partition key for each item. This choice is highly scalable, but it prevents you from using cross-document transactions via stored procedures and triggers. An ideal partition key enables you to use efficient queries and has sufficient cardinality to ensure your solution is scalable. 
* **No storage and performance bottlenecks**. It's important to pick a property that allows writes to be distributed across various distinct values. Requests to the same partition key can't exceed the throughput of a single partition and are throttled. So it's important to pick a partition key that doesn't result in "hot spots" within your application. Because all the data for a single partition key must be stored within a partition, you should avoid partition keys that have high volumes of data for the same value. 

Let's look at a few real-world scenarios and good partition keys for each:
* If you're implementing a user profile back end, the user ID is a good choice for partition key.
* If you're storing IoT data, for example, device state, a device ID is a good choice for partition key.
* If you're using Azure Cosmos DB for logging time-series data, the hostname or process ID is a good choice for partition key.
* If you have a multitenant architecture, the tenant ID is a good choice for partition key.

In some use cases, like IoT and user profiles, the partition key might be the same as your ID (document key). In others, like the time-series data, you might have a partition key that's different from the ID.

### Partitioning and logging/time-series data
One of the common use cases of Azure Cosmos DB is for logging and telemetry. It's important to pick a good partition key, because you might need to read/write vast volumes of data. The choice depends on your read-and-write rates and the kinds of queries you expect to run. Here are some tips on how to choose a good partition key:

* If your use case involves a small rate of writes that accumulate over a long time and you need to query by ranges of time stamps and other filters, use a rollup of the time stamp. For example, a good approach is to use date as a partition key. With this approach, you can query over all the data for a date from a single partition. 
* If your workload is written heavy, which is more common, use a partition key that's not based on time stamp. With this approach, Azure Cosmos DB can distribute writes evenly across various partitions. Here a hostname, process ID, activity ID, or another property with high cardinality is a good choice. 
* Another approach is a hybrid one where you have multiple containers, one for each day/month, and the partition key is a granular property like hostname. This approach has the benefit that you can set different throughput based on the time window. For example, the container for the current month is provisioned with higher throughput because it serves reads and writes. Previous months are provisioned with lower throughput because they only serve reads.

### Partitioning and multitenancy
If you're implementing a multitenant application by using Azure Cosmos DB, there are two popular patterns: one partition key per tenant and one container per tenant. Here are the pros and cons for each:

* **One partition key per tenant**. In this model, tenants are collocated within a single container. But queries and inserts for items within a single tenant can be performed against a single partition. You can also implement transactional logic across all items within a tenant. Because multiple tenants share a container, you can save storage and throughput costs by pooling resources for tenants within a single container rather than provisioning extra headroom for each tenant. The drawback is that you don't have performance isolation per tenant. Performance/throughput increases apply to the entire container versus targeted increases for tenants.
* **One container per tenant**. In this model, each tenant has its own container, and you can reserve performance per tenant. With the Azure Cosmos DB new provisioning pricing, this model is more cost-effective for multitenant applications with a few tenants.

You can also use a combination/tiered approach that collocates small tenants and migrates larger tenants to their own container.

## Next steps
In this article, we provided an overview of concepts and best practices for partitioning with any Azure Cosmos DB API. 

* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md).
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md).



