---
title: Azure Cosmos DB performance tips for .NET SDK v3
description: Learn client configuration options to improve Azure Cosmos DB .NET v3 SDK performance.
author: j82w
ms.service: cosmos-db
ms.topic: how-to
ms.date: 06/16/2020
ms.author: jawilley

---

# Performance tips for Azure Cosmos DB and .NET

> [!div class="op_single_selector"]
> * [.NET SDK v3](performance-tips-dotnet-sdk-v3-sql.md)
> * [.NET SDK v2](performance-tips.md)
> * [Java SDK v4](performance-tips-java-sdk-v4-sql.md)
> * [Async Java SDK v2](performance-tips-async-java.md)
> * [Sync Java SDK v2](performance-tips-java.md)

Azure Cosmos DB is a fast and flexible distributed database that scales seamlessly with guaranteed latency and throughput. You don't have to make major architecture changes or write complex code to scale your database with Azure Cosmos DB. Scaling up and down is as easy as making a single API call. To learn more, see [how to provision container throughput](how-to-provision-container-throughput.md) or [how to provision database throughput](how-to-provision-database-throughput.md). But because Azure Cosmos DB is accessed via network calls, there are client-side optimizations you can make to achieve peak performance when you use the [SQL .NET SDK](https://github.com/Azure/azure-cosmos-dotnet-v3).

So, if you're trying to improve your database performance, consider these options:

## Hosting recommendations

**For query-intensive workloads, use Windows 64-bit instead of Linux or Windows 32-bit host processing**

We recommend Windows 64-bit host processing for improved performance. The SQL SDK includes a native ServiceInterop.dll to parse and optimize queries locally. ServiceInterop.dll is supported only on the Windows x64 platform. For Linux and other unsupported platforms where ServiceInterop.dll isn't available, an additional network call is made to the gateway to get the optimized query. The following types of applications use 32-bit host processing by default. To change host processing to 64-bit processing, follow these steps, based on the type of your application:

