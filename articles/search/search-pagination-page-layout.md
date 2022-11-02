---
title: How to work with search results
titleSuffix: Azure Cognitive Search
description: Define search result composition, get a document count, sort results, and add content navigation to search results in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 11/02/2022
---

# How to work with search results in Azure Cognitive Search

This article explains how to work with a query response in Azure Cognitive Search. The structure of a response is determined by parameters in the query itself, as described in [Search Documents (REST)](/rest/api/searchservice/Search-Documents) or [SearchResults Class (Azure for .NET)](/dotnet/api/azure.search.documents.models.searchresults-1). 

Parameters on the query determine:

+ Selection of fields within results
+ Count of matches found in the index for the query
+ Number of results in the response (up to 50, by default)
+ Sort order
+ Highlighting of terms within a result, matching on either the whole or partial term in the body

## Result composition

Results are tabular, composed of fields of either all "retrievable" fields, or limited to just those fields specified in the **`$select`** parameters. Rows are the matching documents.

While a search document might consist of a large number of fields, typically only a few are needed to represent each document in the result set. On a query request, append `$select=<field list>` to specify which fields include in the response. A field must be attributed as "retrievable" in the index to be included in a result. 

Fields that work best include those that contrast and differentiate among documents, providing sufficient information to invite a click-through response on the part of the user. On an e-commerce site, it might be a product name, description, brand, color, size, price, and rating. For the built-in hotels-sample index, it might be the "select" fields in the following example:

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2020-06-30 
    {  
      "search": "sandy beaches",
      "select": "HotelId, HotelName, Description, Rating, Address/City"
      "count": true
    }
