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

Search-as-you-type is a common technique for improving the productivity of user-initiated queries. In Azure Cognitive Search, this experience is supported through *Autocomplete*, which finishes a term or phrase based on partial input (completing "micro" with "microsoft"). Another form is *Suggestions*: a short list of matching documents (returning book titles that link to a detail page for that book). Both autocomplete and suggestions are predicated on a match in the index. The service won't offer queries that return zero results.

To implement these experiences in Azure Cognitive Search, you will need:

+ A *suggester* on the back end.
+ A query that includes the Autocomplete or Suggestions API on the request.
+ A *UI control* that handles auto-completed text inputs and outputs in your client app. You could use the [jQuery Autocomplete widget](https://jqueryui.com/autocomplete/) or an equivalent control for this purpose.

In Azure Cognitive Search, autocompleted queries and suggested results are retrieved from the search index, from selected fields that you have registered with a suggester. A suggester is part of the index, and it specifies which fields will provide content that either completes a query, suggests a result, or does both. When the index is created and loaded, a suggester data structure is created internally to store prefixes used for matching on partial queries. For suggestions, choosing suitable fields that are unique, or at least not repetitive, is essential to the experience. For more information, see [Create a suggester](index-add-suggesters.md).

The remainder of this article is focused on queries and client code.

## Set up a request

Elements of a request include the API ([Autocomplete REST](https://docs.microsoft.com/rest/api/searchservice/autocomplete) or [Suggestion REST](https://docs.microsoft.com/rest/api/searchservice/suggestions)), a partial query, and a suggester.

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

## Structure a response

Responses for autocomplete and suggestions are what you might expect for the pattern: [Autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete#response) returns a list of terms, [Suggestions](https://docs.microsoft.com/rest/api/searchservice/suggestions#response) returns terms plus a document ID so that you can fetch the document (use the [Lookup Document](https://docs.microsoft.com/rest/api/searchservice/lookup-document) API to fetch the specific document for a detail page).

Responses are shaped by the parameters on the request. For Autocomplete, set [**autocompleteMode**](https://docs.microsoft.com/rest/api/searchservice/autocomplete#autocomplete-modes) to determine whether text completion occurs on one or two terms. For Suggestions, the field you choose determines the contents of the response.

To further refine the response, include more parameters on the request. The following parameters apply to both Autocomplete and Suggestions.

| Parameter | Usage |
|-----------|-------|
| **$select** | If you have multiple **sourceFields**, use **$select** to choose which field contributes values (`select=GameTitle`). |
| **$filter** | Apply match criteria on the result set. (`filter=ActionAdventure`). |
| **$top** | Limit the results to a specific number (`top=5`).|

## Add user interaction code

Auto-filling a query term or dropping down a list of matching links requires user interaction code, typically JavaScript, that can consume requests from external sources, such as autocomplete or suggestion queries against an Azure Search Cognitive index.

The [jQuery UI](https://jqueryui.com) library is helpful for this task. You can create a searchbox, and then reference it in a JavaScript that function that uses the Autocomplete widget. Properties on the widget set the source (an autocomplete or suggestions request), minimum length of input characters before action is taken, and positioning.

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

The `source` tells the jQuery UI Autocomplete function where to get the list of items to show under the search box. Since this project is an MVC project, it calls the Suggest function in HomeController.cs that contains the logic for returning query suggestions (more about Suggest in the next section). This function also passes a few parameters to control highlights, fuzzy matching, and term. The autocomplete JavaScript API adds the term parameter.

The `minLength: 3` ensures that recommendations will only be shown when there are at least three characters in the search box. 

<!-- ## About the sample

C# developers can step through an ASP.NET MVC-based application that uses the [Azure Cognitive Search .NET SDK](https://aka.ms/search-sdk).
The front-end user experience is based on the [jQuery UI](https://jqueryui.com/autocomplete/) and [XDSoft](https://xdsoft.net/jqplugins/autocomplete/) libraries. We use these libraries to build the search box supporting both suggestions and autocomplete. Inputs collected in the search box are paired with suggestions and autocomplete actions, such as those as defined in HomeController.cs.

1. Open **AutocompleteTutorial.sln** in Visual Studio. The solution contains an ASP.NET MVC project with a connection to an existing search service and index.

1. If you want to run this program, update the NuGet Packages first:

   1. In Solution Explorer, right-click **DotNetHowToAutoComplete** and select **Manage NuGet Packages**.  
   1. Select the **Updates** tab, select all packages, and click **Update**. Accept any license agreements. More than one pass might be required to update all of the packages.

1. Press F5 to run the project and load the page in a browser.

At the top, you'll see an option to select C# or JavaScript. 

The C# option calls into the HomeController from the browser and uses the Azure Cognitive Search .NET SDK to retrieve results. --> 

### Support fuzzy matching on suggestions

Fuzzy search allows you to get results based on close matches even if the user misspells a word in the search box. The edit distance is 1, which means there can be a maximum discrepancy of one character between the user input and a match. Use the **fuzzy** parameter on the Suggest API to enable fuzzy matching:

```javascript
source: "/home/suggest?highlights=false&fuzzy=true&",
```

### Add a control (jQuery Autocomplete backed by Azure Cognitive Search autocomplete)

So far, the search UX code has been centered on the suggestions. The next code block shows the jQuery UI Autocomplete function (line 91 in index.cshtml), passing in a request for Azure Cognitive Search autocomplete:

```javascript
$(function () {
    // using modified jQuery Autocomplete plugin v1.2.6 https://xdsoft.net/jqplugins/autocomplete/
    // $.autocomplete -> $.autocompleteInline
    $("#example2").autocompleteInline({
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
    $("#example2").keydown(function (evt) {
        if (evt.keyCode === 9 /* TAB */ && currentSuggestion2) {
            $("#example2").val(currentSuggestion2);
            return false;
        } else if (evt.keyCode === 27 /* ESC */) {
            currentSuggestion2 = "";
            $("#example2").val("");
        }
    });
});
```

### Suggest function in C#

In an MVC application, **HomeController.cs** file under the Controllers directory is where you might create a class for suggested results. In .NET, a Suggest function is based on the [DocumentsOperationsExtensions.Suggest method](/dotnet/api/microsoft.azure.search.documentsoperationsextensions.suggest?view=azure-dotnet).

The `InitSearch` method creates an authenticated HTTP index client to the Azure Cognitive Search service. For more information, see [How to use Azure Cognitive Search from a .NET Application](https://docs.microsoft.com/azure/search/search-howto-dotnet-sdk).

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

### Autocomplete function in C#

Autocomplete is based on the [DocumentsOperationsExtensions.Autocomplete method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions.autocomplete?view=azure-dotnet).

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

    // Conver the Suggest results to a list that can be displayed in the client.
    List<string> autocomplete = autocompleteResult.Results.Select(x => x.Text).ToList();
    return new JsonResult
    {
        JsonRequestBehavior = JsonRequestBehavior.AllowGet,
        Data = autocomplete
    };
}
```

The Autocomplete function takes the search term input. The method creates an [AutoCompleteParameters object](https://docs.microsoft.com/rest/api/searchservice/autocomplete). The result is then converted to JSON so it can be shown in the client.

(Optional) Add a breakpoint to the start of the Suggest function and step through the code. Notice the response returned by the SDK and how it is converted to the result returned from the method.

The other examples on the page follow the same pattern to add hit highlighting and facets to support client-side caching of the autocomplete results. Review each of these to understand how they work and how to leverage them in your search experience.

<!-- ## JavaScript example

A JavaScript implementation of autocomplete and suggestions calls the REST API, using a URI as the source to specify the index and operation. 

To review the JavaScript implementation, open **IndexJavaScript.cshtml**. Notice that the jQuery UI Autocomplete function is also used for the search box, collecting search term inputs and making asynchronous calls to Azure Cognitive Search to retrieve suggested matches or completed terms. 

Let's look at the JavaScript code for the first example:

```javascript
$(function () {
    $("#example1a").autocomplete({
        source: function (request, response) {
        $.ajax({
            type: "POST",
            url: suggestUri,
            dataType: "json",
            headers: {
                "api-key": searchServiceApiKey,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                top: 5,
                fuzzy: false,
                suggesterName: "sg",
                search: request.term
            }),
                success: function (data) {
                    if (data.value && data.value.length > 0) {
                        response(data.value.map(x => x["@@search.text"]));
                    }
                }
            });
        },
        minLength: 3,
        position: {
            my: "left top",
            at: "left-23 bottom+10"
        }
    });
});
```

If you compare this example to the example above that calls the Home controller, you'll notice several similarities.  The autocomplete configuration for `minLength` and `position` are exactly the same. 

The significant change here is the source. Instead of calling the Suggest method in the home controller, a REST request is created in a JavaScript function and executed using Ajax. The response is then processed in "success" and used as the source.

REST calls use URIs to specify whether an [Autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete) or [Suggestions](https://docs.microsoft.com/rest/api/searchservice/suggestions) API call is being made. The following URIs are on lines 9 and 10, respectively.

```javascript
var suggestUri = "https://" + searchServiceName + ".search.windows.net/indexes/" + indexName + "/docs/suggest?api-version=" + apiVersion;
var autocompleteUri = "https://" + searchServiceName + ".search.windows.net/indexes/" + indexName + "/docs/autocomplete?api-version=" + apiVersion;
```

On line 148, you can find a script that calls the `autocompleteUri`. The first call to `suggestUri` is on line 39.

> [!Note]
> Making REST calls to the service in JavaScript is offered here as a convenient demonstration of the REST API, but should not be construed as a best practice or recommendation. The inclusion of an API key and endpoint in a script opens your service up to denial of service attacks to anyone who can read those values off the script. While its safe to use JavaScript for learning purposes, perhaps on indexes hosted on the free service, we recommend using Java or C# for indexing and query operations in production code.

## Test with Postman and REST APIs

For rudimentary testing of the Autocomplete or Suggestions APIs, you can use Postman to send HTTP requests that call the REST APIs. The advantage of this approach is that you can call the APIs without having to write any prior code. The responses provide helpful information if you are undecided about source fields for the suggester or analyzers on the fields. A sample index and queries can be found at [Azure-Search-Postman-Samples](https://github.com/Azure-Samples/azure-search-postman-samples). -->

<!-- 

   You can test with Postman to get a better understanding of how each API behaves. Each request is standalone, which means you have to manually send each request to mimic a search-as-you-type response: "w" <send>, "wo" <send>, "wol" <send>, "wolf" <send>. In an actual client app, you would use jQuery Autocomplete or an equivalent library to capture the input.
 -->

## Next steps

As a next step, trying integrating suggestions and autocomplete into your search experience. The following reference articles should help.

+ [Suggestions REST API](https://docs.microsoft.com/rest/api/searchservice/suggestions) 
+ [Autocomplete REST API](https://docs.microsoft.com/rest/api/searchservice/autocomplete) 
+ [SuggestWithHttpMessagesAsync method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.suggestwithhttpmessagesasync?view=azure-dotnet)
+ [AutocompleteWithHttpMessagesAsync method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations.autocompletewithhttpmessagesasync?view=azure-dotnet&viewFallbackFrom=azure-dotnet)