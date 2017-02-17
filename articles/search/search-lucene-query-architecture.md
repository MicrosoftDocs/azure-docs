---
title: Full text Lucene engine in Azure Search | Microsoft Docs
description: Lucene query architecture and concepts for text search, implemented and adapted for Azure Search workloads.
services: search
manager: jhubbard
author: yahnoosh
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 02/16/2017
ms.author: jlembicz
---

# How full text search works in Azure Search

Azure Search uses an embedded Lucene search engine for full text search. A working knowledge of 
basic Lucene architecture makes design and debugging more productive. Customizations to the query processing pipeline will be easier to identify and apply when you know how the pieces fit together.

This article explains how the following stages of query execution are performed in Azure Search:

+ Query parsing
+ Lexical analysis 
+ Document retrieval: matching
+ Scoring and ranking

## Architecture overview and diagram

Full text search is parsing a textual query into one or more terms, and then processing those terms before trying to find documents with matching terms in the index. Individual terms are sometimes broken down and reconstituted into new forms to cast a broader net over what could be considered as a potential match. A result set is then sorted by a relevance score assigned to each individual matching document.

There are four stages in query execution: 

1. Query parsing 

2. Lexical analysis 

3. Document retrieval 

4. Scoring 

> [!Note] 
> Lucene integration is not exhaustive. Azure Search selectively exposes and extends Lucene functionality to enable the scenarios important to Azure Search. As a developer, using the Azure Search APIs, and not Lucene APIs, is required for any custom work related to full text search. 

Key components of the query processing pipeline include the following: 

* **Query parsers** separate query terms from query operators, and create the query structure (a query tree) to be sent to the search engine. 

* **Analyzers** process the query terms. This process is referred to as lexical analysis; it can involve transforming, removing, or expanding of query terms. 

* **Inverted index**, an efficient data structure used to store and organize searchable terms extracted from indexed documents. 

* **Search engine**,  component for retrieving and scoring documents based on the contents of the inverted index. 

The diagram below illustrates how these components are used in processing and executing a search request. 

 ![Lucene query architecture diagram in Azure Search][1]

## Anatomy of a search request

A search request is a complete specification of what should be returned in a result set. In simplest form, it is an empty query with no criteria of any kind. A more realistic example includes parameters, several query terms, perhaps scoped to certain fields, with possibly a filter expression and ordering rules.  

The following example is a search request you might send to Azure Search using the REST API.  

~~~~
POST /indexes/hotels/docs/search?api-version=2016-09-01 
{  
    "search": "Spacious, Comfort* +\"Ocean view\"",  
    "searchFields": "description, title",  
    "filter": "price ge 60 and price lt 300",  
    "orderby": "geo.distance(location, geography'POINT(-159.476235 22.227659)')", 
    "queryType": "full" 
 } 
~~~~

The entire statement is the *search request*. The first line of the request body is the *search query*. 

In the example, the search query consists of phrases and terms (`"search": "Spacious, Comfort* +\"Ocean view\""`). The remaining instructions (for `searchFields`, `filter`, `orderby`) are parameters for scoping and ordering the results.  

In this example, the search query goes against an index of hotel listings, scanning the description and title fields for documents that contain "Ocean view", and additionally on the term "spacious", or on terms that start with the prefix "comfort".  

From the list of matching documents, the search engine filters out documents where the price is less than $60 and more than $300. The resulting set of hotels are ordered by proximity to a given geography location, and then returned to the calling application. 

This article uses the example request to highlight behaviors of default query processing for full text search, starting with query parsing. Filtering and ordering are out of scope for this article. 

## Stage 1: Query parsing 

In the example, the query string is the first line of the request: 

~~~~
 "search": "Spacious, Comfort* +\"Ocean view\"", 
~~~~

The query parser separates operators (such as `*` and `+` in the example) from terms, and deconstructs terms into a *subquery* of a supported type: 

+ *term query* for standalone terms
+ *phrase query* for quoted terms
+ *prefix query* for terms followed by a prefix operator `*`

Operators associated with a subquery determine whether the query "must be" or "should be" satisfied in order for a document to be considered a match. For example, `+“Ocean view”` is "must" due to the required (+) operator. 

The query parser restructures the subqueries into a *query tree* (an internal structure representing the query) that is passed on to the search engine. In the first stage of query parsing, the query tree looks like this.  

 ![Boolean query searchmode any][2]

> [!Note]
> A search query is executed independently against all searchable fields in the Azure Search index unless you limit the fields set with the `searchFields` parameter, as illustrated in the example search request, per the title and description fields.  

### Supported parsers: Simple and Full Lucene 

 Azure Search exposes two different query languages, simple (default) and full. By setting the `queryType` parameter with your search request, you tell the query parser which query language you chose so that it knows how to interpret the operators and syntax of the query text. The Full Lucene query language, which you get by setting `queryType=Full`, extends the default Simple query language by adding support for more query types like: wildcard, fuzzy, regex, field-scoped queries and more. For example, a regular expression sent in simple query syntax would be interpreted as a query string and not an expression.

### Impact of searchMode on the parser 

