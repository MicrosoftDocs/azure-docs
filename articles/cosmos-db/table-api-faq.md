---
title: Frequently asked questions about the Table API in Azure Cosmos DB
description: Get answers to frequently asked questions about the Table API in Azure Cosmos DB
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/28/2020
ms.author: sngun
---

# Frequently asked questions about the Table API in Azure Cosmos DB

The Azure Cosmos DB Table API is available in the [Azure portal](https://portal.azure.com) First you must sign up for an Azure subscription. After you've signed up, you can add an Azure Cosmos DB Table API account to your Azure subscription, and then add tables to your account. You can find the supported languages and associated quick-starts in the [Introduction to Azure Cosmos DB Table API](table-introduction.md).

## <a id="table-api-vs-table-storage"></a>Table API in Azure Cosmos DB Vs Azure Table storage

### Where is Table API not identical with Azure Table storage behavior?

There are some behavior differences that users coming from Azure Table storage who want to create tables with the Azure Cosmos DB Table API should be aware of:

* Azure Cosmos DB Table API uses a reserved capacity model in order to ensure guaranteed performance but this means that one pays for the capacity as soon as the table is created, even if the capacity isn't being used. With Azure Table storage one only pays for capacity that's used. This helps to explain why Table API can offer a 10 ms read and 15 ms write SLA at the 99th percentile while Azure Table storage offers a 10-second SLA. But as a consequence, with Table API tables, even empty tables without any requests, cost money in order to ensure the capacity is available to handle any requests to them at the SLA offered by Azure Cosmos DB.

* Query results returned by the Table API aren't sorted in partition key/row key order as they are in Azure Table storage.

* Row keys can only be up to 255 bytes.

* Batches can only have up to 2 MBs.

* CORS isn't currently supported.

* Table names in Azure Table storage aren't case-sensitive, but they are in Azure Cosmos DB Table API.

* Some of Azure Cosmos DB's internal formats for encoding information, such as binary fields, are currently not as efficient as one might like. Therefore this can cause unexpected limitations on data size. For example, currently one couldn't use the full one Meg of a table entity to store binary data because the encoding increases the data's size.

* Entity property name 'ID' currently not supported.

* TableQuery TakeCount isn't limited to 1000.

* In terms of the REST API there are a number of endpoints/query options that aren't supported by Azure Cosmos DB Table API:

  | Rest Method(s) | Rest Endpoint/Query Option | Doc URLs | Explanation |
  | ------------| ------------- | ---------- | ----------- |
  | GET, PUT | `/?restype=service@comp=properties`| [Set Table Service Properties](/rest/api/storageservices/set-table-service-properties) and [Get Table Service Properties](/rest/api/storageservices/get-table-service-properties) | This endpoint is used to set CORS rules, storage analytics configuration, and logging settings. CORS is currently not supported and analytics and logging are handled differently in Azure Cosmos DB than Azure Storage Tables |
  | OPTIONS | `/<table-resource-name>` | [Pre-flight CORS table request](/rest/api/storageservices/preflight-table-request) | This is part of CORS which Azure Cosmos DB doesn't currently support. |
  | GET | `/?restype=service@comp=stats` | [Get Table Service Stats](/rest/api/storageservices/get-table-service-stats) | Provides information how quickly data is replicating between primary and secondaries. This isn't needed in Cosmos DB as the replication is part of writes. |
  | GET, PUT | `/mytable?comp=acl` | [Get Table ACL](/rest/api/storageservices/get-table-acl) and [Set Table ACL](/rest/api/storageservices/set-table-acl) | This gets and sets the stored access policies used to manage Shared Access Signatures (SAS). Although SAS is supported, they are set and managed differently. |

* Azure Cosmos DB Table API only supports the JSON format, not ATOM.

* While Azure Cosmos DB supports Shared Access Signatures (SAS) there are certain policies it doesn't support, specifically those related to management operations such as the right to create new tables.

* For the .NET SDK in particular, there are some classes and methods that Azure Cosmos DB doesn't currently support.

  | Class | Unsupported Method |
  |-------|-------- |
  | CloudTableClient | \*ServiceProperties* |
  |                  | \*ServiceStats* |
  | CloudTable | SetPermissions* |
  |            | GetPermissions* |
  | TableServiceContext | * (this class is deprecated) |
  | TableServiceEntity | " " |
  | TableServiceExtensions | " " |
  | TableServiceQuery | " " |

## Other frequently asked questions

### Do I need a new SDK to use the Table API?

No, existing storage SDKs should still work. However, it's recommended that one always gets the latest SDKs for the best support and in many cases superior performance. See the list of available languages in the [Introduction to Azure Cosmos DB Table API](table-introduction.md).

### What is the connection string that I need to use to connect to the Table API?

The connection string is:

```
DefaultEndpointsProtocol=https;AccountName=<AccountNamefromCosmosDB;AccountKey=<FromKeysPaneofCosmosDB>;TableEndpoint=https://<AccountName>.table.cosmosdb.azure.com
```

You can get the connection string from the Connection String page in the Azure portal.

### How do I override the config settings for the request options in the .NET SDK for the Table API?

Some settings are handled on the CreateCloudTableClient method and other via the app.config in the appSettings section in the client application. For information about config settings, see [Azure Cosmos DB capabilities](tutorial-develop-table-dotnet.md).

### Are there any changes for customers who are using the existing Azure Table storage SDKs?

None. There are no changes for existing or new customers who are using the existing Azure Table storage SDKs.

### How do I view table data that's stored in Azure Cosmos DB for use with the Table API?

You can use the Azure portal to browse the data. You can also use the Table API code or the tools mentioned in the next answer.

### Which tools work with the Table API?

You can use the [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer).

Tools with the flexibility to take a connection string in the format specified previously can support the new Table API. A list of table tools is provided on the [Azure Storage Client Tools](../storage/common/storage-explorers.md) page.

### Is the concurrency on operations controlled?

Yes, optimistic concurrency is provided via the use of the ETag mechanism.

### Is the OData query model supported for entities?

Yes, the Table API supports OData query and LINQ query.

### Can I connect to Azure Table Storage and Azure Cosmos DB Table API side by side in the same application?

Yes, you can connect by creating two separate instances of the CloudTableClient, each pointing to its own URI via the connection string.

### How do I migrate an existing Azure Table storage application to this offering?

[AzCopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy) and the [Azure Cosmos DB Data Migration Tool](import-data.md) are both supported.

### How is expansion of the storage size done for this service if, for example, I start with *n* GB of data and my data will grow to 1 TB over time?

Azure Cosmos DB is designed to provide unlimited storage via the use of horizontal scaling. The service can monitor and effectively increase your storage.

### How do I monitor the Table API offering?

You can use the Table API **Metrics** pane to monitor requests and storage usage.

### How do I calculate the throughput I require?

You can use the capacity estimator to calculate the TableThroughput that's required for the operations. For more information, see [Estimate Request Units and Data Storage](https://www.documentdb.com/capacityplanner). In general, you can show your entity as JSON and provide the numbers for your operations.

### Can I use the Table API SDK locally with the emulator?

Not at this time.

### Can my existing application work with the Table API?

Yes, the same API is supported.

### Do I need to migrate my existing Azure Table storage applications to the SDK if I don't want to use the Table API features?

No, you can create and use existing Azure Table storage assets without interruption of any kind. However, if you don't use the Table API, you can't benefit from the automatic index, the additional consistency option, or global distribution.

### How do I add replication of the data in the Table API across more than one region of Azure?

You can use the Azure Cosmos DB portal's [global replication settings](tutorial-global-distribution-sql-api.md#portal) to add regions that are suitable for your application. To develop a globally distributed application, you should also add your application with the PreferredLocation information set to the local region for providing low read latency.

### How do I change the primary write region for the account in the Table API?

You can use the Azure Cosmos DB global replication portal pane to add a region and then fail over to the required region. For instructions, see [Developing with multi-region Azure Cosmos DB accounts](high-availability.md).

### How do I configure my preferred read regions for low latency when I distribute my data?

To help read from the local location, use the PreferredLocation key in the app.config file. For existing applications, the Table API throws an error if LocationMode is set. Remove that code, because the Table API picks up this information from the app.config file. 

### How should I think about consistency levels in the Table API?

Azure Cosmos DB provides well-reasoned trade-offs between consistency, availability, and latency. Azure Cosmos DB offers five consistency levels to Table API developers, so you can choose the right consistency model at the table level and make individual requests while querying the data. When a client connects, it can specify a consistency level. You can change the level via the consistencyLevel argument of CreateCloudTableClient.

The Table API provides low-latency reads with "Read your own writes," with Bounded-staleness consistency as the default. For more information, see [Consistency levels](consistency-levels.md).

By default, Azure Table storage provides Strong consistency within a region and Eventual consistency in the secondary locations.

### Does Azure Cosmos DB Table API offer more consistency levels than Azure Table storage?

Yes, for information about how to benefit from the distributed nature of Azure Cosmos DB, see [Consistency levels](consistency-levels.md). Because guarantees are provided for the consistency levels, you can use them with confidence.

### When global distribution is enabled, how long does it take to replicate the data?

Azure Cosmos DB commits the data durably in the local region and pushes the data to other regions immediately in a matter of milliseconds. This replication is dependent only on the round-trip time (RTT) of the datacenter. To learn more about the global-distribution capability of Azure Cosmos DB, see [Azure Cosmos DB: A globally distributed database service on Azure](distribute-data-globally.md).

### Can the read request consistency level be changed?

With Azure Cosmos DB, you can set the consistency level at the container level (on the table). By using the .NET SDK, you can change the level by providing the value for TableConsistencyLevel key in the app.config file. The possible values are: Strong, Bounded Staleness, Session, Consistent Prefix, and Eventual. For more information, see [Tunable data consistency levels in Azure Cosmos DB](consistency-levels.md). The key idea is that you can't set the request consistency level at more than the setting for the table. For example, you can't set the consistency level for the table at Eventual and the request consistency level at Strong.

### How does the Table API handle failover if a region goes down?

The Table API leverages the globally distributed platform of Azure Cosmos DB. To ensure that your application can tolerate datacenter downtime, enable at least one more region for the account in the Azure Cosmos DB portal [Developing with multi-region Azure Cosmos DB accounts](high-availability.md). You can set the priority of the region by using the portal [Developing with multi-region Azure Cosmos DB accounts](high-availability.md).

You can add as many regions as you want for the account and control where it can fail over to by providing a failover priority. To use the database, you need to provide an application there too. When you do so, your customers won't experience downtime. The [latest .NET client SDK](table-sdk-dotnet.md) is auto homing but the other SDKs aren't. That is, it can detect the region that's down and automatically fail over to the new region.

### Is the Table API enabled for backups?

Yes, the Table API leverages the platform of Azure Cosmos DB for backups. Backups are made automatically. For more information, see [Online backup and restore with Azure Cosmos DB](online-backup-and-restore.md).

### Does the Table API index all attributes of an entity by default?

Yes, all attributes of an entity are indexed by default. For more information, see [Azure Cosmos DB: Indexing policies](index-policy.md).

### Does this mean I don't have to create more than one index to satisfy the queries?

Yes, Azure Cosmos DB Table API provides automatic indexing of all attributes without any schema definition. This automation frees developers to focus on the application rather than on index creation and management. For more information, see [Azure Cosmos DB: Indexing policies](index-policy.md).

### Can I change the indexing policy?

Yes, you can change the indexing policy by providing the index definition. You need to properly encode and escape the settings.

For the non-.NET SDKs, the indexing policy can only be set in the portal at **Data Explorer**, navigate to the specific table you want to change and then go to the **Scale & Settings**->Indexing Policy, make the desired change and then **Save**.

From the .NET SDK it can be submitted in the app.config file:

```JSON
{
  "indexingMode": "consistent",
  "automatic": true,
  "includedPaths": [
    {
      "path": "/somepath",
      "indexes": [
        {
          "kind": "Range",
          "dataType": "Number",
          "precision": -1
        },
        {
          "kind": "Range",
          "dataType": "String",
          "precision": -1
        }
      ]
    }
  ],
  "excludedPaths":
[
 {
      "path": "/anotherpath"
 }
]
}
```

### Azure Cosmos DB as a platform seems to have lot of capabilities, such as sorting, aggregates, hierarchy, and other functionality. Will you be adding these capabilities to the Table API?

The Table API provides the same query functionality as Azure Table storage. Azure Cosmos DB also supports sorting, aggregates, geospatial query, hierarchy, and a wide range of built-in functions. For more information, see [SQL queries](how-to-sql-query.md).

### When should I change TableThroughput for the Table API?

You should change TableThroughput when either of the following conditions applies:

* You're performing an extract, transform, and load (ETL) of data, or you want to upload a lot of data in short amount of time.
* You need more throughput from the container or from a set of containers at the back end. For example, you see that the used throughput is more than the provisioned throughput, and you're getting throttled. For more information, see [Set throughput for Azure Cosmos containers](set-throughput.md).

### Can I scale up or scale down the throughput of my Table API table?

Yes, you can use the Azure Cosmos DB portal's scale pane to scale the throughput. For more information, see [Set throughput](set-throughput.md).

### Is a default TableThroughput set for newly provisioned tables?

Yes, if you don't override the TableThroughput via app.config and don't use a pre-created container in Azure Cosmos DB, the service creates a table with throughput of 400.

### Is there any change of pricing for existing customers of the Azure Table storage service?

None. There's no change in price for existing Azure Table storage customers.

### How is the price calculated for the Table API?

The price depends on the allocated TableThroughput.

### How do I handle any rate limiting on the tables in Table API offering?

If the request rate is more than the capacity of the provisioned throughput for the underlying container or a set of containers, you get an error, and the SDK retries the call by applying the retry policy.

### Why do I need to choose a throughput apart from PartitionKey and RowKey to take advantage of the Table API offering of Azure Cosmos DB?

Azure Cosmos DB sets a default throughput for your container if you don't provide one in the app.config file or via the portal.

Azure Cosmos DB provides guarantees for performance and latency, with upper bounds on operation. This guarantee is possible when the engine can enforce governance on the tenant's operations. Setting TableThroughput ensures that you get the guaranteed throughput and latency, because the platform reserves this capacity and guarantees operational success.

By using the throughput specification, you can elastically change it to benefit from the seasonality of your application, meet the throughput needs, and save costs.

### Azure Table storage has been inexpensive for me, because I pay only to store the data, and I rarely query. The Azure Cosmos DB Table API offering seems to be charging me even though I haven't performed a single transaction or stored anything. Can you explain?

Azure Cosmos DB is designed to be a globally distributed, SLA-based system with guarantees for availability, latency, and throughput. When you reserve throughput in Azure Cosmos DB, it's guaranteed, unlike the throughput of other systems. Azure Cosmos DB provides additional capabilities that customers have requested, such as secondary indexes and global distribution.

### I never get a quota full" notification (indicating that a partition is full) when I ingest data into Azure Table storage. With the Table API, I do get this message. Is this offering limiting me and forcing me to change my existing application?

Azure Cosmos DB is an SLA-based system that provides unlimited scale, with guarantees for latency, throughput, availability, and consistency. To ensure guaranteed premium performance, make sure that your data size and index are manageable and scalable. The 10-GB limit on the number of entities or items per partition key is to ensure that we provide great lookup and query performance. To ensure that your application scales well, even for Azure Storage, we recommend that you *not* create a hot partition by storing all information in one partition and querying it.

### So PartitionKey and RowKey are still required with the Table API?

Yes. Because the surface area of the Table API is similar to that of the Azure Table storage SDK, the partition key provides an efficient way to distribute the data. The row key is unique within that partition. The row key needs to be present and can't be null as in the standard SDK. The length of RowKey is 255 bytes and the length of PartitionKey is 1 KB.

### What are the error messages for the Table API?

Azure Table storage and Azure Cosmos DB Table API use the same SDKs so most of the errors will be the same.

### Why do I get throttled when I try to create lot of tables one after another in the Table API?

Azure Cosmos DB is an SLA-based system that provides latency, throughput, availability, and consistency guarantees. Because it's a provisioned system, it reserves resources to guarantee these requirements. The rapid rate of creation of tables is detected and throttled. We recommend that you look at the rate of creation of tables and lower it to less than 5 per minute. Remember that the Table API is a provisioned system. The moment you provision it, you'll begin to pay for it.

### How do I provide feedback about the SDK or bugs?

You can share your feedback in any of the following ways:

* [User voice](https://feedback.azure.com/forums/263030-azure-cosmos-db)
* [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-cosmos-db.html)
* [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cosmosdb). Stack Overflow is best for programming questions. Make sure your question is [on-topic](https://stackoverflow.com/help/on-topic) and [provide as many details as possible, making the question clear and answerable](https://stackoverflow.com/help/how-to-ask).

## Next steps

* [Build a Table API app with .NET SDK and Azure Cosmos DB](create-table-dotnet.md)
* [Build a Java app to manage Azure Cosmos DB Table API data](create-table-java.md)