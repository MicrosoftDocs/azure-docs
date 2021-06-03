---
title: Azure Cosmos DB best practices for .NET SDK v3
description: Learn the best practices for using the Azure Cosmos DB .NET SDK v3
author: StefArroyo
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 06/02/2021
ms.author: esarroyo

---

# Best Practices for Azure Cosmos DB .NET SDK
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

When using the Cosmos DB .NET SDK v3, we recommend these best practices for ways to improve latency and boost overall performance. 


|Checked  | Topic  |Details/Links  |
|---------|---------|---------|
| <input type="checkbox" unchecked /> |    SDK Version    |    We recommend always using the [latest version](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-sdk-dotnet-standard) of the Cosmos DB SDK available for optimal performance.     |
|  <input type="checkbox" unchecked />   |    Singleton Client     |       Use a [single instance](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cosmos.cosmosclient?view=azure-dotnet) of `CosmosClient` for the lifetime of your application for [better performance](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cosmos.cosmosclient?view=azure-dotnet).     |
|  <input type="checkbox" unchecked />  |     Regions     |   Make sure to run your application in the same [Azure region](https://docs.microsoft.com/en-us/azure/cosmos-db/distribute-data-globally) as your Azure Cosmos DB account, whenever possible. We recommend you enable 2-4 regions and multiple-write regions for [best availability](https://docs.microsoft.com/en-us/azure/cosmos-db/distribute-data-globally).  To learn how to add multiple regions using the .NET SDK visit [here](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-global-distribution-sql-api?tabs=dotnetv2%2Capi-async#net-sdk))   |
|  <input type="checkbox" unchecked />   |   Availability and Failovers     |   We recommend setting up a [preferred regions list](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-global-distribution-sql-api?tabs=dotnetv3%2Capi-async#preferred-locations) using the `PreferredLocations` or `ApplicationPreferredRegions` parameter to specify the ordered preference of regions to perform operations. During failovers, write operations are sent ot the current write region and all reads are sent to the first region within your preferred regions list.  |
|   <input type="checkbox" unchecked /> |    CPU     |  You may run into connectivity/availability issues due to lack of resources on your client machine. We recommend monitoring your CPU utilization on nodes running the Azure Cosmos DB client, and scaling up/out if usage is very high.      |
|  <input type="checkbox" unchecked />   |    Hosting      |   We recommend using [Windows 64-bit host](https://docs.microsoft.com/en-us/azure/cosmos-db/performance-tips#hosting-recommendations) processing for best performance.       |
|  <input type="checkbox" unchecked /> |    Connectivity Modes    |     We recommend using [Direct mode](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-sdk-connection-modes) for the best performance as this mode requires fewer network hops.  For instructions on how to do this using the SDK [visit](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-sdk-connection-modes)|
| <input type="checkbox" unchecked />  |    Networking   | If using a virtual machine to run your application, we recommend enabling [Accelerated Networking](https://docs.microsoft.com/en-us/azure/virtual-network/create-vm-accelerated-networking-powershell) on your VM to help with bottle necks due to high traffic and reduce latency or CPU jitter. You might also want to consider using a higher end Virtual Machine <ANY RECOMMENDATIONS HERE?>.    |
| <input type="checkbox" unchecked /> |  Ephemeral Port Exhaustion      | For sparse or sporadic connections, we recommend setting the [`IdleConnectionTimeout`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.idletcpconnectiontimeout?view=azure-dotnet) and [`PortReuseMode`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.portreusemode?view=azure-dotnet). The `IdleConnectionTimeout` property helps which control the time unused connections are closed. This will reduce the number of unused connections. By default, idle connections are kept open indefinitely. The value set must be greater than or equal to 10 minutes. We recommended values between 20 minutes and 24 hours.  The `PortReuseMode` property allows the SDK to use a small pool of ephemeral ports for various Azure Cosmos DB destination endpoints.    |
| <input type="checkbox" unchecked />  |   Retry Logic      |   Cosmos DB automatically retries failed attempts (by default, MaxRetryAttempts = 9 and MaxRetryWaitTime =  30s)  For writes to Cosmos DB, we recommend that the user's application logic handles the failure and retry.   |
| <input type="checkbox" unchecked />  |     Caching database/collection names    |    Retrieve the names of your databases and containers from configuration or cache them on start. Calls like `ReadDatabaseAsync` or `ReadDocumentCollectionAsync` and  `CreateDatabaseQuery` or `CreateDocumentCollectionQuery` will result in metadata calls to the service, which consume from the system-reserved RU limit. `CreateIfNotExist` should also only be used once for setting up the database. Overall, these operations should be performed infrequently.       |
|<input type="checkbox" unchecked /> |     Bulk Support      |     In scenarios where you may not need to optimize for latency, we recommend enabling [Bulk support](https://devblogs.microsoft.com/cosmosdb/introducing-bulk-support-in-the-net-sdk/) for dumping large volumes of data.    |
|  <input type="checkbox" unchecked />  |     Parallel Queries     |    The Cosmos DB SDK supports [running queries in parallel](https://docs.microsoft.com/en-us/azure/cosmos-db/performance-tips-dotnet-sdk-v3-sql#sdk-usage) for better latency and throughput on your queries.  We recommend setting the `MaxConcurrency` property within the `QueryRequestsOptions` to the number of partitions you have. If you are not aware of the number of partitions, we recommend setting this to a very high number <ANY SPECIFIC REQs?> We also encourage setting the `MaxBufferedItemCount` to the expected number of results returned to limit the number of pre-fetched results. |
|  <input type="checkbox" unchecked /> |     Performance Testing Backoffs      |    When performing testing on your application,  you should implement backoffs at [`RetryAfter`](https://docs.microsoft.com/en-us/azure/cosmos-db/performance-tips-dotnet-sdk-v3-sql#sdk-usage) intervals. Respecting the backoff helps ensure that you'll spend a minimal amount of time waiting between retries.   |
|   <input type="checkbox" unchecked />   |   Indexing     |   The Azure Cosmos DB indexing policy also allows you to specify which document paths to include or exclude from indexing by using indexing paths (IndexingPolicy.IncludedPaths and IndexingPolicy.ExcludedPaths).  Ensure that you exclude unused paths from indexing for faster writes.  For a sample on how to create indexes using the SDK [visit](https://docs.microsoft.com/en-us/azure/cosmos-db/performance-tips-dotnet-sdk-v3-sql#indexing-policy)   |
|   <input type="checkbox" unchecked />   |    Document Size  |    The request charge of a specified operation correlates directly to the size of the document. We recommend reducing the size of your documents as operations on large documents cost more than operations on smaller documents.      |
|  <input type="checkbox" unchecked />   |     Increase the number of threads/tasks    |    Because calls to Azure Cosmos DB are made over the network, you might need to vary the degree of concurrency of your requests so that the client application spends minimal time waiting between requests. For example, if you're using the [.NET Task Parallel Library](https://docs.microsoft.com/en-us/dotnet/standard/parallel-programming/task-parallel-library-tpl), create on the order of hundreds of tasks that read from or write to Azure Cosmos DB.     |
|    <input type="checkbox" unchecked />  |    Enabling Query Metrics     |  We recommend logging SQL Query Metrics using our .NET SDK for detailed information on the backend query executions. For instructions on how to collect SQL Query Metrics [visit](https://docs.microsoft.com/en-us/azure/cosmos-db/profile-sql-api-query)    |
|  <input type="checkbox" unchecked />    | Enable SDK Logging   | Enable SDK logging to capture additional diagnostics information and troubleshooting latency issues.  Log the diagnostics string in the V2 SDK or [`Diagnostics`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cosmos.responsemessage.diagnostics?view=azure-dotnet) in v3 SDK for more detailed cosmos diagnostic information for the current request to the service. It is advised to only use these diagnostics during performance testing.     |


## Best Practices when using Gateway Mode
Increase System.Net MaxConnections per host when you use Gateway mode. Azure Cosmos DB requests are made over HTTPS/REST when you use Gateway mode. They're subject to the default connection limit per hostname or IP address. You might need to set MaxConnections to a higher value (from 100 through 1,000) so that the client library can use multiple simultaneous connections to Azure Cosmos DB. In .NET SDK 1.8.0 and later, the default value for ServicePointManager.DefaultConnectionLimit is 50. To change the value, you can set Documents.Client.ConnectionPolicy.MaxConnectionLimit to a higher value.

## Best Practices for Write-heavy workloads

Disable content response on write operations

For workloads that have heavy create payloads, set the EnableContentResponseOnWrite request option to false. The service will no longer return the created or updated resource to the SDK. Normally, because the application has the object that's being created, it doesn't need the service to return it. The header values are still accessible, like a request charge. Disabling the content response can help improve performance, because the SDK no longer needs to allocate memory or serialize the body of the response. It also reduces the network bandwidth usage to further help performance.

## Best Practices for Read-heavy workloads


## Next steps
For a sample application that's used to evaluate Azure Cosmos DB for high-performance scenarios on a few client machines, see [Performance and scale testing with Azure Cosmos DB](performance-testing.md).

To learn more about designing your application for scale and high performance, see [Partitioning and scaling in Azure Cosmos DB](partitioning-overview.md).