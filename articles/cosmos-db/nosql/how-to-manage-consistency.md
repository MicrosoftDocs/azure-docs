---
title: Manage consistency in Azure Cosmos DB
description: Learn how to configure and manage consistency levels in Azure Cosmos DB using Azure portal, .NET SDK, Java SDK and various other SDKs
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 02/16/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.devlang: csharp, java, javascript
ms.custom: devx-track-js, devx-track-csharp, devx-track-azurecli, devx-track-azurepowershell, devx-track-dotnet, devx-track-extended-java
---

# Manage consistency levels in Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article explains how to manage consistency levels in Azure Cosmos DB. You learn how to configure the default consistency level, override the default consistency, manually manage session tokens, and understand the Probabilistically Bounded Staleness (PBS) metric.

As you change your account level consistency, ensure you redeploy your applications and make any necessary code modifications to apply these changes.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Configure the default consistency level

The [default consistency level](../consistency-levels.md) is the consistency level that clients use by default.

# [Azure portal](#tab/portal)

To view or modify the default consistency level, sign in to the Azure portal. Find your Azure Cosmos DB account, and open the **Default consistency** pane. Select the level of consistency you want as the new default, and then select **Save**. The Azure portal also provides a visualization of different consistency levels with music notes. 

:::image type="content" source="./media/how-to-manage-consistency/consistency-settings.png" alt-text="Consistency menu in the Azure portal":::

# [CLI](#tab/cli)

Create an Azure Cosmos DB account with Session consistency, then update the default consistency.

```azurecli
# Create a new account with Session consistency
az cosmosdb create --name $accountName --resource-group $resourceGroupName --default-consistency-level Session

# update an existing account's default consistency
az cosmosdb update --name $accountName --resource-group $resourceGroupName --default-consistency-level Strong
```

# [PowerShell](#tab/powershell)

Create an Azure Cosmos DB account with Session consistency, then update the default consistency.

```azurepowershell-interactive
# Create a new account with Session consistency
New-AzCosmosDBAccount -ResourceGroupName $resourceGroupName `
  -Location $locations -Name $accountName -DefaultConsistencyLevel "Session"

# Update an existing account's default consistency
Update-AzCosmosDBAccount -ResourceGroupName $resourceGroupName `
  -Name $accountName -DefaultConsistencyLevel "Strong"
```

---

## Override the default consistency level

Clients can override the default consistency level that is set by the service. Consistency level can be set on a per request, which overrides the default consistency level set at the account level.

> [!TIP]
> Consistency can only be **relaxed** at the SDK instance or request level. To move from weaker to stronger consistency, update the default consistency for the Azure Cosmos DB account.

> [!TIP]
> Overriding the default consistency level only applies to reads within the SDK client. An account configured for strong consistency by default will still write and replicate data synchronously to every region in the account. When the SDK client instance or request overrides this with Session or weaker consistency, reads will be performed using a single replica. See [Consistency levels and throughput](../consistency-levels.md#consistency-levels-and-throughput) for more details.

### <a id="override-default-consistency-dotnet"></a>.NET SDK

# [.NET SDK V2](#tab/dotnetv2)

```csharp
// Override consistency at the client level
documentClient = new DocumentClient(new Uri(endpoint), authKey, connectionPolicy, ConsistencyLevel.Eventual);

// Override consistency at the request level via request options
RequestOptions requestOptions = new RequestOptions { ConsistencyLevel = ConsistencyLevel.Eventual };

var response = await client.ReadDocumentAsync(collectionUri, document, requestOptions);
```

# [.NET SDK V3](#tab/dotnetv3)

```csharp
// Override consistency at the request level via request options
ItemRequestOptions requestOptions = new ItemRequestOptions { ConsistencyLevel = ConsistencyLevel.Eventual };

var response = await client.GetContainer(databaseName, containerName)
    .ReadItemAsync(
        item,
        new PartitionKey(itemPartitionKey),
        requestOptions);
```
---

### <a id="override-default-consistency-javav4"></a> Java V4 SDK

# [Async](#tab/api-async)

   Java SDK V4 (Maven com.azure::azure-cosmos) Async API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=ManageConsistencyAsync)]