Another search request parameter that affects parsing is the `searchMode` parameter. It controls the default operator for Boolean queries: any (default) or all.  

When `searchMode=any`, which is the default, the sample query text is equivalent to: 

~~~~
Spacious,|Comfort*+“Ocean view” 
~~~~

One term is specifically marked as required, but "any" of the remaining terms could be used to find a match.

Drilling further, there is no change on the +“Ocean view” interpretation, but the space between Spacious, and Comfort is interpreted as an “or” operation. The initial query tree illustrated previously, with the two “should” operations, reflects the semantics of the default operator “or”. 

Suppose that we now set `searchMode= all`. In this case, the space is interpreted as an “and” operation. All (or both) of the remaining terms must be present in the document to qualify as a match. The resulting sample query would be interpreted as follows: 

~~~~
+Spacious,+Comfort*+”Ocean view”  
~~~~

A modified query tree for this query would look like this, where a matching document is the intersection of all three subqueries: 

 ![Boolean query searchmode all][3]

> [!Note] 
> Favoring the default `searchMode=any` over `searchMode=all` is a decision best arrived by running representative queries. If users are likely to include operators (common when searching document stores), you might find that search results are more intuitively consistent with the non-default `searchMode=all`. For more about the interplay between `searchMode` and operators, see [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search).

## Stage 2: Lexical analysis 

Lexical analyzers process *term queries* and *phrase queries* after the query tree is structured. An analyzer accepts the text inputs given to it by the parser, analyzes the text, and then sends back analyzed terms to be incorporated into the query tree. 

The most common form of lexical analysis is *linguistic analysis* which transforms query terms based on rules specific to a given language: 

* Reducing a query term to the root form of a word 
* Removing non-essential words (stopwords, such as “the” or “and” in English) 
* Breaking a composite word into component parts 
* Lower casing an upper case word 

All of these operations tend to erase differences between the text input provided by the user and the terms stored in the index. Such operations go beyond text processing and require in-depth knowledge of the language itself. 

> [!Note]
> Azure Search supports a long list of language analyzers from both Lucene and Microsoft natural language processing. For the full list, see [Language analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support). Analyzers are scoped to searchable fields and are specified as part of a field definition. This allows you to vary lexical analysis on a per field basis. Unspecified, the default analyzer is standard Lucene. If you want a different analyzer, include it as an attribute of the field when the index is created. 

In our example, prior to analysis, the initial query tree has the term “Spacious,” with an uppercase “S” and a comma that the query parser interprets as a part of the query term (a comma is not considered a query language operator).  

When the default analyzer processes the term, it will lowercase “ocean view” and “spacious”, and the comma character (removes it). The modified query tree will look as follows: 

 ![Boolean query with analyzed terms][4]

### Exceptions to lexical analysis 

Lexical analysis applies only to query types that require complete terms – either a term query or a phrase query. It doesn’t apply to query types with incomplete terms – prefix query, wildcard query, regex query – or to a fuzzy query. Those query types, including prefix query (Comfort*) in our example, are added directly to the query tree, bypassing the analysis stage. 

## Stage 3: Document retrieval 

Document retrieval refers to finding documents with matching terms in the index. This stage is understood best through example. Let's start with a hotels index having the following schema: 

~~~~
{   
    "name": "hotels",     
    "fields": [     
        {"name": "id", "type": "Edm.String", "key": true, "searchable": false},     
        {"name": "title", "type": "Edm.String", "searchable": true},     
        {"name": "description", "type": "Edm.String", "searchable": true},     
        {"name": "location", "type": "Edm.GeographyPoint", "searchable": false, "sortable": true},     
        {"name": "price", "type": "Edm.Int32", "searchable": false, "filterable": true}  
    ] 
} 
~~~~

Further assume that this index contains the following three documents: 

