---
title: Semantic search
titleSuffix: Azure Cognitive Search
description: Learn how Cognitive Search is using deep learning semantic search models from Bing to make search results more intuitive.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/22/2023
ms.custom: references_regions
---

# Semantic search in Azure Cognitive Search

> [!IMPORTANT]
> Semantic search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and beta SDKs. These features are billable (see [Availability and pricing](semantic-search-overview.md#availability-and-pricing)).

In Azure Cognitive Search, "semantic search" measurably improves search relevance by using language understanding to rerank an initial search result. This article is a high-level introduction to semantic reranking. The [embedded video](#how-semantic-ranking-works) describes the technology, and the section at the end covers availability and pricing.

Semantic search is a premium feature that's billed by usage. We recommend this article for background, but if you'd rather get started, follow these steps:

> [!div class="checklist"]
> * [Check regional and service tier requirements](#availability-and-pricing).
> * [Enable semantic search for semantic ranking](semantic-how-to-enable-disable.md) on your search service.
> * Create or modify queries to [return semantic captions and highlights](semantic-how-to-query-request.md).
> * Add a few more query properties to also [return semantic answers](semantic-answers.md).

> [!NOTE]
> Looking for vector support and similarity search? See [Vector search in Azure Cognitive Search](vector-search-overview.md) for details.

## What is semantic search?

Semantic search is a collection of query-related capabilities that improve the quality of an initial BM25-ranked search result for text-based queries. When you enable it on your search service, semantic search extends the query execution pipeline in two ways: 

* First, it adds secondary ranking over an initial result set that was scored using the BM25 algorithm, promoting the most semantically relevant results to the top of the list. 

* Second, it extracts and returns captions and answers in the response, which you can render on a search page to improve the user's search experience.

Although semantic search and vector search are closely related, this particular feature in Cognitive Search doesn't perform similarity search.

| Feature | Description |
|---------|-------------|
| [Semantic re-ranking](semantic-ranking.md) | Uses the context or semantic meaning of a query to compute a new relevance score over existing results. |
| [Semantic captions and highlights](semantic-how-to-query-request.md) | Extracts verbatim sentences and phrases from a document that best summarize the content, with highlights over key passages for easy scanning. Captions that summarize a result are useful when individual content fields are too dense for the search results page. Highlighted text elevates the most relevant terms and phrases so that users can quickly determine why a match was considered relevant. |
| [Semantic answers](semantic-answers.md) | An optional and extra substructure returned from a semantic query. It provides a direct answer to a query that looks like a question. It requires that a document has text with the characteristics of an answer. |

## How semantic ranking works

*Semantic ranking* looks for context and relatedness among terms, elevating matches that make more sense for the query. Language understanding finds summarizations or *captions* and *answers* within your content and includes them in the response, which can then be rendered on a search results page for a more productive search experience.

State-of-the-art pretrained models are used for summarization and ranking. To maintain the fast performance that users expect from search, semantic summarization and ranking are applied to just the top 50 results, as scored by the [default scoring algorithm](index-similarity-and-scoring.md). Semantic ranking re-scores those results based on the semantic strength of the match.

The underlying technology is from Bing and Microsoft Research, and integrated into the Cognitive Search infrastructure as an add-on feature. For more information about the research and AI investments backing semantic search, see [How AI from Bing is powering Azure Cognitive Search (Microsoft Research Blog)](https://www.microsoft.com/research/blog/the-science-behind-semantic-search-how-ai-from-bing-is-powering-azure-cognitive-search/).

The following video provides an overview of the capabilities.

> [!VIDEO https://www.youtube.com/embed/yOf0WfVd_V0]

### Order of operations

Components of semantic search extend the existing query execution pipeline in both directions. If you enable spelling correction, the [speller](speller-how-to-add.md) corrects typos at query onset, before terms reach the search engine.

:::image type="content" source="media/semantic-search-overview/semantic-workflow.png" alt-text="Semantic components in query execution" border="true":::

Query execution proceeds as usual, with term parsing, analysis, and scans over the inverted indexes. The engine retrieves documents using token matching, and scores the results using the [default scoring algorithm](index-similarity-and-scoring.md). Scores are calculated based on the degree of linguistic similarity between query terms and matching terms in the index. If you defined them, scoring profiles are also applied at this stage. Results are then passed to the semantic search subsystem.

In the preparation step, the document corpus returned from the initial result set is analyzed at the sentence and paragraph level to find passages that summarize each document. In contrast with keyword search, this step uses machine reading and comprehension to evaluate the content. Through this stage of content processing, a semantic query returns [captions](semantic-how-to-query-request.md) and [answers](semantic-answers.md). To formulate them, semantic search uses language representation to extract and highlight key passages that best summarize a result. If the search query is a question - and answers are requested - the response includes a text passage that best answers the question, as expressed by the search query. 

For both captions and answers, existing text is used in the formulation. The semantic models don't compose new sentences or phrases from the available content, nor does it apply logic to arrive at new conclusions. In short, the system will never return content that doesn't already exist.

Results are then re-scored based on the [conceptual similarity](semantic-ranking.md) of query terms.

To use semantic capabilities in queries, you make small modifications to the [search request](semantic-how-to-query-request.md). No extra configuration or reindexing is required.

## Semantic capabilities and limitations

Semantic search is a newer technology so it's important to set expectations about what it can and can't do. What it can do:

* Promote matches that are semantically closer to the intent of original query.

* Find and extract strings in each result to use as captions and answers. Captions and answers are returned in the response and can be rendered on a search results page.

What it can't do is rerun the query over the entire corpus to find semantically relevant results. Semantic search re-ranks the *existing* result set, consisting of the top 50 results as scored by the default ranking algorithm. Furthermore, semantic search can't create new information or strings. Captions and answers are extracted verbatim from your content so if the results don't include answer-like text, the language models won't produce one.

Although semantic search isn't beneficial in every scenario, certain content can benefit significantly from its capabilities. The language models in semantic search work best on searchable content that is information-rich and structured as prose. A knowledge base, online documentation, or documents that contain descriptive content see the most gains from semantic search capabilities.

## Availability and pricing

Semantic search and spell check are available on services that meet the criteria in the following table. To use semantic search, your first need to [enable the capabilities](semantic-how-to-enable-disable.md) on your search service.

| Feature | Tier | Region | Sign up | Pricing |
|---------|------|--------|---------|---------|
| Semantic search | Basic and higher | [Region availability](https://azure.microsoft.com/global-infrastructure/services/?products=search)| Required | [Pricing](https://azure.microsoft.com/pricing/details/search/) <sup>1</sup>|
| Spell check | Basic <sup>2</sup> and higher  | All | None | None (free) |

<sup>1</sup> On the pricing page, scroll down to view more features that are billed separately. At lower query volumes (under 1000 monthly), semantic search is free. To exceed that limit, you can opt in to the semantic search standard pricing plan. The pricing page shows you the semantic query billing rate for different currencies and intervals.

<sup>2</sup> Due to the provisioning mechanisms and lifespan of shared (free) search services, a few services happen to have spell check on the free tier. However, spell check availability on free tier services isn't guaranteed and shouldn't be expected.

Charges for semantic search are levied when query requests include "queryType=semantic" and the search string isn't empty (for example, "search=pet friendly hotels in New York"). If your search string is empty ("search=*"), you aren't charged, even if the queryType is set to "semantic".

## Next steps

[Enable semantic search](semantic-how-to-enable-disable.md) for your search service and follow the steps in [Configure semantic ranking](semantic-how-to-query-request.md) so that you can test out semantic search on your content.