# [Sync](#tab/api-sync)

   Java SDK V4 (Maven com.azure::azure-cosmos) Sync API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/sync/SampleDocumentationSnippets.java?name=ManageConsistencySync)]

--- 

### <a id="override-default-consistency-javav2"></a> Java V2 SDKs

# [Async](#tab/api-async)

Async Java V2 SDK (Maven com.microsoft.azure::azure-cosmosdb)

```java
// Override consistency at the client level
ConnectionPolicy policy = new ConnectionPolicy();

AsyncDocumentClient client =
        new AsyncDocumentClient.Builder()
                .withMasterKey(this.accountKey)
                .withServiceEndpoint(this.accountEndpoint)
                .withConsistencyLevel(ConsistencyLevel.Eventual)
                .withConnectionPolicy(policy).build();
```

# [Sync](#tab/api-sync)

Sync Java V2 SDK (Maven com.microsoft.azure::azure-documentdb)

```java
// Override consistency at the client level
ConnectionPolicy connectionPolicy = new ConnectionPolicy();
DocumentClient client = new DocumentClient(accountEndpoint, accountKey, connectionPolicy, ConsistencyLevel.Eventual);
```
---

### <a id="override-default-consistency-javascript"></a>Node.js/JavaScript/TypeScript SDK

```javascript
// Override consistency at the client level
const client = new CosmosClient({
  /* other config... */
  consistencyLevel: ConsistencyLevel.Eventual
});

// Override consistency at the request level via request options
const { body } = await item.read({ consistencyLevel: ConsistencyLevel.Eventual });
```

### <a id="override-default-consistency-python"></a>Python SDK

```python
# Override consistency at the client level
connection_policy = documents.ConnectionPolicy()
client = cosmos_client.CosmosClient(self.account_endpoint, {
                                    'masterKey': self.account_key}, connection_policy, documents.ConsistencyLevel.Eventual)
```

## Utilize session tokens

One of the consistency levels in Azure Cosmos DB is *Session* consistency. This is the default level applied to Azure Cosmos DB accounts by default. When working with Session consistency, each new write request to Azure Cosmos DB is assigned a new SessionToken. The CosmosClient will use this token internally with each read/query request to ensure that the set consistency level is maintained.

In some scenarios you need to manage this Session yourself. Consider a web application with multiple nodes, each node will have its own instance of CosmosClient. If you wanted these nodes to participate in the same session (to be able read your own writes consistently across web tiers) you would have to send the SessionToken from FeedResponse\<T\> of the write action to the end-user using a cookie or some other mechanism, and have that token flow back to the web tier and ultimately the CosmosClient for subsequent reads. If you are using a round-robin load balancer which does not maintain session affinity between requests, such as the Azure Load Balancer, the read could potentially land on a different node to the write request, where the session was created.

If you do not flow the Azure Cosmos DB SessionToken across as described above you could end up with inconsistent read results for a period of time.

Session Tokens in Azure Cosmos DB are partition-bound, meaning they are exclusively associated with one partition. In order to ensure you can read your writes, use the session token that was last generated for the relevant item(s). To manage session tokens manually, get the session token from the response and set them per request. If you don't need to manage session tokens manually, you don't need to use these samples. The SDK keeps track of session tokens automatically. If you don't set the session token manually, by default, the SDK uses the most recent session token.

### <a id="utilize-session-tokens-dotnet"></a>.NET SDK

# [.NET SDK V2](#tab/dotnetv2)

```csharp
var response = await client.ReadDocumentAsync(
                UriFactory.CreateDocumentUri(databaseName, collectionName, "SalesOrder1"));
string sessionToken = response.SessionToken;

RequestOptions options = new RequestOptions();
options.SessionToken = sessionToken;
var response = await client.ReadDocumentAsync(
                UriFactory.CreateDocumentUri(databaseName, collectionName, "SalesOrder1"), options);
```

# [.NET SDK V3](#tab/dotnetv3)

```csharp
Container container = client.GetContainer(databaseName, collectionName);
ItemResponse<SalesOrder> response = await container.CreateItemAsync<SalesOrder>(salesOrder);
string sessionToken = response.Headers.Session;

ItemRequestOptions options = new ItemRequestOptions();
options.SessionToken = sessionToken;
ItemResponse<SalesOrder> response = await container.ReadItemAsync<SalesOrder>(salesOrder.Id, new PartitionKey(salesOrder.PartitionKey), options);
```
---

