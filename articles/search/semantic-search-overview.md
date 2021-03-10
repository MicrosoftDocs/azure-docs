---
title: Semantic search
titleSuffix: Azure Cognitive Search
description: Learn how Cognitive Search is using deep learning semantic search models from Bing to make search results more intuitive.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/05/2021
ms.custom: references_regions
---
# Semantic search in Azure Cognitive Search

> [!IMPORTANT]
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Semantic search is a collection of query-related features that support a higher-quality, more natural query experience. Features include semantic reranking of search results, as well as captions and answers generation with semantic highlighting. The top 50 results returned from the [full text search engine](search-lucene-query-architecture.md) are reranked to find the most relevant matches.

The underlying technology is from Bing and Microsoft Research, and integrated into the Cognitive Search infrastructure. For more information about the research and AI investments backing semantic search, see [How AI from Bing is powering Azure Cognitive Search (Microsoft Research Blog)](https://www.microsoft.com/research/blog/the-science-behind-semantic-search-how-ai-from-bing-is-powering-azure-cognitive-search/).

To use semantic search in queries, you'll need to make small modifications to the search request, but no extra configuration or reindexing is required.

Public preview features include:

+ Semantic ranking model that uses the context or semantic meaning to compute a relevance score
+ Semantic captions that summarize key passages from a result for easy scanning
+ Semantic answers to the query, if the query is a question
+ Semantic highlights that bring focus to key phrases and terms
+ Spell check that corrects typos before the query terms reach the search engine

## Availability and pricing

Semantic ranking is available through [sign-up registration](https://aka.ms/SemanticSearchPreviewSignup), on search services created at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe. Spell correction is available in the same regions, but has no tier restrictions. If you have an existing service that meets tier and region criteria, only sign up is required.

Between preview launch on March 2 through April 1, spell correction and semantic ranking are offered free of charge. After April 1, the computational costs of running this functionality will become a billable event. The expected cost is about USD $500/month for 250,000 queries. You can find detailed cost information documented in the [Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/) and in [Estimate and manage costs](search-sku-manage-costs.md).

## Semantic search architecture

Components of semantic search are layered on top of the existing query execution pipeline. Spell correction (not shown in the diagram) improves recall by correcting typos in individual query terms. After parsing and analysis are completed, the search engine retrieves the documents that matched the query and scores them using the [default scoring algorithm](index-similarity-and-scoring.md#similarity-ranking-algorithms), either BM25 or classic, depending on when the service was created. Scoring profiles are also applied at this stage.

Having received the top 50 matches, the [semantic ranking model](semantic-how-to-query-response.md) re-evaluates the document corpus. Results can include more than 50 matches, but only the first 50 will be reranked. For ranking, the model uses both machine learning and transfer learning to re-score the documents based on how well each one matches the intent of the query.

To create captions and answers, semantic search uses language representation to extract and highlight key passages that best summarize a result. If the search query is a question, and answers are requested, the response will include a text passage that best answers the question, as expressed by the search query.

:::image type="content" source="media/semantic-search-overview/semantic-query-architecture.png" alt-text="Semantic components in a query pipeline" border="true":::

## Next steps

A new query type enables the relevance ranking and response structures of semantic search.

[Create a semantic query](semantic-how-to-query-request.md) to get started. Or, review either of the following articles for related information.

+ [Add spell check to query terms](speller-how-to-add.md)
+ [Semantic ranking and responses (answers and captions)](semantic-how-to-query-response.md)