- For executable applications, you can change host processing by setting the [platform target](https://docs.microsoft.com/visualstudio/ide/how-to-configure-projects-to-target-platforms?view=vs-2019) to **x64**  in the **Project Properties** window, on the **Build** tab.

- For VSTest-based test projects, you can change host processing by selecting **Test** > **Test Settings** > **Default Processor Architecture as X64** on the Visual Studio **Test** menu.

- For locally deployed ASP.NET web applications, you can change host processing by selecting **Use the 64-bit version of IIS Express for web sites and projects** under **Tools** > **Options** > **Projects and Solutions** > **Web Projects**.

- For ASP.NET web applications deployed on Azure, you can change host processing by selecting the **64-bit** platform in **Application settings** in the Azure portal.

> [!NOTE] 
> By default, new Visual Studio projects are set to **Any CPU**. We recommend that you set your project to **x64** so it doesn't switch to **x86**. A project set to **Any CPU** can easily switch to **x86** if an x86-only dependency is added.<br/>
> ServiceInterop.dll needs to be in the folder that the SDK DLL is being executed from. This should be a concern only if you manually copy DLLs or have custom build/deployment systems.
    
**Turn on server-side garbage collection (GC)**

Reducing the frequency of garbage collection can help in some cases. In .NET, set [gcServer](https://docs.microsoft.com/dotnet/core/run-time-config/garbage-collector#flavors-of-garbage-collection) to `true`.

**Scale out your client workload**

If you're testing at high throughput levels (more than 50,000 RU/s), the client application could become the bottleneck due to the machine capping out on CPU or network utilization. If you reach this point, you can continue to push the Azure Cosmos DB account further by scaling out your client applications across multiple servers.

> [!NOTE] 
> High CPU usage can cause increased latency and request timeout exceptions.

## Networking
<a id="direct-connection"></a>

**Connection policy: Use direct connection mode**

How a client connects to Azure Cosmos DB has important performance implications, especially for observed client-side latency. There are two key configuration settings available for configuring client connection policy: the connection *mode* and the connection *protocol*.  The two available modes are:

   * Direct mode (Default)

     Direct mode supports connectivity through TCP protocol and is the default connectivity mode if you're using the [Microsoft.Azure.Cosmos/.NET V3 SDK](https://github.com/Azure/azure-cosmos-dotnet-v3). This offers better performance and requires fewer network hops than Gateway mode.

   * Gateway mode
      
     If your application runs within a corporate network with strict firewall restrictions, gateway mode is the best choice because it uses the standard HTTPS port and a single endpoint. The performance tradeoff, however, is that gateway mode involves an additional network hop every time data is read from or written to Azure Cosmos DB. So direct mode offers better performance because there are fewer network hops. We also recommend gateway connection mode when you run applications in environments that have a limited number of socket connections.

     When you use the SDK in Azure Functions, particularly in the [Consumption plan](../azure-functions/functions-scale.md#consumption-plan), be aware of the current [limits on connections](../azure-functions/manage-connections.md). In that case, gateway mode might be better if you're also working with other HTTP-based clients within your Azure Functions application.


In gateway mode, Azure Cosmos DB uses port 443 and ports 10250, 10255, and 10256 when you're using the Azure Cosmos DB API for MongoDB. Port 10250 maps to a default MongoDB instance without geo-replication. Ports 10255 and 10256 map to the MongoDB instance that has geo-replication.
     
When you use TCP in direct mode, in addition to the gateway ports, you need to ensure the port range between 10000 and 20000 is open because Azure Cosmos DB uses dynamic TCP ports (when using direct mode on [private endpoints](./how-to-configure-private-endpoints.md), the full range of TCP ports - from 0 to 65535 - has to be open). The ports are open by default for the standard Azure VM configuration. If these ports aren't open and you try to use TCP, you receive a 503 Service Unavailable error. This table shows the connectivity modes available for various APIs and the service ports used for each API:

|Connection mode  |Supported protocol  |Supported SDKs  |API/Service port  |
|---------|---------|---------|---------|
|Gateway  |   HTTPS    |  All SDKs    |   SQL (443), MongoDB (10250, 10255, 10256), Table (443), Cassandra (10350), Graph (443)    |
|Direct    |     TCP    |  .NET SDK    | When using public/service endpoints: ports in the 10000 through 20000 range<br>When using private endpoints: ports in the 0 through 65535 range |

Azure Cosmos DB offers a simple, open RESTful programming model over HTTPS. Additionally, it offers an efficient TCP protocol, which is also RESTful in its communication model and is available through the .NET client SDK. TCP protocol uses TLS for initial authentication and encrypting traffic. For best performance, use the TCP protocol when possible.

For SDK V3, you configure the connection mode when you create the `CosmosClient` instance, in `CosmosClientOptions`. Remember that direct mode is the default.

```csharp
string connectionString = "<your-account-connection-string>";
CosmosClient client = new CosmosClient(connectionString,
new CosmosClientOptions
{
    ConnectionMode = ConnectionMode.Gateway // ConnectionMode.Direct is the default
});
```

Because TCP is supported only in direct mode, if you use gateway mode, the HTTPS protocol is always used to communicate with the gateway.

:::image type="content" source="./media/performance-tips/connection-policy.png" alt-text="The Azure Cosmos DB connection policy" border="false":::

**Ephemeral port exhaustion**

If you see a high connection volume or high port usage on your instances, first verify that your client instances are singletons. In other words, the client instances should be unique for the lifetime of the application.

When running on the TCP protocol, the client optimizes for latency by using the long-lived connections as opposed to the HTTPS protocol, which terminates the connections after 2 minutes of inactivity.

In scenarios where you have sparse access and if you notice a higher connection count when compared to the gateway mode access, you can:

* Configure the [CosmosClientOptions.PortReuseMode](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.portreusemode) property to `PrivatePortPool` (effective with framework version>= 4.6.1 and .net core version >= 2.0): This property allows the SDK to use a small pool of ephemeral ports for different Azure Cosmos DB destination endpoints.
* Configure the [CosmosClientOptions.IdleConnectionTimeout](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.idletcpconnectiontimeout) property must be greater than or equal to 10 minutes. The recommended values are between 20 minutes and 24 hours.

<a id="same-region"></a>

**For performance, collocate clients in same Azure region**

When possible, place any applications that call Azure Cosmos DB in the same region as the Azure Cosmos DB database. Here's an approximate comparison: calls to Azure Cosmos DB within the same region complete within 1 ms to 2 ms, but the latency between the West and East coast of the US is more than 50 ms. This latency can vary from request to request, depending on the route taken by the request as it passes from the client to the Azure datacenter boundary. You can get the lowest possible latency by ensuring the calling application is located within the same Azure region as the provisioned Azure Cosmos DB endpoint. For a list of available regions, see [Azure regions](https://azure.microsoft.com/regions/#services).

:::image type="content" source="./media/performance-tips/same-region.png" alt-text="The Azure Cosmos DB connection policy" border="false":::

   <a id="increase-threads"></a>

**Increase the number of threads/tasks**

Because calls to Azure Cosmos DB are made over the network, you might need to vary the degree of concurrency of your requests so that the client application spends minimal time waiting between requests. For example, if you're using the .NET [Task Parallel Library](https://msdn.microsoft.com//library/dd460717.aspx), create on the order of hundreds of tasks that read from or write to Azure Cosmos DB.

**Enable accelerated networking**
 
 To reduce latency and CPU jitter, we recommend that you enable accelerated networking on client virtual machines. See [Create a Windows virtual machine with accelerated networking](../virtual-network/create-vm-accelerated-networking-powershell.md) or [Create a Linux virtual machine with accelerated networking](../virtual-network/create-vm-accelerated-networking-cli.md).

## SDK usage
**Install the most recent SDK**

The Azure Cosmos DB SDKs are constantly being improved to provide the best performance. See the [Azure Cosmos DB SDK](https://github.com/Azure/azure-cosmos-dotnet-v3) pages to determine the most recent SDK and review improvements.

**Use stream APIs**

[.NET SDK V3](https://github.com/Azure/azure-cosmos-dotnet-v3) contains stream APIs that can receive and return data without serializing. 

Middle-tier applications that don't consume responses directly from the SDK but relay them to other application tiers can benefit from the stream APIs. See the [item management](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement) samples for examples of stream handling.

**Use a singleton Azure Cosmos DB client for the lifetime of your application**

Each `CosmosClient` instance is thread-safe and performs efficient connection management and address caching when operating in direct mode. To allow efficient connection management and better SDK client performance, we recommend that you use a single instance per `AppDomain` for the lifetime of the application.

When working on Azure Functions, instances should also follow the existing [guidelines](../azure-functions/manage-connections.md#static-clients) and maintain a single instance.

<a id="max-connection"></a>

**Disable content response on write operations**

For workloads that have heave create payloads set the EnableContentResponseOnWrite request option to false. The service will no longer return the created or updated resource to the SDK. Normally the application has the object being created so it does not need the service to return it. The header values are still accessible like request charge. This can improve performance because the SDK will no longer need to allocate memory or serialize the body of the response. This also reduces the network bandwidth usage to further help performance.  

```csharp
ItemRequestOption requestOptions = new ItemRequestOptions() { EnableContentResponseOnWrite = false };
ItemResponse<Book> itemResponse = await this.container.CreateItemAsync<Book>(book, new PartitionKey(book.pk), requestOptions);
// Resource will be null
itemResponse.Resource
```

**Enable Bulk to optimize for throughput instead of latency**
Enable Bulk for scenarios where the workload requires a large amount of throughput, and latency is not as important. See the [Introduction to Bulk](https://devblogs.microsoft.com/cosmosdb/introducing-bulk-support-in-the-net-sdk) for more information on how to enable the feature and which scenarios it should be used for.

**Increase System.Net MaxConnections per host when using gateway mode**

Azure Cosmos DB requests are made over HTTPS/REST when you use gateway mode. They're subjected to the default connection limit per hostname or IP address. You might need to set `MaxConnections` to a higher value (100 to 1,000) so the client library can use multiple simultaneous connections to Azure Cosmos DB. In .NET SDK 1.8.0 and later, the default value for [ServicePointManager.DefaultConnectionLimit](https://msdn.microsoft.com/library/system.net.servicepointmanager.defaultconnectionlimit.aspx) is 50. To change the value, you can set [Documents.Client.ConnectionPolicy.MaxConnectionLimit](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.connectionpolicy.maxconnectionlimit.aspx) to a higher value.

**Tune parallel queries for partitioned collections**

SQL .NET SDK supports parallel queries, which enable you to query a partitioned container in parallel. For more information, see [code samples](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/Queries/Program.cs) related to working with the SDKs. Parallel queries are designed to provide better query latency and throughput than their serial counterpart. Parallel queries provide two parameters that you can tune to fit your requirements: 
- `MaxConcurrency` controls the maximum number of partitions that can be queried in parallel. 
- `MaxBufferedItemCount` controls the number of pre-fetched results.

***Tuning degree of concurrency***

Parallel query works by querying multiple partitions in parallel. But data from an individual partition is fetched serially with respect to the query. Setting `MaxConcurrency` in [SDK V3](https://github.com/Azure/azure-cosmos-dotnet-v3) to the number of partitions has the best chance of achieving the most performant query, provided all other system conditions remain the same. If you don't know the number of partitions, you can set the degree of parallelism to a high number. The system will choose the minimum (number of partitions, user provided input) as the degree of parallelism.

Parallel queries produce the most benefit if the data is evenly distributed across all partitions with respect to the query. If the partitioned collection is partitioned so that all or most of the data returned by a query is concentrated in a few partitions (one partition is the worst case), those partitions will bottleneck the performance of the query.

***Tuning MaxBufferedItemCount***
    
Parallel query is designed to pre-fetch results while the current batch of results is being processed by the client. This pre-fetching helps improve the overall latency of a query. The `MaxBufferedItemCount` parameter limits the number of pre-fetched results. Set `MaxBufferedItemCount` to the expected number of results returned (or a higher number) to allow the query to receive the maximum benefit from pre-fetching.

Pre-fetching works the same way regardless of the degree of parallelism, and there's a single buffer for the data from all partitions.  

**Implement backoff at RetryAfter intervals**

During performance testing, you should increase load until a small rate of requests are throttled. If requests are throttled, the client application should back off on throttle for the server-specified retry interval. Respecting the backoff ensures you spend a minimal amount of time waiting between retries. 

For more information, see [RetryAfter](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.cosmosexception.retryafter?view=azure-dotnet#Microsoft_Azure_Cosmos_CosmosException_RetryAfter).
    
There's a mechanism for logging additional diagnostic information and troubleshooting latency issues, as shown in the following sample. You can log the diagnostic string for requests that have a higher read latency. The captured diagnostic string will help you understand how many times you received 429 errors for a given request.

```csharp
ItemResponse<Book> readItemResponse = await this.cosmosContainer.ReadItemAsync<Book>("ItemId", new PartitionKey("PartitionKeyValue"));
readItemResponse.Diagnostics.ToString(); 
```

**Increase the number of threads/tasks**

See [Increase the number of threads/tasks](#increase-threads) in the Networking section of this article.

## Indexing policy
 
**Exclude unused paths from indexing for faster writes**

The Azure Cosmos DB indexing policy also allows you to specify which document paths to include or exclude from indexing by using indexing paths (IndexingPolicy.IncludedPaths and IndexingPolicy.ExcludedPaths). Indexing only the paths you need can improve write performance, reduce RU charge on write operations, and reduce index storage for scenarios in which the query patterns are known beforehand. This is because indexing costs correlate directly to the number of unique paths indexed. For example, this code shows how to exclude an entire section of the documents (a subtree) from indexing by using the "*" wildcard:

```csharp
var containerProperties = new ContainerProperties(id: "excludedPathCollection", partitionKeyPath: "/pk" );
containerProperties.IndexingPolicy.IncludedPaths.Add(new IncludedPath { Path = "/*" });
containerProperties.IndexingPolicy.ExcludedPaths.Add(new ExcludedPath { Path = "/nonIndexedContent/*");
Container container = await this.cosmosDatabase.CreateContainerAsync(containerProperties);
```

For more information, see [Azure Cosmos DB indexing policies](index-policy.md).

## Throughput
<a id="measure-rus"></a>

**Measure and tune for lower Request Units/second usage**

Azure Cosmos DB offers a rich set of database operations. These operations include relational and hierarchical queries with UDFs, stored procedures, and triggers, all operating on the documents within a database collection. The cost associated with each of these operations varies depending on the CPU, IO, and memory required to complete the operation. Instead of thinking about and managing hardware resources, you can think of a Request Unit (RU) as a single measure for the resources required to perform various database operations and service an application request.

Throughput is provisioned based on the number of [Request Units](request-units.md) set for each container. Request Unit consumption is evaluated as a rate per second. Applications that exceed the provisioned Request Unit rate for their container are limited until the rate drops below the provisioned level for the container. If your application requires a higher level of throughput, you can increase your throughput by provisioning additional Request Units.

The complexity of a query affects how many Request Units are consumed for an operation. The number of predicates, the nature of the predicates, the number of UDFs, and the size of the source dataset all influence the cost of query operations.

To measure the overhead of any operation (create, update, or delete), inspect the [x-ms-request-charge](/rest/api/cosmos-db/common-cosmosdb-rest-response-headers) header (or the equivalent `RequestCharge` property in `ResourceResponse\<T>` or `FeedResponse\<T>` in the .NET SDK) to measure the number of Request Units consumed by the operations:

```csharp
// Measure the performance (Request Units) of writes
ItemResponse<Book> response = await container.CreateItemAsync<Book>(myBook, new PartitionKey(myBook.PkValue));
Console.WriteLine("Insert of item consumed {0} request units", response.RequestCharge);
// Measure the performance (Request Units) of queries
FeedIterator<Book> queryable = container.GetItemQueryIterator<ToDoActivity>(queryString);
while (queryable.HasMoreResults)
    {
        FeedResponse<Book> queryResponse = await queryable.ExecuteNextAsync<Book>();
        Console.WriteLine("Query batch consumed {0} request units", queryResponse.RequestCharge);
    }
```             

The request charge returned in this header is a fraction of your provisioned throughput (that is, 2,000 RUs / second). For example, if the preceding query returns 1,000 1-KB documents, the cost of the operation is 1,000. So, within one second, the server honors only two such requests before rate limiting later requests. For more information, see [Request Units](request-units.md) and the [Request Unit calculator](https://www.documentdb.com/capacityplanner).
<a id="429"></a>

**Handle rate limiting/request rate too large**

When a client attempts to exceed the reserved throughput for an account, there's no performance degradation at the server and no use of throughput capacity beyond the reserved level. The server will preemptively end the request with RequestRateTooLarge (HTTP status code 429). It will return an [x-ms-retry-after-ms](/rest/api/cosmos-db/common-cosmosdb-rest-response-headers) header that indicates the amount of time, in milliseconds, that the user must wait before attempting the request again.

    HTTP Status 429,
    Status Line: RequestRateTooLarge
    x-ms-retry-after-ms :100

The SDKs all implicitly catch this response, respect the server-specified retry-after header, and retry the request. Unless your account is being accessed concurrently by multiple clients, the next retry will succeed.

If you have more than one client cumulatively operating consistently above the request rate, the default retry count currently set to 9 internally by the client might not suffice. In this case, the client throws a CosmosException with status code 429 to the application. 

You can change the default retry count by setting the `RetryOptions` on the `CosmosClientOptions` instance. By default, the CosmosException with status code 429 is returned after a cumulative wait time of 30 seconds if the request continues to operate above the request rate. This error returns even when the current retry count is less than the maximum retry count, whether the current value is the default of 9 or a user-defined value.

The automated retry behavior helps improve resiliency and usability for most applications. But it might not be the best behavior when you're doing performance benchmarks, especially when you're measuring latency. The client-observed latency will spike if the experiment hits the server throttle and causes the client SDK to silently retry. To avoid latency spikes during performance experiments, measure the charge returned by each operation and ensure that requests are operating below the reserved request rate. For more information, see [Request Units](request-units.md).

**For higher throughput, design for smaller documents**

The request charge (that is, the request-processing cost) of a given operation correlates directly to the size of the document. Operations on large documents cost more than operations on small documents.

## Next steps
For a sample application that's used to evaluate Azure Cosmos DB for high-performance scenarios on a few client machines, see [Performance and scale testing with Azure Cosmos DB](performance-testing.md).

To learn more about designing your application for scale and high performance, see [Partitioning and scaling in Azure Cosmos DB](partition-data.md).
