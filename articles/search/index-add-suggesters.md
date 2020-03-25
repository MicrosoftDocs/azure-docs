---
title: Add typeahead queries to an index
titleSuffix: Azure Cognitive Search
description: Enable type-ahead query actions in Azure Cognitive Search by creating suggesters and formulating requests that invoke autocomplete or autosuggested query terms.

manager: nitinme
author: Brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# Add suggesters to an index for typeahead in Azure Cognitive Search

In Azure Cognitive Search, "search-as-you-type" or typeahead functionality is based on a **suggester** construct that you add to a [search index](search-what-is-an-index.md). It's a list of one or more fields for which you want typeahead enabled.

A suggester supports two typeahead variants: *autocomplete*, which completes the term or phrase you are typing, and *suggestions* that return a short list of matching documents.  

The following screenshot, from the [Create your first app in C#](tutorial-csharp-type-ahead-and-suggestions.md) sample, illustrates typeahead. Autocomplete anticipates what the user might type into the search box. Actual input is "tw", which autocomplete finishes with "in", resolving as "twin" as the prospective search term. Suggestions are visualized in the dropdown list. For suggestions, you can surface any part of a document that best describes the result. In this example, the suggestions are hotel names. 

![Visual comparison of autocomplete and suggested queries](./media/index-add-suggesters/hotel-app-suggestions-autocomplete.png "Visual comparison of autocomplete and suggested queries")

To implement these behaviors in Azure Cognitive Search, there is an index and query component. 

+ In the index, add a suggester to an index. You can use the portal, [REST API](https://docs.microsoft.com/rest/api/searchservice/create-index), or [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.suggester?view=azure-dotnet). The remainder of this article is focused on creating a suggester. 

+ In the query request, call one of the [APIs listed below](#how-to-use-a-suggester).

Search-as-you-type support is enabled on a per-field basis. You can implement both typeahead behaviors within the same search solution if you want an experience similar to the one indicated in the screenshot. Both requests target the *documents* collection of specific index and responses are returned after a user has provided at least a three character input string.

## Create a suggester

Although a suggester has several properties, it is primarily a collection of fields for which you are enabling a typeahead experience. For example, a travel app might want to enable typeahead search on destinations, cities, and attractions. As such, all three fields would go in the fields collection.

To create a suggester, add one to an index schema. You can have one suggester in an index (specifically, one suggester in the suggesters collection). 

### When to create a suggester

The best time to create a suggester is when you are also creating the field definition itself.

If you try to create a suggester using pre-existing fields, the API will disallow it. Typeahead text is created during indexing, when partial terms in two or more character combinations are tokenized alongside whole terms. Given that existing fields are already tokenized, you will have to rebuild the index if you want to add them to a suggester. For more information about reindexing, see [How to rebuild an Azure Cognitive Search index](search-howto-reindex.md).

### Create using the REST API

In the REST API, add suggesters through [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) or 
[Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index). 

  ```json
  {
    "name": "hotels",
    "fields": [
      . . .
    ],
    "suggesters": [
      {
        "name": "sg",
        "searchMode": "analyzingInfixMatching",
        "sourceFields": ["hotelName", "category"]
      }
    ],
    "scoringProfiles": [
      . . .
    ]
  }
  ```


### Create using the .NET SDK

In C#, define a [Suggester object](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.suggester?view=azure-dotnet). `Suggesters` is a collection but it can only take one item. 

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

### Property reference

|Property      |Description      |
|--------------|-----------------|
|`name`        |The name of the suggester.|
|`searchMode`  |The strategy used to search for candidate phrases. The only mode currently supported is `analyzingInfixMatching`, which performs flexible matching of phrases at the beginning or in the middle of sentences.|
|`sourceFields`|A list of one or more fields that are the source of the content for suggestions. Fields must be of type `Edm.String` and `Collection(Edm.String)`. If an analyzer is specified on the field, it must be a named analyzer from [this list](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.analyzername?view=azure-dotnet) (not a custom analyzer).<p/>As a best practice, specify only those fields that lend themselves to an expected and appropriate response, whether it's a completed string in a search bar or a dropdown list.<p/>A hotel name is a good candidate because it has precision. Verbose fields like descriptions and comments are too dense. Similarly, repetitive fields, such as categories and tags, are less effective. In the examples, we include "category" anyway to demonstrate that you can include multiple fields. |

### Analyzer restrictions for sourceFields in a suggester

Azure Cognitive Search analyzes the field content to enable querying on individual terms. Suggesters require prefixes to be indexed in addition to complete terms, which requires additional analysis over the source fields. Custom analyzer configurations can combine any of the various tokenizers and filters, often in ways that would make producing the prefixes required for suggestions impossible. For this reason, Azure Cognitive Search prevents fields with custom analyzers from being included in a suggester.

> [!NOTE] 
>  If you need to work around the above limitation, use two separate fields for the same content. This will allow one of the fields to have a suggester, while the other can be set up with a custom analyzer configuration.

<a name="how-to-use-a-suggester"></a>

## Use a suggester in a query

After a suggester is created, call the appropriate API in your query logic to invoke the feature. 

+ [Suggestions REST API](https://docs.microsoft.com/rest/api/searchservice/suggestions) 
+ [Autocomplete REST API](https://docs.microsoft.com/rest/api/searchservice/autocomplete) 
+ [SuggestWithHttpMessagesAsync method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.suggestwithhttpmessagesasync?view=azure-dotnet)
+ [AutocompleteWithHttpMessagesAsync method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.autocompletewithhttpmessagesasync?view=azure-dotnet&viewFallbackFrom=azure-dotnet)

API usage is illustrated in the following call to the Autocomplete REST API. There are two takeaways from this example. First, as with all queries, the operation is against the documents collection of an index. Second, you can add query parameters. While many query parameters are common to both APIs, the list is different for each one.

```http
GET https://[service name].search.windows.net/indexes/[index name]/docs/autocomplete?[query parameters]  
api-key: [admin or query key]
```

If a suggester is not defined in the index, a call to autocomplete or suggestions will fail.

## Sample code

+ [Create your first app in C#](tutorial-csharp-type-ahead-and-suggestions.md) sample demonstrates a suggester construction, suggested queries, autocomplete, and faceted navigation. This code sample runs on a sandbox Azure Cognitive Search service and uses a pre-loaded Hotels index so all you have to do is press F5 to run the application. No subscription or sign-in is necessary.

+ [DotNetHowToAutocomplete](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToAutocomplete) is an older sample containing both C# and Java code. It also demonstrates a suggester construction, suggested queries, autocomplete, and faceted navigation. This code sample uses the hosted [NYCJobs](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs) sample data. 


## Next steps

We recommend the following example to see how the requests are formulated.

> [!div class="nextstepaction"]
> [Suggestions and autocomplete examples](search-autocomplete-tutorial.md) 