~~~~
{   "value":[ 
    {         
    "id": "1",         
    "title": "Hotel Atman",         
    "description": "Located is a small, friendly village on the Oaxacan Coast. Walking distance to the beach. Spacious rooms, ocean view.",         
    "location": { "type": "Point", "coordinates": [-96.554518, 15.667729] },         
    "price": "20"       
    },       
    {         
    "id": "2",         
    "title": "Ocean Resort",         
    "description": "Located on a cliff on the north shore of the island of Kauai. Ocean view.",         
    "location": { "type": "Point", "coordinates": [-159.497745, 22.203322] },         
    "price": "200"       
    },       
    {         
     "id": "3",         
     "title": "Hotel Nagi",         
     "description": "Air conditioning, comfortable rooms with terrace, close to the ocean.",         
     "location": { "type": "Point", "coordinates": [-97.076164, 15.872699] },         
     "price": "15"       
    }   
] 
~~~~

**Constructing an inverted index from the sample documents**

During indexing, the search engine creates an inverted index for each searchable field independently. An inverted index is a sorted list of terms mapped to the list of documents. 

As with query parsing, indexing extracts terms, only during indexing the terms are extracted from documents instead of a query string. Text inputs are passed to an analyzer and normalized, and punctuation is stripped out. Often the same analyzers used during indexing are also used for queries. 

> [!Note]
> Lucene requires the same analyzer for both indexing and querying, but Azure Search lets you specify an alternate analyzer for indexing via an additional `indexAnalyzer` parameter. Unspecified, just the `analyzer` property is used for both indexing and searching.  

Similarities between indexing and querying are intentional, especially with regards to lexical analysis, so that a query input can be processed to look like the terms stored inside the index.  

For the title field, the inverted index looks like this:

| Term | Document list |
|------|---------------|
| atman | 1 |
| beach | 2 |
| blue | 3 |
| hotel | 1, 3 |
| ocean | 2  |
| resort | 2 |

For the description field, the index is as follows:

| Term | Document list |
|------|---------------|
| a | 1, 2 | 
| air | 3 | 
| beach | 1, 3 | 
| cliff |  2 | 
| close | 3 | 
| coast | 1 | 
| comfortable | 3 | 
| conditioning | 3 | 
| distance | 1 | 
| friendly | 1 | 
| is | 1 | 
| island | 2 | 
| kauai | 2 | 
| located | 1, 2 | 
| north | 2 | 
| oaxacan | 1 | 
| ocean | 1, 2 | 
| of | 2, 2 | 
| on | 1, 2, 2 | 
| rooms | 1, 3 | 
| shore | 2 | 
| small | 1 | 
| spacious | 1 | 
| terrace | 3 | 
| the | 1, 1, 2, 2, 3 | 
| to | 1, 3 | 
| view | 1, 2 | 
| village | 1 | 
| walking | 1 | 
| with | 3 | 


**Matching query terms against indexed terms**

Given the inverted index above, let’s return to the sample query and see how matching documents are found. Recall that the final query tree looks something like this: 

 ![Boolean query with analyzed terms][4]

During query execution, individual queries are executed against the searchable fields independently. 

+ The TermQuery, “spacious”, matches document 1 (Hotel Atman). 

+ The PrefixQuery, “Comfort”, doesn't match any documents. 

  This is a behavior that sometimes confuses developers. Although the term comfortable exists in the inverted index, it is lowercased and therefore not a match. Recall that prefix queries, which contain partial terms, are not analyzed. Had the query term been entered as “comfort*” in lower-case, document 3 (Hotel Nagi) would have been a match. 

+ The PhraseQuery, “ocean view”, looks up the terms “ocean” and “view” and checks the proximity of terms in the original document. Documents 1 and 2 match this query in the description field. Notice document 3 has the term ocean in the title but isn’t considered a match, as we're looking for the "ocean view" phrase rather than individual words. 

On the whole, for the query in question, the documents that match are 1, 2. 

## Stage 4: Scoring  

Every item in a search result set is assigned a relevance score, then ranked highest to lowest. The score is computed based on statistical properties of the data and the query.  

The basis for this approach to computing relevance is known as TF-IDF (term frequency-inverse document frequency). More specifically, the Lucene scoring formula is used: https://lucene.apache.org/core/4_10_0/core/org/apache/lucene/search/similarities/TFIDFSimilarity.html 

* Find documents containing terms in the query string (some or all, depending on `searchMode`). 

* Increase the score any documents containing multiple instances of the search term.  

* Further increase the score if the term is rare across the data corpus, but common within the document. 

Assuming there is no custom sorting, results are then ranked by search score before they are returned to the calling application. If $top is not specified, 50 items having the highest search score are returned. 

Search score values can be repeated throughout a result set. For example, you might have 10 items with a score of 1.2, 20 items with a score of 1.0, and 20 items with a score of 0.5. When multiple hits have the same search score, the ordering of same scored items is not defined, and is not stable. Run the query again, and you might see items shift position. Given two items with an identical score, there is no guarantee which one appears first. 

Also, the score value is not normalized, the score values represent relative relevance of documents and can't be compared between different queries. 

How are scores aggregated, run _explain on the example from above 

You can get more differentiation in scores if …. 

<The example we’re using fails us here in this section because there is no search corpus – thus no search scores -- to explore. I don’t know if it’s possible to come up with an equivalent query for the real estate database, but if we can, this section could write itself> 

(Explain that scoring is not performed when orderBy is used for performance reasons )

### Tune search ranking scores 

In Azure Search, you can’t change the scoring logic, but you can apply term boosting within a field (Lucene syntax only), create scoring profiles, and control the number of items that are returned. For more information, see: * Lucene query syntax * Add a scoring profiles in Azure Search * Page search results Next steps: customizing the query pipeline

## Next steps

+ Opt in for the full query parser to use additional operators and query types (fuzzy search, proximity search, wildcard search, regular expressions, and so on)

+ Choose a different language analyzer for non-English linguistic analysis.

+ Configure custom analyzers for either minimal processing or specialized processing on specific fields.

## See also

<!--Image references-->
[1]: ./media/search-query-architecture/architecture-diagram.png
[2]: ./media/search-query-architecture/azSearch-queryparsing-should2.png
[3]: ./media/search-query-architecture/azSearch-queryparsing-must2.png
[4]: ./media/search-query-architecture/azSearch-queryparsing-spacious2.png
