---
title: Add spell check
titleSuffix: Azure Cognitive Search
description: Attach a spell check to query parsing, checking and correcting for common misspellings and typos on query inputs before executing the query.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/02/2021
---
# Add spell check to queries in Cognitive Search

> [!IMPORTANT]
> The speller option is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can improve recall by spell-correcting individual search query terms before they are parsed. The speller is supported for all query types (simple, full, and semantic).

| Parameter	| Value |
|-----------|-------|
| queryLanguage [required] | Valid values are "none" (default) or "en" or "en-us" |
| speller [required] | Valid values are "none" (default) or "lexicon" |

## Example request

The speller parameter is included in a query request, defined as [Search Documents (REST)](/rest/api/searchservice/preview-api/search-documents). This example is for a [semantic query](semantic-how-to-query-request.md) but you can add **`speller`** and **`queryLanguage`** to simple and full syntax queries as well.

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=2020-06-30     
{    
      "search": "wher can i find good coffe in sattle",    
      "queryType": "semantic",  
      "searchFields": "post-body,thread-summary",  
      "queryLanguage": "en-us",  
      "speller": "lexicon", 
      "answers": "extractive"   
} 
```

## Language considerations

The **`queryLanguage`** used for spell check is independent of the field-level language properties associated with analyzers in the index schema, but it is co-dependent with other properties used in a semantic search query. Neither simple queries or full-syntax queries have a **`queryLanguage`** property, but both **`"answers"`** and **`"captions"`** require it, and the value specified on the request must work for all of the properties it serves.

The speller applies to query terms the same way for all fields in the index, regardless of which lexical analyzer is configured on those fields. While content in a search index can be composed in multiple languages, the query input is most likely in one. It’s up to you to scope the query to the fields it applies to based on the language when the speller is enabled to avoid producing incorrect results. 

## Next steps

+ [Create a semantic query](semantic-how-to-query-request.md)
+ [Create a basic query](search-query-create.md)
+ [Use full Lucene query syntax](query-Lucene-syntax.md)
+ [Use simple query syntax](query-simple-syntax.md)
+ [Semantic search overview](semantic-search-overview.md)