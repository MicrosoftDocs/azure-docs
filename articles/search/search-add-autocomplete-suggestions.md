---
title: Autocomplete or typeahead
titleSuffix: Azure Cognitive Search
description: Enable search-as-you-type query actions in Azure Cognitive Search by creating suggesters and queries that autocomplete a search string with finished terms or phrases. You can also return suggested matches.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/03/2023

---

# Add autocomplete and search suggestions in client apps

Search-as-you-type is a common technique for improving query productivity. In Azure Cognitive Search, this experience is supported through *autocomplete*, which finishes a term or phrase based on partial input (completing "micro" with "microsoft"). A second user experience is *suggestions*, or a short list of matching documents (returning book titles with an ID so that you can link to a detail page about that book). Both autocomplete and suggestions are predicated on a match in the index. The service won't offer queries that return zero results.

To implement these experiences in Azure Cognitive Search:

+ Add a `suggester` to an index schema
+ Build a query that calls the [Autocomplete](/rest/api/searchservice/autocomplete) or [Suggestions](/rest/api/searchservice/suggestions) API on the request.
+ Add a UI control to handle search-as-you-type interactions in your client app. We recommend using an existing JavaScript library for this purpose.

In Azure Cognitive Search, autocompleted queries and suggested results are retrieved from the search index, from selected fields that you have registered with a suggester. A suggester is part of the index, and it specifies which fields will provide content that either completes a query, suggests a result, or does both. When the index is created and loaded, a suggester data structure is created internally to store prefixes used for matching on partial queries. For suggestions, choosing suitable fields that are unique, or at least not repetitive, is essential to the experience. For more information, see [Create a suggester](index-add-suggesters.md).

The remainder of this article is focused on queries and client code. It uses JavaScript and C# to illustrate key points. REST API examples are used to concisely present each operation. For end-to-end code samples, see [Next steps](#next-steps).

## Set up a request

Elements of a request include one of the search-as-you-type APIs, a partial query, and a suggester. The following script illustrates components of a request, using the Autocomplete REST API as an example.

```http
POST /indexes/myxboxgames/docs/autocomplete?search&api-version=2020-06-30
{
  "search": "minecraf",
  "suggesterName": "sg"
}
```

The "suggesterName" gives you the suggester-aware fields used to complete terms or suggestions. For suggestions in particular, the field list should be composed of those that offer clear choices among matching results. On a site that sells computer games, the field might be the game title.

The "search" parameter provides the partial query, where characters are fed to the query request through the jQuery Autocomplete control. In the above example, "minecraf" is a static illustration of what the control might have passed in.

The APIs do not impose minimum length requirements on the partial query; it can be as little as one character. However, jQuery Autocomplete provides a minimum length. A minimum of two or three characters is typical.

Matches are on the beginning of a term anywhere in the input string. Given "the quick brown fox", both autocomplete and suggestions will match on partial versions of "the", "quick", "brown", or "fox" but not on partial infix terms like "rown" or "ox". Furthermore, each match sets the scope for downstream expansions. A partial query of "quick br" will match on "quick brown" or "quick bread", but neither "brown" or "bread" by themselves would be match unless "quick" precedes them.

### APIs for search-as-you-type

Follow these links for the REST and .NET SDK reference pages:

+ [Suggestions REST API](/rest/api/searchservice/suggestions) 
+ [Autocomplete REST API](/rest/api/searchservice/autocomplete) 
+ [SuggestAsync method](/dotnet/api/azure.search.documents.searchclient.suggestasync)
+ [AutocompleteAsync method](/dotnet/api/azure.search.documents.searchclient.autocompleteasync)

## Structure a response

