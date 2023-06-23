---
title: Add vector search
titleSuffix: Azure Cognitive Search
description: Create or update a search index to include vector fields.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 06/29/2023
---

# Add vector fields to a search index

In Azure Cognitive Search, vector data is represented in fields in a [search index](search-what-is-an-index.md). You can add vector fields to an existing index. You can use the push API to push content to the index.

## Prerequisites

+ Azure Cognitive Search. The service can be in any region and any tier except free. However, to run the last two queries, S1 or higher is required, with [semantic search enabled](semantic-search-overview.md#enable-semantic-search). The majority of existing services will support vector search. For a small subset of services created prior to January 2019, an index containing vector fields might fail on creation. In this situation, a new service must be created.

+ Pre-existing embeddings. Cognitive Search does not generate embeddings. We recommend Azure OpenAI but you can use any model for vectorization. Be sure to use the same model for both indexing and queries. At query time, you must include a step that converts the user's query into a vector.

## 1 - Prepare documents for indexing

TODO: TBD

## 2 - Add a vector field to the fields collection

TODO: TBD

## 3 - Load vectors for indexing

TODO: Add introduction sentence(s)
TODO: Add ordered list of procedure steps

## 4 - Check your index

TODO: Add introduction sentence(s)
TODO: Add ordered list of procedure steps

## Next steps

TODO: TBD