```

> [!NOTE]
> If want to include image files in a result, such as a product photo or logo, store them outside of Azure Cognitive Search, but include a field in your index to reference the image URL in the search document. Sample indexes that support images in the results include the **realestate-sample-us** demo (a built-in sample dataset that you can build easily in the Import Data wizard), and the [New York City Jobs demo app](https://aka.ms/azjobsdemo).

### Tips for unexpected results

Occasionally, the substance and not the structure of results are unexpected. For example, you might find that some results appear to be duplicates, or a result that *should* appear near the top is positioned lower in the results. When query outcomes are unexpected, you can try these query modifications to see if results improve:

+ Change **`searchMode=any`** (default) to **`searchMode=all`** to require matches on all criteria instead of any of the criteria. This is especially true when boolean operators are included the query.

+ Experiment with different lexical analyzers or custom analyzers to see if it changes the query outcome. The default analyzer will break up hyphenated words and reduce words to root forms, which usually improves the robustness of a query response. However, if you need to preserve hyphens, or if strings include special characters, you might need to configure custom analyzers to ensure the index contains tokens in the right format. For more information, see [Partial term search and patterns with special characters (hyphens, wildcard, regex, patterns)](search-query-partial-matching.md).

## Counting matches

The count parameter returns the number of documents in the index that are considered a match for the query. To return the count, add **`$count=true`** to the query request. There's no maximum value imposed by the search service. Depending on your query and the content of your documents, the count could be as high as every document in the index.

Count is accurate when the index is stable. If the system is actively adding, updating, or deleting documents, the count will be approximate, excluding any documents that aren't fully indexed.

Count won't be affected by routine maintenance or other workloads on the search service. However if you have multiple partitions and a single replica, you could experience short-term fluctuations in document count (several minutes) as the partitions are restarted.

> [!TIP]
> To check indexing operations, you can confirm whether the index contains the expected number of documents by adding `$count=true` on an empty search `search=*` query. The result is the full count of documents in your index.
>
> When testing query syntax, `$count=true` can quickly tell you whether your modifications are returning greater or fewer results, which can be useful feedback.

## Paging results

By default, the search engine returns up to the first 50 matches. The top 50 are determined by search score, assuming the query is full text search or semantic search. Otherwise, the top 50 are an arbitrary order for exact match queries (where "@searchScore=1.0").

To control the paging of all documents returned in a result set, add `$top` and `$skip` parameters to the query request. The following list explains the logic.

+ Return the first set of 15 matching documents plus a count of total matches: `GET /indexes/<INDEX-NAME>/docs?search=<QUERY STRING>&$top=15&$skip=0&$count=true`

+ Return the second set, skipping the first 15 to get the next 15: `$top=15&$skip=15`. Repeat for the third set of 15: `$top=15&$skip=30`

The results of paginated queries aren't guaranteed to be stable if the underlying index is changing. Paging changes the value of `$skip` for each page, but each query is independent and operates on the current view of the data as it exists in the index at query time (in other words, there's no caching or snapshot of results, such as those found in a general purpose database).

Following is an example of how you might get duplicates. Assume an index with four documents:

```text
{ "id": "1", "rating": 5 }
{ "id": "2", "rating": 3 }
{ "id": "3", "rating": 2 }
{ "id": "4", "rating": 1 }
```

Now assume you want results returned two at a time, ordered by rating. You would execute this query to get the first page of results: `$top=2&$skip=0&$orderby=rating desc`, producing the following results:

```text
{ "id": "1", "rating": 5 }
{ "id": "2", "rating": 3 }
```

On the service, assume a fifth document is added to the index in between query calls: `{ "id": "5", "rating": 4 }`.  Shortly thereafter, you execute a query to fetch the second page: `$top=2&$skip=2&$orderby=rating desc`, and get these results:

```text
{ "id": "2", "rating": 3 }
{ "id": "3", "rating": 2 }
```

Notice that document 2 is fetched twice. This is because the new document 5 has a greater value for rating, so it sorts before document 2 and lands on the first page. While this behavior might be unexpected, it's typical of how a search engine behaves.

## Ordering results

In a full text search query, results can be ranked by a search score, a semantic reranker score (if using [semantic search](semantic-search-overview.md)), or by an **`$orderby`** expression in the query request that specifies an explicit sort order.

Sorting methodologies aren't designed to be used together. For example, if you're sorting with **`$orderby`** for primary sorting, you can't apply a secondary sort based on search score (because the search score will be uniform).

### Ordering by search score

For full text search queries, results are automatically ranked by a search score, calculated based on term frequency and proximity in a document (derived from [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)), with higher scores going to documents having more or stronger matches on a search term.

The "@search.score" range is 0 up to (but not including) 1.00. A "@search.score" equal to 1.00 indicates an unscored or unranked result set, where the 1.0 score is uniform across all results. Unscored results occur when the query form is fuzzy search, wildcard or regex queries, or an empty search (`search=*`). If you need to impose a ranking structure over unscored results, an **`$orderby`** expression will help you achieve that objective.

Search scores convey general sense of relevance, reflecting the strength of match relative to other documents in the same result set. But scores aren't always consistent from one query to the next, so as you work with queries, you might notice small discrepancies in how search documents are ordered. There are several explanations for why this might occur.

| Cause | Description |
|-----------|-------------|
| Data volatility | Index content varies as you add, modify, or delete documents. Term frequencies will change as index updates are processed over time, affecting the search scores of matching documents. |
| Multiple replicas | For services using multiple replicas, queries are issued against each replica in parallel. The index statistics used to calculate a search score are calculated on a per-replica basis, with results merged and ordered in the query response. Replicas are mostly mirrors of each other, but statistics can differ due to small differences in state. For example, one replica might have deleted documents contributing to their statistics, which were merged out of other replicas. Typically, differences in per-replica statistics are more noticeable in smaller indexes. For more information about this condition, see [Concepts: search units, replicas, partitions, shards](search-capacity-planning.md#concepts-search-units-replicas-partitions-shards) in the capacity planning documentation. |
| Identical scores | If multiple documents have the same score, any one of them might appear first.  |

### Ordering by the semantic reranker

If you're using [semantic search](semantic-search-overview.md), the "@search.rerankerScore" determines the sort order of your results. 

The "@search.rerankerScore" range is 1 to 4.00, where a higher score indicates a stronger semantic match.

### How to get consistent ordering with $orderby

If consistent ordering is an application requirement, you can explicitly define an [**`$orderby`** expression](query-odata-filter-orderby-syntax.md) on a field. Only fields that are indexed as "sortable" can be used to order results.

Fields commonly used in an **`$orderby`** include rating, date, and location. Filtering by location requires that the filter expression calls the [**`geo.distance()` function**](search-query-odata-geo-spatial-functions.md?#order-by-examples), in addition to the field name.

Numeric fields (Edm.Double, Edm.Int32, Edm.Int64) are sorted in numeric order (for example, 1, 2, 10, 11, 20).

String fields (Edm.String, Edm.ComplexType subfields) are sorted in either [ASCII sort order](https://en.wikipedia.org/wiki/ASCII#Printable_characters) or [Unicode sort order](https://en.wikipedia.org/wiki/List_of_Unicode_characters), depending on the language.

+ Numeric content in string fields is sorted alphabetically (1, 10, 11, 2, 20).

+ Upper case strings are sorted ahead of lower case (APPLE, Apple, BANANA, Banana, apple, banana). You can assign a [text normalizer](search-normalizers.md) to preprocess the text before sorting to change this behavior.

+ Strings that lead with diacritics appear last (Äpfel, Öffnen, Üben)

### Use a scoring profile to influence relevance

Another approach that promotes order consistency is using a [custom scoring profile](index-add-scoring-profiles.md). Scoring profiles give you more control over the ranking of items in search results, with the ability to boost matches found in specific fields. The extra scoring logic can help override minor differences among replicas because the search scores for each document are farther apart. We recommend the [ranking algorithm](index-ranking-similarity.md) for this approach.

## Hit highlighting

Hit highlighting refers to text formatting (such as bold or yellow highlights) applied to matching terms in a result, making it easy to spot the match. Highlighting is useful for longer content fields, such as a description field, where the match isn't immediately obvious. 

Notice that highlighting is applied to individual terms. There's no highlight capability for the contents of an entire field. If you want to highlight over a phrase, you'll have to provide the matching terms (or phrase) in a quote-enclosed query string. This technique is described further on in this section.

Hit highlighting instructions are provided on the [query request](/rest/api/searchservice/search-documents). Queries that trigger query expansion in the engine, such as fuzzy and wildcard search, have limited support for hit highlighting.

### Requirements for hit highlighting

+ Fields must be Edm.String or Collection(Edm.String)
+ Fields must be attributed at **searchable**

### Specify highlighting in the request

To return highlighted terms, include the "highlight" parameter in the query request. The parameter is set to a comma-delimited list of fields. 

By default, the format mark up is `<em>`, but you can override the tag using `highlightPreTag` and `highlightPostTag` parameters. Your client code handles the response (for example, applying a bold font or a yellow background).

```http
POST /indexes/good-books/docs/search?api-version=2020-06-30 
    {  
      "search": "divine secrets",  
      "highlight": "title, original_title",
      "highlightPreTag": "<b>",
      "highlightPostTag": "</b>"
    }
