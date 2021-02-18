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
---
# Semantic search in Azure Cognitive Search

> [!IMPORTANT]
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Semantic search is a collection of query-side features that bind deep neural network learning models to the query pipeline in Azure Cognitive Search. In this first iteration of semantic search functionality, results from the full text search engine can be re-ranked to produce more intuitive results.

The underlying technology is borrowed from Bing and Microsoft Research, and integrated into the Cognitive Search infrastructure. To use it, you'll need small modifications to query syntax, but no additional configuration or reindexing is required.

Public preview features include:

+ Semantic ranking
+ Semantic captions
+ Semantic answers

A new semantic query type enables the relevance ranking and response structures. [Create a semantic query](semantic-how-to-query-request.md) explains how to get started.

## Availability

Initially, semantic search is operational after [preview sign-up](https://aka.ms/TBD), on Standard tier search services that run in West US 2. The number of regions providing semantic search is expected to increase weekly. If you  

## Next steps

+ [Add spell check to query inputs](speller-how-to-add.md)
+ [Create a semantic query](semantic-how-to-query-request.md)
+ [Structure a semantic response](semantic-how-to-query-response.md)