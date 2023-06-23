---
title: Query vectors in a search index
titleSuffix: Azure Cognitive Search
description: Build queries for vector-only fields and hybrid search scenarios that combine vectors with semantic and standard search syntax.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 06/29/2023
---

# Query vectors in a search index

In Azure Cognitive Search, vector data is represented in fields in a [search index](search-what-is-an-index.md). If you have added vector fields to a search index, this article explains steps for queries, including a summation of how to combine vector search with full text search and semantic search for hybrid scenarios.

## Prerequisites

+ Azure Cognitive Search. For vector indexing and queries, the service can be in any region and any tier except free. Use an S1 or higher tier if you want to combine vector search with [semantic search](semantic-search-overview.md). The majority of existing services will support vector search. For a small subset of services created prior to 2019/01/01, an index containing vector fields might on creation. In this situation, a new service must be created.

+ Pre-existing embeddings. Cognitive Search does not generate embeddings. We recommend Azure OpenAI but you can use any model for vectorization. Be sure to use the same model for both indexing and queries. At query time, you must include a step that converts the user's query into a vector.

## 1 - Check an index for vector fields

TODO: TBD

## 2 - Convert query input into a vector

TODO: TBD

## 3 - Query syntax for vector-only search

TODO: Add introduction sentence(s)
TODO: Add ordered list of procedure steps

## 4 - Query syntax for hybrid search

TODO: Add introduction sentence(s)
TODO: Add ordered list of procedure steps

## Next steps

TODO: TBD