---
title: Migrate your application to use the Azure Cosmos DB .NET SDK 3.0 (Microsoft.Azure.Cosmos)
description: Learn how to upgrade your existing .NET application from the v2 SDK to the newer .NET SDK v3 (Microsoft.Azure.Azure Cosmos DB package) for API for NoSQL.
author: stefArroyo
ms.author: esarroyo
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 04/04/2023
ms.devlang: csharp
ms.custom: devx-track-dotnet
---

# Migrate your application to use the Azure Cosmos DB .NET SDK v3
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!IMPORTANT]
> To learn about the Azure Cosmos DB .NET SDK v3, see the [Release notes](sdk-dotnet-v3.md), the [.NET GitHub repository](https://github.com/Azure/azure-cosmos-dotnet-v3), .NET SDK v3 [Performance Tips](performance-tips-dotnet-sdk-v3.md), and the [Troubleshooting guide](troubleshoot-dotnet-sdk.md).
>

This article highlights some of the considerations of upgrading your existing .NET application to the newer Azure Cosmos DB .NET SDK v3 for API for NoSQL. Azure Cosmos DB .NET SDK v3 corresponds to the Microsoft.Azure.Azure Cosmos DB namespace. You can use the information provided in this doc if you're migrating your application from any of the following Azure Cosmos DB .NET SDKs:

* Azure Cosmos DB .NET Framework SDK v2 for API for NoSQL
* Azure Cosmos DB .NET Core SDK v2 for API for NoSQL

The instructions in this article also help you to migrate the following external libraries that are now part of the Azure Cosmos DB .NET SDK v3 for API for NoSQL:

* .NET change feed processor library 2.0
* .NET bulk executor library 1.1 or greater

## What's new in the .NET V3 SDK

The v3 SDK contains many usability and performance improvements, including:

* Intuitive programming model naming
* .NET Standard 2.0 **
* Increased performance through stream API support
* Fluent hierarchy that replaces the need for URI factory
* Built-in support for change feed processor library
* Built-in support for bulk operations
* Mockable APIs for easier unit testing
* Transactional batch and Blazor support
* Pluggable serializers
* Scale non-partitioned and autoscale containers

** The SDK targets .NET Standard 2.0 that unifies the existing Azure Cosmos DB .NET Framework and .NET Core SDKs into a single .NET SDK. You can use the .NET SDK in any platform that implements .NET Standard 2.0, including your .NET Framework 4.6.1+ and .NET Core 2.0+ applications.

Most of the networking, retry logic, and lower levels of the SDK remain largely unchanged.

**The Azure Cosmos DB .NET SDK v3 is now open source.** We welcome any pull requests and will be logging issues and tracking feedback on [GitHub.](https://github.com/Azure/azure-cosmos-dotnet-v3/) We'll work on taking on any features that will improve customer experience.

## Why migrate to the .NET v3 SDK

In addition to the numerous usability and performance improvements, new feature investments made in the latest SDK won't be back ported to older versions.
The v2 SDK is currently in maintenance mode. For the best development experience, we recommend always starting with the latest supported version of SDK.

## Major name changes from v2 SDK to v3 SDK

The following name changes have been applied throughout the .NET 3.0 SDK to align with the API naming conventions for the API for NoSQL:

* `DocumentClient` is renamed to `CosmosClient`
* `Collection` is renamed to `Container`
* `Document` is renamed to `Item`

All the resource objects are renamed with additional properties, which, includes the resource name for clarity.

The following are some of the main class name changes:

| .NET v2 SDK | .NET v3 SDK |
|-------------|-------------|
|`Microsoft.Azure.Documents.Client.DocumentClient`|`Microsoft.Azure.Cosmos.CosmosClient`|
|`Microsoft.Azure.Documents.Client.ConnectionPolicy`|`Microsoft.Azure.Cosmos.CosmosClientOptions`|
|`Microsoft.Azure.Documents.Client.DocumentClientException` |`Microsoft.Azure.Cosmos.CosmosException`|
|`Microsoft.Azure.Documents.Client.Database`|`Microsoft.Azure.Cosmos.DatabaseProperties`|
|`Microsoft.Azure.Documents.Client.DocumentCollection`|`Microsoft.Azure.Cosmos.ContainerProperties`|
|`Microsoft.Azure.Documents.Client.RequestOptions`|`Microsoft.Azure.Cosmos.ItemRequestOptions`|
|`Microsoft.Azure.Documents.Client.FeedOptions`|`Microsoft.Azure.Cosmos.QueryRequestOptions`|
|`Microsoft.Azure.Documents.Client.StoredProcedure`|`Microsoft.Azure.Cosmos.StoredProcedureProperties`|
|`Microsoft.Azure.Documents.Client.Trigger`|`Microsoft.Azure.Cosmos.TriggerProperties`|
|`Microsoft.Azure.Documents.SqlQuerySpec`|`Microsoft.Azure.Cosmos.QueryDefinition`|

### Classes replaced on .NET v3 SDK

The following classes have been replaced on the 3.0 SDK:

* `Microsoft.Azure.Documents.UriFactory`

The Microsoft.Azure.Documents.UriFactory class has been replaced by the fluent design.

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
Container container = client.GetContainer(databaseName,containerName);
ItemResponse<SalesOrder> response = await this._container.CreateItemAsync(
        salesOrder,
        new PartitionKey(salesOrder.AccountNumber));

```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
Uri collectionUri = UriFactory.CreateDocumentCollectionUri(databaseName, containerName);
await client.CreateDocumentAsync(
    collectionUri,
    salesOrder,
    new RequestOptions { PartitionKey = new PartitionKey(salesOrder.AccountNumber) });
```

---

* `Microsoft.Azure.Documents.Document`

Because the .NET v3 SDK allows users to configure [a custom serialization engine](migrate-dotnet-v3.md#customize-serialization), there's no direct replacement for the `Document` type. When using Newtonsoft.Json (default serialization engine), `JObject` can be used to achieve the same functionality. When using a different serialization engine, you can use its base json document type (for example, `JsonDocument` for System.Text.Json). The recommendation is to use a C# type that reflects the schema of your items instead of relying on generic types.

* `Microsoft.Azure.Documents.Resource`

There is no direct replacement for `Resource`, in cases where it was used for documents, follow the guidance for `Document`.

* `Microsoft.Azure.Documents.AccessCondition`

`IfNoneMatch` or `IfMatch` are now available on the `Microsoft.Azure.Cosmos.ItemRequestOptions` directly.

### Changes to item ID generation

Item ID is no longer auto populated in the .NET v3 SDK. Therefore, the Item ID must specifically include a generated ID. View the following example:

```csharp
[JsonProperty(PropertyName = "id")]
public Guid Id { get; set; }
```

### Changed default behavior for connection mode

The SDK v3 now defaults to [Direct + TCP connection modes](sdk-connection-modes.md) compared to the previous v2 SDK, which defaulted to Gateway + HTTPS connections modes. This change provides enhanced performance and scalability.

### Changes to FeedOptions (QueryRequestOptions in v3.0 SDK)

The `FeedOptions` class in SDK v2 has now been renamed to `QueryRequestOptions` in the SDK v3 and within the class, several properties have had changes in name and/or default value or been removed completely.  

| .NET v2 SDK | .NET v3 SDK |
|-------------|-------------|
|`FeedOptions.MaxDegreeOfParallelism`|`QueryRequestOptions.MaxConcurrency` - Default value and associated behavior remains the same, operations run client side during parallel query execution will be executed serially with no-parallelism.|
|`FeedOptions.PartitionKey`|`QueryRequestOptions.PartitionKey` - Behavior maintained. |
|`FeedOptions.EnableCrossPartitionQuery`|Removed. Default behavior in SDK 3.0 is that cross-partition queries will be executed without the need to enable the property specifically. |
|`FeedOptions.PopulateQueryMetrics`|Removed. It is now enabled by default and part of the [diagnostics](troubleshoot-dotnet-sdk.md#capture-diagnostics).|
|`FeedOptions.RequestContinuation`|Removed. It is now promoted to the query methods themselves. |
|`FeedOptions.JsonSerializerSettings`|Removed. See how to [customize serialization](#customize-serialization) for additional information.|
|`FeedOptions.PartitionKeyRangeId`|Removed. Same outcome can be obtained from using [FeedRange](change-feed-pull-model.md#use-feedrange-for-parallelization) as input to the query method.|
|`FeedOptions.DisableRUPerMinuteUsage`|Removed.|

### Constructing a client

The .NET SDK v3 provides a fluent `CosmosClientBuilder` class that replaces the need for the SDK v2 URI Factory.

The fluent design builds URLs internally and allows a single `Container` object to be passed around instead of a `DocumentClient`, `DatabaseName`, and `DocumentCollection`.

The following example creates a new `CosmosClientBuilder` with a strong ConsistencyLevel and a list of preferred locations:

```csharp
CosmosClientBuilder cosmosClientBuilder = new CosmosClientBuilder(
    accountEndpoint: "https://testcosmos.documents.azure.com:443/",
    authKeyOrResourceToken: "SuperSecretKey")
.WithConsistencyLevel(ConsistencyLevel.Strong)
.WithApplicationRegion(Regions.EastUS);
CosmosClient client = cosmosClientBuilder.Build();
```

### Exceptions

Where the v2 SDK used `DocumentClientException` to signal errors during operations, the v3 SDK uses `CosmosException`, which exposes the `StatusCode`, `Diagnostics`, and other response-related information. All the complete information is serialized when `ToString()` is used:

```csharp
catch (CosmosException ex)
{
    HttpStatusCode statusCode = ex.StatusCode;
    CosmosDiagnostics diagnostics = ex.Diagnostics;
    // store diagnostics optionally with diagnostics.ToString();
    // or log the entire error details with ex.ToString();
}
```

### Diagnostics

Where the v2 SDK had Direct-only diagnostics available through the `RequestDiagnosticsString` property, the v3 SDK uses `Diagnostics` available in all responses and exceptions, which are richer and not restricted to Direct mode. They include not only the time spent on the SDK for the operation, but also the regions the operation contacted:

```csharp
try
{
    ItemResponse<MyItem> response = await container.ReadItemAsync<MyItem>(
                    partitionKey: new PartitionKey("MyPartitionKey"),
                    id: "MyId");
    
    TimeSpan elapsedTime = response.Diagnostics.GetElapsedTime();
    if (elapsedTime > somePreDefinedThreshold)
    {
        // log response.Diagnostics.ToString();
        IReadOnlyList<(string region, Uri uri)> regions = response.Diagnostics.GetContactedRegions();
    }
}
catch (CosmosException cosmosException) {
    string diagnostics = cosmosException.Diagnostics.ToString();
    
    TimeSpan elapsedTime = cosmosException.Diagnostics.GetElapsedTime();
    
    IReadOnlyList<(string region, Uri uri)> regions = cosmosException.Diagnostics.GetContactedRegions();
    
    // log cosmosException.ToString()
}
```

### ConnectionPolicy

Some settings in `ConnectionPolicy` have been renamed or replaced by `CosmosClientOptions`:

| .NET v2 SDK | .NET v3 SDK |
|-------------|-------------|
|`EnableEndpointRediscovery`|`LimitToEndpoint` - The value is now inverted, if `EnableEndpointRediscovery` was being set to `true`, `LimitToEndpoint` should be set to `false`. Before using this setting, you need to understand [how it affects the client](troubleshoot-sdk-availability.md).|
|`ConnectionProtocol`|Removed. Protocol is tied to the Mode, either it's Gateway (HTTPS) or Direct (TCP). Direct mode with HTTPS protocol is no longer supported on V3 SDK and the recommendation is to use TCP protocol. |
|`MediaRequestTimeout`|Removed. Attachments are no longer supported.|
|`SetCurrentLocation`|`CosmosClientOptions.ApplicationRegion` can be used to achieve the same effect.|
|`PreferredLocations`|`CosmosClientOptions.ApplicationPreferredRegions` can be used to achieve the same effect.|
|`UserAgentSuffix`|`CosmosClientBuilder.ApplicationName` can be used to achieve the same effect.|
|`UseMultipleWriteLocations`|Removed. The SDK automatically detects if the account supports multiple write endpoints.|

### Indexing policy

In the indexing policy, it is not possible to configure these properties. When not specified, these properties will now always have the following values:

| **Property Name**     | **New Value (not configurable)** |
| ----------------------- | -------------------------------- |
| `Kind`   | `range` |
| `dataType`    | `String` and `Number` |

See [this section](how-to-manage-indexing-policy.md#indexing-policy-examples) for indexing policy examples for including and excluding paths. Due to improvements in the query engine, configuring these properties, even if using an older SDK version, has no impact on performance.

### Session token

Where the v2 SDK exposed the session token of a response as `ResourceResponse.SessionToken` for cases where capturing the session token was required, because the session token is a header, the v3 SDK exposes that value in the `Headers.Session` property of any response.

### Timestamp

Where the v2 SDK exposed the timestamp of a document through the `Timestamp` property, because `Document` is no longer available, users can map the `_ts` [system property](../resource-model.md#properties-of-an-item) to a property in their model.

### OpenAsync

For use cases where `OpenAsync()` was being used to warm up the v2 SDK client, `CreateAndInitializeAsync` can be used to both [create and warm-up](https://devblogs.microsoft.com/cosmosdb/improve-net-sdk-initialization/) a v3 SDK client.

### Using the change feed processor APIs directly from the v3 SDK

The v3 SDK has built-in support for the Change Feed Processor APIs, allowing you use the same SDK for building your application and change feed processor implementation. Previously, you had to use a separate change feed processor library.

For more information, see [how to migrate from the change feed processor library to the Azure Cosmos DB .NET v3 SDK](how-to-migrate-from-change-feed-library.md)

### Change feed queries

Executing change feed queries on the v3 SDK is considered to be using the [change feed pull model](change-feed-pull-model.md). Follow this table to migrate configuration:

| .NET v2 SDK | .NET v3 SDK |
|-------------|-------------|
|`ChangeFeedOptions.PartitionKeyRangeId`|`FeedRange` - In order to achieve parallelism reading the change feed [FeedRanges](change-feed-pull-model.md#use-feedrange-for-parallelization) can be used. It's no longer a required parameter, you can [read the Change Feed for an entire container](change-feed-pull-model.md#consume-the-changes-for-an-entire-container) easily now.|
|`ChangeFeedOptions.PartitionKey`|`FeedRange.FromPartitionKey` - A FeedRange representing the desired Partition Key can be used to [read the Change Feed for that Partition Key value](change-feed-pull-model.md#consume-the-changes-for-a-partition-key).|
|`ChangeFeedOptions.RequestContinuation`|`ChangeFeedStartFrom.Continuation` - The change feed iterator can be stopped and resumed at any time by [saving the continuation and using it when creating a new iterator](change-feed-pull-model.md#save-continuation-tokens).|
|`ChangeFeedOptions.StartTime`|`ChangeFeedStartFrom.Time` |
|`ChangeFeedOptions.StartFromBeginning` |`ChangeFeedStartFrom.Beginning` |
|`ChangeFeedOptions.MaxItemCount`|`ChangeFeedRequestOptions.PageSizeHint` - The change feed iterator can be stopped and resumed at any time by [saving the continuation and using it when creating a new iterator](change-feed-pull-model.md#save-continuation-tokens).|
|`IDocumentQuery.HasMoreResults` |`response.StatusCode == HttpStatusCode.NotModified` - The change feed is conceptually infinite, so there could always be more results. When a response contains the `HttpStatusCode.NotModified` status code, it means there are no new changes to read at this time. You can use that to stop and [save the continuation](change-feed-pull-model.md#save-continuation-tokens) or to temporarily sleep or wait and then call `ReadNextAsync` again to test for new changes. |
|Split handling|It's no longer required for users to handle split exceptions when reading the change feed, splits will be handled transparently without the need of user interaction.|

### Using the bulk executor library directly from the V3 SDK

The v3 SDK has built-in support for the bulk executor library, allowing you to use the same SDK for building your application and performing bulk operations. Previously, you were required to use a separate bulk executor library.

For more information, see [how to migrate from the bulk executor library to  bulk support in Azure Cosmos DB .NET V3 SDK](how-to-migrate-from-bulk-executor-library.md)

### Customize serialization
The .NET V2 SDK allows setting *JsonSerializerSettings* in *RequestOptions* at the operational level used to deserialize the result document:

```csharp
// .NET V2 SDK
var result = await container.ReplaceDocumentAsync(document, new RequestOptions { JsonSerializerSettings = customSerializerSettings })
```

The .NET SDK v3 provides a [serializer interface](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.serializer) to fully customize the serialization engine, or more generic [serialization options](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.serializeroptions) as part of the client construction.

Customizing the serialization at the operation level can be achieved through the use of Stream APIs:

```csharp
// .NET V3 SDK
using(Response response = await this.container.ReplaceItemStreamAsync(stream, "itemId", new PartitionKey("itemPartitionKey"))
{

    using(Stream stream = response.ContentStream)
    {
        using (StreamReader streamReader = new StreamReader(stream))
        {
            // Read the stream and do dynamic deserialization based on type with a custom Serializer
        }
    }
}
```

## Code snippet comparisons

The following code snippet shows the differences in how resources are created between the .NET v2 and v3 SDKs:

## Database operations

### Create a database

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
// Create database with no shared provisioned throughput
DatabaseResponse databaseResponse = await client.CreateDatabaseIfNotExistsAsync(DatabaseName);
Database database = databaseResponse;
DatabaseProperties databaseProperties = databaseResponse;

// Create a database with a shared manual provisioned throughput
string databaseIdManual = new string(DatabaseName + "_SharedManualThroughput");
database = await client.CreateDatabaseIfNotExistsAsync(databaseIdManual, ThroughputProperties.CreateManualThroughput(400));

// Create a database with shared autoscale provisioned throughput
string databaseIdAutoscale = new string(DatabaseName + "_SharedAutoscaleThroughput");
database = await client.CreateDatabaseIfNotExistsAsync(databaseIdAutoscale, ThroughputProperties.CreateAutoscaleThroughput(4000));
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
// Create database
ResourceResponse<Database> databaseResponse = await client.CreateDatabaseIfNotExistsAsync(new Database { Id = DatabaseName });
Database database = databaseResponse;

// Create a database with shared standard provisioned throughput
database = await client.CreateDatabaseIfNotExistsAsync(new Database{ Id = databaseIdStandard }, new RequestOptions { OfferThroughput = 400 });

// Creating a database with shared autoscale provisioned throughput from v2 SDK is not supported use v3 SDK
```
---

### Read a database by ID

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
// Read a database
Console.WriteLine($"{Environment.NewLine} Read database resource: {DatabaseName}");
database = client.GetDatabase(DatabaseName);
Console.WriteLine($"{Environment.NewLine} database { database.Id.ToString()}");

// Read all databases
string findQueryText = "SELECT * FROM c";
using (FeedIterator<DatabaseProperties> feedIterator = client.GetDatabaseQueryIterator<DatabaseProperties>(findQueryText))
{
    while (feedIterator.HasMoreResults)
    {
        FeedResponse<DatabaseProperties> databaseResponses = await feedIterator.ReadNextAsync();
        foreach (DatabaseProperties _database in databaseResponses)
        {
            Console.WriteLine($"{ Environment.NewLine} database {_database.Id.ToString()}");
        }
    }
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
// Read a database
database = await client.ReadDatabaseAsync(UriFactory.CreateDatabaseUri(DatabaseName));
Console.WriteLine("\n database {0}", database.Id.ToString());

// Read all databases
Console.WriteLine("\n1.1 Reading all databases resources");
foreach (Database _database in await client.ReadDatabaseFeedAsync())
{
    Console.WriteLine("\n database {0} \n {1}", _database.Id.ToString(), _database.ToString());
}
```
---

### Delete a database

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
// Delete a database
await client.GetDatabase(DatabaseName).DeleteAsync();
Console.WriteLine($"{ Environment.NewLine} database {DatabaseName} deleted.");

// Delete all databases in an account
string deleteQueryText = "SELECT * FROM c";
using (FeedIterator<DatabaseProperties> feedIterator = client.GetDatabaseQueryIterator<DatabaseProperties>(deleteQueryText))
{
    while (feedIterator.HasMoreResults)
    {
        FeedResponse<DatabaseProperties> databaseResponses = await feedIterator.ReadNextAsync();
        foreach (DatabaseProperties _database in databaseResponses)
        {
            await client.GetDatabase(_database.Id).DeleteAsync();
            Console.WriteLine($"{ Environment.NewLine} database {_database.Id} deleted");
        }
    }
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
// Delete a database
database = await client.DeleteDatabaseAsync(UriFactory.CreateDatabaseUri(DatabaseName));
Console.WriteLine(" database {0} deleted.", DatabaseName);

// Delete all databases in an account
foreach (Database _database in await client.ReadDatabaseFeedAsync())
{
    await client.DeleteDatabaseAsync(UriFactory.CreateDatabaseUri(_database.Id));
    Console.WriteLine("\n database {0} deleted", _database.Id);
}
```
---

## Container operations

### Create a container (Autoscale + Time to live with expiration)

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
private static async Task CreateManualThroughputContainer(Database database)
{
    // Set throughput to the minimum value of 400 RU/s manually configured throughput
    string containerIdManual = ContainerName + "_Manual";
    ContainerResponse container = await database.CreateContainerIfNotExistsAsync(
        id: containerIdManual,
        partitionKeyPath: partitionKeyPath,
        throughput: 400);
}

// Create container with autoscale
private static async Task CreateAutoscaleThroughputContainer(Database database)
{
    string autoscaleContainerId = ContainerName + "_Autoscale";
    ContainerProperties containerProperties = new ContainerProperties(autoscaleContainerId, partitionKeyPath);

    Container container = await database.CreateContainerIfNotExistsAsync(
        containerProperties: containerProperties,
        throughputProperties: ThroughputProperties.CreateAutoscaleThroughput(autoscaleMaxThroughput: 4000);
}

// Create a container with TTL Expiration
private static async Task CreateContainerWithTtlExpiration(Database database)
{
    string containerIdManualwithTTL = ContainerName + "_ManualTTL";

    ContainerProperties properties = new ContainerProperties
        (id: containerIdManualwithTTL,
        partitionKeyPath: partitionKeyPath);

    properties.DefaultTimeToLive = (int)TimeSpan.FromDays(1).TotalSeconds; //expire in 1 day

    ContainerResponse containerResponse = await database.CreateContainerIfNotExistsAsync(containerProperties: properties);
    ContainerProperties returnedProperties = containerResponse;
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
// Create a collection
private static async Task CreateManualThroughputContainer(DocumentClient client)
{
    string containerIdManual = ContainerName + "_Manual";

    // Set throughput to the minimum value of 400 RU/s manually configured throughput

    DocumentCollection collectionDefinition = new DocumentCollection();
    collectionDefinition.Id = containerIdManual;
    collectionDefinition.PartitionKey.Paths.Add(partitionKeyPath);

    DocumentCollection partitionedCollection = await client.CreateDocumentCollectionIfNotExistsAsync(
        UriFactory.CreateDatabaseUri(DatabaseName),
        collectionDefinition,
        new RequestOptions { OfferThroughput = 400 });
}

private static async Task CreateAutoscaleThroughputContainer(DocumentClient client)
{
        // .NET v2 SDK does not support the creation of provisioned autoscale throughput containers
}

 private static async Task CreateContainerWithTtlExpiration(DocumentClient client)
{
    string containerIdManualwithTTL = ContainerName + "_ManualTTL";

    DocumentCollection collectionDefinition = new DocumentCollection();
    collectionDefinition.Id = containerIdManualwithTTL;
    collectionDefinition.DefaultTimeToLive = (int)TimeSpan.FromDays(1).TotalSeconds; //expire in 1 day
    collectionDefinition.PartitionKey.Paths.Add(partitionKeyPath);

    DocumentCollection partitionedCollection = await client.CreateDocumentCollectionIfNotExistsAsync(
        UriFactory.CreateDatabaseUri(DatabaseName),
        collectionDefinition,
        new RequestOptions { OfferThroughput = 400 });

}
```
---

### Read container properties

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
private static async Task ReadContainerProperties(Database database)
{
    string containerIdManual = ContainerName + "_Manual";
    Container container = database.GetContainer(containerIdManual);
    ContainerProperties containerProperties = await container.ReadContainerAsync();
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
private static async Task ReadContainerProperties(DocumentClient client)
{
    string containerIdManual = ContainerName + "_Manual";
    DocumentCollection collection = await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(DatabaseName, containerIdManual));
}
```
---

### Delete a container

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
private static async Task DeleteContainers(Database database)
{
    string containerIdManual = ContainerName + "_Manual";

    // Delete a container
    await database.GetContainer(containerIdManual).DeleteContainerAsync();

    // Delete all CosmosContainer resources for a database
    using (FeedIterator<ContainerProperties> feedIterator = database.GetContainerQueryIterator<ContainerProperties>())
    {
        while (feedIterator.HasMoreResults)
        {
            foreach (ContainerProperties _container in await feedIterator.ReadNextAsync())
            {
                await database.GetContainer(_container.Id).DeleteContainerAsync();
                Console.WriteLine($"{Environment.NewLine}  deleted container {_container.Id}");
            }
        }
    }
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
private static async Task DeleteContainers(DocumentClient client)
{
    // Delete a collection
    string containerIdManual = ContainerName + "_Manual";
    await client.DeleteDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(DatabaseName, containerIdManual));

    // Delete all containers for a database
    foreach (var collection in await client.ReadDocumentCollectionFeedAsync(UriFactory.CreateDatabaseUri(DatabaseName)))
    {
        await client.DeleteDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(DatabaseName, collection.Id));
    }
}
```
---

## Item and query operations

### Create an item

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
private static async Task CreateItemAsync(Container container)
{
    // Create a SalesOrder POCO object
    SalesOrder salesOrder1 = GetSalesOrderSample("Account1", "SalesOrder1");
    ItemResponse<SalesOrder> response = await container.CreateItemAsync(salesOrder1,
        new PartitionKey(salesOrder1.AccountNumber));
}

private static async Task RunBasicOperationsOnDynamicObjects(Container container)
{
    // Dynamic Object
    dynamic salesOrder = new
    {
        id = "SalesOrder5",
        AccountNumber = "Account1",
        PurchaseOrderNumber = "PO18009186470",
        OrderDate = DateTime.UtcNow,
        Total = 5.95,
    };
    Console.WriteLine("\nCreating item");
    ItemResponse<dynamic> response = await container.CreateItemAsync<dynamic>(
        salesOrder, new PartitionKey(salesOrder.AccountNumber));
    dynamic createdSalesOrder = response.Resource;
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
private static async Task CreateItemAsync(DocumentClient client)
{
    // Create a SalesOrder POCO object
    SalesOrder salesOrder1 = GetSalesOrderSample("Account1", "SalesOrder1");
    await client.CreateDocumentAsync(
        UriFactory.CreateDocumentCollectionUri(DatabaseName, ContainerName),
        salesOrder1,
        new RequestOptions { PartitionKey = new PartitionKey("Account1")});
}

private static async Task RunBasicOperationsOnDynamicObjects(DocumentClient client)
{
    // Create a dynamic object
    dynamic salesOrder = new
    {
        id= "SalesOrder5",
        AccountNumber = "Account1",
        PurchaseOrderNumber = "PO18009186470",
        OrderDate = DateTime.UtcNow,
        Total = 5.95,
    };
    ResourceResponse<Document> response = await client.CreateDocumentAsync(
        UriFactory.CreateDocumentCollectionUri(DatabaseName, ContainerName),
        salesOrder,
        new RequestOptions { PartitionKey = new PartitionKey(salesOrder.AccountNumber)});

    dynamic createdSalesOrder = response.Resource;
    }
```
---

### Read all the items in a container

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
private static async Task ReadAllItems(Container container)
{
    // Read all items in a container
    List<SalesOrder> allSalesForAccount1 = new List<SalesOrder>();

    using (FeedIterator<SalesOrder> resultSet = container.GetItemQueryIterator<SalesOrder>(
        queryDefinition: null,
        requestOptions: new QueryRequestOptions()
        {
            PartitionKey = new PartitionKey("Account1"),
            MaxItemCount = 5
        }))
    {
        while (resultSet.HasMoreResults)
        {
            FeedResponse<SalesOrder> response = await resultSet.ReadNextAsync();
            SalesOrder salesOrder = response.First();
            Console.WriteLine($"\n1.3.1 Account Number: {salesOrder.AccountNumber}; Id: {salesOrder.Id}");
            allSalesForAccount1.AddRange(response);
        }
    }
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
private static async Task ReadAllItems(DocumentClient client)
{
    // Read all items in a collection
    List<SalesOrder> allSalesForAccount1 = new List<SalesOrder>();

    string continuationToken = null;
    do
    {
        var feed = await client.ReadDocumentFeedAsync(
            UriFactory.CreateDocumentCollectionUri(DatabaseName, ContainerName),
            new FeedOptions { MaxItemCount = 5, RequestContinuation = continuationToken });
        continuationToken = feed.ResponseContinuation;
        foreach (Document document in feed)
        {
            SalesOrder salesOrder = (SalesOrder)(dynamic)document;
            Console.WriteLine($"\n1.3.1 Account Number: {salesOrder.AccountNumber}; Id: {salesOrder.Id}");
            allSalesForAccount1.Add(salesOrder);

        }
    } while (continuationToken != null);
}
```
---

### Query items
#### Changes to SqlQuerySpec (QueryDefinition in v3.0 SDK)

The `SqlQuerySpec` class in SDK v2 has now been renamed to `QueryDefinition` in the SDK v3.

`SqlParameterCollection` and `SqlParameter` has been removed. Parameters are now added to the `QueryDefinition` with a builder model using `QueryDefinition.WithParameter`. Users can access the parameters with `QueryDefinition.GetQueryParameters`

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
private static async Task QueryItems(Container container)
{
    // Query for items by a property other than Id
    QueryDefinition queryDefinition = new QueryDefinition(
        "select * from sales s where s.AccountNumber = @AccountInput")
        .WithParameter("@AccountInput", "Account1");

    List<SalesOrder> allSalesForAccount1 = new List<SalesOrder>();
    using (FeedIterator<SalesOrder> resultSet = container.GetItemQueryIterator<SalesOrder>(
        queryDefinition,
        requestOptions: new QueryRequestOptions()
        {
            PartitionKey = new PartitionKey("Account1"),
            MaxItemCount = 1
        }))
    {
        while (resultSet.HasMoreResults)
        {
            FeedResponse<SalesOrder> response = await resultSet.ReadNextAsync();
            SalesOrder sale = response.First();
            Console.WriteLine($"\n Account Number: {sale.AccountNumber}; Id: {sale.Id};");
            allSalesForAccount1.AddRange(response);
        }
    }
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
private static async Task QueryItems(DocumentClient client)
{
    // Query for items by a property other than Id
    SqlQuerySpec querySpec = new SqlQuerySpec()
    {
        QueryText = "select * from sales s where s.AccountNumber = @AccountInput",
        Parameters = new SqlParameterCollection()
            {
                new SqlParameter("@AccountInput", "Account1")
            }
    };
    var query = client.CreateDocumentQuery<SalesOrder>(
        UriFactory.CreateDocumentCollectionUri(DatabaseName, ContainerName),
        querySpec,
        new FeedOptions {EnableCrossPartitionQuery = true});

    var allSalesForAccount1 = query.ToList();

    Console.WriteLine($"\n1.4.2 Query found {allSalesForAccount1.Count} items.");
}
```
---

### Delete an item

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
private static async Task DeleteItemAsync(Container container)
{
    ItemResponse<SalesOrder> response = await container.DeleteItemAsync<SalesOrder>(
        partitionKey: new PartitionKey("Account1"), id: "SalesOrder3");
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
private static async Task DeleteItemAsync(DocumentClient client)
{
    ResourceResponse<Document> response = await client.DeleteDocumentAsync(
        UriFactory.CreateDocumentUri(DatabaseName, ContainerName, "SalesOrder3"),
        new RequestOptions { PartitionKey = new PartitionKey("Account1") });
}
```
---

### Change feed query

# [.NET SDK v3](#tab/dotnet-v3)

```csharp
private static async Task QueryChangeFeedAsync(Container container)
{
    FeedIterator<SalesOrder> iterator = container.GetChangeFeedIterator<SalesOrder>(ChangeFeedStartFrom.Beginning(), ChangeFeedMode.Incremental);

    string continuation = null;
    while (iterator.HasMoreResults)
    {
        FeedResponse<SalesOrder> response = await iteratorForTheEntireContainer.ReadNextAsync();
    
        if (response.StatusCode == HttpStatusCode.NotModified)
        {
            // No new changes
            continuation = response.ContinuationToken;
            break;
        }
        else 
        {
            // Process the documents in response
        }
    }
}
```

# [.NET SDK v2](#tab/dotnet-v2)

```csharp
private static async Task QueryChangeFeedAsync(DocumentClient client, string partitionKeyRangeId)
{
    ChangeFeedOptions options = new ChangeFeedOptions
    {
        PartitionKeyRangeId = partitionKeyRangeId,
        StartFromBeginning = true,
    };

    using(var query = client.CreateDocumentChangeFeedQuery(
        UriFactory.CreateDocumentCollectionUri(DatabaseName, ContainerName), options))
    {
        do
        {
            var response = await query.ExecuteNextAsync<Document>();
            if (response.Count > 0)
            {
                var docs = new List<Document>();
                docs.AddRange(response);
                // Process the documents.
                // Save response.ResponseContinuation if needed
            }
        }
        while (query.HasMoreResults);
    }
}
```
---

## Next steps

* [Build a Console app](quickstart-dotnet.md) to manage Azure Cosmos DB for NoSQL data using the v3 SDK
* Learn more about [what you can do with the v3 SDK](samples-dotnet.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB?
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
