---
title: Examples of simple syntax
titleSuffix: Azure AI Search
description: Query examples demonstrating the simple syntax for full text search, filter search, and geo search against an Azure AI Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/17/2024
---

# Examples of "simple" search queries in Azure AI Search

In Azure AI Search, the [simple query syntax](query-simple-syntax.md) invokes the default query parser for full text search. The parser is fast and handles common scenarios, including full text search, filtered and faceted search, and prefix search. This article uses examples to illustrate simple syntax usage in a [Search Documents (REST API)](/rest/api/searchservice/documents/search-post) request.

> [!NOTE]
> An alternative query syntax is [Full Lucene](query-lucene-syntax.md), supporting more complex query structures, such as fuzzy and wildcard search. For more information and examples, see [Use the full Lucene syntax](search-query-lucene-examples.md).

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
    "queryType": "simple",
    "select": "HotelId, HotelName, Category, Tags, Description",
    "count": true
}
```

+ "search" set to `*` is an unspecified query, equivalent to null or empty search. It's not especially useful, but it's the simplest search you can do, and it shows all retrievable fields in the index, with all values.

+ "queryType" set to "simple" is the default and can be omitted, but it's included to further reinforce that the query examples in this article are expressed in the simple syntax.

+ "select" set to a comma-delimited list of fields is used for search result composition, including just those fields that are useful in the context of search results.

+ "count" returns the number of documents matching the search criteria. On an empty search string, the count is all documents in the index (50 in the hotels-sample-index).

## Example 1: Full text search

Full text search can be any number of standalone terms or quote-enclosed phrases, with or without boolean operators. 

```http
POST /indexes/hotel-samples-index/docs/search?api-version=2023-11-01
{
    "search": "pool spa +airport",
    "searchMode": "any",
    "queryType": "simple",
    "select": "HotelId, HotelName, Category, Description",
    "count": true
}
```

A keyword search that's composed of important terms or phrases tend to work best. String fields undergo text analysis during indexing and querying, dropping nonessential words like "the", "and", "it". To see how a query string is tokenized in the index, pass the string in an [Analyze Text](/rest/api/searchservice/test-analyzer) call to the index.

The "searchMode" parameter controls precision and recall. If you want more recall, use the default "any" value, which returns a result if any part of the query string is matched. If you favor precision, where all parts of the string must be matched, change searchMode to "all". Try the above query both ways to see how searchMode changes the outcome.

Response for the "pool spa +airport" query should look similar to the following example, trimmed for brevity.

```json
"@odata.count": 6,
"value": [
    {
        "@search.score": 7.3617697,
        "HotelId": "21",
        "HotelName": "Nova Hotel & Spa",
        "Description": "1 Mile from the airport.  Free WiFi, Outdoor Pool, Complimentary Airport Shuttle, 6 miles from the beach & 10 miles from downtown.",
        "Category": "Resort and Spa",
        "Tags": [
            "pool",
            "continental breakfast",
            "free parking"
        ]
    },
    {
        "@search.score": 2.5560288,
        "HotelId": "25",
        "HotelName": "Scottish Inn",
        "Description": "Newly Redesigned Rooms & airport shuttle.  Minutes from the airport, enjoy lakeside amenities, a resort-style pool & stylish new guestrooms with Internet TVs.",
        "Category": "Luxury",
        "Tags": [
            "24-hour front desk service",
            "continental breakfast",
            "free wifi"
        ]
    },
    {
        "@search.score": 2.2988036,
        "HotelId": "35",
        "HotelName": "Suites At Bellevue Square",
        "Description": "Luxury at the mall.  Located across the street from the Light Rail to downtown.  Free shuttle to the mall and airport.",
        "Category": "Resort and Spa",
        "Tags": [
            "continental breakfast",
            "air conditioning",
            "24-hour front desk service"
        ]
    }
]
```

Notice the search score in the response. This is the relevance score of the match. By default, a search service returns the top 50 matches based on this score.

Uniform scores of "1.0" occur when there's no rank, either because the search wasn't full text search, or because no criteria were provided. For example, in an empty search (search=`*`), rows come back in arbitrary order. When you include actual criteria, you'll see search scores evolve into meaningful values.

## Example 2: Look up by ID

When returning search results in a query, a logical next step is to provide a details page that includes more fields from the document. This example shows you how to return a single document using [Lookup Document](/rest/api/searchservice/documents/get) by passing in the document ID.

```http
GET /indexes/hotels-sample-index/docs/41?api-version=2023-11-01
```

All documents have a unique identifier. If you're using the portal, select the index from the **Indexes** tab and then look at the field definitions to determine which field is the key. Using REST, the [Get Index](/rest/api/searchservice/indexes/get) call returns the index definition in the response body.

Response for the above query consists of the document whose key is 41. Any field that is marked as "retrievable" in the index definition can be returned in search results and rendered in your app.

```json
{
    "HotelId": "41",
    "HotelName": "Ocean Air Motel",
    "Description": "Oceanfront hotel overlooking the beach features rooms with a private balcony and 2 indoor and outdoor pools. Various shops and art entertainment are on the boardwalk, just steps away.",
    "Description_fr": "L'hôtel front de mer surplombant la plage dispose de chambres avec balcon privé et 2 piscines intérieures et extérieures. Divers commerces et animations artistiques sont sur la promenade, à quelques pas.",
    "Category": "Budget",
    "Tags": [
        "pool",
        "air conditioning",
        "bar"
    ],
    "ParkingIncluded": true,
    "LastRenovationDate": "1951-05-10T00:00:00Z",
    "Rating": 3.5,
    "Location": {
        "type": "Point",
        "coordinates": [
            -157.846817,
            21.295841
        ],
        "crs": {
            "type": "name",
            "properties": {
                "name": "EPSG:4326"
            }
        }
    },
    "Address": {
        "StreetAddress": "1450 Ala Moana Blvd 2238 Ala Moana Ctr",
        "City": "Honolulu",
        "StateProvince": "HI",
        "PostalCode": "96814",
        "Country": "USA"
    }
}
```

## Example 3: Filter on text

[Filter syntax](search-query-odata-filter.md) is an OData expression that you can use by itself or with `search`. Used together, `filter` is applied first to the entire index, and then the search is performed on the results of the filter. Filters can therefore be a useful technique to improve query performance since they reduce the set of documents that the search query needs to process.

Filters can be defined on any field marked as `filterable` in the index definition. For hotels-sample-index, filterable fields include Category, Tags, ParkingIncluded, Rating, and most Address fields.

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2023-11-01
{
    "search": "art tours",
    "queryType": "simple",
    "filter": "Category eq 'Resort and Spa'",
    "searchFields": "HotelName,Description,Category",
    "select": "HotelId,HotelName,Description,Category",
    "count": true
}
```

