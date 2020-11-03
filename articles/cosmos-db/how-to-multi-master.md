---
title: How to configure multi-region writes in Azure Cosmos DB
description: Learn how to configure multi-region writes for your applications by using different SDKs in Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: how-to
ms.date: 09/10/2020
ms.author: mjbrown
ms.custom: devx-track-python, devx-track-js, devx-track-csharp
---

# Configure multi-region writes in your applications that use Azure Cosmos DB
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Once an account has been created with multiple write regions enabled, you must make two changes in your application to the ConnectionPolicy for the DocumentClient to enable the multi-region writes and multi-homing capabilities in Azure Cosmos DB. Within the ConnectionPolicy, set UseMultipleWriteLocations to true and pass the name of the region where the application is deployed to SetCurrentLocation. This will populate the PreferredLocations property based on the geo-proximity from location passed in. If a new region is later added to the account, the application does not have to be updated or redeployed, it will automatically detect the closer region and will auto-home on to it should a regional event occur.

> [!Note]
> Cosmos accounts initially configured with single write region can be configured to multiple write regions with zero down time. To learn more see, [Configure multiple-write regions](how-to-manage-database-account.md#configure-multiple-write-regions)

## <a id="portal"></a> Azure portal

Use the following steps to enable multi-region writes from Azure portal:

1. Sign-in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos account and from the menu, open the **Replicate data globally** pane.

1. Under the **Multi-region writes** option, choose **enable**. It automatically adds the existing regions to read and write regions.

1. You can add additional regions by selecting the icons on the map or by selecting the **Add region** button. All the regions you add will have both read and writes enabled.

1. After you update the region list, select **save** to apply the changes.

   :::image type="content" source="./media/how-to-multi-master/enable-multi-region-writes.png" alt-text="Screenshot to enable multi-region writes using Azure portal" lightbox="./media/how-to-multi-master/enable-multi-region-writes.png":::

## <a id="netv2"></a>.NET SDK v2

To enable multi-region writes in your application, set `UseMultipleWriteLocations` to `true`. Also, set `SetCurrentLocation` to the region in which the application is being deployed and where Azure Cosmos DB is replicated:

```csharp
ConnectionPolicy policy = new ConnectionPolicy
    {
        ConnectionMode = ConnectionMode.Direct,
        ConnectionProtocol = Protocol.Tcp,
        UseMultipleWriteLocations = true
    };
policy.SetCurrentLocation("West US 2");
```

## <a id="netv3"></a>.NET SDK v3

To enable multi-region writes in your application, set `ApplicationRegion` to the region in which the application is being deployed and where Cosmos DB is replicated:

```csharp
CosmosClient cosmosClient = new CosmosClient(
    "<connection-string-from-portal>", 
    new CosmosClientOptions()
    {
        ApplicationRegion = Regions.WestUS2,
    });
```

Optionally, you can use the `CosmosClientBuilder` and `WithApplicationRegion` to achieve the same result:

```csharp
CosmosClientBuilder cosmosClientBuilder = new CosmosClientBuilder("<connection-string-from-portal>")
            .WithApplicationRegion(Regions.WestUS2);
CosmosClient client = cosmosClientBuilder.Build();
```

## <a id="java4-multi-region-writes"></a> Java V4 SDK

To enable multi-region writes in your application, call `.multipleWriteRegionsEnabled(true)` and `.preferredRegions(preferredRegions)` in the client builder, where `preferredRegions` is a `List` containing one element - that is the region in which the application is being deployed and where Cosmos DB is replicated:

# [Async](#tab/api-async)

   [Java SDK V4](sql-api-sdk-java-v4.md) (Maven [com.azure::azure-cosmos](https://mvnrepository.com/artifact/com.azure/azure-cosmos)) Async API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=ConfigureMultimasterAsync)]

# [Sync](#tab/api-sync)

   [Java SDK V4](sql-api-sdk-java-v4.md) (Maven [com.azure::azure-cosmos](https://mvnrepository.com/artifact/com.azure/azure-cosmos)) Sync API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/sync/SampleDocumentationSnippets.java?name=ConfigureMultimasterSync)]

--- 

## <a id="java2-multi-region-writes"></a> Async Java V2 SDK

The Java V2 SDK used the Maven [com.microsoft.azure::azure-cosmosdb](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb). To enable multi-region writes in your application, set `policy.setUsingMultipleWriteLocations(true)` and set `policy.setPreferredLocations` to the region in which the application is being deployed and where Cosmos DB is replicated:

```java
ConnectionPolicy policy = new ConnectionPolicy();
policy.setUsingMultipleWriteLocations(true);
policy.setPreferredLocations(Collections.singletonList(region));

AsyncDocumentClient client =
    new AsyncDocumentClient.Builder()
        .withMasterKeyOrResourceToken(this.accountKey)
        .withServiceEndpoint(this.accountEndpoint)
        .withConsistencyLevel(ConsistencyLevel.Eventual)
        .withConnectionPolicy(policy).build();
```

## <a id="javascript"></a>Node.js, JavaScript, and TypeScript SDKs

To enable multi-region writes in your application, set `connectionPolicy.UseMultipleWriteLocations` to `true`. Also, set `connectionPolicy.PreferredLocations` to the region in which the application is being deployed and where Cosmos DB is replicated:

```javascript
const connectionPolicy: ConnectionPolicy = new ConnectionPolicy();
connectionPolicy.UseMultipleWriteLocations = true;
connectionPolicy.PreferredLocations = [region];

const client = new CosmosClient({
  endpoint: config.endpoint,
  auth: { masterKey: config.key },
  connectionPolicy,
  consistencyLevel: ConsistencyLevel.Eventual
});
```

## <a id="python"></a>Python SDK

To enable multi-region writes in your application, set `connection_policy.UseMultipleWriteLocations` to `true`. Also, set `connection_policy.PreferredLocations` to the region in which the application is being deployed and where Cosmos DB is replicated.

```python
connection_policy = documents.ConnectionPolicy()
connection_policy.UseMultipleWriteLocations = True
connection_policy.PreferredLocations = [region]

client = cosmos_client.CosmosClient(self.account_endpoint, {
                                    'masterKey': self.account_key}, connection_policy, documents.ConsistencyLevel.Session)
```

## Next steps

Read the following articles:

* [Use session tokens to manage consistency in Azure Cosmos DB](how-to-manage-consistency.md#utilize-session-tokens)
* [Conflict types and resolution policies in Azure Cosmos DB](conflict-resolution-policies.md)
* [High availability in Azure Cosmos DB](high-availability.md)
* [Consistency levels in Azure Cosmos DB](consistency-levels.md)
* [Choose the right consistency level in Azure Cosmos DB](./consistency-levels.md)
* [Consistency, availability, and performance tradeoffs in Azure Cosmos DB](./consistency-levels.md)
* [Availability and performance tradeoffs for various consistency levels](./consistency-levels.md)
* [Globally scaling provisioned throughput](./request-units.md)
* [Global distribution: Under the hood](global-dist-under-the-hood.md)