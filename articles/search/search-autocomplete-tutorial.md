---
title: 'Example showing autocomplete and suggested queries for typeahead in a search box - Azure Search'
description: Enable typeahead query actions in Azure Search by creating suggesters and formulating requests that fill in a search box with completed terms or phrases. 
manager: pablocas
author: mrcarter8
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 03/22/2019
ms.author: mcarter
ms.custom: seodec2018
#Customer intent: As a developer, I want to understand autocomplete implementation, benefits, and tradeoffs.
---

# Example: Add Suggestions or Autocomplete query inputs in Azure Search

In this example, you'll learn how to use [suggestions](https://docs.microsoft.com/rest/api/searchservice/suggestions), [autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete) and [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions?view=azure-dotnet) to build a powerful search box. 

+ *Suggestions* provides a dropdown list of suggested queries. 
+ *Autocomplete*, [a new preview feature](search-api-preview.md), "finishes" the word or phrase that a user is currently typing. 

Sample code targets an index populated the [NYCJobs](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs) sample data. You can either use the index already configured in NYC Jobs demo, or populate your own index using a data loader in the NYCJobs sample solution. 

This example walks you through an ASP.NET MVC-based application that uses C# to call the [Azure Search .NET client libraries](https://aka.ms/search-sdk), and JavaScript to call the Azure Search REST API directly. 

