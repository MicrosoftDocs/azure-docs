---
title: Azure Cosmos DB indexing metrics
description:  Learn how to obtain and interpret the indexing metrics in Azure Cosmos DB
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 10/25/2021
ms.author: sidandrews
ms.reviewer: jucocchi
---
# Indexing metrics in Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB provides indexing metrics to show both utilized indexed paths and recommended indexed paths. You can use the indexing metrics to optimize query performance, especially in cases where you aren't sure how to modify the [indexing policy](../index-policy.md)).

> [!NOTE]
> The indexing metrics are only supported in the .NET SDK (version 3.21.0 or later) and Java SDK (version 4.19.0 or later)

## Enable indexing metrics

You can enable indexing metrics for a query by setting the `PopulateIndexMetrics` property to `true`. When not specified, `PopulateIndexMetrics` defaults to `false`. We only recommend enabling the index metrics for troubleshooting query performance. As long as your queries and indexing policy stay the same, the index metrics are unlikely to change. Instead, we recommend identifying expensive queries by monitoring query RU charge and latency using diagnostic logs.

## [.NET SDK](#tab/dotnet)

```csharp
    string sqlQueryText = "SELECT TOP 10 c.id FROM c WHERE c.Item = 'value1234' AND c.Price > 2";

    QueryDefinition query = new QueryDefinition(sqlQueryText);

    FeedIterator<Item> resultSetIterator = container.GetItemQueryIterator<Item>(
                query, requestOptions: new QueryRequestOptions
        {
            PopulateIndexMetrics = true
        });

    FeedResponse<Item> response = null;

    while (resultSetIterator.HasMoreResults)
        {
          response = await resultSetIterator.ReadNextAsync();
          Console.WriteLine(response.IndexMetrics);
        }
```

## [Java SDK Sync](#tab/java-sync)

```java    
    SqlQuerySpec querySpec = new SqlQuerySpec("SELECT TOP 10 c.id FROM c WHERE c.Item = 'value1234' AND c.Price > 2");
    CosmosQueryRequestOptions options = new CosmosQueryRequestOptions();
    options.setIndexMetricsEnabled(true);

    CosmosPagedIterable<JsonNode> items = container.queryItems(querySpec, options, JsonNode.class);

    // Print
    items.iterableByPage().forEach(itemResponse -> {
        logger.info("diagnostics: {}", itemResponse.getCosmosDiagnostics());
        for (JsonNode item : itemResponse.getResults()) {
            logger.info("Item: {}", item.toString());
        }
    });  
```

## [Java SDK Async](#tab/java-async)

```java    
    SqlQuerySpec querySpec = new SqlQuerySpec("SELECT TOP 10 c.id FROM c WHERE c.Item = 'value1234' AND c.Price > 2");
    CosmosQueryRequestOptions options = new CosmosQueryRequestOptions();
    options.setIndexMetricsEnabled(true);

    CosmosPagedFlux<JsonNode> items = container.queryItems(querySpec, options, JsonNode.class);
    
    // Print
    items.byPage(100).flatMap(itemsResponse -> {
        logger.info("diagnostics: {}",itemsResponse.getCosmosDiagnostics());
        for (JsonNode item : itemsResponse.getResults()) {
            logger.info("Item: {}", item.toString());
        }
        executeCountQueryPrintSingleResultNumber.incrementAndGet();
        return Flux.just(itemsResponse);
    }).blockLast();   
```

## [JavaScript SDK](#tab/javascript)
```javascript
const querySpec = {
    query: "SELECT TOP 10 c.id FROM c WHERE c.Item = 'value1234' AND c.Price > 2",
  };
const { resources: resultsIndexMetrics, indexMetrics } = await container.items
    .query(querySpec, { populateIndexMetrics: true })
    .fetchAll();
console.log("IndexMetrics: ", indexMetrics);
```
---

### Example output

In this example query, we observe the utilized paths `/Item/?` and `/Price/?` and the potential composite indexes `(/Item ASC, /Price ASC)`.

