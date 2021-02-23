---
title: Semantic search
titleSuffix: Azure Cognitive Search
description: Learn how Cognitive Search is using deep learning semantic search models from Bing to make search results more intuitive.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/02/2021
ms.custom: references_regions
---
# Semantic search in Azure Cognitive Search

> [!IMPORTANT]
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Semantic search is a collection of query-side features that bind semantic ranking and extraction to the query pipeline in Azure Cognitive Search to create a more natural query experience. The top 50 results from the [full text search engine](search-lucene-query-architecture.md) can be re-ranked to find the most intuitive matches. 

The underlying technology leverages the investments from Bing and Microsoft Research, and is integrated into the Cognitive Search infrastructure. To use it, you'll need small modifications to query syntax, but no additional configuration or reindexing is required.

Public preview features include:

+ Semantic ranking algorithm that looks for cues in the content to determine relevance
+ Semantic captions that highlight relevant passages
+ Semantic answers to the query, also formulated from results
+ Spell correction that catches typos before the string reaches the query parser

## Semantic search architecture

Components of semantic search attach to the existing query pipeline. Spell correction (not shown in the diagram) improves recall by correcting typos in individual query terms as they pass through the query pipeline. After all parsing and analysis are complete, the search engine scans for matches, using any scoring logic that you have provided. As expected, the engine returns the top 50 matching documents, where top matches are determined by the [similarity ranking algorithm](index-similarity-and-scoring.md#similarity-ranking-algorithms) and any scoring profiles you have defined. If more than 50 are specified, the additional results are returned, but they won’t be semantically re-ranked. Either the classic or BM25 similarity ranking can be used to compute the initial results.

Having received the top 50 matches, the [semantic ranking algorithm](semantic-how-to-query-response.md) re-evaluates the document corpus and uses machine learning and transfer learning to re-score the documents based on how well each one matches the intent of the query. The algorithm then uses language representation to structure responses to include "captions" that highlight which passages in the document provide the best summary, and optionally, "answers" to the query itself.

:::image type="content" source="media/semantic-search-overview/semantic-query-architecture.png" alt-text="Semantic components in a query pipeline" border="true":::

## Availability and pricing

Semantic ranking is available through [sign-up registration](https://aka.ms/SemanticSearchPreviewSignup), on search services created at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe. Spell correction is available in the same regions, but has no tier restrictions.

Between preview launch on March 2 through April 1, spell correction and semantic ranking are offered free of charge. After April 1, the computational costs of running this functionality will become a billable event. The expected cost is about USD $500/month for 250,000 queries. You can find detailed cost information documented in the [Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/) and in [Estimate and manage costs](search-sku-manage-costs.md).

## Next steps

A new query type enables the relevance ranking and response structures of semantic search. [Create a semantic query](semantic-how-to-query-request.md) to get started. Or, review either of the following articles for related information.

+ [Add spell check to query inputs](speller-how-to-add.md)
+ [Semantic algorithms and structuring a semantic response](semantic-how-to-query-response.md)