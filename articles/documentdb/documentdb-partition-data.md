<properties      
    pageTitle="Partition and Scale Data in DocumentDB with Sharding | Microsoft Azure"      
    description="Review how to scale data with a technique called sharding. Learn about shards, how to partition data in DocumentDB, and when to use Hash and Range partitioning."         
    keywords="Scale data, shard, sharding, documentdb, azure, Microsoft azure"
	services="documentdb"      
    authors="arramac"      
    manager="jhubbard"      
    editor="monicar"      
    documentationCenter=""/> 
<tags      
    ms.service="documentdb"      
    ms.workload="data-services"      
    ms.tgt_pltfrm="na"      
    ms.devlang="na"      
    ms.topic="article"      
    ms.date="03/25/2016"      
    ms.author="arramac"/> 

# Partition and scale data in DocumentDB

[Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) is designed to help you achieve fast, predictable performance and *scale-out* seamlessly along with your application as it grows. DocumentDB has been used to power high-scale production services at Microsoft like the User Data Store that powers the MSN suite of web and mobile apps. 

Data in DocumentDB collections are stored within one or more partitions. Every partition in DocumentDB has a fixed amount of SSD-backed storage associated with it, and is replicated for high availability. Partition management is fully managed by Azure DocumentDB, and you do not have to write complex code or manage your partitions. You can achieve near-infinite scale in terms of storage and throughput for your DocumentDB application by horizontally partitioning your data. 

After reading this article on data scaling you will be able to answer the following questions:   

## Partitioning in DocumentDB

When you create a collection in DocumentDB, you'll notice that there's a **partition key property** configuration value that you can specify. This is an important setting as this determines what JSON property (or path) within your documents can be used by distribute to split your data among multiple servers or partitions. 

All the machinery behind distributing data across partitions, partitioning and re-partitioning based on scale needs, and routing query requests to the right partitions is handled automatically by the DocumentDB service. Partitioning is completely transparent to your application - functionality like fast order of millisecond reads and writes, SQL and LINQ queries, JavaScript based transactional logic, consistency levels, and fine-grained access control work the sane across partitioned and single-partitioned collections.

## Working with Partition Keys

The following sample shows a .NET snippet to create a collection to store device telemetry data of 20,000 request units per second of throughput. Here we set the deviceId as the partition key since we know that (a) since there are a large number of devices, writes can be distributed across partitions evenly and allowing us to scale the database to ingest massive volumes and (b) many of the requests like fetching the latest reading for a device are scoped to a single deviceId and can be retrieved from a single parttion.

    DocumentClient client = new DocumentClient(new Uri(endpoint), authKey);
    await client.CreateDatabaseAsync(new Database { Id = "db" });

    // Collection for device telemetry. Here the JSON property deviceId will be used as the partition key to 
    // spread across partitions. Configured for 10K RU/s throughput and an indexing policy that supports 
    // sorting against any number or string property.
    DocumentCollection myCollection = new DocumentCollection();
    myCollection.Id = "coll";
    myCollection.PartitionKey.Paths.Add("/deviceId");

    await client.CreateDocumentCollectionAsync(
        UriFactory.CreateDatabaseUri("db"),
        myCollection,
        new RequestOptions { OfferThroughput = 20000 });
        
This request makes a REST API call to DocumentDB, and the service will provision a number of partitions based on the requested throughput. Now, let's insert data into DocumentDB. Here's a sample class containing a device reading.

    public class DeviceReading
    {
        [JsonProperty("id")]
        public string Id;

        [JsonProperty("deviceId")]
        public string DeviceId;

        [JsonConverter(typeof(IsoDateTimeConverter))]
        [JsonProperty("readingTime")]
        public DateTime ReadingTime;

        [JsonProperty("metricType")]
        public string MetricType;

        [JsonProperty("unit")]
        public string Unit;

        [JsonProperty("metricValue")]
        public double MetricValue;
      }

    // Create a document. Here the partition key is extracted as "XMS-0001" based on the collection definition
    await client.CreateDocumentAsync(
        UriFactory.CreateDocumentCollectionUri("db", "coll"),
        new DeviceReading
        {
            Id = "XMS-001-FE24C",
            DeviceId = "XMS-0001",
            MetricType = "Temperature",
            MetricValue = 105.00,
            Unit = "Fahrenheit",
            ReadingTime = DateTime.UtcNow
        });


