---
title: Search and query with text indexes
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Configure and use text indexes to perform and fine tune text searches in Azure Cosmos DB for MongoDB vCore.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 08/28/2023
# CustomerIntent: As a database query developer, I want to create a text index so that I can perform full-text searches.
---

# Search and query with text indexes in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

One of the key features that Azure Cosmos DB for MongoDB vCore provides is text indexing, which allows for efficient searching and querying of text-based data. The service implements **version 2** text indexes. Version 2 supports case sensitivity but not diacritic sensitivity.

Text indexes in Azure Cosmos DB for MongoDB are special data structures that optimize text-based queries, making them faster and more efficient. They're designed to handle textual content like documents, articles, comments, or any other text-heavy data. Text indexes use techniques such as tokenization, stemming, and stop words to create an index that improves the performance of text-based searches.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).

## Define a text index

For simplicity, let us consider an example of a blog application with the following setup:

- **Database name**: `cosmicworks`
- **Collection name**: `products`

This example application stores articles as documents with the following structure:

```json
{
  "_id": ObjectId("617a34e7a867530bff1b2346"),
  "title": "Azure Cosmos DB - A Game Changer",
  "content": "Azure Cosmos DB is a globally distributed, multi-model database service.",
  "author": "John Doe",
  "category": "Technology",
  "published": true
}
```

1. Use the `createIndex` method with the `text` option to create a text index on the `title` field.

    ```javascript
    use cosmicworks;

    db.products.createIndex({ title: "text" })
    ```

    > [!NOTE]
    > While you can define only one text index per collection, Azure Cosmos DB for MongoDB vCore allows you to create text indexes on multiple fields to enable you to perform text searches across different fields in your documents.

1. Optionally, create an index to support search on both the `title` and `content` fields.

    ```javascript
    db.products.createIndex({ title: "text", content: "text" })
    ```

## Configure text index options

Text indexes in Azure Cosmos DB for MongoDB come with several options to customize their behavior. For example, you can specify the language for text analysis, set weights to prioritize certain fields, and configure case-insensitive searches. Here's an example of creating a text index with options:

1. Create an index to support search on both the `title` and `content` fields with English language support. Also, assign higher weights to the `title` field to prioritize it in search results.

    ```javascript
    db.products.createIndex(
        { title: "text", content: "text" },
        { default_language: "english", weights: { title: 10, content: 5 }, caseSensitive: false }
    )
    ```

### Weights in text indexes

When creating a text index, you can assign different weights to individual fields in the index. These weights represent the importance or relevance of each field in the search. Azure Cosmos DB for MongoDB vCore calculates a score and assigned weights for each document based on the search terms when executing a text search query. The score represents the relevance of the document to the search query.

1. Create an index to support search on both the `title` and `content` fields. Assign a weight of 2 to the "title" field and a weight of 1 to the "content" field.

    ```javascript 
    db.products.createIndex(
    { title: "text", content: "text" },
    { weights: { title: 2, content: 1 } }
    )
    ```

    > [!NOTE]
    > When a client performs a text search query with the term "Cosmos DB," the score for each document in the collection will be calculated based on the presence and frequency of the term in both the "title" and "content" fields, with higher importance given to the "title" field due to its higher weight.

## Perform a text search using a text index

Once the text index is created, you can perform text searches using the "text" operator in your queries. The text operator takes a search string and matches it against the text index to find relevant documents.

1. Perform a text search for the phrase `Cosmos DB`.

    ```javascript
    db.products.find(
        { $text: { $search: "Cosmos DB" } }
    )
    ```

1. Optionally, use the `$meta` projection operator along with the `textScore` field in a query to see the weight

    ```javascript
    db.products.find(
        { $text: { $search: "Cosmos DB" } },
        { score: { $meta: "textScore" } }
    )
    ```

## Dropping a text index

To drop a text index in MongoDB, you can use the `dropIndex()` method on the collection and specify the index key or name for the text index you want to remove.

1. Drop a text index by explicitly specifying the key.

    ```javascript
    db.products.dropIndex({ title: "text" })
    ```

1. Optionally, drop a text index by specifying the autogenerated unique name.

    ```javascript
    db.products.dropIndex("title_text")
    ```

## Text index limitations

- Only one text index can be defined on a collection.
- Text indexes support simple text searches and don't provide advanced search capabilities like regular expression searches.
- Hint() isn't supported in combination with a query using $text expression.
- Sort operations can't use the ordering of the text index in MongoDB.
- Text indexes can be relatively large, consuming significant storage space compared to other index types.

## Next step

> [!div class="nextstepaction"]
> [Build a Node.js web application](tutorial-nodejs-web-app.md)
