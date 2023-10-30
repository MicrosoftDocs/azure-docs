---
title: Configure vectorizer
titleSuffix: Azure AI Search
description: Steps for adding a vectorizer to a search index in Azure AI Search. A vectorizer calls an embedding model that generates embeddings from text.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/30/2023
---

# Configure a vectorizor in a search index

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/2023-10-01-preview/skillsets/create-or-update) supports this feature.

A *vectorizer* is a component of a search index that specifies a vectorization agent, such as a deployed embedding model on Azure OpenAI, that converts text to vectors. You can define a vectorizer once, and then reference it in the vector profile assigned to a vector field.

The vectorizer that's assigned to a field is used during indexing and queries.

You can use the Azure portal (**Import and vectorize data** wizard), the [2023-10-01-Preview](/rest/api/searchservice/2023-10-01-preview/indexes/create-or-update) REST APIs, or any Azure beta SDK package that's been updated to provide this feature.

## Prerequisites

+ A deployed embedding model on Azure OpenAI, or a custom skill that wraps an embedding model.

## Define a vectorizer

1. Use [Create or Update Index](/rest/api/searchservice/2023-10-01-preview/indexes/create-or-update) to add a vectorizer.

1. Add the following JSON:

```json

```

## Assign a vectorizer

TBD

## Test a vectorizer


## See also

+ [Integrated vectorization (preview)](vector-search-integrated-vectorization.md)