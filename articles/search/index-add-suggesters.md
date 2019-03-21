---
title: Add typeahead queries to an index - Azure Search
description: Enable type-ahead query actions in Azure Search by creating suggesters and formulating requests that invoke autocomplete or autosuggested query terms.
ms.date: 03/22/2019
services: search
ms.service: search
ms.topic: conceptual

author: "Brjohnstmsft"
ms.author: "brjohnst"
ms.manager: cgronlun
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
# Add suggesters to an index for typeahead in Azure Search

A **suggester** is a construct in an [Azure Search index](search-what-is-an-index.md) that supports a "search-as-you-type" experience. It contains a list of fields for which you want to enable typeahead query inputs. There are two typeahead variants: one that completes the term or phrase you are typing, and another that provides suggested terms or phrases. You are undoubtedly familiar with these behaviors in commercial search engines.

![Visual comparison of autocomplete and autosuggest](./media/index-add-suggesters/visual-comparison-suggest-complete.png "Visual comparison of autocomplete and autosuggest")

To implement these behaviors in Azure Search, there is an index and query component. In the index, add a suggester. On the query, specify either an autosuggest or autocomplete action:

+ [Autosuggested queries](search-autosuggest-example.md) are terms or phrases drawn from certain fields in the index. 

+ [Autocompleted queries](search-autocomplete-tutorial.md) (in preview) finishes a partial term input with a completed term retrieved from certain fields in the index.

Typeahead support is enabled on a per-field basis. You can implement both typeahead behaviors within the same search solution if you want an experience similar to the one indicated in the screenshot. Both requests target the *documents* collection of specific index and responses are returned after a user has provided at least a three character input string.

## Create a suggester

Although a suggester has several properties, it is primarily a collection of fields for which you are enabling a typeahead experience. For example, a travel app might want to enable typeahead search on destinations, cities, and attractions. As such, all three fields would go in the fields collection.

To create a suggester, add one to an index schema. You can have one suggester in an index (specifically, one suggester in the suggesters collection). 

+ In the REST API, you can add suggesters through [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) or 
[Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index). 

+ In the .NET SDK, use a [Suggester class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.suggester?view=azure-dotnet).

Key points to notice about suggesters is that there is a name (suggesters are referenced by name on a request), a searchMode (currently just one, "analyzingInfixMatching"), and the list of fields for which typeahead is enabled. 

Choosing fields is important. You should specify only those fields that lend themselves to an expected and appropriate response, whether its a completed string in a search bar or a dropdown list. A hotel name is a good candidate because it has precision. Verbose fields like descriptions and comments, or numeric fields like rating, are either too dense or too sparse for this feature. Similarly, repetitive fields, such as categories and tags, are less effective, but we included "category" anyway to demonstrate that you can include multiple fields.

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
After a suggester is created, add the [Suggestions API](https://docs.microsoft.com/rest/api/searchservice/suggestions) in your query logic to invoke the feature.

### Property reference

Properties that define a **suggester** include the following:

|Property      |Description      |
|--------------|-----------------|
|`name`        |The name of the **suggester**. You use the name of the **suggester** when calling the [Suggestions &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/suggestions).|
|`searchMode`  |The strategy used to search for candidate phrases. The only mode currently supported is `analyzingInfixMatching`, which performs flexible matching of phrases at the beginning or in the middle of sentences.|
|`sourceFields`|A list of one or more fields that are the source of the content for suggestions. Only fields of type `Edm.String` and `Collection(Edm.String)` may be sources for suggestions. Only fields that don't have a custom language analyzer set can be used. |

### Index rebuilds for existing fields

Suggesters contain fields, and if you are adding a suggester to an existing index or changing its field composition, you will most likely have to rebuild the index.

| Action | Impact |
|--------|--------|
| Create new fields and create a new suggester simultaneously in the same update | Least impact. If an index contains previously added fields, the addition of new fields and a new suggester has no impact on existing fields. |
| Add pre-existing fields to a suggester | High impact. Adding a field changes the field definition, necessitating a [full rebuild](search-howto-reindex.md).|

## Use a suggester

As previously noted, you can use a suggester for autosuggest, autocomplete, or both. A suggester is referenced in the body of a request if you are making a POST REST call. On a GET REST call, specify either `suggest` or `autocomplete` on the documents collection.

For REST, after a suggester is created, use the [Suggestions API](https://docs.microsoft.com/rest/api/searchservice/suggestions) or the [Autocomplete API (preview)](https://docs.microsoft.com/rest/api/searchservice/autocomplete) in your query logic.

For .NET, use [SuggestWithHttpMessagesAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.suggestwithhttpmessagesasync?view=azure-dotnet-preview) or [AutocompleteWithHttpMessagesAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.autocompletewithhttpmessagesasync?view=azure-dotnet-preview&viewFallbackFrom=azure-dotnet).

## Sample code

The [DotNetHowToAutocomplete](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToAutocomplete) sample contains both C# and Java code, and demonstrates a suggester construction, autosuggest, autocomplete, and facet navigation. 

It uses a sandbox Azure Search service and a pre-loaded index so all you have to do is press F5 to run it. No subscription or sign in necessary.

## Next steps

Review the following examples to see how the requests are formulated:

+ [Autosuggested query example](search-autosuggest-example.md) 
+ [Autocompleted query example (preview)](search-autocomplete-tutorial.md) 