Let's read the document by it's partition key and id, update it, and then as a final step, delete it by partition key and id.

    // Read document. Needs the partition key and the ID to be specified
    Document result = await client.ReadDocumentAsync(
      UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
      new RequestOptions { PartitionKey = new object[] { "XMS-0001" }});

    DeviceReading reading = (DeviceReading)(dynamic)result;

    // Update the document. Partition key is not required, again extracted from the document
    reading.MetricValue = 104;
    reading.ReadingTime = DateTime.UtcNow;

    await client.ReplaceDocumentAsync(
      UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
      reading);

    // Delete document. Needs partition key
    await client.DeleteDocumentAsync(
      UriFactory.CreateDocumentUri("db", "coll", "XMS-001-FE24C"), 
      new RequestOptions { PartitionKey = new object[] { "XMS-0001" } });

When you query data in partitioned collections, DocumentDB automatically routes ther query to the partitions corresponding to the partition key values specified in the filter (if there are any). For example, this query is routed to just the partition containing the partition key "XMS-0001".

    // Query using partition key
    IQueryable<DeviceReading> query = client.CreateDocumentQuery<DeviceReading>(UriFactory.CreateDocumentCollectionUri("db", "coll"))
        .Where(m => m.MetricType == "Temperature" && m.DeviceId == "XMS-0001");

The following query does not have a filter on the partition key (DeviceId) and is fanned out to all partitions where it is executed against the partition's index. Note that you have to specify the EnableCrossPartitionQuery to instruct the SDK to execute a query across partitions.

    // Query across partition keys
    IQueryable<DeviceReading> crossPartitionQuery = client.CreateDocumentQuery<DeviceReading>(
        UriFactory.CreateDocumentCollectionUri("db", "coll"), 
        new FeedOptions { EnableCrossPartitionQuery = true })
        .Where(m => m.MetricType == "Temperature" && m.MetricValue > 100);


## How do I pick a Partition key

The choice of the partition key is an important decision that you’ll have to make at design time. This value of this property within each JSON document or request will be used by DocumentDB to distribute documents among the available partitions:
* ACID transactions can be served against documents with the same partition key
* Documents with the same partition key are stored in same partition so that queries get the benefit of data locality and lower latency

Here are a few examples for how to pick the partition key for your application:

* If you’re implementing a user profile backend, then the user ID is a good choice for partition key.
* If you’re storing IoT data e.g. device state, a device ID is a good choice for partition key
* If you’re using DocumentDB for logging time-series data, then the date part of the timestamp is a good choice for partition key
* If you have a multi-tenant architecture, the tenant ID is a good choice for partition key

Note that in some use cases (like the IoT and user profiles described above), the partition key might be the same as your id (document key). In others like the time series data, you might have a partition key that’s different than the id.

If you are implementing a multi-tenant application using DocumentDB, there are two major patterns for implementing tenancy with DocumentDB – one partition key per tenant, and one collection per tenant. Here are the pros and cons for each:

* One Partition Key per tenant: In this model, tenants are collocated within a single collection. But queries and inserts for documents within a single tenant can be performed against a single partition. You can also implement transactional logic across all documents within a tenant. Since multiple tenants share a collection, you can save storage and throughput costs by pooling resources for tenants within a single collection rather than provisioning extra headroom for each tenant. The drawback is that you do not have performance isolation per tenant
* One Collection per tenant: In this model, each tenant has its own collection. In this model, you can reserve performance per tenant. With DocumentDB’s new consumption based pricing model, this model is more cost-effective for multi-tenant applications.

You can also use a combination/tiered approach that collocates small tenants and migrates larger tenants to their own collection.

## Next Steps
In this article, we've introduced some common techniques on how you can partition data with DocumentDB, and when to use which technique or combination of techniques. 

-   Next, take a look at this [article](documentdb-sharding.md) on how you can partition data using partition resolvers with the DocumentDB SDK. 
-   Download one of the [supported SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx)
-   Contact us through the [MSDN support forums](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureDocumentDB) if you have questions.
   


 
