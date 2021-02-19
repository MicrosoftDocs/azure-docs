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

Semantic search is a collection of query-side features that bind deep neural network learning models to the query pipeline in Azure Cognitive Search. In this first iteration of semantic search functionality, the top 50 results from the [full text search engine](search-lucene-query-architecture.md) can be re-ranked to find the most intuitive matches.

The underlying technology is borrowed from Bing and Microsoft Research, and integrated into the Cognitive Search infrastructure. To use it, you'll need small modifications to query syntax, but no additional configuration or reindexing is required.

Public preview features include:

+ Semantic ranking algorithm that looks for cues in the content to determine relevance
+ Semantic captions that highlight relevant passages
+ Semantic answers to the query, also formulated from results
+ Spell correction that catches typos before the string reaches the query parser

## Semantic search architecture

Components of semantic search attach to the existing query pipeline. Spell correction improves precision by correcting typos in strings before the full text search engine starts to scan for matches. The search engine scans for matches, using any scoring logic that you have provided. As expected, it returns the top 50 matching documents, as determined by the [similarity ranking algorithm](index-similarity-and-scoring.md#similarity-ranking-algorithms).

Given the top 50 matches, the [semantic ranking algorithm](semantic-how-to-query-response.md) re-evaluates each document using language models and transfer learning, and re-scores each one based on how well it matches the intent of the query. It also structures the response to include captions that put focus on which passages in the document provide the best summary.

:::image type="content" source="media/semantic-search-overview/semantic-query-architecture-3.png" alt-text="Semantic components in a query pipeline" border="true":::

## Availability and pricing

Spell correction is available in the same regions as semantic ranking, at no extra charge.

Semantic ranking and responses are available through [sign-up registration](https://aka.ms/SemanticSearchPreviewSignup), on search services created at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe.

Between preview launch on March 2 and April 2, semantic search is offered free of charge. After April 2, the computational costs of semantic search will become a billable event. Once billing details are finalized, you'll find cost information documented in the [Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/) and in [Estimate and manage costs](search-sku-manage-costs.md).

## Next steps

A new query type enables the relevance ranking and response structures of semantic search. [Create a semantic query](semantic-how-to-query-request.md) explains how to get started. Or, review either of the following articles for related information.

+ [Add spell check to query inputs](speller-how-to-add.md)
+ [Structure a semantic response](semantic-how-to-query-response.md)