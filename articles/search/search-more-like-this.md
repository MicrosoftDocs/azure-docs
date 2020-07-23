---
title: moreLikeThis (preview) query feature
titleSuffix: Azure Cognitive Search
description: Describes the moreLikeThis (preview) feature, which is available in preview versions of the Azure Cognitive Search REST API.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# moreLikeThis (preview) in Azure Cognitive Search

> [!IMPORTANT] 
> This feature is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2020-06-30-Preview](search-api-preview.md) provides this feature. There is currently no portal or .NET SDK support.

`moreLikeThis=[key]` is a query parameter in the [Search Documents API](https://docs.microsoft.com/rest/api/searchservice/search-documents) that finds documents similar to the document specified by the document key. When a search request is made with `moreLikeThis`, a query is generated with search terms extracted from the given document that describe that document best. The generated query is then used to make the search request. By default, the contents of all searchable fields are considered, minus any restricted fields that you specified using the `searchFields` parameter. The `moreLikeThis` parameter cannot be used with the search parameter, `search=[string]`.

By default, the contents of all top-level searchable fields are considered. If you want to specify particular fields instead, you can use the `searchFields` parameter. 

You cannot use `MoreLikeThis` on searchable sub-fields in a [complex type](search-howto-complex-data-types.md).

## Examples

All following examples use the hotels sample from [Quickstart: Create a search index in the Azure portal](search-get-started-portal.md).

### Simple query

The following query finds documents whose description fields are most similar to the field of the source document as specified by the `moreLikeThis` parameter:

```
GET /indexes/hotels-sample-index/docs?moreLikeThis=29&searchFields=Description&api-version=2020-06-30-Preview
```

In this example, the request searches for hotels similar to the one with `HotelId` 29.
Rather than using HTTP GET, you can also invoke `MoreLikeThis` using HTTP POST:

```
POST /indexes/hotels-sample-index/docs/search?api-version=2020-06-30-Preview
    {
      "moreLikeThis": "29",
      "searchFields": "Description"
    }
```

### Apply filters

`MoreLikeThis` can be combined with other common query parameters like `$filter`. For instance, the query can be restricted to only hotels whose category is 'Budget' and where the rating is higher than 3.5:

```
GET /indexes/hotels-sample-index/docs?moreLikeThis=20&searchFields=Description&$filter=(Category eq 'Budget' and Rating gt 3.5)&api-version=2020-06-30-Preview
```

### Select fields and limit results

The `$top` selector can be used to limit how many results should be returned in a `MoreLikeThis` query. Also, fields can be selected with `$select`. Here the top three hotels are selected along with their ID, Name, and Rating: 

```
GET /indexes/hotels-sample-index/docs?moreLikeThis=20&searchFields=Description&$filter=(Category eq 'Budget' and Rating gt 3.5)&$top=3&$select=HotelId,HotelName,Rating&api-version=2020-06-30-Preview
```

## Next steps

You can use any web testing tool to experiment with this feature.  We recommend using Postman for this exercise.

> [!div class="nextstepaction"]
> [Explore Azure Cognitive Search REST APIs using Postman](search-get-started-postman.md)
