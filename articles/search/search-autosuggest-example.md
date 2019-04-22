---
title: 'Autosuggest example for adding dropdown terms to a search box - Azure Search'
description: Add suggested query inputs by creating suggesters and formulating requests that invoke suggested queries in Azure Search. 
manager: cgronlun
author: heidisteen
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 03/22/2019
ms.author: heidist
---

# Example: Add autosuggest for dropdown query selections

Search term inputs can include a dropdown list of suggested query terms. You've seen this capability in commercial search engines, and you can implement a similar experience in Azure Search using a [suggester construct](index-add-suggesters.md) and a suggestions operation on a query request. This article uses examples to demonstrate the formulation of an autosuggest query, using a suggester that you've already defined. 

## REST API

You can use [Postman](search-fiddler.md) or [PowerShell](search-create-index-rest-api.md) and the [REST API](https://docs.microsoft.com/rest/api/searchservice/) to try out this example, but the results will be returned as JSON documents. A more realistic and visual experience can be found using the [sample code for autocomplete](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToAutocomplete).

### 1 - Index with a suggester construct

Autosuggest begins with a [suggester construct](index-add-suggesters.md) added to an index, composed of fields that contribute dropdown values. Given the following schema, suggested queries will be formulated using values from the hotelName and category fields.

Assuming the minimal sample datasets found in quickstarts, hotel names include "Fancy Stay" and "Roach motel", and categories include "Luxury" and "Budget".

If you already have the hotels index, you should drop and recreate it using the following schema. This schema adds a suggester. Remember to reload the data as well.

```json
{
    "name": "hotels",  
    "fields": [
        {"name": "hotelId", "type": "Edm.String", "key": true, "searchable": false, "sortable": false, "facetable": false},
        {"name": "baseRate", "type": "Edm.Double"},
        {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
        {"name": "description_fr", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.lucene"},
        {"name": "hotelName", "type": "Edm.String", "facetable": false},
        {"name": "category", "type": "Edm.String"},
        {"name": "tags", "type": "Collection(Edm.String)"},
        {"name": "parkingIncluded", "type": "Edm.Boolean", "sortable": false},
        {"name": "smokingAllowed", "type": "Edm.Boolean", "sortable": false},
        {"name": "lastRenovationDate", "type": "Edm.DateTimeOffset"},
        {"name": "rating", "type": "Edm.Int32"},
        {"name": "location", "type": "Edm.GeographyPoint"}
    ],
  "suggesters": [
    {
      "name": "sg",
      "searchMode": "analyzingInfixMatching",
      "sourceFields": ["hotelName", "category"]
    }
  ]
}

```

### 2 - Query with suggestions operator

To use a suggester and invoke autosuggest, you must send a [Suggestions API](https://docs.microsoft.com/rest/api/searchservice/suggestions) request using GET or POST. On such a request, the search service scans for potential matches once the first three characters are received. 

In the request header, set **api-key** to an admin or query key, and **Content-Type** to application/json. 

```http
GET https://mydemo.search.windows.net/indexes/hotels/docs/suggest?search=fan&&suggesterName=sg
```

The request scans all fields included in the suggester (hotelName and category), returning the following response:

```
{
    "@odata.context": "https://mydemo.search.windows.net/indexes('hotels')/$metadata#docs(*)",
    "value": [
        {
            "@search.text": "Fancy Stay",
            "hotelId": "1"
        }
    ]
}
```

To deliver the expected outcome, your client code would render the results as dropdown list under a search bar.

## .NET SDK (C#)

### 1 - Index with a suggester construct

In the .NET SDK, use a [Suggester class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.suggester?view=azure-dotnet). Suggester is a collection but it can only take one item.

```csharp
private static void CreateHotelsIndex(SearchServiceClient serviceClient)
{
    var definition = new Index()
    {
        Name = "hotels",
        Fields = FieldBuilder.BuildForType<Hotel>(),
        Suggesters = new List<Suggester>() {new Suggester()
            {
                Name = "sg",
                SourceFields = new string[] { "HotelId", "Category" }
            }}
    };

    serviceClient.Indexes.Create(definition);

}
```

### 2 - Query with Suggest method

The [DocumentsOperationsExtensions.Suggest method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions.suggest?view=azure-dotnet) is used to return suggested query strings.

```csharp
public ActionResult Suggest(bool highlights, bool fuzzy, string term)
{
    InitSearch();

    // Call suggest API and return results
    SuggestParameters sp = new SuggestParameters()
    {
        UseFuzzyMatching = fuzzy,
        Top = 5
    };

    if (highlights)
    {
        sp.HighlightPreTag = "<b>";
        sp.HighlightPostTag = "</b>";
    }

    DocumentSuggestResult suggestResult = _indexClient.Documents.Suggest(term, "sg",sp);

    // Convert the suggest query results to a list that can be displayed in the client.
    List<string> suggestions = suggestResult.Results.Select(x => x.Text).ToList();
    return new JsonResult
    {
        JsonRequestBehavior = JsonRequestBehavior.AllowGet,
        Data = suggestions
    };
}
```

## See also

+ [Explore REST API using Postman](search-fiddler.md)
+ [Example: Autocomplete](search-autocomplete-tutorial.md)
+ [Add suggesters to an index](index-add-suggesters.md)
+ [Add a Suggesters class using .NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.suggester?view=azure-dotnet)
+ [Call suggestions using GET or POST (REST API)](https://docs.microsoft.com/rest/api/searchservice/suggestions)
+ [Call suggestions using SuggestWithHttpMessagesAsync (.NET)](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.suggestwithhttpmessagesasync?view=azure-dotnet-preview) or 