```
Index Utilization Information
  Utilized Single Indexes
    Index Spec: /Item/?
    Index Impact Score: High
    ---
    Index Spec: /Price/?
    Index Impact Score: High
    ---
  Potential Single Indexes
  Utilized Composite Indexes
  Potential Composite Indexes
    Index Spec: /Item ASC, /Price ASC
    Index Impact Score: High
    ---
```

## Utilized indexed paths

The utilized single indexes and utilized composite indexes respectively show the included paths and composite indexes that the query used. Queries can use multiple indexed paths, as well as a mix of included paths and composite indexes. If an indexed path isn't listed as utilized, removing the indexed path won't have any impact on the query's performance.

Consider the list of utilized indexed paths as evidence that a query used those paths. If you aren't sure if a new indexed path will improve query performance, you should try adding the new indexed paths and check if the query uses them.

## Potential indexed paths

The potential single indexes and utilized composite indexes respectively show the included paths and composite indexes that, if added, the query might utilize. If you see potential indexed paths, you should consider adding them to your indexing policy and observe if they improve query performance.

Consider the list of potential indexed paths as recommendations rather than conclusive evidence that a query will use a specific indexed path. The potential indexed paths are not an exhaustive list of indexed paths that a query could use. Additionally, it's possible that some potential indexed paths won't have any impact on query performance. [Add the recommended indexed paths](how-to-manage-indexing-policy.md) and confirm that they improve query performance.

> [!NOTE]
> Do you have any feedback about the indexing metrics? We want to hear it! Feel free to share feedback directly with the Azure Cosmos DB engineering team: cosmosdbindexing@microsoft.com

## Index impact score

The index impact score is the likelihood that an indexed path, based on the query shape, has a significant impact on query performance. In other words, the index impact score is the probability that, without that specific indexed path, the query RU charge would have been substantially higher. 

There are two possible index impact scores: **high** and **low**. If you have multiple potential indexed paths, we recommend focusing on indexed paths with a **high** impact score.

The only criteria used in the index impact score is the query shape. For example, in the below query, the indexed path `/name/?` would be assigned a **high** index impact score:

```sql
SELECT * 
FROM c
WHERE c.name = "Samer"
```

The actual impact depending on the nature of the data. If only a few items match the `/name` filter, the indexed path will substantially improve the query RU charge. However, if most items end up matching the `/name` filter anyway, the indexed path may not end up improving query performance. In each of these cases, the indexed path `/name/?` would be assigned a **high** index impact score because, based on the query shape, the indexed path has a high likelihood of improving query performance.

## Additional examples

### Example query

```sql
SELECT c.id 
FROM c 
WHERE c.name = 'Tim' AND c.age > 15 AND c.town = 'Redmond' AND c.timestamp > 2349230183
```

### Index metrics

```
Index Utilization Information
  Utilized Single Indexes
    Index Spec: /name/?
    Index Impact Score: High
    ---
    Index Spec: /age/?
    Index Impact Score: High
    ---
    Index Spec: /town/?
    Index Impact Score: High
    ---
    Index Spec: /timestamp/?
    Index Impact Score: High
    ---
  Potential Single Indexes
  Utilized Composite Indexes
  Potential Composite Indexes
    Index Spec: /name ASC, /town ASC, /age ASC
    Index Impact Score: High
    ---
    Index Spec: /name ASC, /town ASC, /timestamp ASC
    Index Impact Score: High
    ---
```
These index metrics show that the query used the indexed paths `/name/?`, `/age/?`, `/town/?`, and `/timestamp/?`. The index metrics also indicate that there's a high likelihood that adding the composite indexes `(/name ASC, /town ASC, /age ASC)` and `(/name ASC, /town ASC, /timestamp ASC)` will further improve performance.

## Next steps

Read more about indexing in the following articles:

- [Indexing overview](../index-overview.md)
- [How to manage indexing policy](how-to-manage-indexing-policy.md)
