---
title: Text Indexes in Azure Cosmos DB for MongoDB vCore
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Text indexes in Azure Cosmos DB for MongoDB vCore.
author: sudhanshu-vishodia
ms.author: suvishod
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom: build-2023
ms.topic: conceptual
ms.date: 07/26/2023
---

# Text Indexes in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

One of the key features that MongoDB provides is text indexing, which allows for efficient searching and querying of text-based data. In this article, we will explore the usage of text indexes in Azure Cosmos DB for MongoDB, along with practical examples and syntax to help you leverage this feature effectively.

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

While we can define only one text index per collection, Azure CosmosDB for MongoDB allows you to create text indexes on multiple columns to enable you to perform text searches across different fields in your documents.

For example, if we want to perform search on both the "title" and "content" fields, then the text index can be defined as:

```
db.articles.createIndex({ title: "text", content: "text" })
```



