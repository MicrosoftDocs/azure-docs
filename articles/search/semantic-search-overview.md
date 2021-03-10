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

Semantic search is a collection of query-related features that support a higher-quality, more natural query experience. 

Capabilities include semantic reranking of search results, as well as caption and answer extraction, with semantic highlighting over relevant terms and phrases. Sophisticated pretrained models are used for ranking and extraction. To maintain the fast performance that users expect from search, semantic ranking is applied to just the top 50 results returned from the [full text search engine](search-lucene-query-architecture.md), reranking those results to find the most relevant matches.

The underlying technology is from Bing and Microsoft Research, and integrated into the Cognitive Search infrastructure. For more information about the research and AI investments backing semantic search, see [How AI from Bing is powering Azure Cognitive Search (Microsoft Research Blog)](https://www.microsoft.com/research/blog/the-science-behind-semantic-search-how-ai-from-bing-is-powering-azure-cognitive-search/).

The following video provides an overview of the capabilities.

> [!VIDEO https://www.youtube.com/embed/v=yOf0WfVd_V0]

## Components of semantic search

+ [Semantic ranking](semantic-ranking.md) that uses the context or semantic meaning to compute a relevance score.

+ [Semantic queries](semantic-how-to-query-request.md) that return highlighted captions that summarize key passages from a result for easy scanning. Semantic captions are text passages relevant to the query extracted from the search results. They can help to summarize a result when individual content fields are too large for the results page. Captions feature semantic highlights, allowing users to quickly skim query results to find the most relevant documents thus improving overall user experience. 

+ [Semantic answers](semantic-answers.md) in the response that provide a direct answer to the query. Answers are extracted from text found in the most relevant match.

+ [Spell check](speller-how-to-add.md) that corrects typos before the query terms reach the search engine

To use semantic search in queries, you'll need to make small modifications to the search request, but no extra configuration or reindexing is required.

## Availability and pricing

Semantic capabilities are available through [sign-up registration](https://aka.ms/SemanticSearchPreviewSignup), on search services created at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe. 

Spell correction is available in the same regions, but has no tier restrictions. If you have an existing service that meets tier and region criteria, only sign up is required.

Between preview launch on March 2 through April 1, spell correction and semantic ranking are offered free of charge. After April 1, the computational costs of running this functionality will become a billable event. The expected cost is about USD $500/month for 250,000 queries. You can find detailed cost information documented in the [Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/) and in [Estimate and manage costs](search-sku-manage-costs.md).

## Next steps

A new query type enables the relevance ranking and response structures of semantic search.

[Create a semantic query](semantic-how-to-query-request.md) to get started. Or, review either of the following articles for related information.

+ [Add spell check to query terms](speller-how-to-add.md)
+ [Semantic ranking and answers](semantic-answers.md)