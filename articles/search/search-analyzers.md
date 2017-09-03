---
title: Analyzers in Azure Search | Microsoft Docs
description: Assign analyzers to searchable text fields in an index to replace default standard Lucene with custom, predefined or language-specific alternatives.
services: search
manager: jhubbard
author: HeidiSteen
documentationcenter: ''

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 09/03/2017
ms.author: heidist
---

# Analyzers in Azure Search

An *analyzer* is a component of [full text search processing](search-lucene-query-architecture.md) responsible for text-to-token conversions for both indexing and query workloads. During indexing, an analyzer transforms text into tokenized terms, which are written to the index. At query time, an analyzer performs the same transformations (text into tokenized terms), but this time for read operations during queries. 

The following transformations are typical during analysis:

+ Non-essential stopwords words are discarded.
+ Phrases and hyphenated terms are broken down into component parts.
+ Terms are lower-cased.
+ Words are reduced to root forms so that a match can be found regardless of tense.

Azure Search provides a default analyzer. You can override it on a field-by-field basis with alternative choices. The purpose of this article is to describe the range of choices and provide best practices for adding an analyzer to your search operations.

## How analysis fits into full text search processing

Analyzers operate on term inputs passed in by the query parser, and return analyzed terms that are added to a query tree object.

 ![Lucene query architecture diagram in Azure Search][1]

Analyzers are used only on a single term query or a phrase query. Analyzer are not used for query types with incomplete terms – prefix query, wildcard query, regex query – or on fuzzy queries. For those query types, terms are added directly to the query tree, bypassing the analysis stage. The only transformation performed on query terms of those types is lowercasing.

## Supported analyzers

The following list describes which analyzers are supported in Azure Search.

| Category | Description |
|----------|-------------|
| [Standard Lucene analyzer](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/standard/StandardAnalyzer.html) | Default. Used automatically for indexing and queries. No specification or configuration is required. This general purpose analyzers performs well for most languages and scenarios.|
| Predefined analyzers | Offered as a finished product to be used as-is with no configuration or customization allowed. <br/>There are two types:<br/><br/>Specialized (language agnostic) for specific challenges or edge cases requiring a solution. The collection of analyzers include the following: <br/>[Asciifolding](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/miscellaneous/ASCIIFoldingFilter.html), <br/>[Keyword](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/core/KeywordAnalyzer.html), <br/>[Pattern](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/miscellaneous/PatternAnalyzer.html), <br/>[Simple](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/core/SimpleAnalyzer.html), <br/>[Stop](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/core/StopAnalyzer.html), <br/>[Whitespace](https://lucene.apache.org/core/4_0_0/analyzers-common/org/apache/lucene/analysis/core/WhitespaceAnalyzer.html).<br/><br/>[Language analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support) provide rich linguistic support for individual languages. Azure Search supports 35 Lucene language analyzers and 50 Microsoft natural language processing analyzers. |
|[Custom analyzers](https://docs.microsoft.com/rest/api/searchservice/Custom-analyzers-in-Azure-Search) | A user-defined configuration of a combination of existing elements, consisting of one tokenizer (required) and optional filters (char or token).|

## How to specify analyzer

To use a predefined analyzer, set the `analyzer` property to the name of a target analyzer on a [field definition in the index](https://docs.microsoft.com/rest/api/searchservice/create-index).

To use a custom analyzer, first create an `analyzer definition` in the index with a specific configuration: one tokenizer and optional filters. Next, set the `analyzer` property to the custom analyzer you defined. 

Rebuild the index to invoke the new analysis.

## Best practices

This section provides advice on how to work with analyzers more efficiently.

### One analyzer for read-write unless you need specific behaviors

Azure Search lets you specify different analyzers for indexing and search via additional `indexAnalyzer` and `searchAnalyzer` field parameters. If unspecified, the analyzer set with the `analyzer` property is used for both indexing and searching. 

A general rule is to use the same analyzer for both, unless specific requirements dictate otherwise. Typically, its desirable if the analyzer creating the token is the same one used to find tokens later during query time. 

### Test during active development

Overriding the standard analyzer requires an index rebuild. If possible, decide on which analyzers to use during active development, before rolling an index into production.

### Compare analyzers side-by-side

We recommend using the [Analyze API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer). The response consists of tokenized terms, as generated by a specific analyzer for text you provide. 

> [!Tip]
> The [Search Analyzer Demo](http://alice.unearth.ai/) shows a side-by-side comparison of the standard Lucene analyzer, Lucene's English language analyzer, and Microsoft's English natural language processor. For each search input you provide, results from each analyzer are displayed in adjacent panes.

## Next steps

+ Review our comprehensive explanation of [how full text search works in Azure Search](search-lucene-query-architecture.md). This article uses examples to explain behaviors that are somewhat counter-intuitive on the surface. 

+ Try additional query syntax from the [Search Documents](https://docs.microsoft.com/rest/api/searchservice/search-documents#examples) example section or from [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) in Search explorer in the portal.

+ Learn how to apply [language-specific lexical analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support).

+ [Configure custom analyzers](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search) for either minimal processing or specialized processing on individual fields.

+ [Compare standard and English analyzers](http://alice.unearth.ai/) side-by-side on this demo web site. 

## See also

 [Search Documents REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents) 
 [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) 
 [Full Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) 
 [Handle search results](https://docs.microsoft.com/azure/search/search-pagination-page-layout)

<!--Image references-->
[1]: ./media/search-lucene-query-architecture/architecture-diagram2.png
