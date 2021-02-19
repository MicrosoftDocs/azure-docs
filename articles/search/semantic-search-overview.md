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

Semantic search is a collection of query-side features that bind deep neural network learning models to the query pipeline in Azure Cognitive Search. In this first iteration of semantic search functionality, results from the full text search engine can be re-ranked to find the most intuitive matches.

The underlying technology is borrowed from Bing and Microsoft Research, and integrated into the Cognitive Search infrastructure. To use it, you'll need small modifications to query syntax, but no additional configuration or reindexing is required.

Public preview features include:

+ Semantic ranking algorithm that looks for cues in the content to determine relevance
+ Semantic captions that highlight relevant passages
+ Semantic answers to the query, also formulated from results
+ Spell correction that catches typos before the string reaches the query parser

## Availability and pricing

Semantic search is available through [sign-up registration](https://aka.ms/SemanticSearchPreviewSignup), on search services created at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe.

Between preview launch on March 2 and April 2, there is no charge for semantic search. After April 2, the computational costs of semantic search will become a billable event. Once billing details are finalized, you'll find cost information documented in the [Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/) and in [Estimate and manage costs](search-sku-manage-costs.md).

## Next steps

A new query type enables the relevance ranking and response structures of semantic search. [Create a semantic query](semantic-how-to-query-request.md) explains how to get started. Or, review either of the following articles for related information.

+ [Add spell check to query inputs](speller-how-to-add.md)
+ [Structure a semantic response](semantic-how-to-query-response.md)