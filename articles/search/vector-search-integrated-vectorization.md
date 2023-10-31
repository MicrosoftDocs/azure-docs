---
title: Integrated vectorization
titleSuffix: Azure AI Search
description: Add a data chunking and embedding step in an Azure AI Search skillset to vectorize content during indexing.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/30/2023
---

# Integrated data chunking and embedding in Azure AI Search

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [2023-10-01-Preview REST API](/rest/api/searchservice/2023-10-01-preview/skillsets/create-or-update) supports this feature.

In this preview, integrated vectorization adds data chunking and text-to-vector embedding to indexing, and text-to-vector conversions to queries. 

In the generally available version of vector search and in previous preview versions, data chunking and vectorization required calls to external components and coordination of each handoff, in a chain of operations from retrieval, to chunking, to embedding, to indexing. In this preview, you can streamline these steps using skills and indexers. You can set up a skillset that chunks data using the Text Split skill, and then call an embedding model using either the AzureOpenAIEmbedding skill or a custom skill. 

Integrated vectorization works for vector and hybrid queries also. At query time, you can specify vectorizers to convert a text query to its vector equivalent by specifying which embedding model to use.

For indexing, integrated vectorization requires:

+ [An indexer](search-indexer-overview.md) retrieving data from a supported data source.
+ [A skillset](cognitive-search-working-with-skillsets.md)  that calls the [Text Split skill](cognitive-search-skill-textsplit.md) to chunk the data, and either [AzureOpenAIEmbedding skill](cognitive-search-skill-azure-openai-embedding.md) or a [custom skill](cognitive-search-custom-skill-web-api.md) to vectorize the data.
+ [One or more indexes](search-what-is-an-index.md) to receive the chunked and vectorized content.

For queries:

+ [A vectorizer]() defined in the index schema, assigned to a vector field, and used automatically at query time to convert a text query to a vector.

Vector conversions are one-way: text-to-vector. There's no vector-to-text conversion for queries or results (for example, you can't convert a vector result to a human-readable string).

## Component diagram

The following diagram shows the components of integrated vectorization.

:::image type="content" source="media/vector-search-integrated-vectorization/integrated-vectorization-architecture.png" alt-text="Diagram of components in an integrated vectorization workflow." border="false" lightbox="media/vector-search-integrated-vectorization/integrated-vectorization-architecture.png":::

Integrated vectorization uses capabiltiies inside and outside of Azure AI Search.

Outside of Azure AI Search, you need:

+ An embedding model, deployed on Azure OpenAI or available through an HTTP endpoint.
+ A data source supported by indexers.

On Azure AI Search, you need:

+ One or more indexes specifying:
  + Vector fields.
  + A vectorizer definition, assigned to vector fields.
+ A skillset specifying:
  + A Text Split skill for data chunking
  + An AzureOpenAiEmbedding skill or a custom skill that points to the embedding model.
  + Index projections if you're using a secondary index for chunked data.
+ An indexer specifying:
  + Scheduled indexing (optional)
  + Properties for field mappings and output field mappings

## Availability and pricing

Integrated vectorization availability is based on the embedding model. If you're using Azure OpenAI, check [regional availability]( https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=cognitive-services).

If you're using a custom skill and Azure hosting mechanism (such as an Azure function app, Azure Web App, and Azure Kubernetes), check the product by region page. 

Data chunking (Text Split skill) is free and available on all Azure AI services in all regions.

> [!NOTE]
> Some older search services created before January 1, 2019 are deployed on infrastructure that doesn't support vector workloads. If you try to add a vector field to a schema and get an error, it's a result of outdated services. In this situation, you must create a new search service to try out the vector feature.

## What scenarios can integrated vectorization support?

+ Subdivide large documents into chunks, useful for vector and non-vector scenarios. For vectors, chunks help you meet the input constraints of embedding models. For non-vector scenarios, you might have a chat-style search app where GPT is assembling responses from indexed chunks. You can use vectorized or non-vectorized chunks for chat-style search.

+ Build a vector store where all of the fields are vector fields, and the document ID (required for a search index) is the only string field. Query the vector index to retrieve document IDs, and then send the document's vector fields to another model.

+ Combine vector and text fields for hybrid search, with or without semantic ranking. Integrated vectorization simplifies all of the [scenarios supported by vector search](vector-search-overview.md#what-scenarios-can-vector-search-support).

## When to use integrated vectorization

We recommend using the built-in vectorization support of Azure AI Studio. If this approach doesn't meet your needs, you can create indexers and skillsets that invoke integrated vectorization using the programmatic interfaces of Azure AI Search.

## Benefits of integrated vectorization 

Here are some of the key benefits of the integrated vectorization: 

+ Streamlined maintenance: No separate data chunking and vectorization pipeline, thereby reducing overhead and simplifying data maintenance.  

+ Up-to-date results: Indexers automate indexing end-to-end. When data changes in the source (such as in Azure Storage, Azure SQL, or Cosmos DB), the indexer can move those updates through the entire pipeline, from retrieval, to document cracking, optional AI-enrichment, data chunking, vectorization, and indexing.

+ Project or redirect chunked content to secondary indexes. Secondary indexes are created as you would any search index (a schema with fields and other constructs), but they're populated in tandem with a primary index by an indexer. Content from each source document flows to fields in primary and secondary indexes during the same indexing run. 

  Secondary indexes are intended for data chunking and Retrieval Augmented Generation (RAG) apps. Assuming a large PDF as a source document, the primary index might have basic information (title, date, author, description), and a secondary index has the chunks of content. Vectorization at the data chunk level makes it easier to find relevant information (each chunk is searchable) and return a relevant response, especially in a chat-style search app.

## Chunked indexes

Chunking is a process of dividing content into smaller manageable parts (chunks) that can be processed independently. Chunking is required if source documents are too large for the maximum input size of embedding or large language models, but you might find it gives you a better index structure for [RAG patterns](retrieval-augmented-generation-overview.md) and chat-style search.

The following diagram shows the components of chunked indexing.

:::image type="content" source="media/vector-search-integrated-vectorization/integrated-vectorization-chunked-indexes.png" alt-text="Diagram of chunking and vectorization workflow." border="false" lightbox="media/vector-search-integrated-vectorization/integrated-vectorization-chunked-indexes.png":::

## Next steps

+ [Configure a vectorizer in a search index](vector-search-how-to-configure-vectorizer.md)
+ [Configure index projections in a skillset](index-projections-concept-intro.md)