```

By default, Azure Cognitive Search returns up to five highlights per field. You can adjust this number by appending a dash followed by an integer. For example, `"highlight": "description-10"` returns up to 10 highlighted terms on matching content in the "description" field.

### Highlighted results

When highlighting is added to the query, the response includes an "@search.highlights" for each result so that your application code can target that structure. The list of fields specified for "highlight" are included in the response.

In a keyword search, each term is scanned for independently. A query for "divine secrets" will return matches on any document containing either term.

:::image type="content" source="media/search-pagination-page-layout/highlighting-example.png" alt-text="Screenshot of highlighting over a phrase query." border="true":::

### Keyword search highlighting 

Within a highlighted field, formatting is applied to whole terms. For example, on a match against "The Divine Secrets of the Ya-Ya Sisterhood", formatting is applied to each term separately, even though they're consecutive. 

```json
"@odata.count": 39,
"value": [
    {
        "@search.score": 19.593246,
        "@search.highlights": {
            "original_title": [
                "<em>Divine</em> <em>Secrets</em> of the Ya-Ya Sisterhood"
            ],
            "title": [
                "<em>Divine</em> <em>Secrets</em> of the Ya-Ya Sisterhood"
            ]
        },
        "original_title": "Divine Secrets of the Ya-Ya Sisterhood",
        "title": "Divine Secrets of the Ya-Ya Sisterhood"
    },
    {
        "@search.score": 12.779835,
        "@search.highlights": {
            "original_title": [
                "<em>Divine</em> Madness"
            ],
            "title": [
                "<em>Divine</em> Madness (Cherub, #5)"
            ]
        },
        "original_title": "Divine Madness",
        "title": "Divine Madness (Cherub, #5)"
    },
    {
        "@search.score": 12.62534,
        "@search.highlights": {
            "original_title": [
                "Grave <em>Secrets</em>"
            ],
            "title": [
                "Grave <em>Secrets</em> (Temperance Brennan, #5)"
            ]
        },
        "original_title": "Grave Secrets",
        "title": "Grave Secrets (Temperance Brennan, #5)"
    }
```

### Phrase search highlighting

Whole-term formatting applies even on a phrase search, where multiple terms are enclosed in double quotation marks. The following example is the same query, except that "divine search" is submitted as a quotation-enclosed  phrase (some clients, such as Postman, require that you escape the interior quotation marks with a backslash `\"`):

```http
POST /indexes/good-books/docs/search?api-version=2020-06-30 
    {  
      "search": "\"divine secrets\"",,
      "select": "title,original_title",
      "highlight": "title",
      "highlightPreTag": "<b>",
      "highlightPostTag": "</b>",
      "count": true
    }
```

Because the criteria now specifies both terms, only one match is found in the search index. The response to the above query looks like this:

```json
{
    "@odata.count": 1,
    "value": [
        {
            "@search.score": 19.593246,
            "@search.highlights": {
                "title": [
                    "<b>Divine</b> <b>Secrets</b> of the Ya-Ya Sisterhood"
                ]
            },
            "original_title": "Divine Secrets of the Ya-Ya Sisterhood",
            "title": "Divine Secrets of the Ya-Ya Sisterhood"
        }
    ]
}
```

#### Phrase highlighting on older services

Search services that were created before July 15, 2020 implement a different highlighting experience for phrase queries.

For the following examples, assume a query string that includes the quote-enclosed phrase "super bowl". Before July 2020, any term in the phrase is highlighted:

  ```json
  "@search.highlights": {
      "sentence": [
          "The <em>super</em> <em>bowl</em> is <em>super</em> awesome with a <em>bowl</em> of chips"
     ]
  ```

For search services created after July 2020, only phrases that match the full phrase query will be returned in "@search.highlights":

  ```json
  "@search.highlights": {
      "sentence": [
          "The <em>super</em> <em>bowl</em> is super awesome with a bowl of chips"
     ]
  ```

## Next steps

To quickly generate a search page for your client, consider these options:

+ [Application Generator](search-create-app-portal.md), in the portal, creates an HTML page with a search bar, faceted navigation, and results area that includes images.

+ [Create your first app in C#](tutorial-csharp-create-first-app.md) is a tutorial and code sample that builds a functional client. Sample code demonstrates paginated queries, hit highlighting, and sorting.

+ [Add search to web apps](tutorial-csharp-overview.md) is a tutorial and code sample that uses the React JavaScript libraries for the user experience. The app is deployed using Azure Static Web Apps.
