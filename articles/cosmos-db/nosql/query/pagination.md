---
title: Pagination
titleSuffix: Azure Cosmos DB for NoSQL
description: Page through multiple sets of results and use continuation tokens to continue pagination operators.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# Pagination in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

In Azure Cosmos DB for NoSQL, queries may have multiple pages of results. This document explains criteria that Azure Cosmos DB for NoSQL's query engine uses to decide whether to split query results into multiple pages. You can optionally use continuation tokens to manage query results that span multiple pages.

## Query executions

Sometimes query results are split over multiple pages. A separate query execution generates each page's results. When query results can't be returned in one single execution, Azure Cosmos DB for NoSQL automatically splits results into multiple pages.

You can specify the maximum number of items returned by a query by setting the ``MaxItemCount``. The ``MaxItemCount`` is specified per request and tells the query engine to return that number of items or fewer. You can set ``MaxItemCount`` to ``-1`` if you don't want to place a limit on the number of results per query execution.

In addition, there are other reasons that the query engine might need to split query results into multiple pages. These reasons include:

- The container was throttled and there weren't available RUs to return more query results
- The query execution's response was too large
- The query execution's time was too long
- It was more efficient for the query engine to return results in extra executions

The number of items returned per query execution are less than or equal to ``MaxItemCount``. However, it's possible that other criteria might have limited the number of results the query could return. If you execute the same query multiple times, the number of pages might not be constant. For example, if a query is throttled there may be fewer available results per page, which means the query has extra pages. In some cases, it's also possible that your query may return an empty page of results.

## Handle multiple pages of results

To ensure accurate query results, you should progress through all pages. You should continue to execute queries until there are no extra pages.

Here are some examples for processing results from queries with multiple pages:

- [.NET SDK](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/Queries/Program.cs#L294)
- [Java SDK](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L162-L176)
- [Node.js SDK](https://github.com/Azure/azure-sdk-for-js/blob/83fcc44a23ad771128d6e0f49043656b3d1df990/sdk/cosmosdb/cosmos/samples/IndexManagement.ts#L128-L140)
- [Python SDK](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/examples.py#L89)

## Continuation tokens

In the .NET SDK and Java SDK, you can optionally use continuation tokens as a bookmark for your query's progress. Azure Cosmos DB for NoSQL query executions are stateless at the server side and can be resumed at any time using the continuation token. For the Python SDK, continuation tokens are only supported for single partition queries. The partition key must be specified in the options object because it's not sufficient to have it in the query itself.

Here are some example for using continuation tokens:

- [.NET SDK](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/Queries/Program.cs#L230)
- [Java SDK](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L216)
- [Node.js SDK](https://github.com/Azure/azure-sdk-for-js/blob/2186357a6e6a64b59915d0cf3cba845be4d115c4/sdk/cosmosdb/cosmos/samples/src/BulkUpdateWithSproc.ts#L16-L31)
- [Python SDK](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/test/test_query.py#L533)

If the query returns a continuation token, then there are extra query results.

In Azure Cosmos DB for NoSQL's REST API, you can manage continuation tokens with the ``x-ms-continuation`` header. As with querying with the .NET or Java SDK, if the ``x-ms-continuation`` response header isn't empty, it means the query has extra results.

As long as you're using the same SDK version, continuation tokens never expire. You can optionally [restrict the size of a continuation token](/dotnet/api/microsoft.azure.documents.client.feedoptions.responsecontinuationtokenlimitinkb). Regardless of the amount of data or number of physical partitions in your container, queries return a single continuation token.

You can't use continuation tokens for queries with [GROUP BY](group-by.md) or [DISTINCT](keywords.md#distinct) because these queries would require storing a significant amount of state. For queries with ``DISTINCT``, you can use continuation tokens if you add ``ORDER BY`` to the query.

Here's an example of a query with ``DISTINCT`` that could use a continuation token:

```sql
SELECT DISTINCT VALUE
    e.name
FROM
    employees e
ORDER BY
    e.name
```

## Next steps

- [``ORDER BY`` clause](order-by.md)
- [``OFFSET LIMIT`` clause](offset-limit.md)