The sample uses the [jQuery UI](https://jqueryui.com/autocomplete/) and [XDSoft](https://xdsoft.net/jqplugins/autocomplete/) JavaScript libraries to build a search box that supports autocomplete. Using these components along with Azure Search, you'll see multiple examples of how to support suggestions and autocomplete with typeahead in your search box.

This exercise demonstrates the following features:

> [!div class="checklist"]
> * Implement a search input box in JavaScript
> * Add autocomplete to "finish" query inputs using terms and phrases found in the index.
> * Add suggested queries to provide a selection of potential query inputs using terms and phrases found in the index.
> * Support client-side caching to improve performance 

## Prerequisites

An Azure Search service is optional for this exercise because the solution uses a sandbox service and a pre-built index. If you want to run this example on your own search service, see [Configure NYC Jobs index to run on your service](#configure-app) for instrutions.

* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/), any edition. Sample code and instructions were tested on the free Community edition.

* Download the [DotNetHowToAutoComplete sample](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToAutocomplete).

The sample is comprehensive, covering suggestions, autocomplete, faceted navigation, and client-side caching. You should review the readme and comments for a full description of what the sample offers.

## Run the sample

1. Open **AutocompleteTutorial.sln** in Visual Studio. The solution contains an ASP.NET MVC project.

2. Press F5 to run the project and load the page in your browser of choice.

At the top, you'll see an option to select C# or JavaScript. The C# option calls into the HomeController from the browser and uses the Azure Search .NET SDK to retrieve results. 

The JavaScript option calls the Azure Search REST API directly from the browser. This option will typically have noticeably better performance since it takes the controller out of the flow. You can choose the option that suits your needs and language preferences. There are several autocomplete examples on the page with some guidance for each. Each example has some recommended sample text you can try.  

Try typing in a few letters in each search box to see what happens.

## How this works in code

Now that you have seen the examples in the browser, let's walk through the first example in detail to review the components involved and how they work.

### Search box

For either language choice, the search box is exactly the same.  Open the Index.cshtml file under the folder \Views\Home. The search box itself is simple:

```html
<input class="searchBox" type="text" id="example1a" placeholder="search">
```

This is a simple input text box with a class for styling, an ID to be referenced by JavaScript, and placeholder text.  The magic is in the javascript.

### JavaScript code (C#)

The C# language sample uses JavaScript in Index.cshtml to leverage the jQuery UI Autocomplete library.  This library adds the autocomplete experience to the search box by making asynchronous calls to the MVC controller to retrieve recommendations.  Let's look at the JavaScript code for the first example:

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

This code runs in the browser on page load to configure autocomplete for the "example1a" input box.  `minLength: 3` ensures that recommendations will only be shown when there are at least three characters in the search box.  The source value is important:

```javascript
source: "/home/suggest?highlights=false&fuzzy=false&",
```

This line tells the autocomplete API where to get the list of items to show under the search box.  Since this is an MVC project, it calls the Suggest function in HomeController.cs.  We'll look at that more in the next section.  It also passes a few parameters to control highlights, fuzzy matching, and term.  The autocomplete JavaScript API adds the term parameter.

#### Extending the sample to support fuzzy matching

Fuzzy search allows you to get results based on close matches even if the user misspells a word in the search box.  Let's try this out by changing the source line to enable fuzzy matching.

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

### HomeController.cs (C#)

Now that we have reviewed the JavaScript code for the sample, let's look at the C# controller code that actually retrieves the recommendations using the Azure Search .NET SDK.

1. Open the file HomeController.cs under the Controllers directory. 

1. The first thing you might notice is a method at the top of the class called InitSearch.  This creates an authenticated HTTP index client to the Azure Search service.  If you would like to learn more about how this works, visit the following example: [How to use Azure Search from a .NET Application](https://docs.microsoft.com/azure/search/search-howto-dotnet-sdk)

1. Move to the Suggest function.

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

The Suggest function takes two parameters that determine whether hit highlights are returned or fuzzy matching is used in addition to the search term input.  The method creates a SuggestParameters object, which is then passed to the Suggest API. The result is then converted to JSON so it can be shown in the client.
(Optional) Add a breakpoint to the start of the Suggest function and step through the code.  Note the response returned by the SDK and how it is converted to the result returned from the method.

The other examples on the page follow the same pattern to add hit highlighting, type-ahead for autocomplete recommendations, and facets to support client-side caching of the autocomplete results.  Review each of these to understand how they work and how to leverage them in your search experience.

### JavaScript language example (autocomplete)

For the JavaScript language example, the JavaScript code in IndexJavaScript.cshtml page leverages the jQuery UI Autocomplete.  This is a library that does most of the heavy lifting in presenting a nice looking search box and makes it easy to make asynchronous calls to Azure Search to retrieve recommendations.  Let's look at the JavaScript code for the first example:

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

If you compare this to the example above that calls the Home controller, you'll notice several similarities.  The autocomplete configuration for `minLength` and `position` are exactly the same.  The significant change here is the source.  Instead of calling the Suggest method in the home controller, a REST request is created in a JavaScript function and executed using Ajax.  The response is then processed in "success" and used as the source.

<a name="configure-app"></a>

## Configure NYC Jobs index to run on your service

This section provides instructions for importing the data for the NYCJobs sample application into your own index.

1. [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this example. 

   > [!Note]
   > If you are using the free Azure Search service, you are limited to three indexes. The NYCJobs data loader creates two indexes. Make sure you have room on your service to accept the new indexes.

1. Download [NYCJobs](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs) sample code to import the NYCJobs data into an index on your own Azure Search service.

1. In the DataLoader folder of the NYCJobs sample code, open the **DataLoader.sln** solution file in Visual Studio.

1. Update the connection information for your Azure Search service. Open the App.config within the DataLoader project and change the TargetSearchServiceName and TargetSearchServiceApiKey appSettings to reflect your Azure Search service and Azure Search Service API Key.  These can be found in the Azure portal.

1. Press F5 to launch the application.  This will create 2 indexes and import the NYCJob sample data.

1. In the example sample code, open the AutocompleteTutorial.sln solution file in Visual Studio.  Open up Web.config within the AutocompleteTutorial project and change the SearchServiceName and SearchServiceApiKey values to the same as above.

## Takeaways

This example demonstrates the basic steps for building a search box that supports autocomplete and suggestions.  You saw how you could build an ASP.NET MVC application and use either the Azure Search .NET SDK or REST API to retrieve suggestions.

## Next steps

Integrate suggestions and autocomplete into your search experience.  Consider how using the .NET SDK or the REST API directly can help bring the power of Azure Search to your users as they type to make them more productive.

> [!div class="nextstepaction"]
> [Autocomplete REST API](https://docs.microsoft.com/rest/api/searchservice/autocomplete)
> [Suggestions REST API](https://docs.microsoft.com/rest/api/searchservice/suggestions)
> [Facets index attribute on a Create Index REST API](https://docs.microsoft.com/rest/api/searchservice/create-index)

