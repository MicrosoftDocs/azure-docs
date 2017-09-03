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

An *analyzer* is a component of [full text search processing](search-lucene-query-architecture.md) responsible for text-to-token conversions for both indexing and query workloads. During indexing, an analyzer transforms text into tokenized terms, which are written to the index. At query time, an analyzer performs the same transformations (text into tokenized terms), but this time for an index read by the query engine. 

The following transformations are typical of lexical analysis:

+ Non-essential stopwords words are discarded.
+ Phrases and hyphenated terms are broken down into component parts.
+ Terms are lower-cased.
+ Words are reduced to root forms so that a match can be found regardless of whether a singular or plural form is provided.

Azure Search provides a default analyzer, which you can override on a field-by-field basis with alternative choices. The purpose of this article is to explain the range of available choices and provide best practices for adding an analyzer to your search operations.

Although you can specify different analyzers on the same field for indexing and query operations, the common case is to use the same anlayzer for both. As such, the analyzer creating the token is the same one that finds the token later during query time. 

## How analysis fits into full text search processing

Analyzers operate on term inputs passed in by the query parser, and return analyzed terms that are added to a query tree object.

 ![Lucene query architecture diagram in Azure Search][1]

## Supported analyzers in Azure Search

The following list describes which analyzers are supported in Azure Search.

Standard Lucene (default)
No specification required. Used automatically for indexing and queries. Works for all languages.

Predefined
  * No configuration. Used as-is and referenced by name on the `analyzer` attribute of a field.
  * Two types: 
      Specialized (language agnostic) for specific challenges or edge cases requiring a solution. Keyword, Stopword, ascii folding, etc.
      [Language analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support) (Lucene or Microsoft)

[Custom](https://docs.microsoft.com/rest/api/searchservice/Custom-analyzers-in-Azure-Search)
  * User-defined configuration of a combination of existing elements.
  * Consists of one tokenizer (required) and optional filters (char or token).
  * Requires an `analyzer` definition in the index as a prerequisite to using it.

## Best practices

Overriding the standard analyzer requires an index rebuild. If possible, decide on which analyzers to use during active development, before rolling an index into production.

Although the portal is helpful for numerous investigations and ad hoc query tests, you most likely need code and the Test Analyzer API to assess which analyzer meets your requirements.

### BP 1
TBD

### BP 2
TBD

### Testing analyzer behaviors 

We recommend using the [Analyze API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer). Provide the text you want to analyze to see what terms given analyzer will generate. For example, to see how the standard analyzer would process the text "air-condition", you can issue the following request:

~~~~
{ 
    "text": "air-condition",
    "analyzer": "standard"
}
~~~~

The standard analyzer breaks the input text into the following two tokens, annotating them with attributes like start and end offsets (used for hit highlighting) as well as their position (used for phrase matching):

~~~~
{  
  "tokens": [
    {
      "token": "air",
      "startOffset": 0,
      "endOffset": 3,
      "position": 0
    },
    {
      "token": "condition",
      "startOffset": 4,
      "endOffset": 13,
      "position": 1
    }
  ]
}
~~~~

## Exceptions to lexical analysis 

Lexical analysis applies only to query types that require complete terms – either a term query or a phrase query. It doesn’t apply to query types with incomplete terms – prefix query, wildcard query, regex query – or to a fuzzy query. Those query types, including the prefix query with term *air-condition\** in our example, are added directly to the query tree, bypassing the analysis stage. The only transformation performed on query terms of those types is lowercasing.

## Analysis during indexing

In an Azure Search index, the unit of storage is an *inverted index*, one for each searchable field. Within an inverted index is a sorted list of all terms from all documents. Each term maps to the list of documents in which it occurs, as evident in the example below.

To produce the terms in an inverted index, the search engine performs lexical analysis over the content of documents. Text inputs are passed to an analyzer, lower-cased, stripped of punctuation, and so forth, depending on the analyzer configuration. It's common, but not required, to use the same analyzers for search and indexing operations so that query terms look more like terms inside the index.

> [!Note]
> Azure Search lets you specify different analyzers for indexing and search via additional `indexAnalyzer` and `searchAnalyzer` field parameters. If unspecified, the analyzer set with the `analyzer` property is used for both indexing and searching.  

**Inverted index for example documents**

Returning to our example, for the **title** field, the inverted index looks like this:

| Term | Document list |
|------|---------------|
| atman | 1 |
| beach | 2 |
| hotel | 1, 3 |
| ocean | 4  |
| playa | 3 |
| resort | 3 |
| retreat | 4 |

In the title field, only *hotel* shows up in two documents: 1, 3.

For the **description** field, the index is as follows:

| Term | Document list |
|------|---------------|
| air |	3
| and |	4
| beach | 1
| conditioned |	3
| comfortable |	3
| distance | 1
| island | 2
| kauaʻi | 2
| located |	2
| north | 2
| ocean | 1, 2, 3
| of | 2
| on |2
| quiet | 4
| rooms	 | 1, 3
| secluded | 4
| shore	| 2
| spacious | 1
| the | 1, 2
| to | 1
| view | 1, 2, 3
| walking |	1
| with | 3


**Matching query terms against indexed terms**

Given the inverted indices above, let’s return to the sample query and see how matching documents are found for our example query. Recall that the final query tree looks like this: 

 ![Boolean query with analyzed terms][4]

During query execution, individual queries are executed against the searchable fields independently. 

+ The TermQuery, "spacious", matches document 1 (Hotel Atman). 

+ The PrefixQuery, "air-condition*", doesn't match any documents. 

  This is a behavior that sometimes confuses developers. Although the term air-conditioned exists in the document, it is split into two terms by the default analyzer. Recall that prefix queries, which contain partial terms, are not analyzed. Therefore terms with prefix "air-condition" are looked up in the inverted index and not found.

+ The PhraseQuery, "ocean view", looks up the terms "ocean" and "view" and checks the proximity of terms in the original document. Documents 1, 2 and 3 match this query in the description field. Notice document 4 has the term ocean in the title but isn’t considered a match, as we're looking for the "ocean view" phrase rather than individual words. 

> [!Note]
> A search query is executed independently against all searchable fields in the Azure Search index unless you limit the fields set with the `searchFields` parameter, as illustrated in the example search request. Documents that match in any of the selected fields are returned. 

On the whole, for the query in question, the documents that match are 1, 2, 3. 


## Next steps

+ Review our comprehensive coverage of [how full text search works in Azure Search](search-lucene-query-architecture.md).

+ Try additional query syntax from the [Search Documents](https://docs.microsoft.com/rest/api/searchservice/search-documents#examples) example section or from [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) in Search explorer in the portal.

+ Learn how to apply [language-specific lexical analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support).

+ [Configure custom analyzers](https://docs.microsoft.com/rest/api/searchservice/custom-analyzers-in-azure-search) for either minimal processing or specialized processing on specific fields.

+ [Compare standard and English analyzers](http://alice.unearth.ai/)) side-by-side on this demo web site. 

## See also

  [Search Documents REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents) 
  [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search)  
  [Full Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) 
  [Handle search results](https://docs.microsoft.com/azure/search/search-pagination-page-layout)  

<!--Image references-->
[1]: ./media/search-lucene-query-architecture/architecture-diagram2.png
