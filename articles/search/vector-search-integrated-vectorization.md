---
title: Integrated vectorization
titleSuffix: Azure AI Search
description: Add a data chunking and embedding step in an Azure AI Search skillset to vectorize content during indexing.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/03/2023
---

# Integrated data chunking and embedding in Azure AI Search

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/2023-10-01-preview/skillsets/create-or-update) supports this feature.

*Integrated vectorization* adds data chunking and text-to-vector embedding to skills in indexer-based indexing, and text-to-vector conversions to queries. 

This capability is preview-only. In the generally available version of [vector search](vector-search-overview.md) and in previous preview versions, data chunking and vectorization rely on external components for chunking and vectors, and your application code must handle and coordinate each step. In this preview, chunking and vectors are streamlined through skills and indexers. You can set up a skillset that chunks data using the Text Split skill, and then call an embedding model using either the AzureOpenAIEmbedding skill or a custom skill. The same vectorizers used during indexing are also called during queries to convert text to vectors.

For indexing, integrated vectorization requires:

+ [An indexer](search-indexer-overview.md) retrieving data from a supported data source.
+ [A skillset](cognitive-search-working-with-skillsets.md)  that calls the [Text Split skill](cognitive-search-skill-textsplit.md) to chunk the data, and either [AzureOpenAIEmbedding skill](cognitive-search-skill-azure-openai-embedding.md) or a [custom skill](cognitive-search-custom-skill-web-api.md) to vectorize the data.
+ [One or more indexes](search-what-is-an-index.md) to receive the chunked and vectorized content.

For queries:

+ [A vectorizer](vector-search-how-to-configure-vectorizer.md) defined in the index schema, assigned to a vector field, and used automatically at query time to convert a text query to a vector.

Vector conversions are one-way: text-to-vector. There's no vector-to-text conversion for queries or results (for example, you can't convert a vector result to a human-readable string).

## Component diagram

The following diagram shows the components of integrated vectorization.

:::image type="content" source="media/vector-search-integrated-vectorization/integrated-vectorization-architecture.png" alt-text="Diagram of components in an integrated vectorization workflow." border="false" lightbox="media/vector-search-integrated-vectorization/integrated-vectorization-architecture.png":::

Here's a checklist of the components responsible for integrated vectorization:

+ An embedding model, deployed on Azure OpenAI or available through an HTTP endpoint.
+ A data source supported by indexers.
+ An index that specifies vector fields, and a vectorizer definition assigned to vector fields.
+ A skillset providing a Text Split skill for data chunking, and an AzureOpenAiEmbedding skill or a custom skill that points to the embedding model.
+ Index projections (also defined in a skillset) if you're using a secondary index for chunked data.
+ An indexer specifying a schedule, mappings, and properties for change detection.

This checklist focuses on integrated vectorization, but your solution isn't limited to this list. You can add more skills for AI enrichment, create a knowledge store, add semantic ranking, add relevance tuning, and other query features.

## Availability and pricing

Integrated vectorization availability is based on the embedding model. If you're using Azure OpenAI, check [regional availability]( https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=cognitive-services).

If you're using a custom skill and an Azure hosting mechanism (such as an Azure function app, Azure Web App, and Azure Kubernetes), check the [product by region page](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/) for feature availability. 

Data chunking (Text Split skill) is free and available on all Azure AI services in all regions.

> [!NOTE]
> Some older search services created before January 1, 2019 are deployed on infrastructure that doesn't support vector workloads. If you try to add a vector field to a schema and get an error, it's a result of outdated services. In this situation, you must create a new search service to try out the vector feature.

## What scenarios can integrated vectorization support?

+ Subdivide large documents into chunks, useful for vector and non-vector scenarios. For vectors, chunks help you meet the input constraints of embedding models. For non-vector scenarios, you might have a chat-style search app where GPT is assembling responses from indexed chunks. You can use vectorized or non-vectorized chunks for chat-style search.

+ Build a vector store where all of the fields are vector fields, and the document ID (required for a search index) is the only string field. Query the vector index to retrieve document IDs, and then send the document's vector fields to another model.

