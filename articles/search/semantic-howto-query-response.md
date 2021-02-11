---
title: Structure a semantic response
titleSuffix: Azure Cognitive Search
description: Describes the semantic ranking algorithm in Cognitive Search and how to structure 'semantic answers' and 'semantic captions' from a result set.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/02/2021
---

# Semantic ranking and responses in Azure Cognitive Search

> [!IMPORTANT]
> The semantic ranking algorithm and semantic answers/captions are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes the semantic ranking algorithm and how a semantic response is shaped. You can specify semantic answers or captions in the query request to lift the most relevant answer or caption from each matching document.

<!-- ## Semantic ranking

TBD -->

## Understanding a semantic response

A semantic response includes new properties for answers, captions, and scoring. A semantic response is built from the standard response, using an initial set of results returned by the search engine, which are then re-ranked using the semantic ranker, and optionally restructured to include semantic answers or semantic captions.

As with all queries, a response is composed of all fields marked as "retrievable", or just those fields listed in "select".

The following example is representative of a semantic response.

```http
{ 
    "@search.answers": [ 
        { 
            "key": "a1234",                
            "text": "Turing was born in Maida Vale, London, while his father, Julius…", 
            "highlights": " Turing was born in <strong>Maida Vale, London</strong> , while his father, Julius…",", 
            "score": 0.87802511 
        } 
    ], 
    "value": [ 
        { 
            "@search.score": 51.64714, 
            "@search.rerankerScoresemanticScore": 1.9928148165345192, 
            "@search.captions": [ 
                { 
                    "text": " Alan Mathison Turing, (born June 23, 1912,  
                             London, England—died June 7, 1954…", 
                    "highlights": " Alan Mathison Turing, (born June 23, 1912, 
                             <strong/>London, England</strong>—died June…", 
                       } 
            ], 
            "id": "b5678", 
            "body":  "…" 
        }, 
        …   
    ] 
} 
```

## Next steps

+ [Semantic search overview](semantic-search-overview.md)
+ [Similarity algorithm](index-ranking-similarity.md)
+ [Create a semantic query](semantic-howto-query-request.md)
+ [Create a basic query](search-query-create.md)