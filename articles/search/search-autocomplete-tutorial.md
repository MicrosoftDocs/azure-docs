---
title: 'Tutorial for adding auto-complete to your search box using Azure Search | Microsoft Docs'
description: Examples of how to improve the end user experience of your data-centric applications using Azure Search auto-complete and suggestions APIs. 
manager: pablocas
author: mrcarter8
services: search
ms.service: search
ms.devlang: NA
ms.topic: tutorial
ms.date: 07/11/2018
ms.author: mcarter
#Customer intent: As a developer, I want to understand auto-complete implementation, benefits, and tradeoffs.
---

# Tutorial: Add auto-complete to your search box using Azure Search

In this tutorial, you'll learn how to use [suggestions](https://docs.microsoft.com/rest/api/searchservice/suggestions), [auto-complete](https://docs.microsoft.com/rest/api/searchservice/autocomplete) and [facets](search-faceted-navigation.md) in the [Azure Search REST API](https://docs.microsoft.com/rest/api/searchservice/) and [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions?view=azure-dotnet) to build a powerful search box. *Suggestions* provide recommendations of actual results based on what the user has typed so far. *Auto-complete*, [a new preview feature](search-api-preview.md) in Azure Search, provides terms from the index to complete what the user is currently typing. We'll compare multiple techniques to improve user productivity and quickly and easily find what they are looking for by bringing the richness of search directly to the user as they type.

This tutorial walks you through an ASP.NET MVC-based application that uses C# to call the [Azure Search .NET client libraries](https://aka.ms/search-sdk), and JavaScript to call the Azure Search REST API directly. The application for this tutorial targets an index populated the [NYCJobs](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs) sample data. You can either use the index already configured in NYC Jobs demo, or populate your own index using a data loader in the NYCJobs sample solution. The sample uses the [jQuery UI](https://jqueryui.com/autocomplete/) and [XDSoft](https://xdsoft.net/jqplugins/autocomplete/) JavaScript libraries to build a search box that supports auto-complete. Using these components along with Azure Search, you'll see multiple examples of how to support auto-complete with type-ahead in your search box.

You'll perform the following tasks:

> [!div class="checklist"]
> * Download and configure the solution
> * Add search service information to application settings
> * Implement a search input box
> * Add support for an auto-complete list that pulls from a remote source 
> * Retrieve suggestions and auto-complete using the .Net SDK and REST API
> * Support client-side caching to improve performance 

## Prerequisites

* Visual Studio 2017. You can use the free [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). 

* Download the sample [source code](https://github.com/azure-samples/search-dotnet-getting-started) for the tutorial.

* (Optional) An active Azure account and an Azure Search service. If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/). For help with service provisioning, see [Create a search service](search-create-service-portal.md). The account and service are optional because this tutorial can be completed using a hosted NYCJobs index already in place for a different demo.

