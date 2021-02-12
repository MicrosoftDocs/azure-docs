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

Semantic search is a collection of query-side features that bring Bing's deep neural network learning models to the query pipeline. Results from the full text search engine can be ranked, analyzed, and structured using Bing's AI to produce more intuitive results. Bing integration is built-into the search infrastructure. To use it, you'll need small modifications to query syntax, but otherwise no configuration is required to use it. Semantic search consists of these features:

+ Semantic ranking
+ Semantic captions
+ Semantic answers

All new parameters can be specified at query time, on existing indexes.

## Sign up for access

Sign up for the semantic search preview by filling out [this form](https://aka.ms/azure-cognitive-search/indexer-preview). You will receive a confirmation email once you have been accepted into the preview.

## Next steps

+ [Add spell check to query inputs](speller-how-to-add.md)
+ [Create a semantic query](semantic-how-to-query-request.md)
+ [Structure a semantic response](semantic-how-to-query-response.md)