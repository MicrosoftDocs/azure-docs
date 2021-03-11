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
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During the initial preview launch, there is no charge for semantic search. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic search is a collection of query-related features that support a higher-quality, more natural query experience. 

These capabilities include a semantic reranking of search results, as well as caption and answer extraction, with semantic highlighting over relevant terms and phrases. State-of-the-art pretrained models are used for ranking and extraction. To maintain the fast performance that users expect from search, semantic ranking is applied to just the top 50 results, as scored by the [default similarity scoring algorithm](index-similarity-and-scoring.md#similarity-ranking-algorithms). Using those results as the document corpus, semantic ranking re-scores those results based on the semantic strength of the match.

The underlying technology is from Bing and Microsoft Research, and integrated into the Cognitive Search infrastructure as an add-on feature. For more information about the research and AI investments backing semantic search, see [How AI from Bing is powering Azure Cognitive Search (Microsoft Research Blog)](https://www.microsoft.com/research/blog/the-science-behind-semantic-search-how-ai-from-bing-is-powering-azure-cognitive-search/).

The following video provides an overview of the capabilities.

> [!VIDEO https://www.youtube.com/embed/yOf0WfVd_V0]

## Components and workflow

Semantic search improves precision and recall with the addition of these capabilities:

+ [Spell check](speller-how-to-add.md) corrects typos before the query terms reach the search engine. 

+ [Semantic re-ranking](semantic-ranking.md) uses the context or semantic meaning to compute a new relevance score.

+ [Semantic queries](semantic-how-to-query-request.md) invoke semantic ranking, and return highlighted captions that summarize key passages from a result for easy scanning.

  *Semantic captions* are text passages relevant to the query. They can help to summarize a result when individual content fields are too large or cumbersome for the results page. *Semantic highlights* add styles to the most relevant terms and phrases, allowing users to quickly skim query results to learn why a match was considered relevant.

+ [Semantic answers](semantic-answers.md) is an optional and additional substructure returned from a semantic query. It provides a direct answer to a query that looks like a question.

### Order of operations

Components of semantic search extend the existing query execution pipeline in both directions. If you enable spelling correction, the [speller](speller-how-to-add.md) corrects typos at the outset, before the query terms reach the search engine.

:::image type="content" source="media/semantic-search-overview/semantic-workflow.png" alt-text="Semantic components in query execution" border="true":::

Query execution proceeds as usual, with term parsing, analysis, and scans over the inverted indexes. The engine retrieves documents using token matching, and scores the results using the [default similarity scoring algorithm](index-similarity-and-scoring.md#similarity-ranking-algorithms). Scores are calculated based on the degree of linguistic similarity between query terms and matching terms in the index. If you defined them, scoring profiles are also applied at this stage. Results are then passed to the semantic search subsystem.

In the preparation step, the document corpus returned from the initial result set is analyzed at the sentence and paragraph level to find semantic and conceptual similarity among terms provided in the query. In contrast with keyword search, this step uses machine reading and comprehension to evaluate the content.

Results are then re-scored based on the conceptual similarity of query terms. As part of result composition, a semantic query returns captions and answers. To formulate them, semantic search uses language representation to extract and highlight key passages that best summarize a result. If the search query is a question - and answers are requested - the response will include a text passage that best answers the question, as expressed by the search query.

To use semantic capabilities in queries, you'll need to make small modifications to the search request, but no extra configuration or reindexing is required.

## Availability and pricing

Semantic capabilities are available through [sign-up registration](https://aka.ms/SemanticSearchPreviewSignup), on search services created at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe. 

Spell correction is available in the same regions, but has no tier restrictions. If you have an existing service that meets tier and region criteria, only sign up is required.

Between preview launch on March 2 through April 1, spell correction and semantic ranking are offered free of charge. After April 1, the computational costs of running this functionality will become a billable event. The expected cost is about USD $500/month for 250,000 queries. You can find detailed cost information documented in the [Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/) and in [Estimate and manage costs](search-sku-manage-costs.md).

## Next steps

A new query type enables the relevance ranking and response structures of semantic search.

[Create a semantic query](semantic-how-to-query-request.md) to get started. Or, review the following articles for related information.

+ [Add spell check to query terms](speller-how-to-add.md)
+ [Return a semantic answers](semantic-answers.md)
+ [Semantic ranking](semantic-ranking.md)