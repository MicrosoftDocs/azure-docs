---
title: Use full Lucene query syntax
titleSuffix: Azure Cognitive Search
description: Lucene query syntax for fuzzy search, proximity search, term boosting, regular expression search, and wildcard searches in an Azure Cognitive Search service.

manager: nitinme
author: HeidiSteen
ms.author: heidist
tags: Lucene query analyzer syntax
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/05/2020
---

# Use the "full" Lucene search syntax (advanced queries in Azure Cognitive Search)

When constructing queries for Azure Cognitive Search, you can replace the default [simple query parser](query-simple-syntax.md) with the more powerful [Lucene Query Parser in Azure Cognitive Search](query-lucene-syntax.md) to formulate specialized and advanced query definitions. 

The Lucene parser supports complex query constructs, such as field-scoped queries, fuzzy search, infix and suffix wildcard search, proximity search, term boosting, and regular expression search. The additional power comes with additional processing requirements so you should expect a slightly longer execution time. In this article, you can step through examples demonstrating query operations based on full syntax.

> [!Note]
> Many of the specialized query constructions enabled through the full Lucene query syntax are not [text-analyzed](search-lucene-query-architecture.md#stage-2-lexical-analysis), which can be surprising if you expect stemming or lemmatization. Lexical analysis is only performed on complete terms (a term query or phrase query). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on partial query terms is lowercasing. 
>

## NYC Jobs examples

The following examples leverage the [NYC Jobs search index](https://azjobsdemo.azurewebsites.net/)  consisting of jobs available based on a dataset provided by the [City of New York OpenData Initiative](https://nycopendata.socrata.com/). This data should not be considered current or complete. The index is on a sandbox service provided by Microsoft, which means you do not need an Azure subscription or Azure Cognitive Search to try these queries.

What you do need is Postman or an equivalent tool for issuing HTTP request on GET or POST. If you're unfamiliar with these tools, see [Quickstart: Explore Azure Cognitive Search REST API](search-get-started-rest.md).

## Set up the request

1. Request headers must have the following values:

   | Key | Value |
   |-----|-------|
   | Content-Type | `application/json`|
   | api-key  | `252044BE3886FE4A8E3BAA4F595114BB` </br> (this is the actual query API key for the sandbox search service hosting the NYC Jobs index) |

1. Set the verb to **`GET`**.

1. Set the URL to **`https://azs-playground.search.windows.net/indexes/nycjobs/docs/search=*&api-version=2020-06-30&queryType=full`**

   + The documents collection on the index contains all searchable content. A query API key provided in the request header only works for read operations targeting the documents collection.

   + **`$count=true`** returns a count of the documents matching the search criteria. On an empty search string, the count will be all documents in the index (about 2558 in the case of NYC Jobs).

   + The query string, **`search=*`**, is an unspecified search equivalent to null or empty search. It's not especially useful, but it is the simplest search you can do, and it shows all retrievable fields in the index, with all values.

   + **`queryType=full`** invokes the full Lucene analyzer.

1. As a verification step, paste the following request into GET and click **Send**. Results are returned as verbose JSON documents.

   ```http
   https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2020-06-30&$count=true&search=*&queryType=full
   ```

### How to invoke full Lucene parsing

Add **`queryType=full`** to invoke the full query syntax, overriding the default simple query syntax. All of the examples in this article specify the **`queryType=full`** search parameter, indicating that the full syntax is handled by the Lucene Query Parser. 

```http
POST /indexes/nycjobs/docs/search?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "*"
}
```

## Example 1: Query scoped to a list of fields

This first example is not parser-specific, but we lead with it to introduce the first fundamental query concept: containment. This example limits both query execution and the response to just a few specific fields. Knowing how to structure a readable JSON response is important when your tool is Postman or Search explorer. 

This query targets only *business_title* in **`searchFields`**, specifying through the **`select`** parameter the same field in the response.

```http
POST https://azs-playground.search.windows.net/indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "*",
    "searchFields": "business_title",
    "select": "business_title"
}
```

Response for this query should look similar to the following screenshot.

  ![Postman sample response with scores](media/search-query-lucene-examples/postman-sample-results.png)

You might have noticed the search score in the response. Uniform scores of **1** occur when there is no rank, either because the search was not full text search, or because no criteria was provided. For an empty search, rows come back in arbitrary order. When you include actual criteria, you will see search scores evolve into meaningful values.

## Example 2: Fielded search

Full Lucene syntax supports scoping individual search expressions to a specific field. This example searches for business titles with the term senior in them, but not junior. You can specify multiple fields using AND.

```http
POST /indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "business_title:(senior NOT junior) AND posting_type:external",
    "searchFields": "business_title, posting_type",
    "select": "business_title, posting_type"
}
```

Response for this query should look similar to the following screenshot (posting_type is not shown).

  :::image type="content" source="media/search-query-lucene-examples/intrafieldfilter.png" alt-text="Postman sample response search expression" border="false":::

The search expression can be a single word or a phrase, or a more complex expression in parentheses, optionally with Boolean operators. Some examples include the following:

+ `business_title:(senior NOT junior)`
+ `state:("New York" OR "New Jersey")`
+ `business_title:(senior NOT junior) AND posting_type:external`

Be sure to put multiple strings within quotation marks if you want both strings to be evaluated as a single entity, as in this case searching for two distinct locations in the `state` field. Depending on the tool, you might need to escape (`\`) the quotation marks. 

The field specified in **fieldName:searchExpression** must be a searchable field. See [Create Index (Azure Cognitive Search REST API)](/rest/api/searchservice/create-index) for details on how index attributes are used in field definitions.

> [!NOTE]
> In the example above, the **`searchFields`** parameter is omitted because each part of the query has a field name explicitly specified. However, you can still use **`searchFields`** if the query has multiple parts (using AND statements). For example, the query `search=business_title:(senior NOT junior) AND external&searchFields=posting_type` would match `senior NOT junior` only to the `business_title` field, while it would match "external" with the `posting_type` field. The field name provided in `fieldName:searchExpression` always takes precedence over **`searchFields`**, which is why in this example, we can omit `business_title` from **`searchFields`**.

## Example 3: Fuzzy search

Full Lucene syntax also supports fuzzy search, matching on terms that have a similar construction. To do a fuzzy search, append the tilde `~` symbol at the end of a single word with an optional parameter, a value between 0 and 2, that specifies the edit distance. For example, `blue~` or `blue~1` would return blue, blues, and glue.

```http
POST /indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "business_title:asosiate~",
    "searchFields": "business_title",
    "select": "business_title"
}
```

Phrases aren't supported directly but you can specify a fuzzy match on each term of a multi-part phrase, such as `search=business_title:asosiate~ AND comm~`.  In the screenshot below, the response includes a match on *community associate*.

  :::image type="content" source="media/search-query-lucene-examples/fuzzysearch.png" alt-text="Fuzzy search response" border="false":::

> [!Note]
> Fuzzy queries are not [analyzed](search-lucene-query-architecture.md#stage-2-lexical-analysis). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on partial query terms is lowercasing.
>

## Example 4: Proximity search

Proximity searches are used to find terms that are near each other in a document. Insert a tilde "~" symbol at the end of a phrase followed by the number of words that create the proximity boundary. For example, "hotel airport"~5 will find the terms hotel and airport within 5 words of each other in a document.

This query searches for the terms "senior" and "analyst",  where each term is separated by no more than one word, and the quotation marks are escaped (`\"`) to preserve the phrase:

```http
POST /indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "business_title:\"senior analyst\"~1",
    "searchFields": "business_title",
    "select": "business_title"
}
```

Response for this query should look similar to the following screenshot 

  :::image type="content" source="media/search-query-lucene-examples/proximity-before.png" alt-text="Proximity query" border="false":::

Try it again removing the words between the term "senior analyst". Notice that 8 documents are returned for this query as opposed to 10 for the previous query.

```http
POST /indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "business_title:\"senior analyst\"~0",
    "searchFields": "business_title",
    "select": "business_title"
}
```

## Example 5: Term boosting

Term boosting refers to ranking a document higher if it contains the boosted term, relative to documents that do not contain the term. To boost a term, use the caret, "^", symbol with a boost factor (a number) at the end of the term you are searching.

In this "before" query, search for jobs with the term *computer analyst* and notice there are no results with both words *computer* and *analyst*, yet *computer* jobs are at the top of the results.

```http
POST /indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "business_title:computer analyst",
    "searchFields": "business_title",
    "select": "business_title"
}
```

In the "after" query, repeat the search, this time boosting results with the term *analyst* over the term *computer* if both words do not exist. A human readable version of the query is `search=business_title:computer analyst^2`. For a workable query in Postman, `^2` is encoded as `%5E2`.

```http
POST /indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "business_title:computer analyst%5e2",
    "searchFields": "business_title",
    "select": "business_title"
}
```

Response for this query should look similar to the following screenshot.

  :::image type="content" source="media/search-query-lucene-examples/termboostingafter.png" alt-text="Term boosting after" border="false":::

Term boosting differs from scoring profiles in that scoring profiles boost certain fields, rather than specific terms. The following example helps illustrate the differences.

Consider a scoring profile that boosts matches in a certain field, such as **genre** in the musicstoreindex example. Term boosting could be used to further boost certain search terms higher than others. For example, "rock^2 electronic" will boost documents that contain the search terms in the **genre** field higher than other searchable fields in the index. Furthermore, documents that contain the search term "rock" will be ranked higher than the other search term "electronic" as a result of the term boost value (2).

When setting the factor level, the higher the boost factor, the more relevant the term will be relative to other search terms. By default, the boost factor is 1. Although the boost factor must be positive, it can be less than 1 (for example, 0.2).

## Example 6: Regex

A regular expression search finds a match based on the contents between forward slashes "/", as documented in the [RegExp class](https://lucene.apache.org/core/6_6_1/core/org/apache/lucene/util/automaton/RegExp.html).

```http
POST /indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "business_title:/(Sen|Jun)ior/",
    "searchFields": "business_title",
    "select": "business_title"
}
```

Response for this query should look similar to the following screenshot.

  :::image type="content" source="media/search-query-lucene-examples/regex.png" alt-text="Regex query" border="false":::

> [!Note]
> Regex queries are not [analyzed](./search-lucene-query-architecture.md#stage-2-lexical-analysis). The only transformation performed on partial query terms is lowercasing.
>

## Example 7: Wildcard search

You can use generally recognized syntax for multiple (\*) or single (?) character wildcard searches. Note the Lucene query parser supports the use of these symbols with a single term, and not a phrase.

In this query, search for jobs that contain the prefix 'prog' which would include business titles with the terms programming and programmer in it. You cannot use a `*` or `?` symbol as the first character of a search.

```http
POST /indexes/nycjobs/docs?api-version=2020-06-30
{
    "count": true,
    "queryType": "full",
    "search": "business_title:prog*",
    "searchFields": "business_title",
    "select": "business_title"
}
```

Response for this query should look similar to the following screenshot.

  :::image type="content" source="media/search-query-lucene-examples/wildcard.png" alt-text="Wildcard query" border="false":::

> [!Note]
> Wildcard queries are not [analyzed](./search-lucene-query-architecture.md#stage-2-lexical-analysis). The only transformation performed on partial query terms is lowercasing.
>

## Next steps

Try specifying queries in code. The following links explain how to set up search queries using the Azure SDKs.

+ [Query your index using the .NET SDK](search-get-started-dotnet.md)
+ [Query your index using the Python SDK](search-get-started-python.md)
+ [Query your index using the JavaScript SDK](search-get-started-javascript.md)

Additional syntax reference, query architecture, and examples can be found in the following links:

+ [Lucene syntax query examples for building advanced queries](search-query-lucene-examples.md)
+ [How full text search works in Azure Cognitive Search](search-lucene-query-architecture.md)
+ [Simple query syntax](query-simple-syntax.md)
+ [Full Lucene query syntax](query-lucene-syntax.md)
+ [Filter syntax](search-query-odata-filter.md)