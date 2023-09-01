---
title: Text indexes in Azure Cosmos DB for MongoDB vCore
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: How to configure and use text indexes in Azure Cosmos DB for MongoDB vCore
author: suvishodcitus
ms.author: suvishod
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom: build-2023
ms.topic: how-to
ms.date: 07/26/2023
---

# Text indexes in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

One of the key features that Azure Cosmos DB for MongoDB vCore provides is text indexing, which allows for efficient searching and querying of text-based data. The service implements version 2 text indexes which support case sensitivity but not diacritic sensitivity. In this article, we will explore the usage of text indexes in Azure Cosmos DB for MongoDB, along with practical examples and syntax to help you leverage this feature effectively.

## What are Text Indexes? 

Text indexes in Azure Cosmos DB for MongoDB are special data structures that optimize text-based queries, making them faster and more efficient. They are designed to handle textual content like documents, articles, comments, or any other text-heavy data. Text indexes use techniques such as tokenization, stemming, and stop words to create an index that improves the performance of text-based searches.

## Defining a Text Index

For simplicity let us consider an example of a blog application that stores articles with the following document structure:

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

To create a text index in Azure Cosmos DB for MongoDB, you can use the "createIndex" method with the "text" option. Here's an example of how to create a text index for a "title" field in a collection named "articles":

```
db.articles.createIndex({ title: "text" })
```

While we can define only one text index per collection, Azure Cosmos DB for MongoDB allows you to create text indexes on multiple fields to enable you to perform text searches across different fields in your documents.

For example, if we want to perform search on both the "title" and "content" fields, then the text index can be defined as:

```
db.articles.createIndex({ title: "text", content: "text" })
```

## Text Index Options

Text indexes in Azure Cosmos DB for MongoDB come with several options to customize their behavior. For example, you can specify the language for text analysis, set weights to prioritize certain fields, and configure case-insensitive searches. Here's an example of creating a text index with options:

```
db.articles.createIndex(
  { content: "text", title: "text" },
  { default_language: "english", weights: { title: 10, content: 5 }, caseSensitive: false }
)
```
In this example, we have defined a text index on both the "content" and "title" fields with English language support. We have also assigned higher weights to the "title" field to prioritize it in search results.

## Significance of weights in text indexes

When creating a text index, you have the option to assign different weights to individual fields in the index. These weights represent the importance or relevance of each field in the search.

When executing a text search query, Cosmos DB will calculate a score for each document based on the search terms and the assigned weights of the indexed fields. The score represents the relevance of the document to the search query.


```
db.articles.createIndex(
  { title: "text", content: "text" },
  { weights: { title: 2, content: 1 } }
)
```

For example, let's say we have a text index with two fields: "title" and "content." We assign a weight of 2 to the "title" field and a weight of 1 to the "content" field. When a user performs a text search query with the term "Cosmos DB," the score for each document in the collection will be calculated based on the presence and frequency of the term in both the "title" and "content" fields, with higher importance given to the "title" field due to its higher weight.

To look at the score of documents in the query result, you can use the $meta projection operator along with the textScore field in your query projection.


```
db.articles.find(
   { $text: { $search: "Cosmos DB" } },
   { score: { $meta: "textScore" } }
)
```

## Performing a Text Search

Once the text index is created, you can perform text searches using the "text" operator in your queries. The text operator takes a search string and matches it against the text index to find relevant documents. Here's an example of a text search query:

```
db.articles.find({ $text: { $search: "Azure Cosmos DB" } })
```

This query will return all documents in the "articles" collection that contain the terms "Azure" and "Cosmos DB" in any order.

## Limitations

* Only one text index can be defined on a collection.
* Text indexes support simple text searches and do not provide advanced search capabilities like regular expression searches.
* Hint() is not supported in combination with a query using $text expression.
* Sort operations cannot leverage the ordering of the text index in MongoDB.
* Text indexes can be relatively large, consuming significant storage space compared to other index types.



## Dropping a text index

To drop a text index in MongoDB, you can use the dropIndex() method on the collection and specify the index key or name for the text index you want to remove.

```
db.articles.dropIndex({ title: "text" })
```
or
```
db.articles.dropIndex("title_text")
```
