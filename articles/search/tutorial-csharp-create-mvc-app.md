---
title: Add search to ASP.NET Core MVC
titleSuffix: Azure AI Search
description: In this Azure AI Search tutorial, learn how to add search to an ASP.NET Core (Model-View-Controller) application.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: csharp
ms.topic: tutorial
ms.date: 03/09/2023
---
# Create a search app in ASP.NET Core

In this tutorial, create a basic ASP.NET Core (Model-View-Controller) app that runs in localhost and connects to the hotels-sample-index on your search service. In this tutorial, you'll learn to:

> [!div class="checklist"]
> + Create a basic search page
> + Filter results
> + Sort results

This tutorial puts the focus on server-side operations called through the [Search APIs](/dotnet/api/overview/azure/search.documents-readme). Although it's common to sort and filter in client-side script, knowing how to invoke these operations on the server gives you more options when designing the search experience.

Sample code for this tutorial can be found in the [azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/main/create-mvc-app) repository on GitHub. 

## Prerequisites

+ [Visual Studio](https://visualstudio.microsoft.com/downloads/)
+ [Azure.Search.Documents NuGet package](https://www.nuget.org/packages/Azure.Search.Documents/)
+ [Azure AI Search](search-create-service-portal.md) <sup>1</sup> 
+ [Hotel samples index](search-get-started-portal.md) <sup>2</sup>

<sup>1</sup> The search service can be any tier, but it must have public network access for this tutorial. 

<sup>2</sup> To complete this tutorial, you need to create the hotels-sample-index on your search service. Make sure the search index name is`hotels-sample-index`, or change the index name in the `HomeController.cs` file.

## Create the project

1. Start Visual Studio and select **Create a new project**.

1. Select **ASP.NET Core Web App (Model-View-Controller)**, and then select **Next**.

1. Provide a project name, and then select **Next**.

1. On the next page, select **.NET 6.0** or **.NET 7.0**.

1. Verify that **Do not use top-level statements** is unchecked.

1. Select **Create**.

### Add NuGet packages

1. On Tools, select **NuGet Package Manager** > **Manage NuGet Packages for the solution**.

1. Browse for `Azure.Search.Documents` and install the latest stable version.

1. Browse for and install the `Microsoft.Spatial` package. The sample index includes a GeographyPoint data type. Installing this package avoids run time errors. Alternatively, remove the "Location" field from the Hotels class if you don't want to install the package. It's not used in this tutorial.

### Add service information

For the connection, the app presents a query API key to your fully qualified search URL. Both are specified in the `appsettings.json` file.

Modify `appsettings.json` to specify your search service and [query API key](search-security-api-keys.md).

```json
{
    "SearchServiceUri": "<YOUR-SEARCH-SERVICE-URL>",
    "SearchServiceQueryApiKey": "<YOUR-SEARCH-SERVICE-QUERY-API-KEY>"
}
```

You can get the service URL and API key from the portal. Because this code is querying an index and not creating one, you can use a query key instead of an admin key.

Make sure to specify the search service that has the hotels-sample-index.

## Add models

In this step, create models that represent the schema of the hotels-sample-index.

1. In Solution explorer, right-select **Models** and add a new class named "Hotel" for the following code:

   ```csharp
    using Azure.Search.Documents.Indexes.Models;
    using Azure.Search.Documents.Indexes;
    using Microsoft.Spatial;
    using System.Text.Json.Serialization;
    
    namespace HotelDemoApp.Models
    {
        public partial class Hotel
        {
            [SimpleField(IsFilterable = true, IsKey = true)]
            public string HotelId { get; set; }
    
            [SearchableField(IsSortable = true)]
            public string HotelName { get; set; }
    
            [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
            public string Description { get; set; }
    
            [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.FrLucene)]
            [JsonPropertyName("Description_fr")]
            public string DescriptionFr { get; set; }
    
            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string Category { get; set; }
    
            [SearchableField(IsFilterable = true, IsFacetable = true)]
            public string[] Tags { get; set; }
    
            [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public bool? ParkingIncluded { get; set; }
    
            [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public DateTimeOffset? LastRenovationDate { get; set; }
    
            [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public double? Rating { get; set; }
    
            public Address Address { get; set; }
    
            [SimpleField(IsFilterable = true, IsSortable = true)]
            public GeographyPoint Location { get; set; }
    
            public Rooms[] Rooms { get; set; }
        }
    }
   ```

1. Add a class named "Address" and replace it with the following code:

   ```csharp
    using Azure.Search.Documents.Indexes;

    namespace HotelDemoApp.Models
    {
        public partial class Address
        {
            [SearchableField]
            public string StreetAddress { get; set; }
    
            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string City { get; set; }
    
            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string StateProvince { get; set; }
    
            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string PostalCode { get; set; }
    
            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string Country { get; set; }
        }
    }
   ```

1. Add a class named "Rooms" and replace it with the following code:

   ```csharp
    using Azure.Search.Documents.Indexes.Models;
    using Azure.Search.Documents.Indexes;
    using System.Text.Json.Serialization;
    
    namespace HotelDemoApp.Models
    {
        public partial class Rooms
        {
            [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnMicrosoft)]
            public string Description { get; set; }
    
            [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.FrMicrosoft)]
            [JsonPropertyName("Description_fr")]
            public string DescriptionFr { get; set; }
    
            [SearchableField(IsFilterable = true, IsFacetable = true)]
            public string Type { get; set; }
    
            [SimpleField(IsFilterable = true, IsFacetable = true)]
            public double? BaseRate { get; set; }
    
            [SearchableField(IsFilterable = true, IsFacetable = true)]
            public string BedOptions { get; set; }
    
            [SimpleField(IsFilterable = true, IsFacetable = true)]
            public int SleepsCount { get; set; }
    
            [SimpleField(IsFilterable = true, IsFacetable = true)]
            public bool? SmokingAllowed { get; set; }
    
            [SearchableField(IsFilterable = true, IsFacetable = true)]
            public string[] Tags { get; set; }
        }
    }
   ```

1. Add a class named "SearchData" and replace it with the following code:

   ```csharp
    using Azure.Search.Documents.Models;

    namespace HotelDemoApp.Models
    {
        public class SearchData
        {
            // The text to search for.
            public string searchText { get; set; }
    
            // The list of results.
            public SearchResults<Hotel> resultList;
        }
    }
   ```

## Modify the controller

For this tutorial, modify the default `HomeController` to contain methods that execute on your search service.

1. In Solution explorer under **Models**, open `HomeController`.

1. Replace the default with the following content:

   ```csharp
   using Azure;
    using Azure.Search.Documents;
    using Azure.Search.Documents.Indexes;
    using HotelDemoApp.Models;
    using Microsoft.AspNetCore.Mvc;
    using System.Diagnostics;
    
    namespace HotelDemoApp.Controllers
    {
        public class HomeController : Controller
        {
            public IActionResult Index()
            {
                return View();
            }
    
            [HttpPost]
            public async Task<ActionResult> Index(SearchData model)
            {
                try
                {
                    // Check for a search string
                    if (model.searchText == null)
                    {
                        model.searchText = "";
                    }
    
                    // Send the query to Search.
                    await RunQueryAsync(model);
                }
    
                catch
                {
                    return View("Error", new ErrorViewModel { RequestId = "1" });
                }
                return View(model);
            }
    
            [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
            public IActionResult Error()
            {
                return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
            }
    
            private static SearchClient _searchClient;
            private static SearchIndexClient _indexClient;
            private static IConfigurationBuilder _builder;
            private static IConfigurationRoot _configuration;
    
            private void InitSearch()
            {
                // Create a configuration using appsettings.json
                _builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
                _configuration = _builder.Build();
    
                // Read the values from appsettings.json
                string searchServiceUri = _configuration["SearchServiceUri"];
                string queryApiKey = _configuration["SearchServiceQueryApiKey"];
    
                // Create a service and index client.
                _indexClient = new SearchIndexClient(new Uri(searchServiceUri), new AzureKeyCredential(queryApiKey));
                _searchClient = _indexClient.GetSearchClient("hotels-sample-index");
            }
    
            private async Task<ActionResult> RunQueryAsync(SearchData model)
            {
                InitSearch();
    
                var options = new SearchOptions()
                {
                    IncludeTotalCount = true
                };
    
                // Enter Hotel property names to specify which fields are returned.
                // If Select is empty, all "retrievable" fields are returned.
                options.Select.Add("HotelName");
                options.Select.Add("Category");
                options.Select.Add("Rating");
                options.Select.Add("Tags");
                options.Select.Add("Address/City");
                options.Select.Add("Address/StateProvince");
                options.Select.Add("Description");
    
                // For efficiency, the search call should be asynchronous, so use SearchAsync rather than Search.
                model.resultList = await _searchClient.SearchAsync<Hotel>(model.searchText, options).ConfigureAwait(false);
    
                // Display the results.
                return View("Index", model);
            }
            public IActionResult Privacy()
            {
                return View();
            }
        }
    }
   ```

## Modify the view

1. In Solution explorer under **Views** > **Home**, open `index.cshtml`.

1. Replace the default with the following content:

    ```razor
    @model HotelDemoApp.Models.SearchData;
    
    @{
        ViewData["Title"] = "Index";
    }
    
    <div>
        <img src="~/images/azure-logo.png" width="80" />
        <h2>Search for Hotels</h2>
    
        <p>Use this demo app to test server-side sorting and filtering. Modify the RunQueryAsync method to change the operation. The app uses the default search configuration (simple search syntax, with searchMode=Any).</p>
    
        <form asp-controller="Home" asp-action="Index">
            <p>
                <input type="text" name="searchText" />
                <input type="submit" value="Search" />
            </p>
        </form>
    </div>
    
    <div>
        @using (Html.BeginForm("Index", "Home", FormMethod.Post))
        {
            @if (Model != null)
            {
                // Show the result count.
                <p>@Model.resultList.TotalCount Results</p>
    
                // Get search results.
                var results = Model.resultList.GetResults().ToList();
    
                {
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Rating</th>
                                <th>Tags</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach (var d in results)
                            {
                                <tr>
                                    <td>@d.Document.HotelName</td>
                                    <td>@d.Document.Category</td>
                                    <td>@d.Document.Rating</td>
                                    <td>@d.Document.Tags[0]</td>
                                    <td>@d.Document.Address.City</td>
                                    <td>@d.Document.Address.StateProvince</td>
                                    <td>@d.Document.Description</td>
                                </tr>
                            }
                        </tbody>
                      </table>
                }
            }
        }
    </div>
    ```

## Run the sample

1. Press **F5** to compile and run the project. The app runs on local host and opens in your default browser.

1. Select **Search** to return all results.

1. This code uses the default search configuration, supporting the [simple syntax](query-simple-syntax.md) and `searchMode=Any`. You can enter keywords, augment with Boolean operators, or run a prefix search (`pool*`).

In the next several sections, modify the **RunQueryAsync** method in the `HomeController` to add filters and sorting.

## Filter results

Index field attributes determine which fields are searchable, filterable, sortable, facetable, and retrievable. In the hotels-sample-index, filterable fields include "Category", "Address/City", and "Address/StateProvince". This example adds a [$Filter](search-query-odata-filter.md) expression on "Category".

A filter always executes first, followed by a query assuming one is specified.

1. Open the `HomeController` and find the **RunQueryAsync** method. Add [Filter](/dotnet/api/azure.search.documents.searchoptions.filter) to `var options = new SearchOptions()`:

   ```csharp
    private async Task<ActionResult> RunQueryAsync(SearchData model)
    {
        InitSearch();

        var options = new SearchOptions()
        {
            IncludeTotalCount = true,
            Filter = "search.in(Category,'Budget,Suite')"
        };

        options.Select.Add("HotelName");
        options.Select.Add("Category");
        options.Select.Add("Rating");
        options.Select.Add("Tags");
        options.Select.Add("Address/City");
        options.Select.Add("Address/StateProvince");
        options.Select.Add("Description");

        model.resultList = await _searchClient.SearchAsync<Hotel>(model.searchText, options).ConfigureAwait(false);

        return View("Index", model);
    }
   ```

1. Run the application.

1. Select **Search** to run an empty query. The filter criteria returns 18 documents instead of the original 50.

For more information about filter expressions, see [Filters in Azure AI Search](search-filters.md) and [OData $filter syntax in Azure AI Search](search-query-odata-filter.md).

## Sort results

In the hotels-sample-index, sortable fields include "Rating" and "LastRenovated". This example adds an [$OrderBy](/dotnet/api/azure.search.documents.searchoptions.orderby) expression to the "Rating" field.

1. Open the `HomeController` and replace **RunQueryAsync** method with the following version:

   ```csharp
    private async Task<ActionResult> RunQueryAsync(SearchData model)
    {
        InitSearch();
    
        var options = new SearchOptions()
        {
            IncludeTotalCount = true,
        };
    
        options.OrderBy.Add("Rating desc");
    
        options.Select.Add("HotelName");
        options.Select.Add("Category");
        options.Select.Add("Rating");
        options.Select.Add("Tags");
        options.Select.Add("Address/City");
        options.Select.Add("Address/StateProvince");
        options.Select.Add("Description");

        model.resultList = await _searchClient.SearchAsync<Hotel>(model.searchText, options).ConfigureAwait(false);
    
        return View("Index", model);
    }
   ```

1. Run the application. Results are sorted by "Rating" in descending order.

For more information about sorting, see [OData $orderby syntax in Azure AI Search](search-query-odata-orderby.md).

<!-- ## Relevance tuning

Relevance tuning is a server-side operation. To boost the relevance of a document based on a match found in a specific field, such as "Tags" or location, [add a scoring profile](index-add-scoring-profiles.md) to the index, and then rerun your queries.

Use the Azure portal to add a scoring profile to the existing hotels-sample-index. -->

## Next steps

In this tutorial, you created an ASP.NET Core (MVC) project that connected to a search service and called Search APIs for server-side filtering and sorting.

If you want to explore client-side code that responds to user actions, consider adding a React template to your solution:

> [!div class="nextstepaction"]
> [C# Tutorial: Add search to a website with .NET](tutorial-csharp-overview.md)