### <a id="override-default-consistency-javav4"></a> Java V4 SDK

# [Async](#tab/api-async)

   Java SDK V4 (Maven com.azure::azure-cosmos) Async API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=ManageConsistencySessionAsync)]

# [Sync](#tab/api-sync)

   Java SDK V4 (Maven com.azure::azure-cosmos) Sync API

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/sync/SampleDocumentationSnippets.java?name=ManageConsistencySessionSync)]

--- 

### <a id="utilize-session-tokens-javav2"></a>Java V2 SDKs

# [Async](#tab/api-async)

Async Java V2 SDK (Maven com.microsoft.azure::azure-cosmosdb)

```java
// Get session token from response
RequestOptions options = new RequestOptions();
options.setPartitionKey(new PartitionKey(document.get("mypk")));
Observable<ResourceResponse<Document>> readObservable = client.readDocument(document.getSelfLink(), options);
readObservable.single()           // we know there will be one response
  .subscribe(
      documentResourceResponse -> {
          System.out.println(documentResourceResponse.getSessionToken());
      },
      error -> {
          System.err.println("an error happened: " + error.getMessage());
      });

// Resume the session by setting the session token on RequestOptions
RequestOptions options = new RequestOptions();
requestOptions.setSessionToken(sessionToken);
Observable<ResourceResponse<Document>> readObservable = client.readDocument(document.getSelfLink(), options);
```

# [Sync](#tab/api-sync)

Sync Java V2 SDK (Maven com.microsoft.azure::azure-documentdb)

```java
// Get session token from response
ResourceResponse<Document> response = client.readDocument(documentLink, null);
String sessionToken = response.getSessionToken();

// Resume the session by setting the session token on the RequestOptions
RequestOptions options = new RequestOptions();
options.setSessionToken(sessionToken);
ResourceResponse<Document> response = client.readDocument(documentLink, options);
```
---

### <a id="utilize-session-tokens-javascript"></a>Node.js/JavaScript/TypeScript SDK

```javascript
// Get session token from response
const { headers, item } = await container.items.create({ id: "meaningful-id" });
const sessionToken = headers["x-ms-session-token"];

// Immediately or later, you can use that sessionToken from the header to resume that session.
const { body } = await item.read({ sessionToken });
```

### <a id="utilize-session-tokens-python"></a>Python SDK

```python
// Get the session token from the last response headers
item = client.ReadItem(item_link)
session_token = client.last_response_headers["x-ms-session-token"]

// Resume the session by setting the session token on the options for the request
options = {
    "sessionToken": session_token
}
item = client.ReadItem(doc_link, options)
```

## Monitor Probabilistically Bounded Staleness (PBS) metric

How eventual is eventual consistency? For the average case, can we offer staleness bounds with respect to version history and time. The [**Probabilistically Bounded Staleness (PBS)**](http://pbs.cs.berkeley.edu/) metric tries to quantify the probability of staleness and shows it as a metric. 

To view the PBS metric, go to your Azure Cosmos DB account in the Azure portal. Open the **Metrics (Classic)** pane, and select the **Consistency** tab. Look at the graph named **Probability of strongly consistent reads based on your workload (see PBS)**.

:::image type="content" source="./media/how-to-manage-consistency/pbs-metric.png" alt-text="PBS graph in the Azure portal":::

## Next steps

Learn more about how to manage data conflicts, or move on to the next key concept in Azure Cosmos DB. See the following articles:

* [Consistency Levels in Azure Cosmos DB](../consistency-levels.md)
* [Partitioning and data distribution](../partitioning-overview.md)
* [Manage conflicts between regions](how-to-manage-conflicts.md)
* [Partitioning and data distribution](../partitioning-overview.md)
* [Consistency tradeoffs in modern distributed database systems design](https://www.computer.org/csdl/magazine/co/2012/02/mco2012020037/13rRUxjyX7k)
* [High availability](../high-availability.md)
* [Azure Cosmos DB SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