Responses for autocomplete and suggestions are what you might expect for the pattern: [Autocomplete](/rest/api/searchservice/autocomplete#response) returns a list of terms, [Suggestions](/rest/api/searchservice/suggestions#response) returns terms plus a document ID so that you can fetch the document (use the [Lookup Document](/rest/api/searchservice/lookup-document) API to fetch the specific document for a detail page).

Responses are shaped by the parameters on the request:

+ For Autocomplete, set the [autocompleteMode](/rest/api/searchservice/autocomplete#query-parameters) to determine whether text completion occurs on one or two terms. 

+ For Suggestions, set [$select](/rest/api/searchservice/suggestions#query-parameters) to return fields containing unique or differentiating values, such as names and description. Avoid fields that contain duplicate values (such as a category or city).

The following additional parameters apply to both autocomplete and suggestions, but are perhaps more necessary for suggestions, especially when a suggester includes multiple fields.

| Parameter | Usage |
|-----------|-------|
| searchFields | Constrain the query to specific fields. |
| $filter | Apply match criteria on the result set (`$filter=Category eq 'ActionAdventure'`). |
| $top | Limit the results to a specific number (`$top=5`).|

## Add user interaction code

Auto-filling a query term or dropping down a list of matching links requires user interaction code, typically JavaScript, that can consume requests from external sources, such as autocomplete or suggestion queries against an Azure Search Cognitive index.

Although you could write this code natively, it's much easier to use functions from existing JavaScript library, such as one of the following. 

+ [Autocomplete widget (jQuery UI)](https://jqueryui.com/autocomplete/) appears in the Suggestion code snippet. You can create a search box, and then reference it in a JavaScript function that uses the Autocomplete widget. Properties on the widget set the source (an autocomplete or suggestions function), minimum length of input characters before action is taken, and positioning.

+ [XDSoft Autocomplete plug-in](https://xdsoft.net/jqplugins/autocomplete/) appears in the Autocomplete code snippet.

+ [suggestions](https://www.npmjs.com/package/suggestions) appears in the [JavaScript tutorial](tutorial-javascript-overview.md) and code sample.

Use these libraries in the client to create a search box supporting both suggestions and autocomplete. Inputs collected in the search box can then be paired with suggestions and autocomplete actions on the search service.

## Suggestions

This section walks you through an implementation of suggested results, starting with the search box definition. It also shows how and script that invokes the first JavaScript autocomplete library referenced in this article.

### Create a search box

Assuming the [jQuery UI Autocomplete library](https://jqueryui.com/autocomplete/) and an MVC project in C#, you could define the search box using JavaScript in the **Index.cshtml** file. The library adds the search-as-you-type interaction to the search box by making asynchronous calls to the MVC controller to retrieve suggestions.

In **Index.cshtml** under the folder \Views\Home, a line to create a search box might be as follows:

```html
<input class="searchBox" type="text" id="searchbox1" placeholder="search">
```

This example is a simple input text box with a class for styling, an ID to be referenced by JavaScript, and placeholder text.  

Within the same file, embed JavaScript that references the search box. The following function calls the Suggest API, which requests suggested matching documents based on partial term inputs:

```javascript
$(function () {
    $("#searchbox1").autocomplete({
        source: "/home/suggest?highlights=false&fuzzy=false&",
        minLength: 3,
        position: {
            my: "left top",
            at: "left-23 bottom+10"
        }
    });
});
```

The `source` tells the jQuery UI Autocomplete function where to get the list of items to show under the search box. Since this project is an MVC project, it calls the **Suggest** function in **HomeController.cs** that contains the logic for returning query suggestions. This function also passes a few parameters to control highlights, fuzzy matching, and term. The autocomplete JavaScript API adds the term parameter.

The `minLength: 3` ensures that recommendations will only be shown when there are at least three characters in the search box.

### Enable fuzzy matching

Fuzzy search allows you to get results based on close matches even if the user misspells a word in the search box. The edit distance is 1, which means there can be a maximum discrepancy of one character between the user input and a match. 

```javascript
source: "/home/suggest?highlights=false&fuzzy=true&",
```

### Enable highlighting

Highlighting applies font style to the characters in the result that correspond to the input. For example, if the partial input is "micro", the result would appear as **micro**soft, **micro**scope, and so forth. Highlighting is based on the HighlightPreTag and HighlightPostTag parameters, defined inline with the Suggestion function.

```javascript
source: "/home/suggest?highlights=true&fuzzy=true&",
```

### Suggest function

If you are using C# and an MVC application, **HomeController.cs** file under the Controllers directory is where you might create a class for suggested results. In .NET, a Suggest function is based on the [SuggestAsync method](/dotnet/api/azure.search.documents.searchclient.suggestasync). For more information about the .NET SDK, see [How to use Azure Cognitive Search from a .NET Application](search-howto-dotnet-sdk.md).

The `InitSearch` method creates an authenticated HTTP index client to the Azure Cognitive Search service. Properties on the [SuggestOptions](/dotnet/api/azure.search.documents.suggestoptions) class determine which fields are searched and returned in the results, the number of matches, and whether fuzzy matching is used. 

For autocomplete, fuzzy matching is limited to one edit distance (one omitted or misplaced character). Note that fuzzy matching in autocomplete queries can sometimes produce unexpected results depending on index size and how it's sharded. For more information, see [partition and sharding concepts](search-capacity-planning.md#concepts-search-units-replicas-partitions-shards).

```csharp
public async Task<ActionResult> SuggestAsync(bool highlights, bool fuzzy, string term)
{
    InitSearch();

    var options = new SuggestOptions()
    {
        UseFuzzyMatching = fuzzy,
        Size = 8,
    };

    if (highlights)
    {
        options.HighlightPreTag = "<b>";
        options.HighlightPostTag = "</b>";
    }

    // Only one suggester can be specified per index.
    // The suggester for the Hotels index enables autocomplete/suggestions on the HotelName field only.
    // During indexing, HotelNames are indexed in patterns that support autocomplete and suggested results.
    var suggestResult = await _searchClient.SuggestAsync<Hotel>(term, "sg", options).ConfigureAwait(false);

    // Convert the suggest query results to a list that can be displayed in the client.
    List<string> suggestions = suggestResult.Value.Results.Select(x => x.Text).ToList();

    // Return the list of suggestions.
    return new JsonResult(suggestions);
}
```

The SuggestAsync function takes two parameters that determine whether hit highlights are returned or fuzzy matching is used in addition to the search term input. Up to eight matches can be included in suggested results. The method creates a [SuggestOptions object](/dotnet/api/azure.search.documents.suggestoptions), which is then passed to the Suggest API. The result is then converted to JSON so it can be shown in the client.

## Autocomplete

So far, the search UX code has been centered on suggestions. The next code block shows autocomplete, using the XDSoft jQuery UI Autocomplete function, passing in a request for Azure Cognitive Search autocomplete. As with the suggestions, in a C# application, code that supports user interaction goes in **index.cshtml**.

```javascript
$(function () {
    // using modified jQuery Autocomplete plugin v1.2.8 https://xdsoft.net/jqplugins/autocomplete/
    // $.autocomplete -> $.autocompleteInline
    $("#searchbox1").autocompleteInline({
        appendMethod: "replace",
        source: [
            function (text, add) {
                if (!text) {
                    return;
                }

                $.getJSON("/home/autocomplete?term=" + text, function (data) {
                    if (data && data.length > 0) {
                        currentSuggestion2 = data[0];
                        add(data);
                    }
                });
            }
        ]
    });

    // complete on TAB and clear on ESC
    $("#searchbox1").keydown(function (evt) {
        if (evt.keyCode === 9 /* TAB */ && currentSuggestion2) {
            $("#searchbox1").val(currentSuggestion2);
            return false;
        } else if (evt.keyCode === 27 /* ESC */) {
            currentSuggestion2 = "";
            $("#searchbox1").val("");
        }
    });
});
```

### Autocomplete function

Autocomplete is based on the [AutocompleteAsync method](/dotnet/api/azure.search.documents.searchclient.autocompleteasync). As with suggestions, this code block would go in the **HomeController.cs** file.

```csharp
public async Task<ActionResult> AutoCompleteAsync(string term)
{
    InitSearch();

    // Setup the autocomplete parameters.
    var ap = new AutocompleteOptions()
    {
        Mode = AutocompleteMode.OneTermWithContext,
        Size = 6
    };
    var autocompleteResult = await _searchClient.AutocompleteAsync(term, "sg", ap).ConfigureAwait(false);

    // Convert the autocompleteResult results to a list that can be displayed in the client.
    List<string> autocomplete = autocompleteResult.Value.Results.Select(x => x.Text).ToList();

    return new JsonResult(autocomplete);
}
```

The Autocomplete function takes the search term input. The method creates an [AutoCompleteParameters object](/rest/api/searchservice/autocomplete). The result is then converted to JSON so it can be shown in the client.

## Next steps

The following tutorial demonstrates a search-as-you-type experience.

> [!div class="nextstepaction"]
> [Add search to a web site (JavaScript)](tutorial-javascript-search-query-integration.md#azure-function-suggestions-from-the-catalog) 
