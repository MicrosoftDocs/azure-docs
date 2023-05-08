---
title: How to install and use pgvector - Azure Cosmos DB for PostgreSQL
description: See how to review tenant stats metrics for Azure Cosmos DB for PostgreSQL
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: build-2023
ms.topic: how-to
ms.date: 05/09/2023
---

# How to install and use pgvector on Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The `pgvector` extension adds an open-source vector similarity search to PostgreSQL.

This article introduces us to additional capabilities onboarded with pgvector. It covers the concepts of vector similarity and embeddings, explains how to enable the pgvector extension, and demonstrates how to create, store and query vectors. We will look at the new datatype of storing, indexing and querying the embeddings at scale.

## Enable extension

To install the extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command from the psql tool to load the packaged objects into your database.

```postgresql
 SELECT create_extension('pgvector');
```

## Concepts
### Vector similarity

Vector similarity is a method used to measure how similar two items are by representing them as vectors, which are series of numbers. This approach can be applied to various types of data, such as words, images, or other elements. By using a mathematical model, each item is converted into a vector, and then these vectors are compared to determine their similarity. The closer the vectors are in terms of distance, the more alike the items.

### Embeddings

An embedding is a technique that transforms data, such as words, into vectors, enabling machine learning algorithms to efficiently process and analyze them. This transformation captures the relationships and similarities between data, allowing algorithms to identify patterns and make accurate predictions.

## Getting started

Create a table with vector column across 3 dimensions

```postgresql
CREATE TABLE vector 
    (
    id bigserial PRIMARY KEY
    , embedding vector(3)
    );
```

Insert vectors

```postgresql
INSERT INTO vector (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

Get the nearest neighbors by L2 distance

```postgresql
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```


> [!NOTE]
> `pgvector` introduces 3 new operators that can be used to calculate similarity:
> | **Operator** | **Description**            |
> |--------------|----------------------------|
> | <->          | Euclidean distance         |
> | <#>          | negative inner product     |
> | <=>          | cosine distance            |
>
> `<#>` returns the negative inner product since Postgres only supports ASC order index scans on operators