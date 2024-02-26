---
title: Examples of full Lucene query syntax
titleSuffix: Azure AI Search
description: Query examples demonstrating the Lucene query syntax for fuzzy search, proximity search, term boosting, regular expression search, and wildcard searches in an Azure AI Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/17/2024
---

# Examples of "full" Lucene search syntax (advanced queries in Azure AI Search)

When constructing queries for Azure AI Search, you can replace the default [simple query parser](query-simple-syntax.md) with the more powerful [Lucene query parser](query-lucene-syntax.md) to formulate specialized and advanced query expressions.

The Lucene parser supports complex query formats, such as field-scoped queries, fuzzy search, infix and suffix wildcard search, proximity search, term boosting, and regular expression search. The extra power comes with more processing requirements so you should expect a slightly longer execution time. In this article, you can step through examples demonstrating query operations based on full syntax.

> [!NOTE]
> Many of the specialized query constructions enabled through the full Lucene query syntax are not [text-analyzed](search-lucene-query-architecture.md#stage-2-lexical-analysis), which can be surprising if you expect stemming or lemmatization. Lexical analysis is only performed on complete terms (a term query or phrase query). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on partial query terms is lowercasing. 
>

## Hotels sample index

The following queries are based on the hotels-sample-index, which you can create by following the instructions in this [quickstart](search-get-started-portal.md).

Example queries are articulated using the REST API and POST requests. You can paste and run them in [Postman](search-get-started-rest.md) or another web client. Or, use the JSON view of [Search Explorer](search-explorer.md) in the Azure portal. In JSON view, you can paste in the query examples shown here in this article.

Request headers must have the following values:

| Key | Value |
|-----|-------|
| Content-Type | application/json|
| api-key  | `<your-search-service-api-key>`, either query or admin key |

URI parameters must include your search service endpoint with the index name, docs collections, search command, and API version, similar to the following example:

```http
https://{{service-name}}.search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2023-11-01
```

Request body should be formed as valid JSON:

```json
{
    "search": "*",
    "queryType": "full",
    "select": "HotelId, HotelName, Category, Tags, Description",
    "count": true
}
```

+ "search" set to `*` is an unspecified query, equivalent to null or empty search. It's not especially useful, but it's the simplest search you can do, and it shows all retrievable fields in the index, with all values.

+ "queryType" set to "full" invokes the full Lucene query parser and it's required for this syntax.

+ "select" set to a comma-delimited list of fields is used for search result composition, including just those fields that are useful in the context of search results.

+ "count" returns the number of documents matching the search criteria. On an empty search string, the count is all documents in the index (50 in the hotels-sample-index).

## Example 1: Fielded search

Fielded search scope individual, embedded search expressions to a specific field. This example searches for hotel names with the term "hotel" in them, but not "motel". You can specify multiple fields using AND. 

When you use this query syntax, you can omit the `searchFields` parameter when the fields you want to query are in the search expression itself. If you include `searchFields` with fielded search, the `fieldName:searchExpression` always takes precedence over `searchFields`.

```http
POST /indexes/hotel-samples-index/docs/search?api-version=2023-11-01
{
    "search": "HotelName:(hotel NOT motel) AND Category:'Resort and Spa'",
    "queryType": "full",
    "select": "HotelName, Category",
    "count": true
}
```

Response for this query should look similar to the following example, filtered on "Resort and Spa", returning hotels that include "hotel" in the name, while excluding results that include "motel" in the name.

```json
"@odata.count": 4,
"value": [
    {
        "@search.score": 4.481559,
        "HotelName": "Nova Hotel & Spa",
        "Category": "Resort and Spa"
    },
    {
        "@search.score": 2.4524608,
        "HotelName": "King's Palace Hotel",
        "Category": "Resort and Spa"
    },
    {
        "@search.score": 2.3970203,
        "HotelName": "Triple Landscape Hotel",
        "Category": "Resort and Spa"
    },
    {
        "@search.score": 2.2953436,
        "HotelName": "Peaceful Market Hotel & Spa",
        "Category": "Resort and Spa"
    }
]
```

The search expression can be a single term or a phrase, or a more complex expression in parentheses, optionally with Boolean operators. Some examples include the following:

+ `HotelName:(hotel NOT motel)`
+ `Address/StateProvince:("WA" OR "CA")`
+ `Tags:("free wifi" NOT "free parking") AND "coffee in lobby"`

Be sure to put a phrase within quotation marks if you want both strings to be evaluated as a single entity, as in this case searching for two distinct locations in the Address/StateProvince field. Depending on the client, you might need to escape (`\`) the quotation marks.

The field specified in `fieldName:searchExpression` must be a searchable field. See [Create Index (REST API)](/rest/api/searchservice/create-index) for details on how field definitions are attributed.

## Example 2: Fuzzy search

Fuzzy search matches on terms that are similar, including misspelled words. To do a fuzzy search, append the tilde `~` symbol at the end of a single word with an optional parameter, a value between 0 and 2, that specifies the edit distance. For example, `blue~` or `blue~1` would return blue, blues, and glue.

```http
POST /indexes/hotel-samples-index/docs/search?api-version=2023-11-01
{
    "search": "Tags:conserge~",
    "queryType": "full",
    "select": "HotelName, Category, Tags",
    "searchFields": "HotelName, Category, Tags",
    "count": true
}
```

Response for this query resolves to "concierge" in the matching documents, trimmed for brevity:

```json
"@odata.count": 12,
"value": [
    {
        "@search.score": 1.1832147,
        "HotelName": "Secret Point Motel",
        "Category": "Boutique",
        "Tags": [
            "pool",
            "air conditioning",
            "concierge"
        ]
    },
    {
        "@search.score": 1.1819803,
        "HotelName": "Twin Dome Motel",
        "Category": "Boutique",
        "Tags": [
            "pool",
            "free wifi",
            "concierge"
        ]
    },
    {
        "@search.score": 1.1773309,
        "HotelName": "Smile Hotel",
        "Category": "Suite",
        "Tags": [
            "view",
            "concierge",
            "laundry service"
        ]
    },
```

Phrases aren't supported directly but you can specify a fuzzy match on each term of a multi-part phrase, such as `search=Tags:landy~ AND sevic~`.  This query expression finds 15 matches on "laundry service".

> [!Note]
> Fuzzy queries are not [analyzed](search-lucene-query-architecture.md#stage-2-lexical-analysis). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on partial query terms is lower casing.
>

## Example 3: Proximity search

Proximity search finds terms that are near each other in a document. Insert a tilde "~" symbol at the end of a phrase followed by the number of words that create the proximity boundary.

This query searches for the terms "hotel" and  "airport" within 5 words of each other in a document. The quotation marks are escaped (`\"`) to preserve the phrase:

```http
POST /indexes/hotel-samples-index/docs/search?api-version=2023-11-01
{
    "search": "Description: \"hotel airport\"~5",
    "queryType": "full",
    "select": "HotelName, Description",
    "searchFields": "HotelName, Description",
    "count": true
}
```

Response for this query should look similar to the following example:

```json
"@odata.count": 2,
"value": [
    {
        "@search.score": 0.6331726,
        "HotelName": "Trails End Motel",
        "Description": "Only 8 miles from Downtown.  On-site bar/restaurant, Free hot breakfast buffet, Free wireless internet, All non-smoking hotel. Only 15 miles from airport."
    },
    {
        "@search.score": 0.43032226,
        "HotelName": "Catfish Creek Fishing Cabins",
        "Description": "Brand new mattresses and pillows.  Free airport shuttle. Great hotel for your business needs. Comp WIFI, atrium lounge & restaurant, 1 mile from light rail."
    }
]
```

## Example 4: Term boosting

Term boosting refers to ranking a document higher if it contains the boosted term, relative to documents that don't contain the term. To boost a term, use the caret, `^`, symbol with a boost factor (a number) at the end of the term you're searching. The boost factor default is 1, and although it must be positive, it can be less than 1 (for example, 0.2). Term boosting differs from scoring profiles in that scoring profiles boost certain fields, rather than specific terms.

In this "before" query, search for "beach access" and notice that there are seven documents that match on one or both terms.

```http
POST /indexes/hotel-samples-index/docs/search?api-version=2023-11-01
{
    "search": "beach access",
    "queryType": "full",
    "select": "HotelName, Description, Tags",
    "searchFields": "HotelName, Description, Tags",
    "count": true
}
```

In fact, there's only one document that matches on "access", and because it's the only match, it's placement is high (second position) even though the document is missing the term "beach".

```json
"@odata.count": 7,
"value": [
    {
        "@search.score": 2.2723424,
        "HotelName": "Nova Hotel & Spa",
        "Description": "1 Mile from the airport.  Free WiFi, Outdoor Pool, Complimentary Airport Shuttle, 6 miles from the beach & 10 miles from downtown."
    },
    {
        "@search.score": 1.5507699,
        "HotelName": "Old Carrabelle Hotel",
        "Description": "Spacious rooms, glamorous suites and residences, rooftop pool, walking access to shopping, dining, entertainment and the city center."
    },
    {
        "@search.score": 1.5358944,
        "HotelName": "Whitefish Lodge & Suites",
        "Description": "Located on in the heart of the forest. Enjoy Warm Weather, Beach Club Services, Natural Hot Springs, Airport Shuttle."
    },
    {
        "@search.score": 1.3433652,
        "HotelName": "Ocean Air Motel",
        "Description": "Oceanfront hotel overlooking the beach features rooms with a private balcony and 2 indoor and outdoor pools. Various shops and art entertainment are on the boardwalk, just steps away."
    },
```

In the "after" query, repeat the search, this time boosting results with the term "beach" over the term "access". A human readable version of the query is `search=Description:beach^2 access`. Depending on your client, you might need to express `^2` as `%5E2`.

After boosting the term "beach", the match on Old Carrabelle Hotel moves down to sixth place.

<!-- Consider a scoring profile that boosts matches in a certain field, such as "genre" in a music app. Term boosting could be used to further boost certain search terms higher than others. For example, "rock^2 electronic" will boost documents that contain the search terms in the "genre" field higher than other searchable fields in the index. Furthermore, documents that contain the search term "rock" will be ranked higher than the other search term "electronic" as a result of the term boost value (2). -->

## Example 5: Regex

A regular expression search finds a match based on the contents between forward slashes "/", as documented in the [RegExp class](https://lucene.apache.org/core/6_6_1/core/org/apache/lucene/util/automaton/RegExp.html).

```http
POST /indexes/hotel-samples-index/docs/search?api-version=2023-11-01
{
    "search": "HotelName:/(Mo|Ho)tel/",
    "queryType": "full",
    "select": "HotelName",
    "count": true
}
```

Response for this query should look similar to the following example:

```json
    "@odata.count": 22,
    "value": [
        {
            "@search.score": 1.0,
            "HotelName": "Days Hotel"
        },
        {
            "@search.score": 1.0,
            "HotelName": "Triple Landscape Hotel"
        },
        {
            "@search.score": 1.0,
            "HotelName": "Smile Hotel"
        },
        {
            "@search.score": 1.0,
            "HotelName": "Pelham Hotel"
        },
        {
            "@search.score": 1.0,
            "HotelName": "Sublime Cliff Hotel"
        },
        {
            "@search.score": 1.0,
            "HotelName": "Twin Dome Motel"
        },
        {
            "@search.score": 1.0,
            "HotelName": "Nova Hotel & Spa"
        },
        {
            "@search.score": 1.0,
            "HotelName": "Scarlet Harbor Hotel"
        },
```

> [!Note]
> Regex queries are not [analyzed](./search-lucene-query-architecture.md#stage-2-lexical-analysis). The only transformation performed on partial query terms is lower casing.
>

## Example 6: Wildcard search

You can use generally recognized syntax for multiple (`*`) or single (`?`) character wildcard searches. Note the Lucene query parser supports the use of these symbols with a single term, and not a phrase.

In this query, search for hotel names that contain the prefix 'sc'. You can't use a `*` or `?` symbol as the first character of a search.

```http
POST /indexes/hotel-samples-index/docs/search?api-version=2023-11-01
{
    "search": "HotelName:sc*",
    "queryType": "full",
    "select": "HotelName",
    "count": true
}
```

Response for this query should look similar to the following example:

```json
    "@odata.count": 2,
    "value": [
        {
            "@search.score": 1.0,
            "HotelName": "Scarlet Harbor Hotel"
        },
        {
            "@search.score": 1.0,
            "HotelName": "Scottish Inn"
        }
    ]
```

> [!Note]
> Wildcard queries are not [analyzed](./search-lucene-query-architecture.md#stage-2-lexical-analysis). The only transformation performed on partial query terms is lower casing.
>

## Next steps

Try specifying queries in code. The following link covers how to set up search queries using the Azure SDKs.

+ [Quickstart: Full text search using the Azure SDKs](search-get-started-text.md)

More syntax reference, query architecture, and examples can be found in the following links:

+ [Lucene syntax query examples for building advanced queries](search-query-lucene-examples.md)
+ [How full text search works in Azure AI Search](search-lucene-query-architecture.md)
+ [Simple query syntax](query-simple-syntax.md)
+ [Full Lucene query syntax](query-lucene-syntax.md)
+ [Filter syntax](search-query-odata-filter.md)
