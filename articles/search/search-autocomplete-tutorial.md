---
title: 'Add suggestions and autocomplete in a search box - Azure Search'
description: Enable typeahead query actions in Azure Search by creating suggesters and formulating requests that fill in a search box with completed terms or phrases. 
manager: pablocas
author: mrcarter8
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: mcarter
ms.custom: seodec2018
#Customer intent: As a developer, I want to understand autocomplete implementation, benefits, and tradeoffs.
---

# Add suggestions or autocomplete to your Azure Search application

In this article, learn how to use [suggestions](https://docs.microsoft.com/rest/api/searchservice/suggestions) and [autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete) to build a powerful search box that supports search-as-you-type behaviors.

+ *Suggestions* are suggested results generated as you type, where each suggestion is a single result from the index that matches what you've typed so far. 

+ *Autocomplete* "finishes" the word or phrase that a user is currently typing. Instead of returning results, it completes a query, which you can then execute to return results. As with suggestions, a completed word or phrase in a query is predicated on a match in the index. The service won't offer queries that return zero results in the index.

You can download and run the sample code in **DotNetHowToAutocomplete** to evaluate these features. The sample code targets a prebuilt index populated with [NYCJobs demo data](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs). The NYCJobs index contains a [Suggester construct](index-add-suggesters.md), which is a requirement for using either suggestions or autocomplete. You can use the prepared index hosted in a sandbox service, or [populate your own index](#configure-app) using a data loader in the NYCJobs sample solution. 

The **DotNetHowToAutocomplete** sample demonstrates both suggestions and autocomplete, in both C# and JavaScript language versions. C# developers can step through an ASP.NET MVC-based application that uses the [Azure Search .NET SDK](https://aka.ms/search-sdk). The logic for making autocomplete and suggested query calls can be found in the HomeController.cs file. JavaScript developers will find equivalent query logic in IndexJavaScript.cshtml, which includes direct calls to the [Azure Search REST API](https://docs.microsoft.com/rest/api/searchservice/). 

For both language versions, the front-end user experience is based on the [jQuery UI](https://jqueryui.com/autocomplete/) and [XDSoft](https://xdsoft.net/jqplugins/autocomplete/) libraries. We use these libraries to build the search box supporting both suggestions and autocomplete. Inputs collected in the search box are paired with suggestions and autocomplete actions, such as those as defined in HomeController.cs or IndexJavaScript.cshtml.

This exercise walks you through the following tasks:

> [!div class="checklist"]
> * Implement a search input box in JavaScript and issue requests for suggested matches or autocompleted terms
> * In C#, define suggestions and autocomplete actions in HomeController.cs
> * In JavaScript, call the REST APIs directly to provide the same functionality

## Prerequisites

An Azure Search service is optional for this exercise because the solution uses a live sandbox service hosting a prepared NYCJobs demo index. If you want to run this example on your own search service, see [Configure NYC Jobs index](#configure-app) for instructions.

* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/), any edition. Sample code and instructions were tested on the free Community edition.

* Download the [DotNetHowToAutoComplete sample](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToAutocomplete).

The sample is comprehensive, covering suggestions, autocomplete, faceted navigation, and client-side caching. Review the readme and comments for a full description of what the sample offers.

## Run the sample

1. Open **AutocompleteTutorial.sln** in Visual Studio. The solution contains an ASP.NET MVC project with a connection to the NYC Jobs demo index.

2. Press F5 to run the project and load the page in your browser of choice.

At the top, you'll see an option to select C# or JavaScript. The C# option calls into the HomeController from the browser and uses the Azure Search .NET SDK to retrieve results. 

The JavaScript option calls the Azure Search REST API directly from the browser. This option will typically have noticeably better performance since it takes the controller out of the flow. You can choose the option that suits your needs and language preferences. There are several autocomplete examples on the page with some guidance for each. Each example has some recommended sample text you can try.  

Try typing in a few letters in each search box to see what happens.

## Search box

For both C# and JavaScript versions, the search box implementation is exactly the same. 

Open the **Index.cshtml** file under the folder \Views\Home to view the code:

```html
<input class="searchBox" type="text" id="example1a" placeholder="search">
```

This example is a simple input text box with a class for styling, an ID to be referenced by JavaScript, and placeholder text.  The magic is in the embedded JavaScript.

The C# language sample uses JavaScript in Index.cshtml to leverage the [jQuery UI Autocomplete library](https://jqueryui.com/autocomplete/). This library adds the autocomplete experience to the search box by making asynchronous calls to the MVC controller to retrieve suggestions. The JavaScript language version is in IndexJavaScript.cshtml. It includes the script below for the search bar, as well as REST API calls to Azure Search.

Let's look at the JavaScript code for the first example, which calls jQuery UI Autocomplete function, passing in a request for suggestions:

```javascript
$(function () {
    $("#example1a").autocomplete({
        source: "/home/suggest?highlights=false&fuzzy=false&",
        minLength: 3,
        position: {
            my: "left top",
            at: "left-23 bottom+10"
        }
    });
});
```

The above code runs in the browser on page load to configure jQuery UI autocomplete for the "example1a" input box.  `minLength: 3` ensures that recommendations will only be shown when there are at least three characters in the search box.  The source value is important:

```javascript
source: "/home/suggest?highlights=false&fuzzy=false&",
```

The above line tells the jQuery UI Autocomplete function where to get the list of items to show under the search box. Since this project is an MVC project, it calls the Suggest function in HomeController.cs that contains the logic for returning query suggestions (more about Suggest in the next section). This function also passes a few parameters to control highlights, fuzzy matching, and term. The autocomplete JavaScript API adds the term parameter.

### Extending the sample to support fuzzy matching

Fuzzy search allows you to get results based on close matches even if the user misspells a word in the search box. While not required, it significantly improves the robustness of a typeahead experience. Let's try this out by changing the source line to enable fuzzy matching.

Change the following line from this:

```javascript
source: "/home/suggest?highlights=false&fuzzy=false&",
```

to this:

```javascript
source: "/home/suggest?highlights=false&fuzzy=true&",
```

Launch the application by pressing F5.

Try typing something like "execative" and notice how results come back for "executive", even though they are not an exact match to the letters you typed.

### jQuery Autocomplete  backed by Azure Search autocomplete

So far, the search UX code has been centered on the suggestions. The next code block shows the jQuery UI Autocomplete function (line 91 in index.cshtml), passing in a request for Azure Search autocomplete:

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

## C# example

Now that we have reviewed the JavaScript code for the web page, let's look at the C# server-side controller code that actually retrieves the suggested matches using the Azure Search .NET SDK.

Open the **HomeController.cs** file under the Controllers directory. 

The first thing you might notice is a method at the top of the class called `InitSearch`. This method creates an authenticated HTTP index client to the Azure Search service. For more information, see [How to use Azure Search from a .NET Application](https://docs.microsoft.com/azure/search/search-howto-dotnet-sdk).

On line 41, notice the Suggest function. It is based on the [DocumentsOperationsExtensions.Suggest method](/dotnet/api/microsoft.azure.search.documentsoperationsextensions.suggest?view=azure-dotnet).

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

On line 69, notice the Autocomplete function. It is based on the [DocumentsOperationsExtensions.Autocomplete method](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions.autocomplete?view=azure-dotnet).

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

## JavaScript example

A Javascript implementation of autocomplete and suggestions calls the REST API, using a URI as the source to specify the index and operation. 

To review the JavaScript implementation, open **IndexJavaScript.cshtml**. Notice that the jQuery UI Autocomplete function is also used for the search box, collecting search term inputs and making asynchronous calls to Azure Search to retrieve suggested matches or completed terms. 

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

<a name="configure-app"></a>

## Configure NYCJobs to run on your service

Until now, you've been using the hosted NYCJobs demo index. If you want full visibility into all of the code, including the index, follow these instructions to create and load the index in your own search service.

1. [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this example. 

   > [!Note]
   > If you are using the free Azure Search service, you are limited to three indexes. The NYCJobs data loader creates two indexes. Make sure you have room on your service to accept the new indexes.

1. Download [NYCJobs](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs) sample code.

1. In the DataLoader folder of the NYCJobs sample code, open **DataLoader.sln** in Visual Studio.

1. Add the connection information for your Azure Search service. Open the App.config within the DataLoader project and change the TargetSearchServiceName and TargetSearchServiceApiKey appSettings to reflect your Azure Search service and Azure Search Service API Key. This information can be found in the Azure portal.

1. Press F5 to launch the application, creating two indexes and importing the NYCJob sample data.

1. Open **AutocompleteTutorial.sln** and edit the Web.config in the **AutocompleteTutorial** project. Change the SearchServiceName and SearchServiceApiKey values to values that are valid for your search service.

1. Press F5 to run the application. The sample web app opens in the default browser. The experience is identical to the sandbox version, only the index and data are hosted on your service.

## Next steps

This example demonstrates the basic steps for building a search box that supports autocomplete and suggestions. You saw how you could build an ASP.NET MVC application and use either the Azure Search .NET SDK or REST API to retrieve suggestions.

As a next step, trying integrating suggestions and autocomplete into your search experience. The following reference articles should help.

> [!div class="nextstepaction"]
> [Autocomplete REST API](https://docs.microsoft.com/rest/api/searchservice/autocomplete)
> [Suggestions REST API](https://docs.microsoft.com/rest/api/searchservice/suggestions)
> [Facets index attribute on a Create Index REST API](https://docs.microsoft.com/rest/api/searchservice/create-index)

