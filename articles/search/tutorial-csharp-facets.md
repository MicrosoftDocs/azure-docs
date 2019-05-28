---
title: Tutorial on using facets to improve the efficiency of an Azure Search
description: This tutorial builds on the paging Azure Search tutorial, to add a search of the facets of a given database. Searching on facets is done just once when the app is initiated, so can improve the efficiency of a search app by avoided repeated search calls.
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Use facets to improve the efficiency of an Azure Search

Learn how to implement an efficient search for facets, greatly reducing the number of calls to a server for type-ahead or other suggestions. Learn that a facet search is carried out just once when a user first runs the app and that the results stay active for the duration of their session. A facet can be considered to be an attribute of the data (such as a pool in our hotels data) and a facet search collects all these attributes up when the app is initiated and presents them to the user whenever their typing matches throughout their session with the app.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Specify certain fields of a data set as IsFacetable
> * Make the single call for an Azure Search of facets
> * Determine the conditions when a facet search makes most sense

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Page the results of an Azure Search](tutorial-csharp-paging.md) project up and running.

## Install and run the project from GitHub


## Add code for a search of facets

We will use the numbered paging app you might have completed in the second tutorial as a basis for this sample.

To implement facets we do not need to change any of the models (data classes). We just need to add some script to the view and an action to the controller.

### Start with the numbered paging Azure Search app

1. If you created it yourself and have the project handy, start from there. Alternatively download the numbered paging app from here.
xxxx

2. Run the project to make sure it works!

### Examine the model fields marked as IsFacetable

In order for a field to be located in a facet search it must be tagged with **IsFacetable**.

1. Examine the **Hotel** class. Note that **Category** and **Tags**, for example, are tagged as **IsFacetable**, but **HotelName** and **Description** are not. A facet search will throw an error if a field is included in the search that is not tagged.

```cs
public partial class Hotel
    {
        [System.ComponentModel.DataAnnotations.Key]
        [IsFilterable]
        public string HotelId { get; set; }

        [IsSearchable, IsSortable]
        public string HotelName { get; set; }

        [IsSearchable]
        [Analyzer(AnalyzerName.AsString.EnLucene)]
        public string Description { get; set; }

        [IsSearchable]
        [Analyzer(AnalyzerName.AsString.FrLucene)]
        [JsonProperty("Description_fr")]
        public string DescriptionFr { get; set; }

        [IsSearchable, IsFilterable, IsSortable, IsFacetable]
        public string Category { get; set; }

        [IsSearchable, IsFilterable, IsFacetable]
        public string[] Tags { get; set; }

        [IsFilterable, IsSortable, IsFacetable]
        public bool? ParkingIncluded { get; set; }

        [IsFilterable, IsSortable, IsFacetable]
        public DateTimeOffset? LastRenovationDate { get; set; }

        [IsFilterable, IsSortable, IsFacetable]
        public double? Rating { get; set; }

        public Address Address { get; set; }

        [IsFilterable, IsSortable]
        public GeographyPoint Location { get; set; }

        public Room[] Rooms { get; set; }

        // Added for geospatial searches.
        public double distanceInKilometers { get; set; }
    }
```

### Add an autocomplete script to the view

In order to initiate a facet search we need to add some javascript to the index.cshtml file.

1. Locate the **@Html.TextBoxFor(m => m.searchText, ...)** statement and make sure it has a unique **id**, similar to the following.

```cs
    <div class="searchBoxForm">
        @Html.TextBoxFor(m => m.searchText, new { @class = "searchBox", @id = "azuresearchfacets" }) <input value="" class="searchBoxSubmit" type="submit">
    </div>
```

2. Now add the javascript (just below the code above works fine) for an autocomplete function based on the above id.

```cs
    <script>
        $.getJSON("/home/facets", function (data) {

            $("#azuresearchfacets").autocomplete({
                source: data,
                minLength: 2,
                position: {
                    my: "left top",
                    at: "left-23 bottom+10"
                }
            });
        });
    </script>
```

Notice that the script calls **Facets** action in the home controller when a minimum length of two typed characters is reached.

### Add references to jquery scripts to the view

The autocomplete function called in the script above is not something we have to write ourselves as it is available in the jquery library. 

1. To access the jquery library add the following lines to the top of the &lt;head&gt; section of the view file, so the beginning of this section looks similar to this.

```cs
<head>
    <meta charset="utf-8">
    <title>Azure search facets demo</title>
    <link href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css"
          rel="stylesheet">
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
    <script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
```

Now we can use the predefined jquery functions.

### Add a facet action to the controller

1. The javascript in the view will trigger an action in the controller that in this case has no other parameters, so we code the action as follows.

```cs
        public async Task<ActionResult> Facets()
        {
            // Use static variables to set up the configuration and Azure service and index clients, for efficiency.
            _builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
            _configuration = _builder.Build();

            _serviceClient = CreateSearchServiceClient(_configuration);
            _indexClient = _serviceClient.Indexes.GetClient("hotels");

            // Set up the facets call in the search parameters.
            SearchParameters sp = new SearchParameters()
            {
                // Search all Tags, but limit the total number to 100, and add up to 20 categories.
                // Field names specified here must be marked as "IsFacetable" in the model, or the search call will throw an exception.
                Facets = new List<string> { "Tags,count:100", "Category,count:20" },
                Top = 0
            };

            DocumentSearchResult<Hotel> searchResult = await _indexClient.Documents.SearchAsync<Hotel>("*", sp);

            // Convert the results to two lists that can be displayed in the client.
            List<string> facets = searchResult.Facets["Tags"].Select(x => x.Value.ToString()).ToList();
            List<string> categories = searchResult.Facets["Category"].Select(x => x.Value.ToString()).ToList();

            // Combine and return the lists.
            facets.AddRange(categories);
            return new JsonResult((object)facets);
        }
```

Note how we need two lists because we asked for two fields to be searched (**Tags** and **Category**). If we had asked for three fields to be searched, we would have to combine three lists into one, and so on.

### Compile and run your project

Now test the program.

1. Try typing "fr" into the search box. This should show several results.

Image

2. Now add an "o" to make "fro" and notice the range of options is reduced to one.

3. Type other combinations of two letters and see what appears. Notice though each time you do this the server is *not* being called. The facets are cached locally when the app was started and now a call is only made to the server when the user requests a search.

## Takeaways

Another tutorial completed, great work again.

You should consider the following takeaways from this project:

* Facets are an efficient way of getting a helpful user experience without the repeated search calls.
* Facets work well if a manageable (to the user) number of results are displayed when they are typing.
* Facets do not work as well if too many results need to be displayed (or end up being hidden).
* It is imperative to mark each field as **IsFacetable** if they are to be included in a facet search.
* Facets are an alternative to autocomplete/suggestions, not an addition.

## Next steps

So far we have limited ourselves to text based searches. In the next tutorial we look at providing additional numerical data in the form of latitude, longitude and radius. And we look at ordering results (up to this point, results are ordered simply in the order that they are located in the database).

> [!div class="nextstepaction"]
> [C# Tutorial: Add geospatial filters to an Azure Search](tutorial-csharp-geospatial-searches.md)