+ Combine vector and text fields for hybrid search, with or without semantic ranking. Integrated vectorization simplifies all of the [scenarios supported by vector search](vector-search-overview.md#what-scenarios-can-vector-search-support).

## When to use integrated vectorization

We recommend using the built-in vectorization support of Azure AI Studio. If this approach doesn't meet your needs, you can create indexers and skillsets that invoke integrated vectorization using the programmatic interfaces of Azure AI Search.

## How to use integrated vectorization

For those who already have vectors in a search index and only need text-to-vector conversion at query time:

1. [Add a vectorizer](vector-search-how-to-configure-vectorizer.md#define-a-vectorizer) to an index. It should be the same embedding model used to generate vectors in the index.
1. [Assign the vectorizer](vector-search-how-to-configure-vectorizer.md#assign-a-vector-profile-to-a-field) to the vector field.
1. [Formulate a vector query](vector-search-how-to-query.md#query-with-integrated-vectorization-preview) that specifies the text string to vectorize.

A more common scenario - data chunking and vectorization during indexing:

1. [Create a data source](search-howto-create-indexers.md#prepare-a-data-source) connection to a supported data source for indexer-based indexing.
1. [Create a skillset](cognitive-search-defining-skillset.md) that calls [Text Split skill](cognitive-search-skill-textsplit.md) for chunking and [AzureOpenAIEmbeddingModel](cognitive-search-skill-azure-openai-embedding.md) or a custom skill to vectorize the chunks.
1. [Create an index](search-how-to-create-search-index.md) that specifies a [vectorizer](vector-search-how-to-configure-vectorizer.md) for query time, and assign it to vector fields.
1. [Create an indexer](search-howto-create-indexers.md) to drive everything, from data retrieval, to skillset execution, through indexing.

Optionally, [create secondary indexes](index-projections-concept-intro.md) for advanced scenarios where chunked content is in one index, and non-chunked in another index. Chunked indexes (or secondary indexes) are useful for RAG apps.

> [!TIP]
> [Try the new **Import and vectorize data** wizard](search-get-started-portal-import-vectors.md) in the Azure portal to explore integrated vectorization before writing any code.
>
> Or, configure a Jupyter notebook to run the same workflow, cell by cell, to see how each step works.

## Limitations

+ [Customer-managed encryption keys](search-security-manage-encryption-keys.md) aren't currently supported.
+ [Shared private link connections](search-indexer-howto-access-private.md) to a vectorizer aren't currently supported.
+ Currently, there's no batching for integrated data chunking and vectorization.

## Benefits of integrated vectorization 

Here are some of the key benefits of the integrated vectorization: 

+ No separate data chunking and vectorization pipeline. Code is simpler to write and maintain.   

+ Automate indexing end-to-end. When data changes in the source (such as in Azure Storage, Azure SQL, or Cosmos DB), the indexer can move those updates through the entire pipeline, from retrieval, to document cracking, through optional AI-enrichment, data chunking, vectorization, and indexing.

+ Projecting chunked content to secondary indexes. Secondary indexes are created as you would any search index (a schema with fields and other constructs), but they're populated in tandem with a primary index by an indexer. Content from each source document flows to fields in primary and secondary indexes during the same indexing run. 

  Secondary indexes are intended for data chunking and Retrieval Augmented Generation (RAG) apps. Assuming a large PDF as a source document, the primary index might have basic information (title, date, author, description), and a secondary index has the chunks of content. Vectorization at the data chunk level makes it easier to find relevant information (each chunk is searchable) and return a relevant response, especially in a chat-style search app.

## Chunked indexes

Chunking is a process of dividing content into smaller manageable parts (chunks) that can be processed independently. Chunking is required if source documents are too large for the maximum input size of embedding or large language models, but you might find it gives you a better index structure for [RAG patterns](retrieval-augmented-generation-overview.md) and chat-style search.

The following diagram shows the components of chunked indexing.

:::image type="content" source="media/vector-search-integrated-vectorization/integrated-vectorization-chunked-indexes.png" alt-text="Diagram of chunking and vectorization workflow." border="false" lightbox="media/vector-search-integrated-vectorization/integrated-vectorization-chunked-indexes.png":::

## Next steps

+ [Configure a vectorizer in a search index](vector-search-how-to-configure-vectorizer.md)
+ [Configure index projections in a skillset](index-projections-concept-intro.md)