Response for the above query is scoped to only those hotels categorized as "Report and Spa", and that include the terms "art" or "tours". In this case, there's just one match.

```json
{
    "@search.score": 2.8576312,
    "HotelId": "31",
    "HotelName": "Santa Fe Stay",
    "Description": "Nestled on six beautifully landscaped acres, located 2 blocks from the Plaza. Unwind at the spa and indulge in art tours on site.",
    "Category": "Resort and Spa"
}
```

## Example 4: Filter functions

Filter expressions can include ["search.ismatch" and "search.ismatchscoring" functions](search-query-odata-full-text-search-functions.md), allowing you to build a search query within the filter. This filter expression uses a wildcard on *free* to select amenities including free wifi, free parking, and so forth.

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2023-11-01
  {
    "search": "",
    "filter": "search.ismatch('free*', 'Tags', 'full', 'any')",
    "select": "HotelId, HotelName, Category, Description",
    "count": true
  }
```

Response for the above query matches on 19 hotels that offer free amenities. Notice that the search score is a uniform "1.0" throughout the results. This is because the search expression is null or empty, resulting in verbatim filter matches, but no full text search. Relevance scores are only returned on full text search. If you're using filters without `search`, make sure you have sufficient sortable fields so that you can control search rank.

```json
"@odata.count": 19,
"value": [
    {
        "@search.score": 1.0,
        "HotelId": "31",
        "HotelName": "Santa Fe Stay",
        "Tags": [
            "view",
            "restaurant",
            "free parking"
        ]
    },
    {
        "@search.score": 1.0,
        "HotelId": "27",
        "HotelName": "Super Deluxe Inn & Suites",
        "Tags": [
            "bar",
            "free wifi"
        ]
    },
    {
        "@search.score": 1.0,
        "HotelId": "39",
        "HotelName": "Whitefish Lodge & Suites",
        "Tags": [
            "continental breakfast",
            "free parking",
            "free wifi"
        ]
    },
    {
        "@search.score": 1.0,
        "HotelId": "11",
        "HotelName": "Regal Orb Resort & Spa",
        "Tags": [
            "free wifi",
            "restaurant",
            "24-hour front desk service"
        ]
    },
```

## Example 5: Range filters

Range filtering is supported through filters expressions for any data type. The following examples illustrate numeric and string ranges. Data types are important in range filters and work best when numeric data is in numeric fields, and string data in string fields. Numeric data in string fields isn't suitable for ranges because numeric strings aren't comparable.

The following query is a numeric range. In hotels-sample-index, the only filterable numeric field is Rating.

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2023-11-01
{
    "search": "*",
    "filter": "Rating ge 2 and Rating lt 4",
    "select": "HotelId, HotelName, Rating",
    "orderby": "Rating desc",
    "count": true
}
```

Response for this query should look similar to the following example, trimmed for brevity.

```json
"@odata.count": 27,
"value": [
    {
        "@search.score": 1.0,
        "HotelId": "22",
        "HotelName": "Stone Lion Inn",
        "Rating": 3.9
    },
    {
        "@search.score": 1.0,
        "HotelId": "25",
        "HotelName": "Scottish Inn",
        "Rating": 3.8
    },
    {
        "@search.score": 1.0,
        "HotelId": "2",
        "HotelName": "Twin Dome Motel",
        "Rating": 3.6
    }
...
```

The next query is a range filter over a string field (Address/StateProvince):

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2023-11-01
{
    "search": "*",
    "filter": "Address/StateProvince ge 'A*' and Address/StateProvince lt 'D*'",
    "select": "HotelId, HotelName, Address/StateProvince",
    "count": true
}
```

Response for this query should look similar to the example below, trimmed for brevity. In this example, it's not possible to sort by StateProvince because the field isn't attributed as "sortable" in the index definition.

```json
"@odata.count": 9,
"value": [
    {
        "@search.score": 1.0,
        "HotelId": "9",
        "HotelName": "Smile Hotel",
        "Address": {
            "StateProvince": "CA "
        }
    },
    {
        "@search.score": 1.0,
        "HotelId": "39",
        "HotelName": "Whitefish Lodge & Suites",
        "Address": {
            "StateProvince": "CO"
        }
    },
    {
        "@search.score": 1.0,
        "HotelId": "7",
        "HotelName": "Countryside Resort",
        "Address": {
            "StateProvince": "CA "
        }
    },
...
```

## Example 6: Geospatial search

The hotels-sample index includes a Location field with latitude and longitude coordinates. This example uses the [geo.distance function](search-query-odata-geo-spatial-functions.md#examples) that filters on documents within the circumference of a starting point, out to an arbitrary distance (in kilometers) that you provide. You can adjust the last value in the query (10) to reduce or enlarge the surface area of the query.

```http
POST /indexes/v/docs/search?api-version=2023-11-01
{
    "search": "*",
    "filter": "geo.distance(Location, geography'POINT(-122.335114 47.612839)') le 10",
    "select": "HotelId, HotelName, Address/City, Address/StateProvince",
    "count": true
}
```

Response for this query returns all hotels within a 10 kilometer distance of the coordinates provided:

```json
{
    "@odata.count": 3,
    "value": [
        {
            "@search.score": 1.0,
            "HotelId": "45",
            "HotelName": "Arcadia Resort & Restaurant",
            "Address": {
                "City": "Seattle",
                "StateProvince": "WA"
            }
        },
        {
            "@search.score": 1.0,
            "HotelId": "24",
            "HotelName": "Gacc Capital",
            "Address": {
                "City": "Seattle",
                "StateProvince": "WA"
            }
        },
        {
            "@search.score": 1.0,
            "HotelId": "16",
            "HotelName": "Double Sanctuary Resort",
            "Address": {
                "City": "Seattle",
                "StateProvince": "WA"
            }
        }
    ]
}
```

## Example 7: Booleans with searchMode

Simple syntax supports boolean operators in the form of characters (`+, -, |`) to support AND, OR, and NOT query logic. Boolean search behaves as you might expect, with a few noteworthy exceptions. 

In previous examples, the `searchMode` parameter was introduced as a mechanism for influencing precision and recall, with `"searchMode": "any"` favoring recall (a document that satisfies any of the criteria is considered a match), and "searchMode=all" favoring precision (all criteria must be matched in a document). 

In the context of a Boolean search, the default `"searchMode": "any"` can be confusing if you're stacking a query with multiple operators and getting broader instead of narrower results. This is particularly true with NOT, where results include all documents "not containing" a specific term or phrase.

The following example provides an illustration. Running the following query with searchMode (any), 42 documents are returned: those containing the term "restaurant", plus all documents that don't have the phrase "air conditioning". 

Notice that there's no space between the boolean operator (`-`) and the phrase "air conditioning".

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2023-11-01
{
    "search": "restaurant -\"air conditioning\"",
    "searchMode": "any",
    "searchFields": "Tags",
    "select": "HotelId, HotelName, Tags",
    "count": true
}
```

Changing to `"searchMode": "all"` enforces a cumulative effect on criteria and returns a smaller result set (7 matches) consisting of documents containing the term "restaurant", minus those containing the phrase "air conditioning".

Response for this query would now look similar to the following example, trimmed for brevity.

```json
"@odata.count": 7,
"value": [
    {
        "@search.score": 2.5460577,
        "HotelId": "11",
        "HotelName": "Regal Orb Resort & Spa",
        "Tags": [
            "free wifi",
            "restaurant",
            "24-hour front desk service"
        ]
    },
    {
        "@search.score": 2.166792,
        "HotelId": "10",
        "HotelName": "Countryside Hotel",
        "Tags": [
            "24-hour front desk service",
            "coffee in lobby",
            "restaurant"
        ]
    },
...
```

## Example 8: Paging results

In previous examples, you learned about parameters that affect search results composition, including `select` that determines which fields are in a result, sort orders, and how to include a count of all matches. This example is a continuation of search result composition in the form of paging parameters that allow you to batch the number of results that appear in any given page. 

By default, a search service returns the top 50 matches. To control the number of matches in each page, use `top` to define the size of the batch, and then use `skip` to pick up subsequent batches.

The following example uses a filter and sort order on the Rating field (Rating is both filterable and sortable) because it's easier to see the effects of paging on sorted results. In a regular full search query, the top matches are ranked and paged by `@search.score`.

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2023-11-01
{
    "search": "*",
    "filter": "Rating gt 4",
    "select": "HotelName, Rating",
    "orderby": "Rating desc",
    "top": "5",
    "count": true
}
```

The query finds 21 matching documents, but because you specified `top`, the response returns just the top five matches, with ratings starting at 4.9, and ending at 4.7 with "Lady of the Lake B & B". 

To get the next 5, skip the first batch:

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2023-11-01
{
    "search": "*",
    "filter": "Rating gt 4",
    "select": "HotelName, Rating",
    "orderby": "Rating desc",
    "top": "5",
    "skip": "5",
    "count": true
}
```

The response for the second batch skips the first five matches, returning the next five, starting with "Pull'r Inn Motel". To continue with more batches, you would keep `top` at 5, and then increment `skip` by 5 on each new request (skip=5, skip=10, skip=15, and so forth).

```json
"value": [
    {
        "@search.score": 1.0,
        "HotelName": "Pull'r Inn Motel",
        "Rating": 4.7
    },
    {
        "@search.score": 1.0,
        "HotelName": "Sublime Cliff Hotel",
        "Rating": 4.6
    },
    {
        "@search.score": 1.0,
        "HotelName": "Antiquity Hotel",
        "Rating": 4.5
    },
    {
        "@search.score": 1.0,
        "HotelName": "Nordick's Motel",
        "Rating": 4.5
    },
    {
        "@search.score": 1.0,
        "HotelName": "Winter Panorama Resort",
        "Rating": 4.5
    }
]
```

## Next steps

Now that you have some practice with the basic query syntax, try specifying queries in code. The following link covers how to set up search queries using the Azure SDKs.

+ [Quickstart: Full text search using the Azure SDKs](search-get-started-text.md)

More syntax reference, query architecture, and examples can be found in the following links:

+ [Lucene syntax query examples for building advanced queries](search-query-lucene-examples.md)
+ [How full text search works in Azure AI Search](search-lucene-query-architecture.md)
+ [Simple query syntax](query-simple-syntax.md)
+ [Full Lucene query syntax](query-lucene-syntax.md)
+ [Filter syntax](search-query-odata-filter.md)
