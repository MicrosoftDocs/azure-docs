---
title: Lucene query examples for Azure Search | Microsoft Docs
description: Lucene query syntax for fuzzy search, proximity search, term boosting, regular expression search, and wildcard searches in an Azure Search service.
author: HeidiSteen
manager: cgronlun
tags: Lucene query analyzer syntax
services: search
ms.service: search
ms.topic: conceptual
ms.date: 08/09/2018
ms.author: heidist
---

# Lucene syntax query examples for building advanced queries in Azure Search
When constructing queries for Azure Search, you can replace the default [simple query parser](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) with the more expansive [Lucene Query Parser in Azure Search](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search) to formulate specialized and advanced query definitions. 

The Lucene Query Parser supports complex query constructs, such as field-scoped queries, fuzzy and prefix wildcard search, proximity search, term boosting, and regular expression search. The additional power comes with additional processing requirements so you should expect a slightly longer execution time. In this article, you can step through examples demonstrating query operations available when using the full syntax.

> [!Note]
> Many of the specialized query constructions enabled through the full Lucene query syntax are not [text-analyzed](https://docs.microsoft.com/azure/search/search-lucene-query-architecture#stage-2-lexical-analysis), which can be surprising if you expect stemming or lemmatization. Lexical analysis is only performed on complete terms (a term query or phrase query). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on incomplete query terms is lowercasing. 
>

## Formulate requests in Postman

The following examples leverage a NYC Jobs search index consisting of jobs available based on a dataset provided by the [City of New York OpenData](https://opendata.cityofnewyork.us/) initiative. This data should not be considered current or complete. The index is on a sandbox service provided by Microsoft, which means you do not need an Azure subscription or Azure Search to try these queries.

What you do need is Postman or an equivalent tool for issuing HTTP request on GET. For more information, see [Explore with REST clients](search-fiddler.md).

### Set the request header

1. In the request header, set **Content-Type** to `application/json`.

2. Add an **api-key**, and set it to this string: `252044BE3886FE4A8E3BAA4F595114BB`. This is a query key for the sandbox search service hosting the NYC Jobs index.

After you specify the request header, you can reuse it for all of the queries in this article, swapping out only the **search=** string. 

  ![Postman request header](media/search-query-lucene-examples/postman-header.png)

### Set the request URL

Request is a GET command paired with a URL containing the Azure Search endpoint and search string.

  ![Postman request header](media/search-query-lucene-examples/postman-basic-url-request-elements.png)

URL composition has the following elements:

+ **`https://azs-playground.search.windows.net/`** is a sandbox search service maintained by the Azure Search development team. 
+ **`indexes/nycjobs/`** is the NYC Jobs index in the indexes collection of that service. Both the service name and index are required on the request.
+ **`docs`** is the documents collection containing all searchable content. The query api-key provided in the request header only works on read operations targeting the documents collection.
+ **`api-version=2017-11-11`** sets the api-version, which is a required parameter on every request.
+ **`search=*`** is the query string, which in the initial query is null, returning the first 50 results (by default).

## Send your first query

As a verification step, paste the following request into GET and click **Send**. Results are returned as verbose JSON documents. You can copy-paste this URL in first example below.

  ```http
  https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&search=*
  ```

The query string, **`search=*`**, is an unspecified search equivalent to null or empty search. It's not especially useful, but it is the simplest search you can do.

Optionally, you can add **`$count=true`** to the URL to return a count of the documents matching the search criteria. On an empty search string, this is all the documents in the index (about 2800 in the case of NYC Jobs).

## How to invoke full Lucene parsing

Add **queryType=full** to invoke the full query syntax, overriding the default simple query syntax. 

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&queryType=full&search=*
```

All of the examples in this article specify the **queryType=full** search parameter, indicating that the full syntax is handled by the Lucene Query Parser. 

## Example 1: Field-scoped query

This first example is not parser-specific, but we lead with it to introduce the first fundamental query concept: containment. This example scopes query execution and the response to just a few specific fields. Knowing how to structure a readable JSON response is important when your tool is Postman or Search explorer. 

For brevity, the query targets only the *business_title* field and specifies only business titles are returned. The syntax is **searchFields** to restrict query execution to just the business_title field, and **select** to specify which fields are included in the response.

```http
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&search=*
```

Response for this query should look similar to the following screenshot.

  ![Postman sample response](media/search-query-lucene-examples/postman-sample-results.png)

You might have noticed the search score in the response. Uniform scores of 1 occur when there is no rank, either because the search was not full text search, or because no criteria was applied. For null search with no criteria, rows come back in arbitrary order. When you include actual criteria, you will see search scores evolve into meaningful values.

## Example 2: Intra-field filtering

Full Lucene syntax supports expressions within a field. This query searches for business titles with the term senior in them, but not junior:

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=business_title:senior+NOT+junior
```

  ![Postman sample response](media/search-query-lucene-examples/intrafieldfilter.png)

By specifying a **fieldname:searchterm** construction, you can define a fielded query operation, where the field is a single word, and the search term is also a single word or a phrase, optionally with Boolean operators. Some examples include the following:

* business_title:(senior NOT junior)
* state:("New York" AND "New Jersey")

Be sure to put multiple strings within quotation marks if you want both strings to be evaluated as a single entity, as in this case searching for two distinct cities in the location field. Also, ensure the operator is capitalized as you see with NOT and AND.

The field specified in **fieldname:searchterm** must be a searchable field. See [Create Index (Azure Search Service REST API)](https://docs.microsoft.com/rest/api/searchservice/create-index) for details on how index attributes are used in field definitions.

## Example 3: Fuzzy search

Full Lucene syntax also supports fuzzy search, matching on terms that have a similar construction. 
To do a fuzzy search, append the tilde `~` symbol at the end of a single word with an optional parameter, a value between 0 and 2, that specifies the edit distance. For example, `blue~` or `blue~1` would return blue, blues, and glue.

This query searches for jobs with the term "associate" (deliberately misspelled):

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=business_title:asosiate~
```
  ![Fuzzy search response](media/search-query-lucene-examples/fuzzysearch.png)

Per [Lucene documentation](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html), fuzzy searches are based on [Damerau-Levenshtein Distance](https://en.wikipedia.org/wiki/Damerau%e2%80%93Levenshtein_distance).

> [!Note]
> Fuzzy queries are not [analyzed](https://docs.microsoft.com/azure/search/search-lucene-query-architecture#stage-2-lexical-analysis). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on incomplete query terms is lowercasing.
>

## Example 4: Proximity search
Proximity searches are used to find terms that are near each other in a document. Insert a tilde "~" symbol at the end of a phrase followed by the number of words that create the proximity boundary. For example, "hotel airport"~5 will find the terms hotel and airport within 5 words of each other in a document.

In this query, for jobs with the term "senior analyst" where it is separated by no more than one word:

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=business_title:%22senior%20analyst%22~1
```
  ![Proximity query](media/search-query-lucene-examples/proximity-before.png)

Try it again removing the words between the term "senior analyst". Notice that 8 documents are returned for this query as opposed to 10 for the previous query.

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=business_title:%22senior%20analyst%22~0
```

## Example 5: Term boosting
Term boosting refers to ranking a document higher if it contains the boosted term, relative to documents that do not contain the term. To boost a term, use the caret, "^", symbol with a boost factor (a number) at the end of the term you are searching. 

In this "before" query, search for jobs with the term *computer analyst* and notice there are no results with both words *computer* and *analyst*, yet *computer* jobs are at the top of the results.

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=business_title:computer%20analyst
```
  ![Term boosting before](media/search-query-lucene-examples/termboostingbefore.png)

In the "after" query, repeat the search, this time boosting results with the term *analyst* over the term *computer* if both words do not exist. 

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=business_title:computer%20analyst%5e2
```
A more human readable version of the above query is `search=business_title:computer analyst^2`. For a workable query, `^2` is encoded as `%5E2`, which is harder to see.

  ![Term boosting after](media/search-query-lucene-examples/termboostingafter.png)

Term boosting differs from scoring profiles in that scoring profiles boost certain fields, rather than specific terms. The following example helps illustrate the differences.

Consider a scoring profile that boosts matches in a certain field, such as **genre** in the musicstoreindex example. Term boosting could be used to further boost certain search terms higher than others. For example, "rock^2 electronic" will boost documents that contain the search terms in the **genre** field higher than other searchable fields in the index. Furthermore, documents that contain the search term "rock" will be ranked higher than the other search term "electronic" as a result of the term boost value (2).

When setting the factor level, the higher the boost factor, the more relevant the term will be relative to other search terms. By default, the boost factor is 1. Although the boost factor must be positive, it can be less than 1 (for example, 0.2).


## Example 6: Regex

A regular expression search finds a match based on the contents between forward slashes "/", as documented in the [RegExp class](http://lucene.apache.org/core/4_10_2/core/org/apache/lucene/util/automaton/RegExp.html).

In this query, search for jobs with either the term Senior or Junior: `search=business_title:/(Sen|Jun)ior/``.

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=business_title:/(Sen|Jun)ior/
```

  ![Regex query](media/search-query-lucene-examples/regex.png)

> [!Note]
> Regex queries are not [analyzed](https://docs.microsoft.com/azure/search/search-lucene-query-architecture#stage-2-lexical-analysis). The only transformation performed on incomplete query terms is lowercasing.
>

## Example 7: Wildcard search
You can use generally recognized syntax for multiple (\*) or single (?) character wildcard searches. Note the Lucene query parser supports the use of these symbols with a single term, and not a phrase.

In this query, search for jobs that contain the prefix 'prog' which would include business titles with the terms programming and programmer in it. You cannot use a * or ? symbol as the first character of a search.

```GET
https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2017-11-11&$count=true&searchFields=business_title&$select=business_title&queryType=full&search=business_title:prog*
```
  ![Wildcard query](media/search-query-lucene-examples/wildcard.png)

> [!Note]
> Wildcard queries are not [analyzed](https://docs.microsoft.com/azure/search/search-lucene-query-architecture#stage-2-lexical-analysis). The only transformation performed on incomplete query terms is lowercasing.
>

## Next steps
Try specifying the Lucene Query Parser in your code. The following links explain how to set up search queries for both .NET and the REST API. The links use the default simple syntax so you will need to apply what you learned from this article to specify the **queryType**.

* [Query your Azure Search Index using the .NET SDK](search-query-dotnet.md)
* [Query your Azure Search Index using the REST API](search-query-rest-api.md)

Additional syntax reference, query architecture, and examples can be found in the following links:

+ [Simple syntax query examples](search-query-simple-examples.md)
+ [How full text search works in Azure Search](search-lucene-query-architecture.md)
+ [Simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search)
+ [Full Lucene query syntax](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search)