* (Optional) Download [NYCJobs](https://github.com/Azure-Samples/search-dotnet-asp-net-mvc-jobs) sample code to import the NYCJobs data into an index on your own Azure Search service.

> [!Note]
> If you are using the free Azure Search service, you are limited to three indexes. The NYCJobs data loader creates two indexes. Make sure you have room on your service to accept the new indexes.

### Set up Azure Search (Optional)

Follow the steps in this section if you would like to import the data for the NYCJobs sample application into your own index. This step is optional.  If you would like to use the sample index provided, skip ahead to the next section, running the sample.

1. In the DataLoader folder of the NYCJobs sample code, open the DataLoader.sln solution file in Visual Studio.

1. Update the connection information for your Azure Search service.  Open the App.config within the DataLoader project and change the TargetSearchServiceName and TargetSearchServiceApiKey appSettings to reflect your Azure Search service and Azure Search Service API Key.  These can be found in the Azure portal.

1. Press F5 to launch the application.  This will create 2 indexes and import the NYCJob sample data.

1. In the tutorial sample code, open the AutocompleteTutorial.sln solution file in Visual Studio.  Open up Web.config within the AutocompleteTutorial project and change the SearchServiceName and SearchServiceApiKey values to the same as above.

### Running the sample

You are now ready to run the tutorial sample application.  Open the AutocompleteTutorial.sln solution file in Visual Studio to run the tutorial.  The solution contains an ASP.NET MVC project.  Press F5 to run the project and load the page in your browser of choice.  At the top, you'll see an option to select C# or JavaScript.  The C# option calls into the HomeController from the browser and uses the Azure Search .Net SDK to retrieve results.  The JavaScript option calls the Azure Search REST API directly from the browser.  This option will typically have noticably better performance since it takes the controller out of the flow.  You can choose the option that suits your needs and language preferences.  There are several auto-complete examples on the page with some guidance for each.  Each example has some recommended sample text you can try.  Try typing in a few letters in each search box to see what happens.

## How this works in code

Now that you have seen the examples in the browser, let's walk through the first example in detail to review the components involved and how they work.

### Search box

For either language choice, the search box is exactly the same.  Open the Index.cshtml file under the folder \Views\Home. The search box itself is simple:

```html
<input class="searchBox" type="text" id="example1a" placeholder="search">
```

This is a simple input text box with a class for styling, an id to be referenced by JavaScript, and placeholder text.  The magic is in the javascript.

### JavaScript code (C#)

The C# language sample uses JavaScript in Index.cshtml to leverage the jQuery UI Autocomplete library.  This library adds the auto-complete experience to the search box by making asynchronous calls to the MVC controller to retrieve recommendations.  Let's look at the JavaScript code for the first example:

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

This code runs in the browser on page load to configure auto-complete for the "example1a" input box.  `minLength: 3` ensures that recommendations will only be shown when there are at least three characters in the search box.  The source value is important:

```javascript
source: "/home/suggest?highlights=false&fuzzy=false&",
```

This line tells the auto-complete API where to get the list of items to show under the search box.  Since this is an MVC project, it calls the Suggest function in HomeController.cs.  We'll look at that more in the next section.  It also passes a few parameters to control highlights, fuzzy matching, and term.  The auto-complete JavaScript API adds the term parameter.

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

1. The first thing you might notice is a method at the top of the class called InitSearch.  This creates an authenticated HTTP index client to the Azure Search service.  If you would like to learn more about how this works, visit the following tutorial: [How to use Azure Search from a .NET Application](https://docs.microsoft.com/azure/search/search-howto-dotnet-sdk)

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

The other examples on the page follow the same pattern to add hit highlighting, type-ahead for auto-complete recommendations, and facets to support client-side caching of the auto-complete results.  Review each of these to understand how they work and how to leverage them in your search experience.

### JavaScript language example

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

If you compare this to the example above that calls the Home controller, you'll notice several similarities.  The auto-complete configuration for `minLength` and `position` are exactly the same.  The significant change here is the source.  Instead of calling the Suggest method in the home controller, a REST request is created in a JavaScript function and executed using ajax.  The response is then processed in "success" and used as the source.

## Takeaways

This tutorial demonstrates the basic steps for building a search box that supports auto-complete and suggestions.  You saw how you could build an ASP.NET MVC application and use either the Azure Search .Net SDK or REST API to retrieve suggestions.

## Next steps

Integrate suggestions and auto-complete into your search experience.  Consider how using the .Net SDK or the REST API directly can help bring the power of Azure Search to your users as they type to make them more productive.

> [!div class="nextstepaction"]
> [Autocomplete REST API](https://docs.microsoft.com/rest/api/searchservice/autocomplete)
> [Suggestions REST API](https://docs.microsoft.com/rest/api/searchservice/suggestions)
> [Facets index attribute on a Create Index REST API](https://docs.microsoft.com/rest/api/searchservice/create-index)

