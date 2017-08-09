---
title: Lucene query examples for Azure Search | Microsoft Docs
description: Lucene query syntax for fuzzy search, proximity search, term boosting, regular expression search, and wildcard search.
services: search
documentationcenter: ''
author: LiamCa
manager: pablocas
editor: ''
tags: Lucene query analyzer syntax

ms.assetid: 147f360d-a5ce-4d7b-a909-c8b65bfb748c
ms.service: search
ms.devlang: na
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 07/21/2017
ms.author: liamca
---

# Lucene query syntax examples for building queries in Azure Search
When constructing queries for Azure Search, you can use either the default [simple query syntax](https://docs.microsoft.com/rest/api/searchservice/simple-query-syntax-in-azure-search) or the alternative [Lucene Query Parser in Azure Search](https://docs.microsoft.com/rest/api/searchservice/lucene-query-syntax-in-azure-search). The Lucene Query Parser supports more complex query constructs, such as field-scoped queries, fuzzy search, proximity search, term boosting, and regular expression search.

In this article, you can step through examples demonstrating query operations available when using the full syntax.

## Viewing the examples in JSFiddle

All of the examples in this article are executable queries that run against a pre-loaded Search index in [JSFiddle](https://jsfiddle.net), an online code editor for testing script and HTML. 

To run them, right-click on the query example URLs to open JSFiddle in a separate browser window.

> [!NOTE]
> The following examples leverage a search index consisting of jobs available based on a dataset provided by the [City of New York OpenData](https://nycopendata.socrata.com/) initiative. This data should not be considered current or complete. The index is on a sandbox service provided by Microsoft. You do not need an Azure subscription or Azure Search to try these queries.
>


## How to invoke full Lucene parsing

All of the examples in this article specify the **queryType=full** search parameter, indicating that the full syntax, handled by the Lucene Query Parser. 

**Example 1** -- Right-click the following query snippet to open it in a new browser page that loads JSFiddle and runs the query:

* [&queryType=full&search=*](http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26searchFields=business_title%26$select=business_title%26queryType=full%26search=*)

In the new browser window, the JavaScript source and HTML output are presented side by side. The script references a full query (not just the snippet, as shown in the link). The full query is shown in the URLs for each example. 

This query returns documents from our New York City Jobs index (nycjobs, loaded on a sandbox service). For brevity, the query specifies only business titles are returned. The full underlying query is as follows:

    http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26searchFields=business_title%26$select=business_title%26queryType=full%26search=*

The **searchFields** parameter restricts the search to just the business title field. The **queryType** is set to **full**, which instructs Azure Search to use the Lucene Query Parser for this query.

> [!NOTE]
> For background on query processing, see [How full text search works in Azure Search](search-lucene-query-architecture.md). For more information on search parameters, see [Search Documents (Azure Search Service REST API)](https://docs.microsoft.com/rest/api/searchservice/Search-Documents).
>

### Fielded query operation
You can modify the examples in this article by specifying a **fieldname:searchterm** construction to define a fielded query operation, where the field is a single word, and the search term is also a single word or a phrase, optionally with Boolean operators. Some examples include the following:

* business_title:(senior NOT junior)
* state:("New York" AND "New Jersey")

Be sure to put multiple strings within quotation marks if you want both strings to be evaluated as a single entity, as in this case searching for two distinct cities in the location field. Also, ensure the operator is capitalized as you see with NOT and AND.

The field specified in **fieldname:searchterm** must be a searchable field. See [Create Index (Azure Search Service REST API)](https://docs.microsoft.com/rest/api/searchservice/create-index) for details on how index attributes are used in field definitions.

**Example 2** -- Right-click the following query snippet This query searches for business titles with the term senior in them, but not junior:

* [&queryType=full&search= business_title:senior NOT junior](http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26$select=business_title%26queryType=full%26search=business_title:senior+NOT+junior)

## Fuzzy search example
A fuzzy search finds matches in terms that have a similar construction. Per [Lucene documentation](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html), fuzzy searches are based on [Damerau-Levenshtein Distance](https://en.wikipedia.org/wiki/Damerau%e2%80%93Levenshtein_distance).

To do a fuzzy search, append the tilde "~" symbol at the end of a single word with an optional parameter, a value between 0 and 2, that specifies the edit distance. For example, "blue~" or "blue~1" would return blue, blues, and glue.

**Example 3** -- Right-click the following query snippet. This query searches for jobs with the term associate (where it is misspelled):

* [&queryType=full&search= business_title:asosiate~](http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26$select=business_title%26queryType=full%26search=business_title:asosiate~)

> [!Note]
> Fuzzy queries are not [analyzed](https://docs.microsoft.com/azure/search/search-lucene-query-architecture#stage-2-lexical-analysis), which can be surprising if you expect stemming or lemmatization. Lexical analysis is only performed on complete terms (a term query or phrase query). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on incomplete query terms is lowercasing.
>

## Proximity search example
Proximity searches are used to find terms that are near each other in a document. Insert a tilde "~" symbol at the end of a phrase followed by the number of words that create the proximity boundary. For example, "hotel airport"~5 will find the terms hotel and airport within 5 words of each other in a document.

**Example 4** -- Right-click the query. Search for jobs with the term "senior analyst" where it is separated by no more than one word:

* [&queryType=full&search=business_title:"senior analyst"~1](http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26$select=business_title%26queryType=full%26search=business_title:%22senior%20analyst%22~1)

**Example 5** -- Try it again removing the words between the term "senior analyst".

* [&queryType=full&search=business_title:"senior analyst"~0](http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26$select=business_title%26queryType=full%26search=business_title:%22senior%20analyst%22~0)

## Term boosting examples
Term boosting refers to ranking a document higher if it contains the boosted term, relative to documents that do not contain the term. This differs from scoring profiles in that scoring profiles boost certain fields, rather than specific terms. The following example helps illustrate the differences.

Consider a scoring profile that boosts matches in a certain field, such as **genre** in the musicstoreindex example. Term boosting could be used to further boost certain search terms higher than others. For example, "rock^2 electronic" will boost documents that contain the search terms in the **genre** field higher than other searchable fields in the index. Furthermore, documents that contain the search term "rock" will be ranked higher than the other search term "electronic" as a result of the term boost value (2).

To boost a term, use the caret, "^", symbol with a boost factor (a number) at the end of the term you are searching. The higher the boost factor, the more relevant the term will be relative to other search terms. By default, the boost factor is 1. Although the boost factor must be positive, it can be less than 1 (for example, 0.2).

**Example 6**  -- Right-click the query. Search for jobs with the term "computer analyst" where we see there are no results with both words computer and analyst, yet analyst jobs are at the top of the results.

* [&queryType=full&search=business_title:computer analyst](http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26$select=business_title%26queryType=full%26search=business_title:computer%5e2%20analyst)

**Example 7**  --  Try it again, this time boosting results with the term computer over the term analyst if both words do not exist.

* [&queryType=full&search=business_title:computer^2 analyst](http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26$select=business_title%26queryType=full%26search=business_title:computer%5e2%20analyst)

## Regular expression example
A regular expression search finds a match based on the contents between forward slashes "/", as documented in the [RegExp class](http://lucene.apache.org/core/4_10_2/core/org/apache/lucene/util/automaton/RegExp.html).

**Example 8** -- Right-click the query. Search for jobs with either the term Senior or Junior.

* `&queryType=full&$select=business_title&search=business_title:/(Sen|Jun)ior/`

The URL for this example will not render properly in the page. As a workaround, copy the URL below and paste it into the browser URL address:
    `http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26queryType=full%26$select=business_title%26search=business_title:/(Sen|Jun)ior/)`

## Wildcard search example
You can use generally recognized syntax for multiple (\*) or single (?) character wildcard searches. Note the Lucene query parser supports the use of these symbols with a single term, and not a phrase.

**Example 9** -- Right-click the  query. Search for jobs that contain the prefix 'prog' which would include business titles with the terms programming and programmer in it.

* [&queryType=full&$select=business_title&search=business_title:prog*](http://fiddle.jshell.net/liamca/gkvfLe6s/1/?index=nycjobs&apikey=252044BE3886FE4A8E3BAA4F595114BB&query=api-version=2016-09-01%26queryType=full%26$select=business_title%26search=business_title:prog*)

You cannot use a * or ? symbol as the first character of a search.

## Next steps
Try specifying the Lucene Query Parser in your code. The following links explain how to set up search queries for both .NET and the REST API. The links use the default simple syntax so you will need to apply what you learned from this article to specify the **queryType**.

* [Query your Azure Search Index using the .NET SDK](search-query-dotnet.md)
* [Query your Azure Search Index using the REST API](search-query-rest-api.md)

## See also

 [How full text search works in Azure Search](search-lucene-query-architecture.md)