---
title: Add autocomplete and suggestions in a search box
titleSuffix: Azure Cognitive Search
description: Enable search-as-you-type query actions in Azure Cognitive Search by creating suggesters and formulating requests that autocomplete a search box with finished terms or phrases. You can also return suggested matches.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/15/2020
---

# Add autocomplete and suggestions to client apps

Search-as-you-type is a common technique for improving the productivity of user-initiated queries. In Azure Cognitive Search, this experience is supported through *autocomplete*, which finishes a term or phrase based on partial input (completing "micro" with "microsoft"). Another form is *suggestions*: a short list of matching documents (returning book titles with an ID so that you can link to a detail page). Both autocomplete and suggestions are predicated on a match in the index. The service won't offer queries that return zero results.

To implement these experiences in Azure Cognitive Search, you will need:

+ A *suggester* on the back end.
+ A *query* specifying [Autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete) or [Suggestions](https://docs.microsoft.com/rest/api/searchservice/suggestions) API on the request.
+ A *UI control* to handle search-as-you-type interactions in your client app. We recommend using an existing JavaScript library for this purpose.

In Azure Cognitive Search, autocompleted queries and suggested results are retrieved from the search index, from selected fields that you have registered with a suggester. A suggester is part of the index, and it specifies which fields will provide content that either completes a query, suggests a result, or does both. When the index is created and loaded, a suggester data structure is created internally to store prefixes used for matching on partial queries. For suggestions, choosing suitable fields that are unique, or at least not repetitive, is essential to the experience. For more information, see [Create a suggester](index-add-suggesters.md).

The remainder of this article is focused on queries and client code. It uses JavaScript and C# to illustrate key points. REST API examples are used to concisely present each operation. For links to end-to-end code samples, see [Next steps](#next-steps).

## Set up a request

Elements of a request include one of the search-as-you-type APIs, a partial query, and a suggester. The following script illustrates components of a request, using the Autocomplete REST API as an example.

```http
POST /indexes/myxboxgames/docs/autocomplete?search&api-version=2019-05-06
{
  "search": "minecraf",
  "suggesterName": "sg"
}
```

The **suggesterName** gives you the suggester-aware fields used to complete terms or suggestions. For suggestions in particular, the field list should be composed of those that offer clear choices among matching results. On a site that sells computer games, the field might be the game title.

The **search** parameter provides the partial query, where characters are fed to the query request through the jQuery Autocomplete control. In the above example, "minecraf" is a static illustration of what the control might have passed in.

The APIs do not impose minimum length requirements on the partial query; it can be as little as one character. However, jQuery Autocomplete provides a minimum length. A minimum of two or three characters is typical.

Matches are on the beginning of a term anywhere in the input string. Given "the quick brown fox", both autocomplete and suggestions will match on partial versions of "the", "quick", "brown", or "fox" but not on partial infix terms like "rown" or "ox". Furthermore, each match sets the scope for downstream expansions. A partial query of "quick br" will match on "quick brown" or "quick bread", but neither "brown" or "bread" by themselves would be match unless"quick" precedes them.

### APIs for search-as-you-type

Follow these links for the REST and .NET SDK reference pages:

+ [Suggestions REST API](https://docs.microsoft.com/rest/api/searchservice/suggestions) 
+ [Autocomplete REST API](https://docs.microsoft.com/rest/api/searchservice/autocomplete) 
+ [SuggestWithHttpMessagesAsync method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.suggestwithhttpmessagesasync?view=azure-dotnet)
+ [AutocompleteWithHttpMessagesAsync method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.autocompletewithhttpmessagesasync?view=azure-dotnet&viewFallbackFrom=azure-dotnet)

## Structure a response

Responses for autocomplete and suggestions are what you might expect for the pattern: [Autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete#response) returns a list of terms, [Suggestions](https://docs.microsoft.com/rest/api/searchservice/suggestions#response) returns terms plus a document ID so that you can fetch the document (use the [Lookup Document](https://docs.microsoft.com/rest/api/searchservice/lookup-document) API to fetch the specific document for a detail page).

Responses are shaped by the parameters on the request. For Autocomplete, set [**autocompleteMode**](https://docs.microsoft.com/rest/api/searchservice/autocomplete#autocomplete-modes) to determine whether text completion occurs on one or two terms. For Suggestions, the field you choose determines the contents of the response.

For suggestions, you should further refine the response to avoid duplicates or what appears to be unrelated results. To control results, include more parameters on the request. The following parameters apply to both autocomplete and suggestions, but are perhaps more necessary for suggestions, especially when a suggester includes multiple fields.

| Parameter | Usage |
|-----------|-------|
| **$select** | If you have multiple **sourceFields** in a suggester, use **$select** to choose which field contributes values (`$select=GameTitle`). |
| **searchFields** | Constrain the query to specific fields. |
| **$filter** | Apply match criteria on the result set (`$filter=Category eq 'ActionAdventure'`). |
| **$top** | Limit the results to a specific number (`$top=5`).|

## Add user interaction code

Auto-filling a query term or dropping down a list of matching links requires user interaction code, typically JavaScript, that can consume requests from external sources, such as autocomplete or suggestion queries against an Azure Search Cognitive index.

Although you could write this code natively, it's much easier to use functions from existing JavaScript library. This article demonstrates two, one for suggestions and another for autocomplete. 

+ [Autocomplete widget (jQuery UI)](https://jqueryui.com/autocomplete/) is used in the Suggestion example. You can create a search box, and then reference it in a JavaScript function that uses the Autocomplete widget. Properties on the widget set the source (an autocomplete or suggestions function), minimum length of input characters before action is taken, and positioning.

+ [XDSoft Autocomplete plug-in](https://xdsoft.net/jqplugins/autocomplete/) is used the Autocomplete example.

We use these libraries to build the search box supporting both suggestions and autocomplete. Inputs collected in the search box are paired with suggestions and autocomplete actions.

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

If you are using C# and an MVC application, **HomeController.cs** file under the Controllers directory is where you might create a class for suggested results. In .NET, a Suggest function is based on the [DocumentsOperationsExtensions.Suggest method](/dotnet/api/microsoft.azure.search.documentsoperationsextensions.suggest?view=azure-dotnet).

The `InitSearch` method creates an authenticated HTTP index client to the Azure Cognitive Search service. For more information about the .NET SDK, see [How to use Azure Cognitive Search from a .NET Application](https://docs.microsoft.com/azure/search/search-howto-dotnet-sdk).

```csharp
public ActionResult Suggest(bool highlights, bool fuzzy, string term)
{
    InitSearch();

    // Call suggest API and return results
    SuggestParameters sp = new SuggestParameters()
    {
        Select = HotelName,
        SearchFields = HotelName,
        UseFuzzyMatching = fuzzy,
        Top = 5
    };

    if (highlights)
    {
        sp.HighlightPreTag = "<b>";
        sp.HighlightPostTag = "</b>";
    }

    DocumentSuggestResult resp = _indexClient.Documents.Suggest(term, "sg", sp);

    // Convert the suggest query results to a list that can be displayed in the client.
    List<string> suggestions = resp.Results.Select(x => x.Text).ToList();
    return new JsonResult
    {
        JsonRequestBehavior = JsonRequestBehavior.AllowGet,
        Data = suggestions
    };
}
```

The Suggest function takes two parameters that determine whether hit highlights are returned or fuzzy matching is used in addition to the search term input. The method creates a [SuggestParameters object](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.suggestparameters?view=azure-dotnet), which is then passed to the Suggest API. The result is then converted to JSON so it can be shown in the client.

## Autocomplete

So far, the search UX code has been centered on suggestions. The next code block shows autocomplete, using the XDSoft jQuery UI Autocomplete function, passing in a request for Azure Cognitive Search autocomplete. As with the suggestions, in a C# application, code that supports user interaction goes in **index.cshtml**.

```javascript
$(function () {
    // using modified jQuery Autocomplete plugin v1.2.6 https://xdsoft.net/jqplugins/autocomplete/
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

Autocomplete is based on the [DocumentsOperationsExtensions.Autocomplete method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions.autocomplete?view=azure-dotnet). As with suggestions, this code block would go in the **HomeController.cs** file.

```csharp
public ActionResult AutoComplete(string term)
{
    InitSearch();
    //Call autocomplete API and return results
    AutocompleteParameters ap = new AutocompleteParameters()
    {
        AutocompleteMode = AutocompleteMode.OneTermWithContext,
        UseFuzzyMatching = false,
        Top = 5
    };
    AutocompleteResult autocompleteResult = _indexClient.Documents.Autocomplete(term, "sg", ap);

    // Convert the Suggest results to a list that can be displayed in the client.
    List<string> autocomplete = autocompleteResult.Results.Select(x => x.Text).ToList();
    return new JsonResult
    {
        JsonRequestBehavior = JsonRequestBehavior.AllowGet,
        Data = autocomplete
    };
}
```

The Autocomplete function takes the search term input. The method creates an [AutoCompleteParameters object](https://docs.microsoft.com/rest/api/searchservice/autocomplete). The result is then converted to JSON so it can be shown in the client.

## Next steps

Follow these links for end-to-end instructions or code demonstrating both search-as-you-type experiences. Both code examples include hybrid implementations of suggestions and autocomplete together.

+ [Tutorial: Create your first app in C# (lesson 3)](tutorial-csharp-type-ahead-and-suggestions.md)
+ [C# code sample: azure-search-dotnet-samples/create-first-app/3-add-typeahead/](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/create-first-app/3-add-typeahead)
+ [C# and JavaScript with REST side-by-side code sample](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToAutocomplete)